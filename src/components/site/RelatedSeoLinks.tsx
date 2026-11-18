import Link from 'next/link';
import type { SeoLinkItem } from '@/lib/internal-seo-links';

type Group = {
  title: string;
  links: SeoLinkItem[];
};

type Props = {
  heading?: string;
  intro?: string;
  groups: Group[];
  /** slate-900 programmatic sayfalar vs açık hizmet sayfası */
  tone?: 'dark' | 'light';
};

export default function RelatedSeoLinks({
  heading = 'İlgili sayfalar',
  intro,
  groups,
  tone = 'dark',
}: Props) {
  const visible = groups.filter((g) => g.links.length > 0);
  if (visible.length === 0) return null;

  const isDark = tone === 'dark';
  const sectionClass = isDark
    ? 'mt-8 border-t border-slate-700/80 pt-8'
    : 'mt-10 border-t border-slate-200 pt-8 dark:border-slate-700/80';
  const h2Class = isDark
    ? 'text-base font-semibold text-white'
    : 'text-base font-semibold text-slate-900 dark:text-white';
  const introClass = isDark
    ? 'mt-1 text-sm text-slate-400'
    : 'mt-1 text-sm text-slate-600 dark:text-slate-300';
  const h3Class = isDark
    ? 'text-xs font-semibold uppercase tracking-wide text-emerald-400/90'
    : 'text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400/90';
  const linkClass = isDark
    ? 'text-sm text-slate-300 underline-offset-2 hover:text-emerald-300 hover:underline'
    : 'text-sm text-slate-700 underline-offset-2 hover:text-emerald-700 hover:underline dark:text-slate-300 dark:hover:text-emerald-300';

  return (
    <nav className={sectionClass} aria-labelledby="related-seo-links-heading">
      <h2 id="related-seo-links-heading" className={h2Class}>
        {heading}
      </h2>
      {intro ? <p className={introClass}>{intro}</p> : null}
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((group) => (
          <div key={group.title}>
            <h3 className={h3Class}>{group.title}</h3>
            <ul className="mt-2 space-y-1.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
