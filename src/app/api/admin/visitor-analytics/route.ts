import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/security';
import { locationLabel } from '@/lib/visitor-geo';
import { deviceTypeLabel, formatDuration } from '@/lib/visitor-device';
import {
  attributionFromStoredSession,
  channelLabel,
} from '@/lib/visitor-attribution';

const ACTIVE_MS = 5 * 60 * 1000;

export async function GET(request: NextRequest) {
  const denied = await requireAdminAuth(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const days = Math.min(30, Math.max(1, Number(url.searchParams.get('days') || 7)));
  const sessionId = url.searchParams.get('sessionId');
  const channelFilter = url.searchParams.get('channel')?.trim() || '';
  const searchFilter = url.searchParams.get('q')?.trim().toLowerCase() || '';
  const includeBots = url.searchParams.get('bots') === 'include';

  try {
    if (sessionId) {
      const session = await prisma.visitorSession.findUnique({
        where: { id: sessionId },
        include: {
          events: { orderBy: { createdAt: 'asc' }, take: 300 },
        },
      });
      if (!session) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      const journey = buildJourney(session.events);
      return NextResponse.json({
        session: serializeSession(session),
        events: session.events.map(serializeEvent),
        journey,
      });
    }

    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const activeSince = new Date(Date.now() - ACTIVE_MS);

    const sessionWhere = {
      startedAt: { gte: from },
      ...(channelFilter ? { trafficChannel: channelFilter } : {}),
      ...(includeBots ? {} : { isBot: false }),
    };

    const eventSessionFilter = includeBots
      ? { session: { startedAt: { gte: from } } }
      : { session: { startedAt: { gte: from }, isBot: false } };

    const [
      totalSessions,
      activeNow,
      totalPageViews,
      avgDurationAgg,
      avgEngagedAgg,
      bounceCount,
      conversionAgg,
      botCount,
      deviceGroups,
      cityGroupsRaw,
      pageGroupsRaw,
      channelGroupsRaw,
      sourceGroupsRaw,
      searchGroupsRaw,
      referrerGroupsRaw,
      landingGroupsRaw,
      conversionGroupsRaw,
      sessionsForChart,
      sessionsForHourly,
      sessionsRaw,
    ] = await Promise.all([
      prisma.visitorSession.count({ where: sessionWhere }),
      prisma.visitorSession.count({
        where: {
          isActive: true,
          lastSeenAt: { gte: activeSince },
          ...(includeBots ? {} : { isBot: false }),
        },
      }),
      prisma.visitorSession.aggregate({
        where: sessionWhere,
        _sum: { pageViews: true },
      }),
      prisma.visitorSession.aggregate({
        where: sessionWhere,
        _avg: { durationSec: true },
      }),
      prisma.visitorSession.aggregate({
        where: sessionWhere,
        _avg: { engagedSec: true },
      }),
      prisma.visitorSession.count({
        where: { ...sessionWhere, isBounce: true },
      }),
      prisma.visitorSession.aggregate({
        where: sessionWhere,
        _sum: { conversionCount: true },
      }),
      prisma.visitorSession.count({
        where: { startedAt: { gte: from }, isBot: true },
      }),
      prisma.visitorSession.groupBy({
        by: ['deviceType'],
        where: sessionWhere,
        _count: { _all: true },
      }),
      prisma.visitorSession.groupBy({
        by: ['city', 'countryCode', 'country'],
        where: { ...sessionWhere, city: { not: null } },
        _count: { _all: true },
      }),
      prisma.visitorEvent.groupBy({
        by: ['path'],
        where: {
          kind: 'page_view',
          createdAt: { gte: from },
          path: { not: null },
          ...eventSessionFilter,
        },
        _count: { _all: true },
      }),
      prisma.visitorSession.groupBy({
        by: ['trafficChannel'],
        where: sessionWhere,
        _count: { _all: true },
      }),
      prisma.visitorSession.groupBy({
        by: ['trafficSource'],
        where: { ...sessionWhere, trafficSource: { not: null } },
        _count: { _all: true },
      }),
      prisma.visitorSession.groupBy({
        by: ['searchQuery'],
        where: { ...sessionWhere, searchQuery: { not: null } },
        _count: { _all: true },
      }),
      prisma.visitorSession.groupBy({
        by: ['referrerHost'],
        where: { ...sessionWhere, referrerHost: { not: null } },
        _count: { _all: true },
      }),
      prisma.visitorSession.groupBy({
        by: ['landingPath'],
        where: { ...sessionWhere, landingPath: { not: null } },
        _count: { _all: true },
      }),
      prisma.visitorEvent.groupBy({
        by: ['label'],
        where: {
          kind: 'conversion',
          createdAt: { gte: from },
          label: { not: null },
          ...eventSessionFilter,
        },
        _count: { _all: true },
      }),
      prisma.visitorSession.findMany({
        where: sessionWhere,
        select: { startedAt: true },
      }),
      prisma.visitorSession.findMany({
        where: sessionWhere,
        select: { startedAt: true },
        orderBy: { startedAt: 'desc' },
        take: 5000,
      }),
      prisma.visitorSession.findMany({
        where: sessionWhere,
        orderBy: { lastSeenAt: 'desc' },
        take: 200,
        include: {
          events: { orderBy: { createdAt: 'desc' }, take: 12 },
        },
      }),
    ]);

    let sessions = sessionsRaw.map((s) => ({
      ...s,
      serialized: serializeSession(s),
    }));

    if (searchFilter) {
      sessions = sessions.filter(({ serialized }) => {
        const hay = [
          serialized.attribution.summary,
          serialized.attribution.searchQuery,
          serialized.landingPath,
          serialized.referrer,
          serialized.location,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(searchFilter);
      });
    }

    const cityGroups = [...cityGroupsRaw]
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 12);
    const pageGroups = [...pageGroupsRaw]
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 12);

    const channelGroups = enrichChannelGroups(channelGroupsRaw, sessionsRaw);
    const topSources = [...sourceGroupsRaw]
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 12)
      .map((g) => ({ label: g.trafficSource || 'Bilinmiyor', count: g._count._all }));
    const topSearchTerms = [...searchGroupsRaw]
      .filter((g) => g.searchQuery?.trim())
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 15)
      .map((g) => ({ term: g.searchQuery!, count: g._count._all }));
    const topReferrers = [...referrerGroupsRaw]
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 12)
      .map((g) => ({ host: g.referrerHost!, count: g._count._all }));
    const topLandings = [...landingGroupsRaw]
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 12)
      .map((g) => ({ path: g.landingPath!, count: g._count._all }));
    const topConversions = [...conversionGroupsRaw]
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 10)
      .map((g) => ({ label: g.label!, count: g._count._all }));

    const chart = buildDailyChart(sessionsForChart, days, from);
    const hourlyChart = buildHourlyChart(sessionsForHourly);

    const totalConversions = conversionAgg._sum.conversionCount ?? 0;
    const avgEngagedSec = Math.round(avgEngagedAgg._avg.engagedSec ?? 0);

    const mobileCount =
      deviceGroups.find((g) => g.deviceType === 'mobile')?._count._all ?? 0;
    const desktopCount =
      deviceGroups.find((g) => g.deviceType === 'desktop')?._count._all ?? 0;
    const tabletCount =
      deviceGroups.find((g) => g.deviceType === 'tablet')?._count._all ?? 0;

    const organicCount =
      channelGroups.find((c) => c.channel === 'organic')?.count ?? 0;

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      rangeDays: days,
      filters: { channel: channelFilter || null, q: searchFilter || null, includeBots },
      summary: {
        totalSessions,
        activeNow,
        totalPageViews: totalPageViews._sum.pageViews ?? 0,
        avgDurationSec: Math.round(avgDurationAgg._avg.durationSec ?? 0),
        avgDurationLabel: formatDuration(Math.round(avgDurationAgg._avg.durationSec ?? 0)),
        avgEngagedSec,
        avgEngagedLabel: formatDuration(avgEngagedSec),
        totalConversions,
        conversionRatePct: totalSessions
          ? Math.round((totalConversions / totalSessions) * 100)
          : 0,
        bounceCount,
        bounceRatePct: totalSessions ? Math.round((bounceCount / totalSessions) * 100) : 0,
        botCount,
        mobilePct: totalSessions ? Math.round((mobileCount / totalSessions) * 100) : 0,
        desktopPct: totalSessions ? Math.round((desktopCount / totalSessions) * 100) : 0,
        tabletPct: totalSessions ? Math.round((tabletCount / totalSessions) * 100) : 0,
        organicPct: totalSessions ? Math.round((organicCount / totalSessions) * 100) : 0,
      },
      chart,
      hourlyChart,
      topChannels: channelGroups,
      topSources,
      topSearchTerms,
      topReferrers,
      topLandings,
      topConversions,
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
      sessions: sessions.map(({ serialized, events }) => ({
        ...serialized,
        recentEvents: events.map(serializeEvent),
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Analytics load failed' }, { status: 500 });
  }
}

function enrichChannelGroups(
  raw: Array<{ trafficChannel: string | null; _count: { _all: number } }>,
  allSessions: Array<{ referrer: string | null; landingUrl: string | null; trafficChannel: string | null }>
) {
  const map = new Map<string, number>();

  for (const g of raw) {
    if (g.trafficChannel) map.set(g.trafficChannel, g._count._all);
  }

  for (const s of allSessions) {
    if (s.trafficChannel) continue;
    const ch = attributionFromStoredSession(s).channel;
    map.set(ch, (map.get(ch) ?? 0) + 1);
  }

  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([channel, count]) => ({
      channel,
      label: channelLabel(channel),
      count,
    }));
}

