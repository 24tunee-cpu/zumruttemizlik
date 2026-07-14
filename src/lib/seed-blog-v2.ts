import type { PrismaClient } from '@prisma/client';
import { BLOG_SEED_POSTS } from './seed-blog';
import {
  assignPublishSchedule,
  buildMixedPublishQueue,
  BLOG_PUBLISH_PER_DAY,
  BLOG_SCHEDULE_ANCHOR_ISO,
} from './blog-schedule';
import { generateAllV2Posts } from './seed-blog-v2-content';
import { resolveBlogMetaDesc, resolveBlogMetaTitle } from './blog-meta';

const EXISTING_SLUGS = new Set(BLOG_SEED_POSTS.map((p) => p.slug));

export type UpsertV2Result = {
  total: number;
  seo: number;
  pricing: number;
  days: number;
  skippedExisting: number;
  firstPublishAt: string;
  lastPublishAt: string;
};

/**
 * 100 yeni blog yazısını taslak + zamanlanmış olarak upsert eder.
 * Yayınlanmış slug'lara dokunmaz.
 * Mevcut taslakların scheduledPublishAt değerini korur (re-seed takvimi sıfırlamaz).
 */
export async function upsertScheduledBlogV2(prisma: PrismaClient): Promise<UpsertV2Result> {
  const { seo, pricing } = generateAllV2Posts();

  const freshSeo = seo.filter((p) => !EXISTING_SLUGS.has(p.slug));
  const freshPricing = pricing.filter((p) => !EXISTING_SLUGS.has(p.slug));

  if (freshSeo.length !== 50 || freshPricing.length !== 50) {
    throw new Error(
      `V2 slug çakışması: seo=${freshSeo.length}/50 pricing=${freshPricing.length}/50`
    );
  }

  const queue = buildMixedPublishQueue(freshSeo, freshPricing);
  if (queue.length !== 100) {
    throw new Error(`Kuyruk boyutu hatalı: ${queue.length}/100`);
  }

  const anchor = new Date(BLOG_SCHEDULE_ANCHOR_ISO);
  const scheduled = assignPublishSchedule(queue, { anchor });
  let skippedExisting = 0;

  for (let i = 0; i < scheduled.length; i++) {
    const post = scheduled[i];
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
      select: { published: true, scheduledPublishAt: true },
    });

    if (existing?.published) {
      skippedExisting += 1;
      continue;
    }

    const scheduledPublishAt =
      existing?.scheduledPublishAt ?? post.scheduledPublishAt;

    const resolvedTitle = resolveBlogMetaTitle(post.title, post.metaTitle ?? null);
    const resolvedDesc = resolveBlogMetaDesc(post.excerpt, post.metaDesc ?? null);
    const normalizedTags = [
      ...new Set([...post.tags, 'istanbul', 'zümrüt vadi temizlik blog', 'otomatik yayın v2']),
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
    seo: freshSeo.length,
    pricing: freshPricing.length,
    days: Math.ceil(scheduled.length / BLOG_PUBLISH_PER_DAY),
    skippedExisting,
    firstPublishAt: scheduled[0].scheduledPublishAt.toISOString(),
    lastPublishAt: scheduled[scheduled.length - 1].scheduledPublishAt.toISOString(),
  };
}
