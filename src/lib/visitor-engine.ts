import type { Prisma, VisitorSession } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';
import { geoFromRequest } from '@/lib/visitor-geo';
import { parseUserAgent } from '@/lib/visitor-device';
import { resolveVisitorAttribution } from '@/lib/visitor-attribution';
import { isLikelyBot } from '@/lib/visitor-bot';
import {
  classifyConversionClick,
  type ConversionType,
  CONVERSION_LABELS,
} from '@/lib/visitor-conversions';

export const TRACK_KINDS = new Set([
  'session_start',
  'page_view',
  'page_exit',
  'click',
  'scroll',
  'conversion',
  'heartbeat',
  'session_end',
]);

export type TrackPayload = {
  kind: string;
  sessionKey: string;
  visitorKey: string;
  path?: string | null;
  pageTitle?: string | null;
  referrer?: string | null;
  landingUrl?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  language?: string | null;
  screenWidth?: number | null;
  screenHeight?: number | null;
  durationSec?: number | null;
  engagedSec?: number | null;
  scrollPct?: number | null;
  timeOnPageSec?: number | null;
  clickLabel?: string | null;
  clickUrl?: string | null;
  clickSource?: string | null;
  conversionType?: string | null;
};

function hashIp(ip: string): string {
  const salt = process.env.NEXTAUTH_SECRET || 'visitor-track-salt';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 24);
}

function jsonMeta(value: Record<string, unknown> | undefined): Prisma.InputJsonValue | undefined {
  if (!value || Object.keys(value).length === 0) return undefined;
  return value as Prisma.InputJsonValue;
}

async function bootstrapSession(
  payload: TrackPayload,
  request: NextRequest,
  ip: string
): Promise<VisitorSession> {
  const ua = (request.headers.get('user-agent') || '').slice(0, 500);
  const device = parseUserAgent(ua);
  const geo = geoFromRequest(request);
  const bot = isLikelyBot(ua);

  const attribution = resolveVisitorAttribution({
    referrer: payload.referrer,
    landingUrl: payload.landingUrl,
    utmSource: payload.utmSource,
    utmMedium: payload.utmMedium,
    utmCampaign: payload.utmCampaign,
    utmTerm: payload.utmTerm,
    utmContent: payload.utmContent,
  });

  const session = await prisma.visitorSession.create({
    data: {
      sessionKey: payload.sessionKey,
      visitorKey: payload.visitorKey,
      country: geo.country,
      countryCode: geo.countryCode,
      region: geo.region,
      city: geo.city,
      deviceType: device.deviceType,
      os: device.os,
      browser: device.browser,
      screenWidth: payload.screenWidth ?? undefined,
      screenHeight: payload.screenHeight ?? undefined,
      language: payload.language,
      referrer: payload.referrer,
      landingPath: payload.path,
      landingUrl: payload.landingUrl || undefined,
      referrerHost: attribution.referrerHost,
      trafficChannel: attribution.channel,
      trafficSource: attribution.sourceLabel,
      searchQuery: attribution.searchQuery,
      utmSource: attribution.utmSource,
      utmMedium: attribution.utmMedium,
      utmCampaign: attribution.utmCampaign,
      utmTerm: attribution.utmTerm,
      utmContent: attribution.utmContent,
      exitPath: payload.path,
      pageViews: 1,
      durationSec: 0,
      engagedSec: payload.engagedSec ?? 0,
      userAgent: ua || null,
      ipHash: hashIp(ip),
      isBot: bot,
      isActive: true,
      lastSeenAt: new Date(),
    },
  });

  await prisma.visitorEvent.create({
    data: {
      sessionDbId: session.id,
      kind: 'page_view',
      path: payload.path,
      label: payload.pageTitle,
      metadata: jsonMeta({
        entry: true,
        bootstrapped: true,
        channel: attribution.channel,
        source: attribution.sourceLabel,
        searchQuery: attribution.searchQuery,
      }),
    },
  });

  return session;
}

