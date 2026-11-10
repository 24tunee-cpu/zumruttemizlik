/**
 * Generates src/lib/seed-blog-v7-content.ts (100 commercial/local posts).
 * Run: node scripts/generate-v7-blog-content.mjs
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
  ev: { href: '/hizmetler/ev-temizligi', label: 'Ev temizliği' },
  ofis: { href: '/hizmetler/ofis-temizligi', label: 'Ofis temizliği' },
  insaat: { href: '/hizmetler/insaat-sonrasi-temizlik', label: 'İnşaat sonrası temizlik' },
  koltuk: { href: '/hizmetler/koltuk-yikama', label: 'Koltuk yıkama' },
  hali: { href: '/hizmetler/hali-yikama', label: 'Halı yıkama' },
  cam: { href: '/hizmetler/cam-temizligi', label: 'Cam temizliği' },
  cephe: { href: '/hizmetler/dis-cephe-temizligi', label: 'Dış cephe temizliği' },
};

const A = {
  sariyer: { href: '/bolgeler/sariyer', label: 'Sarıyer temizlik' },
  zeker: { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy temizlik' },
  maslak: { href: '/bolgeler/sariyer/maslak', label: 'Maslak temizlik' },
  tarabya: { href: '/bolgeler/sariyer/tarabya', label: 'Tarabya temizlik' },
  bahce: { href: '/bolgeler/sariyer/bahcekoy', label: 'Bahçeköy temizlik' },
  uskum: { href: '/bolgeler/sariyer/uskumrukoy', label: 'Uskumruköy temizlik' },
  sisli: { href: '/bolgeler/sisli', label: 'Şişli temizlik' },
  besiktas: { href: '/bolgeler/besiktas', label: 'Beşiktaş temizlik' },
  kadikoy: { href: '/bolgeler/kadikoy', label: 'Kadıköy temizlik' },
  umraniye: { href: '/bolgeler/umraniye', label: 'Ümraniye temizlik' },
  atasehir: { href: '/bolgeler/atasehir', label: 'Ataşehir temizlik' },
  bakirkoy: { href: '/bolgeler/bakirkoy', label: 'Bakırköy temizlik' },
  kagithane: { href: '/bolgeler/kagithane', label: 'Kağıthane temizlik' },
};

/** @type {any[]} */
const topics = [];

const SERVICE_PACK = {
  ev: {
    scopeIn: [
      'Mutfak tezgâh/ocak yüzeyi',
      'Banyo/klozet/lavabo',
      'Zemin süpürme+silme',
      'Toz alma ve sık dokunulan yüzeyler',
    ],
    scopeOut: ['Peyzaj/bahçe düzenleme', 'İnşaat işçiliği', 'Mobilya taşıma'],
    steps: [
      'm²/oda/foto veya keşif',
      'Yazılı checklist onayı',
      'Ekip + malzeme ile uygulama',
      'Eksik kalan yazılı işlerin düzeltilmesi',
    ],
    mistakes: [
      'Kapsamı sözlü bırakmak',
      'Keşifsiz “sabit fiyat” dayatmak',
      'Değerli eşyayı işaretlememek',
    ],
  },
  ofis: {
    scopeIn: [
      'Çalışma masaları ve ortak yüzeyler',
      'Ofis mutfağı / çay ocağı',
      'Islak hacim',
      'Çöp ve zemin turu',
    ],
    scopeOut: ['Peyzaj', 'IT/kablo işi', 'Arşiv imha'],
    steps: [
      'Mesai/güvenlik slotu netleştir',
      'Frekans ve alan listesi yaz',
      'Mesai dışı uygulama',
      'Yönetici kısa kontrol',
    ],
    mistakes: [
      'Güvenlik/asansör iznini unutmak',
      'Frekansı net yazmamak',
      'Mutfak hijyenini atlamak',
    ],
  },
  insaat: {
    scopeIn: [
      'İnce/kalın toz turu',
      'Pencere içi ve pervaz',
      'Zemin ve ıslak hacim',
      'Mobilya öncesi yüzey hazırlığı',
    ],
    scopeOut: ['İnşaat işçiliği', 'Boya/badana işi', 'Peyzaj'],
    steps: [
      'Kirlilik sınıfı + m² keşfi',
      'Toz programı ve ekipman planı',
      'Kat kat uygulama',
      'Teslim öncesi kontrol',
    ],
    mistakes: [
      'Standart ev paketi sanmak',
      'Mobilyadan sonra toz beklememek',
      'Havalandırmayı planlamamak',
    ],
  },
  koltuk: {
    scopeIn: ['Kumaş tipine uygun yıkama', 'Leke/koku odaklı işlem', 'Kuruma süresi planı'],
    scopeOut: ['Deri boyama/onarım', 'Peyzaj', 'Halı yıkama (ayrı paket)'],
    steps: ['Kumaş/leke bilgisi', 'Uygun program seçimi', 'Yıkama', 'Kuruma + kullanım notu'],
    mistakes: ['Ev tipi agresif kimyasal', 'Kuruma süresini hesaba katmamak'],
  },
  hali: {
    scopeIn: ['Ölçüye göre yıkama', 'Leke/pet notu', 'Kuruma alanı planı'],
    scopeOut: ['Halı tamiri', 'Peyzaj', 'Koltuk yıkama (ayrı)'],
    steps: ['Ölçü + leke notu', 'Program onayı', 'Yıkama', 'Kuruma'],
    mistakes: ['Kuruma alanı ayırmamak', 'Islak bırakıp ezmek'],
  },
  cam: {
    scopeIn: ['İç/dış erişilebilir cam', 'Pervaz ve ray', 'Güvenlik planı (yüksek kat)'],
    scopeOut: ['İskele/vinç işi (ayrı teklif)', 'Peyzaj', 'Cephe boyası'],
    steps: ['Cam sayısı + erişim', 'Güvenlik/onay', 'Uygulama', 'Kontrol'],
    mistakes: ['Yüksek katı keşifsiz istemek', 'Yönetici onayını unutmak'],
  },
  cephe: {
    scopeIn: ['Ulaşılabilir cephe yüzeyleri', 'Kir/tuz birikimi turu', 'Güvenlik planı'],
    scopeOut: ['Peyzaj/bahçe düzenleme', 'Cephe boyası/izolasyon'],
    steps: ['Cephe keşfi', 'Erişim yöntemi', 'Uygulama', 'Kontrol'],
    mistakes: ['Peyzaj beklemek', 'Güvenlik planını atlamak'],
  },
};

