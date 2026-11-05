/**
 * @fileoverview Home Page
 * @description Ana sayfa — yerel niyet, doğrulanmış trust, SSR yorum + hizmet, AEO FAQ.
 */

import type { Metadata } from 'next';
import { Suspense, cache } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SiteLayout from './site/layout';
import { Hero } from '@/components/site/Hero';
import { canonicalUrl, serializeSchemaGraph } from '@/lib/seo';
import DeferredHomeSections from '@/components/site/DeferredHomeSections';
import RelatedSeoLinks from '@/components/site/RelatedSeoLinks';
import { WhyChooseZvt } from '@/components/site/WhyChooseZvt';
import { StickySeoCtaBar } from '@/components/site/StickySeoCtaBar';
import { keywordsForPage } from '@/lib/seo-keywords';
import { SERVICE_SEED_DATA } from '@/lib/seed-services';
import { clampMetaDescription, clampMetaTitle } from '@/lib/meta-clamp';
import { fetchPublicTestimonialsForSeo } from '@/lib/testimonials-seo';
import { formatGoogleTrustLine } from '@/config/trust-signals';
import { SITE_CONTACT } from '@/config/site-contact';

const getHomeTestimonials = cache(fetchPublicTestimonialsForSeo);

const Services = dynamic(() => import('@/components/site/Services').then((mod) => mod.Services), {
  loading: () => <div className="h-96 animate-pulse bg-slate-50" />,
});

const homeTitle = clampMetaTitle('İstanbul Temizlik Şirketi | Sarıyer & Zekeriyaköy');
const homeDescription = clampMetaDescription(
  `Sarıyer ve Zekeriyaköy ev, ofis, inşaat sonrası temizlik. ${formatGoogleTrustLine()}. Ücretsiz keşif, aynı gün randevu. ${SITE_CONTACT.phoneDisplay}.`
);

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  keywords: keywordsForPage('home'),
  alternates: {
    canonical: canonicalUrl('/'),
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: canonicalUrl('/'),
    siteName: SITE_CONTACT.companyName,
    images: [
      {
        url: canonicalUrl('/og-image.jpg'),
        width: 1200,
        height: 630,
        alt: 'Zümrüt Vadi Temizlik - Sarıyer Zekeriyaköy',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
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

const activeServices = SERVICE_SEED_DATA.filter((s) => s.isActive !== false);

const homeServicesItemListJson = serializeSchemaGraph([
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Zümrüt Vadi Temizlik Hizmetleri',
    description:
      'İstanbul Avrupa Yakası, Sarıyer ve Zekeriyaköy ev, ofis, inşaat sonrası, koltuk, halı, cam ve dış cephe temizlik hizmetleri.',
    itemListElement: activeServices.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.title,
      url: canonicalUrl(`/hizmetler/${s.slug}`),
    })),
  },
]);

/** AEO — kısa, doğrulanmış cevaplar (FAQ rich spam değil) */
const HOME_AEO_FAQS = [
  {
    q: 'Sarıyer ve Zekeriyaköy’de temizlik hizmeti veriyor musunuz?',
    a: 'Evet. Öncelik hattımız Sarıyer (Zekeriyaköy, Maslak, Tarabya, Bahçeköy, Uskumruköy). Avrupa Yakası ve İstanbul geneli talepleri rota/kapasiteye göre planlıyoruz; kesin onay ücretsiz keşif sonrasındadır.',
  },
  {
    q: 'İstanbul temizlik fiyatı nasıl netleşir?',
    a: 'Metrekare, kirlilik, hizmet türü ve ekip süresi fiyatı etkiler. Online hesaplayıcı tahmini verir; kesin teklif ücretsiz keşif veya kısa bilgi sonrası netleşir.',
  },
  {
    q: 'Google yorumlarınız nerede?',
    a: `${formatGoogleTrustLine()}. Güncel puan ve yorumlar için /harita-ve-yorumlar sayfasına bakın; uydurma müşteri sayısı kullanmıyoruz.`,
  },
  {
    q: 'Aynı gün randevu mümkün mü?',
    a: 'Kapasite uygunsa aynı gün keşif/randevu açılabilir. 7/24 destek hattımızdan veya randevu formundan yazın.',
  },
] as const;

