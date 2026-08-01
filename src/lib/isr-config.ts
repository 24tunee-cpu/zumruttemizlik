/**
 * ISR süreleri — tek kaynak (dokümantasyon).
 * Next.js segment config yalnızca literal kabul eder; page.tsx dosyalarında aynı sayıyı yazın.
 */
export const ISR_PROGRAMMATIC_SEC = 86_400;

/** Blog yazıları — cron ile on-demand revalidatePath tetiklenir */
export const ISR_BLOG_POST_SEC = 86_400;

/** Blog listesi */
export const ISR_BLOG_INDEX_SEC = 3_600;

/** Referans / yorum sayfası — nadiren değişir */
export const ISR_TESTIMONIALS_SEC = 86_400;
