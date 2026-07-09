/**
 * @fileoverview Hero Price Calculator
 * @description Ana sayfa hero bölümünde yer alan anlık fiyat hesaplama ve
 * WhatsApp üzerinden randevu/iletişim aracı.
 *
 * Fiyatlar İstanbul piyasası (orta–üst segment, 2026) baz alınarak belirlenmiştir.
 * Bunlar TAHMİNÎ aralıklardır; kesin fiyat ücretsiz keşif sonrası netleşir.
 */

'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Building2,
  Store,
  HardHat,
  Building,
  Calculator,
  MessageCircle,
  Sparkles,
  Check,
} from 'lucide-react';
import { SITE_CONTACT } from '@/config/site-contact';

// ============================================
// TİPLER
// ============================================

type SpaceTypeId = 'ev' | 'ofis' | 'isyeri' | 'insaat' | 'discephe';
type PriceRange = readonly [number, number];

interface SpaceType {
  id: SpaceTypeId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  mode: 'room' | 'm2';
  /** m² modunda alan etiketi */
  unitLabel?: string;
}

// ============================================
// FİYAT VERİLERİ (orta–üst segment, 2026 piyasa)
// ============================================

const SPACE_TYPES: SpaceType[] = [
  { id: 'ev', label: 'Ev / Daire', icon: Home, mode: 'room' },
  { id: 'ofis', label: 'Ofis', icon: Building2, mode: 'm2', unitLabel: 'Ofis alanı (m²)' },
  { id: 'isyeri', label: 'İşyeri / Dükkan', icon: Store, mode: 'm2', unitLabel: 'Alan (m²)' },
  { id: 'insaat', label: 'İnşaat Sonrası', icon: HardHat, mode: 'm2', unitLabel: 'Alan (m²)' },
  { id: 'discephe', label: 'Dış Cephe', icon: Building, mode: 'm2', unitLabel: 'Cephe alanı (m²)' },
];

/** Ev — oda paketi (tek seferlik detaylı temizlik), [alt, üst] TL */
const ROOM_PRICES: Record<string, PriceRange> = {
  '1+1': [3500, 4500],
  '2+1': [5000, 6500],
  '3+1': [6500, 8500],
  '4+1': [8500, 10500],
  '5+1': [10500, 13000],
};
const ROOM_OPTIONS = ['1+1', '2+1', '3+1', '4+1', '5+1'] as const;

/** m² bazlı tipler: birim fiyat (TL/m²) + taban (küçük alanlar için minimum) */
const M2_RATES: Record<
  Exclude<SpaceTypeId, 'ev'>,
  { min: number; max: number; floorMin: number; floorMax: number }
> = {
  ofis: { min: 35, max: 55, floorMin: 2500, floorMax: 3500 },
  isyeri: { min: 35, max: 55, floorMin: 2500, floorMax: 3500 },
  insaat: { min: 75, max: 120, floorMin: 5500, floorMax: 8000 },
  discephe: { min: 35, max: 60, floorMin: 1200, floorMax: 2000 },
};

/** Ekstralar (seçilirse tahmine eklenir), TL. free: ücretsiz hediye */
const EXTRAS = [
  { id: 'cam', label: 'Cam temizliği', min: 600, max: 1000, free: false },
  { id: 'beyazesya', label: 'Buzdolabı / fırın içi', min: 0, max: 0, free: true },
  { id: 'balkon', label: 'Balkon', min: 0, max: 0, free: true },
  { id: 'koltuk', label: 'Koltuk / halı yıkama', min: 900, max: 1800, free: false },
] as const;

type ExtraId = (typeof EXTRAS)[number]['id'];

/** Ekstraların gösterildiği mekan tipleri (inşaat/dış cephe zaten kapsamlı) */
const EXTRAS_VISIBLE_FOR: SpaceTypeId[] = ['ev', 'ofis', 'isyeri'];

// ============================================
// YARDIMCILAR
// ============================================

const nf = new Intl.NumberFormat('tr-TR');
const roundTo = (n: number, step = 100) => Math.round(n / step) * step;
const formatTL = (n: number) => `${nf.format(roundTo(n))} TL`;

// ============================================
// BİLEŞEN
// ============================================

