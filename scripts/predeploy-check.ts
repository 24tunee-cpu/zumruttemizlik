import fs from 'node:fs';
import path from 'node:path';

type Level = 'ok' | 'warn' | 'fail';
type CheckResult = { level: Level; message: string };

const REQUIRED_CORE = [
  'NEXTAUTH_SECRET',
  'CRON_SECRET',
  'SEED_ADMIN_SECRET',
  'MAPS_GOOGLE_CLIENT_ID',
  'MAPS_GOOGLE_CLIENT_SECRET',
  'MAPS_OAUTH_SECRET',
  'DATABASE_URL',
];

/** Vercel prod / PREDEPLOY_STRICT=1 iken zorunlu */
const REQUIRED_ON_VERCEL = ['BLOB_READ_WRITE_TOKEN'];

/** Yoksa uyarı */
const RECOMMENDED = [
  'INDEXNOW_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'NEXT_PUBLIC_SITE_URL',
];

const WEAK_VALUES = new Set([
  'your-secret-key-here-change-in-production',
  'admin123',
  'development-secret-do-not-use-in-production',
]);

function parseEnv(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const out: Record<string, string> = {};
  for (const line of content.split(/\r?\n/)) {
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
    out[key] = value;
  }
  return out;
}

function checkKey(
  env: Record<string, string>,
  key: string,
  missingLevel: Level
): CheckResult {
  const value = env[key]?.trim();
  if (!value) {
    return { level: missingLevel, message: `${key} is missing` };
  }
  if (WEAK_VALUES.has(value)) {
    return { level: 'fail', message: `${key} uses weak/default value` };
  }
  if (key === 'NEXTAUTH_SECRET' && value.length < 32) {
    return { level: 'fail', message: 'NEXTAUTH_SECRET is shorter than 32 chars' };
  }
  return { level: 'ok', message: `${key} is configured` };
}

function checkRequired(env: Record<string, string>): CheckResult[] {
  const strict =
    env.VERCEL === '1' ||
    env.PREDEPLOY_STRICT === '1' ||
    env.PREDEPLOY_STRICT === 'true';

  const core = REQUIRED_CORE.map((key) => checkKey(env, key, 'fail'));
  const vercelKeys = REQUIRED_ON_VERCEL.map((key) =>
    checkKey(env, key, strict ? 'fail' : 'warn')
  );
  const recommended = RECOMMENDED.map((key) => checkKey(env, key, 'warn'));
  return [...core, ...vercelKeys, ...recommended];
}

function checkDuplicates(filePath: string): CheckResult[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const seen = new Map<string, number>();
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  return [...seen.entries()]
    .filter(([, count]) => count > 1)
    .map(([key, count]) => ({
      level: 'warn' as const,
      message: `${key} is declared ${count} times in ${path.basename(filePath)}`,
    }));
}

function printResult(r: CheckResult) {
  const badge = r.level === 'ok' ? '[OK]' : r.level === 'warn' ? '[WARN]' : '[FAIL]';
  console.log(`${badge} ${r.message}`);
}

function main() {
  const cwd = process.cwd();
  const envPath = path.resolve(cwd, '.env');
  const envLocalPath = path.resolve(cwd, '.env.local');
  const mergedEnv = {
    ...parseEnv(envPath),
    ...parseEnv(envLocalPath),
    ...process.env,
  } as Record<string, string>;

  const results: CheckResult[] = [
    ...checkRequired(mergedEnv),
    ...checkDuplicates(envPath),
    ...checkDuplicates(envLocalPath),
  ];

  results.forEach(printResult);

  const failCount = results.filter((r) => r.level === 'fail').length;
  const warnCount = results.filter((r) => r.level === 'warn').length;
  console.log(`\nSummary: ${failCount} fail, ${warnCount} warn`);

  if (failCount > 0) {
    process.exitCode = 1;
  }
}

main();
