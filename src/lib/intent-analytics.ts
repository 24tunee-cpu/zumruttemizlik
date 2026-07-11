import type { SpaceTypeId } from '@/config/pricing';
import { getDistrictBySlug } from '@/config/programmatic-seo';
import { getIntentBySlug, type IntentLanding } from '@/config/intent-seo';

/** GA4 özel dönüşüm event adları — intent bazlı ölçüm */
export const INTENT_GA4_LEAD_EVENTS = {
  'insaat-sonrasi-temizlik': 'lead_insaat_sonrasi',
  'tasinma-temizligi': 'lead_tasinma',
  'kira-teslim-temizligi': 'lead_kira_teslim',
  'bos-ev-temizligi': 'lead_bos_ev',
  'ofis-temizligi': 'lead_ofis',
} as const;

export type IntentGa4Slug = keyof typeof INTENT_GA4_LEAD_EVENTS;

export type CalculatorIntentContext = {
  intentSlug: string;
  intentName: string;
  districtSlug?: string;
  districtName?: string;
  spaceType: SpaceTypeId;
  initialRoom?: string;
  initialArea?: number;
  ga4LeadEvent?: string;
};

export function getIntentLeadEventName(intentSlug: string): string | undefined {
  return INTENT_GA4_LEAD_EVENTS[intentSlug as IntentGa4Slug];
}

export function calculatorSpaceTypeForIntent(intent: IntentLanding): SpaceTypeId {
  if (intent.calculatorAnchor === 'insaat') return 'insaat';
  if (intent.calculatorAnchor === 'ofis') return 'ofis';
  return 'ev';
}

export function getCalculatorDefaultsForIntent(intent: IntentLanding): {
  spaceType: SpaceTypeId;
  initialRoom?: string;
  initialArea?: number;
} {
  const spaceType = calculatorSpaceTypeForIntent(intent);
  if (spaceType === 'ev') return { spaceType, initialRoom: '2+1' };
  if (spaceType === 'insaat') return { spaceType, initialArea: 120 };
  if (spaceType === 'ofis') return { spaceType, initialArea: 150 };
  return { spaceType };
}

export function resolveCalculatorIntentContext(
  intentSlug?: string | null,
  districtSlug?: string | null
): CalculatorIntentContext | null {
  if (!intentSlug?.trim()) return null;

  const intent = getIntentBySlug(intentSlug.trim());
  if (!intent) return null;

  const district = districtSlug?.trim() ? getDistrictBySlug(districtSlug.trim()) : undefined;
  const defaults = getCalculatorDefaultsForIntent(intent);

  return {
    intentSlug: intent.slug,
    intentName: intent.name,
    districtSlug: district?.slug,
    districtName: district?.name,
    spaceType: defaults.spaceType,
    initialRoom: defaults.initialRoom,
    initialArea: defaults.initialArea,
    ga4LeadEvent: getIntentLeadEventName(intent.slug),
  };
}

export function buildCalculatorHref(params?: {
  intent?: string;
  district?: string;
}): string {
  const q = new URLSearchParams();
  if (params?.intent) q.set('intent', params.intent);
  if (params?.district) q.set('district', params.district);
  const qs = q.toString();
  return qs ? `/fiyat-hesaplama?${qs}` : '/fiyat-hesaplama';
}

export function buildIntentWhatsAppPrefill(params: {
  intentName?: string;
  districtName?: string;
}): string {
  if (params.intentName && params.districtName) {
    return `${params.districtName} ${params.intentName.toLowerCase()} teklifi`;
  }
  if (params.intentName) {
    return `${params.intentName.toLowerCase()} teklifi`;
  }
  return '';
}
