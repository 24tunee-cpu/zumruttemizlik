/**
 * Sekme ikonu (favicon).
 *
 * NOT (geçici): Vercel'de dosya yükleme yerine favicon doğrudan
 * `public/logo.ico` dosyasından servis ediliyor. Upload/veritabanı
 * tabanlı favicon çözümüne sonra dönülecek.
 */
const STATIC_ICON = '/logo.ico';

export async function getSiteIconHref(): Promise<string> {
  return STATIC_ICON;
}
