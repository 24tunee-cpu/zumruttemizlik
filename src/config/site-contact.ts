/**
 * Kanonik iletişim bilgileri — site ayarları yüklenene kadar ve SEO / structured data için.
 * WhatsApp: wa.me/{whatsappDigits}
 */
export const SITE_CONTACT = {
  companyName: 'Zümrüt Vadi Temizlik',
  addressLine: 'Sarıyer Merkez, Sarıyer/İstanbul',
  addressLocality: 'Sarıyer',
  addressRegion: 'İstanbul',
  postalCode: '34450',
  addressCountry: 'TR',

  phoneDisplay: '0551 925 09 43',
  /** tel: ve schema.org Telephone */
  phoneE164: '+905519250943',
  /** wa.me yolu (ülke kodu + numara, başında + yok) */
  whatsappDigits: '905519250943',
  email: 'vedatgunenn@gmail.com',
} as const;

/** tel: bağlantısı — yalnızca rakam ve + */
export function toTelHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : 'tel:';
}
