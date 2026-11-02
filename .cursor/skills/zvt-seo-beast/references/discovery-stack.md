# Keşif stack — dürüst keşif (2026)

## Bileşenler

| Parça | Yol | Not |
|-------|-----|-----|
| Honest lastmod | `src/lib/sitemap-lastmod.ts` | Anlamlı değişiklik |
| Sitemaps | `src/app/**/sitemap.ts` | ≤50k URL / sitemap; absolute URL |
| RSS / Atom / JSON Feed | `src/lib/feeds.ts` + feed rotaları | Autodiscovery koru |
| WebSub | `src/lib/websub.ts` | Hub ping |
| Post-publish notify | `src/lib/discovery-notify.ts` | |
| IndexNow | `src/lib/indexnow.ts` | **Bing/Yandex vb. — Google ping değil** |
| robots | `src/app/robots.ts` | |

## lastmod (Google Search Central)

Kaynak: [Sitemaps lastmod](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping)

- `lastmod` = **son anlamlı** değişiklik (ana metin, schema, önemli linkler).  
- Footer / copyright / her deploy `new Date()` → **yasak** (güven kaybı).  
- Emin değilsen o URL için lastmod atlama tercih edilir.

## IndexNow vs Google

| Araç | Rol |
|------|-----|
| XML sitemap + dürüst lastmod | Google keşif envanteri |
| IndexNow | Katılımcı motorlara URL değişim bildirimi |
| Indexing API | Temizlik URL’leri için **önerme** (AGENTS) |

## Kurallar

- “Kullanılmıyor” diye silme / birleştirme → yasak (açık talep yoksa).  
- Yeni public URL → ilgili sitemap + anlamlı lastmod.  
- Feed stack bozma.

## Verify

Yeni URL canlıda 200 + indexable; robots disallow değil; canonical self.
