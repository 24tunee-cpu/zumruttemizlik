/**
 * Kanonik iletişim / NAP — GBP (2026-11-02) ile birebir.
 * Schema, footer, llms, identity bu dosyadan beslenir.
 * WhatsApp: wa.me/{whatsappDigits}
 */
export const SITE_CONTACT = {
  companyName: 'Zümrüt Vadi Temizlik',

  /**
   * Görünen tam adres — Google Business Profile ile aynı string.
   * Kaynak: GBP · Ferahevler, Şen Aydın Sok. No:10, 34457 Sarıyer/İstanbul
   */
  addressLine: 'Ferahevler, Şen Aydın Sok. No:10, 34457 Sarıyer/İstanbul',
  /** Schema.org streetAddress (ilçe/ülke ayrı alanlarda) */
  addressStreet: 'Ferahevler, Şen Aydın Sok. No:10',
  addressLocality: 'Sarıyer',
  addressRegion: 'İstanbul',
  postalCode: '34457',
  addressCountry: 'TR',

  phoneDisplay: '0551 925 09 43',
  /** tel: ve schema.org Telephone */
  phoneE164: '+905519250943',
  /** wa.me yolu (ülke kodu + numara, başında + yok) */
  whatsappDigits: '905519250943',
  email: 'vedatgunenn@gmail.com',

  /**
   * İşyeri pin — Ferahevler / Şen Aydın hattı (GBP).
   * Override: NEXT_PUBLIC_BUSINESS_LAT / NEXT_PUBLIC_BUSINESS_LNG
   */
  geo: {
    latitude: 41.1307,
    longitude: 29.0416,
  },

  /** Doğrulanmış GBP genel bağlantılar */
  gbpMapsUrl: 'https://maps.app.goo.gl/bdbJ7VSdWcWYcKmV7',
  gbpShareUrl: 'https://share.google/HlN1m0SZOleCgw6ZO',
  /**
   * Google Place ID — yorum deep-link (doğrulandı 2026-11-02).
   * Override: NEXT_PUBLIC_GBP_PLACE_ID veya admin Haritalar externalPlaceId
   */
  gbpPlaceId: 'ChIJoybfFnu1yhQRnhFEAf9KbAQ',

  /** GBP ile uyumlu: 24 saat açık */
  openingHours: {
    days: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ] as const,
    opens: '00:00',
    closes: '23:59',
  },
} as const;

/** tel: bağlantısı — yalnızca rakam ve + */
export function toTelHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : 'tel:';
}
