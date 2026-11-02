/**
 * SEO / local env anahtarlarının varlığını kontrol eder — değerleri yazdırmaz.
 * Kullanım: npx tsx scripts/verify-seo-env.ts
 * Vercel: MCP filter_project_envs (decrypt=false) ile çapraz kontrol.
 */
import fs from 'node:fs';
import path from 'node:path';

type Tier = 'critical' | 'high' | 'recommended';

const KEYS: Array<{ key: string; tier: Tier; note: string }> = [
  { key: 'INDEXNOW_KEY', tier: 'high', note: 'Bing/Yandex IndexNow (Google ping değil)' },
  { key: 'CRON_SECRET', tier: 'critical', note: 'Autopilot + maps-sync cron' },
  { key: 'DATABASE_URL', tier: 'critical', note: 'Prisma' },
  { key: 'NEXTAUTH_SECRET', tier: 'critical', note: 'Admin auth' },
  { key: 'NEXT_PUBLIC_SITE_URL', tier: 'high', note: 'Canonical / schema' },
  { key: 'NEXT_PUBLIC_GBP_URL', tier: 'high', note: 'sameAs + harita CTA' },
  { key: 'NEXT_PUBLIC_GBP_PLACE_ID', tier: 'high', note: 'Yorum deep-link' },
  { key: 'NEXT_PUBLIC_BUSINESS_LAT', tier: 'recommended', note: 'Geo pin override' },
  { key: 'NEXT_PUBLIC_BUSINESS_LNG', tier: 'recommended', note: 'Geo pin override' },
  { key: 'MAPS_GOOGLE_CLIENT_ID', tier: 'high', note: 'Maps sync OAuth' },
  { key: 'MAPS_GOOGLE_CLIENT_SECRET', tier: 'high', note: 'Maps sync OAuth' },
  { key: 'MAPS_OAUTH_SECRET', tier: 'recommended', note: 'Maps token seal' },
  { key: 'GSC_SERVICE_ACCOUNT_JSON', tier: 'high', note: 'GSC (tek JSON veya EMAIL+KEY)' },
  { key: 'GSC_SERVICE_ACCOUNT_EMAIL', tier: 'recommended', note: 'GSC alternatif' },
  { key: 'GSC_PRIVATE_KEY', tier: 'recommended', note: 'GSC alternatif' },
  { key: 'GSC_SITE_URL', tier: 'recommended', note: 'GSC property' },
  { key: 'NEXT_PUBLIC_BING_PLACES_URL', tier: 'recommended', note: 'Citation tracker' },
  { key: 'NEXT_PUBLIC_APPLE_MAPS_URL', tier: 'recommended', note: 'Citation tracker' },
  { key: 'NEXT_PUBLIC_YANDEX_BUSINESS_URL', tier: 'recommended', note: 'Citation opsiyonel' },
  { key: 'BLOB_READ_WRITE_TOKEN', tier: 'recommended', note: 'Medya upload' },
];

function parseEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) out[key] = value;
  }
  return out;
}

function isSet(v: string | undefined): boolean {
  return Boolean(v && v.trim().length > 0);
}

function main() {
  const root = process.cwd();
  const fileEnv = {
    ...parseEnvFile(path.join(root, '.env')),
    ...parseEnvFile(path.join(root, '.env.local')),
  };

  const gscJson = isSet(fileEnv.GSC_SERVICE_ACCOUNT_JSON) || isSet(process.env.GSC_SERVICE_ACCOUNT_JSON);
  const gscPair =
    (isSet(fileEnv.GSC_SERVICE_ACCOUNT_EMAIL) || isSet(process.env.GSC_SERVICE_ACCOUNT_EMAIL)) &&
    (isSet(fileEnv.GSC_PRIVATE_KEY) || isSet(process.env.GSC_PRIVATE_KEY));

  console.log('SEO env presence (values hidden)\n');

  let missingCritical = 0;
  let missingHigh = 0;

  for (const row of KEYS) {
    const present = isSet(fileEnv[row.key]) || isSet(process.env[row.key]);
    const mark = present ? 'OK' : 'MISSING';
    if (!present && row.tier === 'critical') missingCritical += 1;
    if (!present && row.tier === 'high') missingHigh += 1;
    console.log(`[${mark}] ${row.tier.padEnd(12)} ${row.key} — ${row.note}`);
  }

  console.log(
    `\nGSC usable: ${gscJson || gscPair ? 'yes' : 'no'} (JSON veya EMAIL+PRIVATE_KEY)`
  );
  console.log(
    [
      '',
      'Vercel prod (2026-11-02 MCP, decrypt=false, key names only):',
      '  present: INDEXNOW_KEY, CRON_SECRET, NEXT_PUBLIC_GBP_*, NEXT_PUBLIC_BUSINESS_LAT/LNG, DATABASE_URL, NEXTAUTH_*',
      '  not in project env list: GSC_*, MAPS_GOOGLE_*, NEXT_PUBLIC_BING/APPLE/YANDEX URLs',
      '  note: MAPS_* may exist locally but still missing on Vercel — sync intentionally',
      '  action: add GSC + Maps OAuth + Bing/Apple listing URLs in Vercel; Admin GEO citation tracker',
    ].join('\n')
  );

  if (missingCritical > 0) {
    console.error(`\nFail: ${missingCritical} critical key(s) missing in local process/.env`);
    process.exit(1);
  }
  if (missingHigh > 0) {
    console.warn(`\nWarn: ${missingHigh} high-priority key(s) missing locally (prod may differ)`);
  } else {
    console.log('\nLocal critical+high keys look complete (or inherited).');
  }
}

main();
