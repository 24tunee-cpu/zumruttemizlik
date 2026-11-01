<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Zümrüt Vadi Temizlik — AGENTS.md (Proje Anayasası)

> Kalıcı çalışma kuralları. Tahmin yazma; doğrulanmamış bilgiyi “açık soru” olarak işaretle.
> Hassas bilgi (şifre, token, `.env` içeriği) bu dosyaya konmaz.
> Son anayasa güncellemesi: 2026-10-30 (yalnızca audit + bu dosya; site kodu değiştirilmedi).

---

## 1. İşletme ve proje kimliği

| Alan | Doğrulanmış kaynak |
|------|-------------------|
| Marka | Zümrüt Vadi Temizlik (`SITE_CONTACT.companyName`, `llms.txt`) |
| Site | https://www.zumrutvaditemizlik.com |
| Telefon / WA | 0551 925 09 43 (`+905519250943`) — `src/config/site-contact.ts` |
| E-posta | vedatgunenn@gmail.com |
| Adres (kod) | `Sarıyer Merkez, Sarıyer/İstanbul` · PL: 34450 |
| Öncelik bölge (içerik) | Sarıyer / Zekeriyaköy ağırlıklı; Avrupa Yakası + İstanbul geneli hizmet anlatımı |

**Doğrulanması gereken:** Fiziksel işyeri vs. hizmet bölgesi ayrımı; Uskumruköy’ün resmi hizmet listesinde olup olmadığı; GBP kategori/saat/adres ile site NAP birebir eşleşmesi (GBP panel erişimi bu auditte yok).

Sahte şube, sahte yorum, uydurma referans veya adres **üretilmez**.

---

## 2. Doğrulanmış teknik altyapı

| Katman | Gerçek |
|--------|--------|
| Framework | Next.js **16.x** (App Router), React 19, TypeScript |
| Stil | Tailwind CSS 4 |
| DB | MongoDB + Prisma 6 (`prisma/schema.prisma`) |
| Auth | NextAuth 4 + Prisma adapter · admin `ADMIN` rolü |
| Hosting | Vercel (`vercel.json`, region `iad1`) · GitHub: `24tunee-cpu/zumruttemizlik` |
| Cron | `0 5 * * *` → `/api/cron/publish-blogs` (SEO Autopilot); `0 3 * * *` → `/api/cron/maps-sync` |
| Medya | Vercel Blob, Cloudinary, Next Image (webp/avif) |
| Analitik | Vercel Analytics/Speed Insights, GA (Consent Mode), web-vitals |
| Diğer | Framer Motion, Zustand, Zod, googleapis (GSC/Maps), IndexNow |

**Komutlar:** `npm run dev` · `build` · `type-check` · `lint` · `predeploy:check` · `seo:autopilot:*` · `perf:check`

**Not:** README hâlâ “Next.js 14” diyor — güncel değil; kaynak `package.json`.

---

## 3. Dosya ve sayfa mimarisi

```
src/app/          # App Router sayfalar + API
src/components/   # UI (site + admin)
src/config/       # site-contact, programmatic-seo, geo-entity, admin-menu
src/lib/          # SEO, schema, autopilot, GSC, maps, güvenlik
prisma/           # schema + seed
public/           # statik varlıklar, llms*.txt kopyaları
scripts/          # seed, bootstrap, validate, audit yardımcıları
```

**Önemli public rotalar**

| Tür | Yol | Ölçek (kod) |
|-----|-----|-------------|
| Hizmet | `/hizmetler`, `/hizmetler/[slug]` | seed: 7 hizmet |
| Programatik ilçe | `/bolgeler/[district]` | 18 ilçe |
| İlçe×hizmet + semt | `/bolgeler/[district]/[service]` | 18×7 + 5 semt (zekeriyakoy, maslak, tarabya, bahcekoy, uskumrukoy) |
| Legacy redirect | `/[district]`, `/[district]/[service]` | → `/bolgeler/...` |
| Çözümler | `/cozumler`, `/cozumler/[slug]`, `/[slug]/[district]` | intent landings |
| Blog | `/blog`, `/blog/[slug]`, `/blog/silo/[slug]` | DB + drip kuyruk |
| GEO SSS | `/geo-sss`, `/geo-sss/[slug]` | statik + `GeoSssContent` drip |
| Dönüşüm | `/iletisim`, `/randevu`, `/fiyat-hesaplama`, `/fiyatlar` | form + CTA |
| Güven | `/hakkimizda`, `/referanslar`, `/harita-ve-yorumlar`, `/galeri`, `/sss` | |
| Admin | `/admin/*` | dashboard, SEO, maps, blog, talepler… |

