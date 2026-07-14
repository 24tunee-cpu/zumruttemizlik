import { NextRequest, NextResponse } from 'next/server';
import { publishScheduledBlogPosts } from '@/lib/publish-scheduled-posts';
import { prisma } from '@/lib/prisma';
import { syncPublishedBlogsToLlmsFull } from '@/lib/geo-llms-sync';
import { authorizeCronRequest, cronUnauthorizedResponse } from '@/lib/cron-auth';
import { getBlogScheduleHealth } from '@/lib/blog-schedule-preserve';
import { runFullGeoSync } from '@/lib/geo-citation';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function isMondayUtc(): boolean {
  return new Date().getUTCDay() === 1;
}

/**
 * Günlük otomatik blog yayını — günde en fazla 5 zamanlanmış yazı.
 * Pazartesi: GEO sync de çalışır (ayrı cron gerekmez — Hobby 2 cron limiti).
 * Vercel Cron: 05:00 UTC = 08:00 Türkiye (UTC+3)
 */
export async function GET(request: NextRequest) {
  const auth = authorizeCronRequest(request);
  if (!auth.ok) {
    return cronUnauthorizedResponse(auth.reason);
  }

  try {
    const healthBefore = await getBlogScheduleHealth(prisma);
    const result = await publishScheduledBlogPosts();
    const healthAfter = await getBlogScheduleHealth(prisma);

    let llmsSync: { blogCount: number; updated: boolean } | null = null;
    if (result.published > 0) {
      llmsSync = await syncPublishedBlogsToLlmsFull(prisma);
    }

    let geoSync: Awaited<ReturnType<typeof runFullGeoSync>> | null = null;
    if (isMondayUtc()) {
      geoSync = await runFullGeoSync(prisma, 'cron');
    }

    return NextResponse.json({
      ok: true,
      authVia: auth.via,
      published: result.published,
      slugs: result.slugs,
      remainingScheduled: result.remainingScheduled,
      internalLinksAdded: result.internalLinksAdded,
      indexNow: result.indexNow,
      healthBefore,
      healthAfter,
      llmsSync,
      geoSync: geoSync ? { auditScore: geoSync.audit.score, citationScore: geoSync.citation.overallScore } : null,
      publishedAt: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Blog publish failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
