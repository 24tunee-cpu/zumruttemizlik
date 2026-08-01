import { NextRequest, NextResponse } from 'next/server';
import { resolveRedirectRule } from '@/lib/redirect-resolve-cache';

export const dynamic = 'force-dynamic';

/**
 * Middleware ve harici tüketiciler için hafif yönlendirme çözümü.
 * Kurallar bellek önbelleğinden okunur (5 dk TTL).
 */
export async function GET(request: NextRequest) {
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
