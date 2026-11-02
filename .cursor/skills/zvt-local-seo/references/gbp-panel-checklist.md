# GBP panel checklist (manuel) — öncelik sırası

Google resmi: [local ranking tips](https://support.google.com/business/answer/7091) — relevance / distance / prominence (popularity). Ücretle sıralama yok.

Sektör anketi (Whitespark LSRF 2026) **gözlem**; AGENTS çatışmasında AGENTS kazanır.

## P0 — Temizlik / guidelines

- [ ] Peyzaj Mimarı kaldır  
- [ ] Tekne yoksa kaldır  
- [ ] Açıklamadan peyzaj / link / fiyat sloganı çıkar ([GBP representation guidelines](https://support.google.com/business/answer/3038177))  
- [ ] Ad = **Zümrüt Vadi Temizlik** (keyword stuffing **yasak** — anket skoru önemsiz)  
- [ ] Tek profil; sahte şube yok  

## P1 — Relevance + NAP

- [ ] Birincil: Temizlik Hizmetleri  
- [ ] İkincil: Ofis, İnşaat sonrası, Ev, Cam, Halı, Koltuk (yalnız gerçek hizmetler)  
- [ ] Predefined + custom **services** doldur — `gbp-services-copy.ts` / Admin GEO → GBP  
- [ ] Saat: 24 saat (= site schema)  
- [ ] Web: `https://www.zumrutvaditemizlik.com` (+ UTM opsiyonel `gbp-links`)  
- [ ] Telefon / adres = `site-contact` (HTML NAP match)  
- [ ] Pin doğru (Ferahevler); pin taşıma ile “distance hack” yok  
- [ ] Hizmet alanı: Sarıyer öncelik + Avrupa Yakası (hibrit; adresi gizleme)  
- [ ] Bing Places + Apple Business Connect → URL env + Admin GEO citation

## P2 — Prominence operasyon

Öncelik sırası (gözlem + resmi “reviews help”):

1. **Sustained review velocity** + metinli yorum (burst spam değil)  
2. Her yoruma **yanıt** (semt + hizmet; manipülasyon yok) — `review-response-tr.md`  
3. Fotoğraf / video (gerçek iş; stok azalt)  
4. Haftalık Post  
5. Q&A gerçek sorular  
6. Engagement (profil bölümleri güncel)

## P3 — Site köprüsü (beast)

- [ ] GBP landing = güçlü yerel H1/title sayfa (home veya Sarıyer hub)  
- [ ] Hizmet başına site sayfası  
- [ ] `/harita-ve-yorumlar` + Place ID review link  
- [ ] Citation: Google / Bing / Apple NAP tutarlı  

## Agent notu

Panel işleri **kod commit gerektirmez**; kullanıcıya checklist ver. Kod NAP değişecekse → `zvt-seo-beast` + `site-contact` onayı.

Garanti yok.