function base(partial) {
  const pack = SERVICE_PACK[partial.service] ?? SERVICE_PACK.ev;
  return {
    scopeIn: partial.scopeIn ?? pack.scopeIn,
    scopeOut: partial.scopeOut ?? pack.scopeOut,
    steps: partial.steps ?? pack.steps,
    mistakes: partial.mistakes ?? pack.mistakes,
    priceNote:
      partial.priceNote ??
      `${partial.keyword} fiyatı m², kirlilik, erişim ve ek işlere göre netleşir; online tahmindir, kesin teklif keşifle.`,
    faq: partial.faq ?? [
      {
        q: `${partial.keyword} için keşif gerekir mi?`,
        a: 'Villa, ofis, inşaat sonrası ve yüksek kat camda önerilir; küçük net işlerde kısa brifing + foto yetebilir.',
      },
      {
        q: 'Peyzaj veya bahçe düzenleme dahil mi?',
        a: 'Hayır. Zümrüt Vadi Temizlik peyzaj/bahçe düzenleme sunmaz; kapsam yüzey ve yaşam alanı temizliğidir.',
      },
      {
        q: 'Malzeme kimden gelir?',
        a: 'Standart ürünler ekiple gelir; özel marka veya hassasiyet talebi randevu öncesi yazılır.',
      },
    ],
    tags: partial.tags ?? ['temizlik', 'istanbul', '2026'],
    ...partial,
  };
}

function add(partial) {
  topics.push(base(partial));
}

