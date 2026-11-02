import type { Metadata } from 'next';
import Link from 'next/link';
import SiteLayout from '../site/layout';
import SiteHubLinkStrip from '@/components/site/SiteHubLinkStrip';
import RelatedSeoLinks from '@/components/site/RelatedSeoLinks';
import { StickySeoCtaBar } from '@/components/site/StickySeoCtaBar';
import { WhyChooseZvt } from '@/components/site/WhyChooseZvt';
import {
  canonicalUrl,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  serializeSchemaGraph,
} from '@/lib/seo';
import { clampMetaDescription, clampMetaTitle } from '@/lib/meta-clamp';
import { SITE_CONTACT } from '@/config/site-contact';

const rehberTitle = clampMetaTitle('İstanbul Temizlik Rehberi | Hangi Hizmet Ne Zaman?');
const rehberDescription = clampMetaDescription(
  'Ev, ofis, inşaat sonrası ve periyodik temizlik için karar rehberi. Sarıyer / Zekeriyaköy odaklı; ücretsiz keşif.'
);

export const metadata: Metadata = {
  title: { absolute: rehberTitle },
  description: rehberDescription,
  alternates: { canonical: canonicalUrl('/rehber') },
  openGraph: {
    title: rehberTitle,
    description: rehberDescription,
    url: canonicalUrl('/rehber'),
    type: 'website',
    locale: 'tr_TR',
    siteName: SITE_CONTACT.companyName,
    images: [
      {
        url: canonicalUrl('/logo.png'),
        width: 1200,
        height: 630,
        alt: 'Zümrüt Vadi Temizlik - Temizlik rehberi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: rehberTitle,
    description: rehberDescription,
    images: [canonicalUrl('/logo.png')],
  },
};

const rehberJsonLd = serializeSchemaGraph([
  generateWebPageSchema({
    path: '/rehber',
    title: rehberTitle,
    description: rehberDescription,
  }),
  generateBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Temizlik rehberi', url: '/rehber' },
  ]) as Record<string, unknown>,
]);

const blocks = [
  {
    title: 'İnşaat ve tadilat sonrası',
    body: 'Toz, harç ve yapışkan kalıntılar için önce kabaca süpürme, ardından profesyonel ekip ile detaylı temizlik önerilir. Havalandırma ve yüzey tipine göre ürün seçimi kritiktir.',
  },
  {
    title: 'Ofis ve ortak alanlar',
    body: 'Çalışma saatleri dışında veya hafta sonu blok randevu genelde verimi artırır. Halı ve döşeme yoğunluğu yüksekse düzenli periyot planlanmalıdır.',
  },
  {
    title: 'Ev derinlemesine',
    body: 'Dolap içleri, cam ve mutfak yağları ayrı aşamalarda ele alınır. Alerji ve evcil hayvan varlığını önceden paylaşmanız ürün seçimini güvenli hale getirir.',
  },
  {
    title: 'Periyodik bakım',
    body: 'Haftalık hafif — aylık derin dengesi bütçe ve hijyen için uygundur. Yoğun kullanılan banyo ve mutfak önceliklendirilir.',
  },
];

export default function RehberPage() {
  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: rehberJsonLd }} />
      <article className="bg-white py-12 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Hangi temizlik ne zaman?</h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            Aşağıdaki özet, doğru hizmeti ve zamanlamayı seçmenize yardımcı olur. Kesin süre ve fiyat için{' '}
            <Link href="/randevu" className="font-medium text-emerald-600 underline-offset-2 hover:underline dark:text-emerald-400">
              keşif talebi
            </Link>{' '}
            veya{' '}
            <Link href="/iletisim" className="font-medium text-emerald-600 underline-offset-2 hover:underline dark:text-emerald-400">
              iletişim
            </Link>{' '}
            formunu kullanabilirsiniz.
          </p>
          <SiteHubLinkStrip tone="light" className="mt-6" />
          <ol className="mt-10 space-y-8">
            {blocks.map((b, i) => (
              <li key={b.title} className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Bölüm {i + 1}</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{b.title}</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{b.body}</p>
                {i === 0 ? (
                  <p className="mt-3 text-sm">
                    <Link href="/cozumler/insaat-sonrasi-temizlik" className="font-medium text-emerald-600 underline-offset-2 hover:underline dark:text-emerald-400">
                      İnşaat sonrası temizlik çözümü →
                    </Link>
                  </p>
                ) : null}
                {i === 1 ? (
                  <p className="mt-3 text-sm">
                    <Link href="/hizmetler/ofis-temizligi" className="font-medium text-emerald-600 underline-offset-2 hover:underline dark:text-emerald-400">
                      Ofis temizliği hizmeti →
                    </Link>
                  </p>
                ) : null}
                {i === 2 ? (
                  <p className="mt-3 text-sm">
                    <Link href="/hizmetler/ev-temizligi" className="font-medium text-emerald-600 underline-offset-2 hover:underline dark:text-emerald-400">
                      Ev temizliği hizmeti →
                    </Link>
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
          <RelatedSeoLinks
            tone="light"
            heading="Rehberden hizmet ve bölgelere"
            groups={[
              {
                title: 'Hizmetler',
                links: [
                  { href: '/hizmetler/ev-temizligi', label: 'Ev temizliği' },
                  { href: '/hizmetler/ofis-temizligi', label: 'Ofis temizliği' },
                  { href: '/hizmetler/insaat-sonrasi-temizlik', label: 'İnşaat sonrası temizlik' },
                  { href: '/hizmetler', label: 'Tüm hizmetler' },
                ],
              },
              {
                title: 'Öncelikli bölgeler',
                links: [
                  { href: '/bolgeler/sariyer', label: 'Sarıyer' },
                  { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy' },
                  { href: '/bolgeler', label: 'Tüm bölgeler' },
                ],
              },
              {
                title: 'Çözümler & CTA',
                links: [
                  { href: '/cozumler', label: 'Çözüm rehberleri' },
                  { href: '/fiyat-hesaplama', label: 'Fiyat hesapla' },
                  { href: '/randevu', label: 'Randevu' },
                ],
              },
            ]}
          />
          <WhyChooseZvt
            tone="light"
            contextLabel="Rehber sonrası temizlik"
            sourcePrefix="rehber-why-zvt"
          />
        </div>
      </article>
      <StickySeoCtaBar contextLabel="Rehber" sourcePrefix="rehber-sticky" />
    </SiteLayout>
  );
}
