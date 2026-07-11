/**
 * Core Web Vitals izleme — Faz D.
 * web-vitals → GA4; Vercel Speed Insights ayrı katmanda (VercelMonitoring).
 * Riskli runtime patch'ler kaldırıldı (EventTarget, geç LCP preload).
 */

'use client';

import { useEffect, useState } from 'react';
import { initWebVitalsReporting } from '@/lib/report-web-vitals';

interface WebVitalsSnapshot {
  lcp: number | null;
  inp: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
}

/** Dev overlay için PerformanceObserver snapshot (GA raporlaması web-vitals ile). */
function useDevMetricsSnapshot(): WebVitalsSnapshot {
  const [metrics, setMetrics] = useState<WebVitalsSnapshot>({
    lcp: null,
    inp: null,
    cls: null,
    fcp: null,
    ttfb: null,
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    let clsValue = 0;

    const observers: PerformanceObserver[] = [];

    try {
      observers.push(
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) setMetrics((p) => ({ ...p, lcp: last.startTime }));
        })
      );
      observers[observers.length - 1]!.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      /* ignore */
    }

    try {
      observers.push(
        new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            const e = entry as PerformanceEventTiming & { interactionId?: number };
            if (e.interactionId) setMetrics((p) => ({ ...p, inp: e.duration }));
          });
        })
      );
      observers[observers.length - 1]!.observe({
        type: 'event',
        buffered: true,
        durationThreshold: 16,
      } as PerformanceObserverInit);
    } catch {
      /* ignore */
    }

    try {
      observers.push(
        new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            const e = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
            if (!e.hadRecentInput && typeof e.value === 'number') {
              clsValue += e.value;
              setMetrics((p) => ({ ...p, cls: clsValue }));
            }
          });
        })
      );
      observers[observers.length - 1]!.observe({ type: 'layout-shift', buffered: true });
    } catch {
      /* ignore */
    }

    try {
      observers.push(
        new PerformanceObserver((list) => {
          const entries = list.getEntries().filter((e) => e.name === 'first-contentful-paint');
          const last = entries[entries.length - 1];
          if (last) setMetrics((p) => ({ ...p, fcp: last.startTime }));
        })
      );
      observers[observers.length - 1]!.observe({ type: 'paint', buffered: true });
    } catch {
      /* ignore */
    }

    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (nav) {
      setMetrics((p) => ({ ...p, ttfb: nav.responseStart - nav.requestStart }));
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return metrics;
}

export function CoreWebVitalsOptimizer() {
  const devMetrics = useDevMetricsSnapshot();

  useEffect(() => {
    initWebVitalsReporting();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const { lcp, inp, cls } = devMetrics;
    if (lcp && lcp > 2500) console.warn('⚠️ LCP > 2.5s:', Math.round(lcp));
    if (inp && inp > 200) console.warn('⚠️ INP > 200ms:', Math.round(inp));
    if (cls !== null && cls > 0.1) console.warn('⚠️ CLS > 0.1:', cls.toFixed(3));
  }, [devMetrics]);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs rounded-lg bg-slate-800 p-4 text-xs text-white">
      <h3 className="mb-2 font-bold">Web Vitals (dev)</h3>
      <div className="space-y-1">
        <div>LCP: {devMetrics.lcp ? `${Math.round(devMetrics.lcp)}ms` : '…'}</div>
        <div>INP: {devMetrics.inp ? `${Math.round(devMetrics.inp)}ms` : '…'}</div>
        <div>CLS: {devMetrics.cls !== null ? devMetrics.cls.toFixed(3) : '…'}</div>
        <div>FCP: {devMetrics.fcp ? `${Math.round(devMetrics.fcp)}ms` : '…'}</div>
        <div>TTFB: {devMetrics.ttfb ? `${Math.round(devMetrics.ttfb)}ms` : '…'}</div>
      </div>
    </div>
  );
}

/** @deprecated Faz D — web-vitals kullanın */
export function optimizeImageProps(src: string, alt: string, priority = false) {
  return {
    src,
    alt,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    fetchPriority: priority ? ('high' as const) : ('auto' as const),
  };
}

/** @deprecated Sistem fontu kullanılıyor */
export function optimizeFontLoading() {
  /* no-op */
}

export function getCriticalCSS() {
  return `body{margin:0;font-family:system-ui,sans-serif}`;
}

export function generateResourceHints() {
  return [
    '<link rel="dns-prefetch" href="//www.googletagmanager.com">',
    '<link rel="dns-prefetch" href="//www.google-analytics.com">',
  ].join('\n');
}
