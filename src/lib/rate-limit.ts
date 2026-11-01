/**
 * Rate limit — Upstash Redis REST varsa dağıtık, yoksa in-memory fallback.
 * Ek npm paketi yok; yalnızca UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
 */
import { checkRateLimit as checkMemoryRateLimit } from '@/lib/security';

export type DistributedRateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  backend: 'upstash' | 'memory';
};

function upstashConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
}

async function upstashFixedWindow(
  identifier: string,
  maxRequests: number,
  windowMs: number
): Promise<DistributedRateLimitResult | null> {
  const base = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!base || !token) return null;

  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  const bucket = Math.floor(Date.now() / windowMs);
  const key = `zvt:rl:${identifier}:${bucket}`;

  try {
    const res = await fetch(`${base}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, String(windowSec)],
      ]),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ result?: number }>;
    const count = Number(data?.[0]?.result ?? 0);
    const resetTime = (bucket + 1) * windowMs;
    return {
      allowed: count <= maxRequests,
      remaining: Math.max(0, maxRequests - count),
      resetTime,
      backend: 'upstash',
    };
  } catch {
    return null;
  }
}

/** Async rate limit — Upstash yoksa / hata olursa memory. */
export async function checkDistributedRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): Promise<DistributedRateLimitResult> {
  if (upstashConfigured()) {
    const remote = await upstashFixedWindow(identifier, maxRequests, windowMs);
    if (remote) return remote;
  }

  const mem = checkMemoryRateLimit(identifier, maxRequests, windowMs);
  return {
    allowed: mem.allowed,
    remaining: mem.remaining,
    resetTime: mem.resetTime,
    backend: 'memory',
  };
}
