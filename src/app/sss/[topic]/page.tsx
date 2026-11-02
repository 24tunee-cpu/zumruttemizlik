import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteLayout from '../../site/layout';
import RelatedSeoLinks from '@/components/site/RelatedSeoLinks';
import { StickySeoCtaBar } from '@/components/site/StickySeoCtaBar';
import { WhyChooseZvt } from '@/components/site/WhyChooseZvt';
import {
  SSS_TOPICS,
  buildSssTopicFaqs,
  getSssTopic,
} from '@/config/sss-topics';
import { canonicalUrl } from '@/lib/seo';
import { clampMetaDescription, clampMetaTitle } from '@/lib/meta-clamp';
import { HelpCircle } from 'lucide-react';

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return SSS_TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = getSssTopic(slug);
  if (!topic) return { title: 'SSS' };
  const title = clampMetaTitle(topic.metaTitle);
  const description = clampMetaDescription(topic.metaDescription);
  const canonical = canonicalUrl(`/sss/${topic.slug}`);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      locale: 'tr_TR',
      siteName: 'Zümrüt Vadi Temizlik',
    },
  };
}

export default async function SssTopicPage({ params }: Props) {
  const { topic: slug } = await params;
  const topic = getSssTopic(slug);
  if (!topic) notFound();

  const faqs = buildSssTopicFaqs(topic);
  if (faqs.length === 0) notFound();

  const canonical = canonicalUrl(`/sss/${topic.slug}`);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: canonicalUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'SSS', item: canonicalUrl('/sss') },
      { '@type': 'ListItem', position: 3, name: topic.title, item: canonical },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteLayout>
        <div className="flex min-h-full flex-1 flex-col bg-slate-900 pb-24">
          <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 pt-24 pb-10 sm:pt-28">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
              <HelpCircle className="mx-auto mb-4 h-12 w-12 text-emerald-400" aria-hidden />
              <p className="text-sm text-emerald-300/90">
                <Link href="/sss" className="underline-offset-2 hover:underline">
                  Tüm SSS
                </Link>
              </p>
              <h1 className="mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                {topic.title}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">{topic.intro}</p>
            </div>
          </section>

          <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3"
                >
                  <summary className="cursor-pointer list-none font-medium text-white marker:content-none [&::-webkit-details-marker]:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{f.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-10">
              <RelatedSeoLinks
                tone="dark"
                heading="İlgili sayfalar"
                intro="Konu SSS buradan; genel liste ve hizmet/bölge sayfalarına geçiş."
                groups={[
                  {
                    title: 'Diğer SSS konuları',
                    links: SSS_TOPICS.filter((t) => t.slug !== topic.slug)
                      .slice(0, 6)
                      .map((t) => ({ href: `/sss/${t.slug}`, label: t.title })),
                  },
                  {
                    title: 'Teklif',
                    links: [
                      { href: '/fiyat-hesaplama', label: 'Fiyat hesapla' },
                      { href: '/randevu', label: 'Ücretsiz keşif' },
                      { href: '/sss', label: 'Tüm SSS' },
                    ],
                  },
                ]}
              />
              <WhyChooseZvt
                tone="dark"
                contextLabel={`${topic.title} sonrası teklif`}
                sourcePrefix={`sss-${topic.slug}-why`}
              />
            </div>
          </div>
          <StickySeoCtaBar contextLabel={topic.title} sourcePrefix={`sss-${topic.slug}-sticky`} />
        </div>
      </SiteLayout>
    </>
  );
}
