import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Uptime / load balancer health.
 * DB ping başarısızsa 503 — secret yok (bilgi sızdırmaz).
 */
export async function GET() {
  const db = await checkDatabaseHealth();
  const body = {
    ok: db.healthy,
    service: 'zumrut-vadi-temizlik',
    dbLatencyMs: db.latency,
    ts: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    status: db.healthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
