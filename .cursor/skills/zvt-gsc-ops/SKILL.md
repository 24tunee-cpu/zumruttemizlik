---
name: zvt-gsc-ops
description: >-
  ZVT Google Search Console ops: performance CSV/MCP analysis, CTR gaps, quick
  wins, cannibalization, indexing/coverage, rich-result errors, crawl budget.
  Use for GSC audits, traffic drops, post-deploy Search validation, or when the
  user pastes GSC exports/screenshots. AGENTS.md wins; no ranking guarantees;
  paid MCP off unless user approves. Complements zvt-change-validate and
  zvt-ga4-ops.
---

# ZVT GSC Ops

Search Console = organik tık / gösterim / CTR / pozisyon / kapsam **tek gerçek kaynak**. Map pack tıkları burada yok.

## Otorite / kaynaklar (araştırma 2026-11)

| Kaynak | Ne aldık | Not |
|--------|----------|-----|
| [younesbenallal/seo-skills `gsc-analysis`](https://github.com/younesbenallal/seo-skills) | Recipe’ler, CTR eğrisi, decay, cannibalization kuralları | ZVT’ye uyarlandı |
| [AminForou/mcp-gsc](https://github.com/AminForou/mcp-gsc) | weekly / cannibalization / indexing / content-opportunities | MCP opsiyonel |
| [MYehia565 search-console-ops](https://github.com/MYehia565/google-seo-agent-skills) | Drop debug, URL Inspection, kanıt disiplini | Google Search Central hizalı |
| Garrett `google-search-console-tool` | Local CTR benchmark + location sayfa okuma | User-global playbook |
| Resmî GSC MCP | **Yok** ([google/mcp#17](https://github.com/google/mcp/issues/17)) | Community MCP veya CSV |

**Veri yolları (öncelik):** kullanıcı CSV/ekran → canlı HTML spot check → (onaylı) GSC MCP/API. Uydurma metrik yok.

## Zorunlu filtre (AGENTS)

- İnce mahalle / doorway / sahte AggregateRating önerme  
- Indexing API ile temizlik URL “zorla indeks” yok  
- IndexNow ≠ Google ping  
- Para sayfa önceliği: Sarıyer hub / pair / hizmet / randevu — blog tek başına şişmesin  
- Recovery bağlamı: `docs/gsc-ga4-recovery-2026-11-04.md`

## Veri kuralları

1. Son **2–3 günü** hariç tut (eksik veri).  
2. Gösterim ≠ arama hacmi.  
3. CTR’yi tık/gösterimden yeniden hesapla.  
4. Eşit uzunlukta dönem karşılaştır (aynı hafta günü).  
5. Pozisyon sütununu **ortalama alma**; gösterim ağırlıklı düşün.  
6. Marka / markasız ayır (Zümrüt, ZVT, telefon vs hizmet sorguları).  
7. `row_limit` doluysa sayfalama / dar filtre — kesik sonuçla karar yok.

## Workflow

```text
1. Soru tipi? health | drop | CTR | index/rich | crawl | post-change
2. Kaynak? CSV / screenshot / MCP
3. recipes.md → ilgili recipe
4. Canlı URL spot (title/H1/schema) para sayfalarında
5. Çıktı: olgu vs hipotez; P0–P3 eylem; garanti yok
6. Dönüşüm için → zvt-ga4-ops; kod doğrulama → zvt-change-validate
```

## Progressive disclosure

| Dosya | Ne zaman |
|-------|----------|
| [recipes.md](references/recipes.md) | Analiz tarifleri |
| [ctr-and-serp.md](references/ctr-and-serp.md) | CTR benchmark + SERP feature uyarısı |
| [rich-results.md](references/rich-results.md) | Yorum snippet / breadcrumb / FAQ |
| [tooling.md](references/tooling.md) | CSV script, MCP seçenekleri |
| `scripts/gsc_rows.py` | Büyük export aggregate/compare (Python stdlib) |

## Çıktı şablonu

1. 3–5 satır özet (durum + ana fırsat/kırılma + ilk eylem)  
2. Recipe tabloları (tarih aralığı + property bir kez)  
3. Öncelikli aksiyon: hedef URL · kanıt · etki hipotezi · quick win mi  
4. Açık sorular (veri yoksa)

## Exit

Sıralama/trafik garantisi yok. GSC gecikmeli; deploy sonrası 3–14 gün re-crawl bekle.
