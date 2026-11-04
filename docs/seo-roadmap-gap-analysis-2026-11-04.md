# SEO yol haritası ↔ ZVT gerçeklik analizi

**Tarih:** 2026-11-04  
**Kaynak yazı:** “Web sitesini uçurmak” tipi genel SEO checklist (teknik / keyword / EEAT / CRO / quick-win)  
**Kanıt tabanı:** `docs/seo-site-audit-2026-11-04.md` (+ fix doğrulama), `docs/gsc-ga4-recovery-2026-11-04.md`, canlı robots/sitemap, kod mimarisi (`AGENTS.md`)  
**Sınır:** Sıralama / trafik / “uçurma” **garantisi yok**. Bu yazıdaki vaat (“tavan”, “zirve”) pazarlama dili; Google resmi olarak satın alınabilir sıralama vaat etmez.

**Skor ölçeği**

| Durum | Anlam |
|--------|--------|
| **Karşılıyor** | Yazıdaki madde site + süreçte somut karşılık var |
| **Kısmen** | Altyapı var; veri/panel/kalite boşluğu sürüyor |
| **Eksik** | Bilinçli yapılmamış veya henüz kanıt yok |

---

## Genel verdict

ZVT, yazının **teknik SEO + local/niyet landing + CTA/CRO** tarafında güçlü bir işletme sitesi iskeletine sahip.  
Yazının **rakip gap (Ahrefs/Semrush), sürekli GSC “2. sayfa” avı, agresif pruning, video/infografik bounce iyileştirmesi** tarafında **kısmen / eksik**.

“Kusursuz / yazıdaki her şeyi %100 karşılıyor” **değil** — ve kusursuz SEO diye bir durum yok. Ama “temel + para sayfa + quick-win CTR” için **ileri seviyede hazır**; asıl kaldıraç artık **GSC verisiyle niyetli güncelleme + GBP + lead ölçümü**, yeni ince sayfa üretmek değil.

Son site audit (1126 URL): teknik High meta kirliliği **düzeltilmiş** (canlı 22 kritik URL: High/Medium/Low **0**, `(sayfa raporu)` **0**).

---

## 1) Teknik SEO — yazı ↔ ZVT

| Yazı maddesi | Durum | Kanıt / not |
|--------------|--------|-------------|
| Core Web Vitals (LCP/CLS/INP) | **Kısmen** | Next Image, Speed Insights/web-vitals yığını var; **field CWV skorları bu auditte ölçülmedi**. “Kusursuz hız” iddiası yok. |
| Tarama / indeks (robots + sitemap) | **Karşılıyor** | Canlı `robots.txt`: admin/api/login/ara + `*_rsc=` Disallow; çoklu Sitemap satırları. `/sitemap.xml` + segmentler 200. |
| Crawl budget israfı | **Kısmen → iyi** | `_rsc` / query gürültüsü recovery’de ele alındı; GSC “Other” tamamen bitti diye iddia yok (yeniden crawl bekler). |
| Duplicate → canonical | **Karşılıyor** | Crawl: para sayfalarda self-canonical; host drift yok. Pair/blog meta sızıntısı (duplicate title) **fixlendi**. |
| Mobil uyumluluk | **Karşılıyor** (varsayım+mimari) | Mobil-first App Router UI + sticky CTA; ayrı Mobile Usability CSV bu turda yok. |
| Soft-404 / HTTP hataları | **Karşılıyor** (son crawl) | 1126 URL’de HTTP 4xx/5xx **0**. |
| Schema hijyeni | **Karşılıyor** | AggregateRating self-serving scrub; GSC parent_node riski kapatıldı. Rich result “artırma” ≠ ranking. |

**Teknik özet:** Yazının “temel” kısmı ZVT’de **büyük ölçüde karşılanıyor**. Eksik olan: **ölçülmüş field CWV raporu** ve GSC indeks kapsamının taze CSV ile teyidi.

---

## 2) Anahtar kelime & rakip analizi

| Yazı maddesi | Durum | Kanıt / not |
|--------------|--------|-------------|
| Search intent (bilgi / ticari / yerel) | **Karşılıyor** | Hub: `/hizmetler`, `/bolgeler/[ilçe]/[hizmet]`, `/cozumler`, blog bilgi, `/randevu` dönüşüm. Tek niyet kuralı `AGENTS`. |
| Long-tail yerel öbekler | **Karşılıyor** | “Sarıyer ev temizliği”, semt×hizmet, fiyat 2026 blogları, geo-sss. |
| Gap analizi (Ahrefs/Semrush) | **Eksik / bilinçli kapalı** | Ücretli MCP varsayılan kapalı. `zvt-competitor-intel` playbook var; **canlı rakip SERP matrisi bu oturumda üretilmedi**. |
| Yüksek hacim vs dönüşüm | **Kısmen** | GSC recovery: blog tık şişmesi, para sayfa zayıf → CTR overrides + money bridge. Güncel CSV yoksa “şu an hangi query 11–20” **bilinmiyor**. |

**Keyword özet:** Stratejik mimari yazıyı karşılıyor; **araçlı gap + taze GSC pozisyon listesi** olmadan “rakiplerde var bizde yok” listesi **eksik**.

---

## 3) İçerik & semantik SEO (E-E-A-T)

