'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useSiteSettings } from '@/context/SiteSettingsContext';

interface DeferredAnalyticsProps {
  measurementId: string;
}

/** LCP sonrası — gtag paketini geciktir (Fluid CPU + TBT) */
const GA_IDLE_MS = 4_500;

function hasCookieConsent(storageKey: string): boolean {
  try {
    if (localStorage.getItem(storageKey)) return true;

    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key?.startsWith('cookie-consent-v') && localStorage.getItem(key)) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * Google Analytics 4 — Consent Mode v2 + idle/interaction defer.
 * Onaysız çerez yazılmaz; gtag LCP’den sonra yüklenir.
 */
export default function DeferredAnalytics({ measurementId }: DeferredAnalyticsProps) {
  const { settings, isLoading } = useSiteSettings();
  const [consentGranted, setConsentGranted] = useState(false);
  const [loadGa, setLoadGa] = useState(false);

  useEffect(() => {
    if (isLoading || !measurementId) return;

    const version = settings.consentPolicyVersion || '1';
    const storageKey = `cookie-consent-v${version}`;

    if (hasCookieConsent(storageKey)) {
      setConsentGranted(true);
    }

    const onAccepted = () => {
      if (hasCookieConsent(storageKey)) setConsentGranted(true);
    };

    window.addEventListener('cookie-consent-accepted', onAccepted as EventListener);
    window.addEventListener('focus', onAccepted);
    return () => {
      window.removeEventListener('cookie-consent-accepted', onAccepted as EventListener);
      window.removeEventListener('focus', onAccepted);
    };
  }, [isLoading, measurementId, settings.consentPolicyVersion]);

  useEffect(() => {
    if (!measurementId || loadGa) return;

    let done = false;
    const activate = () => {
      if (done) return;
      done = true;
      setLoadGa(true);
    };

    const timer = window.setTimeout(activate, GA_IDLE_MS);
    const onInteract = () => {
      window.clearTimeout(timer);
      activate();
    };

    window.addEventListener('scroll', onInteract, { once: true, passive: true });
    window.addEventListener('pointerdown', onInteract, { once: true });
    window.addEventListener('keydown', onInteract, { once: true });

    let idleId: number | undefined;
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(activate, { timeout: GA_IDLE_MS + 800 });
    }

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [measurementId, loadGa]);

  useEffect(() => {
    if (!consentGranted || !loadGa) return;
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === 'function') {
      w.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
  }, [consentGranted, loadGa]);

  if (!measurementId || !loadGa) return null;

  return (
    <>
      <Script id="ga-consent-default" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
