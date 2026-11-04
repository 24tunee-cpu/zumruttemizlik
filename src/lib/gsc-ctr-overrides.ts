/**
 * GSC CSV (2026-11) kaynaklı CTR / niyet overrides.
 * Amaç: yüksek gösterim + düşük tık / gömülü para sayfalarını snippet’te güçlendirmek.
 * Sıralama garantisi yok — verified NAP/trust dışı uydurma yok.
 */

export type MetaPair = { title: string; description: string };

/** /bolgeler/{district}/{service} meta */
export const PAIR_CTR_META: Record<string, MetaPair> = {
  'sariyer/ev-temizligi': {
    title: 'Sarıyer Ev Temizliği | Zekeriyaköy Villa',
    description:
      'Sarıyer ev temizliği: Zekeriyaköy villa & site. Ücretsiz keşif, şeffaf kapsam. Fiyat hesapla veya hemen ara — aynı gün dönüş.',
  },
  'sariyer/dis-cephe-temizligi': {
    title: 'Sarıyer Dış Cephe Temizliği | Ücretsiz Keşif',
    description:
      'Sarıyer dış cephe temizliği (cam & bina). Konumda öne çıkan hizmet — ücretsiz keşif, güvenli erişim. Zekeriyaköy–Boğaz hattı. Hemen ara.',
  },
  'sariyer/cam-temizligi': {
    title: 'Sarıyer Cam Temizliği | Villa & Ofis',
    description:
      'Sarıyer cam temizliği: villa, site, ofis. İç/dış cam, ücretsiz keşif. Zekeriyaköy ve Boğaz hattı ekip. Fiyat hesapla veya ara.',
  },
  'sariyer/koltuk-yikama': {
    title: 'Sarıyer Koltuk Yıkama | Yerinde Temizlik',
    description:
      'Sarıyer koltuk yıkama: yerinde kanepe/döşeme. Ücretsiz keşif, hızlı randevu. Zekeriyaköy–Maslak hattı. Fiyat için yazın veya ara.',
  },
  'sariyer/ofis-temizligi': {
    title: 'Sarıyer Ofis Temizliği | Maslak Plaza',
    description:
      'Sarıyer ofis temizliği: Maslak plaza & işyeri. Mesai dışı plan, ücretsiz keşif. Kurumsal hijyen paketi — teklif için ara.',
  },
  'sariyer/insaat-sonrasi-temizlik': {
    title: 'Sarıyer İnşaat Sonrası Temizlik | Fiyat',
    description:
      'Sarıyer inşaat sonrası temizlik: ince toz, teslim checklist. Villa & yeni teslim. Ücretsiz keşif, net kapsam ve fiyat.',
  },
};

/** Pair sayfa H1 (SERP ile hizalı, tek H1) */
export const PAIR_CTR_H1: Record<string, string> = {
  'sariyer/dis-cephe-temizligi': 'Sarıyer Dış Cephe Temizliği — Ücretsiz Keşif',
  'sariyer/cam-temizligi': 'Sarıyer Cam Temizliği',
  'sariyer/koltuk-yikama': 'Sarıyer Koltuk Yıkama',
  'sariyer/ev-temizligi': 'Sarıyer Ev Temizliği',
  'sariyer/ofis-temizligi': 'Sarıyer Ofis Temizliği',
  'sariyer/insaat-sonrasi-temizlik': 'Sarıyer İnşaat Sonrası Temizlik',
};

/** Semt landing H1 — “şirketi” niyeti (GSC) */
export const NEIGHBORHOOD_CTR_H1: Record<string, string> = {
  zekeriyakoy: 'Zekeriyaköy Temizlik Şirketi',
  maslak: 'Maslak Temizlik Şirketi',
};

