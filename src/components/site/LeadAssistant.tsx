'use client';

/**
 * Native lead asistan — Logsby yok.
 * Mobil: tek FAB + bottom sheet (kalabalık yok). Masaüstü: sağ alt kart.
 * FloatingWhatsApp yerine geçer; WA/Ara menüden.
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
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Calculator,
  Calendar,
  ChevronLeft,
  MessageCircle,
  Phone,
  Sparkles,
  X,
} from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { SITE_CONTACT, toTelHref } from '@/config/site-contact';

type Screen = 'menu' | 'quote';

const SERVICES = [
  { value: 'Ev temizliği', href: '/hizmetler/ev-temizligi' },
  { value: 'Ofis temizliği', href: '/hizmetler/ofis-temizligi' },
  { value: 'İnşaat sonrası', href: '/hizmetler/insaat-sonrasi-temizlik' },
  { value: 'Koltuk yıkama', href: '/hizmetler/koltuk-yikama' },
  { value: 'Halı temizliği', href: '/hizmetler/hali-temizligi' },
  { value: 'Cam temizliği', href: '/hizmetler/cam-temizligi' },
] as const;

const AREAS = [
  'Sarıyer',
  'Zekeriyaköy',
  'Maslak',
  'Tarabya',
  'Bahçeköy',
  'Beşiktaş',
  'Şişli',
  'Kadıköy',
  'Diğer / İstanbul',
] as const;

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '');
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
  window.gtag?.('event', 'generate_lead', { ...payload, lead_type: 'lead_assistant' });
}

export function LeadAssistant() {
  const { settings } = useSiteSettings();
  const reduceMotion = useReducedMotion();
  const panelId = useId();
  const titleId = `${panelId}-title`;
  const closeRef = useRef<HTMLButtonElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>('menu');
  const [service, setService] = useState<string>(SERVICES[0].value);
  const [area, setArea] = useState<string>(AREAS[0]);
  const [sqm, setSqm] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const waDigits = useMemo(() => {
    const raw = settings.whatsapp?.trim() || SITE_CONTACT.whatsappDigits;
    return digitsOnly(raw) || SITE_CONTACT.whatsappDigits;
  }, [settings.whatsapp]);

  const phoneDisplay = settings.phone?.trim() || SITE_CONTACT.phoneDisplay;
  const callHref = toTelHref(settings.phone?.trim() || SITE_CONTACT.phoneE164);
  const brand = settings.siteName?.trim() || SITE_CONTACT.companyName;

  const close = useCallback(() => {
    setOpen(false);
    setScreen('menu');
    setFormError(null);
    requestAnimationFrame(() => fabRef.current?.focus({ preventScroll: true }));
  }, []);

  const openPanel = useCallback(() => {
    setOpen(true);
    setScreen('menu');
    trackLead('lead-assistant-open');
  }, []);

  const toggle = useCallback(() => {
    if (open) close();
    else openPanel();
  }, [open, close, openPanel]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
  }, [open, screen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (screen === 'quote') {
          setScreen('menu');
          setFormError(null);
        } else {
          close();
        }
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

  const buildWaMessage = useCallback(() => {
    const lines = [
      `Merhaba, ${brand} asistanından yazıyorum.`,
      `Hizmet: ${service}`,
      `Bölge: ${area}`,
    ];
    if (sqm.trim()) lines.push(`Alan: ${sqm.trim()} m²`);
    if (name.trim()) lines.push(`Ad: ${name.trim()}`);
    if (phone.trim()) lines.push(`Tel: ${phone.trim()}`);
    lines.push('Ücretsiz keşif / fiyat teklifi istiyorum. (Online tahmin ≠ kesin fiyat.)');
    return lines.join('\n');
  }, [brand, service, area, sqm, name, phone]);

  const waHref = useMemo(() => {
    return `https://wa.me/${waDigits}?text=${encodeURIComponent(buildWaMessage())}`;
  }, [waDigits, buildWaMessage]);

  const quickWaHref = useMemo(() => {
    const text =
      'Merhaba, Zümrüt Vadi Temizlik asistanından yazıyorum. Temizlik için bilgi / teklif istiyorum.';
    return `https://wa.me/${waDigits}?text=${encodeURIComponent(text)}`;
  }, [waDigits]);

  const onQuoteSubmit = (e: FormEvent) => {
    e.preventDefault();
    const p = digitsOnly(phone);
    if (p.length < 10) {
      setFormError('Geçerli bir telefon numarası girin.');
      return;
    }
    setFormError(null);
    trackLead('lead-assistant-quote-wa', { service, area });
    window.open(waHref, '_blank', 'noopener,noreferrer');
  };

  const menuActions = [
    {
      key: 'quote',
      title: 'Hızlı teklif',
      desc: 'Kısa bilgi → WhatsApp özeti',
      icon: MessageCircle,
      onClick: () => {
        setScreen('quote');
        trackLead('lead-assistant-quote');
      },
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
        {/* Mobilde FAB, alt Ara/WA çubuğunun üstünde */}
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
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 28 }
                }
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
                      {screen === 'quote' ? 'Hızlı teklif' : `${brand} Asistan`}
                    </h2>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {screen === 'quote'
                        ? 'Tahmini yol · kesin fiyat keşifle'
                        : 'Teklif · keşif · hesaplama'}
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
                          Hizmet
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
                        Bilgiler WhatsApp özetine eklenir. Kesin fiyat ücretsiz keşif sonrası yazılır.
                      </p>

                      <label className="block space-y-1">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Hizmet
                        </span>
                        <select
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
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
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        >
                          {AREAS.map((a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ))}
                        </select>
                      </label>

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
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        />
                      </label>

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
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
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
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                          />
                        </label>
                      </div>

                      {formError ? (
                        <p className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                          {formError}
                        </p>
                      ) : null}

                      <button
                        type="submit"
                        data-source="lead-assistant-quote-submit"
                        className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-[#053e2f] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      >
                        <WhatsAppGlyph className="h-5 w-5" />
                        WhatsApp ile gönder
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!open && (
            <motion.button
              ref={fabRef}
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls={panelId}
              aria-haspopup="dialog"
              className="pointer-events-auto relative ml-auto flex h-14 items-center gap-2 rounded-full bg-emerald-700 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 dark:bg-emerald-600 sm:h-[3.25rem]"
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Sparkles className="h-5 w-5 shrink-0" aria-hidden />
              <span className="pr-0.5">Asistan</span>
              <span className="sr-only">Teklif ve iletişim asistanını aç</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeadAssistant;
