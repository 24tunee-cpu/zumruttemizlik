---
name: zvt-change-validate
description: >-
  Re-scan ZVT after SEO/GSC/GA fixes: compare recovery baseline vs live HTML,
  schema, redirects, CTR overrides, crawl hygiene, and fresh GSC/GA evidence.
  Use when the user asks to verify changes, validate deploy, or audit whether
  GSC/GA fixes were correct. Loads zvt-gsc-ops + zvt-ga4-ops recipes. AGENTS.md
  wins; no ranking guarantees.
---

# ZVT Change Validate

Deploy / GSC müdahalesi sonrası **doğrulama turu**. Amaç: “Yaptığımız değişiklikler teknik olarak doğru mu?” — sıralama kanıtı ayrı ve gecikmeli.

## Önce oku

1. `docs/gsc-ga4-recovery-2026-11-04.md` (baseline)  
2. `AGENTS.md` A10–A14  
3. Bu skill’in [checklist.md](references/checklist.md)  
4. Gerekirse `zvt-gsc-ops` / `zvt-ga4-ops` SKILL.md  

## Tur sırası (sıkı)

```text
A. Canlı HTML / schema / redirect smoke (hemen — Google beklemeden)
B. Kod ↔ iddia uyumu (gsc-ctr-overrides, intent-schema, robots, next.config)
C. GSC kanıt (CSV/ekran/MCP) — gecikmeli alanları ayır
D. GA4 kanıt — key events
E. Rapor: DOĞRU | KISMEN | EKSİK | BEKLEMEDE + kanıt linki/özet
```

## A — Canlı smoke (zorunlu)

Örnek URL seti (en az bunlar):

| URL | Beklenen |
|-----|----------|
| `/cozumler/ofis-temizligi` (+ 3 diğer cozumler) | `AggregateRating` **YOK**; BreadcrumbList + ListItem `name`; Service provider `@id` `#business` |
| `/bolgeler/sariyer` | Hub title “Temizlik Şirketi” tarzı CTR; H1 tutarlı |
| `/bolgeler/sariyer/dis-cephe-temizligi` | PAIR CTR title/H1; erken CTA |
| `/bolgeler/sariyer/zekeriyakoy` | H1 “Temizlik Şirketi” |
| `/bolgeler/sariyer/maslak` | H1 “Temizlik Şirketi” |
| `/hizmetler/cam-temizligi` | SERVICE_CTR_META |
| `/blog/insaat-sonrasi-temizlik-fiyatlari-2024` | **308 → 2026** |
| Rastgele `?_rsc=1` para URL | redirect / noindex hijyeni (config’e göre) |

Araç: fetch HTML + `ld+json` parse; browser Rich Results isteğe bağlı.

## B — Kod iddia

- `src/lib/gsc-ctr-overrides.ts` wired: pair / blog / hizmet / neighborhood  
- `intent-schema`: AggregateRating yok  
- robots Googlebot Disallow paylaşımı  
- neighborhood sitemap  
- `MarketingEventTracker` → `generate_lead`  

## C — GSC (gecikmeli etiketle)

| Kontrol | Geçiş kriteri | Durum etiketi |
|---------|---------------|---------------|
| Yorum snippet 4 URL | 0 hata veya doğrulama “Geçti” | BEKLEMEDE until re-crawl |
| Breadcrumb | Canlı name OK; sayı toparlanma | KISMEN / BEKLEMEDE |
| CTR para sayfalar | Yeni CSV’de CTR↑ veya tık↑ | yalnız yeni veri varsa |
| 2024 blog | 404 düşüş / 308 | |
| Crawl Other/`_rsc` | oran ↓ | |

**Veri yoksa uydurma** — “BEKLEMEDE + ne zaman bak”.

## D — GA4

- `generate_lead` key event  
- Realtime/DebugView smoke isteğe bağlı  

## Çıktı formatı

```markdown
## Change validate — YYYY-MM-DD
### Özet
### A Canlı (tablo: URL | beklenen | gözlem | DOĞRU/YANLIŞ)
### B Kod
### C GSC (olgu / BEKLEMEDE)
### D GA4
### Düzeltme önerileri (P0–P3) — yalnız kanıtlı
### Garanti yok
```

Kullanıcı istemeden push/deploy yok. Fix gerekirse onayla veya açıkça “düzelteyim mi?”.
