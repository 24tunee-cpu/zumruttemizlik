import { cache } from 'react';
import type { IntentLanding } from '@/config/intent-seo';
import {
  canonicalUrl,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateOfferSchema,
  generateServiceSchema,
  generateWebPageSchema,
  serializeSchemaGraph,
} from '@/lib/seo';
import {
  computeTestimonialAggregate,
  fetchPublicTestimonialsForSeo,
} from '@/lib/testimonials-seo';

const getTestimonials = cache(fetchPublicTestimonialsForSeo);

const MIN_SERVICE_REVIEWS = 3;

function matchesIntentService(service: string | null, intent: IntentLanding): boolean {
  if (!service?.trim()) return false;
  const normalized = service.toLowerCase();
  const slugPhrase = intent.serviceSlug.replace(/-/g, ' ');
  return normalized.includes(slugPhrase) || normalized.includes(intent.name.toLowerCase());
}

async function buildServiceAggregateRating(intent: IntentLanding) {
  const rows = await getTestimonials();
  const matched = rows.filter((r) => matchesIntentService(r.service, intent));
  const pool = matched.length >= MIN_SERVICE_REVIEWS ? matched : rows;
  if (pool.length < MIN_SERVICE_REVIEWS) return undefined;

  const agg = computeTestimonialAggregate(pool);
  if (!agg) return undefined;

  return {
    '@type': 'AggregateRating',
    ratingValue: agg.ratingValue,
    reviewCount: agg.reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

type IntentSchemaParams = {
  path: string;
  intent: IntentLanding;
  pageTitle: string;
  pageDescription: string;
  breadcrumbs: { name: string; url: string }[];
  faq: { question: string; answer: string }[];
  areaServed?: string | Record<string, unknown>;
  howToTotalTime?: string;
};

export async function buildIntentLandingSchemaGraph(
  params: IntentSchemaParams
): Promise<string> {
  const pageUrl = canonicalUrl(params.path);

  const serviceSchema = generateServiceSchema({
    title: params.intent.name,
    description: params.pageDescription,
    slug: params.intent.serviceSlug,
    priceRange: params.intent.priceHint,
    url: pageUrl,
    areaServed: params.areaServed,
  });

  const offerSchema = generateOfferSchema({
    name: params.intent.name,
    description: params.pageDescription,
    url: pageUrl,
    priceHint: params.intent.priceHint,
  });
  serviceSchema.offers = offerSchema;

  const aggregateRating = await buildServiceAggregateRating(params.intent);
  if (aggregateRating) {
    serviceSchema.aggregateRating = aggregateRating;
  }

  const howToSchema = generateHowToSchema({
    name: `${params.intent.name} — nasıl çalışır?`,
    description: params.intent.heroDescription,
    url: pageUrl,
    steps: params.intent.processSteps.map((step) => ({
      name: step.title,
      text: step.description,
    })),
    totalTime: params.howToTotalTime,
  });

  const nodes: Record<string, unknown>[] = [
    generateWebPageSchema({
      path: params.path,
      title: params.pageTitle,
      description: params.pageDescription,
    }),
    generateBreadcrumbSchema(params.breadcrumbs) as Record<string, unknown>,
    generateFAQSchema(params.faq) as Record<string, unknown>,
    serviceSchema as Record<string, unknown>,
  ];

  if (Object.keys(howToSchema).length > 0) {
    nodes.push(howToSchema);
  }

  return serializeSchemaGraph(nodes.filter((n) => n && Object.keys(n).length > 0));
}
