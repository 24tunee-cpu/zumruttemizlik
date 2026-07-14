import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const now = new Date();
  try {
    const nextDue = await prisma.blogPost.findMany({
      where: { published: false, scheduledPublishAt: { not: null } },
      orderBy: { scheduledPublishAt: 'asc' },
      take: 10,
      select: { slug: true, scheduledPublishAt: true, published: true, title: true },
    });
    const overdue = await prisma.blogPost.count({
      where: { published: false, scheduledPublishAt: { lte: now } },
    });
    const scheduled = await prisma.blogPost.count({
      where: { published: false, scheduledPublishAt: { not: null } },
    });
    const noSchedule = await prisma.blogPost.count({
      where: { published: false, scheduledPublishAt: null },
    });
    const v2Drafts = await prisma.blogPost.count({
      where: {
        published: false,
        tags: { has: 'otomatik yayın v2' },
      },
    });
    const v2Published = await prisma.blogPost.count({
      where: { published: true, tags: { has: 'otomatik yayın v2' } },
    });
    console.log(
      JSON.stringify(
        {
          now: now.toISOString(),
          overdue,
          scheduled,
          noSchedule,
          v2Drafts,
          v2Published,
          nextDue: nextDue.map((p) => ({
            slug: p.slug,
            at: p.scheduledPublishAt?.toISOString(),
          })),
        },
        null,
        2
      )
    );
  } finally {
    await prisma.$disconnect();
  }
}

main();
