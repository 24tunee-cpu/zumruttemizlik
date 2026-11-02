/**
 * Local .env(.local) → Vercel production (MAPS_* only).
 * Değerleri yazdırmaz. Önkoşul: `npx vercel login` veya VERCEL_TOKEN.
 *
 *   node scripts/sync-maps-env-to-vercel.mjs
 */
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const PROJECT = 'zumruttemizlik';
const KEYS = ['MAPS_GOOGLE_CLIENT_ID', 'MAPS_GOOGLE_CLIENT_SECRET', 'MAPS_OAUTH_SECRET'];

function load(p) {
  if (!fs.existsSync(p)) return {};
  const o = {};
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const i = t.indexOf('=');
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    o[k] = v;
  }
  return o;
}

const env = { ...load('.env'), ...load('.env.local') };

for (const key of KEYS) {
  const value = env[key]?.trim();
  if (!value) {
    console.log(`[skip] ${key} missing locally`);
    continue;
  }
  const r = spawnSync(
    'npx',
    ['vercel', 'env', 'add', key, 'production', '--force', '--project', PROJECT, '--yes'],
    {
      input: value,
      encoding: 'utf8',
      shell: true,
      env: process.env,
    }
  );
  if (r.status === 0) {
    console.log(`[ok] ${key} → production (len=${value.length})`);
  } else {
    console.log(`[fail] ${key} exit=${r.status}`);
    if (r.stderr) console.log(r.stderr.slice(0, 400));
  }
}

console.log('Done. Redeploy production for Maps sync cron to pick up vars.');
