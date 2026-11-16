import { PrismaClient } from '@prisma/client';
import { upsertAndPublishBlogV10 } from '../src/lib/seed-blog-v10';
import { generateAllV10Posts } from '../src/lib/seed-blog-v10-content';
import { BLOG_SEED_POSTS } from '../src/lib/seed-blog';
import { generateAllV2Posts } from '../src/lib/seed-blog-v2-content';
import { generateAllV3Posts } from '../src/lib/seed-blog-v3-content';
import { generateAllV4Posts } from '../src/lib/seed-blog-v4-content';
import { generateAllV5Posts } from '../src/lib/seed-blog-v5-content';
import { generateAllV6Posts } from '../src/lib/seed-blog-v6-content';
import { generateAllV7Posts } from '../src/lib/seed-blog-v7-content';
import { generateAllV8Posts } from '../src/lib/seed-blog-v8-content';
import { generateAllV9Posts } from '../src/lib/seed-blog-v9-content';

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
    ...generateAllV7Posts().map((p) => p.slug),
    ...generateAllV8Posts().map((p) => p.slug),
    ...generateAllV9Posts().map((p) => p.slug),
  ]);
}

async function run() {
  const posts = generateAllV10Posts();
  if (posts.length !== 300) throw new Error(`count ${posts.length}`);

  const slugs = posts.map((p) => p.slug);
  if (new Set(slugs).size !== 300) throw new Error('duplicate slugs');
  const nonAscii = slugs.filter((s) => !/^[a-z0-9-]+$/.test(s));
  if (nonAscii.length) throw new Error(`non-ascii: ${nonAscii.slice(0, 5).join(', ')}`);
  const missingYear = slugs.filter((s) => !s.includes('2026'));
  if (missingYear.length) throw new Error(`missing 2026: ${missingYear.slice(0, 5).join(', ')}`);

  const overlap = slugs.filter((s) => priorSlugs().has(s));
  if (overlap.length) throw new Error(`overlap (${overlap.length}): ${overlap.slice(0, 8).join(', ')}`);

  const thin = posts.filter((p) => !p.content || p.content.length < 3500);
  if (thin.length) {
    throw new Error(`thin (${thin.length}): ${thin.slice(0, 5).map((p) => `${p.slug}:${p.content.length}`).join(', ')}`);
  }

  const prisma = new PrismaClient();
  try {
    const result = await upsertAndPublishBlogV10(prisma);
    console.log('V10 published immediately (no drip):');
    console.log(
      JSON.stringify(
        {
          total: result.total,
          created: result.created,
          updated: result.updated,
          skippedPublished: result.skippedPublished,
          indexNowSubmitted: result.indexNowSubmitted,
          sampleSlugs: result.publishedSlugs.slice(0, 8),
          avgContentLen: Math.round(
            posts.reduce((a, p) => a + p.content.length, 0) / posts.length
          ),
        },
        null,
        2
      )
    );
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((e) => {
  console.error('seed-publish-blogs-v10 failed:', e);
  process.exitCode = 1;
});
