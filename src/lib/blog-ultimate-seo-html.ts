/**
 * v10 ultimate SEO blog HTML — uzun form, CTR+evergreen, hizmet/bölge köprülü.
 * Peyzaj yok. Online fiyat = tahmin; kesin teklif keşif.
 */
import type { BlogSeedPost } from './seed-blog';
import { buildFeaturedSnippetBlock, buildGeoTldr, buildPassageSection } from './geo-passage';
import { buildEngagementBlogBridgeLinks } from './internal-seo-links';
import type { PricingGuideConfig } from './blog-commercial-html';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type UltimateSeoConfig = PricingGuideConfig & {
  checklist: string[];
  searchIntents: string[];
  evergreenNote: string;
  deepParagraphs: string[];
};

export function buildUltimateSeoHtml(cfg: UltimateSeoConfig): string {
  const intro =
    cfg.intro.endsWith('.') || cfg.intro.endsWith('…') ? cfg.intro : `${cfg.intro}.`;

  const tldr = buildGeoTldr(intro);
  const featured = buildFeaturedSnippetBlock(
    `${cfg.keyword} — 2026 net cevap`,
    `${intro} Online hesaplama tahmindir; kesin fiyat ücretsiz keşif veya kısa brifing ile yazılı netleşir.`
  );

  const who = buildPassageSection(
    `${cfg.keyword}: bu rehber kimler için?`,
    cfg.audience,
    [
      `${cfg.areaLabel} ve İstanbul genelinde arama yapanlar için tek sayfada süreç, kapsam, maliyet faktörleri ve karar checklist’i toplandı.`,
      `Tipik süre bandı: ${escapeHtml(cfg.durationHint)}. Slot ve ekip büyüklüğü keşifte yazılır.`,
    ]
  );

  const intents = buildPassageSection(
    'Sık aranan konular',
    `“${escapeHtml(cfg.keyword)}” çevresinde kullanıcılar genelde fiyat, süre, kapsam ve yerel firma güvenini birlikte arar.`,
    [
      'Aşağıdaki konular bu rehberde birlikte ele alınır.',
      `<a href="${cfg.serviceHref}">${escapeHtml(cfg.serviceLabel)}</a> · <a href="${cfg.areaHref}">${escapeHtml(cfg.areaLabel)}</a>`,
    ],
    cfg.searchIntents
  );

  const factors = buildPassageSection(
    `${cfg.keyword}: fiyat ve kaliteyi neler belirler?`,
    'Tek satır “sabit fiyat” yerine keşifte yazılan kapsam ile ilerlenir; aşağıdaki faktörler teklifi şekillendirir.',
    [
      `<a href="/fiyat-hesaplama">Online fiyat hesaplama</a> ile hızlı tahmin alın; villa, inşaat sonrası, yüksek kat cam ve yoğun leke/koku durumlarında keşif önerilir.`,
      cfg.compareNote,
    ],
    cfg.priceFactors
  );

  const scenarios = buildPassageSection(
    'Tipik senaryolar ve planlama',
    `Süre ve ekip ${escapeHtml(cfg.durationHint)} bandında değişir; kesin plan yazılı kapsamda çıkar.`,
    [
      `${escapeHtml(cfg.areaLabel)} hattında erişim, otopark, site/plaza prosedürü randevu öncesi not edilir.`,
      'Aynı gün slot kapasiteye bağlıdır; garanti değildir.',
    ],
    cfg.scenarios
  );

  const deep = buildPassageSection(
    `${cfg.keyword} — detaylı notlar`,
    cfg.deepParagraphs[0] ?? intro,
    cfg.deepParagraphs.slice(1),
    undefined
  );

  const checklist = buildPassageSection(
    'Keşif / teklif öncesi kontrol listesi',
    'Eksik bilgi tahmin sapmasını büyütür. WhatsApp veya form ile şu maddeleri iletin.',
    ['Yazılı checklist = garanti sınırı. Keşif dışı ekstra ayrıca teklif edilir.'],
    cfg.checklist
  );

  const scope = buildPassageSection(
    'Kapsam ve sınırlar (şeffaf)',
    'Yüzey ve yaşam alanı temizliği planlanır; bahçe düzenleme hizmetimiz yoktur.',
    ['Garanti keşifte yazılan işlerdir.'],
    [
      ...cfg.scopeIn.map((x) => `Dahil (tipik): ${x}`),
      ...cfg.scopeOut.map((x) => `Dahil değil: ${x}`),
      'Bahçe düzenleme: yok',
    ]
  );

  const process = buildPassageSection(
    'Adım adım süreç',
    'Önce ihtiyaç netliği → bilgi veya keşif → yazılı kapsam → uygulama → kontrol.',
    cfg.steps,
    cfg.mistakes.map((m) => `Kaçının: ${m}`)
  );

  const evergreen = buildPassageSection(
    '2026 ve sonrası: neden evergreen?',
    cfg.evergreenNote,
    [
      'Fiyat rakamları piyasaya göre kayabilir; bu rehberdeki karar çerçevesi (kapsam, keşif, yazılı teklif) yıllarca geçerlidir.',
      'Güncel tahmin için <a href="/fiyat-hesaplama">fiyat hesaplama</a> + <a href="/randevu">ücretsiz keşif</a>.',
    ]
  );

  const price = buildPassageSection(
    'Online tahmin vs ücretsiz keşif',
    cfg.priceNote,
    [
      'Hesaplayıcı girdi kalitesine bağlıdır; sonucu keşifle doğrulayın.',
      'Kesin rakam için <a href="/randevu">randevu</a> veya <a href="/iletisim">iletişim</a> — telefon: 0551 925 09 43.',
    ]
  );

  const extra =
    cfg.sections
      ?.map((s) =>
        buildPassageSection(s.heading, s.paragraphs[0] ?? intro, s.paragraphs.slice(1), s.bullets)
      )
      .join('') ?? '';

  const faqHtml = cfg.faq
    .map((f) => `<div><h3>${escapeHtml(f.q)}</h3><p>${f.a}</p></div>`)
    .join('');

  const moneyLinks = buildEngagementBlogBridgeLinks()
    .slice(0, 10)
    .map((l) => `<a href="${l.href}">${escapeHtml(l.label)}</a>`)
    .join(' · ');

  return `
${tldr}
${featured}
<p class="geo-passage-answer" data-geo-extract="true"><strong>Özet:</strong> ${escapeHtml(intro)}</p>
<p><strong>Zümrüt Vadi Temizlik</strong> — Sarıyer / Zekeriyaköy öncelikli, İstanbul genelinde profesyonel temizlik. Bu rehber <strong>${escapeHtml(cfg.keyword)}</strong> konusu içindir; yazılı kapsam ve keşif esastır.</p>

${who}
${intents}
${factors}
${scenarios}
${deep}
${checklist}
${scope}
${process}
${evergreen}
${price}
${extra}

<h2>Karşılaştırma tablosu (karar çerçevesi)</h2>
<table>
  <thead><tr><th>Seçenek</th><th>Ne zaman?</th><th>Not</th></tr></thead>
  <tbody>
    <tr><td>Online hesaplama</td><td>Hızlı aralık</td><td>Tahmin; sözleşme değil</td></tr>
    <tr><td>Ücretsiz keşif</td><td>Villa / inşaat / belirsiz kapsam</td><td>Yazılı teklif</td></tr>
    <tr><td>Periyodik paket</td><td>Düzenli hijyen</td><td>Birim maliyet genelde düşer</td></tr>
    <tr><td>Tek sefer derin</td><td>Taşınma / tadilat / sezon</td><td>Checklist genişler</td></tr>
  </tbody>
</table>

<h2>Sık sorulan sorular</h2>
${faqHtml}

<h2>Sonraki adım</h2>
<p class="geo-passage-answer" data-geo-extract="true"><strong>Özet:</strong> ${escapeHtml(cfg.keyword)} için <a href="/fiyat-hesaplama">online tahmin</a> alın; kesin teklif için <a href="/randevu">ücretsiz keşif</a> planlayın.</p>
<p><a href="${cfg.serviceHref}">${escapeHtml(cfg.serviceLabel)}</a> · <a href="${cfg.areaHref}">${escapeHtml(cfg.areaLabel)}</a> · <a href="/bolgeler/sariyer">Sarıyer</a> · <a href="/bolgeler/sariyer/zekeriyakoy">Zekeriyaköy</a> · <a href="/hizmetler">Tüm hizmetler</a></p>
<p class="engagement-money-bridges"><strong>İlgili sayfalar:</strong> ${moneyLinks}</p>
<p><em>Zümrüt Vadi Temizlik</em> — 0551 925 09 43 · Google Maps.</p>
  `.trim();
}

export function makeUltimateSeoPost(cfg: UltimateSeoConfig): BlogSeedPost {
  return {
    slug: cfg.slug,
    title: cfg.title,
    excerpt: cfg.excerpt,
    content: buildUltimateSeoHtml(cfg),
    image: cfg.image,
    category: cfg.category,
    tags: cfg.tags,
    metaTitle: cfg.metaTitle,
    metaDesc: cfg.metaDesc,
    skipLongFormEnrichment: true,
  };
}
