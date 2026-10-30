import { PrismaClient } from '@prisma/client';
import { scheduleV6EngagementQueue } from '../src/lib/reschedule-engagement-blogs';
import { upsertScheduledBlogV6 } from '../src/lib/seed-blog-v6';
import { generateAllV6Posts } from '../src/lib/seed-blog-v6-content';

async function run() {
  const posts = generateAllV6Posts();
  if (posts.length !== 100) throw new Error(`count ${posts.length}`);
  const slugs = posts.map((p) => p.slug);
  const nonAscii = slugs.filter((s) => !/^[a-z0-9-]+$/.test(s));
  if (nonAscii.length) throw new Error(`non-ascii: ${nonAscii.join(', ')}`);
  const noYear = slugs.filter((s) => !/-20\d{2}$/.test(s) && !s.includes('2026'));
  // slug must contain 2026 somewhere (year marker)
  const missingYear = slugs.filter((s) => !s.includes('2026'));
  if (missingYear.length) throw new Error(`missing 2026: ${missingYear.join(', ')}`);
  if (new Set(slugs).size !== 100) throw new Error('duplicate slugs in v6');

  const prisma = new PrismaClient();
  try {
    const upsert = await upsertScheduledBlogV6(prisma);
    console.log('Scheduled blog v6 upsert:');
    console.log(JSON.stringify(upsert, null, 2));

    const schedule = await scheduleV6EngagementQueue(prisma);
    console.log('V6 queue scheduled (10/day from 2026-10-31):');
    console.log(JSON.stringify(schedule, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((error) => {
  console.error('seed-scheduled-blogs-v6 failed:', error);
  process.exitCode = 1;
});
