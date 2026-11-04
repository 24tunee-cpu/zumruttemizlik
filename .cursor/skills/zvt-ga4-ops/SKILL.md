---
name: zvt-ga4-ops
description: >-
  ZVT GA4 ops: traffic after click, key events (generate_lead, phone/WA), landing
  conversion, GBP UTM attribution, engagement. Use for Analytics audits, lead
  tracking setup checks, or pairing with GSC. Official Google analytics-mcp
  optional with user approval. AGENTS.md wins; no traffic guarantees.
---

# ZVT GA4 Ops

GA4 = sitede **ne olur** (oturum, olay, dönüşüm). Anahtar kelime → GSC (`zvt-gsc-ops`). Map pack’ten siteye gelmeyen etkileşimler burada yok.

## Otorite / kaynaklar

| Kaynak | Ne |
|--------|-----|
| [googleanalytics/google-analytics-mcp](https://github.com/googleanalytics/google-analytics-mcp) | **Resmî** GA4 MCP (experimental) — report, key events, realtime |
| Garrett `google-analytics-tool` | Local conversion + GBP UTM playbook |
| ZVT kod | `MarketingEventTracker`, `generate_lead`, sticky/CTA `data-source` |

## Veri yolları

1. Kullanıcı GA4 ekran / export  
2. Admin pazarlama analitik (`/admin/pazarlama-analitik`)  
3. (Onay) `analytics-mcp` — credential chat’e yok  

## ZVT key events (doğrulanacak)

| Olay | Beklenti |
|------|----------|
| `generate_lead` | Anahtar etkinlik (yıldız) — telefon/WA/randevu niyeti |
| `phone_click` / tel | Tracking mevcut; key event köprüsü |
| WhatsApp / randevu / fiyat | MarketingEvent + mümkünse GA4 |

Panel: **Veri görüntüleme → Etkinlikler** → `generate_lead` yoksa oluştur / işaretle.

## Workflows

### Para sayfa dönüşümü

1. Landing: `/bolgeler/sariyer*`, `/hizmetler/*`, `/cozumler/*`, `/randevu`, `/fiyat-hesaplama`  
2. Metrik: sessions, engagement rate, key events / conversions  
3. Yüksek trafik düşük dönüşüm → CTA (sticky Ara/WA) — meta değil CRO  
4. Trafik yok → GSC indeks/CTR (`zvt-gsc-ops`)

### Kaynak ayrımı

- Organic Search vs Direct vs Referral  
- GBP: `gbp-links` UTM (`utm_source` / campaign) — yoksa “GBP trafiği” iddiası yok  

### Post-change

Deploy sonrası 24–72s realtime/olay smoke; 7–14g key event trend. Kanıt → `zvt-change-validate`.

## Red flags

- GSC sorgusunu GA4’ten uydurma  
- Dönüşüm kurulmadan “lead arttı” iddiası  
- PII (telefon numarası, form içeriği) log/AGENTS’e dökme  

## Exit

Garanti yok. GA4 gecikmeli işleyebilir; key event işareti panelde manuel kalabilir.
