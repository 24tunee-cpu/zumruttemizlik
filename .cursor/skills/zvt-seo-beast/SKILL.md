---
name: zvt-seo-beast
description: >-
  ZVT site SEO OS: homepage, meta, schema, NAP, trust, sitemaps/feeds, programmatic
  landings, blog, AEO/GEO, money-page CRO, CWV-aware edits. MUST use before those
  edits. Runs decision-tree + anti-patterns; blocks fake claims, NAP drift, thin
  doorways, discovery breakage. Complements zvt-local-seo and zvt-garrett-dispatch.
  AGENTS.md wins. No ranking guarantees.
---

# ZVT SEO Beast (v2026-11-smart)

Kod + içerik + doğrulanmış iddia OS. **Önce düşün** (`decision-tree.md`), sonra düzenle. Sıralama **garantisi yok**.

## Zorunlu akış (akıllı agent)

```text
1. decision-tree.md          → niyet sınıfı + hard stop
2. verified-facts.md         → sayı/adres/hizmet
3. systems-map.md            → hangi Google sistemi (local/organik/AI)
4. anti-patterns.md          → şüpheli taktik red
5. İlgili playbook (aşağı)   → progressive disclosure
6. checklist.md              → bitirmeden işaretle
7. Exit raporu               → garanti yok
```

Kod değişmeyecekse (yalnız strateji): yine decision-tree + systems-map; implement önerme.

## Progressive disclosure

| Dosya | Ne zaman |
|-------|----------|
| [decision-tree.md](references/decision-tree.md) | **Her SEO işi — önce** |
| [verified-facts.md](references/verified-facts.md) | Her SEO işi |
| [systems-map.md](references/systems-map.md) | Local vs organik vs AI kaldıraç |
| [anti-patterns.md](references/anti-patterns.md) | Şüpheli / “zirve hilesi” istek |
| [money-page-playbook.md](references/money-page-playbook.md) | Para / hub CRO |
| [repo-seo-map.md](references/repo-seo-map.md) | Dosya yolu / komut |
| [programmatic-inventory.md](references/programmatic-inventory.md) | İlçe/semt/hizmet |
| [neighborhood-gate.md](references/neighborhood-gate.md) | Yeni semt URL |
| [meta-and-trust-patterns.md](references/meta-and-trust-patterns.md) | Meta / rating UI |
| [schema-contract.md](references/schema-contract.md) | JSON-LD |
| [discovery-stack.md](references/discovery-stack.md) | Feed/sitemap/IndexNow |
| [aeo-geo.md](references/aeo-geo.md) | SSS / AI görünürlük |
| [cwv-and-experience.md](references/cwv-and-experience.md) | LCP/INP/CLS |
| [internal-linking.md](references/internal-linking.md) | Hub linkleri |
| [autopilot-and-blog.md](references/autopilot-and-blog.md) | Blog seed |
| [checklist.md](checklist.md) | Preflight |

## Otorite

1 `AGENTS.md` → 2 bu skill → 3 `zvt-local-seo` → 4 `zvt-garrett-dispatch` → 5 Garrett playbook → 6 genel / anket (Whitespark vb.).

Anket skoru AGENTS’i **geçersiz kılmaz** (örn. GBP ada keyword).

## Hallucination stop

1. Sayı/adres/hizmet → `verified-facts` + ilgili TS.  
2. Trust yalnız `trust-signals.ts`.  
3. GSC/sıralama/AI citation = araç yoksa “açık soru”.  
4. FAQ rich / llms “sihir” yok (`aeo-geo.md`).  
5. Swap-city testi fail → sayfa ekleme (`anti-patterns.md`).

## Garrett

Önce `zvt-garrett-dispatch`. Kod implementasyonu burada. Ücretli MCP onaysız yok.

## Ana sayfa sözleşmesi

Tek H1 (Sarıyer/Zekeriyaköy); meta clamp; Sticky + WhyChoose + RelatedSeoLinks; SSR yorum + **SSR hizmet seed**; AEO FAQ (faydalı, spam değil); CTA randevu/fiyat/tel.

## Komutlar

`type-check` · `seo:gates` · `seo:audit-meta` · `geo:validate-llms` · legacy redirect test · `perf:check` (CWV işi).

## Exit raporu

```text
Niyet sınıfı: …
Değişen: …
References okunan: …
Systems map sütunu: local | organik | AI | keşif | CWV
Doğrulanan: …
Açık soru: …
Garanti yok
```
