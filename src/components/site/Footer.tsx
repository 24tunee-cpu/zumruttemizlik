/**
 * @fileoverview Footer Component
 * @description Site footer bileşeni.
 * Newsletter form, navigation links, contact info, ve social links ile.
 *
 * @example
 * <Footer />
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Send,
  ArrowUp,
  Loader2,
} from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { SITE_CONTACT, toTelHref } from '@/config/site-contact';
import { PRIORITY_BLOG_LINKS } from '@/lib/priority-seo-links';

// ============================================
// TYPES
// ============================================

/** Footer link tipi */
interface FooterLink {
  label: string;
  href: string;
}

const SOCIAL_DEFAULTS = {
  facebook: 'https://facebook.com/zumrutvaditemizlik',
  instagram: 'https://instagram.com/zumrutvaditemizlik',
  twitter: '',
  linkedin: '',
  youtube: '',
} as const;

function pickSocialUrl(value: string | undefined, fallback: string): string | null {
  const v = value?.trim();
  if (v) return v;
  return fallback.trim() || null;
}

/** Footer link grubu tipi */
interface FooterLinkGroup {
  hizmetler: FooterLink[];
  cozumler: FooterLink[];
  bolgeler: FooterLink[];
  kurumsal: FooterLink[];
}

/** Social link tipi */
interface SocialLink {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  label: string;
  color: string;
}

