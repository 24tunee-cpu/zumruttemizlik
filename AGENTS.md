<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Zümrüt Vadi Temizlik — AGENTS.md (Proje Anayasası)

> Kalıcı çalışma kuralları. Tahmin yazma; doğrulanmamış bilgiyi “açık soru” olarak işaretle.
> Hassas bilgi (şifre, token, `.env` içeriği) bu dosyaya konmaz.
> Son anayasa güncellemesi: 2026-11-04 (GSC/GA4 recovery notu + CTR overrides).

---

## 0. Talimat hiyerarşisi (çatışma çözümü)

Bu dosya **tek ana anayasadır**. Üçüncü taraf Agent Skills (ör. `garrettjsmith/localseoskills`: gbp-optimization, service-area-seo, review-management, …) **yardımcı playbook**tır; öneri üretir, anayasayı **geçersiz kılmaz**.

| Öncelik | Kaynak | Rol |
|--------|--------|-----|
| 1 | Bu `AGENTS.md` + `src/config/site-contact.ts` | NAP, yasaklar, mimari, deploy |
| 2 | `zvt-seo-beast` + SEO/local guardrail rules | Site SEO OS + verified-facts |
| 3 | `zvt-local-seo` + `zvt-garrett-dispatch` | GBP/citation + Garrett router (ücretli MCP kapalı) |
| 4 | `zvt-programmatic-landing` | Semt / ilçe×hizmet kapısı |
| 4b | `zvt-competitor-intel` | Rakip gap (Garrett competitor playbook filtreli) |
| 4c | `zvt-gsc-ops` / `zvt-ga4-ops` / `zvt-change-validate` | GSC/GA kanıt + post-change doğrulama (CSV birinci; ücretli MCP kapalı) |
| 5 | Local SEO Skills (Garrett) | Playbook only — indeks: `.cursor/skills/README.md` |
| 6 | Genel SEO tavsiyesi | En düşük |

**Skill’ler şunları YAPAMAZ / agent uygulamaz:**
- Sahte şube, sahte yorum, uydurma referans, keyword-stuffed işletme adı
- İnce/kopya mahalle veya 18 ilçeye template spam sayfa
- NAP’ı `site-contact` / GBP doğrulaması dışında değiştirme
- Indexing API’yi temizlik URL’leri için önerme; IndexNow’u “Google’a ping” diye sunma
- Çalışan feed/sitemap/WebSub/IndexNow/keşif kodunu “gereksiz” diye silme veya bozma
- Kullanıcı istemeden push, deploy, ücretli MCP (`LocalSEOData` vb.) bağlama veya kredi harcama
- Peyzaj/bahçe düzenleme hizmeti uydurma; bahçe = yüzey temizliği (peyzaj değil)

**Skill’ler şunları YAPABİLİR:** GBP checklist, yorum yanıt taslağı (onaylı), citation listesi, SAB hizmet alanı stratejisi, semt×hizmet için *özgün* brief — uygulama yine anayasa + onay ile.

---

## 1. İşletme ve proje kimliği

| Alan | Doğrulanmış kaynak |
|------|-------------------|
| Marka | Zümrüt Vadi Temizlik (`SITE_CONTACT.companyName`, `llms.txt`) |
| Site | https://www.zumrutvaditemizlik.com |
| Telefon / WA | 0551 925 09 43 (`+905519250943`) — `src/config/site-contact.ts` |
| E-posta | vedatgunenn@gmail.com |
| Adres (GBP=kod) | `Ferahevler, Şen Aydın Sok. No:10, 34457 Sarıyer/İstanbul` — `site-contact.ts` |
| Maps | `https://maps.app.goo.gl/bdbJ7VSdWcWYcKmV7` |
| Öncelik bölge (içerik) | Sarıyer / Zekeriyaköy ağırlıklı; Avrupa Yakası + İstanbul geneli hizmet anlatımı |
| GBP birincil kategori | Temizlik Hizmetleri · saat: 24 saat açık · skor: 4.9 (12 yorum, 2026-11-02) |

