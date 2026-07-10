import type { Metadata } from 'next';
import Link from 'next/link';
import SiteLayout from '../site/layout';
import { AppointmentRequestForm } from '@/components/site/AppointmentRequestForm';
import { PremiumPageHero } from '@/components/site/PremiumPageHero';
import { SeoPriorityStrip } from '@/components/site/SeoPriorityStrip';
import {
  canonicalUrl,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  serializeSchemaGraph,
} from '@/lib/seo';
import { keywordsForPage } from '@/lib/seo-keywords';
import { CalendarDays, Clock, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { SITE_CONTACT, toTelHref } from '@/config/site-contact';

export const metadata: Metadata = {
  title: 'İstanbul Temizlik Randevusu | Ücretsiz Keşif | Sarıyer & Zekeriyaköy',
  description:
    'Zekeriyaköy, Sarıyer ve İstanbul genelinde ücretsiz keşif randevusu. Ev, ofis, inşaat sonrası temizlik için aynı gün geri dönüş. Online randevu formu.',
  keywords: keywordsForPage('randevu'),
  alternates: { canonical: canonicalUrl('/randevu') },
  openGraph: {
    title: 'Ücretsiz Keşif Randevusu | Zümrüt Vadi Temizlik',
    description: 'Sarıyer ve Zekeriyaköy dahil İstanbul genelinde ücretsiz keşif. Aynı gün geri dönüş.',
    url: canonicalUrl('/randevu'),
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Zümrüt Vadi Temizlik',
    images: [{ url: canonicalUrl('/logo.png'), width: 1200, height: 630, alt: 'Zümrüt Vadi Temizlik - Randevu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ücretsiz Keşif Randevusu | Zümrüt Vadi',
    description: 'İstanbul temizlik randevusu — ücretsiz keşif, aynı gün dönüş.',
    images: [canonicalUrl('/logo.png')],
  },
};

const pageTitle = 'İstanbul Temizlik Randevusu | Ücretsiz Keşif';
const pageDescription =
  'Zekeriyaköy, Sarıyer ve İstanbul genelinde ücretsiz keşif randevusu. Aynı gün geri dönüş.';

const randevuJsonLd = serializeSchemaGraph([
  generateWebPageSchema({ path: '/randevu', title: pageTitle, description: pageDescription }),
  generateBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Ücretsiz keşif talebi', url: '/randevu' },
  ]) as Record<string, unknown>,
]);

const STEPS = [
  { n: '1', title: 'Talep gönderin', desc: 'Tarih + saat dilimi belirtin' },
  { n: '2', title: 'Onay araması', desc: 'Genelde 30 dk içinde dönüş' },
  { n: '3', title: 'Keşif / hizmet', desc: 'Net plan + fiyatlama' },
];

const FAQ = [
  {
    q: 'Randevu ne kadar sürede onaylanıyor?',
    a: 'Yoğunluğa göre aynı gün içinde dönüş yapıyoruz. Sarıyer ve Zekeriyaköy için öncelikli planlama uygulanır.',
  },
  {
    q: 'Keşif ücretli mi?',
    a: 'Hayır, keşif ve ön değerlendirme tamamen ücretsizdir.',
  },
  {
    q: 'Acil taleplerde ne yapmalıyım?',
    a: 'Formda not bırakın veya doğrudan arayın — 7/24 ulaşabilirsiniz.',
  },
];

export default function RandevuPage() {
  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: randevuJsonLd }} />
      <div className="min-h-screen bg-slate-950">
        <PremiumPageHero
          badge="Ücretsiz Keşif"
          badgeIcon="calendar"
          title="Hızlı Randevu, Aynı Gün Geri Dönüş"
          description="Zekeriyaköy, Sarıyer ve İstanbul Avrupa Yakası'nda ev, ofis ve inşaat sonrası temizlik için formu 1 dakikada doldurun. Operasyon ekibimiz uygunluk ve net saat için sizi arar."
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
              Önce Fiyat Hesapla
            </Link>
          </div>
        </PremiumPageHero>

        <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          {/* Steps */}
          <div className="mb-12 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-2xl border border-slate-700/60 bg-slate-800/50 p-5 text-center backdrop-blur-sm"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-400">
                  {step.n}
                </span>
                <p className="mt-3 font-semibold text-white">{step.title}</p>
                <p className="mt-1 text-sm text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr,0.85fr] lg:items-start">
            <section className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white">Keşif / randevu talebi</h2>
              <p className="mt-2 text-sm text-slate-400">
                Uygun gün ve saat dilimini seçin; ekibimiz onay ve net saat için sizi arar.
              </p>
              <div className="mt-6">
              <AppointmentRequestForm embedded />
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 backdrop-blur-sm">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Clock className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                  Sık sorulanlar
                </h2>
                <div className="mt-4 space-y-3">
                  {FAQ.map((item) => (
                    <div key={item.q} className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
                      <p className="font-medium text-white">{item.q}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  En çok talep edilen hizmetler
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { href: '/hizmetler/ofis-temizligi', label: 'Ofis Temizliği' },
                    { href: '/hizmetler/insaat-sonrasi-temizlik', label: 'İnşaat Sonrası' },
                    { href: '/hizmetler/ev-temizligi', label: 'Ev Temizliği' },
                    { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full border border-slate-600 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-200 transition hover:border-emerald-500/50 hover:text-emerald-300"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-white">Ücretsiz keşif garantisi</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Sarıyer Merkez merkezli ekip; Zekeriyaköy ve Boğaz hattına aynı gün yönlendirme.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-12">
            <SeoPriorityStrip title="Fiyat rehberleri ve hızlı linkler" />
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              Form yerine mesaj göndermek ister misiniz?
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
