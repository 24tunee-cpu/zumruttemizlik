/**
 * Vercel cron route'ları için ortak kimlik doğrulama.
 * - Bearer CRON_SECRET / MAPS_CRON_SECRET (timing-safe)
 * - Opsiyonel: CRON_REQUIRE_VERCEL_HEADER=1 iken x-vercel-cron zorunlu
 */
import { timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';

export type CronAuthResult =
  | { ok: true; via: 'bearer' | 'vercel-cron' }
  | { ok: false; reason: 'no-secret' | 'unauthorized' };

function safeEqualString(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, 'utf8');
    const bb = Buffer.from(b, 'utf8');
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

function extractBearer(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const m = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  return m?.[1]?.trim() || null;
}

export function authorizeCronRequest(request: NextRequest): CronAuthResult {
  const secrets = [
    process.env.CRON_SECRET?.trim(),
    process.env.MAPS_CRON_SECRET?.trim(),
  ].filter((s): s is string => Boolean(s));

  if (secrets.length === 0) {
    return { ok: false, reason: 'no-secret' };
  }

  const token = extractBearer(request.headers.get('authorization'));
  if (!token || !secrets.some((secret) => safeEqualString(token, secret))) {
    return { ok: false, reason: 'unauthorized' };
  }

  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const requireVercelHeader =
    process.env.CRON_REQUIRE_VERCEL_HEADER === '1' ||
    process.env.CRON_REQUIRE_VERCEL_HEADER === 'true';

  if (requireVercelHeader && process.env.VERCEL === '1' && !isVercelCron) {
    return { ok: false, reason: 'unauthorized' };
  }

  return { ok: true, via: isVercelCron ? 'vercel-cron' : 'bearer' };
}

export function cronUnauthorizedResponse(
  reason: 'no-secret' | 'unauthorized'
): Response {
  if (reason === 'no-secret') {
    return Response.json(
      {
        error:
          'CRON_SECRET tanımlı değil. Vercel → Settings → Environment Variables → CRON_SECRET ekleyin ve redeploy yapın.',
      },
      { status: 500 }
    );
  }
  return Response.json({ error: 'Unauthorized cron request' }, { status: 401 });
}
