import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import { PRIORITY_BLOG_LINKS } from '@/lib/priority-seo-links';
import { allBlogSiloPaths } from '@/config/blog-silo-clusters';
import { prisma } from '@/lib/prisma';

const PRIORITY_BLOG_SET = new Set(PRIORITY_BLOG_LINKS.map((item) => item.href.replace('/blog/', '')));

/**
 * Blog odakli sitemap:
 * - Blog URL'lerini ana sitemap'ten ayirarak crawler odagini netlestirir.
 * - Ticari niyetli URL'lere daha yuksek priority sinyali verir.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const base = getSiteUrl();
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    if (posts.length > 0) {
      const siloEntries: MetadataRoute.Sitemap = allBlogSiloPaths().map((path) => ({
        url: `${base}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));

      return [
        ...siloEntries,
        ...posts.map((post) => ({
          url: `${base}/blog/${post.slug}`,
          lastModified: post.updatedAt,
          changeFrequency: 'weekly' as const,
          priority: PRIORITY_BLOG_SET.has(post.slug) ? 0.92 : 0.76,
        })),
      ];
    }

    const siloEntries: MetadataRoute.Sitemap = allBlogSiloPaths().map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    return [
      ...siloEntries,
      ...PRIORITY_BLOG_LINKS.map((item) => {
        const slug = item.href.replace('/blog/', '');
        return {
          url: `${base}${item.href}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: PRIORITY_BLOG_SET.has(slug) ? 0.92 : 0.74,
        };
      }),
    ];
  } catch {
    const fallbackBase = 'https://www.zumrutvaditemizlik.com';
    return PRIORITY_BLOG_LINKS.map((item) => ({
      url: `${fallbackBase}${item.href}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.92,
    }));
  }
}
