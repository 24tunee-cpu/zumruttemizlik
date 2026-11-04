# GSC / GA4 iyileştirme kaydı — 2026-11-03 → 11-04

> Amaç: Daha çok görünürlük + daha çok müşteri adayı (telefon / WA / randevu).  
> Sıralama veya trafik **garantisi yok**. NAP / sahte yorum / peyzaj uydurma yok.  
> Anayasa: `AGENTS.md`. Kaynak CSV’ler: `gsc csv/`, `gsc csv 2/` (repo dışı bırakılabilir).

---

## 1. Nasıl görünüyordu (bulgular)

### Search Console — deneyim / zengin sonuç
| Sorun | Neydi |
|--------|--------|
| Yorum snippet | `/cozumler/*` vb. — `AggregateRating` **Service** üzerinde → `"parent_node" geçersiz nesne türü` (4 URL; son crawl Eyl–Eki) |
| Breadcrumb (“İçerik haritaları”) | Tespit ~20 → zirve **45** (Eki) → **11** (3 Kas) — dalgalanma + yeniden işleme; tabloda “Öğe adı: Yok” eski crawl örnekleri |
| Enhancement / noindex gürültüsü | Çoğu `?utm=` / query URL; Googlebot Disallow paylaşımı eksikti |

### Crawl / bütçe
| Sorun | Neydi |
|--------|--------|
| “Other” / gereksiz URL | Next.js `?_rsc=` crawl israfı |
| Blog 404 | GSC’de **2024** slug’lar (asıl içerik **2026**) |
| Semt landing | Neighborhood URL’ler `bolgeler` sitemap’te eksik kalabiliyordu |
| `/ara` | Sitemap gürültüsü riski |

### Performans CSV (örnek dönem ~145 tık / ~8.7k gösterim bandı)
| Bulgu | Neydi |
|--------|--------|
| Trafik dağılımı | Blog ~yarı tık; para sayfaları (hub / pair / hizmet) zayıf |
| Sarıyer hub | Ortalama pozisyon ~**44** (çok geride) |
| “sarıyer dış cephe” | Poz ~**3.7** ama **0 tık** (CTR / snippet sorunu) |
| Dış cephe hizmet | Poz ~**47** |
| Maslak / Zekeriyaköy | “temizlik şirketi” niyeti zayıf H1/meta |
| İnşaat / ofis / cam blog | Yüksek gösterim, zayıf CTR meta |

### GA4
| Bulgu | Neydi |
|--------|--------|
| Lead | `generate_lead` key event eksik / belirsiz; telefon tıkları iş hedefi değildi |

---

## 2. Ne yaptık (kod + commit)

| Commit | Özet |
|--------|------|
| `5fdf451` | Self-serving **AggregateRating** kaldırıldı (Service/LocalBusiness); hub’lara breadcrumb |
| `bb5084c` | Googlebot **Disallow** paylaşımı; cannibal blog sitemap dışı |
| `bea517a` | Neighborhood landings → `bolgeler` sitemap |
| `3346270` | `?_rsc=` robots/proxy sertleştirme |
| `9753c85` | `?_rsc` redirect + legacy edge + `/ara` sitemap dışı + `_next` X-Robots |
| `1e82b72` | Blog **2024→2026** 308; Sarıyer şirketi meta/H1; stuffed title reject; `generate_lead` MarketingEvent; köprüler |
| `1f463b4` | `src/lib/gsc-ctr-overrides.ts` — Sarıyer pair/H1, hizmet+blog CTR, Maslak/Zekeriyaköy H1, pair erken CTA |
| `c4f3cbb` | Review helper landmine nötr; Service/Offer → `#business` `@id`; `cozumler` lastmod bump (GSC parent_node doğrulama) |

### Kalıcı dosyalar
- `src/lib/gsc-ctr-overrides.ts` — CSV kaynaklı title/desc/H1
- `src/lib/intent-schema.ts` — AggregateRating yok; provider `@id`
- `src/proxy.ts` / `next.config` / `robots` — `_rsc` + Googlebot Disallow
- Trust: `trust-signals.ts` (4.9 · 12) — **schema yıldızı değil**, görünür HTML

---

## 3. Panelde sende kalanlar

1. GA4: `generate_lead` → **anahtar etkinlik** (yoksa `phone_click`’ten oluştur)
2. GBP: Peyzaj Mimarı / (yoksa) Tekne kategorisi kaldır; yorum yanıtları
3. GSC: Yorum snippet + breadcrumb **doğrulama** bitene kadar bekle (canlı HTML temiz; eski crawl gecikmeli)
4. 7–14 gün: Sarıyer dış cephe/cam CTR, hub pozisyon, pair tıkları

---

## 4. Yanlış inançlar (tekrar etme)

- IndexNow ≠ Google’a ping  
- Breadcrumb / enhancement **adet↑** tek başına ranking değil; geçersiz şema zararlı  
- Service üzerine AggregateRating = GSC hata (self-serving)  
- Daha çok ince mahalle sayfası ≠ daha çok müşteri  

---

## 5. Sonraki kontrol listesi

- [ ] GSC yorum snippet: 4 URL → 0 / “Geçti”
- [ ] Breadcrumb tespit: düşüş sonrası toparlanma (hedef yön ~30–45 geçerli; garanti yok)
- [ ] `?_rsc` / Other crawl oranı ↓
- [ ] Para sayfa tık payı ↑ (blog tek başına şişmesin)
- [ ] GA4 `generate_lead` dönüşüm raporu

*Not tarihi: 2026-11-04. Güncelleme: yeni GSC dump gelince bu dosyaya kısa “delta” satırı ekle.*

---

## 6. Delta — SEO OS pass (2026-11-04 akşam)

Skills sırası: `zvt-seo-os` = gsc → ga4 → validate → beast.

| Adım | Sonuç |
|------|--------|
| GSC | Baseline hâlâ geçerli; yerel `gsc csv/` klasörü silinmiş — yeniden export faydalı |
| GA4 | Kod `generate_lead` OK; panel key event hâlâ manuel |
| Validate | CTR titles canlı OK; AggregateRating yok; 2024→2026 OK; `?_rsc` strip güçlendirildi (`/?` destination + proxy) |
| Beast | cozumler `WhyChooseZvt`; koltuk SERVICE_CTR; type-check + seo:gates OK |

**Garanti yok.** Re-crawl 3–14g.
