/**
 * Unsplash / stok görsel envanteri — değerleri değil URL host’unu raporlar.
 * Gerçek iş fotoğrafı yüklenene kadar operasyon checklist’i.
 */
import { PrismaClient } from '@prisma/client';
import { isStockImageUrl } from '../src/lib/service-images';

async function main() {
  const prisma = new PrismaClient();
  try {
    const services = await prisma.service.findMany({
      select: { slug: true, title: true, image: true },
      orderBy: { slug: 'asc' },
    });
    const gallery = await prisma.gallery.findMany({
      select: { id: true, title: true, image: true },
      take: 200,
    });

    const stockServices = services.filter((s) => isStockImageUrl(s.image));
    const stockGallery = gallery.filter((g) => isStockImageUrl(g.image));

    console.log(`Services: ${stockServices.length}/${services.length} stock/Unsplash`);
    for (const s of stockServices) {
      console.log(`  - ${s.slug}: stock`);
    }
    console.log(`Gallery sample: ${stockGallery.length}/${gallery.length} stock/Unsplash`);
    console.log(
      '\nAction: Admin → Galeri / Hizmetler’de gerçek iş fotoğrafı yükle; sonra seed Unsplash URL’lerini güncelle.'
    );
    console.log('Local drop path (optional): public/images/services/{slug}.webp');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  console.error('DB yoksa: yalnızca seed Unsplash kullanılıyor (prisma/seed.ts + service-images).');
  process.exit(1);
});
