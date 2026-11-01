/**
 * Kamu API CORS — wildcard yerine site origin.
 */
export function getAllowedCorsOrigin(requestOrigin: string | null): string {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://www.zumrutvaditemizlik.com';

  if (process.env.NODE_ENV !== 'production') {
    if (
      requestOrigin &&
      (/^http:\/\/localhost(:\d+)?$/i.test(requestOrigin) ||
        /^http:\/\/127\.0\.0\.1(:\d+)?$/i.test(requestOrigin))
    ) {
      return requestOrigin;
    }
  }

  if (requestOrigin === site) return site;
  try {
    const u = new URL(site);
    const www = `${u.protocol}//www.${u.hostname.replace(/^www\./, '')}`;
    const apex = `${u.protocol}//${u.hostname.replace(/^www\./, '')}`;
    if (requestOrigin === www || requestOrigin === apex) return requestOrigin;
  } catch {
    // ignore
  }

  return site;
}

export function publicCorsHeaders(requestOrigin: string | null): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': getAllowedCorsOrigin(requestOrigin),
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Correlation-ID',
    Vary: 'Origin',
  };
}
