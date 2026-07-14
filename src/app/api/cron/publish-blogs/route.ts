import { NextRequest, NextResponse } from 'next/server';
import { publishScheduledBlogPosts } from '@/lib/publish-scheduled-posts';
import { prisma } from '@/lib/prisma';
import { syncPublishedBlogsToLlmsFull } from '@/lib/geo-llms-sync';

export const dynamic = 'force-dynamic';

/**
 * Günlük otomatik blog yayını — günde en fazla 5 zamanlanmış yazı.
 * Yayın sonrası llms-full.txt blog envanteri güncellenir (GEO).
 * Vercel Cron: 05:00 UTC = 08:00 Türkiye (UTC+3)
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: 'Cron secret is not configured' }, { status: 500 });
  }

  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await publishScheduledBlogPosts();
    let llmsSync: { blogCount: number; updated: boolean } | null = null;
    if (result.published > 0) {
      llmsSync = await syncPublishedBlogsToLlmsFull(prisma);
    }
    return NextResponse.json({
      ok: true,
      ...result,
      llmsSync,
      publishedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Blog publish failed' }, { status: 500 });
  }
}
