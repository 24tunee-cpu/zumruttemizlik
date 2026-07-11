/**
 * Blog silo cluster'ları — niyet (use-case) bazlı içerik kümeleri.
 * Her silo: pillar (/cozumler) + cluster blog yazıları + dönüşüm linkleri.
 */

export type BlogSiloBlogLink = {
  slug: string;
  label: string;
};

export type BlogSiloCluster = {
  slug: string;
  name: string;
  description: string;
  pillarHref: string;
  pillarLabel: string;
  intentSlug: string;
  blogLinks: BlogSiloBlogLink[];
  /** Yerel SEO — Sarıyer hattı semt sayfaları */
  neighborhoodLinks: { href: string; label: string }[];
};

const SARIYER_NEIGHBORHOODS = [
  { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy' },
  { href: '/bolgeler/sariyer/maslak', label: 'Maslak' },
  { href: '/bolgeler/sariyer/tarabya', label: 'Tarabya' },
  { href: '/bolgeler/sariyer/bahcekoy', label: 'Bahçeköy' },
];

export const BLOG_SILO_CLUSTERS: BlogSiloCluster[] = [
  {
    slug: 'insaat-sonrasi',
    name: 'İnşaat & Tadilat Sonrası',
    description:
      'Teslim öncesi detay temizlik, ince toz ve boya izleri için rehberler, fiyat ipuçları ve profesyonel süreç adımları.',
    pillarHref: '/cozumler/insaat-sonrasi-temizlik',
    pillarLabel: 'İnşaat Sonrası Temizlik Çözümü',
    intentSlug: 'insaat-sonrasi-temizlik',
    blogLinks: [
      {
        slug: 'insaat-sonrasi-temizlik-fiyatlari-2026',
        label: 'İnşaat Sonrası Temizlik Fiyatları 2026',
      },
      {
        slug: 'istanbul-insaat-sonrasi-temizlik-teslim-oncesi-profesyonel-kontrol-rehberi',
        label: 'Teslim Öncesi Kontrol Rehberi',
      },
    ],
    neighborhoodLinks: SARIYER_NEIGHBORHOODS,
  },
  {
    slug: 'tasinma',
    name: 'Taşınma Temizliği',
    description:
      'Taşınma öncesi ve sonrası temizlik checklist’leri, bütçeleme ve eve yerleşmeden önce yapılacaklar.',
    pillarHref: '/cozumler/tasinma-temizligi',
    pillarLabel: 'Taşınma Temizliği Çözümü',
    intentSlug: 'tasinma-temizligi',
    blogLinks: [
      {
        slug: 'tasinma-sonrasi-temizlik-istanbul-eve-yerlesmeden-once-yapilacaklar',
        label: 'Taşınma Sonrası Temizlik Rehberi',
      },
      {
        slug: 'istanbul-ev-temizligi-fiyatlarini-etkileyen-10-faktor-ve-dogru-butceleme',
        label: 'Ev Temizliği Bütçeleme Rehberi',
      },
    ],
    neighborhoodLinks: SARIYER_NEIGHBORHOODS,
  },
  {
    slug: 'kira-teslim',
    name: 'Kira Teslim & Depozito',
    description:
      'Kira öncesi/sonrası temizlik, depozito iadesi ve mal sahibi-kiracı teslim standartları.',
    pillarHref: '/cozumler/kira-teslim-temizligi',
    pillarLabel: 'Kira Teslim Temizliği Çözümü',
    intentSlug: 'kira-teslim-temizligi',
    blogLinks: [
      {
        slug: 'bos-ev-temizligi-istanbul-kiralama-ve-satis-oncesi-hazirlik-listesi',
        label: 'Kiralama Öncesi Hazırlık Listesi',
      },
      {
        slug: 'ev-temizligi-fiyatlari-2026-istanbul',
        label: 'Ev Temizliği Fiyatları 2026',
      },
    ],
    neighborhoodLinks: SARIYER_NEIGHBORHOODS,
  },
  {
    slug: 'bos-ev',
    name: 'Boş Ev & Satış Öncesi',
    description:
      'Satış, kiralama veya devir öncesi boş ev temizliği — hızlı teslim ve fotoğraf çekimine hazır görünüm.',
    pillarHref: '/cozumler/bos-ev-temizligi',
    pillarLabel: 'Boş Ev Temizliği Çözümü',
    intentSlug: 'bos-ev-temizligi',
    blogLinks: [
      {
        slug: 'bos-ev-temizligi-istanbul-kiralama-ve-satis-oncesi-hazirlik-listesi',
        label: 'Boş Ev Hazırlık Listesi',
      },
      {
        slug: 'zekeriyakoy-temizlik-fiyatlari-2026',
        label: 'Zekeriyaköy Temizlik Fiyatları 2026',
      },
    ],
    neighborhoodLinks: SARIYER_NEIGHBORHOODS,
  },
  {
    slug: 'ofis-kurumsal',
    name: 'Ofis & Kurumsal',
    description:
      'Plaza, ofis katı ve kurumsal alanlarda düzenli hijyen planı, fiyatlandırma ve verimlilik rehberleri.',
    pillarHref: '/cozumler/ofis-temizligi',
    pillarLabel: 'Ofis Temizliği Çözümü',
    intentSlug: 'ofis-temizligi',
    blogLinks: [
      {
        slug: 'ofis-temizligi-fiyatlari-2026-istanbul',
        label: 'Ofis Temizliği Fiyatları 2026',
      },
      {
        slug: 'istanbul-ofis-temizligi-verimliligi-artiran-kurumsal-temizlik-plani',
        label: 'Kurumsal Temizlik Planı Rehberi',
      },
    ],
    neighborhoodLinks: [
      { href: '/bolgeler/sariyer/maslak', label: 'Maslak Ofis Temizliği' },
      { href: '/bolgeler/sisli', label: 'Şişli' },
      { href: '/bolgeler/besiktas', label: 'Beşiktaş' },
    ],
  },
];

export function getBlogSiloBySlug(slug: string): BlogSiloCluster | undefined {
  return BLOG_SILO_CLUSTERS.find((s) => s.slug === slug);
}

export function allBlogSiloSlugs(): string[] {
  return BLOG_SILO_CLUSTERS.map((s) => s.slug);
}

export function allBlogSiloPaths(): string[] {
  return BLOG_SILO_CLUSTERS.map((s) => `/blog/silo/${s.slug}`);
}
