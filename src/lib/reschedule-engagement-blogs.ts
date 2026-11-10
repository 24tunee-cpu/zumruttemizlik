import type { PrismaClient } from '@prisma/client';
import type { BlogSeedPost } from './seed-blog';
import {
  assignPublishSchedule,
  BLOG_ENGAGEMENT_PUBLISH_PER_DAY,
  BLOG_V4_SCHEDULE_ANCHOR_ISO,
  BLOG_V6_SCHEDULE_ANCHOR_ISO,
  BLOG_V7_PUBLISH_PER_DAY,
  BLOG_V7_SCHEDULE_ANCHOR_ISO,
} from './blog-schedule';

export type RescheduleEngagementResult = {
  total: number;
  days: number;
  firstPublishAt: string;
  lastPublishAt: string;
  v4Count: number;
  v5Count: number;
  v6Count?: number;
  v7Count?: number;
};

type DraftPost = {
  id: string;
  slug: string;
  createdAt: Date;
  tags: string[];
};

function isV4(tags: string[]): boolean {
  return tags.includes('otomatik yayın v4');
}

function isV5(tags: string[]): boolean {
  return tags.includes('otomatik yayın v5');
}

/**
 * v4 ve v5 taslaklarını birleşik kuyruğa alır — günde 10 yayın (v4/v5 interleave).
 * Sadece published:false yazılar güncellenir.
 */
export async function rescheduleEngagementBlogQueue(
  prisma: PrismaClient
): Promise<RescheduleEngagementResult> {
  const drafts = await prisma.blogPost.findMany({
    where: {
      published: false,
      OR: [
        { tags: { has: 'otomatik yayın v4' } },
        { tags: { has: 'otomatik yayın v5' } },
      ],
    },
    select: { id: true, slug: true, createdAt: true, tags: true },
    orderBy: { createdAt: 'asc' },
  });

  const v4Drafts = drafts.filter((d) => isV4(d.tags));
  const v5Drafts = drafts.filter((d) => isV5(d.tags));

  const queue = interleaveV4V5(v4Drafts, v5Drafts);

  const seedPosts: BlogSeedPost[] = queue.map((d) => ({
    slug: d.slug,
    title: d.slug,
    excerpt: '',
    content: '',
    category: 'Gündem',
    tags: ['istanbul'],
  }));

  const anchor = new Date(BLOG_V4_SCHEDULE_ANCHOR_ISO);
  const scheduled = assignPublishSchedule(seedPosts, {
    anchor,
    postsPerDay: BLOG_ENGAGEMENT_PUBLISH_PER_DAY,
  });

  for (let i = 0; i < queue.length; i++) {
    await prisma.blogPost.update({
      where: { id: queue[i].id },
      data: { scheduledPublishAt: scheduled[i].scheduledPublishAt },
    });
  }

  return {
    total: queue.length,
    days: Math.ceil(queue.length / BLOG_ENGAGEMENT_PUBLISH_PER_DAY) || 0,
    firstPublishAt: scheduled[0]?.scheduledPublishAt.toISOString() ?? '',
    lastPublishAt: scheduled[scheduled.length - 1]?.scheduledPublishAt.toISOString() ?? '',
    v4Count: v4Drafts.length,
    v5Count: v5Drafts.length,
  };
}

/**
 * v6 taslakları — günde 10, BLOG_V6_SCHEDULE_ANCHOR_ISO’dan itibaren.
 */
export async function scheduleV6EngagementQueue(
  prisma: PrismaClient
): Promise<RescheduleEngagementResult> {
  const drafts = await prisma.blogPost.findMany({
    where: {
      published: false,
      tags: { has: 'otomatik yayın v6' },
    },
    select: { id: true, slug: true, createdAt: true, tags: true },
    orderBy: { createdAt: 'asc' },
  });

  const seedPosts: BlogSeedPost[] = drafts.map((d) => ({
    slug: d.slug,
    title: d.slug,
    excerpt: '',
    content: '',
    category: 'Gündem',
    tags: ['istanbul'],
  }));

  const scheduled = assignPublishSchedule(seedPosts, {
    anchor: new Date(BLOG_V6_SCHEDULE_ANCHOR_ISO),
    postsPerDay: BLOG_ENGAGEMENT_PUBLISH_PER_DAY,
  });

  for (let i = 0; i < drafts.length; i++) {
    await prisma.blogPost.update({
      where: { id: drafts[i].id },
      data: { scheduledPublishAt: scheduled[i].scheduledPublishAt },
    });
  }

  return {
    total: drafts.length,
    days: Math.ceil(drafts.length / BLOG_ENGAGEMENT_PUBLISH_PER_DAY) || 0,
    firstPublishAt: scheduled[0]?.scheduledPublishAt.toISOString() ?? '',
    lastPublishAt: scheduled[scheduled.length - 1]?.scheduledPublishAt.toISOString() ?? '',
    v4Count: 0,
    v5Count: 0,
    v6Count: drafts.length,
  };
}

/**
 * v7 ticari/yerel taslaklar — günde 5, BLOG_V7_SCHEDULE_ANCHOR_ISO’dan.
 */
export async function scheduleV7CommercialQueue(
  prisma: PrismaClient
): Promise<RescheduleEngagementResult> {
  const drafts = await prisma.blogPost.findMany({
    where: {
      published: false,
      tags: { has: 'otomatik yayın v7' },
    },
    select: { id: true, slug: true, createdAt: true, tags: true },
    orderBy: { createdAt: 'asc' },
  });

  const seedPosts: BlogSeedPost[] = drafts.map((d) => ({
    slug: d.slug,
    title: d.slug,
    excerpt: '',
    content: '',
    category: 'Temizlik',
    tags: ['istanbul'],
  }));

  const scheduled = assignPublishSchedule(seedPosts, {
    anchor: new Date(BLOG_V7_SCHEDULE_ANCHOR_ISO),
    postsPerDay: BLOG_V7_PUBLISH_PER_DAY,
  });

  for (let i = 0; i < drafts.length; i++) {
    await prisma.blogPost.update({
      where: { id: drafts[i].id },
      data: { scheduledPublishAt: scheduled[i].scheduledPublishAt },
    });
  }

  return {
    total: drafts.length,
    days: Math.ceil(drafts.length / BLOG_V7_PUBLISH_PER_DAY) || 0,
    firstPublishAt: scheduled[0]?.scheduledPublishAt.toISOString() ?? '',
    lastPublishAt: scheduled[scheduled.length - 1]?.scheduledPublishAt.toISOString() ?? '',
    v4Count: 0,
    v5Count: 0,
    v7Count: drafts.length,
  };
}

/** v4 önce sıralanır; ardından v4/v5 çiftleri interleave, kalan v5 eklenir */
function interleaveV4V5(v4: DraftPost[], v5: DraftPost[]): DraftPost[] {
  const queue: DraftPost[] = [];
  let vi = 0;
  let v5i = 0;

  while (vi < v4.length || v5i < v5.length) {
    if (vi < v4.length) {
      queue.push(v4[vi++]);
    }
    if (v5i < v5.length) {
      queue.push(v5[v5i++]);
    }
  }

  return queue;
}
