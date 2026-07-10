/**
 * @fileoverview Home Page
 * @description Ana sayfa - Zümrüt Vadi Temizlik kurumsal web sitesi giriş sayfası.
 * SEO optimizasyonu, structured data ve lazy loading ile.
 *
 * @architecture
 * - Server Component (Server-Side Rendering)
 * - Suspense boundaries ile streaming
 * - Dynamic imports ile code splitting
 * - JSON-LD structured data ile zengin SEO
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import SiteLayout from './site/layout';
import { canonicalUrl, serializeSchemaGraph } from '@/lib/seo';
import DeferredHomeSections from '@/components/site/DeferredHomeSections';
import { keywordsForPage } from '@/lib/seo-keywords';
import { SERVICE_SEED_DATA } from '@/lib/seed-services';

// ============================================
// DYNAMIC IMPORTS (Code Splitting)
// ============================================

const Hero = dynamic(() => import('@/components/site/Hero').then(mod => mod.Hero), {
  loading: () => <div className="min-h-[100dvh] min-h-screen bg-slate-100 animate-pulse" />,
});

const Services = dynamic(() => import('@/components/site/Services').then(mod => mod.Services), {
  loading: () => <div className="h-96 bg-slate-50 animate-pulse" />,
});

// ============================================
// METADATA (SEO)
// ============================================

export const metadata: Metadata = {
  title: { absolute: 'İstanbul Temizlik Şirketi | Zümrüt Vadi Temizlik' },
  description:
    'İstanbul Avrupa Yakası (Sarıyer, Zekeriyaköy) ev, ofis ve inşaat sonrası temizlik. ✅ Ücretsiz keşif, aynı gün randevu, 7/24 destek. Anında fiyat hesapla ☎ 0551 925 09 43.',
  keywords: keywordsForPage('home'),
  alternates: {
    canonical: canonicalUrl('/'),
  },
  openGraph: {
    title: "Zümrüt Vadi Temizlik | İstanbul'da Profesyonel Temizlik Hizmetleri",
    description:
      'İstanbul genelinde ev, ofis ve inşaat sonrası temizlik çözümleri. Hızlı teklif ve 7/24 destek ile randevunuzu oluşturun.',
    url: canonicalUrl('/'),
    siteName: "Zümrüt Vadi Temizlik",
    images: [
      {
        url: canonicalUrl('/logo.png'),
        width: 1200,
        height: 630,
        alt: "Zümrüt Vadi Temizlik - İstanbul Profesyonel Temizlik",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const homeServicesItemListJson = serializeSchemaGraph([
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Zümrüt Vadi Temizlik Hizmetleri',
    description:
      'İstanbul Avrupa Yakası, Sarıyer ve Zekeriyaköy ev, ofis, inşaat sonrası, koltuk, halı, cam ve dış cephe temizlik hizmetleri.',
    itemListElement: SERVICE_SEED_DATA.filter((s) => s.isActive !== false).map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.title,
      url: canonicalUrl(`/hizmetler/${s.slug}`),
    })),
  },
]);

// ============================================
// LOADING FALLBACKS
// ============================================

function SectionLoading({ height = "h-96" }: { height?: string }) {
  return (
    <div className={`${height} bg-slate-100 animate-pulse flex items-center justify-center`}>
      <span className="sr-only">Yükleniyor...</span>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * Home Page Component
 * Ana sayfa - tüm bileşenleri Suspense ile sarmalar.
 * Her bileşen ayrı ayrı yüklenir (streaming).
 */
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: homeServicesItemListJson }} />
      <SiteLayout>
        {/* Hero - First Contentful Paint için öncelikli */}
        <Suspense fallback={<SectionLoading height="h-screen" />}>
          <Hero />
        </Suspense>

        {/* Services */}
        <Suspense fallback={<SectionLoading height="h-96" />}>
          <Services />
        </Suspense>

        {/* Below-the-fold sections (client-only deferred) */}
        <DeferredHomeSections />
      </SiteLayout>
    </>
  );
}
