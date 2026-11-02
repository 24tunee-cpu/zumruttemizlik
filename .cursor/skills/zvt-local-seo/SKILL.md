---
name: zvt-local-seo
description: >-
  Zümrüt Vadi GBP, Maps pack, hybrid SAB, reviews, citations, Bing/Apple Places
  bridge. Use for local pack, review replies, citation tracker, service-area,
  or when gbp-optimization/review-management/local-citations conflict with this
  repo. Defers to AGENTS.md and site-contact; site code edits use zvt-seo-beast.
---

# ZVT Local SEO

GBP / Maps / citation köprüsü. Site kodu → `zvt-seo-beast`. Router → `zvt-garrett-dispatch`.

## Önce oku

1. `AGENTS.md` §0  
2. [verified-facts](../zvt-seo-beast/references/verified-facts.md) (NAP/rating)  
3. İlgili reference (aşağı)

## References

| Dosya | Konu |
|-------|------|
| [garrett-routing-zvt.md](references/garrett-routing-zvt.md) | Garrett eşleme + MCP kapalı |
| [gbp-panel-checklist.md](references/gbp-panel-checklist.md) | Panel P0–prominence |
| [citation-workflow.md](references/citation-workflow.md) | Admin dizin tracker |
| [review-response-tr.md](references/review-response-tr.md) | Yanıt / istek taslakları |

## Yasaklar

Sahte yorum/şube · keyword-stuffed ad · ince mahalle spam · peyzaj · Indexing API · onaysız ücretli MCP · keşif stack silme.

## Operasyon özeti (zirve sinyalleri)

Google: **relevance / distance / prominence**.  
ZVT kaldıraç: kategori+açıklama tamamlığı, fotoğraf, **yorum velocity + yanıt**, NAP tutarlılığı, site yerel sayfalar (beast).  
Uzaklık (Sarıyer pin) kontrol edilemez — Zekeriyaköy/Sarıyer içeriği + review ile prominence güçlendir.

## Kod NAP

Yalnız `site-contact.ts`. Footer DB override riski → admin ayar. Place ID / UTM → `gbp-links.ts`.
