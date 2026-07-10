'use client';

import SiteLayout from '@/app/site/layout';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Calculator,
  Home,
  Building2,
  HardHat,
  Sofa,
  Layers,
  PanelTop,
  Building,
} from 'lucide-react';
import { PremiumPageHero } from '@/components/site/PremiumPageHero';
import { SeoPriorityStrip } from '@/components/site/SeoPriorityStrip';
import {
  HOME_SERVICE_SEO,
  DEFAULT_HOME_SERVICE_SEO,
  type HomeServiceSeoMeta,
} from '@/config/home-services-seo';

interface Service {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  image?: string | null;
  features?: string[];
}

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

function getSeo(slug: string): HomeServiceSeoMeta {
  return HOME_SERVICE_SEO[slug] ?? DEFAULT_HOME_SERVICE_SEO;
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const shouldReduceMotion = useReducedMotion();
  const seo = getSeo(service.slug);
  const Icon = getServiceIcon(service.slug);

  return (
    <motion.article
      role="listitem"
      initial={{ opacity: 0, y: shouldReduceMotion ? 12 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: shouldReduceMotion ? 0 : index * 0.08, duration: shouldReduceMotion ? 0.2 : 0.45 }}
    >
      <div className="group relative h-full">
        <div
          className="absolute -inset-px rounded-2xl bg-gradient-to-br from-emerald-400/40 via-emerald-500/20 to-transparent opacity-0 blur-sm transition duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-800/60 shadow-xl backdrop-blur-xl transition duration-500 group-hover:-translate-y-1 group-hover:border-emerald-500/40">
          {service.image ? (
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={service.image}
                alt={`${service.title} — İstanbul profesyonel temizlik hizmeti`}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-emerald-400 backdrop-blur-md">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="absolute right-4 top-4 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
                {seo.priceBadge}
              </span>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3 p-5 pb-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-1 ring-emerald-500/20">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                {seo.priceBadge}
              </span>
            </div>
          )}

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <h2 className="text-lg font-bold text-white transition-colors group-hover:text-emerald-300 sm:text-xl">
              <Link href={`/hizmetler/${service.slug}`}>{service.title}</Link>
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-400/90">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {seo.regionLabel}
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">{seo.seoDesc}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
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
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-700/60 pt-4">
              <Link
                href={`/hizmetler/${service.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                Detaylı bilgi
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <Link href={`/blog/${seo.blogSlug}`} className="text-sm text-slate-400 transition hover:text-white">
                Fiyat rehberi
              </Link>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <Link href={`/bolgeler/sariyer/${service.slug}`} className="text-sm text-slate-400 transition hover:text-white">
                Sarıyer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

interface Props {
  services: Service[];
}

export default function ServicesPageClient({ services }: Props) {
  return (
    <SiteLayout>
      <div className="flex min-h-full flex-1 flex-col bg-slate-950">
        <PremiumPageHero
          badge="Profesyonel Temizlik"
          BadgeIcon={Sparkles}
          title="İstanbul Temizlik Hizmetleri"
          description="Zekeriyaköy, Sarıyer ve İstanbul Avrupa Yakası'nda ev, ofis, inşaat sonrası, halı-koltuk yıkama ve dış cephe temizliği. Şeffaf fiyatlandırma ve ücretsiz keşif."
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/fiyat-hesaplama"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
            >
              <Calculator className="h-4 w-4" aria-hidden="true" />
              Fiyat Hesapla
            </Link>
            <Link
              href="/randevu"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/50 hover:text-white"
            >
              Ücretsiz Keşif
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { href: '/bolgeler/sariyer', label: 'Sarıyer' },
              { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy' },
              { href: '/bolgeler/besiktas', label: 'Beşiktaş' },
              { href: '/bolgeler/sisli', label: 'Şişli' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </PremiumPageHero>

        <section className="relative border-t border-slate-800 py-16 sm:py-20" aria-label="Hizmetler listesi">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <SeoPriorityStrip title="Popüler temizlik aramaları ve fiyat rehberleri" />
            </div>

            {services.length === 0 ? (
              <div className="py-16 text-center">
                <Sparkles className="mx-auto mb-4 h-12 w-12 text-slate-500" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-white">Henüz hizmet bulunmuyor</h2>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Mevcut hizmetler">
                {services.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-slate-800 bg-slate-900/50 py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Size özel paket mi arıyorsunuz?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Villa, site, plaza veya inşaat sonrası projeleriniz için özel temizlik planı oluşturalım.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-medium text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
              >
                Teklif Alın
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/bolgeler/sariyer/zekeriyakoy"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-6 py-3 font-medium text-slate-200 transition hover:border-emerald-500/50"
              >
                Zekeriyaköy Hizmetleri
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
