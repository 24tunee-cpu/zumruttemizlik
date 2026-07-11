import type { Metadata } from 'next';
import Link from 'next/link';
import SiteLayout from '../site/layout';
import { INTENT_LANDINGS } from '@/config/intent-seo';
import { canonicalUrl, generateBreadcrumbSchema, generateWebPageSchema, serializeSchemaGraph } from '@/lib/seo';
import { ArrowRight, Sparkles, Calculator, CalendarDays } from 'lucide-react';

const pageTitle = 'Temizlik Çözümleri | İnşaat, Taşınma, Kira & Ofis | İstanbul';
const pageDescription =
  'İnşaat sonrası, taşınma, kira teslim, boş ev ve kurumsal ofis temizliği çözümleri. Sarıyer, Zekeriyaköy ve İstanbul geneli. Ücretsiz keşif ve online fiyat hesaplama.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'inşaat sonrası temizlik',
    'taşınma temizliği istanbul',
    'kira öncesi temizlik',
    'boş ev temizliği',
    'ofis temizliği istanbul',
    'zekeriyaköy temizlik',
  ],
  alternates: { canonical: canonicalUrl('/cozumler') },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl('/cozumler'),
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Zümrüt Vadi Temizlik',
    images: [{ url: canonicalUrl('/logo.png'), width: 1200, height: 630, alt: 'Zümrüt Vadi Temizlik Çözümler' }],
  },
};

const jsonLd = serializeSchemaGraph([
  generateWebPageSchema({ path: '/cozumler', title: pageTitle, description: pageDescription }),
  generateBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Çözümler', url: '/cozumler' },
  ]) as Record<string, unknown>,
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Temizlik Çözümleri',
    itemListElement: INTENT_LANDINGS.map((intent, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: intent.name,
      url: canonicalUrl(`/cozumler/${intent.slug}`),
    })),
  },
]);

export default function CozumlerHubPage() {
  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <div className="min-h-screen bg-slate-950">
        <section className="relative overflow-hidden pt-24 pb-14 sm:pt-28 md:pt-32 md:pb-16">
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-400">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Profesyonel Çözümler
            </span>
            <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Temizlik Çözümleri
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-400">
              İnşaat sonrası, taşınma, kira teslim, boş ev ve kurumsal ofis temizliği için ihtiyacınıza özel
              rehberler, fiyat ipuçları ve ücretsiz keşif. Sarıyer, Zekeriyaköy ve İstanbul geneli.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/fiyat-hesaplama"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
              >
                <Calculator className="h-4 w-4" aria-hidden="true" />
                Fiyat Hesapla
              </Link>
              <Link
                href="/randevu"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/50"
              >
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Ücretsiz Keşif
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-20" aria-labelledby="solutions-grid">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="solutions-grid" className="sr-only">
              Tüm çözümler
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {INTENT_LANDINGS.map((intent) => (
                <Link
                  key={intent.slug}
                  href={`/cozumler/${intent.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 transition hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-slate-800/70"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                    {intent.heroBadge}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300">{intent.name}</h3>
                  <p className="mt-3 flex-1 text-sm text-slate-400 line-clamp-3">{intent.heroDescription}</p>
                  <p className="mt-4 text-xs font-medium text-emerald-400/90">{intent.priceHint}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-400">
                    Detaylı rehber
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
