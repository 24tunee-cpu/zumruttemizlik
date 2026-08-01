'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Globe,
  Laptop,
  Loader2,
  Mail,
  MapPin,
  Megaphone,
  MousePointerClick,
  RefreshCw,
  Route,
  Search,
  Share2,
  Smartphone,
  Tablet,
  Target,
  Users,
  Eye,
  Zap,
  Bot,
  TrendingUp,
  Download,
  LogOut,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Attribution = {
  channel: string;
  channelLabel: string;
  sourceLabel: string;
  searchQuery: string | null;
  referrerHost: string | null;
  summary: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
};

type VisitorEventRow = {
  id: string;
  kind: string;
  path: string | null;
  label: string | null;
  targetUrl: string | null;
  metadata: unknown;
  createdAt: string;
};

type VisitorSessionRow = {
  id: string;
  location: string;
  deviceType: string | null;
  deviceLabel: string;
  os: string | null;
  browser: string | null;
  screen: string | null;
  referrer: string | null;
  landingPath: string | null;
  landingUrl: string | null;
  exitPath: string | null;
  pageViews: number;
  durationLabel: string;
  engagedLabel: string;
  maxScrollPct: number;
  clickCount: number;
  conversionCount: number;
  isBot: boolean;
  isBounce: boolean | null;
  isActive: boolean;
  lastSeenAt: string;
  startedAt: string;
  visitorKey: string;
  attribution: Attribution;
  recentEvents?: VisitorEventRow[];
};

type AnalyticsPayload = {
  generatedAt: string;
  rangeDays: number;
  summary: {
    totalSessions: number;
    activeNow: number;
    totalPageViews: number;
    avgDurationLabel: string;
    avgEngagedLabel: string;
    totalConversions: number;
    conversionRatePct: number;
    bounceRatePct: number;
    botCount: number;
    mobilePct: number;
    desktopPct: number;
    organicPct: number;
  };
  chart: { labels: string[]; values: number[]; title: string };
  hourlyChart: { labels: string[]; values: number[]; title: string };
  topChannels: Array<{ channel: string; label: string; count: number }>;
  topSources: Array<{ label: string; count: number }>;
  topSearchTerms: Array<{ term: string; count: number }>;
  topReferrers: Array<{ host: string; count: number }>;
  topLandings: Array<{ path: string; count: number }>;
  topConversions: Array<{ label: string; count: number }>;
  topCities: Array<{ label: string; count: number }>;
  topPages: Array<{ path: string; count: number }>;
  deviceBreakdown: Array<{ type: string; label: string; count: number }>;
  sessions: VisitorSessionRow[];
};

type SessionDetail = {
  session: VisitorSessionRow;
  events: VisitorEventRow[];
  journey: { pages: string[]; steps: number };
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) => new Intl.NumberFormat('tr-TR').format(n);

