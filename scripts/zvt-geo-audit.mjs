#!/usr/bin/env node
/**
 * ZVT GEO/AEO smoke — zvt-geo-audit skill yardımcısı.
 * robots AI bot allow, llms/NAP fetch, sample money citability.
 * llms.txt ≠ Google ranking faktörü.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { BASE, auditHtml } from './lib/zvt-seo-audit-core.mjs';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
  })
);
const OUT = args.out ? resolve(String(args.out)) : null;

const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'PerplexityBot',
  'Google-Extended',
  'Bytespider',
  'anthropic-ai',
];

const SAMPLE_URLS = [
  `${BASE}/`,
  `${BASE}/bolgeler/sariyer`,
  `${BASE}/bolgeler/sariyer/ev-temizligi`,
  `${BASE}/hizmetler/ev-temizligi`,
  `${BASE}/llms.txt`,
  `${BASE}/llms-full.txt`,
  `${BASE}/identity.json`,
];

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'ZVT-GeoAudit/1.0' },
  });
  return { res, text: await res.text(), url: res.url };
}

function parseRobots(robots) {
  const findings = [];
  for (const bot of AI_BOTS) {
    const blockRe = new RegExp(`User-agent:\\s*${bot}[\\s\\S]*?(?=User-agent:|$)`, 'i');
    const block = robots.match(blockRe)?.[0] || '';
    if (!block) {
      findings.push({ sev: 'Info', code: 'bot_no_rule', msg: `${bot}: özel kural yok (global *)` });
      continue;
    }
    if (/Disallow:\s*\/\s*$/m.test(block) && !/Allow:\s*\//i.test(block)) {
      findings.push({ sev: 'High', code: 'bot_blocked', msg: `${bot}: sitewide Disallow` });
    } else {
      findings.push({ sev: 'Info', code: 'bot_ok', msg: `${bot}: kural var` });
    }
  }
  if (/Disallow:.*\/admin/i.test(robots) === false) {
    findings.push({ sev: 'Medium', code: 'admin_robots', msg: 'admin Disallow belirsiz' });
  }
  return findings;
}

function checkLlms(text, label) {
  const findings = [];
  if (!text || text.length < 40) {
    findings.push({ sev: 'High', code: 'llms_empty', msg: `${label} boş/kısa` });
    return findings;
  }
  if (!/Zümrüt Vadi Temizlik|Zumrut Vadi/i.test(text)) {
    findings.push({ sev: 'Medium', code: 'llms_brand', msg: `${label}: marka adı zayıf` });
  }
  if (!/(?:\+90\s*)?0551[\s.-]*925[\s.-]*09[\s.-]*43|\+90\s*551[\s.-]*925[\s.-]*09[\s.-]*43|\+905519250943/i.test(text)) {
    findings.push({ sev: 'High', code: 'llms_phone', msg: `${label}: telefon NAP uyumsuz/eksik` });
  }
  if (!/Ferahevler|Şen Aydın|Sen Aydin|Sarıyer|Sariyer/i.test(text)) {
    findings.push({ sev: 'Medium', code: 'llms_address', msg: `${label}: adres sinyali zayıf` });
  }
  if (/peyzaj|landscape architect/i.test(text)) {
    findings.push({ sev: 'High', code: 'llms_peyzaj', msg: `${label}: peyzaj iddiası (yasak)` });
  }
  return findings;
}

function citability(html, url) {
  const findings = [];
  const hasFaq = /<h2[^>]*>[\s\S]{0,80}\?/i.test(html) || /itemprop=["']acceptedAnswer/i.test(html);
  const hasTldr = /TL;?DR|Özet|Kısa cevap|GeoExtract/i.test(html);
  if (!hasTldr && /\/bolgeler\//i.test(url)) {
    findings.push({ sev: 'Low', code: 'citability_tldr', msg: 'TL;DR / özet zayıf' });
  }
  if (!hasFaq && /\/(bolgeler|hizmetler|sss)\//i.test(url)) {
    findings.push({ sev: 'Info', code: 'citability_faq', msg: 'Soru-cevap H2 seyrek (Info)' });
  }
  return findings;
}

async function main() {
  const all = [];
  const robots = await fetchText(`${BASE}/robots.txt`);
  all.push(...parseRobots(robots.text).map((f) => ({ ...f, url: `${BASE}/robots.txt` })));

  for (const url of SAMPLE_URLS) {
    try {
      const { res, text } = await fetchText(url);
      if (url.endsWith('.txt') || url.endsWith('.json')) {
        if (url.includes('llms')) all.push(...checkLlms(text, url).map((f) => ({ ...f, url })));
        else if (!res.ok) all.push({ sev: 'Medium', code: 'identity_http', msg: `HTTP ${res.status}`, url });
        continue;
      }
      const row = auditHtml(url, res.status, text, res.headers);
      all.push(...row.findings.map((f) => ({ ...f, url })));
      all.push(...citability(text, url).map((f) => ({ ...f, url })));
    } catch (e) {
      all.push({ sev: 'High', code: 'fetch_fail', msg: e.message, url });
    }
  }

  const bySev = { High: 0, Medium: 0, Low: 0, Info: 0 };
  for (const f of all) bySev[f.sev] = (bySev[f.sev] || 0) + 1;

  console.log('=== GEO AUDIT SUMMARY ===');
  console.log(bySev);
  console.log('Not: llms.txt Google ranking faktörü değil; citability garanti yok.');
  console.log('=== FINDINGS ===');
  for (const f of all.filter((x) => x.sev !== 'Info').slice(0, 50)) {
    console.log(`[${f.sev}] ${f.code} | ${f.url} | ${f.msg}`);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    note: 'llms.txt is not a Google ranking factor; AI Overview citation not guaranteed',
    bySev,
    findings: all,
  };
  if (OUT) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, JSON.stringify(report, null, 2), 'utf8');
    console.log(`Wrote ${OUT}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
