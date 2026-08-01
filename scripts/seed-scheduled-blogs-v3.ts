import { PrismaClient } from '@prisma/client';
import { upsertScheduledBlogV3 } from '../src/lib/seed-blog-v3';

async function run() {
  const prisma = new PrismaClient();
  try {
    const result = await upsertScheduledBlogV3(prisma);
    console.log('Scheduled blog v3 (Avrupa Yakası) upsert complete:');
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((error) => {
  console.error('seed-scheduled-blogs-v3 failed:', error);
  process.exitCode = 1;
});
