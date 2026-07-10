/**
 * @fileoverview Contact Page — premium iletişim sayfası
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Calculator, CalendarDays, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SiteLayout from '../site/layout';
import { ContactForm } from '@/components/site/ContactForm';
import { PremiumPageHero } from '@/components/site/PremiumPageHero';
import { SeoPriorityStrip } from '@/components/site/SeoPriorityStrip';
import { SITE_CONTACT, toTelHref } from '@/config/site-contact';
import { canonicalUrl, getSiteUrl } from '@/lib/seo';
import { keywordsForPage } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'İletişim | Sarıyer & Zekeriyaköy Temizlik Teklif Hattı',
  description: `Zekeriyaköy, Sarıyer ve İstanbul Avrupa Yakası temizlik teklifi: ${SITE_CONTACT.phoneDisplay}. Ücretsiz keşif, online fiyat hesaplama ve aynı gün geri dönüş.`,
  keywords: keywordsForPage('iletisim'),
  alternates: {
    canonical: canonicalUrl('/iletisim'),
  },
  openGraph: {
    title: 'İletişim | Zümrüt Vadi Temizlik — Sarıyer & Zekeriyaköy',
    description: 'Ücretsiz keşif, teklif ve randevu için hızlı iletişim kanalları.',
    url: canonicalUrl('/iletisim'),
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Zümrüt Vadi Temizlik',
    images: [{ url: canonicalUrl('/logo.png'), width: 1200, height: 630, alt: 'Zümrüt Vadi Temizlik - İletişim' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'İletişim | Zümrüt Vadi Temizlik',
    description: 'Sarıyer & Zekeriyaköy temizlik teklifi ve ücretsiz keşif.',
    images: [canonicalUrl('/logo.png')],
  },
};

const contactStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Zümrüt Vadi Temizlik Şirketi',
  url: getSiteUrl(),
  logo: canonicalUrl('/logo.png'),
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: SITE_CONTACT.phoneE164,
      email: SITE_CONTACT.email,
      contactType: 'customer service',
      availableLanguage: ['Turkish'],
      areaServed: ['Sarıyer', 'Zekeriyaköy', 'İstanbul'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE_CONTACT.addressLine,
    addressLocality: SITE_CONTACT.addressLocality,
    addressRegion: SITE_CONTACT.addressRegion,
    postalCode: SITE_CONTACT.postalCode,
    addressCountry: SITE_CONTACT.addressCountry,
  },
};

const CONTACT_INFO = [
  {
    key: 'phone',
    label: 'Telefon',
    value: SITE_CONTACT.phoneDisplay,
    href: toTelHref(SITE_CONTACT.phoneE164),
    icon: Phone,
    description: '7/24 ulaşabilirsiniz',
  },
  {
    key: 'email',
    label: 'E-posta',
    value: SITE_CONTACT.email,
    href: `mailto:${SITE_CONTACT.email}`,
    icon: Mail,
    description: '24 saat içinde dönüş',
  },
  {
    key: 'address',
    label: 'Adres',
    value: SITE_CONTACT.addressLine,
    href: `https://www.google.com/maps?q=${encodeURIComponent(SITE_CONTACT.addressLine)}`,
    icon: MapPin,
    description: 'Sarıyer merkez — İstanbul geneli hizmet',
  },
  {
    key: 'hours',
    label: 'Çalışma Saatleri',
    value: '24 saat açık',
    icon: Clock,
    description: 'Acil talepler için hazırız',
  },
] as const;

function ContactLoading() {
  return (
    <div className="bg-slate-950 py-16 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="h-96 rounded-2xl bg-slate-800" />
          <div className="h-96 rounded-2xl bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactStructuredData) }}
      />

      <SiteLayout>
        <div className="bg-slate-950">
          <PremiumPageHero
            badge="İletişim & Teklif"
            BadgeIcon={MessageCircle}
            title="Sarıyer & Zekeriyaköy İçin Bize Ulaşın"
            description="Ücretsiz keşif, online fiyat hesaplama veya randevu için formu doldurun. Zekeriyaköy, Sarıyer ve İstanbul Avrupa Yakası'nda aynı gün dönüş sağlıyoruz."
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={toTelHref(SITE_CONTACT.phoneE164)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {SITE_CONTACT.phoneDisplay}
              </a>
              <Link
                href="/fiyat-hesaplama"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/50"
              >
                <Calculator className="h-4 w-4" aria-hidden="true" />
                Fiyat Hesapla
              </Link>
              <Link
                href={`https://wa.me/${SITE_CONTACT.whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20"
              >
                WhatsApp
              </Link>
            </div>
          </PremiumPageHero>

          <section className="border-t border-slate-800 py-12" aria-label="İletişim bilgileri">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {CONTACT_INFO.map((info) => {
                  const Icon = info.icon;
                  const hasHref = 'href' in info;

                  const inner = (
                    <>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 transition group-hover:bg-emerald-500/25">
                        <Icon className="h-6 w-6 text-emerald-400" aria-hidden="true" />
                      </div>
                      <h2 className="mb-1 text-lg font-semibold text-white">{info.label}</h2>
                      <p className="mb-2 font-medium text-emerald-400">{info.value}</p>
                      <p className="text-center text-sm text-slate-400">{info.description}</p>
                    </>
                  );

                  const cardClass =
                    'group flex flex-col items-center rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 backdrop-blur-sm transition hover:border-emerald-500/30 hover:bg-slate-800/60';

                  if (!hasHref) {
                    return (
                      <div key={info.key} className={cardClass}>
                        {inner}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={info.key}
                      href={info.href}
                      className={`${cardClass} focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                      {...(info.key === 'address' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {inner}
                    </a>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {[
                  { href: '/randevu', label: 'Randevu Oluştur', Icon: CalendarDays },
                  { href: '/hizmetler', label: 'Hizmetlerimiz', Icon: ArrowRight },
                  { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy', Icon: MapPin },
                  { href: '/blog', label: 'Fiyat Rehberleri', Icon: ArrowRight },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-500/40 hover:text-emerald-300"
                  >
                    <item.Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-10">
                <SeoPriorityStrip variant="blog" title="Popüler fiyat rehberleri" />
              </div>
            </div>
          </section>

          <Suspense fallback={<ContactLoading />}>
            <ContactForm variant="dark" />
          </Suspense>
        </div>
      </SiteLayout>
    </>
  );
}
