import Link from 'next/link';
import SiteLayout from '../site/layout';
import { GEO_SSS_PAGES } from '@/config/geo-district-faqs';
import type { Metadata } from 'next';
import { canonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: 'GEO SSS Rehberleri | Zümrüt Vadi Temizlik' },
  description:
    'İlçe bazlı kısa SSS sayfaları — AI arama motorları için passage-first cevaplar.',
  alternates: { canonical: canonicalUrl('/geo-sss') },
};

export default function GeoSssIndexPage() {
  const byDistrict = new Map<string, typeof GEO_SSS_PAGES>();
  for (const p of GEO_SSS_PAGES) {
    const list = byDistrict.get(p.districtName) ?? [];
    list.push(p);
    byDistrict.set(p.districtName, list);
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-900 pb-16 pt-28 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">GEO SSS Rehberleri</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            İlçe bazlı kısa soru-cevap sayfaları — yapay zeka arama sistemlerinin doğrudan alıntı
            yapabileceği format.
          </p>
          <div className="mt-10 space-y-8">
            {[...byDistrict.entries()].map(([district, pages]) => (
              <section key={district}>
                <h2 className="text-xl font-semibold text-emerald-300">{district}</h2>
                <ul className="mt-3 space-y-2">
                  {pages.map((p) => (
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
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
