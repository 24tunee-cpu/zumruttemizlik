import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeCronRequest, cronUnauthorizedResponse } from '@/lib/cron-auth';
import { safeRevalidatePath } from '@/lib/safe-revalidate';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Tüm yayınlanmış blog sayfalarının ISR önbelleğini temizler.
 * Deploy sonrası veya toplu slug düzeltmesinden sonra bir kez çalıştırın.
 */
export async function GET(request: NextRequest) {
  const auth = authorizeCronRequest(request);
  if (!auth.ok) {
    return cronUnauthorizedResponse(auth.reason);
  }

  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
    });

    safeRevalidatePath('/blog');
    safeRevalidatePath('/feed.xml');
    safeRevalidatePath('/atom.xml');
    safeRevalidatePath('/feed.json');

    for (const { slug } of posts) {
      safeRevalidatePath(`/blog/${slug}`);
    }

    return NextResponse.json({
      ok: true,
      revalidated: posts.length,
      authVia: auth.via,
      at: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Blog revalidate failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
