import type { Metadata } from 'next';
import ServicesPageClient from '@/components/site/ServicesPageClient';
import { prisma } from '@/lib/prisma';
import { canonicalUrl } from '@/lib/seo';
import { keywordsForPage } from '@/lib/seo-keywords';
import { ConversionSeoAside } from '@/components/site/ConversionSeoAside';
import { StickySeoCtaBar } from '@/components/site/StickySeoCtaBar';
import { clampMetaDescription, clampMetaTitle } from '@/lib/meta-clamp';

const hizmetlerTitle = clampMetaTitle('İstanbul Temizlik Hizmetleri');
const hizmetlerDescription = clampMetaDescription(
  "Zekeriyaköy, Sarıyer ve İstanbul Avrupa Yakası'nda ev, ofis, inşaat sonrası, halı-koltuk yıkama ve dış cephe temizliği. Ücretsiz keşif ve online fiyat hesaplama."
);
const hizmetlerOgDescription = clampMetaDescription(
  'İstanbul genelinde ev, ofis, inşaat sonrası, koltuk-halı ve dış cephe temizlik çözümlerini karşılaştırın.'
);

export const metadata: Metadata = {
  title: hizmetlerTitle,
  description: hizmetlerDescription,
  keywords: keywordsForPage('hizmetler'),
  alternates: {
    canonical: canonicalUrl('/hizmetler'),
  },
  openGraph: {
    title: clampMetaTitle('İstanbul Temizlik Hizmetleri | Zümrüt Vadi'),
    description: hizmetlerOgDescription,
    url: canonicalUrl('/hizmetler'),
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Zümrüt Vadi Temizlik',
    images: [
      {
        url: canonicalUrl('/logo.png'),
        width: 1200,
        height: 630,
        alt: 'Zümrüt Vadi Temizlik Hizmetleri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: clampMetaTitle('İstanbul Temizlik Hizmetleri | Zümrüt Vadi'),
    description: hizmetlerOgDescription,
    images: [canonicalUrl('/logo.png')],
  },
};

const servicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Hizmetlerimiz',
  url: canonicalUrl('/hizmetler'),
  about: 'Profesyonel temizlik hizmetleri',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Ana Sayfa',
      item: canonicalUrl('/'),
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Hizmetlerimiz',
      item: canonicalUrl('/hizmetler'),
    },
  ],
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      shortDesc: true,
      features: true,
      image: true,
    },
  });

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.title,
      url: canonicalUrl(`/hizmetler/${service.slug}`),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <ServicesPageClient services={services}>
        <ConversionSeoAside
          contextLabel="Hizmetler hub teklif"
          sourcePrefix="hizmetler-aside"
          tone="dark"
        />
        <StickySeoCtaBar contextLabel="Hizmetler" sourcePrefix="hizmetler-sticky" />
      </ServicesPageClient>
    </>
  );
}
