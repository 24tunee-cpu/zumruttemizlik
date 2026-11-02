/**
 * Yayın sonrası URL keşif bildirimi — IndexNow (Bing/Yandex) + WebSub (RSS/Atom hub).
 * Google Indexing API temizlik siteleri için geçerli değil; kullanılmaz.
 */
import { getSiteUrl } from '@/lib/seo';
import { submitIndexNowUrls, type IndexNowResult } from '@/lib/indexnow';
import { pingWebSub, type WebSubResult } from '@/lib/websub';
import { safeRevalidatePath } from '@/lib/safe-revalidate';

export type DiscoveryNotifyResult = {
  indexNow: IndexNowResult;
  webSub: WebSubResult | null;
  revalidated: string[];
};

function toAbsolute(pathsOrUrls: string[]): string[] {
  const base = getSiteUrl().replace(/\/$/, '');
  return pathsOrUrls
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => (/^https?:\/\//i.test(p) ? p : `${base}${p.startsWith('/') ? p : `/${p}`}`));
}

const FEED_AND_SITEMAP_PATHS = [
  '/feed.xml',
  '/atom.xml',
  '/feed.json',
  '/blog',
  '/blog/sitemap.xml',
  '/sitemap.xml',
  '/geo-sss/sitemap.xml',
  '/galeri/sitemap.xml',
] as const;

/**
 * Yeni/güncellenen URL’leri arama motoru keşif kanallarına bildirir.
 * @param paths — site-relative veya absolute URL listesi
 * @param pingFeeds — true ise RSS/Atom WebSub publish + feed/sitemap revalidate
 */
export async function notifyContentDiscovery(options: {
  paths?: string[];
  pingFeeds?: boolean;
  extraRevalidate?: string[];
}): Promise<DiscoveryNotifyResult> {
  const paths = options.paths ?? [];
  const absolute = toAbsolute(paths);

  const indexNow =
    absolute.length > 0
      ? await submitIndexNowUrls(absolute)
      : { ok: true, submitted: 0, skipped: true, reason: 'no-urls' as const };

  let webSub: WebSubResult | null = null;
  const revalidated: string[] = [];

  if (options.pingFeeds) {
    webSub = await pingWebSub();
    for (const p of FEED_AND_SITEMAP_PATHS) {
      safeRevalidatePath(p);
      revalidated.push(p);
    }
  }

  for (const p of options.extraRevalidate ?? []) {
    safeRevalidatePath(p);
    revalidated.push(p);
  }

  for (const p of paths) {
    if (p.startsWith('/')) {
      safeRevalidatePath(p);
      revalidated.push(p);
    }
  }

  return { indexNow, webSub, revalidated: [...new Set(revalidated)] };
}
