/**
 * @fileoverview Services Component — Ana sayfa premium hizmetler bölümü
 * Hero ile uyumlu modern tasarım, SEO odaklı içerik ve fiyat ipuçları.
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import {
  getDefaultServiceImage,
  pickServiceImage,
} from '@/lib/service-images';
import {
  ArrowRight,
  Sparkles,
  Home,
  Building2,
  HardHat,
  Sofa,
  Layers,
  PanelTop,
  Building,
  MapPin,
  Calculator,
  CheckCircle2,
} from 'lucide-react';
import logger from '@/lib/logger';
import {
  HOME_SERVICE_SEO,
  DEFAULT_HOME_SERVICE_SEO,
  type HomeServiceSeoMeta,
} from '@/config/home-services-seo';

// ============================================
// TYPES
// ============================================

interface Service {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  image?: string | null;
  icon?: string | null;
}

interface ServiceCardProps {
  service: Service;
  seo: HomeServiceSeoMeta;
  index: number;
  featured?: boolean;
}

interface ServicesProps {
  limit?: number;
}

// ============================================
// İKON EŞLEMESİ
// ============================================

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'ev-temizligi': Home,
  'ofis-temizligi': Building2,
  'insaat-sonrasi-temizlik': HardHat,
  'koltuk-yikama': Sofa,
  'hali-temizligi': Layers,
  'cam-temizligi': PanelTop,
  'dis-cephe-temizligi': Building,
};

function getServiceIcon(slug: string) {
  return SERVICE_ICONS[slug] ?? Sparkles;
}

// ============================================
// SERVICE CARD
// ============================================

function ServiceCard({ service, seo, index, featured }: ServiceCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = getServiceIcon(service.slug);
  const delay = shouldReduceMotion ? 0 : index * 0.08;
  const fallbackImage = getDefaultServiceImage(service.slug);
  const [imageSrc, setImageSrc] = useState<string | null>(() =>
    pickServiceImage(service.slug, service.image)
  );
  const skipInitialAnimation = shouldReduceMotion || index < 3;

  return (
    <motion.li
      initial={skipInitialAnimation ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: shouldReduceMotion ? 0.2 : 0.45 }}
      className={`list-none transform-gpu ${featured ? 'md:col-span-2 lg:col-span-1 lg:row-span-1' : ''}`}
    >
      <article className="group relative h-full">
        {/* Hover glow */}
        <div
          className="absolute -inset-px rounded-2xl bg-gradient-to-br from-emerald-400/40 via-emerald-500/20 to-transparent opacity-0 blur-sm transition duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-800/60 shadow-xl backdrop-blur-xl transition duration-500 group-hover:-translate-y-1 group-hover:border-emerald-500/40 group-hover:shadow-emerald-500/10">
          {/* Görsel bandı */}
          {imageSrc ? (
            <div className="relative h-36 w-full overflow-hidden sm:h-40">
              <Image
                src={imageSrc}
                alt={`${service.title} — İstanbul profesyonel temizlik hizmeti`}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => {
                  if (fallbackImage && imageSrc !== fallbackImage) {
                    setImageSrc(fallbackImage);
                  } else {
                    setImageSrc(null);
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-emerald-400 backdrop-blur-md">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="absolute right-4 top-4 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
                {seo.priceBadge}
              </span>
            </div>
          ) : null}

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            {!imageSrc && (
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-1 ring-emerald-500/20">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {seo.priceBadge}
                </span>
              </div>
            )}

            <h3 className="text-lg font-bold text-white transition-colors group-hover:text-emerald-300 sm:text-xl">
              <Link href={`/hizmetler/${service.slug}`} className="focus:outline-none focus-visible:underline">
                {service.title}
              </Link>
            </h3>

            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-400/90">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {seo.regionLabel}
            </p>

            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
              {seo.seoDesc}
            </p>

            {/* Highlight chips */}
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${service.title} özellikleri`}>
              {seo.highlights.map((h) => (
                <li
                  key={h}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-600/80 bg-slate-900/50 px-2.5 py-1 text-[11px] font-medium text-slate-300"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-700/60 pt-4">
              <Link
                href={`/hizmetler/${service.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                Detaylı bilgi
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <span className="text-slate-600" aria-hidden="true">
                ·
              </span>
              <Link
                href={`/blog/${seo.blogSlug}`}
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Fiyat rehberi
              </Link>
              <span className="text-slate-600" aria-hidden="true">
                ·
              </span>
              <Link
                href={`/bolgeler/sariyer/${service.slug}`}
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Sarıyer
              </Link>
            </div>
          </div>
        </div>
      </article>
    </motion.li>
  );
}

// ============================================
// SKELETON
// ============================================

function ServiceCardSkeleton({ index }: { index: number }) {
  return (
    <div
      className="h-full min-h-[320px] animate-pulse rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6"
      style={{ animationDelay: `${index * 80}ms` }}
      aria-hidden="true"
    >
      <div className="mb-4 h-36 rounded-xl bg-slate-700/50" />
      <div className="mb-2 h-6 w-2/3 rounded bg-slate-700/50" />
      <div className="mb-4 h-4 w-1/3 rounded bg-slate-700/40" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-slate-700/40" />
        <div className="h-3 w-full rounded bg-slate-700/40" />
        <div className="h-3 w-4/5 rounded bg-slate-700/40" />
      </div>
    </div>
  );
}

// ============================================
// MAIN
// ============================================

export function Services({ limit = 7 }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (!cancelled) {
          setServices(Array.isArray(data) ? data.slice(0, limit) : []);
        }
      } catch (error) {
        logger.error('Error fetching services', {}, error instanceof Error ? error : undefined);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  const headerMotion = useMemo(
    () => ({
      hidden: { opacity: 0, y: shouldReduceMotion ? 8 : 24 },
      visible: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0.2 : 0.55 } },
    }),
    [shouldReduceMotion]
  );

  return (
    <section
      id="hizmetlerimiz"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 py-20 sm:py-28"
      aria-labelledby="services-heading"
    >
      {/* Arka plan */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/25 via-transparent to-transparent"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-[0.03]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-emerald-600/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          className="mx-auto mb-14 max-w-3xl text-center sm:mb-16"
          variants={headerMotion}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Hizmetlerimiz
          </span>

          <h2
            id="services-heading"
            className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            İstanbul&apos;da{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Profesyonel Temizlik
            </span>{' '}
            Hizmetleri
          </h2>

          <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
            Sarıyer, Zekeriyaköy ve İstanbul Avrupa Yakası başta olmak üzere ev, ofis, inşaat sonrası,
            koltuk, halı, cam ve dış cephe temizliğinde{' '}
            <strong className="font-semibold text-white">ücretsiz keşif</strong> ve{' '}
            <Link href="/fiyat-hesaplama" className="font-semibold text-emerald-400 underline-offset-2 hover:underline">
              anında fiyat hesaplama
            </Link>{' '}
            ile hizmetinizdeyiz.
          </p>

          {/* Trust strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-300 sm:text-sm">
            {['7/24 Destek', 'Sigortalı Ekip', '5000+ Mutlu Müşteri', 'Aynı Gün Randevu'].map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-800/50 px-3 py-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                {t}
              </span>
            ))}
          </div>
        </motion.header>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Hizmetler yükleniyor">
            {Array.from({ length: limit }).map((_, i) => (
              <ServiceCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : services.length === 0 ? (
          <p className="text-center text-slate-300">Hizmet bilgisi yüklenemedi.</p>
        ) : (
          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3" aria-label="Temizlik hizmetleri listesi">
            {services.map((service, index) => {
              const seo = HOME_SERVICE_SEO[service.slug] ?? DEFAULT_HOME_SERVICE_SEO;
              return (
                <ServiceCard
                  key={service.id}
                  service={service}
                  seo={seo}
                  index={index}
                  featured={seo.featured}
                />
              );
            })}
          </ul>
        )}

        {/* Bottom CTAs */}
        <motion.div
          className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/hizmetler"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-emerald-500/40 sm:w-auto"
          >
            Tüm Hizmetleri Gör
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/fiyat-hesaplama"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-7 py-3.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 sm:w-auto"
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Anında Fiyat Hesapla
          </Link>
          <Link
            href="/cozumler"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800/60 px-7 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-emerald-500/40 hover:text-emerald-300 sm:w-auto"
          >
            Temizlik Çözümleri
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/bolgeler/sariyer/zekeriyakoy"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800/60 px-7 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 sm:w-auto"
          >
            <MapPin className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            Zekeriyaköy Temizlik
          </Link>
        </motion.div>

        {/* SEO footer text — crawlable internal links */}
        <p className="mx-auto mt-10 max-w-4xl text-center text-xs leading-relaxed text-slate-500 sm:text-sm">
          Zümrüt Vadi Temizlik;{' '}
          <Link href="/bolgeler/sariyer/ev-temizligi" className="text-slate-400 hover:text-emerald-400">
            Sarıyer ev temizliği
          </Link>
          ,{' '}
          <Link href="/bolgeler/sariyer/insaat-sonrasi-temizlik" className="text-slate-400 hover:text-emerald-400">
            Zekeriyaköy inşaat sonrası temizlik
          </Link>
          ,{' '}
          <Link href="/bolgeler/besiktas/ofis-temizligi" className="text-slate-400 hover:text-emerald-400">
            Beşiktaş ofis temizliği
          </Link>{' '}
          ve İstanbul Avrupa Yakası genelinde profesyonel temizlik hizmeti sunar.{' '}
          <Link href="/blog/istanbul-temizlik-fiyatlari-online-hesaplama-2026" className="text-slate-400 hover:text-emerald-400">
            2026 fiyat rehberimizi
          </Link>{' '}
          inceleyin veya{' '}
          <Link href="/randevu" className="text-slate-400 hover:text-emerald-400">
            ücretsiz keşif randevusu
          </Link>{' '}
          oluşturun.
        </p>
      </div>
    </section>
  );
}

export default Services;
