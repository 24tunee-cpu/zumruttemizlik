'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  Loader2,
  RefreshCw,
  XCircle,
  Zap,
} from 'lucide-react';
import type { AutopilotStatusPayload } from '@/lib/seo-autopilot/status';

function formatTrDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(ms: number | null): string {
  if (ms == null) return '—';
  if (ms < 1000) return `${ms} ms`;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} sn`;
  return `${Math.floor(s / 60)} dk ${s % 60} sn`;
}

function HealthBadge({ health, message }: { health: AutopilotStatusPayload['health']; message: string }) {
  const map = {
    healthy: {
      icon: CheckCircle2,
      className: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800',
      label: 'Sağlıklı',
    },
    warning: {
      icon: AlertTriangle,
      className: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800',
      label: 'Uyarı',
    },
    error: {
      icon: XCircle,
      className: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800',
      label: 'Hata',
    },
    running: {
      icon: Loader2,
      className: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-200 dark:border-sky-800',
      label: 'Çalışıyor',
    },
    unknown: {
      icon: Clock,
      className: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
      label: 'Bekleniyor',
    },
  } as const;

  const cfg = map[health];
  const Icon = cfg.icon;

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 ${cfg.className}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${health === 'running' ? 'animate-spin' : ''}`} />
      <div>
        <p className="text-sm font-semibold">{cfg.label}</p>
        <p className="mt-1 text-sm opacity-90">{message}</p>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ok: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    partial: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    running: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
      {status}
    </span>
  );
}

type Props = {
  compact?: boolean;
};

export default function SeoAutopilotPanel({ compact = false }: Props) {
  const [data, setData] = useState<AutopilotStatusPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/seo-autopilot', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Sunucu: ${res.status}`);
      setData((await res.json()) as AutopilotStatusPayload);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, compact ? 120_000 : 60_000);
    return () => clearInterval(t);
  }, [load, compact]);

  if (loading && !data) {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
        <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        <button type="button" onClick={load} className="mt-2 text-sm font-medium text-red-700 underline dark:text-red-400">
          Tekrar dene
        </button>
      </div>
    );
  }

  if (!data) return null;

  const last = data.lastRun;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">SEO Autopilot</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{data.cronScheduleTr}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!compact && (
            <Link
              href="/admin/seo-otomasyon"
              className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              SEO otomasyon →
            </Link>
          )}
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </button>
        </div>
      </div>

      <HealthBadge health={data.health} message={data.healthMessage} />

      <div className={`grid gap-3 ${compact ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
          <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <FileText className="h-3.5 w-3.5" /> Blog kuyruğu
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
            {data.queues.blogsScheduled}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Vadesi gelen: {data.queues.blogsDueNow}
            {data.queues.blogsNextPublishAt ? ` · Sıradaki: ${formatTrDate(data.queues.blogsNextPublishAt)}` : ''}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
          <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Globe className="h-3.5 w-3.5" /> Geo-SSS
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
            {data.queues.geoSssPublishedTotal}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Kuyruk: {data.queues.geoSssScheduled} · Vadesi gelen: {data.queues.geoSssDueNow}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
          <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Activity className="h-3.5 w-3.5" /> Son 7 gün
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
            {data.stats7d.runsTotal} koşu
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {data.stats7d.blogsPublished} blog · {data.stats7d.geoSssPublished} geo-sss yayınlandı
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
          <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5" /> Son koşu
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            {last ? formatTrDate(last.startedAt) : '—'}
          </p>
          <p className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {last ? <StatusPill status={last.status} /> : null}
            {last?.durationMs != null ? formatDuration(last.durationMs) : null}
          </p>
        </div>
      </div>

      {!compact && last?.results ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Son koşu özeti
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {[
              ['Blog', last.results.blogPublished],
              ['Geo-SSS', last.results.geoSssPublished],
              ['GSC taslak', last.results.gscDraftsCreated],
              ['Yenileme', last.results.blogsRefreshed],
              ['Mevsim', last.results.seasonalCreated],
              ['Testimonial', last.results.testimonialsSynced],
              ['IndexNow', last.results.indexNowSubmitted],
            ].map(([label, val]) => (
              <span
                key={String(label)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-800"
              >
                {label}: <strong>{val ?? 0}</strong>
              </span>
            ))}
          </div>
          {last.results.warnings && last.results.warnings.length > 0 ? (
            <ul className="mt-3 space-y-1 text-xs text-amber-800 dark:text-amber-300">
              {last.results.warnings.map((w) => (
                <li key={w}>⚠ {w}</li>
              ))}
            </ul>
          ) : null}
          {last.error ? (
            <p className="mt-2 text-xs text-red-700 dark:text-red-400">{last.error}</p>
          ) : null}
        </div>
      ) : null}

      {!compact ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Süre</th>
                <th className="px-4 py-3">Blog</th>
                <th className="px-4 py-3">Geo-SSS</th>
                <th className="px-4 py-3">Not</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.recentRuns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                    Henüz koşu kaydı yok
                  </td>
                </tr>
              ) : (
                data.recentRuns.map((run) => (
                  <tr key={run.id} className="bg-white dark:bg-slate-800/50">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-300">
                      {formatTrDate(run.startedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={run.status} />
                    </td>
                    <td className="px-4 py-3 tabular-nums text-slate-600 dark:text-slate-400">
                      {formatDuration(run.durationMs)}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{run.results?.blogPublished ?? '—'}</td>
                    <td className="px-4 py-3 tabular-nums">{run.results?.geoSssPublished ?? '—'}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                      {run.error || run.results?.warnings?.[0] || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <Link
          href="/admin/seo-autopilot"
          className="inline-flex text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Tüm geçmiş ve detaylar →
        </Link>
      )}

      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        Güncellendi: {formatTrDate(data.generatedAt)} · Otomatik yenileme {compact ? '2' : '1'} dk
      </p>
    </div>
  );
}
