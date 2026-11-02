# Garrett → ZVT routing (ücretli MCP kapalı varsayılan)

Garrett `dispatch` tüm pack’i açabilir. **ZVT’de max 2–3 Garrett skill** + zorunlu proje skill.

## Pattern → skills

| İstek | Proje (zorunlu) | Garrett (opsiyonel) |
|-------|-----------------|---------------------|
| GBP / map pack | `zvt-local-seo` | `gbp-optimization`, `gbp-posts` |
| Yorum | `zvt-local-seo` + review-response-tr | `review-management` |
| Citation | `zvt-local-seo` + citation-workflow | `local-citations` (manuel) |
| Keyword / strateji | `zvt-seo-beast` inventory | `local-keyword-research` → `local-content-strategy` |
| Brief → kod | beast + programmatic-landing | `local-content-briefs` (yalnız brief) |
| Audit | beast checklist + GSC | `local-seo-audit` (panel checklist) |
| Rakip / gap / “neden önde” | **`zvt-competitor-intel`** | `local-competitor-analysis` (+ `local-seo-audit`) |
| SAB / hybrid | local-seo + AGENTS | `service-area-seo` |
| AI / AEO | beast `aeo-geo.md` | `ai-local-search` (strateji only) |
| Geogrid | competitor-intel | `geogrid-analysis` (ücretli tool onaysız yok) |

## Asla varsayılan açma

- `localseodata-tool`, BrightLocal, Ahrefs, Semrush, Local Falcon — **kullanıcı onayı + bütçe**  
- `multi-location-seo`, LSA/PPC skill’leri (istenmedikçe)  
- Indexing API “Google’a gönder”  
- Keyword-stuffed GBP adı (Garrett / Whitespark “name keyword” → **AGENTS yasak**)  
- Doorway tarzı “her şehre sayfa” (`anti-patterns.md`)  
- llms.txt / FAQ rich = AI ranking sihir iddiası  

## Implement

Kod = `zvt-seo-beast` + `decision-tree` + `checklist.md`. Garrett yalnızca playbook.  
Local sütunlar: `systems-map.md` §1.
