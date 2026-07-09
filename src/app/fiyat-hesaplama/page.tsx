import type { Metadata } from 'next';
import Link from 'next/link';
import SiteLayout from '../site/layout';
import { HeroPriceCalculator } from '@/components/site/HeroPriceCalculator';
import {
  SPACE_TYPES,
  ROOM_PRICES,
  ROOM_OPTIONS,
  M2_RATES,
  EXTRAS,
  formatTL,
  type SpaceTypeId,
} from '@/config/pricing';
import {
  canonicalUrl,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  generateFAQSchema,
  serializeSchemaGraph,
} from '@/lib/seo';

const pageTitle = 'Temizlik Fiyatları 2026 & Anında Fiyat Hesaplama | İstanbul';
const pageDescription =
  'İstanbul temizlik fiyatları 2026: ev, ofis, inşaat sonrası ve dış cephe temizliği için güncel fiyat aralıkları. Anında fiyat hesaplama aracıyla saniyeler içinde tahmini fiyatınızı görün, ücretsiz keşif alın. Sarıyer, Zekeriyaköy ve İstanbul Avrupa Yakası.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'temizlik fiyatları 2026',
    'istanbul temizlik fiyatları',
    'online temizlik fiyat hesaplama',
    'ev temizliği fiyatı',
    'ofis temizliği fiyatı',
    'inşaat sonrası temizlik fiyatı',
    'dış cephe temizliği fiyatı',
    'zekeriyaköy temizlik fiyatları',
    'sarıyer temizlik fiyatları',
  ],
  alternates: { canonical: canonicalUrl('/fiyat-hesaplama') },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl('/fiyat-hesaplama'),
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Zümrüt Vadi Temizlik',
    images: [
      {
        url: canonicalUrl('/logo.png'),
        width: 1200,
        height: 630,
        alt: 'Zümrüt Vadi Temizlik - Anında Fiyat Hesaplama',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: [canonicalUrl('/logo.png')],
  },
};

const FAQ_ITEMS = [
  {
    question: 'Temizlik fiyatları neye göre belirlenir?',
    answer:
      'Fiyatlar; mekan tipine (ev, ofis, işyeri, inşaat sonrası, dış cephe), evlerde oda sayısına, diğer mekanlarda metrekareye ve cam temizliği, koltuk/halı yıkama gibi ekstralara göre belirlenir. Kirlilik düzeyi ve erişim koşulları da etkilidir.',
  },
  {
    question: 'Fiyat hesaplama aracı kesin fiyat mı veriyor?',
    answer:
      'Hayır. Araç 2026 İstanbul piyasasına göre TAHMİNÎ bir fiyat aralığı gösterir. Kesin fiyat, ücretsiz keşif ve ön değerlendirme sonrası netleşir.',
  },
  {
    question: 'Buzdolabı/fırın içi ve balkon temizliği ücretli mi?',
    answer:
      'Ev, ofis ve işyeri temizliğinde buzdolabı/fırın içi ve balkon temizliğini ücretsiz hediye olarak sunuyoruz. Cam temizliği ve koltuk/halı yıkama isteğe bağlı ek hizmetlerdir.',
  },
  {
    question: 'Zekeriyaköy ve Sarıyer’de temizlik hizmeti veriyor musunuz?',
    answer:
      'Evet. Sarıyer ve özellikle Zekeriyaköy öncelikli hizmet bölgemizdir. İstanbul Avrupa Yakası başta olmak üzere İstanbul genelinde hizmet veriyoruz.',
  },
  {
    question: 'Ücretsiz keşif var mı?',
    answer:
      'Evet, keşif ve ön değerlendirme ücretsizdir. Fiyatınızı hesapladıktan sonra WhatsApp veya iletişim formu üzerinden randevu oluşturabilirsiniz.',
  },
];

const jsonLd = serializeSchemaGraph([
  generateWebPageSchema({
    path: '/fiyat-hesaplama',
    title: pageTitle,
    description: pageDescription,
  }),
  generateBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Fiyat Hesaplama', url: '/fiyat-hesaplama' },
  ]) as Record<string, unknown>,
  generateFAQSchema(FAQ_ITEMS) as Record<string, unknown>,
]);

