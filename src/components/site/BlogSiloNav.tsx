import Link from 'next/link';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import { BLOG_SILO_CLUSTERS } from '@/config/blog-silo-clusters';

export function BlogSiloNav() {
  return (
    <section
      className="border-b border-slate-800 bg-slate-900/50 py-10"
      aria-labelledby="blog-silo-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-emerald-400" aria-hidden="true" />
          <h2 id="blog-silo-heading" className="text-lg font-bold text-white sm:text-xl">
            Konu Siloları
          </h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          İnşaat sonrası, taşınma, kira teslim, boş ev ve ofis temizliği için pillar rehberler ve
          cluster blog yazıları.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {BLOG_SILO_CLUSTERS.map((silo) => (
            <Link
              key={silo.slug}
              href={`/blog/silo/${silo.slug}`}
              className="group rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 transition hover:border-emerald-500/40 hover:bg-slate-800/70"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-white group-hover:text-emerald-300">
                <BookOpen className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                {silo.name}
              </span>
              <p className="mt-2 line-clamp-2 text-xs text-slate-400">{silo.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                Siloya git
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
