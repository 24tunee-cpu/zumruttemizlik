/**
 * v7+ ticari / yerel temizlik blog HTML — engagement şablonundan daha derin,
 * hizmet+bölge köprülü, kapsam sınırı (peyzaj yok) net.
 */
import type { BlogSeedPost } from './seed-blog';
import { buildFeaturedSnippetBlock, buildGeoTldr, buildPassageSection } from './geo-passage';
import { buildEngagementBlogBridgeLinks } from './internal-seo-links';

export type CommercialGuideConfig = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  excerpt: string;
  image: string;
  category: string;
  tags: string[];
  keyword: string;
  intro: string;
  audience: string;
  durationHint: string;
  serviceHref: string;
  serviceLabel: string;
  areaHref: string;
  areaLabel: string;
  scopeIn: string[];
  scopeOut: string[];
  steps: string[];
  mistakes: string[];
  priceNote: string;
  faq: Array<{ q: string; a: string }>;
  sections?: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildCommercialGuideHtml(cfg: CommercialGuideConfig): string {
  const tldr = buildGeoTldr(cfg.intro.replace(/\.$/, '') + '.');
  const featured = buildFeaturedSnippetBlock(`${cfg.keyword} — kısa cevap (2026)`, cfg.intro);

  const who = buildPassageSection(
    'Bu rehber kimler için?',
    cfg.audience,
    [
      `${cfg.areaLabel} ve İstanbul genelinde ${cfg.keyword} arayanlar için süreç, kapsam ve keşif adımlarını netleştirir.`,
      `Süre ve ekip büyüklüğü işe göre değişir; tipik aralık: ${cfg.durationHint}. Kesin plan ücretsiz keşifte yazılır.`,
    ]
  );

  const scope = buildPassageSection(
    'Kapsam: dahil olanlar ve sınırlar',
    `${cfg.keyword} paketinde yüzey ve yaşam alanları temizliği planlanır; peyzaj/bahçe düzenleme hizmetimiz yoktur.`,
    [
      'Keşifte yazılan checklist esas alınır. Keşif dışı ekstra işler ayrıca teklif edilir — garanti sınırı yazılı kapsamdır.',
      'Online fiyat tahminidir; kesin teklif keşif veya kısa bilgi sonrası netleşir.',
    ],
    [
      ...cfg.scopeIn.map((x) => `Dahil (tipik): ${x}`),
      ...cfg.scopeOut.map((x) => `Dahil değil: ${x}`),
      'Peyzaj mimarisi / bahçe düzenleme: yok',
    ]
  );

  const process = buildPassageSection(
    `${cfg.keyword} — adım adım süreç`,
    'Önce ücretsiz keşif veya kısa brifing, sonra yazılı kapsam, sonra checklist’li uygulama.',
    [
      `Hizmet sayfası: <a href="${cfg.serviceHref}">${escapeHtml(cfg.serviceLabel)}</a>. Bölge odaklı bilgi: <a href="${cfg.areaHref}">${escapeHtml(cfg.areaLabel)}</a>.`,
      'Uygulama sonrası eksik kalan yazılı işler aynı plan kapsamında düzeltilir.',
    ],
    cfg.steps
  );

  const mistakes = buildPassageSection(
    'Sık yapılan hatalar',
    'Kapsamı sözlü bırakmak, malzeme uyumunu sormamak ve keşifsiz “sabit fiyat” beklemek en sık sorunlardır.',
    ['Aşağıdaki maddeleri keşif öncesi not edin; WhatsApp veya form ile iletin.'],
    cfg.mistakes
  );

  const price = buildPassageSection(
    'Fiyat nasıl netleşir?',
    cfg.priceNote,
    [
      'Metrekare, kirlilik, eşya yoğunluğu, kat/erişim ve istenen ek işler (cam, koltuk, inşaat tozu vb.) fiyatı etkiler.',
      '<a href="/fiyat-hesaplama">Online fiyat hesaplama</a> ile tahmini alın; kesin teklif için <a href="/randevu">ücretsiz keşif</a> veya <a href="/iletisim">iletişim</a>.',
    ]
  );

  const extra =
    cfg.sections
      ?.map((s) =>
        buildPassageSection(
          s.heading,
          s.paragraphs[0] ?? cfg.intro,
          s.paragraphs.slice(1),
          s.bullets
        )
      )
      .join('') ?? '';

  const faqHtml = cfg.faq.map((f) => `<div><h3>${escapeHtml(f.q)}</h3><p>${f.a}</p></div>`).join('');

  const moneyLinks = buildEngagementBlogBridgeLinks()
    .slice(0, 8)
    .map((l) => `<a href="${l.href}">${escapeHtml(l.label)}</a>`)
    .join(' · ');

  return `
${tldr}
${featured}
<p class="geo-passage-answer" data-geo-extract="true"><strong>Özet:</strong> ${cfg.intro}</p>
<p><strong>Zümrüt Vadi Temizlik</strong>, Sarıyer / Zekeriyaköy öncelikli olmak üzere İstanbul’da profesyonel temizlik sunar. Bu yazı ${escapeHtml(cfg.keyword)} niyetine odaklıdır; abartılı vaat yok, yazılı kapsam ve keşif esas.</p>

${who}
${scope}
${process}
${mistakes}
${price}
${extra}

<h2>Sık sorulan sorular</h2>
${faqHtml}

<h2>Sonraki adım</h2>
<p class="geo-passage-answer" data-geo-extract="true"><strong>Özet:</strong> ${escapeHtml(cfg.keyword)} için net kapsam ve tahmini süre keşifte çıkar. Hemen <a href="/randevu">randevu</a> veya <a href="/fiyat-hesaplama">fiyat hesaplama</a> ile ilerleyin.</p>
<p><a href="${cfg.serviceHref}">${escapeHtml(cfg.serviceLabel)}</a> · <a href="${cfg.areaHref}">${escapeHtml(cfg.areaLabel)}</a> · <a href="/bolgeler/sariyer/zekeriyakoy">Zekeriyaköy temizlik</a></p>
<p class="engagement-money-bridges"><strong>Hizmet ve bölge:</strong> ${moneyLinks}</p>
<p><em>Zümrüt Vadi Temizlik</em> — Google Maps yorumları ve ücretsiz keşif ile şeffaf süreç.</p>
  `.trim();
}

export function makeCommercialGuidePost(cfg: CommercialGuideConfig): BlogSeedPost {
  return {
    slug: cfg.slug,
    title: cfg.title,
    excerpt: cfg.excerpt,
    content: buildCommercialGuideHtml(cfg),
    image: cfg.image,
    category: cfg.category,
    tags: cfg.tags,
    metaTitle: cfg.metaTitle,
    metaDesc: cfg.metaDesc,
    skipLongFormEnrichment: true,
  };
}
