'use client';

type GaWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (command: string, ...args: unknown[]) => void;
};

/** Google Ads — “Fiyat teklifi isteyin” etkinlik snippet’i (form izleme) */
export const GOOGLE_ADS_QUOTE_EVENT = 'ads_conversion_Fiyat_teklifi_isteyin_1';

/** Opsiyonel: AW-XXXX / label — env ile send_to de gönderilir */
const ADS_QUOTE_SEND_TO =
  typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_GOOGLE_ADS_QUOTE_SEND_TO?.trim() || ''
    : '';

/** GA4 / GTM dataLayer — form ve özel dönüşümler için */
export function trackGa4Event(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    const w = window as GaWindow;
    const p = params ?? {};
    w.dataLayer?.push({ event: eventName, ...p });
    w.gtag?.('event', eventName, p);
  } catch {
    /* ignore */
  }
}

/**
 * Google Ads fiyat teklifi dönüşümü.
 * Form başarılı olunca çağır — ham script yapıştırmaya gerek yok.
 */
export function trackGoogleAdsQuoteConversion(params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    const w = window as GaWindow;
    const payload: Record<string, unknown> = {
      ...(params ?? {}),
    };
    if (ADS_QUOTE_SEND_TO) {
      payload.send_to = ADS_QUOTE_SEND_TO;
    }
    w.dataLayer?.push({ event: GOOGLE_ADS_QUOTE_EVENT, ...payload });
    w.gtag?.('event', GOOGLE_ADS_QUOTE_EVENT, payload);
  } catch {
    /* ignore */
  }
}
