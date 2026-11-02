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
import { platformForDirectoryId } from '@/config/citation-tracker';
import { getBlogScheduleHealth } from '@/lib/blog-schedule-preserve';
import { getIndexNowKey, getIndexNowKeyLocation } from '@/lib/indexnow';
import { AUTO_INTERNAL_LINKS_MARKER } from '@/lib/blog-publish-internal-links';
import { fillReviewTemplate, getPublicReviewUrl, withGmbUtm, getPublicMapsUrl } from '@/lib/gbp-links';
import { getGoogleMapsPublicLinks } from '@/lib/google-maps-public-links';

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
  const blogSchedule = await getBlogScheduleHealth(prisma);
  const blogsWithAutoInternalLinks = await prisma.blogPost.count({
    where: { published: true, content: { contains: AUTO_INTERNAL_LINKS_MARKER } },
  });
  const indexNowKey = getIndexNowKey();

  const listings = await prisma.mapPlatformListing.findMany({
    select: {
      platform: true,
      listingUrl: true,
      connectionStatus: true,
      externalPlaceId: true,
      lastManualSyncAt: true,
      internalNotes: true,
    },
  });
  const byPlatform = new Map(listings.map((l) => [l.platform, l]));

  const mapsLinks = await getGoogleMapsPublicLinks();
  const reviewLink =
    getPublicReviewUrl() ||
    (mapsLinks.placeId
      ? mapsLinks.reviewUrl
      : withGmbUtm(getPublicMapsUrl(), 'review-ask'));

  return NextResponse.json({
    nap: GEO_NAP,
    gbpChecklist: GEO_GBP_CHECKLIST,
    reviewTemplates: GEO_REVIEW_REQUEST_TEMPLATES.map((t) => ({
      ...t,
      preview: fillReviewTemplate(t.text, {
        name: 'Ayşe',
        service: 'ev temizliği',
        district: 'Zekeriyaköy',
        reviewLink,
      }),
    })),
    reviewLink,
    citationPrompts: GEO_CITATION_PROMPTS,
    competitors: GEO_COMPETITOR_NAMES,
    directories: GEO_DIRECTORY_TARGETS.map((d) => {
      const platform = platformForDirectoryId(d.id);
      const row = platform ? byPlatform.get(platform) : undefined;
      const envUrl = process.env[d.envKey]?.trim() || null;
      return {
        ...d,
        configured: Boolean(envUrl || row?.listingUrl || row?.connectionStatus === 'connected'),
        platform,
        connectionStatus: row?.connectionStatus ?? 'not_connected',
        listingUrl: row?.listingUrl ?? envUrl,
        externalPlaceId: row?.externalPlaceId ?? null,
        lastManualSyncAt: row?.lastManualSyncAt?.toISOString() ?? null,
        internalNotes: row?.internalNotes ?? null,
      };
    }),
    stats: {
      publishedBlogs,
      geoPassageBlogs,
      geoSssPages: 75,
      blogSchedule,
      blogsWithAutoInternalLinks,
      indexNow: {
        configured: Boolean(indexNowKey),
        keyLocation: indexNowKey ? getIndexNowKeyLocation() : null,
      },
      placeIdConfigured: Boolean(mapsLinks.placeId),
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
