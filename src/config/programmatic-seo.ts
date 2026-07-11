export type DistrictLanding = {
  slug: string;
  name: string;
  populationNote: string;
  neighborhoods: string[];
  /** Yerel SEO ve meta metinlerinde yaka bağlamı */
  side?: 'anadolu' | 'avrupa';
  /** Kısa tanıtım cümlesi (mahalle + operasyon odağı) */
  regionBlurb?: string;
  /** İlçeye özel operasyon ve yerel sinyal notları */
  localSignals?: string[];
  /** İlçeye özel derin içerik (özellikle ana lokasyonlarda) */
  deepDive?: string[];
};

export type ServiceLanding = {
  slug: string;
  name: string;
  shortPitch: string;
  intentKeywords: string[];
  blogTagHints: string[];
  faq: Array<{ q: string; a: string }>;
};

export type ProgrammaticContentVariant = {
  heroLead: string;
  trustPoints: string[];
  processSteps: string[];
  localAngle: string;
};

type ProgrammaticMetaOverride = {
  title?: string;
  description?: string;
};

import metaOverrides from '@/config/programmatic-meta-overrides.json';

export const DISTRICT_LANDINGS: DistrictLanding[] = [
  {
    slug: 'atasehir',
    name: 'Ataşehir',
    side: 'anadolu',
    populationNote: 'yoğun site yaşamı ve kurumsal ofis trafiği',
    regionBlurb:
      'Finans ve iş merkezi yoğunluğu yüksek; plaza, AVM ve rezidanslarda düzenli operasyon planları kuruyoruz.',
    neighborhoods: ['Atatürk', 'Küçükbakkalköy', 'İçerenköy', 'Barbaros', 'Yenişehir', 'Mustafa Kemal'],
  },
  {
    slug: 'kadikoy',
    name: 'Kadıköy',
    side: 'anadolu',
    populationNote: 'yüksek konut yoğunluğu ve hızlı randevu ihtiyacı',
    regionBlurb:
      'Merkezi konum ve çok çeşitli konut/ofis dokusu; aynı gün veya ertesi gün ekip yönlendirmesi yapıyoruz.',
    neighborhoods: ['Göztepe', 'Kozyatağı', 'Erenköy', 'Moda', 'Fenerbahçe', 'Bostancı', 'Suadiye'],
  },
  {
    slug: 'uskudar',
    name: 'Üsküdar',
    side: 'anadolu',
    populationNote: 'konut + ofis karışımı bölgelerde düzenli temizlik talebi',
    regionBlurb:
      'Boğaz hattı ve iç bölgelerde apartman, villa ve işyeri temizliklerinde esnek saatler sunuyoruz.',
    neighborhoods: ['Acıbadem', 'Altunizade', 'Çengelköy', 'Bulgurlu', 'Ünalan', 'Kısıklı'],
  },
  {
    slug: 'besiktas',
    name: 'Beşiktaş',
    side: 'avrupa',
    populationNote: 'yüksek tempolu iş merkezleri ve butik ofis yapısı',
    regionBlurb:
      'Levent ve çevresinde kurumsal hijyen, butik ofis ve rezidans projelerinde deneyimli ekipler.',
    neighborhoods: ['Levent', 'Etiler', 'Ortaköy', 'Bebek', 'Arnavutköy', 'Abbasağa'],
  },
  {
    slug: 'sisli',
    name: 'Şişli',
    side: 'avrupa',
    populationNote: 'plaza ve apartman temizliklerinde süreklilik beklentisi',
    regionBlurb:
      'Plaza, rezidans ve perakende hatlarında gece veya mesai dışı temizlik planlaması yapıyoruz.',
    neighborhoods: ['Mecidiyeköy', 'Fulya', 'Nişantaşı', 'Harbiye', 'Osmanbey', 'Bomonti'],
  },
  {
    slug: 'bakirkoy',
    name: 'Bakırköy',
    side: 'avrupa',
    populationNote: 'aile konutlarında periyodik temizlik ihtiyacı',
    regionBlurb:
      'Sahil ve iç mahallelerde konut, ofis ve mağaza temizliklerinde düzenli sözleşmeli hizmet veriyoruz.',
    neighborhoods: ['Ataköy', 'Yeşilköy', 'Florya', 'Zeytinlik', 'Kartaltepe', 'Şenlikköy'],
  },
  {
    slug: 'bahcelievler',
    name: 'Bahçelievler',
    side: 'avrupa',
    populationNote: 'orta-yoğun konut alanlarında uygun fiyat beklentisi',
    regionBlurb:
      'Geniş apartman dokusunda periyodik ev temizliği ve taşınma öncesi/sonrası paketler sunuyoruz.',
    neighborhoods: ['Yenibosna', 'Şirinevler', 'Soğanlı', 'Kocasinan', 'Çobançeşme', 'Bahçelievler Merkez'],
  },
  {
    slug: 'pendik',
    name: 'Pendik',
    side: 'anadolu',
    populationNote: 'geniş ilçe ölçeğinde planlı ekip yönlendirme ihtiyacı',
    regionBlurb:
      'Havalimanı ve sanayi çevresi dahil geniş coğrafyada rota bazlı ekip planlaması yapıyoruz.',
    neighborhoods: ['Kurtköy', 'Çamçeşme', 'Kaynarca', 'Velibaba', 'Pendik Merkez', 'Güzelyalı'],
  },
  {
    slug: 'umraniye',
    name: 'Ümraniye',
    side: 'anadolu',
    populationNote: 'site ve iş merkezi yoğunluğu ile hızlı büyüyen talep',
    regionBlurb:
      'Finans Merkezi ve çevresinde ofis, mağaza ve rezidans temizliklerinde yoğun operasyon kapasitesi.',
    neighborhoods: ['İnkılap', 'Şerifali', 'Atakent', 'Çakmak', 'Site', 'Parseller'],
  },
  {
    slug: 'maltepe',
    name: 'Maltepe',
    side: 'anadolu',
    populationNote: 'sahil şeridi ve konut projelerinde düzenli hizmet ihtiyacı',
    regionBlurb:
      'Sahil hattı ve iç mahallelerde daire, dubleks ve işyeri temizliklerinde hızlı randevu.',
    neighborhoods: ['Cevizli', 'Feyzullah', 'Gülsuyu', 'Altıntepe', 'Bağlarbaşı', 'İdealtepe'],
  },
  {
    slug: 'kartal',
    name: 'Kartal',
    side: 'anadolu',
    populationNote: 'konut + OSB çevresinde çeşitli temizlik senaryoları',
    regionBlurb:
      'Yakın çevre sanayi ve konut bölgelerinde inşaat sonrası ve periyodik temizlik paketleri.',
    neighborhoods: ['Yakacık', 'Soğanlık', 'Uğur Mumcu', 'Hürriyet', 'Orhantepe', 'Topselvi'],
  },
  {
    slug: 'sariyer',
    name: 'Sarıyer',
    side: 'avrupa',
    populationNote: 'Zekeriyaköy başta olmak üzere villa, site ve yüksek gelir segmentinde detay beklentisi',
    regionBlurb:
      'Zekeriyaköy, Bahçeköy ve Boğaz hattındaki villa ve sitelerde hijyen ve güven odaklı, titiz temizlik uyguluyoruz. Sarıyer, öncelikli hizmet bölgemizdir.',
    neighborhoods: ['Zekeriyaköy', 'Bahçeköy', 'Maslak', 'Tarabya', 'Yeniköy', 'Rumelihisarı', 'Kilyos', 'İstinye'],
    localSignals: [
      'Zekeriyaköy ve Bahçeköy’deki müstakil villa ve sitelerde detaylı ev temizliği ile taşınma öncesi/sonrası temizlik talepleri yoğundur.',
      'Boğaz hattı yerleşimlerinde cam, dış cephe ve bahçe kenarı yüzey temizliği sık talep edilir.',
      'Yüksek segment konutlarda aynı gün ücretsiz keşif ve gizlilik odaklı çalışma önceliklidir.',
    ],
    deepDive: [
      'Zekeriyaköy, Zümrüt Vadi Temizlik için öncelikli hizmet bölgesidir. Bölgedeki müstakil villalar, kapalı siteler ve orman içi yerleşimlerde detaylı ev temizliği, inşaat sonrası teslim temizliği ve periyodik bakım paketlerinde hızlı ekip yönlendirmesi yapıyoruz.',
      'Bahçeköy, Maslak ve Boğaz hattındaki (Tarabya, Yeniköy, İstinye) konutlarda geniş cam yüzeyleri, yüksek tavanlar ve bahçeli yapılar nedeniyle cam temizliği, dış cephe ve detay temizlik sıklıkla birlikte planlanır. Alanı; zemin türü, cam yüzeyi, ıslak hacim ve erişim koşullarına göre başlıklara ayırıp uyguluyoruz.',
      'Sarıyer genelinde ana sayfamızdaki Anında Fiyat Hesaplama aracıyla mekan tipi, oda sayısı veya metrekare ve ekstralara göre tahmini fiyat aralığınızı saniyeler içinde görebilir, ardından WhatsApp üzerinden ücretsiz keşif randevusu oluşturabilirsiniz.',
    ],
  },
  {
    slug: 'kagithane',
    name: 'Kağıthane',
    side: 'avrupa',
    populationNote: 'kentsel dönüşüm ve yeni projelerde yoğun talep',
    regionBlurb:
      'Yeni rezidans ve ofis projelerinde inşaat sonrası teslim ve düzenli temizlik hizmeti veriyoruz.',
    neighborhoods: ['Çağlayan', 'Gürsel', 'Seyrantepe', 'Merkez', 'Hamidiye', 'Sultan Selim'],
    localSignals: [
      'Kentsel dönüşüm projelerinde teslim öncesi detaylı inşaat sonrası temizlik talepleri yoğunlaşır.',
      'Rezidans ve ofis geçişlerinde aynı gün keşif + ertesi gün operasyon planı öne çıkar.',
      'Dar sokak ve yoğun trafik saatlerine göre rota planlaması yapıldığında teslim süreleri kısalır.',
    ],
    deepDive: [
      'Kağıthane, Zümrüt Vadi Temizlik operasyonlarının merkezi olduğu için saha planlamasında referans ilçemizdir. Çağlayan, Gürsel ve Seyrantepe hattında özellikle yeni bina teslimleri, tadilat sonrası kullanım açılışları ve ofis katı devirlerinde kısa sürede ekip yönlendirmesi yapabiliyoruz.',
      'İlçedeki yapı stoğunda hem eski apartmanlar hem de yeni rezidans/ofis projeleri birlikte bulunduğundan hizmet kapsamı projeye göre değişiyor. Bu nedenle iş başlamadan önce alanı; zemin türü, cam yüzeyi, dolap içi toz birikimi, ıslak hacim yoğunluğu ve erişim koşullarına göre başlıklara ayırıp uyguluyoruz.',
      'Kağıthane’deki mahalle bazlı deneyimimiz sayesinde operasyon sırası daha net ilerler: önce toz ve yüzey güvenliği, ardından detay temizlik, en sonda teslim kontrolü. Bu yaklaşım özellikle taşınma öncesi ve inşaat sonrası işlerde hem süre hem kalite dengesini iyileştirir.',
    ],
  },
  {
    slug: 'eyupsultan',
    name: 'Eyüpsultan',
    side: 'avrupa',
    populationNote: 'geleneksel konut ve yeni konut karışımı',
    regionBlurb:
      'Tarihi semt ve yeni yerleşimlerde aile konutlarına uygun fiyatlı periyodik paketler sunuyoruz.',
    neighborhoods: ['Alibeyköy', '5. Levent', 'Göktürk', 'Kemerburgaz', 'Çırçır', 'Ram'],
  },
  {
    slug: 'bayrampasa',
    name: 'Bayrampaşa',
    side: 'avrupa',
    populationNote: 'sanayi ve konut yakınlığında pratik hizmet beklentisi',
    regionBlurb:
      'İşyeri, depo ve konut temizliklerinde kısa süreli ekip çıkışı ve net kapsam sunuyoruz.',
    neighborhoods: ['Yıldırım', 'Muratpaşa', 'Kartaltepe', 'İsmet Paşa', 'Vatan', 'Terazidere'],
  },
  {
    slug: 'gaziosmanpasa',
    name: 'Gaziosmanpaşa',
    side: 'avrupa',
    populationNote: 'yoğun apartman dokusunda fiyat-duyarlı segment',
    regionBlurb:
      'Apartman ve site içi ortak alan + daire temizliklerinde şeffaf süre ve fiyat politikası.',
    neighborhoods: ['Bağlarbaşı', 'Karayolları', 'Yıldıztabya', 'Fevzi Çakmak', 'Habibler', 'Şemsipaşa'],
  },
  {
    slug: 'zeytinburnu',
    name: 'Zeytinburnu',
    side: 'avrupa',
    populationNote: 'sanayi, lojistik ve konut iç içe',
    regionBlurb:
      'İşyeri, atölye ve konut temizliklerinde esnek vardiya ve hızlı teklif süreci.',
    neighborhoods: ['Maltepe', 'Veliefendi', 'Kazlıçeşme', 'Merkezefendi', 'Telsiz', 'Yeşiltepe'],
  },
  {
    slug: 'fatih',
    name: 'Fatih',
    side: 'avrupa',
    populationNote: 'tarihi yapı ve dar sokaklarda özel dikkat gerektiren alanlar',
    regionBlurb:
      'Dar sokak ve tarihi çevrede apartman, pansiyon ve küçük işyeri temizliklerinde deneyimli ekip.',
    neighborhoods: ['Balat', 'Fener', 'Sultanahmet', 'Aksaray', 'Çarşamba', 'Kocamustafapaşa'],
  },
];

