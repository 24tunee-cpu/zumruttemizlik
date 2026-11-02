/**
 * @fileoverview Hero Component (Server Shell)
 * @description Ana sayfa hero — yerel niyet + doğrulanmış güven (trust-signals).
 * LCP için h1/CTA sunucuda render; animasyon/dekor/hesaplayıcı ayrı chunk'larda.
 */

import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Star,
  ChevronDown,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import {
  HeroDecorations,
  HeroCalculatorSection,
  HeroScrollIndicator,
} from '@/components/site/HeroClientParts';
import { SITE_CONTACT, toTelHref } from '@/config/site-contact';
import {
  VERIFIED_TRUST,
  formatGoogleTrustLine,
  HOME_HERO_STATS,
} from '@/config/trust-signals';
import { withGmbUtm, getPublicMapsUrl, getPublicReviewUrl } from '@/lib/gbp-links';

const STAT_ICONS = {
  google: Star,
  support: Shield,
  discovery: Clock,
} as const;

const TRUST_PILLS = ['Sigortalı hizmet', 'Aynı gün randevu', 'Ücretsiz keşif'] as const;

export function Hero() {
  const callHref = toTelHref(SITE_CONTACT.phoneE164);
  const reviewOrMaps = getPublicReviewUrl() || getPublicMapsUrl();
  const mapsTrustHref = withGmbUtm(reviewOrMaps, 'home-hero-trust', { content: 'rating' });

  return (
    <section className="relative min-h-[100dvh] min-h-screen overflow-hidden bg-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" aria-hidden="true" />

      <HeroDecorations />

      <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 sm:pt-28 md:pt-28 md:pb-24 lg:px-8 lg:pt-32 lg:pb-28">
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-10">
          <div>
            <div className="hero-enter inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-emerald-400 backdrop-blur-sm">
              <Sparkles
                size={16}
                className="max-md:animate-none md:animate-spin md:[animation-duration:3s]"
                aria-hidden="true"
              />
              <span className="text-sm font-medium">
                Sarıyer · Zekeriyaköy · İstanbul Avrupa Yakası
              </span>
            </div>

            <h1 className="hero-enter hero-enter-delay-1 mt-6 text-balance text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Sarıyer &amp; Zekeriyaköy{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                temizlik
              </span>{' '}
              şirketi
            </h1>

            <p className="hero-enter hero-enter-delay-2 mt-6 max-w-xl text-base text-slate-300 sm:text-lg">
              Villa, ev, ofis ve inşaat sonrası temizlik. Ücretsiz keşif, net kapsam,
              aynı gün randevu — {SITE_CONTACT.companyName}.
            </p>

            <div className="hero-enter hero-enter-delay-3 mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <div className="flex items-center gap-0.5 text-amber-400" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(VERIFIED_TRUST.googleRating)
                        ? 'fill-amber-400'
                        : 'fill-transparent'
                    }
                  />
                ))}
              </div>
              <a
                href={mapsTrustHref}
                target="_blank"
                rel="noopener noreferrer"
                data-source="home-hero-google-trust"
                className="text-sm text-slate-300 underline-offset-2 hover:text-amber-200 hover:underline"
              >
                <span className="font-bold text-white">
                  {formatGoogleTrustLine()}
                </span>
                <span className="text-slate-400"> · Google’da gör</span>
              </a>
            </div>

            <div className="hero-enter hero-enter-delay-4 mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/randevu"
                className="group relative inline-flex w-full min-h-[44px] min-w-0 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] hover:shadow-emerald-500/50 active:scale-[0.98] sm:inline-flex sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                aria-label="Ücretsiz keşif randevusu al"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative">Ücretsiz keşif</span>
                <ArrowRight
                  size={20}
                  className="relative hero-icon-nudge max-md:animate-none"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/fiyat-hesaplama"
                className="group inline-flex w-full min-h-[44px] min-w-0 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-white/40 hover:bg-white/10 active:scale-[0.98] sm:inline-flex sm:w-auto sm:px-8 sm:py-4 sm:text-base"
              >
                <span className="font-medium">Fiyat hesapla</span>
                <ChevronDown size={20} className="max-md:animate-none" aria-hidden="true" />
              </Link>

              <a
                href={callHref}
                className="inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-6 py-3.5 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-500/20 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                aria-label={`Ara: ${SITE_CONTACT.phoneDisplay}`}
              >
                <Phone size={18} aria-hidden />
                {SITE_CONTACT.phoneDisplay}
              </a>
            </div>

            <div className="hero-enter hero-enter-delay-5 mt-10 grid grid-cols-3 gap-2.5 sm:gap-4">
              {HOME_HERO_STATS.map((stat) => {
                const Icon = STAT_ICONS[stat.id];
                return (
                  <div
                    key={stat.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/50 p-3 text-center backdrop-blur-xl transition-colors hover:border-emerald-500/50 sm:p-4"
                  >
                    <Icon className="mx-auto h-5 w-5 text-emerald-400 sm:h-6 sm:w-6" />
                    <p className="mt-1.5 text-lg font-bold leading-none text-white sm:mt-2 sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[10px] leading-tight text-slate-400 sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="hero-enter hero-enter-delay-6 mt-5 flex flex-wrap gap-2">
              {TRUST_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm"
                >
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <HeroCalculatorSection />
        </div>
      </div>

      <HeroScrollIndicator />
    </section>
  );
}

export default Hero;
