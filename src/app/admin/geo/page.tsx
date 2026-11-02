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
  ClipboardList,
} from 'lucide-react';

type DirectoryRow = {
  id: string;
  name: string;
  priority: string;
  configured: boolean;
  trackerStatus?: string;
  trackerNote?: string;
  connectionStatus?: string;
  listingUrl?: string | null;
  externalPlaceId?: string | null;
  lastManualSyncAt?: string | null;
  platform?: string | null;
};

type GeoDashboard = {
  nap: {
    name: string;
    telephoneDisplay: string;
    email: string;
    streetAddress: string;
    addressDisplay?: string;
    postalCode?: string;
  };
  gbpChecklist: string[];
  reviewTemplates: { id: string; label: string; text: string; preview?: string }[];
  reviewLink?: string;
  citationPrompts: { id: string; prompt: string; category: string }[];
  competitors: string[];
  directories: DirectoryRow[];
  stats: {
    publishedBlogs: number;
    geoPassageBlogs: number;
    geoSssPages: number;
    blogSchedule?: {
      overdue: number;
      dueToday: number;
      nextBatchAt: string | null;
      nextSlugs: string[];
    };
    blogsWithAutoInternalLinks?: number;
    indexNow?: { configured: boolean; keyLocation: string | null };
    placeIdConfigured?: boolean;
  };
  lastRun: {
    status: string;
    message: string | null;
    startedAt: string;
    stats: {
      audit?: { score: number; checks: { label: string; status: string; detail: string }[] };
      citation?: {
        overallScore: number;
        brandMentionPages: number;
        promptResults: {
          prompt: string;
          brandCoverageScore: number;
          recommendation: string;
        }[];
      };
    };
  } | null;
};

type MentionScorecard = {
  totalChecks: number;
  last30Days: number;
  brandMentionRate: number;
  urlCitationRate: number;
  avgScore: number;
  byEngine: Array<{
    engine: string;
    checks: number;
    brandMentions: number;
    urlCitations: number;
    avgScore: number;
  }>;
  byOutcome: Array<{ outcome: string; count: number }>;
  recentPromptCoverage: number;
};

type MentionCheck = {
  id: string;
  promptId: string;
  promptText: string;
  engine: string;
  outcome: string;
  brandMentioned: boolean;
  urlCited: boolean;
  checkedAt: string;
  notes?: string | null;
};

