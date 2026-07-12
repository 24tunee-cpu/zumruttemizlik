/**
 * 100 otomatik zamanlanmış blog yazısı — 50 fiyat + 50 SEO (25 ilçe × 2).
 * Slug'lar mevcut kanonik set ile çakışmaz.
 */
import type { BlogSeedPost } from './seed-blog';
import { ROOM_PRICES, ROOM_OPTIONS, M2_RATES, formatTL } from '@/config/pricing';
import {
  makePricingPost,
  type PricingGuideConfig,
} from './seed-blog-pricing';
import { makeSeoGuidePost, type SeoGuideConfig } from './blog-seo-html';

const IMG_HOME = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200';
const IMG_OFFICE = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200';

export const V2_DISTRICTS = [
  { slug: 'maslak', name: 'Maslak' },
  { slug: 'tarabya', name: 'Tarabya' },
  { slug: 'bahcekoy', name: 'Bahçeköy' },
  { slug: 'kagithane', name: 'Kağıthane' },
  { slug: 'levent', name: 'Levent' },
  { slug: 'etiler', name: 'Etiler' },
  { slug: 'goztepe', name: 'Göztepe' },
  { slug: 'moda', name: 'Moda' },
  { slug: 'acibadem', name: 'Acıbadem' },
  { slug: 'atasehir', name: 'Ataşehir' },
  { slug: 'bakirkoy', name: 'Bakırköy' },
  { slug: 'maltepe', name: 'Maltepe' },
  { slug: 'kartal', name: 'Kartal' },
  { slug: 'pendik', name: 'Pendik' },
  { slug: 'umraniye', name: 'Ümraniye' },
  { slug: 'eyupsultan', name: 'Eyüpsultan' },
  { slug: 'beykoz', name: 'Beykoz' },
  { slug: 'basaksehir', name: 'Başakşehir' },
  { slug: 'avcilar', name: 'Avcılar' },
  { slug: 'esenyurt', name: 'Esenyurt' },
  { slug: 'bahcesehir', name: 'Bahçeşehir' },
  { slug: 'bostanci', name: 'Bostancı' },
  { slug: 'suadiye', name: 'Suadiye' },
  { slug: 'nisantasi', name: 'Nişantaşı' },
  { slug: 'mecidiyekoy', name: 'Mecidiyeköy' },
] as const;

const DEFAULT_FACTORS = [
  'Metrekare ve oda / alan sayısı',
  'Kirlilik ve son temizlikten geçen süre',
  'Erişim, otopark ve asansör koşulları',
  'Cam, balkon ve beyaz eşya ekstraları',
  'Hafta içi / hafta sonu randevu saati',
  'Tek seferlik vs düzenli sözleşme',
  'İnşaat / tadilat sonrası ek iş yükü',
  'Site güvenliği ve giriş prosedürleri',
];

function evPriceRows(): PricingGuideConfig['priceRows'] {
  return ROOM_OPTIONS.map((room) => {
    const [lo, hi] = ROOM_PRICES[room];
    return {
      label: `${room} daire (detay)`,
      range: `${formatTL(lo)} – ${formatTL(hi)}`,
      note: 'Standart kapsam, keşif ile netleşir',
    };
  });
}

function ofisPriceRows(): PricingGuideConfig['priceRows'] {
  const r = M2_RATES.ofis;
  return [
    {
      label: '50 m² ofis (örnek)',
      range: `${formatTL(r.floorMin)} – ${formatTL(r.floorMax)}`,
      note: 'Taban uygulanabilir',
    },
    {
      label: '100 m² ofis (örnek)',
      range: `${formatTL(100 * r.min)} – ${formatTL(100 * r.max)}`,
      note: 'Orta kapsam',
    },
    {
      label: '200 m² ofis (örnek)',
      range: `${formatTL(200 * r.min)} – ${formatTL(200 * r.max)}`,
      note: 'Plaza / açık ofis',
    },
    {
      label: 'Birim fiyat (m²)',
      range: `${r.min} – ${r.max} TL/m²`,
      note: 'Mesai içi / dışı fark edebilir',
    },
  ];
}

