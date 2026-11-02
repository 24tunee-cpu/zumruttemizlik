# Programatik envanter (kod ile senkron tut)

Kaynak: `src/config/programmatic-seo.ts`. Çelişirse kodu oku / bu dosyayı güncelle.

## Öncelik ilçe (`PRIORITY_SERVICE_DISTRICT_SLUGS`)

`sariyer`, `besiktas`, `sisli`, `kagithane`, `eyupsultan`, `bakirkoy`, `fatih` → soft claim “öncelik hattı”.

Diğer 18 ilçe → **expansion** (`districtCoverageDisclaimer`).

## 18 ilçe slug

atasehir, kadikoy, uskudar, besiktas, sisli, bakirkoy, bahcelievler, pendik, umraniye, maltepe, kartal, sariyer, kagithane, eyupsultan, bayrampasa, gaziosmanpasa, zeytinburnu, fatih

## 7 hizmet

ev-temizligi, ofis-temizligi, inşaat-sonrasi-temizlik → `insaat-sonrasi-temizlik`, koltuk-yikama, hali-temizligi, cam-temizligi, dis-cephe-temizligi

## Semt / semt×hizmet (özgün)

| Slug | Not |
|------|-----|
| zekeriyakoy, maslak, tarabya, bahcekoy, uskumrukoy | Semt hub |
| zekeriyakoy-ev-temizligi | A5 ev niyeti |
| maslak-ofis-temizligi | A5 ofis niyeti |

Yeni semt URL = `NEIGHBORHOOD_LANDINGS` + `neighborhood-gate.md`. Thin template **red**.

## Cannibalization

Blog/yeni landing öncesi `src/config/seo-cannibalization.ts` + admin GSC. Tek URL = tek birincil niyet.
