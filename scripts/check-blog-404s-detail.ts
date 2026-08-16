import { writeFileSync } from 'node:fs';
import { prisma } from '../src/lib/prisma';

const BASE = 'https://www.zumrutvaditemizlik.com';

async function main() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const ok: string[] = [];
  const fail404: string[] = [];
  const other: Array<{ slug: string; status: number }> = [];

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const res = await fetch(`${BASE}/blog/${p.slug}`, {
      headers: { 'User-Agent': 'Blog404Audit/1.0' },
    });
    if (res.status === 200) ok.push(p.slug);
    else if (res.status === 404) fail404.push(p.slug);
    else other.push({ slug: p.slug, status: res.status });
    if ((i + 1) % 25 === 0) process.stdout.write(`\r${i + 1}/${posts.length}`);
  }

  writeFileSync(
    'scripts/blog-404-detail.json',
    JSON.stringify({ ok, fail404, other, counts: { ok: ok.length, fail404: fail404.length, other: other.length } }, null, 2)
  );

  console.log('\nOK:', ok.length, '404:', fail404.length, 'Other:', other.length);
  console.log('OK sample:', ok.slice(-5));
  console.log('404 sample:', fail404.slice(0, 5));
  console.log('404 avrupa:', fail404.filter((s) => s.includes('-avrupa-')).length);
  console.log('404 v2 style fiyatlari:', fail404.filter((s) => s.includes('-fiyatlari-2026') && !s.includes('-avrupa-')).length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
