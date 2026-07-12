import type { BlogSeedPost } from './seed-blog';

/** Günlük otomatik yayın adedi */
export const BLOG_PUBLISH_PER_DAY = 5;

/** Vercel cron UTC — Türkiye 08:00 (UTC+3) */
export const BLOG_PUBLISH_HOUR_UTC = 5;

export type ScheduledBlogPost = BlogSeedPost & {
  scheduledPublishAt: Date;
  queueIndex: number;
};

/**
 * SEO öncelikli karışık kuyruk: her gün 3 SEO + 2 fiyat yazısı.
 */
export function buildMixedPublishQueue(
  seoPosts: BlogSeedPost[],
  pricingPosts: BlogSeedPost[]
): BlogSeedPost[] {
  const queue: BlogSeedPost[] = [];
  let si = 0;
  let pi = 0;

  while (si < seoPosts.length || pi < pricingPosts.length) {
    for (let i = 0; i < 3 && si < seoPosts.length; i++) {
      queue.push(seoPosts[si++]);
    }
    for (let i = 0; i < 2 && pi < pricingPosts.length; i++) {
      queue.push(pricingPosts[pi++]);
    }
    if (queue.length > 500) break;
  }

  return queue;
}

function startOfPublishDayUTC(from: Date): Date {
  const d = new Date(from);
  d.setUTCHours(BLOG_PUBLISH_HOUR_UTC, 0, 0, 0);
  if (d.getTime() <= from.getTime()) {
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return d;
}

/**
 * Kuyruktaki her yazıya gün slotu atar (günde 5 yazı, aynı UTC saatinde).
 */
export function assignPublishSchedule(
  posts: BlogSeedPost[],
  options?: { startFrom?: Date }
): ScheduledBlogPost[] {
  const base = startOfPublishDayUTC(options?.startFrom ?? new Date());

  return posts.map((post, index) => {
    const dayOffset = Math.floor(index / BLOG_PUBLISH_PER_DAY);
    const scheduled = new Date(base);
    scheduled.setUTCDate(scheduled.getUTCDate() + dayOffset);
    return {
      ...post,
      queueIndex: index,
      scheduledPublishAt: scheduled,
    };
  });
}
