/**
 * Dizin citation tracker — GEO_DIRECTORY_TARGETS ↔ MapPlatformListing köprüsü.
 * Otomasyon yok; admin manuel durum + URL kaydı.
 */
import { GEO_DIRECTORY_TARGETS } from '@/config/geo-entity';

/** MapPlatformListing.platform değerleri */
export type CitationPlatformKey = 'google' | 'bing' | 'apple' | 'yandex';

export const DIRECTORY_TO_PLATFORM: Record<
  (typeof GEO_DIRECTORY_TARGETS)[number]['id'],
  CitationPlatformKey
> = {
  'google-business': 'google',
  'bing-places': 'bing',
  'apple-maps': 'apple',
  yandex: 'yandex',
};

export const CITATION_STATUSES = [
  { id: 'not_connected', label: 'Bağlı değil' },
  { id: 'in_progress', label: 'Devam ediyor' },
  { id: 'connected', label: 'Bağlı / doğrulandı' },
] as const;

export type CitationStatusId = (typeof CITATION_STATUSES)[number]['id'];

export function isCitationStatus(value: string): value is CitationStatusId {
  return CITATION_STATUSES.some((s) => s.id === value);
}

export function platformForDirectoryId(
  directoryId: string
): CitationPlatformKey | null {
  if (directoryId in DIRECTORY_TO_PLATFORM) {
    return DIRECTORY_TO_PLATFORM[directoryId as keyof typeof DIRECTORY_TO_PLATFORM];
  }
  return null;
}
