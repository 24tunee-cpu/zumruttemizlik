import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import {
  allProgrammaticLandingPaths,
  allNeighborhoodLandingPaths,
} from '@/config/programmatic-seo';

/**
 * Bölgeler silosu sitemap — ilçe hub, ilçe×hizmet ve semt landing URL'leri.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  const neighborhoodSet = new Set(allNeighborhoodLandingPaths());

  const programmaticPaths = allProgrammaticLandingPaths();

  return programmaticPaths.map((path) => {
    const segments = path.split('/').filter(Boolean);
    const isHub = path === '/bolgeler';
    const isNeighborhood = neighborhoodSet.has(path);
    const isDistrictHub = segments.length === 2;
    const priority = isNeighborhood ? 0.9 : isHub ? 0.9 : isDistrictHub ? 0.85 : 0.8;

    return {
      url: path === '/bolgeler' ? `${base}/bolgeler` : `${base}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority,
    };
  });
}