export const SERVICE_LANDINGS: ServiceLanding[] = [
  {
    slug: 'insaat-sonrasi-temizlik',
    name: 'İnşaat Sonrası Temizlik',
    shortPitch: 'İnce inşaat tozu, moloz kalıntısı ve yüzey detay temizliğini profesyonel ekip ile tamamlarız.',
    intentKeywords: ['inşaat sonrası temizlik fiyatı', 'inşaat sonrası detay temizlik', 'taşınma öncesi temizlik'],
    blogTagHints: ['inşaat', 'temizlik', 'ev temizliği'],
    faq: [
      {
        q: 'İnşaat sonrası temizlik ne kadar sürer?',
        a: 'Alan büyüklüğü ve kirlilik seviyesine göre değişir; keşif sonrası net süre paylaşırız.',
      },
      {
        q: 'Malzeme ve ekipman sizden mi geliyor?',
        a: 'Evet, yüzeye uygun profesyonel ekipman ve ürünlerle hizmet veriyoruz.',
      },
    ],
  },
  {
    slug: 'ofis-temizligi',
    name: 'Ofis Temizliği',
    shortPitch: 'Günlük, haftalık ve aylık planlarla ofisinizde hijyen standardını kesintisiz koruruz.',
    intentKeywords: ['ofis temizlik şirketi', 'kurumsal ofis temizliği', 'düzenli ofis temizlik hizmeti'],
    blogTagHints: ['ofis', 'kurumsal', 'hijyen'],
    faq: [
      {
        q: 'Mesai dışı ofis temizliği yapıyor musunuz?',
        a: 'Evet, operasyonunuza uygun saatlerde mesai dışı planlama yapabiliyoruz.',
      },
      {
        q: 'Sözleşmeli hizmet verebiliyor musunuz?',
        a: 'Kurumsal müşteriler için periyodik hizmet sözleşmesi sunuyoruz.',
      },
    ],
  },
  {
    slug: 'ev-temizligi',
    name: 'Ev Temizliği',
    shortPitch:
      'Mutfak, banyo ve yaşam alanlarında derinlemesine hijyen; tek seferlik veya düzenli paketlerle güvenilir ev temizliği.',
    intentKeywords: ['ev temizliği istanbul', 'profesyonel ev temizliği', 'daire temizliği', 'genel ev temizliği'],
    blogTagHints: ['ev temizliği', 'temizlik', 'hijyen'],
    faq: [
      {
        q: 'Ev temizliği ne kadar sürer?',
        a: 'Metrekare, kirlilik ve talep edilen kapsama göre değişir; keşif sonrası net süre paylaşırız.',
      },
      {
        q: 'Malzemeleri siz mi getiriyorsunuz?',
        a: 'Evet, yüzeye uygun profesyonel ürün ve ekipmanlarla hizmet veriyoruz.',
      },
    ],
  },
  {
    slug: 'koltuk-yikama',
    name: 'Koltuk Yıkama',
    shortPitch: 'Yerinde koltuk yıkama ile kumaşa uygun uygulama yapar, kuruma süresini optimize ederiz.',
    intentKeywords: ['yerinde koltuk yıkama', 'koltuk yıkama fiyatları', 'profesyonel koltuk temizliği'],
    blogTagHints: ['koltuk', 'ev temizliği', 'hijyen'],
    faq: [
      {
        q: 'Koltuk yıkama sonrası kuruma süresi ne kadar?',
        a: 'Kumaş türüne ve hava şartına bağlı olarak ortalama 4-12 saat arasıdır.',
      },
      {
        q: 'Leke çıkarma garantisi veriyor musunuz?',
        a: 'Leke tipine göre başarı oranını önceden bildirir, maksimum sonucu hedefleriz.',
      },
    ],
  },
  {
    slug: 'hali-temizligi',
    name: 'Halı Temizliği',
    shortPitch: 'Halı tipine göre doğru ürün ve teknikle derinlemesine hijyen sağlarız.',
    intentKeywords: ['halı temizliği istanbul', 'profesyonel halı yıkama', 'yerinde halı temizleme'],
    blogTagHints: ['halı', 'ev temizliği', 'hijyen'],
    faq: [
      {
        q: 'Her halı türü için aynı yöntem mi uygulanıyor?',
        a: 'Hayır, halının dokusuna ve iplik yapısına göre yöntem seçiyoruz.',
      },
      {
        q: 'Evde halı temizliği hizmeti veriyor musunuz?',
        a: 'Evet, uygun halı türlerinde yerinde hizmet planlanabilir.',
      },
    ],
  },
  {
    slug: 'dis-cephe-temizligi',
    name: 'Dış Cephe Temizliği',
    shortPitch: 'Cam ve cephe yüzeylerinde iş güvenliği odaklı, ekipmanlı dış cephe temizliği sunarız.',
    intentKeywords: ['dış cephe temizliği', 'plaza cam temizliği', 'yüksek kat cam temizliği'],
    blogTagHints: ['cam', 'dış cephe', 'ofis'],
    faq: [
      {
        q: 'Yüksek kat cephe temizliği güvenli mi?',
        a: 'Ekiplerimiz güvenlik standartlarına uygun ekipman ve prosedürlerle çalışır.',
      },
      {
        q: 'Ne sıklıkla dış cephe temizliği gerekir?',
        a: 'Bina konumu ve kirlilik durumuna göre periyot belirlenir, genelde sezonluk plan önerilir.',
      },
    ],
  },
  {
    slug: 'cam-temizligi',
    name: 'Cam Temizliği',
    shortPitch:
      'İç ve dış cephe cam, vitrin ve yüksek erişim gerektiren yüzeylerde lekesiz parlaklık ve düzenli bakım paketleri.',
    intentKeywords: ['cam temizliği istanbul', 'ofis cam silme', 'vitrin cam temizliği', 'yüksek cam temizliği'],
    blogTagHints: ['cam', 'ofis', 'hijyen'],
    faq: [
      {
        q: 'Dış cephe cam ile iç mekan cam aynı gün yapılabilir mi?',
        a: 'Erişim, güvenlik ve hava koşullarına göre planlanır; keşif sonrası en uygun sırayı öneririz.',
      },
      {
        q: 'Periyodik cam temizliği paketi var mı?',
        a: 'Evet, işletme ve site yönetimleri için haftalık/aylık planlar oluşturabiliyoruz.',
      },
    ],
  },
];

