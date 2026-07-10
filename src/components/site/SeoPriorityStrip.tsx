import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { PRIORITY_BLOG_LINKS, PRIORITY_CONVERSION_LINKS } from '@/lib/priority-seo-links';

interface SeoPriorityStripProps {
  variant?: 'blog' | 'conversion' | 'both';
  title?: string;
}

export function SeoPriorityStrip({
  variant = 'both',
  title = 'Öne çıkan rehberler',
}: SeoPriorityStripProps) {
  const showBlog = variant === 'blog' || variant === 'both';
  const showConversion = variant === 'conversion' || variant === 'both';

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5 sm:p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-emerald-400" aria-hidden="true" />
        <p className="text-sm font-semibold text-emerald-300">{title}</p>
      </div>
      <div className={`mt-4 grid gap-4 ${variant === 'both' ? 'md:grid-cols-2' : ''}`}>
        {showBlog && (
          <div className="space-y-2">
            {variant === 'both' && (
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Fiyat rehberleri</p>
            )}
            {PRIORITY_BLOG_LINKS.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm text-slate-200 underline decoration-slate-500/70 underline-offset-4 transition-colors hover:text-emerald-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
        {showConversion && (
          <div className="space-y-2">
            {variant === 'both' && (
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Hızlı erişim</p>
            )}
            {PRIORITY_CONVERSION_LINKS.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm text-slate-200 underline decoration-slate-500/70 underline-offset-4 transition-colors hover:text-emerald-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
