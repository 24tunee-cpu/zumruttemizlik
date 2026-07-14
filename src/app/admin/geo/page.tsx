'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  MapPin,
  MessageSquare,
  Target,
  Users,
} from 'lucide-react';

type GeoDashboard = {
  nap: { name: string; telephoneDisplay: string; email: string; streetAddress: string };
  gbpChecklist: string[];
  reviewTemplates: { id: string; label: string; text: string }[];
  citationPrompts: { id: string; prompt: string; category: string }[];
  competitors: string[];
  directories: { id: string; name: string; priority: string; configured: boolean }[];
  stats: { publishedBlogs: number; geoPassageBlogs: number; geoSssPages: number };
  lastRun: {
    status: string;
    message: string | null;
    startedAt: string;
    stats: {
      audit?: { score: number; checks: { label: string; status: string; detail: string }[] };
      citation?: { overallScore: number; brandMentionPages: number; promptResults: {
        prompt: string;
        brandCoverageScore: number;
        recommendation: string;
      }[] };
    };
  } | null;
};

export default function AdminGeoPage() {
  const [data, setData] = useState<GeoDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'overview' | 'citation' | 'gbp' | 'reviews' | 'competitors'>('overview');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/geo', { credentials: 'include' });
      if (!res.ok) throw new Error('GEO verisi yüklenemedi');
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Hata');
    } finally {
      setLoading(false);
    }
  }, []);

  const runSync = async () => {
    try {
      setSyncing(true);
      setError(null);
      const res = await fetch('/api/admin/geo', { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('GEO sync başarısız');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sync hatası');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    void load();
  }, [load]);

  const runStats = data?.lastRun?.stats as Record<string, unknown> | undefined;
  const audit = runStats?.audit as GeoDashboard['lastRun'] extends null
    ? undefined
    : NonNullable<GeoDashboard['lastRun']>['stats']['audit'];
  const citation = runStats?.citation as GeoDashboard['lastRun'] extends null
    ? undefined
    : NonNullable<GeoDashboard['lastRun']>['stats']['citation'];

  const statusIcon = (s: string) => {
    if (s === 'pass') return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    if (s === 'warn') return <AlertTriangle className="h-4 w-4 text-amber-400" />;
    return <XCircle className="h-4 w-4 text-red-400" />;
  };

  const tabs = [
    { id: 'overview' as const, label: 'Genel', icon: Sparkles },
    { id: 'citation' as const, label: 'AI Citation', icon: Target },
    { id: 'gbp' as const, label: 'GBP Checklist', icon: MapPin },
    { id: 'reviews' as const, label: 'Yorum Şablonları', icon: MessageSquare },
    { id: 'competitors' as const, label: 'Rakipler', icon: Users },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">GEO — AI Görünürlük</h1>
          <p className="mt-1 text-sm text-slate-400">
            Generative Engine Optimization: ChatGPT, Perplexity, Google AI Overviews
          </p>
        </div>
        <button
          type="button"
          onClick={() => void runSync()}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          GEO Sync Çalıştır
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading && <p className="text-slate-400">Yükleniyor…</p>}

      {data && !loading && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <p className="text-xs text-slate-400">GEO Teknik Skor</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">{audit?.score ?? '—'}/100</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <p className="text-xs text-slate-400">Citation Kapsam</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">
                {citation?.overallScore ?? '—'}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <p className="text-xs text-slate-400">Passage Blog</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {data.stats.geoPassageBlogs}/{data.stats.publishedBlogs}
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <p className="text-xs text-slate-400">GEO SSS Sayfaları</p>
              <p className="mt-1 text-2xl font-bold text-white">{data.stats.geoSssPages}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                  tab === t.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="space-y-4">
              <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
                <h2 className="font-semibold text-white">NAP (Kanonik)</h2>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div><dt className="text-slate-400">Marka</dt><dd className="text-white">{data.nap.name}</dd></div>
                  <div><dt className="text-slate-400">Telefon</dt><dd className="text-white">{data.nap.telephoneDisplay}</dd></div>
                  <div><dt className="text-slate-400">E-posta</dt><dd className="text-white">{data.nap.email}</dd></div>
                  <div><dt className="text-slate-400">Adres</dt><dd className="text-white">{data.nap.streetAddress}</dd></div>
                </dl>
              </section>

              <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
                <h2 className="font-semibold text-white">Dizin Durumu</h2>
                <ul className="mt-3 space-y-2">
                  {data.directories.map((d) => (
                    <li key={d.id} className="flex items-center gap-2 text-sm">
                      {d.configured ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      )}
                      <span className="text-white">{d.name}</span>
                      <span className="text-slate-500">({d.priority})</span>
                    </li>
                  ))}
                </ul>
              </section>

              {audit?.checks && (
                <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
                  <h2 className="font-semibold text-white">Teknik Denetim</h2>
                  <ul className="mt-3 space-y-2">
                    {audit.checks.map((c) => (
                      <li key={c.label} className="flex items-start gap-2 text-sm">
                        {statusIcon(c.status)}
                        <div>
                          <p className="text-white">{c.label}</p>
                          <p className="text-slate-400">{c.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {tab === 'citation' && (
            <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
              <h2 className="font-semibold text-white">Prompt Bank Kapsamı</h2>
              <p className="mt-1 text-sm text-slate-400">
                Marka mention sayfası: {citation?.brandMentionPages ?? 0}
              </p>
              <div className="mt-4 space-y-3">
                {(citation?.promptResults ?? data.citationPrompts.map((p) => ({
                  prompt: p.prompt,
                  brandCoverageScore: 0,
                  recommendation: 'GEO Sync çalıştırın',
                }))).map((p) => (
                  <div key={p.prompt} className="rounded-lg border border-slate-600 bg-slate-900/50 p-3">
                    <p className="text-sm font-medium text-white">{p.prompt}</p>
                    <p className="mt-1 text-xs text-emerald-400">Skor: {p.brandCoverageScore}%</p>
                    <p className="mt-1 text-xs text-slate-400">{p.recommendation}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'gbp' && (
            <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
              <h2 className="font-semibold text-white">Google Business Profile Checklist</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-300">
                {data.gbpChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
          )}

          {tab === 'reviews' && (
            <section className="space-y-4">
              {data.reviewTemplates.map((t) => (
                <div key={t.id} className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
                  <h3 className="font-medium text-emerald-300">{t.label}</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{t.text}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Değişkenler: {'{name}'}, {'{service}'}, {'{district}'}
                  </p>
                </div>
              ))}
            </section>
          )}

          {tab === 'competitors' && (
            <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
              <h2 className="font-semibold text-white">İzlenen Rakipler</h2>
              <ul className="mt-4 space-y-2">
                {data.competitors.map((c) => (
                  <li key={c} className="text-sm text-slate-300">{c}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500">
                GEO Sync, site içeriğinde rakip mention sayısını da raporlar.
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
