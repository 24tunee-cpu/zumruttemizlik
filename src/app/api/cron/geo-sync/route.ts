import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runFullGeoSync } from '@/lib/geo-citation';
import { authorizeCronRequest, cronUnauthorizedResponse } from '@/lib/cron-auth';

export const dynamic = 'force-dynamic';

/** Manuel GEO sync (haftalık otomasyon: Pazartesi publish-blogs cron içinde) */
export async function GET(request: NextRequest) {
  const auth = authorizeCronRequest(request);
  if (!auth.ok) {
    return cronUnauthorizedResponse(auth.reason);
  }

  try {
    const result = await runFullGeoSync(prisma, 'cron');
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'GEO sync failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
