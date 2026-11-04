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
  'koltuk-yikama': {
    title: 'Koltuk Yıkama İstanbul | Yerinde Kanepe Temizliği',
    description:
      'İstanbul koltuk yıkama: yerinde kanepe/döşeme. Sarıyer hattı ekip, ücretsiz keşif. Hızlı randevu — ara veya fiyat hesapla.',
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
  // 2026-11-04 audit: GSC "(sayfa raporu)" sızıntısı scrub — premium CTR meta
  'anti-bakteriyel-temizlik-nedir-hangi-odalarda-sarttir': {
    title: 'Anti-Bakteriyel Temizlik Nedir? | Hangi Odalar',
    description:
      'Anti-bakteriyel temizlik nedir, mutfak-banyo-çocuk odasında ne zaman şart? Pratik rehber + profesyonel hijyen. Ücretsiz keşif için ara.',
  },
  'evde-kedi-kopek-tuyu-temizligi-hayat-kurtaran-cozumler': {
    title: 'Evde Kedi Köpek Tüyü Temizliği | Pratik Çözüm',
    description:
      'Kedi-köpek tüyü için evde işe yarayan yöntemler + profesyonel destek. Halı/koltuk tüy temizliği. Sarıyer hattı — keşif için ara.',
  },
  'evin-gunlerce-guzel-kokmas-icin-temizlik-suyuna-ne-katilmali': {
    title: 'Temizlik Suyuna Ne Katmalı? | Kalıcı Ev Kokusu',
    description:
      'Evin günlerce güzel kokması için temizlik suyuna ne katılır? Güvenli ipuçları + profesyonel ev temizliği. Ücretsiz keşif.',
  },
  'istanbul-temizlik-fiyatlari-online-hesaplama-2026': {
    title: 'İstanbul Temizlik Fiyatları 2026 | Online Hesap',
    description:
      'İstanbul temizlik fiyatları 2026 (tahmini). Online hesaplama, ücretsiz keşif. Ev/ofis/inşaat sonrası — Sarıyer odaklı ekip.',
  },
  'kimyasal-kullanmadan-ekolojik-dogal-ev-temizligi-mumkun-mu': {
    title: 'Doğal Ev Temizliği | Kimyasalsız Rehber 2026',
    description:
      'Kimyasalsız / ekolojik ev temizliği mümkün mü? Güvenli yöntemler + profesyonel destek. İstanbul — ücretsiz keşif için ara.',
  },
  'koltuk-yikama-fiyatlari-2026-istanbul': {
    title: 'Koltuk Yıkama Fiyatları 2026 | İstanbul',
    description:
      'İstanbul koltuk yıkama fiyatları 2026 (tahmini). Yerinde kanepe/döşeme. Ücretsiz keşif — Sarıyer hattı ekip.',
  },
  'maslak-ev-temizligi-fiyatlari-2026': {
    title: 'Maslak Ev Temizliği Fiyatları 2026 | Tablo',
    description:
      'Maslak ev temizliği 2026 fiyat aralıkları (tahmini). Plaza/site daire. Ücretsiz keşif — online hesapla veya ara.',
  },
  'musteri-yorumlari-deneyimleri-temizlik-sirketi-seciminde-neden-belirleyici': {
    title: 'Temizlik Firması Seçiminde Yorumlar Neden Önemli',
    description:
      'Müşteri yorumları temizlik şirketi seçimini nasıl etkiler? Güven sinyalleri + Google Maps ipuçları. Zümrüt Vadi Temizlik.',
  },
  'nisantasi-ev-temizligi-fiyatlari-2026': {
    title: 'Nişantaşı Ev Temizliği Fiyatları 2026',
    description:
      'Nişantaşı ev temizliği 2026 tahmini fiyat tablosu. Şeffaf kapsam, ücretsiz keşif. Avrupa yakası ekip — ara veya hesapla.',
  },
  'plaza-dis-cephe-cam-temizligi-profesyonel-cozumler-neden-onemli': {
    title: 'Plaza Dış Cephe Cam Temizliği | Profesyonel',
    description:
      'Plaza ve dış cephe cam temizliği neden profesyonel ekip ister? Güvenli erişim + iz bırakmayan sonuç. Ücretsiz keşif.',
  },
  'sariyer-temizlik-fiyatlari-2026': {
    title: 'Sarıyer Temizlik Fiyatları 2026 | Semt Rehber',
    description:
      'Sarıyer temizlik fiyatları 2026: Zekeriyaköy ve semt semt tahmini. Ücretsiz keşif — online hesapla veya hemen ara.',
  },
  'temizlik-personeli-sigortal-guvenilir-neden-onemli': {
    title: 'Sigortalı Temizlik Personeli Neden Önemli?',
    description:
      'Temizlik personelinin sigortalı ve güvenilir olması neden kritik? Kontrol listesi + profesyonel ekip. Ücretsiz keşif.',
  },
  'zumrut-vadi-temizlik-referanslar-calisma-prensibi': {
    title: 'Zümrüt Vadi Referanslar & Çalışma Prensibi',
    description:
      'Zümrüt Vadi Temizlik çalışma prensibi ve referans yaklaşımı. Google Maps yorumları, şeffaf kapsam — keşif için ara.',
  },
};

export function pairCtrKey(districtSlug: string, serviceSlug: string): string {
  return `${districtSlug}/${serviceSlug}`;
}
