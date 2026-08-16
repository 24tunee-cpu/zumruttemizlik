/**
 * SEO Autopilot ilk kurulum — geo-sss drip + karşılaştırma blog kuyruğu.
 * Bir kez çalıştırılır; cron günlük autopilot'u devralır.
 */
import { PrismaClient } from '@prisma/client';
import { bootstrapGeoSssDrip } from '../src/lib/seo-autopilot/geo-sss-seed';
import { bootstrapComparisonBlogs } from '../src/lib/seo-autopilot/comparison-seed';
import { fixKnownBadSlugs } from '../src/lib/seo-autopilot/fix-slugs';
import { validateAutopilotSlugs } from '../src/lib/seo-autopilot/validate-slugs';

async function run() {
  const validation = validateAutopilotSlugs();
  if (!validation.ok) {
    console.error('Slug doğrulama başarısız:\n', validation.errors.join('\n'));
    process.exitCode = 1;
    return;
  }

  const prisma = new PrismaClient();
  try {
    const slugFix = await fixKnownBadSlugs(prisma);
    if (slugFix.fixed.length > 0) {
      console.log('Slug düzeltmeleri:', slugFix.fixed);
    }

    const geoSss = await bootstrapGeoSssDrip(prisma);
    console.log('Geo-SSS drip:', geoSss);

    const comparisons = await bootstrapComparisonBlogs(prisma);
    console.log('Comparison blogs:', comparisons);

    console.log('\nSEO Autopilot bootstrap tamam. Günlük cron: /api/cron/publish-blogs');
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
