'use client';

import { ChevronDown } from 'lucide-react';
import { useCallback } from 'react';

/**
 * Masaüstü scroll göstergesi — küçük client island.
 */
export function HeroScrollIndicator() {
  const handleScrollClick = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, []);

  return (
    <button
      type="button"
      onClick={handleScrollClick}
      className="pointer-events-auto absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-400 transition-colors hover:text-emerald-400 focus:outline-none xl:flex hero-enter hero-enter-delay-7"
      aria-label="Sayfayı aşağı kaydır"
    >
      <span className="text-xs font-medium">Aşağı Kaydır</span>
      <div className="h-12 w-7 rounded-full border-2 border-emerald-500/30 p-1">
        <div className="hero-scroll-dot h-2 w-full rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
      </div>
    </button>
  );
}

export default HeroScrollIndicator;
