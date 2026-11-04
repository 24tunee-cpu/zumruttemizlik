#!/usr/bin/env node
/** Tek URL derin SEO smoke — zvt-page-audit skill yardımcısı */
import { BASE, auditHtml } from './lib/zvt-seo-audit-core.mjs';

const urlArg = process.argv[2];
if (!urlArg) {
  console.error('Usage: node scripts/zvt-page-seo-audit.mjs <url-or-path>');
  process.exit(1);
}

const target = urlArg.startsWith('http')
  ? urlArg
  : `${BASE}${urlArg.startsWith('/') ? urlArg : `/${urlArg}`}`;

const res = await fetch(target, {
  redirect: 'follow',
  headers: { 'User-Agent': 'ZVT-PageSeoAudit/1.0' },
});
const html = await res.text();
const row = auditHtml(res.url || target, res.status, html, res.headers);
console.log(JSON.stringify(row, null, 2));
process.exit(row.findings.some((f) => f.sev === 'High') ? 2 : 0);
