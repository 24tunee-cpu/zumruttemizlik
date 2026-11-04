'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

function pushEvent(eventName: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dataLayer?.push({ event: eventName, ...params });
  window.gtag?.('event', eventName, params);
}

function sendToBackend(payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon('/api/marketing-events', blob);
    return;
  }

  void fetch('/api/marketing-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  });
}

export default function MarketingEventTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;

      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = (anchor.getAttribute('href') || '').trim();
      if (!href) return;

      const text = (anchor.textContent || '').trim().slice(0, 80);
      const source = anchor.dataset.source || 'unknown';
      const location = window.location.pathname;

      if (href.startsWith('tel:')) {
        const payload = {
          link_url: href,
          link_text: text,
          source,
          location,
          method: 'phone',
        };
        pushEvent('phone_click', payload);
        // GA4 key event adayı — Search Console/GA “lead=0” boşluğunu kapatır
        pushEvent('generate_lead', { ...payload, lead_type: 'phone_click' });
        sendToBackend({ eventType: 'phone_click', ...payload });
        return;
      }

      if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        const payload = {
          link_url: href,
          link_text: text,
          source,
          location,
          method: 'whatsapp',
        };
        pushEvent('whatsapp_click', payload);
        pushEvent('generate_lead', { ...payload, lead_type: 'whatsapp_click' });
        sendToBackend({ eventType: 'whatsapp_click', ...payload });
        return;
      }

      // Para CTA — randevu / fiyat hesaplama
      try {
        const pathOnly = href.startsWith('http')
          ? new URL(href).pathname
          : href.split('?')[0];
        if (pathOnly === '/randevu' || pathOnly === '/fiyat-hesaplama') {
          const payload = {
            link_url: href,
            link_text: text,
            source,
            location,
            method: pathOnly === '/randevu' ? 'appointment' : 'price_calculator',
          };
          pushEvent('cta_click', payload);
          pushEvent('generate_lead', {
            ...payload,
            lead_type: pathOnly === '/randevu' ? 'randevu_cta' : 'fiyat_cta',
          });
          sendToBackend({ eventType: 'cta_click', ...payload });
        }
      } catch {
        /* ignore bad href */
      }

      if (href.startsWith('mailto:')) {
        const payload = {
          link_url: href,
          link_text: text,
          source,
          location,
        };
        pushEvent('email_click', payload);
        sendToBackend({ eventType: 'email_click', ...payload });
      }

      // Google Maps / Directions / Review CTA tracking
      if (href.includes('google.com/maps')) {
        if (
          source === 'gmb_map_click' ||
          source === 'gmb_review_click' ||
          source === 'gmb_directions_click'
        ) {
          const payload = {
            link_url: href,
            link_text: text,
            source,
            location,
          };
          pushEvent(source, payload);
          sendToBackend({ eventType: source, ...payload });
        }
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
