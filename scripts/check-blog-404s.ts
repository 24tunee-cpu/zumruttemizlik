import { prisma } from '../src/lib/prisma';

const BASE = process.env.SITE_URL || 'https://www.zumrutvaditemizlik.com';

async function checkUrl(slug: string): Promise<{ slug: string; status: number; ok: boolean }> {
  const url = `${BASE}/blog/${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Blog404Audit/1.0' },
    });
    return { slug, status: res.status, ok: res.status === 200 };
  } catch {
    return { slug, status: 0, ok: false };
  }
}

async function main() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
    orderBy: { slug: 'asc' },
  });

  console.log(`Checking ${posts.length} published blogs on ${BASE}...`);

  const batchSize = 15;
  const failed: Array<{ slug: string; status: number }> = [];

  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((p) => checkUrl(p.slug)));
    for (const r of results) {
      if (!r.ok) failed.push({ slug: r.slug, status: r.status });
    }
    process.stdout.write(`\r${Math.min(i + batchSize, posts.length)}/${posts.length}`);
  }

  console.log('\n\nFailed:', failed.length);
  const byStatus = new Map<number, string[]>();
  for (const f of failed) {
    const list = byStatus.get(f.status) ?? [];
    list.push(f.slug);
    byStatus.set(f.status, list);
  }
  for (const [status, slugs] of [...byStatus.entries()].sort((a, b) => a[0] - b[0])) {
    console.log(`\nHTTP ${status} (${slugs.length}):`);
    slugs.slice(0, 30).forEach((s) => console.log(' ', s));
    if (slugs.length > 30) console.log(`  ... +${slugs.length - 30} more`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