**Sitemaps:** `/sitemap.xml`, `/bolgeler/sitemap.xml`, `/cozumler/sitemap.xml`, `/blog/sitemap.xml`, `/geo-sss/sitemap.xml` · `robots.ts` canlıda doğrulandı.

---

## 4. SEO stratejisi

**Amaç:** Organik keşif + yerel niyet + hizmet ticari sorguları → telefon/WhatsApp/randevu.

**Mevcut güçlü yönler**

- Programatik ilçe/hizmet matrisi + semt landing (Sarıyer 4 semt)
- Çoklu sitemap, canonical yardımcıları (`src/lib/seo.ts`)
- Schema: LocalBusiness/Organization root (`root-schema.ts`), FAQ/Breadcrumb, AggregateRating (Maps)
- GSC sync + meta A/B + cannibalization map
- SEO Autopilot: blog/geo-sss yayın, refresh, seasonal, IndexNow, run log + `/admin/seo-autopilot`
- İç link: topic cluster, blog publish links, silo, priority links
- Legacy URL redirect katmanı (blog `-2026` yıl suffix koruması kritik)

**İçerik kuyruğu (autopilot):** v4/v5 engagement, karşılaştırma, mevsimsel, geo-sss drip — günlük limitler `src/lib/seo-autopilot/constants.ts`.

**Yasaklar:** Keyword stuffing; yalnızca sıralama için kopya mahalle sayfası; doğrulanmamış sıralama/trafik iddiası; spam backlink/PBN.

---

## 5. Yerel SEO stratejisi

1. NAP tek kaynak: `src/config/site-contact.ts` → schema, footer, llms, GBP.
2. Öncelik semtler: Zekeriyaköy (birincil), Sarıyer Boğaz/orman hattı (Maslak, Tarabya, Bahçeköy); diğer ilçeler genişleme.
3. GBP ↔ site tutarlılığı (telefon, web, adres satırı, saatler) — panelde manuel doğrulanmalı.
4. Yorum yanıtları: semt + hizmet gerçek deneyimle; manipülasyon yok.
5. Citation hedefleri: `GEO_DIRECTORY_TARGETS` (Google, Bing, Apple, Yandex) — otomasyon yok, takip admin/Maps.

Mahalle sayfası yalnızca özgün operasyonel içerik varsa (`NEIGHBORHOOD_LANDINGS` standardı).

---

## 6. GEO / AEO stratejisi

- Entity: `src/config/geo-entity.ts` (NAP, sameAs, citation prompts)
- Passage/FAQ: geo-sss + district FAQs
- `public/llms.txt` / `llms-full.txt` mevcut; AI bot allow `robots.ts` içinde
- AEO: soru-cevap yalnızca faydalı sayfada; gereksiz FAQ üretme

**Kural:** llms.txt “sihirli ranking faktörü” değil; tutarlı entity + erişilebilir HTML + doğrulanabilir bilgi öncelik. Resmî destek iddiası abartılmaz.

**llmsSync (çözüldü 2026-10-30):** Runtime Vercel FS’e yazmaz (`read-only-fs` → skip, throw yok). Canlı envanter: `/llms-inventory.txt`. Build: `llms:inventory` → `llms:sync`.

---

## 7. Teknik SEO standartları

- Crawlable HTML; önemli içerik JS-only olmasın
- Her indexable URL: unique title/desc, tek H1, self-canonical
- Sitemap’te yalnızca 200 + indexable URL
- URL değişiminde 301 (`RedirectRule` / legacy redirects)
- Blog slug: **yalnızca ASCII**; yıl suffix `-20xx` legacy redirect’ten muaf
- Image: meaningful alt, modern format, boyut kontrolü
- CWV: LCP/INP/CLS — `perf:audit`, Speed Insights
- robots: admin/api/login disallow; `Crawl-delay` Google tarafından yok sayılır (zararsız gürültü)

