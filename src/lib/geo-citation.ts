/**
 * GEO citation coverage — prompt bank vs site içeriği eşleşmesi.
 * Harici AI API olmadan içerik hazırlık skoru üretir.
 */
import type { PrismaClient } from '@prisma/client';
import {
  GEO_BRAND_NAME,
  GEO_CITATION_PROMPTS,
  GEO_COMPETITOR_NAMES,
} from '@/config/geo-entity';
import { GEO_SSS_PAGES } from '@/config/geo-district-faqs';

export type CitationPromptResult = {
  id: string;
  prompt: string;
  category: string;
  brandCoverageScore: number;
  matchingSlugs: string[];
  matchingGeoSss: string[];
  competitorsInContent: string[];
  recommendation: string;
};

export type GeoCitationReport = {
  overallScore: number;
  brandMentionPages: number;
  promptResults: CitationPromptResult[];
  competitorMentions: Record<string, number>;
  ranAt: string;
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function promptTokens(prompt: string): string[] {
  return tokenize(prompt).filter(
    (t) => !['için', 'veya', 'ile', 'the', 'and'].includes(t)
  );
}

export async function runGeoCitationCoverage(prisma: PrismaClient): Promise<GeoCitationReport> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, title: true, excerpt: true, content: true, tags: true },
  });

  const brandSlug = GEO_BRAND_NAME.toLowerCase();
  let brandMentionPages = 0;

  const postIndex = posts.map((p) => {
    const blob = `${p.title} ${p.excerpt} ${p.content} ${p.tags.join(' ')}`.toLowerCase();
    if (blob.includes('zümrüt') || blob.includes('zumrut')) brandMentionPages += 1;
    return { ...p, blob };
  });

  const promptResults: CitationPromptResult[] = [];

  for (const item of GEO_CITATION_PROMPTS) {
    const tokens = promptTokens(item.prompt);
    const matchingSlugs: string[] = [];
    const matchingGeoSss: string[] = [];
    const competitorsInContent: string[] = [];

    for (const p of postIndex) {
      const hits = tokens.filter((t) => p.blob.includes(t)).length;
      if (hits >= Math.max(2, Math.ceil(tokens.length * 0.4))) {
        matchingSlugs.push(p.slug);
      }
    }

    for (const g of GEO_SSS_PAGES) {
      const gBlob = `${g.title} ${g.directAnswer} ${g.districtName}`.toLowerCase();
      const hits = tokens.filter((t) => gBlob.includes(t)).length;
      if (hits >= 2) matchingGeoSss.push(g.slug);
    }

    for (const comp of GEO_COMPETITOR_NAMES) {
      const anyPost = postIndex.some((p) => p.blob.includes(comp.toLowerCase()));
      if (anyPost) competitorsInContent.push(comp);
    }

    const coverage = matchingSlugs.length + matchingGeoSss.length;
    const brandCoverageScore = Math.min(100, coverage * 25);

    let recommendation = 'İçerik kapsamı yeterli — AI alıntı potansiyeli iyi';
    if (brandCoverageScore < 50) {
      recommendation = 'Bu prompt için yeni blog veya GEO SSS sayfası ekleyin';
    } else if (brandCoverageScore < 75) {
      recommendation = 'Mevcut içeriği passage-first format ile güçlendirin';
    }

    promptResults.push({
      id: item.id,
      prompt: item.prompt,
      category: item.category,
      brandCoverageScore,
      matchingSlugs: matchingSlugs.slice(0, 5),
      matchingGeoSss: matchingGeoSss.slice(0, 3),
      competitorsInContent,
      recommendation,
    });
  }

  const competitorMentions: Record<string, number> = {};
  for (const comp of GEO_COMPETITOR_NAMES) {
    competitorMentions[comp] = postIndex.filter((p) =>
      p.blob.includes(comp.toLowerCase())
    ).length;
  }

  const overallScore = Math.round(
    promptResults.reduce((s, r) => s + r.brandCoverageScore, 0) / promptResults.length
  );

  return {
    overallScore,
    brandMentionPages,
    promptResults,
    competitorMentions,
    ranAt: new Date().toISOString(),
  };
}

/** Tam GEO sync: audit + citation + llms */
export async function runFullGeoSync(
  prisma: PrismaClient,
  source: 'cron' | 'manual'
): Promise<{
  audit: Awaited<ReturnType<typeof import('./geo-audit').runGeoTechnicalAudit>>;
  citation: GeoCitationReport;
  llms: { blogCount: number; updated: boolean };
}> {
  const { runGeoTechnicalAudit, persistGeoAuditRun } = await import('./geo-audit');
  const { syncPublishedBlogsToLlmsFull, ensureGeoSssSectionInLlmsFull } = await import('./geo-llms-sync');
  const { GEO_SSS_PAGES } = await import('@/config/geo-district-faqs');

  ensureGeoSssSectionInLlmsFull(GEO_SSS_PAGES.map((p) => p.slug));
  const llms = await syncPublishedBlogsToLlmsFull(prisma);
  const citation = await runGeoCitationCoverage(prisma);
  const audit = await runGeoTechnicalAudit(prisma);

  await persistGeoAuditRun(
    prisma,
    source,
    audit,
    citation as unknown as Record<string, unknown>
  );

  return { audit, citation, llms };
}
