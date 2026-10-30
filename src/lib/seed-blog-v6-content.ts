/**
 * 100 otomatik zamanlanmış blog v6 — Kasım–Aralık 2026 viral / yüksek CTR gündem.
 * Temizlik zorunlu değil; SEO + tıklama odaklı. ASCII slug + -2026 suffix.
 */
import type { BlogSeedPost } from './seed-blog';
import { makeEngagementGuidePost, type EngagementGuideConfig } from './blog-engagement-html';

const IMG = {
  finance: 'https://images.unsplash.com/photo-1554224311-beee415c201f?w=1200',
  tech: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
  city: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200',
  traffic: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200',
  food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200',
  health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200',
  home: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200',
  travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200',
  fun: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
  edu: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
  sport: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
  shop: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
} as const;

type CompactTopic = {
  slug: string;
  title: string;
  keyword: string;
  category: string;
  district: string;
  hook: string;
  image: string;
  tags: string[];
};

const DISTRICTS = [
  'Kadıköy',
  'Beşiktaş',
  'Ümraniye',
  'Bakırköy',
  'Kağıthane',
  'Sarıyer',
  'Ataşehir',
  'Şişli',
  'Maltepe',
  'Pendik',
] as const;

function metaDesc(keyword: string): string {
  const base = `${keyword}: 2026 İstanbul güncel rehber — net adımlar, sık hatalar, resmi kaynak teyidi.`;
  return base.length <= 158 ? base : `${base.slice(0, 157).trimEnd()}…`;
}

function expandTopic(t: CompactTopic): EngagementGuideConfig {
  const { slug, title, keyword, category, district, hook, image, tags } = t;
  return {
    slug,
    title,
    metaTitle: title.length <= 60 ? title : `${title.slice(0, 59).trimEnd()}…`,
    metaDesc: metaDesc(keyword),
    excerpt: hook,
    image,
    category,
    tags: [...new Set([...tags, 'istanbul', '2026', 'gündem', 'viral rehber'])].slice(0, 6),
    keyword,
    intro: hook,
    sections: [
      {
        heading: `${keyword} — 2026’da neden gündemde?`,
        paragraphs: [
          `${district} ve İstanbul genelinde “${keyword}” aramaları son haftalarda yükseldi; haber akışı, sosyal medya ve resmi duyurular birlikte takip edilmeli.`,
          `Abartılı başlıklara kanmadan önce en az iki bağımsız kaynaktan teyit alın; özellikle fiyat, tarih ve başvuru koşullarında resmi kanal önceliklidir.`,
        ],
        bullets: [
          'Resmi kurum / e-Devlet duyurularını birincil kaynak yapın',
          'Sosyal medya iddialarını çapraz doğrulayın',
          'Tarih ve ücret bilgilerini yazılı kaydedin',
          `${district} özelinde yerel uygulama farkı olabilir`,
          'Acil karar gerektiren işlemlerde randevu saatini sabah planlayın',
        ],
      },
      {
        heading: 'Pratik adımlar (okuyucu checklist)',
        paragraphs: [
          `“${keyword}” konusunda hızlı sonuç için önce ihtiyacınızı netleştirin (bilgi mi, başvuru mu, karşılaştırma mı), sonra tek bir resmi sayfada ilerleyin.`,
          'Forum ve blog yorumları yardımcı olabilir ama tek başına yeterli değildir; özellikle kampanya bitiş tarihleri sık değişir.',
        ],
        bullets: [
          'Amacınızı tek cümlede yazın',
          'Gerekli belgeleri önceden toplayın',
          'Son başvuru / kampanya tarihini takvime işleyin',
          'Ücretli “aracı” vaatlerine dikkat edin',
          'WhatsApp / e-posta ile yazılı teyit alın',
        ],
      },
      {
        heading: `${district} ve İstanbul’da uygulama ipuçları`,
        paragraphs: [
          `Yoğun dönemlerde ${district} hattında işlem ve ulaşım süreleri uzayabilir; hafta içi sabah dilimleri genelde daha verimlidir.`,
          'Mobil bildirimler ve SMS hatırlatmaları son tarih kaçırmayı azaltır; kritik işlemlerde ekran görüntüsü saklayın.',
        ],
      },
    ],
    faq: [
      {
        q: `${keyword} için en güncel bilgi nereden alınır?`,
        a: 'Resmi kurum sitesi, e-Devlet ve 2026 duyuruları birincil kaynaktır; üçüncü taraf siteleri tek başına yeterli değildir.',
      },
      {
        q: 'Bu konuda kesin tarihler değişir mi?',
        a: 'Evet. Kampanya, zam ve başvuru takvimleri güncellenebilir; işlem öncesi resmi sayfayı yenileyin.',
      },
      {
        q: `${district} özelinde fark var mı?`,
        a: `İlçe ve semt koşulları değişebilir; ${district} için yerel duyuruları ve uygulama saatlerini kontrol edin.`,
      },
    ],
  };
}

