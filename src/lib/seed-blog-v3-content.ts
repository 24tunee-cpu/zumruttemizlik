/**
 * 100 otomatik zamanlanmış blog v3 — İstanbul Avrupa Yakası odaklı.
 * 25 bölge × 4 yazı (2 fiyat + 2 SEO); slug'lar v1/v2 ile çakışmaz (-avrupa-).
 */
import type { BlogSeedPost } from './seed-blog';
import { ROOM_PRICES, ROOM_OPTIONS, M2_RATES, formatTL } from '@/config/pricing';
import { makePricingPost, type PricingGuideConfig } from './seed-blog-pricing';
import { makeSeoGuidePost, type SeoGuideConfig } from './blog-seo-html';

const IMG_HOME = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200';
const IMG_CONSTRUCTION = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200';
const IMG_MOVE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200';
const IMG_AIRBNB = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200';
const IMG_VILLA = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200';

export type V3Area = {
  slug: string;
  name: string;
  /** Mahalle ise ilçe hub slug'ı */
  parentSlug?: string;
  blurb: string;
};

/** İstanbul Avrupa Yakası — yüksek arama hacimli 25 lokasyon */
export const V3_AVRUPA_AREAS: V3Area[] = [
  { slug: 'sariyer', name: 'Sarıyer', blurb: 'Boğaz hattı, villa ve site konutları' },
  { slug: 'zekeriyakoy', name: 'Zekeriyaköy', parentSlug: 'sariyer', blurb: 'Orman içi villa ve lüks siteler' },
  { slug: 'maslak', name: 'Maslak', parentSlug: 'sariyer', blurb: 'Plaza ve rezidans yoğunluğu' },
  { slug: 'tarabya', name: 'Tarabya', parentSlug: 'sariyer', blurb: 'Sahil ve yalı hattı konutları' },
  { slug: 'bahcekoy', name: 'Bahçeköy', parentSlug: 'sariyer', blurb: 'Orman kenarı site ve villalar' },
  { slug: 'besiktas', name: 'Beşiktaş', blurb: 'Merkezi konum, tarihi apartmanlar' },
  { slug: 'etiler', name: 'Etiler', parentSlug: 'besiktas', blurb: 'Rezidans ve lüks daire segmenti' },
  { slug: 'sisli', name: 'Şişli', blurb: 'İş merkezi ve yoğun konut dokusu' },
  { slug: 'nisantasi', name: 'Nişantaşı', parentSlug: 'sisli', blurb: 'Butik daireler ve alışveriş caddesi' },
  { slug: 'mecidiyekoy', name: 'Mecidiyeköy', parentSlug: 'sisli', blurb: 'Metro kavşağı, yoğun apartman' },
  { slug: 'kagithane', name: 'Kağıthane', blurb: 'Yeni dönüşüm projeleri ve rezidanslar' },
  { slug: 'levent', name: 'Levent', parentSlug: 'kagithane', blurb: 'Finans merkezi ve A+ ofis plazaları' },
  { slug: 'bakirkoy', name: 'Bakırköy', blurb: 'Sahil şeridi ve yoğun site yapısı' },
  { slug: 'atakoy', name: 'Ataköy', parentSlug: 'bakirkoy', blurb: 'Marina hattı ve site kompleksleri' },
  { slug: 'bahcelievler', name: 'Bahçelievler', blurb: 'Aile konutları ve yoğun apartman' },
  { slug: 'eyupsultan', name: 'Eyüpsultan', blurb: 'Tarihi doku ve yeni konut projeleri' },
  { slug: 'bayrampasa', name: 'Bayrampaşa', blurb: 'Merkezi ulaşım ve dönüşüm bölgeleri' },
  { slug: 'gaziosmanpasa', name: 'Gaziosmanpaşa', blurb: 'Yoğun konut ve site yapılaşması' },
  { slug: 'zeytinburnu', name: 'Zeytinburnu', blurb: 'Sanayi dönüşümü ve yeni rezidanslar' },
  { slug: 'fatih', name: 'Fatih', blurb: 'Tarihi yarımada ve kısa konaklama talebi' },
  { slug: 'avcilar', name: 'Avcılar', blurb: 'Üniversite çevresi ve geniş daireler' },
  { slug: 'esenyurt', name: 'Esenyurt', blurb: 'Avrupa Yakası en yoğun konut bölgesi' },
  { slug: 'basaksehir', name: 'Başakşehir', blurb: 'Planlı şehir ve yeni site projeleri' },
  { slug: 'bahcesehir', name: 'Bahçeşehir', parentSlug: 'basaksehir', blurb: 'Göl kenarı site ve aile konutları' },
  { slug: 'beylikduzu', name: 'Beylikdüzü', blurb: 'Deniz manzaralı rezidans ve site yaşamı' },
];

