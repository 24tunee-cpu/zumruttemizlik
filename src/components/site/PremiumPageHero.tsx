'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface PremiumPageHeroProps {
  badge?: string;
  BadgeIcon?: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function PremiumPageHero({
  badge,
  BadgeIcon,
  title,
  description,
  children,
}: PremiumPageHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-slate-950 pt-24 pb-14 sm:pt-28 md:pt-32 md:pb-16"
      aria-label="Sayfa başlığı"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-emerald-600/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {badge && (
          <motion.span
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 0.45 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-400"
          >
            {BadgeIcon && <BadgeIcon className="h-4 w-4" aria-hidden="true" />}
            {badge}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.08, duration: shouldReduceMotion ? 0.15 : 0.5 }}
          className="mt-4 text-balance text-3xl font-bold text-white sm:text-4xl md:text-5xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.16, duration: shouldReduceMotion ? 0.15 : 0.5 }}
          className="mx-auto mt-5 max-w-3xl text-base text-slate-400 sm:text-lg"
        >
          {description}
        </motion.p>
        {children && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.24, duration: shouldReduceMotion ? 0.15 : 0.45 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
