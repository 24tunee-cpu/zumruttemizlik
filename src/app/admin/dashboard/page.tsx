'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/store/toastStore';
import { trackError } from '@/lib/client-error-handler';
import {
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Loader2,
  RefreshCw,
  FileText,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Image as ImageIcon,
  Mail,
  Award,
  Quote,
  BarChart3,
  CheckCircle2,
  CircleAlert,
} from 'lucide-react';
import Link from 'next/link';
import VisitorAnalyticsPanel from '@/components/admin/VisitorAnalyticsPanel';

// ============================================
// TYPES (API /api/admin/dashboard ile uyumlu)
// ============================================

interface DashboardPayload {
  generatedAt: string;
  counts: {
    servicesTotal: number;
    servicesActive: number;
    servicesInactive: number;
    blogTotal: number;
    blogPublished: number;
    blogDrafts: number;
    blogViewsTotal: number;
    contactsTotal: number;
    contactsUnread: number;
    teamActive: number;
    faqActive: number;
    testimonialsActive: number;
    galleryActive: number;
    subscribersActive: number;
    certificatesActive: number;
    contactsThisWeek: number;
    contactsPrevWeek: number;
  };
  contactsWeekHint: string;
  chart: { labels: string[]; values: number[]; title: string };
  recentContacts: Array<{
    id: string;
    name: string;
    email: string;
    service?: string | null;
    read: boolean;
    createdAt: string;
  }>;
  recentBlog: Array<{
    id: string;
    title: string;
    slug: string;
    published: boolean;
    updatedAt: string;
  }>;
  activity: Array<{
    id: string;
    kind: 'contact' | 'blog';
    title: string;
    subtitle: string;
    at: string;
  }>;
  funnel?: {
    appointmentsPending: number;
    contactsPipelineNew: number;
    marketingEventsWeek: number;
    lastMapSync: {
      status: string;
      message: string | null;
      startedAt: string;
      provider: string;
    } | null;
  };
}

// ============================================
// HELPERS
// ============================================

function formatNumber(n: number): string {
  return new Intl.NumberFormat('tr-TR').format(n);
}

// ============================================
// UI PARTS
// ============================================

