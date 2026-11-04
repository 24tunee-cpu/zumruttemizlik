# Cognitic geoskills — ZVT eleme + kullanışlı çıktı (sonra silindi)

**Tarih:** 2026-11-04 · Pack: Cognitic-Labs/geoskills · **AGENTS üstün** · Garanti yok

## Eleme (tarama)

| Skill | ZVT için? | Neden |
|--------|-----------|--------|
| **geo-audit** | ✅ Kullanıldı | Skor + öncelik (önceki smoke: **73 B**) |
| **geo-fix-content** | ✅ Kullanıldı | Sarıyer hub citability rewrite (AGENTS filtreli) |
| **geo-fix-schema** | ✅ Kullanıldı | Schema gap (AggregateRating red) |
| geo-fix-llmstxt | ❌ Atlandı | `llms.txt` zaten NAP-uyumlu; üzerine yazma riski |
| geo-compare | ❌ Atlandı | Rakip URL verilmedi |
| geo-monitor | ❌ Atlandı | Tek seferlik; baseline zinciri gereksiz |
| seo-analytics | ❌ Atlandı | GSC/GA4 CSV veya OAuth yok |
| bing-ai-analytics | ❌ Atlandı | Bing AI export yok |

---

## 1) geo-audit (özet)

Composite **73 (B)** · Tech 91 · Citability 76 · Schema 80 · Brand 49 (Brand rubriği local SMB’ye sert).

---

## 2) geo-fix-content → `/bolgeler/sariyer` (uygulanabilir)

**Şimdi düşünülebilecek metin sıkılaştırmaları** (`programmatic-seo` / district FAQ kaynakları):

1. Operasyon “yoğundur” → kapsam cümlesi (keşifte yazılır)  
2. “sık talep” + peyzaj red → paketlenebilir yüzey + peyzaj yok (koru)  
3. Deep dive “sıklıkla” → tek keşifte kalem planı  
4. SSS “profesyonel şirket” → sigorta + keşif + Maps 4.9·12  
5. Region blurb “titiz” → odak hat + tahmini/kesin fiyat

**Dokunma:** özet kutusu, fiyat keşif uyarısı, peyzaj red, WhyChoose trust.

**Uygulandı (2026-11-04):** Sarıyer `regionBlurb` / `localSignals` / `deepDive` + ilçe FAQ güvenilir-firma cevabı; Service `provider` → `#business`; root JSON-LD `next/script` → SSR `<script>`.

---

## 3) geo-fix-schema → gerçek gap

**Gerçek:** Root Organization/`#business`/WebSite JSON-LD’nin SSR head’de crawlable script olup olmadığı; `/hizmetler/*` Service `provider` → `#business` `@id`.  
**Nice-to-have:** Speakable, district WebPage.  
**Red:** AggregateRating, Product/Offer fiyat, foundingDate, peyzaj Service, görünmeyen FAQPage.

---

## Pack durumu

Kurulum sonrası bu not yazıldı; Cognitic skill klasörleri **projeden silindi** (geçici kullanım). Kalıcı ZVT GEO: `zvt-geo-audit` + `AGENTS.md`.
