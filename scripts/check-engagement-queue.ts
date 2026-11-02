import { PrismaClient } from '@prisma/client';

async function main() {
  const p = new PrismaClient();
  const now = new Date();
  try {
    for (const tag of ['otomatik yayın v4', 'otomatik yayın v5']) {
      const total = await p.blogPost.count({ where: { tags: { has: tag } } });
      const pub = await p.blogPost.count({ where: { tags: { has: tag }, published: true } });
      const queued = await p.blogPost.count({
        where: { tags: { has: tag }, published: false, scheduledPublishAt: { not: null } },
      });
      const due = await p.blogPost.count({
        where: { tags: { has: tag }, published: false, scheduledPublishAt: { lte: now } },
      });
      console.log(JSON.stringify({ tag, total, pub, queued, due }));
    }
    const engQueued = await p.blogPost.count({
      where: { published: false, scheduledPublishAt: { not: null } },
    });
    const engDue = await p.blogPost.count({
      where: { published: false, scheduledPublishAt: { lte: now } },
    });
    const next = await p.blogPost.findFirst({
      where: { published: false, scheduledPublishAt: { gt: now } },
      orderBy: { scheduledPublishAt: 'asc' },
      select: { slug: true, scheduledPublishAt: true, title: true },
    });
    const last = await p.blogPost.findFirst({
      where: { published: false, scheduledPublishAt: { not: null } },
      orderBy: { scheduledPublishAt: 'desc' },
      select: { slug: true, scheduledPublishAt: true },
    });
    console.log(JSON.stringify({ allScheduled: engQueued, dueNow: engDue, next, last }));
  } finally {
    await p.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
