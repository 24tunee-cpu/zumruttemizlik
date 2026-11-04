/**
 * Merkezi iç link kuralları — hub → spoke, spam olmadan.
 * Sarıyer / Zekeriyaköy öncelikli; yalnızca gerçek slug'lar.
 */
import {
  DISTRICT_LANDINGS,
  SERVICE_LANDINGS,
  getNeighborhoodLandingsForDistrict,
  getServiceBySlug,
  getDistrictBySlug,
} from '@/config/programmatic-seo';
import { INTENT_LANDINGS } from '@/config/intent-seo';

export type SeoLinkItem = { href: string; label: string };

/** Hizmet sayfalarında öne çıkan ilçeler (önce Sarıyer) */
export const PRIORITY_DISTRICT_SLUGS = [
  'sariyer',
  'kadikoy',
  'besiktas',
  'sisli',
  'uskudar',
  'atasehir',
  'bakirkoy',
  'kagithane',
  'maltepe',
  'umraniye',
  'eyupsultan',
  'fatih',
] as const;

const CTA_LINKS: SeoLinkItem[] = [
  { href: '/fiyat-hesaplama', label: 'Online fiyat hesaplama' },
  { href: '/randevu', label: 'Ücretsiz keşif randevusu' },
  { href: '/iletisim', label: 'İletişim' },
];