// Compact rows: slug, title, keyword, category, hook, audience, duration, service, area, image, tag
const ROWS = [
  ['profesyonel-tasinma-sonrasi-temizlik-checklist-istanbul-2026', 'Taşınma Sonrası Temizlik Checklist 2026 | İstanbul', 'taşınma sonrası temizlik', 'Taşınma Temizliği', 'Eşya yerleşmeden önce mutfak, banyo ve zemin hijyeni taşınma stresini düşürür; yazılı checklist şart.', 'Yeni eve/ofise taşınanlar', '2+1 genelde yarım–bir gün', 'ev', 'sariyer', 'home', 'taşınma'],
  ['tasinma-oncesi-bosaltma-temizligi-kiraci-teslim-2026', 'Taşınma Öncesi Boşaltma Temizliği | Kiracı Teslim 2026', 'taşınma öncesi temizlik', 'Taşınma Temizliği', 'Depozito ve teslim tutanağı için boşaltma temizliği fiilen beklenir.', 'Kiradan çıkanlar', '1+1–3+1: birkaç saat–bir gün', 'ev', 'zeker', 'home', 'kiracı'],
  ['bos-ev-vs-dolu-ev-temizligi-farklari-pratigi-2026', 'Boş Ev vs Dolu Ev Temizliği: Farklar 2026', 'boş ev temizliği', 'Ev Temizliği', 'Boş evde erişim kolay; dolu evde eşya koruma ve süre planı kritik farktır.', 'Paket seçen ev sahipleri', 'Dolu evde +%20–50 süre mümkün', 'ev', 'tarabya', 'home', 'karşılaştırma'],
  ['lux-villa-temizligi-sariyer-zekeriyakoy-rehberi-2026', 'Lüks Villa Temizliği Sarıyer & Zekeriyaköy Rehberi 2026', 'lüks villa temizliği', 'Villa Temizliği', 'Geniş m², çoklu banyo ve cam cephe ekip planı ister; peyzaj hizmeti yoktur.', 'Sarıyer–Zekeriyaköy villa', 'Keşif zorunlu; yarım–birkaç gün', 'ev', 'zeker', 'villa', 'villa'],
  ['insaat-sonrasi-teslim-temizligi-kontrol-listesi-2026', 'İnşaat Sonrası Teslim Temizliği Kontrol Listesi 2026', 'inşaat sonrası temizlik', 'İnşaat Sonrası', 'Alçı tozu ve ince partikül standart ev temizliğinden farklı ekipman ister.', 'Yeni teslim / tadilat', 'm² ve toza göre bir–birkaç gün', 'insaat', 'maslak', 'build', 'inşaat'],
  ['periyodik-ev-temizligi-haftalik-plan-istanbul-2026', 'Periyodik Ev Temizliği: Haftalık Plan 2026', 'periyodik ev temizliği', 'Ev Temizliği', 'Haftalık/aylık ritim hijyeni korur; tek sefer genel temizlikten farklıdır.', 'Düzenli bakım isteyenler', 'Ziyaret 2–5 saat', 'ev', 'sariyer', 'home', 'periyodik'],
  ['tek-sefer-vs-periyodik-temizlik-hangisi-2026', 'Tek Sefer vs Periyodik Temizlik Hangisi? 2026', 'tek sefer temizlik', 'Ev Temizliği', 'Taşınma/tadilat sonrası tek sefer; günlük hayat için periyodik daha sürdürülebilir.', 'Karar aşaması', 'İhtiyaca göre', 'ev', 'besiktas', 'home', 'karşılaştırma'],
  ['ofis-temizligi-mesai-sonrasi-planlama-2026', 'Ofis Temizliği Mesai Sonrası Planlama 2026', 'ofis temizliği', 'Ofis Temizliği', 'Mesai bitimine göre planlanan ofis temizliği iş sürekliliğini bozmaz.', 'Ofis yöneticileri', 'Akşam/gece slotu', 'ofis', 'maslak', 'office', 'ofis'],
  ['plaza-ofis-temizligi-maslak-sariyer-2026', 'Plaza Ofis Temizliği Maslak & Sarıyer 2026', 'plaza ofis temizliği', 'Ofis Temizliği', 'Plaza güvenlik ve asansör prosedürleri ofis temizliğinin parçasıdır.', 'Maslak–Sarıyer plaza', 'Kat m² + gece izni', 'ofis', 'maslak', 'office', 'maslak'],
  ['koltuk-yikama-evde-mi-profesyonel-mi-2026', 'Koltuk Yıkama: Evde mi Profesyonel mi? 2026', 'koltuk yıkama', 'Koltuk Yıkama', 'Yanlış kimyasal kalıcı hasar bırakır; profesyonel ekipman fark eder.', 'Leke/koku şikâyeti', 'Birkaç saat + kuruma', 'koltuk', 'sariyer', 'sofa', 'koltuk'],
  ['hali-yikama-evde-profesyonel-surec-2026', 'Halı Yıkama Evde Profesyonel Süreç 2026', 'halı yıkama', 'Halı Yıkama', 'Evde profesyonel yıkama taşıma derdini azaltır; kuruma süresi planlanmalı.', 'Halı/kilim', 'Boyuta göre + kuruma', 'hali', 'kadikoy', 'carpet', 'halı'],
  ['cam-temizligi-villa-ve-yuksek-kat-guvenlik-2026', 'Cam Temizliği Villa ve Yüksek Kat Güvenlik 2026', 'cam temizliği', 'Cam Temizliği', 'Yüksekte cam işi güvenlik ve erişim planı olmadan yapılmaz.', 'Villa/ofis yüksek kat', 'Cam sayısına göre', 'cam', 'tarabya', 'window', 'cam'],
  ['dis-cephe-temizligi-ne-zaman-gerekir-2026', 'Dış Cephe Temizliği Ne Zaman Gerekir? 2026', 'dış cephe temizliği', 'Dış Cephe', 'Yağmur izi ve cephe kiri görünümü etkiler; peyzaj yoktur.', 'Site/villa yönetimi', 'Cephe alanına göre', 'cephe', 'bahce', 'build', 'cephe'],
  ['genel-ev-temizligi-checklist-istanbul-2026', 'Genel Ev Temizliği Checklist İstanbul 2026', 'genel ev temizliği', 'Ev Temizliği', 'Oda oda checklist atlanan köşeleri ve süre sapmasını azaltır.', 'İlk kez profesyonel alanlar', 'Yarım–bir gün', 'ev', 'sisli', 'home', 'checklist'],
  ['derinlemesine-mutfak-temizligi-yag-kirec-2026', 'Derinlemesine Mutfak Temizliği: Yağ & Kireç 2026', 'mutfak temizliği', 'Ev Temizliği', 'Yağlı ocak ve kireçli batarya yüzey uyumlu ürün ve süre ister.', 'Mutfak öncelikli', '1–3 saat+', 'ev', 'umraniye', 'home', 'mutfak'],
  ['banyo-kirec-ve-derz-temizligi-rehberi-2026', 'Banyo Kireç ve Derz Temizliği Rehberi 2026', 'banyo kireç temizliği', 'Ev Temizliği', 'Yanlış asit malzemeyi bozar; doğru ürün kritik.', 'Kireç şikâyeti', 'Banyo adedine göre', 'ev', 'bakirkoy', 'home', 'banyo'],
  ['yeni-dogan-evi-hijyen-temizligi-2026', 'Yeni Doğan Evi Hijyen Temizliği 2026', 'yeni doğan hijyen temizliği', 'Ev Temizliği', 'Bebek odası ve sık dokunulan yüzeyler önceliklidir.', 'Yeni ebeveynler', 'Yarım–bir gün', 'ev', 'sariyer', 'home', 'bebek'],
  ['evcil-hayvanli-ev-temizligi-tuy-koku-2026', 'Evcil Hayvanlı Ev Temizliği: Tüy & Koku 2026', 'evcil hayvanlı ev temizliği', 'Ev Temizliği', 'Tüy ve koku için ek süpürme/yüzey turu planlanır.', 'Pet sahipleri', 'Standart + ek süre', 'ev', 'kagithane', 'home', 'pet'],
  ['bayram-oncesi-ev-temizligi-plan-2026', 'Bayram Öncesi Ev Temizliği Planı 2026', 'bayram öncesi temizlik', 'Ev Temizliği', 'Bayram öncesi randevu yoğunluğu artar; erken rezervasyon kritik.', 'Misafir bekleyenler', 'Genel temizlik süresi', 'ev', 'sariyer', 'home', 'bayram'],
  ['yilbasi-sonrasi-ev-reset-temizligi-2026', 'Yılbaşı Sonrası Ev Reset Temizliği 2026', 'yılbaşı sonrası temizlik', 'Ev Temizliği', 'Misafir ve yemek sonrası mutfak+zemin reset’i ferah başlangıç sağlar.', 'Ara–Ocak', 'Yarım–bir gün', 'ev', 'besiktas', 'home', 'yılbaşı'],
  ['kis-nem-kuf-onleyici-temizlik-adimlari-2026', 'Kış Nem ve Küf Önleyici Temizlik Adımları 2026', 'kış küf temizliği', 'Ev Temizliği', 'Yüzey küfü temizlenebilir; yapısal nem ayrı ustalık ister.', 'Kış nem şikâyeti', 'Odalara göre', 'ev', 'bahce', 'home', 'küf'],
  ['grip-sezonu-yuzey-hijyeni-ev-ofis-2026', 'Grip Sezonu Yüzey Hijyeni: Ev & Ofis 2026', 'yüzey hijyeni grip sezonu', 'Ev Temizliği', 'Kapı kolu ve batarya sezonluk hijyen turuna alınır.', 'Aile/ofis', '1–3 saat veya genel parça', 'ev', 'sisli', 'home', 'hijyen'],
  ['bahar-temizligi-erken-plan-istanbul-2026', 'Bahar Temizliği Erken Plan İstanbul 2026', 'bahar temizliği', 'Ev Temizliği', 'Erken plan randevu bulmayı kolaylaştırır; cam öne çıkar.', 'İlkbahar öncesi', 'Genel + cam opsiyon', 'ev', 'kadikoy', 'home', 'bahar'],
  ['site-yonetimi-icin-ortak-alan-temizligi-2026', 'Site Yönetimi için Ortak Alan Temizliği 2026', 'ortak alan temizliği', 'Ofis Temizliği', 'Lobi, asansör ve merdiven periyodu net olmalı; peyzaj yok.', 'Site yönetimleri', 'Frekansa göre', 'ofis', 'atasehir', 'office', 'site'],
  ['airbnb-kisa-donem-konut-temizligi-2026', 'Airbnb / Kısa Dönem Konut Temizliği 2026', 'Airbnb temizlik', 'Ev Temizliği', 'Check-out/check-in arası hızlı standart checklist gerekir.', 'Hostlar', '1–3 saat', 'ev', 'besiktas', 'home', 'airbnb'],
  ['zekeriyakoy-ev-temizligi-operasyon-rehberi-2026', 'Zekeriyaköy Ev Temizliği Operasyon Rehberi 2026', 'Zekeriyaköy ev temizliği', 'Yerel Rehber', 'Villa yoğun Zekeriyaköy’de erişim ve süre planı farklıdır.', 'Zekeriyaköy', 'Keşifle', 'ev', 'zeker', 'villa', 'zekeriyaköy'],
  ['sariyer-ev-temizligi-ucretsiz-kesif-rehberi-2026', 'Sarıyer Ev Temizliği: Ücretsiz Keşif Rehberi 2026', 'Sarıyer ev temizliği', 'Yerel Rehber', 'Sarıyer’de keşif kapsam ve fiyatı netleştirmenin en hızlı yoludur.', 'Sarıyer', 'Keşifle', 'ev', 'sariyer', 'home', 'sarıyer'],
  ['maslak-ofis-temizligi-gece-vardiya-2026', 'Maslak Ofis Temizliği Gece Vardiya 2026', 'Maslak ofis temizliği', 'Yerel Rehber', 'Maslak plazalarında gece vardiyası mesaiyi bölmez.', 'Plaza ofisleri', 'Gece slotu', 'ofis', 'maslak', 'office', 'maslak'],
  ['tarabya-villa-cam-temizligi-2026', 'Tarabya Villa Cam Temizliği 2026', 'Tarabya cam temizliği', 'Yerel Rehber', 'Boğaz hattı camlarında tuz/toz birikimi periyodik cam ister.', 'Tarabya villa', 'Cam sayısına göre', 'cam', 'tarabya', 'window', 'tarabya'],
  ['bahcekoy-ev-temizligi-orman-hatti-2026', 'Bahçeköy Ev Temizliği Orman Hattı 2026', 'Bahçeköy ev temizliği', 'Yerel Rehber', 'Bahçeköy erişim ve hava koşulları randevu planını etkiler.', 'Bahçeköy', 'Keşifle', 'ev', 'bahce', 'home', 'bahçeköy'],
  ['uskumrukoy-ev-temizligi-rehberi-2026', 'Uskumruköy Ev Temizliği Rehberi 2026', 'Uskumruköy ev temizliği', 'Yerel Rehber', 'Uskumruköy orman içi hattında planlı randevu önemlidir.', 'Uskumruköy', 'Keşifle', 'ev', 'uskum', 'home', 'uskumruköy'],
  ['sisli-ofis-temizligi-merkezi-is-2026', 'Şişli Ofis Temizliği Merkezi İş 2026', 'Şişli ofis temizliği', 'Yerel Rehber', 'Şişli iş hanlarında mesai dışı temizlik tercih edilir.', 'Şişli ofis', 'Akşam/gece', 'ofis', 'sisli', 'office', 'şişli'],
  ['besiktas-ev-temizligi-guvenilir-surec-2026', 'Beşiktaş Ev Temizliği Güvenilir Süreç 2026', 'Beşiktaş ev temizliği', 'Yerel Rehber', 'Beşiktaş’ta otopark ve erişim bilgisi keşifte not edilir.', 'Beşiktaş', 'Yarım–bir gün', 'ev', 'besiktas', 'home', 'beşiktaş'],
  ['kadikoy-ev-temizligi-anadolu-yakasi-2026', 'Kadıköy Ev Temizliği Anadolu Yakası 2026', 'Kadıköy ev temizliği', 'Yerel Rehber', 'Kadıköy yoğunluğunda sabah randevuları genelde daha verimlidir.', 'Kadıköy', 'Yarım–bir gün', 'ev', 'kadikoy', 'home', 'kadıköy'],
  ['umraniye-ev-temizligi-planlama-2026', 'Ümraniye Ev Temizliği Planlama 2026', 'Ümraniye ev temizliği', 'Yerel Rehber', 'Ümraniye’de site giriş prosedürleri önceden alınmalı.', 'Ümraniye', 'Keşifle', 'ev', 'umraniye', 'home', 'ümraniye'],
  ['atasehir-ofis-temizligi-finans-merkezi-2026', 'Ataşehir Ofis Temizliği 2026', 'Ataşehir ofis temizliği', 'Yerel Rehber', 'Ataşehir ofislerinde frekanslı sözleşme yaygındır.', 'Ataşehir ofis', 'Frekansa göre', 'ofis', 'atasehir', 'office', 'ataşehir'],
  ['bakirkoy-ev-temizligi-aile-konut-2026', 'Bakırköy Ev Temizliği Aile Konut 2026', 'Bakırköy ev temizliği', 'Yerel Rehber', 'Aile konutlarında çocuk odası ve mutfak önceliklendirilir.', 'Bakırköy', 'Yarım–bir gün', 'ev', 'bakirkoy', 'home', 'bakırköy'],
  ['kagithane-ofis-ev-temizligi-2026', 'Kağıthane Ofis ve Ev Temizliği 2026', 'Kağıthane temizlik', 'Yerel Rehber', 'Kağıthane’de yeni konut ve ofis stoku planlı temizlik ister.', 'Kağıthane', 'Keşifle', 'ev', 'kagithane', 'home', 'kağıthane'],
  ['sariyer-insaat-sonrasi-temizlik-2026', 'Sarıyer İnşaat Sonrası Temizlik 2026', 'Sarıyer inşaat sonrası', 'Yerel Rehber', 'Sarıyer yeni teslimlerde inşaat tozu programı şart.', 'Yeni teslim', 'm²’ye göre', 'insaat', 'sariyer', 'build', 'sarıyer'],
  ['zekeriyakoy-villa-periyodik-temizlik-2026', 'Zekeriyaköy Villa Periyodik Temizlik 2026', 'Zekeriyaköy villa periyodik', 'Yerel Rehber', 'Villa periyodik bakımda cam ve ıslak hacim rotasyonu planlanır.', 'Villa sahipleri', 'Ziyaret planı', 'ev', 'zeker', 'villa', 'villa'],
  ['fiyat-hesaplama-sonrasi-kesif-neden-gerekli-2026', 'Fiyat Hesaplama Sonrası Keşif Neden Gerekli? 2026', 'fiyat hesaplama keşif', 'Karar Rehberi', 'Online hesaplayıcı tahmindir; keşif yazılı kapsam ve kesin teklif içindir.', 'Online hesap kullananlar', '15–40 dk keşif', 'ev', 'sariyer', 'home', 'fiyat'],
  ['ucretsiz-kesif-nasil-isler-zumrut-vadi-2026', 'Ücretsiz Keşif Nasıl İşler? Zümrüt Vadi 2026', 'ücretsiz keşif', 'Karar Rehberi', 'Keşif ölçü ve öncelikleri netleştirir — satış baskısı değil bilgi turu.', 'İlk kez alanlar', 'Kısa keşif', 'ev', 'sariyer', 'city', 'keşif'],
  ['temizlik-malzemesi-kimden-gelir-2026', 'Temizlik Malzemesi Kimden Gelir? 2026', 'temizlik malzemesi', 'Karar Rehberi', 'Standart ürünler ekiple gelir; özel marka talebi önceden yazılır.', 'Malzeme merakı', '—', 'ev', 'sariyer', 'home', 'malzeme'],
  ['temizlik-suresi-ne-kadar-surer-2026', 'Temizlik Süresi Ne Kadar Sürer? 2026', 'temizlik süresi', 'AEO', 'Süre m², eşya ve kirliliğe bağlıdır; keşifte aralık verilir.', 'Süre planlayanlar', 'Değişken', 'ev', 'sariyer', 'home', 'süre'],
  ['ayni-gun-temizlik-randevusu-mumkun-mu-2026', 'Aynı Gün Temizlik Randevusu Mümkün mü? 2026', 'aynı gün temizlik', 'AEO', 'Kapasite uygunsa aynı gün açılabilir; garanti slot değildir.', 'Acil ihtiyaç', 'Aynı gün', 'ev', 'sariyer', 'home', 'randevu'],
  ['temizlik-sonrasi-garanti-siniri-nedir-2026', 'Temizlik Sonrası Garanti Sınırı Nedir? 2026', 'temizlik garanti sınırı', 'AEO', 'Garanti keşifte yazılı checklist işleridir; keşif dışı ekstra ayrı tekliftir.', 'Kalite soranlar', '—', 'ev', 'sariyer', 'home', 'garanti'],
  ['ev-temizligi-fiyatini-ne-etkiler-2026', 'Ev Temizliği Fiyatını Ne Etkiler? 2026', 'ev temizliği fiyat', 'Karar Rehberi', 'm², oda, kirlilik, dolu/boş ve ek işler fiyatı belirler.', 'Bütçe planı', '—', 'ev', 'sariyer', 'home', 'fiyat'],
  ['ofis-temizligi-fiyatini-ne-etkiler-2026', 'Ofis Temizliği Fiyatını Ne Etkiler? 2026', 'ofis temizliği fiyat', 'Karar Rehberi', 'm², frekans, mesai dışı ve ıslak hacim sayısı etkilidir.', 'Ofis yöneticileri', '—', 'ofis', 'maslak', 'office', 'fiyat'],
  ['insaat-sonrasi-fiyat-m2-nasil-hesaplanir-2026', 'İnşaat Sonrası Fiyat m² Nasıl Hesaplanır? 2026', 'inşaat sonrası m² fiyat', 'Karar Rehberi', 'Kirlilik sınıfı ve m² birlikte okunur; sadece m² yetmez.', 'Teslim alanlar', '—', 'insaat', 'sariyer', 'build', 'fiyat'],
  ['profesyonel-temizlik-vs-bireysel-yardim-2026', 'Profesyonel Temizlik vs Bireysel Yardım 2026', 'profesyonel temizlik', 'Karar Rehberi', 'Ekip ve checklist ölçeklenebilir sonuç verir; karşılaştırma şeffaf olmalı.', 'Karar vericiler', '—', 'ev', 'sariyer', 'home', 'karşılaştırma'],
  ['maslak-insaat-sonrasi-ofis-teslim-2026', 'Maslak İnşaat Sonrası Ofis Teslim 2026', 'Maslak inşaat sonrası ofis', 'İnşaat Sonrası', 'Yeni ofis tesliminde toz programı mobilya öncesi yapılmalı.', 'Maslak ofis', 'm²', 'insaat', 'maslak', 'build', 'maslak'],
  ['sariyer-koltuk-yikama-randevu-2026', 'Sarıyer Koltuk Yıkama Randevu 2026', 'Sarıyer koltuk yıkama', 'Koltuk Yıkama', 'Kuruma süresi randevu gününe yazılır.', 'Sarıyer', 'Birkaç saat+kuruma', 'koltuk', 'sariyer', 'sofa', 'koltuk'],
  ['zekeriyakoy-hali-yikama-villa-2026', 'Zekeriyaköy Halı Yıkama Villa 2026', 'Zekeriyaköy hali yıkama', 'Halı Yıkama', 'Villa tipi halılarda ölçü ve pet/leke notu fiyatı etkiler.', 'Villa', 'Boyuta göre', 'hali', 'zeker', 'carpet', 'halı'],
  ['tarabya-dis-cephe-deniz-tuzu-2026', 'Tarabya Dış Cephe: Deniz Tuzu Etkisi 2026', 'Tarabya dış cephe', 'Dış Cephe', 'Deniz tuzu birikimi periyodik cephe/cam ister; peyzaj yoktur.', 'Tarabya', 'Cepheye göre', 'cephe', 'tarabya', 'build', 'cephe'],
  ['besiktas-cam-temizligi-bina-2026', 'Beşiktaş Cam Temizliği Bina 2026', 'Beşiktaş cam temizliği', 'Cam Temizliği', 'Yönetici onayı ve güvenlik sık gerekir.', 'Beşiktaş', 'Cam sayısı', 'cam', 'besiktas', 'window', 'cam'],
  ['kadikoy-koltuk-yikama-leke-2026', 'Kadıköy Koltuk Yıkama Leke 2026', 'Kadıköy koltuk yıkama', 'Koltuk Yıkama', 'Leke yaşı ve kumaş tipi programı değiştirir.', 'Kadıköy', 'Takıma göre', 'koltuk', 'kadikoy', 'sofa', 'koltuk'],
  ['umraniye-hali-yikama-evde-2026', 'Ümraniye Halı Yıkama Evde 2026', 'Ümraniye hali yıkama', 'Halı Yıkama', 'Evde yıkama taşıma derdini azaltır; kuruma alanı şart.', 'Ümraniye', 'm²', 'hali', 'umraniye', 'carpet', 'halı'],
  ['sisli-cam-temizligi-plaza-2026', 'Şişli Cam Temizliği Plaza 2026', 'Şişli cam temizliği', 'Cam Temizliği', 'Plaza camında erişim ve güvenlik planı önce gelir.', 'Şişli ofis', 'Keşifle', 'cam', 'sisli', 'window', 'cam'],
  ['atasehir-periyodik-ofis-temizlik-2026', 'Ataşehir Periyodik Ofis Temizlik 2026', 'Ataşehir periyodik ofis', 'Ofis Temizliği', 'Haftalık ritim çöp, mutfak ve ıslak hacmi sabitler.', 'Ataşehir', 'Ziyaret planı', 'ofis', 'atasehir', 'office', 'ofis'],
  ['bakirkoy-tasinma-temizligi-2026', 'Bakırköy Taşınma Temizliği 2026', 'Bakırköy taşınma temizliği', 'Taşınma Temizliği', 'Eski–yeni adres planı zaman kazandırır.', 'Bakırköy', 'Daireye göre', 'ev', 'bakirkoy', 'home', 'taşınma'],
  ['kagithane-yeni-daire-teslim-temizlik-2026', 'Kağıthane Yeni Daire Teslim Temizlik 2026', 'Kağıthane teslim temizlik', 'İnşaat Sonrası', 'İnce toz turu mobilyadan önce yapılmalı.', 'Kağıthane', 'm²', 'insaat', 'kagithane', 'build', 'teslim'],
  ['sariyer-genel-temizlik-hafta-sonu-2026', 'Sarıyer Genel Temizlik Hafta Sonu 2026', 'Sarıyer hafta sonu temizlik', 'Ev Temizliği', 'Hafta sonu slotları erken dolar; Cuma rezervasyonu önerilir.', 'Sarıyer', 'Yarım–bir gün', 'ev', 'sariyer', 'home', 'hafta sonu'],
  ['istanbul-avrupa-yakasi-ev-temizlik-secimi-2026', 'İstanbul Avrupa Yakası Ev Temizlik Seçimi 2026', 'Avrupa Yakası ev temizliği', 'Karar Rehberi', 'İlçe, erişim ve villa/daire tipi seçimi belirler.', 'Avrupa Yakası', 'Keşifle', 'ev', 'sariyer', 'city', 'avrupa'],
  ['temizlik-randevusu-oncesi-hazirlik-listesi-2026', 'Temizlik Randevusu Öncesi Hazırlık Listesi 2026', 'temizlik randevu hazırlık', 'AEO', 'Değerli eşya, pet ve erişim bilgisi hazır olursa süre verimli akar.', 'Randevu alanlar', '—', 'ev', 'sariyer', 'home', 'hazırlık'],
  ['yazili-kapsam-neden-onemli-temizlik-2026', 'Yazılı Kapsam Neden Önemli? Temizlik 2026', 'yazılı temizlik kapsamı', 'AEO', 'Yazılı checklist kalite ve garanti sınırını korur.', 'Tüm müşteriler', '—', 'ev', 'sariyer', 'home', 'kapsam'],
  ['cok-banyolu-daire-temizlik-plani-2026', 'Çok Banyolu Daire Temizlik Planı 2026', 'çok banyolu daire temizliği', 'Ev Temizliği', 'Banyo sayısı süreyi ve ekip dağılımını etkiler.', '3+ banyo', 'Banyo adedine göre', 'ev', 'zeker', 'home', 'banyo'],
  ['acik-mutfakli-ev-temizlik-ipuclari-2026', 'Açık Mutfaklı Ev Temizlik İpuçları 2026', 'açık mutfak temizliği', 'Ev Temizliği', 'Açık mutfakta yağ+salon tozu birlikte planlanır.', 'Açık mutfak', '+süre', 'ev', 'tarabya', 'home', 'mutfak'],
  ['merdivenli-dubleks-temizlik-2026', 'Merdivenli Dubleks Temizlik 2026', 'dubleks temizlik', 'Ev Temizliği', 'Merdiven basamak ve korkulukları checklist’e eklenmeli.', 'Dubleks', 'Kat sayısına göre', 'ev', 'bahce', 'home', 'dubleks'],
  ['esya-korumali-dolu-ev-temizlik-2026', 'Eşya Korumalı Dolu Ev Temizlik 2026', 'dolu ev eşya koruma', 'Ev Temizliği', 'Kırılgan ve elektronik için koruma alanı işaretlenir.', 'Dolu ev', '+süre', 'ev', 'sisli', 'home', 'dolu ev'],
  ['ofis-mutfak-cay-ocagi-hijyen-2026', 'Ofis Mutfak / Çay Ocağı Hijyen 2026', 'ofis mutfak hijyen', 'Ofis Temizliği', 'Çay ocağı şikâyetlerin başındadır.', 'Ofis', 'Lokal tur', 'ofis', 'maslak', 'office', 'ofis'],
  ['toplanti-odasi-sonrasi-hizli-toplama-2026', 'Toplantı Odası Sonrası Hızlı Toplama 2026', 'toplantı odası temizliği', 'Ofis Temizliği', 'Masa, cam ve elektronik yüzey turu planlanmalı.', 'Ofis', '1–2 saat', 'ofis', 'sisli', 'office', 'ofis'],
  ['resmi-tatil-oncesi-ofis-reset-2026', 'Resmi Tatil Öncesi Ofis Reset 2026', 'tatil öncesi ofis temizliği', 'Ofis Temizliği', 'Tatil öncesi çöp ve mutfak reset’i dönüşü kolaylaştırır.', 'Ofis yöneticisi', 'Akşam slot', 'ofis', 'atasehir', 'office', 'tatil'],
  ['yeni-yil-ofis-hijyen-turu-2026', 'Yeni Yıl Ofis Hijyen Turu 2026', 'yeni yıl ofis hijyen', 'Ofis Temizliği', 'Ocak başı ortak yüzey turu ilk izlenimi güçlendirir.', 'Ofis', 'Kısa tur', 'ofis', 'besiktas', 'office', 'yeni yıl'],
  ['kislik-kapi-onu-paspas-zemin-2026', 'Kışlık Kapı Önü ve Paspas Zemin 2026', 'kış zemin temizliği', 'Ev Temizliği', 'Çamur ve tuz izi giriş zeminini yıpratır.', 'Kış', 'Lokal+genel', 'ev', 'sariyer', 'home', 'kış'],
  ['kalorifer-petek-ustu-toz-temizlik-2026', 'Kalorifer Petek Üstü Toz Temizlik 2026', 'petek toz temizliği', 'Ev Temizliği', 'Petek üstü toz kışın hava kalitesini etkiler.', 'Kış', 'Lokal', 'ev', 'kagithane', 'home', 'kış'],
  ['balkon-cam-kapatma-sonrasi-temizlik-2026', 'Balkon Cam Kapatma Sonrası Temizlik 2026', 'balkon cam sonrası temizlik', 'Cam Temizliği', 'Cam balkon montajı sonrası inşaat tipi toz kalabilir.', 'Cam balkon', 'Keşifle', 'cam', 'bakirkoy', 'window', 'cam'],
  ['mobilya-montaj-sonrasi-toz-temizlik-2026', 'Mobilya Montaj Sonrası Toz Temizlik 2026', 'montaj sonrası temizlik', 'İnşaat Sonrası', 'İnce partikül için süpürme+mikrofiber turu gerekir.', 'Yeni mobilya', 'Birkaç saat', 'insaat', 'umraniye', 'build', 'montaj'],
  ['boya-badana-sonrasi-temizlik-2026', 'Boya Badana Sonrası Temizlik 2026', 'boya sonrası temizlik', 'İnşaat Sonrası', 'Boya sıçrantısı için uygun ürün; yüzey çizilmemeli.', 'Tadilat', 'm²', 'insaat', 'kadikoy', 'build', 'boya'],
  ['kiralik-daire-giris-temizligi-2026', 'Kiralık Daire Giriş Temizliği 2026', 'kiralık daire giriş temizliği', 'Taşınma Temizliği', 'Yeni kiracı girişinde boş ev hijyeni güven verir.', 'Kiraya veren/alan', 'Daireye göre', 'ev', 'sisli', 'home', 'kiralık'],
  ['satis-oncesi-ev-sunum-temizligi-2026', 'Satış Öncesi Ev Sunum Temizliği 2026', 'satış öncesi ev temizliği', 'Ev Temizliği', 'Emlak gösterimi öncesi ferahlık algısını güçlendirir.', 'Satışa çıkanlar', 'Yarım–bir gün', 'ev', 'besiktas', 'home', 'satış'],
  ['fotograf-cekimi-oncesi-ev-temizlik-2026', 'Fotoğraf Çekimi Öncesi Ev Temizlik 2026', 'çekim öncesi temizlik', 'Ev Temizliği', 'Cam ve tezgâh parlaklığı fotoğrafta kritiktir.', 'Host/emlak', 'Kısa+cam', 'ev', 'kadikoy', 'home', 'çekim'],
  ['ev-hijyen-rutini-profesyonel-destek-2026', 'Ev Hijyen Rutini + Profesyonel Destek 2026', 'ev hijyen rutini', 'Yaşam', 'Haftalık kısa tur + aylık profesyonel destek dengesi.', 'Yoğun tempo', 'Periyodik', 'ev', 'sariyer', 'home', 'rutin'],
  ['calisan-ciftler-icin-temizlik-plani-2026', 'Çalışan Çiftler için Temizlik Planı 2026', 'çalışan çiftler temizlik', 'Yaşam', 'Hafta içi kısa, hafta sonu derin veya profesyonel destek.', 'Çalışan haneler', 'Planlı', 'ev', 'atasehir', 'home', 'yaşam'],
  ['yasli-bakim-evi-hijyen-destegi-sinirlari-2026', 'Yaşlı Bakım Evi Hijyen Desteği Sınırları 2026', 'yaşlı bakım hijyen', 'Ev Temizliği', 'Ev temizliği destekler; tıbbi bakım değildir.', 'Aileler', 'Keşifle', 'ev', 'sariyer', 'home', 'bakım'],
  ['ogrenci-evi-temizligi-paylasimli-2026', 'Öğrenci Evi Temizliği (Paylaşımlı) 2026', 'öğrenci evi temizliği', 'Ev Temizliği', 'Ortak alan checklist’i çatışmayı azaltır.', 'Öğrenci evleri', 'Kısa', 'ev', 'kadikoy', 'home', 'öğrenci'],
  ['yeni-is-yeri-acilis-temizligi-2026', 'Yeni İş Yeri Açılış Temizliği 2026', 'iş yeri açılış temizliği', 'Ofis Temizliği', 'Açılış öncesi vitrin ve zemin ilk izlenimi belirler.', 'Yeni işyeri', 'Keşifle', 'ofis', 'sisli', 'office', 'açılış'],
  ['magaza-vitrin-ve-zemin-temizligi-2026', 'Mağaza Vitrin ve Zemin Temizliği 2026', 'mağaza temizliği', 'Ofis Temizliği', 'Vitrin camı ve giriş zemini müşteri algısını etkiler.', 'Mağaza', 'Lokal/periyodik', 'cam', 'besiktas', 'window', 'mağaza'],
  ['klinik-bekleme-alani-hijyen-temizlik-2026', 'Klinik Bekleme Alanı Hijyen Temizlik 2026', 'klinik bekleme temizliği', 'Ofis Temizliği', 'Bekleme alanı sık dokunma nedeniyle kritik; tıbbi sterilizasyon iddiası yok.', 'Klinik', 'Frekanslı', 'ofis', 'sisli', 'office', 'klinik'],
  ['yuzey-hijyen-aliskanligi-2026', 'Yüzey Hijyen Alışkanlığı 2026', 'yüzey hijyen alışkanlığı', 'Yaşam', 'Kapı kolu ve batarya rutini temel hijyendir.', 'Herkes', 'Kısa tur', 'ev', 'sariyer', 'home', 'hijyen'],
  ['yesil-temizlik-urunleri-ne-demek-2026', 'Yeşil Temizlik Ürünleri Ne Demek? 2026', 'yeşil temizlik ürünleri', 'Karar Rehberi', 'Yüzey uyumu esastır; mucize iddia edilmez.', 'Hassas kullanıcı', '—', 'ev', 'sariyer', 'home', 'ürün'],
  ['antibakteriyel-iddia-vs-yuzey-temizligi-2026', 'Antibakteriyel İddia vs Yüzey Temizliği 2026', 'yüzey temizliği', 'AEO', 'Profesyonel temizlik hijyen riskini azaltır; hastane sterilizasyonu değildir.', 'Bilgi arayanlar', '—', 'ev', 'sariyer', 'home', 'aeo'],
  ['randevu-iptal-ve-erteleme-nasil-isler-2026', 'Randevu İptal ve Erteleme Nasıl İşler? 2026', 'temizlik randevu iptal', 'AEO', 'Kurallar randevu onayıyla yazılı iletilir.', 'Randevusu olanlar', '—', 'ev', 'sariyer', 'city', 'randevu'],
  ['whatsapp-ile-temizlik-teklifi-alma-2026', 'WhatsApp ile Temizlik Teklifi Alma 2026', 'WhatsApp temizlik teklifi', 'AEO', 'Foto/m²/adres ile ön bilgi; kesin teklif keşifle.', 'Hızlı iletişim', '—', 'ev', 'sariyer', 'city', 'whatsapp'],
  ['online-fiyat-hesaplama-nasil-kullanilir-2026', 'Online Fiyat Hesaplama Nasıl Kullanılır? 2026', 'online fiyat hesaplama', 'Karar Rehberi', 'Girdi kalitesi önemlidir; sonucu keşifle doğrulayın.', 'İlk adım', '—', 'ev', 'sariyer', 'city', 'fiyat'],
  ['sariyer-periyodik-ev-temizlik-paketi-2026', 'Sarıyer Periyodik Ev Temizlik Paketi 2026', 'Sarıyer periyodik ev', 'Yerel Rehber', 'Sarıyer’de sabit ritim hijyeni korur; villa ve daire ayrı planlanır.', 'Sarıyer', 'Ziyaret planı', 'ev', 'sariyer', 'home', 'periyodik'],
  ['zekeriyakoy-tasinma-sonrasi-villa-2026', 'Zekeriyaköy Taşınma Sonrası Villa 2026', 'Zekeriyaköy taşınma villa', 'Taşınma Temizliği', 'Villa taşınmasında kat kat checklist ve erişim planı şart.', 'Villa taşınma', 'Keşif', 'ev', 'zeker', 'villa', 'taşınma'],
  ['maslak-plaza-ortak-alan-temizlik-2026', 'Maslak Plaza Ortak Alan Temizlik 2026', 'Maslak plaza ortak alan', 'Ofis Temizliği', 'Koridor ve wet-room yetkiye göre planlanır.', 'Plaza', 'Frekans', 'ofis', 'maslak', 'office', 'plaza'],
  ['uskumrukoy-kis-genel-temizlik-2026', 'Uskumruköy Kış Genel Temizlik 2026', 'Uskumruköy kış temizlik', 'Yerel Rehber', 'Kış erişiminde sabah slotları tercih edilebilir.', 'Uskumruköy', 'Keşifle', 'ev', 'uskum', 'home', 'kış'],
  ['bahcekoy-insaat-sonrasi-konut-2026', 'Bahçeköy İnşaat Sonrası Konut 2026', 'Bahçeköy inşaat sonrası', 'İnşaat Sonrası', 'Orman hattı yeni konutlarda toz programı mobilya öncesi.', 'Bahçeköy', 'm²', 'insaat', 'bahce', 'build', 'inşaat'],
  ['tarabya-periyodik-cam-bakim-2026', 'Tarabya Periyodik Cam Bakım 2026', 'Tarabya periyodik cam', 'Cam Temizliği', 'Tuz/toz için periyodik cam bakımı planlanır.', 'Tarabya', 'Periyot', 'cam', 'tarabya', 'window', 'cam'],
];

