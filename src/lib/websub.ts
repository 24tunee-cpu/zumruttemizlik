/**
 * WebSub (PubSubHubbub) — RSS/Atom değişince hub’a publish ping.
 * Google Search Central: Atom/RSS + WebSub recent URL keşfini hızlandırır.
 * @see https://pubsubhubbub.appspot.com/
 */
import { getSiteUrl } from '@/lib/seo';

/** Google’ın genel WebSub hub’ı (HTTPS) */
export const WEBSUB_HUB_URL = 'https://pubsubhubbub.appspot.com/';

export type WebSubResult = {
  ok: boolean;
  submitted: number;
  skipped?: boolean;
  reason?: string;
  status?: number;
};

export function getFeedUrlsForWebSub(): string[] {
  const base = getSiteUrl().replace(/\/$/, '');
  return [`${base}/feed.xml`, `${base}/atom.xml`];
}

/**
 * Hub’a hub.mode=publish bildirimi.
 * Birden fazla hub.url aynı POST’ta tekrarlanabilir.
 */
export async function pingWebSub(feedUrls?: string[]): Promise<WebSubResult> {
  const urls = [...new Set((feedUrls ?? getFeedUrlsForWebSub()).map((u) => u.trim()).filter(Boolean))];
  if (urls.length === 0) {
    return { ok: true, submitted: 0, skipped: true, reason: 'no-feed-urls' };
  }

  const body = new URLSearchParams();
  body.set('hub.mode', 'publish');
  for (const url of urls) {
    body.append('hub.url', url);
  }

  try {
    const res = await fetch(WEBSUB_HUB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
      body: body.toString(),
      signal: AbortSignal.timeout(15_000),
    });

    // Hub genelde 204 No Content veya 200 döner
    if (res.status >= 200 && res.status < 300) {
      return { ok: true, submitted: urls.length, status: res.status };
    }

    return {
      ok: false,
      submitted: 0,
      status: res.status,
      reason: `WebSub HTTP ${res.status}`,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'WebSub ping failed';
    return { ok: false, submitted: 0, reason: message };
  }
}

/** HTTP Link header — feed discovery (hub + self) */
export function buildWebSubLinkHeader(selfUrl: string): string {
  return `<${WEBSUB_HUB_URL}>; rel="hub", <${selfUrl}>; rel="self"`;
}
