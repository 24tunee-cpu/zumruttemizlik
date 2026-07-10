export type PrioritySeoLink = {
  href: string;
  label: string;
};

/**
 * Hızlı index ve iç link gücü için ticari niyeti yüksek blog URL'leri.
 * Slug'lar veritabanına eklenen blog setiyle uyumludur.
 */
export const PRIORITY_BLOG_LINKS: PrioritySeoLink[] = [
  {
    href: '/blog/ev-temizligi-fiyatlari-2026-istanbul',
    label: 'Ev Temizliği Fiyatları 2026',
  },
  {
    href: '/blog/zekeriyakoy-temizlik-fiyatlari-2026',
    label: 'Zekeriyaköy Temizlik Fiyatları 2026',
  },
  {
    href: '/blog/istanbul-temizlik-fiyatlari-online-hesaplama-2026',
    label: 'İstanbul Temizlik Fiyatları Online Hesaplama',
  },
  {
    href: '/blog/ofis-temizligi-fiyatlari-2026-istanbul',
    label: 'Ofis Temizliği Fiyatları 2026',
  },
  {
    href: '/blog/insaat-sonrasi-temizlik-fiyatlari-2026',
    label: 'İnşaat Sonrası Temizlik Fiyatları 2026',
  },
  {
    href: '/blog/istanbul-temizlik-sirketleri-rehberi-dogru-firma-secimi-icin-12-kriter',
    label: 'İstanbul Temizlik Şirketleri Rehberi',
  },
  {
    href: '/blog/istanbul-ev-temizligi-fiyatlarini-etkileyen-10-faktor-ve-dogru-butceleme',
    label: 'İstanbul Ev Temizliği Fiyat Rehberi',
  },
  {
    href: '/blog/istanbul-ofis-temizligi-verimliligi-artiran-kurumsal-temizlik-plani',
    label: 'İstanbul Ofis Temizliği Planı',
  },
  {
    href: '/blog/istanbul-insaat-sonrasi-temizlik-teslim-oncesi-profesyonel-kontrol-rehberi',
    label: 'İnşaat Sonrası Temizlik Kontrol Rehberi',
  },
  {
    href: '/blog/guvenilir-temizlik-sirketi-istanbul-icin-referans-ve-sozlesme-kontrolu',
    label: 'Güvenilir Temizlik Şirketi Seçimi',
  },
  {
    href: '/blog/temizlik-sirketi-fiyatlari-istanbul-paket-sure-ve-kapsam-karsilastirmasi',
    label: 'Temizlik Şirketi Fiyatları İstanbul',
  },
  {
    href: '/blog/bos-ev-temizligi-istanbul-kiralama-ve-satis-oncesi-hazirlik-listesi',
    label: 'Boş Ev Temizliği İstanbul',
  },
  {
    href: '/blog/tasinma-sonrasi-temizlik-istanbul-eve-yerlesmeden-once-yapilacaklar',
    label: 'Taşınma Sonrası Temizlik İstanbul',
  },
  {
    href: '/blog/dis-cephe-cam-temizligi-istanbul-guvenlik-ve-ekipman-standartlari',
    label: 'Dış Cephe Cam Temizliği İstanbul',
  },
  {
    href: '/blog/koltuk-yikama-istanbul-kumas-turune-gore-dogru-yikama-yontemi',
    label: 'Koltuk Yıkama İstanbul',
  },
];

/**
 * Sitenin ticari dönüşüm odaklı ana URL kümeleri.
 */
export const PRIORITY_CONVERSION_LINKS: PrioritySeoLink[] = [
  { href: '/fiyat-hesaplama', label: 'Fiyat Hesaplama' },
  { href: '/randevu', label: 'Randevu Oluştur' },
  { href: '/hizmetler', label: 'Tüm Hizmetler' },
  { href: '/hizmetler/ofis-temizligi', label: 'Ofis Temizliği' },
  { href: '/hizmetler/insaat-sonrasi-temizlik', label: 'İnşaat Sonrası Temizlik' },
  { href: '/hizmetler/koltuk-yikama', label: 'Koltuk Yıkama' },
  { href: '/bolgeler', label: 'İstanbul Hizmet Bölgeleri' },
  { href: '/iletisim', label: 'İletişim ve Ücretsiz Keşif' },
];
