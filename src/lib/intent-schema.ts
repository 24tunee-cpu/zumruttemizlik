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

/**
 * Intent landing JSON-LD.
 * Service üzerine AggregateRating basılmaz — GSC “yorum snippet geçersiz”
 * (Service tipi review rich result desteklemez; self-serving yıldız yok).
 */
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