export function getDistrictBySlug(slug: string) {
  return DISTRICT_LANDINGS.find((d) => d.slug === slug);
}

/** Arayüz ve meta için kısa yaka etiketi */
export function formatDistrictSide(district: DistrictLanding): string {
  if (district.side === 'anadolu') return 'Anadolu yakası';
  if (district.side === 'avrupa') return 'Avrupa yakası';
  return '';
}

export function getServiceBySlug(slug: string) {
  return SERVICE_LANDINGS.find((s) => s.slug === slug);
}

export function allProgrammaticLandingPaths(): string[] {
  const paths: string[] = ['/bolgeler'];
  for (const d of DISTRICT_LANDINGS) {
    paths.push(`/bolgeler/${d.slug}`);
    for (const s of SERVICE_LANDINGS) {
      paths.push(`/bolgeler/${d.slug}/${s.slug}`);
    }
  }
  return paths;
}

// ============================================
// SEMT (NEIGHBORHOOD) LANDING SAYFALARI
// Öncelikli semtler için ilçe altında özel içerikli sayfalar.
// URL: /bolgeler/{districtSlug}/{slug} — dinamik [service] rotası üzerinden servis edilir.
// ============================================

export interface NeighborhoodLanding {
  districtSlug: string;
  slug: string;
  name: string;
  /** Meta ve H1 için ilçe adı */
  districtName: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** İçerik paragrafları */
  body: string[];
  highlights: string[];
  faq: { q: string; a: string }[];
  /** Öne çıkarılacak hizmet slug'ları (SERVICE_LANDINGS ile eşleşir) */
  featuredServiceSlugs: string[];
  /** Fiyat hesaplama & çözüm sayfası niyet slug'ı */
  calculatorIntentSlug?: string;
}

