import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeCronRequest, cronUnauthorizedResponse } from '@/lib/cron-auth';
import { getBlogScheduleHealth } from '@/lib/blog-schedule-preserve';
import { runSeoAutopilot } from '@/lib/seo-autopilot';

export const dynamic = 'force-dynamic';
/** Pro planda 300sn; Hobby'de platform 60sn ile sınırlar */
export const maxDuration = 300;

/**
 * Günlük SEO Autopilot — blog + geo-sss + GSC + refresh + mevsim + IndexNow.
 * Vercel Cron: 05:00 UTC = 08:00 Türkiye
 */
export async function GET(request: NextRequest) {
  const auth = authorizeCronRequest(request);
  if (!auth.ok) {
    return cronUnauthorizedResponse(auth.reason);
  }

  try {
    const healthBefore = await getBlogScheduleHealth(prisma);
    const autopilot = await runSeoAutopilot(prisma);
    const healthAfter = await getBlogScheduleHealth(prisma);

    return NextResponse.json({
      ok: true,
      authVia: auth.via,
      skipped: autopilot.skipped ?? false,
      reason: autopilot.reason,
      warnings: autopilot.warnings,
      autopilot: {
        blogPublished: autopilot.blog.published,
        blogSlugs: autopilot.blog.slugs,
        geoSssPublished: autopilot.geoSss.published,
        geoSssSlugs: autopilot.geoSss.slugs,
        gscDraftsCreated: autopilot.gscDrafts.created,
        blogsRefreshed: autopilot.blogRefresh.refreshed,
        seasonalCreated: autopilot.seasonal.created,
        testimonialsSynced: autopilot.testimonials.synced,
        metaAb: autopilot.metaAb,
        indexNow: autopilot.indexNow,
        llmsSync: autopilot.llmsSync,
        geoSync: autopilot.geoSync
          ? { auditScore: autopilot.geoSync.audit.score, citationScore: autopilot.geoSync.citation.overallScore }
          : null,
        seoSync: autopilot.seoSync
          ? { ok: autopilot.seoSync.ok, stats: autopilot.seoSync.stats }
          : null,
      },
      healthBefore,
      healthAfter,
      publishedAt: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'SEO Autopilot failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
