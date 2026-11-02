# ZVT pazar çapaları (rakip analizi varsayılanları)

Kaynak: `AGENTS.md` + `site-contact` + `geo-entity` — uydurma rakip ekleme.

## Biz

| Alan | Değer |
|------|--------|
| Marka | Zümrüt Vadi Temizlik |
| Site | https://www.zumrutvaditemizlik.com |
| Pin | Ferahevler, Şen Aydın Sok. No:10, 34457 Sarıyer |
| Tip | Hybrid SAB (adres açık; hizmet alanı geniş) |
| GBP kategori | Temizlik Hizmetleri (birincil) |
| Trust (doğrulanmış) | `trust-signals.ts` — skor/yorum sayısı oradan; şişirme yok |
| Öncelik coğrafya | Sarıyer / Zekeriyaköy → Maslak, Tarabya, Bahçeköy, Uskumruköy → Avrupa Yakası |

## Seed rakip izleme (`GEO_COMPETITOR_NAMES`)

Kod: `src/config/geo-entity.ts` — admin GEO rakip listesi.

- Helpling  
- Clean Team  
- Mop İstanbul  
- Temizlik Express  

Bunlar **başlangıç izleme**; canlı map pack’te farklı firmalar çıkabilir. Canlı SERP’teki isimleri matrise ekle; seed listesini körü körüne “#1” sanma.

## Öncelikli sorgu demeti (analiz seti)

Map pack + organik (her biri ayrı not):

1. `Sarıyer ev temizliği`  
2. `Zekeriyaköy temizlik` / `Zekeriyaköy ev temizliği`  
3. `Maslak ofis temizliği`  
4. `Sarıyer inşaat sonrası temizlik`  
5. `Sarıyer koltuk yıkama`  
6. Marka: `Zümrüt Vadi Temizlik`

İsteğe bağlı genişleme: Beşiktaş / Şişli ofis — soft claim (AGENTS: her ilçede “hizmet veriyoruz” abartısı yok).

## Site kaldıraç envanteri (bizim güçlü / zayıf hipotez)

**Güçlü (kodda var — canlı sıralama iddiası değil):**

- Programatik `/bolgeler` + semt landings  
- NAP schema + feeds/sitemap/IndexNow yığını  
- Admin citation tracker + review şablonları  
- Money pages: randevu, fiyat-hesaplama, harita-ve-yorumlar  

**Zayıf / operasyon (sık gap):**

- Yorum sayısı/hız (prominence)  
- GBP foto/post/services paneli (manuel)  
- Bing/Apple citation URL env  
- Gerçek iş fotoğrafı vs Unsplash  
- GSC/Maps OAuth prod eksikliği (ölçüm körlüğü)

Analizde “rakip önde çünkü X” derken X’i yukarıdaki sütunlara bağla.
