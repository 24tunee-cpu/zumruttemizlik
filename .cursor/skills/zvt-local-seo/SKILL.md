---
name: zvt-local-seo
description: >-
  Zümrüt Vadi GBP, Maps pack, hybrid SAB, reviews, citations, Bing/Apple Places.
  Use for local pack, review replies, citation tracker, service-area, or when
  gbp-optimization/review-management/local-citations conflict with this repo.
  Applies systems-map local pillars; blocks stuffed names and fake reviews.
  Defers to AGENTS.md; site code edits use zvt-seo-beast; routing via
  zvt-garrett-dispatch.
---

# ZVT Local SEO (v2026-11-smart)

GBP / Maps / citation köprüsü. Site kodu → `zvt-seo-beast`. Router → `zvt-garrett-dispatch`.

## Akıllı akış

```text
1. AGENTS §0 + verified-facts (NAP/rating)
2. systems-map.md §1 (relevance / distance / prominence)
3. İlgili reference (aşağı)
4. Panel işi → checklist çıktısı (kod yoksa commit yok)
5. Kod NAP/UTM → beast + site-contact / gbp-links
6. Garanti yok
```

## Önce oku

1. `AGENTS.md` §0  
2. [verified-facts](../zvt-seo-beast/references/verified-facts.md)  
3. [systems-map §1](../zvt-seo-beast/references/systems-map.md)  
4. İlgili reference  

## References

| Dosya | Konu |
|-------|------|
| [garrett-routing-zvt.md](references/garrett-routing-zvt.md) | Garrett eşleme + MCP kapalı |
| [gbp-panel-checklist.md](references/gbp-panel-checklist.md) | P0–P3 panel önceliği |
| [citation-workflow.md](references/citation-workflow.md) | Admin dizin tracker |
| [review-response-tr.md](references/review-response-tr.md) | Yanıt / istek taslakları |

## Kaldıraç özeti (resmi + gözlem)

| Sütun | ZVT kaldıraç | Kontrol edilemez |
|-------|--------------|------------------|
| Relevance | Kategori, services, tamamlık, site yerel içerik | — |
| Distance | Doğru pin + semt içeriği (Zekeriyaköy) | Kullanıcı konumu |
| Prominence | Review velocity+yanıt, foto, link/citation | “Ücretle #1” |

**Anket tuzağı:** “Keywords in business title” yüksek skor → ZVT’de **uygulama yasağı**.

## Yasaklar

Sahte yorum/şube · keyword-stuffed ad · ince mahalle spam · peyzaj · Indexing API · onaysız ücretli MCP · keşif stack silme · pin distance hack.

## Kod NAP

Yalnız `site-contact.ts`. Footer DB override riski → admin ayar. Place ID / UTM → `gbp-links.ts`.
