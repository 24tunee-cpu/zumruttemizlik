import Link from 'next/link';
import { SERVICE_LANDINGS } from '@/config/programmatic-seo';
import { GEO_SSS_PAGES } from '@/config/geo-district-faqs';

type DistrictHubLinksProps = {
  districtSlug: string;
  districtName: string;
  blogSlugs?: string[];
};

const V2_BLOG_SUFFIXES = [
  { suffix: 'ev-temizligi-fiyatlari-2026', label: 'Ev temizliği fiyat rehberi' },
  { suffix: 'ofis-temizligi-fiyatlari-2026', label: 'Ofis temizliği fiyat rehberi' },
  { suffix: 'kira-teslim-temizlik-rehberi-2026', label: 'Kira teslim rehberi' },
  { suffix: 'profesyonel-temizlik-firma-secimi-rehberi-2026', label: 'Firma seçimi rehberi' },
] as const;

export function DistrictHubLinks({ districtSlug, districtName, blogSlugs = [] }: DistrictHubLinksProps) {
  const publishedSet = new Set(blogSlugs);
  const geoSss = GEO_SSS_PAGES.filter((p) => p.districtSlug === districtSlug).slice(0, 3);
  const topServices = SERVICE_LANDINGS.slice(0, 6);

  const blogLinks = V2_BLOG_SUFFIXES.filter(({ suffix }) =>
    publishedSet.has(`${districtSlug}-${suffix}`)
  );

  return (
    <section className="mt-8 rounded-xl border border-slate-700 bg-slate-800/40 p-5">
      <h2 className="text-xl font-semibold text-white">{districtName} — ilgili sayfalar</h2>
      <p className="mt-1 text-sm text-slate-400">
        Hizmet, fiyat rehberi ve SSS sayfalarına doğrudan geçiş.
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-3">
        <div>
          <h3 className="text-sm font-semibold text-emerald-300">Hizmetler</h3>
          <ul className="mt-2 space-y-1.5">
            {topServices.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/bolgeler/${districtSlug}/${s.slug}`}
                  className="text-sm text-slate-300 underline-offset-2 hover:text-emerald-300 hover:underline"
                >
                  {districtName} {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {blogLinks.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-emerald-300">Fiyat & rehber yazıları</h3>
            <ul className="mt-2 space-y-1.5">
              {blogLinks.map(({ suffix, label }) => (
                <li key={suffix}>
                  <Link
                    href={`/blog/${districtSlug}-${suffix}`}
                    className="text-sm text-slate-300 underline-offset-2 hover:text-emerald-300 hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {geoSss.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-emerald-300">GEO SSS</h3>
            <ul className="mt-2 space-y-1.5">
              {geoSss.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/geo-sss/${p.slug}`}
                    className="text-sm text-slate-300 underline-offset-2 hover:text-emerald-300 hover:underline"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-700 pt-4">
        <Link
          href="/fiyat-hesaplama"
          className="rounded-lg bg-amber-600/90 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
        >
          Online fiyat hesapla
        </Link>
        <Link
          href="/randevu"
          className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20"
        >
          Ücretsiz keşif
        </Link>
        <Link
          href="/harita-ve-yorumlar"
          className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
        >
          Harita & yorumlar
        </Link>
      </div>
    </section>
  );
}
