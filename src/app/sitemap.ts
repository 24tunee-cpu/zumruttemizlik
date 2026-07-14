import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import { SERVICE_SEED_DATA } from '@/lib/seed-services';

type StaticEntry = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: number;
};

/** Ana sitemap — çekirdek statik sayfalar + hizmet detayları. */
const STATIC_PAGES: StaticEntry[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/llms.txt', changeFrequency: 'weekly', priority: 0.95 },
  { path: '/llms-full.txt', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/hizmetler', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/cozumler', changeFrequency: 'weekly', priority: 0.94 },
  { path: '/bolgeler', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/iletisim', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/randevu', changeFrequency: 'weekly', priority: 0.88 },
  { path: '/rehber', changeFrequency: 'monthly', priority: 0.82 },
  { path: '/ara', changeFrequency: 'weekly', priority: 0.75 },
  { path: '/blog', changeFrequency: 'daily', priority: 0.85 },
  { path: '/galeri', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/harita-ve-yorumlar', changeFrequency: 'weekly', priority: 0.84 },
  { path: '/referanslar', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/hakkimizda', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/ekibimiz', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/sss', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/gizlilik', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/kullanim-kosullari', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/fiyat-hesaplama', changeFrequency: 'weekly', priority: 0.87 },
  { path: '/geo-sss', changeFrequency: 'weekly', priority: 0.78 },
];

function toAbsoluteUrl(base: string, path: string): string {
  if (!path) return `${base}/`;
  return `${base}${path}`;
}

/**
 * Ana sitemap — statik sayfalar + aktif hizmet detayları.
 * Çözümler: `/cozumler/sitemap.xml` · Bölgeler: `/bolgeler/sitemap.xml` · Blog: `/blog/sitemap.xml`
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const base = getSiteUrl();
    const now = new Date();

    const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(
      ({ path, changeFrequency, priority }) => ({
        url: toAbsoluteUrl(base, path),
        lastModified: now,
        changeFrequency,
        priority,
      })
    );

    const serviceEntries: MetadataRoute.Sitemap = SERVICE_SEED_DATA.filter(
      (s) => s.isActive !== false
    ).map((s) => ({
      url: `${base}/hizmetler/${s.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));

    return [...staticEntries, ...serviceEntries];
  } catch {
    const fallbackBase = 'https://www.zumrutvaditemizlik.com';
    return [
      { url: `${fallbackBase}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
      { url: `${fallbackBase}/hizmetler`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
      { url: `${fallbackBase}/iletisim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
      { url: `${fallbackBase}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    ];
  }
}
