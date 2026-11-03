import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import { PRIORITY_BLOG_LINKS } from '@/lib/priority-seo-links';
import { allBlogSiloPaths } from '@/config/blog-silo-clusters';
import { BLOG_CANNIBAL_CANONICAL } from '@/config/seo-cannibalization';
import { prisma } from '@/lib/prisma';
import {
  revisionDate,
  withHonestLastmod,
  toAbsoluteAssetUrl,
} from '@/lib/sitemap-lastmod';

const PRIORITY_BLOG_SET = new Set(
  PRIORITY_BLOG_LINKS.map((item) => item.href.replace('/blog/', ''))
);

/** noindex cannibal kopyalar sitemap’e girmez (GSC sitemap↔robots çelişkisi) */
const CANNIBAL_NOINDEX_SLUGS = new Set(Object.keys(BLOG_CANNIBAL_CANONICAL));

/**
 * Blog odaklı sitemap — post lastmod = updatedAt (dürüst).
 * Silo hub: içerik revizyon tarihi (build zamanı değil).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const base = getSiteUrl();
    const siloRevision = revisionDate('blogSilo');
    const posts = (
      await prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true, image: true },
        orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      })
    ).filter((post) => !CANNIBAL_NOINDEX_SLUGS.has(post.slug));

    const siloEntries: MetadataRoute.Sitemap = allBlogSiloPaths().map((path) =>
      withHonestLastmod(
        {
          url: `${base}${path}`,
          changeFrequency: 'weekly' as const,
          priority: 0.9,
        },
        siloRevision
      )
    );

    if (posts.length > 0) {
      return [
        ...siloEntries,
        ...posts.map((post) => {
          const imageUrl = toAbsoluteAssetUrl(base, post.image);
          return withHonestLastmod(
            {
              url: `${base}/blog/${post.slug}`,
              changeFrequency: 'weekly' as const,
              priority: PRIORITY_BLOG_SET.has(post.slug) ? 0.92 : 0.76,
              ...(imageUrl ? { images: [imageUrl] } : {}),
            },
            post.updatedAt
          );
        }),
      ];
    }

    return [
      ...siloEntries,
      ...PRIORITY_BLOG_LINKS.map((item) => {
        const slug = item.href.replace('/blog/', '');
        return withHonestLastmod(
          {
            url: `${base}${item.href}`,
            changeFrequency: 'weekly' as const,
            priority: PRIORITY_BLOG_SET.has(slug) ? 0.92 : 0.74,
          },
          siloRevision
        );
      }),
    ];
  } catch {
    const fallbackBase = 'https://www.zumrutvaditemizlik.com';
    const siloRevision = revisionDate('blogSilo');
    return PRIORITY_BLOG_LINKS.map((item) =>
      withHonestLastmod(
        {
          url: `${fallbackBase}${item.href}`,
          changeFrequency: 'weekly' as const,
          priority: 0.92,
        },
        siloRevision
      )
    );
  }
}
