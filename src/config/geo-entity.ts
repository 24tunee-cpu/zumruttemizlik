/**
 * GEO entity stack — NAP, sameAs, dizinler, rakipler, test promptları.
 * Schema, llms.txt ve admin GEO paneli bu dosyayı tek kaynak olarak kullanır.
 */
import { SITE_CONTACT } from '@/config/site-contact';

export const GEO_BRAND_NAME = SITE_CONTACT.companyName;

/** Kanonik NAP — tüm schema ve llms ile birebir aynı olmalı */
export const GEO_NAP = {
  name: GEO_BRAND_NAME,
  streetAddress: SITE_CONTACT.addressLine,
  addressLocality: SITE_CONTACT.addressLocality,
  addressRegion: SITE_CONTACT.addressRegion,
  postalCode: SITE_CONTACT.postalCode,
  addressCountry: SITE_CONTACT.addressCountry,
  telephone: SITE_CONTACT.phoneE164,
  telephoneDisplay: SITE_CONTACT.phoneDisplay,
  email: SITE_CONTACT.email,
  whatsapp: SITE_CONTACT.whatsappDigits,
} as const;

/** Harici profil URL'leri — env ile genişletilebilir */
export function getGeoSameAsUrls(siteUrl: string): string[] {
  const fromEnv = [
    process.env.NEXT_PUBLIC_GBP_URL,
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_LINKEDIN_URL,
    process.env.NEXT_PUBLIC_YOUTUBE_URL,
    process.env.NEXT_PUBLIC_BING_PLACES_URL,
  ]
    .map((u) => u?.trim())
    .filter((u): u is string => Boolean(u && /^https?:\/\//i.test(u)));

  const defaults = [`${siteUrl.replace(/\/$/, '')}/`];
  return [...new Set([...fromEnv, ...defaults])];
}

/** Bing / dizin GEO kayıtları — admin panelde referans */
export const GEO_DIRECTORY_TARGETS = [
  {
    id: 'google-business',
    name: 'Google Business Profile',
    envKey: 'NEXT_PUBLIC_GBP_URL',
    priority: 'critical' as const,
    platform: 'google_ai',
  },
  {
    id: 'bing-places',
    name: 'Bing Places for Business',
    envKey: 'NEXT_PUBLIC_BING_PLACES_URL',
    priority: 'high' as const,
    platform: 'chatgpt_bing',
  },
  {
    id: 'apple-maps',
    name: 'Apple Business Connect',
    envKey: 'NEXT_PUBLIC_APPLE_MAPS_URL',
    priority: 'medium' as const,
    platform: 'apple_intelligence',
  },
  {
    id: 'yandex',
    name: 'Yandex Business',
    envKey: 'NEXT_PUBLIC_YANDEX_BUSINESS_URL',
    priority: 'medium' as const,
    platform: 'yandex',
  },
] as const;

/** GBP GEO checklist — site tarafı rehber (harici panelde uygulanır) */
export const GEO_GBP_CHECKLIST = [
  'Birincil kategori: Temizlik şirketi / Cleaning service',
  'İkincil kategoriler: Ofis temizliği, Ev temizliği, İnşaat sonrası temizlik',
  'İşletme açıklaması 750 karakter — Sarıyer/Zekeriyaköy vurgusu',
  'Tüm hizmetler ayrı ayrı tanımlı (ev, ofis, inşaat sonrası, koltuk, halı, cam)',
  'En az 20 güncel fotoğraf (önce/sonra, ekip, ekipman)',
  'Q&A bölümünde en az 10 soru-cevap (fiyat, kapsam, bölge)',
  'Haftalık Google yorum yanıtı — hizmet + semt anahtar kelimeleri',
  'NAP site ile birebir: telefon, adres, web sitesi',
  'Çalışma saatleri: 7/24 veya gerçek program',
  'Randevu / fiyat hesaplama linki açıklamada',
] as const;

/** GEO odaklı Google yorum istek şablonları */
export const GEO_REVIEW_REQUEST_TEMPLATES = [
  {
    id: 'whatsapp-short',
    label: 'WhatsApp kısa',
    text: 'Merhaba {name}, Zümrüt Vadi Temizlik olarak {service} hizmetimizden memnun kaldıysanız Google yorumunuz bize çok yardımcı olur. Lütfen yorumda "{district}" ve "{service}" ifadelerini geçirmeniz yeterli. Teşekkürler!',
  },
  {
    id: 'whatsapp-detailed',
    label: 'WhatsApp detaylı (GEO)',
    text: 'Sayın {name}, {district} bölgesinde verdiğimiz {service} hizmeti hakkında Google\'da kısa bir yorum bırakabilir misiniz? AI arama sistemleri yorum metnini okuduğu için şunları yazmanız ideal: hangi hizmeti aldınız, hangi semt/ilçe, sonuçtan memnuniyet. Zümrüt Vadi Temizlik — teşekkürler!',
  },
  {
    id: 'email-formal',
    label: 'E-posta resmi',
    text: 'Sayın {name},\n\n{service} hizmetimiz için teşekkür ederiz. Google Business Profile üzerinden deneyiminizi paylaşmanız, {district} bölgesinde hizmet arayan müşterilerin bizi bulmasına yardımcı olur.\n\nZümrüt Vadi Temizlik',
  },
] as const;

/** AI citation test prompt bank — haftalık izleme */
export const GEO_CITATION_PROMPTS = [
  { id: 'sariyer-ev', prompt: 'Sarıyer ev temizliği güvenilir firma önerisi', category: 'local' },
  { id: 'zekeriyakoy', prompt: 'Zekeriyaköy temizlik şirketi tavsiye', category: 'local' },
  { id: 'maslak-ofis', prompt: 'Maslak ofis temizliği fiyatları 2026', category: 'pricing' },
  { id: 'kira-teslim', prompt: 'İstanbul kira teslim temizliği ne kadar sürer', category: 'info' },
  { id: 'insaat-sonrasi', prompt: 'Sarıyer inşaat sonrası temizlik firması', category: 'local' },
  { id: 'firma-secimi', prompt: 'İstanbul profesyonel temizlik firması nasıl seçilir', category: 'info' },
  { id: 'besiktas', prompt: 'Beşiktaş ev temizliği fiyatları', category: 'pricing' },
  { id: 'genel-istanbul', prompt: 'İstanbul Avrupa Yakası temizlik şirketi önerisi', category: 'local' },
] as const;

/** Rakip izleme — AI yanıtlarında karşılaştırma için */
export const GEO_COMPETITOR_NAMES = [
  'Helpling',
  'Clean Team',
  'Mop İstanbul',
  'Temizlik Express',
] as const;