export const NEIGHBORHOOD_LANDINGS: NeighborhoodLanding[] = [
  {
    districtSlug: 'sariyer',
    slug: 'zekeriyakoy',
    name: 'Zekeriyaköy',
    districtName: 'Sarıyer',
    metaTitle: 'Zekeriyaköy Temizlik Şirketi | Villa & Ev Temizliği',
    metaDescription:
      'Zekeriyaköy temizlik şirketi: villa, site ve daire için detaylı ev temizliği, inşaat sonrası, cam ve dış cephe temizliği. Ücretsiz keşif, aynı gün randevu. Anında fiyat hesaplama.',
    intro:
      'Zekeriyaköy, Zümrüt Vadi Temizlik’in öncelikli hizmet bölgesidir. Bölgedeki villalar, kapalı siteler ve orman içi konutlarda detaylı ev temizliği, inşaat sonrası teslim temizliği, cam ve dış cephe temizliğinde hızlı ve güvenilir ekip yönlendirmesi yapıyoruz.',
    body: [
      'Zekeriyaköy’deki müstakil villalar ve bahçeli konutlarda geniş cam yüzeyleri, yüksek tavanlar ve çok sayıda ıslak hacim nedeniyle temizlik detay ve deneyim gerektirir. Alanı; zemin türü, cam yüzeyi, dolap içi toz birikimi ve erişim koşullarına göre başlıklara ayırarak planlıyoruz.',
      'Taşınma öncesi ve sonrası, tadilat/inşaat sonrası teslim ve periyodik bakım paketlerinde aynı gün ücretsiz keşif ve gizlilik odaklı çalışma önceliğimizdir. Bahçeköy, Kilyos, Demirciköy ve Boğaz hattı (Tarabya, Yeniköy, İstinye) dahil çevre semtlerde de hizmet veriyoruz.',
      'Fiyatınızı önceden görmek için ana sayfamızdaki Anında Fiyat Hesaplama aracını kullanabilir; mekan tipi, oda sayısı veya metrekare ve ekstralara göre tahmini aralığı saniyeler içinde öğrenip WhatsApp üzerinden randevu oluşturabilirsiniz.',
    ],
    highlights: [
      'Villa ve site odaklı detaylı ev temizliği',
      'İnşaat/tadilat sonrası teslim temizliği',
      'Geniş cam yüzeyleri ve dış cephe temizliği',
      'Aynı gün ücretsiz keşif ve gizlilik odaklı çalışma',
    ],
    faq: [
      {
        q: 'Zekeriyaköy’de villa temizliği yapıyor musunuz?',
        a: 'Evet. Zekeriyaköy’deki müstakil villalar ve sitelerde detaylı ev temizliği, inşaat sonrası ve cam/dış cephe temizliği hizmeti veriyoruz. Kapsam ücretsiz keşifte netleşir.',
      },
      {
        q: 'Zekeriyaköy için fiyat nasıl öğrenebilirim?',
        a: 'Ana sayfamızdaki Anında Fiyat Hesaplama aracıyla tahmini fiyat aralığınızı görebilir, ardından WhatsApp veya iletişim formundan ücretsiz keşif randevusu alabilirsiniz. Kesin fiyat keşif sonrası netleşir.',
      },
      {
        q: 'Aynı gün randevu mümkün mü?',
        a: 'Yoğunluğa göre aynı gün keşif ve hızlı ekip yönlendirmesi yapabiliyoruz. Acil talepler için doğrudan arayabilirsiniz.',
      },
    ],
    featuredServiceSlugs: [
      'ev-temizligi',
      'insaat-sonrasi-temizlik',
      'cam-temizligi',
      'dis-cephe-temizligi',
    ],
    calculatorIntentSlug: 'tasinma-temizligi',
  },
  {
    districtSlug: 'sariyer',
    slug: 'maslak',
    name: 'Maslak',
    districtName: 'Sarıyer',
    metaTitle: 'Maslak Temizlik Şirketi | Ofis & Rezidans Temizliği',
    metaDescription:
      'Maslak temizlik: plaza, ofis katı ve rezidans daireleri için kurumsal ve detaylı temizlik. İnşaat sonrası teslim, cam temizliği. Ücretsiz keşif, aynı gün randevu.',
    intro:
      'Maslak, İstanbul’un kurumsal ve rezidans yoğunluklu merkezlerinden biridir. Plaza ofisleri, yeni rezidans kuleleri ve karma kullanım binalarında ofis temizliği, taşınma öncesi/sonrası daire temizliği ve inşaat sonrası teslim hizmeti sunuyoruz.',
    body: [
      'Maslak’taki ofis katlarında mesai dışı veya hafta sonu temizlik planı; rezidans dairelerinde ise detaylı ev temizliği ve cam yüzey bakımı sık talep edilir. Metrekare, personel yoğunluğu ve erişim saatlerine göre kapsamı netleştiriyoruz.',
      'Yeni teslim edilen rezidans ve ofis projelerinde inşaat sonrası detay temizlik, boya-toz ve cam iç yüzey teslimi önceliklidir. Maslak–Levent hattında hızlı ekip yönlendirmesi yapıyoruz.',
      'Tahmini fiyat için niyet modlu fiyat hesaplama aracımızı kullanabilir; ofis veya inşaat sonrası moduyla saniyeler içinde aralık görebilirsiniz.',
    ],
    highlights: [
      'Plaza ve ofis katı temizliği',
      'Rezidans daire detay temizliği',
      'İnşaat/tadilat sonrası teslim',
      'Mesai dışı operasyon planı',
    ],
    faq: [
      {
        q: 'Maslak’ta ofis temizliği mesai dışı yapılır mı?',
        a: 'Evet. Kurumsal müşterilerimizde mesai dışı veya hafta sonu slot planlaması yapıyoruz. Personel sayısı ve m² keşif sonrası netleşir.',
      },
      {
        q: 'Maslak rezidans daire temizliği fiyatı nasıl hesaplanır?',
        a: 'Oda sayısı ve kirlilik derecesine göre paket fiyat uygulanır. Online fiyat hesaplama aracıyla tahmini aralığı görebilir, ardından ücretsiz keşif alabilirsiniz.',
      },
      {
        q: 'Maslak–Zekeriyaköy arası aynı gün hizmet mümkün mü?',
        a: 'Yoğunluğa bağlı olarak Sarıyer hattında aynı gün keşif ve hızlı ekip yönlendirmesi yapabiliyoruz.',
      },
    ],
    featuredServiceSlugs: ['ofis-temizligi', 'ev-temizligi', 'insaat-sonrasi-temizlik', 'cam-temizligi'],
    calculatorIntentSlug: 'ofis-temizligi',
  },
  {
    districtSlug: 'sariyer',
    slug: 'tarabya',
    name: 'Tarabya',
    districtName: 'Sarıyer',
    metaTitle: 'Tarabya Temizlik Şirketi | Boğaz Hattı Ev & Villa Temizliği',
    metaDescription:
      'Tarabya temizlik: Boğaz hattı konutları, villalar ve yazlıklarda detaylı ev temizliği, cam ve dış cephe temizliği. Ücretsiz keşif, gizlilik odaklı ekip.',
    intro:
      'Tarabya ve Boğaz kıyısındaki konutlarda geniş cam yüzeyler, bahçe kenarı alanlar ve yüksek tavanlı salonlar nedeniyle detaylı temizlik ve cam bakımı öne çıkar. Zümrüt Vadi Temizlik olarak Tarabya, Yeniköy ve İstinye hattında düzenli operasyon yapıyoruz.',
    body: [
      'Tarabya’daki müstakil konut ve site dairelerinde taşınma öncesi/sonrası, kira teslim ve periyodik bakım temizliği talepleri yoğundur. Cam temizliği ve dış cephe bakımı çoğu işte birlikte planlanır.',
      'Boğaz hattı konutlarında gizlilik, randevu saati esnekliği ve aynı ekip sürekliliği önceliklidir. Erişim ve otopark koşullarına göre ekip planlaması yapıyoruz.',
      'Kira teslim veya taşınma temizliği için çözüm sayfalarımızdan süreç rehberine ulaşabilir, fiyat hesaplama aracıyla tahmini bütçenizi görebilirsiniz.',
    ],
    highlights: [
      'Boğaz hattı ev ve villa temizliği',
      'Cam ve dış cephe bakımı',
      'Kira teslim & taşınma temizliği',
      'Gizlilik odaklı çalışma',
    ],
    faq: [
      {
        q: 'Tarabya’da kira teslim temizliği yapıyor musunuz?',
        a: 'Evet. Kiracı çıkışı veya mal sahibi teslimi için kontrol listesiyle detay temizlik sunuyoruz. Kapsam keşifte netleşir.',
      },
      {
        q: 'Tarabya cam temizliği ayrı mı alınır?',
        a: 'Ev temizliği paketine eklenebilir veya ayrı hizmet olarak planlanabilir. Geniş cam yüzeylerde erişim ekipmanı keşifte belirlenir.',
      },
      {
        q: 'Yeniköy ve İstinye’ye de hizmet var mı?',
        a: 'Evet. Sarıyer Boğaz hattı (Tarabya, Yeniköy, İstinye, Rumelihisarı) aynı operasyon planına dahildir.',
      },
    ],
    featuredServiceSlugs: ['ev-temizligi', 'cam-temizligi', 'dis-cephe-temizligi', 'insaat-sonrasi-temizlik'],
    calculatorIntentSlug: 'kira-teslim-temizligi',
  },
  {
    districtSlug: 'sariyer',
    slug: 'bahcekoy',
    name: 'Bahçeköy',
    districtName: 'Sarıyer',
    metaTitle: 'Bahçeköy Temizlik Şirketi | Orman İçi Villa Temizliği',
    metaDescription:
      'Bahçeköy temizlik: orman içi villa ve site konutlarında detaylı ev temizliği, inşaat sonrası teslim, cam ve bahçe kenarı temizlik. Zekeriyaköy hattı operasyon.',
    intro:
      'Bahçeköy, Belgrad Ormanı çevresindeki villalar ve siteleriyle Sarıyer’in öncelikli hizmet semtlerinden biridir. Zekeriyaköy operasyonumuzun doğal uzantısı olarak Bahçeköy’de detaylı ev, inşaat sonrası ve taşınma temizliği sunuyoruz.',
    body: [
      'Bahçeköy’deki müstakil villalarda geniş metrekare, çoklu ıslak hacim ve bahçe/balkon alanları temizlik kapsamını genişletir. Zemin türü ve erişim yollarına göre ekip ve süre planlanır.',
      'Tadilat ve inşaat sonrası teslim temizliğinde ince toz, boya izleri ve dolap içi detay önceliklidir. Taşınma öncesi/sonrası paketlerde aynı gün keşif mümkündür.',
      'Zekeriyaköy, Kilyos ve Demirciköy çevresiyle birlikte Sarıyer orman içi hattında rota planlı operasyon yapıyoruz.',
    ],
    highlights: [
      'Orman içi villa detay temizliği',
      'İnşaat/tadilat sonrası teslim',
      'Taşınma öncesi & sonrası paket',
      'Zekeriyaköy hattı operasyon',
    ],
    faq: [
      {
        q: 'Bahçeköy villa temizliği ne kadar sürer?',
        a: 'Metrekare, oda sayısı ve kirlilik derecesine göre değişir. Keşif sonrası net süre ve fiyat paylaşıyoruz; çoğu villa işi 1–2 günde tamamlanır.',
      },
      {
        q: 'Bahçeköy ile Zekeriyaköy aynı ekip mi gelir?',
        a: 'Sarıyer orman içi hattında aynı operasyon ekibimiz planlanır; semt ve erişim koşullarına göre slot ayarlanır.',
      },
      {
        q: 'Bahçeköy inşaat sonrası temizlik fiyatı?',
        a: 'm² ve kirlilik seviyesine göre 45–120 TL/m² bandında tahmin verilir. Kesin fiyat ücretsiz keşif sonrası netleşir.',
      },
    ],
    featuredServiceSlugs: [
      'ev-temizligi',
      'insaat-sonrasi-temizlik',
      'cam-temizligi',
      'dis-cephe-temizligi',
    ],
    calculatorIntentSlug: 'insaat-sonrasi-temizlik',
  },
];

