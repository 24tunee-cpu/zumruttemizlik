import type { BlogSeedPost } from './seed-blog';
import { buildGeoTldr, buildPassageSection } from './geo-passage';
import { GEO_BRAND_NAME } from '@/config/geo-entity';

export type SeoGuideConfig = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  excerpt: string;
  image: string;
  category: string;
  tags: string[];
  districtName: string;
  districtSlug: string;
  topicLabel: string;
  intro: string;
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  faq: Array<{ q: string; a: string }>;
  serviceSlug?: string;
  serviceName?: string;
};

export function buildSeoGuideHtml(cfg: SeoGuideConfig): string {
  const sectionsHtml = cfg.sections
    .map((s) => {
      const directAnswer =
        s.paragraphs[0] ??
        `${GEO_BRAND_NAME}, ${cfg.districtName} bölgesinde ${s.heading.toLowerCase()} konusunda profesyonel destek sunar.`;
      const detailParagraphs = s.paragraphs.slice(1);
      return buildPassageSection(s.heading, directAnswer, detailParagraphs, s.bullets);
    })
    .join('');

  const faqHtml = cfg.faq.map((f) => `<div><h3>${f.q}</h3><p>${f.a}</p></div>`).join('');

  const serviceBlock = cfg.serviceSlug
    ? `<p>İlgili hizmet: <a href="/hizmetler/${cfg.serviceSlug}">${cfg.serviceName ?? cfg.serviceSlug}</a> · Bölge: <a href="/bolgeler/${cfg.districtSlug}">${cfg.districtName}</a></p>`
    : `<p>Bölgesel hizmet: <a href="/bolgeler/${cfg.districtSlug}">${cfg.districtName} temizlik</a> · <a href="/fiyat-hesaplama">Fiyat hesaplama</a></p>`;

  const tldr = buildGeoTldr(
    `${GEO_BRAND_NAME}, ${cfg.districtName} bölgesinde ${cfg.topicLabel.toLowerCase()} için ${cfg.excerpt.replace(/\.$/, '')}.`
  );

  return `
${tldr}
<p class="geo-passage-answer" data-geo-extract="true"><strong>Özet:</strong> ${cfg.intro}</p>
<p><strong>${cfg.districtName}</strong> ve İstanbul genelinde ${cfg.topicLabel.toLowerCase()} planlarken kapsamı netleştirmek, hem bütçeyi korur hem teslim kalitesini yükseltir. Bu rehber; ev sahipleri, kiracılar ve işletmeler için uygulanabilir adımlar içerir.</p>

${sectionsHtml}

<h2>${cfg.districtName} için pratik ipuçları</h2>
<p class="geo-passage-answer" data-geo-extract="true"><strong>Özet:</strong> ${GEO_BRAND_NAME}, ${cfg.districtName} bölgesinde randevu öncesi erişim, otopark ve asansör bilgisini alarak ekip planlamasını hızlandırır; acil talepler için randevu formu veya iletişim kanalları kullanılabilir.</p>
<p>${cfg.districtName} bölgesinde konut yoğunluğu, site/villa yapısı ve ulaşım koşulları süreyi etkileyebilir. Randevu öncesi erişim, otopark ve asansör bilgisini paylaşmanız ekip planlamasını hızlandırır. Acil talepler için <a href="/randevu">randevu formumuzu</a> veya <a href="/iletisim">iletişim</a> kanallarımızı kullanabilirsiniz.</p>
<p>Tahmini bütçe için <a href="/fiyat-hesaplama">online fiyat hesaplama aracımız</a> saniyeler içinde aralık verir; kesin teklif ücretsiz keşif sonrası netleşir.</p>

${serviceBlock}

<h2>Sık sorulan sorular</h2>
${faqHtml}

<h2>Özet</h2>
<p class="geo-passage-answer" data-geo-extract="true"><strong>Özet:</strong> ${GEO_BRAND_NAME}, ${cfg.districtName} odaklı ${cfg.topicLabel.toLowerCase()} planında sigortalı ekip, şeffaf kapsam ve yazılı teklif ile Sarıyer, Zekeriyaköy ve İstanbul Avrupa Yakası'nda hizmet verir.</p>
<p><a href="/fiyat-hesaplama">Fiyat Hesapla</a> · <a href="/randevu">Ücretsiz Keşif</a> · <a href="/iletisim">Teklif Al</a></p>
  `.trim();
}

export function makeSeoGuidePost(cfg: SeoGuideConfig): BlogSeedPost {
  return {
    slug: cfg.slug,
    title: cfg.title,
    excerpt: cfg.excerpt,
    content: buildSeoGuideHtml(cfg),
    image: cfg.image,
    category: cfg.category,
    tags: cfg.tags,
    metaTitle: cfg.metaTitle,
    metaDesc: cfg.metaDesc,
    skipLongFormEnrichment: true,
  };
}
