/**
 * Blog yazıları için meta başlık ve açıklama (SEO).
 * Özel meta yoksa başlık + marka ve özetten güvenli uzunlukta türetilir.
 */

import { clampMetaDescription, clampMetaTitle, stripMetaEmoji } from './meta-clamp';
import { BLOG_CTR_META } from './gsc-ctr-overrides';

const TITLE_MAX = 58;
const DESC_MAX = 155;
const TITLE_SUFFIX = ' | Zümrüt Vadi Temizlik Blog';

function truncateChars(s: string, max: number): string {
  const t = stripMetaEmoji(s);
  if (t.length <= max) return t;
  return `${t.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function normalizeTitleBrand(input: string): string {
  return stripMetaEmoji(input)
    .replace(/(\s*\|\s*G[uü]nen Temizlik(?: Blog)?\s*)+$/iu, '')
    .replace(/(\s*\|\s*Zümrüt Vadi Temizlik(?: Blog)?\s*)+$/iu, '')
    .trim();
}

/**
 * Sayfa <title> ve OpenGraph title için.
 * `storedMeta` doluysa öncelikli; yoksa yazı başlığı + marka (uzunluk sınırlı).
 * GSC CTR slug override varsa en yüksek öncelik.
 */
export function resolveBlogMetaTitle(
  title: string,
  storedMeta: string | null | undefined,
  slug?: string | null
): string {
  const ctr = slug ? BLOG_CTR_META[slug] : undefined;
  if (ctr?.title) return clampMetaTitle(normalizeTitleBrand(ctr.title), 60);

  const custom = storedMeta?.trim();
  if (custom) return clampMetaTitle(normalizeTitleBrand(custom), 60);

  const base = normalizeTitleBrand(title.trim());
  const suffix = TITLE_SUFFIX;
  if (base.length + suffix.length <= TITLE_MAX) return base + suffix;

  const maxBase = TITLE_MAX - suffix.length - 1;
  const shortened = base.slice(0, Math.max(8, maxBase)).trimEnd();
  return clampMetaTitle(`${shortened}…${suffix}`, 60);
}

/**
 * Meta description ve OG/Twitter açıklaması.
 * `storedMeta` doluysa öncelikli; yoksa özet (tek satır, uzunluk sınırlı).
 */
export function resolveBlogMetaDesc(
  excerpt: string,
  storedMeta: string | null | undefined,
  slug?: string | null
): string {
  const ctr = slug ? BLOG_CTR_META[slug] : undefined;
  if (ctr?.description) return clampMetaDescription(ctr.description, 160);

  const custom = storedMeta?.trim();
  if (custom) return clampMetaDescription(custom, 160);

  const plain = excerpt.replace(/\s+/g, ' ').trim();
  return clampMetaDescription(plain, DESC_MAX);
}

/**
 * Eski CTR yolları — emoji/random başlık yok; GSC slug override + kanonik blog meta.
 */
export function resolveCTROptimizedBlogTitle(
  title: string,
  storedMeta: string | null | undefined,
  _category: string,
  _content: string,
  slug?: string | null
): string {
  return resolveBlogMetaTitle(title, storedMeta, slug);
}

export function resolveCTROptimizedBlogDesc(
  excerpt: string,
  storedMeta: string | null | undefined,
  _title: string,
  _category: string,
  slug?: string | null
): string {
  return resolveBlogMetaDesc(excerpt, storedMeta, slug);
}
