# ZVT SEO Beast — preflight checklist

Agent: her SEO/homepage/NAP/meta işinin sonunda bu listeyi doldur (veya chat’te özetle).

## Authority
- [ ] `AGENTS.md` §0 / ilgili bölüm okundu
- [ ] GBP/local ise `zvt-local-seo` okundu
- [ ] Garrett skill kullanıldıysa AGENTS ile çelişen öneri **uygulanmadı**

## NAP / entity
- [ ] Değişiklik yalnızca `src/config/site-contact.ts` (veya ondan türeyen)
- [ ] Komponentte hardcoded telefon/adres yok
- [ ] Footer/schema: DB `SiteSettings.address` override riski not edildi

## Trust
- [ ] Rating/yorum sayısı `trust-signals.ts` veya Maps sync
- [ ] `5000+` / uydurma `5.0` / sahte yıl **yok**

## Homepage (eğer dokunulduysa)
- [ ] Tek H1; yerel niyet (Sarıyer/Zekeriyaköy) H1 veya hemen alt satırda
- [ ] Meta clamp + emoji yok
- [ ] StickySeoCtaBar + WhyChooseZvt ve/veya RelatedSeoLinks
- [ ] Kritik güven metni SSR mümkün olduğunca

## Programatik / blog
- [ ] Yeni semt = özgün `NEIGHBORHOOD_LANDINGS`
- [ ] `seo-cannibalization` kontrol
- [ ] `seo:autopilot:validate` (slug işi ise)

## Keşif stack
- [ ] feeds / websub / sitemap-lastmod / IndexNow **bozulmadı**

## Verify
- [ ] `npm run type-check`
- [ ] İlgili: `geo:validate-llms` / `seo:audit-meta` / legacy redirect test

## Exit
- [ ] Push/deploy yalnızca istendiyse
- [ ] Sıralama garantisi verilmedi
