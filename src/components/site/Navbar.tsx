/**
 * @fileoverview Navbar Component
 * @description Ana navigasyon bileşeni.
 * Scroll progress, mobile menu, keyboard navigation, ve accessibility desteği ile.
 *
 * @example
 * <Navbar />
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { SITE_CONTACT, toTelHref } from '@/config/site-contact';

// ============================================
// TYPES & CONSTANTS
// ============================================

/** Nav link tipi */
interface NavLink {
  href: string;
  label: string;
}

/** Ana satır linkleri (Rehber / SSS / Referanslar ayrı açılır menüde) */
const navLinks: NavLink[] = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/hizmetler', label: 'Hizmetlerimiz' },
  { href: '/bolgeler', label: 'Bölgeler' },
  { href: '/fiyat-hesaplama', label: 'Fiyat Hesapla' },
  { href: '/randevu', label: 'Keşif' },
  { href: '/blog', label: 'Blog' },
  { href: '/iletisim', label: 'İletişim' },
];

const resourcesNavLinks: NavLink[] = [
  { href: '/galeri', label: 'Galeri' },
  { href: '/ara', label: 'Ara' },
  { href: '/rehber', label: 'Rehber' },
  { href: '/sss', label: 'SSS' },
  { href: '/referanslar', label: 'Referanslar' },
  { href: '/harita-ve-yorumlar', label: 'Harita & Yorumlar' },
];

// ============================================
// COMPONENT
// ============================================

/**
 * Navbar Component
 * Responsive navigation with mobile menu, scroll progress, and keyboard support.
 */
