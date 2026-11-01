import { NextResponse } from 'next/server';
import {
  buildJsonFeed,
  feedCacheHeaders,
  fetchFeedPosts,
} from '@/lib/feeds';
import { SITE_CONTACT } from '@/config/site-contact';
import { getSiteUrl } from '@/lib/seo';

export const revalidate = 3600;

export async function GET() {
  try {
    const posts = await fetchFeedPosts();
    return NextResponse.json(buildJsonFeed(posts), {
      status: 200,
      headers: feedCacheHeaders.json,
    });
  } catch (error) {
    console.error('[feed.json]', error instanceof Error ? error.message : error);
    const base = getSiteUrl();
    return NextResponse.json(
      {
        version: 'https://jsonfeed.org/version/1.1',
        title: SITE_CONTACT.companyName,
        home_page_url: `${base}/blog`,
        feed_url: `${base}/feed.json`,
        description: 'Feed geçici olarak kullanılamıyor',
        items: [],
      },
      {
        status: 200,
        headers: {
          ...feedCacheHeaders.json,
          'Cache-Control': 'public, max-age=60',
          'X-Feed-Degraded': '1',
        },
      }
    );
  }
}
