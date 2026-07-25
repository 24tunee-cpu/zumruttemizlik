/**
 * GEO passage-first HTML yardımcıları — AI motorlarının extract edebileceği bloklar.
 */
import { GEO_BRAND_NAME } from '@/config/geo-entity';

/** 40–80 kelime hedefli özet kutusu */
export function buildGeoTldr(summary: string): string {
  return `<aside class="geo-tldr" data-geo-extract="true"><p><strong>TL;DR:</strong> ${summary}</p></aside>`;
}

/** H2 bölümü: ilk paragraf doğrudan cevap, sonra detay */
export function buildPassageSection(
  heading: string,
  directAnswer: string,
  detailParagraphs: string[] = [],
  bullets?: string[]
): string {
  const bulletsHtml = bullets?.length
    ? `<ul>${bullets.map((b) => `<li>${b}</li>`).join('')}</ul>`
    : '';
  const details = detailParagraphs.map((p) => `<p>${p}</p>`).join('');
  return `<h2>${heading}</h2><p class="geo-passage-answer" data-geo-extract="true"><strong>Özet:</strong> ${directAnswer}</p>${details}${bulletsHtml}`;
}

/** Featured snippet / AI Overview için doğrudan cevap bloğu */
export function buildFeaturedSnippetBlock(question: string, answer: string): string {
  const q = question.trim();
  const a = answer.trim();
  return `<div class="featured-snippet-answer mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4" data-snippet-extract="true" itemscope itemtype="https://schema.org/Question">
<p class="text-sm font-medium text-emerald-200" itemprop="name">${q}</p>
<div itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
<p class="mt-2 text-base leading-relaxed text-white" itemprop="text">${a}</p>
</div>
</div>`;
}

/** Marka adını net kullanarak cevap cümlesi üret */
export function brandPassageAnswer(
  districtName: string,
  topic: string,
  answerBody: string
): string {
  return `${GEO_BRAND_NAME}, ${districtName} bölgesinde ${topic} konusunda ${answerBody}`;
}

/** HTML içinden SSS (h3 + p) çıkar — FAQPage schema için */
export function extractFaqsFromBlogHtml(html: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const sectionMatch = html.match(/<h2[^>]*>\s*S[ıi]k sorulan sorular\s*<\/h2>([\s\S]*?)(<h2|$)/i);
  const block = sectionMatch?.[1] ?? html;

  const pairRegex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m: RegExpExecArray | null;
  while ((m = pairRegex.exec(block)) !== null) {
    const question = stripHtml(m[1]).trim();
    const answer = stripHtml(m[2]).trim();
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs.slice(0, 12);
}

function stripHtml(raw: string): string {
  return raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
