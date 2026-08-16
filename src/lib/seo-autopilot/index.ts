import type { PrismaClient } from '@prisma/client';
import { publishScheduledBlogPosts } from '@/lib/publish-scheduled-posts';
import { applyLowCtrMetaAb } from '@/lib/gsc-meta-ab';
import { runSeoChecklistAutoSync } from '@/lib/gsc-sync';
import { syncPublishedBlogsToLlmsFull } from '@/lib/geo-llms-sync';
import { runFullGeoSync } from '@/lib/geo-citation';
import { publishScheduledGeoSss } from './tasks/publish-geo-sss';
import { createGscDraftBlogs, refreshStaleBlogs } from './tasks/blog-gsc-refresh';
import { syncTestimonialsFromMaps } from './tasks/testimonial-sync';
import { ensureSeasonalBlogDrafts } from './seasonal';
import { pingIndexNowForPaths } from './indexnow-batch';
import { AUTOPILOT_LIMITS } from './constants';

export type SeoAutopilotResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  warnings: string[];
  blog: Awaited<ReturnType<typeof publishScheduledBlogPosts>>;
  geoSss: Awaited<ReturnType<typeof publishScheduledGeoSss>>;
  gscDrafts: Awaited<ReturnType<typeof createGscDraftBlogs>>;
  blogRefresh: Awaited<ReturnType<typeof refreshStaleBlogs>>;
  seasonal: Awaited<ReturnType<typeof ensureSeasonalBlogDrafts>>;
  testimonials: Awaited<ReturnType<typeof syncTestimonialsFromMaps>>;
  metaAb: Awaited<ReturnType<typeof applyLowCtrMetaAb>>;
  indexNow: Awaited<ReturnType<typeof pingIndexNowForPaths>>;
  geoSync: Awaited<ReturnType<typeof runFullGeoSync>> | null;
  seoSync: Awaited<ReturnType<typeof runSeoChecklistAutoSync>> | null;
  llmsSync: Awaited<ReturnType<typeof syncPublishedBlogsToLlmsFull>> | null;
};

const STALE_RUN_MS = 90 * 60 * 1000;
const CONCURRENT_GUARD_MS = 55 * 60 * 1000;

function isMondayUtc(): boolean {
  return new Date().getUTCDay() === 1;
}

async function safeStep<T>(
  name: string,
  warnings: string[],
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    warnings.push(`${name}: ${message}`);
    console.error(`[seo-autopilot] ${name} failed:`, e);
    return fallback;
  }
}

async function acquireRun(prisma: PrismaClient): Promise<
  | { kind: 'skip'; reason: string }
  | { kind: 'run'; runId: string }
> {
  const staleBefore = new Date(Date.now() - STALE_RUN_MS);
  await prisma.seoAutopilotRun.updateMany({
    where: { status: 'running', startedAt: { lt: staleBefore } },
    data: {
      status: 'error',
      error: 'Stale run timeout — önceki koşu tamamlanamadı',
      finishedAt: new Date(),
    },
  });

  const concurrent = await prisma.seoAutopilotRun.findFirst({
    where: {
      status: 'running',
      startedAt: { gte: new Date(Date.now() - CONCURRENT_GUARD_MS) },
    },
    select: { id: true, startedAt: true },
  });

  if (concurrent) {
    return { kind: 'skip', reason: 'Başka bir autopilot koşusu devam ediyor' };
  }

  const run = await prisma.seoAutopilotRun.create({
    data: { status: 'running' },
  });

  return { kind: 'run', runId: run.id };
}

const emptyBlog = {
  published: 0,
  slugs: [] as string[],
  remainingScheduled: 0,
  internalLinksAdded: 0,
  indexNow: { ok: true, submitted: 0, skipped: true, reason: 'skipped' as const },
};

/**
 * Tam otomatik SEO autopilot — günlük cron ile sıfır manuel müdahale.
 * Kritik yayın görevleri dışındaki adımlar hata verse bile koşu devam eder.
 */
