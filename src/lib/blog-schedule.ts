import type { BlogSeedPost } from './seed-blog';

/** Sabit kuyruk başlangıcı — re-seed takvimi sıfırlamaz (13 Tem 2026 ilk gün) */
export const BLOG_SCHEDULE_ANCHOR_ISO = '2026-07-13T00:00:00.000Z';

/** Günlük otomatik yayın adedi */
export const BLOG_PUBLISH_PER_DAY = 5;

/** Vercel cron UTC — Türkiye 08:00 (UTC+3) */
export const BLOG_PUBLISH_HOUR_UTC = 5;

/** Yazılar gün başında "due" — cron saati geldiğinde kesin yakalanır */
export const BLOG_SCHEDULE_DUE_HOUR_UTC = 0;

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

/**
 * Kuyruktaki her yazıya gün slotu atar (günde 5 yazı, gün başı UTC due).
 */
export function assignPublishSchedule(
  posts: BlogSeedPost[],
  options?: { startFrom?: Date; anchor?: Date }
): ScheduledBlogPost[] {
  const base = options?.anchor ?? options?.startFrom ?? new Date(BLOG_SCHEDULE_ANCHOR_ISO);
  const anchor = new Date(base);
  anchor.setUTCHours(BLOG_SCHEDULE_DUE_HOUR_UTC, 0, 0, 0);

  return posts.map((post, index) => {
    const dayOffset = Math.floor(index / BLOG_PUBLISH_PER_DAY);
    const scheduled = new Date(anchor);
    scheduled.setUTCDate(scheduled.getUTCDate() + dayOffset);
    return {
      ...post,
      queueIndex: index,
      scheduledPublishAt: scheduled,
    };
  });
}
