import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import { allCozumlerSitemapPaths } from '@/config/intent-seo';

/**
 * Çözümler silosu sitemap — hub, niyet ve niyet×ilçe URL'leri.
 * Ana sitemap'ten ayrılarak crawler odağını netleştirir.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  return allCozumlerSitemapPaths().map((path) => {
    const isHub = path === '/cozumler';
    const isIntentOnly = path.split('/').length === 3;
    const priority = isHub ? 0.94 : isIntentOnly ? 0.93 : 0.91;

    return {
      url: path === '/cozumler' ? `${base}/cozumler` : `${base}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority,
    };
  });
}
