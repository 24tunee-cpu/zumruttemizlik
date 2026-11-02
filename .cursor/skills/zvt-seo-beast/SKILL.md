---
name: zvt-seo-beast
description: >-
  ZVT site SEO operating system. MUST use before homepage, meta, schema, NAP,
  sitemaps/feeds, programmatic landings, blog SEO, or trust/metrics edits.
  Prevents fake claims, NAP drift, thin pages, discovery-stack breakage.
  Complements zvt-local-seo (GBP/citations) and AGENTS.md (supreme).
---

# ZVT SEO Beast (site işletim sistemi)

Garrett Local SEO Skills strateji verir; **bu skill kod + içerik + doğrulanmış iddia** kuralıdır.
Ajanı hafifletir: tahmin yasak, checklist zorunlu, komut matrisi hazır.

## 0. Otorite (ezberleme)

| Öncelik | Kaynak |
|--------|--------|
| 1 | `AGENTS.md` |
| 2 | Bu skill (`zvt-seo-beast`) |
| 3 | `zvt-local-seo` (GBP / citation / yorum ops) |
| 4 | Garrett pack (`dispatch` → 2–3 skill) |
| 5 | Genel SEO tavsiyesi |

Çatışmada üst kazanır. Sıralama/trafik **garantisi yok**.

## 1. Garrett ne zaman (özet)

```text
dispatch → (keyword-research) → local-content-strategy → local-content-briefs
         → [BU SKILL + kod] implement → local-seo-audit / GSC
GBP ops: gbp-optimization + review-management + gbp-posts (panel manuel)
```

- `localseodata-tool` / ücretli MCP: **yalnızca kullanıcı onayı**
- Homepage CRO / Next.js: Garrett **yazmaz** — bu skill + repo

## 2. Pre-flight (değişiklik tipine göre oku)

| İş | Zorunlu dosyalar |
|----|------------------|
| NAP / telefon / adres | `src/config/site-contact.ts`, `geo-entity.ts` |
| Ana sayfa | `src/app/page.tsx`, `Hero.tsx`, `home-services-seo.ts`, `DeferredHomeSections.tsx`, `trust-signals.ts` |
| Meta | `meta-clamp.ts` — yeni meta **clamp’siz yazılmaz** |
| İlçe / semt | `programmatic-seo.ts`, `seo-cannibalization.ts`, `internal-seo-links.ts` |
| GBP / yorum | `zvt-local-seo`, `gbp-links.ts` |
| Feed / sitemap | `sitemap-lastmod.ts`, `feeds.ts`, `websub.ts` — **silme / “temizlik” yok** |

Checklist dosyası: `.cursor/skills/zvt-seo-beast/checklist.md` — bitirmeden işaretle.

## 3. Doğrulanmış güven (uydurma yasak)

Tek kaynak: `src/config/trust-signals.ts` (+ Maps sync varsa API).

| İzinli (GBP 2026-11-02) | Yasak örnek |
|-------------------------|-------------|
| Google **4.9** / **12** yorum (veya Maps sync gerçek sayı) | `5.0`, `5000+ müşteri`, uydurma yıl/iş adedi |
| 7/24 hat (GBP saatleri) | Peyzaj / tekne hizmeti |
| Place ID `site-contact.gbpPlaceId` | Sahte şube / sahte yorum |

Hero, Services, schema AggregateRating: **yalnızca verified**.

## 4. Ana sayfa sözleşmesi

- **Tek H1**; title ile çelişmesin — birincil yerel niyet: Sarıyer / Zekeriyaköy (+ Avrupa Yakası ikincil).
- Meta: `clampMetaTitle` / `clampMetaDescription` / emoji yok.
- Sticky: `StickySeoCtaBar`; güven: `WhyChooseZvt`; hub: `RelatedSeoLinks` (semt×hizmet + geo-sss).
- Testimonials / kritik metin: mümkünse **SSR** (client-only skeleton = zayıf crawl).
- CTA: `/randevu` veya tel/WA + `/fiyat-hesaplama`; yalnız `/iletisim` yetmez.

## 5. Programatik / içerik

- Yeni mahalle URL = `NEIGHBORHOOD_LANDINGS` özgün standart; 18 ilçe template spam yok.
- Blog slug ASCII; `npm run seo:autopilot:validate`.
- Cannibalization: `seo-cannibalization.ts` + admin GSC.
- Soft claim: `districtCoverageDisclaimer` — expansion ilçede “her adres her gün” yok.

## 6. Komut matrisi

| Değişiklik | Çalıştır |
|------------|----------|
| TS/TSX | `npm run type-check` |
| NAP / llms | `npm run geo:validate-llms` |
| Autopilot / blog seed | `npm run seo:autopilot:validate` |
| Meta uzunluk | `npm run seo:audit-meta` |
| URL / 301 | `npx tsx scripts/test-legacy-redirects.ts` |

Push / deploy / ücretli MCP: **kullanıcı istemeden yok**.

## 7. Yasaklar (kısa)

- Sahte NAP, yorum, metrik, şube
- Keyword-stuffed işletme adı / H1 stuffing
- Indexing API’yi temizlik URL’sine önerme; IndexNow ≠ Google ping
- Feed/WebSub/IndexNow/sitemap-lastmod bozma
- Peyzaj hizmeti uydurma

## 8. Exit raporu (zorunlu)

```text
Değişen: …
Doğrulanan: type-check / llms / meta / …
Verified metrics kaynağı: trust-signals | Maps sync
Açık soru: …
Garanti yok: sıralama/trafik iddiası yok
```

## 9. Sonraki kod işleri (backlog — skill tetikler)

P1 anasayfa: H1 yerel + trust-signals + SSR yorum + sticky/WhyChoose/RelatedSeoLinks.  
P2: Services SSR seed; home AEO 3 SSS; meta emoji temiz.  
Ops: admin `SiteSettings.address` = GBP satırı.
