import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveLegacyRedirect } from '@/lib/legacy-url-redirects';

/**
 * Edge proxy — Prisma Edge'de yok; DB redirect kuralları Node API üzerinden çözülür.
 * Resolve endpoint yalnızca x-middleware-fetch ile çağrılır.
 */
function sanitizeIndexNowKey(raw: string): string {
  return raw.trim().replace(/[^a-zA-Z0-9-]/g, '');
}

/** Next.js App Router flight/prefetch — tarayıcı `RSC` header gönderir; Googlebot göndermez. */
function isNextRscFlightRequest(request: NextRequest): boolean {
  if (request.headers.get('rsc') === '1') return true;
  if (request.headers.get('next-router-prefetch')) return true;
  if (request.headers.get('next-router-state-tree')) return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * `?_rsc=` Googlebot’a “Diğer dosya türü” olarak 200 dönüp crawl şişiriyor.
   * Gerçek Next flight isteği (RSC header) aynen geçer; botsuz istek → temiz URL’ye 308.
   */
  if (request.nextUrl.searchParams.has('_rsc') && !isNextRscFlightRequest(request)) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete('_rsc');
    return NextResponse.redirect(clean, 308);
  }

  const legacy = resolveLegacyRedirect(pathname);
  if (legacy) {
    const target = new URL(legacy.to, request.nextUrl.origin).toString();
    return NextResponse.redirect(target, legacy.permanent ? 308 : 307);
  }

  /**
   * IndexNow sahiplik dosyası — public/{key}.txt yoksa bile env ile sun.
   * build: `npm run indexnow:sync` dosyayı da yazar; bu katman runtime yedek.
   */
  const indexNowFile = pathname.match(/^\/([a-zA-Z0-9-]{8,128})\.txt$/);
  if (indexNowFile) {
    const fileKey = indexNowFile[1];
    const envRaw = process.env.INDEXNOW_KEY?.trim();
    const envKey = envRaw ? sanitizeIndexNowKey(envRaw) : '';
    if (envKey && envKey.length >= 8 && fileKey === envKey) {
      return new NextResponse(envKey, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'X-Robots-Tag': 'noindex',
        },
      });
    }
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
