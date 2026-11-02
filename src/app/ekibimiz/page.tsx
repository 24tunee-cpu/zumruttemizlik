/**
 * Ekibimiz — SSR H1 + Prisma ekip; animasyon client’ta.
 */
import { Users } from 'lucide-react';
import SiteLayout from '../site/layout';
import { TeamPageClient } from '@/components/site/TeamPageClient';
import { StickySeoCtaBar } from '@/components/site/StickySeoCtaBar';
import { WhyChooseZvt } from '@/components/site/WhyChooseZvt';
import { prisma } from '@/lib/prisma';
import { formatGoogleTrustLine } from '@/config/trust-signals';

export const revalidate = 3600;

export default async function TeamPage() {
  const rows = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      role: true,
      bio: true,
      image: true,
      phone: true,
      email: true,
      linkedin: true,
    },
  });

  return (
    <SiteLayout>
      <section
        className="bg-slate-900 pb-12 pt-24 sm:pb-14 sm:pt-28 md:pb-16 md:pt-32"
        aria-label="Sayfa başlığı"
      >
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 sm:h-16 sm:w-16">
            <Users className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
          </div>
          <h1 className="text-balance text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Ekibimiz
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Sarıyer / Zekeriyaköy odaklı temizlik ekibi. {formatGoogleTrustLine()}. Ücretsiz keşif
            için hemen yazın.
          </p>
        </div>
      </section>

      <TeamPageClient members={rows} />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <WhyChooseZvt tone="light" contextLabel="Ekip / temizlik teklifi" sourcePrefix="ekip-why-zvt" />
      </div>
      <StickySeoCtaBar contextLabel="Ekibimiz" sourcePrefix="ekip-sticky" />
    </SiteLayout>
  );
}
