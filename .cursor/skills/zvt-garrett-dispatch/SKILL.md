---
name: zvt-garrett-dispatch
description: >-
  Routes Zümrüt Vadi local SEO requests to at most 2–3 Garrett skills plus
  project skills. Use when user asks for GBP, map pack, reviews, citations,
  competitor analysis, rakip, keyword strategy, local audit, or when Garrett
  dispatch/localseodata would otherwise load. Classifies intent, blocks paid
  MCP by default, rejects stuffed GBP names and fake reviews; defers to AGENTS.md.
---

# ZVT Garrett Dispatch (v2026-11-smart)

Garrett pack = playbook. Bu skill = **router + güvenlik filtresi**. 39 skill’i yükleme.

## Adımlar

1. Oku: `AGENTS.md` §0 + [garrett-routing-zvt.md](../zvt-local-seo/references/garrett-routing-zvt.md)  
2. İsteği sınıflandır (`zvt-seo-beast/references/decision-tree.md` niyet tablosu)  
3. Tabloya eşle → **max 2–3** Garrett + zorunlu proje skill  
4. Hard stop: stuffed GBP adı, sahte yorum, Indexing API, onaysız ücretli MCP  
5. Anket/Garrett önerisi AGENTS ile çelişirse → **AGENTS** (name keyword vb.)  
6. Kod değişecekse → `zvt-seo-beast` + checklist  
7. Exit: hangi skill’ler / ne uygulanmadı / garanti yok  

## Hızlı eşleme

| İstek | Proje | Garrett (≤2–3) |
|-------|-------|----------------|
| GBP panel | `zvt-local-seo` | `gbp-optimization`, `gbp-posts` |
| Yorum | local-seo + review-response-tr | `review-management` |
| Citation | local-seo + citation-workflow | `local-citations` (manuel) |
| Keyword / strateji | beast inventory | `local-keyword-research` → `local-content-strategy` |
| Brief → kod | beast + programmatic-landing | `local-content-briefs` (yalnız brief) |
| Audit | beast checklist + GSC | `local-seo-audit` |
| Rakip / neden önde | **`zvt-competitor-intel`** | `local-competitor-analysis` (+ isteğe `local-seo-audit`) |
| SAB / hybrid | local-seo + AGENTS | `service-area-seo` |
| AI / AEO | beast `aeo-geo.md` | `ai-local-search` (strateji only) |
| Semt sayfa | `zvt-programmatic-landing` | `local-landing-pages` advisory |
| Geogrid / heatmap | competitor-intel notu | `geogrid-analysis` (ücretli tool onaysız yok) |

## Asla varsayılan açma

`localseodata-tool`, BrightLocal, Ahrefs, Semrush, Local Falcon — **onay + bütçe**.  
LSA/PPC / multi-location — istenmedikçe.  
“Name’e keyword ekle” Garrett fırsatı → **red**.
