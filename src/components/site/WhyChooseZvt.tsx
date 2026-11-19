import Link from 'next/link';
import { SITE_CONTACT, toTelHref } from '@/config/site-contact';
import { formatGoogleTrustLine } from '@/config/trust-signals';

type Props = {
  /** Örn. "Sarıyer ev temizliği" — WA/ara bağlamı */
  contextLabel?: string;
  tone?: 'dark' | 'light';
  sourcePrefix?: string;
  /**
   * compact (varsayılan): kısa güven + 3 CTA — her sayfada yormaz
   * full: yalnızca ana sayfa / kritik money page
   */
  variant?: 'compact' | 'full';
};

const COMPACT_POINTS = [
  'Kapsam ücretsiz keşifte yazılır; kesin fiyat keşif sonrası',
  'Online hesaplayıcı yalnızca tahmini aralık verir',
  'Öncelik: Sarıyer / Zekeriyaköy — Avrupa Yakası kapasiteye göre',
] as const;

const FULL_POINTS = [
  'Kapsam ücretsiz keşifte netleşir ve teklife yazılır',
  'Online hesaplayıcı yalnızca tahmini aralık verir; kesin fiyat keşif sonrası',
  'Checklist’li uygulama: mutfak, banyo, zemin ve seçilen ek işler',
  'Eksik kalırsa aynı plan kapsamında düzeltilir',
  'Öncelik bölge: Sarıyer / Zekeriyaköy; Avrupa Yakası rota ve kapasiteye göre',
] as const;

/**
 * Tek iş: kısa güven + net CTA.
 * Sticky bar zaten Ara/WA taşıdığı için burada buton sayısı sınırlı tutulur.
 */
export function WhyChooseZvt({
  contextLabel,
  tone = 'dark',
  sourcePrefix = 'why-zvt',
  variant = 'compact',
}: Props) {
  const isDark = tone === 'dark';
  const isFull = variant === 'full';
  const context = contextLabel?.trim();
  const waText = context
    ? `Merhaba, ${context} için ücretsiz keşif ve fiyat teklifi almak istiyorum.`
    : 'Merhaba, temizlik hizmeti için ücretsiz keşif ve fiyat teklifi almak istiyorum.';
  const waHref = `https://wa.me/${SITE_CONTACT.whatsappDigits}?text=${encodeURIComponent(waText)}`;
  const callHref = toTelHref(SITE_CONTACT.phoneE164);
  const trustLine = formatGoogleTrustLine();
  const points = isFull ? FULL_POINTS : COMPACT_POINTS;

  const shell = isDark
    ? 'mt-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] p-5 sm:p-6'
    : 'mt-10 rounded-xl border border-emerald-500/25 bg-emerald-50/80 p-5 dark:border-emerald-500/25 dark:bg-emerald-500/[0.07]';
  const titleClass = isDark
    ? 'text-lg font-semibold text-white sm:text-xl'
    : 'text-lg font-semibold text-emerald-950 sm:text-xl dark:text-white';
  const bodyClass = isDark
    ? 'mt-1.5 text-sm leading-relaxed text-emerald-50/90'
    : 'mt-1.5 text-sm leading-relaxed text-emerald-950/80 dark:text-emerald-50/90';
  const listClass = isDark
    ? 'mt-3 space-y-1.5 text-sm text-emerald-50/85'
    : 'mt-3 space-y-1.5 text-sm text-emerald-950/80 dark:text-emerald-50/85';
  const secondaryBtn = isDark
    ? 'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/15'
    : 'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-emerald-600/35 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-400/40 dark:text-emerald-100 dark:hover:bg-emerald-500/15';

  return (
    <section className={shell} aria-labelledby="why-zvt-heading">
      <h2 id="why-zvt-heading" className={titleClass}>
        Neden {SITE_CONTACT.companyName}?
      </h2>
      <p className={bodyClass}>
        {trustLine}. Ara, WhatsApp veya ücretsiz keşif ile kapsamı netleştirin.
      </p>
      <ul className={listClass}>
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400" aria-hidden />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={waHref}
          target="_blank"
          rel="nofollow noopener noreferrer"
          data-source={`${sourcePrefix}-whatsapp`}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          WhatsApp
        </a>
        <a href={callHref} data-source={`${sourcePrefix}-call`} className={secondaryBtn}>
          Ara
        </a>
        <Link href="/randevu" data-source={`${sourcePrefix}-randevu`} className={secondaryBtn}>
          Ücretsiz keşif
        </Link>
        {isFull ? (
          <Link href="/fiyat-hesaplama" data-source={`${sourcePrefix}-fiyat`} className={secondaryBtn}>
            Fiyat hesapla
          </Link>
        ) : null}
      </div>
    </section>
  );
}
