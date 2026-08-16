/**
 * SEO Autopilot izleme API — koşu geçmişi, kuyruk durumu, sağlık özeti.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/security';
import { getSeoAutopilotStatus } from '@/lib/seo-autopilot/status';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const denied = await requireAdminAuth(req);
  if (denied) return denied;

  try {
    const limitParam = req.nextUrl.searchParams.get('limit');
    const recentLimit = limitParam ? Math.min(30, Math.max(5, parseInt(limitParam, 10) || 14)) : 14;
    const payload = await getSeoAutopilotStatus(prisma, { recentLimit });
    return NextResponse.json(payload);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('[admin/seo-autopilot]', message);
    return NextResponse.json({ error: 'Autopilot durumu alınamadı' }, { status: 500 });
  }
}
