/**
 * Vercel cron route'ları için ortak kimlik doğrulama.
 */
import type { NextRequest } from 'next/server';

export type CronAuthResult =
  | { ok: true; via: 'bearer' }
  | { ok: false; reason: 'no-secret' | 'unauthorized' };

export function authorizeCronRequest(request: NextRequest): CronAuthResult {
  const secrets = [
    process.env.CRON_SECRET?.trim(),
    process.env.MAPS_CRON_SECRET?.trim(),
  ].filter((s): s is string => Boolean(s));

  if (secrets.length === 0) {
    return { ok: false, reason: 'no-secret' };
  }

  const auth = request.headers.get('authorization');
  if (auth && secrets.some((secret) => auth === `Bearer ${secret}`)) {
    return { ok: true, via: 'bearer' };
  }

  return { ok: false, reason: 'unauthorized' };
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
