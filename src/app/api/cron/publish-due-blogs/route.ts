import { NextRequest, NextResponse } from 'next/server';
import { authorizeCronRequest, cronUnauthorizedResponse } from '@/lib/cron-auth';
import { publishScheduledBlogPosts } from '@/lib/publish-scheduled-posts';
import { getBlogScheduleHealth } from '@/lib/blog-schedule-preserve';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
/** Netlify scheduled function 30sn; bu rota yalnızca due blog yayınlar */
export const maxDuration = 60;

/**
 * Hafif drip yayın — tam SEO Autopilot değil.
 * Netlify schedule / dış cron: Bearer CRON_SECRET
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

    return NextResponse.json({
      ok: true,
      authVia: auth.via,
      published: result.published,
      slugs: result.slugs,
      remainingScheduled: result.remainingScheduled,
      indexNow: result.indexNow,
      webSub: result.webSub,
      healthBefore,
      healthAfter,
      publishedAt: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'publish-due-blogs failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
