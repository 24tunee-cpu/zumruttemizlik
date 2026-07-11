'use client';

import { useEffect, useState } from 'react';

const MOBILE_MEDIA = '(max-width: 767px)';

/**
 * Mobil veya prefers-reduced-motion durumunda ağır animasyonları kapatır.
 * Hero partikül, blur orb ve sürekli motion loop'ları için kullanılır.
 */
export function usePrefersReducedEffects(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia(MOBILE_MEDIA);

    const update = () => {
      setReduced(motionQuery.matches || mobileQuery.matches);
    };

    update();
    motionQuery.addEventListener('change', update);
    mobileQuery.addEventListener('change', update);
    return () => {
      motionQuery.removeEventListener('change', update);
      mobileQuery.removeEventListener('change', update);
    };
  }, []);

  return reduced;
}
