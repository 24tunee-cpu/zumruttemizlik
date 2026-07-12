import { NextRequest, NextResponse } from 'next/server';
import { publishScheduledBlogPosts } from '@/lib/publish-scheduled-posts';

export const dynamic = 'force-dynamic';

/**
 * Günlük otomatik blog yayını — günde en fazla 5 zamanlanmış yazı.
 * Vercel Cron: 05:00 UTC = 08:00 Türkiye (UTC+3)
 * Authorization: Bearer CRON_SECRET
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
    return NextResponse.json({
      ok: true,
      ...result,
      publishedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Blog publish failed' }, { status: 500 });
  }
}
