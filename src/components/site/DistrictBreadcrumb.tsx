import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type Crumb = { label: string; href?: string };

type DistrictBreadcrumbProps = {
  items: Crumb[];
};

export function DistrictBreadcrumb({ items }: DistrictBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-400">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-600" aria-hidden />}
              {isLast || !item.href ? (
                <span className={isLast ? 'font-medium text-emerald-300' : undefined}>{item.label}</span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
