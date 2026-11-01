import { NextResponse } from 'next/server';
import {
  buildRssXml,
  emptyFeedFallback,
  feedCacheHeaders,
  fetchFeedPosts,
} from '@/lib/feeds';

/** ISR — literal zorunlu (Next segment config) */
export const revalidate = 3600;

export async function GET() {
  try {
    const posts = await fetchFeedPosts();
    return new NextResponse(buildRssXml(posts), {
      status: 200,
      headers: feedCacheHeaders.rss,
    });
  } catch (error) {
    console.error('[feed.xml]', error instanceof Error ? error.message : error);
    return new NextResponse(emptyFeedFallback('rss'), {
      status: 200,
      headers: {
        ...feedCacheHeaders.rss,
        'Cache-Control': 'public, max-age=60',
        'X-Feed-Degraded': '1',
      },
    });
  }
}