function hubSlug(area: V3Area): string {
  return area.parentSlug ?? area.slug;
}

function bolgeLink(area: V3Area): string {
  const hub = hubSlug(area);
  if (area.parentSlug) {
    return `<a href="/bolgeler/${hub}/${area.slug}">${area.name} temizlik sayfamız</a>`;
  }
  return `<a href="/bolgeler/${area.slug}">${area.name} temizlik sayfamız</a>`;
}

const DEFAULT_FACTORS = [
  'Metrekare, oda sayısı ve tavan yüksekliği',
  'İnşaat/toz kalınlığı ve son temizlikten geçen süre',
  'Cam, balkon, merdiven ve ortak alan kapsamı',
  'Asansör, otopark ve site güvenlik prosedürleri',
  'Hafta içi / hafta sonu randevu saati',
  'Malzeme ve ekipman (profesyonel vs müşteri)',
  'Ekstra işler: silikon artığı, boya lekesi, cam filmi',
  'Tek seferlik vs düzenli bakım sözleşmesi',
];

function insaatPriceRows(): PricingGuideConfig['priceRows'] {
  const r = M2_RATES.insaat;
  return [
    {
      label: '70 m² daire (örnek)',
      range: `${formatTL(70 * r.min)} – ${formatTL(70 * r.max)}`,
      note: 'Standart ince temizlik',
    },
    {
      label: '110 m² daire (örnek)',
      range: `${formatTL(110 * r.min)} – ${formatTL(110 * r.max)}`,
      note: 'Orta yoğunluk toz',
    },
    {
      label: '180 m² villa (örnek)',
      range: `${formatTL(180 * r.min)} – ${formatTL(180 * r.max)}`,
      note: 'Çok katlı / geniş alan',
    },
    {
      label: 'Birim fiyat (m²)',
      range: `${r.min} – ${r.max} TL/m²`,
      note: 'Taban bedel küçük alanlarda geçerli',
    },
  ];
}

function tasinmaPriceRows(): PricingGuideConfig['priceRows'] {
  return ROOM_OPTIONS.map((room) => {
    const [lo, hi] = ROOM_PRICES[room];
    const low = Math.round(lo * 0.95);
    const high = Math.round(hi * 1.05);
    return {
      label: `${room} taşınma temizliği`,
      range: `${formatTL(low)} – ${formatTL(high)}`,
      note: 'Dolap içi + detay kapsam dahil',
    };
  });
}

