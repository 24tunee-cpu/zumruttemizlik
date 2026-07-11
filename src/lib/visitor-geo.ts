import type { NextRequest } from 'next/server';

export type GeoInfo = {
  country: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
};

const COUNTRY_NAMES: Record<string, string> = {
  TR: 'Türkiye',
  DE: 'Almanya',
  US: 'Amerika Birleşik Devletleri',
  GB: 'Birleşik Krallık',
  NL: 'Hollanda',
  FR: 'Fransa',
  AZ: 'Azerbaycan',
  RU: 'Rusya',
  SA: 'Suudi Arabistan',
  AE: 'BAE',
};

export function geoFromRequest(request: NextRequest): GeoInfo {
  const countryCode =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    null;
  const city =
    decodeHeader(request.headers.get('x-vercel-ip-city')) ||
    decodeHeader(request.headers.get('cf-ipcity')) ||
    null;
  const region =
    decodeHeader(request.headers.get('x-vercel-ip-country-region')) ||
    decodeHeader(request.headers.get('cf-region')) ||
    null;

  const country = countryCode
    ? COUNTRY_NAMES[countryCode.toUpperCase()] || countryCode
    : null;

  return {
    country,
    countryCode: countryCode?.toUpperCase() || null,
    region,
    city,
  };
}

function decodeHeader(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function locationLabel(geo: Pick<GeoInfo, 'city' | 'region' | 'country' | 'countryCode'>): string {
  const parts = [geo.city, geo.region, geo.country].filter(Boolean);
  if (parts.length > 0) return parts.join(', ');
  if (geo.countryCode) return geo.countryCode;
  return 'Konum bilinmiyor';
}
