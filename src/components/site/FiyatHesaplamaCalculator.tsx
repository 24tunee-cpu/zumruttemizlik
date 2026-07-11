'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { HeroPriceCalculator } from '@/components/site/HeroPriceCalculator';
import { resolveCalculatorIntentContext } from '@/lib/intent-analytics';

function FiyatHesaplamaCalculatorInner() {
  const searchParams = useSearchParams();
  const intentContext = resolveCalculatorIntentContext(
    searchParams.get('intent'),
    searchParams.get('district')
  );

  return (
    <HeroPriceCalculator
      initialSpaceType={intentContext?.spaceType}
      initialRoom={intentContext?.initialRoom}
      initialArea={intentContext?.initialArea}
      intentContext={intentContext}
    />
  );
}

function CalculatorFallback() {
  return (
    <div className="rounded-3xl border border-slate-700/60 bg-slate-800/60 p-6 shadow-2xl backdrop-blur-xl">
      <div className="h-64 animate-pulse rounded-2xl bg-slate-700/40" aria-hidden="true" />
      <p className="sr-only">Fiyat hesaplama aracı yükleniyor…</p>
    </div>
  );
}

export function FiyatHesaplamaCalculator() {
  return (
    <Suspense fallback={<CalculatorFallback />}>
      <FiyatHesaplamaCalculatorInner />
    </Suspense>
  );
}
