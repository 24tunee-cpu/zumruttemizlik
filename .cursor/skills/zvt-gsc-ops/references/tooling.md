# Tooling

## CSV / export (varsayılan)

1. GSC → Performans / Deneyim / Tarama → CSV.  
2. Büyük dosya: `python .cursor/skills/zvt-gsc-ops/scripts/gsc_rows.py` (younesbenallal MIT uyarlaması).  
3. `docs/gsc-ga4-recovery-2026-11-04.md` ile çaprazla.

## MCP (kullanıcı onayı gerekir)

| Seçenek | Rol |
|---------|-----|
| [AminForou/mcp-gsc](https://github.com/AminForou/mcp-gsc) | Analytics + URL Inspection + skills |
| [Bin-Huang/google-search-console-cli](https://github.com/Bin-Huang/google-search-console-cli) | CLI + agent skills |
| Resmî GSC MCP | Yok (2026) |

Ücretli LocalSEOData vb. **kapalı** (AGENTS). Credential / `.env` içeriği chat’e dökülmez.

## Canlı spot

`Invoke-WebRequest` / browser: title, H1, `ld+json` (AggregateRating yok mu, BreadcrumbList name var mı).
