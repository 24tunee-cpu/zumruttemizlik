/**
 * Günlük drip — GitHub Actions yerine Netlify Scheduled Function.
 * netlify.toml: schedule 0 5 * * * (UTC)
 * CRON_SECRET Netlify env'de olmalı.
 */
export async function handler() {
  const secret = process.env.CRON_SECRET?.trim();
  const base = (
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.zumrutvaditemizlik.com'
  ).replace(/\/$/, '');

  if (!secret) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'CRON_SECRET missing on Netlify — Site configuration → Environment variables',
      }),
    };
  }

  const res = await fetch(`${base}/api/cron/publish-due-blogs`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secret}`,
      Accept: 'application/json',
    },
  });

  const text = await res.text();
  return {
    statusCode: res.status,
    headers: { 'Content-Type': 'application/json' },
    body: text || JSON.stringify({ ok: res.ok, status: res.status }),
  };
}
