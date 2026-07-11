'use client';

import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

const STATIC_MAP_SRC =
  'https://staticmap.openstreetmap.de/staticmap.php?center=41.1669,29.0577&zoom=14&size=800x450&markers=41.1669,29.0577,red-pushpin';

interface MapsLazySectionProps {
  embedSrc: string;
  mapsOpenHref: string;
  title?: string;
}

/**
 * Harita sayfası — mobilde statik önizleme, iframe yalnızca istek üzerine.
 * Google Maps iframe ağır; LCP/INP için lazy yüklenir.
 */
export function MapsLazySection({
  embedSrc,
  mapsOpenHref,
  title = 'Zümrüt Vadi Temizlik konumu',
}: MapsLazySectionProps) {
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedLoading, setEmbedLoading] = useState(false);

  const loadEmbed = () => {
    setEmbedLoading(true);
    setShowEmbed(true);
  };

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/30">
      {!showEmbed ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element -- harici OSM statik harita */}
          <img
            src={STATIC_MAP_SRC}
            alt={`${title} — Sarıyer, İstanbul statik harita önizlemesi`}
            width={800}
            height={450}
            className="h-auto w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p className="flex items-center gap-2 text-sm text-slate-200">
              <MapPin className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              Sarıyer Merkez, İstanbul
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <a
                href={mapsOpenHref}
                data-source="gmb_map_static_preview"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                Haritada Aç
              </a>
              <button
                type="button"
                onClick={loadEmbed}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-600 bg-slate-900/70 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              >
                Etkileşimli Harita
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden">
          {embedLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/80">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400" aria-hidden="true" />
              <span className="sr-only">Harita yükleniyor</span>
            </div>
          )}
          <iframe
            src={embedSrc}
            width="100%"
            height="480"
            className="border-0"
            allowFullScreen
            loading="lazy"
            title={title}
            onLoad={() => setEmbedLoading(false)}
          />
        </div>
      )}
    </section>
  );
}

export default MapsLazySection;
