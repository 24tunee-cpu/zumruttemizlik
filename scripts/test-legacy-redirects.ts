import { resolveLegacyRedirect } from '../src/lib/legacy-url-redirects';

const cases: Array<{ path: string; expect: string | null }> = [
  { path: '/blog/atasehir-ev-temizligi-fiyatlari-2026', expect: null },
  { path: '/blog/beylikduzu-avrupa-tasinma-temizligi-fiyatlari-2026', expect: null },
  { path: '/blog/ev-temizligi-fiyatlari-2026-istanbul', expect: null },
  { path: '/blog/istanbul-kart-marmaray-bakiye-2026', expect: null },
  { path: '/blog/eski-yazi-2', expect: '/blog/eski-yazi' },
  { path: '/blog/eski-yazi-3', expect: '/blog/eski-yazi' },
  { path: '/blog/foo-1', expect: null },
];

let failed = 0;
for (const { path, expect } of cases) {
  const result = resolveLegacyRedirect(path);
  const got = result?.to ?? null;
  if (got !== expect) {
    console.error('FAIL', path, 'expected', expect, 'got', got);
    failed++;
  } else {
    console.log('OK', path, '→', got ?? '(no redirect)');
  }
}
if (failed > 0) process.exit(1);
