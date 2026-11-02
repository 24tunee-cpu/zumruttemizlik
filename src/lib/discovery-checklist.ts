/**
 * GSC / keşif operasyon checklist — kod otomatik yapamaz; panel/ekip için.
 * Ranking garantisi yok.
 */
export const GSC_DISCOVERY_CHECKLIST = [
  {
    id: 'sitemaps-gsc',
    title: 'GSC → Sitemaps',
    detail:
      'sitemap.xml, bolgeler, cozumler, blog, geo-sss, galeri, feed.xml, atom.xml Success olmalı',
  },
  {
    id: 'url-inspection',
    title: 'URL Inspection (kota)',
    detail:
      'Kritik yeni URL (semt landing, yeni hizmet, önemli blog) için Request indexing — günde az sayıda',
  },
  {
    id: 'generative-ai',
    title: 'Search generative AI',
    detail: 'GSC ayarlarında Include (Exclude AIO’dan düşürür)',
  },
  {
    id: 'indexnow-key-live',
    title: 'IndexNow key canlı',
    detail:
      'https://www.zumrutvaditemizlik.com/{INDEXNOW_KEY}.txt açılmalı; Vercel INDEXNOW_KEY dolu',
  },
  {
    id: 'gbp-nap',
    title: 'GBP ↔ NAP',
    detail: 'Google Business Profile telefon/adres/web site-contact ile birebir',
  },
] as const;
