import type { BlogSeedPost } from './seed-blog';
import { buildFeaturedSnippetBlock, buildGeoTldr, buildPassageSection } from './geo-passage';

export type EngagementGuideConfig = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  excerpt: string;
  image: string;
  category: string;
  tags: string[];
  intro: string;
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  faq: Array<{ q: string; a: string }>;
  /** Arama niyeti anahtar kelimesi — snippet için */
  keyword: string;
};

export function buildEngagementGuideHtml(cfg: EngagementGuideConfig): string {
  const sectionsHtml = cfg.sections
    .map((s) => {
      const directAnswer =
        s.paragraphs[0] ??
        `${cfg.keyword} konusunda İstanbul'da en sık sorulan sorulara pratik yanıtlar bu bölümde.`;
      return buildPassageSection(s.heading, directAnswer, s.paragraphs.slice(1), s.bullets);
    })
    .join('');

  const faqHtml = cfg.faq.map((f) => `<div><h3>${f.q}</h3><p>${f.a}</p></div>`).join('');

  const tldr = buildGeoTldr(cfg.intro.replace(/\.$/, '') + '.');

  const featuredSnippet = buildFeaturedSnippetBlock(
    `${cfg.keyword} — kısa cevap (2026)`,
    cfg.intro
  );

  return `
${tldr}
${featuredSnippet}
<p class="geo-passage-answer" data-geo-extract="true"><strong>Özet:</strong> ${cfg.intro}</p>
<p>İstanbul'da günlük hayat, ulaşım, ev yönetimi ve dijital konularda doğru bilgiye hızlı ulaşmak zaman kazandırır. Bu rehber; araştırma yapan, plan yapan ve karar veren okuyucular için derlendi — abartılı vaatler yerine uygulanabilir adımlar içerir.</p>

${sectionsHtml}

<h2>İstanbul'da uygularken dikkat edilecekler</h2>
<p class="geo-passage-answer" data-geo-extract="true"><strong>Özet:</strong> Yoğun ilçelerde (Kadıköy, Beşiktaş, Ümraniye, Bakırköy, Kağıthane) randevu, trafik ve resmi işlemler için sabah erken veya öğleden sonra dilimleri genelde daha verimlidir.</p>
<p>Mahalle bazlı uygulamalar (otopark, aidat, site kuralları) ilçeden ilçeye değişir. Resmi işlemlerde güncel duyuruları e-Devlet ve ilgili kurum sitelerinden doğrulayın; üçüncü taraf blog veya sosyal medya paylaşımları tek başına yeterli kaynak değildir.</p>
<p>Daha fazla yerel rehber için <a href="/blog">blog arşivimize</a>, genel temizlik ve ev bakımı konuları için <a href="/rehber">temizlik rehberimize</a> göz atabilirsiniz.</p>

<h2>Sık sorulan sorular</h2>
${faqHtml}

<h2>Özet</h2>
<p class="geo-passage-answer" data-geo-extract="true"><strong>Özet:</strong> ${cfg.keyword} hakkında temel adımları uyguladığınızda hem zaman hem gereksiz masraftan kaçınabilirsiniz. Güncel bilgi için resmi kanalları takip edin.</p>
<p><a href="/blog">Tüm rehberler</a> · <a href="/rehber">Temizlik rehberi</a> · <a href="/iletisim">Bize ulaşın</a></p>
<p><em>Zümrüt Vadi Temizlik</em>, İstanbul genelinde ev ve ofis yaşamına dair rehberler sunarken profesyonel temizlik hizmeti de sağlar.</p>
  `.trim();
}

export function makeEngagementGuidePost(cfg: EngagementGuideConfig): BlogSeedPost {
  return {
    slug: cfg.slug,
    title: cfg.title,
    excerpt: cfg.excerpt,
    content: buildEngagementGuideHtml(cfg),
    image: cfg.image,
    category: cfg.category,
    tags: cfg.tags,
    metaTitle: cfg.metaTitle,
    metaDesc: cfg.metaDesc,
    skipLongFormEnrichment: true,
  };
}