export function getNeighborhoodLanding(
  districtSlug: string,
  slug: string
): NeighborhoodLanding | null {
  return (
    NEIGHBORHOOD_LANDINGS.find(
      (n) => n.districtSlug === districtSlug && n.slug === slug
    ) ?? null
  );
}

export function allNeighborhoodLandingPaths(): string[] {
  return NEIGHBORHOOD_LANDINGS.map((n) => `/bolgeler/${n.districtSlug}/${n.slug}`);
}

/** Mahalle adından semt landing slug'ı (Türkçe karakter dönüşümü) */
export function neighborhoodNameToSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function findNeighborhoodLandingForDistrictNeighborhood(
  districtSlug: string,
  neighborhoodDisplayName: string
): NeighborhoodLanding | null {
  const slug = neighborhoodNameToSlug(neighborhoodDisplayName);
  return (
    NEIGHBORHOOD_LANDINGS.find(
      (n) =>
        n.districtSlug === districtSlug &&
        (n.slug === slug || n.name === neighborhoodDisplayName)
    ) ?? null
  );
}

export function getNeighborhoodLandingsForDistrict(districtSlug: string): NeighborhoodLanding[] {
  return NEIGHBORHOOD_LANDINGS.filter((n) => n.districtSlug === districtSlug);
}

