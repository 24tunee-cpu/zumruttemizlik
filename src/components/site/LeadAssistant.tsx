'use client';

/**
 * Native lead asistan — Logsby yok.
 * Mobil: tek FAB + bottom sheet. Masaüstü: sağ alt kart.
 * Faz 1–3: path/query, Ads chip, koltuk parça, başarı, Contact API, nudge,
 * Sarıyer alt semt, MobileCallBar köprüsü, admin kaynak filtresi. LLM yok.
 */

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Calculator,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  MessageCircle,
  Phone,
  Sparkles,
  X,
} from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { SITE_CONTACT, toTelHref } from '@/config/site-contact';
import { trackGoogleAdsQuoteConversion } from '@/lib/ga4-client';
import {
  LEAD_ASSISTANT_SOURCE_TAG,
  ZVT_OPEN_LEAD_ASSISTANT,
  type ZvtOpenLeadAssistantDetail,
} from '@/lib/lead-assistant';

type Screen = 'menu' | 'quote' | 'success';

const SERVICES = [
  { value: 'Ev temizliği', href: '/hizmetler/ev-temizligi', key: 'ev' },
  { value: 'Ofis temizliği', href: '/hizmetler/ofis-temizligi', key: 'ofis' },
  { value: 'İnşaat sonrası', href: '/hizmetler/insaat-sonrasi-temizlik', key: 'insaat' },
  { value: 'Koltuk yıkama', href: '/hizmetler/koltuk-yikama', key: 'koltuk' },
  { value: 'Halı temizliği', href: '/hizmetler/hali-temizligi', key: 'hali' },
  { value: 'Cam temizliği', href: '/hizmetler/cam-temizligi', key: 'cam' },
] as const;

type ServiceValue = (typeof SERVICES)[number]['value'];

const POPULAR_KEYS = ['koltuk', 'insaat', 'ev'] as const;

const SARIYER_SUBS = [
  'Sarıyer (merkez)',
  'Zekeriyaköy',
  'Maslak',
  'Tarabya',
  'Bahçeköy',
  'Uskumruköy',
  'İstinye',
  'Yeniköy',
] as const;

const REGIONS = [
  { id: 'sariyer', label: 'Sarıyer hattı', subs: SARIYER_SUBS },
  { id: 'besiktas', label: 'Beşiktaş', subs: [] as const },
  { id: 'sisli', label: 'Şişli', subs: [] as const },
  { id: 'kadikoy', label: 'Kadıköy', subs: [] as const },
  { id: 'diger', label: 'Diğer / İstanbul', subs: [] as const },
] as const;

type RegionId = (typeof REGIONS)[number]['id'];
type AreaValue =
  | (typeof SARIYER_SUBS)[number]
  | 'Beşiktaş'
  | 'Şişli'
  | 'Kadıköy'
  | 'Diğer / İstanbul'
  | 'Sarıyer';

function regionIdForArea(area: string): RegionId {
  if (
    area === 'Sarıyer' ||
    area === 'Sarıyer (merkez)' ||
    (SARIYER_SUBS as readonly string[]).includes(area)
  ) {
    return 'sariyer';
  }
  if (area === 'Beşiktaş') return 'besiktas';
  if (area === 'Şişli') return 'sisli';
  if (area === 'Kadıköy') return 'kadikoy';
  return 'diger';
}

function defaultAreaForRegion(regionId: RegionId): AreaValue {
  if (regionId === 'sariyer') return 'Sarıyer (merkez)';
  if (regionId === 'besiktas') return 'Beşiktaş';
  if (regionId === 'sisli') return 'Şişli';
  if (regionId === 'kadikoy') return 'Kadıköy';
  return 'Diğer / İstanbul';
}

function displayAreaLabel(area: string): string {
  return area === 'Sarıyer (merkez)' ? 'Sarıyer' : area;
}

const KOLTUK_TYPES = [
  'Tekli / berjer',
  'İkili kanepe',
  'Üçlü kanepe',
  '3+2+1 takım',
  'Köşe / L',
  'Çekyat',
  'Diğer / belirtilecek',
] as const;

const NUDGE_KEY = 'zvt_lead_assistant_nudge_v1';

