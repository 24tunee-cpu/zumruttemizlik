import type { PrismaClient } from '@prisma/client';
import { makeEngagementGuidePost } from '@/lib/blog-engagement-html';
import { AUTOPILOT_TAGS } from './constants';
import { assertAsciiSlug } from './slug-guard';

type SeasonalTopic = { slug: string; title: string; month: number; keyword: string; intro: string };

export const SEASONAL_TOPICS: SeasonalTopic[] = [
  { slug: 'istanbul-okul-acilis-temizlik-checklist-2026', title: 'Okul Açılışı Temizlik Checklist: İstanbul 2026', month: 9, keyword: 'okul açılışı temizlik', intro: 'Eylül ayında İstanbul’da okul açılışı öncesi ev düzeni ve hijyen planı için pratik checklist.' },
  { slug: 'istanbul-sonbahar-ev-hazirligi-temizlik-2026', title: 'Sonbahar Ev Hazırlığı: İstanbul Temizlik Rehberi 2026', month: 10, keyword: 'sonbahar ev temizliği', intro: 'Ekim ayında nem, polen ve ısıtma öncesi ev hazırlığı adımları.' },
  { slug: 'istanbul-19-mayis-misafir-hazirligi-2026', title: 'Uzun Hafta Misafir Hazırlığı: İstanbul 2026', month: 5, keyword: 'misafir hazırlığı temizlik', intro: 'Mayıs uzun hafta öncesi hızlı ev toparlama ve hijyen planı.' },
  { slug: 'istanbul-yaz-sicakligi-ev-bakimi-2026', title: 'Yaz Sıcağında Ev Bakımı: İstanbul 2026', month: 7, keyword: 'yaz ev bakımı', intro: 'Temmuz sıcaklarında klima, teras ve mutfak hijyeni odaklı rehber.' },
  { slug: 'istanbul-kis-kar-yagisi-ev-onlemleri-2026', title: 'Kar ve Soğuk: İstanbul Ev Önlemleri 2026', month: 1, keyword: 'kış ev bakımı istanbul', intro: 'Ocak ayında ısıtma, nem ve giriş alanı temizliği ipuçları.' },
  { slug: 'istanbul-ramazan-oncesi-derin-temizlik-2026', title: 'Ramazan Öncesi Derin Temizlik: İstanbul 2026', month: 3, keyword: 'ramazan temizlik', intro: 'Mart döneminde mutfak ve ortak alan odaklı derin temizlik planı.' },
  { slug: 'istanbul-yilbasi-dekorasyon-sonrasi-temizlik-2026', title: 'Yılbaşı Sonrası Temizlik: İstanbul 2026', month: 1, keyword: 'yılbaşı sonrası temizlik', intro: 'Ocak başında dekorasyon sökümü ve ev toparlama rehberi.' },
  { slug: 'istanbul-bahar-temizligi-pencere-balkon-2026', title: 'Bahar Temizliği: Pencere ve Balkon Odaklı 2026', month: 4, keyword: 'bahar temizliği istanbul', intro: 'Nisan ayında cam, balkon ve depolama alanı bahar temizliği.' },
  { slug: 'istanbul-yaz-tatili-donusu-ev-temizligi-2026', title: 'Yaz Tatili Dönüşü Ev Temizliği: İstanbul 2026', month: 8, keyword: 'tatil dönüşü temizlik', intro: 'Ağustos sonu kapalı ev açılış temizliği ve hızlı hijyen planı.' },
  { slug: 'istanbul-kis-aylarinda-hava-kalitesi-ev-2026', title: 'Kış Aylarında Ev Hava Kalitesi: İstanbul 2026', month: 12, keyword: 'kış hava kalitesi ev', intro: 'Aralık ayında kalorifer, nem ve filtre bakımı rehberi.' },
  { slug: 'istanbul-17-agustos-deprem-cantasi-ev-2026', title: 'Deprem Çantası ve Ev Düzeni: İstanbul 2026', month: 8, keyword: 'deprem çantası ev', intro: 'Ağustos farkındalık döneminde acil çanta ve ev güvenliği checklist.' },
  { slug: 'istanbul-sonbahar-rutin-temizlik-takvimi-2026', title: 'Sonbahar Rutin Temizlik Takvimi: İstanbul 2026', month: 11, keyword: 'rutin temizlik takvimi', intro: 'Kasım ayında haftalık ev bakım rutini planlama rehberi.' },
];

