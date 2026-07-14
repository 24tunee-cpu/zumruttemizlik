import { NextRequest, NextResponse } from 'next/server';
import { runGoogleMapsSync } from '@/lib/google-maps-sync';
import { prisma } from '@/lib/prisma';
import { authorizeCronRequest, cronUnauthorizedResponse } from '@/lib/cron-auth';

export const dynamic = 'force-dynamic';

/**
 * Zamanlanmış Google Haritalar / GBP önbellek senkronu.
 * Blog yayını: /api/cron/publish-blogs
 */
export async function GET(request: NextRequest) {
  const auth = authorizeCronRequest(request);
  if (!auth.ok) {
    return cronUnauthorizedResponse(auth.reason);
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
