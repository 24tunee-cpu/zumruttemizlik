import type { Metadata } from 'next';
import RegionsPageClient from '@/components/site/RegionsPageClient';
import { canonicalUrl } from '@/lib/seo';
import { keywordsForPage } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'İstanbul İlçe Bazlı Temizlik Hizmetleri | Sarıyer & Zekeriyaköy',
  description:
    'Zekeriyaköy, Sarıyer, Beşiktaş, Şişli ve İstanbul\'un 20 ilçesinde ev, ofis, inşaat sonrası temizlik. İlçe bazlı landing sayfaları ve ücretsiz keşif.',
  keywords: keywordsForPage('bolgeler'),
  alternates: {
    canonical: canonicalUrl('/bolgeler'),
  },
  openGraph: {
    title: 'İstanbul İlçe Bazlı Temizlik | Zümrüt Vadi Temizlik',
    description:
      'Zekeriyaköy ve Sarıyer öncelikli İstanbul ilçe temizlik sayfaları. Ev, ofis, inşaat sonrası ve halı-koltuk hizmetleri.',
    url: canonicalUrl('/bolgeler'),
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Zümrüt Vadi Temizlik',
    images: [
      {
        url: canonicalUrl('/logo.png'),
        width: 1200,
        height: 630,
        alt: 'Zümrüt Vadi Temizlik - İstanbul bölge hizmetleri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'İstanbul İlçe Bazlı Temizlik | Zümrüt Vadi',
    description: 'Zekeriyaköy, Sarıyer ve İstanbul ilçelerinde profesyonel temizlik.',
    images: [canonicalUrl('/logo.png')],
  },
};

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'İstanbul İlçe Bazlı Temizlik Hizmetleri',
  url: canonicalUrl('/bolgeler'),
  description: 'Zekeriyaköy, Sarıyer ve İstanbul ilçelerine özel temizlik landing sayfaları.',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: canonicalUrl('/') },
    { '@type': 'ListItem', position: 2, name: 'Bölgeler', item: canonicalUrl('/bolgeler') },
  ],
};

export default function RegionsHubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <RegionsPageClient />
    </>
  );
}
