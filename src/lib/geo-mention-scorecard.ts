/**
 * AI mention skor kartı — manuel kayıtları özetler.
 * Otomatik scraping yok; admin girişi + GEO prompt bankası.
 */

export const GEO_MENTION_ENGINES = [
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'perplexity', label: 'Perplexity' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'ai_overviews', label: 'AI Overviews' },
  { id: 'other', label: 'Diğer' },
] as const;

export type GeoMentionEngine = (typeof GEO_MENTION_ENGINES)[number]['id'];

export const GEO_MENTION_OUTCOMES = [
  { id: 'none', label: 'Marka yok', score: 0 },
  { id: 'competitor', label: 'Rakip öne çıkmış', score: 1 },
  { id: 'wrong_info', label: 'Yanlış NAP/bilgi', score: 2 },
  { id: 'brand_mention', label: 'Marka anıldı (URL yok)', score: 3 },
  { id: 'cited_with_url', label: 'Marka + URL atıf', score: 5 },
] as const;

export type GeoMentionOutcome = (typeof GEO_MENTION_OUTCOMES)[number]['id'];

export function outcomeScore(outcome: string): number {
  return GEO_MENTION_OUTCOMES.find((o) => o.id === outcome)?.score ?? 0;
}

export type MentionCheckRow = {
  engine: string;
  outcome: string;
  brandMentioned: boolean;
  urlCited: boolean;
  checkedAt: Date | string;
  promptId: string;
};

export type MentionScorecard = {
  totalChecks: number;
  last30Days: number;
  brandMentionRate: number;
  urlCitationRate: number;
  avgScore: number;
  byEngine: Array<{
    engine: string;
    checks: number;
    brandMentions: number;
    urlCitations: number;
    avgScore: number;
  }>;
  byOutcome: Array<{ outcome: string; count: number }>;
  recentPromptCoverage: number;
};

function daysAgo(d: Date | string, days: number): boolean {
  const t = typeof d === 'string' ? new Date(d).getTime() : d.getTime();
  return t >= Date.now() - days * 24 * 60 * 60 * 1000;
}

export function buildMentionScorecard(
  rows: MentionCheckRow[],
  promptBankSize: number
): MentionScorecard {
  const last30 = rows.filter((r) => daysAgo(r.checkedAt, 30));
  const brandMentions = rows.filter((r) => r.brandMentioned || r.outcome === 'brand_mention' || r.outcome === 'cited_with_url');
  const urlCitations = rows.filter((r) => r.urlCited || r.outcome === 'cited_with_url');
  const scoreSum = rows.reduce((s, r) => s + outcomeScore(r.outcome), 0);

  const engineIds = [...new Set(rows.map((r) => r.engine))];
  const byEngine = engineIds.map((engine) => {
    const subset = rows.filter((r) => r.engine === engine);
    return {
      engine,
      checks: subset.length,
      brandMentions: subset.filter(
        (r) => r.brandMentioned || r.outcome === 'brand_mention' || r.outcome === 'cited_with_url'
      ).length,
      urlCitations: subset.filter((r) => r.urlCited || r.outcome === 'cited_with_url').length,
      avgScore:
        subset.length === 0
          ? 0
          : Math.round(
              (subset.reduce((s, r) => s + outcomeScore(r.outcome), 0) / subset.length) * 10
            ) / 10,
    };
  });

  const outcomeCounts = new Map<string, number>();
  for (const r of rows) {
    outcomeCounts.set(r.outcome, (outcomeCounts.get(r.outcome) ?? 0) + 1);
  }

  const uniquePrompts = new Set(last30.map((r) => r.promptId));
  const recentPromptCoverage =
    promptBankSize > 0 ? Math.round((uniquePrompts.size / promptBankSize) * 100) : 0;

  return {
    totalChecks: rows.length,
    last30Days: last30.length,
    brandMentionRate: rows.length === 0 ? 0 : Math.round((brandMentions.length / rows.length) * 100),
    urlCitationRate: rows.length === 0 ? 0 : Math.round((urlCitations.length / rows.length) * 100),
    avgScore: rows.length === 0 ? 0 : Math.round((scoreSum / rows.length) * 10) / 10,
    byEngine,
    byOutcome: [...outcomeCounts.entries()].map(([outcome, count]) => ({ outcome, count })),
    recentPromptCoverage,
  };
}
