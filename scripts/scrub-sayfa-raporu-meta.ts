/**
 * GSC "(sayfa raporu)" meta sızıntısını DB'den temizle.
 * programmaticMetaOverride → sil / deaktif
 * blogPost.metaTitle/metaDesc → null (CTR map + H1 fallback)
 *
 * Çalıştır: npx tsx scripts/scrub-sayfa-raporu-meta.ts
 */
import { PrismaClient } from '@prisma/client';
import {
  DISTRICT_LANDINGS,
  SERVICE_LANDINGS,
  getDistrictBySlug,
  getServiceBySlug,
} from '../src/config/programmatic-seo';
import { buildSmartMetaForPair } from '../src/lib/programmatic-smart-meta';
import { hasGscPlaceholderLeak } from '../src/lib/gsc-query-guards';
import { BLOG_CTR_META } from '../src/lib/gsc-ctr-overrides';

const prisma = new PrismaClient();

async function main() {
  let progFixed = 0;
  let blogFixed = 0;

  const overrides = await prisma.programmaticMetaOverride.findMany({
    select: { id: true, key: true, title: true, description: true, district: true, service: true },
  });

  for (const row of overrides) {
    if (!hasGscPlaceholderLeak(row.title) && !hasGscPlaceholderLeak(row.description)) continue;
    const [dSlug, sSlug] = row.key.split('/');
    const district = getDistrictBySlug(dSlug) || DISTRICT_LANDINGS.find((d) => d.slug === row.district);
    const service = getServiceBySlug(sSlug) || SERVICE_LANDINGS.find((s) => s.slug === row.service);
    if (district && service) {
      const smart = buildSmartMetaForPair(district, service);
      await prisma.programmaticMetaOverride.update({
        where: { id: row.id },
        data: { title: smart.title, description: smart.description, isActive: true },
      });
      console.log(`pair FIX ${row.key} → ${smart.title}`);
    } else {
      await prisma.programmaticMetaOverride.update({
        where: { id: row.id },
        data: { isActive: false },
      });
      console.log(`pair DEACTIVATE ${row.key}`);
    }
    progFixed++;
  }

  const blogs = await prisma.blogPost.findMany({
    where: {
      OR: [
        { metaTitle: { contains: 'sayfa raporu', mode: 'insensitive' } },
        { metaDesc: { contains: 'sayfa raporu', mode: 'insensitive' } },
      ],
    },
    select: { id: true, slug: true, title: true, metaTitle: true, metaDesc: true },
  });

  for (const post of blogs) {
    const ctr = BLOG_CTR_META[post.slug];
    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        metaTitle: ctr?.title ?? null,
        metaDesc: ctr?.description ?? null,
      },
    });
    console.log(`blog FIX ${post.slug} → ${ctr?.title ?? '(null → H1 fallback)'}`);
    blogFixed++;
  }

  console.log(JSON.stringify({ progFixed, blogFixed, blogMatched: blogs.length }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
