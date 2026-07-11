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

function scrollDepthPct(): number {
  const doc = document.documentElement;
  const maxScroll = doc.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return 100;
  return Math.min(100, Math.round((window.scrollY / maxScroll) * 100));
}

/**
 * Ziyaretçi oturumu, sayfa geçişi, tıklama ve süre takibi.
 * Konum/cihaz sunucuda Vercel header + UA ile çözülür.
 */
export default function VisitorAnalyticsTracker() {
  const pathname = usePathname();
  const sessionStarted = useRef(false);
  const startedAt = useRef(Date.now());
  const maxScroll = useRef(0);
  const scrollMilestones = useRef(new Set<number>());
  const lastPath = useRef<string | null>(null);
  const visitorKey = useRef('');
  const sessionKey = useRef('');

  useEffect(() => {
    if (!shouldTrack(pathname)) return;

    visitorKey.current = getOrCreateId(localStorage, VISITOR_KEY);
    sessionKey.current = getOrCreateId(sessionStorage, SESSION_KEY);

    const payload = () => ({
      sessionKey: sessionKey.current,
      visitorKey: visitorKey.current,
      path: pathname,
      language: navigator.language.slice(0, 16),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
      durationSec: Math.max(0, Math.round((Date.now() - startedAt.current) / 1000)),
      scrollPct: maxScroll.current,
    });

    if (!sessionStarted.current) {
      sessionStarted.current = true;
      startedAt.current = Date.now();
      postTrack({ ...payload(), kind: 'session_start' });
      lastPath.current = pathname;
      return;
    }

    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      maxScroll.current = 0;
      scrollMilestones.current = new Set();
      postTrack({ ...payload(), kind: 'page_view' });
    }
  }, [pathname]);

  useEffect(() => {
    if (!shouldTrack(pathname)) return;

    const payload = () => ({
      sessionKey: sessionKey.current,
      visitorKey: visitorKey.current,
      path: pathname,
      language: navigator.language.slice(0, 16),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
      durationSec: Math.max(0, Math.round((Date.now() - startedAt.current) / 1000)),
      scrollPct: maxScroll.current,
    });

    const onScroll = () => {
      const pct = scrollDepthPct();
      if (pct <= maxScroll.current) return;
      maxScroll.current = pct;
      for (const milestone of [25, 50, 75, 100]) {
        if (pct >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone);
          postTrack({ ...payload(), kind: 'scroll', scrollPct: milestone });
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
        ...payload(),
        kind: 'click',
        clickLabel: label || undefined,
        clickUrl: href,
        clickSource: source,
      });
    };

    const heartbeat = window.setInterval(() => {
      postTrack({ ...payload(), kind: 'heartbeat' });
    }, 30_000);

    const onLeave = () => {
      postTrack({ ...payload(), kind: 'session_end' });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onClick, { capture: true });
    window.addEventListener('pagehide', onLeave);
    window.addEventListener('beforeunload', onLeave);

    return () => {
      window.clearInterval(heartbeat);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick, { capture: true });
      window.removeEventListener('pagehide', onLeave);
      window.removeEventListener('beforeunload', onLeave);
    };
  }, [pathname]);

  return null;
}
