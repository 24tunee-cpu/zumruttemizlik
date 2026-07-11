import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/security';
import { locationLabel } from '@/lib/visitor-geo';
import { deviceTypeLabel, formatDuration } from '@/lib/visitor-device';

const ACTIVE_MS = 5 * 60 * 1000;

export async function GET(request: NextRequest) {
  const denied = await requireAdminAuth(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const days = Math.min(30, Math.max(1, Number(url.searchParams.get('days') || 7)));
  const sessionId = url.searchParams.get('sessionId');

  try {
    if (sessionId) {
      const session = await prisma.visitorSession.findUnique({
        where: { id: sessionId },
        include: {
          events: { orderBy: { createdAt: 'asc' }, take: 200 },
        },
      });
      if (!session) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json({
        session: serializeSession(session),
        events: session.events.map(serializeEvent),
      });
    }

    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const activeSince = new Date(Date.now() - ACTIVE_MS);

    const [
      totalSessions,
      activeNow,
      totalPageViews,
      avgDurationAgg,
      deviceGroups,
      cityGroupsRaw,
      pageGroupsRaw,
      sessionsForChart,
      sessions,
    ] = await Promise.all([
      prisma.visitorSession.count({ where: { startedAt: { gte: from } } }),
      prisma.visitorSession.count({
        where: { isActive: true, lastSeenAt: { gte: activeSince } },
      }),
      prisma.visitorSession.aggregate({
        where: { startedAt: { gte: from } },
        _sum: { pageViews: true },
      }),
      prisma.visitorSession.aggregate({
        where: { startedAt: { gte: from } },
        _avg: { durationSec: true },
      }),
      prisma.visitorSession.groupBy({
        by: ['deviceType'],
        where: { startedAt: { gte: from } },
        _count: { _all: true },
      }),
      prisma.visitorSession.groupBy({
        by: ['city', 'countryCode', 'country'],
        where: { startedAt: { gte: from }, city: { not: null } },
        _count: { _all: true },
      }),
      prisma.visitorEvent.groupBy({
        by: ['path'],
        where: {
          kind: 'page_view',
          createdAt: { gte: from },
          path: { not: null },
        },
        _count: { _all: true },
      }),
      prisma.visitorSession.findMany({
        where: { startedAt: { gte: from } },
        select: { startedAt: true },
      }),
      prisma.visitorSession.findMany({
        where: { startedAt: { gte: from } },
        orderBy: { lastSeenAt: 'desc' },
        take: 150,
        include: {
          events: { orderBy: { createdAt: 'desc' }, take: 8 },
        },
      }),
    ]);

    const cityGroups = [...cityGroupsRaw]
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 12);
    const pageGroups = [...pageGroupsRaw]
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 10);

    const chart = buildDailyChart(sessionsForChart, days, from);

    const mobileCount =
      deviceGroups.find((g) => g.deviceType === 'mobile')?._count._all ?? 0;
    const desktopCount =
      deviceGroups.find((g) => g.deviceType === 'desktop')?._count._all ?? 0;
    const tabletCount =
      deviceGroups.find((g) => g.deviceType === 'tablet')?._count._all ?? 0;

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      rangeDays: days,
      summary: {
        totalSessions,
        activeNow,
        totalPageViews: totalPageViews._sum.pageViews ?? 0,
        avgDurationSec: Math.round(avgDurationAgg._avg.durationSec ?? 0),
        avgDurationLabel: formatDuration(Math.round(avgDurationAgg._avg.durationSec ?? 0)),
        mobilePct: totalSessions ? Math.round((mobileCount / totalSessions) * 100) : 0,
        desktopPct: totalSessions ? Math.round((desktopCount / totalSessions) * 100) : 0,
        tabletPct: totalSessions ? Math.round((tabletCount / totalSessions) * 100) : 0,
      },
      chart,
      topCities: cityGroups.map((g) => ({
        label: locationLabel({
          city: g.city,
          region: null,
          country: g.country,
          countryCode: g.countryCode,
        }),
        count: g._count._all,
      })),
      topPages: pageGroups
        .filter((g) => g.path)
        .map((g) => ({ path: g.path!, count: g._count._all })),
      deviceBreakdown: deviceGroups.map((g) => ({
        type: g.deviceType || 'unknown',
        label: deviceTypeLabel(g.deviceType),
        count: g._count._all,
      })),
      sessions: sessions.map((s) => ({
        ...serializeSession(s),
        recentEvents: s.events.map(serializeEvent),
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Analytics load failed' }, { status: 500 });
  }
}

function serializeSession(s: {
  id: string;
  sessionKey: string;
  visitorKey: string;
  country: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
  deviceType: string | null;
  os: string | null;
  browser: string | null;
  screenWidth: number | null;
  screenHeight: number | null;
  language: string | null;
  referrer: string | null;
  landingPath: string | null;
  exitPath: string | null;
  pageViews: number;
  durationSec: number;
  maxScrollPct: number;
  clickCount: number;
  isActive: boolean;
  lastSeenAt: Date;
  startedAt: Date;
  endedAt: Date | null;
}) {
  return {
    id: s.id,
    location: locationLabel(s),
    countryCode: s.countryCode,
    city: s.city,
    region: s.region,
    deviceType: s.deviceType,
    deviceLabel: deviceTypeLabel(s.deviceType),
    os: s.os,
    browser: s.browser,
    screen: s.screenWidth && s.screenHeight ? `${s.screenWidth}×${s.screenHeight}` : null,
    language: s.language,
    referrer: s.referrer,
    landingPath: s.landingPath,
    exitPath: s.exitPath,
    pageViews: s.pageViews,
    durationSec: s.durationSec,
    durationLabel: formatDuration(s.durationSec),
    maxScrollPct: s.maxScrollPct,
    clickCount: s.clickCount,
    isActive: s.isActive,
    lastSeenAt: s.lastSeenAt.toISOString(),
    startedAt: s.startedAt.toISOString(),
    endedAt: s.endedAt?.toISOString() ?? null,
    visitorKey: s.visitorKey.slice(0, 8),
  };
}

function serializeEvent(e: {
  id: string;
  kind: string;
  path: string | null;
  label: string | null;
  targetUrl: string | null;
  metadata: unknown;
  createdAt: Date;
}) {
  return {
    id: e.id,
    kind: e.kind,
    path: e.path,
    label: e.label,
    targetUrl: e.targetUrl,
    metadata: e.metadata,
    createdAt: e.createdAt.toISOString(),
  };
}

function buildDailyChart(
  sessions: { startedAt: Date }[],
  days: number,
  from: Date
) {
  const labels: string[] = [];
  const values: number[] = [];
  const keys: string[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    keys.push(key);
    labels.push(
      d.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' })
    );
    values.push(0);
  }

  const idx = new Map(keys.map((k, i) => [k, i] as const));
  for (const s of sessions) {
    if (s.startedAt < from) continue;
    const k = s.startedAt.toISOString().slice(0, 10);
    const ix = idx.get(k);
    if (ix !== undefined) values[ix] += 1;
  }

  return { labels, values, title: `Ziyaretçi oturumları (son ${days} gün)` };
}
