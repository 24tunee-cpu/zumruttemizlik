import { NextResponse } from 'next/server';
import {
  buildAtomXml,
  emptyFeedFallback,
  feedCacheHeaders,
  fetchFeedPosts,
} from '@/lib/feeds';

export const revalidate = 3600;

export async function GET() {
  try {
    const posts = await fetchFeedPosts();
    return new NextResponse(buildAtomXml(posts), {
      status: 200,
      headers: feedCacheHeaders.atom,
    });
  } catch (error) {
    console.error('[atom.xml]', error instanceof Error ? error.message : error);
    return new NextResponse(emptyFeedFallback('atom'), {
      status: 200,
      headers: {
        ...feedCacheHeaders.atom,
        'Cache-Control': 'public, max-age=60',
        'X-Feed-Degraded': '1',
      },
    });
  }
}
