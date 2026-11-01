/**
 * Root layout JSON-LD — SiteSettings + getSiteUrl ile NAP / sosyal / site içi arama uyumu.
 */
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { SITE_CONTACT } from '@/config/site-contact';
import { GEO_AREA_SERVED_PRIORITY, GEO_NAP, getGeoSameAsUrls } from '@/config/geo-entity';
import { SERVICE_LANDINGS } from '@/config/programmatic-seo';
import { getSiteUrl, serializeSchemaGraph } from '@/lib/seo';

function toAbsoluteUrl(base: string, pathOrUrl: string | null | undefined): string | undefined {
  if (!pathOrUrl?.trim()) return undefined;
  const t = pathOrUrl.trim();
  if (/^https?:\/\//i.test(t)) return t;
  const path = t.startsWith('/') ? t : `/${t}`;
  return `${base}${path}`;
}

/** Türkiye GSM görünümünden E.164 tahmini; başarısızsa undefined */
function guessE164FromDisplay(phone: string): string | undefined {
  const d = phone.replace(/\D/g, '');
  if (d.length === 10 && d.startsWith('5')) return `+90${d}`;
  if (d.length === 11 && d.startsWith('0')) return `+90${d.slice(1)}`;
  if (d.length >= 12 && d.startsWith('90')) return `+${d}`;
  return undefined;
}

const getCachedSiteSettingsForSchema = unstable_cache(
  async () =>
    prisma.siteSettings.findFirst({
      select: {
        siteName: true,
        siteDescription: true,
        phone: true,
        email: true,
        address: true,
        logo: true,
        ogImage: true,
        facebook: true,
        instagram: true,
        twitter: true,
        linkedin: true,
        youtube: true,
        workingHours: true,
      },
    }),
  ['root-seo-site-settings'],
  { revalidate: 3600 }
);

export async function buildRootSchemaGraphJson(): Promise<string> {
  const base = getSiteUrl();
  const settings = await getCachedSiteSettingsForSchema();

  const siteName = settings?.siteName?.trim() || 'Zümrüt Vadi Temizlik';
  const description =
    settings?.siteDescription?.trim() ||
    "İstanbul'un önde gelen profesyonel temizlik şirketi. İnşaat sonrası, ofis, ev temizliği ve koltuk yıkama hizmetleri.";
  const email = settings?.email?.trim() || SITE_CONTACT.email;
  const phoneDisplay = settings?.phone?.trim() || SITE_CONTACT.phoneDisplay;
  const telephone =
    guessE164FromDisplay(phoneDisplay) || SITE_CONTACT.phoneE164;
  // NAP tek kaynak: GEO_NAP (site-contact). DB address serbest metin olabilir — schema'ya uydurma sokak no yok.
  const addressLine = GEO_NAP.streetAddress;

  const logoUrl = toAbsoluteUrl(base, settings?.logo) ?? `${base}/logo.png`;
  const ogUrl = toAbsoluteUrl(base, settings?.ogImage) ?? `${base}/og-image.jpg`;

  // Varsayılan: Zekeriyaköy hattı centroid — GBP pin ile hizalamak için env override
  const lat = Number(process.env.NEXT_PUBLIC_BUSINESS_LAT ?? '41.1669');
  const lng = Number(process.env.NEXT_PUBLIC_BUSINESS_LNG ?? '29.0577');

  const sameAs = getGeoSameAsUrls(base).concat(
    [settings?.facebook, settings?.instagram, settings?.twitter, settings?.linkedin, settings?.youtube]
      .map((u) => u?.trim())
      .filter((u): u is string => Boolean(u && /^https?:\/\//i.test(u)))
  );
  const uniqueSameAs = [...new Set(sameAs)];

  const organization: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: siteName,
    url: base,
    logo: logoUrl,
    email,
    telephone,
    description,
    foundingDate: '2010',
    address: {
      '@type': 'PostalAddress',
      streetAddress: GEO_NAP.streetAddress,
      addressLocality: GEO_NAP.addressLocality,
      addressRegion: GEO_NAP.addressRegion,
      postalCode: GEO_NAP.postalCode,
      addressCountry: GEO_NAP.addressCountry,
    },
    ...(uniqueSameAs.length > 0 ? { sameAs: uniqueSameAs } : {}),
  };

  const areaServed = GEO_AREA_SERVED_PRIORITY.map((name) => {
    const isAdmin =
      name === 'İstanbul' || name.includes('Yakası') || name === 'İstanbul Avrupa Yakası';
    return {
      '@type': isAdmin ? 'AdministrativeArea' : 'City',
      name,
    };
  });

  const makesOffer = SERVICE_LANDINGS.map((s) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: s.name,
      description: s.shortPitch,
      url: `${base}/hizmetler/${s.slug}`,
      areaServed: areaServed.slice(0, 5),
      provider: { '@id': `${base}/#business` },
    },
  }));

  const localBusiness: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'CleaningService'],
    additionalType: 'https://schema.org/HouseCleaner',
    '@id': `${base}/#business`,
    name: siteName,
    url: base,
    logo: logoUrl,
    image: [logoUrl, ogUrl],
    telephone,
    email,
    description,
    parentOrganization: { '@id': `${base}/#organization` },
    address: {
      '@type': 'PostalAddress',
      streetAddress: GEO_NAP.streetAddress,
      addressLocality: GEO_NAP.addressLocality,
      addressRegion: GEO_NAP.addressRegion,
      postalCode: GEO_NAP.postalCode,
      addressCountry: GEO_NAP.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    areaServed,
    makesOffer,
    knowsAbout: [
      'Sarıyer temizlik',
      'Zekeriyaköy villa temizliği',
      'İnşaat sonrası temizlik',
      'Ofis temizliği',
      'Ev temizliği',
      'Uskumruköy temizlik',
    ],
    priceRange: '₺₺',
    foundingDate: '2010',
    hasMap: `https://www.google.com/maps?q=${encodeURIComponent(addressLine)}`,
  };

  if (uniqueSameAs.length > 0) {
    localBusiness.sameAs = uniqueSameAs;
  }

  const webSite: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    url: `${base}/`,
    name: siteName,
    description: settings?.siteDescription?.trim() || description,
    inLanguage: 'tr-TR',
    publisher: {
      '@id': `${base}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${base}/ara?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return serializeSchemaGraph([organization, localBusiness, webSite]);
}
