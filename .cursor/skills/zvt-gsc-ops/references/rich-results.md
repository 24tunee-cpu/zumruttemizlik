# Rich results (GSC deneyim)

## Yorum snippet

- **Service / WebPage / FAQ** üzerine `AggregateRating` / self-serving `Review` → `parent_node` hatası.  
- ZVT: JSON-LD’de AggregateRating **yok**; puan `trust-signals` + Maps HTML.  
- `/cozumler/*` recovery: `docs/gsc-ga4-recovery-2026-11-04.md`.

## Breadcrumb (“İçerik haritaları”)

- Her `ListItem` için `name` + `item` URL.  
- Tespit sayısı dalgalanır (crawl/reprocess); “ne kadar fazla o kadar iyi” değil — **geçerli** kapsama.  
- Canlı doğrula: `BreadcrumbList` + name sayısı.

## FAQ / HowTo

- Yalnızca sayfada görünen SSS; şişirme yok (anti-patterns).
