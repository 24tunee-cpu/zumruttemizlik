# Keşif stack — dokunma / bozma yasağı

## Bileşenler

| Parça | Yol |
|-------|-----|
| Honest lastmod | `src/lib/sitemap-lastmod.ts` |
| Sitemaps | `src/app/**/sitemap.ts` |
| RSS / Atom / JSON Feed | `src/lib/feeds.ts` + `feed.xml` / `atom.xml` / `feed.json` |
| WebSub | `src/lib/websub.ts` |
| Post-publish notify | `src/lib/discovery-notify.ts` |
| IndexNow | `src/lib/indexnow.ts` (+ proxy) — **Bing/yandex tipi keşif; Google’a ping değil** |
| robots | `src/app/robots.ts` |

## Kurallar

- “Kullanılmıyor” diye silme / birleştirme → yasak (kullanıcı açıkça istemedikçe).  
- lastmod = içerik revizyonu; `new Date()` her build’de yasak.  
- Indexing API temizlik URL’leri için önerilmez (AGENTS).  
- Yeni public URL → ilgili sitemap’e ekle (honest lastmod bump).