export function dedupeSeoLinks(links: SeoLinkItem[]): SeoLinkItem[] {
  const seen = new Set<string>();
  return links.filter((l) => {
    if (!l.href || seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
}

/** /hizmetler/[slug] → öncelikli ilçe×hizmet + hub + CTA */
export function buildServicePageSeoLinks(serviceSlug: string, serviceTitle: string): {
  districts: SeoLinkItem[];
  hubs: SeoLinkItem[];
  intents: SeoLinkItem[];
  cta: SeoLinkItem[];
} {
  const districts = PRIORITY_DISTRICT_SLUGS.map((dSlug) => {
    const d = getDistrictBySlug(dSlug);
    if (!d) return null;
    return {
      href: `/bolgeler/${d.slug}/${serviceSlug}`,
      label: `${d.name} ${serviceTitle}`,
    };
  }).filter((x): x is SeoLinkItem => Boolean(x));

  const hubs: SeoLinkItem[] = [
    { href: '/hizmetler', label: 'Tüm temizlik hizmetleri' },
    { href: '/bolgeler', label: 'İstanbul bölge sayfaları' },
    { href: `/bolgeler/sariyer/${serviceSlug}`, label: `Sarıyer ${serviceTitle}` },
    { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy temizlik' },
    { href: '/cozumler', label: 'Temizlik çözüm rehberleri' },
    { href: '/rehber', label: 'Temizlik karar rehberi' },
    { href: '/geo-sss', label: 'İlçe SSS rehberleri' },
  ];

  const intents = INTENT_LANDINGS.slice(0, 4).map((i) => ({
    href: `/cozumler/${i.slug}`,
    label: i.name,
  }));

  return {
    districts: dedupeSeoLinks(districts),
    hubs: dedupeSeoLinks(hubs),
    intents: dedupeSeoLinks(intents),
    cta: CTA_LINKS,
  };
}

/** İlçe×hizmet sayfası → diğer hizmetler, semt landings, hub */
export function buildProgrammaticPairSeoLinks(
  districtSlug: string,
  serviceSlug: string
): {
  otherServices: SeoLinkItem[];
  neighborhoods: SeoLinkItem[];
  hubs: SeoLinkItem[];
  cta: SeoLinkItem[];
} {
  const district = getDistrictBySlug(districtSlug);
  const service = getServiceBySlug(serviceSlug);
  if (!district || !service) {
    return { otherServices: [], neighborhoods: [], hubs: [], cta: CTA_LINKS };
  }

  const otherServices = SERVICE_LANDINGS.filter((s) => s.slug !== serviceSlug).map((s) => ({
    href: `/bolgeler/${districtSlug}/${s.slug}`,
    label: `${district.name} ${s.name}`,
  }));

  const neighborhoods = getNeighborhoodLandingsForDistrict(districtSlug).map((n) => ({
    href: `/bolgeler/${n.districtSlug}/${n.slug}`,
    label: `${n.name} temizlik`,
  }));

  const hubs: SeoLinkItem[] = [
    { href: `/bolgeler/${districtSlug}`, label: `${district.name} temizlik hub` },
    { href: `/hizmetler/${serviceSlug}`, label: `${service.name} hizmet detayı` },
    { href: '/bolgeler', label: 'Tüm bölgeler' },
    { href: '/hizmetler', label: 'Tüm hizmetler' },
    { href: '/cozumler', label: 'Çözüm rehberleri' },
    { href: '/geo-sss', label: 'GEO SSS' },
  ];

  if (districtSlug === 'sariyer') {
    hubs.unshift({ href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy temizlik' });
  }

  return {
    otherServices: dedupeSeoLinks(otherServices),
    neighborhoods: dedupeSeoLinks(neighborhoods),
    hubs: dedupeSeoLinks(hubs),
    cta: CTA_LINKS,
  };
}

/** Semt landing → hizmetler, komşu semtler, hub + CTA */
export function buildNeighborhoodSeoLinks(districtSlug: string, neighborhoodSlug: string): {
  services: SeoLinkItem[];
  siblings: SeoLinkItem[];
  hubs: SeoLinkItem[];
  cta: SeoLinkItem[];
} {
  const district = getDistrictBySlug(districtSlug);
  const siblings = getNeighborhoodLandingsForDistrict(districtSlug)
    .filter((n) => n.slug !== neighborhoodSlug)
    .map((n) => ({
      href: `/bolgeler/${n.districtSlug}/${n.slug}`,
      label: `${n.name} temizlik`,
    }));

  const services = SERVICE_LANDINGS.slice(0, 6).map((s) => ({
    href: `/bolgeler/${districtSlug}/${s.slug}`,
    label: `${district?.name ?? 'Bölge'} ${s.name}`,
  }));

  const hubs: SeoLinkItem[] = [
    { href: `/bolgeler/${districtSlug}`, label: `${district?.name ?? 'Bölge'} temizlik` },
    { href: '/bolgeler', label: 'Tüm bölgeler' },
    { href: '/hizmetler', label: 'Tüm hizmetler' },
    { href: '/cozumler', label: 'Çözüm rehberleri' },
    { href: '/geo-sss', label: 'GEO SSS' },
  ];

  return {
    services: dedupeSeoLinks(services),
    siblings: dedupeSeoLinks(siblings),
    hubs: dedupeSeoLinks(hubs),
    cta: CTA_LINKS,
  };
}

/** Geo-sss → bölge + hizmet + CTA (mevcut relatedLinks ile birleşir) */
export function buildGeoSssSeoLinks(params: {
  districtSlug: string;
  districtName: string;
  serviceSlug?: string;
  existing?: SeoLinkItem[];
}): SeoLinkItem[] {
  const { districtSlug, districtName, serviceSlug, existing = [] } = params;
  const extras: SeoLinkItem[] = [
    { href: `/bolgeler/${districtSlug}`, label: `${districtName} temizlik` },
    { href: '/bolgeler', label: 'Tüm bölgeler' },
    { href: '/hizmetler', label: 'Hizmetler' },
    { href: '/geo-sss', label: 'GEO SSS listesi' },
    ...CTA_LINKS,
  ];

  if (serviceSlug && getServiceBySlug(serviceSlug)) {
    const s = getServiceBySlug(serviceSlug)!;
    extras.unshift(
      { href: `/bolgeler/${districtSlug}/${serviceSlug}`, label: `${districtName} ${s.name}` },
      { href: `/hizmetler/${serviceSlug}`, label: s.name }
    );
  }

  return dedupeSeoLinks([...existing, ...extras]).slice(0, 12);
}

/** Hub strip — hizmetler / bölgeler / çözümler / rehber */
export function buildSiteHubStripLinks(): SeoLinkItem[] {
  return dedupeSeoLinks([
    { href: '/hizmetler', label: 'Hizmetler' },
    { href: '/bolgeler', label: 'Bölgeler' },
    { href: '/bolgeler/sariyer', label: 'Sarıyer' },
    { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy' },
    { href: '/bolgeler/sariyer/uskumrukoy', label: 'Uskumruköy' },
    { href: '/cozumler', label: 'Çözümler' },
    { href: '/rehber', label: 'Rehber' },
    { href: '/blog', label: 'Blog' },
    { href: '/fiyat-hesaplama', label: 'Fiyat hesapla' },
    { href: '/randevu', label: 'Randevu' },
    { href: '/geo-sss', label: 'GEO SSS' },
  ]);
}

/** Engagement / viral (v4–v6) blog → zorunlu temizlik hub köprüleri */
export const REQUIRED_ENGAGEMENT_BRIDGE_HREFS = [
  '/hizmetler/ev-temizligi',
  '/hizmetler/ofis-temizligi',
  '/bolgeler/sariyer',
  '/bolgeler/sariyer/zekeriyakoy',
  '/fiyat-hesaplama',
  '/randevu',
] as const;

export function buildEngagementBlogBridgeLinks(): SeoLinkItem[] {
  return dedupeSeoLinks([
    { href: '/hizmetler/ev-temizligi', label: 'Ev temizliği hizmeti' },
    { href: '/hizmetler/ofis-temizligi', label: 'Ofis temizliği hizmeti' },
    { href: '/hizmetler/insaat-sonrasi-temizlik', label: 'İnşaat sonrası temizlik' },
    { href: '/hizmetler/dis-cephe-temizligi', label: 'Dış cephe temizliği' },
    { href: '/bolgeler/sariyer', label: 'Sarıyer temizlik şirketi' },
    { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy temizlik' },
    { href: '/bolgeler/sariyer/ev-temizligi', label: 'Sarıyer ev temizliği' },
    { href: '/bolgeler/sariyer/uskumrukoy', label: 'Uskumruköy temizlik' },
    { href: '/fiyat-hesaplama', label: 'Online fiyat hesaplama' },
    { href: '/randevu', label: 'Ücretsiz keşif' },
    { href: '/rehber', label: 'Temizlik ve ev bakım rehberi' },
    { href: '/blog', label: 'Tüm blog yazıları' },
  ]);
}

/** v4/v5/v6 kuyruk veya viral engagement slug */
export function isEngagementBlogPost(slug: string, tags: string[] = []): boolean {
  const tagHit = tags.some(
    (t) =>
      /otomatik\s*yay[iı]n\s*v[456]/i.test(t) ||
      /engagement/i.test(t) ||
      /viral/i.test(t)
  );
  if (tagHit) return true;
  if (
    slug.startsWith('istanbul-') &&
    !slug.includes('temizlik') &&
    !slug.includes('fiyatlari')
  ) {
    return true;
  }
  return false;
}

/** Geçerli programmatic ilçe slug seti */
export const VALID_DISTRICT_SLUGS = new Set(DISTRICT_LANDINGS.map((d) => d.slug));
export const VALID_SERVICE_SLUGS = new Set(SERVICE_LANDINGS.map((s) => s.slug));
