import { getSiteUrl } from '@/lib/seo';
import { submitIndexNowUrls } from '@/lib/indexnow';
import { AUTOPILOT_LIMITS } from './constants';

export async function pingIndexNowForPaths(paths: string[]) {
  const base = getSiteUrl().replace(/\/$/, '');
  const urls = [...new Set(paths.map((p) => `${base}${p.startsWith('/') ? p : `/${p}`}`))].slice(
    0,
    AUTOPILOT_LIMITS.indexNowMaxUrls
  );
  return submitIndexNowUrls(urls);
}