function IconInstagram({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconFacebook({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function IconLinkedin({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconYoutube({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// ============================================
// CONSTANTS
// ============================================

/** Footer navigasyon linkleri */
const FOOTER_LINKS: FooterLinkGroup = {
  hizmetler: [
    { label: 'Ev Temizliği', href: '/hizmetler/ev-temizligi' },
    { label: 'İnşaat Sonrası Temizlik', href: '/hizmetler/insaat-sonrasi-temizlik' },
    { label: 'Ofis Temizliği', href: '/hizmetler/ofis-temizligi' },
    { label: 'Koltuk Yıkama', href: '/hizmetler/koltuk-yikama' },
    { label: 'Halı Temizliği', href: '/hizmetler/hali-temizligi' },
    { label: 'Cam Temizliği', href: '/hizmetler/cam-temizligi' },
    { label: 'Dış Cephe Temizliği', href: '/hizmetler/dis-cephe-temizligi' },
  ],
  cozumler: [
    { label: 'İnşaat Sonrası Temizlik', href: '/cozumler/insaat-sonrasi-temizlik' },
    { label: 'Taşınma Temizliği', href: '/cozumler/tasinma-temizligi' },
    { label: 'Kira Teslim Temizliği', href: '/cozumler/kira-teslim-temizligi' },
    { label: 'Boş Ev Temizliği', href: '/cozumler/bos-ev-temizligi' },
    { label: 'Ofis Temizliği', href: '/cozumler/ofis-temizligi' },
    { label: 'Tüm Çözümler', href: '/cozumler' },
  ],
  bolgeler: [
    { label: 'Sarıyer Temizlik', href: '/bolgeler/sariyer' },
    { label: 'Zekeriyaköy', href: '/bolgeler/sariyer/zekeriyakoy' },
    { label: 'Maslak', href: '/bolgeler/sariyer/maslak' },
    { label: 'Tarabya', href: '/bolgeler/sariyer/tarabya' },
    { label: 'Bahçeköy', href: '/bolgeler/sariyer/bahcekoy' },
    { label: 'Tüm Bölgeler', href: '/bolgeler' },
  ],
  kurumsal: [
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'Temizlik Fiyatları', href: '/fiyatlar' },
    { label: 'Fiyat Hesaplama', href: '/fiyat-hesaplama' },
    { label: 'Randevu', href: '/randevu' },
    { label: 'Referanslar', href: '/referanslar' },
    { label: 'Blog', href: '/blog' },
    { label: 'İletişim', href: '/iletisim' },
  ],
};

// ============================================
// COMPONENT
// ============================================

/**
 * Footer Component
 * Site footer with newsletter, links, and contact info.
 */
export function Footer() {
  const { settings } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [doneMessage, setDoneMessage] = useState<string | null>(null);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const socialLinks = useMemo((): SocialLink[] => {
    const links: SocialLink[] = [];
    const ig = pickSocialUrl(settings.instagram, SOCIAL_DEFAULTS.instagram);
    const fb = pickSocialUrl(settings.facebook, SOCIAL_DEFAULTS.facebook);
    const li = pickSocialUrl(settings.linkedin, SOCIAL_DEFAULTS.linkedin);
    const yt = pickSocialUrl(settings.youtube, SOCIAL_DEFAULTS.youtube);
    if (ig)
      links.push({ icon: IconInstagram, href: ig, label: 'Instagram', color: 'hover:bg-pink-500' });
    if (fb)
      links.push({ icon: IconFacebook, href: fb, label: 'Facebook', color: 'hover:bg-blue-600' });
    if (li)
      links.push({ icon: IconLinkedin, href: li, label: 'LinkedIn', color: 'hover:bg-blue-700' });
    if (yt)
      links.push({ icon: IconYoutube, href: yt, label: 'YouTube', color: 'hover:bg-red-600' });
    return links;
  }, [settings.instagram, settings.facebook, settings.linkedin, settings.youtube]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleSubscribe = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || submitting) return;

    setSubscribeError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        success?: boolean;
        message?: string;
      };

      if (!res.ok) {
        setSubscribeError(
          typeof data.error === 'string' ? data.error : 'İşlem başarısız. Lütfen tekrar deneyin.'
        );
        return;
      }

      setDoneMessage(
        typeof data.message === 'string' && data.message.length > 0
          ? data.message
          : 'Teşekkürler! Bültenimize başarıyla kaydoldunuz.'
      );
      setEmail('');
    } catch {
      setSubscribeError('Bağlantı hatası. İnternetinizi kontrol edip tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  }, [email, submitting]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-950" aria-hidden="true" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <motion.div
          className="mb-16 pb-16 border-b border-slate-800"
          initial={{ opacity: 0, y: shouldReduceMotion ? 10 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.6 }}
        >
          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 sm:p-8 backdrop-blur-sm">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  E-Bülten
                </span>
                <h3 className="mt-3 text-2xl font-bold mb-2">E-Bültenimize Katılın</h3>
                <p className="text-slate-300">
                  2026 fiyat rehberleri, temizlik ipuçları ve Sarıyer–Zekeriyaköy kampanyalarından haberdar olun.
                </p>
              </div>
              <div>
              {doneMessage ? (
                <motion.div
                  className="flex items-center gap-3 text-emerald-400"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0.2 : 0.4 }}
                  role="status"
                  aria-live="polite"
                >
                  <Sparkles className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{doneMessage}</span>
                </motion.div>
              ) : (
                <form
                  onSubmit={(e) => void handleSubscribe(e)}
                  className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-stretch"
                  aria-label="E-bülten aboneliği"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="E-posta adresiniz"
                      required
                      disabled={submitting}
                      autoComplete="email"
                      className="min-h-11 min-w-0 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-base text-white placeholder:text-slate-300 transition-colors focus:border-emerald-500 focus:outline-none disabled:opacity-60"
                      aria-label="E-posta adresi"
                      aria-required="true"
                      aria-invalid={!!subscribeError}
                      aria-describedby={subscribeError ? 'footer-newsletter-error' : undefined}
                    />
                    {subscribeError ? (
                      <p id="footer-newsletter-error" className="text-sm text-red-400" role="alert">
                        {subscribeError}
                      </p>
                    ) : null}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={shouldReduceMotion || submitting ? {} : { scale: 1.02 }}
                    whileTap={shouldReduceMotion || submitting ? {} : { scale: 0.98 }}
                    className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    aria-label={submitting ? 'Kaydediliyor…' : 'Abone ol'}
                  >
                    {submitting ? (
                      <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden />
                    ) : (
                      <Send size={18} aria-hidden="true" />
                    )}
                    {submitting ? 'Gönderiliyor…' : 'Abone Ol'}
                  </motion.button>
                </form>
              )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group" aria-label={`${settings.siteName} - Ana sayfa`}>
              {settings.logo ? (
                <motion.div
                  className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white/10"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Image
                    src={settings.logo}
                    alt={settings.siteName}
                    width={40}
                    height={40}
                    className="h-full w-full object-contain p-1"
                  />
                </motion.div>
              ) : (
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  aria-hidden="true"
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </motion.div>
              )}
              <span className="text-xl font-bold group-hover:text-emerald-400 transition-colors">{settings.siteName}</span>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed">
              {settings.siteDescription ||
                'Sarıyer, Zekeriyaköy ve İstanbul Avrupa Yakası\'nda profesyonel temizlik hizmetleri. Ücretsiz keşif, şeffaf fiyatlandırma ve deneyimli ekip.'}
            </p>
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.1, y: -2 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-all ${social.color} hover:text-white`}
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Hizmetler */}
          <nav aria-label="Footer hizmetler">
            <h3 className="mb-4 text-lg font-semibold text-white">Hizmetlerimiz</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.hizmetler.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 transition-all hover:text-emerald-400 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Çözümler */}
          <nav aria-label="Footer çözümler">
            <h3 className="mb-4 text-lg font-semibold text-white">Çözümler</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.cozumler.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 transition-all hover:text-emerald-400 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bölgeler */}
          <nav aria-label="Footer bölgeler">
            <h3 className="mb-4 text-lg font-semibold text-white">Bölgeler</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.bolgeler.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 transition-all hover:text-emerald-400 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kurumsal */}
          <nav aria-label="Footer kurumsal">
            <h3 className="mb-4 text-lg font-semibold text-white">Kurumsal</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.kurumsal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 transition-all hover:text-emerald-400 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* İletişim */}
          <address className="not-italic">
            <h3 className="mb-4 text-lg font-semibold text-white">İletişim</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span className="text-slate-300 whitespace-pre-line">
                  {settings.address?.trim() || SITE_CONTACT.addressLine}
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="h-5 w-5 shrink-0 text-emerald-500 group-hover:scale-110 transition-transform" aria-hidden="true" />
                <a
                  href={toTelHref(settings.phone)}
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                  aria-label={`Telefon: ${settings.phone}`}
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="h-5 w-5 shrink-0 text-emerald-500 group-hover:scale-110 transition-transform" aria-hidden="true" />
                <a
                  href={`mailto:${settings.email}`}
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                  aria-label={`E-posta: ${settings.email}`}
                >
                  {settings.email}
                </a>
              </li>
            </ul>
          </address>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5 sm:p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
            Öne Çıkan Bloglar
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            2026 fiyat rehberleri ve İstanbul temizlik ipuçları
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PRIORITY_BLOG_LINKS.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-300 underline decoration-slate-500/70 underline-offset-4 transition-colors hover:text-emerald-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-300">
            © {currentYear} {settings.siteName}. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/gizlilik" className="text-sm text-slate-300 hover:text-emerald-400 transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/kullanim-kosullari" className="text-sm text-slate-300 hover:text-emerald-400 transition-colors">
              Kullanım Koşulları
            </Link>
            <motion.button
              onClick={scrollToTop}
              whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              aria-label="Sayfanın başına dön"
            >
              <ArrowUp size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
