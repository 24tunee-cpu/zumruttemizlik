import { PrismaClient } from '@prisma/client';
import { upsertScheduledBlogV4 } from '../src/lib/seed-blog-v4';

async function run() {
  const prisma = new PrismaClient();
  try {
    const result = await upsertScheduledBlogV4(prisma);
    console.log('Scheduled blog v4 (İstanbul yaşam) upsert complete:');
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((error) => {
  console.error('seed-scheduled-blogs-v4 failed:', error);
  process.exitCode = 1;
});
