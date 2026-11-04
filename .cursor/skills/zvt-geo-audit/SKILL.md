---
name: zvt-geo-audit
description: >-
  GEO/AEO audit for ZVT: AI crawler robots access, llms.txt entity consistency
  (not magic ranking), citability/passage structure, schema parity, NAP/sameAs,
  FAQ visibility. Use for GEO, AEO, AI Overview, ChatGPT/Perplexity visibility.
  AGENTS.md + Google AI guide win; no fake mentions; llms.txt ≠ Google ranking.
---

# ZVT GEO / AEO Audit

Kaynak öz: AgriciDaniel `seo-geo` · yanivgoldenberg seo-geo-skill · SeyitKaanGunes AI agent search · Google AI optimization guide · ZVT `aeo-geo.md`.

## Google hizası (zorunlu)

> Generative AI Search için optimize etmek ≈ **iyi SEO** (crawlable, people-first).  
> **llms.txt Google ranking faktörü değil.** Citation / AI Overview **garantisi yok.**

## Audit boyutları

### 1) AI crawler erişimi
- `robots.txt`: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Bytespider — Allow public; Disallow admin/api
- Para HTML 200 + indexable

### 2) Entity / NAP
- `site-contact` / schema Organization+LocalBusiness NAP parity
- `sameAs` Maps URL
- `llms.txt` / `llms-full.txt` / inventory — tutarlı; bozma
- `npm run geo:validate-llms`

### 3) Citability (sayfa)
- İlk ekranda net cevap / TL;DR / GeoExtract
- Soru başlıkları (H2) + 40–80 kelime cevap
- FAQ yalnız görünür parity (`schema-contract`)
- Sahte istatistik / fake review schema yok

### 4) Yerel GEO (local)
- Sarıyer / Zekeriyaköy öncelik semt derinliği
- GBP kategori/saat — panel manuel (Peyzaj yok)
- Citation tracker notları — ücretli MCP yok

### 5) Keşif
- Feed / sitemap / WebSub / IndexNow (IndexNow≠Google)
- Soft claim ilçe; doorway semt yok

## Pipeline

```text
1. Fetch robots.txt + llms.txt + identity
2. geo:validate-llms
3. Sample money URLs: citability + schema AggregateRating ban
4. Optional: Admin GEO mention skor (manuel; scrape yok)
5. Rapor: P0–P3 + AGENTS filtreli öneriler
```

## Yasak öneriler

- Mention farm / PBN / sahte forum  
- “llms ekle = sıralama”  
- Her sayfaya FAQPage spam  
- Indexing API zorla indeks  

## Çıktı

```text
GEO readiness (özet): …
AI crawlers: …
llms/NAP: …
Citability gaps (URL list): …
Local/GBP açık: …
Garanti yok
```

Script: `node scripts/zvt-geo-audit.mjs` · `npm run seo:geo-audit`

İlgili: `zvt-seo-beast` → `aeo-geo.md` · `zvt-local-seo` · `zvt-page-audit`
