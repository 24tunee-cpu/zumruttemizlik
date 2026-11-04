import {
  DISTRICT_LANDINGS,
  SERVICE_LANDINGS,
  type DistrictLanding,
  type ServiceLanding,
} from '@/config/programmatic-seo';
import { PAIR_CTR_META, pairCtrKey } from '@/lib/gsc-ctr-overrides';
import { hasGscPlaceholderLeak } from '@/lib/gsc-query-guards';

const BRAND_SHORT = 'Zümrüt Vadi Temizlik';

function sidePhrase(d: DistrictLanding): string {
  if (d.side === 'anadolu') return 'İstanbul Anadolu yakasında';
  if (d.side === 'avrupa') return 'İstanbul Avrupa yakasında';
  return 'İstanbul’da';
}

function trimEndEllipsis(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1).trimEnd();
  return `${cut}…`;
}

/**
 * Programatik ilçe + hizmet sayfaları için tutarlı, SEO odaklı title/description.
 * Admin toplu otomasyon ve önizlemede kullanılır.
 */
/** GSC’de stuffed / yinelenen / sızıntılı title override’larını reddet */
export function isLowQualityProgrammaticTitle(title: string): boolean {
  const t = title.trim();
  if (!t) return true;
  if (hasGscPlaceholderLeak(t)) return true;
  // "Sarıyer Ev Temizliği | sarıyer ev temizliği — Marka" tipi kopya
  const parts = t.split('|').map((p) => p.trim().toLowerCase());
  if (parts.length >= 2) {
    const left = parts[0].replace(/[^a-z0-9ğüşıöç\s]/gi, '').replace(/\s+/g, ' ');
    const right = parts[1]
      .split(/[—–-]/)[0]
      .replace(/[^a-z0-9ğüşıöç\s]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (left && right && (left === right || right.includes(left) || left.includes(right))) {
      return true;
    }
  }
  return false;
}

export function isLowQualityProgrammaticDescription(description: string): boolean {
  const d = description.trim();
  if (!d) return true;
  return hasGscPlaceholderLeak(d);
}

export function buildSmartMetaForPair(
  district: DistrictLanding,
  service: ServiceLanding
): { title: string; description: string } {
  const ctr = PAIR_CTR_META[pairCtrKey(district.slug, service.slug)];
  if (ctr) {
    return {
      title: trimEndEllipsis(ctr.title, 58),
      description: trimEndEllipsis(ctr.description, 158),
    };
  }

  let title = `${district.name} ${service.name} | ${BRAND_SHORT}`;
  if (title.length > 58) {
    title = `${district.name} ${service.name} · Zümrüt Vadi`;
  }
  title = trimEndEllipsis(title, 58);

  const hoods = district.neighborhoods.slice(0, 3).join(', ');
  const blurb =
    district.regionBlurb?.trim() ||
    `${sidePhrase(district)} ${district.populationNote} ile planlı hizmet.`;

  let description = `${district.name} ${service.name.toLowerCase()}: ${service.shortPitch} ${hoods ? `${hoods} ve yakın mahalleler. ` : ''}${blurb} Ücretsiz keşif için arayın.`;
  description = trimEndEllipsis(description, 158);

  const fallbackKw = service.intentKeywords[0] ?? service.name.toLowerCase();
  return {
    title,
    description:
      description ||
      `${district.name} ${service.name.toLowerCase()}: ${fallbackKw}. ${BRAND_SHORT}.`,
  };
}

export function allProgrammaticPairs(): Array<{ district: DistrictLanding; service: ServiceLanding; key: string }> {
  return DISTRICT_LANDINGS.flatMap((district) =>
    SERVICE_LANDINGS.map((service) => ({
      district,
      service,
      key: `${district.slug}/${service.slug}`,
    }))
  );
}
