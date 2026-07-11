import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { getSiteUrl } from '@/lib/seo';

export type GoogleMapReviewRow = {
  starRating: number | null;
  reviewerDisplayName: string | null;
  comment: string | null;
  reviewTime: string | null;
};

const MAX_REVIEW_ENTITIES = 5;

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

/** Google Maps kaynaklı yorumlar — harita sayfası LocalBusiness schema için */
export function buildGoogleMapsReviewSchemaGraph(rows: GoogleMapReviewRow[]) {
  const base = getSiteUrl();
  const agg = computeGoogleReviewAggregate(rows);

  const localBusiness: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${base}/harita-ve-yorumlar#business`,
    name: 'Zümrüt Vadi Temizlik',
    url: `${base}/harita-ve-yorumlar`,
    image: [`${base}/logo.png`, `${base}/og-image.jpg`],
    hasMap: 'https://maps.app.goo.gl/Q2Sp2mRcEdFQMnog7',
    sameAs: ['https://g.page/r/CS2Mx2c1UpqwEBM/review'],
  };

  if (agg && agg.reviewCount >= 1) {
    localBusiness.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: agg.ratingValue,
      reviewCount: agg.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };

    const reviewEntities = rows
      .filter((r) => r.starRating != null && r.comment?.trim())
      .slice(0, MAX_REVIEW_ENTITIES)
      .map((r) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: r.reviewerDisplayName?.trim() || 'Google kullanıcısı',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.starRating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: r.comment!.trim().slice(0, 500),
        ...(r.reviewTime && { datePublished: r.reviewTime }),
        publisher: {
          '@type': 'Organization',
          name: 'Google',
        },
      }));

    if (reviewEntities.length > 0) {
      localBusiness.review = reviewEntities;
    }
  }

  return localBusiness;
}
