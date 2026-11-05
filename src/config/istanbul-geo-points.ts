/**
 * Hero konum kişiselleştirmesi — yaklaşık merkez noktaları (Nominatim/API yok).
 * Yalnızca sitede sayfası olan ilçe/semtler; sahte şube yok.
 */

export type HeroGeoPoint = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  /** Semt öncelikli; aynı mesafede semt > ilçe */
  kind: 'district' | 'neighborhood';
  /** Badge / H1 için kısa etiket */
  label: string;
  /** Opsiyonel iç link */
  href: string;
  /** İlçe slug (semtler için) */
  districtSlug: string;
};

/** İstanbul bounding box — dışı / eşleşmez → İstanbul geneli */
export const ISTANBUL_BOUNDS = {
  minLat: 40.8,
  maxLat: 41.35,
  minLng: 28.45,
  maxLng: 29.45,
} as const;

/** En yakın nokta bu km üstündeyse eşleşme sayma */
export const HERO_GEO_MAX_KM = 14;

/**
 * Öncelik: Sarıyer semtleri (daha sıkı merkez), sonra 18 ilçe.
 * Koordinatlar yaklaşık merkez; navigasyon pin’i değil.
 */
export const HERO_GEO_POINTS: readonly HeroGeoPoint[] = [
  // Semtler (Sarıyer hattı) — önce eşleşsin
  {
    slug: 'zekeriyakoy',
    name: 'Zekeriyaköy',
    lat: 41.195,
    lng: 29.03,
    kind: 'neighborhood',
    label: 'Zekeriyaköy',
    href: '/bolgeler/sariyer/zekeriyakoy',
    districtSlug: 'sariyer',
  },
  {
    slug: 'uskumrukoy',
    name: 'Uskumruköy',
    lat: 41.185,
    lng: 29.01,
    kind: 'neighborhood',
    label: 'Uskumruköy',
    href: '/bolgeler/sariyer/uskumrukoy',
    districtSlug: 'sariyer',
  },
  {
    slug: 'bahcekoy',
    name: 'Bahçeköy',
    lat: 41.175,
    lng: 28.99,
    kind: 'neighborhood',
    label: 'Bahçeköy',
    href: '/bolgeler/sariyer/bahcekoy',
    districtSlug: 'sariyer',
  },
  {
    slug: 'tarabya',
    name: 'Tarabya',
    lat: 41.138,
    lng: 29.055,
    kind: 'neighborhood',
    label: 'Tarabya',
    href: '/bolgeler/sariyer/tarabya',
    districtSlug: 'sariyer',
  },
  {
    slug: 'maslak',
    name: 'Maslak',
    lat: 41.108,
    lng: 29.02,
    kind: 'neighborhood',
    label: 'Maslak',
    href: '/bolgeler/sariyer/maslak',
    districtSlug: 'sariyer',
  },
  // İlçeler
  {
    slug: 'sariyer',
    name: 'Sarıyer',
    lat: 41.166,
    lng: 29.057,
    kind: 'district',
    label: 'Sarıyer',
    href: '/bolgeler/sariyer',
    districtSlug: 'sariyer',
  },
  {
    slug: 'besiktas',
    name: 'Beşiktaş',
    lat: 41.043,
    lng: 29.006,
    kind: 'district',
    label: 'Beşiktaş',
    href: '/bolgeler/besiktas',
    districtSlug: 'besiktas',
  },
  {
    slug: 'sisli',
    name: 'Şişli',
    lat: 41.06,
    lng: 28.987,
    kind: 'district',
    label: 'Şişli',
    href: '/bolgeler/sisli',
    districtSlug: 'sisli',
  },
  {
    slug: 'kagithane',
    name: 'Kağıthane',
    lat: 41.08,
    lng: 28.973,
    kind: 'district',
    label: 'Kağıthane',
    href: '/bolgeler/kagithane',
    districtSlug: 'kagithane',
  },
  {
    slug: 'eyupsultan',
    name: 'Eyüpsultan',
    lat: 41.055,
    lng: 28.922,
    kind: 'district',
    label: 'Eyüpsultan',
    href: '/bolgeler/eyupsultan',
    districtSlug: 'eyupsultan',
  },
  {
    slug: 'fatih',
    name: 'Fatih',
    lat: 41.02,
    lng: 28.94,
    kind: 'district',
    label: 'Fatih',
    href: '/bolgeler/fatih',
    districtSlug: 'fatih',
  },
  {
    slug: 'bakirkoy',
    name: 'Bakırköy',
    lat: 40.98,
    lng: 28.857,
    kind: 'district',
    label: 'Bakırköy',
    href: '/bolgeler/bakirkoy',
    districtSlug: 'bakirkoy',
  },
  {
    slug: 'bahcelievler',
    name: 'Bahçelievler',
    lat: 41.002,
    lng: 28.86,
    kind: 'district',
    label: 'Bahçelievler',
    href: '/bolgeler/bahcelievler',
    districtSlug: 'bahcelievler',
  },
  {
    slug: 'zeytinburnu',
    name: 'Zeytinburnu',
    lat: 40.993,
    lng: 28.904,
    kind: 'district',
    label: 'Zeytinburnu',
    href: '/bolgeler/zeytinburnu',
    districtSlug: 'zeytinburnu',
  },
  {
    slug: 'bayrampasa',
    name: 'Bayrampaşa',
    lat: 41.048,
    lng: 28.9,
    kind: 'district',
    label: 'Bayrampaşa',
    href: '/bolgeler/bayrampasa',
    districtSlug: 'bayrampasa',
  },
  {
    slug: 'gaziosmanpasa',
    name: 'Gaziosmanpaşa',
    lat: 41.078,
    lng: 28.901,
    kind: 'district',
    label: 'Gaziosmanpaşa',
    href: '/bolgeler/gaziosmanpasa',
    districtSlug: 'gaziosmanpasa',
  },
  {
    slug: 'uskudar',
    name: 'Üsküdar',
    lat: 41.025,
    lng: 29.015,
    kind: 'district',
    label: 'Üsküdar',
    href: '/bolgeler/uskudar',
    districtSlug: 'uskudar',
  },
  {
    slug: 'kadikoy',
    name: 'Kadıköy',
    lat: 40.99,
    lng: 29.03,
    kind: 'district',
    label: 'Kadıköy',
    href: '/bolgeler/kadikoy',
    districtSlug: 'kadikoy',
  },
  {
    slug: 'atasehir',
    name: 'Ataşehir',
    lat: 40.992,
    lng: 29.127,
    kind: 'district',
    label: 'Ataşehir',
    href: '/bolgeler/atasehir',
    districtSlug: 'atasehir',
  },
  {
    slug: 'umraniye',
    name: 'Ümraniye',
    lat: 41.025,
    lng: 29.12,
    kind: 'district',
    label: 'Ümraniye',
    href: '/bolgeler/umraniye',
    districtSlug: 'umraniye',
  },
  {
    slug: 'maltepe',
    name: 'Maltepe',
    lat: 40.935,
    lng: 29.131,
    kind: 'district',
    label: 'Maltepe',
    href: '/bolgeler/maltepe',
    districtSlug: 'maltepe',
  },
  {
    slug: 'kartal',
    name: 'Kartal',
    lat: 40.889,
    lng: 29.185,
    kind: 'district',
    label: 'Kartal',
    href: '/bolgeler/kartal',
    districtSlug: 'kartal',
  },
  {
    slug: 'pendik',
    name: 'Pendik',
    lat: 40.878,
    lng: 29.25,
    kind: 'district',
    label: 'Pendik',
    href: '/bolgeler/pendik',
    districtSlug: 'pendik',
  },
] as const;

export const HERO_GEO_FALLBACK = {
  label: 'İstanbul geneli',
  badge: 'İstanbul geneli · temizlik hizmeti',
  href: '/bolgeler',
} as const;

/** SSR / SEO varsayılanı — crawl ve LCP (öncelik bölge) */
export const HERO_GEO_SSR_DEFAULT = {
  label: 'Sarıyer & Zekeriyaköy',
  badge: 'Sarıyer · Zekeriyaköy · İstanbul Avrupa Yakası',
  href: '/bolgeler/sariyer',
} as const;
