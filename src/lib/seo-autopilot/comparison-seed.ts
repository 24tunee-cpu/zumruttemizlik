import type { PrismaClient } from '@prisma/client';
import { makeEngagementGuidePost } from '@/lib/blog-engagement-html';
import { assignPublishSchedule } from '@/lib/blog-schedule';
import { AUTOPILOT_TAGS, COMPARISON_SCHEDULE_ANCHOR_ISO } from './constants';
import { assertAsciiSlug } from './slug-guard';
import type { BlogSeedPost } from '@/lib/seed-blog';

export const COMPARISONS: Array<{
  slug: string;
  title: string;
  keyword: string;
  a: string;
  b: string;
}> = [
  { slug: 'profesyonel-vs-kendi-basina-ev-temizligi-2026', title: 'Profesyonel mi Kendi Başına mı? Ev Temizliği Karşılaştırması 2026', keyword: 'profesyonel ev temizliği karşılaştırma', a: 'Profesyonel temizlik', b: 'Kendi başına temizlik' },
  { slug: 'kira-teslim-vs-genel-ev-temizligi-2026', title: 'Kira Teslim vs Genel Ev Temizliği: Farklar ve Maliyet 2026', keyword: 'kira teslim temizlik fark', a: 'Kira teslim paketi', b: 'Genel ev temizliği' },
  { slug: 'haftalik-vs-aylik-ofis-temizligi-2026', title: 'Haftalık mı Aylık mı Ofis Temizliği? Hangisi Mantıklı 2026', keyword: 'ofis temizliği sözleşme karşılaştırma', a: 'Haftalık ofis temizliği', b: 'Aylık ofis temizliği' },
  { slug: 'insaat-sonrasi-vs-derin-temizlik-2026', title: 'İnşaat Sonrası vs Derin Temizlik: Ne Zaman Hangisi? 2026', keyword: 'inşaat sonrası derin temizlik fark', a: 'İnşaat sonrası temizlik', b: 'Derin temizlik' },
  { slug: 'kuru-temizlik-vs-yerinde-koltuk-yikama-2026', title: 'Kuru Temizlik vs Yerinde Koltuk Yıkama Karşılaştırması 2026', keyword: 'koltuk yıkama karşılaştırma', a: 'Kuru temizlik', b: 'Yerinde yıkama' },
  { slug: 'cam-silikon-vs-profesyonel-cam-temizligi-2026', title: 'Kendi Cam Temizliği vs Profesyonel: Sonuç Farkı 2026', keyword: 'cam temizliği karşılaştırma', a: 'Evde cam temizliği', b: 'Profesyonel cam temizliği' },
  { slug: 'site-temizligi-vs-bireysel-anlasmali-2026', title: 'Site Temizliği vs Bireysel Anlaşmalı Firma 2026', keyword: 'site temizliği karşılaştırma', a: 'Site yönetimi temizliği', b: 'Bireysel firma' },
  { slug: 'bos-ev-vs-esyali-ev-temizligi-maliyet-2026', title: 'Boş Ev vs Eşyalı Ev Temizliği Maliyet Karşılaştırması 2026', keyword: 'boş ev eşyalı ev temizlik fark', a: 'Boş ev temizliği', b: 'Eşyalı ev temizliği' },
  { slug: 'depozito-paketi-vs-standart-temizlik-2026', title: 'Depozito Paketi vs Standart Temizlik: Kiracılar İçin 2026', keyword: 'depozito temizlik paketi', a: 'Depozito odaklı paket', b: 'Standart temizlik' },
  { slug: 'villa-vs-daire-temizligi-sure-maliyet-2026', title: 'Villa vs Daire Temizliği: Süre ve Maliyet Tablosu 2026', keyword: 'villa daire temizlik karşılaştırma', a: 'Villa temizliği', b: 'Daire temizliği' },
  { slug: 'gunluk-vs-haftalik-airbnb-temizligi-2026', title: 'Günlük vs Haftalık Airbnb Temizliği: Host Rehberi 2026', keyword: 'airbnb temizlik sıklığı', a: 'Her checkout temizlik', b: 'Haftalık derin temizlik' },
  { slug: 'organik-vs-kimyasal-temizlik-urunleri-2026', title: 'Organik vs Kimyasal Temizlik Ürünleri: Ev İçin Karşılaştırma 2026', keyword: 'temizlik ürünü karşılaştırma', a: 'Organik / yeşil ürünler', b: 'Klasik kimyasal ürünler' },
  { slug: 'steam-vs-kuru-buhar-hali-temizligi-2026', title: 'Buhar vs Kuru Halı Yıkama: Hangisi Daha Etkili? 2026', keyword: 'halı yıkama yöntemi', a: 'Buhar temizlik', b: 'Kuru yıkama' },
  { slug: 'merdiven-vs-asansorlu-bina-temizlik-maliyeti-2026', title: 'Asansörlü vs Asansörsüz Bina Temizlik Maliyeti 2026', keyword: 'apartman temizlik maliyeti', a: 'Asansörlü bina', b: 'Asansörsüz bina' },
  { slug: 'sabah-vs-aksam-randevu-temizlik-verimliligi-2026', title: 'Sabah mı Akşam mı Randevu? Temizlik Verimliliği 2026', keyword: 'temizlik randevu saati', a: 'Sabah randevu', b: 'Akşam randevu' },
  { slug: 'tek-ekip-vs-cift-ekip-buyuk-daire-2026', title: 'Tek Ekip vs Çift Ekip: Büyük Dairelerde Süre Karşılaştırması 2026', keyword: 'temizlik ekip sayısı', a: 'Tek ekip', b: 'Çift ekip' },
  { slug: 'fiyat-hesaplama-vs-ucretsiz-kesif-2026', title: 'Online Fiyat Hesaplama vs Ücretsiz Keşif: Hangisi Doğru? 2026', keyword: 'temizlik fiyat hesaplama keşif', a: 'Online hesaplama', b: 'Yerinde keşif' },
  { slug: 'plaza-ofis-vs-acik-ofis-temizligi-2026', title: 'Plaza Ofis vs Açık Ofis Temizliği Karşılaştırması 2026', keyword: 'açık ofis temizlik', a: 'Plaza ofis', b: 'Açık ofis' },
  { slug: 'mutfak-deprem-cantasi-vs-duzenli-bakim-2026', title: 'Arızi Temizlik vs Düzenli Bakım: Mutfak Hijyeni 2026', keyword: 'mutfak hijyen bakım', a: 'Arızi derin temizlik', b: 'Haftalık bakım' },
  { slug: 'yaz-kis-temizlik-oncelikleri-istanbul-2026', title: 'Yaz vs Kış Temizlik Öncelikleri: İstanbul Rehberi 2026', keyword: 'mevsimsel temizlik karşılaştırma', a: 'Yaz öncelikleri', b: 'Kış öncelikleri' },
  { slug: 'istanbul-avrupa-vs-anadolu-temizlik-fiyatlari-2026', title: 'Avrupa vs Anadolu Yakası Temizlik Fiyatları Karşılaştırması 2026', keyword: 'istanbul yakası temizlik fiyat', a: 'Avrupa Yakası', b: 'Anadolu Yakası' },
  { slug: 'sigortali-vs-sigortasiz-temizlik-ekibi-2026', title: 'Sigortalı vs Sigortasız Temizlik Ekibi: Risk Karşılaştırması 2026', keyword: 'sigortalı temizlik firması', a: 'Sigortalı ekip', b: 'Sigortasız ekip' },
  { slug: 'tek-seferlik-vs-duzenli-sozlesme-ev-2026', title: 'Tek Seferlik vs Düzenli Sözleşme: Ev Temizliği 2026', keyword: 'düzenli ev temizlik sözleşmesi', a: 'Tek seferlik', b: 'Aylık sözleşme' },
  { slug: 'balkon-cam-vs-ic-cam-temizligi-maliyet-2026', title: 'Balkon Camı vs İç Cam Temizliği Maliyet Farkı 2026', keyword: 'cam temizliği maliyet', a: 'Balkon camları', b: 'İç camlar' },
  { slug: 'profesyonel-dezenfeksiyon-vs-evde-sprey-2026', title: 'Profesyonel Dezenfeksiyon vs Evde Sprey: Farklar 2026', keyword: 'dezenfeksiyon karşılaştırma', a: 'Profesyonel uygulama', b: 'Evde sprey' },
  { slug: 'tasinma-oncesi-vs-sonrasi-temizlik-paketi-2026', title: 'Taşınma Öncesi vs Sonrası Temizlik Paketi 2026', keyword: 'taşınma temizlik paketi', a: 'Eski ev çıkış', b: 'Yeni ev giriş' },
  { slug: 'kisa-konaklama-vs-uzun-kira-temizlik-plani-2026', title: 'Kısa Konaklama vs Uzun Kira: Temizlik Planı Karşılaştırması 2026', keyword: 'kısa konaklama temizlik planı', a: 'Airbnb / kısa konaklama', b: 'Uzun dönem kira' },
  { slug: 'yerel-firma-vs-franchise-temizlik-zinciri-2026', title: 'Yerel Firma vs Franchise Zincir: İstanbul Karşılaştırması 2026', keyword: 'temizlik firması seçimi', a: 'Yerel firma', b: 'Franchise zincir' },
  { slug: 'parke-cila-vs-laminat-temizlik-farklari-2026', title: 'Parke Cila vs Laminat Zemin Temizlik Farkları 2026', keyword: 'parke laminat temizlik', a: 'Parke / cila', b: 'Laminat zemin' },
  { slug: 'ofis-mutfak-vs-ev-mutfak-hijyen-2026', title: 'Ofis Mutfak vs Ev Mutfak Hijyeni: Karşılaştırmalı Rehber 2026', keyword: 'ofis mutfak hijyeni', a: 'Ofis mutfak', b: 'Ev mutfak' },
  { slug: 'camasir-makinesi-temizligi-evde-vs-servis-2026', title: 'Evde vs Servis: Çamaşır Makinesi Temizliği 2026', keyword: 'çamaşır makinesi temizlik', a: 'Evde temizlik', b: 'Servis / profesyonel' },
  { slug: 'banyo-kirec-evde-vs-profesyonel-2026', title: 'Evde Kireç Sökme vs Profesyonel Banyo Temizliği 2026', keyword: 'banyo kireç temizlik', a: 'Evde uygulama', b: 'Profesyonel banyo paketi' },
  { slug: 'insaat-tozu-evde-vs-endustriyel-vakum-2026', title: 'Ev Tipi vs Endüstriyel Vakum: İnşaat Tozu Temizliği 2026', keyword: 'inşaat tozu temizlik', a: 'Ev tipi ekipman', b: 'Endüstiyel vakum' },
  { slug: 'pet-dostu-vs-standart-temizlik-urunu-2026', title: 'Pet Dostu vs Standart Temizlik: Evde Güvenlik 2026', keyword: 'pet dostu temizlik', a: 'Pet dostu ürünler', b: 'Standart ürünler' },
  { slug: 'yuksek-kat-vs-zemin-kat-temizlik-suresi-2026', title: 'Yüksek Kat vs Zemin Kat: Temizlik Süresi Karşılaştırması 2026', keyword: 'kat temizlik süresi', a: 'Yüksek kat daire', b: 'Zemin / bahçe kat' },
  { slug: 'istanbul-trafik-saatine-gore-randevu-2026', title: 'Trafik Saatine Göre Randevu: Sabah Erken vs Öğleden Sonra 2026', keyword: 'temizlik randevu trafik', a: 'Sabah erken', b: 'Öğleden sonra' },
  { slug: 'tek-oda-vs-tum-daire-paket-fiyat-2026', title: 'Tek Oda vs Tüm Daire Paket: Fiyat Karşılaştırması 2026', keyword: 'oda bazlı temizlik fiyat', a: 'Tek oda paketi', b: 'Tüm daire paketi' },
  { slug: 'yazlik-ev-acilis-vs-kapanis-temizligi-2026', title: 'Yazlık Açılış vs Kapanış Temizliği: Ne Zaman Hangisi? 2026', keyword: 'yazlık temizlik', a: 'Sezon açılış', b: 'Sezon kapanış' },
  { slug: 'istanbul-site-guvenlik-vs-musait-randevu-2026', title: 'Site Güvenlik Kuralları vs Müsait Randevu: Planlama 2026', keyword: 'site temizlik randevu', a: 'Hafta içi mesai', b: 'Hafta sonu' },
  { slug: 'profesyonel-foto-cekimi-oncesi-temizlik-2026', title: 'Emlak Fotoğrafı Öncesi vs Normal Temizlik: Farklar 2026', keyword: 'emlak fotoğraf temizlik', a: 'Fotoğraf staging temizlik', b: 'Normal temizlik' },
];

