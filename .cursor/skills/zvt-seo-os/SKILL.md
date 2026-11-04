---
name: zvt-seo-os
description: >-
  ZVT peak SEO operating system: site-audit → geo-audit → gsc → ga4 →
  change-validate → seo-beast. Use for full SEO/GEO pass, “SEO canavarı”,
  page-by-page site crawl, or post-GSC perfection. AGENTS.md wins; no ranking
  guarantees; no paid MCP; no doorway/fake ratings.
---

# ZVT SEO OS (orkestratör)

Tek istekte dört skill’i **sırayla** çalıştır. Çıktı = kanıtlı P0–P3 + uygulanmış fix’ler. “Kusursuz / #1” vaadi yok.

## Sıra (zorunlu)

```text
0. AGENTS.md §0 + hard stop (anti-patterns)
1. zvt-site-audit       → sitemap sayfa-sayfa teknik envanter (opsiyonel ama full audit’te zorunlu)
2. zvt-geo-audit        → AI crawler / llms / citability / NAP
3. zvt-gsc-ops          → CSV/ekran olgu + CTR/index/rich/crawl
4. zvt-ga4-ops          → lead/key event + para landing CRO boşluğu
5. zvt-change-validate  → canlı smoke vs recovery baseline
6. zvt-seo-beast        → decision-tree + money/schema/meta implement
7. type-check (+ seo:gates / legacy redirect gerektiğinde)
8. Exit raporu + audit JSON/MD
```

Tek URL derin: `zvt-page-audit` (+ `node scripts/zvt-page-seo-audit.mjs <url>`).

## Her adımda

| Adım | Minimum çıktı |
|------|----------------|
| GSC | 3–5 satır özet + öncelik tablosu (olgu vs hipotez) |
| GA4 | Kod hazır mı / panel eksik mi |
| Validate | URL tablosu DOĞRU/YANLIŞ/BEKLEMEDE |
| Beast | Değişen dosyalar + systems-map sütunu |

## Para öncelik (ZVT)

1. `/bolgeler/sariyer` + pair (cam, dış cephe, ev, ofis, inşaat, koltuk)  
2. `/hizmetler/*` money  
3. Semt: Zekeriyaköy, Maslak  
4. `/cozumler/*` schema-clean  
5. Blog → köprü (tık şişirme değil)

## Yasak

Sahte AggregateRating · ince mahalle · Indexing API · IndexNow=Google · ücretli MCP · peyzaj/tekne

## Referans

- Recovery: `docs/gsc-ga4-recovery-2026-11-04.md`  
- İndeks: `.cursor/skills/README.md`  
- Nested: `zvt-site-audit`, `zvt-page-audit`, `zvt-geo-audit`, `zvt-gsc-ops`, `zvt-ga4-ops`, `zvt-change-validate`, `zvt-seo-beast`
- Scripts: `npm run seo:crawl` · `seo:page-audit` · `seo:geo-audit`
