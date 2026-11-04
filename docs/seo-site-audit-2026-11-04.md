# ZVT Site / GEO SEO Audit — İlk Rapor

**Tarih:** 2026-11-04 · **Kapsam:** canlı `www.zumrutvaditemizlik.com`  
**Araçlar:** `seo:crawl` (tam sitemap) · `seo:geo-audit` · `seo:page-audit` (20 para URL)  
**Durum:** Yalnızca envanter — **bu raporda kod/fix yok.**  
**Garanti yok** (sıralama / AI Overview / trafik vaadi yok).

---

## 1) Özet verdict

Teknik iskelet (HTTP 200, canonical host, noindex yok, AggregateRating yok, para sayfa H1/meta genel olarak dolu) **sağlam**.  
Tek **P1 / High** küme: **18 URL’de meta kirliliği** — title/description içine `"(sayfa raporu)"` sızmış; 13 blog aynı title’ı paylaşıyor.

| Metrik | Değer |
|--------|--------|
| Taranan URL | **1126** |
| HTTP 4xx/5xx / fetch fail | **0** |
| noindex | **0** |
| AggregateRating JSON-LD | **0** |
| High | **13** (hepsi duplicate `"(sayfa raporu)"` blog title) |
| Medium | **0** |
| Low | **17** (13 kısa title + 4 uzun title) |
| GEO High/Medium | **0** (8 Info: AI bot kuralları OK) |

Ham JSON:
- `docs/seo-crawl-full-2026-11-04.json`
- `docs/seo-crawl-summary-2026-11-04.json`
- `docs/seo-geo-audit-2026-11-04.json`
- `docs/seo-page-audit-money-2026-11-04.json`

---

## 2) URL dağılımı (sitemap crawl)

| Segment | Adet |
|---------|------|
| blog | 648 |
| geo-sss | 251 |
| bolgeler | 151 |
| cozumler | 46 |
| other (home, hub, iletişim…) | 22 |
| hizmetler | 8 |
| **Toplam** | **1126** |

Para/önemli path örneklemi (money filter): **211** URL — High/Medium **0**; Low **4** (uzun title hub’lar).

---

## 3) High — düzeltilmesi gereken (rapor; henüz fix yok)

### 3.1 Aynı title ×13: `"(sayfa raporu)"` (blog)

Hepsi HTTP 200, H1 doğru görünümlü, canonical self — ama **`<title>` ve meta description şablon metni bozuk**.

| # | URL |
|---|-----|
| 1 | `/blog/anti-bakteriyel-temizlik-nedir-hangi-odalarda-sarttir` |
| 2 | `/blog/evde-kedi-kopek-tuyu-temizligi-hayat-kurtaran-cozumler` |
| 3 | `/blog/evin-gunlerce-guzel-kokmas-icin-temizlik-suyuna-ne-katilmali` |
| 4 | `/blog/istanbul-temizlik-fiyatlari-online-hesaplama-2026` |
| 5 | `/blog/kimyasal-kullanmadan-ekolojik-dogal-ev-temizligi-mumkun-mu` |
| 6 | `/blog/koltuk-yikama-fiyatlari-2026-istanbul` |
| 7 | `/blog/maslak-ev-temizligi-fiyatlari-2026` |
| 8 | `/blog/musteri-yorumlari-deneyimleri-temizlik-sirketi-seciminde-neden-belirleyici` |
| 9 | `/blog/nisantasi-ev-temizligi-fiyatlari-2026` |
| 10 | `/blog/plaza-dis-cephe-cam-temizligi-profesyonel-cozumler-neden-onemli` |
| 11 | `/blog/sariyer-temizlik-fiyatlari-2026` |
| 12 | `/blog/temizlik-personeli-sigortal-guvenilir-neden-onemli` |
| 13 | `/blog/zumrut-vadi-temizlik-referanslar-calisma-prensibi` |

**Gözlem:** Description da `"(sayfa raporu) hakkında 2026 güncel rehber…"` — büyük olasılıkla meta şablon / GSC CTR override / DB title alanında literal `(sayfa raporu)` (GSC UI etiketi sızıntısı hipotezi; doğrulama fix aşamasında).

### 3.2 Bölge pair meta’da aynı kirlenme (5 URL — crawl severity ayrı flaglemedi çünkü title unique)

