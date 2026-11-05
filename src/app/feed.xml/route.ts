import { NextResponse } from 'next/server';
import {
  buildRssXml,
  emptyFeedFallback,
  feedResponseHeaders,
  fetchFeedPosts,
} from '@/lib/feeds';

/** ISR — literal zorunlu (Next segment config) */
export const revalidate = 86400;

export async function GET() {
  try {
    const posts = await fetchFeedPosts();
    return new NextResponse(buildRssXml(posts), {
      status: 200,
      headers: feedResponseHeaders('rss'),
    });
  } catch (error) {
    console.error('[feed.xml]', error instanceof Error ? error.message : error);
    return new NextResponse(emptyFeedFallback('rss'), {
      status: 200,
      headers: {
        ...feedResponseHeaders('rss'),
        'Cache-Control': 'public, max-age=60',
        'X-Feed-Degraded': '1',
      },
    });
  }
}
