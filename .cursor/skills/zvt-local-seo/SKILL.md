---
name: zvt-local-seo
description: >-
  Zümrüt Vadi Temizlik local SEO bridge. Use for GBP, Maps pack, SAB service-area,
  reviews, citations, Bing/Apple Places, neighborhood/service pages, or when
  third-party local SEO skills (gbp-optimization, service-area-seo, etc.) might
  conflict with this repo. Always defer to AGENTS.md and site-contact NAP.
---

# ZVT Local SEO (anayasa köprüsü)

## Önce oku

1. Proje kökündeki `AGENTS.md` — **tek ana anayasa** (bölüm 0 hiyerarşi).
2. NAP tek kaynak: `src/config/site-contact.ts` (+ `src/config/geo-entity.ts`).
3. Üçüncü taraf Local SEO Skills playbook’tur; bu skill + AGENTS onlarla çelişirse **AGENTS kazanır**.

## Doğrulanmış GBP (2026-11-02)

- Ad: Zümrüt Vadi Temizlik
- Adres: Ferahevler, Şen Aydın Sok. No:10, 34457 Sarıyer/İstanbul
- Tel: 0551 925 09 43 · 24 saat açık
- Birincil kategori: Temizlik Hizmetleri
- Maps: https://maps.app.goo.gl/bdbJ7VSdWcWYcKmV7
- Skor: 4.9 / 12 yorum (hız artırılmalı)
- Tip: İşyeri pinli + hizmet alanı (hibrit görünüm); öncelik semt Zekeriyaköy

## Yasaklar (skill ne derse desin)

- Sahte yorum, sahte şube, uydurma referans/adres
- Keyword-stuffed GBP adı
- Kopya / ince mahalle sayfası; 18 ilçeye template spam
- **Peyzaj / bahçe düzenleme hizmeti** (GBP’den Peyzaj Mimarı kaldır)
- Indexing API (temizlik URL’leri için değil); IndexNow ≠ Google
- Keşif yığınını bozma; ücretli MCP’yi onaysız çağırma

## GBP panel — hâlâ manuel

1. Kaldır: Peyzaj Mimarı · Tekne (hizmet yoksa)
2. Açıklamadan peyzaj çıkar
3. İkincil ekle (yoksa): Ofis temizliği, İnşaat sonrası temizlik
4. Yorum isteme + yanıt ritmi

## Kod NAP

Değişiklik yalnızca `site-contact.ts` üzerinden; footer DB `SiteSettings.address` eskiyse admin’den GBP adresine çek.

## Site / anasayfa / meta

Kod, H1, trust metrikleri, sitemap/feed, programmatic landing → **`zvt-seo-beast`** skill (+ `checklist.md`).
Doğrulanmış rating: `src/config/trust-signals.ts` (GBP 4.9 / 12 — uydurma 5000+ yasak).
