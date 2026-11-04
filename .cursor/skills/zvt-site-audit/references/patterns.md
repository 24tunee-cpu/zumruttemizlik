# Sitewide SEO patterns (ZVT)

| Kod | Severity | Not |
|-----|----------|-----|
| duplicate_title | High | ≥2 URL aynı title |
| aggregate_rating | High | Her public URL |
| noindex_money | High | Para path |
| canonical_host / mismatch | High/Medium | Host veya path drift |
| http_error / fetch_fail | High | |
| missing_h1 / multi_h1 | Medium | |
| missing_meta_desc / title | Medium | |
| thin_content | Medium | Özellikle `/bolgeler/` |
| missing_cta_signal | Medium | Para sayfa |
| title_long / meta_desc_* / img_missing_alt / missing_og_title | Low | |
| redirect | Info | |

Crawl: `npm run seo:crawl -- --limit=80 --out=docs/seo-crawl-latest.json`
