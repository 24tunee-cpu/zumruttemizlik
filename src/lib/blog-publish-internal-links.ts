/**
 * Blog yayın anında deterministik iç link zenginleştirmesi.
 * Math.random() kullanan render-time linker'dan bağımsız; idempotent.
 */
import type { PrismaClient } from '@prisma/client';
import { V2_DISTRICTS } from '@/lib/seed-blog-v2-content';

export const AUTO_INTERNAL_LINKS_MARKER = 'data-auto-internal-links="v1"';

export type InternalLinkItem = { href: string; label: string };

const DISTRICTS_BY_SLUG_LENGTH = [...V2_DISTRICTS].sort(
  (a, b) => b.slug.length - a.slug.length
);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function hasAutoInternalLinks(content: string): boolean {
  return content.includes(AUTO_INTERNAL_LINKS_MARKER);
}

export function extractDistrictFromSlug(slug: string): { slug: string; name: string } | null {
  for (const d of DISTRICTS_BY_SLUG_LENGTH) {
    if (slug === d.slug || slug.startsWith(`${d.slug}-`)) {
      return d;
    }
  }
  return null;
}

function siblingSlugs(districtSlug: string, currentSlug: string): string[] {
  const suffixes = [
    'ev-temizligi-fiyatlari-2026',
    'ofis-temizligi-fiyatlari-2026',
    'kira-teslim-temizlik-rehberi-2026',
    'profesyonel-temizlik-firma-secimi-rehberi-2026',
  ];
  return suffixes
    .map((s) => `${districtSlug}-${s}`)
    .filter((s) => s !== currentSlug);
}

function topicLinks(slug: string, district: { slug: string; name: string }): InternalLinkItem[] {
  const { slug: dSlug, name } = district;
  const links: InternalLinkItem[] = [
    { href: `/bolgeler/${dSlug}`, label: `${name} temizlik hizmetleri` },
    { href: '/fiyat-hesaplama', label: 'Online fiyat hesaplama' },
    { href: '/randevu', label: 'Ücretsiz keşif randevusu' },
  ];

  if (slug.includes('ev-temizligi-fiyatlari')) {
    links.push(
      { href: '/hizmetler/ev-temizligi', label: 'Ev temizliği hizmeti' },
      {
        href: `/geo-sss/${dSlug}-ev-temizligi-fiyati-2026`,
        label: `${name} ev temizliği SSS`,
      }
    );
  } else if (slug.includes('ofis-temizligi-fiyatlari')) {
    links.push(
      { href: '/hizmetler/ofis-temizligi', label: 'Ofis temizliği hizmeti' },
      {
        href: `/geo-sss/${dSlug}-guvenilir-firma-2026`,
        label: `${name} güvenilir firma SSS`,
      }
    );
  } else if (slug.includes('kira-teslim-temizlik-rehberi')) {
    links.push(
      { href: '/cozumler/kira-teslim-temizligi', label: 'Kira teslim temizliği çözümü' },
      {
        href: `/geo-sss/${dSlug}-kira-teslim-suresi-2026`,
        label: `${name} kira teslim süresi SSS`,
      },
      {
        href: `/blog/${dSlug}-ev-temizligi-fiyatlari-2026`,
        label: `${name} ev temizliği fiyat rehberi`,
      }
    );
  } else if (slug.includes('profesyonel-temizlik-firma-secimi')) {
    links.push(
      { href: '/hakkimizda', label: 'Zümrüt Vadi Temizlik hakkında' },
      {
        href: `/geo-sss/${dSlug}-guvenilir-firma-2026`,
        label: `${name} firma seçimi SSS`,
      },
      {
        href: `/blog/${dSlug}-ev-temizligi-fiyatlari-2026`,
        label: `${name} fiyat karşılaştırma rehberi`,
      }
    );
  }

  return dedupeLinks(links);
}

function dedupeLinks(links: InternalLinkItem[]): InternalLinkItem[] {
  const seen = new Set<string>();
  return links.filter((l) => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
}

function buildLinksSection(links: InternalLinkItem[]): string {
  const items = links
    .map(
      (l) =>
        `<li><a href="${l.href}" class="text-emerald-400 hover:text-emerald-300 underline">${escapeHtml(l.label)}</a></li>`
    )
    .join('\n');

  return `<section class="auto-internal-links mt-10 border-t border-white/10 pt-8" ${AUTO_INTERNAL_LINKS_MARKER}>
<h2 class="text-xl font-semibold text-white mb-4">İlgili sayfalar</h2>
<ul class="space-y-2 list-disc pl-5 text-emerald-100/90">${items}</ul>
</section>`;
}

export async function fetchRelatedPublishedBlogLinks(
  prisma: PrismaClient,
  districtSlug: string,
  currentSlug: string,
  limit = 3
): Promise<InternalLinkItem[]> {
  const candidates = siblingSlugs(districtSlug, currentSlug);
  if (candidates.length === 0) return [];

  const published = await prisma.blogPost.findMany({
    where: {
      published: true,
      slug: { in: candidates },
    },
    select: { slug: true, title: true },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });

  return published.map((p) => ({ href: `/blog/${p.slug}`, label: p.title }));
}

export function buildAutoInternalLinks(params: {
  slug: string;
  relatedBlogLinks?: InternalLinkItem[];
}): InternalLinkItem[] {
  const district = extractDistrictFromSlug(params.slug);
  if (!district) {
    return dedupeLinks([
      { href: '/fiyat-hesaplama', label: 'Online fiyat hesaplama' },
      { href: '/randevu', label: 'Ücretsiz keşif randevusu' },
      { href: '/blog', label: 'Tüm blog yazıları' },
    ]);
  }

  const core = topicLinks(params.slug, district);
  const related = params.relatedBlogLinks ?? [];
  return dedupeLinks([...core, ...related]).slice(0, 10);
}

export function appendAutoInternalLinksSection(
  content: string,
  links: InternalLinkItem[]
): string {
  if (hasAutoInternalLinks(content) || links.length === 0) {
    return content;
  }
  return `${content.trim()}\n${buildLinksSection(links)}`;
}

export async function enrichBlogContentWithInternalLinks(
  prisma: PrismaClient,
  post: { slug: string; content: string }
): Promise<{ content: string; linksAdded: number }> {
  if (hasAutoInternalLinks(post.content)) {
    return { content: post.content, linksAdded: 0 };
  }

  const district = extractDistrictFromSlug(post.slug);
  const relatedBlogLinks = district
    ? await fetchRelatedPublishedBlogLinks(prisma, district.slug, post.slug)
    : [];

  const links = buildAutoInternalLinks({ slug: post.slug, relatedBlogLinks });
  const content = appendAutoInternalLinksSection(post.content, links);

  return {
    content,
    linksAdded: content === post.content ? 0 : links.length,
  };
}
