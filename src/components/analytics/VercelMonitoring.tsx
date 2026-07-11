'use client';

import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

/**
 * Vercel Web Analytics + Speed Insights.
 * Admin paneli hariç tüm public sayfalarda aktif.
 * Deploy sonrası Vercel dashboard'da veri görünmesi için canlı siteyi ziyaret edin.
 */
export function VercelMonitoring() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights sampleRate={1} />
    </>
  );
}

export default VercelMonitoring;
