# AEO / GEO — ZVT kuralları (2026-11 Google-aligned)

Sıralama / AI citation **garantisi yok**.

## Resmi Google (generative AI Search)

Kaynak: [Optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) · [AI features & your website](https://developers.google.com/search/docs/appearance/ai-features)

| Yap | Yapma |
|-----|-------|
| Crawlable, indexable HTML; iç link; mobil deneyim | “AI için özel markup / chunking” zorunlu sanma |
| People-first, uzman, görünür metin | Sadece AI için yeniden yazma |
| Schema-content **parity** (rich result için) | AI Overviews için özel schema.org şartı uydurma |
| GBP / Merchant bilgisi güncel | Sahte mention / forum spam |
| — | **llms.txt = Google ranking faktörü** iddiası (Google: Search kullanmaz) |

Mevcut `llms.txt` / `llms-full.txt` **bozulmaz**; entity tutarlılığı için tutulabilir — “sihir” diye satılmaz.

## FAQPage

- Google genel sitelerde FAQ **rich result**’ı kaldırmış / kısıtlamıştır; “rich = AEO win” iddiası yasak.  
- FAQPage markup: yalnızca sayfada **görünen** gerçek Q&A ile birebir parity.  
- FAQ ekleme gerekçesi: kullanıcı sorusu; schema bahanesi değil.

## Ne işe yarar (ZVT pratik)

1. **Entity:** NAP + Place ID + sameAs + `areaServed` (`site-contact` / `geo-entity` / schema).  
2. **Görünür Q&A:** 40–80 kelime net cevap (home AEO strip, `/sss/[topic]`, geo-sss, semt FAQ).  
3. **GBP canlılığı:** fotoğraf, post, yorum velocity + yanıt → prominence (local).  
4. **Özgün yerel derinlik:** template spam değil (`neighborhood-gate` + `anti-patterns`).

## ZVT uygulama tablosu

| İş | Yap |
|----|-----|
| Geo SSS / `/sss/[topic]` | Tek niyet, özgün cevap, hub link |
| Pair FAQ | `buildLocalizedPairFaqs` + soft claim |
| Home AEO | Az sayıda yüksek niyet FAQ + FAQPage parity |
| Schema | `schema-contract.md`; AggregateRating yalnız verified trust |
| AI mention test | Admin GEO Mention Skor — manuel; scraping yok |

## Çıkış

“FAQ rich / AI citation / llms sihir garantisi yok” + hangi URL’de görünür Q&A değişti.
