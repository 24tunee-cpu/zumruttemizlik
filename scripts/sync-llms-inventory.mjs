/**
 * Build-time llms-full.txt blog envanteri — tsx gerektirmez (Vercel NODE_ENV=production).
 * Runtime cron FS yazmaz; canlı liste: /llms-inventory.txt
 */
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const SECTION_START = '## Otomatik Blog Envanteri (GEO)';
const SECTION_END = '## GEO SSS Mini Sayfalar';

function siteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    'https://www.zumrutvaditemizlik.com';
  return raw.replace(/\/$/, '');
}

function canWrite(dir) {
  const probe = path.join(dir, `.llms-write-probe-${process.pid}`);
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(probe, 'ok');
    fs.unlinkSync(probe);
    return true;
  } catch {
    return false;
  }
}

function patchSection(content, block) {
  if (content.includes(SECTION_START)) {
    const startIdx = content.indexOf(SECTION_START);
    const endIdx = content.includes(SECTION_END) ? content.indexOf(SECTION_END) : content.length;
    return content.slice(0, startIdx) + block + (endIdx < content.length ? content.slice(endIdx) : '');
  }
  if (content.includes(SECTION_END)) {
    return content.replace(SECTION_END, `${block}${SECTION_END}`);
  }
  return `${content.trimEnd()}\n\n${block}`;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log('[llms:inventory] DATABASE_URL yok — atlandı');
    return;
  }

  const rootDir = process.cwd();
  const rootFile = path.resolve(rootDir, 'llms-full.txt');
  const publicFile = path.resolve(rootDir, 'public', 'llms-full.txt');
  const publicDir = path.dirname(publicFile);

  if (!canWrite(publicDir)) {
    console.log('[llms:inventory] FS yazılamıyor — atlandı');
    return;
  }

  const sourcePath = fs.existsSync(rootFile) ? rootFile : publicFile;
  if (!fs.existsSync(sourcePath)) {
    console.log('[llms:inventory] llms-full.txt yok — atlandı');
    return;
  }

  const prisma = new PrismaClient();
  try {
    const base = siteUrl();
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
      `- Canlı envanter: ${base}/llms-inventory.txt`,
      '',
    ];
    for (const p of posts) {
      lines.push(
        `- [${p.title}](${base}/blog/${p.slug}): ${p.category} — güncelleme ${p.updatedAt.toISOString().slice(0, 10)}`
      );
    }
    lines.push('');
    const block = `${lines.join('\n')}\n`;

    let content = fs.readFileSync(sourcePath, 'utf8');
    content = patchSection(content, block);
    content = content.replace(/- Son güncelleme: \d{4}-\d{2}-\d{2}/, `- Son güncelleme: ${now}`);

    try {
      fs.writeFileSync(rootFile, content, 'utf8');
    } catch {
      // kök yazılamazsa public yeterli
    }
    fs.writeFileSync(publicFile, content, 'utf8');
    console.log(`[llms:inventory] ok — ${posts.length} blog`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('[llms:inventory] hata (build devam eder):', e?.message || e);
  process.exitCode = 0;
});
