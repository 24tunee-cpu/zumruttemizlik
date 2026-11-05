/** Ana sayfa / hizmet kartları için görsel seçici — stok Unsplash geçici yedek. */

/**
 * Gerçek iş fotoğrafı yüklendikçe doldur: `/images/services/{slug}.webp`
 * Dosya yokken path ekleme (404). Admin Service.image veya Blob URL tercih.
 */
export const LOCAL_SERVICE_IMAGES: Partial<Record<string, string>> = {
  // 'ev-temizligi': '/images/services/ev-temizligi.webp',
};

/** Unsplash’ta silinmiş / 404 veren stok kimlikleri → çalışan yedek */
const BROKEN_STOCK_REMAP: Record<string, string> = {
  'photo-1558317374-a354d5f6d40b':
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
};

export function remapBrokenStockImage(url: string): string {
  for (const [id, replacement] of Object.entries(BROKEN_STOCK_REMAP)) {
    if (url.includes(id)) return replacement;
  }
  return url;
}

/** Unsplash / bilinen stok CDN — gerçek fotoğraf gelince bunları ezeriz */
export const DEFAULT_SERVICE_IMAGES: Record<string, string> = {
  'ev-temizligi': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'ofis-temizligi': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'insaat-sonrasi-temizlik': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'koltuk-yikama':
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  'hali-temizligi': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  'cam-temizligi': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
  'dis-cephe-temizligi': 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=800&q=80',
};

export function isStockImageUrl(url?: string | null): boolean {
  if (!url?.trim()) return true;
  try {
    const host = new URL(url.trim()).hostname.toLowerCase();
    return (
      host.includes('unsplash.com') ||
      host.includes('images.unsplash.com') ||
      host.includes('plus.unsplash.com')
    );
  } catch {
    // relative /images/... = site varlığı, stok değil
    return false;
  }
}

export function getDefaultServiceImage(slug: string): string | undefined {
  return LOCAL_SERVICE_IMAGES[slug] ?? DEFAULT_SERVICE_IMAGES[slug];
}

/**
 * Öncelik: DB’de stok olmayan URL → local brand asset → DB (stok dahil) → Unsplash yedek.
 */
export function pickServiceImage(slug: string, image?: string | null): string | null {
  const trimmed = image?.trim();
  if (trimmed && !isStockImageUrl(trimmed)) return trimmed;
  const local = LOCAL_SERVICE_IMAGES[slug];
  if (local) return local;
  if (trimmed) return remapBrokenStockImage(trimmed);
  return getDefaultServiceImage(slug) ?? null;
}
