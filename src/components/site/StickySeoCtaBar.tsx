'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calculator, Calendar, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { SITE_CONTACT } from '@/config/site-contact';

type StickySeoCtaBarProps = {
  /** WhatsApp mesajına eklenecek bağlam (ör. ilçe veya yazı konusu) */
  contextLabel?: string;
  /** data-source öneki — analitik ayrımı */
  sourcePrefix?: string;
};

export function StickySeoCtaBar({
  contextLabel,
  sourcePrefix = 'sticky-seo-cta',
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
  const context = contextLabel?.trim();
  const waText = context
    ? `Merhaba, ${context} için ücretsiz keşif ve fiyat teklifi almak istiyorum.`
    : 'Merhaba, temizlik hizmeti için ücretsiz keşif ve fiyat teklifi almak istiyorum.';
  const waHref = `https://wa.me/${waDigits}?text=${encodeURIComponent(waText)}`;

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-700/80 bg-slate-900/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
      role="region"
      aria-label="Hızlı teklif ve iletişim"
    >
      <p className="mb-2 text-center text-xs text-slate-400">
        Ücretsiz keşif · Genelde 30 dk içinde dönüş
      </p>
      <div className="mx-auto grid max-w-3xl grid-cols-3 gap-2">
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
        <Link
          href="/fiyat-hesaplama"
          data-source={`${sourcePrefix}-fiyat`}
          className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-xl bg-amber-600 px-2 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-amber-500 sm:flex-row sm:gap-1.5 sm:text-sm"
        >
          <Calculator className="h-4 w-4 shrink-0" aria-hidden />
          <span>Fiyat Al</span>
        </Link>
        <Link
          href="/randevu"
          data-source={`${sourcePrefix}-kesif`}
          className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-xl border border-emerald-500/50 bg-emerald-500/15 px-2 py-2 text-center text-xs font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/25 sm:flex-row sm:gap-1.5 sm:text-sm"
        >
          <Calendar className="h-4 w-4 shrink-0" aria-hidden />
          <span>Keşif</span>
        </Link>
      </div>
    </div>
  );
}
