import {
  DISTRICT_LANDINGS,
  SERVICE_LANDINGS,
  NEIGHBORHOOD_LANDINGS,
} from '../src/config/programmatic-seo';
import { buildSmartMetaForPair } from '../src/lib/programmatic-smart-meta';
import { SERVICE_SEED_DATA } from '../src/lib/seed-services';
import { INTENT_LANDINGS } from '../src/config/intent-seo';
import { GEO_SSS_PAGES } from '../src/config/geo-district-faqs';

type Issue = { kind: string; path: string; detail: string; value: string };

const issues: Issue[] = [];

function check(kind: string, path: string, title: string, desc: string) {
  const t = title?.trim() || '';
  const d = desc?.trim() || '';
  if (!t) issues.push({ kind: 'empty-title', path, detail: kind, value: '' });
  if (!d) issues.push({ kind: 'empty-desc', path, detail: kind, value: '' });
  if (t.length > 60) issues.push({ kind: `title-long:${t.length}`, path, detail: kind, value: t });
  if (t.length > 0 && t.length < 28) issues.push({ kind: `title-short:${t.length}`, path, detail: kind, value: t });
  if (d.length > 160) issues.push({ kind: `desc-long:${d.length}`, path, detail: kind, value: d });
  if (d.length > 0 && d.length < 70) issues.push({ kind: `desc-short:${d.length}`, path, detail: kind, value: d });
  if (/[💰💵₺💸🏷️✅🏆⭐👑🔥🚀⚡📞📱🏃🛡️🔒✨💎🎯📍🏢🏠🏘️🌆]/.test(t + d)) {
    issues.push({ kind: 'emoji-meta', path, detail: kind, value: t.slice(0, 80) });
  }
}

for (const d of DISTRICT_LANDINGS) {
  const title = `${d.name} Temizlik Hizmetleri | İstanbul`;
  let desc =
    d.regionBlurb ||
    `${d.name} bölgesinde ofis temizliği, inşaat sonrası temizlik, koltuk yıkama ve daha fazlası için hızlı teklif alın.`;
  if (desc.length > 158) desc = `${desc.slice(0, 155).trimEnd()}…`;
  check('district-hub', `/bolgeler/${d.slug}`, title, desc);
}

for (const d of DISTRICT_LANDINGS) {
  for (const s of SERVICE_LANDINGS) {
    const m = buildSmartMetaForPair(d, s);
    check('pair', `/bolgeler/${d.slug}/${s.slug}`, m.title, m.description);
  }
}

for (const n of NEIGHBORHOOD_LANDINGS) {
  check('neighborhood', `/bolgeler/${n.districtSlug}/${n.slug}`, n.metaTitle, n.metaDescription);
}

for (const s of SERVICE_SEED_DATA) {
  check('service-seed', `/hizmetler/${s.slug}`, s.metaTitle || `${s.title} İstanbul`, s.metaDesc || s.shortDesc);
}

for (const i of INTENT_LANDINGS) {
  check('intent', `/cozumler/${i.slug}`, i.metaTitle || i.name, i.metaDescription || i.heroDescription?.slice(0, 160) || '');
}

for (const g of GEO_SSS_PAGES) {
  // Runtime clamp: title → "| Zümrüt Vadi" + ≤60; desc ≤158
  let title = `${g.title} | Zümrüt Vadi`;
  if (title.length > 60) title = `${title.slice(0, 59).trimEnd()}…`;
  let desc = g.directAnswer.replace(/\s+/g, ' ').trim();
  if (desc.length > 158) desc = `${desc.slice(0, 157).trimEnd()}…`;
  check('geo-sss', `/geo-sss/${g.slug}`, title, desc);
}

const byKind = new Map<string, number>();
for (const i of issues) byKind.set(i.kind.split(':')[0], (byKind.get(i.kind.split(':')[0]) || 0) + 1);

console.log('TOTAL', issues.length);
console.log('BY_KIND', Object.fromEntries(byKind));
console.log('\n--- SAMPLE ---');
for (const i of issues.slice(0, 35)) {
  console.log(`${i.kind} | ${i.path}\n  ${i.value.slice(0, 120)}\n`);
}
