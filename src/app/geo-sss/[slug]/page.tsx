import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteLayout from '../../site/layout';
import {
  GEO_SSS_PAGES,
  getGeoSssBySlug,
} from '@/config/geo-district-faqs';
import {
  canonicalUrl,
  generateBreadcrumbSchema,
  generateFAQSchema,
  serializeSchemaGraph,
} from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GEO_SSS_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getGeoSssBySlug(slug);
  if (!page) return { title: 'Sayfa Bulunamadı' };

  const title = `${page.title} | Zümrüt Vadi Temizlik`;
  const description = page.directAnswer.slice(0, 158);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl(`/geo-sss/${page.slug}`) },
    robots: { index: true, follow: true },
  };
}

export default async function GeoSssPage({ params }: Props) {
  const { slug } = await params;
  const page = getGeoSssBySlug(slug);
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

            <section className="mt-10">
              <h2 className="text-lg font-semibold">İlgili sayfalar</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {page.relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:border-emerald-500/50"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </article>
      </SiteLayout>
    </>
  );
}
