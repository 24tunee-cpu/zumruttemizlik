/**
 * Sayfa altı dönüşüm şeridi — tek kompakt güven kutusu.
 * Sticky bar + WhyChoose aynı CTA’ları tekrar etmesin diye link kartı varsayılan kapalı.
 */
import Link from 'next/link';
import { WhyChooseZvt } from '@/components/site/WhyChooseZvt';

type LinkItem = { href: string; label: string };

const DEFAULT_REGION_LINKS: LinkItem[] = [
  { href: '/bolgeler/sariyer', label: 'Sarıyer' },
  { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy' },
  { href: '/bolgeler/sariyer/maslak-ofis-temizligi', label: 'Maslak ofis' },
  { href: '/hizmetler', label: 'Hizmetler' },
  { href: '/fiyat-hesaplama', label: 'Fiyat hesapla' },
];

type Props = {
  contextLabel: string;
  sourcePrefix: string;
  tone?: 'dark' | 'light';
  /** compact (varsayılan) | full yalnızca ana sayfa tarzı yerler */
  variant?: 'compact' | 'full';
  /** Sayfaya özel ek chip’ler; teklif/keşif tekrarları eklemeyin */
  extraLinks?: LinkItem[];
  /** Bölge chip şeridini göster (varsayılan: false — yormasın) */
  showRegionChips?: boolean;
};

export function ConversionSeoAside({
  contextLabel,
  sourcePrefix,
  tone = 'dark',
  variant = 'compact',
  extraLinks = [],
  showRegionChips = false,
}: Props) {
  const chips = showRegionChips
    ? [...extraLinks, ...DEFAULT_REGION_LINKS].filter(
        (l, i, arr) => arr.findIndex((x) => x.href === l.href) === i
      )
    : extraLinks;

  const isDark = tone === 'dark';
  const chipClass = isDark
    ? 'rounded-full border border-slate-600/80 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300'
    : 'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-emerald-500/40 hover:text-emerald-700 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-300';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <WhyChooseZvt
        tone={tone}
        contextLabel={contextLabel}
        sourcePrefix={sourcePrefix}
        variant={variant}
      />
      {chips.length > 0 ? (
        <nav className="mt-4 flex flex-wrap gap-2" aria-label="İlgili sayfalar">
          {chips.map((l) => (
            <Link key={l.href} href={l.href} className={chipClass}>
              {l.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
