'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const MOBILE_MEDIA = '(max-width: 767px)';
const MOBILE_IDLE_MS = 6_000;

interface DeferredDexterWidgetProps {
  token: string;
}

/**
 * Dexter GPT widget — mobilde etkileşim/scroll/idle sonrası yüklenir.
 * Masaüstünde afterInteractive ile mevcut davranış korunur.
 */
export function DeferredDexterWidget({ token }: DeferredDexterWidgetProps) {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.matchMedia(MOBILE_MEDIA).matches;
    if (!isMobile) {
      setLoad(true);
      return;
    }

    let loaded = false;
    const activate = () => {
      if (loaded) return;
      loaded = true;
      setLoad(true);
    };

    const idleTimer = window.setTimeout(activate, MOBILE_IDLE_MS);

    const onInteraction = () => {
      window.clearTimeout(idleTimer);
      activate();
    };

    window.addEventListener('scroll', onInteraction, { once: true, passive: true });
    window.addEventListener('pointerdown', onInteraction, { once: true });
    window.addEventListener('keydown', onInteraction, { once: true });

    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener('scroll', onInteraction);
      window.removeEventListener('pointerdown', onInteraction);
      window.removeEventListener('keydown', onInteraction);
    };
  }, []);

  if (!load || !token) return null;

  const isMobile =
    typeof window !== 'undefined' && window.matchMedia(MOBILE_MEDIA).matches;

  return (
    <Script
      id="dexter-widget"
      src="https://apiv4.dextergpt.com/api/v1/dexterWidget"
      data-token={token}
      strategy={isMobile ? 'lazyOnload' : 'afterInteractive'}
    />
  );
}

export default DeferredDexterWidget;
