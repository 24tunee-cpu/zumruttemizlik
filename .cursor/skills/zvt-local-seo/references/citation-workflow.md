# Citation workflow

## Kaynaklar

- `GEO_DIRECTORY_TARGETS` → `src/config/geo-entity.ts`  
- Tracker: Admin GEO + `MapPlatformListing` (`/api/admin/geo/directories`)  
- NAP string: yalnızca `SITE_CONTACT.addressLine` — varyant uydurma yok

## Hedefler

Google (kritik) → Bing Places → Apple Business Connect → Yandex (opsiyonel).

Sektör gözlemi: citation faydası erken doygunlaşır (~20+ tutarlı); spam dizin yok.

## Adımlar

1. Dizin profil URL’sini doğrula  
2. Admin’de durum: not_connected / in_progress / connected  
3. Google satırında Place ID varsa kaydet  
4. Env URL (`NEXT_PUBLIC_*`) varsa doldur — commit etme secret  

Otomatik scraping / satın alma citation **yok**.
