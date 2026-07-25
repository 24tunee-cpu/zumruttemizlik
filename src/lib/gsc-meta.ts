import { DISTRICT_LANDINGS, SERVICE_LANDINGS } from '@/config/programmatic-seo';

export type GscRow = {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type MetaSuggestion = {
  key: string;
  district: string;
  service: string;
  title: string;
  description: string;
  reason: string;
  score: number;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

/** Türkçe/ASCII farklarını yok sayarak başlık eşleştirme */
function foldHeader(v: string): string {
  return v
    .replace(/^\uFEFF/, '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .toLowerCase();
}

function parseNumber(v: string): number {
  let cleaned = v.replace('%', '').trim();
  if (cleaned.includes('.') && cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    cleaned = cleaned.replace(',', '.');
  }
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function detectDelimiter(line: string): ',' | ';' | '\t' {
  let comma = 0;
  let semi = 0;
  let tab = 0;
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') inQuotes = !inQuotes;
    else if (!inQuotes) {
      if (ch === ',') comma++;
      else if (ch === ';') semi++;
      else if (ch === '\t') tab++;
    }
  }
  if (semi > comma && semi >= tab) return ';';
  if (tab > comma && tab >= semi) return '\t';
  return ',';
}

function parseCsvLine(line: string, delimiter: ',' | ';' | '\t' = ','): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === delimiter && !inQuotes) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

const QUERY_PATTERNS = [
  'query',
  'queries',
  'top queries',
  'sorgu',
  'sorgular',
  'arama sorgusu',
  'en cok yapilan sorgular',
  'en populer sorgular',
  'populer sorgular',
  'most popular queries',
  'search query',
];

const PAGE_PATTERNS = [
  'page',
  'pages',
  'top pages',
  'sayfa',
  'sayfalar',
  'hedef sayfa',
  'landing page',
  'url',
  'en populer sayfalar',
  'populer sayfalar',
  'most popular pages',
];

const METRIC_PATTERNS = [
  'click',
  'tiklam',
  'impression',
  'gosterim',
  'goruntulenme',
  'ctr',
  'to',
  'position',
  'konum',
  'sira',
  'tarih',
  'date',
  'country',
  'ulke',
  'device',
  'cihaz',
  'filter',
  'filtre',
];

function matchesPattern(header: string, patterns: string[]): boolean {
  const h = foldHeader(header);
  return patterns.some((p) => {
    const fp = foldHeader(p);
    return h === fp || (fp.length >= 4 && h.includes(fp));
  });
}

function findColumnIndex(headers: string[], patterns: string[]): number {
  const folded = headers.map(foldHeader);
  const foldedPatterns = patterns.map(foldHeader);

  for (const fp of foldedPatterns) {
    const i = folded.indexOf(fp);
    if (i >= 0) return i;
  }

  for (let i = 0; i < folded.length; i++) {
    const h = folded[i];
    if (!h) continue;
    for (const fp of foldedPatterns) {
      if (fp.length >= 4 && h.includes(fp)) return i;
    }
  }

  return -1;
}

function isLikelyHeaderLine(line: string): boolean {
  const delim = detectDelimiter(line);
  const cols = parseCsvLine(line, delim).map(foldHeader);
  const hasQuery = findColumnIndex(cols, QUERY_PATTERNS) >= 0;
  const hasPage = findColumnIndex(cols, PAGE_PATTERNS) >= 0;
  const hasMetric = cols.some((c) => METRIC_PATTERNS.some((m) => c.includes(m)));
  return (hasQuery || hasPage) && (hasMetric || cols.length >= 2);
}

/** Birleştirilmiş CSV metnini (Queries.csv + Pages.csv vb.) parçalara ayır */
export function splitGscCsvSegments(csv: string): string[] {
  const cleaned = csv.replace(/^\uFEFF/, '').trim();
  if (!cleaned) return [];

  const lines = cleaned.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [cleaned];

  const segments: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (current.length > 0 && isLikelyHeaderLine(line)) {
      segments.push(current.join('\n'));
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) segments.push(current.join('\n'));

  return segments.length > 0 ? segments : [cleaned];
}

type ColumnIdx = {
  query: number;
  page: number;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

function resolveColumns(headers: string[], sampleRows: string[][]): ColumnIdx {
  let idx: ColumnIdx = {
    query: findColumnIndex(headers, QUERY_PATTERNS),
    page: findColumnIndex(headers, PAGE_PATTERNS),
    clicks: findColumnIndex(headers, ['clicks', 'tiklama', 'tiklamalar', 'tıklamalar', 'tıklama']),
    impressions: findColumnIndex(headers, ['impressions', 'gosterim', 'gösterim', 'gösterimler', 'goruntulenme']),
    ctr: findColumnIndex(headers, ['ctr', 'to', 'tiklanma orani', 'tıklama oranı']),
    position: findColumnIndex(headers, ['position', 'ortalama konum', 'konum', 'sira', 'sıra']),
  };

  const firstHeader = foldHeader(headers[0] ?? '');
  const firstIsMetric = METRIC_PATTERNS.some((m) => firstHeader.includes(m));

  if (idx.query === -1 && idx.page === -1 && headers.length >= 2 && !firstIsMetric) {
    const urlLike = sampleRows
      .slice(0, 8)
      .filter((cols) => {
        const v = (cols[0] ?? '').trim().toLowerCase();
        return v.includes('http') || v.includes('zumrut') || v.startsWith('/bolgeler') || v.startsWith('/blog');
      }).length;
    if (urlLike >= 2) idx = { ...idx, page: 0 };
    else idx = { ...idx, query: 0 };
  }

  return idx;
}

function parseOneGscCsvSegment(csv: string): GscRow[] {
  const cleaned = csv.replace(/^\uFEFF/, '').trim();
  const lines = cleaned.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  let headerLineIndex = 0;
  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    if (isLikelyHeaderLine(lines[i])) {
      headerLineIndex = i;
      break;
    }
  }

  const delimiter = detectDelimiter(lines[headerLineIndex]);
  const headers = parseCsvLine(lines[headerLineIndex], delimiter);
  const sampleRows = lines.slice(headerLineIndex + 1, headerLineIndex + 10).map((l) => parseCsvLine(l, delimiter));
  const idx = resolveColumns(headers, sampleRows);

  const pageOnly = idx.query === -1 && idx.page !== -1;
  const queryOnly = idx.query !== -1 && idx.page === -1;

  if (idx.query === -1 && idx.page === -1) {
    const shown = headers.map((h) => h.trim()).filter(Boolean).slice(0, 8).join(', ');
    throw new Error(
      `CSV kolonları tanınmadı. Bulunan başlıklar: "${shown || '(boş)'}". ` +
        'GSC zip içinden Queries.csv + Pages.csv yükleyin veya Performans tablosunda Sorgu+Sayfa seçip export edin.'
    );
  }

  const rows: GscRow[] = [];
  for (let i = headerLineIndex + 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i], delimiter);
    const query = idx.query === -1 ? '' : (cols[idx.query] ?? '').trim();
    const page = idx.page === -1 ? '' : (cols[idx.page] ?? '').trim();
    if (pageOnly && !page) continue;
    if (queryOnly && !query) continue;
    if (!pageOnly && !queryOnly && (!query || !page)) continue;
    rows.push({
      query: query || (pageOnly ? '(sayfa raporu)' : query),
      page: page || '/',
      clicks: idx.clicks === -1 ? 0 : parseNumber(cols[idx.clicks] ?? '0'),
      impressions: idx.impressions === -1 ? 0 : parseNumber(cols[idx.impressions] ?? '0'),
      ctr: idx.ctr === -1 ? 0 : parseNumber(cols[idx.ctr] ?? '0'),
      position: idx.position === -1 ? 99 : parseNumber(cols[idx.position] ?? '0'),
    });
  }
  return rows;
}

