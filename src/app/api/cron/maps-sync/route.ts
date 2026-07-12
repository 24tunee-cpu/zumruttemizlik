import { NextRequest, NextResponse } from 'next/server';
import { runGoogleMapsSync } from '@/lib/google-maps-sync';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Zamanlanmış Google Haritalar / GBP önbellek senkronu.
 * Blog yayını ayrı cron: /api/cron/publish-blogs
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim() || process.env.MAPS_CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: 'Cron secret is not configured' }, { status: 500 });
  }

  const auth = request.headers.get('authorization');
  const okSecret = auth === `Bearer ${secret}`;
  if (!okSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conn = await prisma.mapOAuthConnection.findUnique({ where: { provider: 'google' } });
  if (!conn?.refreshTokenEnc) {
    return NextResponse.json({
      skipped: true,
      reason: 'Google bağlı değil.',
    });
  }

  const result = await runGoogleMapsSync('cron');
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
