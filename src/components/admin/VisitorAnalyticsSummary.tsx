'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Activity, ArrowRight, Eye, Loader2, RefreshCw, Users } from 'lucide-react';

type SummaryPayload = {
  summary: {
    totalSessions: number;
    activeNow: number;
    totalPageViews: number;
    organicPct: number;
  };
};

function formatNumber(n: number) {
  return new Intl.NumberFormat('tr-TR').format(n);
}

/** Dashboard için kompakt ziyaretçi özeti */
export default function VisitorAnalyticsSummary() {
  const [data, setData] = useState<SummaryPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/visitor-analytics?days=7&summary=1', { cache: 'no-store' });
      if (!res.ok) throw new Error('fail');
      setData(await res.json());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-cyan-50/40 p-5 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-slate-900/40 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Activity size={20} className="text-emerald-500" />
            Ziyaretçi analitiği
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Arama kaynağı, trafik kanalı ve sayfa yolculuğu — detaylı panelde
          </p>
        </div>
        <Link
          href="/admin/ziyaretciler"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
        >
          Gelişmiş paneli aç
          <ArrowRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" />
          Yükleniyor…
        </div>
      ) : data ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-white/60 bg-white/70 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Canlı</p>
            <p className="mt-1 flex items-center gap-1.5 text-xl font-bold text-emerald-700 dark:text-emerald-300">
              {data.summary.activeNow > 0 ? (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
              ) : null}
              {formatNumber(data.summary.activeNow)}
            </p>
          </div>
          <div className="rounded-xl border border-white/60 bg-white/70 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">7 gün oturum</p>
            <p className="mt-1 flex items-center gap-1 text-xl font-bold text-slate-900 dark:text-white">
              <Users size={16} className="text-slate-400" />
              {formatNumber(data.summary.totalSessions)}
            </p>
          </div>
          <div className="rounded-xl border border-white/60 bg-white/70 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Sayfa görüntüleme</p>
            <p className="mt-1 flex items-center gap-1 text-xl font-bold text-slate-900 dark:text-white">
              <Eye size={16} className="text-slate-400" />
              {formatNumber(data.summary.totalPageViews)}
            </p>
          </div>
          <div className="rounded-xl border border-white/60 bg-white/70 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Organik arama</p>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">%{data.summary.organicPct}</p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">Özet yüklenemedi.</p>
      )}

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-600"
        >
          <RefreshCw size={12} />
          Yenile
        </button>
      </div>
    </div>
  );
}
