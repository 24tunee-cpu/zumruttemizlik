/**
 * @fileoverview Hero Price Calculator
 * @description Ana sayfa hero bölümünde yer alan anlık fiyat hesaplama ve
 * WhatsApp üzerinden randevu/iletişim aracı.
 *
 * Faz 4: URL ?intent=&district= ile niyet-aware mod + GA4 intent event'leri.
 */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
  MapPin,
} from 'lucide-react';
import { SITE_CONTACT } from '@/config/site-contact';
import {
  SPACE_TYPES,
  ROOM_PRICES,
  ROOM_OPTIONS,
  M2_RATES,
  EXTRAS,
  EXTRAS_VISIBLE_FOR,
  priceFormatter as nf,
  roundTo,
  formatTL,
  type SpaceTypeId,
  type PriceRange,
  type ExtraId,
} from '@/config/pricing';
import type { CalculatorIntentContext } from '@/lib/intent-analytics';
import { trackGa4Event } from '@/lib/ga4-client';

const SPACE_TYPE_ICONS: Record<SpaceTypeId, React.ComponentType<{ className?: string }>> = {
  ev: Home,
  ofis: Building2,
  isyeri: Store,
  insaat: HardHat,
  discephe: Building,
};

export type HeroPriceCalculatorProps = {
  initialSpaceType?: SpaceTypeId;
  initialRoom?: string;
  initialArea?: number;
  intentContext?: CalculatorIntentContext | null;
};

function buildAnalyticsPayload(
  spaceType: SpaceTypeId,
  room: string,
  area: number,
  range: PriceRange,
  intentContext?: CalculatorIntentContext | null
) {
  return {
    lead_source: 'price_calculator',
    space_type: spaceType,
    room_type: spaceType === 'ev' ? room : undefined,
    area_m2: spaceType !== 'ev' ? area : undefined,
    value: range[0],
    value_max: range[1],
    currency: 'TRY',
    intent_slug: intentContext?.intentSlug,
    intent_name: intentContext?.intentName,
    district_slug: intentContext?.districtSlug,
    district_name: intentContext?.districtName,
  };
}

export function HeroPriceCalculator({
  initialSpaceType = 'ev',
  initialRoom = '2+1',
  initialArea = 100,
  intentContext = null,
}: HeroPriceCalculatorProps) {
  const [spaceType, setSpaceType] = useState<SpaceTypeId>(initialSpaceType);
  const [room, setRoom] = useState<string>(initialRoom);
  const [area, setArea] = useState<number>(initialArea);
  const [extras, setExtras] = useState<Record<ExtraId, boolean>>({
    cam: false,
    beyazesya: false,
    balkon: false,
    koltuk: false,
  });

  const hasTrackedView = useRef(false);
  const lastCalculatedKey = useRef('');

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

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    trackGa4Event('price_calculator_view', buildAnalyticsPayload(spaceType, room, area, range, intentContext));
  }, [spaceType, room, area, range, intentContext]);

  useEffect(() => {
    const key = `${spaceType}|${room}|${area}|${selectedExtras.map((e) => e.id).join(',')}|${range[0]}-${range[1]}`;
    if (key === lastCalculatedKey.current) return;
    lastCalculatedKey.current = key;

    const timer = window.setTimeout(() => {
      trackGa4Event('price_calculated', buildAnalyticsPayload(spaceType, room, area, range, intentContext));
    }, 600);

    return () => window.clearTimeout(timer);
  }, [spaceType, room, area, range, selectedExtras, intentContext]);

  const toggleExtra = (id: ExtraId) =>
    setExtras((prev) => ({ ...prev, [id]: !prev[id] }));

  const whatsappHref = useMemo(() => {
    const serviceDesc =
      activeType.mode === 'room'
        ? `${room} ${activeType.label} temizliği`
        : `${activeType.label} temizliği (${area || 0} m²)`;

    const intentLine = intentContext
      ? intentContext.districtName
        ? `Niyet: ${intentContext.intentName} (${intentContext.districtName})\n`
        : `Niyet: ${intentContext.intentName}\n`
      : '';

    const extrasText = selectedExtras.length
      ? `\nEkstralar: ${selectedExtras
          .map((e) => (e.free ? `${e.label} (hediye)` : e.label))
          .join(', ')}`
      : '';

    const message =
      `Merhaba, web sitenizden fiyat hesapladım.\n` +
      intentLine +
      `Hizmet: ${serviceDesc}\n` +
      `Tahmini fiyat: ${nf.format(range[0])} – ${nf.format(range[1])} TL${extrasText}\n` +
      `Randevu almak istiyorum.`;

    return `https://wa.me/${SITE_CONTACT.whatsappDigits}?text=${encodeURIComponent(message)}`;
  }, [activeType, room, area, selectedExtras, range, intentContext]);

  const handleWhatsappClick = () => {
    const payload = buildAnalyticsPayload(spaceType, room, area, range, intentContext);
    trackGa4Event('generate_lead', {
      ...payload,
      form_id: 'price_calculator_whatsapp',
      form_destination: '/fiyat-hesaplama',
    });
    if (intentContext?.ga4LeadEvent) {
      trackGa4Event(intentContext.ga4LeadEvent, payload);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="relative w-full"
    >
      <div
        className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="rounded-3xl border border-slate-700/60 bg-slate-800/60 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
        {intentContext && (
          <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-950/40 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
              Niyet modu
            </p>
            <p className="mt-1 text-sm font-medium text-white">{intentContext.intentName}</p>
            {intentContext.districtName && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                {intentContext.districtName}
              </p>
            )}
          </div>
        )}

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Anında Fiyat Hesapla</h2>
            <p className="text-xs text-slate-400">
              {intentContext
                ? `${intentContext.intentName} için tahmini fiyat`
                : 'Birkaç saniyede tahmini fiyatını gör'}
            </p>
          </div>
        </div>

        <fieldset className="mb-4">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">
            1. Mekan tipi
          </legend>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {SPACE_TYPES.map((type) => {
              const Icon = SPACE_TYPE_ICONS[type.id];
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

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsappClick}
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