Title/desc içinde `"(sayfa raporu)"`:

| URL | Title örneği |
|-----|----------------|
| `/bolgeler/kagithane/insaat-sonrasi-temizlik` | `… \| (sayfa raporu) — Zümr…` |
| `/bolgeler/kartal/ev-temizligi` | `Kartal Ev Temizliği \| (sayfa raporu) — …` |
| `/bolgeler/sisli/ev-temizligi` | `Şişli Ev Temizliği \| (sayfa raporu) — …` |
| `/bolgeler/umraniye/ev-temizligi` | `Ümraniye Ev Temizliği \| (sayfa raporu) — …` |
| `/bolgeler/zeytinburnu/koltuk-yikama` | `Zeytinburnu Koltuk Yıkama \| (sayfa raporu) — …` |

**Toplam kirli URL: 18** (13 blog + 5 pair).

---

## 4) Low (öncelik düşük)

| Kod | Adet | Örnek |
|-----|------|--------|
| `title_short` | 13 | Yukarıdaki blog `(sayfa raporu)` title’ları |
| `title_long` (>70) | 4 | `/bolgeler`, `/cozumler`, `/randevu`, `/iletisim` |

Para sayfa derin audit (20 URL): Sarıyer hub/pair, hizmetler, randevu, fiyat, SSS — **High/Medium yok**; yalnız `/cozumler`, `/randevu`, `/iletisim` title_long.

---

## 5) GEO / AEO (`seo:geo-audit`)

| Kontrol | Sonuç |
|---------|--------|
| GPTBot / OAI-SearchBot / ChatGPT-User / ClaudeBot / PerplexityBot / Google-Extended / Bytespider / anthropic-ai | Info: kural var, sitewide block yok |
| `llms.txt` / `llms-full.txt` telefon NAP | OK (`+90 551 925 09 43`) |
| Sample money citability / AggregateRating | High/Medium yok |
| Not | llms.txt ≠ Google ranking faktörü; citation garanti yok |

---

## 6) Crawl’ın bilerek bakmadığı (sınır)

Bu otomasyon **bulmaz / kısmen bulur**:
- GSC CTR, query cannibalization, indeks kapsama (CSV gerekir)
- Field CWV / Lighthouse skorları
- İçerik kalitesi / E-E-A-T yargısı (yalnızca kısa metin eşiği)
- Görsel LCP byte boyutu
- GBP panel kategori (Peyzaj/Tekne — manuel)
- GA4 key event panel onayı

Bunlar ayrı: `zvt-gsc-ops` / `zvt-ga4-ops` / `zvt-change-validate`.

---

## 7) Öncelik önerisi (henüz uygulanmadı)

| Öncelik | Konu | Efor | Risk |
|---------|------|------|------|
| **P1** | 18 URL `(sayfa raporu)` title/desc temizliği (kaynak: meta şablon / CTR override / DB) | S–M | Düşük (meta only) |
| **P3** | Hub title kısaltma (`/bolgeler`, `/cozumler`, `/randevu`, `/iletisim`) | S | Düşük |
| — | HTTP / schema / noindex / AggregateRating | — | Bu tarama temiz |

---

## 8) Sonraki adım (onay bekler)

Rapor onayı sonrası önerilen sıra:
1. `(sayfa raporu)` kök nedeni bul (kod/DB) → 18 URL meta düzelt  
2. İsteğe bağlı hub title kısalt  
3. `seo:page-audit` + sınırlı crawl ile doğrula  

## 9) Fix uygulandı (2026-11-04 — onay sonrası)

| İş | Durum |
|----|--------|
| Kök neden | GSC Pages.csv → `'(sayfa raporu)'` placeholder → meta title/desc |
| Guard | `gsc-query-guards.ts` + import/A/B/blog/pair reject |
| DB scrub | `seo:scrub-sayfa-raporu` — 6 pair + 18 blog |
| Blog CTR meta | 13 (+ ilgili) slug `BLOG_CTR_META` |
| Hub title | `/bolgeler` `/cozumler` `/randevu` `/iletisim` absolute + kısaltma |
| Canlı blog | Scrub sonrası OK |
| Canlı pair | Deploy/ISR yenileme gerekir (cache) |

**Garanti yok.**