export function generateV2PricingPosts(): BlogSeedPost[] {
  const posts: BlogSeedPost[] = [];

  for (const d of V2_DISTRICTS) {
    const evCfg: PricingGuideConfig = {
      slug: `${d.slug}-ev-temizligi-fiyatlari-2026`,
      title: `${d.name} Ev Temizliği Fiyatları 2026 | Güncel Tahmini Tablo`,
      metaTitle: `${d.name} Ev Temizliği Fiyatları 2026 | İstanbul`,
      metaDesc: `${d.name} ev temizliği 2026 fiyat aralıkları: daire tipine göre tahmini tablo, faktörler ve ücretsiz keşif. Online fiyat hesaplama ile anında tahmin.`,
      excerpt: `${d.name} bölgesinde 2026 ev temizliği fiyat rehberi: daire tiplerine göre tahmini aralıklar, kapsam farkları ve bütçeleme ipuçları.`,
      image: IMG_HOME,
      tags: [d.slug, 'ev temizliği', 'fiyat 2026', 'istanbul', d.name.toLowerCase()],
      serviceName: `${d.name} Ev Temizliği`,
      serviceSlug: 'ev-temizligi',
      intro: `${d.name}, İstanbul'un en çok talep gören bölgelerinden biridir. 2026 yılında ${d.name} ev temizliği fiyatları; daire tipi, kirlilik düzeyi, cam/balkon ekstraları ve erişim koşullarına göre değişir. Bu rehber orta-üst segment profesyonel hizmet için güncel tahmini aralıkları özetler.`,
      priceRows: evPriceRows(),
      priceUnitNote: `${d.name} için fiyatlar İstanbul ortalamasına göre ulaşım ve altyapı koşullarına bağlı olarak tablonun alt veya üst bandında konumlanabilir.`,
      factors: DEFAULT_FACTORS,
      packages: [
        { name: 'Standart detay', desc: 'Mutfak, banyo, toz alma, zemin, yaşam alanları.', priceHint: 'Tablo alt–orta band' },
        { name: 'Geniş kapsam', desc: 'Dolap içi, cam, balkon, detay süpürme.', priceHint: 'Tablo orta–üst band' },
        { name: 'Düzenli paket', desc: 'Haftalık / iki haftada bir plan.', priceHint: 'Tek seferlikten avantajlı' },
      ],
      regionalNote: `${d.name} bölgesinde site, rezidans ve apartman dairelerinde aynı gün keşif mümkün olabilir. Sarıyer hattı (Zekeriyaköy, Maslak, Tarabya) operasyonlarımızın güçlü olduğu bölgelerdendir; ${d.name} için de hızlı ekip yönlendirmesi yapıyoruz.`,
      faq: [
        { q: `${d.name} ev temizliği fiyatı nasıl hesaplanır?`, a: 'Oda sayısı, kirlilik ve ekstralar belirleyicidir. Online hesaplama aracı tahmini aralık verir; kesin fiyat keşif sonrası netleşir.' },
        { q: 'En ucuz teklif her zaman iyi midir?', a: 'Hayır. Kapsam maddelerini karşılaştırın; sigortalı ekip ve yazılı teklif güven sağlar.' },
        { q: 'Aynı gün hizmet mümkün mü?', a: 'Yoğunluğa bağlıdır; randevu formu veya WhatsApp ile müsaitlik sorulabilir.' },
        { q: 'Düzenli temizlik indirimi var mı?', a: 'Haftalık/aylık planlarda birim maliyet genelde düşer; keşifte paket önerilir.' },
      ],
    };
    posts.push(makePricingPost(evCfg));

    const ofisCfg: PricingGuideConfig = {
      slug: `${d.slug}-ofis-temizligi-fiyatlari-2026`,
      title: `${d.name} Ofis Temizliği Fiyatları 2026 | m² ve Paket Rehberi`,
      metaTitle: `${d.name} Ofis Temizliği Fiyatları 2026`,
      metaDesc: `${d.name} ofis temizliği 2026: m² birim fiyat, minimum iş bedeli, plaza ipuçları. Kurumsal teklif ve ücretsiz keşif.`,
      excerpt: `${d.name} ofis ve işyeri temizliği 2026 fiyat rehberi — metrekare bazlı tahmini aralıklar ve kurumsal paket notları.`,
      image: IMG_OFFICE,
      tags: [d.slug, 'ofis temizliği', 'fiyat 2026', 'kurumsal', d.name.toLowerCase()],
      serviceName: `${d.name} Ofis Temizliği`,
      serviceSlug: 'ofis-temizligi',
      intro: `${d.name} bölgesindeki ofis, plaza ve işyerleri için 2026 temizlik fiyatları; metrekare, kullanıcı sayısı, mesai saati ve kapsam (cam, mutfak, wc) ile belirlenir.`,
      priceRows: ofisPriceRows(),
      priceUnitNote: `${d.name} plaza ve açık ofislerinde mesai dışı uygulama talebi fiyatı etkileyebilir.`,
      factors: [
        ...DEFAULT_FACTORS,
        'Mesai içi / mesai dışı uygulama',
        'WC ve mutfak sayısı',
        'Cam cephe ve iç cam yüzeyi',
      ],
      packages: [
        { name: 'Günlük hafif', desc: 'Çöp, mutfak, wc, zemin.', priceHint: 'Düşük–orta m²' },
        { name: 'Haftalık detay', desc: 'Toz, zemin, ortak alan.', priceHint: 'Orta segment' },
        { name: 'Aylık sözleşme', desc: 'SLA ve raporlama.', priceHint: 'Kurumsal indirim' },
      ],
      regionalNote: `${d.name} iş merkezlerinde güvenlik girişi, yük asansörü ve otopark koşulları operasyon süresini etkiler. Kurumsal müşteriler için yazılı sözleşme ve sabit ekip planı önerilir.`,
      faq: [
        { q: `${d.name} ofis temizliği m² fiyatı nedir?`, a: '2026 için tabloda birim aralık verilmiştir; minimum iş bedeli küçük alanlarda devreye girebilir.' },
        { q: 'Mesai dışı temizlik mümkün mü?', a: 'Evet, plaza kurallarına uygun saatlerde planlanır.' },
        { q: 'Malzeme ve ekipman kim sağlar?', a: 'Profesyonel ekipman genelde hizmet sağlayıcı tarafından getirilir; sözleşmede netleştirilir.' },
      ],
    };
    posts.push(makePricingPost(ofisCfg));
  }

  return posts;
}

