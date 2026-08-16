/**
 * Eski WordPress / hatalı URL kalıpları — GSC 404 ve junk URL düzeltmesi.
 */
export type LegacyRedirect = {
  to: string;
  permanent: boolean;
};

function normalizePath(pathname: string): string {
  try {
    return decodeURIComponent(pathname).replace(/\/+$/, '') || '/';
  } catch {
    return pathname.replace(/\/+$/, '') || '/';
  }
}

/** Sabit eski path → yeni kanonik path */
const EXACT_REDIRECTS: Record<string, string> = {
  '/$': '/',
  '/%24': '/',
  '/fiyatlar-4': '/fiyatlar',
  '/bolgeler/fatih-1': '/bolgeler/fatih',
  '/bolgeler/beyoglu': '/bolgeler/besiktas',
  '/bolgeler/eminönü': '/bolgeler/fatih',
  '/bolgeler/eminonu': '/bolgeler/fatih',
  '/blog/esyalı-ev-temizligi-bos-ev-temizligi-fiyat-farklari':
    '/blog/esyali-ev-temizligi-bos-ev-temizligi-fiyat-farklari',
  '/blog/insaat-sonrasi-camlardaki-inatci-bant-harç-lekeleri-temizlik':
    '/blog/insaat-sonrasi-camlardaki-inatci-bant-harc-lekeleri-temizlik',
  '/blog/kisa-hazirlik-temizligi-evini-soğuk-aylara-nasil-hazirlarsiniz':
    '/blog/kisa-hazirlik-temizligi-evini-soguk-aylara-nasil-hazirlarsiniz',
};

export function resolveLegacyRedirect(pathname: string): LegacyRedirect | null {
  const path = normalizePath(pathname);
  const lower = path.toLowerCase();

  const exact = EXACT_REDIRECTS[path] ?? EXACT_REDIRECTS[lower];
  if (exact) {
    return { to: exact, permanent: true };
  }

  if (/^\/fiyatlar-\d+$/i.test(path)) {
    return { to: '/fiyatlar', permanent: true };
  }

  // WordPress yinelenen slug: /blog/yazi-basligi-2 → /blog/yazi-basligi
  // Yıl soneklerini (2024, 2025, 2026 …) hariç tut — v2/v3 blog slug'ları -2026 ile biter.
  const blogDup = path.match(/^\/blog\/(.+)-(\d+)$/i);
  if (blogDup?.[1] && blogDup[2]) {
    const suffix = blogDup[2];
    if (!/^20\d{2}$/.test(suffix)) {
      const n = parseInt(suffix, 10);
      if (n >= 2) {
        return { to: `/blog/${blogDup[1]}`, permanent: true };
      }
    }
  }

  const districtDup = path.match(/^\/bolgeler\/([a-z0-9\u00C0-\u024F-]+)-(\d+)$/i);
  if (districtDup?.[1]) {
    const slug = districtDup[1]
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    return { to: `/bolgeler/${slug}`, permanent: true };
  }

  return null;
}
