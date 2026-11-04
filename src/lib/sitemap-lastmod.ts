/**
 * Dürüst sitemap lastmod — Google her build’de “şimdi” yazılan tarihleri yok sayar.
 * Bilinmeyen tarih: alanı omit et (uydurma yok).
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
 * @see https://vercel.com/kb/guide/correct-lastmod-nextjs-sitemap
 */

/**
 * Statik / programatik silolar için içerik revizyon tarihleri.
 * Anlamlı içerik değişince (metin, URL seti, semt landing) ilgili anahtarı bump edin.
 * Deploy veya sitemap üretimi tek başına bump sebebi değildir.
 */
export const SITEMAP_CONTENT_REVISIONS = {
  /** Çekirdek statik sayfalar (/, /iletisim, /hakkimizda, …) */
  core: '2026-11-04T17:00:00.000Z',
  /** Hizmet seed/DB yokken fallback */
  servicesFallback: '2026-10-30T12:00:00.000Z',
  /** İlçe / semt programatik matris (A5 semt×hizmet dahil) */
  bolgeler: '2026-11-03T20:15:00.000Z',
  /** Çözüm / niyet silosu */
  cozumler: '2026-10-30T12:00:00.000Z',
  /** Blog silo hub sayfaları */
  blogSilo: '2026-10-30T12:00:00.000Z',
  /** Statik GEO SSS sayfaları */
  geoSssStatic: '2026-10-30T12:00:00.000Z',
  /** Galeri hub (DB tarihi yoksa) */
  galeriHub: '2026-10-30T12:00:00.000Z',
} as const;

export type SitemapRevisionKey = keyof typeof SITEMAP_CONTENT_REVISIONS;

export function revisionDate(key: SitemapRevisionKey): Date {
  return new Date(SITEMAP_CONTENT_REVISIONS[key]);
}

export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

export function coerceSitemapDate(
  value: Date | string | null | undefined
): Date | undefined {
  if (value == null) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  return isValidDate(d) ? d : undefined;
}

/** En yeni geçerli tarihi seçer */
export function maxSitemapDate(
  ...values: Array<Date | string | null | undefined>
): Date | undefined {
  let best: Date | undefined;
  for (const v of values) {
    const d = coerceSitemapDate(v);
    if (!d) continue;
    if (!best || d.getTime() > best.getTime()) best = d;
  }
  return best;
}

type WithOptionalLastmod = {
  lastModified?: string | Date;
};

/**
 * lastModified yalnızca güvenilir içerik tarihi varsa eklenir.
 * `new Date()` / build zamanı ASLA verilmemeli.
 */
export function withHonestLastmod<T extends Record<string, unknown>>(
  entry: T,
  lastModified: Date | string | null | undefined
): T & WithOptionalLastmod {
  const d = coerceSitemapDate(lastModified);
  if (!d) return entry;
  return { ...entry, lastModified: d };
}

/** Absolute image URL — relative path’leri site köküne bağlar */
export function toAbsoluteAssetUrl(
  base: string,
  pathOrUrl: string | null | undefined
): string | undefined {
  if (!pathOrUrl?.trim()) return undefined;
  const t = pathOrUrl.trim();
  if (/^https?:\/\//i.test(t)) return t;
  const root = base.replace(/\/$/, '');
  return `${root}${t.startsWith('/') ? t : `/${t}`}`;
}
