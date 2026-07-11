import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calculator,
  Phone,
  CalendarDays,
  Sparkles,
  Building2,
} from 'lucide-react';
import type { IntentDistrictPage } from '@/config/intent-seo';
import { getRelatedIntents, getOtherIntentDistricts } from '@/config/intent-seo';
import { formatDistrictSide } from '@/config/programmatic-seo';
import { SITE_CONTACT, toTelHref } from '@/config/site-contact';

interface IntentDistrictLandingViewProps {
  page: IntentDistrictPage;
}

export function IntentDistrictLandingView({ page }: IntentDistrictLandingViewProps) {
  const { intent, district } = page;
  const related = getRelatedIntents(intent.relatedIntentSlugs);
  const otherDistricts = getOtherIntentDistricts(intent.slug, district.slug);
  const sideLabel = formatDistrictSide(district);

  return (
    <div className="bg-slate-950">
      <section className="relative overflow-hidden pt-24 pb-14 sm:pt-28 md:pt-32 md:pb-16">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/25 via-slate-950 to-slate-950"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-emerald-400">
                  Ana Sayfa
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/cozumler" className="hover:text-emerald-400">
                  Çözümler
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/cozumler/${intent.slug}`} className="hover:text-emerald-400">
                  {intent.name}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-emerald-400">{district.name}</li>
            </ol>
          </nav>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-400">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {district.name}
              {sideLabel ? ` · ${sideLabel}` : ''}
            </span>
            <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{page.heroTitle}</h1>
            <p className="mt-5 text-lg text-slate-400">{page.heroDescription}</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-2 text-sm font-semibold text-emerald-300">
              Tahmini: {intent.priceHint}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/randevu"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
              >
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Ücretsiz Keşif
              </Link>
              <Link
                href="/fiyat-hesaplama"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/50"
              >
                <Calculator className="h-4 w-4" aria-hidden="true" />
                Fiyat Hesapla
              </Link>
              <a
                href={toTelHref(SITE_CONTACT.phoneE164)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/50"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {SITE_CONTACT.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-900/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {district.name} bölgesinde {intent.name.toLowerCase()}
              </h2>
              <p className="mt-4 text-slate-400">{page.localBlurb}</p>
              {district.localSignals && district.localSignals.length > 0 && (
                <ul className="mt-6 space-y-2">
                  {district.localSignals.slice(0, 4).map((signal) => (
                    <li key={signal} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                      {signal}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={`/cozumler/${intent.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {intent.name} genel rehberi
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Kapsam</h2>
              <ul className="mt-4 space-y-2">
                {intent.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Nasıl çalışır?</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {intent.processSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5"
              >
                <span className="text-sm font-bold text-emerald-400">Adım {index + 1}</span>
                <h3 className="mt-2 font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-900/40 py-14" aria-labelledby="local-links-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="local-links-heading" className="text-2xl font-bold text-white sm:text-3xl">
            {district.name} ilgili sayfalar
          </h2>
          <p className="mt-3 text-slate-400">
            Aynı ilçede hizmet detayı ve diğer niyet sayfalarına hızlı erişim.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/bolgeler/${district.slug}/${intent.serviceSlug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-2.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-950/50"
            >
              <Building2 className="h-4 w-4" aria-hidden="true" />
              {district.name} {intent.serviceSlug.replace(/-/g, ' ')}
            </Link>
            <Link
              href={`/bolgeler/${district.slug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-200 transition hover:border-emerald-500/40 hover:text-emerald-300"
            >
              <MapPin className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              {district.name} tüm hizmetler
            </Link>
            {district.slug === 'sariyer' && (
              <Link
                href="/bolgeler/sariyer/zekeriyakoy"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-2.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-950/50"
              >
                Zekeriyaköy
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 py-14" aria-labelledby="other-districts-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="other-districts-heading" className="text-2xl font-bold text-white sm:text-3xl">
            Diğer ilçeler — {intent.name}
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {otherDistricts.map((d) => (
              <Link
                key={d.slug}
                href={`/cozumler/${intent.slug}/${d.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-200 transition hover:border-emerald-500/40 hover:text-emerald-300"
              >
                <MapPin className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                {d.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 py-14" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="faq-heading" className="text-2xl font-bold text-white sm:text-3xl">
            Sık sorulan sorular
          </h2>
          <div className="mt-6 space-y-3">
            {page.faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-slate-700/60 bg-slate-800/40 p-4"
              >
                <summary className="cursor-pointer list-none font-semibold text-white">{item.q}</summary>
                <p className="mt-2 text-sm text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {related.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white">İlgili çözümler</h2>
                <ul className="mt-4 space-y-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/cozumler/${r.slug}/${district.slug}`}
                        className="flex items-center gap-2 text-slate-300 transition hover:text-emerald-400"
                      >
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        {district.name} {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {intent.blogSlug && (
              <div>
                <h2 className="text-xl font-bold text-white">Fiyat rehberi</h2>
                <p className="mt-2 text-sm text-slate-400">
                  2026 güncel fiyat aralıkları ve bütçeleme ipuçları için blog yazımızı okuyun.
                </p>
                <Link
                  href={`/blog/${intent.blogSlug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Fiyat rehberini oku
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 shadow-xl shadow-emerald-900/30">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              {district.name} — {intent.name} için ücretsiz keşif
            </h2>
            <p className="mt-2 text-sm text-emerald-50/90">
              Tahmini fiyatınızı hesaplayın veya doğrudan randevu oluşturun — aynı gün geri dönüş.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/randevu"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Randevu Oluştur
              </Link>
              <Link
                href="/fiyat-hesaplama"
                className="rounded-xl border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Fiyat Hesapla
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