/** /hizmetler/{slug} meta */
export const SERVICE_CTR_META: Record<string, MetaPair> = {
  'dis-cephe-temizligi': {
    title: 'Dış Cephe Temizliği İstanbul | Cam & Bina Cephe',
    description:
      'İstanbul dış cephe temizliği: cam/cephe, güvenli erişim, su izi giderme. Sarıyer–Zekeriyaköy hattı. Ücretsiz keşif — fiyat hesapla veya ara.',
  },
  'insaat-sonrasi-temizlik': {
    title: 'İnşaat Sonrası Temizlik İstanbul | Fiyat & Teslim',
    description:
      'İnşaat sonrası temizlik İstanbul: ince toz, tadilat teslim. Sarıyer odaklı ekip. Ücretsiz keşif, şeffaf kapsam ve fiyat.',
  },
  'cam-temizligi': {
    title: 'Cam Temizliği İstanbul | Ofis & Villa Cam Silme',
    description:
      'İstanbul cam temizliği: ofis, villa, vitrin. Sarıyer hattı ekip, ücretsiz keşif. İç/dış cam — fiyat hesapla veya hemen ara.',
  },
  'ofis-temizligi': {
    title: 'Ofis Temizliği İstanbul | Kurumsal & Plaza',
    description:
      'İstanbul ofis temizliği: plaza, işyeri, mesai dışı. Maslak–Sarıyer hattı. Ücretsiz keşif ve periyodik paket — teklif al.',
  },
  'ev-temizligi': {
    title: 'Ev Temizliği İstanbul | Sarıyer & Zekeriyaköy',
    description:
      'İstanbul ev temizliği: Sarıyer / Zekeriyaköy villa & daire. Ücretsiz keşif, şeffaf kapsam. Fiyat hesapla veya ara.',
  },
};

/** Yüksek gösterimli blog slug → SERP CTR */
export const BLOG_CTR_META: Record<string, MetaPair> = {
  'insaat-sonrasi-temizlik-fiyatlari-2026': {
    title: 'İnşaat Sonrası Temizlik Fiyatları 2026 | İstanbul',
    description:
      '2026 inşaat sonrası temizlik fiyat aralıkları (tahmini). Sarıyer odaklı ekip, ücretsiz keşif. Online hesapla veya hemen ara.',
  },
  'ofis-temizligi-fiyatlari-2026-istanbul': {
    title: 'Ofis Temizliği Fiyatları 2026 | İstanbul',
    description:
      'İstanbul ofis temizliği fiyatları 2026 (tahmini). Plaza/işyeri paketleri, ücretsiz keşif. Maslak–Sarıyer hattı — teklif al.',
  },
  'cam-temizligi-fiyatlari-2026-istanbul': {
    title: 'Cam Temizliği Fiyatları 2026 | İstanbul',
    description:
      'İstanbul cam temizliği fiyatları 2026. Ofis & villa cam silme, ücretsiz keşif. Sarıyer hattı — hesapla veya ara.',
  },
  'dis-cephe-temizligi-fiyatlari-2026': {
    title: 'Dış Cephe Temizliği Fiyatları 2026 | İstanbul',
    description:
      'Dış cephe temizliği fiyatları 2026 (tahmini). Cam & bina cephe, güvenli erişim. Ücretsiz keşif — Sarıyer odaklı ekip.',
  },
  'zekeriyakoy-temizlik-fiyatlari-2026': {
    title: 'Zekeriyaköy Temizlik Fiyatları 2026 | Villa',
    description:
      'Zekeriyaköy temizlik fiyatları 2026. Villa/site tahmini aralık, ücretsiz keşif. Temizlik şirketi teklifi — ara veya hesapla.',
  },
  'istanbuldaki-siddetli-yagmur-ve-sel-sonrasi-evlerde-su-hasari-temizlik-icin-acil-yapilmasi-gerekenler': {
    title: 'Sel / Su Baskını Sonrası Ev Temizliği | Acil Rehber',
    description:
      'Yağmur ve sel sonrası evde su hasarı: acil adımlar + profesyonel temizlik. İstanbul / Sarıyer ekibi — ücretsiz keşif için ara.',
  },
};

export function pairCtrKey(districtSlug: string, serviceSlug: string): string {
  return `${districtSlug}/${serviceSlug}`;
}
