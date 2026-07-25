/**
 * GSC düşük CTR sayfalar için meta A/B varyasyonları — programmatic + blog.
 */
import type { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getDistrictBySlug, getServiceBySlug } from '@/config/programmatic-seo';
import { buildSmartMetaForPair } from '@/lib/programmatic-smart-meta';
import { sanitizeInput } from '@/lib/security';

const MIN_IMPRESSIONS_PROGRAMMATIC = 100;
const MAX_CTR_PROGRAMMATIC = 0.012;
const MIN_IMPRESSIONS_BLOG = 50;
const MAX_CTR_BLOG = 0.015;
const MAX_UPDATES_PER_RUN = 25;

function trimMeta(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function buildAbTitle(baseTitle: string, topQuery: string | null | undefined): string {
  const q = topQuery?.trim();
  if (!q || q.length < 4) {
    return trimMeta(`${baseTitle.replace(/\s*·.*$/, '')} · Ücretsiz Keşif`, 58);
  }
  const shortQ = q.length > 28 ? `${q.slice(0, 27)}…` : q;
  return trimMeta(`${baseTitle.split('|')[0].trim()} — ${shortQ}`, 58);
}

function buildAbDescription(baseDesc: string, topQuery: string | null | undefined): string {
  const hook = topQuery?.trim()
    ? `"${topQuery.trim().slice(0, 40)}" araması için güncel teklif.`
    : 'Online fiyat hesaplama ve ücretsiz keşif.';
  const merged = `${baseDesc.replace(/\s*Ücretsiz keşif.*$/i, '').trim()} ${hook} Hemen teklif alın.`;
  return trimMeta(merged, 158);
}

function parseProgrammaticKey(key: string): { district: string; service: string } | null {
  const parts = key.split('/');
  if (parts.length !== 2) return null;
  return { district: parts[0], service: parts[1] };
}

export async function applyLowCtrMetaAb(
  db: PrismaClient = prisma
): Promise<{ programmaticUpdated: number; blogUpdated: number; skipped: boolean }> {
  const metrics = await db.gscLandingMetric.findMany({
    where: { date: { gte: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000) } },
    orderBy: { impressions: 'desc' },
  });

  if (metrics.length === 0) {
    return { programmaticUpdated: 0, blogUpdated: 0, skipped: true };
  }

  const latestByKey = new Map<string, (typeof metrics)[0]>();
  for (const m of metrics) {
    if (!latestByKey.has(m.key)) latestByKey.set(m.key, m);
  }

  let programmaticUpdated = 0;
  let blogUpdated = 0;

  for (const [key, m] of latestByKey.entries()) {
    if (programmaticUpdated + blogUpdated >= MAX_UPDATES_PER_RUN) break;

    if (m.impressions >= MIN_IMPRESSIONS_PROGRAMMATIC && m.ctr < MAX_CTR_PROGRAMMATIC) {
      const parsed = parseProgrammaticKey(key);
      if (!parsed) continue;

      const district = getDistrictBySlug(parsed.district);
      const service = getServiceBySlug(parsed.service);
      if (!district || !service) continue;

      const base = buildSmartMetaForPair(district, service);
      const title = buildAbTitle(base.title, m.topQuery);
      const description = buildAbDescription(base.description, m.topQuery);

      await db.programmaticMetaOverride.upsert({
        where: { key },
        create: {
          key,
          district: parsed.district,
          service: parsed.service,
          title: sanitizeInput(title).slice(0, 140),
          description: sanitizeInput(description).slice(0, 260),
          isActive: true,
        },
        update: {
          title: sanitizeInput(title).slice(0, 140),
          description: sanitizeInput(description).slice(0, 260),
          isActive: true,
        },
      });
      programmaticUpdated++;
    }
  }

  const blogMetrics = await db.gscLandingMetric.findMany({
    where: {
      key: { startsWith: 'blog:' },
      impressions: { gte: MIN_IMPRESSIONS_BLOG },
      ctr: { lt: MAX_CTR_BLOG },
    },
    orderBy: { impressions: 'desc' },
    take: MAX_UPDATES_PER_RUN,
  });

  for (const m of blogMetrics) {
    if (blogUpdated >= MAX_UPDATES_PER_RUN) break;
    const slug = m.key.replace(/^blog:/, '');
    if (!slug) continue;

    const post = await db.blogPost.findUnique({
      where: { slug },
      select: { id: true, title: true, excerpt: true, metaTitle: true, metaDesc: true },
    });
    if (!post) continue;

    const baseDesc = post.metaDesc?.trim() || post.excerpt;
    const newDesc = buildAbDescription(baseDesc, m.topQuery);
    const newTitle = buildAbTitle(post.metaTitle?.trim() || post.title, m.topQuery);

    await db.blogPost.update({
      where: { id: post.id },
      data: {
        metaTitle: sanitizeInput(newTitle).slice(0, 140),
        metaDesc: sanitizeInput(newDesc).slice(0, 260),
      },
    });
    blogUpdated++;
  }

  return { programmaticUpdated, blogUpdated, skipped: false };
}

/** GSC satırlarından blog metriklerini gscLandingMetric tablosuna yazar */
export async function upsertGscBlogMetrics(
  rows: Array<{
    page: string;
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>,
  db: PrismaClient = prisma
): Promise<number> {
  const agg = new Map<
    string,
    { path: string; clicks: number; impressions: number; ctrW: number; posW: number; topQuery: string }
  >();

  for (const row of rows) {
    let path = row.page;
    try {
      if (row.page.startsWith('http')) path = new URL(row.page).pathname;
    } catch {
      continue;
    }
    if (!path.startsWith('/blog/')) continue;

    const slug = path.replace(/^\/blog\//, '').replace(/\/$/, '');
    if (!slug) continue;

    const curr = agg.get(slug) ?? {
      path,
      clicks: 0,
      impressions: 0,
      ctrW: 0,
      posW: 0,
      topQuery: row.query,
    };
    curr.clicks += row.clicks;
    curr.impressions += row.impressions;
    curr.ctrW += row.ctr * row.impressions;
    curr.posW += row.position * row.impressions;
    if (row.impressions > curr.impressions * 0.3) curr.topQuery = row.query;
    agg.set(slug, curr);
  }

  const metricDate = new Date();
  metricDate.setHours(0, 0, 0, 0);
  let count = 0;

  for (const [slug, v] of agg.entries()) {
    const imp = v.impressions || 1;
    await db.gscLandingMetric.upsert({
      where: { key_date: { key: `blog:${slug}`, date: metricDate } },
      create: {
        key: `blog:${slug}`,
        pagePath: v.path,
        date: metricDate,
        clicks: v.clicks,
        impressions: v.impressions,
        ctr: v.ctrW / imp,
        position: v.posW / imp,
        topQuery: v.topQuery,
      },
      update: {
        pagePath: v.path,
        clicks: v.clicks,
        impressions: v.impressions,
        ctr: v.ctrW / imp,
        position: v.posW / imp,
        topQuery: v.topQuery,
      },
    });
    count++;
  }

  return count;
}
