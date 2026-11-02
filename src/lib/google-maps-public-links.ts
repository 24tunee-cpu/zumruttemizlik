/**
 * Harita / yorum sayfası — Google Maps URL'leri.
 * Öncelik: admin MapPlatformListing → env Place ID / URL → SITE_CONTACT GBP → adres araması.
 */
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { SITE_CONTACT } from '@/config/site-contact';
import {
  getPublicPlaceId,
  reviewUrlFromPlaceId,
  withGmbUtm,
} from '@/lib/gbp-links';

export type GoogleMapsPublicLinks = {
  mapsOpenUrl: string;
  reviewUrl: string;
  mapsEmbedUrl: string;
  placeId: string | null;
  source: 'db' | 'env' | 'fallback';
};

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

function firstValidUrl(...candidates: (string | null | undefined)[]): string | null {
  for (const c of candidates) {
    const t = c?.trim();
    if (t && isHttpUrl(t)) return t;
  }
  return null;
}

function buildFallbackMapsSearchUrl(): string {
  const query = `${SITE_CONTACT.companyName}, ${SITE_CONTACT.addressLine}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function buildFallbackEmbedUrl(): string {
  const query = `${SITE_CONTACT.companyName}, ${SITE_CONTACT.addressLine}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

export const getGoogleMapsPublicLinks = cache(async (): Promise<GoogleMapsPublicLinks> => {
  let listing: {
    listingUrl: string | null;
    mapsEmbedUrl: string | null;
    externalPlaceId: string | null;
  } | null = null;

  try {
    listing = await prisma.mapPlatformListing.findUnique({
      where: { platform: 'google' },
      select: { listingUrl: true, mapsEmbedUrl: true, externalPlaceId: true },
    });
  } catch {
    listing = null;
  }

  const envMaps = process.env.NEXT_PUBLIC_GBP_URL?.trim();
  const envReview = process.env.NEXT_PUBLIC_GBP_REVIEW_URL?.trim();
  const envEmbed = process.env.NEXT_PUBLIC_GBP_MAPS_EMBED_URL?.trim();
  const envPlaceId = getPublicPlaceId();
  const dbPlaceId = listing?.externalPlaceId?.trim() || null;
  const placeId = dbPlaceId || envPlaceId;

  const mapsOpenUrl =
    firstValidUrl(listing?.listingUrl, envMaps, SITE_CONTACT.gbpMapsUrl) ??
    buildFallbackMapsSearchUrl();

  const reviewUrl =
    firstValidUrl(envReview) ??
    (placeId ? reviewUrlFromPlaceId(placeId) : null) ??
    mapsOpenUrl;

  const mapsEmbedUrl =
    firstValidUrl(listing?.mapsEmbedUrl, envEmbed) ?? buildFallbackEmbedUrl();

  const source: GoogleMapsPublicLinks['source'] = listing?.listingUrl
    ? 'db'
    : envMaps
      ? 'env'
      : 'fallback';

  return { mapsOpenUrl, reviewUrl, mapsEmbedUrl, placeId, source };
});

export { withGmbUtm, reviewUrlFromPlaceId };