export function generateV3PricingPosts(): BlogSeedPost[] {
  const posts: BlogSeedPost[] = [];

  for (const area of V3_AVRUPA_AREAS) {
    const hub = hubSlug(area);

    const insaatCfg: PricingGuideConfig = {
      slug: `${area.slug}-avrupa-insaat-sonrasi-temizlik-fiyatlari-2026`,
      title: `${area.name} İnşaat Sonrası Temizlik Fiyatları 2026 | Avrupa Yakası`,
      metaTitle: `${area.name} İnşaat Sonrası Temizlik Fiyatları 2026`,
      metaDesc: `${area.name} inşaat sonrası temizlik 2026 fiyatları: m² birim tablo, villa/daire farkları, toz ve artık temizliği. Ücretsiz keşif — İstanbul Avrupa Yakası.`,
      excerpt: `${area.name} bölgesinde inşaat ve tadilat sonrası temizlik 2026 fiyat rehberi — m² bazlı tahmini aralıklar ve bütçe planlama ipuçları.`,
      image: IMG_CONSTRUCTION,
      tags: [area.slug, 'inşaat sonrası', 'fiyat 2026', 'avrupa yakası', hub],
      serviceName: `${area.name} İnşaat Sonrası Temizlik`,
      serviceSlug: 'insaat-sonrasi-temizlik',
      intro: `${area.name}, İstanbul Avrupa Yakası'nda ${area.blurb} ile inşaat sonrası temizlik talebinin yüksek olduğu bölgelerdendir. 2026 yılında fiyatlar; alan büyüklüğü, toz kalınlığı, cam/merdiven kapsamı ve erişim koşullarına göre belirlenir.`,
      priceRows: insaatPriceRows(),
      priceUnitNote: `${area.name} yeni teslim dairelerde gelişmiş site güvenliği ve yük asansörü koşulları operasyon süresini etkileyebilir; keşifte netleştirilir.`,
      factors: [
        ...DEFAULT_FACTORS,
        'Seramik/fayans artığı ve silikon kalıntıları',
        'Pencere ve balkon camı sayısı',
        'Merdiven sahanlık ve ortak alan payı',
      ],
      packages: [
        {
          name: 'İnce temizlik',
          desc: 'Toz alma, zemin, mutfak/banyo yüzey, cam (iç).',
          priceHint: 'Tablo alt–orta band',
        },
        {
          name: 'Detay + teslim',
          desc: 'Dolap içi, priz/anahtar detayı, cam ve balkon.',
          priceHint: 'Tablo orta–üst band',
        },
        {
          name: 'Villa / dubleks',
          desc: 'Çok katlı, merdiven ve geniş cam cephe.',
          priceHint: 'Keşif ile özel teklif',
        },
      ],
      regionalNote: `${area.name} bölgesinde ${area.blurb}. Zümrüt Vadi Temizlik, Sarıyer–Zekeriyaköy hattından Avrupa Yakası geneline ekip yönlendirir. Detay için ${bolgeLink(area)}.`,
      faq: [
        {
          q: `${area.name} inşaat sonrası temizlik ne kadar sürer?`,
          a: '70–120 m² dairelerde genelde 1–2 gün; villa ve yoğun tozda süre uzar. Keşifte net plan verilir.',
        },
        {
          q: 'Müteahhit teslim standardı ile profesyonel fark nedir?',
          a: 'Profesyonel paket dolap içi, cam detayı ve yaşanabilir teslim standardını hedefler; yazılı kapsam karşılaştırması yapın.',
        },
        {
          q: 'Fiyat m² mi paket mi hesaplanır?',
          a: 'Önce m² referans alınır; küçük alanlarda minimum iş bedeli devreye girebilir.',
        },
        {
          q: 'Aynı hafta içinde randevu alınabilir mi?',
          a: 'Yoğunluğa bağlıdır; WhatsApp veya randevu formu ile müsaitlik sorulabilir.',
        },
      ],
      extraSections: [
        {
          heading: `${area.name} için inşaat sonrası bütçe ipuçları`,
          paragraphs: [
            'Tadilat biter bitmez “sadece süpürme” ile yetinmek, sonradan cam ve dolap içi için ek maliyet doğurur. İlk seferde kapsamı geniş tutmak genelde daha ekonomiktir.',
            `${area.name} yeni projelerinde site yönetimi çalışma saati kısıtı uygulayabilir; keşifte giriş kartı ve yük asansörü rezervasyonu planlanmalıdır.`,
          ],
        },
      ],
    };
    posts.push(makePricingPost(insaatCfg));

    const tasinmaCfg: PricingGuideConfig = {
      slug: `${area.slug}-avrupa-tasinma-temizligi-fiyatlari-2026`,
      title: `${area.name} Taşınma Temizliği Fiyatları 2026 | Eski & Yeni Ev`,
      metaTitle: `${area.name} Taşınma Temizliği Fiyatları 2026`,
      metaDesc: `${area.name} taşınma öncesi/sonrası temizlik 2026: daire tipine göre fiyat tablosu, depozito ve teslim ipuçları. Avrupa Yakası hızlı randevu.`,
      excerpt: `${area.name} taşınma temizliği 2026 fiyat rehberi — eski evden çıkış, yeni eve giriş ve depozito odaklı kapsam önerileri.`,
      image: IMG_MOVE,
      tags: [area.slug, 'taşınma temizliği', 'fiyat 2026', 'avrupa yakası', hub],
      serviceName: `${area.name} Taşınma Temizliği`,
      serviceSlug: 'ev-temizligi',
      intro: `Taşınma dönemi ${area.name} ve Avrupa Yakası genelinde en yoğun temizlik taleplerinden biridir. Eski evden çıkış (depozito), yeni eve giriş veya çift uçlu paket; daire tipi ve kapsama göre 2026 fiyatları değişir.`,
      priceRows: tasinmaPriceRows(),
      priceUnitNote: `${area.name} bölgesinde asansörsüz binalar ve sokak parkı kısıtları ek süre ve ekip ihtiyacı doğurabilir.`,
      factors: DEFAULT_FACTORS,
      packages: [
        {
          name: 'Çıkış (depozito)',
          desc: 'Dolap içi, buzdolabı, banyo kireç, zemin.',
          priceHint: 'Standart daire bandı',
        },
        {
          name: 'Giriş (yeni ev)',
          desc: 'Toz, zemin, mutfak/banyo hijyen, cam.',
          priceHint: 'Standart–geniş kapsam',
        },
        {
          name: 'Çift uçlu paket',
          desc: 'Aynı gün veya ardışık iki adres.',
          priceHint: 'Ayrı tekliflerden avantajlı',
        },
      ],
      regionalNote: `${area.name}: ${area.blurb}. Taşınma hafta sonları yoğundur; erken randevu önerilir. Bölgesel hizmet detayı için ${bolgeLink(area)}.`,
      faq: [
        {
          q: `${area.name} depozito iadesi için hangi kapsam gerekir?`,
          a: 'Mutfak/banyo derin temizlik, dolap içleri, buzdolabı ve zemin standart beklentidir; sözleşmedeki maddeyi kontrol edin.',
        },
        {
          q: 'Taşınma günü aynı anda temizlik yapılır mı?',
          a: 'Mobilya boşaltıldıktan sonra idealdir; eşya varken kısmi temizlik planlanabilir.',
        },
        {
          q: 'Fiyat hesaplama aracı kullanılabilir mi?',
          a: 'Evet, <a href="/fiyat-hesaplama">online fiyat hesaplama</a> tahmini aralık verir; kesin teklif keşifte netleşir.',
        },
      ],
    };
    posts.push(makePricingPost(tasinmaCfg));
  }

  return posts;
}