for (const row of ROWS) {
  const [slug, title, keyword, category, hook, audience, durationHint, service, area, image, tag] = row;
  add({
    slug,
    title,
    keyword,
    category,
    hook,
    audience,
    durationHint,
    service,
    area,
    image,
    tags: [tag, 'istanbul', 'temizlik', '2026'],
  });
}

const seen = new Set();
const unique = [];
for (const t of topics) {
  if (seen.has(t.slug)) continue;
  seen.add(t.slug);
  unique.push(t);
}

if (unique.length !== 100) {
  console.error('Expected 100 unique, got', unique.length);
  process.exit(1);
}

for (const t of unique) {
  if (!/^[a-z0-9-]+$/.test(t.slug)) throw new Error('bad slug ' + t.slug);
  if (!t.slug.includes('2026')) throw new Error('no 2026 ' + t.slug);
}

const tsArray = unique
  .map(
    (t) => `  {
    slug: ${JSON.stringify(t.slug)},
    title: ${JSON.stringify(t.title)},
    keyword: ${JSON.stringify(t.keyword)},
    category: ${JSON.stringify(t.category)},
    hook: ${JSON.stringify(t.hook)},
    audience: ${JSON.stringify(t.audience)},
    durationHint: ${JSON.stringify(t.durationHint)},
    service: ${JSON.stringify(t.service)},
    area: ${JSON.stringify(t.area)},
    image: ${JSON.stringify(t.image)},
    scopeIn: ${JSON.stringify(t.scopeIn)},
    scopeOut: ${JSON.stringify(t.scopeOut)},
    steps: ${JSON.stringify(t.steps)},
    mistakes: ${JSON.stringify(t.mistakes)},
    priceNote: ${JSON.stringify(t.priceNote)},
    faq: ${JSON.stringify(t.faq)},
    tags: ${JSON.stringify(t.tags)},
  }`
  )
  .join(',\n');

