import type { PrismaClient } from '@prisma/client';
import { AUTOPILOT_LIMITS } from './constants';

export type AutopilotRunResults = {
  blogPublished?: number;
  blogSlugs?: string[];
  geoSssPublished?: number;
  geoSssSlugs?: string[];
  gscDraftsCreated?: number;
  blogsRefreshed?: number;
  seasonalCreated?: number;
  testimonialsSynced?: number;
  indexNowSubmitted?: number;
  warnings?: string[];
};

export type AutopilotRunRow = {
  id: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  durationMs: number | null;
  error: string | null;
  results: AutopilotRunResults | null;
};

export type AutopilotHealth = 'healthy' | 'warning' | 'error' | 'unknown' | 'running';

export type AutopilotStatusPayload = {
  generatedAt: string;
  health: AutopilotHealth;
  healthMessage: string;
  cronScheduleUtc: string;
  cronScheduleTr: string;
  limits: typeof AUTOPILOT_LIMITS;
  lastRun: AutopilotRunRow | null;
  recentRuns: AutopilotRunRow[];
  queues: {
    blogsScheduled: number;
    blogsDueNow: number;
    blogsNextPublishAt: string | null;
    geoSssScheduled: number;
    geoSssPublishedTotal: number;
    geoSssDueNow: number;
    geoSssNextPublishAt: string | null;
  };
  stats7d: {
    runsTotal: number;
    runsOk: number;
    runsPartial: number;
    runsError: number;
    blogsPublished: number;
    geoSssPublished: number;
  };
};

function parseResults(raw: unknown): AutopilotRunResults | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  return {
    blogPublished: typeof r.blogPublished === 'number' ? r.blogPublished : undefined,
    blogSlugs: Array.isArray(r.blogSlugs) ? (r.blogSlugs as string[]) : undefined,
    geoSssPublished: typeof r.geoSssPublished === 'number' ? r.geoSssPublished : undefined,
    geoSssSlugs: Array.isArray(r.geoSssSlugs) ? (r.geoSssSlugs as string[]) : undefined,
    gscDraftsCreated: typeof r.gscDraftsCreated === 'number' ? r.gscDraftsCreated : undefined,
    blogsRefreshed: typeof r.blogsRefreshed === 'number' ? r.blogsRefreshed : undefined,
    seasonalCreated: typeof r.seasonalCreated === 'number' ? r.seasonalCreated : undefined,
    testimonialsSynced: typeof r.testimonialsSynced === 'number' ? r.testimonialsSynced : undefined,
    indexNowSubmitted: typeof r.indexNowSubmitted === 'number' ? r.indexNowSubmitted : undefined,
    warnings: Array.isArray(r.warnings) ? (r.warnings as string[]) : undefined,
  };
}

function mapRun(row: {
  id: string;
  status: string;
  startedAt: Date;
  finishedAt: Date | null;
  error: string | null;
  results: unknown;
}): AutopilotRunRow {
  const durationMs =
    row.finishedAt != null ? row.finishedAt.getTime() - row.startedAt.getTime() : null;
  return {
    id: row.id,
    status: row.status,
    startedAt: row.startedAt.toISOString(),
    finishedAt: row.finishedAt?.toISOString() ?? null,
    durationMs,
    error: row.error,
    results: parseResults(row.results),
  };
}

function computeHealth(
  lastRun: AutopilotRunRow | null,
  now: Date
): { health: AutopilotHealth; healthMessage: string } {
  if (!lastRun) {
    return {
      health: 'unknown',
      healthMessage: 'Henüz autopilot koşusu kaydı yok — ilk cron 08:00 TR’de çalışacak.',
    };
  }

  if (lastRun.status === 'running') {
    const ageMs = now.getTime() - new Date(lastRun.startedAt).getTime();
    if (ageMs < 90 * 60 * 1000) {
      return { health: 'running', healthMessage: 'Autopilot şu an çalışıyor…' };
    }
    return {
      health: 'warning',
      healthMessage: 'Son koşu 90 dakikadan uzun süredir “running” — stale run temizlenecek.',
    };
  }

  if (lastRun.status === 'error') {
    return {
      health: 'error',
      healthMessage: lastRun.error || 'Son koşu hata ile bitti.',
    };
  }

  const finishedAt = lastRun.finishedAt ? new Date(lastRun.finishedAt) : null;
  const hoursSinceFinish = finishedAt
    ? (now.getTime() - finishedAt.getTime()) / (1000 * 60 * 60)
    : Infinity;

  if (hoursSinceFinish > 28) {
    return {
      health: 'warning',
      healthMessage: `Son başarılı koşu ${Math.round(hoursSinceFinish)} saat önce — cron kontrol edin.`,
    };
  }

  if (lastRun.status === 'partial' || (lastRun.results?.warnings?.length ?? 0) > 0) {
    const w = lastRun.results?.warnings?.[0];
    return {
      health: 'warning',
      healthMessage: w ? `Kısmi başarı: ${w}` : 'Son koşu kısmi başarı ile tamamlandı.',
    };
  }

  return {
    health: 'healthy',
    healthMessage: 'Autopilot düzgün çalışıyor — son koşu başarılı.',
  };
}

