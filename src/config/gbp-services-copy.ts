/**
 * GBP panel — yapıştırılabilir hizmet adları + kısa açıklamalar.
 * Kaynak: SERVICE_LANDINGS (gerçek site hizmetleri). Peyzaj / tekne yok.
 */
import { SERVICE_LANDINGS } from '@/config/programmatic-seo';

export type GbpServiceCopy = {
  slug: string;
  /** GBP predefined / custom service adı */
  name: string;
  /** GBP service description (kısa, fiyat/link yok) */
  description: string;
  /** Site kanonik URL path */
  sitePath: string;
};

const EXTRA_BLURBS: Record<string, string> = {
  'ev-temizligi':
    'Mutfak, banyo ve yaşam alanlarında tek seferlik veya düzenli ev temizliği. Kapsam ücretsiz keşifte netleşir.',
  'ofis-temizligi':
    'Günlük, haftalık veya aylık ofis hijyeni; mesai dışı planlama mümkün. Kurumsal sözleşme seçeneği.',
  'insaat-sonrasi-temizlik':
    'İnce inşaat tozu, moloz kalıntısı ve teslim öncesi detay temizlik. Alan keşfi sonrası süre ve kapsam.',
  'koltuk-yikama':
    'Yerinde koltuk yıkama; kumaşa uygun ürün ve kuruma süresi planı. Leke tipi keşifte değerlendirilir.',
  'hali-temizligi':
    'Halı tipine göre yerinde veya atölye uygunluğu keşifte belirlenir. Dokuya uygun yöntem.',
  'cam-temizligi':
    'Konut ve ofis cam yüzeylerinde güvenli cam temizliği. Erişim koşulları keşifte netleşir.',
  'dis-cephe-temizligi':
    'Cam ve cephe yüzeylerinde iş güvenliği odaklı dış cephe temizliği. Yüksek kat için ekipman planı.',
};

export const GBP_SERVICES_COPY: GbpServiceCopy[] = SERVICE_LANDINGS.map((s) => ({
  slug: s.slug,
  name: s.name,
  description: EXTRA_BLURBS[s.slug] ?? s.shortPitch.slice(0, 220),
  sitePath: `/hizmetler/${s.slug}`,
}));

/** Panel checklist satırı — hizmet listesi özeti */
export const GBP_SERVICES_PANEL_HINT =
  'Hizmetler: Ev, Ofis, İnşaat sonrası, Koltuk, Halı, Cam, Dış cephe — yapıştır metinleri Admin GEO → GBP veya src/config/gbp-services-copy.ts';
