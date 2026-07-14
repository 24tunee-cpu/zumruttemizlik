import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runFullGeoSync } from '@/lib/geo-citation';

export const dynamic = 'force-dynamic';

/** Haftalık GEO sync: audit + citation coverage + llms blog envanteri */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: 'Cron secret is not configured' }, { status: 500 });
  }

  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runFullGeoSync(prisma, 'cron');
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'GEO sync failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
