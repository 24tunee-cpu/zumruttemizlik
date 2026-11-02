---
name: zvt-programmatic-landing
description: >-
  Adds or edits ZVT district, neighborhood, or district×service landings under
  /bolgeler. Use for programmatic SEO, semt landings, soft claims, or when
  local-landing-pages suggests thin location spam. Enforces swap-city test,
  neighborhood-gate, anti-doorway rules, and özgün content. AGENTS.md wins.
---

# ZVT Programmatic Landing (v2026-11-smart)

## Pre-flight (sırayla)

1. `zvt-seo-beast/references/decision-tree.md` → sınıf `programmatic`  
2. `verified-facts.md`  
3. `anti-patterns.md` (doorway / scaled)  
4. `programmatic-inventory.md`  
5. `neighborhood-gate.md` — **swap-city zorunlu**  
6. `seo-cannibalization` / yakın slug grep  
7. Soft claim helpers mevcut mu kontrol  

## Uniqueness skoru (agent self-check)

Yeni sayfa için 0–5; **≥4** olmadan ekleme:

| Puan | Kriter |
|------|--------|
| +1 | Semte özgü operasyon (≥3 body, swap-city geçti) |
| +1 | ≥3 özgün FAQ |
| +1 | Niyet ayrışması (yakın slug ile cannibal yok) |
| +1 | İç link hub ↔ hizmet ↔ CTA |
| +1 | Soft claim + gerçek hizmet slug |

## Implement

- Config: `src/config/programmatic-seo.ts`  
- UI: `NeighborhoodLanding.tsx` veya pair `page.tsx`  
- Meta: `clampMeta*`  
- Trust: `formatGoogleTrustLine` / GBP UTM (`gbp-links`)  
- Soft claim: `districtCoverageDisclaimer`  
- FAQ + schema parity  
- İç link: `internal-linking.md`  
- Sitemap: anlamlı `sitemap-lastmod` bump  

## Verify

```bash
npm run type-check
npm run seo:gates
```

## Yasak

18 ilçe template mahalle · peyzaj · “tüm İstanbul her gün” · uydurma metrik · orphan doorway.

Exit: beast exit + slug + uniqueness skoru + **garanti yok**.
