import { prisma } from '@/lib/prisma';

type RedirectHit = { toPath: string; permanent: boolean };

let cachedAt = 0;
let byPath = new Map<string, RedirectHit>();

/** DB yükünü azaltır — proxy her istekte Prisma çağırmaz */
const CACHE_TTL_MS = 5 * 60 * 1000;

export function invalidateRedirectCache() {
  cachedAt = 0;
  byPath = new Map();
}

async function ensureRedirectCache() {
  const now = Date.now();
  if (cachedAt && now - cachedAt < CACHE_TTL_MS) return;

  const rows = await prisma.redirectRule.findMany({
    where: { active: true },
    select: { fromPath: true, toPath: true, permanent: true },
  });

  byPath = new Map(
    rows.map((r) => [r.fromPath, { toPath: r.toPath, permanent: r.permanent }])
  );
  cachedAt = now;
}

export async function resolveRedirectRule(path: string): Promise<RedirectHit | null> {
  await ensureRedirectCache();
  return byPath.get(path) ?? null;
}
