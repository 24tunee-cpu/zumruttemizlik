import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { canonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: 'Gizlilik Politikası | KVKK | Zümrüt Vadi Temizlik' },
  description:
    'Zümrüt Vadi Temizlik gizlilik politikası: İstanbul temizlik hizmetlerinde kişisel verilerin işlenmesi, KVKK kapsamı ve veri güvenliği yaklaşımı.',
  alternates: {
    canonical: canonicalUrl('/gizlilik'),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Gizlilik Politikası | Zümrüt Vadi Temizlik',
    description:
      'Kişisel veriler, KVKK uyumu ve veri güvenliği süreçleri hakkında güncel gizlilik politikamızı inceleyin.',
    url: canonicalUrl('/gizlilik'),
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Zümrüt Vadi Temizlik',
    images: [
      {
        url: canonicalUrl('/logo.png'),
        width: 1200,
        height: 630,
        alt: 'Zümrüt Vadi Temizlik - Gizlilik Politikası',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gizlilik Politikası | Zümrüt Vadi Temizlik',
    description: 'KVKK ve veri güvenliği süreçlerimiz hakkında detaylı bilgi alın.',
    images: [canonicalUrl('/logo.png')],
  },
};

export default function GizlilikLayout({ children }: { children: ReactNode }) {
  return children;
}
