---
name: zvt-site-audit
description: >-
  Full-site SEO audit for Zümrüt Vadi: crawl all sitemap URLs page-by-page,
  find technical/on-page/schema/duplicate issues, prioritize P0–P3. Use for
  “tüm site SEO analizi”, “her sayfayı tara”, sitewide problems. Runs
  zvt-page-audit checks at scale via scripts/zvt-site-seo-crawl.mjs. AGENTS.md
  wins; no doorway spam fixes; no ranking guarantees.
---

# ZVT Site Audit (tüm site / sayfa sayfa)

Kaynak öz: JakeLabate full/sitemap/meta/schema/canonical · AgriciDaniel crawl≤500 · MYehia565 audit-plan öncelik · metawhisp site_audit pattern.

## Ne zaman

- “Bütün sayfaları analiz et / tüm SEO sorunlarını bul”
- Deploy sonrası sitewide regresyon
- GSC’den bağımsız teknik envanter

## Pipeline

```text
1. AGENTS hard stop (doorway/fake rating önerme)
2. Sitemap keşfi (robots + segment sitemaps)
3. URL listesi → scripts/zvt-site-seo-crawl.mjs
4. Aggregate: duplicate titles, missing H1, AggregateRating hits, non-200, canonical drift
5. Para URL’lere zvt-page-audit derin bakış (örneklem + tüm High)
6. Rapor → docs/seo-site-audit-YYYY-MM-DD.md (kullanıcı isterse)
7. Fix → zvt-seo-beast (tek niyetli PR’lar)
```

## ZVT sitemap kaynakları

- `/sitemap.xml`
- `/bolgeler/sitemap.xml`
- `/cozumler/sitemap.xml`
- `/blog/sitemap.xml`
- `/geo-sss/sitemap.xml` (varsa)

Limit: varsayılan **tüm** sitemap URL; `--limit=N` ile örneklem. Delay 150–300ms (nezaket).

## Sitewide pattern’ler (özellikle ara)

| Pattern | Severity |
|---------|----------|
| Aynı title ≥2 URL | High/Medium |
| `AggregateRating` herhangi public URL | High |
| Para path’te noindex | High |
| Canonical host drift | High |
| H1 yok / >1 | Medium |
| Meta description yok | Medium |
| Soft-404 benzeri ince 200 | Medium |
| Blog vs pair cannibal title | Medium (GSC ile doğrula) |

## Öncelik matrisi (MYehia)

1. **Blockers** — indeks/crawl kırığı  
2. **High** — para sayfa meta/schema/CTA  
3. **Medium** — içerik/OG  
4. **Low** — kozmetik  

İnce mahalle ekleyerek “düzeltme” **yasak**.

## Komut

```bash
node scripts/zvt-site-seo-crawl.mjs
node scripts/zvt-site-seo-crawl.mjs --limit=80 --out=docs/seo-crawl-latest.json
```

## Exit

Toplam URL · High/Medium sayıları · top 15 bulgu · sonraki skill (`zvt-geo-audit` / `zvt-seo-beast`). **Garanti yok.**
