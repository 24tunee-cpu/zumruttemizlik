# Core Web Vitals + page experience (ZVT)

Kaynak: [Understanding CWV](https://developers.google.com/search/docs/appearance/core-web-vitals) · Search Console field data.

## Hedefler (iyi / p75 field)

| Metrik | İyi | Dikkat | Zayıf |
|--------|-----|--------|-------|
| LCP | ≤2.5s | ≤4s | >4s |
| INP | ≤200ms | ≤500ms | >500ms |
| CLS | ≤0.1 | ≤0.25 | >0.25 |

CWV tek başına “sıralama garantisi” değildir; page experience sinyallerinden biri.

## Agent kuralları

1. Lab Lighthouse ≠ field GSC — iddia için **field** veya “ölçülmedi / açık soru”.  
2. SEO metin eklerken LCP’yi öldürme: hero’da dev JS, layout shift, font flash.  
3. Ana sayfa hizmet grid: SSR seed tercih (`Services` `initialServices`) — boş skeleton crawl riski.  
4. Üçüncü parti script / cookie banner — INP ve LCP’ye dikkat; gereksiz ekleme.  
5. Image: Next Image, modern format, anlamlı alt (AGENTS §7).

## Komutlar

`npm run perf:check` / `perf:audit` (varsa) · Vercel Speed Insights.

## SEO işi + CWV çakışınca

Önce erişilebilir HTML ve CTA; sonra animasyon/şerit. Sticky CTA CLS yapmamalı (rezerve alan / fixed dikkatli).
