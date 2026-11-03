/**
 * @fileoverview About Page
 * @description Hakkımızda sayfası - şirket hikayesi, değerler ve ekip.
 * SEO optimizasyonu, structured data ve admin-site senkronizasyonu ile.
 *
 * @architecture
 * - Server Component (Server-Side Rendering)
 * - JSON-LD structured data (Organization schema)
 * - Static content with admin-sync potential
 * - TeamSection integration
 *
 * @admin-sync
 * İstatistikler ve değerler admin panelden dinamik olarak güncellenebilir.
 * Ekip üyeleri /admin/ekip sayfasından yönetilir.
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import SiteLayout from '../site/layout';
import { TeamSection } from '../../components/site/TeamSection';
import { SITE_CONTACT } from '@/config/site-contact';
import {
  VERIFIED_TRUST,
  formatGoogleTrustLine,
} from '@/config/trust-signals';
import { canonicalUrl, generateBreadcrumbSchema, getSiteUrl } from '@/lib/seo';
import { keywordsForPage } from '@/lib/seo-keywords';
import { Sparkles, Shield, Award, Clock, Heart, ArrowRight } from 'lucide-react';
import { ConversionSeoAside } from '@/components/site/ConversionSeoAside';
import { StickySeoCtaBar } from '@/components/site/StickySeoCtaBar';
import { clampMetaDescription, clampMetaTitle } from '@/lib/meta-clamp';

// ============================================
// METADATA (SEO)
// ============================================

const hakkimizdaTitle = clampMetaTitle('Hakkımızda | Sarıyer & Zekeriyaköy Temizlik');
const hakkimizdaDescription = clampMetaDescription(
  `${SITE_CONTACT.companyName}: Sarıyer ve Zekeriyaköy odaklı ev, ofis, inşaat sonrası temizlik. ${formatGoogleTrustLine()}. Ücretsiz keşif, şeffaf kapsam.`
);
const hakkimizdaOgDescription = clampMetaDescription(
  `Sarıyer / Zekeriyaköy temizlik ekibi. ${formatGoogleTrustLine()}. Ücretsiz keşif ve 7/24 destek.`
);

export const metadata: Metadata = {
  title: hakkimizdaTitle,
  description: hakkimizdaDescription,
  keywords: keywordsForPage('hakkimizda'),
  alternates: {
    canonical: canonicalUrl('/hakkimizda'),
  },
  openGraph: {
    title: hakkimizdaTitle,
    description: hakkimizdaOgDescription,
    url: canonicalUrl('/hakkimizda'),
    type: 'website',
    locale: 'tr_TR',
    siteName: SITE_CONTACT.companyName,
    images: [
      {
        url: canonicalUrl('/logo.png'),
        width: 1200,
        height: 630,
        alt: 'Zümrüt Vadi Temizlik - Hakkımızda',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: hakkimizdaTitle,
    description: hakkimizdaOgDescription,
    images: [canonicalUrl('/logo.png')],
  },
};

// ============================================
// JSON-LD STRUCTURED DATA (Organization)
// ============================================

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Zümrüt Vadi Temizlik Şirketi",
  "alternateName": "Zümrüt Vadi Temizlik",
  "url": getSiteUrl(),
  "logo": canonicalUrl('/logo.png'),
  "description": `Sarıyer ve Zekeriyaköy odaklı profesyonel temizlik. ${formatGoogleTrustLine()}.`,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": SITE_CONTACT.addressStreet,
    "addressLocality": SITE_CONTACT.addressLocality,
    "addressRegion": SITE_CONTACT.addressRegion,
    "postalCode": SITE_CONTACT.postalCode,
    "addressCountry": SITE_CONTACT.addressCountry
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": SITE_CONTACT.phoneE164,
    "email": SITE_CONTACT.email,
    "contactType": "customer service",
    "availableLanguage": ["Turkish"]
  },
  "sameAs": [
    "https://facebook.com/zumrutvaditemizlik",
    "https://instagram.com/zumrutvaditemizlik"
  ]
};

// ============================================
// CONSTANTS (Admin'den dinamik çekilebilir)
// ============================================

/** Doğrulanmış güven — trust-signals (uydurma 5000+/15+ yok) */
const STATS_CONFIG = [
  {
    value: String(VERIFIED_TRUST.googleRating),
    label: 'Google puan',
    id: 'google',
  },
  {
    value: String(VERIFIED_TRUST.googleReviewCount),
    label: 'Google yorum',
    id: 'reviews',
  },
  { value: '7/24', label: 'Destek hattı', id: 'support' },
  { value: 'Ücretsiz', label: 'Keşif', id: 'discovery' },
] as const;

