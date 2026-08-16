/**
 * Ek geo-sss konuları — statik 3 konu/district'e ek; autopilot ile drip yayın.
 */
import type { PrismaClient } from '@prisma/client';
import { V2_DISTRICTS } from '@/lib/seed-blog-v2-content';
import { GEO_BRAND_NAME } from '@/config/geo-entity';
import { GEO_SSS_DRIP_ANCHOR_ISO, GEO_SSS_PUBLISH_PER_DAY } from './constants';
import { assertAsciiSlug } from './slug-guard';
import { assignPublishSchedule } from '@/lib/blog-schedule';
import type { BlogSeedPost } from '@/lib/seed-blog';

export const EXTRA_GEO_SSS_TOPICS = [
  {
    key: 'ofis-temizligi-fiyati',
    titleSuffix: 'Ofis Temizliği Fiyatı 2026',
    answer: (name: string) =>
      `${GEO_BRAND_NAME}, ${name} bölgesinde 2026 ofis temizliği için m² başına yaklaşık 35–55 TL tahmini aralık sunar; plaza ve açık ofislerde keşif sonrası net teklif verilir.`,
    details: (name: string) => [
      `${name} plazalarında mesai saati, güvenlik kartı ve yük asansörü randevu planını etkiler.`,
      'Düzenli sözleşme ile birim fiyat avantajı sağlanabilir.',
    ],
    serviceSlug: 'ofis-temizligi',
  },
  {
    key: 'insaat-sonrasi-sure',
    titleSuffix: 'İnşaat Sonrası Temizlik Ne Kadar Sürer?',
    answer: (name: string) =>
      `${name} bölgesinde 70–120 m² dairelerde inşaat sonrası temizlik genelde 1–2 gün sürer; ${GEO_BRAND_NAME} keşifte net süre planı paylaşır.`,
    details: (name: string) => [
      `${name} yeni projelerinde toz yoğunluğu ve cam sayısı süreyi uzatabilir.`,
      'Villa ve dublekslerde ekip sayısı artırılarak teslim hızlandırılır.',
    ],
    serviceSlug: 'insaat-sonrasi-temizlik',
  },
  {
    key: 'koltuk-yikama-fiyati',
    titleSuffix: 'Koltuk Yıkama Fiyatı 2026',
    answer: (name: string) =>
      `${GEO_BRAND_NAME}, ${name} bölgesinde 2026 koltuk yıkama için 2+1 takım genelde 900–1.800 TL aralığındadır; kumaş tipi fiyatı belirler.`,
    details: (name: string) => [
      `${name} adreslerinde yerinde yıkama trafik ve park koşullarına bağlıdır.`,
      'Kuruma süresi ve leke garantisi teklifte yazılmalıdır.',
    ],
    serviceSlug: 'koltuk-yikama',
  },
  {
    key: 'acil-temizlik',
    titleSuffix: 'Acil Temizlik Hizmeti',
    answer: (name: string) =>
      `${GEO_BRAND_NAME}, ${name} bölgesinde aynı gün veya ertesi gün acil ev/ofis temizliği için müsaitlik durumuna göre ekip yönlendirir.`,
    details: (name: string) => [
      `${name} için acil taleplerde kapsam listesi telefon veya WhatsApp ile netleştirilir.`,
      'Depozito teslimi ve misafir öncesi hazırlık en sık acil senaryolardır.',
    ],
    serviceSlug: 'ev-temizligi',
  },
  {
    key: 'airbnb-temizlik',
    titleSuffix: 'Airbnb / Kısa Konaklama Temizliği',
    answer: (name: string) =>
      `${GEO_BRAND_NAME}, ${name} bölgesinde Airbnb checkout temizliği için standart daire paketleri sunar; çamaşır/havlu opsiyonel eklenir.`,
    details: (name: string) => [
      `${name} kısa konaklama yoğun bölgelerinde hızlı dönüş süresi kritiktir.`,
      'Fotoğraf standardına uygun teslim checklist kullanılabilir.',
    ],
    serviceSlug: 'ev-temizligi',
  },
  {
    key: 'villa-temizlik-fiyati',
    titleSuffix: 'Villa Temizliği Fiyatı 2026',
    answer: (name: string) =>
      `${GEO_BRAND_NAME}, ${name} çevresinde villa temizliği 2026'da genişlik ve kat sayısına göre 12.000 TL'den başlayan paketlerle sunulur; keşif zorunludur.`,
    details: (name: string) => [
      `${name} villa bölgelerinde bahçe, cam cephe ve yüksek tavan ek süre gerektirir.`,
      'Mevsimsel kapalı villa açılış temizlikleri ayrı planlanır.',
    ],
    serviceSlug: 'ev-temizligi',
  },
  {
    key: 'depozito-teslim-listesi',
    titleSuffix: 'Depozito İadesi Temizlik Listesi',
    answer: (name: string) =>
      `${name} bölgesinde depozito iadesi için mutfak dolap içi, buzdolabı, fırın, banyo kireç ve zemin detay temizliği standart beklentidir; ${GEO_BRAND_NAME} yazılı checklist ile teslim eder.`,
    details: (name: string) => [
      `${name} kira sözleşmelerindeki temizlik maddesi ile profesyonel kapsamı karşılaştırın.`,
      'Hasarlı alanlar temizlik kapsamı dışında ayrı değerlendirilir.',
    ],
    serviceSlug: 'ev-temizligi',
  },
] as const;

