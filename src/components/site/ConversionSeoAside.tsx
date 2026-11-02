/**
 * Para / hub sayfaları için ortak CRO + iç link şeridi.
 * Sticky ayrı (client); bu blok server-safe.
 */
import RelatedSeoLinks from '@/components/site/RelatedSeoLinks';
import { WhyChooseZvt } from '@/components/site/WhyChooseZvt';

type LinkItem = { href: string; label: string };

const DEFAULT_GROUPS: Array<{ title: string; links: LinkItem[] }> = [
  {
    title: 'Öncelik bölgeler',
    links: [
      { href: '/bolgeler/sariyer', label: 'Sarıyer' },
      { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy' },
      {
        href: '/bolgeler/sariyer/zekeriyakoy-ev-temizligi',
        label: 'Zekeriyaköy ev',
      },
      { href: '/bolgeler/sariyer/maslak-ofis-temizligi', label: 'Maslak ofis' },
    ],
  },
  {
    title: 'Teklif',
    links: [
      { href: '/randevu', label: 'Ücretsiz keşif' },
      { href: '/fiyat-hesaplama', label: 'Fiyat hesapla' },
      { href: '/harita-ve-yorumlar', label: 'Harita & yorumlar' },
      { href: '/sss/fiyat', label: 'Fiyat SSS' },
    ],
  },
];

type Props = {
  contextLabel: string;
  sourcePrefix: string;
  tone?: 'dark' | 'light';
  heading?: string;
  intro?: string;
  extraGroups?: Array<{ title: string; links: LinkItem[] }>;
};

export function ConversionSeoAside({
  contextLabel,
  sourcePrefix,
  tone = 'dark',
  heading = 'Hızlı devam — teklif ve öncelik bölgeler',
  intro = 'Ücretsiz keşif ve net kapsam; Sarıyer / Zekeriyaköy operasyon hattı.',
  extraGroups = [],
}: Props) {
  const groups = [...extraGroups, ...DEFAULT_GROUPS];
  return (
    <div
      className={
        tone === 'dark'
          ? 'mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8'
          : 'mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8'
      }
    >
      <WhyChooseZvt tone={tone} contextLabel={contextLabel} sourcePrefix={sourcePrefix} />
      <RelatedSeoLinks tone={tone} heading={heading} intro={intro} groups={groups} />
    </div>
  );
}
