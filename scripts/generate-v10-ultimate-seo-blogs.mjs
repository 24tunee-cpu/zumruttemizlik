/**
 * 300 v10 ultimate SEO blogs — CTR + evergreen + uzun form.
 * Run: node scripts/generate-v10-ultimate-seo-blogs.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const IMG = {
  home: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
  sofa: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
  carpet: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200',
  window: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200',
  build: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200',
  villa: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
  city: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200',
};

const S = {
  ev: { href: '/hizmetler/ev-temizligi', label: 'Ev temizliği', img: 'home' },
  ofis: { href: '/hizmetler/ofis-temizligi', label: 'Ofis temizliği', img: 'office' },
  insaat: { href: '/hizmetler/insaat-sonrasi-temizlik', label: 'İnşaat sonrası temizlik', img: 'build' },
  koltuk: { href: '/hizmetler/koltuk-yikama', label: 'Koltuk yıkama', img: 'sofa' },
  hali: { href: '/hizmetler/hali-temizligi', label: 'Halı temizliği', img: 'carpet' },
  cam: { href: '/hizmetler/cam-temizligi', label: 'Cam temizliği', img: 'window' },
  cephe: { href: '/hizmetler/dis-cephe-temizligi', label: 'Dış cephe temizliği', img: 'build' },
};

const A = {
  sariyer: { href: '/bolgeler/sariyer', label: 'Sarıyer temizlik', short: 'Sarıyer' },
  zeker: { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy temizlik', short: 'Zekeriyaköy' },
  maslak: { href: '/bolgeler/sariyer/maslak', label: 'Maslak temizlik', short: 'Maslak' },
  tarabya: { href: '/bolgeler/sariyer/tarabya', label: 'Tarabya temizlik', short: 'Tarabya' },
  bahce: { href: '/bolgeler/sariyer/bahcekoy', label: 'Bahçeköy temizlik', short: 'Bahçeköy' },
  uskum: { href: '/bolgeler/sariyer/uskumrukoy', label: 'Uskumruköy temizlik', short: 'Uskumruköy' },
  sisli: { href: '/bolgeler/sisli', label: 'Şişli temizlik', short: 'Şişli' },
  besiktas: { href: '/bolgeler/besiktas', label: 'Beşiktaş temizlik', short: 'Beşiktaş' },
  kadikoy: { href: '/bolgeler/kadikoy', label: 'Kadıköy temizlik', short: 'Kadıköy' },
  umraniye: { href: '/bolgeler/umraniye', label: 'Ümraniye temizlik', short: 'Ümraniye' },
  atasehir: { href: '/bolgeler/atasehir', label: 'Ataşehir temizlik', short: 'Ataşehir' },
  bakirkoy: { href: '/bolgeler/bakirkoy', label: 'Bakırköy temizlik', short: 'Bakırköy' },
  kagithane: { href: '/bolgeler/kagithane', label: 'Kağıthane temizlik', short: 'Kağıthane' },
  uskudar: { href: '/bolgeler/uskudar', label: 'Üsküdar temizlik', short: 'Üsküdar' },
  maltepe: { href: '/bolgeler/maltepe', label: 'Maltepe temizlik', short: 'Maltepe' },
  kartal: { href: '/bolgeler/kartal', label: 'Kartal temizlik', short: 'Kartal' },
  pendik: { href: '/bolgeler/pendik', label: 'Pendik temizlik', short: 'Pendik' },
  fatih: { href: '/bolgeler/fatih', label: 'Fatih temizlik', short: 'Fatih' },
  eyup: { href: '/bolgeler/eyupsultan', label: 'Eyüpsultan temizlik', short: 'Eyüpsultan' },
  zeytinburnu: { href: '/bolgeler/zeytinburnu', label: 'Zeytinburnu temizlik', short: 'Zeytinburnu' },
};

const FACTORS = {
  ev: ['Net m² / oda-banyo', 'Dolu vs boş', 'Kirlilik', 'Kat/asansör/site', 'Cam-koltuk ekleri'],
  ofis: ['m² / workstation', 'Frekans', 'Gece/güvenlik', 'Mutfak-çay ocağı', 'Ortak alan'],
  insaat: ['m² + kirlilik sınıfı', 'Alçı/ince toz', 'Cam-pervaz', 'Mobilya öncesi/sonrası', 'Erişim'],
  koltuk: ['Parça/takım', 'Kumaş tipi', 'Leke yaşı', 'Pet/koku', 'Kuruma planı'],
  hali: ['m²', 'Leke/pet', 'Evde vs taşıma', 'Kuruma alanı', 'Erişim'],
  cam: ['Panel sayısı', 'İç/dış', 'Yükseklik', 'Yönetici onayı', 'Tuz/toz'],
  cephe: ['Cephe m²', 'Malzeme', 'Erişim yöntemi', 'Kir/tuz', 'Yalnız yüzey (peyzaj yok)'],
};

const SCENARIOS = {
  ev: ['1+1 kısa tur', '3+1 aile yarım–bir gün', 'Villa keşif', 'Taşınma checklist'],
  ofis: ['Butik akşam', 'Açık ofis gece', 'Plaza prosedür', 'Periyodik sözleşme'],
  insaat: ['Sıfır daire ince toz', 'Ofis teslim', 'Boya/tadilat', 'Villa teslim'],
  koltuk: ['Tek kanepe', '3+2+1 takım', 'Köşe/L', 'Leke lokal'],
  hali: ['Küçük kilim', 'Salon hali', 'Çoklu paket', 'Villa kalın'],
  cam: ['Daire iç', 'Cam balkon sonrası', 'Villa cephe', 'Plaza'],
  cephe: ['Villa cephe', 'Site blok', 'Boğaz tuzu', 'Boyasız yüzey'],
};

const INTENTS = [
  {
    id: 'ne-kadar',
    cat: 'Fiyat SEO',
    title: (geo, svc) => `${geo} ${svc} Ne Kadar? 2026 Rehber`,
    keyword: (geo, svc) => `${geo} ${svc.toLowerCase()} ne kadar`,
    hook: (geo, svc) =>
      `${geo}’de ${svc.toLowerCase()} ücreti m²/kapsam/erişime göre değişir; sabit internet fiyatı yanıltıcıdır.`,
    slug: (g, s) => `${g}-${s}-ne-kadar-2026`,
  },
  {
    id: 'fiyatlar',
    cat: 'Fiyat SEO',
    title: (geo, svc) => `${geo} ${svc} Fiyatları 2026`,
    keyword: (geo, svc) => `${geo} ${svc.toLowerCase()} fiyatları`,
    hook: (geo, svc) =>
      `${geo} ${svc.toLowerCase()} fiyatları 2026’da keşif sonrası netleşir; online araç yalnızca tahmindir.`,
    slug: (g, s) => `${g}-${s}-fiyatlari-ultimate-2026`,
  },
  {
    id: 'nasil',
    cat: 'Süreç SEO',
    title: (geo, svc) => `${geo} ${svc} Nasıl Yapılır? Kontrol`,
    keyword: (geo, svc) => `${geo} ${svc.toLowerCase()} nasıl yapılır`,
    hook: (geo, svc) =>
      `${geo}’de ${svc.toLowerCase()} süreci keşif → yazılı kapsam → checklist uygulamadır; peyzaj yoktur.`,
    slug: (g, s) => `${g}-${s}-nasil-yapilir-2026`,
  },
  {
    id: 'checklist',
    cat: 'Süreç SEO',
    title: (geo, svc) => `${svc} Checklist ${geo} 2026`,
    keyword: (geo, svc) => `${svc.toLowerCase()} checklist ${geo}`,
    hook: (geo, svc) =>
      `${geo} için ${svc.toLowerCase()} öncesi foto/m²/erişim notu sapmayı küçültür.`,
    slug: (g, s) => `${g}-${s}-checklist-ultimate-2026`,
  },
  {
    id: 'hata',
    cat: 'Karar SEO',
    title: (geo, svc) => `${svc}: ${geo}’de 7 Pahalı Hata`,
    keyword: (geo, svc) => `${svc.toLowerCase()} hataları ${geo}`,
    hook: (geo, svc) =>
      `${geo}’de ${svc.toLowerCase()} alırken keşifsiz sabit fiyat ve sözlü kapsam en pahalı hatalardır.`,
    slug: (g, s) => `${g}-${s}-7-hata-2026`,
  },
  {
    id: 'firma',
    cat: 'Ticari SEO',
    title: (geo, svc) => `${geo} ${svc} Firması Nasıl Seçilir?`,
    keyword: (geo, svc) => `${geo} ${svc.toLowerCase()} firması`,
    hook: (geo, svc) =>
      `${geo}’de ${svc.toLowerCase()} firması seçerken yazılı kapsam, ürün uyumu ve keşif sorun.`,
    slug: (g, s) => `${g}-${s}-firmasi-secim-2026`,
  },
  {
    id: 'sure',
    cat: 'Süreç SEO',
    title: (geo, svc) => `${svc} Ne Kadar Sürer? ${geo}`,
    keyword: (geo, svc) => `${svc.toLowerCase()} süresi ${geo}`,
    hook: (geo, svc) =>
      `${geo}’de ${svc.toLowerCase()} süresi alan ve kirliliğe bağlıdır; kesin plan keşifte çıkar.`,
    slug: (g, s) => `${g}-${s}-suresi-2026`,
  },
  {
    id: 'kimler',
    cat: 'Niyet SEO',
    title: (geo, svc) => `${svc} Kimler İçin? ${geo} Rehber`,
    keyword: (geo, svc) => `${svc.toLowerCase()} kimler için ${geo}`,
    hook: (geo, svc) =>
      `${geo}’de ${svc.toLowerCase()} villa, daire, ofis veya teslim niyetine göre paketlenir.`,
    slug: (g, s) => `${g}-${s}-kimler-icin-2026`,
  },
];

/** Öncelik geo (Sarıyer hattı ağır) + genişleme ilçeler */
const GEO_KEYS = [
  'sariyer',
  'zeker',
  'maslak',
  'tarabya',
  'bahce',
  'uskum',
  'sisli',
  'besiktas',
  'kadikoy',
  'umraniye',
  'atasehir',
  'bakirkoy',
  'kagithane',
  'uskudar',
  'maltepe',
  'kartal',
  'pendik',
  'fatih',
  'eyup',
  'zeytinburnu',
];