function buildComparisonPost(c: (typeof COMPARISONS)[0]): BlogSeedPost {
  return makeEngagementGuidePost({
    slug: c.slug,
    title: c.title,
    metaTitle: c.title.slice(0, 58),
    metaDesc: `${c.a} ve ${c.b} karşılaştırması — İstanbul 2026 güncel rehber, maliyet ve karar ipuçları.`,
    excerpt: `${c.a} ile ${c.b} arasındaki farkları, maliyet ve süre açısından İstanbul 2026 perspektifinden karşılaştırıyoruz.`,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200',
    category: 'Karşılaştırma',
    tags: ['istanbul', '2026', 'karşılaştırma', AUTOPILOT_TAGS.comparison],
    keyword: c.keyword,
    intro: `İstanbul'da ${c.keyword} arayanlar için ${c.a} ve ${c.b} seçeneklerini yan yana değerlendirdik.`,
    sections: [
      {
        heading: `${c.a} — artılar ve eksiler`,
        paragraphs: [
          `${c.a} genelde belirli bir bütçe ve zaman çerçevesinde planlanır; kapsam net yazılmalıdır.`,
          'Profesyonel hizmette sigorta, ekipman ve yazılı teklif kontrol listesi oluşturun.',
        ],
        bullets: ['Yazılı kapsam', 'Süre tahmini', 'Garanti / telafi', 'Sigorta', 'Referans'],
      },
      {
        heading: `${c.b} — artılar ve eksiler`,
        paragraphs: [
          `${c.b} maliyet avantajı sunabilir ancak süre ve ekipman sizin sorumluluğunuzdadır.`,
          'Sonuç beklentisi yüksekse (depozito, Airbnb, ofis) profesyonel paket daha öngörülebilir olabilir.',
        ],
      },
      {
        heading: 'Hangisini ne zaman tercih etmeli?',
        paragraphs: [
          'Acil teslim, depozito veya kurumsal hijyen gereksinimlerinde profesyonel paket öne çıkar.',
          'Düşük bütçe ve esnek zaman varsa kısmi işler kendi başınıza planlanabilir.',
        ],
      },
    ],
    faq: [
      { q: `${c.a} ile ${c.b} fiyat farkı ne kadar?`, a: 'Konut tipi ve kapsama göre değişir; online fiyat hesaplama ve keşif ile netleştirin.' },
      { q: 'İstanbul’da randevu nasıl planlanır?', a: 'Trafik ve site kurallarına göre sabah erken veya öğleden sonra slot tercih edin.' },
      { q: 'Yazılı teklif şart mı?', a: 'Evet; kapsam maddeleri olmadan fiyat karşılaştırması yanıltıcı olabilir.' },
    ],
  });
}

export async function bootstrapComparisonBlogs(prisma: PrismaClient): Promise<{
  created: number;
  skipped: number;
  total: number;
}> {
  const posts = COMPARISONS.map(buildComparisonPost);
  const scheduled = assignPublishSchedule(posts, {
    anchor: new Date(COMPARISON_SCHEDULE_ANCHOR_ISO),
    postsPerDay: 1,
  });
  const bySlug = new Map(scheduled.map((s) => [s.slug, s.scheduledPublishAt]));

  let created = 0;
  let skipped = 0;

  for (const post of posts) {
    assertAsciiSlug(post.slug, 'comparison blog');
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug }, select: { id: true } });
    if (existing) {
      skipped++;
      continue;
    }

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
        scheduledPublishAt: bySlug.get(post.slug) ?? null,
        views: 0,
      },
    });
    created++;
  }

  return { created, skipped, total: posts.length };
}
