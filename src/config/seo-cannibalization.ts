/**
 * Cannibalization önleme — aynı intent'i hedefleyen blog URL'leri tek kanoniğe yönlendirilir.
 */
import { canonicalUrl } from '@/lib/seo';

/** Yinelenen blog slug → birincil kanonik path (site kökü olmadan /blog/...) */
export const BLOG_CANNIBAL_CANONICAL: Record<string, string> = {
  'istanbul-ev-temizlik-fiyatlari-2026-bolge-karsilastirma':
    '/blog/ev-temizligi-fiyatlari-2026-istanbul',
  'istanbul-ev-temizlik-fiyatlari-2026-bolge-bolge-karsilastirma':
    '/blog/ev-temizligi-fiyatlari-2026-istanbul',
  /** İlçe landing birincil — blog ile çakışmayı önler (GSC duplicate canonical) */
  'zeytinburnu-ev-temizligi-sanayi-lojistik-konut': '/bolgeler/zeytinburnu',
};

/** İlçe fiyat blogu → ilgili landing (hizmet sayfası birincil dönüşüm hedefi) */
const DISTRICT_PRICE_TO_LANDING: Array<{
  slugPattern: RegExp;
  landingPath: (district: string, service: string) => string;
}> = [
  {
    slugPattern: /^([a-z0-9-]+)-ev-temizligi-fiyatlari-2026$/,
    landingPath: (d) => `/bolgeler/${d}/ev-temizligi`,
  },
  {
    slugPattern: /^([a-z0-9-]+)-ofis-temizligi-fiyatlari-2026$/,
    landingPath: (d) => `/bolgeler/${d}/ofis-temizligi`,
  },
];

export function resolveBlogCanonicalPath(slug: string): string {
  const explicit = BLOG_CANNIBAL_CANONICAL[slug];
  if (explicit) return explicit;

  for (const rule of DISTRICT_PRICE_TO_LANDING) {
    const m = slug.match(rule.slugPattern);
    if (m?.[1]) {
      // Fiyat blogları bilgi amaçlı kalır; landing ile çakışmayı azaltmak için self-canonical.
      // Yinelenen generic yazılar yukarıdaki explicit map ile birleştirilir.
      return `/blog/${slug}`;
    }
  }

  return `/blog/${slug}`;
}

export function resolveBlogCanonicalUrl(slug: string): string {
  return canonicalUrl(resolveBlogCanonicalPath(slug));
}

export function isCannibalDuplicate(slug: string): boolean {
  return slug in BLOG_CANNIBAL_CANONICAL;
}