export function HeroPriceCalculator() {
  const [spaceType, setSpaceType] = useState<SpaceTypeId>('ev');
  const [room, setRoom] = useState<string>('2+1');
  const [area, setArea] = useState<number>(100);
  const [extras, setExtras] = useState<Record<ExtraId, boolean>>({
    cam: false,
    beyazesya: false,
    balkon: false,
    koltuk: false,
  });

  const activeType = useMemo(
    () => SPACE_TYPES.find((t) => t.id === spaceType)!,
    [spaceType]
  );

  const showExtras = EXTRAS_VISIBLE_FOR.includes(spaceType);

  const selectedExtras = useMemo(
    () => EXTRAS.filter((e) => extras[e.id] && showExtras),
    [extras, showExtras]
  );

  const range = useMemo<PriceRange>(() => {
    let min = 0;
    let max = 0;

    if (activeType.mode === 'room') {
      const base = ROOM_PRICES[room] ?? ROOM_PRICES['2+1'];
      min = base[0];
      max = base[1];
    } else {
      const rate = M2_RATES[spaceType as Exclude<SpaceTypeId, 'ev'>];
      const safeArea = Number.isFinite(area) && area > 0 ? area : 0;
      min = Math.max(safeArea * rate.min, rate.floorMin);
      max = Math.max(safeArea * rate.max, rate.floorMax);
    }

    for (const extra of selectedExtras) {
      min += extra.min;
      max += extra.max;
    }

    return [roundTo(min), roundTo(max)];
  }, [activeType.mode, room, area, spaceType, selectedExtras]);

  const toggleExtra = (id: ExtraId) =>
    setExtras((prev) => ({ ...prev, [id]: !prev[id] }));

  const whatsappHref = useMemo(() => {
    const serviceDesc =
      activeType.mode === 'room'
        ? `${room} ${activeType.label} temizliği`
        : `${activeType.label} temizliği (${area || 0} m²)`;

    const extrasText = selectedExtras.length
      ? `\nEkstralar: ${selectedExtras
          .map((e) => (e.free ? `${e.label} (hediye)` : e.label))
          .join(', ')}`
      : '';

    const message =
      `Merhaba, web sitenizden fiyat hesapladım.\n` +
      `Hizmet: ${serviceDesc}\n` +
      `Tahmini fiyat: ${nf.format(range[0])} – ${nf.format(range[1])} TL${extrasText}\n` +
      `Randevu almak istiyorum.`;

    return `https://wa.me/${SITE_CONTACT.whatsappDigits}?text=${encodeURIComponent(message)}`;
  }, [activeType, room, area, selectedExtras, range]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="relative w-full"
    >
      {/* Glow */}
      <div
        className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="rounded-3xl border border-slate-700/60 bg-slate-800/60 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
        {/* Başlık */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Anında Fiyat Hesapla</h2>
            <p className="text-xs text-slate-400">Birkaç saniyede tahmini fiyatını gör</p>
          </div>
        </div>

        {/* Adım 1 — Mekan tipi */}
        <fieldset className="mb-4">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">
            1. Mekan tipi
          </legend>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {SPACE_TYPES.map((type) => {
              const Icon = type.icon;
              const active = spaceType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSpaceType(type.id)}
                  aria-pressed={active}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-all ${
                    active
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                      : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-600 hover:bg-slate-900/70'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[11px] font-medium leading-tight">{type.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Adım 2 — Oda sayısı veya metrekare */}
        {activeType.mode === 'room' ? (
          <fieldset className="mb-4">
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">
              2. Oda sayısı
            </legend>
            <div className="grid grid-cols-5 gap-2">
              {ROOM_OPTIONS.map((opt) => {
                const active = room === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setRoom(opt)}
                    aria-pressed={active}
                    className={`rounded-lg border py-2 text-sm font-semibold transition-all ${
                      active
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                        : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : (
          <fieldset className="mb-4">
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">
              2. {activeType.unitLabel}
            </legend>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={20}
                max={1000}
                step={10}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-emerald-500"
                aria-label={activeType.unitLabel}
              />
              <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/40 px-2 py-1.5">
                <input
                  type="number"
                  min={1}
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-14 bg-transparent text-right text-sm font-semibold text-white outline-none"
                />
                <span className="text-xs text-slate-400">m²</span>
              </div>
            </div>
          </fieldset>
        )}

        {/* Adım 3 — Ekstralar */}
        {showExtras && (
          <fieldset className="mb-5">
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">
              3. Ekstralar (opsiyonel)
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {EXTRAS.map((extra) => {
                const active = extras[extra.id];
                return (
                  <button
                    key={extra.id}
                    type="button"
                    onClick={() => toggleExtra(extra.id)}
                    aria-pressed={active}
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-all ${
                      active
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                        : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 flex-none items-center justify-center rounded border ${
                        active ? 'border-emerald-500 bg-emerald-500 text-slate-900' : 'border-slate-500'
                      }`}
                      aria-hidden="true"
                    >
                      {active && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span className="flex flex-wrap items-center gap-1 leading-tight">
                      {extra.label}
                      {extra.free && (
                        <span className="rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-300">
                          Hediye
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Sonuç */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            Tahmini fiyat
          </div>
          <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {formatTL(range[0])} <span className="text-slate-400">–</span> {formatTL(range[1])}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-slate-400">
            Kesin fiyat ücretsiz keşif sonrası netleşir. Değerler tahminîdir.
          </p>
        </div>

        {/* CTA */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 sm:text-base"
        >
          <MessageCircle className="h-5 w-5" />
          WhatsApp&apos;tan Randevu Al
        </a>
      </div>
    </motion.div>
  );
}

export default HeroPriceCalculator;
