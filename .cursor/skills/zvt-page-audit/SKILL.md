---
name: zvt-page-audit
description: >-
  Deep single-URL SEO audit for ZVT: status, canonical, title/H1/meta, robots,
  schema, headings, images, internal links, CTA/trust, AggregateRating ban.
  Use when auditing one page or as the per-URL checker inside zvt-site-audit.
  AGENTS.md wins; no ranking guarantees.
---

# ZVT Page Audit (tek URL)

Kaynak öz: JakeLabate meta/canonical/schema/heading · MYehia565 page-metadata · ZVT money/schema contract.

## Girdi

- Tam URL veya path (`/bolgeler/sariyer/...`)
- İsteğe: HTML dosyası / fetch çıktısı

## Kontrol listesi (her sayfa)

### Index / crawl
- [ ] HTTP 200 (3xx→hedef; 4xx/5xx = High)
- [ ] `robots` meta / `X-Robots-Tag` indexable (para sayfa)
- [ ] Self-canonical var; host `www.zumrutvaditemizlik.com`
- [ ] Canonical ≠ başka URL’ye “kaçış” (yanlışlıkla)

### On-page
- [ ] Tek anlamlı `<title>` (≈30–60 karakter; stuffing yok)
- [ ] Meta description dolu (≈70–160)
- [ ] Tam **bir** H1; H2 hiyerarşisi kırık değil
- [ ] Görünür ana metin JS-only değil (SSR/HTML’de)

### Schema
- [ ] JSON-LD parse edilir
- [ ] `AggregateRating` / self-serving `Review` **yok** (GSC parent_node)
- [ ] BreadcrumbList varsa her ListItem’da `name`
- [ ] Service/FAQ parity (görünmeyen SSS schema yok)

### CRO / local (para sayfa)
- [ ] Tel / WA / randevu CTA
- [ ] Trust = `trust-signals` / Maps (uydurma skor yok)
- [ ] Sticky veya eşdeğer erişim

### Görsel
- [ ] Anlamlı `alt` (dekoratif boş olabilir)
- [ ] LCP adayı için abartılı dev boyut uyarısı (Info)

## Severity

| Seviye | Örnek |
|--------|--------|
| High | noindex para sayfa, 404, AggregateRating on Service, yanlış canonical |
| Medium | eksik meta, H1 yok/çoklu, soft thin |
| Low | OG eksik, alt boş |
| Info | lastmod / öncelik notu |

## Çıktı

```text
URL: …
Status: …
Findings: [sev] mesaj
Öneri: …
Garanti yok
```

Script yardımcısı: `node scripts/zvt-page-seo-audit.mjs <url>`
