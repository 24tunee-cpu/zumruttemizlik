import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONTACT } from '@/config/site-contact';
import SiteLayout from '../site/layout';
import { MapsLazySection } from '@/components/site/MapsLazySection';
import RelatedSeoLinks from '@/components/site/RelatedSeoLinks';
import { StickySeoCtaBar } from '@/components/site/StickySeoCtaBar';
import { WhyChooseZvt } from '@/components/site/WhyChooseZvt';
import { canonicalUrl, generateWebPageSchema, serializeSchemaGraph } from '@/lib/seo';
import {
  buildGoogleMapsReviewSchemaGraph,
  computeGoogleReviewAggregate,
  fetchGoogleMapReviewsForSeo,
} from '@/lib/map-reviews-seo';
import { getGoogleMapsPublicLinks, withGmbUtm } from '@/lib/google-maps-public-links';
import { clampMetaDescription, clampMetaTitle } from '@/lib/meta-clamp';
import { formatGoogleTrustLine } from '@/config/trust-signals';

/** ISR: 24 saat — bkz. src/lib/isr-config.ts */
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const googleReviews = await fetchGoogleMapReviewsForSeo();
  const agg = computeGoogleReviewAggregate(googleReviews);
  const title = clampMetaTitle('Google Harita & Yorumlar | Sarıyer');
  const description = clampMetaDescription(
    agg && agg.reviewCount > 0
      ? `Sarıyer pin ve Google ${agg.ratingValue} · ${agg.reviewCount} yorum. Yol tarifi, yorum yaz, ücretsiz keşif.`
      : `Sarıyer / Ferahevler konum, ${formatGoogleTrustLine()}. Yol tarifi ve yorum yazın.`
  );
  const canonical = canonicalUrl('/harita-ve-yorumlar');

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
      siteName: SITE_CONTACT.companyName,
    },
  };
}

