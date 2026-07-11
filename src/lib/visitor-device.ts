export type DeviceInfo = {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
};

export function parseUserAgent(ua: string): DeviceInfo {
  const s = ua || '';

  const isTablet = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(s);
  const isMobile = !isTablet && /Mobile|iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry/i.test(s);
  const deviceType: DeviceInfo['deviceType'] = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

  let os = 'Bilinmiyor';
  if (/Windows NT/i.test(s)) os = 'Windows';
  else if (/Mac OS X|Macintosh/i.test(s)) os = 'macOS';
  else if (/Android/i.test(s)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(s)) os = 'iOS';
  else if (/Linux/i.test(s)) os = 'Linux';

  let browser = 'Bilinmiyor';
  if (/Edg\//i.test(s)) browser = 'Edge';
  else if (/Chrome\//i.test(s) && !/Edg\//i.test(s)) browser = 'Chrome';
  else if (/Safari\//i.test(s) && !/Chrome\//i.test(s)) browser = 'Safari';
  else if (/Firefox\//i.test(s)) browser = 'Firefox';
  else if (/Opera|OPR\//i.test(s)) browser = 'Opera';

  return { deviceType, os, browser };
}

export function deviceTypeLabel(type: string | null | undefined): string {
  switch (type) {
    case 'mobile':
      return 'Mobil';
    case 'tablet':
      return 'Tablet';
    case 'desktop':
      return 'Masaüstü';
    default:
      return 'Bilinmiyor';
  }
}

export function formatDuration(sec: number): string {
  if (sec < 60) return `${sec} sn`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return s > 0 ? `${m} dk ${s} sn` : `${m} dk`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm > 0 ? `${h} sa ${rm} dk` : `${h} sa`;
}
