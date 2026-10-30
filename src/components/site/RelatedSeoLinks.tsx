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
    ? 'mt-10 rounded-2xl border border-slate-700 bg-slate-800/40 p-5 sm:p-6'
    : 'mt-12 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/40';
  const h2Class = isDark
    ? 'text-xl font-semibold text-white'
    : 'text-xl font-semibold text-slate-900 dark:text-white';
  const introClass = isDark
    ? 'mt-1 text-sm text-slate-400'
    : 'mt-1 text-sm text-slate-600 dark:text-slate-300';
  const h3Class = isDark
    ? 'text-sm font-semibold text-emerald-300'
    : 'text-sm font-semibold text-emerald-700 dark:text-emerald-300';
  const linkClass = isDark
    ? 'text-sm text-slate-300 underline-offset-2 hover:text-emerald-300 hover:underline'
    : 'text-sm text-slate-700 underline-offset-2 hover:text-emerald-700 hover:underline dark:text-slate-300 dark:hover:text-emerald-300';

  return (
    <section className={sectionClass} aria-labelledby="related-seo-links-heading">
      <h2 id="related-seo-links-heading" className={h2Class}>
        {heading}
      </h2>
      {intro ? <p className={introClass}>{intro}</p> : null}
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </section>
  );
}