function buildGeoSssSeedRows() {
  const rows: Array<{
    slug: string;
    districtSlug: string;
    districtName: string;
    title: string;
    directAnswer: string;
    details: string[];
    relatedLinksJson: { href: string; label: string }[];
  }> = [];

  for (const d of V2_DISTRICTS) {
    for (const topic of EXTRA_GEO_SSS_TOPICS) {
      rows.push({
        slug: `${d.slug}-${topic.key}-2026`,
        districtSlug: d.slug,
        districtName: d.name,
        title: `${d.name} ${topic.titleSuffix}`,
        directAnswer: topic.answer(d.name),
        details: topic.details(d.name),
        relatedLinksJson: [
          { href: `/bolgeler/${d.slug}`, label: `${d.name} temizlik` },
          { href: `/hizmetler/${topic.serviceSlug}`, label: 'Hizmet detayı' },
          { href: '/fiyat-hesaplama', label: 'Fiyat hesapla' },
          { href: '/randevu', label: 'Ücretsiz keşif' },
        ],
      });
    }
  }
  return rows;
}

export async function bootstrapGeoSssDrip(prisma: PrismaClient): Promise<{
  created: number;
  skipped: number;
  total: number;
}> {
  const rows = buildGeoSssSeedRows();
  const pseudoPosts: BlogSeedPost[] = rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.directAnswer,
    content: '',
    category: 'GEO SSS',
    tags: [],
  }));

  const scheduled = assignPublishSchedule(pseudoPosts, {
    anchor: new Date(GEO_SSS_DRIP_ANCHOR_ISO),
    postsPerDay: GEO_SSS_PUBLISH_PER_DAY,
  });

  const scheduleBySlug = new Map(scheduled.map((s) => [s.slug, s.scheduledPublishAt]));

  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    assertAsciiSlug(row.slug, 'geo-sss drip');
    const existing = await prisma.geoSssContent.findUnique({
      where: { slug: row.slug },
      select: { id: true },
    });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.geoSssContent.create({
      data: {
        ...row,
        relatedLinksJson: row.relatedLinksJson,
        published: false,
        scheduledPublishAt: scheduleBySlug.get(row.slug) ?? null,
      },
    });
    created++;
  }

  return { created, skipped, total: rows.length };
}

export function extraGeoSssCount(): number {
  return V2_DISTRICTS.length * EXTRA_GEO_SSS_TOPICS.length;
}
