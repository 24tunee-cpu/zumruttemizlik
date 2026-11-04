#!/usr/bin/env node
/**
 * ZVT sitewide SEO crawl — sitemap → her URL teknik/on-page/schema smoke.
 * Kullanım:
 *   node scripts/zvt-site-seo-crawl.mjs
 *   node scripts/zvt-site-seo-crawl.mjs --limit=50 --out=docs/seo-crawl-latest.json
 *   node scripts/zvt-site-seo-crawl.mjs --urls=https://…,/bolgeler/sariyer --out=-
 * AGENTS: uydurma ranking yok; AggregateRating bulgusu High.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { BASE, auditHtml } from './lib/zvt-seo-audit-core.mjs';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
  })
);
const LIMIT = args.limit ? Number(args.limit) : Infinity;
const OUT = args.out === '-' ? '-' : args.out ? resolve(String(args.out)) : null;
const DELAY_MS = Number(args.delay || 180);
const quiet = OUT === '-' || args.quiet;

const SITEMAPS = [
  `${BASE}/sitemap.xml`,
  `${BASE}/bolgeler/sitemap.xml`,
  `${BASE}/cozumler/sitemap.xml`,
  `${BASE}/blog/sitemap.xml`,
  `${BASE}/geo-sss/sitemap.xml`,
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'ZVT-SiteSeoCrawl/1.0 (+local-audit)' },
  });
  const text = await res.text();
  return { res, text, finalUrl: res.url };
}

function extractLocs(xml) {
  const locs = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml))) locs.push(m[1].trim());
  return locs;
}

function normalizeUrl(u) {
  if (!u) return null;
  if (u.startsWith('http')) return u.split('#')[0];
  if (u.startsWith('/')) return `${BASE}${u}`.split('#')[0];
  return `${BASE}/${u}`.split('#')[0];
}

async function collectFromSitemaps() {
  const urlSet = new Set();
  for (const sm of SITEMAPS) {
    try {
      const { res, text } = await fetchText(sm);
      if (!res.ok) {
        if (!quiet) console.warn(`sitemap skip ${sm} HTTP ${res.status}`);
        continue;
      }
      for (const loc of extractLocs(text)) {
        if (loc.startsWith('http') && loc.includes('zumrutvaditemizlik.com')) {
          urlSet.add(loc.split('#')[0]);
        }
      }
      for (const loc of extractLocs(text)) {
        if (loc.endsWith('.xml') && loc.includes('sitemap')) {
          try {
            const nested = await fetchText(loc);
            if (nested.res.ok) {
              for (const u of extractLocs(nested.text)) {
                if (u.startsWith('http') && !u.endsWith('.xml')) urlSet.add(u.split('#')[0]);
              }
            }
          } catch {
            /* ignore */
          }
        }
      }
    } catch (e) {
      if (!quiet) console.warn(`sitemap fail ${sm}`, e.message);
    }
  }
  return urlSet;
}

async function main() {
  let urls;
  if (args.urls) {
    urls = String(args.urls)
      .split(',')
      .map((u) => normalizeUrl(u.trim()))
      .filter(Boolean);
  } else {
    const urlSet = await collectFromSitemaps();
    urls = [...urlSet].sort();
    if (Number.isFinite(LIMIT)) urls = urls.slice(0, LIMIT);
  }

  if (!quiet) console.log(`URLs to audit: ${urls.length}`);

  const pages = [];
  const titleMap = new Map();

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    if (!quiet) process.stdout.write(`\r[${i + 1}/${urls.length}] ${url.slice(0, 80)}…`);
    try {
      const { res, text } = await fetchText(url);
      const row = auditHtml(url, res.status, text, res.headers);
      pages.push(row);
      if (row.title) {
        const k = row.title.toLowerCase();
        if (!titleMap.has(k)) titleMap.set(k, []);
        titleMap.get(k).push(url);
      }
    } catch (e) {
      pages.push({
        url,
        status: 0,
        title: '',
        description: '',
        canonical: '',
        h1: '',
        h1Count: 0,
        noindex: false,
        textLen: 0,
        findings: [{ sev: 'High', code: 'fetch_fail', msg: e.message }],
      });
    }
    await sleep(DELAY_MS);
  }
  if (!quiet) console.log('\n');

  for (const [, list] of titleMap) {
    if (list.length < 2) continue;
    for (const url of list) {
      const page = pages.find((p) => p.url === url);
      if (page) {
        page.findings.push({
          sev: 'High',
          code: 'duplicate_title',
          msg: `Aynı title ×${list.length}`,
        });
      }
    }
  }

  const flat = pages.flatMap((p) => p.findings.map((f) => ({ ...f, url: p.url })));
  const bySev = { High: 0, Medium: 0, Low: 0, Info: 0 };
  for (const f of flat) bySev[f.sev] = (bySev[f.sev] || 0) + 1;

  const top = flat.filter((f) => f.sev === 'High' || f.sev === 'Medium').slice(0, 40);

  if (!quiet) {
    console.log('=== SUMMARY ===');
    console.log(`pages=${pages.length} findings=${flat.length}`, bySev);
    console.log('=== TOP ISSUES ===');
    for (const f of top) {
      console.log(`[${f.sev}] ${f.code} | ${f.url} | ${f.msg}`);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    pageCount: pages.length,
    bySev,
    top,
    pages,
  };

  const json = JSON.stringify(report, null, 2);
  if (OUT === '-') {
    process.stdout.write(json + '\n');
  } else if (OUT) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, json, 'utf8');
    if (!quiet) console.log(`Wrote ${OUT}`);
  }
}

// Avoid unused import lint noise in some runners
void fileURLToPath;
void pathToFileURL;

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
