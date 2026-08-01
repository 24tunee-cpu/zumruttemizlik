import type { Metadata } from 'next';
import { canonicalUrl } from '@/lib/seo';

/** Query parametreli URL'ler (intent tracking) indekslenmez; kanonik temiz URL'dir. */
export function metadataForParamAwarePage(
  path: string,
  base: Metadata,
  searchParams: Record<string, string | string[] | undefined>
): Metadata {
  const hasParams = Object.keys(searchParams).some((key) => {
    const v = searchParams[key];
    if (v === undefined || v === '') return false;
    if (Array.isArray(v)) return v.some(Boolean);
    return true;
  });

  const canonical = canonicalUrl(path);

  if (!hasParams) {
    return {
      ...base,
      alternates: { ...base.alternates, canonical },
    };
  }

  return {
    ...base,
    alternates: { canonical },
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
  };
}
