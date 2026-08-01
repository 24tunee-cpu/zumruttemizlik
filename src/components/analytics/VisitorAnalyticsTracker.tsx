'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const VISITOR_KEY = 'zv_visitor_id';
const SESSION_KEY = 'zv_session_id';

function shouldTrack(pathname: string): boolean {
  if (pathname.startsWith('/admin')) return false;
  if (pathname.startsWith('/api')) return false;
  return true;
}

function getOrCreateId(storage: Storage, key: string): string {
  let id = storage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    storage.setItem(key, id);
  }
  return id;
}

function postTrack(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/visitor/track', new Blob([body], { type: 'application/json' }));
    return;
  }
  void fetch('/api/visitor/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  });
}

function readUtmFromLocation(): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  landingUrl: string;
} {
  if (typeof window === 'undefined') {
    return { landingUrl: '' };
  }
  const url = new URL(window.location.href);
  const pick = (k: string) => url.searchParams.get(k)?.trim().slice(0, 120) || undefined;
  return {
    landingUrl: url.href.slice(0, 2000),
    utmSource: pick('utm_source'),
    utmMedium: pick('utm_medium'),
    utmCampaign: pick('utm_campaign'),
    utmTerm: pick('utm_term'),
    utmContent: pick('utm_content'),
  };
}

function scrollDepthPct(): number {
  const doc = document.documentElement;
  const maxScroll = doc.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return 100;
  return Math.min(100, Math.round((window.scrollY / maxScroll) * 100));
}

/**
 * Ziyaretçi oturumu, sayfa geçişi, etkileşim süresi, dönüşüm ve çıkış takibi.
 * Konum/cihaz sunucuda Vercel header + UA ile çözülür.
 */
export default function VisitorAnalyticsTracker() {
  const pathname = usePathname();
  const sessionStarted = useRef(false);
  const sessionStartedAt = useRef(Date.now());
  const pageEnteredAt = useRef(Date.now());
  const visibleSince = useRef<number | null>(Date.now());
  const pageEngagedMs = useRef(0);
  const sessionEngagedMs = useRef(0);
  const maxScroll = useRef(0);
  const scrollMilestones = useRef(new Set<number>());
  const lastPath = useRef<string | null>(null);
  const lastTitle = useRef<string | null>(null);
  const visitorKey = useRef('');
  const sessionKey = useRef('');
  const utmRef = useRef(readUtmFromLocation());
  const trackingEnabled = useRef(true);

  const flushPageEngaged = () => {
    if (visibleSince.current != null) {
      pageEngagedMs.current += Date.now() - visibleSince.current;
      visibleSince.current = null;
    }
  };

  const commitPageEngaged = () => {
    flushPageEngaged();
    sessionEngagedMs.current += pageEngagedMs.current;
    pageEngagedMs.current = 0;
    visibleSince.current = document.visibilityState === 'visible' ? Date.now() : null;
  };

  const engagedSec = () =>
    Math.max(
      0,
      Math.round((sessionEngagedMs.current + pageEngagedMs.current + (visibleSince.current ? Date.now() - visibleSince.current : 0)) / 1000)
    );

  const basePayload = (path: string) => ({
    sessionKey: sessionKey.current,
    visitorKey: visitorKey.current,
    path,
    pageTitle: (document.title || '').trim().slice(0, 200) || undefined,
    language: navigator.language.slice(0, 16),
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
    landingUrl: utmRef.current.landingUrl || undefined,
    utmSource: utmRef.current.utmSource,
    utmMedium: utmRef.current.utmMedium,
    utmCampaign: utmRef.current.utmCampaign,
    utmTerm: utmRef.current.utmTerm,
    utmContent: utmRef.current.utmContent,
    durationSec: Math.max(0, Math.round((Date.now() - sessionStartedAt.current) / 1000)),
    engagedSec: engagedSec(),
    scrollPct: maxScroll.current,
  });

  const sendPageExit = (path: string) => {
    if (!trackingEnabled.current) return;
    flushPageEngaged();
    const timeOnPageSec = Math.max(0, Math.round((Date.now() - pageEnteredAt.current) / 1000));
    postTrack({
      ...basePayload(path),
      kind: 'page_exit',
      timeOnPageSec,
    });
    commitPageEngaged();
  };

  useEffect(() => {
    if (!shouldTrack(pathname)) {
      trackingEnabled.current = false;
      return;
    }
    trackingEnabled.current = true;

    visitorKey.current = getOrCreateId(localStorage, VISITOR_KEY);
    sessionKey.current = getOrCreateId(sessionStorage, SESSION_KEY);

    if (!sessionStarted.current) {
      sessionStarted.current = true;
      sessionStartedAt.current = Date.now();
      pageEnteredAt.current = Date.now();
      visibleSince.current = document.visibilityState === 'visible' ? Date.now() : null;
      lastPath.current = pathname;
      lastTitle.current = document.title;
      postTrack({ ...basePayload(pathname), kind: 'session_start' });
      return;
    }

    if (lastPath.current && lastPath.current !== pathname) {
      sendPageExit(lastPath.current);
      maxScroll.current = 0;
      scrollMilestones.current = new Set();
      pageEnteredAt.current = Date.now();
      visibleSince.current = document.visibilityState === 'visible' ? Date.now() : null;
      lastPath.current = pathname;
      lastTitle.current = document.title;
      postTrack({ ...basePayload(pathname), kind: 'page_view' });
    }
  }, [pathname]);

  useEffect(() => {
    if (!shouldTrack(pathname)) return;

    const currentPath = () => lastPath.current || pathname;

    const onScroll = () => {
      const pct = scrollDepthPct();
      if (pct <= maxScroll.current) return;
      maxScroll.current = pct;
      for (const milestone of [25, 50, 75, 100]) {
        if (pct >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone);
          postTrack({ ...basePayload(currentPath()), kind: 'scroll', scrollPct: milestone });
        }
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      const el = target.closest('a, button, [role="button"]') as HTMLElement | null;
      if (!el) return;

      const anchor = el.closest('a') as HTMLAnchorElement | null;
      const label = (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 200);
      const href = anchor?.getAttribute('href') || undefined;
      const source = (anchor?.dataset.source || el.dataset.source || undefined)?.slice(0, 80);

      postTrack({
        ...basePayload(currentPath()),
        kind: 'click',
        clickLabel: label || undefined,
        clickUrl: href,
        clickSource: source,
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        flushPageEngaged();
      } else {
        visibleSince.current = Date.now();
      }
    };

    const heartbeat = window.setInterval(() => {
      postTrack({ ...basePayload(currentPath()), kind: 'heartbeat' });
    }, 30_000);

    const onLeave = () => {
      sendPageExit(currentPath());
      postTrack({ ...basePayload(currentPath()), kind: 'session_end' });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onClick, { capture: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onLeave);
    window.addEventListener('beforeunload', onLeave);

    return () => {
      window.clearInterval(heartbeat);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick, { capture: true });
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onLeave);
      window.removeEventListener('beforeunload', onLeave);
    };
  }, [pathname]);

  return null;
}
