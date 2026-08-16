import type { MetadataRoute } from 'next';
import { listPublishedGeoSssSlugs } from '@/lib/geo-sss-resolver';
import { getSiteUrl } from '@/lib/seo';

export default async function geoSssSitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const slugs = await listPublishedGeoSssSlugs();

  return [
    {
      url: `${base}/geo-sss`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...slugs.map((slug) => ({
      url: `${base}/geo-sss/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
