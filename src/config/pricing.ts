/**
 * @fileoverview Temizlik Fiyatlandırma Verisi (tek kaynak)
 * @description Hem ana sayfadaki "Anında Fiyat Hesaplama" aracı (HeroPriceCalculator)
 * hem de /fiyat-hesaplama SEO sayfası bu veriyi kullanır.
 *
 * Fiyatlar İstanbul piyasası (orta–üst segment, 2026) baz alınarak belirlenmiştir.
 * Bunlar TAHMİNÎ aralıklardır; kesin fiyat ücretsiz keşif sonrası netleşir.
 */

export type SpaceTypeId = 'ev' | 'ofis' | 'isyeri' | 'insaat' | 'discephe';
export type PriceRange = readonly [number, number];

export interface SpaceTypeMeta {
  id: SpaceTypeId;
  label: string;
  mode: 'room' | 'm2';
  /** m² modunda alan etiketi */
  unitLabel?: string;
}

export const SPACE_TYPES: SpaceTypeMeta[] = [
  { id: 'ev', label: 'Ev / Daire', mode: 'room' },
  { id: 'ofis', label: 'Ofis', mode: 'm2', unitLabel: 'Ofis alanı (m²)' },
  { id: 'isyeri', label: 'İşyeri / Dükkan', mode: 'm2', unitLabel: 'Alan (m²)' },
  { id: 'insaat', label: 'İnşaat Sonrası', mode: 'm2', unitLabel: 'Alan (m²)' },
  { id: 'discephe', label: 'Dış Cephe', mode: 'm2', unitLabel: 'Cephe alanı (m²)' },
];

/** Ev — oda paketi (tek seferlik detaylı temizlik), [alt, üst] TL */
export const ROOM_PRICES: Record<string, PriceRange> = {
  '1+1': [3500, 4500],
  '2+1': [5000, 6500],
  '3+1': [6500, 8500],
  '4+1': [8500, 10500],
  '5+1': [10500, 13000],
};
export const ROOM_OPTIONS = ['1+1', '2+1', '3+1', '4+1', '5+1'] as const;

/** m² bazlı tipler: birim fiyat (TL/m²) + taban (küçük alanlar için minimum) */
export const M2_RATES: Record<
  Exclude<SpaceTypeId, 'ev'>,
  { min: number; max: number; floorMin: number; floorMax: number }
> = {
  ofis: { min: 35, max: 55, floorMin: 2500, floorMax: 3500 },
  isyeri: { min: 35, max: 55, floorMin: 2500, floorMax: 3500 },
  insaat: { min: 75, max: 120, floorMin: 5500, floorMax: 8000 },
  discephe: { min: 35, max: 60, floorMin: 1200, floorMax: 2000 },
};

/** Ekstralar (seçilirse tahmine eklenir), TL. free: ücretsiz hediye */
export const EXTRAS = [
  { id: 'cam', label: 'Cam temizliği', min: 600, max: 1000, free: false },
  { id: 'beyazesya', label: 'Buzdolabı / fırın içi', min: 0, max: 0, free: true },
  { id: 'balkon', label: 'Balkon', min: 0, max: 0, free: true },
  { id: 'koltuk', label: 'Koltuk / halı yıkama', min: 900, max: 1800, free: false },
] as const;

export type ExtraId = (typeof EXTRAS)[number]['id'];

/** Ekstraların gösterildiği mekan tipleri (inşaat/dış cephe zaten kapsamlı) */
export const EXTRAS_VISIBLE_FOR: SpaceTypeId[] = ['ev', 'ofis', 'isyeri'];

// ============================================
// YARDIMCILAR
// ============================================

export const priceFormatter = new Intl.NumberFormat('tr-TR');
export const roundTo = (n: number, step = 100) => Math.round(n / step) * step;
export const formatTL = (n: number) => `${priceFormatter.format(roundTo(n))} TL`;
