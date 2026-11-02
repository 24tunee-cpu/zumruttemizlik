import { prisma } from '@/lib/prisma';
import { enrichBlogContentWithInternalLinks } from '@/lib/blog-publish-internal-links';
import { notifyContentDiscovery } from '@/lib/discovery-notify';
import type { IndexNowResult } from '@/lib/indexnow';
import type { WebSubResult } from '@/lib/websub';
import { safeRevalidatePath } from '@/lib/safe-revalidate';

/** Günlük otomatik blog yayın limiti (v4+v5 birleşik: 10/gün) */
export const BLOG_DAILY_PUBLISH_LIMIT = 10;

export type PublishScheduledResult = {
  published: number;
  slugs: string[];
  remainingScheduled: number;
  internalLinksAdded: number;
  indexNow: IndexNowResult;
  webSub: WebSubResult | null;
};

/**
 * Zamanı gelmiş taslakları açar — en fazla BLOG_DAILY_PUBLISH_LIMIT adet (FIFO).
 * Her yazıya deterministik iç link bloğu eklenir;
 * IndexNow + WebSub keşif ping’i + feed/sitemap revalidate.
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
    select: { id: true, slug: true, content: true },
  });

  if (due.length === 0) {
    const remainingScheduled = await prisma.blogPost.count({
      where: { published: false, scheduledPublishAt: { not: null } },
    });
    return {
      published: 0,
      slugs: [],
      remainingScheduled,
      internalLinksAdded: 0,
      indexNow: { ok: true, submitted: 0, skipped: true, reason: 'no-posts' },
      webSub: null,
    };
  }

  let internalLinksAdded = 0;
  const publishedSlugs: string[] = [];

  for (const post of due) {
    const { content, linksAdded } = await enrichBlogContentWithInternalLinks(prisma, {
      slug: post.slug,
      content: post.content,
    });
    internalLinksAdded += linksAdded;

    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        published: true,
        scheduledPublishAt: null,
        content,
      },
    });

    publishedSlugs.push(post.slug);
  }

  const paths = publishedSlugs.map((slug) => `/blog/${slug}`);
  const discovery = await notifyContentDiscovery({
    paths,
    pingFeeds: true,
    extraRevalidate: ['/blog', '/blog/sitemap.xml'],
  });

  for (const slug of publishedSlugs) {
    safeRevalidatePath(`/blog/${slug}`);
  }

  const remainingScheduled = await prisma.blogPost.count({
    where: { published: false, scheduledPublishAt: { not: null } },
  });

  return {
    published: publishedSlugs.length,
    slugs: publishedSlugs,
    remainingScheduled,
    internalLinksAdded,
    indexNow: discovery.indexNow,
    webSub: discovery.webSub,
  };
}
