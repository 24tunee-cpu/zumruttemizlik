# Neighborhood / semt×hizmet kapısı (doorway-aware)

Google: [Doorway abuse](https://developers.google.com/search/docs/essentials/spam-policies) · [Scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies) · [Helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## Swap-city testi (zorunlu)

Semt/ilçe adını başka bir yerle değiştirince geri kalan metin **hâlâ doğru ve faydalı** mı?  
**Hayır** → doorway / scaled adayı → **RED**.

## Kabul (hepsi zorunlu)

- [ ] Swap-city geçti  
- [ ] Operasyonel özgün ≥3 body (villa/plaza/orman/Boğaz/erişim vb.)  
- [ ] ≥3 özgün FAQ (ilçe şablon kopyası değil)  
- [ ] Soft claim; “her adres her gün” yok  
- [ ] Featured services = gerçek seed slug  
- [ ] Peyzaj yok; bahçe = yüzey temizliği  
- [ ] Meta clamp; tek H1  
- [ ] Browseable hierarchy: hub ↔ semt ↔ hizmet ↔ CTA (`internal-linking`)  
- [ ] `generateStaticParams` / sitemap **anlamlı** lastmod bump  
- [ ] Cannibalization: `seo-cannibalization` / yakın slug grep  

## Red

- İlçe adını değiştirip aynı metin  
- 18 ilçeye otomatik mahalle  
- Yalnız keyword H1 + generic FAQ schema  
- Doğrulanmamış “en iyi #1”  
- Orphan URL (iç link yok)  
- AI ile toplu semt üretimi (değer yok)

## İyi örnek

`zekeriyakoy`, `maslak-ofis-temizligi`, `uskumrukoy` — niyet ayrışmış, operasyonel detay var.

## Implement skill

`zvt-programmatic-landing` + beast checklist.
