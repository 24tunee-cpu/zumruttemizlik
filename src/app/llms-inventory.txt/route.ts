/**
 * Canlı GEO/llms blog + geo-sss envanteri — Vercel FS yazmadan güncel liste.
 * Statik llms-full.txt build anındaki snapshot; bu route her zaman DB'den üretir.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSiteUrl } from '@/lib/seo';
import { buildBlogInventoryMarkdown } from '@/lib/geo-llms-sync';
import { listPublishedGeoSssSlugs } from '@/lib/geo-sss-resolver';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const base = getSiteUrl().replace(/\/$/, '');
    const { markdown, blogCount, now } = await buildBlogInventoryMarkdown(prisma, { take: 250 });
    const geoSlugs = await listPublishedGeoSssSlugs();

    const geoSection = [
      '## GEO SSS Mini Sayfalar',
      `- Son otomatik güncelleme: ${now}`,
      `- Yayınlanmış GEO SSS: ${geoSlugs.length}`,
      `- Route: ${base}/geo-sss/{slug}`,
      '',
      ...geoSlugs.slice(0, 80).map((s) => `- [${s}](${base}/geo-sss/${s})`),
      geoSlugs.length > 80 ? `- … ve ${geoSlugs.length - 80} sayfa daha` : '',
      '',
    ]
      .filter(Boolean)
      .join('\n');

    const body = [
      '# Zümrüt Vadi Temizlik — Canlı llms envanteri',
      `> Dinamik üretildi: ${now} · Blog: ${blogCount} · GEO SSS: ${geoSlugs.length}`,
      `> Statik referans: ${base}/llms.txt · ${base}/llms-full.txt`,
      '',
      markdown.trimEnd(),
      '',
      geoSection,
    ].join('\n');

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'llms inventory failed';
    return new NextResponse(`# Error\n${message}\n`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
