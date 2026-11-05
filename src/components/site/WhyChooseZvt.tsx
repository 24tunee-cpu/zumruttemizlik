import Link from 'next/link';
import { SITE_CONTACT, toTelHref } from '@/config/site-contact';
import { formatGoogleTrustLine } from '@/config/trust-signals';
import { getPublicMapsUrl, getPublicReviewUrl, withGmbUtm } from '@/lib/gbp-links';

type Props = {
  /** Örn. "Sarıyer ev temizliği" — WA/ara bağlamı */
  contextLabel?: string;
  tone?: 'dark' | 'light';
  sourcePrefix?: string;
};

const POINTS = [
  'Kapsam keşifte netleşir — sürpriz ek ücret dili yok',
  'Ücretsiz keşif / WhatsApp fotoğrafla ön teklif',
  'Tahmini fiyat hesaplama + kesin fiyat keşif sonrası',
  'Öncelik bölge: Sarıyer / Zekeriyaköy operasyon hattı',
] as const;

/**
 * Tek iş: “Neden Zümrüt Vadi?” güven kutusu + net CTA.
 * Kart değil; mevcut dark/light SEO yüzeylerine uyum.
 */
export function WhyChooseZvt({
  contextLabel,
  tone = 'dark',
  sourcePrefix = 'why-zvt',
}: Props) {
  const isDark = tone === 'dark';
  const context = contextLabel?.trim();
  const waText = context
    ? `Merhaba, ${context} için ücretsiz keşif ve fiyat teklifi almak istiyorum.`
    : 'Merhaba, temizlik hizmeti için ücretsiz keşif ve fiyat teklifi almak istiyorum.';
  const waHref = `https://wa.me/${SITE_CONTACT.whatsappDigits}?text=${encodeURIComponent(waText)}`;
  const callHref = toTelHref(SITE_CONTACT.phoneE164);
  const reviewHref =
    getPublicReviewUrl() ||
    withGmbUtm(getPublicMapsUrl(), 'why-zvt-review', { content: sourcePrefix });
  const trustLine = formatGoogleTrustLine();

  return (
    <section
      className={
        isDark
          ? 'mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 sm:p-6'
          : 'mt-12 rounded-xl border border-emerald-500/30 bg-emerald-50 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10'
      }
      aria-labelledby="why-zvt-heading"
    >
      <h2
        id="why-zvt-heading"
        className={
          isDark
            ? 'text-xl font-semibold text-emerald-100'
            : 'text-xl font-semibold text-emerald-900 dark:text-emerald-100'
        }
      >
        Neden {SITE_CONTACT.companyName}?
      </h2>
      <p
        className={
          isDark
            ? 'mt-1 text-sm text-emerald-50'
            : 'mt-1 text-sm text-emerald-900 dark:text-emerald-50'
        }
      >
        Tek net sonraki adım: ara, WhatsApp veya ücretsiz keşif. {trustLine}.
      </p>
      <ul
        className={
          isDark
            ? 'mt-4 list-disc space-y-2 pl-5 text-sm text-emerald-50'
            : 'mt-4 list-disc space-y-2 pl-5 text-sm text-emerald-950 dark:text-emerald-50'
        }
      >
        {POINTS.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          data-source={`${sourcePrefix}-whatsapp`}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          WhatsApp
        </a>
        <a
          href={callHref}
          data-source={`${sourcePrefix}-call`}
          className={
            isDark
              ? 'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-emerald-400/50 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/20'
              : 'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-emerald-600/40 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-400/50 dark:text-emerald-100 dark:hover:bg-emerald-500/20'
          }
        >
          Ara: {SITE_CONTACT.phoneDisplay}
        </a>
        <Link
          href="/randevu"
          data-source={`${sourcePrefix}-randevu`}
          className={
            isDark
              ? 'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-emerald-400/50 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/20'
              : 'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-emerald-600/40 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-400/50 dark:text-emerald-100 dark:hover:bg-emerald-500/20'
          }
        >
          Ücretsiz keşif
        </Link>
        <a
          href={reviewHref}
          target="_blank"
          rel="noopener noreferrer"
          data-source={`${sourcePrefix}-google-review`}
          className={
            isDark
              ? 'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-emerald-400/50 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/20'
              : 'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-emerald-600/40 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-400/50 dark:text-emerald-100 dark:hover:bg-emerald-500/20'
          }
        >
          Google’da yorum
        </a>
        <Link
          href="/harita-ve-yorumlar"
          data-source={`${sourcePrefix}-harita`}
          className={
            isDark
              ? 'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-emerald-400/50 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/20'
              : 'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-emerald-600/40 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-400/50 dark:text-emerald-100 dark:hover:bg-emerald-500/20'
          }
        >
          Harita &amp; yorumlar
        </Link>
      </div>
    </section>
  );
}
