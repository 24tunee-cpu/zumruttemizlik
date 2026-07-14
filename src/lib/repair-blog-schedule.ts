import type { PrismaClient } from '@prisma/client';
import {
  assignPublishSchedule,
  buildMixedPublishQueue,
  BLOG_SCHEDULE_ANCHOR_ISO,
} from './blog-schedule';
import { generateAllV2Posts } from './seed-blog-v2-content';
import { BLOG_SEED_POSTS } from './seed-blog';

const EXISTING_SLUGS = new Set(BLOG_SEED_POSTS.map((p) => p.slug));

/**
 * V2 taslakların yayın takvimini sabit anchor'a göre onarır (kaçırılan günler dahil).
 */
export async function repairV2BlogSchedule(prisma: PrismaClient): Promise<{
  repaired: number;
  skippedPublished: number;
  overdueAfterRepair: number;
}> {
  const { seo, pricing } = generateAllV2Posts();
  const queue = buildMixedPublishQueue(
    seo.filter((p) => !EXISTING_SLUGS.has(p.slug)),
    pricing.filter((p) => !EXISTING_SLUGS.has(p.slug))
  );
  const anchor = new Date(BLOG_SCHEDULE_ANCHOR_ISO);
  const scheduled = assignPublishSchedule(queue, { anchor });

  let repaired = 0;
  let skippedPublished = 0;

  for (const post of scheduled) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
      select: { published: true },
    });

    if (!existing) continue;
    if (existing.published) {
      skippedPublished += 1;
      continue;
    }

    await prisma.blogPost.update({
      where: { slug: post.slug },
      data: { scheduledPublishAt: post.scheduledPublishAt },
    });
    repaired += 1;
  }

  const now = new Date();
  const overdueAfterRepair = await prisma.blogPost.count({
    where: { published: false, scheduledPublishAt: { lte: now } },
  });

  return { repaired, skippedPublished, overdueAfterRepair };
}
