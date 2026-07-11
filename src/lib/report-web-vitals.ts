/**
 * Web Vitals → GA4 + Vercel Speed Insights uyumlu raporlama.
 * Google'ın resmi web-vitals kütüphanesi kullanılır.
 */
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

type GtagFn = (...args: unknown[]) => void;

function getGtag(): GtagFn | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { gtag?: GtagFn };
  return typeof w.gtag === 'function' ? w.gtag : undefined;
}

function sendToGa4(metric: Metric) {
  const gtag = getGtag();
  if (!gtag) return;

  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_rating: metric.rating,
    metric_delta: Math.round(metric.delta),
    non_interaction: true,
  });
}

/** Production'da Core Web Vitals dinleyicilerini başlatır. */
export function initWebVitalsReporting() {
  if (typeof window === 'undefined') return;

  onCLS(sendToGa4);
  onINP(sendToGa4);
  onLCP(sendToGa4);
  onFCP(sendToGa4);
  onTTFB(sendToGa4);
}

export type { Metric };