const HERO_TEMPLATES = [
  '{district} bölgesinde {serviceLower} ihtiyacında hızlı ekip yönlendirmesi ve net iş planı sunuyoruz.',
  '{district} için planlı {serviceLower} hizmetinde keşif sonrası kapsamı şeffaf biçimde paylaşıyoruz.',
  '{district} içinde {serviceLower} arayan kullanıcılar için hızlı randevu ve profesyonel uygulama sağlıyoruz.',
  '{district}: {regionHint} {serviceLower} kapsamını adresinize göre netleştiriyoruz.',
];

const LOCAL_ANGLES = [
  '{district} bölgesindeki {neighborhood} çevresinde yoğun talep saatlerine göre ekip planlaması yapıyoruz.',
  '{district} için mahalle bazlı rota planı ile bekleme süresini azaltıyoruz ({neighborhood} dahil).',
  '{district} tarafında özellikle {neighborhood} hattında düzenli operasyon tecrübemiz bulunuyor.',
];

const TRUST_POINT_TEMPLATES = [
  'İş öncesi kapsam netliği: hangi alanların temizleneceği baştan belirlenir.',
  'Yüzeye uygun ürün seçimi ve kontrol listesi ile standart kalite sağlanır.',
  'Tamamlanan iş sonrası kontrol adımı ile eksik noktalar hızlıca kapatılır.',
];

