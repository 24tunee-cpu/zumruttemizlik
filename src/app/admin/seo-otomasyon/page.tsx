'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { DISTRICT_LANDINGS, SERVICE_LANDINGS } from '@/config/programmatic-seo';
import { buildSmartMetaForPair } from '@/lib/programmatic-smart-meta';
import { getSiteUrl } from '@/lib/seo';
import {
  RefreshCw,
  Upload,
  Save,
  Trash2,
  CheckCircle2,
  Lightbulb,
  FileUp,
  Zap,
  MapPin,
  PanelsTopLeft,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

type TabId = 'otomasyon' | 'bolgeler' | 'kontrol';

type OverrideRow = {
  id: string;
  key: string;
  district: string;
  service: string;
  title: string | null;
  description: string | null;
  isActive: boolean;
};

type GscAnalysisReport = {
  parsedRows: number;
  uniquePages: number;
  fileCount?: number;
  stats: {
    programmatic: number;
    blog: number;
    skippedUnknown: number;
    skippedDuplicateCannibal: number;
  };
  programmatic: Array<{
    id: string;
    key: string;
    pagePath: string;
    title: string;
    description: string;
    variant: string;
    query: string;
    impressions: number;
    ctr: number;
    position: number;
    reason: string;
  }>;
  blog: Array<{
    id: string;
    slug: string;
    pagePath: string;
    title: string;
    description: string;
    variant: string;
    query: string;
    impressions: number;
    ctr: number;
    position: number;
    reason: string;
  }>;
  cannibalization: Array<{ query: string; pages: string[]; recommendation: string }>;
  lowCtr: Array<{ pagePath: string; query: string; impressions: number; ctr: number; position: number; hint: string }>;
  quickWins: Array<{ pagePath: string; query: string; impressions: number; ctr: number; position: number; hint: string }>;
  skippedSamples: string[];
};

type ChecklistRow = {
  id: string;
  key: string;
  section: string;
  label: string;
  completed: boolean;
  completedAt: string | null;
  note: string | null;
};

type SyncInfo = {
  id: string;
  source: string;
  status: string;
  message: string | null;
  startedAt: string;
  finishedAt: string | null;
  stats?: Record<string, unknown> | null;
};

type Recommendation = {
  id: string;
  priority: 'high' | 'medium' | 'low';
  type: 'meta' | 'content' | 'cta' | 'checklist';
  title: string;
  detail: string;
  key?: string;
};

const emptyForm = {
  district: DISTRICT_LANDINGS[0]?.slug || '',
  service: SERVICE_LANDINGS[0]?.slug || '',
  title: '',
  description: '',
};

const SAMPLE_GSC_CSV = `query,page,clicks,impressions,ctr,position
atasehir ofis temizligi,https://www.zumrutvaditemizlik.com/bolgeler/atasehir/ofis-temizligi,12,740,1.62,8.4
kadikoy koltuk yikama,https://www.zumrutvaditemizlik.com/bolgeler/kadikoy/koltuk-yikama,9,515,1.74,9.2
uskudar insaat sonrasi temizlik,https://www.zumrutvaditemizlik.com/bolgeler/uskudar/insaat-sonrasi-temizlik,6,401,1.49,11.7`;

const TABS: { id: TabId; label: string; hint: string }[] = [
  { id: 'otomasyon', label: 'Tam otomasyon', hint: 'Tek akış: meta + isteğe bağlı GSC' },
  { id: 'bolgeler', label: 'Bölgeler', hint: 'İlçe detayı ve örnek SEO metni' },
  { id: 'kontrol', label: 'Kontrol', hint: 'Öneriler, checklist, tablo' },
];

export default function SeoAutomationPage() {
  const [tab, setTab] = useState<TabId>('otomasyon');
  const [rows, setRows] = useState<OverrideRow[]>([]);
  const [checklist, setChecklist] = useState<ChecklistRow[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [latestSync, setLatestSync] = useState<SyncInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [csv, setCsv] = useState('');
  const [csvFileNames, setCsvFileNames] = useState<string[]>([]);
  const [csvSources, setCsvSources] = useState<string[]>([]);
  const [gscReport, setGscReport] = useState<GscAnalysisReport | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [checklistSavingKey, setChecklistSavingKey] = useState<string | null>(null);
  const [syncingChecklist, setSyncingChecklist] = useState(false);
  const [smartBusy, setSmartBusy] = useState(false);
  const [megaBusy, setMegaBusy] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [districtQuery, setDistrictQuery] = useState('');
  const [previewServiceSlug, setPreviewServiceSlug] = useState(SERVICE_LANDINGS[0]?.slug || 'ofis-temizligi');

  const key = useMemo(() => `${form.district}/${form.service}`, [form.district, form.service]);
  const checklistSummary = useMemo(() => {
    const completed = checklist.filter((x) => x.completed).length;
    const total = checklist.length;
    return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
  }, [checklist]);

  const filteredDistricts = useMemo(() => {
    const q = districtQuery.trim().toLowerCase();
    if (!q) return DISTRICT_LANDINGS;
    return DISTRICT_LANDINGS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.slug.includes(q) ||
        d.neighborhoods.some((n) => n.toLowerCase().includes(q))
    );
  }, [districtQuery]);

  const previewService = useMemo(
    () => SERVICE_LANDINGS.find((s) => s.slug === previewServiceSlug) ?? SERVICE_LANDINGS[0],
    [previewServiceSlug]
  );

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [metaRes, checklistRes, recoRes] = await Promise.all([
        fetch('/api/admin/programmatic-meta', { credentials: 'include' }),
        fetch('/api/admin/seo-checklist', { credentials: 'include' }),
        fetch('/api/admin/seo-recommendations', { credentials: 'include' }),
      ]);

      if (!metaRes.ok) throw new Error(`Meta verisi yüklenemedi (${metaRes.status})`);
      if (!checklistRes.ok) throw new Error(`Checklist yüklenemedi (${checklistRes.status})`);
      if (!recoRes.ok) throw new Error(`Öneriler yüklenemedi (${recoRes.status})`);

      const metaData = (await metaRes.json()) as OverrideRow[];
      const checklistData = (await checklistRes.json()) as { rows?: ChecklistRow[]; latestSync?: SyncInfo };
      const recoData = (await recoRes.json()) as { recommendations?: Recommendation[] };

      setRows(Array.isArray(metaData) ? metaData : []);
      setChecklist(Array.isArray(checklistData.rows) ? checklistData.rows : []);
      setLatestSync(checklistData.latestSync || null);
      setRecommendations(Array.isArray(recoData.recommendations) ? recoData.recommendations : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const saveOverride = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/programmatic-meta', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          district: form.district,
          service: form.service,
          title: form.title.trim() || null,
          description: form.description.trim() || null,
          isActive: true,
        }),
      });
      if (!res.ok) throw new Error(`Kaydedilemedi (${res.status})`);
      await load();
      setImportMsg('Override kaydedildi.');
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : 'Kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const deleteOverride = async (overrideKey: string) => {
    const ok = window.confirm(`${overrideKey} silinsin mi?`);
    if (!ok) return;
    await fetch('/api/admin/programmatic-meta', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: overrideKey }),
    });
    await load();
  };

  const applySuggestionToForm = (key: string, title: string, description: string) => {
    const [district, service] = key.split('/');
    if (!district || !service) return;
    setForm({
      district,
      service,
      title,
      description,
    });
    setTab('kontrol');
    setImportMsg(`${key} önerisi manuel forma alındı.`);
  };

  const onCsvFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    const texts: string[] = [];
    const names: string[] = [];
    for (const file of Array.from(files)) {
      texts.push(await file.text());
      names.push(file.name);
    }
    setCsv(texts.join('\n\n'));
    setCsvSources(texts);
    setCsvFileNames(names);
    setGscReport(null);
    const totalKb = Array.from(files).reduce((a, f) => a + f.size, 0);
    setImportMsg(`${files.length} dosya yüklendi (${Math.round(totalKb / 1024)} KB). Analiz et ile devam edin.`);
    event.target.value = '';
  };

  const runGscAnalyze = async () => {
    try {
      setImportLoading(true);
      setImportMsg(null);
      const res = await fetch('/api/admin/seo-gsc-import', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvFiles: csvSources.length > 0 ? csvSources : csv.trim() ? [csv.trim()] : [],
        }),
      });
      const body = (await res.json()) as GscAnalysisReport & { error?: string; fileCount?: number };
      if (!res.ok) throw new Error(body.error || `Analiz hatası (${res.status})`);
      setGscReport(body);
      setImportMsg(
        `${body.parsedRows} satır · ${body.stats.programmatic} bölge + ${body.stats.blog} blog önerisi · ${body.cannibalization.length} cannibalization uyarısı`
      );
      setTab('kontrol');
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : 'Analiz hatası');
    } finally {
      setImportLoading(false);
    }
  };

  const runGscApplyAll = async () => {
    if (!gscReport) return;
    const total = gscReport.programmatic.length + gscReport.blog.length;
    const ok = window.confirm(
      `${total} meta güncellemesi uygulanacak (${gscReport.programmatic.length} ilçe+hizmet, ${gscReport.blog.length} blog). Devam?`
    );
    if (!ok) return;
    try {
      setImportLoading(true);
      const res = await fetch('/api/admin/seo-gsc-import', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apply: true,
          programmatic: gscReport.programmatic,
          blog: gscReport.blog,
        }),
      });
      const body = (await res.json()) as {
        error?: string;
        programmaticApplied?: number;
        blogApplied?: number;
        totalApplied?: number;
        errors?: string[];
      };
      if (!res.ok) throw new Error(body.error || `Uygulama hatası (${res.status})`);
      setImportMsg(
        `Uygulandı: ${body.programmaticApplied ?? 0} bölge, ${body.blogApplied ?? 0} blog` +
          (body.errors?.length ? ` · ${body.errors.length} uyarı` : '')
      );
      await load();
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : 'Uygulama hatası');
    } finally {
      setImportLoading(false);
    }
  };

  const loadSampleCsv = () => {
    setCsv(SAMPLE_GSC_CSV);
    setCsvSources([SAMPLE_GSC_CSV]);
    setCsvFileNames(['ornek-gsc.csv']);
    setGscReport(null);
    setImportMsg('Örnek CSV dolduruldu. Analiz et ile test edebilirsiniz.');
  };

  const toggleChecklist = async (row: ChecklistRow, completed: boolean) => {
    try {
      setChecklistSavingKey(row.key);
      const res = await fetch('/api/admin/seo-checklist', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: row.key,
          completed,
          note: row.note || null,
        }),
      });
      if (!res.ok) throw new Error(`Checklist güncellenemedi (${res.status})`);
      await load();
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : 'Checklist güncellenemedi.');
    } finally {
      setChecklistSavingKey(null);
    }
  };

  const runChecklistAutomation = async () => {
    try {
      setSyncingChecklist(true);
      const res = await fetch('/api/admin/seo-checklist/auto-sync', {
        method: 'POST',
        credentials: 'include',
      });
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) throw new Error(body?.message || `Checklist otomasyon hatası (${res.status})`);
      setImportMsg(body?.message || 'Checklist otomasyon tamamlandı.');
      await load();
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : 'Checklist otomasyon çalıştırılamadı.');
    } finally {
      setSyncingChecklist(false);
    }
  };

  const runSmartBulk = async (mode: 'missing' | 'all'): Promise<boolean> => {
    if (mode === 'all') {
      const ok = window.confirm(
        'Tüm ilçe+hizmet sayfalarının title ve açıklaması akıllı şablonla yeniden yazılacak. Devam edilsin mi?'
      );
      if (!ok) return false;
    }
    try {
      setSmartBusy(true);
      setImportMsg(null);
      const res = await fetch('/api/admin/seo-smart-bulk', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string; upserted?: number; skipped?: number };
      if (!res.ok) throw new Error(body.error || `Akıllı toplu güncelleme (${res.status})`);
      setImportMsg(
        `Akıllı meta tamam: ${body.upserted ?? 0} sayfa güncellendi, ${body.skipped ?? 0} atlandı (${mode === 'missing' ? 'sadece eksikler' : 'tümü'}).`
      );
      await load();
      return true;
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : 'Akıllı toplu güncelleme başarısız.');
      return false;
    } finally {
      setSmartBusy(false);
    }
  };

  const runFullAutomation = async () => {
    try {
      setMegaBusy(true);
      setImportMsg(null);
      const metaOk = await runSmartBulk('missing');
      if (metaOk) await runChecklistAutomation();
    } finally {
      setMegaBusy(false);
    }
  };

  const landingCount = DISTRICT_LANDINGS.length * SERVICE_LANDINGS.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SEO Otomasyon</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            {landingCount} programatik sayfa (ilçe × hizmet). Önce <strong>tam otomasyon</strong> ile eksik meta
            doldurulur; isterseniz Search Console CSV ile ince ayar yaparsınız.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
          Yenile
        </button>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2 dark:border-slate-700 dark:bg-slate-900/50">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex flex-1 min-w-[140px] flex-col rounded-lg px-4 py-2 text-left text-sm transition-colors ${
              tab === t.id
                ? 'bg-white font-semibold text-emerald-800 shadow-sm dark:bg-slate-800 dark:text-emerald-300'
                : 'text-slate-600 hover:bg-white/70 dark:text-slate-400 dark:hover:bg-slate-800/70'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              {t.id === 'otomasyon' && <Zap className="h-4 w-4 shrink-0" />}
              {t.id === 'bolgeler' && <MapPin className="h-4 w-4 shrink-0" />}
              {t.id === 'kontrol' && <PanelsTopLeft className="h-4 w-4 shrink-0" />}
              {t.label}
            </span>
            <span className="mt-0.5 text-xs font-normal text-slate-500 dark:text-slate-500">{t.hint}</span>
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Operasyon özeti</h2>
            <p className="mt-1 text-sm text-emerald-700/90 dark:text-emerald-200/80">
              Checklist: {checklistSummary.completed}/{checklistSummary.total} ({checklistSummary.percent}%)
            </p>
            {latestSync?.finishedAt && (
              <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-200/70">
                Son kayıt: {new Date(latestSync.finishedAt).toLocaleString('tr-TR')} — {latestSync.message || latestSync.status}
              </p>
            )}
          </div>
          <div className="h-3 w-full max-w-xs overflow-hidden rounded-full bg-emerald-200 dark:bg-emerald-900/50">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${checklistSummary.percent}%` }}
            />
          </div>
        </div>
      </section>

      {importMsg && (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {importMsg}
        </p>
      )}

      {tab === 'otomasyon' && (
        <div className="space-y-6">
          <section className="rounded-xl border-2 border-emerald-300/60 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-800/50 dark:from-emerald-950/30 dark:to-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Bir tık: tam otomasyon</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Tüm ilçe + hizmet sayfalarında <strong>boş veya eksik</strong> title/açıklama varsa akıllı şablonla doldurur;
              ardından Search Console verisi varsa checklist otomasyonunu çalıştırır. GSC CSV şart değildir.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={megaBusy || smartBusy || syncingChecklist}
                onClick={() => void runFullAutomation()}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
              >
                <Zap className="h-4 w-4" />
                {megaBusy ? 'Çalışıyor…' : 'Tam otomasyonu çalıştır'}
              </button>
              <button
                type="button"
                disabled={smartBusy || megaBusy}
                onClick={() => void runSmartBulk('missing')}
                className="rounded-lg border border-emerald-400 bg-white/80 px-4 py-2.5 text-sm font-medium text-emerald-800 hover:bg-white disabled:opacity-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-200"
              >
                Sadece eksik meta doldur
              </button>
              <button
                type="button"
                disabled={smartBusy || megaBusy}
                onClick={() => void runSmartBulk('all')}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Tüm sayfaları yeniden yaz
              </button>
            </div>
          </section>

          <section className="rounded-xl border-2 border-blue-200/80 bg-gradient-to-br from-blue-50/80 to-white p-5 dark:border-blue-900/40 dark:from-blue-950/20 dark:to-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Search Console — tam CSV analizi</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              GSC Performans → <strong>Sorgu + Sayfa</strong> boyutlu export (veya birden fazla CSV) yükleyin.
              Tüm satırlar analiz edilir: ilçe sayfaları, blog, A/B meta (düşük CTR → CTA), cannibalization uyarıları.
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs text-slate-500 dark:text-slate-400">
              <li>Search Console → Performans → Son 28 gün</li>
              <li>Tablo: Sorgu + Sayfa (veya ayrı ayrı 2 export)</li>
              <li>Dışa aktar → ZIP açın → <strong>Queries.csv</strong> ve <strong>Pages.csv</strong> dosyalarını birlikte seçin</li>
              <li>Performans tablosunda Sorgu+Sayfa birlikte seçiliyse tek CSV de olur</li>
            </ol>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800">
                <FileUp className="h-4 w-4" />
                CSV seç (çoklu)
                <input type="file" accept=".csv,text/csv" multiple onChange={onCsvFileChange} className="hidden" />
              </label>
              <button
                type="button"
                onClick={loadSampleCsv}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Örnek CSV
              </button>
              {csvFileNames.length > 0 && (
                <span className="text-xs text-slate-500">{csvFileNames.join(', ')}</span>
              )}
            </div>
            <textarea
              value={csv}
              onChange={(e) => {
                setCsv(e.target.value);
                setCsvSources([e.target.value]);
                setGscReport(null);
              }}
              rows={5}
              placeholder="query,page,clicks,impressions,ctr,position — veya GSC Türkçe export"
              className="mt-3 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={importLoading || !csv.trim()}
                onClick={() => void runGscAnalyze()}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {importLoading ? 'Analiz…' : 'Analiz et'}
              </button>
              <button
                type="button"
                disabled={importLoading || !gscReport}
                onClick={() => void runGscApplyAll()}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Hepsini uygula
              </button>
            </div>
            {gscReport && (
              <p className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                Hazır: {gscReport.stats.programmatic + gscReport.stats.blog} öneri — Kontrol sekmesinde detaylı rapor
              </p>
            )}
          </section>

          <details className="group rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <span>Eski: yalnızca checklist otomasyonu (GSC API gerekmez)</span>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-slate-200 p-4 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                GSC CSV kullanmadan eksik meta doldurma ve checklist senkronu.
              </p>
            </div>
          </details>
        </div>
      )}

      {tab === 'bolgeler' && (
        <div className="space-y-4">
          <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">İlçe rehberi</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {DISTRICT_LANDINGS.length} ilçe; her biri mahalle listesi, yaka ve yerel kopya ile sayfada kullanılır. Arama:
              ilçe adı, slug veya mahalle.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <input
                value={districtQuery}
                onChange={(e) => setDistrictQuery(e.target.value)}
                placeholder="Örn. kadıköy, göztepe…"
                className="min-w-[200px] flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <select
                value={previewServiceSlug}
                onChange={(e) => setPreviewServiceSlug(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {SERVICE_LANDINGS.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    Örnek meta: {s.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredDistricts.map((d) => {
              const meta = previewService ? buildSmartMetaForPair(d, previewService) : null;
              const side =
                d.side === 'anadolu' ? 'Anadolu' : d.side === 'avrupa' ? 'Avrupa' : '—';
              return (
                <article
                  key={d.slug}
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{d.name}</h3>
                      <p className="text-xs text-slate-500">
                        {side} · {d.neighborhoods.length} mahalle/semin
                      </p>
                    </div>
                    <a
                      href={`${getSiteUrl()}/bolgeler/${d.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-500"
                    >
                      Bölge sayfası
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{d.regionBlurb || d.populationNote}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">Mahalleler</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {d.neighborhoods.map((n) => (
                      <span
                        key={n}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                  {meta && previewService && (
                    <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-xs dark:border-slate-600 dark:bg-slate-800/50">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        Otomatik örnek — {previewService.name}
                      </p>
                      <p className="mt-1 text-slate-700 dark:text-slate-300">
                        <span className="text-slate-500">Title:</span> {meta.title}
                      </p>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">
                        <span className="text-slate-500">Desc:</span> {meta.description}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          {filteredDistricts.length === 0 && (
            <p className="text-sm text-slate-500">Eşleşen ilçe yok; aramayı değiştirin.</p>
          )}
        </div>
      )}

      {tab === 'kontrol' && (
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Otomatik SEO önerileri</h2>
              <button
                type="button"
                disabled={syncingChecklist}
                onClick={() => void runChecklistAutomation()}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-800"
              >
                {syncingChecklist ? 'Senkron…' : 'Checklist otomasyonu'}
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {recommendations.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        item.priority === 'high'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                          : item.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  {item.type === 'meta' && item.key && (
                    <button
                      type="button"
                      onClick={() => {
                        const [district, service] = item.key!.split('/');
                        if (!district || !service) return;
                        setForm((p) => ({ ...p, district, service }));
                      }}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-500"
                    >
                      <Lightbulb className="h-3.5 w-3.5" />
                      Manuel editörde aç
                    </button>
                  )}
                </div>
              ))}
              {recommendations.length === 0 && <p className="text-sm text-slate-500">Şimdilik öneri yok.</p>}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Search Console checklist</h2>
            <div className="mt-3 space-y-2">
              {checklist.map((item) => (
                <label
                  key={item.key}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-500"
                    checked={item.completed}
                    disabled={checklistSavingKey === item.key}
                    onChange={(e) => void toggleChecklist(item, e.target.checked)}
                  />
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {item.section}
                    </p>
                    <p className="text-sm text-slate-800 dark:text-slate-200">{item.label}</p>
                    {item.completedAt && (
                      <p className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {new Date(item.completedAt).toLocaleString('tr-TR')}
                      </p>
                    )}
                  </div>
                </label>
              ))}
              {checklist.length === 0 && <p className="text-sm text-slate-500">Checklist yüklenemedi.</p>}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Manuel override</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <select
                value={form.district}
                onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {DISTRICT_LANDINGS.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </select>
              <select
                value={form.service}
                onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {SERVICE_LANDINGS.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Özel başlık"
                className="md:col-span-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                placeholder="Özel açıklama"
                className="md:col-span-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const d = DISTRICT_LANDINGS.find((x) => x.slug === form.district);
                  const s = SERVICE_LANDINGS.find((x) => x.slug === form.service);
                  if (d && s) {
                    const m = buildSmartMetaForPair(d, s);
                    setForm((p) => ({ ...p, title: m.title, description: m.description }));
                    setImportMsg(`${key} için akıllı şablon forma yüklendi.`);
                  }
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
              >
                Akıllı şablonu forma doldur
              </button>
              <button
                type="button"
                onClick={() => void saveOverride()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Kaydediliyor…' : `${key} kaydet`}
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Kayıtlı override’lar</h2>
            {loading ? (
              <p className="mt-3 text-sm text-slate-500">Yükleniyor…</p>
            ) : error ? (
              <p className="mt-3 text-sm text-red-500">{error}</p>
            ) : (
              <div className="mt-3 overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="px-2 py-2">Key</th>
                      <th className="px-2 py-2">Title</th>
                      <th className="px-2 py-2">Description</th>
                      <th className="px-2 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="px-2 py-2 text-slate-700 dark:text-slate-300">{row.key}</td>
                        <td className="px-2 py-2 text-slate-900 dark:text-slate-100">{row.title || '—'}</td>
                        <td className="px-2 py-2 text-slate-600 dark:text-slate-400">{row.description || '—'}</td>
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            onClick={() => void deleteOverride(row.key)}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="h-4 w-4" />
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-2 py-6 text-center text-slate-500">
                          Henüz override yok — tam otomasyon ile doldurabilirsiniz.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {gscReport && (
            <section className="space-y-4 rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">GSC analiz raporu</h2>
                <button
                  type="button"
                  disabled={importLoading}
                  onClick={() => void runGscApplyAll()}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {gscReport.stats.programmatic + gscReport.stats.blog} öneriyi uygula
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
                  <p className="text-xs text-slate-500">Parse edilen satır</p>
                  <p className="text-lg font-bold">{gscReport.parsedRows}</p>
                </div>
                <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
                  <p className="text-xs text-slate-500">Bölge + hizmet</p>
                  <p className="text-lg font-bold text-emerald-600">{gscReport.stats.programmatic}</p>
                </div>
                <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
                  <p className="text-xs text-slate-500">Blog meta</p>
                  <p className="text-lg font-bold text-emerald-600">{gscReport.stats.blog}</p>
                </div>
                <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
                  <p className="text-xs text-slate-500">Cannibalization</p>
                  <p className="text-lg font-bold text-amber-600">{gscReport.cannibalization.length}</p>
                </div>
              </div>

              {gscReport.cannibalization.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                  <h3 className="text-xs font-semibold uppercase text-amber-800 dark:text-amber-300">Cannibalization</h3>
                  <ul className="mt-2 max-h-40 space-y-2 overflow-auto text-xs">
                    {gscReport.cannibalization.slice(0, 15).map((c) => (
                      <li key={c.query}>
                        <strong>{c.query}</strong> → {c.pages.length} sayfa. {c.recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {gscReport.quickWins.length > 0 && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-900/40">
                  <h3 className="text-xs font-semibold uppercase text-emerald-800 dark:text-emerald-300">
                    Hızlı kazanım (konum 4–15)
                  </h3>
                  <ul className="mt-2 max-h-32 space-y-1 overflow-auto text-xs text-slate-700 dark:text-slate-300">
                    {gscReport.quickWins.slice(0, 10).map((q) => (
                      <li key={`${q.pagePath}-${q.query}`}>
                        {q.pagePath} · {q.query} · {q.impressions} gösterim · #{q.position.toFixed(1)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="max-h-[420px] overflow-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="px-2 py-2">Tip</th>
                      <th className="px-2 py-2">URL / Key</th>
                      <th className="px-2 py-2">A/B</th>
                      <th className="px-2 py-2">Query</th>
                      <th className="px-2 py-2">Title</th>
                      <th className="px-2 py-2">Gösterim</th>
                      <th className="px-2 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {[...gscReport.programmatic.map((s) => ({ ...s, tip: 'Bölge' as const, idKey: s.key })), ...gscReport.blog.map((s) => ({ ...s, tip: 'Blog' as const, idKey: s.slug, key: s.slug }))].map((s) => (
                      <tr key={s.id} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="px-2 py-2">{s.tip}</td>
                        <td className="max-w-[120px] truncate px-2 py-2" title={s.pagePath}>
                          {s.idKey}
                        </td>
                        <td className="px-2 py-2">
                          <span className={s.variant === 'cta' ? 'text-amber-600' : 'text-blue-600'}>
                            {s.variant}
                          </span>
                        </td>
                        <td className="max-w-[100px] truncate px-2 py-2">{s.query}</td>
                        <td className="max-w-[180px] truncate px-2 py-2" title={s.title}>
                          {s.title}
                        </td>
                        <td className="px-2 py-2">{s.impressions}</td>
                        <td className="px-2 py-2">
                          {s.tip === 'Bölge' && (
                            <button
                              type="button"
                              onClick={() => applySuggestionToForm(s.key, s.title, s.description)}
                              className="rounded border border-slate-300 px-1.5 py-0.5 hover:bg-slate-50 dark:border-slate-600"
                            >
                              Form
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {gscReport.skippedSamples.length > 0 && (
                <p className="text-xs text-slate-500">
                  Atlanan URL örnekleri ({gscReport.stats.skippedUnknown}):{' '}
                  {gscReport.skippedSamples.slice(0, 5).join(', ')}
                </p>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
