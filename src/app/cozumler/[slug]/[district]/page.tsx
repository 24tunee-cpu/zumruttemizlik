import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteLayout from '../../../site/layout';
import { IntentDistrictLandingView } from '@/components/site/IntentDistrictLandingView';
import {
  buildIntentDistrictPage,
  allIntentDistrictParams,
} from '@/config/intent-seo';
import {
  canonicalUrl,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateServiceSchema,
  generateWebPageSchema,
  serializeSchemaGraph,
} from '@/lib/seo';

type Props = {
  params: Promise<{ slug: string; district: string }>;
};

export const revalidate = 86400;

export function generateStaticParams() {
  return allIntentDistrictParams();
}

function clampMetaDescription(input: string, max = 160): string {
  const value = input.trim();
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, district } = await params;
  const page = buildIntentDistrictPage(slug, district);
  if (!page) return { title: 'Sayfa Bulunamadı' };

  const canonical = canonicalUrl(`/cozumler/${slug}/${district}`);

  return {
    title: { absolute: page.metaTitle },
    description: clampMetaDescription(page.metaDescription),
    keywords: page.keywords,
    alternates: { canonical },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: canonical,
      type: 'website',
      locale: 'tr_TR',
      siteName: 'Zümrüt Vadi Temizlik',
      images: [{ url: canonicalUrl('/logo.png'), width: 1200, height: 630, alt: page.heroTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
      images: [canonicalUrl('/logo.png')],
    },
  };
}

export default async function IntentDistrictLandingPage({ params }: Props) {
  const { slug, district } = await params;
  const page = buildIntentDistrictPage(slug, district);
  if (!page) notFound();

  const path = `/cozumler/${slug}/${district}`;

  const serviceSchema = generateServiceSchema({
    title: `${page.district.name} ${page.intent.name}`,
    description: page.metaDescription,
    slug: page.intent.serviceSlug,
    priceRange: page.intent.priceHint,
  });
  serviceSchema.url = canonicalUrl(path);
  serviceSchema.areaServed = {
    '@type': 'AdministrativeArea',
    name: `${page.district.name}, İstanbul`,
  };

  const jsonLd = serializeSchemaGraph([
    generateWebPageSchema({
      path,
      title: page.metaTitle,
      description: page.metaDescription,
    }),
    generateBreadcrumbSchema([
      { name: 'Ana Sayfa', url: '/' },
      { name: 'Çözümler', url: '/cozumler' },
      { name: page.intent.name, url: `/cozumler/${page.intent.slug}` },
      { name: page.district.name, url: path },
    ]) as Record<string, unknown>,
    generateFAQSchema(
      page.faq.map((f) => ({ question: f.q, answer: f.a }))
    ) as Record<string, unknown>,
    serviceSchema as Record<string, unknown>,
  ]);

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <IntentDistrictLandingView page={page} />
    </SiteLayout>
  );
}
