import type { Metadata } from 'next';
import Link from 'next/link';
import SiteLayout from '../site/layout';
import { PricingTablesSection, type AdminPricingRow } from '@/components/site/PricingTablesSection';
import { prisma } from '@/lib/prisma';
import {
  canonicalUrl,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateWebPageSchema,
  serializeSchemaGraph,
} from '@/lib/seo';
import { Calculator, Calendar, MessageCircle } from 'lucide-react';
import { SITE_CONTACT } from '@/config/site-contact';

export const revalidate = 3600;

const pageTitle = 'Temizlik Fiyatları 2026 | İstanbul Fiyat Listesi | Zümrüt Vadi';
const pageDescription =
  'İstanbul temizlik fiyatları 2026: ev, ofis, inşaat sonrası, koltuk ve dış cephe temizliği güncel fiyat listesi. Sarıyer, Zekeriyaköy ve İstanbul geneli. Ücretsiz keşif, şeffaf aralıklar.';

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  keywords: [
    'temizlik fiyatları',
    'temizlik fiyatları 2026',
    'istanbul temizlik fiyatları',
    'ev temizliği fiyatları',
    'ofis temizliği fiyatları',
    'inşaat sonrası temizlik fiyatı',
    'sarıyer temizlik fiyatları',
    'zekeriyaköy temizlik fiyatları',
  ],
  alternates: { canonical: canonicalUrl('/fiyatlar') },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl('/fiyatlar'),
    type: 'website',
    locale: 'tr_TR',
    siteName: SITE_CONTACT.companyName,
  },
};

const FAQ_ITEMS = [
  {
    question: 'Temizlik fiyatları neden aralık olarak veriliyor?',
    answer:
      'Her mekânın kirlilik düzeyi, metrekare, erişim ve ek hizmet ihtiyacı farklıdır. Aralıklar 2026 İstanbul piyasasına göre tahminî değerlerdir; kesin fiyat ücretsiz keşif sonrası yazılır.',
  },
  {
    question: 'Fiyat listesi ile anında hesaplama arasındaki fark nedir?',
    answer:
      'Bu sayfa güncel referans fiyat listesidir. Oda sayısı, metrekare ve ekstraları seçerek anında tahmin için fiyat hesaplama aracını kullanabilirsiniz.',
  },
  {
    question: 'Ücretsiz keşif var mı?',
    answer:
      'Evet. Keşif ve ön değerlendirme ücretsizdir. Randevu veya WhatsApp üzerinden aynı gün dönüş alabilirsiniz.',
  },
];

async function loadAdminPricing(): Promise<AdminPricingRow[]> {
  try {
    const rows = await prisma.pricing.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        serviceName: true,
        basePrice: true,
        pricePerSqm: true,
        unit: true,
        minPrice: true,
        description: true,
        features: true,
      },
    });
    return rows;
  } catch {
    return [];
  }
}

export default async function FiyatlarPage() {
  const adminPricing = await loadAdminPricing();
  const waHref = `https://wa.me/${SITE_CONTACT.whatsappDigits}?text=${encodeURIComponent(
    'Merhaba, temizlik fiyat listesi hakkında bilgi ve ücretsiz keşif almak istiyorum.'
  )}`;

  const jsonLd = serializeSchemaGraph([
    generateWebPageSchema({
      path: '/fiyatlar',
      title: pageTitle,
      description: pageDescription,
    }),
    generateBreadcrumbSchema([
      { name: 'Ana Sayfa', url: '/' },
      { name: 'Temizlik Fiyatları', url: '/fiyatlar' },
    ]) as Record<string, unknown>,
    generateFAQSchema(FAQ_ITEMS) as Record<string, unknown>,
  ]);

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <section className="relative overflow-hidden bg-slate-900 pt-28 pb-14">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-950"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
            2026 Güncel Fiyat Listesi
          </p>
          <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            İstanbul Temizlik Fiyatları
          </h1>
          <p className="mt-5 max-w-3xl text-base text-slate-300 sm:text-lg">
            Ev, ofis, inşaat sonrası ve dış cephe temizliği için şeffaf tahmini aralıklar. Sarıyer,
            Zekeriyaköy ve İstanbul genelinde ücretsiz keşif ile net fiyat.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/fiyat-hesaplama"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              <Calculator className="h-4 w-4" aria-hidden />
              Anında Fiyat Hesapla
            </Link>
            <Link
              href="/randevu"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/20"
            >
              <Calendar className="h-4 w-4" aria-hidden />
              Ücretsiz Keşif
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            2026 İstanbul Temizlik Fiyat Listesi (Tahmini)
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Aşağıdaki tablolar orta–üst segment hizmet için referans aralıklarıdır. Admin panelden
            güncellenen satırlar varsa listenin üstünde gösterilir.
          </p>
          <PricingTablesSection adminPricing={adminPricing} />
        </div>
      </section>

      <section className="bg-slate-50 py-14 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sık Sorulan Sorular</h2>
          <div className="mt-6 space-y-3">
            {FAQ_ITEMS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
              >
                <summary className="cursor-pointer list-none font-semibold text-slate-900 dark:text-white">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
