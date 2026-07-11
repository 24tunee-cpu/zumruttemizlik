/**
 * Niyet (use-case) bazlı SEO siloları — /cozumler/{slug}
 * Faz 1: Hub + 5 ticari niyet landing (ilçe varyantları Faz 2).
 */

export type IntentFaq = { q: string; a: string };

export type IntentProcessStep = { title: string; description: string };

export type IntentDistrictLink = { slug: string; name: string };

export type IntentLanding = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  /** İlgili hizmet detay sayfası */
  serviceSlug: string;
  priceHint: string;
  /** Fiyat blog slug */
  blogSlug?: string;
  includes: string[];
  processSteps: IntentProcessStep[];
  faq: IntentFaq[];
  relatedIntentSlugs: string[];
  priorityDistricts: IntentDistrictLink[];
  /** Fiyat hesaplama sayfası anchor ipucu */
  calculatorAnchor?: string;
};

export const INTENT_LANDINGS: IntentLanding[] = [
  {
    slug: 'insaat-sonrasi-temizlik',
    name: 'İnşaat Sonrası Temizlik',
    metaTitle: 'İnşaat Sonrası Temizlik İstanbul | Teslim Öncesi Detay Temizlik',
    metaDescription:
      'İstanbul inşaat ve tadilat sonrası detay temizlik: ince toz, boya izleri, cam ve zemin teslim hazırlığı. Sarıyer, Zekeriyaköy ve Avrupa Yakası. Ücretsiz keşif.',
    keywords: [
      'inşaat sonrası temizlik istanbul',
      'tadilat sonrası temizlik',
      'inşaat sonrası detay temizlik',
      'teslim öncesi temizlik',
      'inşaat tozu temizliği',
      'zekeriyaköy inşaat sonrası temizlik',
    ],
    heroBadge: 'Teslim Öncesi Temizlik',
    heroTitle: 'İnşaat & Tadilat Sonrası Profesyonel Temizlik',
    heroDescription:
      'İnce inşaat tozu, boya-sıva kalıntıları, dolap içleri ve cam yüzeylerde teslim standardında detay temizlik. Sarıyer, Zekeriyaköy ve İstanbul genelinde hızlı ekip yönlendirmesi.',
    serviceSlug: 'insaat-sonrasi-temizlik',
    priceHint: "45–120 TL/m² · taban 8.000 TL'den",
    blogSlug: 'insaat-sonrasi-temizlik-fiyatlari-2026',
    includes: [
      'İnce toz ve moloz kalıntısı temizliği',
      'Boya, sıva ve silikon izleri',
      'Mutfak-dolap içi ve ankastre çevresi',
      'Banyo fayans derz ve armatür parlatma',
      'Cam, pervaz ve kapı kasası detayı',
      'Zemin türüne uygun son cilalama',
    ],
    processSteps: [
      { title: 'Keşif & kapsam', description: 'Metrekare, kirlilik seviyesi ve teslim tarihine göre plan.' },
      { title: 'Ekip & ekipman', description: 'Endüstriyel vakum, zemin makinesi ve yüzeye özel kimyasallar.' },
      { title: 'Detay uygulama', description: 'Islak hacimler, mutfak, cam ve zemin aşamalı temizlik.' },
      { title: 'Teslim kontrolü', description: 'Müşteri veya müteahhit ile birlikte son kontrol listesi.' },
    ],
    faq: [
      {
        q: 'İnşaat sonrası temizlik kaç gün sürer?',
        a: 'Metrekare ve kirlilik seviyesine göre değişir. Orta büyüklükte dairelerde genelde 1–2 gün, villalarda 2–4 gün planlanır.',
      },
      {
        q: 'Tadilat sonrası ile inşaat sonrası temizlik aynı mı?',
        a: 'Kapsam benzerdir; tadilat sonrasında daha çok ince toz ve lokal izler, yeni inşaatta ise daha geniş alan ve ağır kalıntılar söz konusu olabilir.',
      },
      {
        q: 'Fiyat nasıl hesaplanır?',
        a: 'Metrekare bazlı birim fiyat + erişim zorluğu + cam/cephe ihtiyacı. Online fiyat aracımız tahmini aralık verir; kesin fiyat ücretsiz keşifte netleşir.',
      },
      {
        q: 'Zekeriyaköy villalarında hizmet veriyor musunuz?',
        a: 'Evet. Zekeriyaköy ve Sarıyer öncelikli bölgelerimizdir; geniş metrekârlı villalar için çok ekipli operasyon planlıyoruz.',
      },
    ],
    relatedIntentSlugs: ['bos-ev-temizligi', 'tasinma-temizligi', 'kira-teslim-temizligi'],
    priorityDistricts: [
      { slug: 'sariyer', name: 'Sarıyer' },
      { slug: 'besiktas', name: 'Beşiktaş' },
      { slug: 'sisli', name: 'Şişli' },
      { slug: 'kagithane', name: 'Kağıthane' },
    ],
    calculatorAnchor: 'insaat',
  },
  {
    slug: 'tasinma-temizligi',
    name: 'Taşınma Temizliği',
    metaTitle: 'Taşınma Öncesi & Sonrası Temizlik İstanbul | Eşyasız Daire',
    metaDescription:
      'Taşınma öncesi ve sonrası profesyonel temizlik: boş daire, eşyalı teslim, yeni eve yerleşmeden hijyen. Sarıyer, Zekeriyaköy, İstanbul Avrupa Yakası.',
    keywords: [
      'taşınma öncesi temizlik',
      'taşınma sonrası temizlik istanbul',
      'eve taşınmadan önce temizlik',
      'boş daire taşınma temizliği',
      'yeni ev temizliği taşınma',
    ],
    heroBadge: 'Taşınma Öncesi & Sonrası',
    heroTitle: 'Taşınma Öncesi ve Sonrası Temizlik',
    heroDescription:
      'Eski evden çıkmadan önce teslim standardı veya yeni eve girmeden hijyenik başlangıç. Taşınma tarihinize göre planlı ekip, Sarıyer ve İstanbul geneli.',
    serviceSlug: 'ev-temizligi',
    priceHint: "3.500 TL'den · oda paketi",
    blogSlug: 'tasinma-sonrasi-temizlik-istanbul-eve-yerlesmeden-once-yapilacaklar',
    includes: [
      'Boş daire genel temizlik (taşınma öncesi/sonrası)',
      'Mutfak ve banyo derinlemesine hijyen',
      'Dolap içi ve çekmece temizliği',
      'Cam, pervaz ve kapı kasası',
      'Zemin türüne uygun yıkama / silme',
      'Buzdolabı ve fırın içi (hediye)',
    ],
    processSteps: [
      { title: 'Tarih planlama', description: 'Taşınma ve teslim gününe göre randevu slotu.' },
      { title: 'Alan tespiti', description: 'Boş / eşyalı durum, oda sayısı ve özel istekler.' },
      { title: 'Derin temizlik', description: 'Islak hacimler, mutfak, zemin ve cam aşamaları.' },
      { title: 'Teslim', description: 'Anahtar teslimine hazır, kokusuz ve hijyenik mekân.' },
    ],
    faq: [
      {
        q: 'Taşınma öncesi mi sonrası mı yaptırmalıyım?',
        a: 'Eski evde depozito iadesi için taşınma öncesi; yeni evde hijyen için taşınma sonrası (eşya girmeden önce) idealdir. İkisini birlikte planlayabilirsiniz.',
      },
      {
        q: 'Eşyalı dairede taşınma temizliği yapılır mı?',
        a: 'Evet, mobilya konumuna göre erişilebilir alanlar temizlenir. Tam boş daire temizliği daha kapsamlı sonuç verir.',
      },
      {
        q: 'Aynı gün hizmet mümkün mü?',
        a: 'Yoğunluğa bağlıdır; acil taşınmalarda WhatsApp veya telefon ile aynı gün slot sorabilirsiniz.',
      },
    ],
    relatedIntentSlugs: ['kira-teslim-temizligi', 'bos-ev-temizligi', 'insaat-sonrasi-temizlik'],
    priorityDistricts: [
      { slug: 'sariyer', name: 'Sarıyer' },
      { slug: 'besiktas', name: 'Beşiktaş' },
      { slug: 'kadikoy', name: 'Kadıköy' },
      { slug: 'atasehir', name: 'Ataşehir' },
    ],
    calculatorAnchor: 'ev',
  },
  {
    slug: 'kira-teslim-temizligi',
    name: 'Kira Teslim Temizliği',
    metaTitle: 'Kira Öncesi & Sonrası Temizlik İstanbul | Depozito Teslim',
    metaDescription:
      'Kira öncesi ve sonrası profesyonel temizlik: kiracı çıkış, mal sahibi teslim, depozito iadesi. Sarıyer, Zekeriyaköy ve İstanbul geneli. Ücretsiz keşif.',
    keywords: [
      'kira öncesi temizlik',
      'kira sonrası temizlik istanbul',
      'depozito temizliği',
      'kiracı çıkış temizliği',
      'ev sahibi teslim temizliği',
    ],
    heroBadge: 'Kira & Depozito',
    heroTitle: 'Kira Öncesi ve Sonrası Teslim Temizliği',
    heroDescription:
      'Kiracı çıkışında depozito standardı veya yeni kiracıya teslim öncesi profesyonel temizlik. Kontrol listesi ile eksiksiz hijyen, Sarıyer ve İstanbul geneli.',
    serviceSlug: 'ev-temizligi',
    priceHint: "3.500 TL'den · oda paketi",
    blogSlug: 'bos-ev-temizligi-istanbul-kiralama-ve-satis-oncesi-hazirlik-listesi',
    includes: [
      'Kiracı çıkış / mal sahibi teslim standardı',
      'Mutfak-grease ve banyo kireç odaklı temizlik',
      'Dolap içi, ocak ve davlumbaz çevresi',
      'Cam ve pervaz detayı',
      'Zemin derinlemesine temizlik',
      'Koku giderme ve son kontrol',
    ],
    processSteps: [
      { title: 'Teslim standardı', description: 'Sözleşme veya emlakçı checklist’ine göre kapsam.' },
      { title: 'Derin uygulama', description: 'Islak hacimler ve mutfak ağırlıklı çalışma.' },
      { title: 'Fotoğraflı rapor', description: 'İsteğe bağlı teslim öncesi görsel kayıt.' },
      { title: 'Anahtar teslimi', description: 'Depozito veya yeni kiracı için hazır mekân.' },
    ],
    faq: [
      {
        q: 'Depozito iadesi için temizlik yeterli mi?',
        a: 'Profesyonel kira teslim temizliği, çoğu sözleşmedeki “temiz teslim” maddesini karşılar. Ağır hasar veya boya ihtiyacı ayrı değerlendirilir.',
      },
      {
        q: 'Kira öncesi temizlik ne kadar sürer?',
        a: '2+1 daire ortalama 4–6 saat; 3+1 ve üzeri veya uzun süre kiralanmamış dairelerde daha uzun planlanır.',
      },
      {
        q: 'Mal sahibi adına hizmet alabilir miyim?',
        a: 'Evet. Emlakçı veya ev sahibi adına randevu oluşturabilir, fatura ve teslim notu talep edebilirsiniz.',
      },
    ],
    relatedIntentSlugs: ['tasinma-temizligi', 'bos-ev-temizligi', 'insaat-sonrasi-temizlik'],
    priorityDistricts: [
      { slug: 'sariyer', name: 'Sarıyer' },
      { slug: 'sisli', name: 'Şişli' },
      { slug: 'bakirkoy', name: 'Bakırköy' },
      { slug: 'umraniye', name: 'Ümraniye' },
    ],
    calculatorAnchor: 'ev',
  },
  {
    slug: 'bos-ev-temizligi',
    name: 'Boş Ev Temizliği',
    metaTitle: 'Boş Ev Temizliği İstanbul | Satış & Kiralama Öncesi',
    metaDescription:
      'Satış veya kiralama öncesi boş ev temizliği: emlak sunumu, fotoğraf çekimi ve hızlı teslim. Sarıyer, Zekeriyaköy villa ve daire. Ücretsiz keşif.',
    keywords: [
      'boş ev temizliği istanbul',
      'satış öncesi temizlik',
      'kiralama öncesi temizlik',
      'emlak sunum temizliği',
      'boş daire temizliği',
    ],
    heroBadge: 'Satış & Kiralama',
    heroTitle: 'Boş Ev Temizliği — Satış ve Kiralama Öncesi',
    heroDescription:
      'Emlak ilanı öncesi, alıcı/kiracı ziyareti veya portföy fotoğrafı için boş daire ve villa temizliği. Sarıyer, Zekeriyaköy ve İstanbul genelinde hızlı randevu.',
    serviceSlug: 'ev-temizligi',
    priceHint: "3.500 TL'den · oda paketi",
    blogSlug: 'bos-ev-temizligi-istanbul-kiralama-ve-satis-oncesi-hazirlik-listesi',
    includes: [
      'Tüm odalar ve koridorlar',
      'Mutfak ve banyo showroom standardı',
      'Cam ve aydınlık alanlar',
      'Dolap içi boş alan temizliği',
      'Zemin parlatma / yıkama',
      'Hafif koku giderme',
    ],
    processSteps: [
      { title: 'Ön değerlendirme', description: 'Boş alan, metrekare ve emlak sunum tarihi.' },
      { title: 'Showroom temizlik', description: 'Fotoğraf ve ziyaret için görsel odaklı uygulama.' },
      { title: 'Son rötuş', description: 'Cam, kapı ve ıslak hacim detay kontrolü.' },
      { title: 'Teslim', description: 'Anahtar emlakçı veya mal sahibine hazır.' },
    ],
    faq: [
      {
        q: 'Emlak fotoğrafı öncesi temizlik ne kadar sürer?',
        a: 'Standart 2+1 için yarım gün; villa ve geniş metrekârlarda tam gün planlanabilir.',
      },
      {
        q: 'İnşaat sonrası ile boş ev temizliği farkı nedir?',
        a: 'İnşaat sonrasında ince toz ve yapı kalıntıları ağırlıklıdır; boş ev temizliğinde genel hijyen ve sunum standardı hedeflenir.',
      },
    ],
    relatedIntentSlugs: ['kira-teslim-temizligi', 'tasinma-temizligi', 'insaat-sonrasi-temizlik'],
    priorityDistricts: [
      { slug: 'sariyer', name: 'Sarıyer' },
      { slug: 'besiktas', name: 'Beşiktaş' },
      { slug: 'kadikoy', name: 'Kadıköy' },
      { slug: 'maltepe', name: 'Maltepe' },
    ],
    calculatorAnchor: 'ev',
  },
  {
    slug: 'ofis-temizligi',
    name: 'Ofis & Kurumsal Temizlik',
    metaTitle: 'Ofis Temizliği İstanbul | Kurumsal & Plaza Hijyeni',
    metaDescription:
      'İstanbul ofis ve plaza temizliği: günlük, haftalık, aylık planlar. Maslak, Levent, Şişli, Sarıyer. Mesai dışı uygulama, kurumsal sözleşme. Ücretsiz keşif.',
    keywords: [
      'ofis temizliği istanbul',
      'kurumsal ofis temizliği',
      'plaza temizlik şirketi',
      'mesai dışı ofis temizliği',
      'maslak ofis temizliği',
    ],
    heroBadge: 'Kurumsal Hijyen',
    heroTitle: 'Ofis & Kurumsal Temizlik Hizmeti',
    heroDescription:
      'Plaza, ofis ve iş yerlerinde düzenli hijyen planı. Maslak, Levent, Şişli ve Sarıyer hattında mesai dışı uygulama, şeffaf m² fiyatlandırma ve kurumsal sözleşme.',
    serviceSlug: 'ofis-temizligi',
    priceHint: '25–55 TL/m² · taban 2.500 TL',
    blogSlug: 'ofis-temizligi-fiyatlari-2026-istanbul',
    includes: [
      'Genel ofis alanı ve koridorlar',
      'Mutfak / pantry ve ortak alanlar',
      'WC ve lavabo hijyeni',
      'Cam iç yüzey (isteğe bağlı dış)',
      'Çöp toplama ve hafif düzen',
      'Mesai dışı veya hafta sonu slot',
    ],
    processSteps: [
      { title: 'Keşif & metrekare', description: 'Kat planı, personel yoğunluğu ve sıklık (günlük/haftalık).' },
      { title: 'Teklif & sözleşme', description: 'Kapsam, fiyat ve SLA netleştirme.' },
      { title: 'Pilot uygulama', description: 'İlk hafta deneme ve checklist uyumu.' },
      { title: 'Düzenli operasyon', description: 'Sabit ekip ve kalite kontrol.' },
    ],
    faq: [
      {
        q: 'Ofis temizliği mesai saatlerinde yapılır mı?',
        a: 'Evet; çoğu kurumsal müşterimizde mesai dışı veya hafta sonu planlanır. İş akışınızı aksatmayacak şekilde slot ayarlanır.',
      },
      {
        q: 'Günlük mü haftalık mı daha ekonomik?',
        a: 'Personel sayısı ve hijyen beklentisine göre değişir. Keşif sonrası günlük / haftalık / aylık paket karşılaştırması sunuyoruz.',
      },
      {
        q: 'Maslak ve Levent’te hizmet var mı?',
        a: 'Evet. Avrupa Yakası plaza ve ofis yoğunluklu bölgelerde düzenli operasyon yapıyoruz.',
      },
    ],
    relatedIntentSlugs: ['insaat-sonrasi-temizlik', 'tasinma-temizligi'],
    priorityDistricts: [
      { slug: 'sariyer', name: 'Sarıyer' },
      { slug: 'sisli', name: 'Şişli' },
      { slug: 'besiktas', name: 'Beşiktaş' },
      { slug: 'kagithane', name: 'Kağıthane' },
    ],
    calculatorAnchor: 'ofis',
  },
];

export function getIntentBySlug(slug: string): IntentLanding | undefined {
  return INTENT_LANDINGS.find((i) => i.slug === slug);
}

export function allIntentSlugs(): string[] {
  return INTENT_LANDINGS.map((i) => i.slug);
}

export function allIntentPaths(): string[] {
  return ['/cozumler', ...INTENT_LANDINGS.map((i) => `/cozumler/${i.slug}`)];
}

export function getRelatedIntents(slugs: string[]): IntentLanding[] {
  return slugs
    .map((s) => getIntentBySlug(s))
    .filter((i): i is IntentLanding => i !== undefined);
}
