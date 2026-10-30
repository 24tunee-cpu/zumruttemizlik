/**
 * Legacy CTR meta helpers — emoji/random injection kaldırıldı.
 * Yeni kod `resolveBlogMetaTitle` / `resolveBlogMetaDesc` kullanmalı.
 */

import { clampMetaDescription, clampMetaTitle, stripMetaEmoji } from './meta-clamp';

const TITLE_SUFFIX = ' | Zümrüt Vadi Temizlik';

export function createCTROptimizedTitle(
  title: string,
  _category: string,
  _content: string,
  originalTitle?: string | null
): string {
  const base = stripMetaEmoji((originalTitle || title).trim());
  if (base.includes('|')) return clampMetaTitle(base);
  return clampMetaTitle(`${base}${TITLE_SUFFIX}`);
}

export function createCTROptimizedDescription(
  excerpt: string,
  _title: string,
  _category: string,
  originalDesc?: string | null
): string {
  const source = (originalDesc || excerpt).replace(/\s+/g, ' ').trim();
  return clampMetaDescription(stripMetaEmoji(source));
}

export function generateCTROptimizedBlogMeta(
  title: string,
  excerpt: string,
  category: string,
  content: string,
  existingMetaTitle?: string | null,
  existingMetaDesc?: string | null
) {
  return {
    title: createCTROptimizedTitle(title, category, content, existingMetaTitle),
    description: createCTROptimizedDescription(excerpt, title, category, existingMetaDesc),
  };
}
