'use client';

import { Phone, Sparkles } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { SITE_CONTACT, toTelHref } from '@/config/site-contact';
import { openLeadAssistant } from '@/lib/lead-assistant';

/**
 * Mobil alt çubuk — WA tekrarı yok (asistan menüsünde var).
 * Ara + Asistan (LeadAssistant açar).
 */
export default function MobileCallBar() {
  const { settings } = useSiteSettings();

  const phoneDisplay = settings.phone?.trim() || SITE_CONTACT.phoneDisplay;
  const telHref = toTelHref(settings.phone?.trim() || SITE_CONTACT.phoneE164);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-700 bg-slate-900/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden [:is(html.lead-assistant-open)_&]:hidden">
      <p className="mb-2 text-center text-xs text-slate-300">
        Hızlı dönüş · Asistan ile teklif / keşif
      </p>
      <div className="grid grid-cols-2 gap-2">
        <a
          href={telHref}
          data-source="mobile-call-bar"
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 py-2.5 font-semibold text-white hover:bg-amber-500"
          aria-label={`Hemen ara: ${phoneDisplay}`}
        >
          <Phone className="h-4 w-4" aria-hidden />
          Ara
        </a>
        <button
          type="button"
          data-source="mobile-call-bar-assistant"
          onClick={() => openLeadAssistant({ screen: 'quote' })}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-emerald-700 px-3 py-2.5 font-semibold text-white hover:bg-emerald-800"
          aria-label="Teklif asistanını aç"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          Asistan
        </button>
      </div>
    </div>
  );
}
