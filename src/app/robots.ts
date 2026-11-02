import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

/**
 * Dinamik robots.txt — ortam URL’si ve sitemap adresi `getSiteUrl()` ile uyumludur.
 * Not: Crawl-delay Google tarafından yok sayılır (zararsız gürültü); Bing vb. için tutulur.
 * IndexNow anahtarı yoksa autopilot uyarı verir — robots bunu engellemez.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const disallow = ['/admin/', '/api/', '/login', '/blog?', '/fiyat-hesaplama?', '/iletisim?'];
  const indexNowConfigured = Boolean(process.env.INDEXNOW_KEY?.trim());
  if (!indexNowConfigured && process.env.VERCEL_ENV === 'production') {
    console.warn(
      '[robots] INDEXNOW_KEY production’da tanımlı değil — Bing/Yandex ping atlanır (P1 doğrulama)'
    );
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0.5,
      },
      {
        userAgent: ['Bingbot', 'Slurp', 'DuckDuckBot'],
        allow: '/',
        crawlDelay: 1,
      },
      {
        // GEO/AEO: AI crawler’lar public içeriğe erişebilir (admin/api hariç)
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'PerplexityBot',
          'Applebot-Extended',
          'Bytespider',
          'CCBot',
          'meta-externalagent',
        ],
        allow: '/',
        disallow,
        crawlDelay: 2,
      },
    ],
    sitemap: [
      `${base}/sitemap.xml`,
      `${base}/cozumler/sitemap.xml`,
      `${base}/bolgeler/sitemap.xml`,
      `${base}/blog/sitemap.xml`,
      `${base}/geo-sss/sitemap.xml`,
      `${base}/galeri/sitemap.xml`,
      // Google: RSS/Atom recent-URL keşfi (tam sitemap yerine değil, ek kanal)
      `${base}/feed.xml`,
      `${base}/atom.xml`,
    ],
    host: base,
  };
}
