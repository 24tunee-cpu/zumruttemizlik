# Meta + trust kalıpları

## Meta

```ts
import { clampMetaTitle, clampMetaDescription } from '@/lib/meta-clamp';
```

- Title ≈ ≤60, desc ≈ ≤158, **emoji yok**.  
- Home: title/H1 yerel niyet uyumlu (Sarıyer/Zekeriyaköy).  
- Pair: ilçe + hizmet; stuffing yok.  
- Audit: `npm run seo:audit-meta`.

## Trust UI

```ts
import { VERIFIED_TRUST, formatGoogleTrustLine, HOME_HERO_STATS } from '@/config/trust-signals';
```

- Hardcode `5.0` / `5000+` / uydurma yıl **yasak**.  
- “5.0 Paradox” (sektör): mükemmel 5.0 şart değil; doğrulanmış 4.9 tercih.  
- Link: `/harita-ve-yorumlar` veya `gbp-links` UTM’li review/maps.

## GBP rating güncellemesi

Yorum sayısı değişince: (1) `trust-signals.ts` (2) AGENTS snapshot (3) bu skill `verified-facts.md` tarihi.