function relTime(iso: string) {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return 'Az önce';
  if (diffMin < 60) return `${diffMin} dk önce`;
  const h = Math.floor(diffMin / 60);
  if (h < 24) return `${h} sa. önce`;
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

function timeOnly(iso: string) {
  return new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function deviceIcon(type: string | null) {
  if (type === 'mobile') return Smartphone;
  if (type === 'tablet') return Tablet;
  if (type === 'desktop') return Laptop;
  return Globe;
}

function channelIcon(channel: string) {
  switch (channel) {
    case 'organic':
      return Search;
    case 'paid':
      return Megaphone;
    case 'social':
      return Share2;
    case 'email':
      return Mail;
    case 'direct':
      return Zap;
    case 'referral':
      return ExternalLink;
    default:
      return Globe;
  }
}

function channelBadgeClass(channel: string) {
  switch (channel) {
    case 'organic':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200';
    case 'paid':
      return 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200';
    case 'social':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200';
    case 'direct':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    case 'referral':
      return 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200';
    case 'email':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
  }
}

function eventLabel(kind: string, label?: string | null) {
  if (kind === 'conversion' && label) return label;
  const map: Record<string, string> = {
    page_view: 'Sayfa görüntüleme',
    page_exit: 'Sayfadan çıkış',
    click: 'Tıklama',
    scroll: 'Kaydırma',
    heartbeat: 'Aktif',
    session_end: 'Oturum kapandı',
    session_start: 'Giriş',
    conversion: 'Dönüşüm',
  };
  return map[kind] ?? kind;
}

function exportSessionsCsv(sessions: VisitorSessionRow[]) {
  const header = [
    'Konum',
    'Kanal',
    'Kaynak',
    'Arama sorgusu',
    'Giriş sayfası',
    'Çıkış sayfası',
    'Sayfa',
    'Süre',
    'Etkileşim süresi',
    'Dönüşüm',
    'Bounce',
    'Bot',
    'Başlangıç',
  ];
  const rows = sessions.map((s) => [
    s.location,
    s.attribution.channelLabel,
    s.attribution.sourceLabel,
    s.attribution.searchQuery ?? '',
    s.landingPath ?? '',
    s.exitPath ?? '',
    String(s.pageViews),
    s.durationLabel,
    s.engagedLabel,
    String(s.conversionCount),
    s.isBounce ? 'Evet' : 'Hayır',
    s.isBot ? 'Evet' : 'Hayır',
    s.startedAt,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ziyaretciler-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const CHANNEL_FILTERS = [
  { id: '', label: 'Tümü' },
  { id: 'organic', label: 'Organik arama' },
  { id: 'direct', label: 'Doğrudan' },
  { id: 'social', label: 'Sosyal' },
  { id: 'paid', label: 'Reklam' },
  { id: 'referral', label: 'Referans' },
];

// ─── Subcomponents ───────────────────────────────────────────────────────────

function BarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values, 1);
  return (
    <div>
      <div className="flex h-32 items-end gap-1">
        {values.map((v, i) => (
          <div key={i} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: Math.max(8, Math.round((v / max) * 120)) }}
              className="w-full max-w-[2.5rem] rounded-t-md bg-gradient-to-t from-cyan-600 to-emerald-400"
              title={`${fmt(v)} oturum`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between gap-0.5 text-[10px] text-slate-400">
        {labels.map((l, i) => (
          <span key={i} className="min-w-0 flex-1 truncate text-center">{l}</span>
        ))}
      </div>
    </div>
  );
}

function RankList({
  title,
  icon: Icon,
  items,
  renderLabel,
}: {
  title: string;
  icon: React.ElementType;
  items: Array<{ label: string; count: number }>;
  renderLabel?: (label: string) => React.ReactNode;
}) {
  const top = items[0]?.count || 1;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
        <Icon size={16} className="text-emerald-500" />
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">Henüz veri yok</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={`${item.label}-${i}`}>
              <div className="mb-1 flex justify-between gap-2 text-sm">
                <span className="min-w-0 truncate font-medium text-slate-800 dark:text-slate-200">
                  {renderLabel ? renderLabel(item.label) : item.label}
                </span>
                <span className="shrink-0 tabular-nums text-slate-500">{fmt(item.count)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                  style={{ width: `${Math.round((item.count / top) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SessionDetailPanel({ sessionId, onClose }: { sessionId: string; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<SessionDetail | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/visitor-analytics?sessionId=${sessionId}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('fail');
        const json = (await res.json()) as SessionDetail;
        if (!cancelled) setDetail(json);
      } catch {
        if (!cancelled) setDetail(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [sessionId]);

  const s = detail?.session;
  const Icon = deviceIcon(s?.deviceType ?? null);
  const ChIcon = channelIcon(s?.attribution.channel ?? 'other');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 to-white p-5 dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-slate-900"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="font-semibold text-slate-900 dark:text-white">Oturum detayı</p>
        <button type="button" onClick={onClose} className="text-xs text-slate-500 hover:text-slate-800">Kapat</button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" /> Yükleniyor…
        </div>
      ) : !s ? (
        <p className="py-6 text-sm text-slate-500">Detay bulunamadı.</p>
      ) : (
        <div className="space-y-5">
          {/* Attribution */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/80">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Target size={14} /> Nasıl geldi?
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${channelBadgeClass(s.attribution.channel)}`}>
                <ChIcon size={12} />
                {s.attribution.channelLabel}
              </span>
              {s.attribution.sourceLabel && s.attribution.channel !== 'direct' ? (
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{s.attribution.sourceLabel}</span>
              ) : null}
            </div>
            {s.attribution.searchQuery ? (
              <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm dark:bg-emerald-950/40">
                <Search size={14} className="mr-1 inline text-emerald-600" />
                Arama sorgusu: <strong>“{s.attribution.searchQuery}”</strong>
              </p>
            ) : null}
            {s.referrer ? (
              <p className="mt-2 truncate text-xs text-slate-500">
                Referrer: <span className="text-slate-700 dark:text-slate-300">{s.referrer}</span>
              </p>
            ) : null}
            {s.landingUrl ? (
              <p className="mt-1 truncate font-mono text-[11px] text-slate-400">{s.landingUrl}</p>
            ) : null}
            {(s.attribution.utmSource || s.attribution.utmCampaign) ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.attribution.utmSource ? <UtmTag label="utm_source" value={s.attribution.utmSource} /> : null}
                {s.attribution.utmMedium ? <UtmTag label="utm_medium" value={s.attribution.utmMedium} /> : null}
                {s.attribution.utmCampaign ? <UtmTag label="utm_campaign" value={s.attribution.utmCampaign} /> : null}
                {s.attribution.utmTerm ? <UtmTag label="utm_term" value={s.attribution.utmTerm} /> : null}
              </div>
            ) : null}
          </div>

          {/* Journey */}
          {detail.journey.pages.length > 0 ? (
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/80">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Route size={14} /> Sayfa yolculuğu ({detail.journey.pages.length} sayfa)
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {detail.journey.pages.map((p, i) => (
                  <Fragment key={`${p}-${i}`}>
                    {i > 0 ? <span className="text-slate-300">→</span> : null}
                    <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-700 dark:bg-slate-700 dark:text-slate-200">{p}</span>
                  </Fragment>
                ))}
              </div>
            </div>
          ) : null}

          {/* Meta grid */}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <MiniStat label="Konum" value={s.location} />
            <MiniStat label="Cihaz" value={`${s.deviceLabel} · ${s.os} · ${s.browser}`} icon={Icon} />
            <MiniStat label="Süre" value={s.durationLabel} />
            <MiniStat label="Etkileşim süresi" value={s.engagedLabel} />
            <MiniStat label="Dönüşüm" value={s.conversionCount > 0 ? `${s.conversionCount} adet` : 'Yok'} />
            <MiniStat label="Etkileşim" value={`${s.pageViews} sayfa · ${s.clickCount} tık · %${s.maxScrollPct} scroll`} />
          </div>

          {/* Timeline */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Zaman çizelgesi ({detail.events.length} olay)
            </p>
            <ul className="max-h-72 space-y-1 overflow-y-auto pr-1">
              {detail.events.map((ev) => (
                <li key={ev.id} className="flex gap-2 rounded-lg bg-white/80 px-2.5 py-2 text-xs dark:bg-slate-800/60">
                  <time className="shrink-0 tabular-nums text-slate-400">{timeOnly(ev.createdAt)}</time>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{eventLabel(ev.kind, ev.label)}</span>
                    {ev.path ? <span className="ml-1 font-mono text-slate-500">{ev.path}</span> : null}
                    {ev.label ? (
                      <p className="mt-0.5 truncate text-slate-600 dark:text-slate-400">
                        “{ev.label}”{ev.targetUrl ? ` → ${ev.targetUrl}` : ''}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function UtmTag({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
      {label}={value}
    </span>
  );
}

function MiniStat({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) {
  return (
    <div className="rounded-lg bg-white/80 px-3 py-2 dark:bg-slate-800/60">
      <p className="text-[10px] uppercase text-slate-500">{label}</p>
      <p className="mt-0.5 flex items-center gap-1 text-sm font-medium text-slate-900 dark:text-white">
        {Icon ? <Icon size={13} className="text-slate-400" /> : null}
        <span className="line-clamp-2">{value}</span>
      </p>
    </div>
  );
}

// ─── Main Hub ────────────────────────────────────────────────────────────────

export default function VisitorAnalyticsHub() {
  const [days, setDays] = useState(7);
  const [channel, setChannel] = useState('');
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [includeBots, setIncludeBots] = useState(false);
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams({ days: String(days) });
      if (channel) params.set('channel', channel);
      if (query) params.set('q', query);
      if (includeBots) params.set('bots', 'include');
      const res = await fetch(`/api/admin/visitor-analytics?${params}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('fail');
      setData(await res.json());
    } catch {
      if (!silent) setData(null);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [days, channel, query, includeBots]);

  useEffect(() => { load(); }, [load]);
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
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-300">Ziyaretçi verisi yüklenemedi.</p>
        <button type="button" onClick={() => load()} className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white">
          Tekrar dene
        </button>
      </div>
    );
  }

  const { summary, chart, hourlyChart, topChannels, topSearchTerms, topReferrers, topLandings, topConversions, topCities, topPages, sessions } = data;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            <Activity className="text-emerald-500" size={28} />
            Ziyaretçi analitiği
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Hangi aramadan geldi, hangi kanaldan geldi, hangi sayfaları gezdi — gerçek zamanlı oturum takibi
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 dark:border-slate-600 dark:bg-slate-800">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${days === d ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
              >
                {d} gün
              </button>
            ))}
          </div>
          <button type="button" onClick={() => load()} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium dark:border-slate-600 dark:bg-slate-800">
            <RefreshCw size={14} /> Yenile
          </button>
          <button
            type="button"
            onClick={() => exportSessionsCsv(sessions)}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium dark:border-slate-600 dark:bg-slate-800"
          >
            <Download size={14} /> CSV
          </button>
          {summary.activeNow > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {fmt(summary.activeNow)} canlı
            </span>
          ) : null}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-1.5">
          {CHANNEL_FILTERS.map((f) => (
            <button
              key={f.id || 'all'}
              type="button"
              onClick={() => setChannel(f.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                channel === f.id
                  ? 'bg-emerald-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <form
          className="flex flex-1 gap-2 sm:max-w-xs"
          onSubmit={(e) => { e.preventDefault(); setQuery(searchInput.trim().toLowerCase()); }}
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Arama sorgusu, sayfa, şehir…"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
          <button type="submit" className="rounded-xl bg-slate-800 px-3 py-2 text-white dark:bg-slate-600">
            <Search size={16} />
          </button>
        </form>
        <button
          type="button"
          onClick={() => setIncludeBots((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
            includeBots
              ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200'
              : 'border border-slate-200 bg-white text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <Bot size={14} />
          {includeBots ? 'Botlar dahil' : 'Botlar hariç'}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        {[
          { label: 'Oturum', value: fmt(summary.totalSessions), icon: Users, color: 'from-emerald-500 to-teal-600' },
          { label: 'Canlı', value: fmt(summary.activeNow), icon: Activity, color: 'from-cyan-500 to-blue-600' },
          { label: 'Sayfa görüntüleme', value: fmt(summary.totalPageViews), icon: Eye, color: 'from-violet-500 to-purple-600' },
          { label: 'Dönüşüm', value: fmt(summary.totalConversions), icon: Target, color: 'from-rose-500 to-red-600' },
          { label: 'Dönüşüm oranı', value: `%${summary.conversionRatePct}`, icon: TrendingUp, color: 'from-pink-500 to-rose-600' },
          { label: 'Bounce oranı', value: `%${summary.bounceRatePct}`, icon: LogOut, color: 'from-slate-500 to-slate-700' },
          { label: 'Ort. etkileşim', value: summary.avgEngagedLabel, icon: Clock, color: 'from-amber-500 to-orange-600' },
          { label: 'Organik arama', value: `%${summary.organicPct}`, icon: Search, color: 'from-emerald-600 to-green-700' },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{k.label}</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-slate-900 dark:text-white">{k.value}</p>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${k.color}`}>
                <k.icon size={16} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Channels */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 lg:col-span-2">
          <h3 className="font-semibold text-slate-900 dark:text-white">{chart.title}</h3>
          <BarChart values={chart.values} labels={chart.labels} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">{hourlyChart.title}</h3>
          <BarChart values={hourlyChart.values} labels={hourlyChart.labels} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Trafik kanalları</h3>
          <ul className="space-y-3">
            {topChannels.map((c) => {
              const Icon = channelIcon(c.channel);
              const pct = summary.totalSessions ? Math.round((c.count / summary.totalSessions) * 100) : 0;
              return (
                <li key={c.channel} className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${channelBadgeClass(c.channel)}`}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{c.label}</span>
                      <span className="tabular-nums text-slate-500">{fmt(c.count)} (%{pct})</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <RankList
          title="Dönüşümler"
          icon={Target}
          items={topConversions.map((c) => ({ label: c.label, count: c.count }))}
        />
      </div>

      {/* Attribution rows */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RankList
          title="Arama sorguları (organik & reklam)"
          icon={Search}
          items={topSearchTerms.map((t) => ({ label: t.term, count: t.count }))}
          renderLabel={(label) => <span className="italic">“{label}”</span>}
        />
        <RankList
          title="Referans siteler"
          icon={ExternalLink}
          items={topReferrers.map((r) => ({ label: r.host, count: r.count }))}
        />
        <RankList
          title="İlk giriş sayfaları"
          icon={Target}
          items={topLandings.map((l) => ({ label: l.path, count: l.count }))}
          renderLabel={(label) => <span className="font-mono text-xs">{label}</span>}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RankList title="Şehirler" icon={MapPin} items={topCities.map((c) => ({ label: c.label, count: c.count }))} />
        <RankList
          title="En çok gezilen sayfalar"
          icon={Eye}
          items={topPages.map((p) => ({ label: p.path, count: p.count }))}
          renderLabel={(label) => <span className="font-mono text-xs">{label}</span>}
        />
        <RankList title="Kaynak / kampanya" icon={Megaphone} items={data.topSources.map((s) => ({ label: s.label, count: s.count }))} />
      </div>

      {/* Live */}
      {activeSessions.length > 0 ? (
        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
          <h3 className="mb-3 text-sm font-semibold text-emerald-900 dark:text-emerald-100">
            Canlı oturumlar ({activeSessions.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeSessions.slice(0, 10).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setExpandedId(s.id)}
                className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-left text-xs dark:border-emerald-800 dark:bg-slate-800"
              >
                <span className="font-medium">{s.location}</span>
                <span className="mx-1 text-slate-300">·</span>
                <span className={channelBadgeClass(s.attribution.channel) + ' rounded px-1.5 py-0.5 text-[10px]'}>
                  {s.attribution.channelLabel}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Sessions table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white">Tüm ziyaretçi oturumları</h3>
          <p className="text-sm text-slate-500">Kaynak, arama, sayfa yolculuğu — satıra tıklayın</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-900/40">
                <th className="px-5 py-3">Konum / Cihaz</th>
                <th className="px-3 py-3">Nasıl geldi</th>
                <th className="px-3 py-3">Arama sorgusu</th>
                <th className="px-3 py-3">Sayfa yolculuğu</th>
                <th className="px-3 py-3">Süre / Etkileşim</th>
                <th className="px-5 py-3">Son görülme</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">Kayıt bulunamadı</td>
                </tr>
              ) : (
                sessions.map((s) => {
                  const Icon = deviceIcon(s.deviceType);
                  const ChIcon = channelIcon(s.attribution.channel);
                  const isOpen = expandedId === s.id;
                  return (
                    <Fragment key={s.id}>
                      <tr
                        onClick={() => setExpandedId(isOpen ? null : s.id)}
                        className="cursor-pointer border-b border-slate-50 hover:bg-slate-50/80 dark:border-slate-700/50 dark:hover:bg-slate-700/20"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            {s.isActive ? (
                              <span className="relative flex h-2 w-2 shrink-0">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                              </span>
                            ) : (
                              <Icon size={14} className="shrink-0 text-slate-400" />
                            )}
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{s.location}</p>
                              <p className="text-xs text-slate-500">{s.deviceLabel} · {s.browser}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${channelBadgeClass(s.attribution.channel)}`}>
                            <ChIcon size={11} />
                            {s.attribution.channelLabel}
                          </span>
                          {s.attribution.sourceLabel && s.attribution.channel !== 'direct' ? (
                            <p className="mt-1 text-xs text-slate-500">{s.attribution.sourceLabel}</p>
                          ) : null}
                        </td>
                        <td className="max-w-[140px] px-3 py-3">
                          {s.attribution.searchQuery ? (
                            <span className="line-clamp-2 text-xs italic text-emerald-700 dark:text-emerald-300">
                              “{s.attribution.searchQuery}”
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="max-w-[200px] px-3 py-3">
                          <p className="truncate font-mono text-xs text-slate-600 dark:text-slate-400">{s.landingPath || '—'}</p>
                          <p className="truncate font-mono text-xs text-slate-400">→ {s.exitPath || '—'}</p>
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-400">
                          {s.durationLabel}
                          <br />
                          <span className="text-slate-400">Etk: {s.engagedLabel}</span>
                          <br />
                          <span className="inline-flex gap-2">
                            <Eye size={11} className="inline" /> {s.pageViews}
                            <MousePointerClick size={11} className="inline" /> {s.clickCount}
                            {s.conversionCount > 0 ? (
                              <span className="font-semibold text-rose-600">· {s.conversionCount} dönüşüm</span>
                            ) : null}
                          </span>
                          {s.isBounce ? (
                            <span className="ml-1 rounded bg-slate-100 px-1 py-0.5 text-[10px] text-slate-500 dark:bg-slate-700">bounce</span>
                          ) : null}
                          {s.isBot ? (
                            <span className="ml-1 rounded bg-amber-100 px-1 py-0.5 text-[10px] text-amber-800 dark:bg-amber-900/40">bot</span>
                          ) : null}
                        </td>
                        <td className="px-5 py-3 text-right text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            {relTime(s.lastSeenAt)}
                            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </span>
                        </td>
                      </tr>
                      {isOpen ? (
                        <tr>
                          <td colSpan={6} className="px-5 pb-4">
                            <AnimatePresence>
                              <SessionDetailPanel sessionId={s.id} onClose={() => setExpandedId(null)} />
                            </AnimatePresence>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">
        Güncellendi: {new Date(data.generatedAt).toLocaleString('tr-TR')} · Bot filtre: {includeBots ? 'kapalı' : 'açık'} ({fmt(summary.botCount)} bot kaydı aralıkta)
      </p>
    </div>
  );
}
