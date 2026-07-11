/**
 * Brand asset optimizer — Faz A performans.
 * logo.png (~2.4 MB) → sıkıştırılmış PNG + WebP
 * og-image.jpg (1200×630) — sosyal paylaşım için
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const logoSrc = path.join(publicDir, 'logo.png');
const logoBackup = path.join(publicDir, 'logo.original.png');

const LOGO_MAX = 512;
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function main() {
  if (!fs.existsSync(logoSrc)) {
    console.error('logo.png bulunamadı:', logoSrc);
    process.exit(1);
  }

  const originalSize = fs.statSync(logoSrc).size;
  const meta = await sharp(logoSrc).metadata();
  console.log(`Kaynak logo: ${meta.width}×${meta.height}, ${formatKb(originalSize)}`);

  // Yedek (bir kez)
  if (!fs.existsSync(logoBackup)) {
    fs.copyFileSync(logoSrc, logoBackup);
    console.log('Yedek oluşturuldu: logo.original.png');
  }

  const logoBuffer = await sharp(logoBackup)
    .resize(LOGO_MAX, LOGO_MAX, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 85, effort: 10 })
    .toBuffer();

  fs.writeFileSync(logoSrc, logoBuffer);

  const webpBuffer = await sharp(logoBuffer)
    .webp({ quality: 82, effort: 6 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'logo.webp'), webpBuffer);

  // OG görseli: koyu zemin + ortalanmış logo
  const logoForOg = await sharp(logoBuffer)
    .resize(420, 420, { fit: 'inside', withoutEnlargement: true })
    .toBuffer();

  const ogBackground = sharp({
    create: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      channels: 3,
      background: { r: 10, g: 31, b: 68 },
    },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${OG_WIDTH}" height="${OG_HEIGHT}">
            <defs>
              <radialGradient id="g" cx="70%" cy="20%" r="80%">
                <stop offset="0%" stop-color="#065f46" stop-opacity="0.55"/>
                <stop offset="100%" stop-color="#0A1F44" stop-opacity="0"/>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="#0A1F44"/>
            <rect width="100%" height="100%" fill="url(#g)"/>
          </svg>`
        ),
        top: 0,
        left: 0,
      },
      {
        input: logoForOg,
        gravity: 'centre',
      },
    ])
    .jpeg({ quality: 82, mozjpeg: true, progressive: true });

  await ogBackground.toFile(path.join(publicDir, 'og-image.jpg'));

  const newLogoSize = fs.statSync(logoSrc).size;
  const ogSize = fs.statSync(path.join(publicDir, 'og-image.jpg')).size;

  console.log('\nSonuç:');
  console.log(`  logo.png:  ${formatKb(originalSize)} → ${formatKb(newLogoSize)}`);
  console.log(`  logo.webp: ${formatKb(webpBuffer.length)}`);
  console.log(`  og-image.jpg: ${formatKb(ogSize)} (${OG_WIDTH}×${OG_HEIGHT})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
