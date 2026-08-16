import type { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { makeEngagementGuidePost } from '@/lib/blog-engagement-html';
import { AUTOPILOT_LIMITS, AUTOPILOT_TAGS } from '../constants';
import { isAsciiSlug } from '../slug-guard';

const REFRESH_MARKER = 'data-autopilot-refresh="2026"';

export async function refreshStaleBlogs(
  prisma: PrismaClient
): Promise<{ refreshed: number; slugs: string[] }> {
  const candidates = await prisma.blogPost.findMany({
    where: {
      published: true,
      NOT: { content: { contains: REFRESH_MARKER } },
    },
    orderBy: { updatedAt: 'asc' },
    take: AUTOPILOT_LIMITS.blogRefresh,
    select: { id: true, slug: true, content: true, tags: true },
  });

  const slugs: string[] = [];
  const stamp = new Date().toISOString().slice(0, 10);

  for (const post of candidates) {
    const banner = `<aside class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 my-6" ${REFRESH_MARKER}><p class="text-sm text-emerald-100"><strong>Güncelleme (${stamp}):</strong> Bu rehber 2026 İstanbul koşullarına göre gözden geçirildi; fiyat ve uygulama notları güncel tutulmaktadır.</p></aside>`;

    const tags = post.tags.includes(AUTOPILOT_TAGS.refresh)
      ? post.tags
      : [...post.tags, AUTOPILOT_TAGS.refresh].slice(0, 12);

    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        content: `${banner}\n${post.content}`,
        tags,
      },
    });
    slugs.push(post.slug);
    revalidatePath(`/blog/${post.slug}`);
  }

  if (slugs.length > 0) {
    revalidatePath('/blog');
  }

  return { refreshed: slugs.length, slugs };
}

function slugifyQuery(query: string): string {
  return query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 55)
    .replace(/-+$/, '');
}

export async function createGscDraftBlogs(
  prisma: PrismaClient
): Promise<{ created: number; slugs: string[]; skipped: boolean }> {
  const rawMetrics = await prisma.gscLandingMetric.findMany({
    where: {
      key: { startsWith: 'blog:' },
      impressions: { gte: 80 },
      ctr: { lt: 0.012 },
      date: { gte: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000) },
    },
    orderBy: [{ date: 'desc' }, { impressions: 'desc' }],
    take: 120,
  });

  const latestBySlug = new Map<string, (typeof rawMetrics)[0]>();
  for (const m of rawMetrics) {
    const slug = m.key.replace(/^blog:/, '');
    if (!slug || latestBySlug.has(slug)) continue;
    latestBySlug.set(slug, m);
  }

  const metrics = [...latestBySlug.values()].sort((a, b) => b.impressions - a.impressions).slice(0, 30);

  if (metrics.length === 0) {
    return { created: 0, slugs: [], skipped: true };
  }

  const slugs: string[] = [];
  let created = 0;

  for (const m of metrics) {
    if (created >= AUTOPILOT_LIMITS.gscBlogDraft) break;

    const query = m.topQuery?.trim();
    if (!query || query.length < 8) continue;

    const baseSlug = slugifyQuery(query);
    if (!baseSlug) continue;

    const slug = `istanbul-${baseSlug}-2026`.replace(/--+/g, '-');
    if (slug.length > 90) continue;
    if (!isAsciiSlug(slug)) continue;

    const exists = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
    if (exists) continue;

    const post = makeEngagementGuidePost({
      slug,
      title: `${query.charAt(0).toUpperCase()}${query.slice(1)} | İstanbul 2026 Rehberi`,
      metaTitle: `${query} — İstanbul 2026 | Zümrüt Vadi Temizlik`,
      metaDesc: `${query} hakkında İstanbul 2026 güncel rehber: adımlar, maliyet ve pratik ipuçları.`,
      excerpt: `Google arama verilerine göre İstanbul'da "${query}" konusu yüksek ilgi görüyor; pratik rehber.`,
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200',
      category: 'Gündem',
      tags: ['istanbul', '2026', 'gündem', AUTOPILOT_TAGS.gscBlog],
      keyword: query,
      intro: `İstanbul'da "${query}" araması yapan kullanıcılar için derlenmiş, uygulanabilir bir özet rehber.`,
      sections: [
        {
          heading: 'Kısa cevap ve öncelikler',
          paragraphs: [
            `${query} konusunda önce resmi kaynakları ve güncel duyuruları kontrol edin; mahalle/ilçe farkları uygulamayı değiştirir.`,
            'Aşağıdaki adımlar genel İstanbul pratiğine göre derlenmiştir; kesin bilgi için ilgili kurum sitesini doğrulayın.',
          ],
          bullets: [
            'Resmi duyuru ve e-Devlet kontrolü',
            'İlçe belediyesi / site yönetimi kuralları',
            'Randevu ve mesai saati planlaması',
            'Yazılı teklif veya dekont saklama',
            'Acil durum alternatifleri',
          ],
        },
        {
          heading: 'İstanbul’da uygulama adımları',
          paragraphs: [
            'Merkez ilçelerde (Kadıköy, Beşiktaş, Şişli) yoğunluk nedeniyle sabah erken veya öğleden sonra randevu tercih edin.',
            'Toplu taşıma ile birleşen güzergâh planı yaparak süreyi kısaltabilirsiniz.',
          ],
        },
        {
          heading: 'Sık yapılan hatalar',
          paragraphs: [
            'Eski blog veya forum bilgisine güvenmek güncel olmayan sonuç verir.',
            'Tek kaynaktan karar vermek yerine en az iki resmi kanalı karşılaştırın.',
          ],
        },
      ],
      faq: [
        { q: `${query} için en güncel bilgi nereden alınır?`, a: 'e-Devlet, ilgili kurum resmi sitesi ve 2026 duyuruları birincil kaynaktır.' },
        { q: 'İlçelere göre fark var mı?', a: 'Evet; İstanbul’da ilçe belediyesi ve altyapı koşulları süreci etkileyebilir.' },
        { q: 'Profesyonel destek gerekir mi?', a: 'Konuya bağlıdır; ev ve ofis temizliği gibi hizmetlerde yazılı kapsamlı teklif alın.' },
      ],
    });

    const schedule = new Date();
    schedule.setUTCDate(schedule.getUTCDate() + 14);
    schedule.setUTCHours(0, 0, 0, 0);

    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        image: post.image ?? null,
        category: post.category,
        tags: post.tags,
        metaTitle: post.metaTitle ?? null,
        metaDesc: post.metaDesc ?? null,
        author: 'Zümrüt Vadi Temizlik',
        published: false,
        scheduledPublishAt: schedule,
        views: 0,
      },
    });

    slugs.push(slug);
    created++;
  }

  return { created, slugs, skipped: false };
}