---

## 8. İçerik üretim standartları

- Tek sayfa = tek birincil niyet; cannibalization için `seo-cannibalization.ts` kontrol
- Gerçek hizmet/kapsam/süreç yaz; fiyat aralığı “tahmini”, kesin fiyat keşif sonrası
- Autopilot içerik: ASCII slug, `-2026` (veya yıl) suffix, `seo:autopilot:validate` geçmeden seed yok
- Engagement/gündem blogları markayı zayıflatmamalı; iç link ile hizmet/bölge hub’larına bağla
- Unsplash stok görselleri geçici kabul; mümkünse gerçek iş fotoğrafı

---

## 9. Web geliştirme standartları

- Mevcut mimariye uy; yeni framework/kütüphane gereksiz ekleme
- Next 16 docs’a bakmadan API varsayma (üstteki nextjs-agent-rules)
- `revalidatePath` script dışında `safeRevalidatePath` kullan
- Prisma değişikliklerinde `db push`/migrate bilinçli; secret commit yok
- Admin + public ayrımı; cron `CRON_SECRET` Bearer
- Kullanıcı istemeden: push, deploy, DNS, ücretli servis, toplu SEO rewrite **yapma**

---

## 10. UX / CRO standartları

Her önemli sayfada: “Neden ZVT’yi arasın?” → net kapsam + güven + tek net CTA.

- Telefon + WhatsApp her zaman erişilebilir (`SITE_CONTACT`)
- Randevu / fiyat hesaplama sürtünmesiz; gereksiz popup yok
- Mobil-first; form validation net
- Güven: gerçek yorum (Maps), gerçek ekip/galeri — uydurma yok
- CTA event’leri: `MarketingEvent` / pazarlama analitik

---

## 11. Güvenlik ve veri koruma

- `.env*` içeriğini okuma/yazdırma/kopyalama yok
- `requireAdminAuth` / cron auth bypass etme
- PII (talep, randevu, abone) log/AGENTS’e dökülmez
- CSP `next.config.ts` içinde; gevşetmeden önce gerekçe
- Seed/default zayıf şifre dokümanlarda geçebilir — üretimde zayıf credential bırakma

---

## 12. Kod değiştirme ve test prosedürü

1. İlgili `AGENTS.md` bölümü + mevcut kodu oku  
2. Minimal diff; çalışan özelliği sebepsiz bozma  
3. `npm run type-check` (+ ilgili script: `seo:autopilot:validate`, legacy redirect test)  
4. SEO/URL değişiminde sitemap + canonical + 301 düşün  
5. Büyük/riskli işlerde önce plan + onay  
6. Kalıcı mimari kararları bu dosyaya kısa not olarak işle (token şişirme)

---

## 13. Önceliklendirme (P0–P3)

| Seviye | Anlam |
|--------|--------|
| **P0** | Erişim, güvenlik, indeks kaybı, iletişim kırığı |
| **P1** | Teknik SEO / otomasyon hatası / kritik CRO kaybı |
| **P2** | İçerik, local, iç link, UX iyileştirme |
| **P3** | Otorite, deneysel, uzun kuyruk genişleme |

Her öneride: fayda · risk · efor · öncelik. Trafik/sıralama garantisi yok.

**Audit snapshot (2026-10-30)**

| ID | Öncelik | Konu |
|----|---------|------|
| A1 | ~~P1~~ | ~~llmsSync EROFS~~ → düzeltildi (skip + `/llms-inventory.txt`) |
| A2 | P1 | NAP/adres: kod “Sarıyer Merkez” vs schema varsayılan lat/lng Zekeriyaköy — GBP ile hizala |
| A3 | P1 | GSC/IndexNow/GBP env’lerinin prod’da dolu olduğu doğrulanmalı (yerelde IndexNow key eksikliği görülmüştü) |
| A4 | ~~P2~~ | ~~Uskumruköy landing~~ → eklendi (`/bolgeler/sariyer/uskumrukoy`) |
| A5 | P2 | Semt×hizmet derin sayfalar yok; kopya üretmeden özgün semt önceliği |
| A6 | P2 | SSS tek sayfa; snippet için hizmet/niyet parçalama değerlendir |
| A7 | P2 | Citation/backlink tracker yok (yalnızca config checklist) |
| A8 | ~~P3~~ | İlçe fiyat: hub CTA (thin URL yok) + galeri SEO; video schema yok (içerik yok) |
| A9 | ~~P3~~ | ~~README 14 vs 16~~ → Next.js 16 notu |

