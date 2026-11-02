# ZVT Cursor skills indeksi

Anayasa: kök `AGENTS.md` (üstün). Skill pack sürümü: **2026-11-02 peak**.

| Skill | Ne zaman |
|-------|----------|
| `zvt-garrett-dispatch` | Local SEO isteği / Garrett çatışması — **önce router** |
| `zvt-seo-beast` | Anasayfa, meta, schema, NAP, trust, feed/sitemap, blog, AEO |
| `zvt-local-seo` | GBP panel, yorum, citation, SAB/hybrid |
| `zvt-programmatic-landing` | `/bolgeler` semt / ilçe×hizmet ekleme |

## Zirve işletim döngüsü (garanti yok)

```text
zvt-garrett-dispatch
  → (opsiyonel) keyword/strategy/brief Garrett
  → zvt-seo-beast implement + checklist
  → zvt-local-seo GBP ops (yorum velocity, foto, post)
  → GSC / seo:gates doğrula
```

## Rules

- `.cursor/rules/zvt-seo-guardrails.mdc` — SEO dosya tripwire  
- `.cursor/rules/zvt-local-guardrails.mdc` — geo/citation/GBP link  

User-global Garrett pack: playbook only; ücretli MCP varsayılan kapalı.