export async function processVisitorTrackEvent(
  payload: TrackPayload,
  request: NextRequest,
  ip: string
): Promise<{ ok: true; created?: boolean }> {
  let session = await prisma.visitorSession.findUnique({
    where: { sessionKey: payload.sessionKey },
  });

  if (!session && payload.kind !== 'session_end') {
    session = await bootstrapSession(payload, request, ip);
    if (payload.kind === 'session_start') {
      return { ok: true, created: true };
    }
    if (payload.kind === 'page_view') {
      await prisma.visitorSession.update({
        where: { id: session.id },
        data: {
          lastSeenAt: new Date(),
          exitPath: payload.path,
          ...(payload.durationSec != null ? { durationSec: payload.durationSec } : {}),
          ...(payload.engagedSec != null ? { engagedSec: payload.engagedSec } : {}),
        },
      });
      return { ok: true };
    }
  }

  if (!session) {
    throw new Error('SESSION_NOT_FOUND');
  }

  const now = new Date();
  const kind = payload.kind;
  const conversionFromClick =
    kind === 'click'
      ? classifyConversionClick(payload.clickUrl, payload.clickLabel, payload.clickSource)
      : null;
  const conversionType =
    (payload.conversionType as ConversionType | null) || conversionFromClick;

  const updateData: Prisma.VisitorSessionUpdateInput = {
    lastSeenAt: now,
    isActive: kind !== 'session_end',
  };

  if (payload.path) updateData.exitPath = payload.path;
  if (payload.durationSec != null) updateData.durationSec = payload.durationSec;
  if (payload.engagedSec != null && payload.engagedSec > (session.engagedSec ?? 0)) {
    updateData.engagedSec = payload.engagedSec;
  }
  if (
    payload.scrollPct != null &&
    payload.scrollPct > session.maxScrollPct
  ) {
    updateData.maxScrollPct = payload.scrollPct;
  }
  if (kind === 'page_view') {
    updateData.pageViews = { increment: 1 };
  }
  if (kind === 'click') {
    updateData.clickCount = { increment: 1 };
  }
  if (kind === 'conversion' || conversionType) {
    updateData.conversionCount = { increment: 1 };
  }
  if (kind === 'session_end') {
    updateData.endedAt = now;
    updateData.isActive = false;
    updateData.isBounce =
      session.pageViews <= 1 &&
      (session.conversionCount ?? 0) === 0 &&
      !conversionType;
  }

  await prisma.visitorSession.update({
    where: { id: session.id },
    data: updateData,
  });

  if (kind === 'page_view' || kind === 'page_exit') {
    await prisma.visitorEvent.create({
      data: {
        sessionDbId: session.id,
        kind,
        path: payload.path,
        label: payload.pageTitle,
        metadata: jsonMeta({
          ...(kind === 'page_exit' && payload.timeOnPageSec != null
            ? { timeOnPageSec: payload.timeOnPageSec }
            : {}),
          ...(payload.scrollPct != null ? { scrollPct: payload.scrollPct } : {}),
        }),
      },
    });
  }

  if (kind === 'click') {
    await prisma.visitorEvent.create({
      data: {
        sessionDbId: session.id,
        kind: 'click',
        path: payload.path,
        label: payload.clickLabel,
        targetUrl: payload.clickUrl,
        metadata: jsonMeta({
          source: payload.clickSource,
          conversion: conversionType,
        }),
      },
    });
    if (conversionType) {
      await prisma.visitorEvent.create({
        data: {
          sessionDbId: session.id,
          kind: 'conversion',
          path: payload.path,
          label: CONVERSION_LABELS[conversionType],
          targetUrl: payload.clickUrl,
          metadata: jsonMeta({ type: conversionType }),
        },
      });
    }
  }

  if (kind === 'scroll') {
    await prisma.visitorEvent.create({
      data: {
        sessionDbId: session.id,
        kind: 'scroll',
        path: payload.path,
        metadata: jsonMeta({ scrollPct: payload.scrollPct }),
      },
    });
  }

  if (kind === 'conversion' && payload.conversionType) {
    await prisma.visitorEvent.create({
      data: {
        sessionDbId: session.id,
        kind: 'conversion',
        path: payload.path,
        label: CONVERSION_LABELS[payload.conversionType as ConversionType] ?? payload.conversionType,
        metadata: jsonMeta({ type: payload.conversionType }),
      },
    });
  }

  // Heartbeat: yalnızca oturum güncellenir — event spam yok
  if (kind === 'session_end') {
    await prisma.visitorEvent.create({
      data: {
        sessionDbId: session.id,
        kind: 'session_end',
        path: payload.path,
        metadata: jsonMeta({
          durationSec: payload.durationSec,
          engagedSec: payload.engagedSec,
        }),
      },
    });
  }

  return { ok: true };
}