const out = `/**
 * 100 v7 ticari/yerel temizlik blog — drip kuyruğu.
 * Engagement spam değil; hizmet+bölge köprülü, peyzaj yok.
 * ASCII slug + 2026. Üretilir: node scripts/generate-v7-blog-content.mjs
 */
import type { BlogSeedPost } from './seed-blog';
import { makeCommercialGuidePost, type CommercialGuideConfig } from './blog-commercial-html';

const IMG = ${JSON.stringify(IMG, null, 2)} as const;

const SERVICE = ${JSON.stringify(S, null, 2)} as const;

const AREA = ${JSON.stringify(A, null, 2)} as const;

export type V7Topic = {
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
  scopeIn: string[];
  scopeOut: string[];
  steps: string[];
  mistakes: string[];
  priceNote: string;
  faq: Array<{ q: string; a: string }>;
  tags: string[];
};

const TOPICS: V7Topic[] = [
${tsArray}
];

function metaDesc(keyword: string, hook: string): string {
  const base = \`\${keyword}: \${hook}\`;
  return base.length <= 158 ? base : \`\${base.slice(0, 157).trimEnd()}…\`;
}

function expand(t: V7Topic): CommercialGuideConfig {
  const service = SERVICE[t.service];
  const area = AREA[t.area];
  const intro = \`\${t.hook} \${area.label} hattında \${service.label.toLowerCase()} için yazılı kapsam ve ücretsiz keşif ile ilerleriz.\`;
  return {
    slug: t.slug,
    title: t.title,
    metaTitle: t.title.length <= 60 ? t.title : \`\${t.title.slice(0, 59).trimEnd()}…\`,
    metaDesc: metaDesc(t.keyword, t.hook),
    excerpt: t.hook,
    image: IMG[t.image],
    category: t.category,
    tags: [...new Set([...t.tags, 'istanbul', 'temizlik', '2026'])].slice(0, 8),
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
    sections: [
      {
        heading: \`\${t.keyword} — yerel operasyon notu\`,
        paragraphs: [
          \`\${area.label} bölgesinde erişim, otopark ve site/plaza prosedürleri randevu öncesi not edilir; Sarıyer–Zekeriyaköy öncelikli operasyon deneyimi İstanbul genelinde aynı checklist disipliniyle uygulanır.\`,
          \`\${service.label} paketinde peyzaj yoktur. Garanti sınırı keşifte yazılan işlerdir; ekstra talep ayrıca teklif edilir.\`,
        ],
        bullets: [
          'Telefon / WhatsApp: 0551 925 09 43',
          'Ücretsiz keşif veya kısa brifing',
          'Online fiyat hesaplama = tahmin',
        ],
      },
    ],
  };
}

export function generateAllV7Posts(): BlogSeedPost[] {
  if (TOPICS.length !== 100) {
    throw new Error(\`V7 içerik sayısı hatalı: \${TOPICS.length}/100\`);
  }
  return TOPICS.map((t) => makeCommercialGuidePost(expand(t)));
}

export function listV7Slugs(): string[] {
  return TOPICS.map((t) => t.slug);
}
`;

const target = path.join(root, 'src/lib/seed-blog-v7-content.ts');
fs.writeFileSync(target, out, 'utf8');
console.log('OK wrote', unique.length, '→', target);
