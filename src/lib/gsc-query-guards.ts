/**
 * GSC Pages-only CSV satırlarında sorgu kolonu yoktur.
 * Eski kod `'(sayfa raporu)'` placeholder yazıyordu → meta title/desc kirliliği.
 */

const PLACEHOLDER_RE =
  /^\(?\s*sayfa\s+raporu\s*\)?$/i;

const LEAK_RE = /\(\s*sayfa\s+raporu\s*\)|sayfa\s+raporu/i;

/** Pages.csv satırı / sahte sorgu — title’a gömülmemeli */
export function isGscPlaceholderQuery(query: string | null | undefined): boolean {
  const q = (query || '').trim();
  if (!q) return true;
  return PLACEHOLDER_RE.test(q);
}

/** DB / öneri meta’sında sızıntı var mı */
export function hasGscPlaceholderLeak(text: string | null | undefined): boolean {
  if (!text) return false;
  return LEAK_RE.test(text);
}
