import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteLayout from '../../../site/layout';
import { prisma } from '@/lib/prisma';
import {
  DISTRICT_LANDINGS,
  SERVICE_LANDINGS,
  NEIGHBORHOOD_LANDINGS,
  buildProgrammaticContentVariant,
  formatDistrictSide,
  getDistrictDeepDive,
  getDistrictBySlug,
  getNearbyDistrictSlugs,
  getDistrictOperationalSignals,
  getServiceBySlug,
  getNeighborhoodLanding,
  buildLocalizedPairFaqs,
  districtCoverageDisclaimer,
} from '@/config/programmatic-seo';
import ProgrammaticCtaExperiment from '@/components/site/ProgrammaticCtaExperiment';
import NeighborhoodLanding from '@/components/site/NeighborhoodLanding';
import RelatedSeoLinks from '@/components/site/RelatedSeoLinks';
import { StickySeoCtaBar } from '@/components/site/StickySeoCtaBar';
import { WhyChooseZvt } from '@/components/site/WhyChooseZvt';
import {
  GeoExtractAnswer,
  buildPairExtractAnswer,
} from '@/components/site/GeoExtractAnswer';
import { SITE_CONTACT, toTelHref } from '@/config/site-contact';
import { canonicalUrl, getSiteUrl } from '@/lib/seo';
import { buildProgrammaticPairSeoLinks } from '@/lib/internal-seo-links';
import { clampMetaDescription, clampMetaTitle } from '@/lib/meta-clamp';
import {
  buildSmartMetaForPair,
  isLowQualityProgrammaticTitle,
} from '@/lib/programmatic-smart-meta';
import { PAIR_CTR_H1, PAIR_CTR_META, pairCtrKey } from '@/lib/gsc-ctr-overrides';

type Props = {
  params: Promise<{ district: string; service: string }>;
};

/** ISR: 24 saat — bkz. src/lib/isr-config.ts ISR_PROGRAMMATIC_SEC */
export const revalidate = 86400;

