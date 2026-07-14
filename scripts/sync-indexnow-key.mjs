import fs from 'node:fs';
import path from 'node:path';

function sanitizeKey(raw) {
  return raw.trim().replace(/[^a-zA-Z0-9-]/g, '');
}

function main() {
  const raw = process.env.INDEXNOW_KEY?.trim();
  if (!raw) {
    console.log('[SKIP] INDEXNOW_KEY not set — IndexNow key file not written');
    return;
  }

  const key = sanitizeKey(raw);
  if (key.length < 8) {
    console.warn('[WARN] INDEXNOW_KEY too short after sanitization — skipping');
    return;
  }

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const targetPath = path.resolve(publicDir, `${key}.txt`);
  const existing = fs.existsSync(targetPath) ? fs.readFileSync(targetPath, 'utf8') : null;

  if (existing === key) {
    console.log(`[SKIP] ${key}.txt already in sync`);
    return;
  }

  fs.writeFileSync(targetPath, key, 'utf8');
  console.log(`[SYNC] IndexNow key -> public/${key}.txt`);
}

main();
