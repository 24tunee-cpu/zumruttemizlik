/**
 * Marka görselleri ve public asset boyut denetimi — deploy öncesi.
 * Faz D: sürekli performans izleme.
 */
import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.join(process.cwd(), 'public');

const THRESHOLDS_KB = {
  'logo.png': 120,
  'logo.webp': 80,
  'og-image.jpg': 100,
};

function kb(bytes) {
  return bytes / 1024;
}

function main() {
  let warn = 0;
  let fail = 0;

  console.log('Performance asset audit\n');

  for (const [file, maxKb] of Object.entries(THRESHOLDS_KB)) {
    const full = path.join(publicDir, file);
    if (!fs.existsSync(full)) {
      console.log(`[FAIL] ${file} — dosya yok`);
      fail += 1;
      continue;
    }
    const sizeKb = kb(fs.statSync(full).size);
    if (sizeKb > maxKb) {
      console.log(`[WARN] ${file} — ${sizeKb.toFixed(1)} KB (limit ${maxKb} KB)`);
      warn += 1;
    } else {
      console.log(`[OK]   ${file} — ${sizeKb.toFixed(1)} KB`);
    }
  }

  const requiredPackages = ['@vercel/analytics', '@vercel/speed-insights', 'web-vitals'];
  for (const pkg of requiredPackages) {
    const pkgPath = path.join(process.cwd(), 'node_modules', pkg, 'package.json');
    if (fs.existsSync(pkgPath)) {
      console.log(`[OK]   ${pkg} kurulu`);
    } else {
      console.log(`[FAIL] ${pkg} eksik — npm install çalıştırın`);
      fail += 1;
    }
  }

  console.log(`\nÖzet: ${fail} fail, ${warn} warn`);
  if (fail > 0) process.exitCode = 1;
}

main();
