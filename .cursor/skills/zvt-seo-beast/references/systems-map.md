# Ranking systems map — ZVT kaldıraçları (2026-11)

**Garanti yok.** Resmi Google sinyalleri + sektör gözlemi ayrımı zorunlu. Çelişmede: Google Help / Search Central → AGENTS → bu skill.

## 1) Local pack / Maps (resmi)

Kaynak: [Google Business Profile Help — local ranking](https://support.google.com/business/answer/7091)

| Sütun | Anlam | ZVT’de ne yapılır | Ne yapılamaz |
|-------|-------|-------------------|--------------|
| **Relevance** | Profil / site sorgıya ne kadar uyuyor | Doğru birincil kategori, hizmetler, tam GBP, site H1/meta/semt içeriği | Keyword-stuffed işletme adı |
| **Distance** | Arayan ↔ pin / konum terimi | Pin doğru (Ferahevler); semt sayfaları Zekeriyaköy–Sarıyer | Pin’i uzak müşteri için taşımak; sahte adres |
| **Prominence / popularity** | Ne kadar tanınır / güvenilir | Yorum sayısı+recency+yanıt, linkler, citation NAP, fotoğraf | Sahte yorum, satın alınmış link, “#1” iddiası |

**Ücretle sıralama satın alınamaz** (aynı Help sayfası).

### Sektör gözlemi (Whitespark LSRF 2026 — nedensellik değil)

Uzman anketi skorları; Google resmi faktör listesi değil. ZVT’ye çevirirken **AGENTS yasaklarını ezme**:

| Yüksek skorlu gözlem | ZVT aksiyon | Red |
|----------------------|-------------|-----|
| Primary / additional category | Panel checklist | Peyzaj / Tekne yoksa kaldır |
| Review quantity + **recency** + sustained influx | Velocity; burst spam değil | Fake review |
| NAP HTML = GBP | `site-contact` / schema / footer | DB override gözardı |
| Landing title/H1 coğrafi niyet | `meta-clamp` + yerel H1 | Stuffing |
| Dedicated service pages | `/hizmetler/[slug]` | İnce kopya |
| Citations (Google/Bing/Apple) | citation tracker | Uydurma “connected” |
| Keywords in GBP **business title** | — | **Yasak** (AGENTS); anket ≠ guideline |

## 2) Organik web sonuçları

Kaynaklar: [Helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) · [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

| Risk | Tanım | ZVT kuralı |
|------|-------|------------|
| Scaled content abuse | Çok sayfa, az değer (AI dahil) | Autopilot validate; ince mahalle yok |
| Doorway abuse | Şehir/semt şablon → tek destinasyon | `neighborhood-gate` özgünlük testi |
| People-first fail | Sadece sıralama için yazılmış | Tek niyet / gerçek operasyon |

## 3) AI Overviews / AI Mode / AEO

Kaynak: [Google AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

| Gerçek | ZVT |
|--------|-----|
| Ekstra “AI SEO” formatı yok | Klasik crawlable HTML + iç link + deneyim |
| llms.txt Google Search’te ranking faktörü değil | Mevcut dosyaları bozma; sihir iddiası yok |
| Özel schema AI için zorunlu değil | Schema = rich result / entity netliği; parity şart |
| Sahte mention avı zararlı | Yasak |

Detay: `aeo-geo.md`.

## 4) Sayfa deneyimi (CWV)

Kaynak: [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)

Hedef (iyi): LCP ≤2.5s · INP ≤200ms · CLS ≤0.1 (field, p75).  
Detay: `cwv-and-experience.md`.

## 5) Keşif

Honest `lastmod` · sitemap · feed · WebSub · IndexNow (**Google ping değil**).  
Detay: `discovery-stack.md`.

## Agent karar özeti

```text
Local pack niyet? → zvt-local-seo + systems-map §1
Organik/para sayfa? → beast + money-page-playbook + anti-patterns
AI/AEO? → aeo-geo (sihir yok)
Yeni URL? → neighborhood-gate veya programmatic skill
Ölçüm iddiası? → araç çıktısı yoksa “açık soru”
```
