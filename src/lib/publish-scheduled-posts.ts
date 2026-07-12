import { prisma } from '@/lib/prisma';

/** Günlük otomatik blog yayın limiti */
export const BLOG_DAILY_PUBLISH_LIMIT = 5;

export type PublishScheduledResult = {
  published: number;
  slugs: string[];
  remainingScheduled: number;
};

/**
 * Zamanı gelmiş taslakları açar — en fazla BLOG_DAILY_PUBLISH_LIMIT adet (FIFO).
 * Vercel cron günde bir kez tetikler (08:00 Türkiye).
 */
export async function publishScheduledBlogPosts(): Promise<PublishScheduledResult> {
  const now = new Date();

  const due = await prisma.blogPost.findMany({
    where: {
      published: false,
      scheduledPublishAt: { lte: now },
    },
    orderBy: [{ scheduledPublishAt: 'asc' }, { createdAt: 'asc' }],
    take: BLOG_DAILY_PUBLISH_LIMIT,
    select: { id: true, slug: true },
  });

  if (due.length === 0) {
    const remainingScheduled = await prisma.blogPost.count({
      where: { published: false, scheduledPublishAt: { not: null } },
    });
    return { published: 0, slugs: [], remainingScheduled };
  }

  const ids = due.map((d) => d.id);

  await prisma.blogPost.updateMany({
    where: { id: { in: ids } },
    data: {
      published: true,
      scheduledPublishAt: null,
    },
  });

  const remainingScheduled = await prisma.blogPost.count({
    where: { published: false, scheduledPublishAt: { not: null } },
  });

  return {
    published: due.length,
    slugs: due.map((d) => d.slug),
    remainingScheduled,
  };
}
