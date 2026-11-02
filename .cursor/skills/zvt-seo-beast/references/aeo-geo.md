# AEO / GEO — ZVT kuralları (2026 araştırma özeti)

Sıralama garantisi yok. Amaç: entity netliği + çıkarılabilir cevap + Maps/site tutarlılığı.

## Ne işe yarar (kanıtlı / resmi)

1. **Entity:** NAP + Place ID + sameAs + `areaServed` tutarlılığı (`site-contact` / `geo-entity` / schema).  
2. **Görünür Q&A:** Sayfada gerçek soru-cevap (40–80 kelime net cevap). AI’ler içerikten çıkarır.  
3. **GBP canlılığı:** fotoğraf, post, yorum **velocity** + yanıt (prominence).  
4. **Yerel sayfa derinliği:** özgün semt/operasyon — template spam değil.

## Ne sihir değil (abartma)

- **llms.txt** Google AI Overviews için “zorunlu faktör” değil (Google generative AI mythbusting yönü). Mevcut dosyaları bozma; ranking garantisi iddia etme.  
- **FAQPage rich result** Google’da genel sitelerde kaldırıldı (2026). Schema kalabilir; **zengin sonuç / AI citation garantisi yok**. FAQ’yu yalnızca faydalı içerik için yaz.  
- Schema ≠ kısa vadeli AI citation artışı (çoklu endüstri ölçümü). Schema-content **parity** şart (markup = görünür metin).  
- Keyword stuffing / sahte Reddit / sahte yorum → yasak.

## ZVT uygulama

| İş | Yap |
|----|-----|
| Geo SSS / `/sss/[topic]` | Tek niyet, özgün cevap, hub’a link |
| Pair FAQ | `buildLocalizedPairFaqs` — ilçe soft claim |
| Schema | `schema-contract.md`; AggregateRating yalnızca verified trust |
| AI mention test | Admin GEO Mention Skor — manuel; scraping yok |

## Çıkış

AEO işi bitince: “FAQ rich result / AI citation garantisi yok” + hangi sayfada görünür Q&A eklendiğini raporla.
