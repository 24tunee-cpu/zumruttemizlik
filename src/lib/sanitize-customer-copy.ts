/**
 * Müşteriye görünen HTML’den iç SEO / ajan jargonu temizler.
 * Blog DB içeriği + şablon çıktıları için.
 */
export function sanitizeCustomerFacingHtml(html: string): string {
  if (!html) return html;

  return html
    .replace(/Ads veya organik girenler için CTA:\s*/gi, '')
    .replace(/Ads niyetiyle gelenler için net CTA:\s*/gi, '')
    .replace(/<strong>İç link köprüsü:<\/strong>/gi, '<strong>İlgili sayfalar:</strong>')
    .replace(/Adım adım süreç \(SEO \+ CRO uyumlu\)/gi, 'Adım adım süreç')
    .replace(/Google’da sık aranan niyetler \(bu yazının kapsadığı\)/gi, 'Sık aranan konular')
    .replace(/Google'da sık aranan niyetler \(bu yazının kapsadığı\)/gi, 'Sık aranan konular')
    .replace(/— derinlemesine operasyon notu/gi, '— detaylı notlar')
    .replace(/Önce niyet netliği →/gi, 'Önce ihtiyaç netliği →')
    .replace(/ayrı ince sayfa spam’i yoktur\./gi, 'gereksiz tekrar sayfa yoktur.')
    .replace(/ayrı ince sayfa spam'i yoktur\./gi, 'gereksiz tekrar sayfa yoktur.')
    .replace(/\s*niyetine odaklıdır;/gi, ' konusu içindir;')
    .replace(/abartılı sıralama vaadi yoktur,\s*/gi, '')
    .replace(/Peyzaj mimarisi \/ bahçe düzenleme: yok/gi, 'Bahçe düzenleme: yok')
    .replace(/Yalnız yüzey \(peyzaj yok\)/gi, 'Yalnız yüzey temizliği')
    .replace(/Peyzaj \/ bahçe düzenleme yoktur\./gi, 'Bahçe düzenleme hizmetimiz yoktur.')
    .replace(/Peyzaj\/bahçe düzenleme hizmetimiz yoktur\.?/gi, 'Bahçe düzenleme hizmetimiz yoktur.')
    .replace(/Peyzaj\/bahçe düzenleme yok\.?/gi, 'Bahçe düzenleme yoktur.')
    .replace(/Peyzaj\/bahçe düzenleme/gi, 'Bahçe düzenleme')
    .replace(/Peyzaj dahil mi\?/gi, 'Bahçe düzenleme dahil mi?')
    .replace(/Hayır\. Peyzaj\/bahçe düzenleme hizmetimiz yoktur;/gi, 'Hayır. Bahçe düzenleme hizmetimiz yoktur;')
    .replace(/Hayır\. Peyzaj\/bahçe düzenleme hizmetimiz yoktur\./gi, 'Hayır. Bahçe düzenleme hizmetimiz yoktur.')
    .replace(/·\s*peyzaj yoktur\.?/gi, '.')
    .replace(/peyzaj yoktur\.?/gi, 'bahçe düzenleme hizmetimiz yoktur.')
    .replace(/Peyzaj yoktur\./gi, 'Bahçe düzenleme hizmetimiz yoktur.')
    .replace(/Peyzaj yok\./gi, 'Bahçe düzenleme hizmetimiz yoktur.')
    .replace(/<strong>TL;DR:<\/strong>/gi, '<strong>Özet:</strong>')
    .replace(/\bGBP\b/g, 'Google')
    .replace(/operasyon hattıdır/gi, 'öncelikli hizmet bölgesidir')
    .replace(/doğrulanmış güven sinyalidir\s*—\s*/gi, '')
    .replace(/uydurma müşteri sayısı kullanmıyoruz\.?/gi, '');
}
