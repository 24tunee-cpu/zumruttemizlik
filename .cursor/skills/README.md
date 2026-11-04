# ZVT Cursor skills indeksi

Anayasa: kök `AGENTS.md` (üstün). Skill pack: **2026-11-02 smart** (Google AI guide + local Help + spam/doorway + CWV + decision-tree).

| Skill | Ne zaman |
|-------|----------|
| `zvt-garrett-dispatch` | Local SEO / Garrett — **önce router** (max 2–3) |
| `zvt-seo-beast` | Site SEO OS — **önce `decision-tree`** |
| `zvt-local-seo` | GBP panel, yorum, citation, SAB/hybrid |
| `zvt-competitor-intel` | Rakip gap — neden öndeler, ne güncellenir (ücretli MCP kapalı) |
| `zvt-programmatic-landing` | `/bolgeler` semt / ilçe×hizmet (swap-city) |
| `zvt-seo-os` | **Orkestratör** — site/geo audit → gsc → ga4 → validate → beast |
| `zvt-site-audit` | **Tüm site** sitemap crawl; sayfa sayfa SEO sorun envanteri |
| `zvt-page-audit` | **Tek URL** derin SEO checklist |
| `zvt-geo-audit` | **GEO/AEO** — AI crawler, llms/NAP, citability (sihir yok) |
| `zvt-gsc-ops` | GSC CSV/ekran: CTR, drop, cannibalization, rich-result, crawl |
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

GSC/GA / “SEO canavarı” / full pass:
  → zvt-seo-os
  → site-audit (crawl) + geo-audit + gsc + ga4 + validate + beast

Tek sayfa: zvt-page-audit · Tüm site: zvt-site-audit · GEO: zvt-geo-audit
```

## Araştırma notu (2026-11-04) — site/GEO skill pack

| Kaynak | Ne aldık |
|--------|----------|
| JakeLabate/Claude-SEO-Skills | Sayfa cache + meta/canonical/schema/sitemap/heading audit modeli |
| AgriciDaniel/claude-seo (`seo-geo`) | GEO citability + Google AI guide hizası |
| MYehia565 google-seo-agent-skills | Audit öncelik: blocker → high → … |
| yanivgoldenberg / SeyitKaanGunes GEO | AI crawler + llms (sihir filtresi AGENTS) |
| younes / AminForou / Garrett | GSC/GA (önceki pack) |

Komutlar:
- `npm run seo:crawl` / `npm run seo:crawl -- --limit=80 --out=docs/seo-crawl-latest.json`
- `npm run seo:page-audit -- /bolgeler/sariyer`
- `npm run seo:geo-audit`

MCP / LocalSEOData varsayılan **kapalı**.

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
