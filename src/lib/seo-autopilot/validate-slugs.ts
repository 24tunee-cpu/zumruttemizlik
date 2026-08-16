import { V2_DISTRICTS } from '@/lib/seed-blog-v2-content';
import { resolveLegacyRedirect } from '@/lib/legacy-url-redirects';
import { COMPARISONS } from './comparison-seed';
import { EXTRA_GEO_SSS_TOPICS } from './geo-sss-seed';
import { SEASONAL_TOPICS } from './seasonal';
import { isAsciiSlug } from './slug-guard';

export function validateAutopilotSlugs(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const { slug } of COMPARISONS) {
    if (!isAsciiSlug(slug)) errors.push(`[ascii] comparison: ${slug}`);
    const redirect = resolveLegacyRedirect(`/blog/${slug}`);
    if (redirect) errors.push(`[redirect] comparison: /blog/${slug} → ${redirect.to}`);
  }

  for (const { slug } of SEASONAL_TOPICS) {
    if (!isAsciiSlug(slug)) errors.push(`[ascii] seasonal: ${slug}`);
    const redirect = resolveLegacyRedirect(`/blog/${slug}`);
    if (redirect) errors.push(`[redirect] seasonal: /blog/${slug} → ${redirect.to}`);
  }

  for (const d of V2_DISTRICTS) {
    for (const topic of EXTRA_GEO_SSS_TOPICS) {
      const slug = `${d.slug}-${topic.key}-2026`;
      if (!isAsciiSlug(slug)) errors.push(`[ascii] geo-sss: ${slug}`);
    }
  }

  return { ok: errors.length === 0, errors };
}