**Doğrulandı (2026-11-02):** İşyeri adresi + telefon + 7/24 GBP ile site hizalı.  
**GBP panelinde manuel:** Peyzaj Mimarı ve (yoksa) Tekne temizliği kategorilerini kaldır; açıklamadan peyzaj çıkar.  
Sahte şube, sahte yorum, uydurma referans veya adres **üretilmez**. Peyzaj hizmeti **yok**.

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
- Schema: LocalBusiness/Organization root (`root-schema.ts`), FAQ/Breadcrumb; **AggregateRating JSON-LD yok** (GSC self-serving / parent_node — puan HTML + Maps)
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
| A2 | ~~P1~~ | ~~NAP/adres~~ → GBP Ferahevler No:10 + pin + sameAs hizalandı (2026-11-02) |
| A3 | P1 | Vercel prod (2026-11-02): INDEXNOW + GBP Place/URL/lat-lng + CRON dolu; **eksik:** GSC_*, MAPS_GOOGLE_*, Bing/Apple URL env — `npm run seo:verify-env` |
| A4 | ~~P2~~ | ~~Uskumruköy landing~~ → eklendi (`/bolgeler/sariyer/uskumrukoy`) |
| A5 | ~~P2~~ | ~~Semt×hizmet~~ → `zekeriyakoy-ev-temizligi` + `maslak-ofis-temizligi` (özgün; 2026-11-02) |
| A6 | ~~P2~~ | ~~SSS tek sayfa~~ → `/sss/[topic]` niyet parçalama + hub şerit (2026-11-02) |
| A7 | ~~P2~~ | ~~Citation tracker~~ → admin GEO dizin durumu + MapPlatformListing PATCH (2026-11-02) |
| A8 | ~~P3~~ | İlçe fiyat: hub CTA (thin URL yok) + galeri SEO; video schema yok (içerik yok) |
| A9 | ~~P3~~ | ~~README 14 vs 16~~ → Next.js 16 notu |
| A10 | ~~P1~~ | ~~GSC review parent_node / AggregateRating on Service~~ → scrub + `#business` @id (`c4f3cbb`, `5fdf451`) |
| A11 | ~~P1~~ | ~~Crawl `_rsc` / query noindex / 2024 blog 404~~ → robots+redirect+308 (`9753c85`…`1e82b72`) |
| A12 | P2 | GSC CTR: Sarıyer pair/hub + blog meta (`gsc-ctr-overrides.ts`, `1f463b4`) — 7–14g izle |
| A13 | P2 | GA4 `generate_lead` key event + GBP kategori (Peyzaj/Tekne) — **panel manuel** |
| A14 | P3 | Breadcrumb GSC tespit 45→11 (yeniden işleme); canlı `name` OK — doğrulama bekle |

**Tam “nasıldı / ne yaptık” günlüğü:** [`docs/gsc-ga4-recovery-2026-11-04.md`](docs/gsc-ga4-recovery-2026-11-04.md)

---

## 14. Doğrulanmamış bilgiler / açık sorular

