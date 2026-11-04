# Cognitic Labs geoskills — kurulum + smoke (2026-11-04)

**Kaynak:** https://github.com/Cognitic-Labs/geoskills (Apache-2.0)  
**Anayasa:** kök `AGENTS.md` üstün; bu paket playbook. Ücretli MCP yok.  
**Garanti yok** (AI citation / Overview / ranking).

## Kurulum

```bash
npx skills add Cognitic-Labs/geoskills -y -a cursor
```

| Konum | Durum |
|--------|--------|
| `.agents/skills/*` (8 skill) | Kurulu |
| `.cursor/skills/*` (kopya) | Kurulu (Cursor keşfi) |
| `~/.cursor/skills/*` | Kopyalandı |

**8 skill:** `geo-audit`, `geo-fix-content`, `geo-fix-schema`, `geo-fix-llmstxt`, `geo-compare`, `geo-monitor`, `seo-analytics`, `bing-ai-analytics`

## Smoke sonuçları

### A) Skill dosyaları okunuyor mu?
**Evet** — `SKILL.md` + references + (seo-analytics) scripts mevcut.

### B) `seo-analytics` script
`node .agents/skills/seo-analytics/scripts/fetch-gsc.mjs --help` → **çalışır**.  
Gerçek GSC/GA4 çekmek için YAML config + OAuth gerekir (bu turda bağlanmadı; dry-run config yok → API testi **atlanır**).

### C) `geo-audit` canlı ZVT (metodoloji testi)
Agent skill’i uyguladı (Local tip):

| Boyut | Skor |
|--------|------|
| Technical | 91 |
| Citability | 76 |
| Schema | 80 |
| Brand | 49 |
| **Composite** | **73 (B)** |

**Verdict:** Skill **işe yarıyor** (yapılandırılmış skor + öncelik listesi üretir). Brand rubriği Wiki/LinkedIn ağırlıklı → yerel SMB için sert; AGENTS filtresi şart.

### D) Fix skill’ler (bilinçli uygulamama)
| Skill | Smoke |
|--------|--------|
| `geo-fix-llmstxt` | ZVT’de `llms.txt` zaten var — **üzerine yazma**; skill okunabilir, uygulama onaylı diff ister |
| `geo-fix-schema` | AggregateRating / spoof review önerilerini **red** (AGENTS) |
| `geo-fix-content` | Uydurma istatistik/hedge scrub faydalı olabilir; sahte alıntı yok |
| `geo-compare` | Rakip URL gerekir — bu smoke’ta çalıştırılmadı |
| `geo-monitor` | Baseline JSON zaman serisi — ilk audit sonrası |
| `bing-ai-analytics` | Bing AI export CSV gerekir — yok |

## AGENTS çatışma filtresi

- `llms.txt` ≠ Google ranking faktörü  
- Service üzerinde AggregateRating yasak  
- Sahte yorum / peyzaj yok  
- Indexing API / IndexNow=Google yok  

## Sonuç cümlesi

**geoskills yüklenir ve `geo-audit` uygulanabilir çıktı verir (ZVT ~73 B).**  
“AI’da kesin görünürlük” vaadi skill içinde de garanti değil; Brand skoru local işletmede düşük çıkması beklenen bir artefact. ZVT için `zvt-geo-audit` + AGENTS birincil; Cognitic tamamlayıcı playbook.

**2026-11-04 son:** Pack silindi. Kullanışlı extract: `docs/geoskills-useful-extract-2026-11-04.md`.
