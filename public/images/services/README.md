# Hizmet görselleri (gerçek iş fotoğrafı)

Unsplash yedekleri `src/lib/service-images.ts` içinde. Gerçek fotoğraf eklemek için:

1. Dosyayı buraya koy: `{slug}.webp` (örn. `ev-temizligi.webp`)
2. `LOCAL_SERVICE_IMAGES` map’ine path ekle (`service-images.ts`)
3. Admin’de ilgili `Service.image` alanını aynı path veya Blob/Cloudinary URL ile güncelle
4. GBP’ye de aynı gerçek fotoğraflardan yükle (stok azalt)

Slug’lar: `ev-temizligi`, `ofis-temizligi`, `insaat-sonrasi-temizlik`, `koltuk-yikama`, `hali-temizligi`, `cam-temizligi`, `dis-cephe-temizligi`
