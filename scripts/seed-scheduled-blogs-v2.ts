import { PrismaClient } from '@prisma/client';
import { upsertScheduledBlogV2 } from '../src/lib/seed-blog-v2';

async function run() {
  const prisma = new PrismaClient();
  try {
    const result = await upsertScheduledBlogV2(prisma);
    console.log('Scheduled blog v2 upsert complete:');
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((error) => {
  console.error('seed-scheduled-blogs-v2 failed:', error);
  process.exitCode = 1;
});