/** Değerler - Admin panelden güncellenebilir */
const VALUES_CONFIG = [
  { icon: Shield, title: 'Güvenilirlik', desc: 'Müşteri güvenliği bizim için her şeyden önemli', id: 'trust' },
  { icon: Award, title: 'Kalite', desc: 'En yüksek standartlarda temizlik garantisi', id: 'quality' },
  { icon: Clock, title: 'Hız', desc: 'Zamanında ve eksiksiz hizmet', id: 'speed' },
  { icon: Heart, title: 'Memnuniyet', desc: 'Müşteri memnuniyeti odaklı çalışma', id: 'satisfaction' },
] as const;

// ============================================
// LOADING FALLBACK
// ============================================

function TeamLoading() {
  return (
    <div className="py-16 animate-pulse">
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mx-auto mb-12" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * About Page Component
 * Hakkımızda sayfası - şirket hikayesi, değerler ve ekip.
 * 
 * @admin-sync İçerik admin panelden güncellenebilir
 */
export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: 'Ana Sayfa', url: '/' },
              { name: 'Hakkımızda', url: '/hakkimizda' },
            ])
          ),
        }}
      />

      <SiteLayout>
        {/* Hero */}
        <section
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 pt-24 pb-12 sm:pt-28 sm:pb-14 md:pt-32 md:pb-16"
          aria-label="Sayfa başlığı"
        >
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <Sparkles className="mx-auto mb-6 h-14 w-14 text-emerald-400 sm:h-16 sm:w-16" aria-hidden="true" />
            <h1 className="text-balance text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Sarıyer &amp; Zekeriyaköy temizlik ekibi
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">
              {SITE_CONTACT.companyName} olarak villa, ev, ofis ve inşaat sonrası temizlikte
              şeffaf kapsam ve ücretsiz keşif sunuyoruz. {formatGoogleTrustLine()} — Google’da
              görüntülenebilir.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section
          className="bg-slate-50 dark:bg-slate-800 py-16"
          aria-label="İstatistikler"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STATS_CONFIG.map((stat) => (
                <div key={stat.id} className="text-center p-4">
                  <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{stat.value}</p>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white text-center">
              Hikayemiz
            </h2>
            <article className="space-y-6 text-lg text-slate-600 dark:text-slate-300">
              <p>
                {SITE_CONTACT.companyName}, Sarıyer (Ferahevler) merkezli hibrit bir temizlik
                ekibidir. Öncelik hattımız Zekeriyaköy, Maslak, Tarabya, Bahçeköy ve Uskumruköy;
                Avrupa Yakası yakın ilçelerde de planlı hizmet sunuyoruz.
              </p>
              <p>
                Ev, ofis, inşaat sonrası, cam, koltuk ve halı temizliği paketlerimiz keşif sonrası
                netleşir — sürpriz kapsam dili kullanmayız. Peyzaj veya bahçe düzenleme hizmeti
                vermiyoruz; bahçe kenarı yalnızca yüzey temizliği olarak eklenebilir.
              </p>
              <p>
                Teklif için {SITE_CONTACT.phoneDisplay}, WhatsApp veya ücretsiz keşif formu yeterlidir.
                Güncel Google puanımız: {formatGoogleTrustLine()}.
              </p>
            </article>
          </div>
        </section>

        {/* Values */}
        <section
          className="bg-slate-900 dark:bg-slate-950 py-16"
          aria-label="Değerlerimiz"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">Değerlerimiz</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES_CONFIG.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.id}
                    className="rounded-2xl bg-slate-800 dark:bg-slate-800/50 p-6 text-center"
                  >
                    <Icon className="mx-auto mb-4 h-10 w-10 text-emerald-400" aria-hidden="true" />
                    <h3 className="mb-2 text-lg font-semibold text-white">{value.title}</h3>
                    <p className="text-slate-400">{value.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section with Suspense */}
        <Suspense fallback={<TeamLoading />}>
          <TeamSection />
        </Suspense>

        {/* CTA Section */}
        <section className="py-16 bg-emerald-50 dark:bg-emerald-900/20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Tanışmak ister misiniz?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              Profesyonel ekibimiz ve kaliteli hizmetimizle tanışmak için
              hemen iletişime geçin.
            </p>
            <Link
              href="/iletisim"
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Bizimle İletişime Geçin
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <ConversionSeoAside
          contextLabel="Hakkımızda sonrası teklif"
          sourcePrefix="hakkimizda-aside"
          tone="light"
        />
        <StickySeoCtaBar contextLabel="Hakkımızda" sourcePrefix="hakkimizda-sticky" />
      </SiteLayout>
    </>
  );
}