export async function runSeoAutopilot(prisma: PrismaClient): Promise<SeoAutopilotResult> {
  const warnings: string[] = [];
  const acquired = await acquireRun(prisma);

  if (acquired.kind === 'skip') {
    return {
      ok: true,
      skipped: true,
      reason: acquired.reason,
      warnings: [],
      blog: emptyBlog,
      geoSss: { published: 0, slugs: [] },
      gscDrafts: { created: 0, slugs: [], skipped: true },
      blogRefresh: { refreshed: 0, slugs: [] },
      seasonal: { created: 0, slugs: [] },
      testimonials: { synced: 0, skipped: true },
      metaAb: { programmaticUpdated: 0, blogUpdated: 0, skipped: true },
      indexNow: { ok: true, submitted: 0, skipped: true, reason: 'concurrent-skip' },
      geoSync: null,
      seoSync: null,
      llmsSync: null,
    };
  }

  const runId = acquired.runId;
  const indexPaths: string[] = [];

  try {
    const blog = await publishScheduledBlogPosts();
    for (const slug of blog.slugs) indexPaths.push(`/blog/${slug}`);

    const geoSss = await publishScheduledGeoSss(prisma);
    for (const slug of geoSss.slugs) indexPaths.push(`/geo-sss/${slug}`);

    const gscDrafts = await safeStep(
      'gscDrafts',
      warnings,
      () => createGscDraftBlogs(prisma),
      { created: 0, slugs: [], skipped: true }
    );

    const blogRefresh = await safeStep(
      'blogRefresh',
      warnings,
      () => refreshStaleBlogs(prisma),
      { refreshed: 0, slugs: [] }
    );
    for (const slug of blogRefresh.slugs) indexPaths.push(`/blog/${slug}`);

    const seasonal = await safeStep(
      'seasonal',
      warnings,
      () => ensureSeasonalBlogDrafts(prisma),
      { created: 0, slugs: [] }
    );

    const testimonials = isMondayUtc()
      ? await safeStep(
          'testimonials',
          warnings,
          () => syncTestimonialsFromMaps(prisma),
          { synced: 0, skipped: true }
        )
      : { synced: 0, skipped: true };

    const metaAb =
      AUTOPILOT_LIMITS.metaAbUpdates > 0
        ? await safeStep(
            'metaAb',
            warnings,
            () => applyLowCtrMetaAb(prisma, AUTOPILOT_LIMITS.metaAbUpdates),
            { programmaticUpdated: 0, blogUpdated: 0, skipped: true }
          )
        : { programmaticUpdated: 0, blogUpdated: 0, skipped: true };

    let llmsSync: SeoAutopilotResult['llmsSync'] = null;
    if (blog.published > 0 || geoSss.published > 0) {
      llmsSync = await safeStep('llmsSync', warnings, () => syncPublishedBlogsToLlmsFull(prisma), null);
    }

    let geoSync: SeoAutopilotResult['geoSync'] = null;
    let seoSync: SeoAutopilotResult['seoSync'] = null;
    if (isMondayUtc()) {
      geoSync = await safeStep('geoSync', warnings, () => runFullGeoSync(prisma, 'cron'), null);
      seoSync = await safeStep('seoSync', warnings, () => runSeoChecklistAutoSync('cron'), null);
    }

    const indexNow = await safeStep(
      'indexNow',
      warnings,
      () => pingIndexNowForPaths(indexPaths),
      { ok: false, submitted: 0, skipped: true, reason: 'error' }
    );

    const result: SeoAutopilotResult = {
      ok: warnings.length === 0,
      warnings,
      blog,
      geoSss,
      gscDrafts,
      blogRefresh,
      seasonal,
      testimonials,
      metaAb,
      indexNow,
      geoSync,
      seoSync,
      llmsSync,
    };

    const summary = {
      blogPublished: blog.published,
      blogSlugs: blog.slugs,
      geoSssPublished: geoSss.published,
      geoSssSlugs: geoSss.slugs,
      gscDraftsCreated: gscDrafts.created,
      blogsRefreshed: blogRefresh.refreshed,
      seasonalCreated: seasonal.created,
      testimonialsSynced: testimonials.synced,
      metaAb,
      indexNowSubmitted: indexNow.submitted,
      warnings,
    };

    await prisma.seoAutopilotRun.update({
      where: { id: runId },
      data: {
        status: warnings.length === 0 ? 'ok' : 'partial',
        finishedAt: new Date(),
        results: summary,
        error: warnings.length > 0 ? warnings.join(' | ') : null,
      },
    });

    return result;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'SeoAutopilot failed';
    await prisma.seoAutopilotRun.update({
      where: { id: runId },
      data: {
        status: 'error',
        error: message,
        finishedAt: new Date(),
        results: { warnings },
      },
    });
    throw e;
  }
}
