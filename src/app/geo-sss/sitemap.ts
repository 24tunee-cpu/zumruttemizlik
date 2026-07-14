import type { MetadataRoute } from 'next';
import { GEO_SSS_PAGES } from '@/config/geo-district-faqs';
import { getSiteUrl } from '@/lib/seo';

export default function geoSssSitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    {
      url: `${base}/geo-sss`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...GEO_SSS_PAGES.map((p) => ({
      url: `${base}/geo-sss/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
