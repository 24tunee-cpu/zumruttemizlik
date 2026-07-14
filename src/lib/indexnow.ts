/**
 * IndexNow — yeni yayınlanan URL'leri Bing/Yandex vb. arama motorlarına bildirir.
 * https://www.indexnow.org/documentation
 */
import { getSiteUrl } from '@/lib/seo';

export type IndexNowResult = {
  ok: boolean;
  submitted: number;
  skipped?: boolean;
  reason?: string;
  status?: number;
};

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

function sanitizeIndexNowKey(raw: string): string {
  return raw.trim().replace(/[^a-zA-Z0-9-]/g, '');
}

export function getIndexNowKey(): string | null {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) return null;
  const safe = sanitizeIndexNowKey(key);
  return safe.length >= 8 ? safe : null;
}

export function getIndexNowKeyLocation(): string | null {
  const key = getIndexNowKey();
  if (!key) return null;
  const base = getSiteUrl().replace(/\/$/, '');
  return `${base}/${key}.txt`;
}

export function toAbsoluteBlogUrls(slugs: string[]): string[] {
  const base = getSiteUrl().replace(/\/$/, '');
  return slugs.map((slug) => `${base}/blog/${slug}`);
}

/**
 * IndexNow API'ye URL listesi gönderir. Key yoksa sessizce atlar (skipped).
 */
export async function submitIndexNowUrls(urls: string[]): Promise<IndexNowResult> {
  const key = getIndexNowKey();
  if (!key) {
    return { ok: false, submitted: 0, skipped: true, reason: 'INDEXNOW_KEY not configured' };
  }

  const unique = [...new Set(urls.map((u) => u.trim()).filter(Boolean))];
  if (unique.length === 0) {
    return { ok: true, submitted: 0, skipped: true, reason: 'no-urls' };
  }

  const keyLocation = getIndexNowKeyLocation();
  if (!keyLocation) {
    return { ok: false, submitted: 0, skipped: true, reason: 'invalid-key' };
  }

  let host: string;
  try {
    host = new URL(getSiteUrl()).host;
  } catch {
    return { ok: false, submitted: 0, skipped: true, reason: 'invalid-site-url' };
  }

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: unique.slice(0, 10_000),
      }),
      signal: AbortSignal.timeout(15_000),
    });

    // 200 OK, 202 Accepted
    if (res.status === 200 || res.status === 202) {
      return { ok: true, submitted: unique.length, status: res.status };
    }

    return {
      ok: false,
      submitted: 0,
      status: res.status,
      reason: `IndexNow HTTP ${res.status}`,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'IndexNow request failed';
    return { ok: false, submitted: 0, reason: message };
  }
}

export async function submitIndexNowBlogSlugs(slugs: string[]): Promise<IndexNowResult> {
  return submitIndexNowUrls(toAbsoluteBlogUrls(slugs));
}
