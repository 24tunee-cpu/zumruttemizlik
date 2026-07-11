'use client';

import { useCallback, useEffect, useMemo, useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Clock,
  Globe,
  Laptop,
  Loader2,
  MapPin,
  MousePointerClick,
  RefreshCw,
  Smartphone,
  Tablet,
  Users,
  Eye,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface VisitorEventRow {
  id: string;
  kind: string;
  path: string | null;
  label: string | null;
  targetUrl: string | null;
  metadata: unknown;
  createdAt: string;
}

interface VisitorSessionRow {
  id: string;
  location: string;
  countryCode: string | null;
  city: string | null;
  region: string | null;
  deviceType: string | null;
  deviceLabel: string;
  os: string | null;
  browser: string | null;
  screen: string | null;
  language: string | null;
  referrer: string | null;
  landingPath: string | null;
  exitPath: string | null;
  pageViews: number;
  durationSec: number;
  durationLabel: string;
  maxScrollPct: number;
  clickCount: number;
  isActive: boolean;
  lastSeenAt: string;
  startedAt: string;
  endedAt: string | null;
  visitorKey: string;
  recentEvents?: VisitorEventRow[];
}

interface VisitorAnalyticsPayload {
  generatedAt: string;
  rangeDays: number;
  summary: {
    totalSessions: number;
    activeNow: number;
    totalPageViews: number;
    avgDurationSec: number;
    avgDurationLabel: string;
    mobilePct: number;
    desktopPct: number;
    tabletPct: number;
  };
  chart: { labels: string[]; values: number[]; title: string };
  topCities: Array<{ label: string; count: number }>;
  topPages: Array<{ path: string; count: number }>;
  deviceBreakdown: Array<{ type: string; label: string; count: number }>;
  sessions: VisitorSessionRow[];
}

// ============================================
// HELPERS
// ============================================

function formatNumber(n: number): string {
  return new Intl.NumberFormat('tr-TR').format(n);
}

function formatRelativeTr(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 0) return new Date(iso).toLocaleString('tr-TR');
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Az önce';
  if (diffMin < 60) return `${diffMin} dk önce`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} sa. önce`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 14) return `${diffD} gün önce`;
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function deviceIcon(type: string | null) {
  switch (type) {
    case 'mobile':
      return Smartphone;
    case 'tablet':
      return Tablet;
    case 'desktop':
      return Laptop;
    default:
      return Globe;
  }
}

function eventKindLabel(kind: string): string {
  switch (kind) {
    case 'page_view':
      return 'Sayfa görüntüleme';
    case 'click':
      return 'Tıklama';
    case 'scroll':
      return 'Kaydırma';
    case 'heartbeat':
      return 'Aktif';
    case 'session_end':
      return 'Oturum bitti';
    case 'session_start':
      return 'Oturum başladı';
    default:
      return kind;
  }
}

const CHART_MAX_PX = 112;

function SessionsChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values, 1);
  const safeValues = values.length ? values : [0];
  const safeLabels = labels.length === safeValues.length ? labels : safeValues.map(() => '');

  return (
    <div>
      <div className="flex h-[7.5rem] items-end gap-1.5 sm:gap-2">
        {safeValues.map((value, i) => {
          const barPx = Math.max(6, Math.round((value / max) * CHART_MAX_PX));
          return (
            <div key={i} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: barPx }}
                transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[2.75rem] rounded-t-md bg-gradient-to-t from-cyan-600 to-emerald-400 dark:from-cyan-700 dark:to-emerald-500"
                title={`${formatNumber(value)} oturum`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between gap-1 text-[10px] text-slate-400 dark:text-slate-500 sm:text-xs">
        {safeLabels.map((lab, i) => (
          <span key={i} className="min-w-0 flex-1 truncate text-center">
            {lab}
          </span>
        ))}
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-600/80 dark:bg-slate-900/40">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {hint ? <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}>
          <Icon size={18} className="text-white" aria-hidden />
        </div>
      </div>
    </div>
  );
}

function SessionDetailDrawer({
  sessionId,
  onClose,
}: {
  sessionId: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<VisitorSessionRow | null>(null);
  const [events, setEvents] = useState<VisitorEventRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/visitor-analytics?sessionId=${sessionId}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Detay yüklenemedi');
        const json = await res.json();
        if (!cancelled) {
          setSession(json.session);
          setEvents(json.events ?? []);
        }
      } catch {
        if (!cancelled) {
          setSession(null);
          setEvents([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const DeviceIcon = deviceIcon(session?.deviceType ?? null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="mt-3 rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Oturum detayı</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-white/60 dark:hover:bg-slate-800"
        >
          Kapat
        </button>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" />
          Yükleniyor…
        </div>
      ) : !session ? (
        <p className="py-4 text-sm text-slate-500">Detay bulunamadı.</p>
      ) : (
        <>
          <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white/70 px-3 py-2 dark:bg-slate-800/60">
              <p className="text-[10px] uppercase text-slate-500">Konum</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{session.location}</p>
            </div>
            <div className="rounded-lg bg-white/70 px-3 py-2 dark:bg-slate-800/60">
              <p className="text-[10px] uppercase text-slate-500">Cihaz</p>
              <p className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-white">
                <DeviceIcon size={14} />
                {session.deviceLabel} · {session.os} · {session.browser}
              </p>
            </div>
            <div className="rounded-lg bg-white/70 px-3 py-2 dark:bg-slate-800/60">
              <p className="text-[10px] uppercase text-slate-500">Süre</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {session.durationLabel}
              </p>
            </div>
            <div className="rounded-lg bg-white/70 px-3 py-2 dark:bg-slate-800/60">
              <p className="text-[10px] uppercase text-slate-500">Etkileşim</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {session.pageViews} sayfa · {session.clickCount} tıklama · %{session.maxScrollPct}{' '}
                scroll
              </p>
            </div>
          </div>
          {session.referrer ? (
            <p className="mb-3 truncate text-xs text-slate-500">
              Kaynak: <span className="text-slate-700 dark:text-slate-300">{session.referrer}</span>
            </p>
          ) : null}
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Zaman çizelgesi ({events.length} olay)
          </p>
          <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {events.map((ev) => (
              <li
                key={ev.id}
                className="flex items-start gap-2 rounded-lg bg-white/60 px-2.5 py-2 text-xs dark:bg-slate-800/50"
              >
                <time className="shrink-0 tabular-nums text-slate-400">{formatTime(ev.createdAt)}</time>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {eventKindLabel(ev.kind)}
                  </span>
                  {ev.path ? (
                    <span className="ml-1 text-slate-500">— {ev.path}</span>
                  ) : null}
                  {ev.label ? (
                    <p className="mt-0.5 truncate text-slate-600 dark:text-slate-400">
                      “{ev.label}”
                      {ev.targetUrl ? ` → ${ev.targetUrl}` : ''}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </motion.div>
  );
}

// ============================================
// MAIN PANEL
// ============================================

export default function VisitorAnalyticsPanel() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<VisitorAnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/admin/visitor-analytics?days=${days}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Analytics yüklenemedi');
      const json = (await res.json()) as VisitorAnalyticsPayload;
      setData(json);
    } catch {
      if (!silent) setData(null);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = window.setInterval(() => load(true), 30_000);
    return () => window.clearInterval(t);
  }, [load]);

  const activeSessions = useMemo(
    () => (data?.sessions ?? []).filter((s) => s.isActive),
    [data?.sessions]
  );

  if (loading && !data) {
    return (
      <div className="animate-pulse space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="h-8 w-64 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
        <div className="h-48 rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-300">Ziyaretçi verisi yüklenemedi.</p>
        <button
          type="button"
          onClick={() => load()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
        >
          <RefreshCw size={16} />
          Tekrar dene
        </button>
      </div>
    );
  }

  const { summary, chart, topCities, topPages, deviceBreakdown, sessions } = data;
  const totalDevices = deviceBreakdown.reduce((a, d) => a + d.count, 0) || 1;

  return (
    <section className="space-y-4" aria-labelledby="visitor-analytics-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="visitor-analytics-heading"
            className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white"
          >
            <Activity size={22} className="text-emerald-500" />
            Ziyaretçi analitiği
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Konum, cihaz, süre ve site içi hareketler — canlı oturum takibi
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 dark:border-slate-600 dark:bg-slate-800">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  days === d
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {d} gün
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            <RefreshCw size={14} />
            Yenile
          </button>
          {summary.activeNow > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {formatNumber(summary.activeNow)} canlı ziyaretçi
            </span>
          ) : null}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <KpiTile
            label="Toplam oturum"
            value={summary.totalSessions}
            hint={`Son ${days} gün`}
            icon={Users}
            accent="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <KpiTile
            label="Şu an sitede"
            value={summary.activeNow}
            hint="Son 5 dk aktif"
            icon={Activity}
            accent="bg-gradient-to-br from-cyan-500 to-blue-600"
          />
          <KpiTile
            label="Sayfa görüntüleme"
            value={summary.totalPageViews}
            icon={Eye}
            accent="bg-gradient-to-br from-violet-500 to-purple-600"
          />
          <KpiTile
            label="Ort. süre"
            value={summary.avgDurationLabel}
            icon={Clock}
            accent="bg-gradient-to-br from-amber-500 to-orange-600"
          />
          <KpiTile
            label="Mobil pay"
            value={`%${summary.mobilePct}`}
            hint={`Masaüstü %${summary.desktopPct} · Tablet %${summary.tabletPct}`}
            icon={Smartphone}
            accent="bg-gradient-to-br from-rose-500 to-pink-600"
          />
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 lg:col-span-2"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{chart.title}</h3>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Günlük benzersiz ziyaretçi oturumları
          </p>
          <SessionsChart values={chart.values} labels={chart.labels} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
            <MapPin size={18} className="text-emerald-500" />
            En çok ziyaret eden şehirler
          </h3>
          {topCities.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Henüz konum verisi yok. Vercel production’da otomatik dolar.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {topCities.map((c, i) => {
                const pct = Math.round((c.count / (topCities[0]?.count || 1)) * 100);
                return (
                  <li key={c.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                        {i + 1}. {c.label}
                      </span>
                      <span className="tabular-nums text-slate-500">{formatNumber(c.count)}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Cihaz dağılımı</h3>
          <ul className="mt-4 space-y-3">
            {deviceBreakdown.map((d) => {
              const Icon = deviceIcon(d.type);
              const pct = Math.round((d.count / totalDevices) * 100);
              return (
                <li key={d.type} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                    <Icon size={18} className="text-slate-600 dark:text-slate-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{d.label}</span>
                      <span className="tabular-nums text-slate-500">
                        {formatNumber(d.count)} (%{pct})
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 lg:col-span-2"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">En çok görüntülenen sayfalar</h3>
          {topPages.length === 0 ? (
            <p className="py-6 text-sm text-slate-500">Henüz sayfa görüntüleme kaydı yok.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[320px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase text-slate-500 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-medium">Sayfa</th>
                    <th className="pb-2 text-right font-medium">Görüntüleme</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((p) => (
                    <tr key={p.path} className="border-b border-slate-50 dark:border-slate-700/50">
                      <td className="max-w-[280px] truncate py-2.5 pr-4 font-mono text-xs text-slate-800 dark:text-slate-200">
                        {p.path}
                      </td>
                      <td className="py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-400">
                        {formatNumber(p.count)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {activeSessions.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20 sm:p-5"
        >
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-emerald-900 dark:text-emerald-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            Canlı oturumlar ({activeSessions.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeSessions.slice(0, 8).map((s) => {
              const Icon = deviceIcon(s.deviceType);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-left text-xs shadow-sm transition hover:border-emerald-400 dark:border-emerald-800 dark:bg-slate-800"
                >
                  <Icon size={14} className="text-emerald-600" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">{s.location}</span>
                  <span className="text-slate-500">{s.durationLabel}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Tüm ziyaretçi oturumları
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Konum, cihaz, süre, tıklama ve sayfa geçmişi — satıra tıklayarak detayı açın
          </p>
        </div>
        {sessions.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-500">
            Henüz ziyaretçi kaydı yok. Siteye giriş yapan kullanıcılar burada listelenecek.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-900/40">
                  <th className="px-5 py-3 font-medium">Konum</th>
                  <th className="px-3 py-3 font-medium">Cihaz</th>
                  <th className="px-3 py-3 font-medium">Süre</th>
                  <th className="px-3 py-3 font-medium">Sayfa / Tıklama</th>
                  <th className="px-3 py-3 font-medium">Giriş → Çıkış</th>
                  <th className="px-5 py-3 font-medium">Son görülme</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => {
                  const Icon = deviceIcon(s.deviceType);
                  const isOpen = expandedId === s.id;
                  return (
                    <Fragment key={s.id}>
                      <tr
                        onClick={() => setExpandedId(isOpen ? null : s.id)}
                        className="cursor-pointer border-b border-slate-50 transition hover:bg-slate-50/80 dark:border-slate-700/50 dark:hover:bg-slate-700/30"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            {s.isActive ? (
                              <span className="relative flex h-2 w-2 shrink-0">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                              </span>
                            ) : (
                              <MapPin size={14} className="shrink-0 text-slate-400" />
                            )}
                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-900 dark:text-white">
                                {s.location}
                              </p>
                              <p className="text-xs text-slate-500">ID …{s.visitorKey}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            <Icon size={14} />
                            {s.deviceLabel}
                          </span>
                          <p className="text-xs text-slate-500">
                            {s.os} · {s.browser}
                            {s.screen ? ` · ${s.screen}` : ''}
                          </p>
                        </td>
                        <td className="px-3 py-3 tabular-nums text-slate-700 dark:text-slate-300">
                          {s.durationLabel}
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center gap-3 text-slate-600 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <Eye size={13} />
                              {s.pageViews}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MousePointerClick size={13} />
                              {s.clickCount}
                            </span>
                            <span className="text-xs">%{s.maxScrollPct}</span>
                          </span>
                        </td>
                        <td className="max-w-[180px] px-3 py-3">
                          <p className="truncate font-mono text-xs text-slate-600 dark:text-slate-400">
                            {s.landingPath || '—'}
                          </p>
                          <p className="truncate font-mono text-xs text-slate-400">
                            → {s.exitPath || '—'}
                          </p>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1 text-slate-500">
                            <time dateTime={s.lastSeenAt}>{formatRelativeTr(s.lastSeenAt)}</time>
                            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </div>
                        </td>
                      </tr>
                      {isOpen ? (
                        <tr key={`${s.id}-detail`}>
                          <td colSpan={6} className="px-5 pb-4">
                            <AnimatePresence>
                              <SessionDetailDrawer sessionId={s.id} onClose={() => setExpandedId(null)} />
                            </AnimatePresence>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <p className="text-center text-xs text-slate-400">
        Analitik güncellendi:{' '}
        <time dateTime={data.generatedAt}>
          {new Date(data.generatedAt).toLocaleString('tr-TR')}
        </time>
        {' · '}
        Konum verisi Vercel edge header’larından alınır
      </p>
    </section>
  );
}
