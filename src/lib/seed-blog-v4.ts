import type { PrismaClient } from '@prisma/client';
import { BLOG_SEED_POSTS } from './seed-blog';
import {
  assignPublishSchedule,
  BLOG_V4_PUBLISH_PER_DAY,
  BLOG_V4_SCHEDULE_ANCHOR_ISO,
} from './blog-schedule';
import { generateAllV2Posts } from './seed-blog-v2-content';
import { generateAllV3Posts } from './seed-blog-v3-content';
import { generateAllV4Posts } from './seed-blog-v4-content';
import { resolveBlogMetaDesc, resolveBlogMetaTitle } from './blog-meta';

const EXISTING_SLUGS = new Set([
  ...BLOG_SEED_POSTS.map((p) => p.slug),
  ...generateAllV2Posts().seo.map((p) => p.slug),
  ...generateAllV2Posts().pricing.map((p) => p.slug),
  ...generateAllV3Posts().seo.map((p) => p.slug),
  ...generateAllV3Posts().pricing.map((p) => p.slug),
]);

export type UpsertV4Result = {
  total: number;
  days: number;
  skippedExisting: number;
  skippedPublished: number;
  firstPublishAt: string;
  lastPublishAt: string;
};

/**
 * 100 yeni İstanbul yaşam / etkileşim blog yazısını taslak + zamanlanmış olarak upsert eder.
 * Yayınlanmış slug'lara dokunmaz; mevcut taslak takvimini korur.
 */
export async function upsertScheduledBlogV4(prisma: PrismaClient): Promise<UpsertV4Result> {
  const allPosts = generateAllV4Posts();
  const fresh = allPosts.filter((p) => !EXISTING_SLUGS.has(p.slug));

  if (fresh.length !== 100) {
    throw new Error(`V4 slug çakışması veya eksik içerik: fresh=${fresh.length}/100`);
  }

  const anchor = new Date(BLOG_V4_SCHEDULE_ANCHOR_ISO);
  const scheduled = assignPublishSchedule(fresh, {
    anchor,
    postsPerDay: BLOG_V4_PUBLISH_PER_DAY,
  });

  if (scheduled.length !== 100) {
    throw new Error(`V4 kuyruk boyutu hatalı: ${scheduled.length}/100`);
  }

  let skippedExisting = 0;
  let skippedPublished = 0;

  for (const post of scheduled) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
      select: { published: true, scheduledPublishAt: true },
    });

    if (existing?.published) {
      skippedPublished += 1;
      continue;
    }

    if (existing) {
      skippedExisting += 1;
    }

    const scheduledPublishAt =
      existing?.scheduledPublishAt ?? post.scheduledPublishAt;

    const resolvedTitle = resolveBlogMetaTitle(post.title, post.metaTitle ?? null);
    const resolvedDesc = resolveBlogMetaDesc(post.excerpt, post.metaDesc ?? null);
    const normalizedTags = [
      ...new Set([
        ...post.tags,
        'istanbul',
        'yaşam rehberi',
        'zümrüt vadi temizlik blog',
        'otomatik yayın v4',
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
      scheduledPublishAt,
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
    total: scheduled.length,
    days: Math.ceil(scheduled.length / BLOG_V4_PUBLISH_PER_DAY),
    skippedExisting,
    skippedPublished,
    firstPublishAt: scheduled[0].scheduledPublishAt.toISOString(),
    lastPublishAt: scheduled[scheduled.length - 1].scheduledPublishAt.toISOString(),
  };
}
