'use client';

import SeoAutopilotPanel from '@/components/admin/SeoAutopilotPanel';
import { useAuth } from '@/hooks/useAuth';
import { GSC_DISCOVERY_CHECKLIST } from '@/lib/discovery-checklist';

export default function SeoAutopilotMonitorPage() {
  useAuth();

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          SEO Autopilot izleme
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Günlük otomasyon koşuları, içerik kuyrukları ve sağlık durumu — canlı veritabanı.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
        <SeoAutopilotPanel />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
        <p className="font-medium text-slate-800 dark:text-slate-200">Günlük limitler</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
          <li>Blog yayını: 10/gün · Geo-SSS: 3/gün · GSC taslak: 2/gün</li>
          <li>Blog yenileme: 2/gün · Meta A/B: 8/gün · IndexNow: 50 URL · WebSub feed ping</li>
          <li>Pazartesi: Maps testimonial + tam GEO/GSC sync</li>
        </ul>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-slate-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-slate-300">
        <p className="font-medium text-emerald-900 dark:text-emerald-200">
          Google keşif checklist (manuel)
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1.5 text-xs">
          {GSC_DISCOVERY_CHECKLIST.map((item) => (
            <li key={item.id}>
              <span className="font-medium">{item.title}:</span> {item.detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
