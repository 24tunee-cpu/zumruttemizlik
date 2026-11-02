'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, MessageCircle, Phone, Star } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { SITE_CONTACT, toTelHref } from '@/config/site-contact';
import {
  getPublicMapsUrl,
  getPublicReviewUrl,
  withGmbUtm,
} from '@/lib/gbp-links';

type StickySeoCtaBarProps = {
  /** WhatsApp mesajına eklenecek bağlam (ör. ilçe veya yazı konusu) */
  contextLabel?: string;
  /** data-source öneki — analitik ayrımı */
  sourcePrefix?: string;
  /** Harita / yorum CTA (varsayılan: açık) */
  showMapsCta?: boolean;
};

export function StickySeoCtaBar({
  contextLabel,
  sourcePrefix = 'sticky-seo-cta',
  showMapsCta = true,
}: StickySeoCtaBarProps) {
  const { settings } = useSiteSettings();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 280);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waDigits = (settings.whatsapp?.trim() || SITE_CONTACT.whatsappDigits).replace(/\D/g, '');
  const phoneDisplay = settings.phone?.trim() || SITE_CONTACT.phoneDisplay;
  const callHref = toTelHref(settings.phone?.trim() || SITE_CONTACT.phoneE164);
  const context = contextLabel?.trim();
  const waText = context
    ? `Merhaba, ${context} için ücretsiz keşif ve fiyat teklifi almak istiyorum.`
    : 'Merhaba, temizlik hizmeti için ücretsiz keşif ve fiyat teklifi almak istiyorum.';
  const waHref = `https://wa.me/${waDigits}?text=${encodeURIComponent(waText)}`;

  const reviewUrl = getPublicReviewUrl();
  const mapsHref = withGmbUtm(getPublicMapsUrl(), `${sourcePrefix}-maps`, {
    content: 'sticky',
  });
  const reviewHref = reviewUrl
    ? withGmbUtm(reviewUrl, `${sourcePrefix}-review`, { content: 'sticky' })
    : null;

  if (!visible) return null;

  const mapsEnabled = showMapsCta;
  const colCount = mapsEnabled ? (reviewHref ? 5 : 4) : 3;
  const gridClass =
    colCount >= 5
      ? 'grid-cols-3 sm:grid-cols-5'
      : colCount === 4
        ? 'grid-cols-2 sm:grid-cols-4'
        : 'grid-cols-3';

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-700/80 bg-slate-900/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
      role="region"
      aria-label="Hızlı teklif ve iletişim"
    >
      <p className="mb-2 text-center text-xs text-slate-400">
        Ücretsiz keşif · Genelde 30 dk içinde dönüş
      </p>
      <div className={`mx-auto grid max-w-3xl gap-2 ${gridClass}`}>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          data-source={`${sourcePrefix}-whatsapp`}
          className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-xl bg-emerald-600 px-2 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-emerald-500 sm:flex-row sm:gap-1.5 sm:text-sm"
        >
          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
          <span>WhatsApp</span>
        </a>
        <a
          href={callHref}
          data-source={`${sourcePrefix}-call`}
          className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-xl bg-amber-600 px-2 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-amber-500 sm:flex-row sm:gap-1.5 sm:text-sm"
          aria-label={`Ara: ${phoneDisplay}`}
        >
          <Phone className="h-4 w-4 shrink-0" aria-hidden />
          <span>Ara</span>
        </a>
        <Link
          href="/randevu"
          data-source={`${sourcePrefix}-kesif`}
          className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-xl border border-emerald-500/50 bg-emerald-500/15 px-2 py-2 text-center text-xs font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/25 sm:flex-row sm:gap-1.5 sm:text-sm"
        >
          <Calendar className="h-4 w-4 shrink-0" aria-hidden />
          <span>Keşif</span>
        </Link>
        {mapsEnabled ? (
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            data-source={`${sourcePrefix}-maps`}
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-xl border border-slate-500/50 bg-slate-800/80 px-2 py-2 text-center text-xs font-semibold text-slate-100 transition-colors hover:bg-slate-700 sm:flex-row sm:gap-1.5 sm:text-sm"
          >
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            <span>Harita</span>
          </a>
        ) : null}
        {mapsEnabled && reviewHref ? (
          <a
            href={reviewHref}
            target="_blank"
            rel="noopener noreferrer"
            data-source={`${sourcePrefix}-review`}
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-2 py-2 text-center text-xs font-semibold text-amber-100 transition-colors hover:bg-amber-500/25 sm:flex-row sm:gap-1.5 sm:text-sm"
          >
            <Star className="h-4 w-4 shrink-0" aria-hidden />
            <span>Yorum</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