const SERVICE_QUERY_MAP: Record<string, ServiceValue> = {
  ev: 'Ev temizliği',
  'ev-temizligi': 'Ev temizliği',
  home: 'Ev temizliği',
  ofis: 'Ofis temizliği',
  'ofis-temizligi': 'Ofis temizliği',
  office: 'Ofis temizliği',
  insaat: 'İnşaat sonrası',
  'insaat-sonrasi': 'İnşaat sonrası',
  'insaat-sonrasi-temizlik': 'İnşaat sonrası',
  tadilat: 'İnşaat sonrası',
  koltuk: 'Koltuk yıkama',
  'koltuk-yikama': 'Koltuk yıkama',
  sofa: 'Koltuk yıkama',
  hali: 'Halı temizliği',
  'hali-temizligi': 'Halı temizliği',
  'hali-yikama': 'Halı temizliği',
  cam: 'Cam temizliği',
  'cam-temizligi': 'Cam temizliği',
};

const AREA_QUERY_MAP: Record<string, AreaValue> = {
  sariyer: 'Sarıyer (merkez)',
  zekeriyakoy: 'Zekeriyaköy',
  'zekeriya-koy': 'Zekeriyaköy',
  maslak: 'Maslak',
  tarabya: 'Tarabya',
  bahcekoy: 'Bahçeköy',
  uskumrukoy: 'Uskumruköy',
  istinye: 'İstinye',
  yenikoy: 'Yeniköy',
  besiktas: 'Beşiktaş',
  sisli: 'Şişli',
  kadikoy: 'Kadıköy',
  istanbul: 'Diğer / İstanbul',
};

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '');
}

/** API isValidPhone ile uyumlu TR format (0XXXXXXXXXX). */
function formatTrPhoneForApi(digits: string): string {
  let d = digitsOnly(digits);
  if (d.startsWith('90') && d.length >= 12) d = d.slice(2);
  if (d.length === 10) return `0${d}`;
  if (d.length === 11 && d.startsWith('0')) return d;
  return d;
}

