import type { Metadata } from 'next';
import { SITE_CONTACT } from '@/config/site-contact';
import SiteLayout from '../site/layout';
import { MapsLazySection } from '@/components/site/MapsLazySection';
import { canonicalUrl, generateWebPageSchema, serializeSchemaGraph } from '@/lib/seo';
import {
  buildGoogleMapsReviewSchemaGraph,
  computeGoogleReviewAggregate,
  fetchGoogleMapReviewsForSeo,
} from '@/lib/map-reviews-seo';
import { getGoogleMapsPublicLinks, withGmbUtm } from '@/lib/google-maps-public-links';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const googleReviews = await fetchGoogleMapReviewsForSeo();
  const agg = computeGoogleReviewAggregate(googleReviews);
  const title = 'Google Harita ve Müşteri Yorumları | İstanbul | Zümrüt Vadi';
  const description =
    agg && agg.reviewCount > 0
      ? `${SITE_CONTACT.addressLocality} konumumuzu haritada görüntüleyin. Google'da ${agg.ratingValue}/5 ortalama (${agg.reviewCount} yorum). Yol tarifi ve yorum yazın.`
      : `${SITE_CONTACT.addressLocality} konumumuzu haritada görüntüleyin, gerçek müşteri yorumlarını inceleyin ve doğrudan yol tarifi alın.`;
  const canonical = canonicalUrl('/harita-ve-yorumlar');

  return {
    title,
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
        </div>
      </div>
    </SiteLayout>
  );
}
