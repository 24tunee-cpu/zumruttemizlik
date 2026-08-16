import { prisma } from '@/lib/prisma';
import {
  GEO_SSS_PAGES,
  type GeoSssPage,
} from '@/config/geo-district-faqs';

export type ResolvedGeoSssPage = GeoSssPage;

function linksFromJson(raw: unknown): GeoSssPage['relatedLinks'] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is { href: string; label: string } =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as { href?: string }).href === 'string' &&
      typeof (item as { label?: string }).label === 'string'
  );
}

export function getStaticGeoSssBySlug(slug: string): GeoSssPage | undefined {
  return GEO_SSS_PAGES.find((p) => p.slug === slug);
}

/** Statik + yayınlanmış DB geo-sss */
export async function getGeoSssBySlugAsync(slug: string): Promise<GeoSssPage | undefined> {
  const staticPage = getStaticGeoSssBySlug(slug);
  if (staticPage) return staticPage;

  const row = await prisma.geoSssContent.findUnique({
    where: { slug },
  });
  if (!row || !row.published) return undefined;

  return {
    slug: row.slug,
    districtSlug: row.districtSlug,
    districtName: row.districtName,
    title: row.title,
    directAnswer: row.directAnswer,
    details: row.details,
    relatedLinks: linksFromJson(row.relatedLinksJson),
  };
}

export async function listPublishedGeoSssSlugs(): Promise<string[]> {
  const dbSlugs = await prisma.geoSssContent.findMany({
    where: { published: true },
    select: { slug: true },
  });
  const staticSlugs = GEO_SSS_PAGES.map((p) => p.slug);
  return [...new Set([...staticSlugs, ...dbSlugs.map((r) => r.slug)])];
}

/** İndeks sayfası — statik + yayınlanmış DB geo-sss birleşik liste */
export async function listAllGeoSssPagesForIndex(): Promise<GeoSssPage[]> {
  const staticSlugs = new Set(GEO_SSS_PAGES.map((p) => p.slug));
  const dbRows = await prisma.geoSssContent.findMany({
    where: { published: true },
    orderBy: [{ districtName: 'asc' }, { title: 'asc' }],
  });

  const dbPages: GeoSssPage[] = dbRows
    .filter((row) => !staticSlugs.has(row.slug))
    .map((row) => ({
      slug: row.slug,
      districtSlug: row.districtSlug,
      districtName: row.districtName,
      title: row.title,
      directAnswer: row.directAnswer,
      details: row.details,
      relatedLinks: linksFromJson(row.relatedLinksJson),
    }));

  return [...GEO_SSS_PAGES, ...dbPages];
}
