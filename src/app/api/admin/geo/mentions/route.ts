import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/security';
import { GEO_CITATION_PROMPTS } from '@/config/geo-entity';
import {
  GEO_MENTION_ENGINES,
  GEO_MENTION_OUTCOMES,
  buildMentionScorecard,
} from '@/lib/geo-mention-scorecard';

export const dynamic = 'force-dynamic';

const engineIds = GEO_MENTION_ENGINES.map((e) => e.id) as [string, ...string[]];
const outcomeIds = GEO_MENTION_OUTCOMES.map((o) => o.id) as [string, ...string[]];

const createSchema = z.object({
  promptId: z.string().min(1).max(80),
  promptText: z.string().min(3).max(500),
  engine: z.enum(engineIds),
  outcome: z.enum(outcomeIds),
  brandMentioned: z.boolean().optional(),
  urlCited: z.boolean().optional(),
  citedUrl: z.string().url().optional().nullable(),
  competitorNames: z.array(z.string().max(80)).max(10).optional(),
  notes: z.string().max(2000).optional().nullable(),
  snippet: z.string().max(2000).optional().nullable(),
  checkedAt: z.string().datetime().optional(),
});

export async function GET(request: NextRequest) {
  const denied = await requireAdminAuth(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit') || 50), 200);

  const rows = await prisma.geoMentionCheck.findMany({
    orderBy: { checkedAt: 'desc' },
    take: limit,
  });

  const scorecard = buildMentionScorecard(rows, GEO_CITATION_PROMPTS.length);

  return NextResponse.json({
    ok: true,
    scorecard,
    prompts: GEO_CITATION_PROMPTS,
    engines: GEO_MENTION_ENGINES,
    outcomes: GEO_MENTION_OUTCOMES,
    checks: rows,
  });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminAuth(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Doğrulama hatası', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const brandMentioned =
    data.brandMentioned ??
    (data.outcome === 'brand_mention' || data.outcome === 'cited_with_url');
  const urlCited = data.urlCited ?? data.outcome === 'cited_with_url';

  const created = await prisma.geoMentionCheck.create({
    data: {
      promptId: data.promptId,
      promptText: data.promptText,
      engine: data.engine,
      outcome: data.outcome,
      brandMentioned,
      urlCited,
      citedUrl: data.citedUrl ?? null,
      competitorNames: data.competitorNames ?? [],
      notes: data.notes ?? null,
      snippet: data.snippet ?? null,
      checkedAt: data.checkedAt ? new Date(data.checkedAt) : new Date(),
    },
  });

  return NextResponse.json({ ok: true, check: created }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdminAuth(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id gerekli' }, { status: 400 });
  }

  await prisma.geoMentionCheck.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
