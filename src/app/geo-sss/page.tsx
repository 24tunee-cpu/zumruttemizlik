import Link from 'next/link';
import SiteLayout from '../site/layout';
import type { Metadata } from 'next';
import { canonicalUrl, generateBreadcrumbSchema } from '@/lib/seo';
import { listAllGeoSssPagesForIndex } from '@/lib/geo-sss-resolver';
import SiteHubLinkStrip from '@/components/site/SiteHubLinkStrip';
import { StickySeoCtaBar } from '@/components/site/StickySeoCtaBar';
import { WhyChooseZvt } from '@/components/site/WhyChooseZvt';
import RelatedSeoLinks from '@/components/site/RelatedSeoLinks';
import { clampMetaDescription, clampMetaTitle } from '@/lib/meta-clamp';

export const revalidate = 86400;

const geoSssTitle = clampMetaTitle('İlçe SSS | Temizlik Soru-Cevap');
const geoSssDescription = clampMetaDescription(
  'İlçe bazlı kısa temizlik soru-cevapları — Sarıyer / Zekeriyaköy odaklı. Ücretsiz keşif için randevu.'
);

export const metadata: Metadata = {
  title: { absolute: geoSssTitle },
  description: geoSssDescription,
  alternates: { canonical: canonicalUrl('/geo-sss') },
};

export default async function GeoSssIndexPage() {
  const pages = await listAllGeoSssPagesForIndex();
  const byDistrict = new Map<string, typeof pages>();

  for (const p of pages) {
    const list = byDistrict.get(p.districtName) ?? [];
    list.push(p);
    byDistrict.set(p.districtName, list);
  }

  const breadcrumbLd = generateBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'İlçe SSS', url: '/geo-sss' },
  ]);

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="min-h-screen bg-slate-900 pb-16 pt-28 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">İlçe temizlik soru-cevap</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            İlçe ve semte göre kısa cevaplar — fiyat, süre ve güvenilir ekip hakkında net bilgi.
            Detaylı teklif için ücretsiz keşif alın.
          </p>
          <SiteHubLinkStrip tone="dark" className="mt-6" />
          <div className="mt-10 space-y-8">
            {[...byDistrict.entries()].map(([district, districtPages]) => {
              const districtSlug = districtPages[0]?.districtSlug;
              return (
              <section key={district}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-xl font-semibold text-emerald-300">{district}</h2>
                  {districtSlug ? (
                    <Link
                      href={`/bolgeler/${districtSlug}`}
                      className="text-sm text-slate-400 underline-offset-2 hover:text-emerald-300 hover:underline"
                    >
                      {district} temizlik →
                    </Link>
                  ) : null}
                </div>
                <ul className="mt-3 space-y-2">
                  {districtPages.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/geo-sss/${p.slug}`}
                        className="text-slate-200 hover:text-emerald-400"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
            })}
          </div>
          <RelatedSeoLinks
            tone="dark"
            heading="İlgili sayfalar"
            groups={[
              {
                title: 'Bölgeler',
                links: [
                  { href: '/bolgeler/sariyer', label: 'Sarıyer temizlik' },
                  { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy' },
                  { href: '/sss', label: 'Genel SSS' },
                ],
              },
            ]}
          />
          <WhyChooseZvt
            tone="dark"
            contextLabel="İlçe SSS sonrası temizlik"
            sourcePrefix="geo-sss-hub-why-zvt"
          />
        </div>
      </div>
      <StickySeoCtaBar contextLabel="İlçe SSS" sourcePrefix="geo-sss-hub-sticky" />
    </SiteLayout>
  );
}
