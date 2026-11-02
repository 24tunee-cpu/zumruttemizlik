# Money page playbook — müşteri / telefon / randevu

Amaç: organik + yerel niyet → **tek net CTA**. Sıralama garantisi yok; CRO + trust + crawlable içerik.

## Para sayfası tanımı (ZVT)

| Öncelik | URL türü | Örnek |
|---------|----------|--------|
| P0 | Home, hizmet detay, randevu, fiyat, iletişim | `/`, `/hizmetler/[slug]`, `/randevu` |
| P1 | Öncelik semt / semt×hizmet, ilçe hub (Sarıyer) | Zekeriyaköy, Maslak ofis |
| P2 | Hub (hizmetler, bölgeler, çözümler, SSS) | `/hizmetler`, `/bolgeler` |
| P3 | Blog / geo-sss drip | Dönüşüm köprüsü zorunlu |

## Sayfa sözleşmesi (P0–P1)

Her para sayfada kontrol:

1. **Tek H1** — yerel veya hizmet niyeti net  
2. **Meta** — `clampMetaTitle` / `clampMetaDescription`; emoji yok  
3. **Trust** — `formatGoogleTrustLine()` veya WhyChoose; uydurma sayı yok  
4. **Kapsam** — soft claim (ilçe) / operasyonel özgün (semt)  
5. **CTA grubu** — Ara | WhatsApp | Randevu | (opsiyonel) Fiyat hesapla  
6. **Sticky** — `StickySeoCtaBar`  
7. **İç link** — RelatedSeoLinks / ConversionSeoAside / hub strip  
8. **Schema** — Service / LocalBusiness / FAQ yalnızca parity ile  
9. **Crawlable** — kritik metin JS-only skeleton’a kilitli olmasın (home services SSR seed)

## Intent → CTA

| Kullanıcı niyeti | Birincil CTA | İkincil |
|------------------|--------------|---------|
| Fiyat merakı | `/fiyat-hesaplama` + keşif notu | Tel |
| Acil temizlik | `tel:` / WA | Randevu |
| Semt güven | Harita & yorumlar + Ara | Randevu |
| Karşılaştırma | WhyChoose + gerçek yorum | Hizmet detay |

## İçerik derinliği (kısa kural)

- **Hizmet:** process + idealFor + soft fiyat (“keşif sonrası”)  
- **Semt:** villa/plaza/orman/erişim gerçekleri (≥3 body) + özgün FAQ  
- **Hub:** navigasyon + trust; ince keyword paragraf şişirme yok  

## Yasak (para sayfada)

- Fake social proof  
- Birden fazla eşit güçlü CTA kaosu (sticky hariç tek birincil)  
- “Garantili 1. sıra”  
- Peyzaj / tekne  

## Verify

```bash
npm run type-check
npm run seo:audit-meta   # meta değiştiyse
npm run seo:gates        # slug / NAP
```

Exit: hangi P0/P1 URL’ler + CTA + trust kaynağı.
