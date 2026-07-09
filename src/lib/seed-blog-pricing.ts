/**
 * Fiyat odaklı SEO blog yazıları (2026) — slug ile upsert.
 * Her hizmet için detaylı fiyat rehberi + 3 bölgesel/genel rehber = 10 yazı.
 */
import type { BlogSeedPost } from './seed-blog';

const IMG_HOME = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200';
const IMG_OFFICE = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200';
const IMG_CONSTRUCTION = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200';
const IMG_SOFA = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200';
const IMG_CARPET = 'https://images.unsplash.com/photo-1558317374-a354d5f6d40b?w=1200';
const IMG_WINDOW = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200';
const IMG_FACADE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200';
const IMG_VILLA = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200';
const IMG_CALC = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200';

type PriceRow = { label: string; range: string; note?: string };

type PricingGuideConfig = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  excerpt: string;
  image: string;
  tags: string[];
  serviceName: string;
  serviceSlug?: string;
  intro: string;
  priceRows: PriceRow[];
  priceUnitNote: string;
  factors: string[];
  packages: { name: string; desc: string; priceHint: string }[];
  regionalNote: string;
  faq: { q: string; a: string }[];
  extraSections?: { heading: string; paragraphs: string[] }[];
};

function buildPricingHtml(cfg: PricingGuideConfig): string {
  const priceTable = cfg.priceRows
    .map(
      (r) =>
        `<tr><td><strong>${r.label}</strong></td><td>${r.range}</td><td>${r.note ?? '—'}</td></tr>`
    )
    .join('');

  const factorsList = cfg.factors.map((f) => `<li>${f}</li>`).join('');
  const packagesHtml = cfg.packages
    .map(
      (p) =>
        `<div><h3>${p.name}</h3><p>${p.desc}</p><p><em>Tahmini aralık: ${p.priceHint}</em></p></div>`
    )
    .join('');

  const faqHtml = cfg.faq
    .map((f) => `<div><h3>${f.q}</h3><p>${f.a}</p></div>`)
    .join('');

  const extraHtml =
    cfg.extraSections
      ?.map(
        (s) =>
          `<h2>${s.heading}</h2>${s.paragraphs.map((p) => `<p>${p}</p>`).join('')}`
      )
      .join('') ?? '';

  const serviceLink = cfg.serviceSlug
    ? `<a href="/hizmetler/${cfg.serviceSlug}">${cfg.serviceName} hizmet detay sayfamız</a>`
    : `<a href="/hizmetler">hizmetlerimiz</a>`;

  return `
<p>${cfg.intro}</p>
<p><strong>Önemli:</strong> Bu rehberdeki tüm rakamlar 2026 İstanbul piyasasına göre <strong>tahmini aralıklardır</strong>. Kesin fiyat; alan büyüklüğü, kirlilik düzeyi, erişim koşulları ve ek hizmet taleplerine göre ücretsiz keşif sonrası netleşir. Anında tahmin için <a href="/fiyat-hesaplama">online fiyat hesaplama aracımızı</a> kullanabilirsiniz.</p>

<h2>2026 ${cfg.serviceName} fiyat tablosu (tahmini)</h2>
<p>${cfg.priceUnitNote}</p>
<table>
<thead><tr><th>Kapsam / Tip</th><th>2026 Tahmini Fiyat</th><th>Not</th></tr></thead>
<tbody>${priceTable}</tbody>
</table>

<h2>Fiyatı etkileyen 8 temel faktör</h2>
<p>Google'da "ucuz" veya "pahalı" diye arama yapan kullanıcıların çoğu aslında <em>doğru kapsam</em> arıyor. Aşağıdaki faktörler fiyatı doğrudan belirler:</p>
<ul>${factorsList}</ul>
<p>Zekeriyaköy, Bahçeköy ve Boğaz hattındaki villalarda erişim, yüksek tavan ve geniş cam yüzeyleri nedeniyle süre ve ekipman ihtiyacı artabilir; bu da tablodaki aralığın üst bandına yaklaşmanıza neden olabilir. Detaylı bölgesel bilgi için <a href="/bolgeler/sariyer/zekeriyakoy">Zekeriyaköy temizlik sayfamıza</a> göz atın.</p>

<h2>Paket karşılaştırması: standart vs detaylı</h2>
${packagesHtml}

<h2>İstanbul Avrupa Yakası ve Sarıyer bağlamı</h2>
<p>${cfg.regionalNote}</p>
<p>Sarıyer ve çevresinde (Zekeriyaköy, Maslak, Tarabya, Yeniköy, Bahçeköy) özellikle villa ve site konutlarında hijyen beklentisi yüksektir. Orta–üst segment hizmet sunan firmalar genelde şeffaf kapsam listesi, sigortalı ekip ve keşif sonrası yazılı teklif sunar — fiyat karşılaştırması yaparken yalnızca en düşük rakama değil, <strong>dahil olan iş kalemlerine</strong> bakın.</p>

${extraHtml}

<h2>Ücretsiz keşif ve online fiyat hesaplama</h2>
<p>Net fiyat almak için iki pratik yol var:</p>
<ol>
<li><strong>Online hesaplama:</strong> <a href="/fiyat-hesaplama">Fiyat hesaplama sayfamızda</a> mekan tipi, oda sayısı veya metrekare ve ekstraları seçerek saniyeler içinde tahmini aralığınızı görün.</li>
<li><strong>Ücretsiz keşif:</strong> Adresinizde alanı birlikte gezip kapsamı netleştiriyoruz; ardından yazılı teklif sunuyoruz. <a href="/randevu">Randevu oluşturun</a> veya <a href="/iletisim">iletişime geçin</a>.</li>
</ol>
<p>İlgili hizmet hakkında teknik detaylar için ${serviceLink} inceleyebilir; Sarıyer genelinde <a href="/bolgeler/sariyer">bölge sayfamıza</a> bakabilirsiniz.</p>

<h2>Sık sorulan sorular</h2>
${faqHtml}

<h2>Sonuç: doğru fiyat = doğru kapsam</h2>
<p>${cfg.serviceName} fiyatları 2026 yılında İstanbul'da metrekare, kirlilik, erişim ve ek hizmet taleplerine göre değişir. En sağlıklı karşılaştırma; aynı kapsam maddelerini içeren teklifleri yan yana koymaktır. Zümrüt Vadi Temizlik olarak Sarıyer ve Zekeriyaköy başta olmak üzere İstanbul Avrupa Yakası'nda şeffaf fiyatlandırma, ücretsiz keşif ve <a href="/fiyat-hesaplama">anında fiyat hesaplama aracı</a> ile hizmet veriyoruz.</p>
<p><strong>Hemen tahmin almak için:</strong> <a href="/fiyat-hesaplama">Fiyat Hesapla</a> · <a href="/randevu">Ücretsiz Keşif Randevusu</a> · <a href="/iletisim">Teklif İste</a></p>
  `.trim();
}

