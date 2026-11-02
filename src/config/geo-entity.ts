/**
 * GEO entity stack — NAP, sameAs, dizinler, rakipler, test promptları.
 * Schema, llms.txt ve admin GEO paneli bu dosyayı tek kaynak olarak kullanır.
 */
import { SITE_CONTACT } from '@/config/site-contact';

export const GEO_BRAND_NAME = SITE_CONTACT.companyName;

/** Kanonik NAP — tüm schema ve llms ile birebir aynı olmalı */
export const GEO_NAP = {
  name: GEO_BRAND_NAME,
  streetAddress: SITE_CONTACT.addressStreet,
  addressLocality: SITE_CONTACT.addressLocality,
  addressRegion: SITE_CONTACT.addressRegion,
  postalCode: SITE_CONTACT.postalCode,
  addressCountry: SITE_CONTACT.addressCountry,
  telephone: SITE_CONTACT.phoneE164,
  telephoneDisplay: SITE_CONTACT.phoneDisplay,
  email: SITE_CONTACT.email,
  whatsapp: SITE_CONTACT.whatsappDigits,
  /** Footer / görünür NAP satırı */
  addressDisplay: SITE_CONTACT.addressLine,
} as const;

/** Harici profil URL'leri — GBP kanonik + env */
export function getGeoSameAsUrls(siteUrl: string): string[] {
  const fromEnv = [
    process.env.NEXT_PUBLIC_GBP_URL,
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_LINKEDIN_URL,
    process.env.NEXT_PUBLIC_YOUTUBE_URL,
    process.env.NEXT_PUBLIC_BING_PLACES_URL,
    process.env.NEXT_PUBLIC_APPLE_MAPS_URL,
    process.env.NEXT_PUBLIC_YANDEX_BUSINESS_URL,
  ]
    .map((u) => u?.trim())
    .filter((u): u is string => Boolean(u && /^https?:\/\//i.test(u)));

  const defaults = [
    SITE_CONTACT.gbpMapsUrl,
    SITE_CONTACT.gbpShareUrl,
    `${siteUrl.replace(/\/$/, '')}/`,
  ];
  return [...new Set([...fromEnv, ...defaults])];
}

/** Bing / dizin GEO kayıtları — admin panelde referans + manuel citation tracker */
export const GEO_DIRECTORY_TARGETS = [
  {
    id: 'google-business',
    name: 'Google Business Profile',
    envKey: 'NEXT_PUBLIC_GBP_URL',
    priority: 'critical' as const,
    platform: 'google_ai',
    /** Manuel takip — panel erişimi olmadan otomasyon yok */
    trackerStatus: 'verify_in_gbp' as const,
    trackerNote: 'NAP, kategori, saatler, fotoğraf, Q&A site ile birebir doğrulanmalı',
    signupUrl: 'https://business.google.com/',
  },
  {
    id: 'bing-places',
    name: 'Bing Places for Business',
    envKey: 'NEXT_PUBLIC_BING_PLACES_URL',
    priority: 'high' as const,
    platform: 'chatgpt_bing',
    trackerStatus: 'pending_manual' as const,
    trackerNote:
      'Hesap yoksa oluştur → URL’yi NEXT_PUBLIC_BING_PLACES_URL + Admin GEO citation’a yaz',
    signupUrl: 'https://www.bingplaces.com/',
  },
  {
    id: 'apple-maps',
    name: 'Apple Business Connect',
    envKey: 'NEXT_PUBLIC_APPLE_MAPS_URL',
    priority: 'medium' as const,
    platform: 'apple_intelligence',
    trackerStatus: 'pending_manual' as const,
    trackerNote: 'Profil URL’sini NEXT_PUBLIC_APPLE_MAPS_URL + citation tracker’a ekle',
    signupUrl: 'https://businessconnect.apple.com/',
  },
  {
    id: 'yandex',
    name: 'Yandex Business',
    envKey: 'NEXT_PUBLIC_YANDEX_BUSINESS_URL',
    priority: 'medium' as const,
    platform: 'yandex',
    trackerStatus: 'pending_manual' as const,
    trackerNote: 'İstanbul yerel görünürlük için opsiyonel',
    signupUrl: 'https://business.yandex.com/',
  },
] as const;

/**
 * Schema areaServed önceliği — Sarıyer/Zekeriyaköy önde.
 * İşyeri pin: Ferahevler (GBP); hizmet önceliği Zekeriyaköy/Boğaz hattı.
 * Koordinat override: NEXT_PUBLIC_BUSINESS_LAT/LNG.
 */
export const GEO_AREA_SERVED_PRIORITY = [
  'Sarıyer',
  'Zekeriyaköy',
  'Maslak',
  'Tarabya',
  'Bahçeköy',
  'İstanbul Avrupa Yakası',
  'İstanbul',
  'Beşiktaş',
  'Şişli',
  'Kağıthane',
  'Eyüpsultan',
  'Bakırköy',
  'Fatih',
] as const;

/** GBP GEO checklist — site tarafı rehber (harici panelde uygulanır) */
export const GEO_GBP_CHECKLIST = [
  'Birincil kategori: Temizlik Hizmetleri (doğrulandı 2026-11-02)',
  'İkincil: Ev / Halı / Cam / Döşeme temizliği — Ofis + İnşaat sonrası ekle',
  'Predefined + custom services: gbp-services-copy.ts metinlerini yapıştır (peyza/tekne yok)',
  'KALDIR: Peyzaj Mimarı (peyzaj hizmeti yok) · Tekne temizliği yoksa kaldır',
  'Açıklamadan “bahçe peyzaj” çıkar; bahçe = yüzey temizliği',
  'NAP site ile birebir: Ferahevler, Şen Aydın Sok. No:10, 34457 · 0551 925 09 43',
  'Çalışma saatleri: 24 saat açık (GBP = site schema)',
  'En az 20 güncel fotoğraf (önce/sonra, ekip) — stok azalt; site: public/images/services/',
  'Haftalık Post + yorum yanıtı (semt + hizmet) — GEO_REVIEW_RESPONSE_TEMPLATES',
  'Yorum hızı: 12 yorumdan düzenli artış hedefle (burst spam yok)',
  'Randevu / fiyat hesaplama linki açıklamada + UTM (gbp-links)',
  'Citation: Bing Places + Apple Business Connect URL → env + Admin GEO tracker',
] as const;

/** GEO odaklı Google yorum istek şablonları — {reviewLink} Place ID / env ile doldurulur */
export const GEO_REVIEW_REQUEST_TEMPLATES = [
  {
    id: 'whatsapp-short',
    label: 'WhatsApp kısa',
    text: 'Merhaba {name}, Zümrüt Vadi Temizlik olarak {service} hizmetimizden memnun kaldıysanız Google yorumunuz bize çok yardımcı olur: {reviewLink} İsterseniz "{district}" ve aldığınız hizmeti kısaca yazmanız yeterli. Teşekkürler!',
  },
  {
    id: 'whatsapp-detailed',
    label: 'WhatsApp detaylı (yerel)',
    text: 'Sayın {name}, {district} bölgesinde verdiğimiz {service} hizmeti hakkında Google\'da kısa bir yorum bırakabilir misiniz? {reviewLink} Yorumda hangi hizmeti aldığınızı, semt/ilçeyi ve memnuniyetinizi kendi cümlelerinizle yazmanız yeterli. Zümrüt Vadi Temizlik — teşekkürler!',
  },
  {
    id: 'email-formal',
    label: 'E-posta resmi',
    text: 'Sayın {name},\n\n{service} hizmetimiz için teşekkür ederiz. Google Business Profile üzerinden deneyiminizi paylaşmanız, {district} bölgesinde hizmet arayan müşterilerin bizi bulmasına yardımcı olur.\n\nYorum linki: {reviewLink}\n\nZümrüt Vadi Temizlik',
  },
  {
    id: 'post-job-sms',
    label: 'İş sonrası kısa SMS',
    text: 'Merhaba {name}, {district} {service} tamamlandı. Memnunsanız Google yorumunuz yeter: {reviewLink} — Zümrüt Vadi Temizlik',
  },
] as const;

/** GBP yorum yanıtı taslakları — manipülasyon yok; onaylı kullan */
export const GEO_REVIEW_RESPONSE_TEMPLATES = [
  {
    id: 'positive-short',
    label: 'Kısa olumlu',
    text: 'Merhaba {name}, {district} bölgesindeki {service} geri bildiriminiz için teşekkürler. Tekrar ihtiyaç olursa 0551 925 09 43.',
  },
  {
    id: 'zekeriyakoy-villa',
    label: 'Villa / Zekeriyaköy',
    text: '{name}, Zekeriyaköy’deki ev/villa temizliğiniz için teşekkür ederiz. Memnuniyetiniz ekibimizi motive ediyor.',
  },
  {
    id: 'maslak-ofis',
    label: 'Ofis / Maslak',
    text: '{name}, Maslak ofis hijyeni hakkındaki yorumunuz için teşekkürler. Mesai dışı planlamada yine yanınızdayız.',
  },
  {
    id: 'negative-recover',
    label: 'Olumsuz — çözüm',
    text: '{name}, deneyiminiz için üzgünüz. Eksik kalan noktayı netleştirmek için 0551 925 09 43 veya WhatsApp’tan yazın; aynı gün dönüş yapalım.',
  },
] as const;

/**
 * AI citation / mention test prompt bank — haftalık manuel izleme.
 * Admin GEO → Mention Skor kartı ile outcome kaydı.
 */
export const GEO_CITATION_PROMPTS = [
  { id: 'sariyer-ev', prompt: 'Sarıyer ev temizliği güvenilir firma önerisi', category: 'local' },
  { id: 'zekeriyakoy', prompt: 'Zekeriyaköy temizlik şirketi tavsiye', category: 'local' },
  { id: 'uskumrukoy', prompt: 'Uskumruköy villa temizliği hangi firma', category: 'local' },
  { id: 'maslak-ofis', prompt: 'Maslak ofis temizliği fiyatları 2026', category: 'pricing' },
  { id: 'tarabya-ev', prompt: 'Tarabya ev temizliği önerilen şirket', category: 'local' },
  { id: 'bahcekoy', prompt: 'Bahçeköy temizlik firması önerisi', category: 'local' },
  { id: 'kira-teslim', prompt: 'İstanbul kira teslim temizliği ne kadar sürer', category: 'info' },
  { id: 'insaat-sonrasi', prompt: 'Sarıyer inşaat sonrası temizlik firması', category: 'local' },
  { id: 'koltuk-yikama', prompt: 'Sarıyer koltuk yıkama yerinde hizmet', category: 'local' },
  { id: 'firma-secimi', prompt: 'İstanbul profesyonel temizlik firması nasıl seçilir', category: 'info' },
  { id: 'besiktas', prompt: 'Beşiktaş ev temizliği fiyatları', category: 'pricing' },
  { id: 'sisli-ofis', prompt: 'Şişli düzenli ofis temizliği şirketi', category: 'local' },
  { id: 'genel-istanbul', prompt: 'İstanbul Avrupa Yakası temizlik şirketi önerisi', category: 'local' },
  { id: 'zumrut-vadi', prompt: 'Zümrüt Vadi Temizlik güvenilir mi telefon', category: 'brand' },
  { id: 'acik-fiyat', prompt: 'İstanbul temizlik ücretsiz keşif fiyat hesaplama', category: 'pricing' },
  { id: '7-24', prompt: 'İstanbul 7/24 acil temizlik şirketi Sarıyer', category: 'local' },
] as const;

/** Rakip izleme — AI yanıtlarında karşılaştırma için */
export const GEO_COMPETITOR_NAMES = [
  'Helpling',
  'Clean Team',
  'Mop İstanbul',
  'Temizlik Express',
] as const;
