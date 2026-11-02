# Repo SEO haritası

Değiştirmeden önce ilgili yolu oku. Hardcoded tel/adres için grep: `0551|Ferahevler|Sarıyer Merkez`.

## Public URL → kod

| URL | Dosya / config |
|-----|----------------|
| `/` | `src/app/page.tsx`, `Hero.tsx`, `DeferredHomeSections.tsx` |
| `/hizmetler/[slug]` | `src/app/hizmetler/[slug]/page.tsx` |
| `/bolgeler/[district]` | `src/app/bolgeler/[district]/page.tsx` |
| `/bolgeler/[district]/[service]` | pair + `NeighborhoodLanding` |
| `/cozumler/*` | `src/app/cozumler/**` |
| `/blog/*` | `src/app/blog/**` |
| `/sss`, `/sss/[topic]` | `src/app/sss/**`, `config/sss-topics.ts` |
| `/geo-sss/*` | `src/app/geo-sss/**` |
| `/harita-ve-yorumlar` | Maps + review UTM |
| `/randevu`, `/fiyat-hesaplama` | dönüşüm |

## SEO lib

| Konu | Dosya |
|------|--------|
| Canonical / schema helpers | `src/lib/seo.ts` |
| Meta clamp | `src/lib/meta-clamp.ts` |
| Root JSON-LD | `src/lib/root-schema.ts` |
| GBP UTM / Place ID | `src/lib/gbp-links.ts` |
| Trust | `src/config/trust-signals.ts` |
| İç link | `src/lib/internal-seo-links.ts` |
| Cannibalization | `src/config/seo-cannibalization.ts` |
| Honest lastmod | `src/lib/sitemap-lastmod.ts` |
| Feeds / WebSub | `src/lib/feeds.ts`, `websub.ts`, `discovery-notify.ts` |

## Keşif uçları

`/sitemap.xml` (+ bolgeler/blog/cozumler/geo-sss/galeri), `/feed.xml`, `/atom.xml`, `/feed.json`, `robots.ts`, IndexNow key route.

## Komutlar

```bash
npm run type-check
npm run seo:gates          # autopilot slug + llms NAP
npm run seo:audit-meta
npm run geo:validate-llms
npx tsx scripts/test-legacy-redirects.ts
```

Push/deploy yalnızca kullanıcı isteğiyle.