function normalizeKey(raw: string | null | undefined): string {
  if (!raw) return '';
  return raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function resolveServiceFromQuery(raw: string | null): ServiceValue | null {
  const key = normalizeKey(raw);
  if (!key) return null;
  return SERVICE_QUERY_MAP[key] ?? null;
}

function resolveServiceFromPath(pathname: string): ServiceValue | null {
  const path = pathname.toLowerCase();
  for (const s of SERVICES) {
    if (path.includes(s.href) || path.includes(`/hizmetler/${s.key}`)) {
      return s.value;
    }
  }
  if (path.includes('koltuk')) return 'Koltuk yıkama';
  if (path.includes('insaat') || path.includes('tadilat')) return 'İnşaat sonrası';
  if (path.includes('ofis')) return 'Ofis temizliği';
  if (path.includes('hali')) return 'Halı temizliği';
  if (path.includes('cam')) return 'Cam temizliği';
  if (path.includes('ev-temizligi') || path.includes('/ev')) return 'Ev temizliği';
  return null;
}

function resolveAreaFromQuery(raw: string | null): AreaValue | null {
  const key = normalizeKey(raw);
  if (!key) return null;
  return AREA_QUERY_MAP[key] ?? null;
}

function resolveAreaFromPath(pathname: string): AreaValue | null {
  const path = normalizeKey(pathname);
  const entries: Array<[string, AreaValue]> = [
    ['zekeriyakoy', 'Zekeriyaköy'],
    ['uskumrukoy', 'Uskumruköy'],
    ['bahcekoy', 'Bahçeköy'],
    ['tarabya', 'Tarabya'],
    ['maslak', 'Maslak'],
    ['istinye', 'İstinye'],
    ['yenikoy', 'Yeniköy'],
    ['sariyer', 'Sarıyer (merkez)'],
    ['besiktas', 'Beşiktaş'],
    ['sisli', 'Şişli'],
    ['kadikoy', 'Kadıköy'],
  ];
  for (const [needle, label] of entries) {
    if (path.includes(needle)) return label;
  }
  return null;
}

function isKoltukService(service: string): boolean {
  return service === 'Koltuk yıkama';
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 5.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.988c-.001 5.449-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function trackLead(source: string, extra?: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const payload = { source, location: window.location.pathname, ...extra };
  window.dataLayer?.push({ event: 'lead_assistant', ...payload });
  // Funnel: open/quote_start soft; submit/call/wa = generate_lead
  const hardLead =
    source.includes('quote-wa') ||
    source.includes('whatsapp') ||
    source.includes('call') ||
    source.includes('quote-submit');
  if (hardLead) {
    window.gtag?.('event', 'generate_lead', { ...payload, lead_type: 'lead_assistant' });
  } else {
    window.gtag?.('event', 'lead_assistant_ui', payload);
  }
}

export function LeadAssistant() {
  const pathname = usePathname() || '/';
  const { settings } = useSiteSettings();
  const reduceMotion = useReducedMotion();
  const panelId = useId();
  const titleId = `${panelId}-title`;
  const closeRef = useRef<HTMLButtonElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const userTouchedService = useRef(false);
  const userTouchedArea = useRef(false);

  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>('menu');
  const [service, setService] = useState<string>(SERVICES[0].value);
  const [regionId, setRegionId] = useState<RegionId>('sariyer');
  const [area, setArea] = useState<string>('Sarıyer (merkez)');
  const [sqm, setSqm] = useState('');
  const [koltukType, setKoltukType] = useState<string>(KOLTUK_TYPES[3]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  const activeRegion = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];
  const hasSubs = activeRegion.subs.length > 0;

  const waDigits = useMemo(() => {
    const raw = settings.whatsapp?.trim() || SITE_CONTACT.whatsappDigits;
    return digitsOnly(raw) || SITE_CONTACT.whatsappDigits;
  }, [settings.whatsapp]);

  const phoneDisplay = settings.phone?.trim() || SITE_CONTACT.phoneDisplay;
  const callHref = toTelHref(settings.phone?.trim() || SITE_CONTACT.phoneE164);
  const brand = settings.siteName?.trim() || SITE_CONTACT.companyName;

  const syncContextFromUrl = useCallback(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const nextService =
      resolveServiceFromQuery(params.get('service')) || resolveServiceFromPath(pathname);
    const nextArea =
      resolveAreaFromQuery(params.get('area')) || resolveAreaFromPath(pathname);

    if (nextService && !userTouchedService.current) {
      setService(nextService);
    }
    if (nextArea && !userTouchedArea.current) {
      setArea(nextArea);
      setRegionId(regionIdForArea(nextArea));
    }
  }, [pathname]);

  useEffect(() => {
    syncContextFromUrl();
  }, [syncContextFromUrl]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (sessionStorage.getItem(NUDGE_KEY) === '1') return;
    } catch {
      return;
    }
    const t = window.setTimeout(() => {
      if (!open) setShowNudge(true);
    }, 10000);
    return () => window.clearTimeout(t);
  }, [open]);

  const dismissNudge = useCallback(() => {
    setShowNudge(false);
    try {
      sessionStorage.setItem(NUDGE_KEY, '1');
    } catch {
      // ignore
    }
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setScreen('menu');
    setFormError(null);
    setSubmitting(false);
    dismissNudge();
    requestAnimationFrame(() => fabRef.current?.focus({ preventScroll: true }));
  }, [dismissNudge]);

  const openPanel = useCallback(
    (nextScreen: Screen = 'menu') => {
      syncContextFromUrl();
      setOpen(true);
      setScreen(nextScreen);
      setFormError(null);
      dismissNudge();
      trackLead(nextScreen === 'quote' ? 'lead-assistant-quote' : 'lead-assistant-open');
    },
    [dismissNudge, syncContextFromUrl]
  );

  useEffect(() => {
    const onOpen = (ev: Event) => {
      const detail = (ev as CustomEvent<ZvtOpenLeadAssistantDetail>).detail;
      const next = detail?.screen === 'quote' ? 'quote' : 'menu';
      openPanel(next);
    };
    window.addEventListener(ZVT_OPEN_LEAD_ASSISTANT, onOpen);
    return () => window.removeEventListener(ZVT_OPEN_LEAD_ASSISTANT, onOpen);
  }, [openPanel]);

  const toggle = useCallback(() => {
    if (open) close();
    else openPanel('menu');
  }, [open, close, openPanel]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
  }, [open, screen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      if (screen === 'quote') {
        setScreen('menu');
        setFormError(null);
      } else if (screen === 'success') {
        close();
      } else {
        close();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, screen, close]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('lead-assistant-open');
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.classList.remove('lead-assistant-open');
    };
  }, [open]);

  const detailLine = useMemo(() => {
    if (isKoltukService(service)) {
      return koltukType ? `Koltuk tipi: ${koltukType}` : '';
    }
    return sqm.trim() ? `Alan: ${sqm.trim()} m²` : '';
  }, [service, koltukType, sqm]);

  const buildWaMessage = useCallback(() => {
    const lines = [
      `Merhaba, ${brand} asistanından yazıyorum.`,
      LEAD_ASSISTANT_SOURCE_TAG,
      `Hizmet: ${service}`,
      `Bölge: ${displayAreaLabel(area)}`,
    ];
    if (detailLine) lines.push(detailLine);
    if (name.trim()) lines.push(`Ad: ${name.trim()}`);
    if (phone.trim()) lines.push(`Tel: ${phone.trim()}`);
    lines.push(`Sayfa: ${pathname}`);
    lines.push('Ücretsiz keşif / fiyat teklifi istiyorum. (Online tahmin ≠ kesin fiyat.)');
    return lines.join('\n');
  }, [brand, service, area, detailLine, name, phone, pathname]);

  const waHref = useMemo(() => {
    return `https://wa.me/${waDigits}?text=${encodeURIComponent(buildWaMessage())}`;
  }, [waDigits, buildWaMessage]);

  const quickWaHref = useMemo(() => {
    const text = `Merhaba, ${brand} asistanından yazıyorum. Temizlik için bilgi / teklif istiyorum.`;
    return `https://wa.me/${waDigits}?text=${encodeURIComponent(text)}`;
  }, [waDigits, brand]);

  const persistContact = useCallback(
    async (phoneDigits: string) => {
      const displayName = name.trim() || 'Asistan lead';
      const apiPhone = formatTrPhoneForApi(phoneDigits);
      const email = `asistan.${digitsOnly(apiPhone)}@zumrutvaditemizlik.com`;
      const message = buildWaMessage();
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: displayName,
            email,
            phone: apiPhone,
            service,
            message,
            website: '',
            honeypot: '',
          }),
        });
        if (!res.ok) {
          // 429 vb. — WA akışı bozulmasın
          return;
        }
      } catch {
        // WA yine açılsın — kayıt opsiyonel
      }
    },
    [name, service, buildWaMessage]
  );

  const onQuoteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const p = digitsOnly(phone);
    if (p.length < 10) {
      setFormError('Geçerli bir telefon numarası girin.');
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      trackLead('lead-assistant-quote-wa', { service, area });
      trackGoogleAdsQuoteConversion({
        form_id: 'lead_assistant_quote',
        service,
        area,
      });
      const href = `https://wa.me/${waDigits}?text=${encodeURIComponent(buildWaMessage())}`;
      await persistContact(p);
      window.open(href, '_blank', 'noopener,noreferrer');
      setScreen('success');
    } finally {
      setSubmitting(false);
    }
  };

  const startQuoteForService = (value: ServiceValue) => {
    userTouchedService.current = true;
    setService(value);
    setFormError(null);
    openPanel('quote');
  };

  const headerTitle =
    screen === 'quote'
      ? 'Hızlı teklif'
      : screen === 'success'
        ? 'Talep alındı'
        : `${brand} Asistan`;

  const headerSub =
    screen === 'quote'
      ? 'Tahmini yol · kesin fiyat keşifle'
      : screen === 'success'
        ? 'WhatsApp açıldı · keşif ile netleşir'
        : 'Teklif · keşif · hesaplama';

  const menuActions = [
    {
      key: 'quote',
      title: 'Hızlı teklif',
      desc: 'Kısa bilgi → WhatsApp özeti',
      icon: MessageCircle,
      onClick: () => openPanel('quote'),
    },
    {
      key: 'kesif',
      title: 'Ücretsiz keşif',
      desc: 'Randevu formu',
      icon: Calendar,
      href: '/randevu',
      source: 'lead-assistant-randevu',
    },
    {
      key: 'fiyat',
      title: 'Fiyat hesapla',
      desc: 'Online tahmin aracı',
      icon: Calculator,
      href: '/fiyat-hesaplama',
      source: 'lead-assistant-fiyat',
    },
  ] as const;

  const popularServices = SERVICES.filter((s) =>
    (POPULAR_KEYS as readonly string[]).includes(s.key)
  );

  const fieldClass =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white';

  return (
    <div className="pointer-events-none fixed inset-0 z-[96]">
      <AnimatePresence>
        {open && (
          <motion.button
            key="backdrop"
            type="button"
            aria-label="Asistanı kapat"
            className="pointer-events-auto absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] lg:bg-slate-950/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end p-3 sm:p-5 lg:bottom-0"
        style={{
          paddingBottom: open
            ? 'max(0.75rem, env(safe-area-inset-bottom, 0px))'
            : 'max(0.5rem, env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div
          className={`pointer-events-none flex w-full flex-col items-stretch gap-3 sm:max-w-[22rem] sm:items-end ${
            open ? '' : 'mb-[4.75rem] lg:mb-0'
          }`}
        >
          <AnimatePresence mode="sync">
            {open && (
              <motion.div
                key="panel"
                id={panelId}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="pointer-events-auto flex max-h-[min(88dvh,36rem)] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:rounded-2xl"
              >
                <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-3 py-2.5 dark:border-slate-700 sm:px-4">
                  {screen === 'quote' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setScreen('menu');
                        setFormError(null);
                      }}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-300 dark:hover:bg-slate-800"
                      aria-label="Menüye dön"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden />
                    </button>
                  ) : screen === 'success' ? (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" aria-hidden />
                    </span>
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                      <Sparkles className="h-5 w-5" aria-hidden />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <h2
                      id={titleId}
                      className="truncate text-sm font-semibold text-slate-900 dark:text-white sm:text-base"
                    >
                      {headerTitle}
                    </h2>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {headerSub}
                    </p>
                  </div>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:hover:bg-slate-800"
                    aria-label="Kapat"
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4 sm:py-4">
                  {screen === 'menu' && (
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        İhtiyacınızı seçin. Peyzaj yok — yüzey ve yaşam alanı temizliği.
                      </p>

                      <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                          Popüler (Ads)
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {popularServices.map((s) => (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() => startQuoteForService(s.value)}
                              className={`rounded-full border px-3 py-1.5 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                                service === s.value
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-500/50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {s.value}
                            </button>
                          ))}
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {menuActions.map((action) => {
                          const Icon = action.icon;
                          const className =
                            'flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 text-left transition-colors hover:border-emerald-500/40 hover:bg-emerald-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-emerald-500/30 dark:hover:bg-slate-800';
                          const inner = (
                            <>
                              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                                <Icon className="h-4 w-4" aria-hidden />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                                  {action.title}
                                </span>
                                <span className="block text-xs text-slate-500 dark:text-slate-400">
                                  {action.desc}
                                </span>
                              </span>
                            </>
                          );
                          if ('href' in action && action.href) {
                            return (
                              <li key={action.key}>
                                <Link
                                  href={action.href}
                                  data-source={action.source}
                                  onClick={close}
                                  className={className}
                                >
                                  {inner}
                                </Link>
                              </li>
                            );
                          }
                          return (
                            <li key={action.key}>
                              <button type="button" onClick={action.onClick} className={className}>
                                {inner}
                              </button>
                            </li>
                          );
                        })}
                      </ul>

                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={quickWaHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-source="lead-assistant-whatsapp"
                          onClick={() => trackLead('lead-assistant-whatsapp')}
                          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-semibold text-[#053e2f] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                          <WhatsAppGlyph className="h-4 w-4" />
                          WhatsApp
                        </a>
                        <a
                          href={callHref}
                          data-source="lead-assistant-call"
                          onClick={() => trackLead('lead-assistant-call')}
                          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-amber-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                          aria-label={`Ara: ${phoneDisplay}`}
                        >
                          <Phone className="h-4 w-4" aria-hidden />
                          Ara
                        </a>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                          Tüm hizmetler
                        </p>
                        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {SERVICES.map((s) => (
                            <Link
                              key={s.value}
                              href={s.href}
                              data-source="lead-assistant-service"
                              onClick={close}
                              className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-emerald-500/50 hover:text-emerald-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                            >
                              {s.value}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {screen === 'quote' && (
                    <form onSubmit={onQuoteSubmit} className="space-y-3">
                      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        Bilgiler WhatsApp özetine eklenir ve admin talebe düşer. Kesin fiyat ücretsiz
                        keşif sonrası yazılır.
                      </p>

                      <label className="block space-y-1">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Hizmet
                        </span>
                        <select
                          value={service}
                          onChange={(e) => {
                            userTouchedService.current = true;
                            setService(e.target.value);
                          }}
                          className={fieldClass}
                        >
                          {SERVICES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.value}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block space-y-1">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Bölge
                        </span>
                        <select
                          value={regionId}
                          onChange={(e) => {
                            userTouchedArea.current = true;
                            const next = e.target.value as RegionId;
                            setRegionId(next);
                            setArea(defaultAreaForRegion(next));
                          }}
                          className={fieldClass}
                        >
                          {REGIONS.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      {hasSubs ? (
                        <label className="block space-y-1">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            Semt (Sarıyer hattı)
                          </span>
                          <select
                            value={area}
                            onChange={(e) => {
                              userTouchedArea.current = true;
                              setArea(e.target.value);
                            }}
                            className={fieldClass}
                          >
                            {activeRegion.subs.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : null}

                      {isKoltukService(service) ? (
                        <label className="block space-y-1">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            Koltuk tipi
                          </span>
                          <select
                            value={koltukType}
                            onChange={(e) => setKoltukType(e.target.value)}
                            className={fieldClass}
                          >
                            {KOLTUK_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : (
                        <label className="block space-y-1">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            Alan (m²) — isteğe bağlı
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={sqm}
                            onChange={(e) => setSqm(e.target.value)}
                            placeholder="örn. 120"
                            className={fieldClass}
                          />
                        </label>
                      )}

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="block space-y-1">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            Ad
                          </span>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            className={fieldClass}
                          />
                        </label>
                        <label className="block space-y-1">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            Telefon *
                          </span>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            autoComplete="tel"
                            placeholder="05xx xxx xx xx"
                            className={fieldClass}
                          />
                        </label>
                      </div>

                      {formError ? (
                        <p
                          className="text-xs font-medium text-red-600 dark:text-red-400"
                          role="alert"
                        >
                          {formError}
                        </p>
                      ) : null}

                      <button
                        type="submit"
                        disabled={submitting}
                        data-source="lead-assistant-quote-submit"
                        className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-[#053e2f] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-60"
                      >
                        <WhatsAppGlyph className="h-5 w-5" />
                        {submitting ? 'Gönderiliyor…' : 'WhatsApp ile gönder'}
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/fiyat-hesaplama"
                          data-source="lead-assistant-quote-fiyat"
                          onClick={close}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          Fiyat hesapla
                        </Link>
                        <Link
                          href="/randevu"
                          data-source="lead-assistant-quote-randevu"
                          onClick={close}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Keşif randevusu
                        </Link>
                      </div>
                    </form>
                  )}

                  {screen === 'success' && (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-3 dark:border-emerald-800 dark:bg-emerald-950/40">
                        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                          WhatsApp özeti hazırlandı
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-emerald-800/90 dark:text-emerald-300/90">
                          {service} · {displayAreaLabel(area)}
                          {detailLine ? ` · ${detailLine}` : ''}. Kesin fiyat keşif sonrası yazılır —
                          peyzaj yok.
                        </p>
                      </div>

                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-[#053e2f]"
                        onClick={() => trackLead('lead-assistant-whatsapp-retry')}
                      >
                        <WhatsAppGlyph className="h-5 w-5" />
                        WhatsApp’ı tekrar aç
                      </a>

                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={callHref}
                          onClick={() => trackLead('lead-assistant-call')}
                          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-amber-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-amber-500"
                        >
                          <Phone className="h-4 w-4" aria-hidden />
                          Ara
                        </a>
                        <Link
                          href="/randevu"
                          onClick={close}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          Keşif
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={close}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Kapat
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!open && (
            <div className="pointer-events-auto relative ml-auto flex flex-col items-end gap-2">
              <AnimatePresence>
                {showNudge && (
                  <motion.button
                    key="nudge"
                    type="button"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    onClick={() => openPanel('quote')}
                    className="max-w-[14rem] rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-800 shadow-lg dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                  >
                    Teklif veya keşif mi? Asistana dokunun.
                    <span className="mt-1 block text-[10px] font-normal text-slate-500">
                      Sarıyer · koltuk · inşaat
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
              <motion.button
                ref={fabRef}
                type="button"
                onClick={toggle}
                aria-expanded={open}
                aria-controls={panelId}
                aria-haspopup="dialog"
                className="relative flex h-14 items-center gap-2 rounded-full bg-emerald-700 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 dark:bg-emerald-600 sm:h-[3.25rem]"
                whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Sparkles className="h-5 w-5 shrink-0" aria-hidden />
                <span className="pr-0.5">Asistan</span>
                <span className="sr-only">Teklif ve iletişim asistanını aç</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeadAssistant;
