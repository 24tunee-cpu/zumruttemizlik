/**
 * Doğrulanmış güven sinyalleri — Hero / CRO / schema.
 * Uydurma “5000+ müşteri / 5.0” yasak; yalnızca GBP veya Maps sync.
 * Güncelleme: GBP panel veya admin Maps sync sonrası bu sayıları gözden geçir.
 */
import { SITE_CONTACT } from '@/config/site-contact';

export const VERIFIED_TRUST = {
  /** GBP / Maps aggregate — manuel doğrulama 2026-11-02 */
  googleRating: 4.9,
  googleReviewCount: 12,
  verifiedAt: '2026-11-02',
  sourceLabel: 'Google',
  mapsPath: '/harita-ve-yorumlar',
  placeId: SITE_CONTACT.gbpPlaceId,
  /** Operasyonel (GBP saatleri ile uyumlu) */
  support247: true,
  freeDiscovery: true,
} as const;

/** Hero yıldız satırı metni */
export function formatGoogleTrustLine(
  rating = VERIFIED_TRUST.googleRating,
  count = VERIFIED_TRUST.googleReviewCount
): string {
  return `Google ${rating} · ${count} yorum`;
}

/** Görünen trust istatistikleri — yalnızca doğrulanabilir */
export const HOME_HERO_STATS = [
  {
    id: 'google',
    value: String(VERIFIED_TRUST.googleRating),
    label: 'Google puan',
  },
  {
    id: 'support',
    value: '7/24',
    label: 'Destek hattı',
  },
  {
    id: 'discovery',
    value: 'Ücretsiz',
    label: 'Keşif',
  },
] as const;
