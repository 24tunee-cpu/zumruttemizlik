import { NextResponse } from 'next/server';
import { getSiteUrl } from '@/lib/seo';

/** /feed → kanonik RSS */
export function GET() {
  return NextResponse.redirect(`${getSiteUrl()}/feed.xml`, 308);
}