export default function AdminGeoPage() {
  const [data, setData] = useState<GeoDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<
    'overview' | 'citation' | 'mentions' | 'gbp' | 'reviews' | 'competitors'
  >('overview');

  const [scorecard, setScorecard] = useState<MentionScorecard | null>(null);
  const [checks, setChecks] = useState<MentionCheck[]>([]);
  const [engines, setEngines] = useState<{ id: string; label: string }[]>([]);
  const [outcomes, setOutcomes] = useState<{ id: string; label: string }[]>([]);
  const [prompts, setPrompts] = useState<{ id: string; prompt: string; category: string }[]>([]);
  const [mentionLoading, setMentionLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    promptId: '',
    promptText: '',
    engine: 'chatgpt',
    outcome: 'none',
    notes: '',
    citedUrl: '',
  });
  const [dirDrafts, setDirDrafts] = useState<
    Record<string, { connectionStatus: string; listingUrl: string; externalPlaceId: string }>
  >({});
  const [dirSaving, setDirSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/geo', { credentials: 'include' });
      if (!res.ok) throw new Error('GEO verisi yüklenemedi');
      const json = (await res.json()) as GeoDashboard;
      setData(json);
      const drafts: typeof dirDrafts = {};
      for (const d of json.directories) {
        drafts[d.id] = {
          connectionStatus: d.connectionStatus ?? 'not_connected',
          listingUrl: d.listingUrl ?? '',
          externalPlaceId: d.externalPlaceId ?? '',
        };
      }
      setDirDrafts(drafts);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Hata');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveDirectory = async (directoryId: string) => {
    const draft = dirDrafts[directoryId];
    if (!draft) return;
    try {
      setDirSaving(directoryId);
      setError(null);
      const res = await fetch('/api/admin/geo/directories', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directoryId,
          connectionStatus: draft.connectionStatus,
          listingUrl: draft.listingUrl.trim() || null,
          externalPlaceId: draft.externalPlaceId.trim() || null,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Dizin kaydı başarısız');
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Dizin kayıt hatası');
    } finally {
      setDirSaving(null);
    }
  };

  const loadMentions = useCallback(async () => {
    try {
      setMentionLoading(true);
      const res = await fetch('/api/admin/geo/mentions?limit=100', { credentials: 'include' });
      if (!res.ok) throw new Error('Mention skor kartı yüklenemedi');
      const json = await res.json();
      setScorecard(json.scorecard);
      setChecks(json.checks ?? []);
      setEngines(json.engines ?? []);
      setOutcomes(json.outcomes ?? []);
      setPrompts(json.prompts ?? []);
      setForm((f) => {
        if (f.promptId || !json.prompts?.[0]) return f;
        return {
          ...f,
          promptId: json.prompts[0].id,
          promptText: json.prompts[0].prompt,
        };
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Mention yükleme hatası');
    } finally {
      setMentionLoading(false);
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

  const saveMention = async () => {
    try {
      setSaving(true);
      setError(null);
      const res = await fetch('/api/admin/geo/mentions', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptId: form.promptId,
          promptText: form.promptText,
          engine: form.engine,
          outcome: form.outcome,
          notes: form.notes || null,
          citedUrl: form.citedUrl || null,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Kayıt başarısız');
      }
      setForm((f) => ({ ...f, notes: '', citedUrl: '', outcome: 'none' }));
      await loadMentions();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kayıt hatası');
    } finally {
      setSaving(false);
    }
  };

  const deleteMention = async (id: string) => {
    if (!confirm('Bu kaydı silmek istiyor musunuz?')) return;
    const res = await fetch(`/api/admin/geo/mentions?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      setError('Silme başarısız');
      return;
    }
    await loadMentions();
  };

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (tab === 'mentions') void loadMentions();
  }, [tab, loadMentions]);

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
    { id: 'mentions' as const, label: 'Mention Skor', icon: ClipboardList },
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
              <p className="text-xs text-slate-400">IndexNow</p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  data.stats.indexNow?.configured ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {data.stats.indexNow?.configured ? 'Aktif' : 'Eksik'}
              </p>
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
                  <div>
                    <dt className="text-slate-400">Marka</dt>
                    <dd className="text-white">{data.nap.name}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Telefon</dt>
                    <dd className="text-white">{data.nap.telephoneDisplay}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">E-posta</dt>
                    <dd className="text-white">{data.nap.email}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Adres</dt>
                    <dd className="text-white">
                      {data.nap.addressDisplay || data.nap.streetAddress}
                      {data.nap.postalCode ? ` · ${data.nap.postalCode}` : ''}
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs text-slate-500">
                  Place ID / yorum deep-link:{' '}
                  {data.stats.placeIdConfigured ? (
                    <span className="text-emerald-400">yapılandırıldı</span>
                  ) : (
                    <span className="text-amber-400">
                      eksik — admin Haritalar’da Place ID veya NEXT_PUBLIC_GBP_PLACE_ID
                    </span>
                  )}
                </p>
              </section>

              <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
                <h2 className="font-semibold text-white">Citation / dizin tracker</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Manuel takip — durum + URL DB’ye yazılır. Spam citation / otomatik scraping yok.
                </p>
                <ul className="mt-4 space-y-5">
                  {data.directories.map((d) => {
                    const draft = dirDrafts[d.id] ?? {
                      connectionStatus: d.connectionStatus ?? 'not_connected',
                      listingUrl: d.listingUrl ?? '',
                      externalPlaceId: d.externalPlaceId ?? '',
                    };
                    return (
                      <li
                        key={d.id}
                        className="rounded-lg border border-slate-600/80 bg-slate-900/40 p-4 text-sm"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          {d.configured || draft.connectionStatus === 'connected' ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                          )}
                          <span className="font-medium text-white">{d.name}</span>
                          <span className="text-slate-500">({d.priority})</span>
                        </div>
                        {d.trackerNote ? (
                          <p className="mt-1 text-xs text-slate-400">{d.trackerNote}</p>
                        ) : null}
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <label className="text-xs text-slate-400">
                            Durum
                            <select
                              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-white"
                              value={draft.connectionStatus}
                              onChange={(e) =>
                                setDirDrafts((prev) => ({
                                  ...prev,
                                  [d.id]: { ...draft, connectionStatus: e.target.value },
                                }))
                              }
                            >
                              <option value="not_connected">Bağlı değil</option>
                              <option value="in_progress">Devam ediyor</option>
                              <option value="connected">Bağlı / doğrulandı</option>
                            </select>
                          </label>
                          <label className="text-xs text-slate-400">
                            Profil URL
                            <input
                              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-white"
                              value={draft.listingUrl}
                              onChange={(e) =>
                                setDirDrafts((prev) => ({
                                  ...prev,
                                  [d.id]: { ...draft, listingUrl: e.target.value },
                                }))
                              }
                              placeholder="https://..."
                            />
                          </label>
                          {d.id === 'google-business' ? (
                            <label className="sm:col-span-2 text-xs text-slate-400">
                              Google Place ID (yorum deep-link)
                              <input
                                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-white"
                                value={draft.externalPlaceId}
                                onChange={(e) =>
                                  setDirDrafts((prev) => ({
                                    ...prev,
                                    [d.id]: { ...draft, externalPlaceId: e.target.value },
                                  }))
                                }
                                placeholder="ChIJ..."
                              />
                            </label>
                          ) : null}
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            disabled={dirSaving === d.id}
                            onClick={() => void saveDirectory(d.id)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                          >
                            {dirSaving === d.id ? 'Kaydediliyor…' : 'Kaydet'}
                          </button>
                          {d.lastManualSyncAt ? (
                            <span className="text-[11px] text-slate-500">
                              Son kayıt: {new Date(d.lastManualSyncAt).toLocaleString('tr-TR')}
                            </span>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
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

              {data.stats.blogSchedule && (
                <section className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5">
                  <h2 className="font-semibold text-white">Blog Otomasyon Durumu</h2>
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-slate-400">Gecikmiş (due)</dt>
                      <dd className="text-white">{data.stats.blogSchedule.overdue}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Bugün due</dt>
                      <dd className="text-white">{data.stats.blogSchedule.dueToday}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-slate-400">Sonraki batch</dt>
                      <dd className="text-white">
                        {data.stats.blogSchedule.nextBatchAt
                          ? new Date(data.stats.blogSchedule.nextBatchAt).toLocaleString('tr-TR')
                          : '—'}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-2 text-xs text-slate-400">
                    Cron: her gün 08:00 TR · Vercel&apos;de CRON_SECRET zorunlu
                  </p>
                  <dl className="mt-3 grid gap-2 border-t border-blue-500/20 pt-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-slate-400">Otomatik iç link</dt>
                      <dd className="text-white">
                        {data.stats.blogsWithAutoInternalLinks ?? 0} yayında
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">GEO SSS</dt>
                      <dd className="text-white">{data.stats.geoSssPages}</dd>
                    </div>
                  </dl>
                </section>
              )}
            </div>
          )}

          {tab === 'citation' && (
            <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
              <h2 className="font-semibold text-white">Prompt Bank Kapsamı (içerik)</h2>
              <p className="mt-1 text-sm text-slate-400">
                Site içeriğinde marka mention: {citation?.brandMentionPages ?? 0} — canlı AI
                yanıtları için Mention Skor sekmesini kullanın.
              </p>
              <div className="mt-4 space-y-3">
                {(
                  citation?.promptResults ??
                  data.citationPrompts.map((p) => ({
                    prompt: p.prompt,
                    brandCoverageScore: 0,
                    recommendation: 'GEO Sync çalıştırın',
                  }))
                ).map((p) => (
                  <div key={p.prompt} className="rounded-lg border border-slate-600 bg-slate-900/50 p-3">
                    <p className="text-sm font-medium text-white">{p.prompt}</p>
                    <p className="mt-1 text-xs text-emerald-400">Skor: {p.brandCoverageScore}%</p>
                    <p className="mt-1 text-xs text-slate-400">{p.recommendation}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'mentions' && (
            <div className="space-y-4">
              {mentionLoading && <p className="text-slate-400">Mention verisi yükleniyor…</p>}
              {scorecard && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                    <p className="text-xs text-slate-400">Toplam kontrol</p>
                    <p className="mt-1 text-2xl font-bold text-white">{scorecard.totalChecks}</p>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                    <p className="text-xs text-slate-400">Marka mention %</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-400">
                      {scorecard.brandMentionRate}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                    <p className="text-xs text-slate-400">URL atıf %</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-400">
                      {scorecard.urlCitationRate}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                    <p className="text-xs text-slate-400">Prompt kapsama (30g)</p>
                    <p className="mt-1 text-2xl font-bold text-white">
                      {scorecard.recentPromptCoverage}%
                    </p>
                  </div>
                </div>
              )}

              <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
                <h2 className="font-semibold text-white">Yeni manuel kontrol</h2>
                <p className="mt-1 text-xs text-slate-400">
                  ChatGPT / Perplexity / Gemini / AI Overviews’ta prompt’u çalıştırıp sonucu kaydedin.
                  Otomatik scraping yok.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-sm text-slate-300">
                    Prompt
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white"
                      value={form.promptId}
                      onChange={(e) => {
                        const p = prompts.find((x) => x.id === e.target.value);
                        setForm((f) => ({
                          ...f,
                          promptId: e.target.value,
                          promptText: p?.prompt ?? f.promptText,
                        }));
                      }}
                    >
                      {prompts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.prompt}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm text-slate-300">
                    Motor
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white"
                      value={form.engine}
                      onChange={(e) => setForm((f) => ({ ...f, engine: e.target.value }))}
                    >
                      {engines.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm text-slate-300">
                    Sonuç
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white"
                      value={form.outcome}
                      onChange={(e) => setForm((f) => ({ ...f, outcome: e.target.value }))}
                    >
                      {outcomes.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm text-slate-300">
                    Atıf URL (opsiyonel)
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white"
                      value={form.citedUrl}
                      onChange={(e) => setForm((f) => ({ ...f, citedUrl: e.target.value }))}
                      placeholder="https://..."
                    />
                  </label>
                  <label className="sm:col-span-2 text-sm text-slate-300">
                    Not
                    <textarea
                      className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white"
                      rows={2}
                      value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  disabled={saving || !form.promptId}
                  onClick={() => void saveMention()}
                  className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {saving ? 'Kaydediliyor…' : 'Kontrolü kaydet'}
                </button>
              </section>

              {scorecard && scorecard.byEngine.length > 0 && (
                <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
                  <h2 className="font-semibold text-white">Motor bazlı özet</h2>
                  <ul className="mt-3 space-y-2 text-sm">
                    {scorecard.byEngine.map((e) => (
                      <li
                        key={e.engine}
                        className="flex flex-wrap gap-3 rounded-lg border border-slate-600 bg-slate-900/40 px-3 py-2 text-slate-300"
                      >
                        <span className="font-medium text-white">{e.engine}</span>
                        <span>{e.checks} kontrol</span>
                        <span>marka {e.brandMentions}</span>
                        <span>URL {e.urlCitations}</span>
                        <span>ort. skor {e.avgScore}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
                <h2 className="font-semibold text-white">Son kayıtlar</h2>
                <ul className="mt-3 space-y-2">
                  {checks.length === 0 && (
                    <li className="text-sm text-slate-400">Henüz kayıt yok — ilk baseline’ı girin.</li>
                  )}
                  {checks.map((c) => (
                    <li
                      key={c.id}
                      className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-slate-600 bg-slate-900/40 p-3 text-sm"
                    >
                      <div>
                        <p className="text-white">{c.promptText}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {c.engine} · {c.outcome} ·{' '}
                          {new Date(c.checkedAt).toLocaleString('tr-TR')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void deleteMention(c.id)}
                        className="text-xs text-red-300 hover:text-red-200"
                      >
                        Sil
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
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
              {data.reviewLink ? (
                <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                  Aktif yorum linki: {data.reviewLink}
                </p>
              ) : null}
              {data.reviewTemplates.map((t) => (
                <div key={t.id} className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
                  <h3 className="font-medium text-emerald-300">{t.label}</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">
                    {t.preview || t.text}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Değişkenler: {'{name}'}, {'{service}'}, {'{district}'}, {'{reviewLink}'}
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
                  <li key={c} className="text-sm text-slate-300">
                    {c}
                  </li>
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
