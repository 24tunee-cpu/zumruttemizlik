import { PrismaClient } from '@prisma/client';
import { scheduleV7CommercialQueue } from '../src/lib/reschedule-engagement-blogs';
import { upsertScheduledBlogV7 } from '../src/lib/seed-blog-v7';
import { generateAllV7Posts } from '../src/lib/seed-blog-v7-content';
import { BLOG_SEED_POSTS } from '../src/lib/seed-blog';
import { generateAllV2Posts } from '../src/lib/seed-blog-v2-content';
import { generateAllV3Posts } from '../src/lib/seed-blog-v3-content';
import { generateAllV4Posts } from '../src/lib/seed-blog-v4-content';
import { generateAllV5Posts } from '../src/lib/seed-blog-v5-content';
import { generateAllV6Posts } from '../src/lib/seed-blog-v6-content';

function priorSlugs(): Set<string> {
  return new Set([
    ...BLOG_SEED_POSTS.map((p) => p.slug),
    ...generateAllV2Posts().seo.map((p) => p.slug),
    ...generateAllV2Posts().pricing.map((p) => p.slug),
    ...generateAllV3Posts().seo.map((p) => p.slug),
    ...generateAllV3Posts().pricing.map((p) => p.slug),
    ...generateAllV4Posts().map((p) => p.slug),
    ...generateAllV5Posts().map((p) => p.slug),
    ...generateAllV6Posts().map((p) => p.slug),
  ]);
}

async function run() {
  const posts = generateAllV7Posts();
  if (posts.length !== 100) throw new Error(`count ${posts.length}`);

  const slugs = posts.map((p) => p.slug);
  const nonAscii = slugs.filter((s) => !/^[a-z0-9-]+$/.test(s));
  if (nonAscii.length) throw new Error(`non-ascii: ${nonAscii.join(', ')}`);

  const missingYear = slugs.filter((s) => !s.includes('2026'));
  if (missingYear.length) throw new Error(`missing 2026: ${missingYear.join(', ')}`);

  if (new Set(slugs).size !== 100) throw new Error('duplicate slugs in v7');

  const prior = priorSlugs();
  const overlap = slugs.filter((s) => prior.has(s));
  if (overlap.length) throw new Error(`overlap with prior packs: ${overlap.join(', ')}`);

  const empty = posts.filter((p) => !p.content || p.content.length < 800);
  if (empty.length) {
    throw new Error(`thin content: ${empty.map((p) => p.slug).join(', ')}`);
  }

  // Positive peyzaj offer only — "yoktur / sunmaz / dahil değil" OK
  const badPeyzaj = posts.filter((p) => {
    const text = `${p.title}\n${p.content}`;
    return (
      /peyzaj\s+(hizmeti|paketi)\s+(sun|ver|yap|dahil)/i.test(text) ||
      /bahçe düzenleme\s+(hizmet|paket)\s+(sun|ver|yap|dahil)/i.test(text) ||
      /peyzaj mimarisi\s+(hizmet|sun)/i.test(text)
    );
  });
  if (badPeyzaj.length) {
    throw new Error(`peyzaj claim: ${badPeyzaj.map((p) => p.slug).join(', ')}`);
  }

  const prisma = new PrismaClient();
  try {
    const upsert = await upsertScheduledBlogV7(prisma);
    console.log('Scheduled blog v7 upsert:');
    console.log(JSON.stringify(upsert, null, 2));

    const schedule = await scheduleV7CommercialQueue(prisma);
    console.log('V7 queue scheduled (5/day from 2026-11-11):');
    console.log(JSON.stringify(schedule, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((error) => {
  console.error('seed-scheduled-blogs-v7 failed:', error);
  process.exitCode = 1;
});
