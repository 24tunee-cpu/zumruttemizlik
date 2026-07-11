import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteLayout from '../../../site/layout';
import {
  getBlogSiloBySlug,
  allBlogSiloSlugs,
  type BlogSiloCluster,
} from '@/config/blog-silo-clusters';
import { buildCalculatorHref } from '@/lib/intent-analytics';
import {
  canonicalUrl,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  serializeSchemaGraph,
} from '@/lib/seo';
import { ArrowRight, BookOpen, MapPin, Sparkles, Calculator, CalendarDays } from 'lucide-react';

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 86400;

export function generateStaticParams() {
  return allBlogSiloSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const silo = getBlogSiloBySlug(slug);
  if (!silo) return { title: 'Sayfa Bulunamadı' };

  const title = `${silo.name} Rehberleri | İstanbul Temizlik Blogu`;
  const canonical = canonicalUrl(`/blog/silo/${silo.slug}`);

  return {
    title: { absolute: title },
    description: silo.description,
    alternates: { canonical },
    openGraph: {
      title,
      description: silo.description,
      url: canonical,
      type: 'website',
      locale: 'tr_TR',
      siteName: 'Zümrüt Vadi Temizlik',
    },
  };
}

function SiloContent({ silo }: { silo: BlogSiloCluster }) {
  const path = `/blog/silo/${silo.slug}`;

  const jsonLd = serializeSchemaGraph([
    generateWebPageSchema({
      path,
      title: `${silo.name} Rehberleri`,
      description: silo.description,
    }),
    generateBreadcrumbSchema([
      { name: 'Ana Sayfa', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: silo.name, url: path },
    ]) as Record<string, unknown>,
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${silo.name} blog cluster`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: silo.pillarLabel,
          url: canonicalUrl(silo.pillarHref),
        },
        ...silo.blogLinks.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 2,
          name: b.label,
          url: canonicalUrl(`/blog/${b.slug}`),
        })),
      ],
    },
  ]);

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <div className="min-h-screen bg-slate-950">
        <section className="relative overflow-hidden pt-24 pb-14 sm:pt-28 md:pb-16">
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-emerald-400">
                    Ana Sayfa
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/blog" className="hover:text-emerald-400">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-emerald-400">{silo.name}</li>
              </ol>
            </nav>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-400">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Konu Silosu
            </span>
            <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">{silo.name}</h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-400">{silo.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={silo.pillarHref}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {silo.pillarLabel}
              </Link>
              <Link
                href={buildCalculatorHref({ intent: silo.intentSlug })}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/50"
              >
                <Calculator className="h-4 w-4" aria-hidden="true" />
                Fiyat Hesapla
              </Link>
              <Link
                href="/randevu"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/50"
              >
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Randevu
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-800 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">Cluster blog yazıları</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {silo.blogLinks.map((blog) => (
                <Link
                  key={blog.slug}
                  href={`/blog/${blog.slug}`}
                  className="group rounded-xl border border-slate-700/60 bg-slate-800/40 p-5 transition hover:border-emerald-500/40"
                >
                  <p className="font-semibold text-white group-hover:text-emerald-300">{blog.label}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-emerald-400">
                    Oku
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {silo.neighborhoodLinks.length > 0 && (
          <section className="border-t border-slate-800 bg-slate-900/40 py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-white">İlgili semt sayfaları</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {silo.neighborhoodLinks.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-200 transition hover:border-emerald-500/40 hover:text-emerald-300"
                  >
                    <MapPin className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    {n.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-slate-800 py-14">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              ← Tüm blog yazıları
            </Link>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

export default async function BlogSiloPage({ params }: Props) {
  const { slug } = await params;
  const silo = getBlogSiloBySlug(slug);
  if (!silo) notFound();
  return <SiloContent silo={silo} />;
}
