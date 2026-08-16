import type { PrismaClient } from '@prisma/client';
import { KNOWN_SLUG_FIXES } from './slug-guard';

export async function fixKnownBadSlugs(prisma: PrismaClient): Promise<{ fixed: string[] }> {
  const fixed: string[] = [];

  for (const [bad, good] of Object.entries(KNOWN_SLUG_FIXES)) {
    const row = await prisma.blogPost.findUnique({ where: { slug: bad }, select: { id: true } });
    if (!row) continue;

    const targetExists = await prisma.blogPost.findUnique({ where: { slug: good }, select: { id: true } });
    if (targetExists) {
      await prisma.blogPost.delete({ where: { id: row.id } });
      fixed.push(`${bad} → deleted (target exists)`);
      continue;
    }

    await prisma.blogPost.update({ where: { id: row.id }, data: { slug: good } });
    fixed.push(`${bad} → ${good}`);
  }

  return { fixed };
}
