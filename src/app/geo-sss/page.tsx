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

const geoSssTitle = clampMetaTitle('GEO SSS | İlçe Temizlik Soruları');
const geoSssDescription = clampMetaDescription(
  'İlçe bazlı kısa SSS — Sarıyer / Zekeriyaköy odaklı passage cevaplar. Ücretsiz keşif için randevu.'
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
    { name: 'GEO SSS', url: '/geo-sss' },
  ]);

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="min-h-screen bg-slate-900 pb-16 pt-28 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">GEO SSS Rehberleri</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            İlçe bazlı kısa soru-cevap sayfaları — doğrudan alıntılanabilir passage format.
            Sihirli ranking iddiası yok; faydalı cevap + hub linkleri öncelik.
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
                      {district} temizlik hub →
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
            heading="GEO SSS sonrası teklif"
            intro="Passage’den para sayfasına — Sarıyer hattı ve keşif."
            groups={[
              {
                title: 'Öncelik',
                links: [
                  { href: '/bolgeler/sariyer', label: 'Sarıyer hub' },
                  { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy' },
                  { href: '/sss/bolge', label: 'Bölge SSS' },
                  { href: '/sss/fiyat', label: 'Fiyat SSS' },
                ],
              },
              {
                title: 'Teklif',
                links: [
                  { href: '/randevu', label: 'Ücretsiz keşif' },
                  { href: '/fiyat-hesaplama', label: 'Fiyat hesapla' },
                  { href: '/harita-ve-yorumlar', label: 'Harita & yorumlar' },
                ],
              },
            ]}
          />
          <WhyChooseZvt
            tone="dark"
            contextLabel="GEO SSS sonrası temizlik"
            sourcePrefix="geo-sss-hub-why-zvt"
          />
        </div>
      </div>
      <StickySeoCtaBar contextLabel="GEO SSS" sourcePrefix="geo-sss-hub-sticky" />
    </SiteLayout>
  );
}
