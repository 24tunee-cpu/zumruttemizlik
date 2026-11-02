# Schema contract

## Kurallar

1. Markup = sayfada görünen gerçek (parity).  
2. NAP / geo / telefon → `SITE_CONTACT` / `GEO_NAP`.  
3. AggregateRating yalnızca `trust-signals` veya Maps sync gerçek veri — uydurma yok.  
4. FAQPage: yalnızca görünür Q&A ile birebir; Google FAQ rich result beklenmez (2026).  
5. Tek H1; BreadcrumbList pozisyonları tutarlı.

## Nerede

| Schema | Dosya |
|--------|--------|
| Root LocalBusiness / Organization | `src/lib/root-schema.ts` |
| Pair Service + FAQ | `bolgeler/[district]/[service]/page.tsx` |
| Semt | `NeighborhoodLanding.tsx` (`CleaningService` additionalType) |
| Harita yorum | `map-reviews-seo.ts` |
| SSS | `seed-faq.ts` / `sss/[topic]` |

## areaServed

GBP “hizmet alanı” ≠ schema’da tüm Türkiye. Öncelik: Sarıyer / Zekeriyaköy / Avrupa Yakası (`geo-entity` GEO_AREA_SERVED_PRIORITY). Expansion ilçede abartılı “tüm İstanbul her gün” yok.
