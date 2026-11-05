import {
  HERO_GEO_FALLBACK,
  HERO_GEO_MAX_KM,
  HERO_GEO_POINTS,
  ISTANBUL_BOUNDS,
  type HeroGeoPoint,
} from '@/config/istanbul-geo-points';

export type ResolvedHeroPlace = {
  label: string;
  badge: string;
  href: string;
  source: 'geo' | 'fallback' | 'cache';
  slug?: string;
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function isInsideIstanbul(lat: number, lng: number): boolean {
  return (
    lat >= ISTANBUL_BOUNDS.minLat &&
    lat <= ISTANBUL_BOUNDS.maxLat &&
    lng >= ISTANBUL_BOUNDS.minLng &&
    lng <= ISTANBUL_BOUNDS.maxLng
  );
}

function toResolved(point: HeroGeoPoint): ResolvedHeroPlace {
  const badge =
    point.kind === 'neighborhood'
      ? `${point.label} · Sarıyer · İstanbul`
      : `${point.label} · İstanbul`;
  return {
    label: point.label,
    badge,
    href: point.href,
    source: 'geo',
    slug: point.slug,
  };
}

export function resolveVisitorArea(lat: number, lng: number): ResolvedHeroPlace {
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !isInsideIstanbul(lat, lng)) {
    return { ...HERO_GEO_FALLBACK, source: 'fallback' };
  }

  let best: { point: HeroGeoPoint; km: number } | null = null;

  for (const point of HERO_GEO_POINTS) {
    const km = haversineKm(lat, lng, point.lat, point.lng);
    if (km > HERO_GEO_MAX_KM) continue;
    // Semt eşleşmesinde +0.8 km avantaj (aynı ilçe merkezine yakınken semt öne çıksın)
    const score = point.kind === 'neighborhood' ? km - 0.8 : km;
    if (!best || score < best.km) {
      best = { point, km: score };
    }
  }

  if (!best) {
    return { ...HERO_GEO_FALLBACK, source: 'fallback' };
  }

  return toResolved(best.point);
}

export function fallbackHeroPlace(): ResolvedHeroPlace {
  return { ...HERO_GEO_FALLBACK, source: 'fallback' };
}
