import type { MetadataRoute } from 'next';
import { listPublishedGeoSssSitemapEntries } from '@/lib/geo-sss-resolver';
import { getSiteUrl } from '@/lib/seo';
import { revisionDate, withHonestLastmod, maxSitemapDate } from '@/lib/sitemap-lastmod';

export default async function geoSssSitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const entries = await listPublishedGeoSssSitemapEntries();
  const hubLastmod =
    maxSitemapDate(...entries.map((e) => e.lastModified), revisionDate('geoSssStatic')) ??
    revisionDate('geoSssStatic');

  return [
    withHonestLastmod(
      {
        url: `${base}/geo-sss`,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      hubLastmod
    ),
    ...entries.map((entry) =>
      withHonestLastmod(
        {
          url: `${base}/geo-sss/${entry.slug}`,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        },
        entry.lastModified
      )
    ),
  ];
}
