import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

/**
 * Dinamik robots.txt — ortam URL’si ve sitemap adresi `getSiteUrl()` ile uyumludur.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const disallow = ['/admin/', '/api/', '/login'];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
        crawlDelay: 1, // 1 saniye bekle - server'ı yormaz
      },
      {
        // Google için özel ayar - daha hızlı ama kontrollü
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0.5, // 500ms - Google için optimize
      },
      {
        // Diğer major botlar
        userAgent: ['Bingbot', 'Slurp', 'DuckDuckBot'],
        allow: '/',
        crawlDelay: 1,
      },
      {
        // GEO: AI crawler'lar tüm public içeriğe erişebilir (admin/api hariç)
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'PerplexityBot',
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
    ],
    host: base,
  };
}
