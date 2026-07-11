'use client';

import dynamic from 'next/dynamic';

/** Client boundary — dynamic(ssr:false) yalnızca client component içinde kullanılabilir. */
export const HeroDecorations = dynamic(
  () => import('@/components/site/HeroDecorations').then((mod) => mod.HeroDecorations),
  { ssr: false }
);

export const HeroCalculatorSection = dynamic(
  () => import('@/components/site/HeroCalculatorSection').then((mod) => mod.HeroCalculatorSection),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[22rem] rounded-3xl border border-slate-700/40 bg-slate-800/40 animate-pulse lg:h-[28rem]"
        aria-hidden="true"
      />
    ),
  }
);

export const HeroScrollIndicator = dynamic(
  () => import('@/components/site/HeroScrollIndicator').then((mod) => mod.HeroScrollIndicator),
  { ssr: false }
);