export async function getSeoAutopilotStatus(
  prisma: PrismaClient,
  opts?: { recentLimit?: number }
): Promise<AutopilotStatusPayload> {
  const now = new Date();
  const recentLimit = opts?.recentLimit ?? 14;
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    recentRunsRaw,
    blogsScheduled,
    blogsDueNow,
    blogsNext,
    geoSssScheduled,
    geoSssPublishedTotal,
    geoSssDueNow,
    geoSssNext,
    runs7d,
  ] = await Promise.all([
    prisma.seoAutopilotRun.findMany({
      orderBy: { startedAt: 'desc' },
      take: recentLimit,
      select: {
        id: true,
        status: true,
        startedAt: true,
        finishedAt: true,
        error: true,
        results: true,
      },
    }),
    prisma.blogPost.count({
      where: { published: false, scheduledPublishAt: { not: null } },
    }),
    prisma.blogPost.count({
      where: { published: false, scheduledPublishAt: { lte: now } },
    }),
    prisma.blogPost.findFirst({
      where: { published: false, scheduledPublishAt: { gt: now } },
      orderBy: { scheduledPublishAt: 'asc' },
      select: { scheduledPublishAt: true },
    }),
    prisma.geoSssContent.count({
      where: { published: false, scheduledPublishAt: { not: null } },
    }),
    prisma.geoSssContent.count({ where: { published: true } }),
    prisma.geoSssContent.count({
      where: { published: false, scheduledPublishAt: { lte: now } },
    }),
    prisma.geoSssContent.findFirst({
      where: { published: false, scheduledPublishAt: { gt: now } },
      orderBy: { scheduledPublishAt: 'asc' },
      select: { scheduledPublishAt: true },
    }),
    prisma.seoAutopilotRun.findMany({
      where: { startedAt: { gte: sevenDaysAgo } },
      select: { status: true, results: true },
    }),
  ]);

  const recentRuns = recentRunsRaw.map(mapRun);
  const lastRun = recentRuns[0] ?? null;
  const { health, healthMessage } = computeHealth(lastRun, now);

  let runsOk = 0;
  let runsPartial = 0;
  let runsError = 0;
  let blogsPublished7d = 0;
  let geoSssPublished7d = 0;

  for (const r of runs7d) {
    if (r.status === 'ok') runsOk++;
    else if (r.status === 'partial') runsPartial++;
    else if (r.status === 'error') runsError++;

    const parsed = parseResults(r.results);
    blogsPublished7d += parsed?.blogPublished ?? 0;
    geoSssPublished7d += parsed?.geoSssPublished ?? 0;
  }

  return {
    generatedAt: now.toISOString(),
    health,
    healthMessage,
    cronScheduleUtc: '0 5 * * * (05:00 UTC)',
    cronScheduleTr: 'Her gün 08:00 (Türkiye)',
    limits: AUTOPILOT_LIMITS,
    lastRun,
    recentRuns,
    queues: {
      blogsScheduled,
      blogsDueNow,
      blogsNextPublishAt: blogsNext?.scheduledPublishAt?.toISOString() ?? null,
      geoSssScheduled,
      geoSssPublishedTotal,
      geoSssDueNow,
      geoSssNextPublishAt: geoSssNext?.scheduledPublishAt?.toISOString() ?? null,
    },
    stats7d: {
      runsTotal: runs7d.length,
      runsOk,
      runsPartial,
      runsError,
      blogsPublished: blogsPublished7d,
      geoSssPublished: geoSssPublished7d,
    },
  };
}
