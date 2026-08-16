/** Blog/geo-sss slug'ları yalnızca ASCII olmalı — legacy redirect 404 riskini önler */
export const ASCII_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isAsciiSlug(slug: string): boolean {
  return ASCII_SLUG_RE.test(slug);
}

export function assertAsciiSlug(slug: string, context: string): void {
  if (!isAsciiSlug(slug)) {
    throw new Error(`Geçersiz slug (${context}): "${slug}" — yalnızca a-z, 0-9 ve tire kullanın`);
  }
}

/** Bootstrap öncesi bilinen hatalı slug düzeltmeleri */
export const KNOWN_SLUG_FIXES: Record<string, string> = {
  'inşaat-tozu-evde-vs-endustriyel-vakum-2026': 'insaat-tozu-evde-vs-endustriyel-vakum-2026',
};
