'use client';

import dynamic from 'next/dynamic';
import { Calculator, ChevronRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const HeroPriceCalculator = dynamic(
  () => import('@/components/site/HeroPriceCalculator').then((mod) => mod.HeroPriceCalculator),
  {
    loading: () => <CalculatorSkeleton />,
  }
);

function CalculatorSkeleton() {
  return (
    <div
      className="rounded-3xl border border-slate-700/60 bg-slate-800/60 p-5 shadow-2xl backdrop-blur-xl sm:p-6"
      aria-hidden="true"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/15" />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-slate-700/80" />
          <div className="h-3 w-52 rounded bg-slate-700/50" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-slate-900/50" />
        ))}
      </div>
      <div className="mt-4 h-24 rounded-2xl bg-emerald-500/10" />
      <div className="mt-4 h-12 rounded-xl bg-emerald-600/30" />
    </div>
  );
}

function MobileCalculatorTeaser({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="hero-enter hero-enter-delay-3 w-full">
      <div className="rounded-3xl border border-slate-700/60 bg-slate-800/60 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <Calculator className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Anında Fiyat Hesapla</h2>
            <p className="text-xs text-slate-400">Birkaç saniyede tahmini fiyatını gör</p>
          </div>
        </div>

        <ul className="mb-5 space-y-2 text-sm text-slate-300">
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
            Ev, ofis, inşaat sonrası ve daha fazlası
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
            WhatsApp ile anında randevu
          </li>
        </ul>

        <button
          type="button"
          onClick={onOpen}
          className="inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-transform active:scale-[0.98]"
        >
          Fiyat Hesaplayıcıyı Aç
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

const LG_MEDIA = '(min-width: 1024px)';

/**
 * Hero fiyat hesaplayıcı slotu.
 * Mobil: tıklayınca lazy-load. Masaüstü: lg+ viewport'ta hemen yükle.
 */
export function HeroCalculatorSection() {
  const [viewportReady, setViewportReady] = useState(false);
  const [isLg, setIsLg] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(LG_MEDIA);
    const sync = () => setIsLg(mq.matches);
    sync();
    setViewportReady(true);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const showCalculator = isLg || mobileOpen;

  if (!viewportReady) {
    return (
      <div className="relative">
        <div className="hidden lg:block">
          <CalculatorSkeleton />
        </div>
        <div className="lg:hidden">
          <MobileCalculatorTeaser onOpen={() => setMobileOpen(true)} />
        </div>
      </div>
    );
  }

  if (isLg) {
    return (
      <div className="relative hidden lg:block">
        <HeroPriceCalculator />
      </div>
    );
  }

  return (
    <div className="relative lg:hidden">
      {showCalculator ? (
        <HeroPriceCalculator />
      ) : (
        <MobileCalculatorTeaser onOpen={() => setMobileOpen(true)} />
      )}
    </div>
  );
}

export default HeroCalculatorSection;