export function generateStaticParams() {
  const serviceCombos = DISTRICT_LANDINGS.flatMap((district) =>
    SERVICE_LANDINGS.map((service) => ({
      district: district.slug,
      service: service.slug,
    }))
  );
  const neighborhoodCombos = NEIGHBORHOOD_LANDINGS.map((n) => ({
    district: n.districtSlug,
    service: n.slug,
  }));
  return [...serviceCombos, ...neighborhoodCombos];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { district, service } = await params;
  const districtData = getDistrictBySlug(district);
  const serviceData = getServiceBySlug(service);

  // Semt (neighborhood) sayfası: servis bulunamadıysa özel semt landing'i kontrol et.
  if (!serviceData) {
    const neighborhood = getNeighborhoodLanding(district, service);
    if (neighborhood) {
      const canonical = canonicalUrl(`/bolgeler/${neighborhood.districtSlug}/${neighborhood.slug}`);
      const title = clampMetaTitle(neighborhood.metaTitle);
      const description = clampMetaDescription(neighborhood.metaDescription);
      return {
        title: { absolute: title },
        description,
        keywords: [
          `${neighborhood.name} temizlik`,
          `${neighborhood.name} temizlik şirketi`,
          `${neighborhood.name} ev temizliği`,
          `${neighborhood.districtName} temizlik`,
        ],
        alternates: { canonical },
        robots: {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true },
        },
        openGraph: {
          title,
          description,
          url: canonical,
          type: 'website',
          locale: 'tr_TR',
          siteName: 'Zümrüt Vadi Temizlik',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
        },
      };
    }
  }

  if (!districtData || !serviceData) {
    return { title: 'Sayfa Bulunamadı' };
  }

  const key = `${districtData.slug}/${serviceData.slug}`;
  const override = await prisma.programmaticMetaOverride.findUnique({
    where: { key },
    select: { title: true, description: true, isActive: true },
  });
  const smart = buildSmartMetaForPair(districtData, serviceData);
  // GSC CTR map (`PAIR_CTR_META`) smart içinde — DB override CTR’yi ezmesin
  const hasCtrTitle = Boolean(PAIR_CTR_META[key]);
  const overrideTitle = override?.isActive ? override.title?.trim() : '';
  const overrideDesc = override?.isActive ? override.description?.trim() : '';
  const rawTitle =
    hasCtrTitle
      ? smart.title
      : overrideTitle && !isLowQualityProgrammaticTitle(overrideTitle)
        ? overrideTitle
        : smart.title;
  const title = clampMetaTitle(rawTitle);
  const rawDescription =
    hasCtrTitle && smart.description
      ? smart.description
      : overrideDesc || smart.description;
  const description = clampMetaDescription(rawDescription);
  const canonical = canonicalUrl(`/bolgeler/${districtData.slug}/${serviceData.slug}`);

  return {
    title: { absolute: title },
    description,
    keywords: [districtData.name, serviceData.name, ...serviceData.intentKeywords],
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      locale: 'tr_TR',
      siteName: 'Zümrüt Vadi Temizlik',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ProgrammaticLandingPage({ params }: Props) {
  const { district, service } = await params;
  const districtData = getDistrictBySlug(district);
  const serviceData = getServiceBySlug(service);

  // Semt (neighborhood) sayfası dalı — ör. /bolgeler/sariyer/zekeriyakoy
  if (!serviceData) {
    const neighborhood = getNeighborhoodLanding(district, service);
    if (neighborhood) {
      return <NeighborhoodLanding data={neighborhood} />;
    }
  }

  if (!districtData || !serviceData) notFound();

  const canonical = canonicalUrl(`/bolgeler/${districtData.slug}/${serviceData.slug}`);
  const siteRoot = getSiteUrl();
  const contentVariant = buildProgrammaticContentVariant(districtData, serviceData);
  const operationalSignals = getDistrictOperationalSignals(districtData);
  const districtDeepDive = getDistrictDeepDive(districtData);
  const nearbyDistricts = getNearbyDistrictSlugs(districtData.slug, 3)
    .map((slug) => getDistrictBySlug(slug))
    .filter((d): d is NonNullable<typeof d> => !!d);
  const relatedBlogs = await prisma.blogPost.findMany({
    where: {
      published: true,
      OR: [
        { tags: { hasSome: serviceData.blogTagHints } },
        { title: { contains: districtData.name, mode: 'insensitive' } },
        { excerpt: { contains: districtData.name, mode: 'insensitive' } },
      ],
    },
    orderBy: [{ updatedAt: 'desc' }, { views: 'desc' }],
    take: 4,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      category: true,
    },
  });
  const callHref = toTelHref(SITE_CONTACT.phoneE164);
  const pairFaqs = buildLocalizedPairFaqs(districtData, serviceData);
  const coverageNote = districtCoverageDisclaimer(districtData);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    additionalType: 'https://schema.org/CleaningService',
    name: `${districtData.name} ${serviceData.name}`,
    serviceType: serviceData.name,
    areaServed: districtData.name,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Zümrüt Vadi Temizlik',
      url: siteRoot,
      telephone: SITE_CONTACT.phoneE164,
    },
    url: canonical,
    description: `${districtData.name} bölgesinde ${contentVariant.heroLead}`,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairFaqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: canonicalUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Bölgeler', item: canonicalUrl('/bolgeler') },
      {
        '@type': 'ListItem',
        position: 3,
        name: districtData.name,
        item: canonicalUrl(`/bolgeler/${districtData.slug}`),
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: serviceData.name,
        item: canonical,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteLayout>
        <div className="min-h-screen bg-slate-900 pb-16 pt-28 text-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold sm:text-4xl">
                {PAIR_CTR_H1[pairCtrKey(districtData.slug, serviceData.slug)] ??
                  `${districtData.name} ${serviceData.name}`}
              </h1>
              {formatDistrictSide(districtData) && (
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  {formatDistrictSide(districtData)}
                </span>
              )}
            </div>
            {districtData.regionBlurb && (
              <p className="mt-2 text-sm text-slate-400">{districtData.regionBlurb}</p>
            )}
            <p className="mt-4 text-slate-300">{contentVariant.heroLead}</p>
            <p className="mt-3 text-sm text-slate-400">{coverageNote}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={callHref}
                data-source={`pair-${districtData.slug}-${serviceData.slug}-phone`}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
              >
                Ara: {SITE_CONTACT.phoneDisplay}
              </a>
              <Link
                href="/randevu"
                data-source={`pair-${districtData.slug}-${serviceData.slug}-randevu`}
                className="rounded-lg border border-emerald-400/50 px-4 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/20"
              >
                Ücretsiz keşif
              </Link>
              <Link
                href={`/fiyat-hesaplama?district=${districtData.slug}&intent=${serviceData.slug}`}
                data-source={`pair-${districtData.slug}-${serviceData.slug}-fiyat`}
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:border-emerald-500/40"
              >
                Fiyat hesapla
              </Link>
            </div>
            <div className="mt-5">
              <GeoExtractAnswer
                label="Kısa cevap"
                answer={buildPairExtractAnswer({
                  districtName: districtData.name,
                  serviceName: serviceData.name,
                  heroLead: contentVariant.heroLead,
                })}
              />
            </div>

            <section className="mt-6 rounded-2xl border border-slate-700 bg-slate-800/30 p-5">
              <h2 className="text-lg font-semibold text-white">Mahalle ve semt kapsamı</h2>
              <p className="mt-2 text-sm text-slate-400">
                {districtData.name} içinde özellikle şu bölgelerde ekip yönlendirmesi planlanır; liste
                keşifte netleşir — her adres veya aynı gün garanti edilmez.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {districtData.neighborhoods.map((n) => (
                  <span
                    key={n}
                    className="rounded-full border border-slate-600 bg-slate-800/60 px-3 py-1 text-xs text-slate-200"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </section>

            <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
              <h2 className="text-xl font-semibold">Neden bu bölgede bizi tercih ediyorlar?</h2>
              <ul className="mt-4 space-y-2 text-slate-300">
                {contentVariant.trustPoints.map((point) => (
                  <li key={point}>- {point}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-400">{contentVariant.localAngle}</p>
            </div>

            <section className="mt-8 rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
              <h2 className="text-xl font-semibold">Hizmet Süreci</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-300">
                {contentVariant.processSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>

            <section className="mt-8 rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
              <h2 className="text-xl font-semibold">Bölgesel operasyon sinyalleri</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
                {operationalSignals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </section>

            {districtDeepDive.length > 0 && (
              <section className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                <h2 className="text-xl font-semibold text-emerald-200">
                  {districtData.name} için yerel operasyon notu
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-6 text-emerald-100/90">
                  {districtDeepDive.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-8 rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
              <h2 className="text-xl font-semibold">Sık Sorulan Sorular</h2>
              <div className="mt-4 space-y-4">
                {pairFaqs.map((faq) => (
                  <div key={faq.q}>
                    <h3 className="font-medium text-white">{faq.q}</h3>
                    <p className="mt-1 text-sm text-slate-300">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <WhyChooseZvt
              tone="dark"
              contextLabel={`${districtData.name} ${serviceData.name}`}
              sourcePrefix="pair-why-zvt"
            />

            <ProgrammaticCtaExperiment
              districtName={districtData.name}
              districtSlug={districtData.slug}
              serviceName={serviceData.name}
              serviceSlug={serviceData.slug}
            />

            {(() => {
              const seo = buildProgrammaticPairSeoLinks(districtData.slug, serviceData.slug);
              return (
                <RelatedSeoLinks
                  tone="dark"
                  heading="Bu sayfadan devam edin"
                  intro="Aynı ilçedeki diğer hizmetler, semt sayfaları ve ticari hub’lar."
                  groups={[
                    { title: 'Diğer hizmetler', links: seo.otherServices },
                    { title: 'Semt sayfaları', links: seo.neighborhoods },
                    { title: 'Hub’lar', links: seo.hubs },
                    { title: 'Teklif / randevu', links: seo.cta },
                  ]}
                />
              );
            })()}

            <section className="mt-8 rounded-2xl border border-slate-700 bg-slate-800/30 p-6">
              <h2 className="text-xl font-semibold">Yakın Bölge Sayfaları</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {nearbyDistricts.map((nearby) => (
                  <Link
                    key={nearby.slug}
                    href={`/bolgeler/${nearby.slug}/${serviceData.slug}`}
                    className="rounded-full border border-slate-600 px-3 py-1.5 text-sm text-slate-200 transition-colors hover:border-emerald-500/60 hover:text-emerald-300"
                  >
                    {nearby.name} {serviceData.name}
                  </Link>
                ))}
              </div>
            </section>

            {relatedBlogs.length > 0 && (
              <section className="mt-8 rounded-2xl border border-slate-700 bg-slate-800/30 p-6">
                <h2 className="text-xl font-semibold">İlgili Blog Rehberleri</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Bu hizmete karar verirken işinize yarayacak içerikler:
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {relatedBlogs.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 transition-colors hover:border-emerald-500/40 hover:bg-slate-800"
                    >
                      <p className="text-xs text-emerald-300">{post.category}</p>
                      <p className="mt-1 font-medium text-white">{post.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-400">{post.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={callHref}
                data-source="programmatic-landing-call"
                className="rounded-lg bg-emerald-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-emerald-600"
              >
                Hemen Ara: {SITE_CONTACT.phoneDisplay}
              </a>
              <Link
                href="/iletisim"
                className="rounded-lg bg-emerald-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-emerald-600"
              >
                Hemen Teklif Al
              </Link>
              <Link
                href={`/hizmetler/${serviceData.slug}`}
                className="rounded-lg border border-slate-600 px-5 py-2.5 font-medium text-slate-200 transition-colors hover:bg-slate-800"
              >
                Hizmet Detayını Gör
              </Link>
              <Link
                href="/harita-ve-yorumlar"
                className="rounded-lg border border-emerald-500/30 px-5 py-2.5 font-medium text-emerald-200 transition-colors hover:bg-emerald-500/10 hover:border-emerald-500/60"
              >
                Harita & Yorumlar
              </Link>
              <Link
                href={`/bolgeler/${districtData.slug}`}
                className="rounded-lg border border-slate-600 px-5 py-2.5 font-medium text-slate-200 transition-colors hover:bg-slate-800"
              >
                {districtData.name} Bölge Sayfası
              </Link>
            </div>
          </div>
          <StickySeoCtaBar
            contextLabel={`${districtData.name} ${serviceData.name}`}
            sourcePrefix="pair-sticky"
          />
        </div>
      </SiteLayout>
    </>
  );
}
