import Link from 'next/link';
import SiteLayout from '@/app/site/layout';
import {
  type NeighborhoodLanding as NeighborhoodLandingData,
  getServiceBySlug,
} from '@/config/programmatic-seo';
import { SITE_CONTACT, toTelHref } from '@/config/site-contact';
import { canonicalUrl, getSiteUrl } from '@/lib/seo';

export default function NeighborhoodLanding({ data }: { data: NeighborhoodLandingData }) {
  const canonical = canonicalUrl(`/bolgeler/${data.districtSlug}/${data.slug}`);
  const siteRoot = getSiteUrl();
  const callHref = toTelHref(SITE_CONTACT.phoneE164);

  const featuredServices = data.featuredServiceSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is NonNullable<typeof s> => !!s);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${data.name} Temizlik`,
    serviceType: 'Temizlik Hizmeti',
    areaServed: [data.name, data.districtName, 'İstanbul'],
    provider: {
      '@type': 'LocalBusiness',
      name: 'Zümrüt Vadi Temizlik',
      url: siteRoot,
      telephone: SITE_CONTACT.phoneE164,
    },
    url: canonical,
    description: data.metaDescription,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((item) => ({
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
        name: data.districtName,
        item: canonicalUrl(`/bolgeler/${data.districtSlug}`),
      },
      { '@type': 'ListItem', position: 4, name: data.name, item: canonical },
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
              <h1 className="text-3xl font-bold sm:text-4xl">{data.name} Temizlik</h1>
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                {data.districtName} · Avrupa Yakası
              </span>
            </div>
            <p className="mt-4 text-slate-300">{data.intro}</p>

            <section className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
              <h2 className="text-lg font-semibold text-emerald-200">Öne çıkan hizmetler</h2>
              <ul className="mt-3 grid gap-2 text-sm text-emerald-100/90 sm:grid-cols-2">
                {data.highlights.map((h) => (
                  <li key={h}>✅ {h}</li>
                ))}
              </ul>
            </section>

            <div className="mt-8 space-y-4 text-slate-300">
              {data.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/fiyat-hesaplama"
                className="rounded-lg bg-emerald-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-emerald-600"
              >
                Anında Fiyat Hesapla
              </Link>
              <a
                href={callHref}
                className="rounded-lg border border-emerald-500/40 px-5 py-2.5 font-medium text-emerald-200 transition-colors hover:bg-emerald-500/10"
              >
                Hemen Ara: {SITE_CONTACT.phoneDisplay}
              </a>
            </div>

            {featuredServices.length > 0 && (
              <section className="mt-10 rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
                <h2 className="text-xl font-semibold">{data.name}’de sunduğumuz hizmetler</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {featuredServices.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/bolgeler/${data.districtSlug}/${s.slug}`}
                      className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 transition-colors hover:border-emerald-500/40 hover:bg-slate-800"
                    >
                      <p className="font-medium text-white">
                        {data.districtName} {s.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-400">{s.shortPitch}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-8 rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
              <h2 className="text-xl font-semibold">Sık Sorulan Sorular</h2>
              <div className="mt-4 space-y-4">
                {data.faq.map((faq) => (
                  <div key={faq.q}>
                    <h3 className="font-medium text-white">{faq.q}</h3>
                    <p className="mt-1 text-sm text-slate-300">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/randevu"
                className="rounded-lg bg-emerald-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-emerald-600"
              >
                Ücretsiz Keşif / Randevu
              </Link>
              <Link
                href={`/bolgeler/${data.districtSlug}`}
                className="rounded-lg border border-slate-600 px-5 py-2.5 font-medium text-slate-200 transition-colors hover:bg-slate-800"
              >
                {data.districtName} Bölge Sayfası
              </Link>
              <Link
                href="/harita-ve-yorumlar"
                className="rounded-lg border border-emerald-500/30 px-5 py-2.5 font-medium text-emerald-200 transition-colors hover:border-emerald-500/60 hover:bg-emerald-500/10"
              >
                Harita & Yorumlar
              </Link>
            </div>
          </div>
        </div>
      </SiteLayout>
    </>
  );
}
