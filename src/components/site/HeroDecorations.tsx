'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePrefersReducedEffects } from '@/hooks/usePrefersReducedEffects';

const PARTICLE_POSITIONS = [
  15, 82, 37, 64, 23, 91, 48, 75, 12, 88,
  42, 59, 31, 76, 53, 69, 18, 95, 44, 67,
];

/**
 * Hero arka plan efektleri — lazy client island (ssr: false).
 * Partikül ve blur orb'lar yalnızca masaüstünde; mobilde statik gradient.
 */
export function HeroDecorations() {
  const [mounted, setMounted] = useState(false);
  const disableHeavyEffects = usePrefersReducedEffects();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (disableHeavyEffects) {
    return (
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.12),_transparent_55%)]"
        aria-hidden="true"
      />
    );
  }

  return (
    <>
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none max-md:hidden" aria-hidden="true">
          {PARTICLE_POSITIONS.map((xPos, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
              initial={{ x: `${xPos}%`, y: '100%', opacity: 0 }}
              animate={{ y: '-10%', opacity: [0, 1, 0] }}
              transition={{
                duration: 8 + (i % 4),
                delay: i * 0.3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}
      <div
        className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse max-md:hidden"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse delay-1000 max-md:hidden"
        aria-hidden="true"
      />
    </>
  );
}

export default HeroDecorations;
