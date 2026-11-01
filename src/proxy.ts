import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveLegacyRedirect } from '@/lib/legacy-url-redirects';

/**
 * Edge proxy — Prisma Edge'de yok; DB redirect kuralları Node API üzerinden çözülür.
 * Resolve endpoint yalnızca x-middleware-fetch ile çağrılır.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const legacy = resolveLegacyRedirect(pathname);
  if (legacy) {
    const target = new URL(legacy.to, request.nextUrl.origin).toString();
    return NextResponse.redirect(target, legacy.permanent ? 308 : 307);
  }

  const isSitemapPath = pathname === '/sitemap.xml' || pathname.endsWith('/sitemap.xml');
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/robots.txt' ||
    isSitemapPath ||
    /\.[a-zA-Z0-9]{1,8}$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  try {
    const url = new URL('/api/redirects/resolve', request.nextUrl.origin);
    url.searchParams.set('path', pathname);
    const res = await fetch(url.toString(), {
      headers: {
        'x-middleware-fetch': '1',
        'x-internal-redirect': process.env.CRON_SECRET?.trim() || '1',
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return NextResponse.next();
    const data = (await res.json()) as { redirect?: string | null; permanent?: boolean };
    if (!data.redirect || typeof data.redirect !== 'string') {
      return NextResponse.next();
    }
    const target = data.redirect.startsWith('http')
      ? data.redirect
      : new URL(data.redirect, request.nextUrl.origin).toString();
    return NextResponse.redirect(target, data.permanent ? 308 : 307);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|.*sitemap\\.xml$).*)'],
};
