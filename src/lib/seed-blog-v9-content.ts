/**
 * 100 v9 CTR / hook blog — Ads (koltuk + inşaat) destekli, marka-güvenli clickbait.
 * Direkt yayın (drip yok). Üretilir: node scripts/generate-v9-ctr-blog-content.mjs
 */
import type { BlogSeedPost } from './seed-blog';
import { makePricingGuidePost, type PricingGuideConfig } from './blog-commercial-html';

const IMG = {
  "home": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200",
  "office": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
  "sofa": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200",
  "carpet": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200",
  "window": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200",
  "build": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200",
  "villa": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
  "city": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200"
} as const;
const SERVICE = {
  "ev": {
    "href": "/hizmetler/ev-temizligi",
    "label": "Ev temizliği"
  },
  "ofis": {
    "href": "/hizmetler/ofis-temizligi",
    "label": "Ofis temizliği"
  },
  "insaat": {
    "href": "/hizmetler/insaat-sonrasi-temizlik",
    "label": "İnşaat sonrası temizlik"
  },
  "koltuk": {
    "href": "/hizmetler/koltuk-yikama",
    "label": "Koltuk yıkama"
  },
  "hali": {
    "href": "/hizmetler/hali-yikama",
    "label": "Halı yıkama"
  },
  "cam": {
    "href": "/hizmetler/cam-temizligi",
    "label": "Cam temizliği"
  },
  "cephe": {
    "href": "/hizmetler/dis-cephe-temizligi",
    "label": "Dış cephe temizliği"
  }
} as const;
const AREA = {
  "sariyer": {
    "href": "/bolgeler/sariyer",
    "label": "Sarıyer temizlik"
  },
  "zeker": {
    "href": "/bolgeler/sariyer/zekeriyakoy",
    "label": "Zekeriyaköy temizlik"
  },
  "maslak": {
    "href": "/bolgeler/sariyer/maslak",
    "label": "Maslak temizlik"
  },
  "tarabya": {
    "href": "/bolgeler/sariyer/tarabya",
    "label": "Tarabya temizlik"
  },
  "bahce": {
    "href": "/bolgeler/sariyer/bahcekoy",
    "label": "Bahçeköy temizlik"
  },
  "uskum": {
    "href": "/bolgeler/sariyer/uskumrukoy",
    "label": "Uskumruköy temizlik"
  },
  "sisli": {
    "href": "/bolgeler/sisli",
    "label": "Şişli temizlik"
  },
  "besiktas": {
    "href": "/bolgeler/besiktas",
    "label": "Beşiktaş temizlik"
  },
  "kadikoy": {
    "href": "/bolgeler/kadikoy",
    "label": "Kadıköy temizlik"
  },
  "umraniye": {
    "href": "/bolgeler/umraniye",
    "label": "Ümraniye temizlik"
  },
  "atasehir": {
    "href": "/bolgeler/atasehir",
    "label": "Ataşehir temizlik"
  },
  "bakirkoy": {
    "href": "/bolgeler/bakirkoy",
    "label": "Bakırköy temizlik"
  },
  "kagithane": {
    "href": "/bolgeler/kagithane",
    "label": "Kağıthane temizlik"
  },
  "uskudar": {
    "href": "/bolgeler/uskudar",
    "label": "Üsküdar temizlik"
  },
  "maltepe": {
    "href": "/bolgeler/maltepe",
    "label": "Maltepe temizlik"
  },
  "kartal": {
    "href": "/bolgeler/kartal",
    "label": "Kartal temizlik"
  },
  "pendik": {
    "href": "/bolgeler/pendik",
    "label": "Pendik temizlik"
  },
  "fatih": {
    "href": "/bolgeler/fatih",
    "label": "Fatih temizlik"
  },
  "eyup": {
    "href": "/bolgeler/eyupsultan",
    "label": "Eyüpsultan temizlik"
  },
  "zeytinburnu": {
    "href": "/bolgeler/zeytinburnu",
    "label": "Zeytinburnu temizlik"
  }
} as const;

export type V9Topic = {
  slug: string;
  title: string;
  keyword: string;
  category: string;
  hook: string;
  audience: string;
  durationHint: string;
  service: keyof typeof SERVICE;
  area: keyof typeof AREA;
  image: keyof typeof IMG;
  compareNote: string;
  priceFactors: string[];
  scenarios: string[];
  scopeIn: string[];
  scopeOut: string[];
  steps: string[];
  mistakes: string[];
  priceNote: string;
  faq: Array<{ q: string; a: string }>;
  tags: string[];
};

