/**
 * Ana sayfa hizmetler bölümü — SEO metinleri, fiyat ipuçları ve iç linkler.
 * API'den gelen hizmet verisi bu katmanla zenginleştirilir.
 */

export type HomeServiceSeoMeta = {
  /** Kartta görünen SEO odaklı açıklama (150–220 karakter) */
  seoDesc: string;
  /** Fiyat rozeti metni */
  priceBadge: string;
  /** Fiyat blog slug */
  blogSlug: string;
  /** Bölge vurgusu */
  regionLabel: string;
  /** Öne çıkan maddeler (max 3) */
  highlights: string[];
  /** Bento grid'de geniş kart */
  featured?: boolean;
};

export const HOME_SERVICE_SEO: Record<string, HomeServiceSeoMeta> = {
  'ev-temizligi': {
    seoDesc:
      'İstanbul Avrupa Yakası, Sarıyer ve Zekeriyaköy’de villa, site ve daire için detaylı ev temizliği. Mutfak, banyo, cam ve zemin hijyeni; tek seferlik veya düzenli paketler.',
    priceBadge: "3.500 TL'den",
    blogSlug: 'ev-temizligi-fiyatlari-2026-istanbul',
    regionLabel: 'Zekeriyaköy · Sarıyer',
    highlights: ['Ücretsiz keşif', 'Balkon hediye', 'Aynı gün randevu'],
    featured: true,
  },
  'ofis-temizligi': {
    seoDesc:
      'Maslak, Levent ve İstanbul genelinde kurumsal ofis temizliği. Günlük, haftalık veya aylık planlar; mesai dışı uygulama ve şeffaf m² fiyatlandırma.',
    priceBadge: "35 TL/m²'den",
    blogSlug: 'ofis-temizligi-fiyatlari-2026-istanbul',
    regionLabel: 'Maslak · Avrupa Yakası',
    highlights: ['Kurumsal sözleşme', 'Mesai dışı ekip', 'Cam dahil plan'],
  },
  'insaat-sonrasi-temizlik': {
    seoDesc:
      'Tadilat ve inşaat sonrası teslim temizliği: ince toz, boya kalıntısı, cam ve zemin detay. Villa, daire ve ofis teslimi için profesyonel ekip.',
    priceBadge: "75 TL/m²'den",
    blogSlug: 'insaat-sonrasi-temizlik-fiyatlari-2026',
    regionLabel: 'Sarıyer · Kağıthane',
    highlights: ['Teslim odaklı', 'Çok katlı villa', 'Hızlı ekip'],
    featured: true,
  },
  'koltuk-yikama': {
    seoDesc:
      'Yerinde koltuk ve kanepe yıkama: leke çıkarma, koku giderme, kumaş tipine özel ürün. Ev ve ofis için İstanbul geneli hızlı randevu.',
    priceBadge: "900 TL'den",
    blogSlug: 'koltuk-yikama-fiyatlari-2026-istanbul',
    regionLabel: 'İstanbul geneli',
    highlights: ['Yerinde servis', 'Deri & kumaş', 'Hızlı kuruma'],
  },
  'hali-temizligi': {
    seoDesc:
      'Halı ve kilim temizliği: makine ve el dokuma halılara özel yöntem, alerjen ve toz giderme. Yerinde veya planlı toplama ile İstanbul.',
    priceBadge: "80 TL/m²'den",
    blogSlug: 'hali-temizligi-fiyatlari-2026-istanbul',
    regionLabel: 'Ev & villa',
    highlights: ['Leke ön işlem', 'Hassas dokuma', 'Kontrollü kurutma'],
  },
  'cam-temizligi': {
    seoDesc:
      'İç ve dış cam temizliği, vitrin ve yüksek erişim camları. Boğaz hattı villaları ve plaza ofisleri için lekesiz, güvenli uygulama.',
    priceBadge: "600 TL'den",
    blogSlug: 'cam-temizligi-fiyatlari-2026-istanbul',
    regionLabel: 'Boğaz hattı · Plaza',
    highlights: ['İç & dış cam', 'Periyodik paket', 'Güvenli erişim'],
  },
  'dis-cephe-temizligi': {
    seoDesc:
      'Dış cephe ve cam cephe temizliği: villa, apartman ve plaza için iş güvenliği standartlarında ekipmanlı profesyonel hizmet.',
    priceBadge: "35 TL/m²'den",
    blogSlug: 'dis-cephe-temizligi-fiyatlari-2026',
    regionLabel: 'Villa · Plaza',
    highlights: ['İş güvenliği', 'Sezonluk plan', 'Yüksek kat'],
  },
};

export const DEFAULT_HOME_SERVICE_SEO: HomeServiceSeoMeta = {
  seoDesc: 'İstanbul genelinde profesyonel temizlik hizmeti. Ücretsiz keşif ve şeffaf fiyatlandırma.',
  priceBadge: 'Teklif alın',
  blogSlug: 'istanbul-temizlik-fiyatlari-online-hesaplama-2026',
  regionLabel: 'İstanbul',
  highlights: ['Ücretsiz keşif', '7/24 destek', 'Sigortalı ekip'],
};