/** Kasım–Aralık 2026: indirim, kış, Dünya Kupası, AI, zam, tatil — yüksek arama niyeti */
const COMPACT: Omit<CompactTopic, 'district' | 'image'>[] = [
  // Alışveriş / Black Friday season (15)
  { slug: 'black-friday-2026-turkiye-ne-zaman-basliyor', title: 'Black Friday 2026 Türkiye Ne Zaman Başlıyor?', keyword: 'Black Friday 2026 Türkiye', category: 'Alışveriş', hook: 'Kasım indirim sezonu yaklaşırken Black Friday tarihleri ve sahte kampanya tuzakları en çok aranan konular arasında.', tags: ['black friday', 'indirim'] },
  { slug: 'cyber-monday-2026-turkiye-indirim-rehberi', title: 'Cyber Monday 2026 Türkiye: İndirim Rehberi', keyword: 'Cyber Monday 2026', category: 'Alışveriş', hook: 'Online mağazalarda Cyber Monday fiyat karşılaştırması yapmadan tıklamak pahalıya patlayabilir.', tags: ['cyber monday', 'e-ticaret'] },
  { slug: 'kasim-indirimleri-2026-en-cok-dusen-urunler', title: 'Kasım İndirimleri 2026: En Çok Düşen Ürünler', keyword: 'Kasım indirimleri 2026', category: 'Alışveriş', hook: 'Elektronik, beyaz eşya ve moda kategorilerinde gerçek indirimi ayırt etmek için kontrol listesi.', tags: ['kasım indirim', 'fiyat'] },
  { slug: 'trendyol-kasim-kampanyasi-2026-son-durum', title: 'Trendyol Kasım Kampanyası 2026 Son Durum', keyword: 'Trendyol Kasım 2026', category: 'Alışveriş', hook: 'Kupon, kargo ve sepet kurallarını bilmeden büyük indirim sanılan fiyatlar yanıltıcı olabilir.', tags: ['trendyol', 'kampanya'] },
  { slug: 'hepsiburada-black-friday-2026-ipuclari', title: 'Hepsiburada Black Friday 2026 İpuçları', keyword: 'Hepsiburada Black Friday', category: 'Alışveriş', hook: 'Stok bitmeden önce fiyat geçmişi ve satıcı puanı kontrolü kritik.', tags: ['hepsiburada', 'black friday'] },
  { slug: 'amazon-tr-kasim-indirim-2026-gercek-mi', title: 'Amazon TR Kasım İndirimi 2026 Gerçek mi?', keyword: 'Amazon TR indirim 2026', category: 'Alışveriş', hook: 'Liste fiyatı şişirme iddiaları artınca tüketiciler “gerçek indirim” arıyor.', tags: ['amazon', 'indirim'] },
  { slug: 'yilbasi-hediye-fikirleri-2026-butce-dostu', title: 'Yılbaşı Hediye Fikirleri 2026: Bütçe Dostu', keyword: 'yılbaşı hediye 2026', category: 'Alışveriş', hook: 'Aralık’ta hediye arayanlar için hızlı, pratik ve abartısız öneri listesi.', tags: ['yılbaşı', 'hediye'] },
  { slug: 'noel-ve-yilbasi-tatili-2026-ucak-bileti', title: 'Noel ve Yılbaşı Tatili 2026: Uçak Bileti Ne Zaman Alınır?', keyword: 'yılbaşı uçak bileti 2026', category: 'Seyahat', hook: 'Tatil uçuşlarında erken rezervasyon ile son dakika fiyat farkı büyüyor.', tags: ['uçak', 'tatil'] },
  { slug: 'otel-fiyatlari-yilbasi-2026-istanbul', title: 'İstanbul Yılbaşı Otel Fiyatları 2026', keyword: 'İstanbul yılbaşı otel', category: 'Seyahat', hook: 'Şehir otellerinde yılbaşı gecesi paketleri erken doluyor; iptal koşulları kritik.', tags: ['otel', 'yılbaşı'] },
  { slug: 'iade-ve-degisim-haklari-kasim-2026', title: 'Kasım 2026 İade ve Değişim Hakları', keyword: 'iade değişim hakkı 2026', category: 'Alışveriş', hook: 'İndirimli ürünlerde cayma hakkı ve ayıplı mal süreçleri karıştırılıyor.', tags: ['tüketici', 'iade'] },
  { slug: 'sahte-indirim-nasil-anlasilir-2026', title: 'Sahte İndirim Nasıl Anlaşılır? 2026 Rehberi', keyword: 'sahte indirim nasıl anlaşılır', category: 'Alışveriş', hook: 'Önceki fiyatı şişirip “%70 indirim” yazmak yaygın; basit kontrol yöntemleri.', tags: ['tüketici', 'fiyat'] },
  { slug: 'kredi-karti-taksit-kampanyalari-kasim-2026', title: 'Kredi Kartı Taksit Kampanyaları Kasım 2026', keyword: 'kredi kartı taksit Kasım 2026', category: 'Ekonomi', hook: 'Faizsiz taksit vaatlerinde vade farkı ve üyelik ücreti detayı atlanıyor.', tags: ['kredi kartı', 'taksit'] },
  { slug: 'elektronik-urun-fiyatlari-dusuyor-mu-2026', title: 'Elektronik Ürün Fiyatları Düşüyor mu? 2026', keyword: 'elektronik fiyatları 2026', category: 'Alışveriş', hook: 'Telefon, laptop ve TV’de Kasım öncesi fiyat seyri merak konusu.', tags: ['elektronik', 'fiyat'] },
  { slug: 'beyaz-esya-indirim-2026-ne-zaman-alinir', title: 'Beyaz Eşya İndirimi 2026: Ne Zaman Alınır?', keyword: 'beyaz eşya indirim 2026', category: 'Alışveriş', hook: 'Kampanya dönemini beklemek mi, stok bitmeden almak mı — pratik karar çerçevesi.', tags: ['beyaz eşya', 'indirim'] },
  { slug: 'marketplace-kargo-ucretsiz-kosullari-2026', title: 'Marketplace Ücretsiz Kargo Koşulları 2026', keyword: 'ücretsiz kargo koşulları 2026', category: 'Alışveriş', hook: 'Sepet tutarı eşiği ve üyelik zorunluluğu sık değişiyor.', tags: ['kargo', 'e-ticaret'] },

  // Ekonomi / zam / maaş (15)
  { slug: 'asgari-ucret-2026-ne-zaman-aciklanacak-son-durum', title: 'Asgari Ücret 2026 Ne Zaman Açıklanacak? Son Durum', keyword: 'asgari ücret 2026', category: 'Ekonomi', hook: 'Yıl sonu yaklaşırken zam beklentisi ve resmi açıklama takvimi en çok aranan gündem.', tags: ['asgari ücret', 'zam'] },
  { slug: 'emekli-maasi-zami-2026-hesaplama', title: 'Emekli Maaşı Zammı 2026 Hesaplama', keyword: 'emekli maaşı zammı 2026', category: 'Ekonomi', hook: 'Enflasyon farkı ve zam oranı spekülasyonları artınca net hesap aranıyor.', tags: ['emekli', 'zam'] },
  { slug: 'memur-maasi-zami-2026-gercek-mi', title: 'Memur Maaşı Zammı 2026 Gerçek mi?', keyword: 'memur maaşı zammı 2026', category: 'Ekonomi', hook: 'Toplu sözleşme ve ara zam iddialarını resmi metinle ayırmak gerekiyor.', tags: ['memur', 'maaş'] },
  { slug: 'dogalgaz-faturasi-kis-2026-ne-kadar-artar', title: 'Doğalgaz Faturası Kış 2026 Ne Kadar Artar?', keyword: 'doğalgaz faturası kış 2026', category: 'Ekonomi', hook: 'Kış tüketimi ve tarife değişiklikleri hane bütçesini doğrudan etkiliyor.', tags: ['doğalgaz', 'fatura'] },
  { slug: 'elektrik-faturasi-kis-2026-tasarruf', title: 'Elektrik Faturası Kış 2026: Tasarruf Rehberi', keyword: 'elektrik faturası tasarruf 2026', category: 'Yaşam', hook: 'Isınma ve aydınlatma yükü artınca pratik tasarruf adımları aranıyor.', tags: ['elektrik', 'tasarruf'] },
  { slug: 'konut-kredisi-faizleri-kasim-2026', title: 'Konut Kredisi Faizleri Kasım 2026', keyword: 'konut kredisi faiz 2026', category: 'Ekonomi', hook: 'Faiz bandı ve banka kampanyaları haftalık değişebiliyor.', tags: ['konut kredisi', 'faiz'] },
  { slug: 'ihtiyac-kredisi-limitleri-2026-son-durum', title: 'İhtiyaç Kredisi Limitleri 2026 Son Durum', keyword: 'ihtiyaç kredisi limit 2026', category: 'Ekonomi', hook: 'Onay süresi ve risk skoruna göre limit farkları büyüyor.', tags: ['kredi', 'banka'] },
  { slug: 'dolar-kuru-neden-oynak-kasim-2026', title: 'Dolar Kuru Neden Oynak? Kasım 2026', keyword: 'dolar kuru Kasım 2026', category: 'Ekonomi', hook: 'Günlük kur hareketleri alışveriş ve ithal ürün fiyatlarını etkiliyor.', tags: ['dolar', 'kur'] },
  { slug: 'altin-fiyatlari-kasim-2026-yukselir-mi', title: 'Altın Fiyatları Kasım 2026 Yükselir mi?', keyword: 'altın fiyatları Kasım 2026', category: 'Ekonomi', hook: 'Gram altın spekülasyonunda güvenli kaynak ve komisyon farkı önemli.', tags: ['altın', 'yatırım'] },
  { slug: 'kira-artisi-2026-tavan-orani', title: 'Kira Artış Tavan Oranı 2026', keyword: 'kira artış tavanı 2026', category: 'Ekonomi', hook: 'Yenileme döneminde yasal tavan ile piyasa talebi çatışıyor.', tags: ['kira', 'hukuk'] },
  { slug: 'enflasyon-orani-kasim-2026-ne-anlama-gelir', title: 'Enflasyon Oranı Kasım 2026 Ne Anlama Gelir?', keyword: 'enflasyon Kasım 2026', category: 'Ekonomi', hook: 'Açıklanan oran ile market sepeti algısı arasındaki fark sorgulanıyor.', tags: ['enflasyon', 'ekonomi'] },
  { slug: 'vergi-takvimi-aralik-2026-son-tarihler', title: 'Vergi Takvimi Aralık 2026: Son Tarihler', keyword: 'vergi takvimi Aralık 2026', category: 'Ekonomi', hook: 'Yıl sonu beyan ve ödeme tarihleri kaçırılınca ceza riski artıyor.', tags: ['vergi', 'e-devlet'] },
  { slug: 'sgk-prim-borcu-yapilandirma-2026', title: 'SGK Prim Borcu Yapılandırma 2026', keyword: 'SGK yapılandırma 2026', category: 'Ekonomi', hook: 'Borç yapılandırma duyuruları çıktığında başvuru penceresi kısa olabiliyor.', tags: ['SGK', 'borç'] },
  { slug: 'emeklilikte-yas-tartismasi-2026-gundem', title: 'Emeklilikte Yaş Tartışması 2026 Gündem', keyword: 'emeklilik yaşı 2026', category: 'Ekonomi', hook: 'Reform spekülasyonları sosyal medyada hızla yayılıyor; resmi metin şart.', tags: ['emeklilik', 'gündem'] },
  { slug: 'market-fiyatlari-kasim-2026-karsilastirma', title: 'Market Fiyatları Kasım 2026 Karşılaştırma', keyword: 'market fiyatları Kasım 2026', category: 'Yaşam', hook: 'Temel gıda sepetinde zincir market farkları yeniden gündemde.', tags: ['market', 'fiyat'] },

  // Ulaşım / İstanbul kış (12)
  { slug: 'ibb-ulasim-zammi-2026-son-durum', title: 'İBB Ulaşım Zammı 2026 Son Durum', keyword: 'İBB ulaşım zammı 2026', category: 'Ulaşım', hook: 'Toplu taşıma ücretleri her zam duyurusunda arama patlaması yaratıyor.', tags: ['İBB', 'ulaşım'] },
  { slug: 'istanbulkart-ogrenci-indirimi-2026', title: 'İstanbulkart Öğrenci İndirimi 2026', keyword: 'İstanbulkart öğrenci 2026', category: 'Ulaşım', hook: 'Yenileme ve hak kaybı süreçleri dönem başında karışıyor.', tags: ['İstanbulkart', 'öğrenci'] },
  { slug: 'metrobus-sefer-saatleri-kis-2026', title: 'Metrobüs Sefer Saatleri Kış 2026', keyword: 'metrobüs sefer saatleri kış', category: 'Ulaşım', hook: 'Kış programı ve yoğun saatlerde bekleme süreleri merak ediliyor.', tags: ['metrobüs', 'kış'] },
  { slug: 'istanbul-metro-yeni-hat-2026-acilis', title: 'İstanbul Metro Yeni Hat 2026 Açılış', keyword: 'İstanbul metro yeni hat 2026', category: 'Ulaşım', hook: 'Açılış tarihleri ve aktarma noktaları resmi duyuru ile doğrulanmalı.', tags: ['metro', 'İstanbul'] },
  { slug: 'marmaray-kis-seferleri-2026', title: 'Marmaray Kış Seferleri 2026', keyword: 'Marmaray kış sefer 2026', category: 'Ulaşım', hook: 'Sefer sıklığı değişiklikleri işe gidiş planını etkiliyor.', tags: ['Marmaray', 'ulaşım'] },
  { slug: 'kopru-gecis-ucretleri-2026-guncel', title: 'Köprü Geçiş Ücretleri 2026 Güncel', keyword: 'köprü geçiş ücreti 2026', category: 'Ulaşım', hook: 'HGS/OGS bakiye ve tarife güncellemeleri sık aranıyor.', tags: ['köprü', 'HGS'] },
  { slug: 'kis-lastigi-zorunlulugu-2026-istanbul', title: 'Kış Lastiği Zorunluluğu 2026 İstanbul', keyword: 'kış lastiği zorunluluğu 2026', category: 'Ulaşım', hook: 'Tarih aralığı ve ceza koşulları her yıl yeniden soruluyor.', tags: ['kış lastiği', 'trafik'] },
  { slug: 'istanbul-kar-yagisi-hazirlik-2026', title: 'İstanbul Kar Yağışı Hazırlık 2026', keyword: 'İstanbul kar yağışı hazırlık', category: 'Yaşam', hook: 'İlk kar uyarısında yol, okul ve iş planı aramaları yükseliyor.', tags: ['kar', 'hava'] },
  { slug: 'taksi-ucretleri-2026-istanbul-guncel', title: 'Taksi Ücretleri 2026 İstanbul Güncel', keyword: 'taksi ücreti İstanbul 2026', category: 'Ulaşım', hook: 'Tarife tablosu ve uygulama ücreti farkı karışıklık yaratıyor.', tags: ['taksi', 'ücret'] },
  { slug: 'otopark-ucretleri-avm-2026-istanbul', title: 'AVM Otopark Ücretleri 2026 İstanbul', keyword: 'AVM otopark ücreti 2026', category: 'Yaşam', hook: 'İlk saat ücretsiz vaatleri ve üst limitler değişebiliyor.', tags: ['otopark', 'AVM'] },
  { slug: 'ehliyet-sinavi-randevu-2026-son-durum', title: 'Ehliyet Sınavı Randevu 2026 Son Durum', keyword: 'ehliyet sınav randevu 2026', category: 'Ulaşım', hook: 'Randevu yoğunluğu ve iptal kuralları adayları zorluyor.', tags: ['ehliyet', 'randevu'] },
  { slug: 'trafik-cezalari-2026-odeme-indirimi', title: 'Trafik Cezaları 2026 Erken Ödeme İndirimi', keyword: 'trafik cezası erken ödeme 2026', category: 'Ulaşım', hook: 'Erken ödeme indirimi süresi kaçınca maliyet artıyor.', tags: ['trafik cezası', 'ödeme'] },

  // Teknoloji / AI / dijital (15)
  { slug: 'chatgpt-yeni-ozellikler-kasim-2026', title: 'ChatGPT Yeni Özellikler Kasım 2026', keyword: 'ChatGPT yeni özellikler 2026', category: 'Teknoloji', hook: 'Yapay zeka güncellemeleri her duyuruda tıklanma rekoru kırıyor.', tags: ['ChatGPT', 'yapay zeka'] },
  { slug: 'yapay-zeka-is-ilanlari-2026-nasil-degisiyor', title: 'Yapay Zeka İş İlanlarını 2026’da Nasıl Değiştiriyor?', keyword: 'yapay zeka iş ilanları 2026', category: 'Teknoloji', hook: 'CV tarama ve mülakat araçları yaygınlaşırken adaylar yeni strateji arıyor.', tags: ['AI', 'kariyer'] },
  { slug: 'google-gemini-vs-chatgpt-2026', title: 'Google Gemini vs ChatGPT 2026', keyword: 'Gemini vs ChatGPT 2026', category: 'Teknoloji', hook: 'Hangi asistanın ne işe yaradığı merak konusu; abartısız karşılaştırma.', tags: ['Gemini', 'ChatGPT'] },
  { slug: 'iphone-17-turkiye-fiyati-2026-tahmini', title: 'iPhone 17 Türkiye Fiyatı 2026 Tahmini', keyword: 'iPhone 17 Türkiye fiyat', category: 'Teknoloji', hook: 'Lansman öncesi fiyat spekülasyonu yüksek CTR getiriyor; resmi liste şart.', tags: ['iPhone', 'fiyat'] },
  { slug: 'android-yeni-guncelleme-2026-ne-getiriyor', title: 'Android Yeni Güncelleme 2026 Ne Getiriyor?', keyword: 'Android güncelleme 2026', category: 'Teknoloji', hook: 'Güvenlik yaması ve arayüz değişiklikleri kullanıcıları etkiliyor.', tags: ['Android', 'güncelleme'] },
  { slug: 'whatsapp-yeni-ozellikler-kasim-2026', title: 'WhatsApp Yeni Özellikler Kasım 2026', keyword: 'WhatsApp yeni özellikler 2026', category: 'Teknoloji', hook: 'Kanallar, gizlilik ve durum güncellemeleri sık gündeme geliyor.', tags: ['WhatsApp', 'uygulama'] },
  { slug: 'instagram-algoritma-degisikligi-2026', title: 'Instagram Algoritma Değişikliği 2026', keyword: 'Instagram algoritma 2026', category: 'Teknoloji', hook: 'Organik erişim düşüşü şikayetleri artınca “nasıl düzelir” aranıyor.', tags: ['Instagram', 'algoritma'] },
  { slug: 'tiktok-turkiye-2026-son-durum', title: 'TikTok Türkiye 2026 Son Durum', keyword: 'TikTok Türkiye 2026', category: 'Teknoloji', hook: 'Düzenleme ve erişim tartışmaları her gelişmede viral oluyor.', tags: ['TikTok', 'gündem'] },
  { slug: 'fiber-internet-fiyatlari-kasim-2026', title: 'Fiber İnternet Fiyatları Kasım 2026', keyword: 'fiber internet fiyat 2026', category: 'Teknoloji', hook: 'Paket karşılaştırmasında taahhüt ve hız taahhüdü kritik.', tags: ['fiber', 'internet'] },
  { slug: 'siber-dolandiricilik-kasim-2026-nasil-korunulur', title: 'Siber Dolandırıcılık Kasım 2026: Nasıl Korunulur?', keyword: 'siber dolandırıcılık 2026', category: 'Teknoloji', hook: 'Sahte banka SMS’leri ve yatırım vaatleri kış döneminde artıyor.', tags: ['güvenlik', 'dolandırıcılık'] },
  { slug: 'e-devlet-yeni-hizmetler-kasim-2026', title: 'e-Devlet Yeni Hizmetler Kasım 2026', keyword: 'e-Devlet yeni hizmetler 2026', category: 'Teknoloji', hook: 'Yeni menü ve başvuru kısayolları çıktığında arama hacmi yükseliyor.', tags: ['e-devlet', 'resmi'] },
  { slug: 'dijital-gozluk-ve-vr-2026-turkiye', title: 'Dijital Gözlük ve VR 2026 Türkiye', keyword: 'VR gözlük 2026 Türkiye', category: 'Teknoloji', hook: 'Yeni nesil cihaz spekülasyonları hediye sezonunda artıyor.', tags: ['VR', 'teknoloji'] },
  { slug: 'netflix-zam-mi-geliyor-2026-turkiye', title: 'Netflix Zam mı Geliyor? 2026 Türkiye', keyword: 'Netflix zam 2026 Türkiye', category: 'Eğlence', hook: 'Abonelik ücreti spekülasyonu her çeyrekte tıklanıyor.', tags: ['Netflix', 'zam'] },
  { slug: 'spotify-fiyatlari-2026-turkiye', title: 'Spotify Fiyatları 2026 Türkiye', keyword: 'Spotify fiyat 2026', category: 'Eğlence', hook: 'Aile ve öğrenci paket koşulları sık soruluyor.', tags: ['Spotify', 'abonelik'] },
  { slug: 'youtube-premium-deger-mi-2026', title: 'YouTube Premium Değer mi? 2026', keyword: 'YouTube Premium 2026', category: 'Eğlence', hook: 'Reklamsız izleme vs ücret tartışması yeniden alevlendi.', tags: ['YouTube', 'premium'] },

  // Sağlık / kış (10)
  { slug: 'grip-sezonu-2026-asisi-ne-zaman', title: 'Grip Sezonu 2026: Aşı Ne Zaman Yapılmalı?', keyword: 'grip aşısı 2026', category: 'Sağlık', hook: 'Sonbahar-kış geçişinde aşı zamanlaması en çok aranan sağlık konularından.', tags: ['grip', 'aşı'] },
  { slug: 'rsv-ve-soguk-alginligi-2026-fark', title: 'RSV ve Soğuk Algınlığı 2026: Farkı Ne?', keyword: 'RSV soğuk algınlığı farkı', category: 'Sağlık', hook: 'Belirti karışıklığı artınca güvenilir bilgi aranıyor.', tags: ['RSV', 'sağlık'] },
  { slug: 'karbonmonoksit-zehirlenmesi-kis-2026', title: 'Karbonmonoksit Zehirlenmesi Kış 2026', keyword: 'karbonmonoksit zehirlenmesi kış', category: 'Sağlık', hook: 'Soba ve şofben uyarıları her kış yeniden gündem oluyor.', tags: ['güvenlik', 'kış'] },
  { slug: 'd-vitamini-eksikligi-kis-2026', title: 'D Vitamini Eksikliği Kış 2026', keyword: 'D vitamini eksikliği kış', category: 'Sağlık', hook: 'Güneş azaldıkça takviye tartışmaları yükseliyor; hekim önerisi şart.', tags: ['vitamin', 'kış'] },
  { slug: 'evde-hava-nemlendirme-kis-2026', title: 'Evde Hava Nemlendirme Kış 2026', keyword: 'hava nemlendirme kış', category: 'Yaşam', hook: 'Kuru hava şikayetlerinde doğru nem oranı aranıyor.', tags: ['nem', 'ev'] },
  { slug: 'cocuklarda-okul-virusu-kasim-2026', title: 'Çocuklarda Okul Virüsü Kasım 2026', keyword: 'okul virüsü Kasım 2026', category: 'Sağlık', hook: 'Okul döneminde bulaşıcı hastalık paniği bilgi aratıyor.', tags: ['çocuk', 'okul'] },
  { slug: 'psikolojik-destek-hatlari-2026-turkiye', title: 'Psikolojik Destek Hatları 2026 Türkiye', keyword: 'psikolojik destek hattı 2026', category: 'Sağlık', hook: 'Kriz dönemlerinde doğru yardım hattı bilgisi hayat kurtarır.', tags: ['psikoloji', 'destek'] },
  { slug: 'uyku-duzeni-kis-saati-2026', title: 'Uyku Düzeni ve Kış Saati 2026', keyword: 'kış saati uyku 2026', category: 'Sağlık', hook: 'Saat değişimi tartışmaları her yıl uyku düzenini etkiliyor.', tags: ['uyku', 'saat'] },
  { slug: 'evde-spor-rutini-kis-2026', title: 'Evde Spor Rutini Kış 2026', keyword: 'evde spor kış 2026', category: 'Yaşam', hook: 'Soğuk havada salon yerine ev antrenmanı arayanlar artıyor.', tags: ['spor', 'ev'] },
  { slug: 'beslenme-bagisiklik-kis-2026', title: 'Beslenme ve Bağışıklık Kış 2026', keyword: 'bağışıklık beslenme kış', category: 'Sağlık', hook: 'Abartılı “mucize besin” iddialarına karşı dengeli yaklaşım.', tags: ['beslenme', 'bağışıklık'] },

  // Dünya Kupası / spor / eğlence (10)
  { slug: 'dunya-kupasi-2026-turkiye-mac-takvimi', title: 'Dünya Kupası 2026 Türkiye Maç Takvimi', keyword: 'Dünya Kupası 2026 takvim', category: 'Spor', hook: '2026 Dünya Kupası yaklaşırken maç ve yayın takvimi aramaları yükseliyor.', tags: ['dünya kupası', 'futbol'] },
  { slug: 'dunya-kupasi-2026-nerede-oynanacak', title: 'Dünya Kupası 2026 Nerede Oynanacak?', keyword: 'Dünya Kupası 2026 nerede', category: 'Spor', hook: 'Ev sahibi ülkeler ve stadyum listesi merak konusu.', tags: ['dünya kupası', 'stadyum'] },
  { slug: 'dunya-kupasi-2026-bilet-fiyatlari', title: 'Dünya Kupası 2026 Bilet Fiyatları', keyword: 'Dünya Kupası 2026 bilet', category: 'Spor', hook: 'Resmi bilet kanalları dışında satış tuzaklarına dikkat.', tags: ['bilet', 'dünya kupası'] },
  { slug: 'super-lig-puan-durumu-kasim-2026', title: 'Süper Lig Puan Durumu Kasım 2026', keyword: 'Süper Lig puan durumu', category: 'Spor', hook: 'Haftalık puan durumu aramaları istikrarlı trafik getirir.', tags: ['Süper Lig', 'futbol'] },
  { slug: 'transfer-donemi-2026-kis-penceresi', title: 'Transfer Dönemi 2026 Kış Penceresi', keyword: 'kış transfer penceresi 2026', category: 'Spor', hook: 'Pencere açılmadan spekülasyonlar zirve yapıyor.', tags: ['transfer', 'futbol'] },
  { slug: 'netflix-dizileri-kasim-2026-ne-izlenir', title: 'Netflix Dizileri Kasım 2026: Ne İzlenir?', keyword: 'Netflix dizileri Kasım 2026', category: 'Eğlence', hook: 'Yeni sezon ve dizi listeleri haftalık tıklanma getiriyor.', tags: ['Netflix', 'dizi'] },
  { slug: 'sinema-vizyon-kasim-2026-istanbul', title: 'Sinema Vizyon Kasım 2026 İstanbul', keyword: 'sinema vizyon Kasım 2026', category: 'Eğlence', hook: 'Haftalık vizyon listesi ve bilet kampanyaları aranıyor.', tags: ['sinema', 'vizyon'] },
  { slug: 'konser-biletleri-aralik-2026-istanbul', title: 'Konser Biletleri Aralık 2026 İstanbul', keyword: 'İstanbul konser Aralık 2026', category: 'Eğlence', hook: 'Yılbaşı öncesi konser takvimi erken tükeniyor.', tags: ['konser', 'bilet'] },
  { slug: 'oyun-konsolu-indirim-2026-kasim', title: 'Oyun Konsolu İndirim 2026 Kasım', keyword: 'oyun konsolu indirim 2026', category: 'Eğlence', hook: 'PS ve Xbox paketlerinde sahte stok uyarısı önemli.', tags: ['oyun', 'konsol'] },
  { slug: 'espor-turnuvalari-2026-turkiye', title: 'E-Spor Turnuvaları 2026 Türkiye', keyword: 'e-spor turnuva 2026 Türkiye', category: 'Eğlence', hook: 'Yerel ve global turnuva takvimleri genç izleyici çekiyor.', tags: ['e-spor', 'turnuva'] },

  // Eğitim / kariyer / yaşam (13)
  { slug: 'okul-ara-tatili-2026-ne-zaman', title: 'Okul Ara Tatili 2026 Ne Zaman?', keyword: 'okul ara tatili 2026', category: 'Eğitim', hook: 'Milli Eğitim takvimi her dönem ebeveyn aramalarını patlatıyor.', tags: ['okul', 'tatil'] },
  { slug: 'yks-2026-basvuru-takvimi-son-durum', title: 'YKS 2026 Başvuru Takvimi Son Durum', keyword: 'YKS 2026 başvuru', category: 'Eğitim', hook: 'Başvuru ve ücret tarihlerinde resmi ÖSYM duyurusu esas.', tags: ['YKS', 'ÖSYM'] },
  { slug: 'lgs-2026-tercih-rehberi-erken', title: 'LGS 2026 Tercih Rehberi (Erken Bakış)', keyword: 'LGS 2026 tercih', category: 'Eğitim', hook: 'Erken hazırlık yapan aileler için süreç haritası.', tags: ['LGS', 'tercih'] },
  { slug: 'uzaktan-calisma-2026-turkiye-trend', title: 'Uzaktan Çalışma 2026 Türkiye Trend', keyword: 'uzaktan çalışma 2026', category: 'Kariyer', hook: 'Hibrit model tartışmaları iş ilanı metinlerinde artıyor.', tags: ['remote', 'kariyer'] },
  { slug: 'cv-hazirlama-yapay-zeka-2026', title: 'CV Hazırlama ve Yapay Zeka 2026', keyword: 'CV yapay zeka 2026', category: 'Kariyer', hook: 'AI ile CV yazmak yaygınlaştı; abartı ve doğruluk dengesi kritik.', tags: ['CV', 'AI'] },
  { slug: 'ise-alim-mulakat-sorulari-2026', title: 'İşe Alım Mülakat Soruları 2026', keyword: 'mülakat soruları 2026', category: 'Kariyer', hook: 'Yetkinlik bazlı sorular ve örnek cevap çerçeveleri aranıyor.', tags: ['mülakat', 'iş'] },
  { slug: 'kira-sozlesmesi-dijital-imza-2026', title: 'Kira Sözleşmesi Dijital İmza 2026', keyword: 'kira sözleşmesi e-imza 2026', category: 'Yaşam', hook: 'Dijital sözleşme geçerliliği ve noter ihtiyacı karıştırılıyor.', tags: ['kira', 'e-imza'] },
  { slug: 'aidat-artisina-itiraz-2026', title: 'Aidat Artışına İtiraz 2026', keyword: 'aidat artışı itiraz 2026', category: 'Yaşam', hook: 'Site yönetiminde şeffaflık talepleri kış döneminde artıyor.', tags: ['aidat', 'site'] },
  { slug: 'evde-enerji-verimliligi-kis-2026', title: 'Evde Enerji Verimliliği Kış 2026', keyword: 'ev enerji verimliliği kış', category: 'Yaşam', hook: 'Isı kaybı ve fatura düşürme pratikleri yeniden gündemde.', tags: ['enerji', 'ev'] },
  { slug: 'ikinci-el-araba-fiyatlari-kasim-2026', title: 'İkinci El Araba Fiyatları Kasım 2026', keyword: 'ikinci el araba Kasım 2026', category: 'Yaşam', hook: 'Piyasa yumuşaması iddiaları ile ekspertiz şartı birlikte anılmalı.', tags: ['otomobil', 'ikinci el'] },
  { slug: 'elektrikli-arac-tesvik-2026-turkiye', title: 'Elektrikli Araç Teşvik 2026 Türkiye', keyword: 'elektrikli araç teşvik 2026', category: 'Yaşam', hook: 'Şarj altyapısı ve teşvik spekülasyonu yüksek ilgi çekiyor.', tags: ['EV', 'teşvik'] },
  { slug: 'pet-mama-fiyatlari-2026-son-durum', title: 'Pet Mama Fiyatları 2026 Son Durum', keyword: 'pet mama fiyat 2026', category: 'Yaşam', hook: 'Evcil hayvan sahipleri enflasyon etkisini yakından izliyor.', tags: ['pet', 'fiyat'] },
  { slug: 'istanbul-hafta-sonu-etkinlik-kasim-2026', title: 'İstanbul Hafta Sonu Etkinlik Kasım 2026', keyword: 'İstanbul hafta sonu etkinlik', category: 'Yaşam', hook: 'Ücretsiz ve aile dostu etkinlik listeleri düzenli trafik getirir.', tags: ['etkinlik', 'İstanbul'] },

  // Ek yüksek CTR (10) — hava, finans, tatil, dijital
  { slug: 'istanbul-hava-durumu-7-gun-kis-2026', title: 'İstanbul Hava Durumu 7 Gün Kış 2026', keyword: 'İstanbul hava durumu 7 gün', category: 'Yaşam', hook: 'Soğuk dalga uyarılarında haftalık hava aramaları zirve yapıyor.', tags: ['hava', 'İstanbul'] },
  { slug: 'mevduat-faizi-kasim-2026-karsilastirma', title: 'Mevduat Faizi Kasım 2026 Karşılaştırma', keyword: 'mevduat faizi Kasım 2026', category: 'Ekonomi', hook: 'Banka faiz kampanyaları haftalık değişince karşılaştırma aranıyor.', tags: ['mevduat', 'faiz'] },
  { slug: 'kripto-piyasasi-kasim-2026-dikkat', title: 'Kripto Piyasası Kasım 2026: Dikkat Edilecekler', keyword: 'kripto Kasım 2026', category: 'Ekonomi', hook: 'Ani hareketlerde FOMO tuzaklarına karşı temkinli çerçeve.', tags: ['kripto', 'risk'] },
  { slug: 'yilbasi-menusu-2026-pratik-tarifler', title: 'Yılbaşı Menüsü 2026: Pratik Tarifler', keyword: 'yılbaşı menüsü 2026', category: 'Yaşam', hook: 'Aralık’ta pratik menü aramaları düzenli yükselir.', tags: ['yılbaşı', 'tarif'] },
  { slug: 'kapadokya-yilbasi-2026-tur-fiyatlari', title: 'Kapadokya Yılbaşı 2026 Tur Fiyatları', keyword: 'Kapadokya yılbaşı 2026', category: 'Seyahat', hook: 'Balon ve otel paketleri erken tükeniyor; iptal koşulları kritik.', tags: ['Kapadokya', 'tur'] },
  { slug: 'uludag-kayak-sezonu-2026-ne-zaman', title: 'Uludağ Kayak Sezonu 2026 Ne Zaman?', keyword: 'Uludağ kayak sezonu 2026', category: 'Seyahat', hook: 'Sezon açılışı spekülasyonu her yıl erken başlar.', tags: ['Uludağ', 'kayak'] },
  { slug: 'dijital-bankacilik-guvenligi-2026', title: 'Dijital Bankacılık Güvenliği 2026', keyword: 'dijital bankacılık güvenlik 2026', category: 'Teknoloji', hook: 'Sahte uygulama ve OTP dolandırıcılığı kışın artıyor.', tags: ['banka', 'güvenlik'] },
  { slug: 'akilli-ev-cihazlari-indirim-2026', title: 'Akıllı Ev Cihazları İndirim 2026', keyword: 'akıllı ev indirim 2026', category: 'Alışveriş', hook: 'Kasım kampanyalarında güvenlik kamerası ve robot süpürge öne çıkıyor.', tags: ['akıllı ev', 'indirim'] },
  { slug: 'cocuk-oyuncaklari-guvenli-alisveris-2026', title: 'Çocuk Oyuncakları: Güvenli Alışveriş 2026', keyword: 'güvenli oyuncak alışveriş 2026', category: 'Alışveriş', hook: 'Yılbaşı öncesi CE belgesi ve yaş uyarısı kontrolü şart.', tags: ['oyuncak', 'güvenlik'] },
  { slug: 'istanbul-muzeleri-ucretsiz-gunler-2026', title: 'İstanbul Müzeleri Ücretsiz Günler 2026', keyword: 'İstanbul müze ücretsiz gün 2026', category: 'Yaşam', hook: 'Ücretsiz giriş günleri aile planlamasında sık aranıyor.', tags: ['müze', 'ücretsiz'] },
];

function assignDistrictAndImage(i: number, t: Omit<CompactTopic, 'district' | 'image'>): CompactTopic {
  const district = DISTRICTS[i % DISTRICTS.length];
  const image =
    t.category === 'Ekonomi' || t.category === 'Alışveriş'
      ? t.category === 'Alışveriş'
        ? IMG.shop
        : IMG.finance
      : t.category === 'Teknoloji'
        ? IMG.tech
        : t.category === 'Ulaşım'
          ? IMG.traffic
          : t.category === 'Sağlık'
            ? IMG.health
            : t.category === 'Spor'
              ? IMG.sport
              : t.category === 'Eğlence'
                ? IMG.fun
                : t.category === 'Eğitim' || t.category === 'Kariyer'
                  ? IMG.edu
                  : t.category === 'Seyahat'
                    ? IMG.travel
                    : IMG.city;
  return { ...t, district, image };
}

export function generateAllV6Posts(): BlogSeedPost[] {
  if (COMPACT.length !== 100) {
    throw new Error(`V6 içerik sayısı hatalı: ${COMPACT.length}/100`);
  }
  return COMPACT.map((t, i) => makeEngagementGuidePost(expandTopic(assignDistrictAndImage(i, t))));
}
