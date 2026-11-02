import { prisma } from '../src/lib/prisma';

async function main() {
  const slugs = [
    'esyalı-ev-temizligi-bos-ev-temizligi-fiyat-farklari',
    'insaat-sonrasi-camlardaki-inatci-bant-harç-lekeleri-temizlik',
    'kisa-hazirlik-temizligi-evini-soğuk-aylara-nasil-hazirlarsiniz',
  ];
  for (const s of slugs) {
    const p = await prisma.blogPost.findUnique({
      where: { slug: s },
      select: { slug: true, published: true, title: true },
    });
    console.log(JSON.stringify(p));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
