/**
 * Ziyaretçi trafik kaynağı — referrer, UTM ve arama sorgusu çözümlemesi.
 */
export type TrafficChannel =
  | 'organic'
  | 'direct'
  | 'referral'
  | 'social'
  | 'paid'
  | 'email'
  | 'other';

export type VisitorAttribution = {
  channel: TrafficChannel;
  channelLabel: string;
  source: string;
  sourceLabel: string;
  searchQuery: string | null;
  referrerHost: string | null;
  landingUrl: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  /** Tek satır özet — admin tablo */
  summary: string;
};

const SOCIAL_HOSTS: Record<string, string> = {
  'facebook.com': 'Facebook',
  'fb.com': 'Facebook',
  'instagram.com': 'Instagram',
  'twitter.com': 'X (Twitter)',
  'x.com': 'X (Twitter)',
  't.co': 'X (Twitter)',
  'linkedin.com': 'LinkedIn',
  'youtube.com': 'YouTube',
  'youtu.be': 'YouTube',
  'tiktok.com': 'TikTok',
  'pinterest.com': 'Pinterest',
  'reddit.com': 'Reddit',
  'whatsapp.com': 'WhatsApp',
  'web.whatsapp.com': 'WhatsApp',
};

const SEARCH_ENGINES: Array<{ host: RegExp; name: string; queryKeys: string[] }> = [
  { host: /(^|\.)google\./i, name: 'Google', queryKeys: ['q', 'query'] },
  { host: /(^|\.)bing\./i, name: 'Bing', queryKeys: ['q'] },
  { host: /(^|\.)yandex\./i, name: 'Yandex', queryKeys: ['text', 'q'] },
  { host: /(^|\.)yahoo\./i, name: 'Yahoo', queryKeys: ['p', 'q'] },
  { host: /(^|\.)duckduckgo\./i, name: 'DuckDuckGo', queryKeys: ['q'] },
  { host: /(^|\.)ecosia\./i, name: 'Ecosia', queryKeys: ['q'] },
  { host: /(^|\.)baidu\./i, name: 'Baidu', queryKeys: ['wd', 'q'] },
];

function safeUrl(raw: string | null | undefined): URL | null {
  if (!raw?.trim()) return null;
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

function hostOf(url: string | null | undefined): string | null {
  const u = safeUrl(url);
  if (!u) return null;
  return u.hostname.replace(/^www\./i, '').toLowerCase();
}

function readQueryParam(url: URL | null, keys: string[]): string | null {
  if (!url) return null;
  for (const key of keys) {
    const v = url.searchParams.get(key)?.trim();
    if (v) return decodeURIComponent(v.replace(/\+/g, ' ')).slice(0, 200);
  }
  return null;
}

function parseUtmFromLanding(landingUrl: string | null | undefined) {
  const u = safeUrl(landingUrl);
  if (!u) {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
    gclid: null,
    fbclid: null,
    msclkid: null,
  };
  }
  const pick = (k: string) => u.searchParams.get(k)?.trim().slice(0, 120) || null;
  return {
    utmSource: pick('utm_source'),
    utmMedium: pick('utm_medium'),
    utmCampaign: pick('utm_campaign'),
    utmTerm: pick('utm_term'),
    utmContent: pick('utm_content'),
    gclid: pick('gclid'),
    fbclid: pick('fbclid'),
    msclkid: pick('msclkid'),
  };
}

function matchSocial(host: string): string | null {
  for (const [pattern, label] of Object.entries(SOCIAL_HOSTS)) {
    if (host === pattern || host.endsWith(`.${pattern}`)) return label;
  }
  return null;
}

function matchSearchEngine(host: string): (typeof SEARCH_ENGINES)[number] | null {
  for (const engine of SEARCH_ENGINES) {
    if (engine.host.test(host)) return engine;
  }
  return null;
}

const CHANNEL_LABELS: Record<TrafficChannel, string> = {
  organic: 'Organik arama',
  direct: 'Doğrudan giriş',
  referral: 'Referans site',
  social: 'Sosyal medya',
  paid: 'Ücretli reklam',
  email: 'E-posta',
  other: 'Diğer',
};

export function channelLabel(channel: TrafficChannel | string | null | undefined): string {
  if (!channel) return CHANNEL_LABELS.other;
  return CHANNEL_LABELS[channel as TrafficChannel] ?? CHANNEL_LABELS.other;
}

export function channelIconKey(channel: TrafficChannel | string | null | undefined): string {
  switch (channel) {
    case 'organic':
      return 'search';
    case 'direct':
      return 'direct';
    case 'social':
      return 'social';
    case 'paid':
      return 'paid';
    case 'email':
      return 'email';
    case 'referral':
      return 'referral';
    default:
      return 'other';
  }
}

export type AttributionInput = {
  referrer?: string | null;
  landingUrl?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
};

