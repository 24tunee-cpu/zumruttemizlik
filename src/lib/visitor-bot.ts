/** Bilinen bot / crawler / audit UA kalıpları — in-app tarayıcılar hariç */
const BOT_UA =
  /bot|crawl|spider|slurp|archiver|preview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptimerobot|semrush|ahrefs|petalbot|bytespider|facebookexternalhit|linkedinbot|twitterbot|telegrambot|google-inspectiontool|chrome-lighthouse|phantomjs|selenium|webdriver|screaming frog|python-requests|curl\/|wget\/|go-http-client|java\/|libwww|axios\/|node-fetch/i;

const DATACENTER_UA_HINT =
  /compatible;\s*$/i;

export function isLikelyBot(userAgent: string | null | undefined): boolean {
  const ua = (userAgent || '').trim();
  if (!ua || ua.length < 12) return true;
  if (BOT_UA.test(ua)) return true;
  if (DATACENTER_UA_HINT.test(ua)) return true;
  return false;
}