export default async function MapsAndReviewsPage() {
  const mapsLinks = await getGoogleMapsPublicLinks();
  const mapsOpenHref = withGmbUtm(mapsLinks.mapsOpenUrl, 'gmb-harita');
  const reviewHref = withGmbUtm(mapsLinks.reviewUrl, 'gmb-yorum');
  const directionsHref = withGmbUtm(
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE_CONTACT.addressLine)}`,
    'gmb-yol-tarifi'
  );

  const telHref = `tel:${SITE_CONTACT.phoneE164}`;
  const whatsappHref = `https://wa.me/${SITE_CONTACT.whatsappDigits}`;
  const googleReviews = await fetchGoogleMapReviewsForSeo();
  const agg = computeGoogleReviewAggregate(googleReviews);

  const jsonLd = serializeSchemaGraph([
    generateWebPageSchema({
      path: '/harita-ve-yorumlar',
      title: 'Google Harita ve Müşteri Yorumları | İstanbul | Zümrüt Vadi',
      description: 'Zümrüt Vadi Temizlik Google Harita konumu, müşteri yorumları ve yol tarifi.',
    }),
    buildGoogleMapsReviewSchemaGraph(googleReviews, mapsLinks),
  ]);

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <div className="min-h-screen bg-slate-900 pb-16 pt-28 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <header>
            <h1 className="text-3xl font-bold sm:text-4xl">
              İstanbul Temizlik Hizmet Bölgelerimiz — {SITE_CONTACT.addressLocality} Harita ve Yorumlar
            </h1>
            {agg && agg.reviewCount > 0 && (
              <p className="mt-3 inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-200">
                Google ortalama {agg.ratingValue}/5 · {agg.reviewCount} yorum
              </p>
            )}
            <p className="mt-4 max-w-3xl text-slate-300 leading-relaxed">
              {SITE_CONTACT.companyName} olarak {SITE_CONTACT.addressLocality} ve İstanbul genelinde profesyonel
              temizlik hizmetleri sunuyoruz. Ev temizliği, ofis temizliği, inşaat sonrası temizlik ve derin temizlik
              alanlarında uzman ekibimizle hizmetinizdeyiz. Yerel temizlik firması olarak müşteri memnuniyetini ön
              planda tutuyor, güvenilir ve kaliteli hizmet anlayışımızla her projede en iyi sonuçları elde etmeyi
              hedefliyoruz. Haritadan {SITE_CONTACT.addressLocality} ofis konumumuzu görüntüleyebilir, müşteri
              yorumlarını okuyarak hakkımızda detaylı bilgi edinebilir ve deneyimlerinizi Google üzerinden
              paylaşabilirsiniz. İstanbul temizlik hizmetleri için hemen iletişime geçin, ücretsiz keşif ve fiyat
              teklifi alın.
            </p>
          </header>

          <MapsLazySection
            embedSrc={mapsLinks.mapsEmbedUrl}
            mapsOpenHref={mapsOpenHref}
            title="Zümrüt Vadi Temizlik Google Harita"
          />

          <section className="mt-8 rounded-2xl border border-slate-800 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-emerald-200">Aksiyonlar</h2>
            <p className="mt-2 text-sm text-slate-300">
              Harita, yorum ve yol tarifi için tek tıkla açabilirsiniz.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href={mapsOpenHref}
                data-source="gmb_map_click"
                className="flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                Haritada Aç
              </a>
              <a
                href={reviewHref}
                data-source="gmb_review_click"
                className="flex min-h-[44px] items-center justify-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                Yorum Yaz
              </a>
              <a
                href={directionsHref}
                data-source="gmb_directions_click"
                className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-700 bg-slate-800/30 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                Yol Tarifi Al
              </a>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a
                href={telHref}
                data-source="gmb_phone_cta"
                className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/20 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800/40 transition-colors"
              >
                {SITE_CONTACT.phoneDisplay} ile Ara
              </a>
              <a
                href={whatsappHref}
                data-source="gmb_whatsapp_cta"
                className="flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-800/20 p-5">
            <h2 className="text-sm font-semibold text-slate-200">İşletme Bilgileri</h2>
            <p className="mt-2 text-sm text-slate-300">
              <span className="text-slate-200">Adres: </span>
              {SITE_CONTACT.addressLine}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="text-slate-200">Telefon: </span>
              {SITE_CONTACT.phoneDisplay}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="text-slate-200">Çalışma: </span>
              24 saat açık
            </p>
          </section>

          <WhyChooseZvt tone="dark" contextLabel="Google Harita üzerinden temizlik" sourcePrefix="maps-why-zvt" />

          <RelatedSeoLinks
            tone="dark"
            heading="Hizmet ve bölge sayfalarına geçin"
            intro="Yorumlardan sonra doğru landing’e yönelin — Sarıyer / Zekeriyaköy öncelikli."
            groups={[
              {
                title: 'Öncelik bölgeler',
                links: [
                  { href: '/bolgeler/sariyer', label: 'Sarıyer temizlik' },
                  { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy temizlik' },
                  { href: '/bolgeler/sariyer/uskumrukoy', label: 'Uskumruköy temizlik' },
                  { href: '/bolgeler', label: 'Tüm bölgeler' },
                ],
              },
              {
                title: 'Ana hizmetler',
                links: [
                  { href: '/hizmetler/ev-temizligi', label: 'Ev temizliği' },
                  { href: '/hizmetler/ofis-temizligi', label: 'Ofis temizliği' },
                  { href: '/hizmetler/insaat-sonrasi-temizlik', label: 'İnşaat sonrası temizlik' },
                  { href: '/hizmetler', label: 'Tüm hizmetler' },
                ],
              },
              {
                title: 'Teklif',
                links: [
                  { href: '/fiyat-hesaplama', label: 'Fiyat hesapla' },
                  { href: '/randevu', label: 'Ücretsiz keşif' },
                  { href: '/geo-sss', label: 'GEO SSS' },
                  { href: '/iletisim', label: 'İletişim' },
                ],
              },
            ]}
          />

          <p className="mt-6 text-center text-sm text-slate-400">
            Detaylı sorular için{' '}
            <Link href="/sss" className="text-emerald-300 hover:underline">
              SSS
            </Link>{' '}
            veya{' '}
            <Link href="/geo-sss" className="text-emerald-300 hover:underline">
              ilçe GEO SSS
            </Link>
            .
          </p>
        </div>
        <StickySeoCtaBar contextLabel="Harita ve yorumlar" sourcePrefix="maps-sticky" />
      </div>
    </SiteLayout>
  );
}
