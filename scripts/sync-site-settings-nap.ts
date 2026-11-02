/**
 * SiteSettings.address / phone / hours → GBP NAP ile hizala.
 * Çalıştır: npx tsx scripts/sync-site-settings-nap.ts
 */
import { PrismaClient } from '@prisma/client';
import { SITE_CONTACT } from '../src/config/site-contact';

async function main() {
  const prisma = new PrismaClient();
  try {
    const data = {
      address: SITE_CONTACT.addressLine,
      phone: SITE_CONTACT.phoneDisplay,
      workingHours: '7/24 Hizmet',
      whatsapp: SITE_CONTACT.whatsappDigits,
      email: SITE_CONTACT.email,
    };

    const existing = await prisma.siteSettings.findFirst({
      select: { id: true, address: true },
    });

    if (!existing) {
      const created = await prisma.siteSettings.create({
        data: {
          siteName: SITE_CONTACT.companyName,
          ...data,
        },
        select: { id: true, address: true, phone: true },
      });
      console.log('[OK] SiteSettings created:', created);
      return;
    }

    const updated = await prisma.siteSettings.update({
      where: { id: existing.id },
      data,
      select: { id: true, address: true, phone: true, workingHours: true, whatsapp: true },
    });
    console.log('[OK] SiteSettings NAP synced:', updated);
    console.log('[WAS] previous address:', existing.address);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
