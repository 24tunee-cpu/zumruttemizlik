'use client';

import dynamic from 'next/dynamic';

/** LeadAssistant replaces FloatingWhatsApp — tek FAB, mobil bottom sheet */
const LeadAssistant = dynamic(
  () => import('@/components/site/LeadAssistant').then((mod) => mod.LeadAssistant),
  { ssr: false }
);

const MobileCallBar = dynamic(() => import('@/components/site/MobileCallBar'), {
  ssr: false,
});

const CookieConsent = dynamic(
  () => import('@/components/site/CookieConsent').then((mod) => mod.CookieConsent),
  { ssr: false }
);

const MarketingPopup = dynamic(
  () => import('@/components/site/MarketingPopup').then((mod) => mod.MarketingPopup),
  { ssr: false }
);

export default function DeferredFloatingWidgets() {
  return (
    <>
      <MarketingPopup />
      <LeadAssistant />
      <MobileCallBar />
      <CookieConsent />
    </>
  );
}