const SVC_KEYS = ['ev', 'ofis', 'insaat', 'koltuk', 'hali', 'cam', 'cephe'];

/** Ek pillar / Ads / karşılaştırma — 300’e tamamlar */
const EXTRA = [
  ['istanbul-temizlik-fiyatlari-2026-ultimate', 'İstanbul Temizlik Fiyatları 2026 Ultimate', 'İstanbul temizlik fiyatları', 'Fiyat SEO', 'İstanbul’da temizlik fiyatı hizmet tipine göre ayrılır; tek rakam her eve uymaz.', 'ev', 'sariyer', 'city'],
  ['ucretsiz-kesif-temizlik-neden-gerekli-2026', 'Ücretsiz Keşif Temizlik Neden Gerekli? 2026', 'ücretsiz keşif temizlik', 'Karar SEO', 'Keşif satış baskısı değil; kapsam ve kirlilik için bilgi turudur.', 'ev', 'sariyer', 'city'],
  ['online-fiyat-hesaplama-vs-kesif-2026-u', 'Online Fiyat vs Keşif: Hangisi Doğru?', 'online fiyat keşif farkı', 'Karar SEO', 'Hesaplayıcı tahmindir; villa/inşaatta keşif şarttır.', 'ev', 'sariyer', 'city'],
  ['profesyonel-temizlik-vs-gunlukcu-2026-u', 'Profesyonel Temizlik vs Gündelikçi 2026', 'profesyonel temizlik farkı', 'Karar SEO', 'Ekip + checklist ölçeklenebilir sonuç verir; saat ücreti tek kriter değildir.', 'ev', 'sariyer', 'home'],
  ['yazili-kapsam-olmadan-temizlik-2026-u', 'Yazılı Kapsam Olmadan Temizlik Almayın', 'yazılı kapsam temizlik', 'Karar SEO', 'Garanti keşifte yazılan işlerdir; sözlü vaat pahalıya patlar.', 'ev', 'sariyer', 'city'],
  ['sariyer-villa-temizlik-ultimate-2026', 'Sarıyer Villa Temizlik Ultimate Rehber 2026', 'Sarıyer villa temizlik', 'Yerel SEO', 'Villa m², kat, cam ve erişim daire paketini geçersiz kılar; peyzaj yoktur.', 'ev', 'sariyer', 'villa'],
  ['zekeriyakoy-villa-temizlik-ultimate-2026', 'Zekeriyaköy Villa Temizlik Ultimate 2026', 'Zekeriyaköy villa temizlik', 'Yerel SEO', 'Orman/villa hattında planlı randevu ve keşif kritiktir.', 'ev', 'zeker', 'villa'],
  ['koltuk-yikama-istanbul-ultimate-2026', 'Koltuk Yıkama İstanbul Ultimate 2026', 'koltuk yıkama İstanbul', 'Ads SEO', 'Yerinde yıkamada takım tipi ve leke yaşı fiyatı belirler.', 'koltuk', 'sariyer', 'sofa'],
  ['insaat-sonrasi-temizlik-istanbul-ultimate-2026', 'İnşaat Sonrası Temizlik İstanbul Ultimate', 'inşaat sonrası temizlik İstanbul', 'Ads SEO', 'İnce toz turu mobilyadan önce; m² tek başına yetmez.', 'insaat', 'sariyer', 'build'],
  ['tadilat-sonrasi-temizlik-ultimate-2026', 'Tadilat Sonrası Temizlik Ultimate 2026', 'tadilat sonrası temizlik', 'Ads SEO', 'Boya sıçrantısı + toz birlikte planlanır; usta işi dahil değildir.', 'insaat', 'kadikoy', 'build'],
  ['kaba-ve-ince-insaat-temizlik-ultimate-2026', 'Kaba ve İnce İnşaat Temizliği Ultimate', 'kaba ince inşaat temizliği', 'Ads SEO', 'Önce kaba sonra ince; ters sıra maliyeti artırır.', 'insaat', 'sariyer', 'build'],
  ['sifir-daire-temizlik-ultimate-2026', 'Sıfır Daire Temizliği Ultimate Rehber', 'sıfır daire temizliği', 'Ads SEO', 'Teslim tozu mobilya altına yerleşmeden çıkarılmalı.', 'insaat', 'atasehir', 'build'],
  ['yerinde-koltuk-yikama-ultimate-2026', 'Yerinde Koltuk Yıkama Ultimate 2026', 'yerinde koltuk yıkama', 'Ads SEO', 'Ev tipi agresif kimyasal risklidir; kumaşa uygun ürün şarttır.', 'koltuk', 'sariyer', 'sofa'],
  ['deri-kumas-koltuk-yikama-ultimate-2026', 'Deri vs Kumaş Koltuk Yıkama Ultimate', 'deri kumaş koltuk yıkama', 'Ads SEO', 'Deri ve kumaş farklı ürün ister; tek şampuan risklidir.', 'koltuk', 'besiktas', 'sofa'],
  ['maslak-ofis-temizlik-ultimate-2026', 'Maslak Ofis Temizlik Ultimate 2026', 'Maslak ofis temizliği', 'Yerel SEO', 'Plaza güvenlik ve gece slotu maliyeti etkiler.', 'ofis', 'maslak', 'office'],
  ['tarabya-cam-temizlik-ultimate-2026', 'Tarabya Cam Temizlik Ultimate 2026', 'Tarabya cam temizliği', 'Yerel SEO', 'Boğaz tuzu periyodik cam bakımını gerektirir.', 'cam', 'tarabya', 'window'],
  ['bahcekoy-ev-temizlik-ultimate-2026', 'Bahçeköy Ev Temizlik Ultimate 2026', 'Bahçeköy ev temizliği', 'Yerel SEO', 'Orman hattı erişimi randevu planını etkiler.', 'ev', 'bahce', 'home'],
  ['uskumrukoy-temizlik-ultimate-2026', 'Uskumruköy Temizlik Ultimate 2026', 'Uskumruköy temizlik', 'Yerel SEO', 'Kış/erişim slot seçimini etkiler; keşif önerilir.', 'ev', 'uskum', 'home'],
  ['halı-yikama-mi-koltuk-mu-ultimate-2026', 'Önce Halı mı Koltuk mu? Ultimate', 'halı koltuk yıkama sırası', 'Karar SEO', 'Genelde koltuk sonrası hali planı kuruma çakışmasını azaltır.', 'hali', 'sariyer', 'carpet'],
  ['dis-cephe-temizlik-peyzaj-degil-ultimate-2026', 'Dış Cephe Temizliği Peyzaj Değildir', 'dış cephe temizliği', 'Karar SEO', 'Yalnızca yüzey; bahçe düzenleme / peyzaj yoktur.', 'cephe', 'tarabya', 'build'],
];

