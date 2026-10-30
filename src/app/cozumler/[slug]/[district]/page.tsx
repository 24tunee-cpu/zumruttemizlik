import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteLayout from '../../../site/layout';
import { IntentDistrictLandingView } from '@/components/site/IntentDistrictLandingView';
import { buildIntentDistrictPage, allIntentDistrictParams } from '@/config/intent-seo';
import { buildIntentLandingSchemaGraph } from '@/lib/intent-schema';
import { canonicalUrl } from '@/lib/seo';
import { clampMetaDescription, clampMetaTitle } from '@/lib/meta-clamp';

type Props = {
  params: Promise<{ slug: string; district: string }>;
};

export const revalidate = 86400;

export function generateStaticParams() {
  return allIntentDistrictParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, district } = await params;
  const page = buildIntentDistrictPage(slug, district);
  if (!page) return { title: 'Sayfa Bulunamadı' };

  const canonical = canonicalUrl(`/cozumler/${slug}/${district}`);
  const title = clampMetaTitle(page.metaTitle);
  const description = clampMetaDescription(page.metaDescription);

  return {
    title: { absolute: title },
    description,
    keywords: page.keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      locale: 'tr_TR',
      siteName: 'Zümrüt Vadi Temizlik',
      images: [{ url: canonicalUrl('/logo.png'), width: 1200, height: 630, alt: page.heroTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [canonicalUrl('/logo.png')],
    },
  };
}

export default async function IntentDistrictLandingPage({ params }: Props) {
  const { slug, district } = await params;
  const page = buildIntentDistrictPage(slug, district);
  if (!page) notFound();

  const path = `/cozumler/${slug}/${district}`;

  const jsonLd = await buildIntentLandingSchemaGraph({
    path,
    intent: page.intent,
    pageTitle: page.metaTitle,
    pageDescription: page.metaDescription,
    breadcrumbs: [
      { name: 'Ana Sayfa', url: '/' },
      { name: 'Çözümler', url: '/cozumler' },
      { name: page.intent.name, url: `/cozumler/${page.intent.slug}` },
      { name: page.district.name, url: path },
    ],
    faq: page.faq.map((f) => ({ question: f.q, answer: f.a })),
    areaServed: {
      '@type': 'AdministrativeArea',
      name: `${page.district.name}, İstanbul`,
    },
    howToTotalTime: page.intent.slug === 'ofis-temizligi' ? 'P1W' : 'P2D',
  });

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <IntentDistrictLandingView page={page} />
    </SiteLayout>
  );
}
