import type { PrismaClient } from '@prisma/client';
import { BLOG_SEED_POSTS } from './seed-blog';
import { generateAllV2Posts } from './seed-blog-v2-content';
import { generateAllV3Posts } from './seed-blog-v3-content';
import { generateAllV4Posts } from './seed-blog-v4-content';
import { generateAllV5Posts } from './seed-blog-v5-content';
import { generateAllV6Posts } from './seed-blog-v6-content';
import { generateAllV7Posts } from './seed-blog-v7-content';
import { resolveBlogMetaDesc, resolveBlogMetaTitle } from './blog-meta';

const EXISTING_SLUGS = new Set([
  ...BLOG_SEED_POSTS.map((p) => p.slug),
  ...generateAllV2Posts().seo.map((p) => p.slug),
  ...generateAllV2Posts().pricing.map((p) => p.slug),
  ...generateAllV3Posts().seo.map((p) => p.slug),
  ...generateAllV3Posts().pricing.map((p) => p.slug),
  ...generateAllV4Posts().map((p) => p.slug),
  ...generateAllV5Posts().map((p) => p.slug),
  ...generateAllV6Posts().map((p) => p.slug),
]);

export type UpsertV7Result = {
  total: number;
  skippedExisting: number;
  skippedPublished: number;
  conflictWithPrior: number;
};

/**
 * 100 ticari/yerel v7 blog — taslak upsert (schedule ayrı).
 */
export async function upsertScheduledBlogV7(prisma: PrismaClient): Promise<UpsertV7Result> {
  const allPosts = generateAllV7Posts();
  const fresh = allPosts.filter((p) => !EXISTING_SLUGS.has(p.slug));

  if (fresh.length !== 100) {
    throw new Error(
      `V7 slug çakışması veya eksik içerik: fresh=${fresh.length}/100 (prior overlap=${100 - fresh.length})`
    );
  }

  let skippedExisting = 0;
  let skippedPublished = 0;

  for (const post of fresh) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
      select: { published: true },
    });

    if (existing?.published) {
      skippedPublished += 1;
      continue;
    }

    if (existing) skippedExisting += 1;

    const resolvedTitle = resolveBlogMetaTitle(post.title, post.metaTitle ?? null);
    const resolvedDesc = resolveBlogMetaDesc(post.excerpt, post.metaDesc ?? null);
    const normalizedTags = [
      ...new Set([
        ...post.tags,
        'istanbul',
        'temizlik rehberi',
        'zümrüt vadi temizlik blog',
        'otomatik yayın v7',
      ]),
    ].slice(0, 12);

    const contentFields = {
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      image: post.image ?? null,
      category: post.category,
      tags: normalizedTags,
      metaTitle: resolvedTitle,
      metaDesc: resolvedDesc,
      scheduledPublishAt: null as Date | null,
    };

    if (existing) {
      await prisma.blogPost.update({
        where: { slug: post.slug },
        data: contentFields,
      });
    } else {
      await prisma.blogPost.create({
        data: {
          slug: post.slug,
          ...contentFields,
          author: 'Zümrüt Vadi Temizlik',
          published: false,
          views: 0,
        },
      });
    }
  }

  return {
    total: fresh.length,
    skippedExisting,
    skippedPublished,
    conflictWithPrior: 0,
  };
}
