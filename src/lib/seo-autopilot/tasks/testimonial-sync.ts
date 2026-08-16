import type { PrismaClient } from '@prisma/client';
import { AUTOPILOT_LIMITS } from '../constants';

export async function syncTestimonialsFromMaps(
  prisma: PrismaClient
): Promise<{ synced: number; skipped: boolean }> {
  const reviews = await prisma.mapReviewSnapshot.findMany({
    where: {
      starRating: { gte: 4 },
      comment: { not: null },
    },
    orderBy: { fetchedAt: 'desc' },
    take: 20,
  });

  if (reviews.length === 0) {
    return { synced: 0, skipped: true };
  }

  let synced = 0;
  for (const r of reviews) {
    if (synced >= AUTOPILOT_LIMITS.testimonialSync) break;
    if (!r.comment?.trim()) continue;

    const seedKey = `maps:${r.reviewName}`;
    const existing = await prisma.testimonial.findFirst({
      where: { seedKey },
      select: { id: true },
    });
    if (existing) continue;

    await prisma.testimonial.create({
      data: {
        seedKey,
        name: r.reviewerDisplayName?.trim() || 'Müşteri',
        location: 'İstanbul',
        rating: r.starRating ?? 5,
        content: r.comment.trim().slice(0, 500),
        service: 'Google Maps',
        isActive: true,
        order: 1000 + synced,
      },
    });
    synced++;
  }

  return { synced, skipped: false };
}
