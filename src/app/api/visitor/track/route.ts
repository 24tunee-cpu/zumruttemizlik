import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp, sanitizeInput } from '@/lib/security';
import { geoFromRequest } from '@/lib/visitor-geo';
import { parseUserAgent } from '@/lib/visitor-device';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const ALLOWED_KINDS = new Set([
  'session_start',
  'page_view',
  'click',
  'scroll',
  'heartbeat',
  'session_end',
]);

function hashIp(ip: string): string {
  const salt = process.env.NEXTAUTH_SECRET || 'visitor-track-salt';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 24);
}

function str(body: Record<string, unknown>, key: string, max: number): string | null {
  const v = body[key];
  if (typeof v !== 'string') return null;
  const t = sanitizeInput(v).trim();
  return t ? t.slice(0, max) : null;
}

function num(body: Record<string, unknown>, key: string, min = 0, max = 1_000_000): number | null {
  const v = body[key];
  if (typeof v !== 'number' || !Number.isFinite(v)) return null;
  return Math.min(max, Math.max(min, Math.round(v)));
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS });
}

export async function POST(request: NextRequest) {
  const headers = { ...CORS };
  const ip = getClientIp(request);
  const limit = checkRateLimit(`visitor-track:${ip}`, 120, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const kind = str(body, 'kind', 32);
    if (!kind || !ALLOWED_KINDS.has(kind)) {
      return NextResponse.json({ error: 'Invalid kind' }, { status: 400, headers });
    }

    const sessionKey = str(body, 'sessionKey', 64);
    const visitorKey = str(body, 'visitorKey', 64);
    if (!sessionKey || !visitorKey) {
      return NextResponse.json({ error: 'Missing sessionKey or visitorKey' }, { status: 400, headers });
    }

    const path = str(body, 'path', 500);
    const referrer = str(body, 'referrer', 500);
    const language = str(body, 'language', 16);
    const ua = sanitizeInput(request.headers.get('user-agent') || '').slice(0, 500);
    const device = parseUserAgent(ua);
    const geo = geoFromRequest(request);
    const screenWidth = num(body, 'screenWidth', 0, 10000);
    const screenHeight = num(body, 'screenHeight', 0, 10000);
    const durationSec = num(body, 'durationSec', 0, 86400);
    const scrollPct = num(body, 'scrollPct', 0, 100);
    const clickLabel = str(body, 'clickLabel', 200);
    const clickUrl = str(body, 'clickUrl', 500);
    const clickSource = str(body, 'clickSource', 80);

    let session = await prisma.visitorSession.findUnique({ where: { sessionKey } });

    if (!session && kind === 'session_start') {
      session = await prisma.visitorSession.create({
        data: {
          sessionKey,
          visitorKey,
          country: geo.country,
          countryCode: geo.countryCode,
          region: geo.region,
          city: geo.city,
          deviceType: device.deviceType,
          os: device.os,
          browser: device.browser,
          screenWidth: screenWidth ?? undefined,
          screenHeight: screenHeight ?? undefined,
          language,
          referrer,
          landingPath: path,
          exitPath: path,
          pageViews: 1,
          durationSec: 0,
          userAgent: ua || null,
          ipHash: hashIp(ip),
          isActive: true,
          lastSeenAt: new Date(),
        },
      });

      await prisma.visitorEvent.create({
        data: {
          sessionDbId: session.id,
          kind: 'page_view',
          path,
          metadata: { entry: true },
        },
      });

      return NextResponse.json({ ok: true, sessionId: session.id }, { status: 201, headers });
    }

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404, headers });
    }

    const now = new Date();

    await prisma.visitorSession.update({
      where: { id: session.id },
      data: {
        lastSeenAt: now,
        isActive: kind !== 'session_end',
        ...(path ? { exitPath: path } : {}),
        ...(durationSec !== null ? { durationSec } : {}),
        ...(scrollPct !== null && scrollPct > session.maxScrollPct
          ? { maxScrollPct: scrollPct }
          : {}),
        ...(kind === 'page_view' ? { pageViews: { increment: 1 } } : {}),
        ...(kind === 'click' ? { clickCount: { increment: 1 } } : {}),
        ...(kind === 'session_end' ? { endedAt: now, isActive: false } : {}),
      },
    });

    if (['page_view', 'click', 'scroll'].includes(kind)) {
      await prisma.visitorEvent.create({
        data: {
          sessionDbId: session.id,
          kind: kind === 'scroll' ? 'scroll' : kind,
          path,
          label: clickLabel,
          targetUrl: clickUrl,
          metadata:
            kind === 'scroll'
              ? { scrollPct }
              : clickSource
                ? { source: clickSource }
                : undefined,
        },
      });
    }

    if (kind === 'heartbeat' || kind === 'session_end') {
      await prisma.visitorEvent.create({
        data: {
          sessionDbId: session.id,
          kind,
          path,
          metadata: durationSec !== null ? { durationSec } : undefined,
        },
      });
    }

    return NextResponse.json({ ok: true }, { headers });
  } catch {
    return NextResponse.json({ error: 'Track failed' }, { status: 500, headers });
  }
}
