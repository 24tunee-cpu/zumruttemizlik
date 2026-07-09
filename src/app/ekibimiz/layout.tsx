import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { canonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Ekibimiz | İstanbul Temizlik Uzmanları',
  description:
    'İstanbul genelinde hizmet veren Zümrüt Vadi Temizlik ekibini tanıyın. Ev, ofis ve inşaat sonrası temizlikte görev alan uzman kadro bilgileri.',
  alternates: {
    canonical: canonicalUrl('/ekibimiz'),
  },
  openGraph: {
    title: 'Ekibimiz | Zümrüt Vadi Temizlik',
    description:
      'İstanbul temizlik operasyonlarında görev alan uzman ekip üyelerini ve çalışma yaklaşımımızı inceleyin.',
    url: canonicalUrl('/ekibimiz'),
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Zümrüt Vadi Temizlik',
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
    title: 'Ekibimiz | Zümrüt Vadi Temizlik',
    description: 'İstanbul genelinde hizmet veren uzman temizlik ekibini tanıyın.',
    images: [canonicalUrl('/logo.png')],
  },
};

export default function EkipLayout({ children }: { children: ReactNode }) {
  return children;
}
