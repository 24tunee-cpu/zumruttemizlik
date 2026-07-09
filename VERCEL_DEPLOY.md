# Vercel Deploy Rehberi - Zümrüt Vadi Temizlik

## 🚀 Hızlı Başlangıç

### Adım 1: GitHub'a Yükle
```bash
# Terminalde çalıştır:
git init
git add .
git commit -m "Initial commit"
git branch -M main

# GitHub reposu (zumruttemizlik)
git remote add origin https://github.com/24tunee-cpu/zumruttemizlik.git
git push -u origin main
```

### Adım 2: Vercel'e Bağla
1. https://vercel.com adresine git
2. GitHub ile login ol
3. "Add New Project" → GitHub reposunu seç
4. Framework Preset: **Next.js** (otomatik seçilecek)
5. "Deploy" butonuna tıkla

### Adım 3: Environment Variables Ekle
Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_SITE_URL=https://www.zumrutvaditemizlik.com
NEXTAUTH_URL=https://www.zumrutvaditemizlik.com
NEXTAUTH_SECRET=<openssl rand -base64 32 ile üretin>
DATABASE_URL=mongodb+srv://<kullanici>:<sifre>@<cluster>.mongodb.net/zumrutvaditemizlik?retryWrites=true&w=majority

# SEO / Analytics (opsiyonel ama önerilir)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-20PLCYV15H
# Google Search Console "HTML etiketi" yönteminin content değeri (yedek doğrulama):
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<GSC HTML tag content değeri>
# İşletme konumu (harita/schema); varsayılan Sarıyer/Zekeriyaköy'dür:
NEXT_PUBLIC_BUSINESS_LAT=41.1669
NEXT_PUBLIC_BUSINESS_LNG=29.0577
```

### Google Search Console & Analytics Doğrulama
- **Search Console (önerilen):** GSC'de **"URL öneki"** özelliği ekle → adresi **tam olarak** `https://www.zumrutvaditemizlik.com` (www ile) yaz → **"HTML dosyası"** yöntemini seç. `public/google53289b1c2d87e249.html` dosyası zaten canlıdır, "Doğrula" yeterlidir.
  - Alternatif/yedek: GSC'nin **"HTML etiketi"** yönteminden aldığın `content` değerini `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env'ine gir, redeploy et.
  - **"Alan adı (Domain)"** özelliğini seçersen DNS'e **TXT** kaydı eklemen gerekir; ayrıca apex (www'suz) domainin de Vercel'de bağlı olması gerekir.
- **Analytics:** Site Google Consent Mode v2 kullanır; GA etiketi her zaman yüklenir. Kullanıcı çerezleri kabul edince tam veri akışı başlar. GA4 kurulum sihirbazı "veri alınıyor" durumunu, canlı sitede çerez onayı verip birkaç sayfa gezdikten sonra görür.

### Adım 4: Domain Bağla
Vercel Dashboard → Domains → Add Domain:
- `zumrutvaditemizlik.com` ve `www.zumrutvaditemizlik.com` ekle
- Vercel DNS nameserver'larını verecek

## 🌐 Hostinger DNS Ayarları

Hostinger Panel → DNS Zone Editor:

**CNAME Kayıtları:**
```
Host: www
Points to: cname.vercel-dns.com
TTL: 300
```

**A Kayıtları (Root domain için):**
```
Host: @
Points to: 76.76.21.21 (Vercel IP)
TTL: 300
```

## ✅ WordPress Temizliği

Hostinger File Manager → public_html:
1. Tüm dosyaları seç (Ctrl+A)
2. Sil (veya yedekle başka klasöre)
3. Vercel yönlendirmesi aktif olduğunda site otomatik çalışacak

## 🔒 SSL Sertifikası
Vercel otomatik SSL verir (Let's Encrypt), ek işlem gerekmez.

## 📱 Admin Paneli Erişimi
Canlıya geçtikten sonra:
- https://www.zumrutvaditemizlik.com/admin
- Login: vedatgunenn@gmail.com / admin123

---

## ⚠️ Önemli Notlar

1. **MongoDB Atlas IP Whitelist:**
   - Vercel için `0.0.0.0/0` (tüm IP'ler) ekle
   
2. **NextAuth Secret:**
   - Üretim için güçlü bir secret oluştur:
   ```bash
   openssl rand -base64 32
   ```

3. **Image Optimization:**
   - Vercel'de otomatik çalışır, ek ayar gerekmez

## 🆘 Destek
Sorun çıkarsa Vercel Dashboard → Activity log kontrol et.
