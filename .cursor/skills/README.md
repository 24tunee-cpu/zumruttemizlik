# ZVT Cursor skills indeksi

Anayasa: kök `AGENTS.md` (üstün). Skill pack: **2026-11-02 smart** (Google AI guide + local Help + spam/doorway + CWV + decision-tree).

| Skill | Ne zaman |
|-------|----------|
| `zvt-garrett-dispatch` | Local SEO / Garrett — **önce router** (max 2–3) |
| `zvt-seo-beast` | Site SEO OS — **önce `decision-tree`** |
| `zvt-local-seo` | GBP panel, yorum, citation, SAB/hybrid |
| `zvt-competitor-intel` | Rakip gap — neden öndeler, ne güncellenir (ücretli MCP kapalı) |
| `zvt-programmatic-landing` | `/bolgeler` semt / ilçe×hizmet (swap-city) |
| `zvt-gsc-ops` | GSC CSV/MCP: CTR, drop, cannibalization, rich-result, crawl |
| `zvt-ga4-ops` | GA4 lead/key event, landing dönüşüm, GBP UTM |
| `zvt-change-validate` | Deploy/GSC fix sonrası **doğrulama tarama** (recovery baseline) |

## Zirve işletim döngüsü (garanti yok)

```text
İstek → zvt-garrett-dispatch (local ise) veya beast decision-tree
  → systems-map (local | organik | AI)
  → anti-patterns hard stop?
  → playbook (money / GBP / neighborhood / aeo / discovery)
  → implement + checklist
  → type-check / seo:gates / (GSC field iddiası yalnız veri varsa)
  → exit: garanti yok

GSC/GA veri veya “değişiklik doğru mu?”:
  → zvt-gsc-ops ve/veya zvt-ga4-ops
  → sonra zvt-change-validate (canlı + recovery doc)
```

## GSC/GA skill araştırması (2026-11-04)

Dahil edilen öz (AGENTS filtresiyle ZVT’ye gömüldü):

- younesbenallal `gsc-analysis` recipes + `gsc_rows.py`
- AminForou mcp-gsc opportunity / cannibalization patterns
- MYehia565 `search-console-ops` + structured-data discipline
- Garrett GSC/GA tool CTR + conversion playbooks
- Google **resmî** `googleanalytics/google-analytics-mcp` (opsiyonel; onaylı)
- Resmî GSC MCP yok → CSV/browser birinci sınıf

Ücretli MCP / LocalSEOData varsayılan **kapalı**.

## Beast’te yeni “akıllı” referanslar

- `decision-tree.md` — niyet sınıflandırma  
- `systems-map.md` — Google sütunları + Whitespark gözlem (uygulama filtresi)  
- `anti-patterns.md` — doorway/scaled/FAQ/llms tuzakları  
- `money-page-playbook.md` — P0–P3 CRO  
- `cwv-and-experience.md` — LCP/INP/CLS  

## Rules

- `.cursor/rules/zvt-seo-guardrails.mdc`  
- `.cursor/rules/zvt-local-guardrails.mdc`  

User-global Garrett pack: playbook only; ücretli MCP varsayılan kapalı.  
Anket skoru ≠ AGENTS (GBP ada keyword yasak).
