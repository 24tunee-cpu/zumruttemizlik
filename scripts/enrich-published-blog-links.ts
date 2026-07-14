/**
 * Zaten yayında olan v2 blog yazılarına iç link bloğu ekler (idempotent).
 */
import { PrismaClient } from '@prisma/client';
import {
  enrichBlogContentWithInternalLinks,
  hasAutoInternalLinks,
} from '../src/lib/blog-publish-internal-links';
import { submitIndexNowBlogSlugs } from '../src/lib/indexnow';

async function main() {
  const prisma = new PrismaClient();
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { id: true, slug: true, content: true },
      orderBy: { updatedAt: 'asc' },
    });

    let enriched = 0;
    let linksTotal = 0;
    const indexSlugs: string[] = [];

    for (const post of posts) {
      if (hasAutoInternalLinks(post.content)) continue;

      const { content, linksAdded } = await enrichBlogContentWithInternalLinks(prisma, {
        slug: post.slug,
        content: post.content,
      });

      if (linksAdded === 0) continue;

      await prisma.blogPost.update({
        where: { id: post.id },
        data: { content },
      });

      enriched += 1;
      linksTotal += linksAdded;
      indexSlugs.push(post.slug);
      console.log(`[ENRICH] ${post.slug} (+${linksAdded} links)`);
    }

    console.log(`\nEnriched ${enriched} posts, ${linksTotal} total link targets.`);

    if (indexSlugs.length > 0) {
      const indexNow = await submitIndexNowBlogSlugs(indexSlugs);
      console.log('IndexNow:', JSON.stringify(indexNow));
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
