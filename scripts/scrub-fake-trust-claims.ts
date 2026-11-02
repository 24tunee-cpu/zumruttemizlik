/**
 * Yayınlı blog + SiteSettings NAP scrub — uydurma 15+/5000+/binlerce müşteri vb.
 * Çalıştır: npx tsx scripts/scrub-fake-trust-claims.ts
 */
import { PrismaClient } from '@prisma/client';
import { SITE_CONTACT } from '../src/config/site-contact';

const REPLACEMENTS: Array<{ re: RegExp; to: string }> = [
  {
    re: /15\+\s*y[ıi]l(?:l[ıi]k)?(?:\s+deneyim(?:imizle|imiz)?|\s+tecr[uü]be(?:mizle|miz)?)?/gi,
    to: 'profesyonel ekip ile',
  },
  {
    re: /15\s*y[ıi]ll[ıi]k\s+deneyimimizle/gi,
    to: 'Profesyonel ekibimizle',
  },
  {
    re: /20\+\s*y[ıi]l(?:l[ıi]k)?(?:\s+tecr[uü]be|\s+deneyim)?/gi,
    to: 'doğrulanmış Google güven sinyali',
  },
  {
    re: /20\s*y[ıi]l[ıi]\s+a[sş]k[ıi]n\s+tecr[uü]bemizle/gi,
    to: 'Profesyonel ekibimizle',
  },
  {
    re: /5000\+/gi,
    to: 'Google yorumlarımız',
  },
  {
    re: /%?\s*98\s*%?\s*m[uü][sş]teri\s+memnuniyeti/gi,
    to: 'Google doğrulanmış puan',
  },
  {
    re: /binlerce\s+(olumlu\s+)?m[uü][sş]teri\s+yorumuna\s+sahibiz/gi,
    to: 'doğrulanmış Google yorumlarımız vardır — harita & yorumlar sayfasında görebilirsiniz',
  },
  {
    re: /binlerce\s+mutlu\s+m[uü][sş]teri(?:miz)?/gi,
    to: 'Google Harita üzerinden doğrulanmış yorumlar',
  },
  {
    re: /Binlerce\s+mutlu\s+m[uü][sş]terimiz\s+var\.?/gi,
    to: 'Güncel Google puan ve yorumlarımız için harita & yorumlar sayfasına bakın.',
  },
];

function scrubHtml(input: string): string {
  let out = input;
  for (const { re, to } of REPLACEMENTS) {
    out = out.replace(re, to);
  }
  return out;
}

async function main() {
  const prisma = new PrismaClient();
  let blogTouched = 0;
  let settingsTouched = 0;

  try {
    const posts = await prisma.blogPost.findMany({
      select: { id: true, slug: true, content: true, excerpt: true },
    });

    for (const post of posts) {
      const nextContent = scrubHtml(post.content);
      const nextExcerpt = scrubHtml(post.excerpt);
      if (nextContent !== post.content || nextExcerpt !== post.excerpt) {
        await prisma.blogPost.update({
          where: { id: post.id },
          data: { content: nextContent, excerpt: nextExcerpt },
        });
        blogTouched += 1;
        console.log(`scrub blog: ${post.slug}`);
      }
    }

    const settings = await prisma.siteSettings.findFirst();
    if (settings) {
      const desired = SITE_CONTACT.addressLine;
      if ((settings.address || '').trim() !== desired) {
        await prisma.siteSettings.update({
          where: { id: settings.id },
          data: { address: desired },
        });
        settingsTouched = 1;
        console.log('scrub SiteSettings.address → site-contact NAP');
      }
    }

    console.log(
      JSON.stringify({ ok: true, blogTouched, settingsTouched, totalBlogs: posts.length })
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