const m2Types = SPACE_TYPES.filter((t) => t.mode === 'm2');

export default function FiyatHesaplamaPage() {
  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      {/* Hero + araç */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-950" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
          <div>
            <p className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              2026 Güncel Fiyat Rehberi
            </p>
            <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              İstanbul Temizlik Fiyatları &{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                Anında Fiyat Hesaplama
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-300 sm:text-lg">
              Ev, ofis, inşaat sonrası ve dış cephe temizliği için tahmini fiyatınızı saniyeler
              içinde öğrenin. Sarıyer, Zekeriyaköy ve İstanbul Avrupa Yakası başta olmak üzere
              İstanbul genelinde hizmet veriyoruz.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-300">
              <li>✅ Ücretsiz keşif ve ön değerlendirme</li>
              <li>✅ Buzdolabı/fırın içi ve balkon temizliği hediye</li>
              <li>✅ WhatsApp’tan hızlı randevu</li>
            </ul>
          </div>
          <div>
            <HeroPriceCalculator />
          </div>
        </div>
      </section>

      {/* Fiyat tabloları (SSR) */}
      <section className="bg-white py-14 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            2026 İstanbul Temizlik Fiyat Listesi (Tahmini)
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Aşağıdaki aralıklar orta–üst segment hizmet için 2026 piyasa değerleridir. Kesin fiyat,
            ücretsiz keşif sonrası netleşir.
          </p>

          {/* Ev - oda paketi */}
          <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
            Ev / Daire Temizliği (oda paketi)
          </h3>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Daire Tipi</th>
                  <th className="px-4 py-3 font-semibold">Tahmini Fiyat Aralığı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {ROOM_OPTIONS.map((opt) => (
                  <tr key={opt} className="text-slate-800 dark:text-slate-200">
                    <td className="px-4 py-3 font-medium">{opt} Daire</td>
                    <td className="px-4 py-3">
                      {formatTL(ROOM_PRICES[opt][0])} – {formatTL(ROOM_PRICES[opt][1])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* m² bazlı */}
          <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
            Ofis, İşyeri, İnşaat Sonrası ve Dış Cephe (metrekare bazlı)
          </h3>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Hizmet Tipi</th>
                  <th className="px-4 py-3 font-semibold">Birim Fiyat (TL/m²)</th>
                  <th className="px-4 py-3 font-semibold">Başlangıç (taban)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {m2Types.map((t) => {
                  const rate = M2_RATES[t.id as Exclude<SpaceTypeId, 'ev'>];
                  return (
                    <tr key={t.id} className="text-slate-800 dark:text-slate-200">
                      <td className="px-4 py-3 font-medium">{t.label}</td>
                      <td className="px-4 py-3">
                        {rate.min} – {rate.max} TL/m²
                      </td>
                      <td className="px-4 py-3">
                        {formatTL(rate.floorMin)} – {formatTL(rate.floorMax)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Ekstralar */}
          <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
            Ekstralar
          </h3>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ekstra Hizmet</th>
                  <th className="px-4 py-3 font-semibold">Ek Ücret</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {EXTRAS.map((e) => (
                  <tr key={e.id} className="text-slate-800 dark:text-slate-200">
                    <td className="px-4 py-3 font-medium">{e.label}</td>
                    <td className="px-4 py-3">
                      {e.free ? (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Ücretsiz (Hediye)
                        </span>
                      ) : (
                        `+${formatTL(e.min)} – ${formatTL(e.max)}`
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-14 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Sık Sorulan Sorular
          </h2>
          <div className="mt-6 space-y-3">
            {FAQ_ITEMS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
              >
                <summary className="cursor-pointer list-none font-semibold text-slate-900 dark:text-white">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-center text-white">
            <h2 className="text-xl font-bold sm:text-2xl">Net fiyat için ücretsiz keşif alın</h2>
            <p className="mt-2 text-sm text-white/90">
              Tahmini fiyatınızı hesapladınız mı? Kesin fiyat için hemen randevu oluşturun.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/randevu"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition-transform hover:-translate-y-0.5"
              >
                Randevu Oluştur
              </Link>
              <Link
                href="/iletisim"
                className="rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                İletişime Geç
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
