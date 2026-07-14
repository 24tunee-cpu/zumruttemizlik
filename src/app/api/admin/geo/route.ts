import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/security';
import { runFullGeoSync } from '@/lib/geo-citation';
import {
  GEO_CITATION_PROMPTS,
  GEO_COMPETITOR_NAMES,
  GEO_DIRECTORY_TARGETS,
  GEO_GBP_CHECKLIST,
  GEO_NAP,
  GEO_REVIEW_REQUEST_TEMPLATES,
} from '@/config/geo-entity';

export async function GET(request: NextRequest) {
  const denied = await requireAdminAuth(request);
  if (denied) return denied;

  const lastRun = await prisma.seoAutomationSyncLog.findFirst({
    where: { source: { startsWith: 'geo-audit' } },
    orderBy: { startedAt: 'desc' },
  });

  const publishedBlogs = await prisma.blogPost.count({ where: { published: true } });
  const geoPassageBlogs = await prisma.blogPost.count({
    where: { published: true, content: { contains: 'geo-passage-answer' } },
  });

  return NextResponse.json({
    nap: GEO_NAP,
    gbpChecklist: GEO_GBP_CHECKLIST,
    reviewTemplates: GEO_REVIEW_REQUEST_TEMPLATES,
    citationPrompts: GEO_CITATION_PROMPTS,
    competitors: GEO_COMPETITOR_NAMES,
    directories: GEO_DIRECTORY_TARGETS.map((d) => ({
      ...d,
      configured: Boolean(process.env[d.envKey]?.trim()),
    })),
    stats: {
      publishedBlogs,
      geoPassageBlogs,
      geoSssPages: 75,
    },
    lastRun: lastRun
      ? {
          source: lastRun.source,
          status: lastRun.status,
          message: lastRun.message,
          startedAt: lastRun.startedAt.toISOString(),
          finishedAt: lastRun.finishedAt?.toISOString() ?? null,
          stats: lastRun.stats,
        }
      : null,
  });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminAuth(request);
  if (denied) return denied;

  try {
    const result = await runFullGeoSync(prisma, 'manual');
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'GEO sync failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
