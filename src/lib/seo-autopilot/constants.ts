/** Günlük autopilot limitleri — Vercel 60s timeout içinde kalır */
export const AUTOPILOT_LIMITS = {
  geoSssPublish: 3,
  gscBlogDraft: 2,
  blogRefresh: 2,
  comparisonPublish: 1,
  testimonialSync: 2,
  metaAbUpdates: 8,
  indexNowMaxUrls: 50,
} as const;

export const AUTOPILOT_TAGS = {
  gscBlog: 'autopilot gsc',
  seasonal: 'autopilot mevsim',
  comparison: 'otomatik yayın karşılaştırma',
  refresh: 'autopilot refresh',
} as const;

/** v4+v5 bittikten sonra karşılaştırma kuyruğu (6 Eyl 2026) */
export const COMPARISON_SCHEDULE_ANCHOR_ISO = '2026-09-06T00:00:00.000Z';

/** Yeni geo-sss drip başlangıcı */
export const GEO_SSS_DRIP_ANCHOR_ISO = '2026-08-17T00:00:00.000Z';

export const GEO_SSS_PUBLISH_PER_DAY = 3;
