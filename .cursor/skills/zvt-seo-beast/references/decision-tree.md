# SEO decision tree — önce düşün, sonra düzenle

Her SEO isteğinde bu ağacı uygula. Skill’leri rastgele yükleme.

## Adım 0 — Anayasa

1. `AGENTS.md` §0 çatışma tablosu  
2. `verified-facts.md` (sayı/adres/hizmet)  
3. Kullanıcı **push/deploy/ücretli MCP** istedi mi? Hayırsa yapma.

## Adım 1 — Niyet sınıflandır (tek birincil)

| Kullanıcı dili | Sınıf | Birincil skill |
|----------------|-------|----------------|
| GBP, map pack, kategori, pin, foto, post | `local-ops` | `zvt-garrett-dispatch` → `zvt-local-seo` |
| Yorum yanıt / review isteği | `reviews` | local-seo + review-response-tr |
| Citation / Bing / Apple | `citations` | local-seo + citation-workflow |
| Anasayfa, meta, schema, trust, FAQ | `site-seo` | `zvt-seo-beast` |
| Semt / ilçe×hizmet yeni sayfa | `programmatic` | `zvt-programmatic-landing` |
| Blog / autopilot seed | `blog` | beast `autopilot-and-blog` |
| “#1 ol / 100 puan / garanti” | `expectation` | Reddet; systems-map + dürüst çerçeve |
| Keyword / brief / audit (strateji) | `strategy` | dispatch → max 2 Garrett + beast implement |

Bir istek birden fazla sınıf taşıyorsa: **önce riskli olan** (NAP/spam/trust), sonra CRO.

## Adım 2 — Risk kapısı (hard stop)

Aşağıdakilerden biri varsa **uygulama yok**, kullanıcıya kısa red:

- [ ] Sahte şube / sahte yorum / uydurma metrik  
- [ ] Keyword-stuffed GBP adı  
- [ ] 18 ilçe template mahalle  
- [ ] Peyzaj / tekne (sitede yok) iddiası  
- [ ] Indexing API “Google’a index et”  
- [ ] IndexNow = Google ping iddiası  
- [ ] Keşif stack silme  
- [ ] Ücretli MCP onaysız  

## Adım 3 — Progressive disclosure

Sadece ilgili reference’ı oku (hepsini değil):

| Sınıf | Oku |
|-------|-----|
| Her iş | verified-facts |
| site-seo | meta-and-trust · schema-contract · money-page-playbook |
| programmatic | inventory · neighborhood-gate · anti-patterns |
| local-ops | gbp-panel-checklist · systems-map §1 |
| AEO | aeo-geo |
| keşif | discovery-stack |
| şüpheli taktik | anti-patterns |

## Adım 4 — Implement sırası

```text
1. Config/NAP/trust (tek kaynak)
2. Template / sayfa içeriği (özgünlük)
3. Meta clamp + canonical
4. Schema parity
5. İç link / CTA
6. Sitemap lastmod (anlamlı değişiklikse)
7. type-check + seo:gates
8. Exit raporu (garanti yok)
```

## Adım 5 — Ölçüm dürüstlüğü

- GSC tıklama / sıralama / AI citation → araç çıktısı yoksa **açık soru**  
- “Whitespark #3 = keyword in name” → **uygulama yasağı**; anket ≠ AGENTS  
- Rating güncelle → trust-signals + verified-facts tarihi

## Çıkış şablonu

```text
Niyet sınıfı: …
Skills okunan: …
References: …
Hard stop tetiklendi mi: evet/hayır
Değişen: …
Doğrulanan: …
Açık soru: …
Garanti yok
```
