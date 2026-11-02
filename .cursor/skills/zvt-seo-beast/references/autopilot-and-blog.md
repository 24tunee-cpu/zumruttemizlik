# Autopilot + blog

## Slug

- Yalnızca ASCII (`slug-guard`)  
- Yıl suffix `-20xx` legacy redirect’ten **muaf** (kasıtlı)  
- Validate: `npm run seo:autopilot:validate` / `seo:gates`

## İçerik

- Engagement blog markayı zayıflatmasın; hub’a iç link  
- Autopilot limitler: `src/lib/seo-autopilot/constants.ts`  
- Seed öncesi validate; partial run’da llmsSync EROFS → runtime skip (bozma)

## Yasak

Unicode slug, keyword-stuff title emoji (clamp), cannibalization map’i yok saymak.
