import type { PrismaClient } from '@prisma/client';
import { safeRevalidatePath } from '@/lib/safe-revalidate';
import { AUTOPILOT_LIMITS } from '../constants';

export async function publishScheduledGeoSss(
  prisma: PrismaClient
): Promise<{ published: number; slugs: string[] }> {
  const now = new Date();
  const due = await prisma.geoSssContent.findMany({
    where: {
      published: false,
      scheduledPublishAt: { lte: now },
    },
    orderBy: [{ scheduledPublishAt: 'asc' }, { createdAt: 'asc' }],
    take: AUTOPILOT_LIMITS.geoSssPublish,
    select: { id: true, slug: true },
  });

  const slugs: string[] = [];
  for (const row of due) {
    await prisma.geoSssContent.update({
      where: { id: row.id },
      data: { published: true, scheduledPublishAt: null },
    });
    slugs.push(row.slug);
    safeRevalidatePath(`/geo-sss/${row.slug}`);
  }

  if (slugs.length > 0) {
    safeRevalidatePath('/geo-sss');
    safeRevalidatePath('/geo-sss/sitemap.xml');
  }

  return { published: slugs.length, slugs };
}
