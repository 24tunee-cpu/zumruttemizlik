import { PrismaClient } from '@prisma/client';
import { rescheduleEngagementBlogQueue } from '../src/lib/reschedule-engagement-blogs';
import { upsertScheduledBlogV5 } from '../src/lib/seed-blog-v5';

async function run() {
  const prisma = new PrismaClient();
  try {
    const upsert = await upsertScheduledBlogV5(prisma);
    console.log('Scheduled blog v5 (İstanbul gündem) upsert complete:');
    console.log(JSON.stringify(upsert, null, 2));

    const schedule = await rescheduleEngagementBlogQueue(prisma);
    console.log('Engagement blog queue rescheduled (v4+v5):');
    console.log(JSON.stringify(schedule, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((error) => {
  console.error('seed-scheduled-blogs-v5 failed:', error);
  process.exitCode = 1;
});
