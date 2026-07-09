/**
 * @fileoverview Hero Component
 * @description Ana sayfa hero bölümü.
 * Particle effects, 3D card animations, ve accessibility desteği ile.
 *
 * @example
 * <Hero />
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Clock, Award, ChevronDown, Star, CheckCircle2 } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { HeroPriceCalculator } from '@/components/site/HeroPriceCalculator';

// ============================================
// TYPES
// ============================================

/** İstatistik kartı tipi */
interface HeroStat {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}

// ============================================
// SABİT DEĞERLER (Hydration fix için)
// ============================================

/** Partikül pozisyonları (sabit, SSR/client eşleşmesi için) */
const PARTICLE_POSITIONS = [
  15, 82, 37, 64, 23, 91, 48, 75, 12, 88,
  42, 59, 31, 76, 53, 69, 18, 95, 44, 67
];

/** Hero istatistikleri (cam efektli kartlar) */
const HERO_STATS: HeroStat[] = [
  { icon: Award, value: '5000+', label: 'Mutlu Müşteri' },
  { icon: Shield, value: '7/24', label: 'Destek Hattı' },
  { icon: Clock, value: '15+', label: 'Yıl Deneyim' },
];

/** Güven rozetleri (küçük çipler) */
const TRUST_PILLS = ['Sigortalı Hizmet', 'Aynı Gün Randevu', 'Ücretsiz Keşif'];

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * Hero Component
 * Ana sayfa hero bölümü.
 */
export function Hero() {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Mount check (hydration fix)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoized animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  }), [shouldReduceMotion]);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 10 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.5,
      },
    },
  }), [shouldReduceMotion]);

  // Scroll handler
  const handleScrollClick = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, []);

  return (
    <section className="relative min-h-[100dvh] min-h-screen overflow-hidden bg-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-950" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" aria-hidden="true" />

      {/* Particle Effect (Client-only to prevent hydration mismatch) */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {PARTICLE_POSITIONS.map((xPos, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
              initial={{
                x: `${xPos}%`,
                y: '100%',
                opacity: 0
              }}
              animate={{
                y: '-10%',
                opacity: [0, 1, 0],
              }}
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

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse delay-1000" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 sm:pt-28 md:pt-28 md:pb-24 lg:px-8 lg:pt-32 lg:pb-28">
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: shouldReduceMotion ? 0.2 : 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-400 border border-emerald-500/20 backdrop-blur-sm"
            >
              <motion.div
                animate={shouldReduceMotion ? {} : { rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
              >
                <Sparkles size={16} />
              </motion.div>
              <span className="text-sm font-medium">İstanbul genelinde profesyonel temizlik ekibi</span>
            </motion.div>

            {/* Heading with staggered text animation */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-balance text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-block"
              >
                Profesyonel{' '}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-block bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent"
              >
                Temizlik
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-block"
              >
                Hizmetleri
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 max-w-xl text-base text-slate-300 sm:text-lg"
            >
              İnşaat sonrası, ofis, koltuk yıkama ve daha fazlası.
              Deneyimli ekibimiz ve modern ekipmanlarımızla evinizi ve iş yerinizi
              pırıl pırıl yapıyoruz.
            </motion.p>

            {/* Puan / sosyal kanıt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2"
            >
              <div className="flex items-center gap-0.5 text-amber-400" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400" />
                ))}
              </div>
              <span className="text-sm text-slate-300">
                <span className="font-bold text-white">5.0</span> puan · 5000+ memnun müşteri
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
            >
              <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.05 }} whileTap={shouldReduceMotion ? {} : { scale: 0.95 }} className="w-full min-w-0 sm:w-auto">
                <Link
                  href="/iletisim"
                  className="group relative inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 overflow-hidden sm:inline-flex sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                  aria-label="Hemen fiyat teklifi al"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">Hemen Fiyat Al</span>
                  <motion.span
                    className="relative"
                    animate={shouldReduceMotion ? {} : { x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    aria-hidden="true"
                  >
                    <ArrowRight size={20} />
                  </motion.span>
                </Link>
              </motion.div>

              <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.05 }} whileTap={shouldReduceMotion ? {} : { scale: 0.95 }} className="w-full min-w-0 sm:w-auto">
                <Link
                  href="/hizmetler"
                  className="group inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 sm:inline-flex sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                  aria-label="Tüm hizmetleri görüntüle"
                >
                  <span className="font-medium">Hizmetlerimiz</span>
                  <motion.span
                    animate={shouldReduceMotion ? {} : { rotate: [0, 90, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                    aria-hidden="true"
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>

            {/* İstatistik kartları (cam efektli) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="mt-10 grid grid-cols-3 gap-2.5 sm:gap-4"
            >
              {HERO_STATS.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={shouldReduceMotion ? {} : { y: -4 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/50 p-3 text-center backdrop-blur-xl transition-colors hover:border-emerald-500/50 sm:p-4"
                >
                  <div
                    className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 opacity-0 transition-opacity duration-300 group-hover:from-emerald-500/10 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <stat.icon className="mx-auto h-5 w-5 text-emerald-400 sm:h-6 sm:w-6" />
                  <p className="mt-1.5 text-lg font-bold leading-none text-white sm:mt-2 sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] leading-tight text-slate-400 sm:text-xs">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Güven çipleri */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              className="mt-5 flex flex-wrap gap-2"
            >
              {TRUST_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm"
                >
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  {pill}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Fiyat Hesaplama */}
          <div className="relative">
            <HeroPriceCalculator />
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.button
        onClick={handleScrollClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="pointer-events-auto absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-400 transition-colors hover:text-emerald-400 focus:outline-none xl:flex"
        aria-label="Sayfayı aşağı kaydır"
      >
        <span className="text-xs font-medium">Aşağı Kaydır</span>
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="h-12 w-7 rounded-full border-2 border-emerald-500/30 p-1"
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-2 w-full rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600"
          />
        </motion.div>
      </motion.button>
    </section>
  );
}

export default Hero;
