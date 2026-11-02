---
name: zvt-garrett-dispatch
description: >-
  Routes Zümrüt Vadi local SEO requests to at most 2–3 Garrett skills plus
  project skills. Use when user asks for GBP, map pack, reviews, citations,
  keyword strategy, local audit, or when Garrett dispatch/localseodata would
  otherwise load. Blocks paid MCP by default; defers to AGENTS.md.
---

# ZVT Garrett Dispatch

Garrett pack playbook’tur. Bu skill **router**: tüm 39 skill’i yükleme.

## Adımlar

1. Oku: `AGENTS.md` §0 + `.cursor/skills/zvt-local-seo/references/garrett-routing-zvt.md`  
2. İsteği tabloya eşle → **max 2–3** Garrett + zorunlu proje skill  
3. Ücretli MCP (`localseodata-tool` vb.) → kullanıcı onayı yoksa **atlama**  
4. Keyword-stuffed GBP adı / sahte yorum / Indexing API → reddet  
5. Kod değişecekse → `zvt-seo-beast` + checklist  
6. Exit: hangi skill’ler yüklendi / ne uygulanmadı / garanti yok  

## Hızlı eşleme

- GBP panel → `zvt-local-seo` + `gbp-optimization`  
- Yorum → `zvt-local-seo` + `review-management`  
- Strateji → `local-content-strategy` (+ keyword-research) → beast implement  
- Audit → `local-seo-audit` checklist + site `seo:gates`  
- Semt sayfa → `zvt-programmatic-landing` (+ `local-landing-pages` advisory)
