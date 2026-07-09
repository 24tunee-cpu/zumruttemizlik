# Production Environment Variables

## Vercel Environment Variables (Dashboard'da eklenecek)

```bash
# Site URL
NEXT_PUBLIC_SITE_URL=https://www.zumrutvaditemizlik.com

# NextAuth.js
NEXTAUTH_URL=https://www.zumrutvaditemizlik.com
NEXTAUTH_SECRET=<openssl rand -base64 32 ile üretilecek güçlü secret>

# Database (MongoDB Atlas - Production)
DATABASE_URL=mongodb+srv://<kullanici>:<sifre>@<cluster>.mongodb.net/zumrutvaditemizlik?retryWrites=true&w=majority

# Email (Opsiyonel - Contact form için)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
```

## Hostinger DNS Ayarları (Domain Yönlendirme)

### CNAME Kaydı:
```
Host: www
Points to: cname.vercel-dns.com
TTL: 300
```

### A Kaydı (Root Domain):
```
Host: @
Points to: 76.76.21.21
TTL: 300
```

## WordPress Temizlik Adımları:

1. Hostinger File Manager'a git
2. public_html klasörüne gir
3. Tüm WordPress dosyalarını sil (veya wp-backup klasörüne taşı)
4. public_html boş kalsın (Vercel yönlendirmesi için)

## Admin Giriş Bilgileri:
- URL: https://www.zumrutvaditemizlik.com/admin
- Email: vedatgunenn@gmail.com
- Password: admin123

## Önemli Kontroller:
- [ ] MongoDB Atlas IP Whitelist: 0.0.0.0/0 ekle
- [ ] NextAuth Secret güçlü ve unique olsun
- [ ] Domain DNS yönlendirmesi aktif
- [ ] SSL sertifikası otomatik (Vercel Let's Encrypt)