| Yazı maddesi | Durum | Kanıt / not |
|--------------|--------|-------------|
| Experience | **Kısmen** | Operasyonel semt notları, Maps yorum köprüsü, galeri; stok görsel riski bilinçli. |
| Expertise | **Kısmen** | Blog’da `author` alanı var; güçlü yazar biyografi / “kim yazdı, neden uzman” katmanı zayıf olabilir. |
| Authoritativeness | **Kısmen** | LocalBusiness/NAP, GBP 4.9·12, citation tracker; backlink otoritesi ölçülmedi. |
| Trustworthiness | **Karşılıyor** (sıkı) | NAP tek kaynak; sahte rating schema yok; trust HTML’de; AGENTS hard-stop. |
| Topic cluster / pillar | **Karşılıyor** | Hizmet hub ↔ ilçe ↔ pair ↔ blog/geo-sss; `RelatedSeoLinks` / silo / iç link OS. |
| Ölçekli ince içerik riski | **Dikkat** | ~648 blog + 251 geo-sss + 151 bölge = geniş envanter. Yazının “pruning” uyarısı burada **geçerli risk**: hepsi “derin uzmanlık” demek değil; autopilot validate + mahalle özgünlük kapısı var. |

**EEAT özet:** Trust + cluster **iyi**. “Yazar biyografisi / kaynak gösterme / her blogda deneyim derinliği” **kısmen**. 648 blog = ölçek riski; yazıdaki pruning ile çelişebilir.

---

## 4) UX / CRO

| Yazı maddesi | Durum | Kanıt / not |
|--------------|--------|-------------|
| Bounce / dwell (video, infografik) | **Kısmen / eksik ölçüm** | Sticky CTA, WhyChoose, GeoExtract var; video/infografik ağırlıklı değil. Bounce GA4’te bu turda raporlanmadı. |
| Net CTA | **Karşılıyor** | Tel / WA / randevu / fiyat hesaplama; `StickySeoCtaBar` para yüzeylerde. |
| Trafiği eyleme çevir | **Kısmen** | Form + MarketingEvent `generate_lead` kodda; **GA4 panel key event** hâlâ manuel açık (recovery A13). |

**CRO özet:** Yazıdaki “net CTA” ZVT’de güçlü. “Bounce’u video ile düşür” **öncelik değil** (local hizmet sitesi için telefon/WA daha doğru).

---

## 5) Quick-win planı — yazı ↔ ZVT

| Yazı adımı | Durum | Kanıt / not |
|------------|--------|-------------|
| 1. GSC 11–20 “low hanging fruit” | **Kısmen** | Skill (`zvt-gsc-ops`) + geçmiş CSV ile CTR/meta işlendi. **Bugün taze 11–20 listesi yok** (CSV klasörü yok). |
| 2. Pruning (ölü sayfa 410/301/birleştir) | **Kısmen** | 2024→2026 blog 308, cannibal kuralları, ince mahalle yasağı. Toplu “ölü blog budama” **yapılmadı** (bilinçli temkin). |
| 3. CTR title/meta | **Karşılıyor** | `gsc-ctr-overrides` + sayfa-raporu scrub + hub absolute title. Canlı doğrulandı. |
| 4. İç link ağı | **Karşılıyor** | RelatedSeoLinks, priority/silo, money bridges. |

---

## 6) Yazının abartılı / tehlikeli kısımları (ZVT filtresi)

| İfade | Gerçek |
|--------|--------|
| “Uçurmak / tavan / zirve” | Vaad değil; ölçülebilir hedef: daha çok nitelikli tık + lead |
| “Kusursuz robots/sitemap” | İyi yapılandırılmış; kusursuz diye abartılmaz |
| Ahrefs/Semrush şart | Faydalı; ücretsiz GSC + manuel SERP de olur; ücretli MCP onaysız yok |
| Her düşük sayfayı sil | Local matriste yanlış budama zarar verir; önce cannibal + intent |
| Daha çok içerik = daha çok trafik | Scaled content abuse riski; AGENTS doorway yasağı |

---

## 7) Son audit ile birleşik skor kartı

| Pillar (yazı) | ZVT skor (0–5) | Son audit ilişkisi |
|---------------|----------------|-------------------|
| Teknik SEO | **4 / 5** | Crawl temiz; CWV field ölçümü eksik (−1) |
| Keyword / gap | **3 / 5** | Mimari var; taze GSC + rakip gap yok (−2) |
| EEAT / semantik | **3.5 / 5** | Trust+cluster iyi; blog ölçek/yazar derinliği (−1.5) |
| UX/CRO | **4 / 5** | CTA güçlü; GA4 key event panel (−1) |
| Quick wins | **4 / 5** | CTR/meta/iç link yapıldı; 11–20 avı taze veri bekler (−1) |

**Ortalama ~3.7 / 5** — “yazıyı büyük ölçüde uygulayan, veri odaklı quick-win’te yarı yolda olan local hizmet sitesi.”

---

## 8) Öncelikli boşluklar (garanti yok)

1. **P1 (panel):** Taze GSC Performans CSV → pozisyon 8–20 para/blog → güncelle + iç link (`zvt-gsc-ops`)  
2. **P1 (panel):** GA4 `generate_lead` key event + GBP kategori temizliği  
3. **P2:** Field CWV (CrUX / Speed Insights) para URL örneklemi  
4. **P2:** Blog pruning aday listesi (0 gösterim / ince / cannibal) — silmeden önce 301 planı  
5. **P3:** Rakip gap matrisi (manuel SERP veya onaylı araç)  

---

## 9) Tek cümlelik cevap

**Evet, siteniz bu yazının “teknik temel + niyetli landing + CTA + CTR quick-win” omurgasını karşılıyor; hayır, “rakip gap + sürekli 2. sayfa avı + CWV kanıtı + agresif pruning + kusursuz EEAT her URL” kısmını tam karşılamıyor — ve yazının “uçurma” vaadi bilimsel bir garanti değil.**
