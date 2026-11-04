import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import { SERVICE_SEED_DATA } from '@/lib/seed-services';
import { prisma } from '@/lib/prisma';
import {
  revisionDate,
  withHonestLastmod,
  maxSitemapDate,
} from '@/lib/sitemap-lastmod';
import { allSssTopicPaths } from '@/config/sss-topics';

type StaticEntry = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: number;
  /** true ise blog/galeri gibi DB’den türetilen lastmod tercih edilir */
  dynamicLastmod?: 'blog' | 'galeri' | 'geo-sss';
};

/** Ana sitemap — çekirdek statik sayfalar + hizmet detayları. */
const STATIC_PAGES: StaticEntry[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/hizmetler', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/cozumler', changeFrequency: 'weekly', priority: 0.94 },
  { path: '/bolgeler', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/iletisim', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/randevu', changeFrequency: 'weekly', priority: 0.88 },
  { path: '/rehber', changeFrequency: 'monthly', priority: 0.82 },
  // /ara robots noindex + Disallow — sitemap’e koyma (keşif↔robots çelişkisi)
  { path: '/blog', changeFrequency: 'daily', priority: 0.85, dynamicLastmod: 'blog' },
  { path: '/galeri', changeFrequency: 'weekly', priority: 0.8, dynamicLastmod: 'galeri' },
  { path: '/harita-ve-yorumlar', changeFrequency: 'weekly', priority: 0.84 },
  { path: '/referanslar', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/hakkimizda', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/ekibimiz', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/sss', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/gizlilik', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/kullanim-kosullari', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/fiyat-hesaplama', changeFrequency: 'weekly', priority: 0.87 },
  { path: '/fiyatlar', changeFrequency: 'weekly', priority: 0.88 },
  { path: '/geo-sss', changeFrequency: 'weekly', priority: 0.78, dynamicLastmod: 'geo-sss' },
];

function toAbsoluteUrl(base: string, path: string): string {
  if (!path) return `${base}/`;
  return `${base}${path}`;
}

/**
 * Ana sitemap — statik sayfalar + aktif hizmet detayları.
 * lastmod: sabit revizyon veya DB; asla build anı değil.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const base = getSiteUrl();
    const coreRevision = revisionDate('core');

    const [newestBlog, newestGallery, newestGeo, dbServices] = await Promise.all([
      prisma.blogPost.findFirst({
        where: { published: true },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
      prisma.gallery.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
      prisma.geoSssContent.findFirst({
        where: { published: true },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
      prisma.service.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const dynamicDates: Record<string, Date | undefined> = {
      blog: newestBlog?.updatedAt,
      galeri: newestGallery?.createdAt,
      'geo-sss': maxSitemapDate(newestGeo?.updatedAt, revisionDate('geoSssStatic')),
    };

    const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(
      ({ path, changeFrequency, priority, dynamicLastmod }) => {
        const lastModified = dynamicLastmod
          ? dynamicDates[dynamicLastmod] ?? coreRevision
          : coreRevision;
        return withHonestLastmod(
          {
            url: toAbsoluteUrl(base, path),
            changeFrequency,
            priority,
          },
          lastModified
        );
      }
    );

    let serviceEntries: MetadataRoute.Sitemap;
    if (dbServices.length > 0) {
      serviceEntries = dbServices.map((s) =>
        withHonestLastmod(
          {
            url: `${base}/hizmetler/${s.slug}`,
            changeFrequency: 'weekly' as const,
            priority: 0.85,
          },
          s.updatedAt
        )
      );
    } else {
      const fallbackDate = revisionDate('servicesFallback');
      serviceEntries = SERVICE_SEED_DATA.filter((s) => s.isActive !== false).map((s) =>
        withHonestLastmod(
          {
            url: `${base}/hizmetler/${s.slug}`,
            changeFrequency: 'weekly' as const,
            priority: 0.85,
          },
          fallbackDate
        )
      );
    }

    const sssTopicRevision = revisionDate('core');
    const sssTopicEntries: MetadataRoute.Sitemap = allSssTopicPaths().map((path) =>
      withHonestLastmod(
        {
          url: `${base}${path}`,
          changeFrequency: 'monthly' as const,
          priority: 0.72,
        },
        sssTopicRevision
      )
    );

    return [...staticEntries, ...serviceEntries, ...sssTopicEntries];
  } catch {
    const fallbackBase = 'https://www.zumrutvaditemizlik.com';
    const core = revisionDate('core');
    return [
      withHonestLastmod(
        { url: `${fallbackBase}/`, changeFrequency: 'weekly', priority: 1 },
        core
      ),
      withHonestLastmod(
        {
          url: `${fallbackBase}/hizmetler`,
          changeFrequency: 'weekly',
          priority: 0.9,
        },
        core
      ),
      withHonestLastmod(
        {
          url: `${fallbackBase}/iletisim`,
          changeFrequency: 'monthly',
          priority: 0.9,
        },
        core
      ),
      withHonestLastmod(
        { url: `${fallbackBase}/blog`, changeFrequency: 'daily', priority: 0.85 },
        core
      ),
    ];
  }
}
