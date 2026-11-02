/**
 * @fileoverview Gallery Page
 * @description Galeri sayfası - çalışma örnekleri ve before/after görselleri.
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import SiteLayout from '../site/layout';
import { GallerySection } from '../../components/site/GallerySection';
import RelatedSeoLinks from '@/components/site/RelatedSeoLinks';
import { StickySeoCtaBar } from '@/components/site/StickySeoCtaBar';
import { WhyChooseZvt } from '@/components/site/WhyChooseZvt';
import { ImageIcon, ArrowRight } from 'lucide-react';
import {
  canonicalUrl,
  generateBreadcrumbSchema,
  serializeSchemaGraph,
} from '@/lib/seo';
import { keywordsForPage } from '@/lib/seo-keywords';
import { SITE_CONTACT } from '@/config/site-contact';

export const metadata: Metadata = {
  title: 'Temizlik Öncesi/Sonrası Galeri | İstanbul',
  description:
    'İstanbul temizlik galerisi: ev, ofis ve inşaat sonrası önce/sonra örnekleri. Sarıyer ve Zekeriyaköy odaklı gerçek iş görselleri.',
  keywords: keywordsForPage('galeri'),
  alternates: {
    canonical: canonicalUrl('/galeri'),
  },
  openGraph: {
    title: 'Temizlik Öncesi/Sonrası Galeri | İstanbul',
    description:
      'İstanbul genelindeki temizlik uygulamalarımızdan önce/sonra görsellerini inceleyerek hizmet kalitesini değerlendirin.',
    url: canonicalUrl('/galeri'),
    type: 'website',
    locale: 'tr_TR',
    siteName: SITE_CONTACT.companyName,
    images: [
      {
        url: canonicalUrl('/logo.png'),
        width: 1200,
        height: 630,
        alt: 'Zümrüt Vadi Temizlik - Galeri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Temizlik Öncesi/Sonrası Galeri | İstanbul',
    description: 'İstanbul temizlik projelerinden önce/sonra görsellerini inceleyin.',
    images: [canonicalUrl('/logo.png')],
  },
};

const gallerySchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Zümrüt Vadi Temizlik Galeri',
  description:
    'Temizlik çalışmalarımızdan önce/sonra örnekler — ev, ofis ve inşaat sonrası.',
  url: canonicalUrl('/galeri'),
  isPartOf: {
    '@type': 'WebSite',
    name: SITE_CONTACT.companyName,
    url: canonicalUrl('/'),
  },
  about: {
    '@type': 'LocalBusiness',
    name: SITE_CONTACT.companyName,
    telephone: SITE_CONTACT.phoneE164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONTACT.addressStreet,
      addressLocality: SITE_CONTACT.addressLocality,
      addressRegion: SITE_CONTACT.addressRegion,
      postalCode: SITE_CONTACT.postalCode,
      addressCountry: SITE_CONTACT.addressCountry,
    },
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Ana Sayfa', url: '/' },
  { name: 'Galeri', url: '/galeri' },
]);

function GalleryLoading() {
  return (
    <div className="bg-slate-900 py-16 animate-pulse">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-slate-700 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const schemaGraph = serializeSchemaGraph([
    gallerySchema as Record<string, unknown>,
    breadcrumbSchema,
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaGraph }}
      />

      <SiteLayout>
        <div className="flex min-h-full flex-1 flex-col bg-slate-900">
          <section
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 pt-24 pb-12 sm:pt-28 sm:pb-14 md:pt-32 md:pb-16"
            aria-label="Sayfa başlığı"
          >
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <ImageIcon
                className="mx-auto mb-6 h-14 w-14 text-emerald-400 sm:h-16 sm:w-16"
                aria-hidden="true"
              />
              <h1 className="text-balance text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                Temizlik Galerisi
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base text-slate-300 sm:text-lg">
                Ev, ofis ve inşaat sonrası işlerden önce/sonra örnekler. Görseller admin
                panelden yönetilir; stok fotoğraf iddiası yapılmaz.
              </p>
            </div>
          </section>

          <Suspense fallback={<GalleryLoading />}>
            <GallerySection />
          </Suspense>

          <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <RelatedSeoLinks
              tone="dark"
              heading="Galeriden sonra teklif rotası"
              intro="Örnekleri gördünüzse doğru hizmet veya bölge sayfasına geçin."
              groups={[
                {
                  title: 'Hizmetler',
                  links: [
                    { href: '/hizmetler/ev-temizligi', label: 'Ev temizliği' },
                    { href: '/hizmetler/ofis-temizligi', label: 'Ofis temizliği' },
                    { href: '/hizmetler/insaat-sonrasi-temizlik', label: 'İnşaat sonrası' },
                    { href: '/hizmetler', label: 'Tüm hizmetler' },
                  ],
                },
                {
                  title: 'Bölgeler',
                  links: [
                    { href: '/bolgeler/sariyer', label: 'Sarıyer' },
                    { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy' },
                    { href: '/bolgeler/sariyer/uskumrukoy', label: 'Uskumruköy' },
                    { href: '/bolgeler', label: 'Tüm bölgeler' },
                  ],
                },
                {
                  title: 'Teklif',
                  links: [
                    { href: '/fiyat-hesaplama', label: 'Fiyat hesapla' },
                    { href: '/randevu', label: 'Ücretsiz keşif' },
                    { href: '/harita-ve-yorumlar', label: 'Harita & yorumlar' },
                  ],
                },
              ]}
            />
            <WhyChooseZvt tone="dark" contextLabel="Galeri sonrası temizlik" sourcePrefix="galeri-why-zvt" />
          </div>

          <section className="flex-1 border-t border-slate-800 bg-slate-900 py-16">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <h2 className="mb-4 text-2xl font-bold text-white">
                Benzer sonucu kendi mekânınızda istiyorsanız
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-slate-300">
                Ücretsiz keşif ile kapsam ve tahmini fiyatı netleştirin.
              </p>
              <Link
                href="/randevu"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Ücretsiz Keşif Talep Edin
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </section>
          <StickySeoCtaBar contextLabel="Galeri" sourcePrefix="galeri-sticky" />
        </div>
      </SiteLayout>
    </>
  );
}
