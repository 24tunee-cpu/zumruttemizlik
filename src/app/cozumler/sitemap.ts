import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import { allCozumlerSitemapPaths } from '@/config/intent-seo';
import { revisionDate, withHonestLastmod } from '@/lib/sitemap-lastmod';

/**
 * Çözümler silosu sitemap — dürüst lastmod (revizyon tarihi).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = revisionDate('cozumler');

  return allCozumlerSitemapPaths().map((path) => {
    const isHub = path === '/cozumler';
    const isIntentOnly = path.split('/').length === 3;
    const priority = isHub ? 0.94 : isIntentOnly ? 0.93 : 0.91;

    return withHonestLastmod(
      {
        url: path === '/cozumler' ? `${base}/cozumler` : `${base}${path}`,
        changeFrequency: 'weekly' as const,
        priority,
      },
      lastModified
    );
  });
}
