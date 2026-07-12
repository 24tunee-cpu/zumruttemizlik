import type { PrismaClient } from '@prisma/client';
import { BLOG_SEED_POSTS } from './seed-blog';
import {
  assignPublishSchedule,
  buildMixedPublishQueue,
  BLOG_PUBLISH_PER_DAY,
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
 * Zaten yayınlanmış slug'lara dokunmaz; taslak olanların içeriğini günceller.
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

  const scheduled = assignPublishSchedule(queue);
  let skippedExisting = 0;

  for (const post of scheduled) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
      select: { published: true },
    });

    if (existing?.published) {
      skippedExisting += 1;
      continue;
    }

    const enrichedExcerpt = post.excerpt;
    const enrichedContent = post.content;
    const resolvedTitle = resolveBlogMetaTitle(post.title, post.metaTitle ?? null);
    const resolvedDesc = resolveBlogMetaDesc(enrichedExcerpt, post.metaDesc ?? null);
    const normalizedTags = [
      ...new Set([...post.tags, 'istanbul', 'zümrüt vadi temizlik blog', 'otomatik yayın v2']),
    ].slice(0, 12);

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: {
        slug: post.slug,
        title: post.title,
        content: enrichedContent,
        excerpt: enrichedExcerpt,
        image: post.image ?? null,
        category: post.category,
        tags: normalizedTags,
        author: 'Zümrüt Vadi Temizlik',
        published: false,
        scheduledPublishAt: post.scheduledPublishAt,
        views: 0,
        metaTitle: resolvedTitle,
        metaDesc: resolvedDesc,
      },
      update: {
        title: post.title,
        content: enrichedContent,
        excerpt: enrichedExcerpt,
        image: post.image ?? null,
        category: post.category,
        tags: normalizedTags,
        published: false,
        scheduledPublishAt: post.scheduledPublishAt,
        metaTitle: resolvedTitle,
        metaDesc: resolvedDesc,
      },
    });
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