export function generateV2SeoPosts(): BlogSeedPost[] {
  const posts: BlogSeedPost[] = [];

  for (const d of V2_DISTRICTS) {
    const kiraCfg: SeoGuideConfig = {
      slug: `${d.slug}-kira-teslim-temizlik-rehberi-2026`,
      title: `${d.name} Kira Teslim Temizlik Rehberi 2026 | Depozito Checklist`,
      metaTitle: `${d.name} Kira Teslim Temizlik 2026 | Checklist`,
      metaDesc: `${d.name} kira teslim temizliği 2026: depozito iadesi için checklist, mutfak-banyo standartları ve profesyonel destek ipuçları.`,
      excerpt: `${d.name} bölgesinde kira teslim öncesi temizlik checklist'i — depozito riskini azaltan adımlar ve profesyonel kapsam önerileri.`,
      image: IMG_HOME,
      category: 'Kira Teslim',
      tags: [d.slug, 'kira teslim', 'depozito', 'checklist', '2026'],
      districtName: d.name,
      districtSlug: d.slug,
      topicLabel: 'Kira teslim temizliği',
      serviceSlug: 'ev-temizligi',
      serviceName: 'Ev Temizliği',
      intro: `${d.name} bölgesinde kira sözleşmesi biterken yapılan teslim temizliği, depozito iadesi için kritik öneme sahiptir. Bu rehber; kiracı ve mal sahibi beklentilerini dengeleyen uygulanabilir bir checklist sunar.`,
      sections: [
        {
          heading: 'Kira teslim öncesi 48 saat planı',
          paragraphs: [
            `${d.name} dairesinde teslim öncesi önce mutfak dolapları ve buzdolabı içi temizlenmeli, ardından banyo küvet/duşakabin kireç ve sabun kalıntılarından arındırılmalıdır.`,
            'Son aşamada zemin ve cam yüzeyler kontrol edilir; fotoğraflı teslim tutanağı için gün ışığında kontrol yapın.',
          ],
          bullets: [
            'Mutfak: ocak, davlumbaz filtresi, tezgâh derz araları',
            'Banyo: vitrifiye, fayans derz, ayna',
            'Oda: süpürme, silme, priz üstü toz',
            'Cam ve balkon: iz bırakmayan silme',
          ],
        },
        {
          heading: 'Depozito iadesi için sık yapılan hatalar',
          paragraphs: [
            'Yalnızca “görünür” alanları temizleyip dolap içlerini atlamak en sık red sebebidir.',
            'Duvar lekelerini boyasız çıkarmaya çalışmak hasar riski taşır; profesyonel destek alın.',
          ],
        },
        {
          heading: 'Profesyonel kira teslim paketi ne içerir?',
          paragraphs: [
            'Yazılı kapsam listesi, sigortalı ekip ve teslim sonrası kontrol turu standart paketin parçası olmalıdır.',
            `${d.name} için <a href="/cozumler/kira-teslim-temizligi">kira teslim temizliği çözüm sayfamız</a> kapsam detaylarını özetler.`,
          ],
        },
      ],
      faq: [
        { q: `${d.name} kira teslim temizliği ne kadar sürer?`, a: 'Daire büyüklüğüne göre 4–8 saat arası değişir; keşifte süre netleşir.' },
        { q: 'Mal sahibi ekstra talep ederse ne olur?', a: 'Sözleşme dışı talepler ayrı kalemdir; yazılı teklif isteyin.' },
        { q: 'Profesyonel hizmet depozito iadesini garanti eder mi?', a: 'Kapsam karşılandığında uyuşmazlık riski ciddi ölçüde azalır; garanti yerine yazılı kapsam tercih edilir.' },
      ],
    };
    posts.push(makeSeoGuidePost(kiraCfg));

    const secimCfg: SeoGuideConfig = {
      slug: `${d.slug}-profesyonel-temizlik-firma-secimi-rehberi-2026`,
      title: `${d.name} Profesyonel Temizlik Firması Seçimi 2026 | 12 Kritik Soru`,
      metaTitle: `${d.name} Temizlik Firması Seçimi 2026`,
      metaDesc: `${d.name} bölgesinde güvenilir temizlik firması nasıl seçilir? Sigorta, sözleşme, referans ve fiyat karşılaştırma rehberi.`,
      excerpt: `${d.name} için profesyonel temizlik şirketi seçerken sorulması gereken 12 soru — güvenlik, kapsam ve fiyat şeffaflığı.`,
      image: IMG_OFFICE,
      category: 'Rehber',
      tags: [d.slug, 'firma seçimi', 'güvenilir temizlik', '2026'],
      districtName: d.name,
      districtSlug: d.slug,
      topicLabel: 'Profesyonel temizlik firması seçimi',
      intro: `${d.name} bölgesinde onlarca temizlik seçeneği varken doğru firma; sigortalı ekip, şeffaf kapsam ve yazılı teklif sunanları ayırt etmenizi sağlar.`,
      sections: [
        {
          heading: 'Firma seçmeden önce netleştirin',
          paragraphs: [
            'Hizmet türü (ev, ofis, inşaat sonrası), alan büyüklüğü ve tarih aralığını yazılı paylaşın.',
            `${d.name} adresinde otopark/asansör bilgisi operasyon maliyetini etkiler.`,
          ],
          bullets: [
            'Sigorta ve iş güvenliği belgesi var mı?',
            'Kapsam maddeleri yazılı mı?',
            'Ekstra ücretler (cam, balkon) dahil mi?',
            'İptal / erteleme koşulları neler?',
          ],
        },
        {
          heading: 'Fiyat karşılaştırması nasıl yapılır?',
          paragraphs: [
            'Aynı kapsam listesi ile en az üç teklif alın. En düşük fiyat eksik kapsam gösterebilir.',
            `<a href="/fiyat-hesaplama">Fiyat hesaplama aracımız</a> ile tahmini aralığınızı önceden görün.`,
          ],
        },
        {
          heading: 'Referans ve yorumları okuma',
          paragraphs: [
            'Google yorumlarında tekrar eden şikayet temalarına dikkat edin (gecikme, eksik kapsam).',
            'Kurumsal müşteriler için SLA ve raporlama isteyin.',
          ],
        },
      ],
      faq: [
        { q: `${d.name} için en hızlı teklif nasıl alınır?`, a: 'Online fiyat hesaplama + WhatsApp/randevu formu en hızlı yoldur.' },
        { q: 'Sözleşme şart mı?', a: 'Tek seferlik ev temizliğinde yazılı kapsam yeterli olabilir; kurumsal hizmette sözleşme önerilir.' },
        { q: 'Zümrüt Vadi hangi bölgelere bakıyor?', a: 'Sarıyer ve Zekeriyaköy öncelikli; İstanbul Avrupa Yakası genelinde hizmet veriyoruz.' },
      ],
    };
    posts.push(makeSeoGuidePost(secimCfg));
  }

  return posts;
}

export function generateAllV2Posts(): { seo: BlogSeedPost[]; pricing: BlogSeedPost[] } {
  return {
    seo: generateV2SeoPosts(),
    pricing: generateV2PricingPosts(),
  };
}
