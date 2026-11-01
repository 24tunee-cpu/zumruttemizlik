/**
 * llms.txt / llms-full.txt ↔ GEO_NAP doğrulama.
 * Exit 1 = fail (marka/telefon/e-posta uyumsuzluğu).
 */
import fs from 'node:fs';
import path from 'node:path';
import { GEO_BRAND_NAME, GEO_NAP } from '../src/config/geo-entity';

type Issue = { file: string; level: 'fail' | 'warn'; message: string };

function checkFile(rel: string, issues: Issue[]) {
  const abs = path.join(process.cwd(), rel);
  if (!fs.existsSync(abs)) {
    issues.push({ file: rel, level: 'fail', message: 'Dosya yok' });
    return;
  }
  const text = fs.readFileSync(abs, 'utf8');
  if (!text.includes(GEO_BRAND_NAME)) {
    issues.push({ file: rel, level: 'fail', message: `Marka eksik: ${GEO_BRAND_NAME}` });
  }
  const phoneDigits = GEO_NAP.telephone.replace(/\D/g, '');
  const textDigits = text.replace(/\D/g, '');
  if (!textDigits.includes(phoneDigits.slice(-10))) {
    issues.push({
      file: rel,
      level: 'fail',
      message: `Telefon NAP ile uyumsuz (beklenen ${GEO_NAP.telephoneDisplay})`,
    });
  }
  if (!text.toLowerCase().includes(GEO_NAP.email.toLowerCase())) {
    issues.push({ file: rel, level: 'fail', message: `E-posta eksik: ${GEO_NAP.email}` });
  }
  if (!text.includes('Sarıyer') && !text.includes('Sariyer')) {
    issues.push({ file: rel, level: 'warn', message: 'Sarıyer lokasyon vurgusu zayıf' });
  }
  if (!text.includes('Zekeriyaköy') && !text.includes('Zekeriyakoy')) {
    issues.push({ file: rel, level: 'warn', message: 'Zekeriyaköy vurgusu zayıf' });
  }
}

function main() {
  const issues: Issue[] = [];
  for (const f of [
    'llms.txt',
    'llms-full.txt',
    'public/llms.txt',
    'public/llms-full.txt',
  ]) {
    checkFile(f, issues);
  }

  const identityPath = path.join(process.cwd(), 'public/identity.json');
  if (!fs.existsSync(identityPath)) {
    issues.push({ file: 'public/identity.json', level: 'fail', message: 'identity.json yok' });
  } else {
    try {
      const id = JSON.parse(fs.readFileSync(identityPath, 'utf8')) as {
        name?: string;
        telephone?: string;
        email?: string;
      };
      if (id.name !== GEO_BRAND_NAME) {
        issues.push({
          file: 'public/identity.json',
          level: 'fail',
          message: 'name ≠ GEO_BRAND_NAME',
        });
      }
      if ((id.telephone || '').replace(/\D/g, '') !== GEO_NAP.telephone.replace(/\D/g, '')) {
        issues.push({
          file: 'public/identity.json',
          level: 'fail',
          message: 'telephone ≠ GEO_NAP',
        });
      }
      if ((id.email || '').toLowerCase() !== GEO_NAP.email.toLowerCase()) {
        issues.push({
          file: 'public/identity.json',
          level: 'fail',
          message: 'email ≠ GEO_NAP',
        });
      }
    } catch {
      issues.push({ file: 'public/identity.json', level: 'fail', message: 'JSON parse hatası' });
    }
  }

  const fails = issues.filter((i) => i.level === 'fail');
  const warns = issues.filter((i) => i.level === 'warn');
  for (const i of issues) {
    console.log(`[${i.level.toUpperCase()}] ${i.file}: ${i.message}`);
  }
  if (fails.length === 0 && warns.length === 0) {
    console.log('OK: llms ↔ NAP tutarlı');
  }
  process.exit(fails.length > 0 ? 1 : 0);
}

main();