function readDocumentScrollTop(): number {
  if (typeof window === 'undefined') return 0;
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

export function Navbar() {
  const { settings } = useSiteSettings();
  const phoneDisplay = settings.phone?.trim() || SITE_CONTACT.phoneDisplay;
  const telHref = toTelHref(settings.phone?.trim() || SITE_CONTACT.phoneE164);

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // ============================================
  // SCROLL → header arka planı (rAF: son konumu asla kaçırmaz)
  // ============================================
  const syncScrolledFromDocument = useCallback(() => {
    setScrolled(readDocumentScrollTop() > 50);
  }, []);

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        syncScrolledFromDocument();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    syncScrolledFromDocument();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [syncScrolledFromDocument]);

  // Route değişince scroll sıfırlanır; scroll event her zaman gelmez
  useEffect(() => {
    syncScrolledFromDocument();
    const id = window.requestAnimationFrame(() => {
      syncScrolledFromDocument();
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname, syncScrolledFromDocument]);

  useEffect(() => {
    setResourcesOpen(false);
    setMobileResourcesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!resourcesOpen) return;
    const onDoc = (e: MouseEvent) => {
      const el = resourcesDropdownRef.current;
      if (el && !el.contains(e.target as Node)) setResourcesOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [resourcesOpen]);

  // ============================================
  // MOBILE MENU HANDLERS
  // ============================================
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isOpen) {
          closeMenu();
          mobileButtonRef.current?.focus();
        }
        setResourcesOpen(false);
      }
    };

    if (isOpen || resourcesOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, resourcesOpen, closeMenu]);

  // ============================================
  // BODY SCROLL LOCK
  // ============================================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'border-b border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-xl'
          : 'bg-transparent'
          }`}
        role="navigation"
        aria-label="Ana navigasyon"
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-2 sm:h-20">
            {/* Logo (yazı tabanlı wordmark) */}
            <Link href="/" className="group flex shrink-0 flex-col justify-center leading-none">
              <span className="whitespace-nowrap text-base font-extrabold tracking-tight transition-transform group-hover:-translate-y-px sm:text-2xl">
                <span className={`transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                  Zümrüt Vadi
                </span>
                <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                  {' '}Temizlik
                </span>
              </span>
              <span
                className={`mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors sm:block ${
                  scrolled ? 'text-slate-400' : 'text-white/50'
                }`}
              >
                İstanbul Profesyonel Temizlik
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden min-w-0 items-center gap-4 xl:flex 2xl:gap-6">
              {navLinks.map((link) => {
                const active =
                  link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative whitespace-nowrap text-sm font-medium transition-colors hover:text-emerald-500 ${
                      active
                        ? scrolled
                          ? 'text-emerald-600'
                          : 'text-emerald-400'
                        : scrolled
                          ? 'text-slate-700'
                          : 'text-white/90'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-emerald-500 transition-all duration-300 ${
                        active ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
              <div className="relative" ref={resourcesDropdownRef}>
                <button
                  type="button"
                  onClick={() => setResourcesOpen((v) => !v)}
                  aria-expanded={resourcesOpen}
                  aria-haspopup="true"
                  aria-controls="nav-resources-menu"
                  className={`inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium transition-colors hover:text-emerald-500 ${scrolled ? 'text-slate-700' : 'text-white/90'}`}
                >
                  Bilgi merkezi
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
                {resourcesOpen && (
                  <div
                    id="nav-resources-menu"
                    role="menu"
                    className={`absolute right-0 top-full z-50 mt-2 min-w-[12rem] rounded-xl border py-1 shadow-xl ${scrolled
                      ? 'border-slate-200 bg-white text-slate-800'
                      : 'border-white/10 bg-slate-900/95 text-white backdrop-blur-md'
                      }`}
                  >
                    {resourcesNavLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        role="menuitem"
                        onClick={() => setResourcesOpen(false)}
                        className={`block px-4 py-2.5 text-sm transition-colors ${scrolled
                          ? 'hover:bg-emerald-50 hover:text-emerald-700'
                          : 'hover:bg-white/10 hover:text-emerald-300'
                          }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <div className="hidden shrink-0 items-center gap-2 xl:flex 2xl:gap-3">
              <a
                href={telHref}
                data-source="navbar-desktop"
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                  scrolled ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                }`}
                aria-label={`Telefon: ${phoneDisplay}`}
              >
                <Phone size={16} className="shrink-0 text-emerald-500" />
                {phoneDisplay}
              </a>
              <Link
                href="/iletisim"
                className="whitespace-nowrap rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:shadow-emerald-500/50"
              >
                Hemen Fiyat Al
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              ref={mobileButtonRef}
              onClick={toggleMenu}
              className={`rounded-lg p-2 xl:hidden ${scrolled ? 'text-slate-700' : 'text-white'}`}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            >
              {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div
            ref={mobileMenuRef}
            className="fixed inset-0 z-[70] xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobil menü"
            id="mobile-menu"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <div className="absolute right-0 top-0 flex h-[100dvh] max-h-screen w-[min(100vw,20rem)] flex-col bg-white shadow-xl">
              <div className="flex h-16 shrink-0 items-center justify-between border-b px-4 sm:h-20 sm:px-6">
                <span className="text-lg font-bold text-slate-900 sm:text-xl">Menü</span>
                <button
                  onClick={closeMenu}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Menüyü kapat"
                >
                  <X size={24} aria-hidden="true" />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 sm:px-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="block border-b border-slate-100 py-3.5 text-base font-medium text-slate-700 transition-colors hover:text-emerald-500 sm:py-4 sm:text-lg"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => setMobileResourcesOpen((v) => !v)}
                    className="flex w-full items-center justify-between py-3.5 text-left text-base font-medium text-slate-700 transition-colors hover:text-emerald-500 sm:py-4 sm:text-lg"
                    aria-expanded={mobileResourcesOpen}
                  >
                    Bilgi merkezi
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                  </button>
                  {mobileResourcesOpen && (
                    <div className="pb-2 pl-2">
                      {resourcesNavLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeMenu}
                          className="block rounded-lg py-2.5 pl-3 text-base text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 sm:text-lg"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <a
                  href={telHref}
                  data-source="navbar-mobile-menu"
                  onClick={closeMenu}
                  className="flex items-center gap-3 border-b border-slate-100 py-3.5 text-base font-medium text-slate-800 sm:py-4 sm:text-lg"
                >
                  <Phone size={20} className="shrink-0 text-emerald-600" aria-hidden />
                  {phoneDisplay}
                </a>
                <Link
                  href="/iletisim"
                  onClick={closeMenu}
                  className="mt-5 block rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 sm:py-3"
                >
                  Hemen Fiyat Al
                </Link>
              </div>
            </div>
          </div>
        )}
    </>
  );
}

export default Navbar;