/** Oturum oluşturulurken veya eski kayıtlar için attribution çözümle */
export function resolveVisitorAttribution(input: AttributionInput): VisitorAttribution {
  const landing = input.landingUrl?.trim() || null;
  const referrer = input.referrer?.trim() || null;
  const fromLanding = parseUtmFromLanding(landing);

  const utmSource = input.utmSource || fromLanding.utmSource;
  const utmMedium = input.utmMedium || fromLanding.utmMedium;
  const utmCampaign = input.utmCampaign || fromLanding.utmCampaign;
  const utmTerm = input.utmTerm || fromLanding.utmTerm;
  const utmContent = input.utmContent || fromLanding.utmContent;

  const referrerHost = hostOf(referrer);
  const refUrl = safeUrl(referrer);
  const mediumLower = (utmMedium || '').toLowerCase();
  const sourceLower = (utmSource || '').toLowerCase();

  let channel: TrafficChannel = 'other';
  let source = 'unknown';
  let sourceLabel = 'Bilinmiyor';
  let searchQuery: string | null = utmTerm || null;

  const isPaid =
    Boolean(fromLanding.gclid || fromLanding.fbclid || fromLanding.msclkid) ||
    ['cpc', 'ppc', 'paid', 'paidsearch', 'display', 'cpm', 'paidsocial'].some((m) =>
      mediumLower.includes(m)
    ) ||
    sourceLower.includes('google ads') ||
    sourceLower.includes('adwords') ||
    sourceLower.includes('bing ads');

  if (isPaid) {
    channel = 'paid';
    source =
      utmSource ||
      (fromLanding.gclid
        ? 'google_ads'
        : fromLanding.msclkid
          ? 'bing_ads'
          : fromLanding.fbclid
            ? 'meta_ads'
            : 'paid');
    sourceLabel = utmSource
      ? utmSource
      : fromLanding.gclid
        ? 'Google Ads'
        : fromLanding.msclkid
          ? 'Microsoft Ads'
          : fromLanding.fbclid
            ? 'Meta Ads'
            : 'Ücretli kampanya';
    if (!searchQuery && utmTerm) searchQuery = utmTerm;
  } else if (mediumLower.includes('email') || sourceLower.includes('newsletter') || sourceLower.includes('mail')) {
    channel = 'email';
    source = utmSource || 'email';
    sourceLabel = utmSource || 'E-posta';
  } else if (referrerHost) {
    const social = matchSocial(referrerHost);
    if (social) {
      channel = 'social';
      source = referrerHost;
      sourceLabel = social;
    } else {
      const engine = matchSearchEngine(referrerHost);
      if (engine) {
        channel = 'organic';
        source = engine.name.toLowerCase();
        sourceLabel = engine.name;
        searchQuery = searchQuery || readQueryParam(refUrl, engine.queryKeys);
      } else {
        channel = 'referral';
        source = referrerHost;
        sourceLabel = referrerHost;
      }
    }
  } else if (utmSource) {
    channel = 'referral';
    source = utmSource;
    sourceLabel = utmSource;
  } else if (!referrer || referrer === '') {
    channel = 'direct';
    source = 'direct';
    sourceLabel = 'Doğrudan';
  }

  const summaryParts: string[] = [channelLabel(channel)];
  if (channel === 'organic' && searchQuery) {
    summaryParts.push(`“${searchQuery}”`);
    summaryParts.push(`(${sourceLabel})`);
  } else if (channel === 'paid' && searchQuery) {
    summaryParts.push(`“${searchQuery}”`);
  } else if (sourceLabel && sourceLabel !== 'Doğrudan' && sourceLabel !== 'Bilinmiyor') {
    summaryParts.push(sourceLabel);
  }
  if (utmCampaign) summaryParts.push(`· ${utmCampaign}`);

  return {
    channel,
    channelLabel: channelLabel(channel),
    source,
    sourceLabel,
    searchQuery,
    referrerHost,
    landingUrl: landing,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    summary: summaryParts.join(' '),
  };
}

export function attributionFromStoredSession(session: AttributionInput & {
  trafficChannel?: string | null;
  trafficSource?: string | null;
  searchQuery?: string | null;
  referrerHost?: string | null;
}): VisitorAttribution {
  const resolved = resolveVisitorAttribution(session);
  if (!session.trafficChannel) return resolved;

  const channel = session.trafficChannel as TrafficChannel;
  const sourceLabel = session.trafficSource || resolved.sourceLabel;
  const searchQuery = session.searchQuery ?? resolved.searchQuery;

  const summaryParts: string[] = [channelLabel(channel)];
  if (channel === 'organic' && searchQuery) {
    summaryParts.push(`“${searchQuery}”`);
    summaryParts.push(`(${sourceLabel})`);
  } else if (channel === 'paid' && searchQuery) {
    summaryParts.push(`“${searchQuery}”`);
  } else if (sourceLabel && channel !== 'direct') {
    summaryParts.push(sourceLabel);
  }
  if (resolved.utmCampaign) summaryParts.push(`· ${resolved.utmCampaign}`);

  return {
    ...resolved,
    channel,
    channelLabel: channelLabel(channel),
    source: session.trafficSource || resolved.source,
    sourceLabel,
    searchQuery,
    referrerHost: session.referrerHost ?? resolved.referrerHost,
    summary: summaryParts.join(' '),
  };
}
