/** Ana sayfa / hizmet kartları için güvenilir görsel yedekleri (404 önleme). */
export const DEFAULT_SERVICE_IMAGES: Record<string, string> = {
  'ev-temizligi': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'ofis-temizligi': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'insaat-sonrasi-temizlik': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'koltuk-yikama': 'https://images.unsplash.com/photo-1558317374-a354d5f6d40b?w=800&q=80',
  'hali-temizligi': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  'cam-temizligi': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
  'dis-cephe-temizligi': 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=800&q=80',
};

export function getDefaultServiceImage(slug: string): string | undefined {
  return DEFAULT_SERVICE_IMAGES[slug];
}

export function pickServiceImage(slug: string, image?: string | null): string | null {
  const trimmed = image?.trim();
  if (trimmed) return trimmed;
  return getDefaultServiceImage(slug) ?? null;
}