const PROCESS_STEP_TEMPLATES = [
  'İhtiyaç bilgisi alınır ve keşif/brief ile iş kapsamı netleştirilir.',
  'Ekip planlaması yapılarak bölgeye en uygun saat aralığı belirlenir.',
  'Uygulama tamamlandıktan sonra kalite kontrol ile teslim yapılır.',
];

function hashKey(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

function fillTemplate(
  template: string,
  district: DistrictLanding,
  service: ServiceLanding,
  neighborhoodPick: string
): string {
  const regionHint = district.regionBlurb || district.populationNote;
  return template
    .replaceAll('{district}', district.name)
    .replaceAll('{service}', service.name)
    .replaceAll('{serviceLower}', service.name.toLowerCase())
    .replaceAll('{neighborhood}', neighborhoodPick)
    .replaceAll('{regionHint}', regionHint);
}

export function buildProgrammaticContentVariant(
  district: DistrictLanding,
  service: ServiceLanding
): ProgrammaticContentVariant {
  const seed = hashKey(`${district.slug}:${service.slug}`);
  const nh =
    district.neighborhoods[seed % Math.max(1, district.neighborhoods.length)] ??
    district.name;

  const heroLead = fillTemplate(HERO_TEMPLATES[seed % HERO_TEMPLATES.length], district, service, nh);
  const localAngle = fillTemplate(LOCAL_ANGLES[(seed + 1) % LOCAL_ANGLES.length], district, service, nh);

  const trustPoints = TRUST_POINT_TEMPLATES.map((t) => fillTemplate(t, district, service, nh));
  const processSteps = PROCESS_STEP_TEMPLATES.map((t) => fillTemplate(t, district, service, nh));

  return {
    heroLead,
    trustPoints,
    processSteps,
    localAngle,
  };
}

export function getNearbyDistrictSlugs(currentSlug: string, count = 3): string[] {
  const index = DISTRICT_LANDINGS.findIndex((d) => d.slug === currentSlug);
  if (index === -1) return DISTRICT_LANDINGS.slice(0, count).map((d) => d.slug);
  const results: string[] = [];
  for (let i = 1; i <= DISTRICT_LANDINGS.length && results.length < count; i++) {
    const d = DISTRICT_LANDINGS[(index + i) % DISTRICT_LANDINGS.length];
    if (d.slug !== currentSlug) results.push(d.slug);
  }
  return results;
}

export function getDistrictOperationalSignals(district: DistrictLanding): string[] {
  if (district.localSignals && district.localSignals.length > 0) {
    return district.localSignals;
  }
  const firstNeighborhood = district.neighborhoods[0] || district.name;
  const secondNeighborhood = district.neighborhoods[1] || district.name;
  return [
    `${district.name} bölgesinde ${firstNeighborhood} ve ${secondNeighborhood} çevresinde yoğun saatlere göre ekip planlaması yapıyoruz.`,
    `${district.populationNote} nedeniyle kapsamı keşifde netleştirip uygulama sırasını buna göre optimize ediyoruz.`,
    `${district.name} içinde bina tipi ve erişim koşullarına göre süreç ve ekipman seçimi yapıyoruz.`,
  ];
}

export function getDistrictDeepDive(district: DistrictLanding): string[] {
  if (district.deepDive && district.deepDive.length > 0) {
    return district.deepDive;
  }
  return [
    `${district.name} için operasyon planı hazırlanırken mahalle yoğunluğu, bina yapısı ve erişim saatleri birlikte değerlendirilir.`,
    `Bu yaklaşım sayesinde ${district.name} tarafında teklif, planlama ve uygulama adımları daha öngörülebilir şekilde ilerler.`,
  ];
}

export function getProgrammaticMetaOverride(
  districtSlug: string,
  serviceSlug: string
): ProgrammaticMetaOverride | null {
  const key = `${districtSlug}/${serviceSlug}`;
  const map = metaOverrides as Record<string, ProgrammaticMetaOverride>;
  if (!map[key]) return null;
  const raw = map[key];
  const hasValue = Boolean(raw?.title?.trim() || raw?.description?.trim());
  return hasValue ? raw : null;
}
