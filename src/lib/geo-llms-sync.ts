/**
 * llms-full.txt blog/geo-sss envanter senkronu.
 *
 * Vercel serverless FS salt-okunur (EROFS). Runtime'da dosya yazılmaz;
 * envanter build sırasında veya yerel ortamda güncellenir.
 * Canlı dinamik envanter: GET /llms-inventory.txt
 */
import fs from 'node:fs';
import path from 'node:path';
import type { PrismaClient } from '@prisma/client';
import { getSiteUrl } from '@/lib/seo';

const SECTION_START = '## Otomatik Blog Envanteri (GEO)';
const SECTION_END = '## GEO SSS Mini Sayfalar';

export type LlmsSyncResult = {
  blogCount: number;
  updated: boolean;
  skipped?: boolean;
  reason?: string;
};

function resolveLlmsPaths() {
  const rootDir = process.cwd();
  return {
    rootDir,
    rootFile: path.resolve(rootDir, 'llms-full.txt'),
    publicFile: path.resolve(rootDir, 'public', 'llms-full.txt'),
  };
}

/** Probe ile yazılabilirlik — EROFS/EACCES durumunda false, throw yok */
export function canWriteLlmsFiles(): boolean {
  const { publicFile } = resolveLlmsPaths();
  const dir = path.dirname(publicFile);
  const probe = path.join(dir, `.llms-write-probe-${process.pid}`);
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(probe, 'ok', 'utf8');
    fs.unlinkSync(probe);
    return true;
  } catch {
    return false;
  }
}

function readLlmsFullSource(): string | null {
  const { rootFile, publicFile } = resolveLlmsPaths();
  if (fs.existsSync(rootFile)) return fs.readFileSync(rootFile, 'utf8');
  if (fs.existsSync(publicFile)) return fs.readFileSync(publicFile, 'utf8');
  return null;
}

function writeLlmsFullBoth(content: string): void {
  const { rootFile, publicFile } = resolveLlmsPaths();
  try {
    fs.writeFileSync(rootFile, content, 'utf8');
  } catch {
    // kök yazılamazsa public yeterli
  }
  fs.writeFileSync(publicFile, content, 'utf8');
}

function patchBlogInventorySection(content: string, block: string): string {
  let next = content;
  if (next.includes(SECTION_START)) {
    const startIdx = next.indexOf(SECTION_START);
    const endIdx = next.includes(SECTION_END) ? next.indexOf(SECTION_END) : next.length;
    next = next.slice(0, startIdx) + block + (endIdx < next.length ? next.slice(endIdx) : '');
  } else if (next.includes(SECTION_END)) {
    next = next.replace(SECTION_END, `${block}${SECTION_END}`);
  } else {
    next = `${next.trimEnd()}\n\n${block}`;
  }
  return next;
}

export async function buildBlogInventoryMarkdown(
  prisma: PrismaClient,
  opts?: { take?: number }
): Promise<{ markdown: string; blogCount: number; now: string }> {
  const base = getSiteUrl().replace(/\/$/, '');
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { updatedAt: 'desc' },
    take: opts?.take ?? 200,
    select: { slug: true, title: true, category: true, updatedAt: true },
  });

  const now = new Date().toISOString().slice(0, 10);
  const lines = [
    SECTION_START,
    `- Son otomatik güncelleme: ${now}`,
    `- Yayınlanmış blog sayısı: ${posts.length}`,
    `- Not: AI motorları bu listeyi site haritası tamamlayıcısı olarak kullanabilir.`,
    `- Canlı envanter: ${base}/llms-inventory.txt`,
    '',
  ];

  for (const p of posts) {
    lines.push(
      `- [${p.title}](${base}/blog/${p.slug}): ${p.category} — güncelleme ${p.updatedAt.toISOString().slice(0, 10)}`
    );
  }
  lines.push('');

  return { markdown: `${lines.join('\n')}\n`, blogCount: posts.length, now };
}

/**
 * llms-full.txt blog envanterini günceller.
 * Vercel cron/runtime: yazma yok, throw yok → Autopilot `ok` kalır.
 */
export async function syncPublishedBlogsToLlmsFull(prisma: PrismaClient): Promise<LlmsSyncResult> {
  const { markdown, blogCount, now } = await buildBlogInventoryMarkdown(prisma);

  if (!canWriteLlmsFiles()) {
    return {
      blogCount,
      updated: false,
      skipped: true,
      reason: 'read-only-fs',
    };
  }

  const existing = readLlmsFullSource();
  if (!existing) {
    return {
      blogCount,
      updated: false,
      skipped: true,
      reason: 'llms-full-missing',
    };
  }

  let content = patchBlogInventorySection(existing, markdown);
  content = content.replace(/- Son güncelleme: \d{4}-\d{2}-\d{2}/, `- Son güncelleme: ${now}`);

  if (content === existing) {
    return { blogCount, updated: false };
  }

  try {
    writeLlmsFullBoth(content);
    return { blogCount, updated: true };
  } catch (e) {
    const code = e && typeof e === 'object' && 'code' in e ? String((e as { code: unknown }).code) : '';
    if (code === 'EROFS' || code === 'EACCES') {
      return { blogCount, updated: false, skipped: true, reason: 'read-only-fs' };
    }
    throw e;
  }
}

/** GEO SSS bölümünü llms-full.txt'e ekler — RO FS'de no-op */
export function ensureGeoSssSectionInLlmsFull(geoSssSlugs: string[]): {
  updated: boolean;
  skipped?: boolean;
  reason?: string;
} {
  if (!canWriteLlmsFiles()) {
    return { updated: false, skipped: true, reason: 'read-only-fs' };
  }

  const existing = readLlmsFullSource();
  if (!existing) {
    return { updated: false, skipped: true, reason: 'llms-full-missing' };
  }

  if (existing.includes(SECTION_END)) {
    return { updated: false };
  }

  const base = getSiteUrl().replace(/\/$/, '');
  const sssLines = [
    SECTION_END,
    `- Toplam mini SSS sayfası: ${geoSssSlugs.length}`,
    `- Route: /geo-sss/{slug}`,
    `- Canlı envanter: ${base}/llms-inventory.txt`,
    '',
    ...geoSssSlugs.slice(0, 30).map((s) => `- [${s}](${base}/geo-sss/${s})`),
    geoSssSlugs.length > 30 ? `- … ve ${geoSssSlugs.length - 30} sayfa daha` : '',
    '',
  ].filter(Boolean);

  const content = `${existing.trimEnd()}\n\n${sssLines.join('\n')}\n`;

  try {
    writeLlmsFullBoth(content);
    return { updated: true };
  } catch (e) {
    const code = e && typeof e === 'object' && 'code' in e ? String((e as { code: unknown }).code) : '';
    if (code === 'EROFS' || code === 'EACCES') {
      return { updated: false, skipped: true, reason: 'read-only-fs' };
    }
    throw e;
  }
}
