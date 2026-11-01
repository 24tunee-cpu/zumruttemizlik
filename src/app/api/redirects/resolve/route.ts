import { NextRequest, NextResponse } from 'next/server';
import { resolveRedirectRule } from '@/lib/redirect-resolve-cache';
import { checkRateLimit, getClientIp } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * Proxy (Edge) → Node resolve. Harici abuse'u sınırlamak için:
 * - x-middleware-fetch: 1 zorunlu (proxy marker)
 * - rate limit (IP)
 */
export async function GET(request: NextRequest) {
  const fromProxy = request.headers.get('x-middleware-fetch') === '1';
  if (!fromProxy) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(`redirect-resolve:${ip}`, 120, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const path = request.nextUrl.searchParams.get('path') || '';
  if (!path.startsWith('/') || path.length > 512) {
    return NextResponse.json({ redirect: null }, { status: 200 });
  }

  try {
    const rule = await resolveRedirectRule(path);
    if (!rule) {
      return NextResponse.json(
        { redirect: null, permanent: false },
        { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
      );
    }
    return NextResponse.json(
      { redirect: rule.toPath, permanent: rule.permanent },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    );
  } catch {
    return NextResponse.json({ redirect: null }, { status: 200 });
  }
}
