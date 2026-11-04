# GSC recipes (ZVT)

Eşikler site ölçeğine göre ayarla ve söyle. Kaynak: younesbenallal + AminForou uyarlaması.

## Health check

1. Günlük/haftalık trend (mümkünse 3–16 ay).  
2. Son 28g vs önceki 28g: page + query.  
3. Para URL filtresi: `/bolgeler/sariyer`, `/hizmetler/`, `/cozumler/`, `/randevu`, `/fiyat`.

## Drop diagnosis

| Teşhis | Kural | Sonraki |
|--------|-------|---------|
| ranking drop | pozisyon ≥+2 kötü | SERP, içerik yaşı |
| impressions loss, poz stabil | gösterim &lt; %70 | query kaybı, partial deindex |
| CTR collapse, poz stabil | CTR &lt; %70 | SERP feature / snippet |
| disappeared | önce ≥5 tık, sonra yok | URL Inspection, 301, sitemap |

## Quick wins

- Poz **4–15**, gösterim anlamlı (≥50 küçük sitede; ≥100 ideal).  
- Aksiyon: **mevcut** sayfayı güçlendir — yeni ince sayfa yok (AGENTS).

## CTR gap

- Poz ≤20, düşük CTR (benchmark: `ctr-and-serp.md`).  
- Poz 1–3 + CTR &lt; %1 → title değil; SERP cevabı veriyor olabilir → “neden tıkla” (keşif/fiyat/WA).  
- ZVT para örnekleri: Sarıyer dış cephe/cam pair, hub, inşaat/ofis blog.

## Content opportunities (AminForou tarzı)

- Poz **11–20**, düşük CTR, yüksek gösterim.  
- Opportunity ≈ `impressions × (0.05 − ctr)` (kabaca).  
- Semt doorway önerme; pair/hizmet/hub iyileştir.

## Cannibalization

- Aynı query’de ≥2 sayfa anlamlı gösterim payı.  
- Kazanan: daha iyi poz / tık; diğerine 301 veya soft merge.  
- Blog `-2026` vs hizmet/pair: blog köprü, para sayfa kazanır.

## Indexing / crawl

- Money + drop sayfalarında URL Inspection.  
- Sitemap lastmod dürüst (`sitemap-lastmod.ts`).  
- `?_rsc=` / query noindex gürültüsü → robots + redirect (recovery notu).

## Rich results

→ `rich-results.md` (AggregateRating Service yasak; breadcrumb `name` zorunlu).
