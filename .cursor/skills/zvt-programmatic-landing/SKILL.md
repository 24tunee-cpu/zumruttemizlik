---
name: zvt-programmatic-landing
description: >-
  Adds or edits ZVT district, neighborhood, or district×service landings under
  /bolgeler. Use for programmatic SEO pages, semt landings, soft claims, or
  when local-landing-pages skill might suggest thin location spam. Requires
  özgün content via neighborhood-gate.
---

# ZVT Programmatic Landing

## Pre-flight

1. `zvt-seo-beast/references/verified-facts.md`  
2. `programmatic-inventory.md`  
3. `neighborhood-gate.md` (yeni semt/semt×hizmet)  
4. `seo-cannibalization.ts` grep  

## Implement

- Config: `src/config/programmatic-seo.ts` (`DISTRICT_LANDINGS` / `NEIGHBORHOOD_LANDINGS` / soft claim helpers)  
- UI: `NeighborhoodLanding.tsx` veya pair `page.tsx`  
- Meta: `clampMeta*`  
- Soft claim: `districtCoverageDisclaimer`  
- FAQ: lokalize / özgün; schema parity  
- İç link: `internal-linking.md`  
- Sitemap: `sitemap-lastmod` bolgeler bump  

## Verify

```bash
npm run type-check
npm run seo:gates
```

## Yasak

18 ilçe template mahalle, peyzaj, “tüm İstanbul her gün”, uydurma metrik.

Exit: beast exit raporu + hangi slug eklendi.
