import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import {
  allProgrammaticLandingPaths,
  allNeighborhoodLandingPaths,
} from '@/config/programmatic-seo';
import { revisionDate, withHonestLastmod } from '@/lib/sitemap-lastmod';

/**
 * Bölgeler silosu sitemap — lastmod = içerik revizyonu (her istekte new Date yok).
 * Semt/ilçe metni veya URL seti değişince SITEMAP_CONTENT_REVISIONS.bolgeler bump.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = revisionDate('bolgeler');
  const neighborhoodSet = new Set(allNeighborhoodLandingPaths());
  const programmaticPaths = allProgrammaticLandingPaths();

  return programmaticPaths.map((path) => {
    const segments = path.split('/').filter(Boolean);
    const isHub = path === '/bolgeler';
    const isNeighborhood = neighborhoodSet.has(path);
    const isDistrictHub = segments.length === 2;
    const priority = isNeighborhood ? 0.9 : isHub ? 0.9 : isDistrictHub ? 0.85 : 0.8;

    return withHonestLastmod(
      {
        url: path === '/bolgeler' ? `${base}/bolgeler` : `${base}${path}`,
        changeFrequency: 'weekly' as const,
        priority,
      },
      lastModified
    );
  });
}
