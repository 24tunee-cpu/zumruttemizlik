import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, sanitizeInput, checkRateLimit } from '@/lib/security';
import { processVisitorTrackEvent, TRACK_KINDS, type TrackPayload } from '@/lib/visitor-engine';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

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

function parseBody(body: Record<string, unknown>): TrackPayload | null {
  const kind = str(body, 'kind', 32);
  const sessionKey = str(body, 'sessionKey', 64);
  const visitorKey = str(body, 'visitorKey', 64);
  if (!kind || !TRACK_KINDS.has(kind) || !sessionKey || !visitorKey) return null;

  return {
    kind,
    sessionKey,
    visitorKey,
    path: str(body, 'path', 500),
    pageTitle: str(body, 'pageTitle', 200),
    referrer: str(body, 'referrer', 500),
    landingUrl: str(body, 'landingUrl', 2000),
    utmSource: str(body, 'utmSource', 120),
    utmMedium: str(body, 'utmMedium', 120),
    utmCampaign: str(body, 'utmCampaign', 120),
    utmTerm: str(body, 'utmTerm', 200),
    utmContent: str(body, 'utmContent', 120),
    language: str(body, 'language', 16),
    screenWidth: num(body, 'screenWidth', 0, 10000),
    screenHeight: num(body, 'screenHeight', 0, 10000),
    durationSec: num(body, 'durationSec', 0, 86400),
    engagedSec: num(body, 'engagedSec', 0, 86400),
    scrollPct: num(body, 'scrollPct', 0, 100),
    timeOnPageSec: num(body, 'timeOnPageSec', 0, 86400),
    clickLabel: str(body, 'clickLabel', 200),
    clickUrl: str(body, 'clickUrl', 500),
    clickSource: str(body, 'clickSource', 80),
    conversionType: str(body, 'conversionType', 32),
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS });
}

export async function POST(request: NextRequest) {
  const headers = { ...CORS };
  const ip = getClientIp(request);
  const limit = checkRateLimit(`visitor-track:${ip}`, 180, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const payload = parseBody(body);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400, headers });
    }

    const result = await processVisitorTrackEvent(payload, request, ip);
    return NextResponse.json(result, { status: result.created ? 201 : 200, headers });
  } catch (e) {
    if (e instanceof Error && e.message === 'SESSION_NOT_FOUND') {
      return NextResponse.json({ error: 'Session not found' }, { status: 404, headers });
    }
    return NextResponse.json({ error: 'Track failed' }, { status: 500, headers });
  }
}
