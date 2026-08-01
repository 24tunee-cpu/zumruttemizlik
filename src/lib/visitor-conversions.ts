export type ConversionType =
  | 'whatsapp'
  | 'phone'
  | 'contact'
  | 'pricing'
  | 'appointment';

export const CONVERSION_LABELS: Record<ConversionType, string> = {
  whatsapp: 'WhatsApp tıklaması',
  phone: 'Telefon araması',
  contact: 'İletişim / form',
  pricing: 'Fiyat hesaplama',
  appointment: 'Randevu / keşif',
};

/** Tıklama URL / etiket / data-source üzerinden dönüşüm sınıflandırması */
export function classifyConversionClick(
  href?: string | null,
  label?: string | null,
  source?: string | null
): ConversionType | null {
  const h = (href || '').toLowerCase();
  const l = (label || '').toLowerCase();
  const s = (source || '').toLowerCase();
  const blob = `${h} ${l} ${s}`;

  if (
    h.includes('wa.me') ||
    h.includes('whatsapp.com') ||
    h.includes('api.whatsapp') ||
    blob.includes('whatsapp')
  ) {
    return 'whatsapp';
  }
  if (h.startsWith('tel:') || blob.includes('telefon') || blob.includes('ara ')) {
    return 'phone';
  }
  if (
    h.includes('/randevu') ||
    h.includes('/appointment') ||
    blob.includes('randevu') ||
    blob.includes('keşif')
  ) {
    return 'appointment';
  }
  if (h.includes('/iletisim') || s.includes('contact') || s.includes('form')) {
    return 'contact';
  }
  if (
    h.includes('/fiyat-hesaplama') ||
    h.includes('/fiyatlar') ||
    s.includes('pricing') ||
    s.includes('fiyat')
  ) {
    return 'pricing';
  }
  return null;
}

export function isHighIntentPath(path: string | null | undefined): boolean {
  if (!path) return false;
  return /^\/(iletisim|randevu|fiyat-hesaplama|fiyatlar)(\/|$|\?)/.test(path);
}