---

## 14. Doğrulanmamış bilgiler / açık sorular

1. GBP canlı NAP, kategoriler, saatler, yorum skoru (panel yok)  
2. Gerçek hizmet verilen / verilmeyen ilçeler listesi (18 ilçe geniş; operasyonel gerçek?)  
3. ~~Uskumruköy resmi kapsamda mı?~~ → Evet; Sarıyer orman içi hattı semt landing eklendi (2026-10-30). 
4. Tam adres satırı (sokak no) var mı yoksa yalnızca ilçe merkezi mi? — GBP panel doğrulaması bekleniyor 
5. Canlı GSC tıklama/gösterim ve Core Web Vitals field data (bu auditte API çağrılmadı) 
6. ~~Bahçe düzenleme ayrı hizmet mi?~~ → Hayır; peyzaj yok. Bahçe kenarı yüzey temizliği villa/dış cephe paketlerine eklenebilir (Uskumruköy FAQ + Sarıyer localSignals). 
7. Site/bina temizliği ayrı hizmet mi yoksa ofis/site altında mı?

---

## 15. Kalıcı kararlar ve güncelleme geçmişi

| Tarih | Karar |
|-------|--------|
| 2026-08 | Blog `-20xx` suffix legacy redirect’ten muaf; Unicode slug → ASCII |
| 2026-08 | SEO Autopilot günlük cron; admin izleme `/admin/seo-autopilot` |
| 2026-08 | `safeRevalidatePath` — script/cron revalidate güvenliği |
| 2026-10-30 | Bu AGENTS.md master anayasa olarak genişletildi; Next.js agent rules korundu |
| 2026-10-30 | Autopilot llmsSync EROFS: runtime no-op + `/llms-inventory.txt` + build-time `llms:inventory` |
| 2026-10-30 | Faz 1 iç link: `RelatedSeoLinks` + `internal-seo-links` (hizmet↔ilçe, programmatic, geo-sss, hub strip) |
| 2026-10-30 | Faz 2: `meta-clamp`, emoji CTR kapatma, Sarıyer/semt derinliği, hizmet content pack |
| 2026-10-30 | Faz 3 GEO/AEO+CRO: NAP schema hizası, `WhyChooseZvt`, sticky Ara/WA/Keşif, harita↔hub, SSS AEO strip, citation tracker notları |
| 2026-10-30 | P3 kapanış: Uskumruköy landing, ilçe fiyat CTA bloğu, galeri SEO, README 16, bahçe=peyzaj değil kararı |
| 2026-10-30 | Blog v6: 100 viral/CTR gündem yazısı, 10/gün drip (31 Eki–9 Kas 2026), tag `otomatik yayın v6` |
| 2026-11-01 | AI backlog: GeoMentionCheck skor kartı, CleaningService schema, TL;DR extract, prompt bank genişleme, v6 köprü sertleştirme, llms↔NAP validate, identity.json |

**Talimat dosyaları:** `CLAUDE.md` → `@AGENTS.md`. `.cursorrules` / `.cursor/rules` projede yok. Tek ana anayasa: bu dosya.

---

## Agent hızlı checklist

- [ ] Site kodu / deploy / push yalnızca açık talepte  
- [ ] NAP ve hizmet iddiası `site-contact` + seed ile uyumlu  
- [ ] Yeni blog/geo slug ASCII + validate  
- [ ] Autopilot partial → önce EROFS/llmsSync  
- [ ] Mahalle sayfası = özgün içerik zorunlu  
- [ ] Secret / PII çıktıya yok  
