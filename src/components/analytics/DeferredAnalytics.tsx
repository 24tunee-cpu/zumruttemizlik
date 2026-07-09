'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useSiteSettings } from '@/context/SiteSettingsContext';

interface DeferredAnalyticsProps {
  measurementId: string;
}

function hasCookieConsent(storageKey: string): boolean {
  try {
    if (localStorage.getItem(storageKey)) return true;

    // Geriye uyumluluk: önceki consent versiyonlarını da kabul et.
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
 * Google Analytics 4 — Consent Mode v2.
 *
 * gtag her zaman yüklenir; ancak varsayılan olarak tüm consent sinyalleri "denied"dir.
 * Bu sayede onay verilmeden çerez yazılmaz (KVKK/GDPR uyumlu) fakat GA çerezsiz
 * (cookieless) sinyal gönderir — böylece Google etiketi tespit eder, doğrulama ve
 * temel veri toplama çalışır. Kullanıcı çerezleri kabul edince consent "granted"e güncellenir.
 */
export default function DeferredAnalytics({ measurementId }: DeferredAnalyticsProps) {
  const { settings, isLoading } = useSiteSettings();
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    if (isLoading || !measurementId) return;

    const version = settings.consentPolicyVersion || '1';
    const storageKey = `cookie-consent-v${version}`;

    if (hasCookieConsent(storageKey)) {
      setConsentGranted(true);
      return;
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

  // Onay verildiğinde consent'i "granted"e yükselt.
  useEffect(() => {
    if (!consentGranted) return;
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === 'function') {
      w.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
  }, [consentGranted]);

  if (!measurementId) return null;

  return (
    <>
      {/* Consent Mode v2 — GA config'ten ÖNCE varsayılan izinleri "denied" yap */}
      <Script id="ga-consent-default" strategy="afterInteractive">
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
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
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