function buildJourney(
  events: Array<{
    kind: string;
    path: string | null;
    label: string | null;
    targetUrl: string | null;
    metadata: unknown;
    createdAt: Date;
  }>
) {
  const pages: string[] = [];
  for (const ev of events) {
    if (ev.kind === 'page_view' && ev.path && !pages.includes(ev.path)) {
      pages.push(ev.path);
    }
  }
  return { pages, steps: events.length };
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
  landingUrl: string | null;
  exitPath: string | null;
  referrerHost: string | null;
  trafficChannel: string | null;
  trafficSource: string | null;
  searchQuery: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  pageViews: number;
  durationSec: number;
  engagedSec: number;
  maxScrollPct: number;
  clickCount: number;
  conversionCount: number;
  isBot: boolean;
  isBounce: boolean | null;
  isActive: boolean;
  lastSeenAt: Date;
  startedAt: Date;
  endedAt: Date | null;
}) {
  const attribution = attributionFromStoredSession(s);
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
    landingUrl: s.landingUrl,
    exitPath: s.exitPath,
    pageViews: s.pageViews,
    durationSec: s.durationSec,
    durationLabel: formatDuration(s.durationSec),
    engagedSec: s.engagedSec ?? 0,
    engagedLabel: formatDuration(s.engagedSec ?? 0),
    maxScrollPct: s.maxScrollPct,
    clickCount: s.clickCount,
    conversionCount: s.conversionCount ?? 0,
    isBot: s.isBot ?? false,
    isBounce: s.isBounce ?? null,
    isActive: s.isActive,
    lastSeenAt: s.lastSeenAt.toISOString(),
    startedAt: s.startedAt.toISOString(),
    endedAt: s.endedAt?.toISOString() ?? null,
    visitorKey: s.visitorKey.slice(0, 8),
    attribution: {
      channel: attribution.channel,
      channelLabel: attribution.channelLabel,
      source: attribution.source,
      sourceLabel: attribution.sourceLabel,
      searchQuery: attribution.searchQuery,
      referrerHost: attribution.referrerHost,
      summary: attribution.summary,
      utmSource: attribution.utmSource,
      utmMedium: attribution.utmMedium,
      utmCampaign: attribution.utmCampaign,
      utmTerm: attribution.utmTerm,
      utmContent: attribution.utmContent,
    },
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

function buildHourlyChart(sessions: { startedAt: Date }[]) {
  const now = new Date();
  const from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const labels: string[] = [];
  const values: number[] = [];
  const keys: string[] = [];

  for (let h = 23; h >= 0; h--) {
    const d = new Date(now);
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() - h);
    const key = `${d.toISOString().slice(0, 13)}`;
    keys.push(key);
    labels.push(d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    values.push(0);
  }

  const idx = new Map(keys.map((k, i) => [k, i] as const));
  for (const s of sessions) {
    if (s.startedAt < from) continue;
    const k = s.startedAt.toISOString().slice(0, 13);
    const ix = idx.get(k);
    if (ix !== undefined) values[ix] += 1;
  }

  return { labels, values, title: 'Son 24 saat (saatlik oturum)' };
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
