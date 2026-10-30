/** SERP güvenli title/description uzunlukları */

export const META_TITLE_MAX = 60;
export const META_DESC_MAX = 158;

const EMOJI_RE =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu;

export function stripMetaEmoji(input: string): string {
  return input.replace(EMOJI_RE, '').replace(/\s{2,}/g, ' ').trim();
}

export function clampMetaTitle(input: string, max = META_TITLE_MAX): string {
  const value = stripMetaEmoji(input);
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

export function clampMetaDescription(input: string, max = META_DESC_MAX): string {
  const value = stripMetaEmoji(input).replace(/\s+/g, ' ').trim();
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}
