/**
 * GEO teknik denetim — robots, NAP, llms, schema hazırlığı.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { PrismaClient } from '@prisma/client';
import { GEO_NAP, GEO_BRAND_NAME, GEO_DIRECTORY_TARGETS } from '@/config/geo-entity';
import { GEO_SSS_PAGES } from '@/config/geo-district-faqs';

export type GeoAuditCheck = {
  id: string;
  label: string;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
};

export type GeoAuditResult = {
  ok: boolean;
  score: number;
  checks: GeoAuditCheck[];
  ranAt: string;
};

function scoreChecks(checks: GeoAuditCheck[]): number {
  if (checks.length === 0) return 0;
  const weights = { pass: 1, warn: 0.5, fail: 0 };
  const total = checks.reduce((s, c) => s + weights[c.status], 0);
  return Math.round((total / checks.length) * 100);
}

export async function runGeoTechnicalAudit(prisma: PrismaClient): Promise<GeoAuditResult> {
  const checks: GeoAuditCheck[] = [];
  const root = process.cwd();

  for (const f of ['llms.txt', 'llms-full.txt']) {
    const exists = fs.existsSync(path.join(root, f)) && fs.existsSync(path.join(root, 'public', f));
    checks.push({
      id: `llms-${f}`,
      label: `${f} mevcut`,
      status: exists ? 'pass' : 'fail',
      detail: exists ? 'Kök ve public kopyası hazır' : 'Dosya eksik',
    });
  }

  const robotsSrc = fs.readFileSync(path.join(root, 'src/app/robots.ts'), 'utf8');
  const aiBots = ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];
  const botsOk = aiBots.every((b) => robotsSrc.includes(b));
  const fullAllow = robotsSrc.includes("allow: '/'") || robotsSrc.includes('allow: "/"');
  checks.push({
    id: 'robots-ai-bots',
    label: 'AI crawler erişimi',
    status: botsOk && fullAllow ? 'pass' : botsOk ? 'warn' : 'fail',
    detail: botsOk
      ? fullAllow
        ? 'Tüm public içerik AI botlarına açık'
        : 'Botlar tanımlı ama kapsam kısıtlı'
      : 'Eksik AI bot tanımı',
  });

  const settings = await prisma.siteSettings.findFirst({
    select: { siteName: true, phone: true, email: true, address: true },
  });
  const napNameOk = (settings?.siteName ?? GEO_NAP.name).includes('Zümrüt');
  const napPhoneOk =
    (settings?.phone ?? '').replace(/\D/g, '').includes('5519250943') ||
    GEO_NAP.telephone.includes('5519250943');
  checks.push({
    id: 'nap-consistency',
    label: 'NAP tutarlılığı',
    status: napNameOk && napPhoneOk ? 'pass' : 'warn',
    detail: `Marka: ${settings?.siteName ?? GEO_NAP.name}, Tel: ${settings?.phone ?? GEO_NAP.telephoneDisplay}`,
  });

  const publishedCount = await prisma.blogPost.count({ where: { published: true } });
  const geoContentCount = await prisma.blogPost.count({
    where: { published: true, content: { contains: 'geo-passage-answer' } },
  });
  checks.push({
    id: 'blog-geo-passage',
    label: 'Blog GEO passage formatı',
    status:
      publishedCount === 0 ? 'warn' : geoContentCount / publishedCount >= 0.5 ? 'pass' : 'warn',
    detail: `${geoContentCount}/${publishedCount} yayınlı yazıda passage marker`,
  });

  checks.push({
    id: 'geo-sss-pages',
    label: 'GEO SSS mini sayfalar',
    status: GEO_SSS_PAGES.length >= 75 ? 'pass' : 'warn',
    detail: `${GEO_SSS_PAGES.length} programmatic SSS sayfası`,
  });

  for (const dir of GEO_DIRECTORY_TARGETS) {
    const url = process.env[dir.envKey]?.trim();
    checks.push({
      id: `dir-${dir.id}`,
      label: `${dir.name} URL`,
      status: url ? 'pass' : 'warn',
      detail: url ?? `${dir.envKey} tanımlı değil`,
    });
  }

  const llms = fs.readFileSync(path.join(root, 'llms.txt'), 'utf8');
  checks.push({
    id: 'llms-brand',
    label: 'llms.txt marka kimliği',
    status: llms.includes(GEO_BRAND_NAME) ? 'pass' : 'fail',
    detail: llms.includes(GEO_BRAND_NAME) ? 'Marka adı mevcut' : 'Marka adı eksik',
  });

  const score = scoreChecks(checks);
  return { ok: checks.every((c) => c.status !== 'fail'), score, checks, ranAt: new Date().toISOString() };
}

export async function persistGeoAuditRun(
  prisma: PrismaClient,
  source: 'cron' | 'manual',
  audit: GeoAuditResult,
  citation?: Record<string, unknown> | null
): Promise<void> {
  await prisma.seoAutomationSyncLog.create({
    data: {
      source: `geo-audit-${source}`,
      status: audit.ok ? 'ok' : 'partial',
      message: `GEO skor: ${audit.score}/100`,
      finishedAt: new Date(),
      stats: { audit, citation: citation ?? null } as object,
    },
  });
}
