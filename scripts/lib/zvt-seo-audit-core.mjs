/** Paylaşılan SEO HTML audit — zvt-page-audit / zvt-site-audit */

export const BASE = process.env.ZVT_SITE_URL || 'https://www.zumrutvaditemizlik.com';

export function decodeEntities(s) {
  return String(s || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
}

export function isMoneyUrl(url) {
  return (
    /\/(bolgeler|hizmetler|cozumler|randevu|fiyat|iletisim|hakkimizda|referanslar)(\/|$)/i.test(url) ||
    url.replace(/\/$/, '') === BASE
  );
}

export function auditHtml(url, status, html, headers) {
  const findings = [];
  const push = (sev, code, msg) => findings.push({ sev, code, msg });
  const hdr = headers && typeof headers.get === 'function' ? headers : new Headers(headers || {});

  if (status >= 400) push('High', 'http_error', `HTTP ${status}`);
  if (status >= 300 && status < 400) push('Info', 'redirect', `HTTP ${status}`);

  const robotsMeta = (html.match(/<meta[^>]+name=["']robots["'][^>]*>/i) || [])[0] || '';
  const xrobots = hdr.get('x-robots-tag') || '';
  const noindex = /noindex/i.test(robotsMeta) || /noindex/i.test(xrobots);
  const money = isMoneyUrl(url);
  if (noindex && money) push('High', 'noindex_money', 'Para/önemli path noindex');

  const titleRaw = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || '';
  const title = decodeEntities(titleRaw).replace(/\s+/g, ' ').trim();
  if (!title && status === 200) push('Medium', 'missing_title', 'Title yok');
  else if (title.length > 70) push('Low', 'title_long', `Title uzun (${title.length})`);
  else if (title && title.length < 15 && status === 200) push('Low', 'title_short', `Title kısa (${title.length})`);

  const descM =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i) ||
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i);
  const desc = decodeEntities(descM ? descM[1] : '').trim();
  if (!desc && status === 200) push('Medium', 'missing_meta_desc', 'Meta description yok');
  else if (desc && desc.length < 40 && status === 200) push('Low', 'meta_desc_short', `Meta desc kısa (${desc.length})`);
  else if (desc.length > 170) push('Low', 'meta_desc_long', `Meta desc uzun (${desc.length})`);

  const canonM =
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  const canonical = (canonM ? canonM[1] : '').trim();
  if (!canonical && status === 200) push('Medium', 'missing_canonical', 'Canonical yok');
  else if (canonical && !/zumrutvaditemizlik\.com/i.test(canonical)) {
    push('High', 'canonical_host', `Canonical host şüpheli: ${canonical}`);
  } else if (canonical) {
    try {
      const cu = new URL(canonical);
      const uu = new URL(url);
      if (cu.pathname.replace(/\/$/, '') !== uu.pathname.replace(/\/$/, '')) {
        push('Medium', 'canonical_mismatch', `Canonical path farklı: ${cu.pathname}`);
      }
    } catch {
      push('Medium', 'canonical_parse', 'Canonical parse edilemedi');
    }
  }

  const body = stripTags(html);
  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((x) =>
    decodeEntities(x[1].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()
  );
  if (h1s.length === 0 && status === 200) push('Medium', 'missing_h1', 'H1 yok');
  if (h1s.length > 1) push('Medium', 'multi_h1', `H1 sayısı=${h1s.length}`);

  if (/AggregateRating/i.test(html) || /"@type"\s*:\s*"AggregateRating"/i.test(html)) {
    push('High', 'aggregate_rating', 'AggregateRating JSON-LD (GSC risk)');
  }
  if (/"@type"\s*:\s*"Review"/i.test(html) && /reviewRating/i.test(html)) {
    push('Medium', 'review_schema', 'Review schema — self-serving kontrol et');
  }

  const hasLd = /application\/ld\+json/i.test(html);
  if (!hasLd && money && status === 200) push('Low', 'no_jsonld', 'JSON-LD yok (para sayfa)');

  const ogTitle = /property=["']og:title["']/i.test(html);
  if (!ogTitle && money && status === 200) push('Low', 'missing_og_title', 'og:title yok');

  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const missingAlt = imgs.filter((t) => !/\balt=/i.test(t)).length;
  if (missingAlt > 0 && money) push('Low', 'img_missing_alt', `${missingAlt} img alt yok`);

  if (money && status === 200) {
    const hasTel = /tel:\+?90|0551\s*925|whatsapp/i.test(html);
    if (!hasTel) push('Medium', 'missing_cta_signal', 'Tel/WA sinyali HTML’de zayıf');
  }

  // Soft-thin: çok kısa görünür metin
  const textLen = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
  if (status === 200 && textLen < 400 && /\/bolgeler\//i.test(url)) {
    push('Medium', 'thin_content', `Görünür metin kısa (~${textLen} karakter)`);
  }

  return {
    url,
    status,
    title,
    description: desc.slice(0, 180),
    canonical,
    h1: h1s[0] || '',
    h1Count: h1s.length,
    noindex,
    textLen,
    findings,
  };
}
