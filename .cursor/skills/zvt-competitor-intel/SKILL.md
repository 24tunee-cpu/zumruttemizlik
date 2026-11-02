---
name: zvt-competitor-intel
description: >-
  Analyze why local cleaning competitors outrank Zümrüt Vadi Temizlik and what
  to update next. Use for rakip analizi, map pack rivals, competitive gap,
  "neden öndeler", competitor GBP/reviews/citations/website. Routes Garrett
  local-competitor-analysis + local-seo-audit through AGENTS hard stops; paid
  MCP off unless approved. Does not invent rankings or fake review advice.
---

# ZVT Competitor Intel (v2026-11)

Neden rakipler önde / ne güncellenecek — **kanıtlı boşluk analizi**. Sıralama garantisi yok.

## Ne zaman

- “Rakiplerimi analiz et”, “neden benden öndeler”, map pack / organik rakip
- Competitive gap, GBP/yorum/citation/site karşılaştırması
- Sonraki kaldıraç önceliği (P0–P3)

## Önce oku (zorunlu sıra)

1. `AGENTS.md` §0 + §5 (local) + verified-facts  
2. [systems-map.md](../zvt-seo-beast/references/systems-map.md) §1 (relevance / distance / prominence)  
3. [hard-stops.md](references/hard-stops.md)  
4. [market-anchors.md](references/market-anchors.md)  
5. Garrett playbook (özet çerçeve): `local-competitor-analysis` — **ücretli tool çağırma**  
6. İsteğe bağlı derin audit: `local-seo-audit` (yalnız checklist; LocalSEOData yok)

Router: `zvt-garrett-dispatch` → bu skill + max 2 Garrett.

## Akış

```text
1. Anahtar kelime + coğrafya sabitle (market-anchors)
2. Rakip listesi: kullanıcı + GEO_COMPETITOR_NAMES + canlı SERP/Maps (gözlem)
3. Matris doldur (matrix.md) — bilinmeyen = "bilinmiyor", uydurma yok
4. Gap → P0–P3 (fayda · risk · efor)
5. Çıktı: rapor + hangi skill’e git (review / GBP / citation / beast kod)
6. Spam rakip → rapor öner; kopyalama yasak
```

## Veri kuralları

| Kaynak | Kullan |
|--------|--------|
| Canlı Google Maps / organic (tarayıcı veya kullanıcı ekranı) | Evet — gözlem notu |
| Site kodu / Admin GEO / trust-signals | Evet |
| GSC / Maps API (env doluysa) | Evet — ham metrik |
| LocalSEOData / Ahrefs / Semrush / Local Falcon | **Yalnız açık onay + bütçe** |
| Tahmini DA / “kesin #1 sebebi” | Hayır |

Doğrulanmamış skor → “açık soru”. Rating/yorum sayısı yalnız GBP veya `trust-signals` ile.

## Çıktı şablonu

1. **Kapsam** — keyword’ler, ilçe/semt, tarih  
2. **Rakip matrisi** — [matrix.md](references/matrix.md)  
3. **Neden öndeler (hipotez + kanıt)** — sütun sütun (relevance / distance / prominence)  
4. **Bizde güncelle** — P0 panel / P1 site / P2 içerik / P3 otorite  
5. **Yapma** — stuffed ad, sahte yorum, doorway semt, peyzaj  
6. **Sonraki skill** — `zvt-local-seo` | `review-management` | `zvt-seo-beast` | citation  

## Kod değişimi

Site/meta/schema değişecekse → `zvt-seo-beast` + checklist. Bu skill yalnız intel + öncelik; tek başına deploy yok.
