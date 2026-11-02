import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { canonicalUrl } from '@/lib/seo';
import { clampMetaDescription, clampMetaTitle } from '@/lib/meta-clamp';
import { formatGoogleTrustLine } from '@/config/trust-signals';
import { SITE_CONTACT } from '@/config/site-contact';

const title = clampMetaTitle('Ekibimiz | Sarıyer Temizlik');
const description = clampMetaDescription(
  `Zümrüt Vadi Temizlik ekibi. ${formatGoogleTrustLine()}. Ücretsiz keşif, Sarıyer / Zekeriyaköy.`
);

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: canonicalUrl('/ekibimiz'),
  },
  openGraph: {
    title,
    description,
    url: canonicalUrl('/ekibimiz'),
    type: 'website',
    locale: 'tr_TR',
    siteName: SITE_CONTACT.companyName,
    images: [
      {
        url: canonicalUrl('/logo.png'),
        width: 1200,
        height: 630,
        alt: 'Zümrüt Vadi Temizlik - Ekip',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [canonicalUrl('/logo.png')],
  },
};

export default function EkipLayout({ children }: { children: ReactNode }) {
  return children;
}
