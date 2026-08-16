/**
 * Manuel SEO Autopilot test koşusu — cron olmadan doğrudan çalıştırır.
 */
import { PrismaClient } from '@prisma/client';
import { runSeoAutopilot } from '../src/lib/seo-autopilot';

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('SEO Autopilot test koşusu başlıyor…\n');
    const result = await runSeoAutopilot(prisma);

    const summary = {
      ok: result.ok,
      skipped: result.skipped,
      reason: result.reason,
      warnings: result.warnings,
      blog: {
        published: result.blog.published,
        slugs: result.blog.slugs,
        remainingScheduled: result.blog.remainingScheduled,
      },
      geoSss: result.geoSss,
      gscDrafts: result.gscDrafts,
      blogRefresh: result.blogRefresh,
      seasonal: result.seasonal,
      testimonials: result.testimonials,
      metaAb: result.metaAb,
      indexNow: result.indexNow,
      geoSync: result.geoSync ? 'ran' : null,
      seoSync: result.seoSync ? 'ran' : null,
      llmsSync: result.llmsSync ? 'ran' : null,
    };

    console.log(JSON.stringify(summary, null, 2));
    console.log('\nTest koşusu tamamlandı.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
