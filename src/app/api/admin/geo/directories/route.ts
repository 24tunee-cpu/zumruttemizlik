import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/security';
import { GEO_DIRECTORY_TARGETS } from '@/config/geo-entity';
import {
  CITATION_STATUSES,
  isCitationStatus,
  platformForDirectoryId,
} from '@/config/citation-tracker';

export async function GET(request: NextRequest) {
  const denied = await requireAdminAuth(request);
  if (denied) return denied;

  const listings = await prisma.mapPlatformListing.findMany({
    select: {
      platform: true,
      listingUrl: true,
      connectionStatus: true,
      externalPlaceId: true,
      lastManualSyncAt: true,
      internalNotes: true,
      updatedAt: true,
    },
  });
  const byPlatform = new Map(listings.map((l) => [l.platform, l]));

  const directories = GEO_DIRECTORY_TARGETS.map((d) => {
    const platform = platformForDirectoryId(d.id);
    const row = platform ? byPlatform.get(platform) : undefined;
    const envUrl = process.env[d.envKey]?.trim() || null;
    return {
      id: d.id,
      name: d.name,
      priority: d.priority,
      envKey: d.envKey,
      envConfigured: Boolean(envUrl),
      envUrl,
      platform,
      connectionStatus: row?.connectionStatus ?? 'not_connected',
      listingUrl: row?.listingUrl ?? envUrl,
      externalPlaceId: row?.externalPlaceId ?? null,
      lastManualSyncAt: row?.lastManualSyncAt?.toISOString() ?? null,
      internalNotes: row?.internalNotes ?? null,
      updatedAt: row?.updatedAt?.toISOString() ?? null,
      trackerNote: d.trackerNote,
    };
  });

  return NextResponse.json({
    directories,
    statuses: CITATION_STATUSES,
  });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireAdminAuth(request);
  if (denied) return denied;

  let body: {
    directoryId?: string;
    connectionStatus?: string;
    listingUrl?: string | null;
    externalPlaceId?: string | null;
    internalNotes?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 });
  }

  const directoryId = body.directoryId?.trim();
  if (!directoryId) {
    return NextResponse.json({ error: 'directoryId gerekli' }, { status: 400 });
  }

  const platform = platformForDirectoryId(directoryId);
  if (!platform) {
    return NextResponse.json({ error: 'Bilinmeyen dizin' }, { status: 400 });
  }

  const status = body.connectionStatus?.trim();
  if (status && !isCitationStatus(status)) {
    return NextResponse.json({ error: 'Geçersiz connectionStatus' }, { status: 400 });
  }

  const listingUrl =
    body.listingUrl === undefined
      ? undefined
      : body.listingUrl === null || body.listingUrl.trim() === ''
        ? null
        : body.listingUrl.trim();

  if (listingUrl && !/^https?:\/\//i.test(listingUrl)) {
    return NextResponse.json({ error: 'listingUrl http(s) olmalı' }, { status: 400 });
  }

  const externalPlaceId =
    body.externalPlaceId === undefined
      ? undefined
      : body.externalPlaceId === null || body.externalPlaceId.trim() === ''
        ? null
        : body.externalPlaceId.trim();

  const internalNotes =
    body.internalNotes === undefined
      ? undefined
      : body.internalNotes === null
        ? null
        : body.internalNotes.trim().slice(0, 2000);

  const data: {
    connectionStatus?: string;
    listingUrl?: string | null;
    externalPlaceId?: string | null;
    internalNotes?: string | null;
    lastManualSyncAt: Date;
    businessName?: string;
  } = {
    lastManualSyncAt: new Date(),
  };
  if (status) data.connectionStatus = status;
  if (listingUrl !== undefined) data.listingUrl = listingUrl;
  if (externalPlaceId !== undefined) data.externalPlaceId = externalPlaceId;
  if (internalNotes !== undefined) data.internalNotes = internalNotes;

  const target = GEO_DIRECTORY_TARGETS.find((d) => d.id === directoryId);
  const updated = await prisma.mapPlatformListing.upsert({
    where: { platform },
    create: {
      platform,
      businessName: target?.name ?? platform,
      connectionStatus: status ?? 'not_connected',
      listingUrl: listingUrl ?? null,
      externalPlaceId: externalPlaceId ?? null,
      internalNotes: internalNotes ?? null,
      lastManualSyncAt: data.lastManualSyncAt,
    },
    update: data,
  });

  return NextResponse.json({
    ok: true,
    directoryId,
    platform,
    connectionStatus: updated.connectionStatus,
    listingUrl: updated.listingUrl,
    externalPlaceId: updated.externalPlaceId,
    lastManualSyncAt: updated.lastManualSyncAt?.toISOString() ?? null,
  });
}
