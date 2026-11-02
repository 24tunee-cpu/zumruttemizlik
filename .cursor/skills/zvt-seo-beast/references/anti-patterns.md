# Anti-patterns — akıllı red listesi

Agent bunları “SEO iyileştirme” diye **önermez / uygulamaz**.

## Google spam hizası

Kaynak: [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

| Anti-pattern | Neden | ZVT doğru alternatif |
|--------------|-------|----------------------|
| Scaled content: 18 ilçe × aynı şablon mahalle | Scaled content abuse | Yalnız `neighborhood-gate` geçen özgün semt |
| Doorway: şehir sayfası → hep aynı randevu metni, özgünlük yok | Doorway abuse | Operasyonel fark + soft claim + hub hiyerarşi |
| AI ile yüzlerce blog “sıralama için” | Scaled + helpful fail | Autopilot limit + validate + marka bağlama |
| FAQ her sayfaya schema için | Spam / parity riski; FAQ rich genel kapalı | Yalnız görünür, faydalı Q&A |
| llms.txt “AI ranking hilesi” | Google: Search kullanmaz | Entity tutarlılığı; sihir iddiası yok |
| Sahte mention / PBN / satın link | Spam + güven kırığı | Organik citation + gerçek yorum |

## Local / GBP

| Anti-pattern | Red |
|--------------|-----|
| İşletme adına “Zekeriyaköy Temizlik …” stuffing | AGENTS yasak (anket skoru önemsiz) |
| Pin’i müşteri yoğunluğuna taşı | Distance oyun; guidelines ihlali riski |
| Burst 20 sahte yorum | Manipülasyon |
| “5.0 · 5000+ müşteri” UI | trust-signals dışı uydurma |
| Peyzaj / Tekne kategorisi (hizmet yok) | Panelden kaldır |

## İçerik / CRO

| Anti-pattern | Red |
|--------------|-----|
| Meta emoji / keyword stuffing title | meta-clamp |
| “#1 İstanbul / en ucuz garantili” | Doğrulanmamış + spam ton |
| Hero’da sahte istatistik şeridi | HOME_HERO_STATS / verified only |
| content-upgrade ile 98%/15+ enjekte | Kapalı; verified şablon |
| Keşif stack’i “temizlik” diye silmek | AGENTS yasak |

## “Akıllı” tuzaklar (araştırma ≠ uygulama)

1. **Whitespark “Keywords in GBP title” yüksek skor** → ZVT’de **uygulama**.  
2. **FAQPage = AI citation** iddiası → kanıt zayıf; Google AI guide özel schema istemiyor.  
3. **IndexNow = Google** → yanlış; Bing/Yandex katılımcı.  
4. **Indexing API temizlik URL** → önerme.  
5. **Her semt×hizmet matrisi** → cannibalization + doorway riski; niyet ayrışması şart.

## Test: swap-city

Semt adını değiştirince metin hâlâ anlamlı mı?  
**Hayır** → sayfa spam adayı; yayınlama / ekleme.
