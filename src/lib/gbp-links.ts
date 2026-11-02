/**
 * GBP / Maps / yorum URL yardımcıları — UTM + Place ID deep-link.
 * Place ID uydurulmaz; env veya MapPlatformListing’den gelir.
 */
import { SITE_CONTACT } from '@/config/site-contact';

export function reviewUrlFromPlaceId(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId.trim())}`;
}

/** Client-safe: env override → SITE_CONTACT kanonik Place ID */
export function getPublicPlaceId(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_GBP_PLACE_ID?.trim();
  if (fromEnv && fromEnv.length >= 10) return fromEnv;
  const fromContact = SITE_CONTACT.gbpPlaceId?.trim();
  return fromContact && fromContact.length >= 10 ? fromContact : null;
}

export function getPublicReviewUrl(): string | null {
  const direct = process.env.NEXT_PUBLIC_GBP_REVIEW_URL?.trim();
  if (direct && /^https?:\/\//i.test(direct)) return direct;
  const placeId = getPublicPlaceId();
  if (placeId) return reviewUrlFromPlaceId(placeId);
  return null;
}

export function getPublicMapsUrl(): string {
  const env = process.env.NEXT_PUBLIC_GBP_URL?.trim();
  if (env && /^https?:\/\//i.test(env)) return env;
  return SITE_CONTACT.gbpMapsUrl;
}

export function withGmbUtm(
  url: string,
  campaign: string,
  extra?: { content?: string; medium?: string }
): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('utm_source', 'website');
    parsed.searchParams.set('utm_medium', extra?.medium ?? 'gmb');
    parsed.searchParams.set('utm_campaign', campaign);
    if (extra?.content) parsed.searchParams.set('utm_content', extra.content);
    return parsed.toString();
  } catch {
    return url;
  }
}

/** WA şablonundaki {reviewLink} yerini doldur */
export function fillReviewTemplate(
  template: string,
  vars: { name?: string; service?: string; district?: string; reviewLink?: string }
): string {
  const reviewLink =
    vars.reviewLink?.trim() ||
    getPublicReviewUrl() ||
    withGmbUtm(getPublicMapsUrl(), 'review-ask');
  return template
    .replace(/\{name\}/g, vars.name?.trim() || 'değerli müşterimiz')
    .replace(/\{service\}/g, vars.service?.trim() || 'temizlik')
    .replace(/\{district\}/g, vars.district?.trim() || 'Sarıyer')
    .replace(/\{reviewLink\}/g, reviewLink);
}
