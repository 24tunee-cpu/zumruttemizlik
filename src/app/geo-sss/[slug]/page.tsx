import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteLayout from '../../site/layout';
import { GEO_SSS_PAGES } from '@/config/geo-district-faqs';
import { getGeoSssBySlugAsync } from '@/lib/geo-sss-resolver';
import RelatedSeoLinks from '@/components/site/RelatedSeoLinks';
import { StickySeoCtaBar } from '@/components/site/StickySeoCtaBar';
import { WhyChooseZvt } from '@/components/site/WhyChooseZvt';
import { buildGeoSssSeoLinks } from '@/lib/internal-seo-links';
import { clampMetaDescription, clampMetaTitle } from '@/lib/meta-clamp';
import {
  canonicalUrl,
  generateBreadcrumbSchema,
  generateFAQSchema,
  serializeSchemaGraph,
} from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return GEO_SSS_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getGeoSssBySlugAsync(slug);
  if (!page) return { title: 'Sayfa Bulunamadı' };

  const title = clampMetaTitle(`${page.title} | Zümrüt Vadi`);
  const description = clampMetaDescription(page.directAnswer);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl(`/geo-sss/${page.slug}`) },
    robots: { index: true, follow: true },
  };
}

export default async function GeoSssPage({ params }: Props) {
  const { slug } = await params;
  const page = await getGeoSssBySlugAsync(slug);
  if (!page) notFound();

  const faqSchema = generateFAQSchema([
    { question: page.title, answer: page.directAnswer },
  ]);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'GEO SSS', url: '/geo-sss' },
    { name: page.title, url: `/geo-sss/${page.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeSchemaGraph([breadcrumbSchema, faqSchema]),
        }}
      />
      <SiteLayout>
        <article className="min-h-screen bg-slate-900 pb-16 pt-28 text-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-6 text-sm text-slate-400">
              <Link href="/geo-sss" className="hover:text-emerald-400">
                GEO SSS
              </Link>
              <span className="mx-2">/</span>
              <span className="text-slate-300">{page.districtName}</span>
            </nav>

            <h1 className="text-3xl font-bold sm:text-4xl">{page.title}</h1>

            <aside className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-sm font-medium text-emerald-200">TL;DR</p>
              <p className="mt-2 text-emerald-50">{page.directAnswer}</p>
            </aside>

            <div className="prose prose-invert mt-8 max-w-none">
              {page.details.map((p) => (
                <p key={p.slice(0, 40)} className="text-slate-300">
                  {p}
                </p>
              ))}
            </div>

            {(() => {
              const serviceFromLink = page.relatedLinks
                .map((l) => l.href.match(/^\/hizmetler\/([^/?#]+)/)?.[1])
                .find(Boolean);
              const serviceFromPair = page.relatedLinks
                .map((l) => l.href.match(/^\/bolgeler\/[^/]+\/([^/?#]+)/)?.[1])
                .find((s) => s && !['zekeriyakoy', 'maslak', 'tarabya', 'bahcekoy'].includes(s));
              const links = buildGeoSssSeoLinks({
                districtSlug: page.districtSlug,
                districtName: page.districtName,
                serviceSlug: serviceFromLink || serviceFromPair,
                existing: page.relatedLinks,
              });
              return (
                <RelatedSeoLinks
                  tone="dark"
                  heading="İlgili sayfalar"
                  intro="Kısa SSS cevabından sonra detaylı hizmet ve bölge sayfalarına geçin."
                  groups={[
                    { title: 'Bağlantılar', links },
                  ]}
                />
              );
            })()}

            <WhyChooseZvt
              tone="dark"
              contextLabel={page.title}
              sourcePrefix="geo-sss-why-zvt"
            />
          </div>
          <StickySeoCtaBar contextLabel={page.title} sourcePrefix="geo-sss-sticky" />
        </article>
      </SiteLayout>
    </>
  );
}