const TOPICS: V9Topic[] = [
  {
    "slug": "sariyer-koltuk-yikama-kimse-soylemiyor-2026",
    "title": "Sarıyer Koltuk Yıkama: Kimse Söylemiyor (2026)",
    "keyword": "Sarıyer koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Yerinde yıkamada kuruma süresi ve kumaş tipi fiyatı belirler; “sabit ucuz” vaadi yanıltıcıdır.",
    "audience": "Sarıyer",
    "durationHint": "Birkaç saat+kuruma",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Platform fiyatı ile keşif teklifi farklıdır.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Sarıyer koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Sarıyer koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "sarıyer",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "koltuk-yikama-fiyatlari-sok-mu-gercek-2026",
    "title": "Koltuk Yıkama Fiyatları Şok mu? Gerçek Tablo 2026",
    "keyword": "koltuk yıkama fiyatları",
    "category": "CTR Hook",
    "hook": "Tekli, köşe ve takım fiyatları aynı kalemde toplanmaz; adet ve leke ayrı yazılır.",
    "audience": "Fiyat arayan",
    "durationHint": "Takıma göre",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "m² değil parça/takım mantığı hâkimdir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "koltuk yıkama fiyatları için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "koltuk yıkama fiyatları ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "fiyat",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "yerinde-koltuk-yikama-yapmadan-once-2026",
    "title": "Yerinde Koltuk Yıkama Yapmadan Önce Bunu Okuyun",
    "keyword": "yerinde koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Ev tipi agresif kimyasal kumaşı bozabilir; profesyonel ürün + vakum şarttır.",
    "audience": "Ev sahipleri",
    "durationHint": "Takıma göre",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Atölye taşıma ile yerinde farklı senaryodur.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "yerinde koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "yerinde koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "yerinde",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "1-hatayla-koltuk-kumasini-mahvedersiniz-2026",
    "title": "1 Hatayla Koltuk Kumaşını Mahvedersiniz (2026)",
    "keyword": "koltuk kumaş yıkama hatası",
    "category": "CTR Hook",
    "hook": "Yanlış solvent ve aşırı ıslatma renk solması ve çekme riski yaratır.",
    "audience": "DIY denemiş",
    "durationHint": "Lokal/takım",
    "service": "koltuk",
    "area": "kadikoy",
    "image": "sofa",
    "compareNote": "Garanti her lekeyi %100 çıkarmak değildir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "koltuk kumaş yıkama hatası için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "koltuk kumaş yıkama hatası ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "hata",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "zekeriyakoy-koltuk-yikama-villa-dikkat-2026",
    "title": "Zekeriyaköy Koltuk Yıkama: Villa Sahipleri Dikkat",
    "keyword": "Zekeriyaköy koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Villa erişimi ve kuruma alanı randevu gününe yazılmalı; peyzaj dahil değildir.",
    "audience": "Villa",
    "durationHint": "Keşif",
    "service": "koltuk",
    "area": "zeker",
    "image": "sofa",
    "compareNote": "Apartman kısa turundan süre farkı olabilir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Zekeriyaköy koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Zekeriyaköy koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "zekeriyaköy",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kose-koltuk-yikama-ucreti-neden-yuksek-2026",
    "title": "Köşe Koltuk Yıkama Ücreti Neden Yüksek? 2026",
    "keyword": "köşe koltuk yıkama ücreti",
    "category": "CTR Hook",
    "hook": "L/köşe takımda yüzey ve minder sayısı tek kanepeden fazladır.",
    "audience": "Köşe takım",
    "durationHint": "Yarım gün+",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Tekli fiyatı çarpı 3 diye hesaplanmaz.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "köşe koltuk yıkama ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "köşe koltuk yıkama ücreti ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "köşe",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "deri-mi-kumas-mi-koltuk-yikama-2026",
    "title": "Deri mi Kumaş mı? Koltuk Yıkama Kararı 2026",
    "keyword": "deri kumaş koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Deri ve kumaş farklı ürün ister; tek şampuanla ikisi birden risklidir.",
    "audience": "Karar",
    "durationHint": "Tipe göre",
    "service": "koltuk",
    "area": "besiktas",
    "image": "sofa",
    "compareNote": "Nubuk/hassas yüzeyde keşif şart.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "deri kumaş koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "deri kumaş koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "deri",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "koltuk-leke-cikarma-garanti-mi-2026",
    "title": "Koltuk Leke Çıkarma Garanti mi? Net Cevap 2026",
    "keyword": "koltuk leke çıkarma",
    "category": "CTR Hook",
    "hook": "Leke tipi ve yaşı başarıyı belirler; çıkmayacak leke önceden söylenir.",
    "audience": "Leke",
    "durationHint": "Lokal+",
    "service": "koltuk",
    "area": "sisli",
    "image": "sofa",
    "compareNote": "Kalıcı mürekkep/boya için boş vaat yok.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "koltuk leke çıkarma için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "koltuk leke çıkarma ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "leke",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "evcil-hayvan-koltuk-koku-yikama-2026",
    "title": "Evcil Hayvan Koltuk Kokusu: Yıkama İşe Yarar mı?",
    "keyword": "koltuk koku giderme",
    "category": "CTR Hook",
    "hook": "Pet koku turu ek süre doğurabilir; tek yıkamada mucize iddiası yok.",
    "audience": "Pet",
    "durationHint": "Ek süre",
    "service": "koltuk",
    "area": "kagithane",
    "image": "sofa",
    "compareNote": "Halı ayrı paketlenebilir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "koltuk koku giderme için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "koltuk koku giderme ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "pet",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "maslak-koltuk-yikama-rezidans-2026",
    "title": "Maslak Koltuk Yıkama: Rezidans İçin Kısa Rehber",
    "keyword": "Maslak koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Site/rezidans giriş ve otopark notu randevuyu hızlandırır.",
    "audience": "Maslak",
    "durationHint": "Takıma göre",
    "service": "koltuk",
    "area": "maslak",
    "image": "sofa",
    "compareNote": "Plaza ofis paketiyle karıştırılmaz.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Maslak koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Maslak koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "maslak",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "tarabya-koltuk-yikama-randevu-ipuclari-2026",
    "title": "Tarabya Koltuk Yıkama Randevu İpuçları 2026",
    "keyword": "Tarabya koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Boğaz hattında trafik slot seçimini etkiler; sabah genelde verimlidir.",
    "audience": "Tarabya",
    "durationHint": "Birkaç saat",
    "service": "koltuk",
    "area": "tarabya",
    "image": "sofa",
    "compareNote": "Aynı gün garanti değildir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Tarabya koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Tarabya koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "tarabya",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bahcekoy-koltuk-yikama-orman-hatti-2026",
    "title": "Bahçeköy Koltuk Yıkama: Orman Hattı Notları",
    "keyword": "Bahçeköy koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Erişim ve villa tipi takım keşifte netleşir.",
    "audience": "Bahçeköy",
    "durationHint": "Keşif",
    "service": "koltuk",
    "area": "bahce",
    "image": "sofa",
    "compareNote": "Peyzaj/bahçe düzenleme yok.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Bahçeköy koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Bahçeköy koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "bahçeköy",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "istinye-koltuk-yikama-fiyat-hook-2026",
    "title": "İstinye Koltuk Yıkama Fiyatı: Ne Beklemeli?",
    "keyword": "İstinye koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Parça adedi + leke yaşı teklifi şekillendirir; online tahmin sonrası teyit.",
    "audience": "İstinye",
    "durationHint": "Takıma göre",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Sabit internet fiyatı yanıltıcı olabilir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "İstinye koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "İstinye koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "istinye",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "yenikoy-koltuk-yikama-yerinde-2026",
    "title": "Yeniköy’de Yerinde Koltuk Yıkama: 2026 Özet",
    "keyword": "Yeniköy koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Yerinde servis taşımayı kaldırır; kuruma planı şart.",
    "audience": "Yeniköy",
    "durationHint": "Kuruma dahil plan",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Atölye modeliyle süre farklıdır.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Yeniköy koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Yeniköy koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "yeniköy",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "uskumrukoy-koltuk-yikama-2026-hook",
    "title": "Uskumruköy Koltuk Yıkama: Erken Rezervasyon Neden?",
    "keyword": "Uskumruköy koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Orman içi hattında rota planı randevuyu etkiler.",
    "audience": "Uskumruköy",
    "durationHint": "Keşif",
    "service": "koltuk",
    "area": "uskum",
    "image": "sofa",
    "compareNote": "Kış erişiminde sabah tercih edilir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Uskumruköy koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Uskumruköy koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "uskumruköy",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "buharli-koltuk-yikama-gerekiyor-mu-2026",
    "title": "Buharlı Koltuk Yıkama Gerekiyor mu? 2026",
    "keyword": "buharlı koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Hassas kumaşta buhar tercih edilebilir; her kumaşa aynı yöntem yok.",
    "audience": "Hassas kumaş",
    "durationHint": "Tipe göre",
    "service": "koltuk",
    "area": "kadikoy",
    "image": "sofa",
    "compareNote": "Sıcak su ekstraksiyonu ile karıştırılmamalı.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "buharlı koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "buharlı koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "buhar",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "koltuk-takimi-yikama-3-2-1-ucret-2026",
    "title": "3+2+1 Koltuk Takımı Yıkama Ücreti 2026",
    "keyword": "koltuk takımı yıkama ücreti",
    "category": "CTR Hook",
    "hook": "Takım paketi tek parça toplamından farklı fiyatlanabilir.",
    "audience": "Salon takımı",
    "durationHint": "Yarım gün",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Minderli/mindersiz farkı yazılır.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "koltuk takımı yıkama ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "koltuk takımı yıkama ücreti ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "takım",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "berjer-yikama-ucreti-kucuk-ama-2026",
    "title": "Berjer Yıkama Ücreti Küçük ama Kritik 2026",
    "keyword": "berjer yıkama ücreti",
    "category": "CTR Hook",
    "hook": "Tekli berjer kısa sürer; leke varsa lokal ek işlem açılır.",
    "audience": "Berjer",
    "durationHint": "1–2 saat",
    "service": "koltuk",
    "area": "besiktas",
    "image": "sofa",
    "compareNote": "Kanepe fiyatıyla karıştırılmaz.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "berjer yıkama ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "berjer yıkama ücreti ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "berjer",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "cekyat-yikama-acmadan-once-2026",
    "title": "Çekyat Yıkama: Açmadan Önce Bunları Bilin",
    "keyword": "çekyat yıkama",
    "category": "CTR Hook",
    "hook": "Mekanizma ve kumaş birlikte değerlendirilir; ıslak bırakılmaz.",
    "audience": "Çekyat",
    "durationHint": "Birkaç saat",
    "service": "koltuk",
    "area": "umraniye",
    "image": "sofa",
    "compareNote": "Yatak yüzeyi ayrı not edilebilir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "çekyat yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "çekyat yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "çekyat",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "koltuk-yikama-kuruma-suresi-gercek-2026",
    "title": "Koltuk Yıkama Kuruma Süresi: Gerçek Aralık 2026",
    "keyword": "koltuk yıkama kuruma süresi",
    "category": "CTR Hook",
    "hook": "Tipik 4–12 saat; ısı, kumaş ve yöntem süreyi değiştirir.",
    "audience": "Kuruma soran",
    "durationHint": "4–12 saat",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Aynı gün oturma her zaman mümkün değildir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "koltuk yıkama kuruma süresi için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "koltuk yıkama kuruma süresi ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "kuruma",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "sariyer-yerinde-koltuk-yikama-teklif-2026",
    "title": "Sarıyer Yerinde Koltuk Yıkama Teklifi Nasıl Alınır?",
    "keyword": "Sarıyer yerinde koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Foto + parça sayısı WhatsApp’ta hızlandırır; kesin rakam keşifle.",
    "audience": "Sarıyer lead",
    "durationHint": "Hızlı brifing",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Eksik bilgi sapmayı büyütür.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Sarıyer yerinde koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Sarıyer yerinde koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "teklif",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "profesyonel-koltuk-yikama-vs-kendin-yap-2026",
    "title": "Profesyonel Koltuk Yıkama vs Kendin Yap 2026",
    "keyword": "profesyonel koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Ekipman + ürün uyumu riski düşürür; saat ücreti tek kriter değildir.",
    "audience": "Karşılaştırma",
    "durationHint": "—",
    "service": "koltuk",
    "area": "kadikoy",
    "image": "sofa",
    "compareNote": "DIY hata maliyeti sık unutulur.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "profesyonel koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "profesyonel koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "diy",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "koltuk-temizleme-mi-yikama-mi-2026",
    "title": "Koltuk Temizleme mi Yıkama mı? Fark Ne?",
    "keyword": "koltuk temizleme",
    "category": "CTR Hook",
    "hook": "Yüzey silme ile derin yıkama aynı şey değildir; niyet net yazılmalı.",
    "audience": "Arama niyeti",
    "durationHint": "Tipe göre",
    "service": "koltuk",
    "area": "sisli",
    "image": "sofa",
    "compareNote": "Leke için derin yıkama gerekir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "koltuk temizleme için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "koltuk temizleme ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "temizleme",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "l-koltuk-yikama-fiyat-hook-2026",
    "title": "L Koltuk Yıkama Fiyatı: Hesabı Böyle Yapın",
    "keyword": "L koltuk yıkama fiyatı",
    "category": "CTR Hook",
    "hook": "L formda ek kanat ve puf ayrıca sayılır.",
    "audience": "L takım",
    "durationHint": "Yarım gün+",
    "service": "koltuk",
    "area": "atasehir",
    "image": "sofa",
    "compareNote": "Standart 3’lü ile kıyas yanıltır.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "L koltuk yıkama fiyatı için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "L koltuk yıkama fiyatı ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "l koltuk",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kumas-koltuk-yikama-renk-solmaz-mi-2026",
    "title": "Kumaş Koltuk Yıkama Renk Solmaz mı?",
    "keyword": "kumaş koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Doğru ürünle solma riski düşer; aşınmış kumaşta beklenti keşifte netleşir.",
    "audience": "Kumaş",
    "durationHint": "Takıma göre",
    "service": "koltuk",
    "area": "bakirkoy",
    "image": "sofa",
    "compareNote": "Eski solma yıkamadan kaynaklanmaz.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "kumaş koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "kumaş koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "kumaş",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "koltuk-yikama-randevu-ayni-gun-2026",
    "title": "Koltuk Yıkama Aynı Gün Olur mu? 2026",
    "keyword": "koltuk yıkama aynı gün",
    "category": "CTR Hook",
    "hook": "Kapasite uygunsa açılır; yoğun günde ertesi gün daha gerçekçidir.",
    "audience": "Acil",
    "durationHint": "Aynı gün?",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Garanti slot değildir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "koltuk yıkama aynı gün için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "koltuk yıkama aynı gün ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "acil",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "koltuk-yikama-firmasi-nasil-secilir-2026",
    "title": "Koltuk Yıkama Firması Nasıl Seçilir? 2026",
    "keyword": "koltuk yıkama firması",
    "category": "CTR Hook",
    "hook": "Yazılı kapsam, ürün uyumu ve kuruma planı sorun; yalnızca fiyata bakmayın.",
    "audience": "Firma seçen",
    "durationHint": "—",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Platform en ucuz = en iyi değildir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "koltuk yıkama firması için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "koltuk yıkama firması ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "firma",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "koltuk-yikama-sirketi-ucretsiz-kesif-2026",
    "title": "Koltuk Yıkama Şirketi + Ücretsiz Keşif Mantığı",
    "keyword": "koltuk yıkama şirketi",
    "category": "CTR Hook",
    "hook": "Keşif satış baskısı değil; kumaş ve leke için bilgi turudur.",
    "audience": "İlk kez",
    "durationHint": "Kısa keşif",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Online tahmin sözleşmeye dönüşmez.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "koltuk yıkama şirketi için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "koltuk yıkama şirketi ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "şirket",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bebekli-ev-koltuk-yikama-hijyen-2026",
    "title": "Bebekli Evde Koltuk Yıkama: Hijyen Notları",
    "keyword": "bebek koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Sık dokunulan yüzey ve kuruma planı önceliklidir; tıbbi sterilizasyon iddiası yok.",
    "audience": "Bebekli aile",
    "durationHint": "Takım+kuruma",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Ürün uyumu önceden sorulur.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "bebek koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "bebek koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "bebek",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "ofis-bekleme-koltuk-yikama-2026",
    "title": "Ofis Bekleme Koltuğu Yıkama: Kısa Rehber",
    "keyword": "ofis koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Plaza/ofis izinleri randevu öncesi alınmalı.",
    "audience": "Ofis",
    "durationHint": "Lokal",
    "service": "koltuk",
    "area": "maslak",
    "image": "sofa",
    "compareNote": "Ev takımı paketinden farklı olabilir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "ofis koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "ofis koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "ofis",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kilyos-koltuk-yikama-yaz-sezonu-2026",
    "title": "Kilyos Koltuk Yıkama: Yaz Sezonu Notu 2026",
    "keyword": "Kilyos koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Sezon yoğunluğunda erken rezervasyon slotu korur.",
    "audience": "Kilyos",
    "durationHint": "Keşif",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Aynı gün garanti değildir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Kilyos koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Kilyos koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "kilyos",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "koltuk-yikama-ne-kadar-tutar-hook-2026",
    "title": "Koltuk Yıkama Ne Kadar Tutar? 30 Sn Cevap",
    "keyword": "koltuk yıkama ne kadar",
    "category": "CTR Hook",
    "hook": "Parça/takım + leke + erişim; net rakam keşif veya foto brifing ile.",
    "audience": "Fiyat",
    "durationHint": "—",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Tek rakam her eve uymaz.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "koltuk yıkama ne kadar için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "koltuk yıkama ne kadar ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "ne kadar",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "koltuk-yikama-ucreti-gizli-maliyet-2026",
    "title": "Koltuk Yıkama Ücreti: Gizli Maliyet Var mı?",
    "keyword": "koltuk yıkama ücreti",
    "category": "CTR Hook",
    "hook": "Yazılı kapsam dışına çıkılmaz; keşif dışı ekstra ayrıca teklif edilir.",
    "audience": "Şeffaflık",
    "durationHint": "—",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Sürpriz ek ücret dili kullanılmaz.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "koltuk yıkama ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "koltuk yıkama ücreti ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "ücret",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "sariyer-koltuk-yikama-fiyatlari-2026-hook",
    "title": "Sarıyer Koltuk Yıkama Fiyatları 2026: Hook Rehber",
    "keyword": "Sarıyer koltuk yıkama fiyatları",
    "category": "CTR Hook",
    "hook": "İlçe + takım tipi birleşince teklif netleşir; platform aralığı yalnızca referanstır.",
    "audience": "Sarıyer",
    "durationHint": "Takıma göre",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "compareNote": "Villa erişimi süreye yansıyabilir.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Sarıyer koltuk yıkama fiyatları için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Sarıyer koltuk yıkama fiyatları ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "fiyat",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kadikoy-koltuk-yikama-tiklanma-2026",
    "title": "Kadıköy Koltuk Yıkama: Tıklanınca Ne Beklenir?",
    "keyword": "Kadıköy koltuk yıkama",
    "category": "CTR Hook",
    "hook": "Randevu, yerinde uygulama, kuruma planı — sırayla ilerler.",
    "audience": "Kadıköy",
    "durationHint": "Takıma göre",
    "service": "koltuk",
    "area": "kadikoy",
    "image": "sofa",
    "compareNote": "Anadolu Yakası planlı rota.",
    "priceFactors": [
      "Takım / parça adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Villa / apartman erişimi"
    ],
    "scenarios": [
      "Tek kanepe + kuruma",
      "Takım (3+1) yarım gün",
      "Leke odaklı lokal",
      "Pet koku ek süre"
    ],
    "scopeIn": [
      "Yerinde yıkama",
      "Kumaşa uygun ürün",
      "Kuruma planı"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Kadıköy koltuk yıkama için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Kadıköy koltuk yıkama ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "kadıköy",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "insaat-sonrasi-temizlik-kimse-anlatmiyor-2026",
    "title": "İnşaat Sonrası Temizlik: Kimse Anlatmıyor (2026)",
    "keyword": "inşaat sonrası temizlik",
    "category": "CTR Hook",
    "hook": "İnce toz turu mobilyadan önce yapılmalı; standart ev paketi yetmez.",
    "audience": "Teslim",
    "durationHint": "m²+sınıf",
    "service": "insaat",
    "area": "sariyer",
    "image": "build",
    "compareNote": "Kaba ve ince aşama farklıdır.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "inşaat sonrası temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "inşaat sonrası temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "inşaat",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "insaat-sonrasi-temizlik-fiyatlari-gercek-2026",
    "title": "İnşaat Sonrası Temizlik Fiyatları: Gerçek Tablo",
    "keyword": "inşaat sonrası temizlik fiyatları",
    "category": "CTR Hook",
    "hook": "Yalnızca m² yetmez; kirlilik sınıfı ve cam/pervaz sayısı kritiktir.",
    "audience": "Fiyat",
    "durationHint": "m²",
    "service": "insaat",
    "area": "sariyer",
    "image": "build",
    "compareNote": "Online tahmin keşifle doğrulanır.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "inşaat sonrası temizlik fiyatları için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "inşaat sonrası temizlik fiyatları ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "fiyat",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kaba-insaat-temizligi-yapmadan-once-2026",
    "title": "Kaba İnşaat Temizliği Yapmadan Önce",
    "keyword": "kaba inşaat temizliği",
    "category": "CTR Hook",
    "hook": "Moloz ve kalın kir sonrası ince toz programı ayrı planlanır.",
    "audience": "Şantiye/teslim",
    "durationHint": "Aşama",
    "service": "insaat",
    "area": "kagithane",
    "image": "build",
    "compareNote": "İnce temizlik aynı gün yetmeyebilir.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "kaba inşaat temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "kaba inşaat temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "kaba",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "ince-insaat-temizligi-neden-sart-2026",
    "title": "İnce İnşaat Temizliği Neden Şart? 2026",
    "keyword": "ince inşaat temizliği",
    "category": "CTR Hook",
    "hook": "Görünmeyen alçı tozu mobilya sonrası kabusa döner.",
    "audience": "Yeni daire",
    "durationHint": "m²",
    "service": "insaat",
    "area": "atasehir",
    "image": "build",
    "compareNote": "Kaba tur yetmez.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "ince inşaat temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "ince inşaat temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "ince",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "tadilat-sonrasi-temizlik-hata-2026",
    "title": "Tadilat Sonrası Temizlik: 5 Pahalı Hata",
    "keyword": "tadilat sonrası temizlik",
    "category": "CTR Hook",
    "hook": "Boya sıçrantısı yanlış ürünle yüzeyi çizer; keşif şart.",
    "audience": "Tadilat",
    "durationHint": "m²",
    "service": "insaat",
    "area": "kadikoy",
    "image": "build",
    "compareNote": "Ustalık işi temizlik değildir.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "tadilat sonrası temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "tadilat sonrası temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "tadilat",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "sifir-daire-temizligi-mobilyadan-once-2026",
    "title": "Sıfır Daire Temizliği: Mobilyadan Önce!",
    "keyword": "sıfır daire temizliği",
    "category": "CTR Hook",
    "hook": "Teslim tozu mobilya altına yerleşmeden çıkarılmalı.",
    "audience": "Yeni teslim",
    "durationHint": "m²",
    "service": "insaat",
    "area": "sariyer",
    "image": "build",
    "compareNote": "Standart ev turu farklıdır.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "sıfır daire temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "sıfır daire temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "sıfır",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "anahtar-teslim-temizlik-ne-demek-2026",
    "title": "Anahtar Teslim Temizlik Ne Demek? 2026",
    "keyword": "anahtar teslim temizlik",
    "category": "CTR Hook",
    "hook": "Oturuma hazır yüzey checklist’i; peyzaj ve inşaat işçiliği yok.",
    "audience": "Teslim",
    "durationHint": "Keşif",
    "service": "insaat",
    "area": "sariyer",
    "image": "build",
    "compareNote": "Müteahhit işi ile karıştırılmaz.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "anahtar teslim temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "anahtar teslim temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "anahtar",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "sariyer-insaat-sonrasi-hook-2026",
    "title": "Sarıyer İnşaat Sonrası: Villa/Daire Farkı",
    "keyword": "Sarıyer inşaat sonrası temizlik",
    "category": "CTR Hook",
    "hook": "Villa m² ve çoklu banyo keşifsiz fiyatı bozar.",
    "audience": "Sarıyer",
    "durationHint": "Keşif",
    "service": "insaat",
    "area": "sariyer",
    "image": "build",
    "compareNote": "Online + keşif ikilisi.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Sarıyer inşaat sonrası temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Sarıyer inşaat sonrası temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "sarıyer",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "zekeriyakoy-insaat-sonrasi-villa-2026",
    "title": "Zekeriyaköy İnşaat Sonrası Villa Temizliği",
    "keyword": "Zekeriyaköy inşaat sonrası",
    "category": "CTR Hook",
    "hook": "Orman/villa hattında erişim ve toz programı yazılır.",
    "audience": "Villa teslim",
    "durationHint": "Keşif",
    "service": "insaat",
    "area": "zeker",
    "image": "build",
    "compareNote": "Peyzaj yoktur.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Zekeriyaköy inşaat sonrası için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Zekeriyaköy inşaat sonrası ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "zekeriyaköy",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "boya-sonrasi-temizlik-sirlar-2026",
    "title": "Boya Sonrası Temizlik: Bilinen Yanlışlar",
    "keyword": "boya sonrası temizlik",
    "category": "CTR Hook",
    "hook": "Sıçrantı + ince toz birlikte planlanır; boya işçiliği dahil değil.",
    "audience": "Boya",
    "durationHint": "m²",
    "service": "insaat",
    "area": "besiktas",
    "image": "build",
    "compareNote": "Asitli ürün risklidir.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "boya sonrası temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "boya sonrası temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "boya",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "badana-sonrasi-toz-temizlik-2026",
    "title": "Badana Sonrası Toz Temizliği 2026",
    "keyword": "badana sonrası temizlik",
    "category": "CTR Hook",
    "hook": "Alçı tozu mikrofiber turu ister; tek süpürme yetmez.",
    "audience": "Badana",
    "durationHint": "m²",
    "service": "insaat",
    "area": "umraniye",
    "image": "build",
    "compareNote": "Ev genelinden ayrı sınıf.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "badana sonrası temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "badana sonrası temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "badana",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "yeni-daire-teslim-temizlik-tikla-2026",
    "title": "Yeni Daire Teslim Temizliği: Tıklayınca Ne Olur?",
    "keyword": "yeni daire teslim temizliği",
    "category": "CTR Hook",
    "hook": "Keşif → yazılı kapsam → ince toz checklist → teslim.",
    "audience": "Teslim alan",
    "durationHint": "m²",
    "service": "insaat",
    "area": "maltepe",
    "image": "build",
    "compareNote": "Mobilya sonrası zorlaşır.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "yeni daire teslim temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "yeni daire teslim temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "teslim",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "ofis-teslim-insaat-temizlik-2026",
    "title": "Ofis Teslim İnşaat Temizliği: Plaza Notu",
    "keyword": "ofis teslim temizliği",
    "category": "CTR Hook",
    "hook": "Güvenlik ve asansör prosedürü mobilya öncesi kritiktir.",
    "audience": "Ofis",
    "durationHint": "m²",
    "service": "insaat",
    "area": "maslak",
    "image": "build",
    "compareNote": "Gece slotu gerekebilir.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "ofis teslim temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "ofis teslim temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "ofis teslim",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kagithane-insaat-sonrasi-hook-2026",
    "title": "Kağıthane İnşaat Sonrası: Yeni Konut Uyarısı",
    "keyword": "Kağıthane inşaat sonrası",
    "category": "CTR Hook",
    "hook": "Yeni stokta ince toz yoğunluğu yüksektir.",
    "audience": "Kağıthane",
    "durationHint": "m²",
    "service": "insaat",
    "area": "kagithane",
    "image": "build",
    "compareNote": "Standart ev yetmeyebilir.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Kağıthane inşaat sonrası için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Kağıthane inşaat sonrası ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "kağıthane",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bahcekoy-insaat-sonrasi-hook-2026",
    "title": "Bahçeköy İnşaat Sonrası Temizlik Hook Rehber",
    "keyword": "Bahçeköy inşaat sonrası",
    "category": "CTR Hook",
    "hook": "Yeni villa/site teslimlerinde toz + cam kalemi ayrı yazılır.",
    "audience": "Bahçeköy",
    "durationHint": "Keşif",
    "service": "insaat",
    "area": "bahce",
    "image": "build",
    "compareNote": "Peyzaj yok.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Bahçeköy inşaat sonrası için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Bahçeköy inşaat sonrası ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "bahçeköy",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "insaat-sonrasi-m2-yalanlari-2026",
    "title": "İnşaat Sonrası m² Yalanları 2026",
    "keyword": "inşaat sonrası m² fiyat",
    "category": "CTR Hook",
    "hook": "Ucuz m² vaadi kirlilik sınıfını gizler; keşif şart.",
    "audience": "Fiyat",
    "durationHint": "m²+sınıf",
    "service": "insaat",
    "area": "sariyer",
    "image": "build",
    "compareNote": "Brüt/net farkı sorun yaratır.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "inşaat sonrası m² fiyat için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "inşaat sonrası m² fiyat ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "m²",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "tadilat-sonrasi-temizlik-fiyatlari-2026-h",
    "title": "Tadilat Sonrası Temizlik Fiyatları Hook 2026",
    "keyword": "tadilat sonrası temizlik fiyatları",
    "category": "CTR Hook",
    "hook": "Kapsam: toz, sıçrantı, ıslak hacim — yazılı olmadan sabit fiyat riskli.",
    "audience": "Tadilat",
    "durationHint": "m²",
    "service": "insaat",
    "area": "sisli",
    "image": "build",
    "compareNote": "Usta işi ayrıdır.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "tadilat sonrası temizlik fiyatları için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "tadilat sonrası temizlik fiyatları ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "fiyat",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "insaat-sonrasi-temizlik-sirketi-sec-2026",
    "title": "İnşaat Sonrası Temizlik Şirketi Seçerken",
    "keyword": "inşaat sonrası temizlik şirketi",
    "category": "CTR Hook",
    "hook": "Checklist, ekipman ve keşif sorun; yalnızca “ucuz ekip” yetmez.",
    "audience": "Firma",
    "durationHint": "—",
    "service": "insaat",
    "area": "sariyer",
    "image": "build",
    "compareNote": "Referans foto gerçek iş olmalı.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "inşaat sonrası temizlik şirketi için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "inşaat sonrası temizlik şirketi ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "şirket",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "insaat-sonrasi-temizlik-firmasi-hook-2026",
    "title": "İnşaat Sonrası Temizlik Firması: 2026 Kontrol",
    "keyword": "inşaat sonrası temizlik firması",
    "category": "CTR Hook",
    "hook": "Sigorta, kapsam yazımı ve teslim kontrolü sorun.",
    "audience": "Firma",
    "durationHint": "—",
    "service": "insaat",
    "area": "sariyer",
    "image": "build",
    "compareNote": "Platform puanı tek başına yetmez.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "inşaat sonrası temizlik firması için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "inşaat sonrası temizlik firması ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "firma",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "istanbul-insaat-sonrasi-temizlik-hook-2026",
    "title": "İstanbul İnşaat Sonrası Temizlik: Odak Sarıyer",
    "keyword": "İstanbul inşaat sonrası temizlik",
    "category": "CTR Hook",
    "hook": "Şehir genelinde aransa da operasyon önceliği Sarıyer hattıdır.",
    "audience": "İstanbul",
    "durationHint": "Keşif",
    "service": "insaat",
    "area": "sariyer",
    "image": "build",
    "compareNote": "Uzak ilçe aynı gün olmayabilir.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "İstanbul inşaat sonrası temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "İstanbul inşaat sonrası temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "istanbul",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "montaj-sonrasi-toz-temizlik-hook-2026",
    "title": "Montaj Sonrası Toz: Küçük İş Büyük Risk",
    "keyword": "montaj sonrası toz temizliği",
    "category": "CTR Hook",
    "hook": "İnce partikül mobilya sonrasında daha pahalıya patlar.",
    "audience": "Montaj",
    "durationHint": "Birkaç saat",
    "service": "insaat",
    "area": "kadikoy",
    "image": "build",
    "compareNote": "İnşaat tesliminden hafif olabilir.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "montaj sonrası toz temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "montaj sonrası toz temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "montaj",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "cam-balkon-montaj-sonrasi-toz-2026",
    "title": "Cam Balkon Montaj Sonrası Toz Temizliği",
    "keyword": "cam balkon sonrası toz",
    "category": "CTR Hook",
    "hook": "Montaj tozu standart cam turundan farklıdır.",
    "audience": "Cam balkon",
    "durationHint": "Keşif",
    "service": "insaat",
    "area": "bakirkoy",
    "image": "build",
    "compareNote": "Cam+toz birlikte planlanabilir.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "cam balkon sonrası toz için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "cam balkon sonrası toz ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "cam balkon",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "insaat-sonrasi-ucretsiz-kesif-neden-2026",
    "title": "İnşaat Sonrası Ücretsiz Keşif Neden Şart?",
    "keyword": "inşaat sonrası ücretsiz keşif",
    "category": "CTR Hook",
    "hook": "Kirlilik sınıfı yerinde görülmeden net fiyat çıkmaz.",
    "audience": "Keşif",
    "durationHint": "15–40 dk",
    "service": "insaat",
    "area": "sariyer",
    "image": "build",
    "compareNote": "Foto bazen yeter; villa’da yerinde daha iyi.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "inşaat sonrası ücretsiz keşif için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "inşaat sonrası ücretsiz keşif ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "keşif",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kaba-vs-ince-insaat-temizlik-2026",
    "title": "Kaba vs İnce İnşaat Temizliği: Hangisi Önce?",
    "keyword": "kaba ince inşaat temizliği",
    "category": "CTR Hook",
    "hook": "Önce kaba, sonra ince; ters sıra maliyeti artırır.",
    "audience": "Aşama",
    "durationHint": "2 aşama",
    "service": "insaat",
    "area": "sariyer",
    "image": "build",
    "compareNote": "Tek pakette birleştirilebilir.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "kaba ince inşaat temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "kaba ince inşaat temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "aşama",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "villa-insaat-sonrasi-temizlik-hook-2026",
    "title": "Villa İnşaat Sonrası Temizlik: Pahalı Hata Listesi",
    "keyword": "villa inşaat sonrası temizlik",
    "category": "CTR Hook",
    "hook": "Çoklu banyo + cam + m² keşifsiz teklifi bozar.",
    "audience": "Villa",
    "durationHint": "Keşif",
    "service": "insaat",
    "area": "zeker",
    "image": "build",
    "compareNote": "Peyzaj dahil değil.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "villa inşaat sonrası temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "villa inşaat sonrası temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "villa",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "sariyer-ev-temizlik-kimse-soylemiyor-2026",
    "title": "Sarıyer Ev Temizliği: Kimse Söylemiyor",
    "keyword": "Sarıyer ev temizliği",
    "category": "CTR Hook",
    "hook": "Villa/daire farkı ve erişim notu fiyatı belirler; peyzaj yoktur.",
    "audience": "Sarıyer",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "compareNote": "Online tahmin keşifle netleşir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Sarıyer ev temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Sarıyer ev temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "sarıyer",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "zekeriyakoy-ev-temizlik-villa-uyari-2026",
    "title": "Zekeriyaköy Ev Temizliği: Villa Uyarısı 2026",
    "keyword": "Zekeriyaköy ev temizliği",
    "category": "CTR Hook",
    "hook": "Kat kat plan ve cam opsiyonu daire paketinden farklıdır.",
    "audience": "Villa",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "zeker",
    "image": "villa",
    "compareNote": "Peyzaj yok.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Zekeriyaköy ev temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Zekeriyaköy ev temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "zekeriyaköy",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "maslak-ofis-temizlik-gece-mi-2026",
    "title": "Maslak Ofis Temizliği Gece mi Gündüz mü?",
    "keyword": "Maslak ofis temizliği",
    "category": "CTR Hook",
    "hook": "Gece slotu mesaiyi bölmez; güvenlik izni maliyeti etkiler.",
    "audience": "Ofis",
    "durationHint": "Gece/akşam",
    "service": "ofis",
    "area": "maslak",
    "image": "office",
    "compareNote": "Frekans birim maliyeti düşürür.",
    "priceFactors": [
      "Ofis m² ve workstation",
      "Frekans (günlük/haftalık/tek)",
      "Mesai dışı / güvenlik izni",
      "Mutfak–çay ocağı",
      "Ortak alan dahil mi?"
    ],
    "scenarios": [
      "Butik ofis akşam turu",
      "Açık ofis gece",
      "Plaza güvenlik prosedürü",
      "Periyodik sözleşme"
    ],
    "scopeIn": [
      "Çalışma yüzeyleri",
      "Mutfak/çay ocağı",
      "Islak hacim",
      "Çöp/zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Maslak ofis temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Maslak ofis temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "maslak",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "tarabya-cam-temizlik-tuz-uyari-2026",
    "title": "Tarabya Cam Temizliği: Tuz Uyarısı 2026",
    "keyword": "Tarabya cam temizliği",
    "category": "CTR Hook",
    "hook": "Boğaz tuzu periyodik bakımı gerektirir; tek sefer yetmeyebilir.",
    "audience": "Tarabya",
    "durationHint": "Cam sayısı",
    "service": "cam",
    "area": "tarabya",
    "image": "window",
    "compareNote": "Yüksek kat keşif şart.",
    "priceFactors": [
      "Cam paneli sayısı",
      "İç / dış erişim",
      "Yükseklik ve güvenlik",
      "Site / yönetici onayı",
      "Tuz–toz (Boğaz hattı)"
    ],
    "scenarios": [
      "Daire iç cam",
      "Cam balkon sonrası",
      "Villa cephe cam",
      "Plaza cam onayı"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Tarabya cam temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Tarabya cam temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "tarabya",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "hali-yikama-mi-koltuk-mu-once-2026",
    "title": "Önce Halı mı Koltuk mu Yıkanır? 2026",
    "keyword": "halı koltuk yıkama sırası",
    "category": "CTR Hook",
    "hook": "Genelde koltuk sonrası halı kuruma alanı çakışmasını azaltır; keşifte planlanır.",
    "audience": "Ev",
    "durationHint": "Plan",
    "service": "hali",
    "area": "sariyer",
    "image": "carpet",
    "compareNote": "Aynı gün her zaman olmaz.",
    "priceFactors": [
      "Halı m²",
      "Leke ve pet notu",
      "Evde yıkama vs taşıma",
      "Kuruma alanı",
      "Kat / asansör"
    ],
    "scenarios": [
      "Küçük kilim",
      "Salon halısı ölçü",
      "Çoklu halı paket",
      "Kalın villa hali"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "halı koltuk yıkama sırası için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "halı koltuk yıkama sırası ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "sıra",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bos-ev-temizlik-depozito-kurtarir-mi-2026",
    "title": "Boş Ev Temizliği Depozitoyu Kurtarır mı?",
    "keyword": "boş ev depozito temizliği",
    "category": "CTR Hook",
    "hook": "Kiracı teslim checklist’i yardımcı olur; emlakçı beklentisi keşifte netleşir.",
    "audience": "Kiracı",
    "durationHint": "Daire",
    "service": "ev",
    "area": "sisli",
    "image": "home",
    "compareNote": "Hukuki garanti değildir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "boş ev depozito temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "boş ev depozito temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "depozito",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "tasinma-sonrasi-temizlik-unuttugunuz-2026",
    "title": "Taşınma Sonrası Temizlik: Unuttuğunuz 7 Yer",
    "keyword": "taşınma sonrası temizlik",
    "category": "CTR Hook",
    "hook": "Dolap içi, süpürgelik ve davlumbaz sık atlanır.",
    "audience": "Taşınma",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "kadikoy",
    "image": "home",
    "compareNote": "İnşaat tozu varsa ayrı paket.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "taşınma sonrası temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "taşınma sonrası temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "taşınma",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "airbnb-temizlik-puan-dusuren-2026",
    "title": "Airbnb Temizlik: Puan Düşüren Hatalar 2026",
    "keyword": "Airbnb temizlik",
    "category": "CTR Hook",
    "hook": "Check-out hızı ile hijyen dengesi yazılı checklist ister.",
    "audience": "Host",
    "durationHint": "1–3 saat",
    "service": "ev",
    "area": "besiktas",
    "image": "home",
    "compareNote": "Derin genel temizlikten kısa olabilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Airbnb temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Airbnb temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "airbnb",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "periyodik-ev-temizlik-abonelik-tuzagi-2026",
    "title": "Periyodik Ev Temizlik Aboneliği Tuzağı mı?",
    "keyword": "periyodik ev temizlik",
    "category": "CTR Hook",
    "hook": "Kapsamı sözlü bırakmak aboneliği pahalılaştırır; yazılı ritim şart.",
    "audience": "Abonelik",
    "durationHint": "Ziyaret planı",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "compareNote": "Tek seferden farklı paket.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "periyodik ev temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "periyodik ev temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "periyodik",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "mutfak-yag-temizlik-kendin-yapma-2026",
    "title": "Mutfak Yağ Temizliği: Kendin Yapma Sebepleri",
    "keyword": "mutfak yağ temizliği",
    "category": "CTR Hook",
    "hook": "Yanlış aşındırıcı tezgâhı çizer; yüzey uyumlu ürün gerekir.",
    "audience": "Mutfak",
    "durationHint": "1–3 saat",
    "service": "ev",
    "area": "kadikoy",
    "image": "home",
    "compareNote": "Genel eve eklenebilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "mutfak yağ temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "mutfak yağ temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "mutfak",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "banyo-kirec-temizlik-yanlis-asit-2026",
    "title": "Banyo Kireç: Yanlış Asit Pahalıya Patlar",
    "keyword": "banyo kireç temizliği",
    "category": "CTR Hook",
    "hook": "Asitli ürün bazı yüzeyleri matlaştırır; ürün seçimi kritik.",
    "audience": "Banyo",
    "durationHint": "Adede göre",
    "service": "ev",
    "area": "bakirkoy",
    "image": "home",
    "compareNote": "Kireç seviyesi süreye yansır.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "banyo kireç temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "banyo kireç temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "banyo",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "cam-temizlik-yuksek-kat-korku-2026",
    "title": "Yüksek Kat Cam Temizliği: Korkmadan Önce",
    "keyword": "yüksek kat cam temizliği",
    "category": "CTR Hook",
    "hook": "Güvenlik ve erişim olmadan yapılmaz; iskele gerekirse ayrı teklif.",
    "audience": "Yüksek kat",
    "durationHint": "Keşif",
    "service": "cam",
    "area": "sisli",
    "image": "window",
    "compareNote": "DIY pencere dışı riskli.",
    "priceFactors": [
      "Cam paneli sayısı",
      "İç / dış erişim",
      "Yükseklik ve güvenlik",
      "Site / yönetici onayı",
      "Tuz–toz (Boğaz hattı)"
    ],
    "scenarios": [
      "Daire iç cam",
      "Cam balkon sonrası",
      "Villa cephe cam",
      "Plaza cam onayı"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "yüksek kat cam temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "yüksek kat cam temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "cam",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "dis-cephe-temizlik-peyzaj-degil-2026",
    "title": "Dış Cephe Temizliği Peyzaj Değildir (2026)",
    "keyword": "dış cephe temizliği",
    "category": "CTR Hook",
    "hook": "Yalnızca yüzey; bahçe düzenleme / peyzaj hizmetimiz yoktur.",
    "audience": "Site/villa",
    "durationHint": "Keşif",
    "service": "cephe",
    "area": "tarabya",
    "image": "build",
    "compareNote": "Boyama/izolasyon yok.",
    "priceFactors": [
      "Cephe alanı ve malzeme",
      "Erişim yöntemi",
      "Kir / tuz birikimi",
      "Site koordinasyonu",
      "Peyzaj yok — yalnız yüzey"
    ],
    "scenarios": [
      "Küçük villa cephe",
      "Site blok koordinasyon",
      "Boğaz tuzu bakım",
      "Boyasız yüzey temizliği"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "dış cephe temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "dış cephe temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "cephe",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "villa-temizlik-ucreti-neden-farkli-2026",
    "title": "Villa Temizlik Ücreti Neden Farklı? 2026",
    "keyword": "villa temizlik ücreti",
    "category": "CTR Hook",
    "hook": "m², banyo, cam ve erişim daire paketini geçersiz kılar.",
    "audience": "Villa",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "zeker",
    "image": "villa",
    "compareNote": "Keşifsiz sabit fiyat riskli.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "villa temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "villa temizlik ücreti ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "villa",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "ofis-cay-ocagi-sikayet-1-2026",
    "title": "Ofis Şikâyet #1: Çay Ocağı Temizliği",
    "keyword": "ofis çay ocağı temizliği",
    "category": "CTR Hook",
    "hook": "Lokal tur genel ofise eklenebilir; frekans maliyeti düşürür.",
    "audience": "Ofis",
    "durationHint": "Lokal",
    "service": "ofis",
    "area": "sisli",
    "image": "office",
    "compareNote": "Gece vardiyası ayrı.",
    "priceFactors": [
      "Ofis m² ve workstation",
      "Frekans (günlük/haftalık/tek)",
      "Mesai dışı / güvenlik izni",
      "Mutfak–çay ocağı",
      "Ortak alan dahil mi?"
    ],
    "scenarios": [
      "Butik ofis akşam turu",
      "Açık ofis gece",
      "Plaza güvenlik prosedürü",
      "Periyodik sözleşme"
    ],
    "scopeIn": [
      "Çalışma yüzeyleri",
      "Mutfak/çay ocağı",
      "Islak hacim",
      "Çöp/zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "ofis çay ocağı temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "ofis çay ocağı temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "çay ocağı",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "site-ortak-alan-temizlik-yonetici-2026",
    "title": "Site Ortak Alan Temizliği: Yönetici Checklist",
    "keyword": "site ortak alan temizliği",
    "category": "CTR Hook",
    "hook": "Lobi, asansör, merdiven periyodu net yazılmalı; bahçe düzenleme yok.",
    "audience": "Yönetim",
    "durationHint": "Frekans",
    "service": "ofis",
    "area": "atasehir",
    "image": "office",
    "compareNote": "Daire içi ayrı paket.",
    "priceFactors": [
      "Ofis m² ve workstation",
      "Frekans (günlük/haftalık/tek)",
      "Mesai dışı / güvenlik izni",
      "Mutfak–çay ocağı",
      "Ortak alan dahil mi?"
    ],
    "scenarios": [
      "Butik ofis akşam turu",
      "Açık ofis gece",
      "Plaza güvenlik prosedürü",
      "Periyodik sözleşme"
    ],
    "scopeIn": [
      "Çalışma yüzeyleri",
      "Mutfak/çay ocağı",
      "Islak hacim",
      "Çöp/zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "site ortak alan temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "site ortak alan temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "site",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "ucretsiz-kesif-gercekten-ucretsiz-mi-2026",
    "title": "Ücretsiz Keşif Gerçekten Ücretsiz mi?",
    "keyword": "ücretsiz keşif temizlik",
    "category": "CTR Hook",
    "hook": "Keşif bilgi turudur; baskı satış değildir. Kesin fiyat yazılı kapsamda.",
    "audience": "İlk kez",
    "durationHint": "15–40 dk",
    "service": "ev",
    "area": "sariyer",
    "image": "city",
    "compareNote": "Online araç tahmindir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "ücretsiz keşif temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "ücretsiz keşif temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "keşif",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "online-fiyat-hesaplama-yaniltir-mi-2026",
    "title": "Online Fiyat Hesaplama Yanıltır mı?",
    "keyword": "online fiyat hesaplama temizlik",
    "category": "CTR Hook",
    "hook": "Girdi kalitesi şart; sonucu keşifle doğrulayın.",
    "audience": "Online",
    "durationHint": "—",
    "service": "ev",
    "area": "sariyer",
    "image": "city",
    "compareNote": "Sözleşme değildir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "online fiyat hesaplama temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "online fiyat hesaplama temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "hesaplama",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "whatsapp-temizlik-teklif-hangi-foto-2026",
    "title": "WhatsApp Temizlik Teklifi: Hangi Foto?",
    "keyword": "WhatsApp temizlik teklifi",
    "category": "CTR Hook",
    "hook": "m²/oda, ıslak hacim ve sorunlu nokta foto sapmayı küçültür.",
    "audience": "Hızlı lead",
    "durationHint": "—",
    "service": "ev",
    "area": "sariyer",
    "image": "city",
    "compareNote": "Eksik bilgi = geniş aralık.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "WhatsApp temizlik teklifi için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "WhatsApp temizlik teklifi ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "whatsapp",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "ayni-gun-temizlik-gercekci-mi-2026",
    "title": "Aynı Gün Temizlik Gerçekçi mi? 2026",
    "keyword": "aynı gün temizlik",
    "category": "CTR Hook",
    "hook": "Kapasiteye bağlıdır; garanti slot değildir.",
    "audience": "Acil",
    "durationHint": "Aynı gün?",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "compareNote": "Ertesi gün daha ekonomik olabilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "aynı gün temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "aynı gün temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "acil",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "profesyonel-vs-gunlukcu-hangisi-2026",
    "title": "Profesyonel mi Gündelikçi mi? Net Fark 2026",
    "keyword": "profesyonel temizlik farkı",
    "category": "CTR Hook",
    "hook": "Ekip + checklist ölçeklenebilir sonuç verir; saat ücreti tek kriter değil.",
    "audience": "Karar",
    "durationHint": "—",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "compareNote": "Kapsam yazımı kritik.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "profesyonel temizlik farkı için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "profesyonel temizlik farkı ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "karşılaştırma",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bahar-temizligi-ne-zaman-basla-2026",
    "title": "Bahar Temizliği Ne Zaman Başlamalı? 2026",
    "keyword": "bahar temizliği 2026",
    "category": "CTR Hook",
    "hook": "Erken rezervasyon slot ve fiyat netliği sağlar; cam opsiyon ayrı.",
    "audience": "İlkbahar",
    "durationHint": "Genel+cam",
    "service": "ev",
    "area": "maltepe",
    "image": "home",
    "compareNote": "Son hafta yoğunluk artar.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "bahar temizliği 2026 için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "bahar temizliği 2026 ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "bahar",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "grip-sezonu-yuzey-hijyen-hook-2026",
    "title": "Grip Sezonu Yüzey Hijyeni: Abartmadan",
    "keyword": "yüzey hijyen grip",
    "category": "CTR Hook",
    "hook": "Kapı kolu/batarya turu eklenir; hastane sterilizasyonu değildir.",
    "audience": "Aile/ofis",
    "durationHint": "1–3 saat",
    "service": "ev",
    "area": "sisli",
    "image": "home",
    "compareNote": "Tıbbi iddia yok.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "yüzey hijyen grip için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "yüzey hijyen grip ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "hijyen",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "yeni-dogan-evi-temizlik-checklist-2026",
    "title": "Yeni Doğan Evi Temizlik Checklist 2026",
    "keyword": "yeni doğan ev temizliği",
    "category": "CTR Hook",
    "hook": "Bebek odası ve sık dokunma yüzeyleri öncelik; mucize iddia yok.",
    "audience": "Ebeveyn",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "compareNote": "Tıbbi sterilizasyon yok.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "yeni doğan ev temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "yeni doğan ev temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "bebek",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "pet-ev-temizlik-tuy-koku-2026",
    "title": "Pet Ev Temizliği: Tüy ve Koku Gerçeği",
    "keyword": "pet ev temizliği",
    "category": "CTR Hook",
    "hook": "Tüy turu ek süre doğurur; koltuk/halı ayrı paketlenebilir.",
    "audience": "Pet",
    "durationHint": "Standart+ek",
    "service": "ev",
    "area": "kagithane",
    "image": "home",
    "compareNote": "Kalıcı koku her seferde bitmez.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "pet ev temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "pet ev temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "pet",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "satis-oncesi-ev-temizlik-fotograf-2026",
    "title": "Satış Öncesi Ev Temizliği: Fotoğraf Etkisi",
    "keyword": "satış öncesi ev temizliği",
    "category": "CTR Hook",
    "hook": "Cam ve tezgâh parlaklığı emlak fotoğrafını güçlendirir.",
    "audience": "Satış",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "besiktas",
    "image": "home",
    "compareNote": "Derin vs kısa tur niyete göre.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "satış öncesi ev temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "satış öncesi ev temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "satış",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "emlak-cekimi-oncesi-temizlik-2026",
    "title": "Emlak Çekimi Öncesi Temizlik: 60 Dk Plan",
    "keyword": "çekim öncesi temizlik",
    "category": "CTR Hook",
    "hook": "Kısa + cam odaklı tur çoğu çekim için yeter.",
    "audience": "Host/emlak",
    "durationHint": "Kısa+cam",
    "service": "ev",
    "area": "kadikoy",
    "image": "home",
    "compareNote": "İnşaat tozu varsa yetmez.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "çekim öncesi temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "çekim öncesi temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "çekim",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "besiktas-ev-temizlik-otopark-notu-2026",
    "title": "Beşiktaş Ev Temizliği: Otopark Notu Kritik",
    "keyword": "Beşiktaş ev temizliği",
    "category": "CTR Hook",
    "hook": "Erişim ve otopark bilgisi süre/maliyeti etkiler.",
    "audience": "Beşiktaş",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "besiktas",
    "image": "home",
    "compareNote": "Daire tipi değişir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Beşiktaş ev temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Beşiktaş ev temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "beşiktaş",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "sisli-plaza-ofis-temizlik-izin-2026",
    "title": "Şişli Plaza Ofis: İzin Almadan Başlama",
    "keyword": "Şişli plaza ofis temizliği",
    "category": "CTR Hook",
    "hook": "Güvenlik izni ve asansör prosedürü önceden alınmalı.",
    "audience": "Plaza",
    "durationHint": "Akşam/gece",
    "service": "ofis",
    "area": "sisli",
    "image": "office",
    "compareNote": "Mesai içi riskli olabilir.",
    "priceFactors": [
      "Ofis m² ve workstation",
      "Frekans (günlük/haftalık/tek)",
      "Mesai dışı / güvenlik izni",
      "Mutfak–çay ocağı",
      "Ortak alan dahil mi?"
    ],
    "scenarios": [
      "Butik ofis akşam turu",
      "Açık ofis gece",
      "Plaza güvenlik prosedürü",
      "Periyodik sözleşme"
    ],
    "scopeIn": [
      "Çalışma yüzeyleri",
      "Mutfak/çay ocağı",
      "Islak hacim",
      "Çöp/zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Şişli plaza ofis temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Şişli plaza ofis temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "şişli",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "uskudar-ev-temizlik-bogaz-hatti-2026",
    "title": "Üsküdar Ev Temizliği: Boğaz Hattı Notları",
    "keyword": "Üsküdar ev temizliği",
    "category": "CTR Hook",
    "hook": "Sahil/iç mahalle erişimi planı etkiler; dubleks ayrı keşif.",
    "audience": "Üsküdar",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "uskudar",
    "image": "home",
    "compareNote": "Cam tuzu ek kalem olabilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Üsküdar ev temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Üsküdar ev temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "üsküdar",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "atasehir-ofis-abonelik-mi-tek-2026",
    "title": "Ataşehir Ofis: Abonelik mi Tek Sefer mi?",
    "keyword": "Ataşehir ofis temizliği",
    "category": "CTR Hook",
    "hook": "Frekans birim maliyeti düşürür; açılış temizliği ayrı pakettir.",
    "audience": "Ofis",
    "durationHint": "Frekans",
    "service": "ofis",
    "area": "atasehir",
    "image": "office",
    "compareNote": "Gece slotu ayrıca.",
    "priceFactors": [
      "Ofis m² ve workstation",
      "Frekans (günlük/haftalık/tek)",
      "Mesai dışı / güvenlik izni",
      "Mutfak–çay ocağı",
      "Ortak alan dahil mi?"
    ],
    "scenarios": [
      "Butik ofis akşam turu",
      "Açık ofis gece",
      "Plaza güvenlik prosedürü",
      "Periyodik sözleşme"
    ],
    "scopeIn": [
      "Çalışma yüzeyleri",
      "Mutfak/çay ocağı",
      "Islak hacim",
      "Çöp/zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Ataşehir ofis temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Ataşehir ofis temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "ataşehir",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bakirkoy-aile-evi-temizlik-hook-2026",
    "title": "Bakırköy Aile Evi Temizliği: Odak Noktaları",
    "keyword": "Bakırköy ev temizliği",
    "category": "CTR Hook",
    "hook": "Çocuk odası + mutfak/banyo önceliği yazılı checklist ister.",
    "audience": "Aile",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "bakirkoy",
    "image": "home",
    "compareNote": "Periyodik seçenek var.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Bakırköy ev temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Bakırköy ev temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "bakırköy",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "fatih-eski-bina-temizlik-asansor-2026",
    "title": "Fatih Eski Bina Temizliği: Asansörsüz Kat",
    "keyword": "Fatih ev temizliği",
    "category": "CTR Hook",
    "hook": "Asansörsüz kat bilgisi süreye yansır; önceden yazın.",
    "audience": "Fatih",
    "durationHint": "Daireye göre",
    "service": "ev",
    "area": "fatih",
    "image": "home",
    "compareNote": "Erişim kritik.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Fatih ev temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Fatih ev temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "fatih",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "maltepe-cam-balkon-sonrasi-2026",
    "title": "Maltepe Cam Balkon Sonrası Temizlik",
    "keyword": "Maltepe cam balkon temizliği",
    "category": "CTR Hook",
    "hook": "Montaj tozu + cam birlikte planlanabilir.",
    "audience": "Maltepe",
    "durationHint": "Keşif",
    "service": "cam",
    "area": "maltepe",
    "image": "window",
    "compareNote": "Standart camdan farklı.",
    "priceFactors": [
      "Cam paneli sayısı",
      "İç / dış erişim",
      "Yükseklik ve güvenlik",
      "Site / yönetici onayı",
      "Tuz–toz (Boğaz hattı)"
    ],
    "scenarios": [
      "Daire iç cam",
      "Cam balkon sonrası",
      "Villa cephe cam",
      "Plaza cam onayı"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Maltepe cam balkon temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Maltepe cam balkon temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "cam balkon",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "pendik-randevu-rota-plani-2026",
    "title": "Pendik Temizlik Randevusu: Rota Planı Neden?",
    "keyword": "Pendik ev temizliği",
    "category": "CTR Hook",
    "hook": "Geniş ilçede rota planı aynı gün slotunu etkiler.",
    "audience": "Pendik",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "pendik",
    "image": "home",
    "compareNote": "Garanti aynı gün yok.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Pendik ev temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Pendik ev temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "pendik",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "eyupsultan-yeni-eski-konut-2026",
    "title": "Eyüpsultan: Yeni vs Eski Konut Temizliği",
    "keyword": "Eyüpsultan ev temizliği",
    "category": "CTR Hook",
    "hook": "Yeni teslim tozu ile oturulan daire checklist’i farklıdır.",
    "audience": "Eyüpsultan",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "eyup",
    "image": "home",
    "compareNote": "İnşaat paketi ayrı.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Eyüpsultan ev temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Eyüpsultan ev temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "eyüpsultan",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "zeytinburnu-aile-temizlik-hook-2026",
    "title": "Zeytinburnu Aile Temizliği: Pratik Plan 2026",
    "keyword": "Zeytinburnu ev temizliği",
    "category": "CTR Hook",
    "hook": "Mutfak-banyo odaklı plan yaygındır; periyodik seçenek sunulabilir.",
    "audience": "Zeytinburnu",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "zeytinburnu",
    "image": "home",
    "compareNote": "Cam eklenirse süre uzar.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Zeytinburnu ev temizliği için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Zeytinburnu ev temizliği ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "zeytinburnu",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "yazili-kapsam-olmadan-temizlik-alma-2026",
    "title": "Yazılı Kapsam Olmadan Temizlik Aldırtmayın",
    "keyword": "yazılı kapsam temizlik",
    "category": "CTR Hook",
    "hook": "Garanti keşifte yazılan işlerdir; sözlü vaat pahalıya patlar.",
    "audience": "Kalite",
    "durationHint": "—",
    "service": "ev",
    "area": "sariyer",
    "image": "city",
    "compareNote": "Keşif dışı ekstra ayrı teklif.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "yazılı kapsam temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "yazılı kapsam temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "kapsam",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "temizlik-fiyatini-artan-gizli-5-2026",
    "title": "Temizlik Fiyatını Artıran Gizli 5 Neden",
    "keyword": "temizlik fiyatını artıran",
    "category": "CTR Hook",
    "hook": "Erişim, kirlilik, ek cam/koltuk, dolu ev ve acil slot maliyeti şişirir.",
    "audience": "Fiyat",
    "durationHint": "—",
    "service": "ev",
    "area": "sariyer",
    "image": "city",
    "compareNote": "Önceden yazmak sürprizi keser.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev",
      "Kirlilik ve ıslak hacim",
      "Kat, asansör, site girişi",
      "Ek işler: cam, koltuk"
    ],
    "scenarios": [
      "1+1 kısa tur",
      "2+1–3+1 aile yarım–bir gün",
      "Villa / dubleks keşif",
      "Taşınma sonrası checklist"
    ],
    "scopeIn": [
      "Mutfak/banyo",
      "Zemin",
      "Toz alma",
      "Yazılı checklist"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "temizlik fiyatını artıran için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "temizlik fiyatını artıran ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "fiyat",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "sariyer-koltuk-ve-insaat-birlikte-mi-2026",
    "title": "Sarıyer’de Koltuk + İnşaat Aynı Gün mü?",
    "keyword": "Sarıyer koltuk inşaat temizlik",
    "category": "CTR Hook",
    "hook": "Genelde ayrı planlanır; toz bitmeden koltuk yıkamak risklidir.",
    "audience": "Kombine",
    "durationHint": "Ayrı randevu",
    "service": "insaat",
    "area": "sariyer",
    "image": "build",
    "compareNote": "Sıra: önce inşaat/toz, sonra koltuk.",
    "priceFactors": [
      "Brüt/net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi / havalandırma"
    ],
    "scenarios": [
      "Yeni daire ince toz",
      "Ofis teslim mobilya öncesi",
      "Boya / tadilat sonrası",
      "Villa teslim m² planı"
    ],
    "scopeIn": [
      "İnce/kalın toz turu",
      "Pervaz ve ıslak hacim",
      "Zemin"
    ],
    "scopeOut": [
      "Peyzaj/bahçe düzenleme",
      "İnşaat işçiliği",
      "Mobilya taşıma"
    ],
    "steps": [
      "Online tahmin veya foto/m² / parça bilgisi paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Kuruma / erişim bilgisini vermemek"
    ],
    "priceNote": "Sarıyer koltuk inşaat temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Sarıyer koltuk inşaat temizlik ne kadar tutar?",
        "a": "Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
      },
      {
        "q": "Fiyat garanti mi?",
        "a": "Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir."
      },
      {
        "q": "Peyzaj dahil mi?",
        "a": "Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur."
      }
    ],
    "tags": [
      "kombine",
      "ctr",
      "istanbul",
      "2026",
      "temizlik"
    ]
  }
];

function metaDesc(keyword: string, hook: string): string {
  const base = `${keyword}: ${hook}`;
  return base.length <= 158 ? base : `${base.slice(0, 157).trimEnd()}…`;
}

function expand(t: V9Topic): PricingGuideConfig {
  const service = SERVICE[t.service];
  const area = AREA[t.area];
  const intro = `${t.hook} ${area.label} ve İstanbul genelinde ${t.keyword} için tıklanma odaklı ama şeffaf rehber.`;
  return {
    slug: t.slug,
    title: t.title,
    metaTitle: t.title.length <= 60 ? t.title : `${t.title.slice(0, 59).trimEnd()}…`,
    metaDesc: metaDesc(t.keyword, t.hook),
    excerpt: t.hook,
    image: IMG[t.image],
    category: t.category,
    tags: [...new Set([...t.tags, 'ctr hook', 'istanbul'])].slice(0, 8),
    keyword: t.keyword,
    intro,
    audience: t.audience,
    durationHint: t.durationHint,
    serviceHref: service.href,
    serviceLabel: service.label,
    areaHref: area.href,
    areaLabel: area.label,
    scopeIn: t.scopeIn,
    scopeOut: t.scopeOut,
    steps: t.steps,
    mistakes: t.mistakes,
    priceNote: t.priceNote,
    faq: t.faq,
    priceFactors: t.priceFactors,
    scenarios: t.scenarios,
    compareNote: t.compareNote,
    sections: [
      {
        heading: `${t.keyword} — Zümrüt Vadi notu`,
        paragraphs: [
          `Sarıyer / Zekeriyaköy öncelikli operasyonla ${service.label.toLowerCase()} paketlerinde yazılı kapsam sunuyoruz.`,
          'Peyzaj yoktur. Telefon / WhatsApp: 0551 925 09 43. Ads niyetiyle gelenler için net CTA: keşif / fiyat.',
        ],
        bullets: ['Online fiyat = tahmin', 'Ücretsiz keşif', 'Checklist teslim', 'Koltuk + inşaat Ads köprüsü'],
      },
    ],
  };
}

export function generateAllV9Posts(): BlogSeedPost[] {
  if (TOPICS.length !== 100) throw new Error(`V9 sayı hatası: ${TOPICS.length}/100`);
  return TOPICS.map((t) => makePricingGuidePost(expand(t)));
}

export function listV9Slugs(): string[] {
  return TOPICS.map((t) => t.slug);
}
