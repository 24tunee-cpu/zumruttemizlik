import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { getSiteUrl } from '@/lib/seo';
import type { GoogleMapsPublicLinks } from '@/lib/google-maps-public-links';

export type GoogleMapReviewRow = {
  starRating: number | null;
  reviewerDisplayName: string | null;
  comment: string | null;
  reviewTime: string | null;
};

export const fetchGoogleMapReviewsForSeo = cache(async (): Promise<GoogleMapReviewRow[]> => {
  try {
    return await prisma.mapReviewSnapshot.findMany({
      where: {
        provider: 'google',
        starRating: { not: null },
      },
      select: {
        starRating: true,
        reviewerDisplayName: true,
        comment: true,
        reviewTime: true,
      },
      orderBy: { fetchedAt: 'desc' },
      take: 24,
    });
  } catch {
    return [];
  }
});

export function computeGoogleReviewAggregate(rows: { starRating: number | null }[]) {
  const valid = rows.filter(
    (r) => r.starRating != null && r.starRating >= 1 && r.starRating <= 5
  );
  if (valid.length === 0) return null;

  const sum = valid.reduce((acc, r) => acc + (r.starRating as number), 0);
  const ratingValue = Math.round((sum / valid.length) * 10) / 10;
  return { ratingValue, reviewCount: valid.length };
}

/**
 * Harita sayfası LocalBusiness JSON-LD.
 * Self-serving AggregateRating/Review EKLENMEZ — Google review snippet
 * LocalBusiness/Organization için kendi sitesindeki puanları rich result saymaz
 * ve GSC’de “geçersiz yorum snippet” üretir (AGENTS + Google review-snippet guidelines).
 * Görünür puan HTML/trust-signals’ta kalır.
 */
export function buildGoogleMapsReviewSchemaGraph(
  _rows: GoogleMapReviewRow[],
  mapsLinks: Pick<GoogleMapsPublicLinks, 'mapsOpenUrl' | 'reviewUrl'>
) {
  const base = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${base}/harita-ve-yorumlar#business`,
    name: 'Zümrüt Vadi Temizlik',
    url: `${base}/harita-ve-yorumlar`,
    image: [`${base}/logo.png`, `${base}/og-image.jpg`],
    hasMap: mapsLinks.mapsOpenUrl,
    sameAs: [mapsLinks.reviewUrl],
  };
}
