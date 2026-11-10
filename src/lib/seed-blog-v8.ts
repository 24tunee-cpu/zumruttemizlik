import type { PrismaClient } from '@prisma/client';
import { BLOG_SEED_POSTS } from './seed-blog';
import { generateAllV2Posts } from './seed-blog-v2-content';
import { generateAllV3Posts } from './seed-blog-v3-content';
import { generateAllV4Posts } from './seed-blog-v4-content';
import { generateAllV5Posts } from './seed-blog-v5-content';
import { generateAllV6Posts } from './seed-blog-v6-content';
import { generateAllV7Posts } from './seed-blog-v7-content';
import { generateAllV8Posts } from './seed-blog-v8-content';
import { resolveBlogMetaDesc, resolveBlogMetaTitle } from './blog-meta';
import { enrichBlogContentWithInternalLinks } from './blog-publish-internal-links';
import { notifyContentDiscovery } from './discovery-notify';
import { safeRevalidatePath } from './safe-revalidate';

function priorSlugs(): Set<string> {
  return new Set([
    ...BLOG_SEED_POSTS.map((p) => p.slug),
    ...generateAllV2Posts().seo.map((p) => p.slug),
    ...generateAllV2Posts().pricing.map((p) => p.slug),
    ...generateAllV3Posts().seo.map((p) => p.slug),
    ...generateAllV3Posts().pricing.map((p) => p.slug),
    ...generateAllV4Posts().map((p) => p.slug),
    ...generateAllV5Posts().map((p) => p.slug),
    ...generateAllV6Posts().map((p) => p.slug),
    ...generateAllV7Posts().map((p) => p.slug),
  ]);
}

export type UpsertV8Result = {
  total: number;
  created: number;
  updated: number;
  skippedPublished: number;
  publishedSlugs: string[];
  indexNowSubmitted?: number;
};

/**
 * 100 derin fiyat rehberi — doğrudan yayın (drip/schedule yok).
 */
export async function upsertAndPublishBlogV8(prisma: PrismaClient): Promise<UpsertV8Result> {
  const prior = priorSlugs();
  const allPosts = generateAllV8Posts();
  const fresh = allPosts.filter((p) => !prior.has(p.slug));

  if (fresh.length !== 100) {
    throw new Error(`V8 slug çakışması: fresh=${fresh.length}/100`);
  }

  let created = 0;
  let updated = 0;
  let skippedPublished = 0;
  const publishedSlugs: string[] = [];

  for (const post of fresh) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
      select: { id: true, published: true, content: true },
    });

    const resolvedTitle = resolveBlogMetaTitle(post.title, post.metaTitle ?? null);
    const resolvedDesc = resolveBlogMetaDesc(post.excerpt, post.metaDesc ?? null);
    const normalizedTags = [
      ...new Set([
        ...post.tags,
        'istanbul',
        'fiyat rehberi',
        'zümrüt vadi temizlik blog',
        'otomatik yayın v8',
      ]),
    ].slice(0, 12);

    let content = post.content;
    try {
      const enriched = await enrichBlogContentWithInternalLinks(prisma, {
        slug: post.slug,
        content: post.content,
      });
      content = enriched.content;
    } catch {
      // enrich opsiyonel — içerik yine yayınlanır
    }

    const data = {
      title: post.title,
      content,
      excerpt: post.excerpt,
      image: post.image ?? null,
      category: post.category,
      tags: normalizedTags,
      metaTitle: resolvedTitle,
      metaDesc: resolvedDesc,
      published: true,
      scheduledPublishAt: null as Date | null,
      author: 'Zümrüt Vadi Temizlik',
    };

    if (existing) {
      if (existing.published) skippedPublished += 1;
      await prisma.blogPost.update({
        where: { slug: post.slug },
        data,
      });
      updated += 1;
    } else {
      await prisma.blogPost.create({
        data: {
          slug: post.slug,
          ...data,
          views: 0,
        },
      });
      created += 1;
    }

    publishedSlugs.push(post.slug);
  }

  // Keşif ping — batch
  const paths = publishedSlugs.map((s) => `/blog/${s}`);
  let indexNowSubmitted = 0;
  for (let i = 0; i < paths.length; i += 40) {
    const chunk = paths.slice(i, i + 40);
    try {
      const discovery = await notifyContentDiscovery({
        paths: chunk,
        pingFeeds: i === 0,
        extraRevalidate: i === 0 ? ['/blog', '/blog/sitemap.xml'] : [],
      });
      indexNowSubmitted += discovery.indexNow.submitted ?? 0;
    } catch {
      // ping başarısız olsa yayın DB'de
    }
  }

  for (const slug of publishedSlugs.slice(0, 20)) {
    safeRevalidatePath(`/blog/${slug}`);
  }
  safeRevalidatePath('/blog');

  return {
    total: fresh.length,
    created,
    updated,
    skippedPublished,
    publishedSlugs,
    indexNowSubmitted,
  };
}
