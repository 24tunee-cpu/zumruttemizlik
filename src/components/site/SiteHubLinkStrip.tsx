import Link from 'next/link';
import { buildSiteHubStripLinks } from '@/lib/internal-seo-links';

type Props = {
  tone?: 'dark' | 'light';
  className?: string;
};

/** Crawlable hub şeridi — hizmetler / bölgeler / CTA */
export default function SiteHubLinkStrip({ tone = 'dark', className = '' }: Props) {
  const links = buildSiteHubStripLinks();
  const isDark = tone === 'dark';

  return (
    <nav
      aria-label="Site içi önemli sayfalar"
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={
            isDark
              ? 'rounded-full border border-slate-600 px-3 py-1.5 text-xs text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300'
              : 'rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-600 dark:text-slate-200'
          }
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
