import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { getSiteUrl } from '@/lib/seo';
import {
  revisionDate,
  withHonestLastmod,
  toAbsoluteAssetUrl,
  maxSitemapDate,
} from '@/lib/sitemap-lastmod';

const MAX_IMAGES = 1000;

/**
 * Galeri image sitemap — Google image:image keşfi.
 * Sayfa URL’si /galeri; görseller aktif galeri kayıtlarından.
 */
export default async function gallerySitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  try {
    const items = await prisma.gallery.findMany({
      where: { isActive: true },
      select: { image: true, createdAt: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      take: MAX_IMAGES,
    });

    const images = items
      .map((item) => toAbsoluteAssetUrl(base, item.image))
      .filter((url): url is string => Boolean(url));

    const lastModified =
      maxSitemapDate(...items.map((i) => i.createdAt), revisionDate('galeriHub')) ??
      revisionDate('galeriHub');

    return [
      withHonestLastmod(
        {
          url: `${base}/galeri`,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
          ...(images.length > 0 ? { images } : {}),
        },
        lastModified
      ),
    ];
  } catch {
    return [
      withHonestLastmod(
        {
          url: `${base}/galeri`,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        },
        revisionDate('galeriHub')
      ),
    ];
  }
}