export function parseGscCsv(csv: string): GscRow[] {
  const segments = splitGscCsvSegments(csv);
  const all: GscRow[] = [];
  for (const seg of segments) {
    all.push(...parseOneGscCsvSegment(seg));
  }
  return all;
}

function keyFromPage(urlOrPath: string): string | null {
  const m = urlOrPath.match(/\/bolgeler\/([^/]+)\/([^/?#]+)/);
  if (!m) return null;
  return `${m[1]}/${m[2]}`;
}

export function buildMetaSuggestions(rows: GscRow[]): MetaSuggestion[] {
  const grouped = new Map<string, GscRow[]>();
  for (const row of rows) {
    const key = keyFromPage(row.page);
    if (!key) continue;
    const arr = grouped.get(key) || [];
    arr.push(row);
    grouped.set(key, arr);
  }

  const knownKeys = new Set(
    DISTRICT_LANDINGS.flatMap((d) => SERVICE_LANDINGS.map((s) => `${d.slug}/${s.slug}`))
  );
  const suggestions: MetaSuggestion[] = [];

  for (const [key, bucket] of grouped) {
    if (!knownKeys.has(key)) continue;
    const [districtSlug, serviceSlug] = key.split('/');
    const district = DISTRICT_LANDINGS.find((d) => d.slug === districtSlug);
    const service = SERVICE_LANDINGS.find((s) => s.slug === serviceSlug);
    if (!district || !service) continue;

    bucket.sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);
    const top = bucket[0];
    const score = top.impressions * 0.7 + top.clicks * 20 - top.position * 2;
    const title = `${district.name} ${service.name} | ${top.query} - Zümrüt Vadi Temizlik`.slice(0, 70);
    const description = `${district.name} için ${service.name.toLowerCase()} hizmetinde ${top.query} odaklı hızlı teklif alın. Aynı gün planlama ve şeffaf fiyatlandırma.`.slice(
      0,
      160
    );

    suggestions.push({
      key,
      district: district.slug,
      service: service.slug,
      title,
      description,
      reason: `Top query: ${top.query}`,
      score,
      query: top.query,
      clicks: top.clicks,
      impressions: top.impressions,
      ctr: top.ctr,
      position: top.position,
    });
  }

  return suggestions.sort((a, b) => b.score - a.score);
}
