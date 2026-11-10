/**
 * 100 v8 derin fiyat/rehber blog — top CTR formatı.
 * Direkt yayın (drip yok). Üretilir: node scripts/generate-v8-pricing-blog-content.mjs
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

export type V8Topic = {
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

const TOPICS: V8Topic[] = [
  {
    "slug": "villa-temizlik-maliyet-analizi-istanbul-2026",
    "title": "Villa Temizlik Maliyet Analizi 2026 | İstanbul",
    "keyword": "villa temizlik maliyeti",
    "category": "Fiyat Rehberi",
    "hook": "Villa m², banyo adedi ve cam cephe maliyeti belirler; peyzaj dahil değildir.",
    "audience": "Villa sahipleri",
    "durationHint": "Keşif zorunlu",
    "service": "ev",
    "area": "zeker",
    "image": "villa",
    "tag": "villa",
    "compareNote": "Daire paketinden farklıdır; keşifsiz sabit fiyat yanıltıcıdır.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "villa temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "villa temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "dubleks-temizlik-ucret-rehberi-2026",
    "title": "Dubleks Temizlik Ücret Rehberi 2026",
    "keyword": "dubleks temizlik ücreti",
    "category": "Fiyat Rehberi",
    "hook": "Merdiven + iki kat süresi ve ekip dağılımını etkiler.",
    "audience": "Dubleks sakinleri",
    "durationHint": "Kat sayısına göre",
    "service": "ev",
    "area": "bahce",
    "image": "home",
    "tag": "dubleks",
    "compareNote": "Tek kat daireye göre süre genelde uzar.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "dubleks temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "dubleks temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "dubleks",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bos-ev-temizlik-ne-kadar-tutar-2026",
    "title": "Boş Ev Temizliği Ne Kadar Tutar? 2026",
    "keyword": "boş ev temizlik ücreti",
    "category": "Fiyat Rehberi",
    "hook": "Boş evde erişim kolaydır; toz ve ıslak hacim yine m²’ye bağlıdır.",
    "audience": "Kiraya veren / alan",
    "durationHint": "Daireye göre",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "tag": "boş ev",
    "compareNote": "Dolu eve göre süre kısalabilir; kirlilik sınıfı ayrıdır.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "boş ev temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "boş ev temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "boş ev",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "dolu-ev-temizlik-maliyet-2026-istanbul",
    "title": "Dolu Ev Temizlik Maliyeti 2026 İstanbul",
    "keyword": "dolu ev temizlik maliyeti",
    "category": "Fiyat Rehberi",
    "hook": "Eşya koruma ve süpürme turu dolu evde ekstra süre ister.",
    "audience": "Oturulan evler",
    "durationHint": "+%20–50 süre mümkün",
    "service": "ev",
    "area": "sisli",
    "image": "home",
    "tag": "dolu ev",
    "compareNote": "Boş ev checklist’i birebir uygulanmaz.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "dolu ev temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "dolu ev temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "dolu ev",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "periyodik-ev-temizlik-abonelik-ucret-2026",
    "title": "Periyodik Ev Temizlik Abonelik Ücreti 2026",
    "keyword": "periyodik ev temizlik ücreti",
    "category": "Fiyat Rehberi",
    "hook": "Haftalık/aylık ritim tek sefere göre birim maliyeti düşürebilir.",
    "audience": "Düzenli bakım",
    "durationHint": "Ziyaret 2–5 saat",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "tag": "periyodik",
    "compareNote": "Tek sefer genel temizlik farklı pakettir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "periyodik ev temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "periyodik ev temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "tek-sefer-genel-temizlik-fiyat-etkenleri-2026",
    "title": "Tek Sefer Genel Temizlik Fiyat Etkenleri 2026",
    "keyword": "tek sefer temizlik fiyat",
    "category": "Fiyat Rehberi",
    "hook": "Taşınma/tadilat sonrası tek seferde kapsam genişler.",
    "audience": "Tek sefer ihtiyacı",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "besiktas",
    "image": "home",
    "tag": "tek sefer",
    "compareNote": "Periyodik abonelikten farklı fiyatlanır.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "tek sefer temizlik fiyat için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "tek sefer temizlik fiyat ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "tek sefer",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "tasinma-sonrasi-temizlik-maliyet-istanbul-2026",
    "title": "Taşınma Sonrası Temizlik Maliyeti İstanbul 2026",
    "keyword": "taşınma sonrası temizlik maliyeti",
    "category": "Fiyat Rehberi",
    "hook": "Mutfak, banyo ve zemin checklist’i taşınma stresini azaltır.",
    "audience": "Taşınanlar",
    "durationHint": "2+1 genelde yarım–bir gün",
    "service": "ev",
    "area": "kadikoy",
    "image": "home",
    "tag": "taşınma",
    "compareNote": "İnşaat tozu varsa ayrı paket düşünülür.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "taşınma sonrası temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "taşınma sonrası temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "tasinma-oncesi-depozito-temizlik-ucret-2026",
    "title": "Taşınma Öncesi Depozito Temizlik Ücreti 2026",
    "keyword": "depozito temizlik ücreti",
    "category": "Fiyat Rehberi",
    "hook": "Kiracı tesliminde boşaltma hijyeni fiilen beklenir.",
    "audience": "Kiracılar",
    "durationHint": "1+1–3+1",
    "service": "ev",
    "area": "umraniye",
    "image": "home",
    "tag": "depozito",
    "compareNote": "Emlakçı beklentisi keşifte netleştirilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "depozito temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "depozito temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "airbnb-temizlik-ucreti-istanbul-2026",
    "title": "Airbnb Temizlik Ücreti İstanbul 2026",
    "keyword": "Airbnb temizlik ücreti",
    "category": "Fiyat Rehberi",
    "hook": "Check-out/check-in arası hızlı standart checklist fiyatı etkiler.",
    "audience": "Hostlar",
    "durationHint": "1–3 saat",
    "service": "ev",
    "area": "besiktas",
    "image": "home",
    "tag": "airbnb",
    "compareNote": "Genel ev paketinden daha kısa tur olabilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Airbnb temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Airbnb temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "yeni-dogan-evi-hijyen-maliyet-2026",
    "title": "Yeni Doğan Evi Hijyen Maliyeti 2026",
    "keyword": "yeni doğan hijyen maliyeti",
    "category": "Fiyat Rehberi",
    "hook": "Bebek odası ve sık dokunulan yüzeyler önceliklidir.",
    "audience": "Yeni ebeveynler",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "tag": "bebek",
    "compareNote": "Tıbbi sterilizasyon iddiası yoktur.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "yeni doğan hijyen maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "yeni doğan hijyen maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "evcil-hayvanli-ev-temizlik-ek-ucret-2026",
    "title": "Evcil Hayvanlı Ev Temizlik Ek Ücret 2026",
    "keyword": "pet ev temizlik ücreti",
    "category": "Fiyat Rehberi",
    "hook": "Tüy ve koku turu ek süre doğurabilir.",
    "audience": "Pet sahipleri",
    "durationHint": "Standart + ek",
    "service": "ev",
    "area": "kagithane",
    "image": "home",
    "tag": "pet",
    "compareNote": "Halı/koltuk ayrı paketlenebilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "pet ev temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "pet ev temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "mutfak-derin-temizlik-fiyat-2026-istanbul",
    "title": "Mutfak Derin Temizlik Fiyat 2026 İstanbul",
    "keyword": "mutfak derin temizlik fiyat",
    "category": "Fiyat Rehberi",
    "hook": "Yağ ve kireç için yüzey uyumlu ürün + süre gerekir.",
    "audience": "Mutfak öncelikli",
    "durationHint": "1–3 saat+",
    "service": "ev",
    "area": "kadikoy",
    "image": "home",
    "tag": "mutfak",
    "compareNote": "Genel ev içinde veya lokal paket olabilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "mutfak derin temizlik fiyat için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "mutfak derin temizlik fiyat ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "banyo-kirec-temizlik-ucreti-2026",
    "title": "Banyo Kireç Temizlik Ücreti 2026",
    "keyword": "banyo kireç temizlik ücreti",
    "category": "Fiyat Rehberi",
    "hook": "Banyo adedi ve kireç seviyesi maliyeti belirler.",
    "audience": "Kireç şikâyeti",
    "durationHint": "Banyo adedine göre",
    "service": "ev",
    "area": "bakirkoy",
    "image": "home",
    "tag": "banyo",
    "compareNote": "Yanlış asit malzemeyi bozar — ürün seçimi kritik.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "banyo kireç temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "banyo kireç temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bayram-oncesi-temizlik-fiyat-yogunlugu-2026",
    "title": "Bayram Öncesi Temizlik Fiyat Yoğunluğu 2026",
    "keyword": "bayram temizlik fiyat",
    "category": "Fiyat Rehberi",
    "hook": "Bayram öncesi slotlar erken dolar; erken rezervasyon kritik.",
    "audience": "Misafir bekleyenler",
    "durationHint": "Genel süre",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "tag": "bayram",
    "compareNote": "Son gün acil taleplerde kapasite sınırlı olabilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "bayram temizlik fiyat için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "bayram temizlik fiyat ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "bayram",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "yilbasi-sonrasi-ev-reset-maliyet-2026",
    "title": "Yılbaşı Sonrası Ev Reset Maliyeti 2026",
    "keyword": "yılbaşı sonrası temizlik maliyeti",
    "category": "Fiyat Rehberi",
    "hook": "Misafir ve yemek sonrası mutfak+zemin reset’i.",
    "audience": "Ara–Ocak",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "sisli",
    "image": "home",
    "tag": "yılbaşı",
    "compareNote": "Cam eklenirse süre uzar.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "yılbaşı sonrası temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "yılbaşı sonrası temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "yılbaşı",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bahar-temizligi-maliyet-plan-2026",
    "title": "Bahar Temizliği Maliyet Planı 2026",
    "keyword": "bahar temizlik maliyeti",
    "category": "Fiyat Rehberi",
    "hook": "Erken plan randevu ve fiyat netliğini kolaylaştırır.",
    "audience": "İlkbahar",
    "durationHint": "Genel + cam opsiyon",
    "service": "ev",
    "area": "maltepe",
    "image": "home",
    "tag": "bahar",
    "compareNote": "Cam ve balkon ayrı kalem olabilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "bahar temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "bahar temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kis-nem-kuf-temizlik-ucret-2026",
    "title": "Kış Nem Küf Temizlik Ücreti 2026",
    "keyword": "küf yüzey temizlik ücreti",
    "category": "Fiyat Rehberi",
    "hook": "Yüzey küfü temizlenebilir; yapısal nem ayrı ustalık ister.",
    "audience": "Kış nem",
    "durationHint": "Odalara göre",
    "service": "ev",
    "area": "bahce",
    "image": "home",
    "tag": "küf",
    "compareNote": "İzolasyon/inşaat işi dahil değildir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "küf yüzey temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "küf yüzey temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "küf",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "sariyer-villa-temizlik-maliyet-2026",
    "title": "Sarıyer Villa Temizlik Maliyeti 2026",
    "keyword": "Sarıyer villa temizlik maliyeti",
    "category": "Yerel Fiyat",
    "hook": "Sarıyer villa hattında erişim ve m² keşifle netleşir.",
    "audience": "Sarıyer villa",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "sariyer",
    "image": "villa",
    "tag": "sarıyer",
    "compareNote": "Peyzaj yoktur; yüzey temizliği planlanır.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Sarıyer villa temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Sarıyer villa temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "zekeriyakoy-villa-temizlik-ucret-detay-2026",
    "title": "Zekeriyaköy Villa Temizlik Ücret Detay 2026",
    "keyword": "Zekeriyaköy villa temizlik ücreti",
    "category": "Yerel Fiyat",
    "hook": "Villa yoğun Zekeriyaköy’de süre planı daireden farklıdır.",
    "audience": "Zekeriyaköy",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "zeker",
    "image": "villa",
    "tag": "zekeriyaköy",
    "compareNote": "Online tahmin sonrası keşif önerilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Zekeriyaköy villa temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Zekeriyaköy villa temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "maslak-ofis-temizlik-m2-ucret-2026",
    "title": "Maslak Ofis Temizlik m² Ücret 2026",
    "keyword": "Maslak ofis m² ücreti",
    "category": "Yerel Fiyat",
    "hook": "Plaza güvenlik ve gece slotu maliyeti etkiler.",
    "audience": "Maslak ofis",
    "durationHint": "Gece/akşam",
    "service": "ofis",
    "area": "maslak",
    "image": "office",
    "tag": "maslak",
    "compareNote": "Frekanslı sözleşme birim maliyeti düşürebilir.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Maslak ofis m² ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Maslak ofis m² ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "tarabya-cam-temizlik-maliyet-2026",
    "title": "Tarabya Cam Temizlik Maliyeti 2026",
    "keyword": "Tarabya cam temizlik maliyeti",
    "category": "Yerel Fiyat",
    "hook": "Boğaz tuzu/toz periyodik cam bakımını gerektirir.",
    "audience": "Tarabya",
    "durationHint": "Cam sayısına göre",
    "service": "cam",
    "area": "tarabya",
    "image": "window",
    "tag": "tarabya",
    "compareNote": "Yüksek katta güvenlik planı şart.",
    "priceFactors": [
      "Cam paneli / cephe sayısı",
      "İç / dış erişim",
      "Yükseklik ve güvenlik planı",
      "Yönetici / site onayı",
      "Tuz–toz birikimi (Boğaz hattı)"
    ],
    "scenarios": [
      "Daire iç cam: kısa randevu",
      "Cam balkon: montaj sonrası toz ayrı",
      "Villa cephe cam: güvenlik planı",
      "Plaza cam: yönetici onayı şart"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Tarabya cam temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Tarabya cam temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bahcekoy-ev-temizlik-ucret-rehberi-2026",
    "title": "Bahçeköy Ev Temizlik Ücret Rehberi 2026",
    "keyword": "Bahçeköy ev temizlik ücreti",
    "category": "Yerel Fiyat",
    "hook": "Orman hattı erişimi randevu planını etkiler.",
    "audience": "Bahçeköy",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "bahce",
    "image": "home",
    "tag": "bahçeköy",
    "compareNote": "İnşaat sonrası ayrı pakettir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Bahçeköy ev temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Bahçeköy ev temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "uskumrukoy-temizlik-maliyet-2026",
    "title": "Uskumruköy Temizlik Maliyeti 2026",
    "keyword": "Uskumruköy temizlik maliyeti",
    "category": "Yerel Fiyat",
    "hook": "Orman içi hattında planlı randevu önemlidir.",
    "audience": "Uskumruköy",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "uskum",
    "image": "home",
    "tag": "uskumruköy",
    "compareNote": "Kış erişiminde sabah slotları tercih edilebilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Uskumruköy temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Uskumruköy temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "sisli-plaza-ofis-temizlik-ucret-2026",
    "title": "Şişli Plaza Ofis Temizlik Ücreti 2026",
    "keyword": "Şişli plaza ofis ücreti",
    "category": "Yerel Fiyat",
    "hook": "Mesai dışı temizlik iş sürekliliğini bozmaz.",
    "audience": "Şişli ofis",
    "durationHint": "Akşam/gece",
    "service": "ofis",
    "area": "sisli",
    "image": "office",
    "tag": "şişli",
    "compareNote": "Güvenlik izni önceden alınmalı.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Şişli plaza ofis ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Şişli plaza ofis ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "besiktas-ev-temizlik-maliyet-2026",
    "title": "Beşiktaş Ev Temizlik Maliyeti 2026",
    "keyword": "Beşiktaş ev temizlik maliyeti",
    "category": "Yerel Fiyat",
    "hook": "Otopark ve erişim bilgisi keşifte not edilir.",
    "audience": "Beşiktaş",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "besiktas",
    "image": "home",
    "tag": "beşiktaş",
    "compareNote": "Daire tipi fiyatı değiştirir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Beşiktaş ev temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Beşiktaş ev temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kadikoy-ev-temizlik-ucret-analizi-2026",
    "title": "Kadıköy Ev Temizlik Ücret Analizi 2026",
    "keyword": "Kadıköy ev temizlik ücreti",
    "category": "Yerel Fiyat",
    "hook": "Yoğunlukta sabah randevuları genelde verimlidir.",
    "audience": "Kadıköy",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "kadikoy",
    "image": "home",
    "tag": "kadıköy",
    "compareNote": "Anadolu Yakası operasyonu planlıdır.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Kadıköy ev temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Kadıköy ev temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "umraniye-ev-temizlik-maliyet-2026",
    "title": "Ümraniye Ev Temizlik Maliyeti 2026",
    "keyword": "Ümraniye ev temizlik maliyeti",
    "category": "Yerel Fiyat",
    "hook": "Site giriş prosedürleri önceden alınmalı.",
    "audience": "Ümraniye",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "umraniye",
    "image": "home",
    "tag": "ümraniye",
    "compareNote": "Finans çevresi ofis paketleri ayrıdır.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Ümraniye ev temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Ümraniye ev temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "ümraniye",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "atasehir-ofis-temizlik-abonelik-ucret-2026",
    "title": "Ataşehir Ofis Temizlik Abonelik Ücreti 2026",
    "keyword": "Ataşehir ofis abonelik ücreti",
    "category": "Yerel Fiyat",
    "hook": "Frekanslı sözleşme yaygındır.",
    "audience": "Ataşehir ofis",
    "durationHint": "Frekansa göre",
    "service": "ofis",
    "area": "atasehir",
    "image": "office",
    "tag": "ataşehir",
    "compareNote": "Tek sefer açılış temizliği farklıdır.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Ataşehir ofis abonelik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Ataşehir ofis abonelik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bakirkoy-aile-evi-temizlik-ucret-2026",
    "title": "Bakırköy Aile Evi Temizlik Ücreti 2026",
    "keyword": "Bakırköy ev temizlik ücreti",
    "category": "Yerel Fiyat",
    "hook": "Çocuk odası ve mutfak önceliklendirilir.",
    "audience": "Bakırköy",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "bakirkoy",
    "image": "home",
    "tag": "bakırköy",
    "compareNote": "Periyodik plan birim maliyeti dengeleyebilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Bakırköy ev temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Bakırköy ev temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kagithane-yeni-konut-temizlik-maliyet-2026",
    "title": "Kağıthane Yeni Konut Temizlik Maliyeti 2026",
    "keyword": "Kağıthane yeni konut temizlik",
    "category": "Yerel Fiyat",
    "hook": "Yeni konut stokunda teslim tozu ayrı program ister.",
    "audience": "Kağıthane",
    "durationHint": "m²",
    "service": "insaat",
    "area": "kagithane",
    "image": "build",
    "tag": "kağıthane",
    "compareNote": "Standart ev paketi yetmeyebilir.",
    "priceFactors": [
      "Brüt / net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim sayısı",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi ve havalandırma imkanı"
    ],
    "scenarios": [
      "Yeni daire teslim: ince toz programı",
      "Ofis teslim: mobilya öncesi kritik",
      "Tadilat / boya sonrası: sıçrantı + toz",
      "Villa teslim: m² + çoklu banyo"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Kağıthane yeni konut temizlik için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Kağıthane yeni konut temizlik ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "uskudar-ev-temizlik-ucret-rehberi-2026",
    "title": "Üsküdar Ev Temizlik Ücret Rehberi 2026",
    "keyword": "Üsküdar ev temizlik ücreti",
    "category": "Yerel Fiyat",
    "hook": "Boğaz ve iç mahalle erişimi planı etkiler.",
    "audience": "Üsküdar",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "uskudar",
    "image": "home",
    "tag": "üsküdar",
    "compareNote": "Dubleks/villa ayrı keşif.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Üsküdar ev temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Üsküdar ev temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "maltepe-ev-temizlik-maliyet-2026",
    "title": "Maltepe Ev Temizlik Maliyeti 2026",
    "keyword": "Maltepe ev temizlik maliyeti",
    "category": "Yerel Fiyat",
    "hook": "Sahil ve iç mahalle daire tipine göre değişir.",
    "audience": "Maltepe",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "maltepe",
    "image": "home",
    "tag": "maltepe",
    "compareNote": "Cam balkon sonrası toz ayrı olabilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Maltepe ev temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Maltepe ev temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "maltepe",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kartal-ev-temizlik-ucret-2026",
    "title": "Kartal Ev Temizlik Ücreti 2026",
    "keyword": "Kartal ev temizlik ücreti",
    "category": "Yerel Fiyat",
    "hook": "Konut + işyeri karışımında paket net yazılmalı.",
    "audience": "Kartal",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "kartal",
    "image": "home",
    "tag": "kartal",
    "compareNote": "Ofis talepleri ayrı fiyatlanır.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Kartal ev temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Kartal ev temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "kartal",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "pendik-ev-temizlik-maliyet-2026",
    "title": "Pendik Ev Temizlik Maliyeti 2026",
    "keyword": "Pendik ev temizlik maliyeti",
    "category": "Yerel Fiyat",
    "hook": "Geniş ilçede rota planı randevuyu etkiler.",
    "audience": "Pendik",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "pendik",
    "image": "home",
    "tag": "pendik",
    "compareNote": "Aynı gün slot garanti değildir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Pendik ev temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Pendik ev temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "fatih-ev-temizlik-ucret-2026",
    "title": "Fatih Ev Temizlik Ücreti 2026",
    "keyword": "Fatih ev temizlik ücreti",
    "category": "Yerel Fiyat",
    "hook": "Eski bina erişimi süreye yansıyabilir.",
    "audience": "Fatih",
    "durationHint": "Daireye göre",
    "service": "ev",
    "area": "fatih",
    "image": "home",
    "tag": "fatih",
    "compareNote": "Asansörsüz kat bilgisi kritik.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Fatih ev temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Fatih ev temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "eyupsultan-ev-temizlik-maliyet-2026",
    "title": "Eyüpsultan Ev Temizlik Maliyeti 2026",
    "keyword": "Eyüpsultan ev temizlik maliyeti",
    "category": "Yerel Fiyat",
    "hook": "Yeni ve eski konut dokusu checklist’i değiştirir.",
    "audience": "Eyüpsultan",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "eyup",
    "image": "home",
    "tag": "eyüpsultan",
    "compareNote": "İnşaat teslimi ayrı paket.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Eyüpsultan ev temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Eyüpsultan ev temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "zeytinburnu-ev-temizlik-ucret-2026",
    "title": "Zeytinburnu Ev Temizlik Ücreti 2026",
    "keyword": "Zeytinburnu ev temizlik ücreti",
    "category": "Yerel Fiyat",
    "hook": "Aile konutlarında mutfak-banyo odaklı plan yaygındır.",
    "audience": "Zeytinburnu",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "zeytinburnu",
    "image": "home",
    "tag": "zeytinburnu",
    "compareNote": "Periyodik seçenek sunulabilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Zeytinburnu ev temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Zeytinburnu ev temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "insaat-sonrasi-m2-maliyet-hesap-2026",
    "title": "İnşaat Sonrası m² Maliyet Hesap 2026",
    "keyword": "inşaat sonrası m² maliyet",
    "category": "İnşaat Fiyat",
    "hook": "Kirlilik sınıfı olmadan yalnızca m² yetmez.",
    "audience": "Teslim alanlar",
    "durationHint": "m² + sınıf",
    "service": "insaat",
    "area": "sariyer",
    "image": "build",
    "tag": "inşaat",
    "compareNote": "Standart ev turu ile karıştırılmamalı.",
    "priceFactors": [
      "Brüt / net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim sayısı",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi ve havalandırma imkanı"
    ],
    "scenarios": [
      "Yeni daire teslim: ince toz programı",
      "Ofis teslim: mobilya öncesi kritik",
      "Tadilat / boya sonrası: sıçrantı + toz",
      "Villa teslim: m² + çoklu banyo"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "inşaat sonrası m² maliyet için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "inşaat sonrası m² maliyet ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "insaat-sonrasi-ofis-teslim-ucret-2026",
    "title": "İnşaat Sonrası Ofis Teslim Ücreti 2026",
    "keyword": "ofis teslim temizlik ücreti",
    "category": "İnşaat Fiyat",
    "hook": "Mobilya öncesi toz programı kritiktir.",
    "audience": "Ofis teslim",
    "durationHint": "m²",
    "service": "insaat",
    "area": "maslak",
    "image": "build",
    "tag": "ofis teslim",
    "compareNote": "Plaza prosedürü ek süre doğurabilir.",
    "priceFactors": [
      "Brüt / net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim sayısı",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi ve havalandırma imkanı"
    ],
    "scenarios": [
      "Yeni daire teslim: ince toz programı",
      "Ofis teslim: mobilya öncesi kritik",
      "Tadilat / boya sonrası: sıçrantı + toz",
      "Villa teslim: m² + çoklu banyo"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "ofis teslim temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "ofis teslim temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "boya-badana-sonrasi-temizlik-ucret-2026",
    "title": "Boya Badana Sonrası Temizlik Ücreti 2026",
    "keyword": "boya sonrası temizlik ücreti",
    "category": "İnşaat Fiyat",
    "hook": "Sıçrantı + toz için uygun ürün gerekir.",
    "audience": "Tadilat",
    "durationHint": "m²",
    "service": "insaat",
    "area": "kadikoy",
    "image": "build",
    "tag": "boya",
    "compareNote": "Boya işçiliği dahil değildir.",
    "priceFactors": [
      "Brüt / net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim sayısı",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi ve havalandırma imkanı"
    ],
    "scenarios": [
      "Yeni daire teslim: ince toz programı",
      "Ofis teslim: mobilya öncesi kritik",
      "Tadilat / boya sonrası: sıçrantı + toz",
      "Villa teslim: m² + çoklu banyo"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "boya sonrası temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "boya sonrası temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "mobilya-montaj-sonrasi-toz-ucret-2026",
    "title": "Mobilya Montaj Sonrası Toz Ücreti 2026",
    "keyword": "montaj sonrası toz temizlik ücreti",
    "category": "İnşaat Fiyat",
    "hook": "İnce partikül mikrofiber turu ister.",
    "audience": "Yeni mobilya",
    "durationHint": "Birkaç saat",
    "service": "insaat",
    "area": "umraniye",
    "image": "build",
    "tag": "montaj",
    "compareNote": "İnşaat tesliminden daha hafif olabilir.",
    "priceFactors": [
      "Brüt / net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim sayısı",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi ve havalandırma imkanı"
    ],
    "scenarios": [
      "Yeni daire teslim: ince toz programı",
      "Ofis teslim: mobilya öncesi kritik",
      "Tadilat / boya sonrası: sıçrantı + toz",
      "Villa teslim: m² + çoklu banyo"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "montaj sonrası toz temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "montaj sonrası toz temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "yeni-daire-teslim-temizlik-maliyet-2026",
    "title": "Yeni Daire Teslim Temizlik Maliyeti 2026",
    "keyword": "yeni daire teslim temizlik maliyeti",
    "category": "İnşaat Fiyat",
    "hook": "İnce toz turu mobilyadan önce yapılmalı.",
    "audience": "Yeni teslim",
    "durationHint": "m²",
    "service": "insaat",
    "area": "atasehir",
    "image": "build",
    "tag": "teslim",
    "compareNote": "Online tahmin + keşif ikilisi önerilir.",
    "priceFactors": [
      "Brüt / net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim sayısı",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi ve havalandırma imkanı"
    ],
    "scenarios": [
      "Yeni daire teslim: ince toz programı",
      "Ofis teslim: mobilya öncesi kritik",
      "Tadilat / boya sonrası: sıçrantı + toz",
      "Villa teslim: m² + çoklu banyo"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "yeni daire teslim temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "yeni daire teslim temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "ofis-temizlik-gece-vardiya-ucret-farki-2026",
    "title": "Ofis Temizlik Gece Vardiya Ücret Farkı 2026",
    "keyword": "gece ofis temizlik ücreti",
    "category": "Ofis Fiyat",
    "hook": "Gece slotu mesaiyi bölmez; izin maliyeti etkiler.",
    "audience": "Ofis yöneticileri",
    "durationHint": "Gece",
    "service": "ofis",
    "area": "maslak",
    "image": "office",
    "tag": "gece",
    "compareNote": "Gündüz kısa turdan farklı fiyatlanabilir.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "gece ofis temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "gece ofis temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "gece",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "ofis-mutfak-cay-ocagi-temizlik-ucret-2026",
    "title": "Ofis Mutfak Çay Ocağı Temizlik Ücreti 2026",
    "keyword": "ofis mutfak temizlik ücreti",
    "category": "Ofis Fiyat",
    "hook": "Çay ocağı şikâyetlerin başındadır.",
    "audience": "Ofis",
    "durationHint": "Lokal tur",
    "service": "ofis",
    "area": "sisli",
    "image": "office",
    "tag": "çay ocağı",
    "compareNote": "Genel ofis turuna eklenebilir.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "ofis mutfak temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "ofis mutfak temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "plaza-ortak-alan-temizlik-maliyet-2026",
    "title": "Plaza Ortak Alan Temizlik Maliyeti 2026",
    "keyword": "plaza ortak alan temizlik maliyeti",
    "category": "Ofis Fiyat",
    "hook": "Koridor ve wet-room yetkiye göre planlanır.",
    "audience": "Plaza yönetimi",
    "durationHint": "Frekans",
    "service": "ofis",
    "area": "maslak",
    "image": "office",
    "tag": "plaza",
    "compareNote": "Peyzaj yoktur.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "plaza ortak alan temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "plaza ortak alan temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "plaza",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "site-ortak-alan-temizlik-ucret-2026",
    "title": "Site Ortak Alan Temizlik Ücreti 2026",
    "keyword": "site ortak alan temizlik ücreti",
    "category": "Ofis Fiyat",
    "hook": "Lobi, asansör, merdiven periyodu net olmalı.",
    "audience": "Site yönetimi",
    "durationHint": "Frekansa göre",
    "service": "ofis",
    "area": "atasehir",
    "image": "office",
    "tag": "site",
    "compareNote": "Bahçe düzenleme dahil değil.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "site ortak alan temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "site ortak alan temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "magaza-vitrin-zemin-temizlik-ucret-2026",
    "title": "Mağaza Vitrin Zemin Temizlik Ücreti 2026",
    "keyword": "mağaza temizlik ücreti",
    "category": "Ofis Fiyat",
    "hook": "Vitrin camı ve giriş zemini algıyı etkiler.",
    "audience": "Mağaza",
    "durationHint": "Lokal/periyodik",
    "service": "cam",
    "area": "besiktas",
    "image": "window",
    "tag": "mağaza",
    "compareNote": "Cam + zemin ayrı kalem olabilir.",
    "priceFactors": [
      "Cam paneli / cephe sayısı",
      "İç / dış erişim",
      "Yükseklik ve güvenlik planı",
      "Yönetici / site onayı",
      "Tuz–toz birikimi (Boğaz hattı)"
    ],
    "scenarios": [
      "Daire iç cam: kısa randevu",
      "Cam balkon: montaj sonrası toz ayrı",
      "Villa cephe cam: güvenlik planı",
      "Plaza cam: yönetici onayı şart"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "mağaza temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "mağaza temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "mağaza",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "klinik-bekleme-alani-temizlik-ucret-2026",
    "title": "Klinik Bekleme Alanı Temizlik Ücreti 2026",
    "keyword": "klinik bekleme temizlik ücreti",
    "category": "Ofis Fiyat",
    "hook": "Sık dokunma yüzeyleri kritik; hastane sterilizasyonu değildir.",
    "audience": "Klinik",
    "durationHint": "Frekanslı",
    "service": "ofis",
    "area": "sisli",
    "image": "office",
    "tag": "klinik",
    "compareNote": "Tıbbi cihaz temizliği dahil değil.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "klinik bekleme temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "klinik bekleme temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "klinik",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "yeni-is-yeri-acilis-temizlik-maliyet-2026",
    "title": "Yeni İş Yeri Açılış Temizlik Maliyeti 2026",
    "keyword": "iş yeri açılış temizlik maliyeti",
    "category": "Ofis Fiyat",
    "hook": "Açılış öncesi vitrin ve zemin ilk izlenimi belirler.",
    "audience": "Yeni işyeri",
    "durationHint": "Keşif",
    "service": "ofis",
    "area": "kadikoy",
    "image": "office",
    "tag": "açılış",
    "compareNote": "İnşaat tozu varsa ayrı program.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "iş yeri açılış temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "iş yeri açılış temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "açılış",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "koltuk-yikama-takim-ucret-hesap-2026",
    "title": "Koltuk Yıkama Takım Ücret Hesap 2026",
    "keyword": "koltuk yıkama takım ücreti",
    "category": "Koltuk Fiyat",
    "hook": "Takım adedi ve kumaş tipi programı değiştirir.",
    "audience": "Salon takımı",
    "durationHint": "Takıma göre",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "tag": "koltuk",
    "compareNote": "Ev tipi agresif kimyasal risklidir.",
    "priceFactors": [
      "Koltuk/kanepe takım adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Adres erişimi (villa / apartman)"
    ],
    "scenarios": [
      "Tek kanepe: birkaç saat + kuruma",
      "Takım (3+1): yarım gün bandı",
      "Leke odaklı lokal işlem",
      "Pet kokusu: ek süre mümkün"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "koltuk yıkama takım ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "koltuk yıkama takım ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "koltuk",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "koltuk-yikama-leke-ek-ucret-2026",
    "title": "Koltuk Yıkama Leke Ek Ücret 2026",
    "keyword": "koltuk leke yıkama ücreti",
    "category": "Koltuk Fiyat",
    "hook": "Leke yaşı ve tipi ek işlem doğurabilir.",
    "audience": "Leke şikâyeti",
    "durationHint": "Lokal+",
    "service": "koltuk",
    "area": "kadikoy",
    "image": "sofa",
    "tag": "leke",
    "compareNote": "Garanti her lekeyi %100 çıkarmak değildir.",
    "priceFactors": [
      "Koltuk/kanepe takım adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Adres erişimi (villa / apartman)"
    ],
    "scenarios": [
      "Tek kanepe: birkaç saat + kuruma",
      "Takım (3+1): yarım gün bandı",
      "Leke odaklı lokal işlem",
      "Pet kokusu: ek süre mümkün"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "koltuk leke yıkama ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "koltuk leke yıkama ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "sariyer-koltuk-yikama-maliyet-2026",
    "title": "Sarıyer Koltuk Yıkama Maliyeti 2026",
    "keyword": "Sarıyer koltuk yıkama maliyeti",
    "category": "Koltuk Fiyat",
    "hook": "Kuruma süresi randevu gününe yazılır.",
    "audience": "Sarıyer",
    "durationHint": "Birkaç saat+kuruma",
    "service": "koltuk",
    "area": "sariyer",
    "image": "sofa",
    "tag": "sarıyer",
    "compareNote": "Villa erişimi süreye yansıyabilir.",
    "priceFactors": [
      "Koltuk/kanepe takım adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Adres erişimi (villa / apartman)"
    ],
    "scenarios": [
      "Tek kanepe: birkaç saat + kuruma",
      "Takım (3+1): yarım gün bandı",
      "Leke odaklı lokal işlem",
      "Pet kokusu: ek süre mümkün"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Sarıyer koltuk yıkama maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Sarıyer koltuk yıkama maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "hali-yikama-m2-ucret-istanbul-2026",
    "title": "Halı Yıkama m² Ücret İstanbul 2026",
    "keyword": "halı yıkama m² ücreti",
    "category": "Halı Fiyat",
    "hook": "Ölçü + leke/pet notu fiyatı belirler.",
    "audience": "Halı sahipleri",
    "durationHint": "m² + kuruma",
    "service": "hali",
    "area": "kadikoy",
    "image": "carpet",
    "tag": "halı",
    "compareNote": "Kuruma alanı ayırmamak maliyeti artırır (tekrar).",
    "priceFactors": [
      "Halı / kilim m²",
      "Leke ve pet notu",
      "Evde yıkama vs taşıma",
      "Kuruma alanı uygunluğu",
      "Kat / asansör erişimi"
    ],
    "scenarios": [
      "Küçük kilim: kısa evde yıkama",
      "Salon halısı: ölçü + kuruma alanı",
      "Çoklu halı: paket fiyat keşifle",
      "Villa tipi kalın halı: süre uzar"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "halı yıkama m² ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "halı yıkama m² ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "halı",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "zekeriyakoy-hali-yikama-villa-ucret-2026",
    "title": "Zekeriyaköy Halı Yıkama Villa Ücreti 2026",
    "keyword": "Zekeriyaköy halı yıkama ücreti",
    "category": "Halı Fiyat",
    "hook": "Villa tipi halılarda ölçü kritiktir.",
    "audience": "Villa",
    "durationHint": "Boyuta göre",
    "service": "hali",
    "area": "zeker",
    "image": "carpet",
    "tag": "zekeriyaköy",
    "compareNote": "Evde yıkama taşımayı azaltır.",
    "priceFactors": [
      "Halı / kilim m²",
      "Leke ve pet notu",
      "Evde yıkama vs taşıma",
      "Kuruma alanı uygunluğu",
      "Kat / asansör erişimi"
    ],
    "scenarios": [
      "Küçük kilim: kısa evde yıkama",
      "Salon halısı: ölçü + kuruma alanı",
      "Çoklu halı: paket fiyat keşifle",
      "Villa tipi kalın halı: süre uzar"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Zekeriyaköy halı yıkama ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Zekeriyaköy halı yıkama ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "cam-temizlik-yuksek-kat-ucret-2026",
    "title": "Cam Temizlik Yüksek Kat Ücreti 2026",
    "keyword": "yüksek kat cam temizlik ücreti",
    "category": "Cam Fiyat",
    "hook": "Güvenlik ve erişim olmadan yapılmaz.",
    "audience": "Yüksek kat",
    "durationHint": "Keşif",
    "service": "cam",
    "area": "sisli",
    "image": "window",
    "tag": "yüksek kat",
    "compareNote": "İskele/vinç gerekirse ayrı teklif.",
    "priceFactors": [
      "Cam paneli / cephe sayısı",
      "İç / dış erişim",
      "Yükseklik ve güvenlik planı",
      "Yönetici / site onayı",
      "Tuz–toz birikimi (Boğaz hattı)"
    ],
    "scenarios": [
      "Daire iç cam: kısa randevu",
      "Cam balkon: montaj sonrası toz ayrı",
      "Villa cephe cam: güvenlik planı",
      "Plaza cam: yönetici onayı şart"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "yüksek kat cam temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "yüksek kat cam temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "yüksek kat",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "cam-balkon-sonrasi-temizlik-ucret-2026",
    "title": "Cam Balkon Sonrası Temizlik Ücreti 2026",
    "keyword": "cam balkon sonrası temizlik ücreti",
    "category": "Cam Fiyat",
    "hook": "Montaj sonrası inşaat tipi toz kalabilir.",
    "audience": "Cam balkon",
    "durationHint": "Keşif",
    "service": "cam",
    "area": "bakirkoy",
    "image": "window",
    "tag": "cam balkon",
    "compareNote": "Standart cam turundan farklı olabilir.",
    "priceFactors": [
      "Cam paneli / cephe sayısı",
      "İç / dış erişim",
      "Yükseklik ve güvenlik planı",
      "Yönetici / site onayı",
      "Tuz–toz birikimi (Boğaz hattı)"
    ],
    "scenarios": [
      "Daire iç cam: kısa randevu",
      "Cam balkon: montaj sonrası toz ayrı",
      "Villa cephe cam: güvenlik planı",
      "Plaza cam: yönetici onayı şart"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "cam balkon sonrası temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "cam balkon sonrası temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "dis-cephe-temizlik-maliyet-ne-zaman-2026",
    "title": "Dış Cephe Temizlik Maliyeti Ne Zaman? 2026",
    "keyword": "dış cephe temizlik maliyeti",
    "category": "Cephe Fiyat",
    "hook": "Yağmur izi ve cephe kiri görünümü etkiler.",
    "audience": "Site/villa",
    "durationHint": "Cepheye göre",
    "service": "cephe",
    "area": "tarabya",
    "image": "build",
    "tag": "cephe",
    "compareNote": "Peyzaj/bahçe düzenleme yoktur.",
    "priceFactors": [
      "Cephe alanı ve malzeme",
      "Erişim yöntemi (güvenlik)",
      "Kir / tuz birikim seviyesi",
      "Site yönetimi koordinasyonu",
      "Peyzaj yok — yalnızca yüzey"
    ],
    "scenarios": [
      "Küçük villa cephe: keşif şart",
      "Site blok: yönetim koordinasyonu",
      "Boğaz tuzu: periyodik bakım mantıklı",
      "Boyasız yüzey temizliği — boya işi yok"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "dış cephe temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "dış cephe temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "tarabya-deniz-tuzu-cephe-ucret-2026",
    "title": "Tarabya Deniz Tuzu Cephe Ücreti 2026",
    "keyword": "Tarabya cephe temizlik ücreti",
    "category": "Cephe Fiyat",
    "hook": "Tuz birikimi periyodik bakım ister.",
    "audience": "Tarabya",
    "durationHint": "Keşif",
    "service": "cephe",
    "area": "tarabya",
    "image": "build",
    "tag": "tuz",
    "compareNote": "Boyama/izolasyon dahil değil.",
    "priceFactors": [
      "Cephe alanı ve malzeme",
      "Erişim yöntemi (güvenlik)",
      "Kir / tuz birikim seviyesi",
      "Site yönetimi koordinasyonu",
      "Peyzaj yok — yalnızca yüzey"
    ],
    "scenarios": [
      "Küçük villa cephe: keşif şart",
      "Site blok: yönetim koordinasyonu",
      "Boğaz tuzu: periyodik bakım mantıklı",
      "Boyasız yüzey temizliği — boya işi yok"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Tarabya cephe temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Tarabya cephe temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "tuz",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "online-fiyat-vs-kesif-fark-analizi-2026",
    "title": "Online Fiyat vs Keşif Fark Analizi 2026",
    "keyword": "online fiyat keşif farkı",
    "category": "Karar",
    "hook": "Hesaplayıcı tahmindir; keşif yazılı kapsam içindir.",
    "audience": "Online kullananlar",
    "durationHint": "15–40 dk keşif",
    "service": "ev",
    "area": "sariyer",
    "image": "city",
    "tag": "keşif",
    "compareNote": "Fark büyüdükçe kirlilik/erişim notu eksik demektir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "online fiyat keşif farkı için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "online fiyat keşif farkı ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "ucretsiz-kesif-sonrasi-teklif-nasil-2026",
    "title": "Ücretsiz Keşif Sonrası Teklif Nasıl? 2026",
    "keyword": "ücretsiz keşif teklif",
    "category": "Karar",
    "hook": "Keşif ölçü ve öncelikleri netleştirir.",
    "audience": "İlk kez alanlar",
    "durationHint": "Kısa keşif",
    "service": "ev",
    "area": "sariyer",
    "image": "city",
    "tag": "teklif",
    "compareNote": "Satış baskısı değil bilgi turu.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "ücretsiz keşif teklif için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "ücretsiz keşif teklif ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "temizlik-fiyatini-artan-5-hata-2026",
    "title": "Temizlik Fiyatını Artıran 5 Hata 2026",
    "keyword": "temizlik fiyat hataları",
    "category": "Karar",
    "hook": "Kapsamı sözlü bırakmak ve keşifsiz sabit fiyat en pahalı hatalardır.",
    "audience": "Tüm müşteriler",
    "durationHint": "—",
    "service": "ev",
    "area": "sariyer",
    "image": "city",
    "tag": "hata",
    "compareNote": "Yazılı checklist maliyeti kontrol eder.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "temizlik fiyat hataları için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "temizlik fiyat hataları ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "yazili-kapsam-fiyat-garantisi-2026",
    "title": "Yazılı Kapsam Fiyat Garantisi 2026",
    "keyword": "yazılı kapsam fiyat",
    "category": "Karar",
    "hook": "Garanti keşifte yazılan işlerdir.",
    "audience": "Kalite soranlar",
    "durationHint": "—",
    "service": "ev",
    "area": "sariyer",
    "image": "city",
    "tag": "garanti",
    "compareNote": "Keşif dışı ekstra ayrıca teklif edilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "yazılı kapsam fiyat için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "yazılı kapsam fiyat ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "garanti",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "malzeme-dahil-temizlik-ucret-2026",
    "title": "Malzeme Dahil Temizlik Ücreti 2026",
    "keyword": "malzeme dahil temizlik ücreti",
    "category": "Karar",
    "hook": "Standart ürünler ekiple gelir; özel marka önceden yazılır.",
    "audience": "Malzeme merakı",
    "durationHint": "—",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "tag": "malzeme",
    "compareNote": "Özel ürün talebi fiyatı değiştirebilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "malzeme dahil temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "malzeme dahil temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "malzeme",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "ayni-gun-temizlik-ucret-premium-2026",
    "title": "Aynı Gün Temizlik Ücret / Premium 2026",
    "keyword": "aynı gün temizlik ücreti",
    "category": "Karar",
    "hook": "Kapasite uygunsa açılır; garanti slot değildir.",
    "audience": "Acil",
    "durationHint": "Aynı gün",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "tag": "acil",
    "compareNote": "Yoğun günde ertesi gün daha ekonomik olabilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "aynı gün temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "aynı gün temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "profesyonel-vs-gunlukcu-maliyet-2026",
    "title": "Profesyonel vs Gündelikçi Maliyet 2026",
    "keyword": "profesyonel temizlik maliyet karşılaştırma",
    "category": "Karar",
    "hook": "Ekip + checklist ölçeklenebilir sonuç verir.",
    "audience": "Karar vericiler",
    "durationHint": "—",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "tag": "karşılaştırma",
    "compareNote": "Saat ücreti tek başına karşılaştırma kriteri değildir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "profesyonel temizlik maliyet karşılaştırma için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "profesyonel temizlik maliyet karşılaştırma ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "istanbul-avrupa-yakasi-temizlik-maliyet-2026",
    "title": "İstanbul Avrupa Yakası Temizlik Maliyeti 2026",
    "keyword": "Avrupa Yakası temizlik maliyeti",
    "category": "Bölge",
    "hook": "İlçe, villa/daire ve erişim seçimi belirler.",
    "audience": "Avrupa Yakası",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "sariyer",
    "image": "city",
    "tag": "avrupa",
    "compareNote": "Sarıyer–Zekeriyaköy öncelikli operasyon deneyimi.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Avrupa Yakası temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Avrupa Yakası temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "avrupa",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "istanbul-anadolu-yakasi-temizlik-maliyet-2026",
    "title": "İstanbul Anadolu Yakası Temizlik Maliyeti 2026",
    "keyword": "Anadolu Yakası temizlik maliyeti",
    "category": "Bölge",
    "hook": "Kadıköy–Ataşehir hattında planlı randevu yaygındır.",
    "audience": "Anadolu Yakası",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "kadikoy",
    "image": "city",
    "tag": "anadolu",
    "compareNote": "Trafik slot seçimini etkiler.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Anadolu Yakası temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Anadolu Yakası temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "anadolu",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "satis-oncesi-ev-temizlik-maliyet-2026",
    "title": "Satış Öncesi Ev Temizlik Maliyeti 2026",
    "keyword": "satış öncesi ev temizlik maliyeti",
    "category": "Yaşam Fiyat",
    "hook": "Emlak gösterimi öncesi ferahlık algısını güçlendirir.",
    "audience": "Satışa çıkanlar",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "besiktas",
    "image": "home",
    "tag": "satış",
    "compareNote": "Cam eklenirse fotoğraf kalitesi artar.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "satış öncesi ev temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "satış öncesi ev temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "emlak-fotograf-oncesi-temizlik-ucret-2026",
    "title": "Emlak Fotoğraf Öncesi Temizlik Ücreti 2026",
    "keyword": "çekim öncesi temizlik ücreti",
    "category": "Yaşam Fiyat",
    "hook": "Cam ve tezgâh parlaklığı fotoğrafta kritiktir.",
    "audience": "Host/emlak",
    "durationHint": "Kısa+cam",
    "service": "ev",
    "area": "kadikoy",
    "image": "home",
    "tag": "çekim",
    "compareNote": "Derin genel temizlikten kısa olabilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "çekim öncesi temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "çekim öncesi temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kiralik-daire-giris-temizlik-ucret-2026",
    "title": "Kiralık Daire Giriş Temizlik Ücreti 2026",
    "keyword": "kiralık giriş temizlik ücreti",
    "category": "Yaşam Fiyat",
    "hook": "Yeni kiracı girişinde boş ev hijyeni güven verir.",
    "audience": "Kiraya veren",
    "durationHint": "Daireye göre",
    "service": "ev",
    "area": "sisli",
    "image": "home",
    "tag": "kiralık",
    "compareNote": "Depozito çıkış paketinden farklı niyet.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "kiralık giriş temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "kiralık giriş temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "kiralık",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "calisan-cift-temizlik-paket-ucret-2026",
    "title": "Çalışan Çift Temizlik Paket Ücreti 2026",
    "keyword": "çalışan çift temizlik paketi",
    "category": "Yaşam Fiyat",
    "hook": "Hafta içi kısa + hafta sonu derin dengesi.",
    "audience": "Çalışan haneler",
    "durationHint": "Planlı",
    "service": "ev",
    "area": "atasehir",
    "image": "home",
    "tag": "yaşam",
    "compareNote": "Periyodik abonelik uygun olabilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "çalışan çift temizlik paketi için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "çalışan çift temizlik paketi ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "yaşam",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "ogrenci-evi-temizlik-ucret-2026",
    "title": "Öğrenci Evi Temizlik Ücreti 2026",
    "keyword": "öğrenci evi temizlik ücreti",
    "category": "Yaşam Fiyat",
    "hook": "Ortak alan checklist’i çatışmayı azaltır.",
    "audience": "Öğrenci evleri",
    "durationHint": "Kısa",
    "service": "ev",
    "area": "kadikoy",
    "image": "home",
    "tag": "öğrenci",
    "compareNote": "Kapsam önceden yazılmalı.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "öğrenci evi temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "öğrenci evi temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "öğrenci",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "yasli-bakim-hijyen-destek-ucret-siniri-2026",
    "title": "Yaşlı Bakım Hijyen Destek Ücret Sınırı 2026",
    "keyword": "yaşlı bakım hijyen ücreti",
    "category": "Yaşam Fiyat",
    "hook": "Ev temizliği destekler; tıbbi bakım değildir.",
    "audience": "Aileler",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "tag": "bakım",
    "compareNote": "Hemşirelik hizmeti yok.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "yaşlı bakım hijyen ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "yaşlı bakım hijyen ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "bakım",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "grip-sezonu-yuzey-hijyen-ucret-2026",
    "title": "Grip Sezonu Yüzey Hijyen Ücreti 2026",
    "keyword": "yüzey hijyen ücreti grip",
    "category": "Yaşam Fiyat",
    "hook": "Kapı kolu ve batarya turu sezonluk eklenir.",
    "audience": "Aile/ofis",
    "durationHint": "1–3 saat",
    "service": "ev",
    "area": "sisli",
    "image": "home",
    "tag": "hijyen",
    "compareNote": "Hastane sterilizasyonu değildir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "yüzey hijyen ücreti grip için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "yüzey hijyen ücreti grip ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "yesil-urun-tercihi-fiyat-etkisi-2026",
    "title": "Yeşil Ürün Tercihi Fiyat Etkisi 2026",
    "keyword": "yeşil temizlik ürün fiyat",
    "category": "Karar",
    "hook": "Yüzey uyumu esastır; mucize iddia edilmez.",
    "audience": "Hassas kullanıcı",
    "durationHint": "—",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "tag": "yeşil",
    "compareNote": "Özel marka talebi önceden yazılır.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "yeşil temizlik ürün fiyat için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "yeşil temizlik ürün fiyat ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "yeşil",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "whatsapp-teklif-icin-hangi-bilgi-2026",
    "title": "WhatsApp Teklif İçin Hangi Bilgi? 2026",
    "keyword": "WhatsApp temizlik teklif bilgi",
    "category": "AEO Fiyat",
    "hook": "Foto/m²/adres ile ön bilgi; kesin teklif keşifle.",
    "audience": "Hızlı iletişim",
    "durationHint": "—",
    "service": "ev",
    "area": "sariyer",
    "image": "city",
    "tag": "whatsapp",
    "compareNote": "Eksik bilgi tahmin sapmasını büyütür.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "WhatsApp temizlik teklif bilgi için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "WhatsApp temizlik teklif bilgi ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "fiyat-hesaplama-araci-nasil-okunur-2026",
    "title": "Fiyat Hesaplama Aracı Nasıl Okunur? 2026",
    "keyword": "fiyat hesaplama nasıl okunur",
    "category": "AEO Fiyat",
    "hook": "Girdi kalitesi önemlidir; sonucu keşifle doğrulayın.",
    "audience": "İlk adım",
    "durationHint": "—",
    "service": "ev",
    "area": "sariyer",
    "image": "city",
    "tag": "hesaplama",
    "compareNote": "Araç tahmindir, sözleşme değildir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "fiyat hesaplama nasıl okunur için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "fiyat hesaplama nasıl okunur ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "sariyer-periyodik-ev-ucret-paketi-2026",
    "title": "Sarıyer Periyodik Ev Ücret Paketi 2026",
    "keyword": "Sarıyer periyodik ev ücreti",
    "category": "Yerel Fiyat",
    "hook": "Sabit ritim hijyeni korur; villa/daire ayrı planlanır.",
    "audience": "Sarıyer",
    "durationHint": "Ziyaret planı",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "tag": "periyodik",
    "compareNote": "Tek sefer genel temizlik ayrıdır.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Sarıyer periyodik ev ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Sarıyer periyodik ev ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "zekeriyakoy-periyodik-villa-ucret-2026",
    "title": "Zekeriyaköy Periyodik Villa Ücreti 2026",
    "keyword": "Zekeriyaköy periyodik villa ücreti",
    "category": "Yerel Fiyat",
    "hook": "Cam ve ıslak hacim rotasyonu planlanır.",
    "audience": "Villa",
    "durationHint": "Ziyaret planı",
    "service": "ev",
    "area": "zeker",
    "image": "villa",
    "tag": "villa",
    "compareNote": "Peyzaj yoktur.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Zekeriyaköy periyodik villa ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Zekeriyaköy periyodik villa ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "maslak-periyodik-ofis-ucret-2026",
    "title": "Maslak Periyodik Ofis Ücreti 2026",
    "keyword": "Maslak periyodik ofis ücreti",
    "category": "Yerel Fiyat",
    "hook": "Haftalık ritim çöp-mutfak-ıslak hacmi sabitler.",
    "audience": "Plaza ofis",
    "durationHint": "Frekans",
    "service": "ofis",
    "area": "maslak",
    "image": "office",
    "tag": "periyodik",
    "compareNote": "Gece vardiyası ayrıca netleştirilir.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Maslak periyodik ofis ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Maslak periyodik ofis ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "besiktas-cam-temizlik-ucret-detay-2026",
    "title": "Beşiktaş Cam Temizlik Ücret Detay 2026",
    "keyword": "Beşiktaş cam temizlik ücreti",
    "category": "Cam Fiyat",
    "hook": "Yönetici onayı ve güvenlik sık gerekir.",
    "audience": "Beşiktaş",
    "durationHint": "Cam sayısı",
    "service": "cam",
    "area": "besiktas",
    "image": "window",
    "tag": "cam",
    "compareNote": "Yüksek kat keşifsiz istenmemeli.",
    "priceFactors": [
      "Cam paneli / cephe sayısı",
      "İç / dış erişim",
      "Yükseklik ve güvenlik planı",
      "Yönetici / site onayı",
      "Tuz–toz birikimi (Boğaz hattı)"
    ],
    "scenarios": [
      "Daire iç cam: kısa randevu",
      "Cam balkon: montaj sonrası toz ayrı",
      "Villa cephe cam: güvenlik planı",
      "Plaza cam: yönetici onayı şart"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Beşiktaş cam temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Beşiktaş cam temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kadikoy-koltuk-yikama-ucret-2026",
    "title": "Kadıköy Koltuk Yıkama Ücreti 2026",
    "keyword": "Kadıköy koltuk yıkama ücreti",
    "category": "Koltuk Fiyat",
    "hook": "Leke ve kumaş tipi programı değiştirir.",
    "audience": "Kadıköy",
    "durationHint": "Takıma göre",
    "service": "koltuk",
    "area": "kadikoy",
    "image": "sofa",
    "tag": "koltuk",
    "compareNote": "Kuruma süresi planlanmalı.",
    "priceFactors": [
      "Koltuk/kanepe takım adedi",
      "Kumaş tipi ve leke yaşı",
      "Pet / koku ek işlemi",
      "Kuruma süresi planı",
      "Adres erişimi (villa / apartman)"
    ],
    "scenarios": [
      "Tek kanepe: birkaç saat + kuruma",
      "Takım (3+1): yarım gün bandı",
      "Leke odaklı lokal işlem",
      "Pet kokusu: ek süre mümkün"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Kadıköy koltuk yıkama ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Kadıköy koltuk yıkama ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "koltuk",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "umraniye-hali-yikama-ucret-2026",
    "title": "Ümraniye Halı Yıkama Ücreti 2026",
    "keyword": "Ümraniye hali yıkama ücreti",
    "category": "Halı Fiyat",
    "hook": "Evde yıkama taşıma derdini azaltır.",
    "audience": "Ümraniye",
    "durationHint": "m²",
    "service": "hali",
    "area": "umraniye",
    "image": "carpet",
    "tag": "halı",
    "compareNote": "Kuruma alanı şart.",
    "priceFactors": [
      "Halı / kilim m²",
      "Leke ve pet notu",
      "Evde yıkama vs taşıma",
      "Kuruma alanı uygunluğu",
      "Kat / asansör erişimi"
    ],
    "scenarios": [
      "Küçük kilim: kısa evde yıkama",
      "Salon halısı: ölçü + kuruma alanı",
      "Çoklu halı: paket fiyat keşifle",
      "Villa tipi kalın halı: süre uzar"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Ümraniye hali yıkama ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Ümraniye hali yıkama ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "halı",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "sisli-cam-plaza-ucret-2026",
    "title": "Şişli Cam Plaza Ücreti 2026",
    "keyword": "Şişli plaza cam ücreti",
    "category": "Cam Fiyat",
    "hook": "Erişim ve güvenlik planı önce gelir.",
    "audience": "Şişli ofis",
    "durationHint": "Keşif",
    "service": "cam",
    "area": "sisli",
    "image": "window",
    "tag": "cam",
    "compareNote": "Yönetici onayı olmadan başlanmaz.",
    "priceFactors": [
      "Cam paneli / cephe sayısı",
      "İç / dış erişim",
      "Yükseklik ve güvenlik planı",
      "Yönetici / site onayı",
      "Tuz–toz birikimi (Boğaz hattı)"
    ],
    "scenarios": [
      "Daire iç cam: kısa randevu",
      "Cam balkon: montaj sonrası toz ayrı",
      "Villa cephe cam: güvenlik planı",
      "Plaza cam: yönetici onayı şart"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Şişli plaza cam ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Şişli plaza cam ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bakirkoy-tasinma-temizlik-ucret-2026",
    "title": "Bakırköy Taşınma Temizlik Ücreti 2026",
    "keyword": "Bakırköy taşınma temizlik ücreti",
    "category": "Taşınma Fiyat",
    "hook": "Eski–yeni adres planı zaman kazandırır.",
    "audience": "Bakırköy",
    "durationHint": "Daireye göre",
    "service": "ev",
    "area": "bakirkoy",
    "image": "home",
    "tag": "taşınma",
    "compareNote": "İki adres aynı gün mümkün olmayabilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Bakırköy taşınma temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Bakırköy taşınma temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kagithane-insaat-sonrasi-ucret-2026",
    "title": "Kağıthane İnşaat Sonrası Ücreti 2026",
    "keyword": "Kağıthane inşaat sonrası ücreti",
    "category": "İnşaat Fiyat",
    "hook": "İnce toz turu mobilyadan önce.",
    "audience": "Kağıthane",
    "durationHint": "m²",
    "service": "insaat",
    "area": "kagithane",
    "image": "build",
    "tag": "inşaat",
    "compareNote": "Kirlilik sınıfı m² kadar önemlidir.",
    "priceFactors": [
      "Brüt / net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim sayısı",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi ve havalandırma imkanı"
    ],
    "scenarios": [
      "Yeni daire teslim: ince toz programı",
      "Ofis teslim: mobilya öncesi kritik",
      "Tadilat / boya sonrası: sıçrantı + toz",
      "Villa teslim: m² + çoklu banyo"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Kağıthane inşaat sonrası ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Kağıthane inşaat sonrası ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "sariyer-insaat-sonrasi-maliyet-detay-2026",
    "title": "Sarıyer İnşaat Sonrası Maliyet Detay 2026",
    "keyword": "Sarıyer inşaat sonrası maliyeti",
    "category": "İnşaat Fiyat",
    "hook": "Yeni teslimlerde toz programı şart.",
    "audience": "Sarıyer teslim",
    "durationHint": "m²",
    "service": "insaat",
    "area": "sariyer",
    "image": "build",
    "tag": "sarıyer",
    "compareNote": "Villa tesliminde keşif şart.",
    "priceFactors": [
      "Brüt / net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim sayısı",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi ve havalandırma imkanı"
    ],
    "scenarios": [
      "Yeni daire teslim: ince toz programı",
      "Ofis teslim: mobilya öncesi kritik",
      "Tadilat / boya sonrası: sıçrantı + toz",
      "Villa teslim: m² + çoklu banyo"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Sarıyer inşaat sonrası maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Sarıyer inşaat sonrası maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bahcekoy-insaat-sonrasi-ucret-2026",
    "title": "Bahçeköy İnşaat Sonrası Ücreti 2026",
    "keyword": "Bahçeköy inşaat sonrası ücreti",
    "category": "İnşaat Fiyat",
    "hook": "Orman hattı yeni konutlarda toz programı mobilya öncesi.",
    "audience": "Bahçeköy",
    "durationHint": "m²",
    "service": "insaat",
    "area": "bahce",
    "image": "build",
    "tag": "inşaat",
    "compareNote": "Peyzaj dahil değil.",
    "priceFactors": [
      "Brüt / net m² ve kirlilik sınıfı",
      "Alçı–ince toz yoğunluğu",
      "Pencere/pervaz ve ıslak hacim sayısı",
      "Mobilya öncesi mi sonrası mı",
      "Kat erişimi ve havalandırma imkanı"
    ],
    "scenarios": [
      "Yeni daire teslim: ince toz programı",
      "Ofis teslim: mobilya öncesi kritik",
      "Tadilat / boya sonrası: sıçrantı + toz",
      "Villa teslim: m² + çoklu banyo"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Bahçeköy inşaat sonrası ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Bahçeköy inşaat sonrası ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "uskumrukoy-genel-temizlik-ucret-2026",
    "title": "Uskumruköy Genel Temizlik Ücreti 2026",
    "keyword": "Uskumruköy genel temizlik ücreti",
    "category": "Yerel Fiyat",
    "hook": "Kış/erişim slot seçimini etkiler.",
    "audience": "Uskumruköy",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "uskum",
    "image": "home",
    "tag": "uskumruköy",
    "compareNote": "Online tahmin + keşif.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Uskumruköy genel temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Uskumruköy genel temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "tarabya-periyodik-cam-ucret-2026",
    "title": "Tarabya Periyodik Cam Ücreti 2026",
    "keyword": "Tarabya periyodik cam ücreti",
    "category": "Cam Fiyat",
    "hook": "Tuz/toz için periyodik bakım planlanır.",
    "audience": "Tarabya",
    "durationHint": "Periyot",
    "service": "cam",
    "area": "tarabya",
    "image": "window",
    "tag": "cam",
    "compareNote": "Tek seferden birim maliyet farkı olabilir.",
    "priceFactors": [
      "Cam paneli / cephe sayısı",
      "İç / dış erişim",
      "Yükseklik ve güvenlik planı",
      "Yönetici / site onayı",
      "Tuz–toz birikimi (Boğaz hattı)"
    ],
    "scenarios": [
      "Daire iç cam: kısa randevu",
      "Cam balkon: montaj sonrası toz ayrı",
      "Villa cephe cam: güvenlik planı",
      "Plaza cam: yönetici onayı şart"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Tarabya periyodik cam ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Tarabya periyodik cam ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "levent-ofis-temizlik-maliyet-analizi-2026",
    "title": "Levent Ofis Temizlik Maliyet Analizi 2026",
    "keyword": "Levent ofis temizlik maliyeti",
    "category": "Yerel Fiyat",
    "hook": "Beşiktaş–Levent hattında plaza prosedürü kritik.",
    "audience": "Levent ofis",
    "durationHint": "Frekans/gece",
    "service": "ofis",
    "area": "besiktas",
    "image": "office",
    "tag": "levent",
    "compareNote": "Mevcut ofis fiyat sayfalarından farklı açı: maliyet kırılımı.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Levent ofis temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Levent ofis temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "levent",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "nisantasi-butik-ofis-temizlik-ucret-2026",
    "title": "Nişantaşı Butik Ofis Temizlik Ücreti 2026",
    "keyword": "Nişantaşı ofis temizlik ücreti",
    "category": "Yerel Fiyat",
    "hook": "Küçük butik ofiste akşam kısa tur yaygındır.",
    "audience": "Butik ofis",
    "durationHint": "Akşam",
    "service": "ofis",
    "area": "sisli",
    "image": "office",
    "tag": "nişantaşı",
    "compareNote": "Plaza paketinden farklı kapsam.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Nişantaşı ofis temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Nişantaşı ofis temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "nişantaşı",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "etiler-villa-temizlik-maliyet-2026",
    "title": "Etiler Villa Temizlik Maliyeti 2026",
    "keyword": "Etiler villa temizlik maliyeti",
    "category": "Yerel Fiyat",
    "hook": "Villa m² ve cam keşifle netleşir.",
    "audience": "Etiler",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "besiktas",
    "image": "villa",
    "tag": "etiler",
    "compareNote": "Peyzaj yoktur.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Etiler villa temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Etiler villa temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "etiler",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bebek-arnavutkoy-ev-temizlik-ucret-2026",
    "title": "Bebek Arnavutköy Ev Temizlik Ücreti 2026",
    "keyword": "Bebek Arnavutköy temizlik ücreti",
    "category": "Yerel Fiyat",
    "hook": "Boğaz hattı erişim ve otopark notu fiyatı etkiler.",
    "audience": "Beşiktaş sahil",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "besiktas",
    "image": "home",
    "tag": "bebek",
    "compareNote": "Cam tuzu birikimi ek kalem olabilir.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Bebek Arnavutköy temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Bebek Arnavutköy temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "goztepe-ev-temizlik-maliyet-detay-2026",
    "title": "Göztepe Ev Temizlik Maliyet Detay 2026",
    "keyword": "Göztepe ev temizlik maliyeti",
    "category": "Yerel Fiyat",
    "hook": "Kadıköy içi mahalle erişimi planı etkiler.",
    "audience": "Göztepe",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "kadikoy",
    "image": "home",
    "tag": "göztepe",
    "compareNote": "Mevcut fiyat sluğundan farklı: maliyet kırılımı odaklı.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Göztepe ev temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Göztepe ev temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "göztepe",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "bostanci-ev-temizlik-ucret-2026",
    "title": "Bostancı Ev Temizlik Ücreti 2026",
    "keyword": "Bostancı ev temizlik ücreti",
    "category": "Yerel Fiyat",
    "hook": "Sahil konutlarında cam opsiyonu sık sorulur.",
    "audience": "Bostancı",
    "durationHint": "Keşif",
    "service": "ev",
    "area": "kadikoy",
    "image": "home",
    "tag": "bostancı",
    "compareNote": "Genel + cam ayrı yazılmalı.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Bostancı ev temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Bostancı ev temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "bostancı",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "kozyatagi-ofis-temizlik-ucret-2026",
    "title": "Kozyatağı Ofis Temizlik Ücreti 2026",
    "keyword": "Kozyatağı ofis temizlik ücreti",
    "category": "Yerel Fiyat",
    "hook": "İş merkezi frekansı maliyeti belirler.",
    "audience": "Kozyatağı",
    "durationHint": "Frekans",
    "service": "ofis",
    "area": "kadikoy",
    "image": "office",
    "tag": "kozyatağı",
    "compareNote": "Gece slotu ayrıca.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "Kozyatağı ofis temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "Kozyatağı ofis temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "kozyatağı",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "finans-merkezi-ofis-temizlik-maliyet-2026",
    "title": "Finans Merkezi Ofis Temizlik Maliyeti 2026",
    "keyword": "finans merkezi ofis temizlik maliyeti",
    "category": "Ofis Fiyat",
    "hook": "Ümraniye/Ataşehir finans çevresinde güvenlik prosedürü kritik.",
    "audience": "Kurumsal ofis",
    "durationHint": "Gece/frekans",
    "service": "ofis",
    "area": "umraniye",
    "image": "office",
    "tag": "finans",
    "compareNote": "Tek sefer vs abonelik farkı büyüktür.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "finans merkezi ofis temizlik maliyeti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "finans merkezi ofis temizlik maliyeti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "finans",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "rezidans-ortak-alan-temizlik-ucret-2026",
    "title": "Rezidans Ortak Alan Temizlik Ücreti 2026",
    "keyword": "rezidans ortak alan ücreti",
    "category": "Ofis Fiyat",
    "hook": "Lobi ve wet-room yönetimi net kapsam ister.",
    "audience": "Rezidans yönetimi",
    "durationHint": "Frekans",
    "service": "ofis",
    "area": "atasehir",
    "image": "office",
    "tag": "rezidans",
    "compareNote": "Daire içi temizlik ayrı pakettir.",
    "priceFactors": [
      "Ofis m² ve workstation sayısı",
      "Frekans (günlük / haftalık / tek sefer)",
      "Mesai dışı / gece / plaza güvenlik izni",
      "Mutfak–çay ocağı ve ıslak hacim adedi",
      "Ortak alan (koridor) dahil mi?"
    ],
    "scenarios": [
      "Küçük butik ofis: akşam kısa tur",
      "Açık ofis katı: gece vardiyası",
      "Plaza: güvenlik + asansör prosedürü",
      "Periyodik sözleşme: frekans fiyatı düşürür"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "rezidans ortak alan ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "rezidans ortak alan ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "rezidans",
      "fiyat",
      "istanbul",
      "2026",
      "temizlik"
    ]
  },
  {
    "slug": "hafta-sonu-temizlik-ucret-farki-2026",
    "title": "Hafta Sonu Temizlik Ücret Farkı 2026",
    "keyword": "hafta sonu temizlik ücreti",
    "category": "Karar",
    "hook": "Hafta sonu slotları erken dolar; Cuma rezervasyonu önerilir.",
    "audience": "Hafta sonu",
    "durationHint": "Yarım–bir gün",
    "service": "ev",
    "area": "sariyer",
    "image": "home",
    "tag": "hafta sonu",
    "compareNote": "Aynı gün acilden farklı dinamik.",
    "priceFactors": [
      "Net m² ve oda/banyo sayısı",
      "Dolu / boş ev (eşya koruma süresi)",
      "Kirlilik seviyesi ve ıslak hacim yoğunluğu",
      "Kat, asansör, otopark / site girişi",
      "Ek işler: cam, koltuk, fırın içi vb."
    ],
    "scenarios": [
      "1+1 / stüdyo: kısa tur, mutfak+banyo odaklı",
      "2+1–3+1 aile: yarım–bir gün tipik",
      "Villa / dubleks: keşif + kat kat plan",
      "Taşınma sonrası: boşaltma checklist ayrı paketlenir"
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
      "Online tahmin veya foto/m² paylaş",
      "Keşif / brifing ile kapsam yaz",
      "Teklif onayı",
      "Checklist’li uygulama"
    ],
    "mistakes": [
      "Keşifsiz sabit fiyat dayatmak",
      "Kapsamı sözlü bırakmak",
      "Erişim/güvenlik bilgisini vermemek"
    ],
    "priceNote": "hafta sonu temizlik ücreti için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.",
    "faq": [
      {
        "q": "hafta sonu temizlik ücreti ne kadar tutar?",
        "a": "m², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir."
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
      "hafta sonu",
      "fiyat",
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

function expand(t: V8Topic): PricingGuideConfig {
  const service = SERVICE[t.service];
  const area = AREA[t.area];
  const intro = `${t.hook} ${area.label} ve İstanbul genelinde ${t.keyword} için şeffaf maliyet rehberi.`;
  return {
    slug: t.slug,
    title: t.title,
    metaTitle: t.title.length <= 60 ? t.title : `${t.title.slice(0, 59).trimEnd()}…`,
    metaDesc: metaDesc(t.keyword, t.hook),
    excerpt: t.hook,
    image: IMG[t.image],
    category: t.category,
    tags: [...new Set([...t.tags, 'fiyat rehberi', 'istanbul'])].slice(0, 8),
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
          `Sarıyer / Zekeriyaköy öncelikli operasyon deneyimiyle ${service.label.toLowerCase()} paketlerinde yazılı kapsam sunuyoruz.`,
          'Peyzaj yoktur. Telefon / WhatsApp: 0551 925 09 43.',
        ],
        bullets: ['Online fiyat hesaplama = tahmin', 'Ücretsiz keşif', 'Checklist teslim'],
      },
    ],
  };
}

export function generateAllV8Posts(): BlogSeedPost[] {
  if (TOPICS.length !== 100) throw new Error(`V8 sayı hatası: ${TOPICS.length}/100`);
  return TOPICS.map((t) => makePricingGuidePost(expand(t)));
}

export function listV8Slugs(): string[] {
  return TOPICS.map((t) => t.slug);
}