function StatsCard({
  title,
  value,
  hint,
  icon: Icon,
  trend,
  trendLabel,
  color,
  delay = 0,
}: {
  title: string;
  value: string | number;
  hint?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-800/80 dark:shadow-none sm:p-6"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[0.07] dark:opacity-[0.12]"
        style={{ background: 'currentColor' }}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {hint ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{hint}</p>
          ) : null}
          {trendLabel ? (
            <p
              className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                trend === 'up'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trend === 'down'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {trend === 'up' ? (
                <ArrowUpRight size={14} aria-hidden />
              ) : trend === 'down' ? (
                <ArrowDownRight size={14} aria-hidden />
              ) : null}
              {trendLabel}
            </p>
          ) : null}
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-inner ${color}`}
        >
          <Icon className="h-6 w-6 text-white" aria-hidden />
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonDashboard() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-48 rounded-lg bg-slate-200 dark:bg-slate-700" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-700 lg:col-span-2" />
        <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

const CONTENT_LINKS: Array<{
  href: string;
  label: string;
  icon: React.ElementType;
  key: keyof DashboardPayload['counts'];
}> = [
  { href: '/admin/ekip', label: 'Ekip', icon: Users, key: 'teamActive' },
  { href: '/admin/sss', label: 'SSS', icon: HelpCircle, key: 'faqActive' },
  { href: '/admin/referanslar', label: 'Referans', icon: Quote, key: 'testimonialsActive' },
  { href: '/admin/galeri', label: 'Galeri', icon: ImageIcon, key: 'galleryActive' },
  { href: '/admin/ebulten', label: 'Bülten', icon: Mail, key: 'subscribersActive' },
  { href: '/admin/sertifikalar', label: 'Sertifika', icon: Award, key: 'certificatesActive' },
];

// ============================================
// PAGE
// ============================================

export default function AdminDashboardPage() {
  useAuth();
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/dashboard', { cache: 'no-store' });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Oturum süresi dolmuş veya yetkiniz yok. Lütfen tekrar giriş yapın.');
        }
        throw new Error(`Sunucu yanıtı: ${res.status}`);
      }
      const json = (await res.json()) as DashboardPayload;
      setData(json);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Veri yüklenemedi';
      setError(msg);
      trackError(err instanceof Error ? err : new Error(msg), { context: 'admin-dashboard' });
      toast.error('Dashboard', msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !data) {
    return <SkeletonDashboard />;
  }

  if (error && !data) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800">
        <p className="text-center text-slate-600 dark:text-slate-300">{error}</p>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          <RefreshCw size={16} />
          Tekrar dene
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { counts, contactsWeekHint, funnel } = data;

  const contactTrend: 'up' | 'down' | 'neutral' =
    counts.contactsThisWeek > counts.contactsPrevWeek
      ? 'up'
      : counts.contactsThisWeek < counts.contactsPrevWeek
        ? 'down'
        : 'neutral';

  const priorityActions = [
    counts.contactsUnread > 0
      ? {
          key: 'unread',
          title: `${formatNumber(counts.contactsUnread)} okunmamış talep`,
          description: 'Müşteri talepleri sayfasında dönüş bekleyen kayıtlar var.',
          href: '/admin/talepler',
          tone: 'warn' as const,
        }
      : null,
    (funnel?.appointmentsPending ?? 0) > 0
      ? {
          key: 'appointments',
          title: `${formatNumber(funnel?.appointmentsPending ?? 0)} bekleyen randevu`,
          description: 'Randevu taleplerini onaylayın ve durumları güncelleyin.',
          href: '/admin/randevular',
          tone: 'warn' as const,
        }
      : null,
    counts.blogDrafts > 0
      ? {
          key: 'drafts',
          title: `${formatNumber(counts.blogDrafts)} taslak blog`,
          description: 'Taslak yazıları gözden geçirip yayın planına alın.',
          href: '/admin/blog',
          tone: 'normal' as const,
        }
      : null,
    (funnel?.lastMapSync?.status || '').toLowerCase() === 'error'
      ? {
          key: 'map-sync',
          title: 'Harita senkronunda hata',
          description: funnel?.lastMapSync?.message || 'Haritalar panelini kontrol edin.',
          href: '/admin/haritalar',
          tone: 'warn' as const,
        }
      : null,
  ].filter((x): x is { key: string; title: string; description: string; href: string; tone: 'warn' | 'normal' } => Boolean(x));

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-8">
      {/* Üst başlık */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Kontrol paneli
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Site içeriği, talepler ve ziyaretçi analitiği — canlı veritabanı özetiniz.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:text-sm">
            <Calendar size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
          <button
            type="button"
            onClick={() => load()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            Yenile
          </button>
        </div>
      </div>

      {/* Ana KPI */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Hizmetler"
          value={counts.servicesActive}
          hint={
            counts.servicesTotal === 0
              ? 'Veritabanında henüz hizmet yok'
              : counts.servicesTotal === counts.servicesActive
                ? `${formatNumber(counts.servicesTotal)} kayıt · tümü yayında`
                : `${formatNumber(counts.servicesActive)} yayında · ${formatNumber(counts.servicesInactive)} pasif · ${formatNumber(counts.servicesTotal)} toplam`
          }
          icon={Sparkles}
          trend={counts.servicesInactive > 0 ? 'neutral' : 'up'}
          trendLabel={
            counts.servicesTotal === 0
              ? 'Hizmet eklemek için Hızlı işlemler'
              : counts.servicesInactive > 0
                ? `${formatNumber(counts.servicesInactive)} pasif hizmet`
                : 'Tüm hizmetler aktif'
          }
          color="bg-gradient-to-br from-emerald-500 to-emerald-700"
          delay={0}
        />
        <StatsCard
          title="Blog"
          value={counts.blogPublished}
          hint={`${formatNumber(counts.blogDrafts)} taslak · ${formatNumber(counts.blogTotal)} yazı · ${formatNumber(counts.blogViewsTotal)} toplam görüntülenme`}
          icon={FileText}
          trend="neutral"
          trendLabel={
            counts.blogDrafts > 0
              ? `${formatNumber(counts.blogDrafts)} yayında değil`
              : 'Tüm yazılar yayında'
          }
          color="bg-gradient-to-br from-sky-500 to-blue-700"
          delay={0.05}
        />
        <StatsCard
          title="Son 7 gün · talep"
          value={counts.contactsThisWeek}
          hint={contactsWeekHint}
          icon={BarChart3}
          trend={contactTrend}
          trendLabel={
            counts.contactsPrevWeek === 0 && counts.contactsThisWeek === 0
              ? 'Önceki 7 gün: 0'
              : `Önceki 7 gün: ${formatNumber(counts.contactsPrevWeek)}`
          }
          color="bg-gradient-to-br from-violet-500 to-purple-700"
          delay={0.1}
        />
        <StatsCard
          title="Okunmamış mesaj"
          value={counts.contactsUnread}
          hint={`${formatNumber(counts.contactsTotal)} toplam iletişim talebi`}
          icon={MessageSquare}
          trend={counts.contactsUnread > 0 ? 'up' : 'neutral'}
          trendLabel={
            counts.contactsUnread > 0
              ? 'Talepler sayfasını kontrol edin'
              : 'Güncel'
          }
          color="bg-gradient-to-br from-amber-500 to-orange-600"
          delay={0.15}
        />
      </div>

      {funnel ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Dönüşüm ve operasyon
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-600">
              <p className="text-xs text-slate-500 dark:text-slate-400">Bekleyen randevu</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{funnel.appointmentsPending}</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-600">
              <p className="text-xs text-slate-500 dark:text-slate-400">Yeni talep (pipeline)</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{funnel.contactsPipelineNew}</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-600">
              <p className="text-xs text-slate-500 dark:text-slate-400">Pazarlama olayı (7 gün)</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{funnel.marketingEventsWeek}</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-600">
              <p className="text-xs text-slate-500 dark:text-slate-400">Son harita senkronu</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {funnel.lastMapSync ? funnel.lastMapSync.status : '—'}
              </p>
              {funnel.lastMapSync?.status?.toLowerCase() === 'error' ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{funnel.lastMapSync.message}</p>
              ) : null}
            </div>
          </div>
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Aksiyon merkezi
          </p>
          {priorityActions.length === 0 ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <CheckCircle2 size={13} />
              Kritik iş yok
            </span>
          ) : null}
        </div>
        {priorityActions.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Operasyon, içerik ve pazarlama tarafında bekleyen kritik uyarı bulunmuyor.
          </p>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {priorityActions.map((action) => (
              <Link
                key={action.key}
                href={action.href}
                className={`rounded-xl border px-3 py-3 transition ${
                  action.tone === 'warn'
                    ? 'border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-900/20 dark:hover:bg-amber-900/30'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:bg-slate-700/40'
                }`}
              >
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {action.tone === 'warn' ? <CircleAlert size={15} /> : <CheckCircle2 size={15} />}
                  {action.title}
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{action.description}</p>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* İçerik özeti şeridi */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/50 sm:p-5"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          İçerik envanteri
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {CONTENT_LINKS.map(({ href, label, icon: Icon, key }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/90 bg-white px-3 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:border-emerald-300 hover:shadow dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-emerald-600"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Icon size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate">{label}</span>
              </span>
              <span className="tabular-nums text-slate-500 dark:text-slate-400">
                {formatNumber(counts[key])}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      <VisitorAnalyticsPanel />

      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        Özet verisi:{' '}
        <time dateTime={data.generatedAt}>
          {new Date(data.generatedAt).toLocaleString('tr-TR')}
        </time>
      </p>
    </div>
  );
}
