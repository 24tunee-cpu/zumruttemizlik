/**
 * GSC CSV tam import — tüm satırlar, blog + bölge, A/B meta, cannibalization analizi.
 */
import type { PrismaClient } from '@prisma/client';
import {
  DISTRICT_LANDINGS,
  SERVICE_LANDINGS,
  getDistrictBySlug,
  getServiceBySlug,
} from '@/config/programmatic-seo';
import { buildSmartMetaForPair } from '@/lib/programmatic-smart-meta';
import { BLOG_CANNIBAL_CANONICAL } from '@/config/seo-cannibalization';
import type { GscRow } from '@/lib/gsc-meta';
import { parseGscCsv } from '@/lib/gsc-meta';

export type MetaVariant = 'query' | 'cta';

export type ProgrammaticSuggestion = {
  id: string;
  type: 'programmatic';
  key: string;
  district: string;
  service: string;
  pagePath: string;
  title: string;
  description: string;
  variant: MetaVariant;
  reason: string;
  score: number;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type BlogSuggestion = {
  id: string;
  type: 'blog';
  slug: string;
  pagePath: string;
  title: string;
  description: string;
  variant: MetaVariant;
  reason: string;
  score: number;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  cannibalDuplicate?: boolean;
};

export type CannibalIssue = {
  query: string;
  pages: string[];
  recommendation: string;
};

export type QuickWin = {
  pagePath: string;
  query: string;
  impressions: number;
  ctr: number;
  position: number;
  hint: string;
};

export type GscImportReport = {
  parsedRows: number;
  uniquePages: number;
  stats: {
    programmatic: number;
    blog: number;
    skippedUnknown: number;
    skippedDuplicateCannibal: number;
  };
  programmatic: ProgrammaticSuggestion[];
  blog: BlogSuggestion[];
  cannibalization: CannibalIssue[];
  lowCtr: QuickWin[];
  quickWins: QuickWin[];
  skippedSamples: string[];
};

const LOW_CTR_THRESHOLD = 0.015;
const QUICK_WIN_MIN_IMPRESSIONS = 25;
const QUICK_WIN_POSITION_MAX = 15;

function trimMeta(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function normalizeCtr(ctr: number): number {
  if (ctr > 1) return ctr / 100;
  return ctr;
}

function normalizePagePath(raw: string): string {
  let path = raw.trim();
  try {
    if (path.startsWith('http')) path = new URL(path).pathname;
  } catch {
    // keep raw
  }
  return path.replace(/\/$/, '') || '/';
}

function keyFromBolgelerPath(path: string): string | null {
  const m = path.match(/\/bolgeler\/([^/]+)\/([^/?#]+)/);
  if (!m) return null;
  return `${m[1]}/${m[2]}`;
}

function slugFromBlogPath(path: string): string | null {
  const m = path.match(/\/blog\/([^/?#]+)/);
  return m?.[1] ?? null;
}

function pickVariant(ctr: number, impressions: number): MetaVariant {
  const c = normalizeCtr(ctr);
  if (impressions >= 40 && c < LOW_CTR_THRESHOLD) return 'cta';
  return 'query';
}

function buildQueryTitle(districtName: string, serviceName: string, query: string): string {
  return trimMeta(`${districtName} ${serviceName} | ${query} — Zümrüt Vadi`, 58);
}

function buildCtaTitle(districtName: string, serviceName: string, query: string): string {
  const shortQ = query.length > 24 ? `${query.slice(0, 23)}…` : query;
  return trimMeta(`${districtName} ${serviceName} · ${shortQ} · Ücretsiz Keşif`, 58);
}

function buildQueryDesc(districtName: string, serviceName: string, query: string): string {
  return trimMeta(
    `${districtName} ${serviceName.toLowerCase()}: "${query}" araması için güncel teklif, şeffaf fiyat ve aynı gün planlama.`,
    158
  );
}

function buildCtaDesc(districtName: string, serviceName: string, query: string): string {
  return trimMeta(
    `${districtName} bölgesinde ${serviceName.toLowerCase()} — online fiyat hesaplama ve ücretsiz keşif. "${query.slice(0, 35)}" aramasından geldiniz mi? Hemen teklif alın.`,
    158
  );
}

function buildBlogTitles(slug: string, query: string, variant: MetaVariant): { title: string; description: string } {
  const base = query.trim() || slug.replace(/-/g, ' ');
  if (variant === 'cta') {
    return {
      title: trimMeta(`${base} · Ücretsiz Keşif 2026 | Zümrüt Vadi Blog`, 58),
      description: trimMeta(
        `"${base.slice(0, 45)}" için güncel rehber + anında fiyat tahmini. WhatsApp veya online hesaplama ile teklif alın.`,
        158
      ),
    };
  }
  return {
    title: trimMeta(`${base} | Zümrüt Vadi Temizlik Blog`, 58),
    description: trimMeta(
      `${base} hakkında 2026 güncel rehber — fiyat aralıkları, ipuçları ve ${'İstanbul'} genelinde profesyonel temizlik.`,
      158
    ),
  };
}

function matchQueryToLanding(query: string): string | null {
  const q = query.toLowerCase();
  let best: { key: string; score: number } | null = null;
  for (const d of DISTRICT_LANDINGS) {
    if (!q.includes(d.slug.replace(/-/g, ' ')) && !q.includes(d.name.toLowerCase())) continue;
    for (const s of SERVICE_LANDINGS) {
      let score = 2;
      for (const kw of s.intentKeywords) {
        if (q.includes(kw.toLowerCase())) score += 3;
      }
      if (q.includes(s.slug.replace(/-/g, ' ')) || q.includes(s.name.toLowerCase())) score += 2;
      const key = `${d.slug}/${s.slug}`;
      if (!best || score > best.score) best = { key, score };
    }
  }
  return best && best.score >= 3 ? best.key : null;
}

function aggregateRows(rows: GscRow[]): Map<string, GscRow[]> {
  const byPage = new Map<string, GscRow[]>();
  for (const row of rows) {
    const path = normalizePagePath(row.page);
    const list = byPage.get(path) ?? [];
    list.push({ ...row, page: path });
    byPage.set(path, list);
  }
  return byPage;
}

function topRowForBucket(bucket: GscRow[]): GscRow {
  return [...bucket].sort(
    (a, b) => b.impressions - a.impressions || b.clicks - a.clicks || a.position - b.position
  )[0];
}

function detectCannibalization(rows: GscRow[]): CannibalIssue[] {
  const byQuery = new Map<string, Set<string>>();
  for (const row of rows) {
    const q = row.query.trim().toLowerCase();
    if (!q) continue;
    const path = normalizePagePath(row.page);
    if (!byQuery.has(q)) byQuery.set(q, new Set());
    byQuery.get(q)!.add(path);
  }
  const issues: CannibalIssue[] = [];
  for (const [query, pages] of byQuery.entries()) {
    if (pages.size <= 1) continue;
    const list = [...pages];
    const hasBlog = list.some((p) => p.includes('/blog/'));
    const hasLanding = list.some((p) => p.includes('/bolgeler/'));
    let recommendation = 'Bir birincil URL seçin; diğerlerine canonical veya iç link verin.';
    if (hasBlog && hasLanding) {
      recommendation =
        'Aynı sorgu hem blog hem ilçe sayfasında görünüyor. Dönüşüm için ilçe landing birincil; blog bilgi amaçlı kalsın.';
    }
    issues.push({ query, pages: list, recommendation });
  }
  return issues.sort((a, b) => b.pages.length - a.pages.length).slice(0, 50);
}

function detectLowCtrAndQuickWins(rows: GscRow[]): { lowCtr: QuickWin[]; quickWins: QuickWin[] } {
  const lowCtr: QuickWin[] = [];
  const quickWins: QuickWin[] = [];
  for (const row of rows) {
    const ctr = normalizeCtr(row.ctr);
    const path = normalizePagePath(row.page);
    const item: QuickWin = {
      pagePath: path,
      query: row.query,
      impressions: row.impressions,
      ctr,
      position: row.position,
      hint: '',
    };
    if (row.impressions >= 30 && ctr < LOW_CTR_THRESHOLD) {
      item.hint = 'Düşük CTR — CTA varyantı önerildi';
      lowCtr.push(item);
    }
    if (
      row.impressions >= QUICK_WIN_MIN_IMPRESSIONS &&
      row.position >= 4 &&
      row.position <= QUICK_WIN_POSITION_MAX
    ) {
      item.hint = 'Sayfa 1 sınırında — meta + iç link ile yükseltilebilir';
      quickWins.push(item);
    }
  }
  const dedupe = (arr: QuickWin[]) => {
    const seen = new Set<string>();
    return arr
      .filter((x) => {
        const k = `${x.pagePath}|${x.query}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 100);
  };
  return { lowCtr: dedupe(lowCtr), quickWins: dedupe(quickWins) };
}

export function mergeGscCsvTexts(csvTexts: string[]): GscRow[] {
  const merged: GscRow[] = [];
  const seen = new Set<string>();
  for (const text of csvTexts) {
    if (!text.trim()) continue;
    for (const row of parseGscCsv(text)) {
      const key = `${row.query.toLowerCase()}|${normalizePagePath(row.page)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(row);
    }
  }
  return merged;
}

export function analyzeGscImport(rows: GscRow[]): GscImportReport {
  const knownKeys = new Set(
    DISTRICT_LANDINGS.flatMap((d) => SERVICE_LANDINGS.map((s) => `${d.slug}/${s.slug}`))
  );

  const programmatic: ProgrammaticSuggestion[] = [];
  const blog: BlogSuggestion[] = [];
  let skippedUnknown = 0;
  let skippedDuplicateCannibal = 0;
  const skippedSamples: string[] = [];

  const byPage = aggregateRows(rows);

  for (const [pagePath, bucket] of byPage.entries()) {
    const top = topRowForBucket(bucket);
    const variant = pickVariant(top.ctr, top.impressions);
    const bolgelerKey = keyFromBolgelerPath(pagePath);
    const blogSlug = slugFromBlogPath(pagePath);

    if (bolgelerKey && knownKeys.has(bolgelerKey)) {
      const [districtSlug, serviceSlug] = bolgelerKey.split('/');
      const district = getDistrictBySlug(districtSlug);
      const service = getServiceBySlug(serviceSlug);
      if (!district || !service) continue;

      const title =
        variant === 'cta'
          ? buildCtaTitle(district.name, service.name, top.query)
          : buildQueryTitle(district.name, service.name, top.query);
      const description =
        variant === 'cta'
          ? buildCtaDesc(district.name, service.name, top.query)
          : buildQueryDesc(district.name, service.name, top.query);

      programmatic.push({
        id: `p:${bolgelerKey}`,
        type: 'programmatic',
        key: bolgelerKey,
        district: district.slug,
        service: service.slug,
        pagePath,
        title,
        description,
        variant,
        reason: `GSC: ${top.impressions} gösterim, CTR ${(normalizeCtr(top.ctr) * 100).toFixed(2)}%, konum ${top.position.toFixed(1)}`,
        score: top.impressions * 0.7 + top.clicks * 20 - top.position * 2,
        query: top.query,
        clicks: top.clicks,
        impressions: top.impressions,
        ctr: normalizeCtr(top.ctr),
        position: top.position,
      });
      continue;
    }

    if (blogSlug) {
      const isDup = blogSlug in BLOG_CANNIBAL_CANONICAL;
      if (isDup) {
        skippedDuplicateCannibal++;
        if (skippedSamples.length < 15) {
          skippedSamples.push(`${pagePath} (cannibal duplicate — canonical birleşik)`);
        }
        continue;
      }
      const meta = buildBlogTitles(blogSlug, top.query, variant);
      blog.push({
        id: `b:${blogSlug}`,
        type: 'blog',
        slug: blogSlug,
        pagePath,
        title: meta.title,
        description: meta.description,
        variant,
        reason: `GSC blog: ${top.impressions} gösterim, variant=${variant}`,
        score: top.impressions * 0.6 + top.clicks * 15,
        query: top.query,
        clicks: top.clicks,
        impressions: top.impressions,
        ctr: normalizeCtr(top.ctr),
        position: top.position,
      });
      continue;
    }

    skippedUnknown++;
    if (skippedSamples.length < 20) skippedSamples.push(pagePath);
  }

  // Query-only satırlar (page boş veya /) — landing eşleştir
  for (const row of rows) {
    const path = normalizePagePath(row.page);
    if (path !== '/' && path !== '') continue;
    const matched = matchQueryToLanding(row.query);
    if (!matched || !knownKeys.has(matched)) continue;
    if (programmatic.some((p) => p.key === matched)) continue;

    const [districtSlug, serviceSlug] = matched.split('/');
    const district = getDistrictBySlug(districtSlug);
    const service = getServiceBySlug(serviceSlug);
    if (!district || !service) continue;

    const variant = pickVariant(row.ctr, row.impressions);
    programmatic.push({
      id: `p:${matched}:q`,
      type: 'programmatic',
      key: matched,
      district: district.slug,
      service: service.slug,
      pagePath: `/bolgeler/${districtSlug}/${serviceSlug}`,
      title:
        variant === 'cta'
          ? buildCtaTitle(district.name, service.name, row.query)
          : buildQueryTitle(district.name, service.name, row.query),
      description:
        variant === 'cta'
          ? buildCtaDesc(district.name, service.name, row.query)
          : buildQueryDesc(district.name, service.name, row.query),
      variant,
      reason: `Sorgu eşleşmesi (sayfa yok): ${row.query}`,
      score: row.impressions * 0.5 + row.clicks * 10,
      query: row.query,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: normalizeCtr(row.ctr),
      position: row.position,
    });
  }

  programmatic.sort((a, b) => b.score - a.score);
  blog.sort((a, b) => b.score - a.score);

  const { lowCtr, quickWins } = detectLowCtrAndQuickWins(rows);

  return {
    parsedRows: rows.length,
    uniquePages: byPage.size,
    stats: {
      programmatic: programmatic.length,
      blog: blog.length,
      skippedUnknown,
      skippedDuplicateCannibal,
    },
    programmatic,
    blog,
    cannibalization: detectCannibalization(rows),
    lowCtr,
    quickWins,
    skippedSamples,
  };
}

export type ApplyGscResult = {
  programmaticApplied: number;
  blogApplied: number;
  errors: string[];
};

export async function applyGscSuggestions(
  programmatic: ProgrammaticSuggestion[],
  blogItems: BlogSuggestion[],
  db: Pick<PrismaClient, 'programmaticMetaOverride' | 'blogPost'>
): Promise<ApplyGscResult> {
  let programmaticApplied = 0;
  let blogApplied = 0;
  const errors: string[] = [];

  for (const s of programmatic) {
    try {
      await db.programmaticMetaOverride.upsert({
        where: { key: s.key },
        create: {
          key: s.key,
          district: s.district,
          service: s.service,
          title: s.title,
          description: s.description,
          isActive: true,
        },
        update: {
          title: s.title,
          description: s.description,
          isActive: true,
        },
      });
      programmaticApplied++;
    } catch (e) {
      errors.push(`programmatic ${s.key}: ${e instanceof Error ? e.message : 'hata'}`);
    }
  }

  for (const s of blogItems) {
    try {
      const post = await db.blogPost.findUnique({
        where: { slug: s.slug },
        select: { id: true },
      });
      if (!post) {
        errors.push(`blog ${s.slug}: yazı bulunamadı`);
        continue;
      }
      await db.blogPost.update({
        where: { id: post.id },
        data: { metaTitle: s.title, metaDesc: s.description },
      });
      blogApplied++;
    } catch (e) {
      errors.push(`blog ${s.slug}: ${e instanceof Error ? e.message : 'hata'}`);
    }
  }

  return { programmaticApplied, blogApplied, errors };
}