function makePost(cfg: PricingGuideConfig): BlogSeedPost {
  return {
    slug: cfg.slug,
    title: cfg.title,
    excerpt: cfg.excerpt,
    content: buildPricingHtml(cfg),
    image: cfg.image,
    category: 'Fiyat Rehberleri',
    tags: [...cfg.tags, 'fiyat rehberi', '2026', 'istanbul temizlik fiyatları'],
    metaTitle: cfg.metaTitle,
    metaDesc: cfg.metaDesc,
    skipLongFormEnrichment: true,
  };
}

const GUIDES: PricingGuideConfig[] = [
  {
    slug: 'ev-temizligi-fiyatlari-2026-istanbul',
    title: 'Ev Temizliği Fiyatları 2026: İstanbul Daire ve Villa Rehberi',
    metaTitle: 'Ev Temizliği Fiyatları 2026 İstanbul | 1+1–5+1 Tablo',
    metaDesc:
      '2026 İstanbul ev temizliği fiyatları: 1+1’den 5+1’e daire paketleri, villa temizliği, fiyatı etkileyen faktörler ve ücretsiz keşif. Anında online hesaplama.',
    excerpt:
      '2026 İstanbul ev temizliği fiyat rehberi: daire tiplerine göre güncel aralıklar, villa temizliği, ekstralar ve Zekeriyaköy/Sarıyer notları. Tahmini fiyatınızı hemen hesaplayın.',
    image: IMG_HOME,
    tags: ['ev temizliği fiyatları', 'daire temizliği', 'villa temizliği', 'zekeriyaköy'],
    serviceName: 'Ev Temizliği',
    serviceSlug: 'ev-temizligi',
    intro:
      'Ev temizliği fiyatları İstanbul’da 2026 yılında daire tipi, metrekare, kirlilik düzeyi ve talep edilen detay seviyesine göre geniş bir aralıkta değişir. Özellikle Sarıyer, Zekeriyaköy ve Boğaz hattındaki villalarda yüksek tavan, geniş cam ve çok sayıda ıslak hacim süreyi ve maliyeti artırabilir. Bu rehberde orta–üst segment profesyonel ev temizliği için güncel tahmini aralıkları, paket farklarını ve fiyatı belirleyen unsurları bulacaksınız.',
    priceUnitNote:
      'Aşağıdaki tablo tek seferlik detaylı ev temizliği (genel + mutfak + banyo + yaşam alanları) içindir. Periyodik (haftalık/aylık) bakım paketlerinde birim fiyat düşer.',
    priceRows: [
      { label: '1+1 daire', range: '3.500 – 4.500 TL', note: 'Standart detay temizlik' },
      { label: '2+1 daire', range: '5.000 – 6.500 TL', note: 'Orta kapsam' },
      { label: '3+1 daire', range: '6.500 – 8.500 TL', note: 'Geniş yaşam alanı' },
      { label: '4+1 daire', range: '8.500 – 10.500 TL', note: 'Çok odalı / duplex' },
      { label: '5+1 daire', range: '10.500 – 13.000 TL', note: 'Büyük metrekare' },
      { label: 'Villa (Zekeriyaköy tipi)', range: '12.000 – 25.000+ TL', note: 'm² ve kapsama göre keşif' },
      { label: 'Cam temizliği (ekstra)', range: '+600 – 1.000 TL', note: 'Daire içi camlar' },
      { label: 'Buzdolabı / fırın içi', range: 'Ücretsiz hediye', note: 'Kampanya kapsamında' },
      { label: 'Balkon temizliği', range: 'Ücretsiz hediye', note: 'Kampanya kapsamında' },
    ],
    factors: [
      'Daire tipi ve net/brüt metrekare (1+1 ile 5+1 arasında iş süresi ciddi fark yaratır)',
      'Kirlilik ve kullanım yoğunluğu (taşınma öncesi/sonrası, uzun süre bakımsız alan)',
      'Islak hacim sayısı (banyo, WC, mutfak derinliği)',
      'Zemin ve yüzey türü (parke, mermer, lake mutfak — ürün seçimi değişir)',
      'Cam ve balkon kapsamı (geniş cephe camları süreyi uzatır)',
      'Erişim ve otopark (site güvenliği, uzun yürüme mesafesi)',
      'Ek hizmetler (koltuk/halı yıkama, dolap içi detay)',
      'Periyodik mi tek seferlik mi (düzenli sözleşmede birim maliyet düşer)',
    ],
    packages: [
      {
        name: 'Standart ev temizliği',
        desc: 'Toz alma, zemin silme/süpürme, mutfak tezgah-dolap dışı, banyo genel, çöp toplama.',
        priceHint: 'Tablodaki alt–orta band',
      },
      {
        name: 'Detaylı / taşınma öncesi',
        desc: 'Dolap içi, süpürgelik, cam, armatür parlatma, beyaz eşya dış detay, balkon.',
        priceHint: 'Tablodaki orta–üst band',
      },
      {
        name: 'Villa / site paketi',
        desc: 'Çok katlı, bahçe kenarı, geniş cam; gizlilik odaklı ekip, keşif zorunlu.',
        priceHint: 'Keşif sonrası özel teklif',
      },
    ],
    regionalNote:
      'Zekeriyaköy ve Bahçeköy’de müstakil villalar ile kapalı sitelerde detay beklentisi yüksektir. Boğaz hattı konutlarında cam temizliği sık talep edilir. Sarıyer genelinde aynı gün keşif imkânı sunan firmalar tercih edilir.',
    faq: [
      {
        q: 'Ev temizliği fiyatı neden firmadan firmaya farklı?',
        a: 'Kapsam listesi farklıdır: bir teklifte dolap içi varken diğerinde yoksa fiyat karşılaştırması yanıltıcı olur. Her zaman dahil iş kalemlerini sorun.',
      },
      {
        q: '2+1 ev temizliği 2026’da ne kadar?',
        a: 'Orta–üst segment detaylı temizlik için tahmini 5.000–6.500 TL aralığı yaygındır. Kesin fiyat keşif ile netleşir.',
      },
      {
        q: 'Malzemeler fiyata dahil mi?',
        a: 'Profesyonel firmalarda genelde evet; yüzeye uygun ürün ve ekipman ekip tarafından getirilir.',
      },
      {
        q: 'Zekeriyaköy villa temizliği daha pahalı mı?',
        a: 'Metrekare, kat sayısı ve cam/bahçe kapsamı arttıkça süre uzar; bu da fiyatı yukarı çeker. Online hesaplayıcı ile ön tahmin alabilirsiniz.',
      },
      {
        q: 'Periyodik temizlik indirimi var mı?',
        a: 'Haftalık veya aylık planlarda birim fiyat düşer; yoğun kullanılan evlerde uzun vadede daha ekonomiktir.',
      },
    ],
  },
  {
    slug: 'ofis-temizligi-fiyatlari-2026-istanbul',
    title: 'Ofis Temizliği Fiyatları 2026: m² Bazlı Kurumsal Rehber',
    metaTitle: 'Ofis Temizliği Fiyatları 2026 | İstanbul m² Tablosu',
    metaDesc:
      '2026 İstanbul ofis temizliği fiyatları: m² birim fiyat, günlük/haftalık paketler, Maslak ve Avrupa Yakası notları. Ücretsiz keşif ve online hesaplama.',
    excerpt:
      'Ofis temizliği fiyatları 2026: metrekare bazlı güncel aralıklar, kurumsal sözleşme, mesai dışı planlama ve fiyatı etkileyen faktörler.',
    image: IMG_OFFICE,
    tags: ['ofis temizliği fiyatları', 'kurumsal temizlik', 'maslak ofis', 'm2 fiyat'],
    serviceName: 'Ofis Temizliği',
    serviceSlug: 'ofis-temizligi',
    intro:
      'Ofis temizliği fiyatlandırması ev temizliğinden farklı olarak çoğunlukla metrekare (m²) ve hizmet sıklığı (günlük, haftalık, aylık) üzerinden yapılır. 2026 İstanbul piyasasında orta–üst segment kurumsal ofis temizliği için m² birim fiyatları ve minimum iş bedelleri aşağıda özetlenmiştir. Maslak, Levent ve Kağıthane hattındaki plaza ofislerinde mesai dışı uygulama sık talep edilir.',
    priceUnitNote: 'Fiyatlar mesai içi/dışı standart ofis alanı (açık ofis + toplantı odası + mutfak + WC) için tahminidir.',
    priceRows: [
      { label: 'Birim fiyat (m²)', range: '35 – 55 TL/m²', note: 'Tek seferlik detay' },
      { label: 'Minimum iş bedeli', range: '2.500 – 3.500 TL', note: 'Küçük ofisler' },
      { label: '50 m² ofis (örnek)', range: '2.500 – 3.500 TL', note: 'Taban uygulanabilir' },
      { label: '100 m² ofis (örnek)', range: '3.500 – 5.500 TL', note: 'Orta kapsam' },
      { label: '200 m² ofis (örnek)', range: '7.000 – 11.000 TL', note: 'Açık ofis' },
      { label: 'Haftalık sözleşme (100 m²)', range: 'Aylık paket teklif', note: 'Keşif sonrası' },
      { label: 'Cam / vitrin (ekstra)', range: '+600 – 1.000 TL', note: 'İç cephe' },
    ],
    factors: [
      'Net ofis m² ve bölüm sayısı (WC, mutfak, toplantı odası)',
      'Personel yoğunluğu ve hijyen standardı (sağlık, gıda, call center)',
      'Çalışma saati (mesai dışı gece temizliği farklı planlanır)',
      'Zemin türü (halı, laminat, mermer)',
      'Cam cephe ve yüksek erişim ihtiyacı',
      'Sözleşme süresi ve sıklık (günlük vs haftalık)',
      'Tüketim malzemesi (kağıt, çöp torbası) kimden',
      'Otopark ve bina giriş prosedürleri',
    ],
    packages: [
      { name: 'Tek seferlik ofis detay', desc: 'Taşınma, devir veya özel etkinlik öncesi.', priceHint: 'm² × birim fiyat' },
      { name: 'Haftalık kurumsal', desc: 'Sabit gün, sabit ekip, kontrol listesi.', priceHint: 'Aylık indirimli paket' },
      { name: 'Günlük plaza', desc: 'Büyük metrekare, gece vardiyası.', priceHint: 'Özel teklif' },
    ],
    regionalNote:
      'Maslak ve Levent plazalarında BMS giriş kartı ve mesai dışı slot rezervasyonu önemlidir. Sarıyer tarafındaki butik ofislerde daha küçük metrekarelerde minimum iş bedeli devreye girer.',
    faq: [
      { q: 'Ofis temizliği m² fiyatı 2026 ne kadar?', a: 'Orta–üst segmentte 35–55 TL/m² tek seferlik detay için yaygın referans aralığıdır.' },
      { q: 'Sözleşme zorunlu mu?', a: 'Hayır; tek seferlik de alınır. Düzenli hizmette sözleşme fiyatı stabilize eder.' },
      { q: 'Mesai dışı temizlik mümkün mü?', a: 'Evet, çoğu kurumsal müşteride akşam/gece planlanır.' },
      { q: 'Fiyat hesaplama aracı ofis için çalışır mı?', a: 'Evet, fiyat hesaplama sayfasında ofis tipini seçip m² girerek tahmin alabilirsiniz.' },
    ],
  },
  {
    slug: 'insaat-sonrasi-temizlik-fiyatlari-2026',
    title: 'İnşaat Sonrası Temizlik Fiyatları 2026: Teslim Öncesi Rehber',
    metaTitle: 'İnşaat Sonrası Temizlik Fiyatı 2026 | m² Rehberi',
    metaDesc:
      '2026 inşaat sonrası temizlik fiyatları: m² birim fiyat, daire ve villa teslim paketleri, ince toz ve boya kalıntısı. İstanbul ücretsiz keşif.',
    excerpt:
      'İnşaat sonrası temizlik fiyat rehberi 2026: m² bazlı güncel aralıklar, teslim öncesi kapsam, villa/daire farkları ve sık sorulan sorular.',
    image: IMG_CONSTRUCTION,
    tags: ['inşaat sonrası temizlik fiyatı', 'teslim temizliği', 'tadilat sonrası'],
    serviceName: 'İnşaat Sonrası Temizlik',
    serviceSlug: 'insaat-sonrasi-temizlik',
    intro:
      'İnşaat ve tadilat sonrası temizlik, ince toz, boya spreyi, silikon ve moloz kalıntısı gibi ağır kirlilikle uğraşır; bu nedenle standart ev temizliğinden belirgin şekilde daha yüksek fiyatlandırılır. 2026 İstanbul piyasasında orta–üst segment inşaat sonrası temizlik m² birim fiyatları ve minimum paket bedelleri aşağıdadır.',
    priceUnitNote: 'Kapsam: ince toz alma, yüzey silme, cam, mutfak/banyo detay, zemin koruma çıkarma (kapsam keşifte netleşir).',
    priceRows: [
      { label: 'Birim fiyat (m²)', range: '75 – 120 TL/m²', note: 'Kirlilik seviyesine göre' },
      { label: 'Minimum iş bedeli', range: '5.500 – 8.000 TL', note: 'Küçük alanlar' },
      { label: '80 m² daire (örnek)', range: '6.000 – 9.600 TL', note: 'Orta kirlilik' },
      { label: '120 m² daire (örnek)', range: '9.000 – 14.400 TL', note: 'Yeni teslim' },
      { label: '200 m² villa (örnek)', range: '15.000 – 24.000+ TL', note: 'Zekeriyaköy tipi' },
      { label: 'Cam detay (dahil/ekstra)', range: 'Kapsama göre', note: 'Geniş cephe ayrı satır' },
    ],
    factors: [
      'İnce inşaat tozu yoğunluğu ve havalandırma durumu',
      'Boya, alçı, silikon kalıntıları',
      'Cam ve doğrama sayısı',
      'Zemin koruma (streç, karton) sökümü',
      'Asansör ve ortak alan temizliği dahil mi',
      'Teslim tarihi baskısı (acil / aynı gün)',
      'Villa çok katlı mı',
      'Su ve elektrik erişimi',
    ],
    packages: [
      { name: 'Rough clean (kaba)', desc: 'Moloz sonrası ilk toz — genelde müteahhit aşaması.', priceHint: 'Daha düşük m²' },
      { name: 'Teslim detay (fine clean)', desc: 'Oturmaya hazır final temizlik.', priceHint: 'Tablodaki orta–üst band' },
      { name: 'Villa teslim paketi', desc: 'Bahçe kapısı, çok kat, geniş cam.', priceHint: 'Keşif zorunlu' },
    ],
    regionalNote:
      'Sarıyer ve Zekeriyaköy’de yeni villa teslimlerinde geniş cam ve ahşap zemin kombinasyonu ürün seçimini etkiler. Kentsel dönüşüm projelerinde Kağıthane hattında yoğun talep görülür.',
    faq: [
      { q: 'İnşaat sonrası temizlik neden pahalı?', a: 'İnce toz her yüzeye nüfuz eder; süre ve ekipman ihtiyacı artar. Yanlış ürün yüzeye zarar verebilir.' },
      { q: 'm² fiyat 2026 ne aralıkta?', a: 'Orta–üst segmentte 75–120 TL/m² yaygın referanstır.' },
      { q: 'Tadilat sonrası da aynı mı?', a: 'Kapsam daha küçükse birim düşebilir; keşif gerekir.' },
      { q: 'Ne zaman planlamalıyım?', a: 'Teslimden 2–3 gün önce rezervasyon önerilir; yoğun sezonlarda erken randevu şart.' },
    ],
  },
  {
    slug: 'koltuk-yikama-fiyatlari-2026-istanbul',
    title: 'Koltuk Yıkama Fiyatları 2026: Yerinde Profesyonel Rehber',
    metaTitle: 'Koltuk Yıkama Fiyatları 2026 İstanbul | Koltuk Başı',
    metaDesc:
      '2026 İstanbul koltuk yıkama fiyatları: 2+1 koltuk seti, L koltuk, leke çıkarma ekstra. Yerinde uygulama ve kuruma süresi rehberi.',
    excerpt:
      'Koltuk yıkama fiyatları 2026: koltuk tipine göre güncel aralıklar, leke çıkarma, kumaş farkları ve Zekeriyaköy yerinde hizmet notları.',
    image: IMG_SOFA,
    tags: ['koltuk yıkama fiyatları', 'yerinde koltuk yıkama', 'kanepe temizliği'],
    serviceName: 'Koltuk Yıkama',
    serviceSlug: 'koltuk-yikama',
    intro:
      'Yerinde koltuk yıkama fiyatları koltuk sayısı, kumaş türü (kumaş, deri, süet), leke durumu ve kurutma süresine göre belirlenir. 2026 İstanbul’da orta–üst segment profesyonel koltuk yıkama için tipik aralıklar aşağıdadır. Ev temizliği paketine ek olarak alınabilir veya tek başına hizmet olarak planlanabilir.',
    priceUnitNote: 'Fiyatlar yerinde buharlı/extractor yöntem içindir; taşıma gerektiren fabrika yıkama farklı fiyatlandırılır.',
    priceRows: [
      { label: 'Tekli koltuk / berjer', range: '400 – 700 TL', note: 'Kumaş tipine göre' },
      { label: '2+1 koltuk takımı', range: '900 – 1.400 TL', note: 'Standart set' },
      { label: '3+1 / L koltuk', range: '1.200 – 1.800 TL', note: 'Geniş oturma' },
      { label: 'Köşe koltuk (büyük)', range: '1.500 – 2.500 TL', note: 'Modüler' },
      { label: 'Leke çıkarma (ekstra)', range: '+200 – 500 TL', note: 'Kahve, mürekkep vb.' },
      { label: 'Ev temizliği paketi ekstra', range: '+900 – 1.800 TL', note: 'Fiyat hesaplayıcıda seçilebilir' },
    ],
    factors: [
      'Kumaş kodu (microfiber, keten, deri)',
      'Leke tipi ve süresi',
      'Koltuk adedi ve modül sayısı',
      'Kurutma ekipmanı ihtiyacı',
      'Erişim (villa, site, asansör)',
      'Evcil hayvan tüyü yoğunluğu',
      'Alerji / hijyen (antibakteriyel uygulama)',
      'Sezon (yoğun dönem randevu)',
    ],
    packages: [
      { name: 'Standart yıkama', desc: 'Genel kirlilik, hafif leke.', priceHint: 'Tablo alt–orta band' },
      { name: 'Derin hijyen + leke', desc: 'Yoğun leke ve koku giderme.', priceHint: 'Orta–üst band' },
      { name: 'Ev temizliği combo', desc: 'Aynı gün ev + koltuk.', priceHint: 'Paket indirimi mümkün' },
    ],
    regionalNote:
      'Zekeriyaköy villalarında büyük L koltuk ve deri kombinasyonları sıktır. Kuruma için havalandırma ve hava akışı önemlidir.',
    faq: [
      { q: 'Koltuk yıkama kaç saatte kurur?', a: '4–12 saat arası; kumaş ve havaya bağlı.' },
      { q: 'Leke garantisi var mı?', a: 'Leke tipine göre önceden bilgi verilir; kimyasal yan etki riski olan lekelerde test yapılır.' },
      { q: 'Fiyat hesaplama aracında var mı?', a: 'Ev/ofis temizliğine ekstra olarak koltuk/halı seçeneği işaretleyebilirsiniz.' },
    ],
  },
  {
    slug: 'hali-temizligi-fiyatlari-2026-istanbul',
    title: 'Halı Temizliği Fiyatları 2026: Yerinde ve m² Rehberi',
    metaTitle: 'Halı Temizliği Fiyatları 2026 | İstanbul m² Tablo',
    metaDesc:
      '2026 halı temizliği fiyatları İstanbul: m² birim fiyat, yerinde yıkama, halı tipi farkları. Ücretsiz keşif ve fiyat hesaplama aracı.',
    excerpt:
      'Halı temizliği fiyat rehberi 2026: makine halısı, yün, shaggy farkları, m² aralıkları ve ev temizliği ile birlikte alım avantajları.',
    image: IMG_CARPET,
    tags: ['halı temizliği fiyatları', 'halı yıkama', 'yerinde halı temizliği'],
    serviceName: 'Halı Temizliği',
    serviceSlug: 'hali-temizligi',
    intro:
      'Halı temizliği fiyatları halı türü, metrekare, leke durumu ve yerinde mi atölyede mi yıkanacağına göre değişir. 2026 İstanbul piyasasında yerinde halı temizliği ve ev içi halı alanları için referans aralıklar aşağıdadır.',
    priceUnitNote: 'Yerinde buharlı/extractor yöntem; fabrikaya toplama ayrı fiyatlandırılır.',
    priceRows: [
      { label: 'Makine halısı (m²)', range: '80 – 120 TL/m²', note: 'Standart' },
      { label: 'Yün / ipek halı (m²)', range: '120 – 180 TL/m²', note: 'Hassas dokuma' },
      { label: 'Shaggy / yüksek hav', range: '100 – 150 TL/m²', note: 'Uzun tüy' },
      { label: 'Oda halısı (15 m² örnek)', range: '1.200 – 1.800 TL', note: 'Yerinde' },
      { label: 'Leke / koku (ekstra)', range: '+150 – 400 TL', note: 'Pet lekesi vb.' },
      { label: 'Ev paketi ekstra', range: '+900 – 1.800 TL', note: 'Koltuk+halı birlikte' },
    ],
    factors: [
      'Halı lif tipi ve dokuma yoğunluğu',
      'm² ve oda sayısı',
      'Leke ve koku şiddeti',
      'Mobilya kaydırma ihtiyacı',
      'Kuruma süresi',
      'Antialerjen / hijyen talebi',
      'Site/villa erişim',
      'Periyodik bakım planı',
    ],
    packages: [
      { name: 'Tek oda halı', desc: 'Yerinde hızlı uygulama.', priceHint: 'm² × birim' },
      { name: 'Tüm ev halıları', desc: 'Taşınma öncesi combo.', priceHint: 'Toplu indirim mümkün' },
      { name: 'Hassas yün', desc: 'pH kontrollü ürün.', priceHint: 'Üst band' },
    ],
    regionalNote:
      'Villa ve müstakil evlerde büyük tek parça halılar ve merdiven halısı ek süre gerektirir.',
    faq: [
      { q: 'Halı yıkama m² fiyatı 2026?', a: 'Makine halısında 80–120 TL/m² orta–üst segment referansıdır.' },
      { q: 'Yün halı daha pahalı mı?', a: 'Evet, ürün ve süre farklıdır.' },
      { q: 'Ne kadar süre kullanılamaz?', a: 'Genelde 4–8 saat nemli kalır; hava akışı önemlidir.' },
    ],
  },
  {
    slug: 'cam-temizligi-fiyatlari-2026-istanbul',
    title: 'Cam Temizliği Fiyatları 2026: Daire, Ofis ve Villa Rehberi',
    metaTitle: 'Cam Temizliği Fiyatları 2026 İstanbul | İç-Dış Rehber',
    metaDesc:
      '2026 cam temizliği fiyatları: daire içi cam, villa geniş cephe, ofis periyodik paket. İstanbul güncel aralıklar ve ücretsiz keşif.',
    excerpt:
      'Cam temizliği fiyat rehberi 2026: daire, villa ve ofis için güncel aralıklar, iç-dış fark, periyodik paketler ve güvenlik notları.',
    image: IMG_WINDOW,
    tags: ['cam temizliği fiyatları', 'villa cam temizliği', 'ofis cam silme'],
    serviceName: 'Cam Temizliği',
    serviceSlug: 'cam-temizligi',
    intro:
      'Cam temizliği fiyatları cam adedi, iç/dış erişim, kat yüksekliği ve periyodik sıklığa göre belirlenir. Zekeriyaköy ve Boğaz hattı villalarında floor-to-ceiling camlar fiyatı artırır. 2026 referans aralıkları aşağıdadır.',
    priceUnitNote: 'Daire içi camlar için; dış cephe ve yüksek erişim ayrı kategoridedir (dış cephe rehberine bakın).',
    priceRows: [
      { label: 'Daire içi cam paketi', range: '600 – 1.000 TL', note: '2+1 ortalama' },
      { label: '3+1 / geniş daire', range: '900 – 1.500 TL', note: 'Balkon kapı dahil' },
      { label: 'Villa (geniş cephe)', range: '1.500 – 4.000+ TL', note: 'Keşif gerekli' },
      { label: 'Ofis periyodik (aylık)', range: 'Teklif bazlı', note: 'm² ve sıklık' },
      { label: 'Ev temizliği hediye cam', range: 'Kampanyada dahil', note: 'Paket koşuluna bağlı' },
    ],
    factors: [
      'Cam adedi ve boyutu',
      'İç veya dış yüzey',
      'Kat / erişim (merdiven, iskele)',
      'Pencere pervaz ve sineklik temizliği dahil mi',
      'Periyodik mi tek seferlik mi',
      'Hava koşulu (yağmur/rüzgar erteleme)',
      'Güvenlik ekipmanı',
      'Site kuralları',
    ],
    packages: [
      { name: 'Daire standart', desc: 'Salon + odalar iç cam.', priceHint: '600–1.000 TL band' },
      { name: 'Villa premium', desc: 'Geniş cephe, çok kat.', priceHint: 'Keşif' },
      { name: 'Aylık ofis', desc: 'Haftalık/aylık plan.', priceHint: 'Sözleşme' },
    ],
    regionalNote:
      'Zekeriyaköy’de bahçe katı ve çatı katı camları birlikte planlanır. Maslak ofislerinde mesai dışı slot tercih edilir.',
    faq: [
      { q: 'Cam temizliği ev paketine dahil mi?', a: 'Kampanyada balkon ve buzdolabı/fırın içi gibi hediyeler olabilir; cam genelde ekstra veya paket koşuluna bağlıdır.' },
      { q: 'Dış cam daha pahalı mı?', a: 'Evet, erişim ve güvenlik nedeniyle dış cephe kategorisinde fiyatlanır.' },
      { q: 'Periyodik indirim var mı?', a: 'Site ve işletmelerde aylık paketlerde birim düşer.' },
    ],
  },
  {
    slug: 'dis-cephe-temizligi-fiyatlari-2026',
    title: 'Dış Cephe Temizliği Fiyatları 2026: Cam ve Cephe m² Rehberi',
    metaTitle: 'Dış Cephe Temizliği Fiyatı 2026 | m² Cephe Tablosu',
    metaDesc:
      '2026 dış cephe temizliği fiyatları: cam cephe m², villa dış yüzey, iş güvenliği maliyeti. İstanbul Sarıyer ve plaza rehberi.',
    excerpt:
      'Dış cephe temizliği fiyat rehberi 2026: m² birim fiyat, yüksek kat güvenliği, villa ve plaza farkları, sezonluk planlama.',
    image: IMG_FACADE,
    tags: ['dış cephe temizliği fiyatı', 'cam cephe yıkama', 'yüksek kat temizlik'],
    serviceName: 'Dış Cephe Temizliği',
    serviceSlug: 'dis-cephe-temizligi',
    intro:
      'Dış cephe temizliği fiyatlandırması cephe alanı (m²), bina yüksekliği, erişim yöntemi (iskele, halat, sepetli vinç) ve kirlilik türüne göre yapılır. 2026 İstanbul’da orta–üst segment referans m² aralıkları aşağıdadır. İş güvenliği maliyeti fiyata dahildir.',
    priceUnitNote: 'Cam cephe ve kaplama yüzeyler için tahmini m² birim fiyat; keşif zorunludur.',
    priceRows: [
      { label: 'Birim fiyat (m²)', range: '35 – 60 TL/m²', note: 'Erişime göre' },
      { label: 'Minimum iş bedeli', range: '1.200 – 2.000 TL', note: 'Küçük cephe' },
      { label: '100 m² cephe (örnek)', range: '3.500 – 6.000 TL', note: 'Orta kat' },
      { label: 'Villa dış cam', range: 'Keşif bazlı', note: 'Zekeriyaköy tipi' },
      { label: 'Plaza / yüksek kat', range: 'Özel teklif', note: 'Halat/sepetli' },
    ],
    factors: [
      'Cephe yüksekliği ve erişim yöntemi',
      'Cam m² ve panel sayısı',
      'Rüzgar ve hava koşulları',
      'Kirlilik (toz, kuş, polen)',
      'Site/AVM güvenlik prosedürü',
      'Sezonluk periyot (yılda 2–4 kez)',
      'Gece/hafta sonu çalışma',
      'Sigorta ve belge gereksinimleri',
    ],
    packages: [
      { name: 'Villa dış cam', desc: '2–3 kat müstakil.', priceHint: 'Keşif' },
      { name: 'Apartman cephe', desc: 'Ortak alan paylaşımı.', priceHint: 'm² × birim' },
      { name: 'Plaza yıllık', desc: 'Sözleşmeli periyodik.', priceHint: 'Kurumsal teklif' },
    ],
    regionalNote:
      'Sarıyer villalarında bahçe mesafesi ve elektrik/su noktası planlamaya dahil edilir. Plaza projelerinde gece uygulama yaygındır.',
    faq: [
      { q: 'Dış cephe m² fiyatı 2026?', a: '35–60 TL/m² orta–üst segment referans aralığıdır; yüksek kat daha yüksek olabilir.' },
      { q: 'Ne sıklıkla yaptırmalıyım?', a: 'Konuma göre yılda 2–4 kez önerilir.' },
      { q: 'Yağmurda yapılır mı?', a: 'Güvenlik ve sonuç kalitesi için ertelenir.' },
    ],
  },
  {
    slug: 'zekeriyakoy-temizlik-fiyatlari-2026',
    title: 'Zekeriyaköy Temizlik Fiyatları 2026: Villa ve Ev Rehberi',
    metaTitle: 'Zekeriyaköy Temizlik Fiyatları 2026 | Villa & Ev Tablo',
    metaDesc:
      'Zekeriyaköy temizlik fiyatları 2026: villa, site ve daire detay temizlik aralıkları, inşaat sonrası, cam ve dış cephe. Ücretsiz keşif Sarıyer.',
    excerpt:
      'Zekeriyaköy 2026 temizlik fiyat rehberi: villa ve site konutları için güncel aralıklar, ev/inşaat/cam paketleri, bölgeye özel notlar.',
    image: IMG_VILLA,
    tags: ['zekeriyaköy temizlik fiyatları', 'zekeriyaköy villa temizliği', 'sarıyer'],
    serviceName: 'Zekeriyaköy Temizlik',
    intro:
      'Zekeriyaköy, Sarıyer’in en çok talep gören orman içi yerleşimlerinden biridir; müstakil villalar, kapalı siteler ve geniş metrekareli konutlar fiyatlandırmayı İstanbul ortalamasının üzerine taşıyabilir. Bu rehber 2026 yılı için Zekeriyaköy’de ev, villa, inşaat sonrası ve cam/dış cephe temizliği tahmini aralıklarını tek sayfada toplar.',
    priceUnitNote: 'Zekeriyaköy fiyatları erişim, gizlilik ve alan büyüklüğüne göre değişir; kesin teklif için ücretsiz keşif önerilir.',
    priceRows: [
      { label: '3+1 daire (site)', range: '7.000 – 9.500 TL', note: 'Detay temizlik' },
      { label: '4+1 / 5+1 daire', range: '9.500 – 14.000 TL', note: 'Geniş plan' },
      { label: 'Villa (150–250 m²)', range: '12.000 – 22.000 TL', note: 'Ev temizliği' },
      { label: 'Villa inşaat sonrası', range: '15.000 – 30.000+ TL', note: 'm² ve toz' },
      { label: 'Geniş cam paketi', range: '1.500 – 4.000 TL', note: 'İç + dış plan' },
      { label: 'Dış cephe (villa)', range: 'Keşif bazlı', note: 'Cephe m²' },
    ],
    factors: [
      'Villa m² ve kat sayısı',
      'Site güvenlik ve giriş prosedürü',
      'Orman içi toz ve polen',
      'Geniş cam ve yüksek tavan',
      'Bahçe/teras kenarı alanlar',
      'Gizlilik ve ekip deneyimi beklentisi',
      'Taşınma / inşaat sonrası kapsam',
      'Aynı gün keşif ihtiyacı',
    ],
    packages: [
      { name: 'Site daire detay', desc: 'Periyodik veya tek sefer.', priceHint: '7.000–14.000 TL band' },
      { name: 'Müstakil villa', desc: 'Çok kat, bahçe kenarı.', priceHint: 'Keşif zorunlu' },
      { name: 'Teslim / taşınma', desc: 'İnşaat sonrası combo.', priceHint: 'Üst band' },
    ],
    regionalNote:
      'Zekeriyaköy’de Zümrüt Vadi Temizlik öncelikli bölge olarak hizmet verir. Bahçeköy, Kilyos ve Demirciköy çevresi aynı operasyon planına dahil edilebilir. <a href="/bolgeler/sariyer/zekeriyakoy">Zekeriyaköy temizlik sayfamız</a> detaylı hizmet listesini içerir.',
    faq: [
      { q: 'Zekeriyaköy temizlik fiyatları neden yüksek?', a: 'Metrekare, erişim, cam ve detay beklentisi standart daireden fazladır.' },
      { q: 'Aynı gün keşif var mı?', a: 'Yoğunluğa göre evet; WhatsApp veya randevu ile talep edin.' },
      { q: 'Online fiyat hesaplama yeterli mi?', a: 'Tahmin için evet; villa için keşif şarttır.' },
      { q: 'Hangi hizmetler sunuluyor?', a: 'Ev, inşaat sonrası, cam, dış cephe, koltuk/halı — bölge sayfasından inceleyin.' },
    ],
    extraSections: [
      {
        heading: 'Zekeriyaköy’de fiyat karşılaştırırken dikkat',
        paragraphs: [
          'Ucuz tekliflerde kapsam dar olabilir: dolap içi, cam, balkon veya ince toz ayrı satılabilir. Karşılaştırma yaparken yazılı kapsam listesi isteyin.',
          'Villa müşterilerinde sigorta, ekip referansı ve gizlilik sözleşmesi sık sorulur; bu kalite göstergesidir ve fiyatı makul şekilde yansıtır.',
        ],
      },
    ],
  },
  {
    slug: 'sariyer-temizlik-fiyatlari-2026',
    title: 'Sarıyer Temizlik Fiyatları 2026: Semt Semt Rehber',
    metaTitle: 'Sarıyer Temizlik Fiyatları 2026 | Zekeriyaköy–Maslak',
    metaDesc:
      'Sarıyer temizlik fiyatları 2026: Zekeriyaköy, Maslak, Tarabya, Yeniköy için ev ve ofis aralıkları. İstanbul Avrupa Yakası güncel tablo.',
    excerpt:
      'Sarıyer ilçesi 2026 temizlik fiyat rehberi: Zekeriyaköy, Maslak, Tarabya ve Boğaz hattı için ev, ofis ve inşaat sonrası aralıklar.',
    image: IMG_VILLA,
    tags: ['sarıyer temizlik fiyatları', 'maslak temizlik', 'tarabya temizlik'],
    serviceName: 'Sarıyer Temizlik',
    intro:
      'Sarıyer; Zekeriyaköy villalarından Maslak plazalarına, Tarabya sahil konutlarından Bahçeköy orman evlerine kadar geniş bir yelpazede temizlik ihtiyacı doğurur. Bu rehber 2026 yılı Sarıyer geneli için orta–üst segment tahmini fiyat aralıklarını semt profiline göre özetler.',
    priceUnitNote: 'Semt içi farklar büyüktür; aşağıdaki tablo ortalama referans içindir.',
    priceRows: [
      { label: 'Zekeriyaköy villa ev', range: '12.000 – 25.000+ TL', note: 'Detay' },
      { label: 'Bahçeköy / orman evi', range: '8.000 – 18.000 TL', note: 'm² bağlı' },
      { label: 'Maslak ofis (100 m²)', range: '3.500 – 5.500 TL', note: 'Tek sefer' },
      { label: 'Tarabya / Yeniköy daire 3+1', range: '7.000 – 9.500 TL', note: 'Boğaz hattı' },
      { label: 'İnşaat sonrası (Sarıyer)', range: '75 – 120 TL/m²', note: 'Standart referans' },
      { label: 'Cam paketi (daire)', range: '600 – 1.500 TL', note: 'İç cephe' },
    ],
    factors: [
      'Semt profili (villa vs daire vs plaza)',
      'Boğaz hattı cam yoğunluğu',
      'Site güvenlik ve otopark',
      'Trafik ve ekip lojistiği',
      'Yüksek gelir segmenti detay beklentisi',
      'İnşaat / tadilat yoğunluğu',
      'Periyodik sözleşme',
      'Ek hizmet (koltuk, halı, dış cephe)',
    ],
    packages: [
      { name: 'Boğaz hattı daire', desc: '3+1 detay + cam.', priceHint: '7.000–10.000 TL' },
      { name: 'Maslak kurumsal', desc: 'Ofis periyodik.', priceHint: 'Sözleşme' },
      { name: 'Orman içi villa', desc: 'Zekeriyaköy / Bahçeköy.', priceHint: 'Keşif' },
    ],
    regionalNote:
      'Sarıyer, Zümrüt Vadi Temizlik için öncelikli ilçedir. Tüm semtlerde <a href="/bolgeler/sariyer">Sarıyer bölge sayfası</a> üzerinden hizmet kombinasyonlarına ulaşabilirsiniz.',
    faq: [
      { q: 'Sarıyer’in en pahalı semti hangisi?', a: 'Geniş metrekareli Zekeriyaköy villaları ve Boğaz hattı büyük daireleri üst banda çıkar.' },
      { q: 'Maslak ofis fiyatı evden farklı mı?', a: 'Evet, m² bazlı kurumsal fiyatlandırma uygulanır.' },
      { q: 'Sarıyer genelinde keşif ücretsiz mi?', a: 'Evet, keşif ve ön değerlendirme ücretsizdir.' },
    ],
  },
  {
    slug: 'istanbul-temizlik-fiyatlari-online-hesaplama-2026',
    title: 'İstanbul Temizlik Fiyatları 2026: Online Hesaplama Rehberi',
    metaTitle: 'İstanbul Temizlik Fiyatları 2026 | Online Hesaplama',
    metaDesc:
      '2026 İstanbul temizlik fiyatları özeti: ev, ofis, inşaat, koltuk, halı, cam tabloları. Anında online fiyat hesaplama aracı kullanım rehberi.',
    excerpt:
      'İstanbul temizlik fiyatları 2026 master rehberi: tüm hizmetlerin özet tablosu, online hesaplama adımları, ücretsiz keşif ve Avrupa Yakası notları.',
    image: IMG_CALC,
    tags: ['istanbul temizlik fiyatları', 'online fiyat hesaplama', 'temizlik fiyat listesi'],
    serviceName: 'İstanbul Temizlik',
    intro:
      'İstanbul’da temizlik fiyatları hizmet türüne göre daire paketi, m² birim fiyat veya adet bazlı hesaplanır. 2026 yılı orta–üst segment piyasa referanslarını tek rehberde topladık. En hızlı yol: sitemizdeki anında fiyat hesaplama aracı; en doğru yol: ücretsiz keşif.',
    priceUnitNote: 'Özet tablo — detaylı rehberler için ilgili hizmet blog linklerine bakın.',
    priceRows: [
      { label: 'Ev 2+1 (detay)', range: '5.000 – 6.500 TL', link: '/blog/ev-temizligi-fiyatlari-2026-istanbul' },
      { label: 'Ofis (m²)', range: '35 – 55 TL/m²', link: '/blog/ofis-temizligi-fiyatlari-2026-istanbul' },
      { label: 'İnşaat sonrası (m²)', range: '75 – 120 TL/m²', link: '/blog/insaat-sonrasi-temizlik-fiyatlari-2026' },
      { label: 'Koltuk takımı', range: '900 – 1.800 TL', link: '/blog/koltuk-yikama-fiyatlari-2026-istanbul' },
      { label: 'Halı (m²)', range: '80 – 180 TL/m²', link: '/blog/hali-temizligi-fiyatlari-2026-istanbul' },
      { label: 'Cam (daire)', range: '600 – 1.500 TL', link: '/blog/cam-temizligi-fiyatlari-2026-istanbul' },
      { label: 'Dış cephe (m²)', range: '35 – 60 TL/m²', link: '/blog/dis-cephe-temizligi-fiyatlari-2026' },
      { label: 'Zekeriyaköy villa', range: '12.000 – 25.000+ TL', link: '/blog/zekeriyakoy-temizlik-fiyatlari-2026' },
    ].map((r) => ({
      label: r.label,
      range: r.range,
      note: `<a href="${r.link}">Detaylı rehber</a>`,
    })),
    factors: [
      'Hizmet türü (ev / ofis / inşaat / tekstil / cam / cephe)',
      'Metrekare veya oda sayısı',
      'Kirlilik ve erişim',
      'Ekstralar (cam, koltuk, balkon hediyeleri)',
      'Semt (Sarıyer, Zekeriyaköy primi)',
      'Tek seferlik vs sözleşme',
      'Aciliyet',
      'Keşif sonrası net kapsam',
    ],
    packages: [
      { name: 'Online tahmin', desc: 'Fiyat hesaplama aracı — 30 saniye.', priceHint: 'Anında aralık' },
      { name: 'WhatsApp randevu', desc: 'Hesap sonrası tek tık.', priceHint: 'Ücretsiz keşif' },
      { name: 'Yazılı teklif', desc: 'Keşif sonrası net fiyat.', priceHint: 'Kesin' },
    ],
    regionalNote:
      'İstanbul Avrupa Yakası (Sarıyer, Beşiktaş, Şişli, Kağıthane) operasyon yoğunluğumuzun merkezindedir. Anadolu Yakası’nda da hizmet verilir; fiyat lojistiğe göre değişebilir.',
    faq: [
      { q: 'Online hesaplama kesin fiyat mı?', a: 'Hayır, tahmini aralıktır; keşif kesinleştirir.' },
      { q: 'Hangi hizmetler hesaplanır?', a: 'Ev, ofis, işyeri, inşaat sonrası, dış cephe + ekstralar.' },
      { q: 'En ucuz ne zaman?', a: 'Kapsam daraldığında; kalite için orta–üst segment referansları daha tutarlı sonuç verir.' },
      { q: 'Fiyat rehberleri nerede?', a: 'Bu sayfadaki tablodaki detaylı rehber linklerine tıklayın.' },
    ],
    extraSections: [
      {
        heading: 'Online fiyat hesaplama aracı nasıl kullanılır?',
        paragraphs: [
          '<a href="/fiyat-hesaplama">Fiyat hesaplama sayfasına</a> gidin. Mekan tipini seçin (ev için oda sayısı, diğerleri için m²). Cam, koltuk/halı ekstralarını işaretleyin. Buzdolabı/fırın içi ve balkon kampanyada ücretsiz hediye olarak gösterilir. Çıkan tahmini aralıktan sonra WhatsApp ile randevu oluşturabilirsiniz.',
          'Bu araç sektörde nadir bir özelliktir; Google’da “online temizlik fiyat hesaplama” aramalarında sitenizi öne çıkarmak için tasarlandı. Blog yazıları ve fiyat sayfası birlikte güçlü bir SEO kümesi oluşturur.',
        ],
      },
    ],
  },
];

export const PRICING_BLOG_POSTS: BlogSeedPost[] = GUIDES.map(makePost);
