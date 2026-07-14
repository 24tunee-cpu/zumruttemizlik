import { PrismaClient } from '@prisma/client';
import { publishScheduledBlogPosts } from '../src/lib/publish-scheduled-posts';
import { getBlogScheduleHealth } from '../src/lib/blog-schedule-preserve';

async function main() {
  const prisma = new PrismaClient();
  try {
    const before = await getBlogScheduleHealth(prisma);
    console.log('Before:', JSON.stringify(before, null, 2));
    const result = await publishScheduledBlogPosts();
    const after = await getBlogScheduleHealth(prisma);
    console.log('Publish result:', JSON.stringify(result, null, 2));
    console.log('After:', JSON.stringify(after, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