const homeFaqJson = serializeSchemaGraph([
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_AEO_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  },
]);

const initialHomeServices = activeServices.map((s) => ({
  id: `seed-${s.slug}`,
  title: s.title,
  slug: s.slug,
  shortDesc: s.shortDesc,
  image: typeof s.image === 'string' ? s.image : null,
  icon: typeof s.icon === 'string' ? s.icon : null,
}));

function SectionLoading({ height = 'h-96' }: { height?: string }) {
  return (
    <div className={`${height} flex items-center justify-center animate-pulse bg-slate-100`}>
      <span className="sr-only">Yükleniyor...</span>
    </div>
  );
}

/** ISR: yorumlar güncellenince yenilensin */
export const revalidate = 86400;

export default async function HomePage() {
  const rows = await getHomeTestimonials();
  const initialTestimonials = rows.slice(0, 12).map((t) => ({
    id: t.id,
    name: t.name,
    location: t.location ?? '',
    rating: t.rating,
    content: t.content,
    avatar: t.avatar ?? undefined,
    service: t.service ?? undefined,
    isActive: true as const,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: homeServicesItemListJson }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: homeFaqJson }}
      />
      <SiteLayout>
        <Suspense fallback={<SectionLoading height="h-screen" />}>
          <Hero />
        </Suspense>

        <Suspense fallback={<SectionLoading height="h-96" />}>
          <Services initialServices={initialHomeServices} />
        </Suspense>

        <div className="bg-slate-900 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <WhyChooseZvt
              tone="dark"
              contextLabel="Ana sayfa temizlik teklifi"
              sourcePrefix="home-why-zvt"
            />
            <RelatedSeoLinks
              tone="dark"
              heading="Öncelikli semt ve niyetler"
              intro="Sarıyer hattı ve SSS — kopya mahalle şişirmeden doğru sayfaya geçin."
              groups={[
                {
                  title: 'Semt & semt×hizmet',
                  links: [
                    { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy' },
                    {
                      href: '/bolgeler/sariyer/zekeriyakoy-ev-temizligi',
                      label: 'Zekeriyaköy ev temizliği',
                    },
                    {
                      href: '/bolgeler/sariyer/maslak-ofis-temizligi',
                      label: 'Maslak ofis',
                    },
                    { href: '/bolgeler/sariyer', label: 'Sarıyer hub' },
                  ],
                },
                {
                  title: 'SSS / AEO',
                  links: [
                    { href: '/sss/fiyat', label: 'Fiyat SSS' },
                    { href: '/sss/bolge', label: 'Bölge SSS' },
                    { href: '/geo-sss', label: 'GEO SSS' },
                    { href: '/harita-ve-yorumlar', label: 'Harita & yorumlar' },
                  ],
                },
                {
                  title: 'Teklif',
                  links: [
                    { href: '/randevu', label: 'Ücretsiz keşif' },
                    { href: '/fiyat-hesaplama', label: 'Fiyat hesapla' },
                    { href: '/hizmetler', label: 'Hizmetler' },
                  ],
                },
              ]}
            />

            <section className="mt-10" aria-labelledby="home-aeo-faq-heading">
              <h2 id="home-aeo-faq-heading" className="text-xl font-semibold text-white">
                Sık sorulanlar
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Kısa cevaplar — detay için{' '}
                <Link href="/sss" className="font-medium text-emerald-300 underline underline-offset-2">
                  SSS
                </Link>{' '}
                veya{' '}
                <Link
                  href="/geo-sss"
                  className="font-medium text-emerald-300 underline underline-offset-2"
                >
                  GEO SSS
                </Link>
                .
              </p>
              <dl className="mt-6 space-y-4">
                {HOME_AEO_FAQS.map((item) => (
                  <div
                    key={item.q}
                    className="rounded-xl border border-slate-700/80 bg-slate-800/40 px-4 py-3"
                  >
                    <dt className="font-medium text-emerald-200">{item.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-slate-300">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        <DeferredHomeSections initialTestimonials={initialTestimonials} />
        <StickySeoCtaBar contextLabel="Ana sayfa" sourcePrefix="home-sticky" />
      </SiteLayout>
    </>
  );
}
