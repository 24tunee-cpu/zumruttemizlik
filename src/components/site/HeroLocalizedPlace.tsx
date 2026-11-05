'use client';

import { useEffect, useState } from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import { HERO_GEO_SSR_DEFAULT } from '@/config/istanbul-geo-points';
import {
  fallbackHeroPlace,
  resolveVisitorArea,
  type ResolvedHeroPlace,
} from '@/lib/resolve-visitor-area';

const CACHE_KEY = 'zvt-hero-place-v1';
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 saat
const GEO_TIMEOUT_MS = 4500;
/** LCP sonrası — mobil ana iş parçacığını meşgul etmesin */
const GEO_START_DELAY_MS = 1800;

type CachePayload = {
  exp: number;
  place: ResolvedHeroPlace;
};

function readCache(): ResolvedHeroPlace | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachePayload;
    if (!parsed?.place?.label || !parsed.exp || Date.now() > parsed.exp) return null;
    return { ...parsed.place, source: 'cache' };
  } catch {
    return null;
  }
}

function writeCache(place: ResolvedHeroPlace) {
  try {
    const payload: CachePayload = {
      exp: Date.now() + CACHE_TTL_MS,
      place: { ...place, source: 'cache' },
    };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    /* private mode */
  }
}

function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('unsupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: GEO_TIMEOUT_MS,
      maximumAge: 10 * 60 * 1000,
    });
  });
}

/**
 * Hero badge + H1 konum satırı — SSR SEO metni hemen görünür;
 * konum izni varsa ilçe/semt, yoksa / timeout’ta İstanbul geneli.
 */
export function HeroLocalizedPlace() {
  const [place, setPlace] = useState<ResolvedHeroPlace>({
    ...HERO_GEO_SSR_DEFAULT,
    source: 'fallback',
  });
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const apply = (next: ResolvedHeroPlace) => {
      if (cancelled) return;
      setPlace(next);
      setResolved(true);
      if (next.source === 'geo' || next.source === 'fallback') {
        writeCache(next);
      }
    };

    const cached = readCache();
    if (cached) {
      apply(cached);
      return;
    }

    const run = async () => {
      // İzin önceden reddedildiyse popup açmadan fallback
      try {
        if (navigator.permissions?.query) {
          const status = await navigator.permissions.query({
            name: 'geolocation' as PermissionName,
          });
          if (status.state === 'denied') {
            apply(fallbackHeroPlace());
            return;
          }
        }
      } catch {
        /* Safari eski — devam */
      }

      try {
        const pos = await getPosition();
        const next = resolveVisitorArea(pos.coords.latitude, pos.coords.longitude);
        apply(next);
      } catch {
        apply(fallbackHeroPlace());
      }
    };

    const start = () => {
      if (cancelled) return;
      void run();
    };

    // Idle veya kısa gecikme — mobil LCP/INP dostu
    let idleId: number | undefined;
    const timeoutId = window.setTimeout(start, GEO_START_DELAY_MS);
    if (typeof window.requestIdleCallback === 'function') {
      window.clearTimeout(timeoutId);
      idleId = window.requestIdleCallback(start, { timeout: GEO_START_DELAY_MS + 500 });
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <div className="hero-enter inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-400 backdrop-blur-sm sm:px-4 sm:py-2">
        {resolved && place.source !== 'fallback' ? (
          <MapPin size={16} className="shrink-0" aria-hidden="true" />
        ) : (
          <Sparkles
            size={16}
            className="shrink-0 max-md:animate-none md:animate-spin md:[animation-duration:3s]"
            aria-hidden="true"
          />
        )}
        <span className="truncate text-xs font-medium sm:text-sm">{place.badge}</span>
      </div>

      <h1 className="hero-enter hero-enter-delay-1 mt-6 text-balance text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
        <span className="transition-opacity duration-300">{place.label}</span>{' '}
        <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
          temizlik
        </span>{' '}
        şirketi
      </h1>
    </>
  );
}

export default HeroLocalizedPlace;
