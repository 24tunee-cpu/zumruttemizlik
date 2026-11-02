/**
 * Merkezi feed üretici — RSS 2.0, Atom 1.0, JSON Feed 1.1
 * Keşif kanalı (Google recent URLs); AI cite sihri değil.
 * WebSub hub linkleri: Google recent-URL push keşfi.
 */
import { prisma } from '@/lib/prisma';
import { SITE_CONTACT } from '@/config/site-contact';
import { getSiteUrl } from '@/lib/seo';
import { WEBSUB_HUB_URL, buildWebSubLinkHeader } from '@/lib/websub';

export const FEED_ITEM_LIMIT = 30;
export const FEED_REVALIDATE_SEC = 3600;

export type FeedPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string | null;
  category: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
};

export function escapeXml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

export function stripHtml(html: string, max = 500): string {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** CDATA içi güvenli metin */
export function cdata(text: string): string {
  return `<![CDATA[${text.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

export function formatRfc822(date: Date): string {
  return date.toUTCString();
}

export function formatRfc3339(date: Date): string {
  return date.toISOString();
}

function absoluteUrl(base: string, pathOrUrl: string | null | undefined): string | undefined {
  if (!pathOrUrl?.trim()) return undefined;
  const t = pathOrUrl.trim();
  if (/^https?:\/\//i.test(t)) return t;
  return `${base}${t.startsWith('/') ? t : `/${t}`}`;
}

export async function fetchFeedPosts(limit = FEED_ITEM_LIMIT): Promise<FeedPost[]> {
  const rows = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ updatedAt: 'desc' }],
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      image: true,
      category: true,
      author: true,
      createdAt: true,
      updatedAt: true,
      scheduledPublishAt: true,
    },
  });

  return rows.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    content: p.content,
    excerpt: p.excerpt,
    image: p.image,
    category: p.category,
    author: p.author || SITE_CONTACT.companyName,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    publishedAt: p.scheduledPublishAt && p.scheduledPublishAt <= new Date()
      ? p.scheduledPublishAt
      : p.createdAt,
  }));
}

function channelMeta(base: string) {
  return {
    base,
    title: SITE_CONTACT.companyName,
    description:
      "İstanbul Avrupa Yakası ağırlıklı profesyonel temizlik: ev, ofis, inşaat sonrası. Sarıyer ve Zekeriyaköy öncelikli.",
    language: 'tr-TR',
    email: SITE_CONTACT.email,
    logo: `${base}/logo.png`,
    blogUrl: `${base}/blog`,
    rssUrl: `${base}/feed.xml`,
    atomUrl: `${base}/atom.xml`,
    jsonUrl: `${base}/feed.json`,
  };
}

export function buildRssXml(posts: FeedPost[]): string {
  const base = getSiteUrl();
  const m = channelMeta(base);
  const now = new Date();
  const newest = posts[0]?.updatedAt ?? now;

  const items = posts
    .map((post) => {
      const url = `${base}/blog/${post.slug}`;
      const summary = post.excerpt?.trim() || stripHtml(post.content, 400);
      const htmlBody = post.excerpt?.trim()
        ? `<p>${escapeXml(post.excerpt)}</p><p><a href="${url}">Devamını oku</a></p>`
        : `<p>${escapeXml(stripHtml(post.content, 800))}</p><p><a href="${url}">Devamını oku</a></p>`;
      const img = absoluteUrl(base, post.image);

      return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${formatRfc822(post.publishedAt)}</pubDate>
    <dc:creator>${escapeXml(post.author)}</dc:creator>
    <category>${escapeXml(post.category)}</category>
    <description>${escapeXml(summary)}</description>
    <content:encoded>${cdata(htmlBody)}</content:encoded>
    ${img ? `<enclosure url="${escapeXml(img)}" type="image/jpeg" length="0" />` : ''}
  </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/"
>
  <channel>
    <title>${escapeXml(m.title)}</title>
    <link>${m.blogUrl}</link>
    <description>${escapeXml(m.description)}</description>
    <language>${m.language}</language>
    <lastBuildDate>${formatRfc822(newest)}</lastBuildDate>
    <pubDate>${formatRfc822(newest)}</pubDate>
    <ttl>60</ttl>
    <generator>Zümrüt Vadi Temizlik Feeds</generator>
    <copyright>© ${now.getFullYear()} ${escapeXml(m.title)}</copyright>
    <managingEditor>${escapeXml(m.email)} (${escapeXml(m.title)})</managingEditor>
    <webMaster>${escapeXml(m.email)} (${escapeXml(m.title)})</webMaster>
    <atom:link href="${m.rssUrl}" rel="self" type="application/rss+xml" />
    <atom:link href="${m.atomUrl}" rel="alternate" type="application/atom+xml" />
    <atom:link href="${WEBSUB_HUB_URL}" rel="hub" />
    <image>
      <url>${m.logo}</url>
      <title>${escapeXml(m.title)}</title>
      <link>${m.blogUrl}</link>
    </image>
${items}
  </channel>
</rss>`;
}

export function buildAtomXml(posts: FeedPost[]): string {
  const base = getSiteUrl();
  const m = channelMeta(base);
  const newest = posts[0]?.updatedAt ?? new Date();

  const entries = posts
    .map((post) => {
      const url = `${base}/blog/${post.slug}`;
      const summary = post.excerpt?.trim() || stripHtml(post.content, 400);
      const htmlBody = `<p>${escapeXml(summary)}</p><p><a href="${url}">Devamını oku → ${escapeXml(post.title)}</a></p>`;
      const img = absoluteUrl(base, post.image);

      return `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${url}" rel="alternate" type="text/html" />
    <id>${url}</id>
    <published>${formatRfc3339(post.publishedAt)}</published>
    <updated>${formatRfc3339(post.updatedAt)}</updated>
    <author><name>${escapeXml(post.author)}</name><email>${escapeXml(m.email)}</email></author>
    <category term="${escapeXml(post.category)}" />
    <summary type="text">${escapeXml(summary)}</summary>
    <content type="html">${cdata(htmlBody)}</content>
    ${img ? `<link rel="enclosure" href="${escapeXml(img)}" type="image/jpeg" />` : ''}
  </entry>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(m.title)}</title>
  <subtitle>${escapeXml(m.description)}</subtitle>
  <link href="${m.atomUrl}" rel="self" type="application/atom+xml" />
  <link href="${m.blogUrl}" rel="alternate" type="text/html" />
  <link href="${m.rssUrl}" rel="alternate" type="application/rss+xml" />
  <link href="${WEBSUB_HUB_URL}" rel="hub" />
  <id>${m.blogUrl}/</id>
  <updated>${formatRfc3339(newest)}</updated>
  <author>
    <name>${escapeXml(m.title)}</name>
    <email>${escapeXml(m.email)}</email>
    <uri>${base}/</uri>
  </author>
  <icon>${m.logo}</icon>
  <logo>${m.logo}</logo>
  <rights>© ${new Date().getFullYear()} ${escapeXml(m.title)}</rights>
  <generator uri="${base}/">Zümrüt Vadi Temizlik Feeds</generator>
${entries}
</feed>`;
}

export function buildJsonFeed(posts: FeedPost[]): object {
  const base = getSiteUrl();
  const m = channelMeta(base);

  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: m.title,
    home_page_url: m.blogUrl,
    feed_url: m.jsonUrl,
    description: m.description,
    language: 'tr-TR',
    favicon: `${base}/favicon.ico`,
    icon: m.logo,
    authors: [
      {
        name: m.title,
        url: base,
        email: m.email,
      },
    ],
    items: posts.map((post) => {
      const url = `${base}/blog/${post.slug}`;
      const summary = post.excerpt?.trim() || stripHtml(post.content, 400);
      const img = absoluteUrl(base, post.image);
      return {
        id: url,
        url,
        title: post.title,
        summary,
        content_text: summary,
        content_html: `<p>${escapeXml(summary)}</p><p><a href="${url}">Devamını oku</a></p>`,
        date_published: formatRfc3339(post.publishedAt),
        date_modified: formatRfc3339(post.updatedAt),
        authors: [{ name: post.author }],
        tags: post.category ? [post.category] : [],
        ...(img ? { image: img, banner_image: img } : {}),
      };
    }),
  };
}

function feedCacheControl(): string {
  return `public, s-maxage=${FEED_REVALIDATE_SEC}, stale-while-revalidate=86400`;
}

/** Content-Type + Cache-Control + WebSub Link (RSS/Atom) */
export function feedResponseHeaders(
  kind: 'rss' | 'atom' | 'json'
): Record<string, string> {
  const base = getSiteUrl().replace(/\/$/, '');
  if (kind === 'rss') {
    return {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': feedCacheControl(),
      Link: buildWebSubLinkHeader(`${base}/feed.xml`),
    };
  }
  if (kind === 'atom') {
    return {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': feedCacheControl(),
      Link: buildWebSubLinkHeader(`${base}/atom.xml`),
    };
  }
  return {
    'Content-Type': 'application/feed+json; charset=utf-8',
    'Cache-Control': feedCacheControl(),
  };
}


export function emptyFeedFallback(kind: 'rss' | 'atom'): string {
  const base = getSiteUrl();
  if (kind === 'atom') {
    return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_CONTACT.companyName)}</title>
  <link href="${base}/atom.xml" rel="self" type="application/atom+xml" />
  <link href="${WEBSUB_HUB_URL}" rel="hub" />
  <id>${base}/blog/</id>
  <updated>${formatRfc3339(new Date())}</updated>
</feed>`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
  <title>${escapeXml(SITE_CONTACT.companyName)}</title>
  <link>${base}/blog</link>
  <description>Feed geçici olarak kullanılamıyor</description>
  <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
  <atom:link href="${WEBSUB_HUB_URL}" rel="hub" />
</channel></rss>`;
}
