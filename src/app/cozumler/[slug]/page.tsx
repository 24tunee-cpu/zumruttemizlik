import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteLayout from '../../site/layout';
import { IntentLandingView } from '@/components/site/IntentLandingView';
import {
  getIntentBySlug,
  allIntentSlugs,
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
  params: Promise<{ slug: string }>;
};

export const revalidate = 86400;

export function generateStaticParams() {
  return allIntentSlugs().map((slug) => ({ slug }));
}

function clampMetaDescription(input: string, max = 160): string {
  const value = input.trim();
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const intent = getIntentBySlug(slug);
  if (!intent) return { title: 'Sayfa Bulunamadı' };

  const canonical = canonicalUrl(`/cozumler/${intent.slug}`);

  return {
    title: { absolute: intent.metaTitle },
    description: clampMetaDescription(intent.metaDescription),
    keywords: intent.keywords,
    alternates: { canonical },
    openGraph: {
      title: intent.metaTitle,
      description: intent.metaDescription,
      url: canonical,
      type: 'website',
      locale: 'tr_TR',
      siteName: 'Zümrüt Vadi Temizlik',
      images: [{ url: canonicalUrl('/logo.png'), width: 1200, height: 630, alt: intent.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: intent.metaTitle,
      description: intent.metaDescription,
      images: [canonicalUrl('/logo.png')],
    },
  };
}

export default async function IntentLandingPage({ params }: Props) {
  const { slug } = await params;
  const intent = getIntentBySlug(slug);
  if (!intent) notFound();

  const path = `/cozumler/${intent.slug}`;

  const serviceSchema = generateServiceSchema({
    title: intent.name,
    description: intent.metaDescription,
    slug: intent.serviceSlug,
    priceRange: intent.priceHint,
  });
  serviceSchema.url = canonicalUrl(path);

  const jsonLd = serializeSchemaGraph([
    generateWebPageSchema({
      path,
      title: intent.metaTitle,
      description: intent.metaDescription,
    }),
    generateBreadcrumbSchema([
      { name: 'Ana Sayfa', url: '/' },
      { name: 'Çözümler', url: '/cozumler' },
      { name: intent.name, url: path },
    ]) as Record<string, unknown>,
    generateFAQSchema(
      intent.faq.map((f) => ({ question: f.q, answer: f.a }))
    ) as Record<string, unknown>,
    serviceSchema as Record<string, unknown>,
  ]);

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <IntentLandingView intent={intent} />
    </SiteLayout>
  );
}