function buildSeasonalPost(t: SeasonalTopic) {
  return makeEngagementGuidePost({
    slug: t.slug,
    title: t.title,
    metaTitle: t.title.slice(0, 58),
    metaDesc: `${t.keyword} — İstanbul ${t.month}. ay mevsimsel rehber, adım adım checklist.`,
    excerpt: t.intro,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200',
    category: 'Mevsimsel',
    tags: ['istanbul', '2026', 'mevsimsel', AUTOPILOT_TAGS.seasonal],
    keyword: t.keyword,
    intro: t.intro,
    sections: [
      {
        heading: 'Bu ay öncelik verilmesi gerekenler',
        paragraphs: ['Mevsimsel değişim İstanbul’da nem, polen ve ısıtma/soğutma kullanımını etkiler.', 'Aşağıdaki checklist ev ve ofis için uygulanabilir.'],
        bullets: ['Ortak alan toz alma', 'Mutfak/banyo derin temizlik', 'Cam ve balkon', 'Hava filtresi / klima bakımı', 'Dolap içi düzen', 'Çöp ayrıştırma'],
      },
      {
        heading: 'Profesyonel destek ne zaman gerekir?',
        paragraphs: ['Zaman kısıtlıysa veya depozito/misafir teslimi varsa paket temizlik süreyi kısaltır.', 'Keşif sonrası yazılı kapsam alın.'],
      },
      {
        heading: 'Bütçe planlama',
        paragraphs: ['Mevsimsel derin temizlik yılda 2–4 kez planlandığında toplam maliyet öngörülebilir olur.', 'Online fiyat hesaplama ile tahmini aralık alınabilir.'],
      },
    ],
    faq: [
      { q: 'Mevsimsel temizlik ne sıklıkla yapılmalı?', a: 'Genelde ilkbahar ve sonbahar olmak üzere yılda en az iki kez önerilir.' },
      { q: 'İstanbul’da randevu ne zaman alınmalı?', a: 'Yoğun dönemlerde 1–2 hafta önceden plan yapın.' },
      { q: 'Hangi alanlar öncelikli?', a: 'Mutfak, banyo, cam ve hava sirkülasyonu noktaları mevsim geçişlerinde kritiktir.' },
    ],
  });
}

export async function ensureSeasonalBlogDrafts(
  prisma: PrismaClient
): Promise<{ created: number; slugs: string[] }> {
  const month = new Date().getUTCMonth() + 1;
  const due = SEASONAL_TOPICS.filter((t) => t.month === month);
  const slugs: string[] = [];
  let created = 0;

  for (const topic of due) {
    assertAsciiSlug(topic.slug, 'seasonal blog');
    const exists = await prisma.blogPost.findUnique({ where: { slug: topic.slug }, select: { id: true } });
    if (exists) continue;

    const post = buildSeasonalPost(topic);
    const schedule = new Date();
    schedule.setUTCDate(schedule.getUTCDate() + 3);
    schedule.setUTCHours(0, 0, 0, 0);

    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        image: post.image ?? null,
        category: post.category,
        tags: post.tags,
        metaTitle: post.metaTitle ?? null,
        metaDesc: post.metaDesc ?? null,
        author: 'Zümrüt Vadi Temizlik',
        published: false,
        scheduledPublishAt: schedule,
        views: 0,
      },
    });
    slugs.push(post.slug);
    created++;
  }

  return { created, slugs };
}
