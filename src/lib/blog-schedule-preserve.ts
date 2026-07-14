import type { PrismaClient } from '@prisma/client';
import { BLOG_PUBLISH_PER_DAY, BLOG_SCHEDULE_ANCHOR_ISO, BLOG_SCHEDULE_DUE_HOUR_UTC } from './blog-schedule';

export { BLOG_SCHEDULE_ANCHOR_ISO };

/**
 * Zamanlanmış yayın tarihini korur; yalnızca yeni yazılara slot atar.
 */
export function resolveScheduledPublishAt(
  queueIndex: number,
  existingScheduled: Date | null | undefined,
  anchor: Date = new Date(BLOG_SCHEDULE_ANCHOR_ISO)
): Date {
  if (existingScheduled) {
    return existingScheduled;
  }

  const dayOffset = Math.floor(queueIndex / BLOG_PUBLISH_PER_DAY);
  const scheduled = new Date(anchor);
  scheduled.setUTCHours(BLOG_SCHEDULE_DUE_HOUR_UTC, 0, 0, 0);
  scheduled.setUTCDate(scheduled.getUTCDate() + dayOffset);
  return scheduled;
}

export type BlogScheduleHealth = {
  overdue: number;
  dueToday: number;
  nextBatchAt: string | null;
  nextSlugs: string[];
};

export async function getBlogScheduleHealth(prisma: PrismaClient): Promise<BlogScheduleHealth> {
  const now = new Date();
  const startOfTodayUtc = new Date(now);
  startOfTodayUtc.setUTCHours(0, 0, 0, 0);
  const endOfTodayUtc = new Date(startOfTodayUtc);
  endOfTodayUtc.setUTCDate(endOfTodayUtc.getUTCDate() + 1);

  const overdue = await prisma.blogPost.count({
    where: { published: false, scheduledPublishAt: { lte: now } },
  });

  const dueToday = await prisma.blogPost.count({
    where: {
      published: false,
      scheduledPublishAt: { gte: startOfTodayUtc, lt: endOfTodayUtc },
    },
  });

  const nextBatch = await prisma.blogPost.findMany({
    where: { published: false, scheduledPublishAt: { not: null } },
    orderBy: { scheduledPublishAt: 'asc' },
    take: 5,
    select: { slug: true, scheduledPublishAt: true },
  });

  return {
    overdue,
    dueToday,
    nextBatchAt: nextBatch[0]?.scheduledPublishAt?.toISOString() ?? null,
    nextSlugs: nextBatch.map((p) => p.slug),
  };
}
