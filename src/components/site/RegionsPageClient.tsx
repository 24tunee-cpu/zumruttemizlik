'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, ArrowRight, Star, Sparkles, Calculator } from 'lucide-react';
import SiteLayout from '@/app/site/layout';
import { PremiumPageHero } from '@/components/site/PremiumPageHero';
import { SeoPriorityStrip } from '@/components/site/SeoPriorityStrip';
import { DISTRICT_LANDINGS, SERVICE_LANDINGS } from '@/config/programmatic-seo';

const PRIORITY_DISTRICT_SLUGS = ['sariyer', 'besiktas', 'sisli', 'kagithane', 'bakirkoy'];

function sortDistricts() {
  return [...DISTRICT_LANDINGS].sort((a, b) => {
    const ai = PRIORITY_DISTRICT_SLUGS.indexOf(a.slug);
    const bi = PRIORITY_DISTRICT_SLUGS.indexOf(b.slug);
    const as = ai === -1 ? 99 : ai;
    const bs = bi === -1 ? 99 : bi;
    return as - bs;
  });
}

function DistrictCard({
  slug,
  name,
  note,
  featured,
  index,
}: {
  slug: string;
  name: string;
  note: string;
  featured?: boolean;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 10 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: shouldReduceMotion ? 0 : index * 0.04, duration: shouldReduceMotion ? 0.2 : 0.4 }}
      className={featured ? 'sm:col-span-2 lg:col-span-2' : undefined}
    >
      <Link
        href={`/bolgeler/${slug}`}
        className={`group block h-full rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
          featured
            ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-slate-800/80 hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-900/20'
            : 'border-slate-700/60 bg-slate-800/50 hover:border-emerald-500/40 hover:bg-slate-800'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <MapPin className="h-5 w-5" aria-hidden="true" />
          </div>
          {featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
              <Star className="h-3 w-3" aria-hidden="true" />
              Öncelikli bölge
            </span>
          )}
        </div>
        <h3 className="mt-3 text-lg font-bold text-white group-hover:text-emerald-300">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{note}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-400">
          Bölge sayfası
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </Link>
    </motion.div>
  );
}

export default function RegionsPageClient() {
  const districts = sortDistricts();

  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-950">
        <PremiumPageHero
          badge="İstanbul Bölgeleri"
          badgeIcon="map-pin"
          title="İlçe Bazlı Temizlik Hizmetleri"
          description="Zekeriyaköy ve Sarıyer öncelikli olmak üzere İstanbul'un 20 ilçesinde ev, ofis, inşaat sonrası ve halı-koltuk temizliği. Her bölge için özel landing sayfaları."
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/bolgeler/sariyer/zekeriyakoy"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
            >
              Zekeriyaköy Temizlik
            </Link>
            <Link
              href="/fiyat-hesaplama"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/50"
            >
              <Calculator className="h-4 w-4" aria-hidden="true" />
              Fiyat Hesapla
            </Link>
          </div>
        </PremiumPageHero>

        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <section className="mb-12">
            <SeoPriorityStrip title="Bölge odaklı fiyat rehberleri ve hızlı linkler" />
          </section>

          <section aria-labelledby="districts-heading">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 id="districts-heading" className="text-2xl font-bold text-white sm:text-3xl">
                  İlçeler
                </h2>
                <p className="mt-2 text-slate-400">
                  {districts.length} ilçede yerel SEO sayfaları — tıklayarak bölgenize özel hizmetleri inceleyin.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {districts.map((district, index) => (
                <DistrictCard
                  key={district.slug}
                  slug={district.slug}
                  name={district.name}
                  note={district.regionBlurb || district.populationNote}
                  featured={district.slug === 'sariyer'}
                  index={index}
                />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/bolgeler/sariyer/zekeriyakoy"
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
              >
                Zekeriyaköy özel semt sayfası
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>

          <section className="mt-16" aria-labelledby="services-heading">
            <div className="mb-8">
              <h2 id="services-heading" className="text-2xl font-bold text-white sm:text-3xl">
                Odak Hizmetler
              </h2>
              <p className="mt-2 text-slate-400">
                Tüm ilçelerde sunulan profesyonel temizlik hizmetleri — detay ve fiyat rehberleri.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_LANDINGS.map((service, index) => (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/hizmetler/${service.slug}`}
                    className="group block rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5 transition-all hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                      <h3 className="font-bold text-white group-hover:text-emerald-300">{service.name}</h3>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{service.shortPitch}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm text-emerald-400">
                      Detaylar
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mt-16 rounded-2xl border border-slate-700/60 bg-gradient-to-br from-emerald-950/30 to-slate-800/50 p-8 text-center">
            <h2 className="text-xl font-bold text-white sm:text-2xl">Bölgeniz listede yok mu?</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              İstanbul genelinde hizmet veriyoruz. Ücretsiz keşif için randevu oluşturun veya fiyat hesaplayın.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/randevu"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-medium text-white transition hover:bg-emerald-600"
              >
                Randevu Oluştur
              </Link>
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 font-medium text-slate-200 transition hover:border-emerald-500/50"
              >
                İletişime Geç
              </Link>
            </div>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
