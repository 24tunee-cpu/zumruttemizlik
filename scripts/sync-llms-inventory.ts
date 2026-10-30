/**
 * Build-time: DB'deki yayınlanmış blogları llms-full.txt envanterine yazar.
 * Vercel build FS yazılabilir; runtime cron yazmaz.
 */
import { PrismaClient } from '@prisma/client';
import { GEO_SSS_PAGES } from '../src/config/geo-district-faqs';
import {
  canWriteLlmsFiles,
  ensureGeoSssSectionInLlmsFull,
  syncPublishedBlogsToLlmsFull,
} from '../src/lib/geo-llms-sync';

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log('[llms:inventory] DATABASE_URL yok — atlandı');
    return;
  }

  if (!canWriteLlmsFiles()) {
    console.log('[llms:inventory] FS yazılamıyor — atlandı');
    return;
  }

  const prisma = new PrismaClient();
  try {
    const geo = ensureGeoSssSectionInLlmsFull(GEO_SSS_PAGES.map((p) => p.slug));
    console.log('[llms:inventory] geo-sss section:', geo);

    const blogs = await syncPublishedBlogsToLlmsFull(prisma);
    console.log('[llms:inventory] blog inventory:', blogs);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('[llms:inventory] hata (build devam eder):', e);
  process.exitCode = 0;
});