function asciiSlug(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function clampTitle(t, max = 58) {
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function clampMeta(keyword, hook, max = 155) {
  const base = `${keyword}: ${hook}`;
  return base.length <= max ? base : `${base.slice(0, max - 1).trimEnd()}…`;
}

const topics = [];
const seen = new Set();

function pushTopic(t) {
  if (seen.has(t.slug)) return false;
  if (!/^[a-z0-9-]+$/.test(t.slug)) throw new Error('bad slug ' + t.slug);
  if (!t.slug.includes('2026')) throw new Error('no year ' + t.slug);
  seen.add(t.slug);
  topics.push(t);
  return true;
}

// Matrix: geo × service × intent — prioritize Sarıyer line for first slots
for (const intent of INTENTS) {
  for (const geoKey of GEO_KEYS) {
    for (const svcKey of SVC_KEYS) {
      if (topics.length >= 280) break;
      const geo = A[geoKey];
      const svc = S[svcKey];
      const gSlug = asciiSlug(geo.short);
      const sSlug = asciiSlug(svc.label.replace(/ temizlik(i)?$/i, '').replace(/ temizliği$/i, ''));
      const slug = intent.slug(gSlug, sSlug);
      const title = intent.title(geo.short, svc.label);
      const keyword = intent.keyword(geo.short, svc.label);
      const hook = intent.hook(geo.short, svc.label);
      pushTopic({
        slug,
        title,
        keyword,
        category: intent.cat,
        hook,
        audience: `${geo.short} ve İstanbul’da ${svc.label.toLowerCase()} arayanlar`,
        durationHint: svcKey === 'insaat' || svcKey === 'cephe' ? 'Keşif şart' : 'Yarım–bir gün / işe göre',
        service: svcKey,
        area: geoKey,
        image: svc.img,
        compareNote: 'Keşifsiz sabit fiyat yanıltıcıdır; yazılı kapsam esastır.',
        tag: intent.id,
      });
    }
    if (topics.length >= 280) break;
  }
  if (topics.length >= 280) break;
}

for (const row of EXTRA) {
  const [slug, title, keyword, category, hook, service, area, image] = row;
  pushTopic({
    slug: asciiSlug(slug),
    title,
    keyword,
    category,
    hook,
    audience: 'İstanbul temizlik karar vericileri',
    durationHint: 'Keşif / brifing',
    service,
    area,
    image,
    compareNote: 'Online tahmin ≠ kesin fiyat.',
    tag: 'ultimate',
  });
}

// Top up to exactly 300 with remaining geo×svc×intent combos not yet used
if (topics.length < 300) {
  for (const intent of INTENTS) {
    for (const geoKey of GEO_KEYS) {
      for (const svcKey of SVC_KEYS) {
        if (topics.length >= 300) break;
        const geo = A[geoKey];
        const svc = S[svcKey];
        const gSlug = asciiSlug(geo.short);
        const sSlug = asciiSlug(svc.label);
        const slug = `${intent.slug(gSlug, sSlug)}-v10`;
        if (seen.has(slug)) continue;
        pushTopic({
          slug,
          title: clampTitle(`${intent.title(geo.short, svc.label)} | ZVT`),
          keyword: intent.keyword(geo.short, svc.label),
          category: intent.cat,
          hook: intent.hook(geo.short, svc.label),
          audience: `${geo.short} ${svc.label}`,
          durationHint: 'İşe göre',
          service: svcKey,
          area: geoKey,
          image: svc.img,
          compareNote: 'Kapsamı sözlü bırakmayın.',
          tag: `${intent.id}-v10`,
        });
      }
      if (topics.length >= 300) break;
    }
    if (topics.length >= 300) break;
  }
}

if (topics.length !== 300) {
  console.error('Expected 300, got', topics.length);
  process.exit(1);
}

const expanded = topics.map((t) => {
  const service = S[t.service];
  const area = A[t.area];
  const factors = FACTORS[t.service] ?? FACTORS.ev;
  const scenarios = SCENARIOS[t.service] ?? SCENARIOS.ev;
  const keyword = t.keyword;
  return {
    slug: t.slug,
    title: t.title,
    keyword,
    category: t.category,
    hook: t.hook,
    audience: t.audience,
    durationHint: t.durationHint,
    service: t.service,
    area: t.area,
    image: t.image,
    compareNote: t.compareNote,
    priceFactors: factors,
    scenarios,
    scopeIn:
      t.service === 'insaat'
        ? ['İnce/kalın toz', 'Pervaz/ıslak hacim', 'Zemin', 'Yazılı checklist']
        : t.service === 'koltuk'
          ? ['Yerinde yıkama', 'Kumaşa uygun ürün', 'Kuruma planı']
          : ['Mutfak/banyo veya iş alanı', 'Zemin', 'Toz alma', 'Yazılı checklist'],
    scopeOut: ['Peyzaj/bahçe düzenleme', 'İnşaat işçiliği', 'Mobilya taşıma'],
    steps: [
      'Online tahmin veya foto/m²/parça paylaş',
      'Keşif veya brifing ile kapsam yaz',
      'Teklif onayı',
      'Checklist’li uygulama ve kontrol',
    ],
    mistakes: [
      'Keşifsiz sabit fiyat dayatmak',
      'Kapsamı sözlü bırakmak',
      'Erişim/güvenlik bilgisini vermemek',
      'Yanlış ürün/yüzey uyumunu sormamak',
    ],
    priceNote: `${keyword} için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.`,
    faq: [
      {
        q: `${keyword} ne kadar tutar?`,
        a: 'Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online araç tahmin verir; kesin rakam keşifle netleşir.',
      },
      {
        q: 'Fiyat garanti mi?',
        a: 'Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir.',
      },
      {
        q: 'Peyzaj dahil mi?',
        a: 'Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur; yalnızca yüzey ve yaşam alanı temizliği.',
      },
      {
        q: 'Aynı gün olur mu?',
        a: 'Kapasiteye bağlıdır; garanti slot değildir. Erken rezervasyon önerilir.',
      },
      {
        q: `${area.short} öncelikli mi?`,
        a: 'Sarıyer / Zekeriyaköy operasyon önceliğimizdir; diğer ilçelerde planlı randevu ile hizmet anlatılır.',
      },
    ],
    checklist: [
      'Adres / semt ve site giriş notu',
      'm² veya oda/banyo veya koltuk tipi',
      'Dolu / boş / inşaat tozu durumu',
      'İstenen ekler (cam, koltuk, halı)',
      'Tercih edilen gün/saat aralığı',
      'Foto veya kısa video (mümkünse)',
      'Özel ürün / alerji notu',
    ],
    searchIntents: [
      `${keyword}`,
      `${service.label} fiyat`,
      `${area.short} temizlik firması`,
      'ücretsiz keşif temizlik',
      'yerinde hizmet teklifi',
    ],
    evergreenNote:
      'Arama niyeti (fiyat, süre, kapsam, güven) sabittir; rakamlar güncellenir. Bu yüzden rehber evergreen kurgulanmıştır.',
    deepParagraphs: [
      `${t.hook} ${area.label} hattında operasyon deneyimiyle ${service.label.toLowerCase()} paketlerinde yazılı kapsam sunuyoruz.`,
      'Zümrüt Vadi Temizlik olarak Sarıyer / Zekeriyaköy önceliklidir; İstanbul genelinde planlı randevu ile ilerlenir. Aynı gün garanti edilmez.',
      'İçerikte keyword stuffing yoktur; tek birincil niyet + yardımcı SSS ile AEO uyumu hedeflenir. Sıralama garantisi verilmez.',
      'Peyzaj / bahçe düzenleme yoktur. Bahçe kenarı yalnızca yüzey temizliği olarak paketlenebilir.',
      'Telefon / WhatsApp: 0551 925 09 43. Ads veya organik girenler için CTA: fiyat hesaplama veya ücretsiz keşif.',
    ],
    tags: [t.tag, 'ultimate seo', 'istanbul', '2026', asciiSlug(service.label).slice(0, 20)],
  };
});

const out = `/**
 * 300 v10 ultimate SEO blog — CTR + evergreen + uzun form.
 * Üretilir: node scripts/generate-v10-ultimate-seo-blogs.mjs
 */
import type { BlogSeedPost } from './seed-blog';
import { makeUltimateSeoPost, type UltimateSeoConfig } from './blog-ultimate-seo-html';

const IMG = ${JSON.stringify(IMG, null, 2)} as const;
const SERVICE = ${JSON.stringify(
  Object.fromEntries(Object.entries(S).map(([k, v]) => [k, { href: v.href, label: v.label }])),
  null,
  2
)} as const;
const AREA = ${JSON.stringify(
  Object.fromEntries(Object.entries(A).map(([k, v]) => [k, { href: v.href, label: v.label }])),
  null,
  2
)} as const;

export type V10Topic = {
  slug: string;
  title: string;
  keyword: string;
  category: string;
  hook: string;
  audience: string;
  durationHint: string;
  service: keyof typeof SERVICE;
  area: keyof typeof AREA;
  image: keyof typeof IMG;
  compareNote: string;
  priceFactors: string[];
  scenarios: string[];
  scopeIn: string[];
  scopeOut: string[];
  steps: string[];
  mistakes: string[];
  priceNote: string;
  faq: Array<{ q: string; a: string }>;
  checklist: string[];
  searchIntents: string[];
  evergreenNote: string;
  deepParagraphs: string[];
  tags: string[];
};

const TOPICS: V10Topic[] = ${JSON.stringify(expanded, null, 2)};

function metaDesc(keyword: string, hook: string): string {
  const base = \`\${keyword}: \${hook}\`;
  return base.length <= 155 ? base : \`\${base.slice(0, 154).trimEnd()}…\`;
}

function expand(t: V10Topic): UltimateSeoConfig {
  const service = SERVICE[t.service];
  const area = AREA[t.area];
  const intro = \`\${t.hook} \${area.label} ve İstanbul genelinde \${t.keyword} için uzun form SEO rehberi.\`;
  return {
    slug: t.slug,
    title: t.title,
    metaTitle: t.title.length <= 58 ? t.title : \`\${t.title.slice(0, 57).trimEnd()}…\`,
    metaDesc: metaDesc(t.keyword, t.hook),
    excerpt: t.hook,
    image: IMG[t.image],
    category: t.category,
    tags: [...new Set([...t.tags, 'ultimate seo', 'istanbul'])].slice(0, 8),
    keyword: t.keyword,
    intro,
    audience: t.audience,
    durationHint: t.durationHint,
    serviceHref: service.href,
    serviceLabel: service.label,
    areaHref: area.href,
    areaLabel: area.label,
    scopeIn: t.scopeIn,
    scopeOut: t.scopeOut,
    steps: t.steps,
    mistakes: t.mistakes,
    priceNote: t.priceNote,
    faq: t.faq,
    priceFactors: t.priceFactors,
    scenarios: t.scenarios,
    compareNote: t.compareNote,
    checklist: t.checklist,
    searchIntents: t.searchIntents,
    evergreenNote: t.evergreenNote,
    deepParagraphs: t.deepParagraphs,
    sections: [
      {
        heading: \`\${t.keyword} — Zümrüt Vadi notu\`,
        paragraphs: [
          'Sarıyer / Zekeriyaköy öncelikli operasyon; yazılı kapsam ve checklist teslim.',
          'Peyzaj yoktur. 0551 925 09 43.',
        ],
        bullets: ['Online fiyat = tahmin', 'Ücretsiz keşif', 'Ads + organik CTA'],
      },
    ],
  };
}

export function generateAllV10Posts(): BlogSeedPost[] {
  if (TOPICS.length !== 300) throw new Error(\`V10 sayı hatası: \${TOPICS.length}/300\`);
  return TOPICS.map((t) => makeUltimateSeoPost(expand(t)));
}

export function listV10Slugs(): string[] {
  return TOPICS.map((t) => t.slug);
}
`;

fs.writeFileSync(path.join(root, 'src/lib/seed-blog-v10-content.ts'), out, 'utf8');
console.log('OK wrote', expanded.length, '→ src/lib/seed-blog-v10-content.ts');
console.log('sample', expanded.slice(0, 3).map((t) => t.slug));