1. ~~GBP NAP/kategori/saat~~ → Doğrulandı 2026-11-02; kategori temizliği (Peyzaj/Tekne) panelde bekliyor  
2. Gerçek hizmet verilen / verilmeyen ilçeler listesi (18 ilçe geniş; operasyonel gerçek?)  
3. ~~Uskumruköy resmi kapsamda mı?~~ → Evet; Sarıyer orman içi hattı semt landing eklendi (2026-10-30). 
4. ~~Tam adres~~ → Ferahevler, Şen Aydın Sok. No:10, 34457 (GBP)  
5. Canlı GSC tıklama/gösterim ve Core Web Vitals field data (bu auditte API çağrılmadı) 
6. ~~Bahçe düzenleme ayrı hizmet mi?~~ → Hayır; peyzaj yok. Bahçe kenarı yüzey temizliği villa/dış cephe paketlerine eklenebilir. GBP’den Peyzaj Mimarı kaldırılmalı. 
7. Site/bina temizliği ayrı hizmet mi yoksa ofis/site altında mı?
8. ~~Admin `SiteSettings.address` footer override~~ → Footer + public API NAP = `site-contact` (2026-11-02 scrub) 
9. Tekne temizliği gerçek hizmet mi? (GBP’de kategori var; sitede yok) 
10. Kuruluş yılı (`foundingDate`) — doğrulanana kadar schema’da yok

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
| 2026-11-02 | Infra hardening: cron timing-safe auth, CI, admin server gate, Upstash rate-limit opsiyonel, health, HSTS/CORS, HomeAndConstructionBusiness schema, Netlify dep kaldırıldı |
| 2026-11-02 | Feed stack: RSS 2.0 + Atom 1.0 + JSON Feed 1.1 (`/feed.xml`, `/atom.xml`, `/feed.json`), autodiscovery, robots sitemap keşfi |
| 2026-11-02 | Keşif sertleştirme: dürüst sitemap lastmod (`sitemap-lastmod`), WebSub hub+ping, galeri image sitemap, IndexNow proxy yedek, discovery-notify |
| 2026-11-02 | Local SEO Skills (Garrett) user-global kuruldu; §0 hiyerarşi + `.cursor/skills/zvt-local-seo` köprü — AGENTS üstün, ücretli MCP varsayılan kapalı |
| 2026-11-02 | A2 kapanış: NAP=GBP Ferahevler Şen Aydın No:10/34457, pin, sameAs Maps URL, llms/identity; Peyzaj kategorisi GBP’de kaldırılacak |
| 2026-11-02 | Local SEO kod paketi: `gbp-links` UTM + Place ID yorum, sticky/footer Harita, citation tracker UI, SSS topic A6, A5 semt×hizmet, soft district claim + localized pair FAQ |
| 2026-11-02 | SEO Beast OS: `.cursor/skills/zvt-seo-beast` + guardrails rule + `trust-signals.ts`; AGENTS §0 hiyerarşi güncellendi |
| 2026-11-02 | Peak skill pack: progressive refs (verified-facts, AEO/GEO, discovery), `zvt-garrett-dispatch`, `zvt-programmatic-landing`, local GBP/citation/review refs |
| 2026-11-02 | Skill pack **smart**: decision-tree, systems-map (Google local+AI+spam), anti-patterns, money-page, CWV; swap-city gate; Whitespark≠AGENTS (GBP name keyword yasak) |
| 2026-11-02 | Gap pass: `gbp-services-copy` + Admin GEO yapıştır, review yanıt/istek, engagement money bridges, `seo:verify-env` / stock-image report, randevu review CTA; A3 kısmi (IndexNow/GBP OK, GSC/Maps/Bing/Apple eksik) |
| 2026-11-02 | `zvt-competitor-intel` skill: rakip gap matrisi + hard-stops; Garrett `local-competitor-analysis` AGENTS filtresi; ücretli MCP kapalı |
| 2026-11-02 | Sarıyer hub CRO (ev temizliği H1/meta + CTA + WhyChoose); trust seed scrub; stok görsel kapısı |
| 2026-11-03–04 | GSC/GA4 recovery: AggregateRating scrub, `_rsc`/Disallow, 2024→2026, CTR overrides, review parent_node sertleştirme; günlük: `docs/gsc-ga4-recovery-2026-11-04.md` |
| 2026-11-04 | Skill pack: `zvt-gsc-ops` + `zvt-ga4-ops` + `zvt-change-validate` (younes/AminForou/MYehia/Garrett/Google GA MCP özü; AGENTS üstün) |

**Talimat dosyaları:** `CLAUDE.md` → `@AGENTS.md`. Skill indeks: `.cursor/skills/README.md`. User-global: Garrett pack + mirrored `zvt-*`. Tek ana anayasa: bu dosya.

---

## Agent hızlı checklist

- [ ] Site kodu / deploy / push yalnızca açık talepte  
- [ ] NAP ve hizmet iddiası `site-contact` + seed ile uyumlu  
- [ ] Homepage / meta / trust → `zvt-seo-beast` + `verified-facts.md` + `trust-signals.ts`  
- [ ] Local SEO isteği → `zvt-garrett-dispatch` (ücretli MCP onaysız yok)  
- [ ] Yeni blog/geo slug ASCII + validate (`seo:gates`)  
- [ ] Autopilot partial → önce EROFS/llmsSync  
- [ ] Mahalle sayfası = özgün içerik zorunlu  
- [ ] Secret / PII çıktıya yok  
- [ ] Üçüncü taraf local SEO skill ≠ anayasa; çatışmada AGENTS  
- [ ] LocalSEOData / ücretli MCP onaysız çağırma / kredi harcama yok  
- [ ] Mevcut feed/sitemap/WebSub/IndexNow yığınını “temizlik” bahanesiyle bozma  
