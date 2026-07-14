/**
 * llms-full.txt — yayınlanmış blog URL envanterini otomatik günceller.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { PrismaClient } from '@prisma/client';
import { getSiteUrl } from '@/lib/seo';

const SECTION_START = '## Otomatik Blog Envanteri (GEO)';
const SECTION_END = '## GEO SSS Mini Sayfalar';

export async function syncPublishedBlogsToLlmsFull(prisma: PrismaClient): Promise<{
  blogCount: number;
  updated: boolean;
}> {
  const rootDir = process.cwd();
  const filePath = path.resolve(rootDir, 'llms-full.txt');
  if (!fs.existsSync(filePath)) {
    throw new Error('llms-full.txt bulunamadı');
  }

  const base = getSiteUrl().replace(/\/$/, '');
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { updatedAt: 'desc' },
    take: 200,
    select: { slug: true, title: true, category: true, updatedAt: true },
  });

  const now = new Date().toISOString().slice(0, 10);
  const lines = [
    SECTION_START,
    `- Son otomatik güncelleme: ${now}`,
    `- Yayınlanmış blog sayısı: ${posts.length}`,
    `- Not: AI motorları bu listeyi site haritası tamamlayıcısı olarak kullanabilir.`,
    '',
  ];

  for (const p of posts) {
    lines.push(
      `- [${p.title}](${base}/blog/${p.slug}): ${p.category} — güncelleme ${p.updatedAt.toISOString().slice(0, 10)}`
    );
  }
  lines.push('');

  const block = `${lines.join('\n')}\n`;
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes(SECTION_START)) {
    const startIdx = content.indexOf(SECTION_START);
    const endIdx = content.includes(SECTION_END)
      ? content.indexOf(SECTION_END)
      : content.length;
    content = content.slice(0, startIdx) + block + (endIdx < content.length ? content.slice(endIdx) : '');
  } else if (content.includes(SECTION_END)) {
    content = content.replace(SECTION_END, `${block}${SECTION_END}`);
  } else {
    content = `${content.trimEnd()}\n\n${block}`;
  }

  content = content.replace(
    /- Son güncelleme: \d{4}-\d{2}-\d{2}/,
    `- Son güncelleme: ${now}`
  );

  const prev = fs.readFileSync(filePath, 'utf8');
  if (prev === content) {
    return { blogCount: posts.length, updated: false };
  }

  fs.writeFileSync(filePath, content, 'utf8');

  const publicPath = path.resolve(rootDir, 'public', 'llms-full.txt');
  fs.writeFileSync(publicPath, content, 'utf8');

  return { blogCount: posts.length, updated: true };
}

/** GEO SSS bölümünü llms-full.txt'e ekler (bir kez veya güncelleme) */
export function ensureGeoSssSectionInLlmsFull(geoSssSlugs: string[]): void {
  const rootDir = process.cwd();
  const filePath = path.resolve(rootDir, 'llms-full.txt');
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  const base = getSiteUrl().replace(/\/$/, '');

  if (!content.includes(SECTION_END)) {
    const sssLines = [
      SECTION_END,
      `- Toplam mini SSS sayfası: ${geoSssSlugs.length}`,
      `- Route: /geo-sss/{slug}`,
      '',
      ...geoSssSlugs.slice(0, 30).map((s) => `- [${s}](${base}/geo-sss/${s})`),
      geoSssSlugs.length > 30 ? `- … ve ${geoSssSlugs.length - 30} sayfa daha` : '',
      '',
    ].filter(Boolean);
    content = `${content.trimEnd()}\n\n${sssLines.join('\n')}\n`;
    fs.writeFileSync(filePath, content, 'utf8');
    fs.writeFileSync(path.resolve(rootDir, 'public', 'llms-full.txt'), content, 'utf8');
  }
}