export function generateV3SeoPosts(): BlogSeedPost[] {
  const posts: BlogSeedPost[] = [];

  for (const area of V3_AVRUPA_AREAS) {
    const hub = hubSlug(area);

    const airbnbCfg: SeoGuideConfig = {
      slug: `${area.slug}-avrupa-airbnb-kisa-konaklama-temizlik-rehberi-2026`,
      title: `${area.name} Airbnb Temizlik Rehberi 2026 | 5 Yıldız Checklist`,
      metaTitle: `${area.name} Airbnb Temizlik Rehberi 2026`,
      metaDesc: `${area.name} Airbnb ve kısa konaklama temizliği 2026: misafir çıkış checklist, linen standardı, fotoğraflı kontrol. Avrupa Yakası profesyonel destek.`,
      excerpt: `${area.name} kısa konaklama evleri için Airbnb temizlik checklist — yorum puanını yükselten adımlar ve turnaround süre ipuçları.`,
      image: IMG_AIRBNB,
      category: 'Kısa Konaklama',
      tags: [area.slug, 'airbnb', 'kısa konaklama', 'avrupa yakası', hub, '2026'],
      districtName: area.name,
      districtSlug: hub,
      topicLabel: 'Airbnb ve kısa konaklama temizliği',
      serviceSlug: 'ev-temizligi',
      serviceName: 'Ev Temizliği',
      intro: `${area.name}, İstanbul Avrupa Yakası'nda kısa konaklama talebinin arttığı bölgelerden biridir (${area.blurb}). Misafir çıkışından sonraki 2–4 saatlik turnaround, yorum puanını doğrudan etkiler.`,
      sections: [
        {
          heading: 'Misafir çıkışı sonrası 90 dakikalık plan',
          paragraphs: [
            `${area.name} dairelerinde önce banyo ve mutfak dezenfeksiyonu, ardından yatak/linen ve zemin kontrolü yapılmalıdır.`,
            'Fotoğraflı “before/after” klasörü, ev sahibi ile temizlik ekibi arasında uyuşmazlığı azaltır.',
          ],
          bullets: [
            'Çarşaf ve havlu değişimi (hotel standardı)',
            'Banyo: küvet/duşakabin, tuvalet, ayna lekesiz',
            'Mutfak: ocak, mikrodalga, buzdolabı içi kontrol',
            'Zemin ve halı: koku ve leke taraması',
            'Çöp boşaltma ve temel malzeme stok kontrolü',
          ],
        },
        {
          heading: `${area.name} için sık yapılan Airbnb hataları`,
          paragraphs: [
            'Sadece “görünür alan” temizliği yapıp dolap içi ve yatak altını atlamak, misafir şikayetinin bir numaralı sebebidir.',
            'Fatih ve sahil hatlarında nem/koku kontrolü ekstra önem taşır; havalandırma süresi plana dahil edilmelidir.',
          ],
        },
        {
          heading: 'Profesyonel turnover paketi ne içerir?',
          paragraphs: [
            'Yazılı checklist, sabit ekip ve aynı gün slot garantisi (yoğunluğa bağlı) kurumsal kısa konaklama yönetimini kolaylaştırır.',
            `<a href="/cozumler/ev-temizligi">Ev temizliği çözüm sayfamız</a> düzenli turnover için paket seçeneklerini özetler.`,
          ],
        },
      ],
      faq: [
        {
          q: `${area.name} Airbnb temizliği ne sıklıkla yapılmalı?`,
          a: 'Her misafir çıkışında; yoğun sezonda günde birden fazla slot gerekebilir.',
        },
        {
          q: 'Linens ve malzeme kim sağlar?',
          a: 'Ev sahibi stok tutar; ekip değişim ve yerleştirme yapar. Sözleşmede netleştirin.',
        },
        {
          q: 'Acil checkout temizliği mümkün mü?',
          a: 'Yoğunluğa bağlı; WhatsApp hattından aynı gün müsaitlik sorulabilir.',
        },
      ],
    };
    posts.push(makeSeoGuidePost(airbnbCfg));

    const villaCfg: SeoGuideConfig = {
      slug: `${area.slug}-avrupa-villa-site-temizlik-rehberi-2026`,
      title: `${area.name} Villa & Site Temizlik Rehberi 2026 | Avrupa Yakası`,
      metaTitle: `${area.name} Villa Site Temizliği 2026`,
      metaDesc: `${area.name} villa ve site temizliği 2026: bahçe sınırı, ortak alan, dubleks ve güvenlik prosedürleri. Sarıyer–Avrupa Yakası uzman rehber.`,
      excerpt: `${area.name} villa ve site konutları için temizlik rehberi — bahçe, garaj, ortak alan ve güvenlik girişi ipuçları.`,
      image: IMG_VILLA,
      category: 'Villa & Site',
      tags: [area.slug, 'villa', 'site', 'avrupa yakası', hub, '2026'],
      districtName: area.name,
      districtSlug: hub,
      topicLabel: 'Villa ve site temizliği',
      serviceSlug: 'ev-temizligi',
      serviceName: 'Ev Temizliği',
      intro: `${area.name} bölgesinde ${area.blurb}; villa, dubleks ve kapalı site konutlarında standart daire temizliğinden farklı kapsam gerekir. Bahçe sınırı, garaj, merdiven ve geniş cam yüzeyler planlamayı etkiler.`,
      sections: [
        {
          heading: 'Villa ve site için kapsam farkları',
          paragraphs: [
            'Çok katlı yapılarda merdiven, korkuluk ve cam cephe her katta ayrı planlanmalıdır.',
            `${area.name} sitelerinde güvenlik giriş kartı ve yük asansörü rezervasyonu randevu öncesi paylaşılmalıdır.`,
          ],
          bullets: [
            'Bahçe/teras: yaprak, cam masalar (kapsam dışı bırakılabilir)',
            'Garaj ve depo alanı',
            'Ortak merdiven payı (site kurallarına göre)',
            'Geniş mutfak adası ve ankastre set',
            'Şömine çevresi ve yüksek tavan toz',
          ],
        },
        {
          heading: `${area.name} bölgesel operasyon notları`,
          paragraphs: [
            `Sarıyer, Zekeriyaköy ve Tarabya hattında villa yoğunluğu yüksektir; ${area.name} için de benzer erişim ve otopark planlaması önerilir.`,
            'Kış aylarında ıslak zemin ve bahçe geçişi için ek paspas/koruma talep edilebilir.',
          ],
        },
        {
          heading: 'Düzenli bakım vs tek seferlik derin temizlik',
          paragraphs: [
            'Haftalık hafif + aylık derin temizlik kombinasyonu, villa maliyetini uzun vadede düşürür.',
            `<a href="/fiyat-hesaplama">Fiyat hesaplama aracı</a> ile tahmini bütçe görülebilir; villa için keşif şarttır.`,
          ],
        },
      ],
      faq: [
        {
          q: `${area.name} villa temizliği fiyatı neden daireden yüksek?`,
          a: 'Metrekare, kat sayısı, cam ve bahçe/teras kapsamı süreyi artırır; m² veya keşif bazlı teklif verilir.',
        },
        {
          q: 'Site yönetimi ek kural koyarsa ne olur?',
          a: 'Çalışma saatleri ve gürültü kısıtı operasyonu etkiler; randevu öncesi site yönetimine bilgi verin.',
        },
        {
          q: 'Zümrüt Vadi hangi Avrupa bölgelerine bakıyor?',
          a: 'Sarıyer ve Zekeriyaköy merkezli; Beşiktaş, Şişli, Kağıthane, Bakırköy ve Avrupa Yakası genelinde hizmet veriyoruz.',
        },
      ],
    };
    posts.push(makeSeoGuidePost(villaCfg));
  }

  return posts;
}

export function generateAllV3Posts(): { seo: BlogSeedPost[]; pricing: BlogSeedPost[] } {
  return {
    seo: generateV3SeoPosts(),
    pricing: generateV3PricingPosts(),
  };
}
