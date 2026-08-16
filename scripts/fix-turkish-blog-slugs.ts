import { prisma } from '../src/lib/prisma';

/** Unicode slug → ASCII slug (Next.js/Vercel dynamic route uyumu) */
const SLUG_FIXES: Array<{ from: string; to: string }> = [
  {
    from: 'esyalı-ev-temizligi-bos-ev-temizligi-fiyat-farklari',
    to: 'esyali-ev-temizligi-bos-ev-temizligi-fiyat-farklari',
  },
  {
    from: 'insaat-sonrasi-camlardaki-inatci-bant-harç-lekeleri-temizlik',
    to: 'insaat-sonrasi-camlardaki-inatci-bant-harc-lekeleri-temizlik',
  },
  {
    from: 'kisa-hazirlik-temizligi-evini-soğuk-aylara-nasil-hazirlarsiniz',
    to: 'kisa-hazirlik-temizligi-evini-soguk-aylara-nasil-hazirlarsiniz',
  },
];

async function main() {
  for (const { from, to } of SLUG_FIXES) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: from } });
    if (!existing) {
      const already = await prisma.blogPost.findUnique({ where: { slug: to } });
      console.log(already ? `skip (already fixed): ${to}` : `missing: ${from}`);
      continue;
    }
    const conflict = await prisma.blogPost.findUnique({ where: { slug: to } });
    if (conflict && conflict.id !== existing.id) {
      throw new Error(`Slug conflict: ${to}`);
    }
    await prisma.blogPost.update({
      where: { id: existing.id },
      data: { slug: to },
    });
    console.log(`fixed: ${from} → ${to}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
