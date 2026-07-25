/**
 * Yayınlanmış fiyat yazılarına featured snippet bloğu ekler (render-time, idempotent).
 */
import { buildFeaturedSnippetBlock } from '@/lib/geo-passage';
import { GEO_BRAND_NAME } from '@/config/geo-entity';

export const FEATURED_SNIPPET_MARKER = 'data-snippet-extract="true"';

function extractDistrictFromPricingSlug(slug: string): string | null {
  const m = slug.match(/^([a-z0-9-]+)-(ev|ofis)-temizligi-fiyatlari-2026$/);
  return m?.[1] ?? null;
}

function formatDistrictName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace('Goztepe', 'Göztepe')
    .replace('Atasehir', 'Ataşehir')
    .replace('Umraniye', 'Ümraniye')
    .replace('Basaksehir', 'Başakşehir')
    .replace('Avcilar', 'Avcılar')
    .replace('Bahcesehir', 'Bahçeşehir')
    .replace('Nisantasi', 'Nişantaşı')
    .replace('Mecidiyekoy', 'Mecidiyeköy')
    .replace('Eyupsultan', 'Eyüpsultan');
}

function buildSnippetForSlug(slug: string, title: string): string | null {
  const districtSlug = extractDistrictFromPricingSlug(slug);
  if (districtSlug) {
    const name = formatDistrictName(districtSlug);
    if (slug.includes('ev-temizligi-fiyatlari')) {
      return buildFeaturedSnippetBlock(
        `${name} ev temizliği fiyatları 2026 ne kadar?`,
        `${GEO_BRAND_NAME}, ${name} bölgesinde 2026 yılında 1+1 daire ev temizliği için yaklaşık 750–1.200 TL, 3+1 daireler için 1.400–2.000 TL tahmini aralık sunar; kesin fiyat ücretsiz keşif sonrası netleşir.`
      );
    }
    if (slug.includes('ofis-temizligi-fiyatlari')) {
      return buildFeaturedSnippetBlock(
        `${name} ofis temizliği fiyatları 2026 ne kadar?`,
        `${GEO_BRAND_NAME}, ${name} bölgesinde 2026 ofis temizliği için metrekareye göre yaklaşık 25–45 TL/m² tahmini birim fiyat sunar; küçük alanlarda minimum iş bedeli devreye girebilir.`
      );
    }
  }

  if (slug === 'ev-temizligi-fiyatlari-2026-istanbul') {
    return buildFeaturedSnippetBlock(
      'İstanbul ev temizliği fiyatları 2026 ne kadar?',
      `${GEO_BRAND_NAME}, İstanbul genelinde 2026 yılında 1+1 daire ev temizliği için yaklaşık 750–1.200 TL, 3+1 daireler için 1.400–2.000 TL tahmini aralık sunar; ilçe ve kapsama göre değişir.`
    );
  }

  if (title.toLowerCase().includes('fiyat') && slug.includes('2026')) {
    return buildFeaturedSnippetBlock(
      title.replace(/\s*\|.*$/, '').trim(),
      `${GEO_BRAND_NAME}, İstanbul genelinde profesyonel temizlik hizmetleri için 2026 güncel tahmini fiyat aralıkları sunar; kesin teklif ücretsiz keşif veya online fiyat hesaplama aracı ile alınır.`
    );
  }

  return null;
}

export function injectFeaturedSnippetIfMissing(
  slug: string,
  title: string,
  content: string
): string {
  if (content.includes(FEATURED_SNIPPET_MARKER)) return content;

  const block = buildSnippetForSlug(slug, title);
  if (!block) return content;

  if (content.includes('class="geo-tldr"')) {
    return content.replace(
      /(<aside class="geo-tldr"[\s\S]*?<\/aside>)/i,
      `$1\n${block}`
    );
  }

  return `${block}\n${content}`;
}
