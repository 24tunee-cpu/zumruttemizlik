import { prisma } from '../src/lib/prisma';

async function main() {
  const all = await prisma.blogPost.findMany({
    select: {
      slug: true,
      published: true,
      scheduledPublishAt: true,
      title: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const now = new Date();
  const published = all.filter((p) => p.published);
  const drafts = all.filter((p) => !p.published);
  const dueDrafts = drafts.filter((p) => p.scheduledPublishAt && p.scheduledPublishAt <= now);

  console.log('Total:', all.length);
  console.log('Published:', published.length);
  console.log('Drafts:', drafts.length);
  console.log('Due but unpublished:', dueDrafts.length);

  console.log('\n--- Due but unpublished (all) ---');
  for (const p of dueDrafts) {
    console.log(`${p.scheduledPublishAt?.toISOString().slice(0, 10)} | ${p.slug}`);
  }

  const futureScheduled = drafts.filter((p) => p.scheduledPublishAt && p.scheduledPublishAt > now);
  console.log('\nFuture scheduled drafts:', futureScheduled.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
