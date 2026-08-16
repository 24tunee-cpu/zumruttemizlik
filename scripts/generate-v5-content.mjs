/**
 * One-off generator for seed-blog-v5-content.ts — 100 clickbait Istanbul posts.
 * Run: node scripts/generate-v5-content.mjs
 */
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const IMG = {
  istanbul: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200',
  traffic: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200',
  tech: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
  food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200',
  health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200',
  home: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200',
  travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200',
  finance: 'https://images.unsplash.com/photo-1554224311-beee415c201f?w=1200',
  fun: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
  edu: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
};

const DISTRICTS = [
  'Kadıköy', 'Beşiktaş', 'Üsküdar', 'Bakırköy', 'Ataşehir', 'Kağıthane',
  'Sarıyer', 'Maltepe', 'Esenyurt', 'Başakşehir', 'Beylikdüzü', 'Şişli',
  'Fatih', 'Ümraniye', 'Pendik', 'Kartal', 'Avcılar', 'Bahçelievler',
  'Zeytinburnu', 'Eyüpsultan',
];

/** 10 groups × 10 topics = 100 */
const GROUPS = [
  {
    category: 'Gündem',
    image: IMG.finance,
    extraTag: 'gündem',
    topics: [
      ['kira-fiyatlari-dusuyor-mu', 'son-durum', "İstanbul'da Kira Fiyatları Düşüyor mu? 2026 Son Durum", 'kira fiyatları 2026', 'Kira piyasasında son aylarda ilan fiyatları ve gerçekleşen kira bedelleri arasındaki fark İstanbul\'da en çok merak edilen konulardan biri.', 'Resmi istatistikler ile saha verileri', 'Kiracı ve ev sahibi için pratik adımlar', 'Kira piyasası'],
      ['ev-alim-kredisi-faizleri', 'neden-artiyor', "Ev Alım Kredisi Faizleri Neden Artıyor? İstanbul 2026", 'konut kredisi faiz oranı', 'Konut kredisi faizleri 2026\'da dalgalı seyrediyor; İstanbul\'da ev almak isteyenler güncel oranları yakından takip ediyor.', 'Faiz oranını etkileyen makro faktörler', 'Kredi başvurusu öncesi kontrol listesi', 'konut kredisi'],
      ['emlak-vergisi-artisi', 'gercek-mi', 'Emlak Vergisi Artışı Gerçek mi? İstanbul Daire Sahipleri', 'emlak vergisi artışı', '2026 emlak vergisi beyan döneminde İstanbul\'da rayiç bedel güncellemeleri konuşuluyor.', 'Vergi hesaplama mantığı', 'İtiraz ve indirim imkânları', 'emlak vergisi'],
      ['asgari-ucret-zammi', 'ne-zaman', 'Asgari Ücret Zammı Ne Zaman Açıklanacak? 2026', 'asgari ücret 2026', 'Asgari ücret görüşmeleri İstanbul\'daki milyonlarca çalışanı doğrudan ilgilendiriyor.', 'Zam sürecinin takvimi', 'Brüt-net maaş hesabı', 'asgari ücret'],
      ['enflasyon-orani', 'son-durum', 'İstanbul Enflasyon Oranı: 2026 Son Durum ve Etkileri', 'enflasyon oranı 2026', 'TÜFE verileri market, kira ve ulaşım harcamalarını İstanbul\'da doğrudan etkiliyor.', 'Enflasyonun günlük hayata yansıması', 'Bütçe planlaması ipuçları', 'enflasyon'],
      ['konut-kredisi-onay-suresi', 'neden-artiyor', 'Konut Kredisi Onay Süresi Neden Uzuyor? İstanbul 2026', 'konut kredisi onay süresi', 'Bankaların risk değerlendirme süreçleri 2026\'da daha detaylı hale geldi.', 'Onay sürecinde istenen belgeler', 'Red riskini azaltan adımlar', 'banka kredisi'],
      ['kira-artisi-tavan-orani', 'gercek-mi', 'Kira Artış Tavan Oranı Gerçekten Uygulanıyor mu?', 'kira artış tavan oranı', 'TÜFE tavanı ile sözleşme maddeleri arasındaki fark kiracıların en sık sorduğu soru.', 'Yasal tavan nasıl hesaplanır', 'Haksız artışa karşı haklar', 'kira artışı'],
      ['yabanci-alicilar-konut', 'gundem', 'Yabancılar İstanbul\'da Konut Alıyor mu? 2026 Gündem', 'yabancı konut alımı İstanbul', 'Yabancı alıcı düzenlemeleri ve ilçe bazlı talep 2026 gündeminde.', 'Güncel mevzuat özeti', 'Alım sürecinde dikkat edilecekler', 'konut alımı'],
      ['rezidans-projeleri-durdu-mu', 'son-durum', 'İstanbul Rezidans Projeleri Durdu mu? Son Durum', 'rezidans projeleri İstanbul', 'Yeni konut projelerinde teslim tarihleri ve fiyat revizyonları takip ediliyor.', 'Proje gecikmesi ve haklar', 'Ön satış sözleşmesi kontrolü', 'rezidans'],
      ['deprem-zamani-konut-sigortasi', 'ne-zaman', 'Deprem Sigortası (DASK) Ne Zaman Yenilenmeli? 2026', 'DASK yenileme 2026', 'DASK poliçe yenileme dönemi İstanbul\'da zorunlu ve kritik bir adım.', 'DASK başvuru adımları', 'Poliçe kapsamı ve eksikler', 'DASK'],
    ],
  },
  {
    category: 'Ekonomi',
    image: IMG.finance,
    extraTag: 'ekonomi',
    topics: [
      ['dolar-kuru', 'neden-artiyor', "Dolar Kuru Neden Artıyor? İstanbul'da Günlük Etkiler", 'dolar kuru 2026', 'Döviz kuru dalgalanması ithal ürün fiyatlarından kira sözleşmelerine kadar geniş etki yaratır.', 'Kurun enflasyonla ilişkisi', 'Döviz bazlı sözleşme riskleri', 'döviz'],
      ['altin-fiyatlari', 'son-durum', 'Altın Fiyatları 2026: İstanbul Yatırımcısı İçin Son Durum', 'altın fiyatları 2026', 'Gram altın ve çeyrek altın fiyatları birikim yapan İstanbulluların radarında.', 'Altın alım-satım kanalları', 'Sahte altın kontrolü', 'altın'],
      ['memur-maasi-zammi', 'gercek-mi', 'Memur Maaşı Zammı Gerçek mi? 2026 Hesaplama', 'memur maaşı zammı 2026', 'Kamu çalışanları zam oranı ve enflasyon farkı tartışmalarını takip ediyor.', 'Maaş hesaplama bileşenleri', 'Sendika süreci ve takvim', 'memur maaşı'],
      ['emekli-maasi-artisi', 'ne-zaman', 'Emekli Maaşı Artışı Ne Zaman Yansır? 2026', 'emekli maaşı artışı 2026', 'Emekli maaşlarına yıl başı düzenlemesi İstanbul\'da geniş kitleyi ilgilendiriyor.', 'Artış hesaplama yöntemi', 'Banka kesintileri ve net tutar', 'emekli maaşı'],
      ['kredi-karti-faiz-orani', 'gundem', 'Kredi Kartı Faiz Oranı Zam mı Geliyor? 2026 Gündem', 'kredi kartı faiz oranı', 'Revolving faiz ve gecikme faizi düzenlemeleri kart kullanıcılarını etkiliyor.', 'Faiz hesaplama örneği', 'Borç yönetimi stratejileri', 'kredi kartı'],
      ['tuketici-kredisi-limiti', 'neden-artiyor', 'Tüketici Kredisi Limitleri Neden Değişiyor? 2026', 'tüketici kredisi limiti', 'Bankaların risk skorlaması kredi limitlerini bireysel bazda güncelliyor.', 'Kredi notu iyileştirme', 'Başvuru reddi nedenleri', 'tüketici kredisi'],
      ['market-fiyatlari', 'son-durum', 'İstanbul Market Fiyatları: 2026 Son Durum Karşılaştırması', 'market fiyatları İstanbul', 'Zincir market ve mahalle bakkalı arasında fiyat farkı araştırılıyor.', 'Enflasyonla market alışverişi', 'İndirim ve sadakat programları', 'market'],
      ['elektrik-faturasi-artisi', 'gercek-mi', 'Elektrik Faturası Artışı Gerçek mi? İstanbul 2026', 'elektrik faturası artışı', 'Tarife grupları ve tüketim dilimleri fatura tutarını doğrudan belirliyor.', 'Fatura okuma ve itiraz', 'Tasarruf önlemleri', 'elektrik faturası'],
      ['dogalgaz-faturasi', 'ne-zaman', 'Doğalgaz Faturası Ne Zaman Kesilir? Kış 2026 Rehberi', 'doğalgaz faturası 2026', 'Kış aylarında ısınma giderleri İstanbul\'da bütçeyi zorlayan kalemler arasında.', 'Abonelik ve sayaç okuma', 'Enerji tasarrufu ipuçları', 'doğalgaz'],
      ['vergi-iadesi', 'gundem', 'Vergi İadesi Ne Zaman Yatar? 2026 Gündem', 'vergi iadesi 2026', 'Gelir vergisi iadesi bekleyen milyonlarca kişi ödeme takvimini soruyor.', 'Başvuru ve takip adımları', 'Eksik belge düzeltme', 'vergi iadesi'],
    ],
  },
  {
    category: 'Ulaşım',
    image: IMG.traffic,
    extraTag: 'ulaşım',
    topics: [
      ['metrobus-ucreti', 'neden-artiyor', 'Metrobüs Zam mı Geliyor? İstanbullunun Bilmesi Gerekenler', 'metrobüs ücreti 2026', 'Toplu taşıma tarifeleri yıllık güncelleme döneminde gündeme geliyor.', 'Güncel tarife tablosu okuma', 'İstanbulkart indirimleri', 'metrobüs'],
      ['metro-hat-guncellemesi', 'son-durum', 'İstanbul Metro Hatları: 2026 Son Durum ve Yeni Duraklar', 'metro hatları güncelleme', 'M7, M11 ve yeni hat açılışları ulaşım planlarını değiştiriyor.', 'Hat bazlı sefer sıklığı', 'Aktarma noktaları', 'metro'],
      ['istanbulkart-indirim', 'gercek-mi', 'İstanbulkart Öğrenci İndirimi Gerçekten Uygulanıyor mu?', 'İstanbulkart öğrenci indirimi', 'Öğrenci ve 65+ indirimleri kart tanımlamasına bağlı.', 'Kart başvuru adımları', 'Bakiye yükleme kanalları', 'İstanbulkart'],
      ['marmaray-sefer', 'ne-zaman', 'Marmaray Sefer Saatleri Ne Zaman Değişiyor? 2026', 'Marmaray sefer saatleri', 'Avrupa-Anadolu hattında yoğun saatlerde sefer sıklığı artırılıyor.', 'Pik saat planlaması', 'Alternatif hatlar', 'Marmaray'],
      ['trafik-cezasi-artisi', 'gundem', 'Trafik Cezaları Artıyor mu? 2026 Gündem Özeti', 'trafik cezası 2026', '2026 trafik ceza tarifesi sürücülerin gündeminde.', 'Ceza türleri ve tutarlar', 'İtiraz süreci', 'trafik cezası'],
      ['havalimani-ulasim', 'son-durum', 'İstanbul Havalimanı Ulaşım: 2026 Son Durum', 'havalimanı ulaşım İstanbul', 'Havaist, metro ve taksi seçenekleri karşılaştırılıyor.', 'Gece seferleri ve fiyat', 'Rezervasyonlu servisler', 'havalimanı ulaşım'],
      ['kopru-gecis-ucreti', 'neden-artiyor', 'Köprü Geçiş Ücretleri Neden Artıyor? 2026', 'köprü geçiş ücreti', 'Boğaz köprüleri ve otoyol geçişleri araç sahiplerini etkiliyor.', 'OGS-HGS bakiye yönetimi', 'Alternatif güzergahlar', 'köprü geçiş'],
      ['otopark-ucretleri', 'gercek-mi', 'İstanbul Otopark Ücretleri Gerçekten Bu Kadar mı?', 'otopark ücretleri İstanbul', 'Merkez ilçelerde saatlik otopark tarifeleri yükseldi.', 'Ücretsiz alternatifler', 'Abonelik otopark seçenekleri', 'otopark'],
      ['bisiklet-yolu-projesi', 'ne-zaman', 'İstanbul Bisiklet Yolları Ne Zaman Tamamlanacak?', 'bisiklet yolu projesi İstanbul', 'Belediye bisiklet koridorları şehir içi ulaşımda alternatif sunuyor.', 'Güvenli rota planlama', 'Kiralık bisiklet uygulamaları', 'bisiklet'],
      ['taksi-zammi', 'gundem', 'İstanbul Taksi Zam mı Geliyor? 2026 Gündem', 'taksi ücreti İstanbul', 'Taksi açılış ve km ücreti tartışmaları sürücü ve yolcu arasında.', 'Resmi tarife doğrulama', 'Dijital ödeme seçenekleri', 'taksi'],
    ],
  },
  {
    category: 'Teknoloji',
    image: IMG.tech,
    extraTag: 'teknoloji',
    topics: [
      ['5g-kapsama', 'son-durum', 'İstanbul\'da 5G Kapsama: 2026 Son Durum Haritası', '5G kapsama İstanbul', 'Operatörlerin 5G altyapı genişlemesi ilçe bazlı farklılık gösteriyor.', '5G uyumlu cihaz kontrolü', 'Veri tüketimi ve paket seçimi', '5G'],
      ['fiber-internet-fiyat', 'neden-artiyor', 'Fiber İnternet Fiyatları Neden Artıyor? 2026', 'fiber internet fiyatları', 'Ev internet paketlerinde hız ve fiyat dengesi araştırılıyor.', 'Altyapı sorgulama adımları', 'Taahhüt ve cayma bedeli', 'fiber internet'],
      ['telefon-zammi', 'gercek-mi', 'Telefon Fiyatları Gerçekten Düşecek mi? 2026', 'telefon fiyatları 2026', 'Akıllı telefon piyasasında kur ve vergi etkisi konuşuluyor.', 'İthal cihaz vergisi', 'İkinci el telefon alımı', 'telefon'],
      ['e-devlet-yeni-hizmet', 'ne-zaman', 'e-Devlet\'e Yeni Hizmetler Ne Zaman Geliyor? 2026', 'e-Devlet yeni hizmetler', 'Dijital kamu hizmetleri genişletilerek randevu süreleri kısaltılıyor.', 'Mobil uygulama kullanımı', 'Kimlik doğrulama yöntemleri', 'e-Devlet'],
      ['siber-dolandiricilik', 'gundem', 'Siber Dolandırıcılık Artıyor mu? İstanbul 2026 Gündem', 'siber dolandırıcılık 2026', 'SMS ve sahte banka aramaları vatandaşları hedef alıyor.', 'Dolandırıcılık türleri', 'Korunma ve şikâyet adımları', 'siber güvenlik'],
      ['yapay-zeka-is-ilanlari', 'son-durum', 'Yapay Zeka İş İlanlarını Değiştiriyor mu? Son Durum', 'yapay zeka iş ilanları', 'İstanbul\'da teknoloji sektöründe AI becerileri aranan yetkinlikler arasına girdi.', 'CV ve mülakat hazırlığı', 'Online eğitim kaynakları', 'yapay zeka'],
      ['online-alisveris-guvenlik', 'neden-artiyor', 'Online Alışveriş Dolandırıcılığı Neden Artıyor?', 'online alışveriş güvenliği', 'Sahte site ve kapıda ödeme tuzakları e-ticarette risk oluşturuyor.', 'Güvenli ödeme kontrolü', 'İade ve chargeback hakları', 'e-ticaret'],
      ['starlink-turkiye', 'gercek-mi', 'Starlink Türkiye\'de Gerçek mi? İstanbul Kullanıcı Deneyimi', 'Starlink Türkiye', 'Uydu internet alternatifi özellikle yeni sitelerde merak uyandırıyor.', 'Kurulum ve maliyet', 'Alternatif internet çözümleri', 'Starlink'],
      ['dijital-kimlik', 'ne-zaman', 'Dijital Kimlik Ne Zaman Zorunlu Olacak? 2026', 'dijital kimlik 2026', 'Mobil kimlik uygulaması resmi işlemlerde yaygınlaşıyor.', 'Aktivasyon adımları', 'Gizlilik ve güvenlik', 'dijital kimlik'],
      ['elektrikli-arac-sarj', 'gundem', 'Elektrikli Araç Şarj İstasyonları: 2026 Gündem', 'elektrikli araç şarj İstanbul', 'Şehir genelinde şarj noktası sayısı artırılıyor.', 'Şarj ücreti hesaplama', 'Ev tipi şarj kurulumu', 'elektrikli araç'],
    ],
  },
  {
    category: 'Yaşam',
    image: IMG.home,
    extraTag: 'yaşam',
    topics: [
      ['apartman-gurultu', 'son-durum', 'Apartmanda Gürültü Sorunu: 2026 Son Durum ve Haklar', 'apartman gürültü sorunu', 'Gece gürültüsü ve tadilat saatleri apartman sakinlerinin sık şikâyeti.', 'Yasal sessizlik saatleri', 'Yönetim planı ve ihtar', 'gürültü'],
      ['site-aidat-artisi', 'neden-artiyor', 'Site Aidatları Neden Artıyor? İstanbul 2026', 'site aidat artışı', 'Enerji ve güvenlik giderleri aidat kalemlerini yukarı çekiyor.', 'Aidat bütçe okuma', 'Toplantıda itiraz hakkı', 'aidat'],
      ['komsuluk-anlasmazligi', 'gercek-mi', 'Komşuluk Anlaşmazlığı Gerçekten Mahkemeye Gider mi?', 'komşuluk anlaşmazlığı', 'Ortak alan ve park yeri tartışmaları yönetim planına bağlı.', 'Arabuluculuk seçeneği', 'Yazılı şikâyet süreci', 'komşuluk'],
      ['ev-tadilati-izin', 'ne-zaman', 'Ev Tadilatı İzni Ne Zaman Gerekir? 2026', 'ev tadilatı izni', 'Taşıyıcı duvar ve dış cephe değişikliklerinde ruhsat şart.', 'Belediye başvuru adımları', 'Komşu bilgilendirme', 'tadilat izni'],
      ['deprem-cantasi', 'gundem', 'Deprem Çantası Hazırlığı: 2026 Gündem Rehberi', 'deprem çantası İstanbul', 'İstanbul\'da deprem hazırlığı konut güvenliğinin temel adımı.', 'Çanta içeriği listesi', 'Aile iletişim planı', 'deprem hazırlığı'],
      ['hava-kalitesi', 'son-durum', 'İstanbul Hava Kalitesi: 2026 Son Durum ve Sağlık', 'hava kalitesi İstanbul', 'PM2.5 ve ozon ölçümleri ilçe bazlı farklılık gösteriyor.', 'Hava kalitesi uygulamaları', 'Hassas gruplar için öneriler', 'hava kalitesi'],
      ['su-kesintisi', 'neden-artiyor', 'Su Kesintileri Neden Artıyor? İstanbul 2026', 'su kesintisi İstanbul', 'Altyapı bakım çalışmaları planlı kesintilere yol açıyor.', 'Kesinti takip kanalları', 'Evde su depolama', 'su kesintisi'],
      ['cop-toplama-saat', 'gercek-mi', 'Çöp Toplama Saatleri Gerçekten Değişti mi? 2026', 'çöp toplama saatleri', 'Belediye geri dönüşüm uygulamaları mahalle bazında güncelleniyor.', 'Ayrıştırma kuralları', 'Ceza ve uyarı süreci', 'geri dönüşüm'],
      ['evcil-hayvan-apartman', 'ne-zaman', 'Apartmanda Evcil Hayvan: Ne Zaman Sorun Olur?', 'apartmanda evcil hayvan', 'Site yönetim planı pet politikalarını belirliyor.', 'Sorumluluk ve hijyen', 'Komşu iletişimi', 'evcil hayvan'],
      ['tasinma-maliyeti', 'gundem', 'İstanbul Taşınma Maliyeti: 2026 Gündem ve Bütçe', 'taşınma maliyeti İstanbul', 'Nakliye, asansör ve sigorta kalemleri bütçeyi belirliyor.', 'Fiyat karşılaştırma', 'Sözleşme maddeleri', 'taşınma'],
    ],
  },
  {
    category: 'Sağlık',
    image: IMG.health,
    extraTag: 'sağlık',
    topics: [
      ['saglik-sigortasi-fiyat', 'neden-artiyor', 'Özel Sağlık Sigortası Neden Pahalılaşıyor? 2026', 'özel sağlık sigortası fiyat', 'Prim artışları poliçe yenileme döneminde gündeme geliyor.', 'Poliçe karşılaştırma', 'Muafiyet ve limit okuma', 'sağlık sigortası'],
      ['hastane-randevu', 'son-durum', 'MHRS Randevu Sistemi: 2026 Son Durum', 'MHRS randevu 2026', 'Hastane randevularında dijital sıra sistemi kullanımı artıyor.', 'Randevu alma adımları', 'Acil servis vs poliklinik', 'MHRS'],
      ['eczane-nobet', 'gercek-mi', 'Nöbetçi Eczane Listesi Gerçekten Güncel mi?', 'nöbetçi eczane İstanbul', 'Gece nöbetçi eczane bilgisi mobil uygulamadan doğrulanmalı.', 'Reçeteli ilaç takibi', 'Acil ilaç bulma', 'eczane'],
      ['grip-asisi', 'ne-zaman', 'Grip Aşısı Ne Zaman Yapılmalı? 2026 Takvimi', 'grip aşısı 2026', 'Kış aylarında aşı randevusu aile hekiminden alınabilir.', 'Aşı sonrası yan etkiler', 'Ücretsiz aşı grupları', 'grip aşısı'],
      ['dis-sagligi-fiyat', 'gundem', 'İstanbul Diş Tedavisi Fiyatları: 2026 Gündem', 'diş tedavisi fiyatları İstanbul', 'İmplant ve ortodonti maliyetleri araştırılıyor.', 'SGK kapsamı', 'Taksitli ödeme seçenekleri', 'diş sağlığı'],
      ['psikolojik-destek', 'son-durum', 'Psikolojik Destek Hattı: 2026 Son Durum', 'psikolojik destek hattı', 'Ücretsiz danışma hatları ve online terapi seçenekleri genişliyor.', 'Acil destek numaraları', 'Gizlilik ve güven', 'ruh sağlığı'],
      ['spor-salonu-fiyat', 'neden-artiyor', 'Spor Salonu Üyelikleri Neden Artıyor? 2026', 'spor salonu üyeliği İstanbul', 'Yıllık aidat ve dondurma koşulları sözleşmede net olmalı.', 'Deneme dersi kullanımı', 'Sözleşme iptali', 'spor salonu'],
      ['beslenme-maliyeti', 'gercek-mi', 'Sağlıklı Beslenme Gerçekten Daha Pahalı mı?', 'sağlılı beslenme maliyeti', 'Ev yapımı menü planlaması market bütçesini optimize edebilir.', 'Haftalık alışveriş listesi', 'Mevsimsel ürün tercihi', 'beslenme'],
      ['cocuk-asilari', 'ne-zaman', 'Çocuk Aşı Takvimi: 2026 Ne Zaman Hangi Aşı?', 'çocuk aşı takvimi 2026', 'Aşı gecikmesi okul kaydı ve seyahat için sorun yaratabilir.', 'Aşı kartı takibi', 'Yan etki yönetimi', 'çocuk sağlığı'],
      ['hava-kirliligi-saglik', 'gundem', 'Hava Kirliliği Sağlığı Etkiliyor mu? 2026 Gündem', 'hava kirliliği sağlık', 'Kronik hastalıklarda hava kalitesi takibi öneriliyor.', 'Maske ve filtre kullanımı', 'Ev hava temizleyici', 'hava kirliliği'],
    ],
  },
  {
    category: 'Eğitim',
    image: IMG.edu,
    extraTag: 'eğitim',
    topics: [
      ['lgs-sonuclari', 'ne-zaman', 'LGS Sonuçları Ne Zaman Açıklanacak? 2026', 'LGS sonuçları 2026', 'Merkezi sınav sonuçları tercih dönemini başlatıyor.', 'Sonuç sorgulama', 'Tercih stratejisi', 'LGS'],
      ['universite-kayit', 'son-durum', 'Üniversite Kayıt Tarihleri: 2026 Son Durum', 'üniversite kayıt 2026', 'E-devlet ve okul sisteminden kayıt adımları takip edilmeli.', 'Belge listesi', 'Harç ve burs başvurusu', 'üniversite kayıt'],
      ['ozel-okul-ucreti', 'neden-artiyor', 'Özel Okul Ücretleri Neden Artıyor? 2026', 'özel okul ücreti İstanbul', 'Taksit ve indirim koşulları sözleşmede açık olmalı.', 'Burs imkânları', 'Sözleşme fesih maddeleri', 'özel okul'],
      ['yks-tercih', 'gercek-mi', 'YKS Tercih Kılavuzu Gerçekten Değişti mi? 2026', 'YKS tercih 2026', 'Puan türü ve kontenjan tabloları güncellendi.', 'Tercih simülasyonu', 'Ek yerleştirme takvimi', 'YKS'],
      ['kres-ucreti', 'gundem', 'Kreş ve Anaokulu Ücretleri: 2026 Gündem', 'kreş ücreti İstanbul', 'Bekleme listesi ve kapora politikaları araştırılıyor.', 'MEB kayıtlı kurum kontrolü', 'Sözleşme maddeleri', 'kreş'],
      ['yabanci-dil-kursu', 'son-durum', 'Yabancı Dil Kursu Fiyatları: 2026 Son Durum', 'yabancı dil kursu İstanbul', 'Online ve yüz yüze paket karşılaştırması yapılabilir.', 'Deneme dersi', 'İade koşulları', 'dil kursu'],
      ['uzaktan-egitim', 'neden-artiyor', 'Uzaktan Eğitim Neden Yaygınlaşıyor? 2026', 'uzaktan eğitim 2026', 'Hibrit eğitim modeli okul ve kurslarda kalıcı hale geldi.', 'Teknik altyapı gereksinimleri', 'Verimli çalışma rutini', 'uzaktan eğitim'],
      ['burs-basvurusu', 'ne-zaman', 'Burs Başvuruları Ne Zaman Başlıyor? 2026', 'burs başvurusu 2026', 'KYK ve vakıf bursları farklı takvimlerle açılıyor.', 'Başvuru belgeleri', 'Sonuç takibi', 'burs'],
      ['staj-imkani', 'gercek-mi', 'Üniversite Stajı Zorunlu mu? Gerçek Durum 2026', 'üniversite stajı 2026', 'Zorunlu staj gün sayısı bölüme göre değişir.', 'Staj yeri bulma', 'SGK staj bildirimi', 'staj'],
      ['ogretmen-atamasi', 'gundem', 'Öğretmen Ataması: 2026 Gündem ve Takvim', 'öğretmen ataması 2026', 'Atama sonuçları ve il tercihleri adayların gündeminde.', 'Atama takvimi', 'İl tercih stratejisi', 'öğretmen ataması'],
    ],
  },
  {
    category: 'Eğlence',
    image: IMG.fun,
    extraTag: 'eğlence',
    topics: [
      ['konser-takvimi', 'son-durum', 'İstanbul Konser Takvimi: 2026 Son Durum', 'konser takvimi İstanbul 2026', 'Açık hava ve kapalı salon etkinlikleri bilet satışlarıyla başlıyor.', 'Bilet güvenliği', 'Ulaşım planlaması', 'konser'],
      ['sinema-bilet-fiyat', 'neden-artiyor', 'Sinema Bilet Fiyatları Neden Artıyor? 2026', 'sinema bilet fiyatı İstanbul', 'Salı indirimleri ve sadakat kartları maliyeti düşürebilir.', 'Online rezervasyon', 'İade koşulları', 'sinema'],
      ['festival-bilet', 'gercek-mi', 'Festival Biletleri Gerçekten Tükeniyor mu? 2026', 'festival biletleri İstanbul', 'Erken kuş biletleri ve resmi satış kanalları önemli.', 'Sahte bilet kontrolü', 'Etkinlik günü hazırlık', 'festival'],
      ['muzik-festivali', 'ne-zaman', 'İstanbul Müzik Festivalleri Ne Zaman Başlıyor?', 'müzik festivali İstanbul 2026', 'Yaz sezonu açık hava etkinlikleri takvimi açıklandı.', 'Bilet türleri', 'Konaklama planı', 'müzik festivali'],
      ['tiyatro-sezonu', 'gundem', 'İstanbul Tiyatro Sezonu: 2026 Gündem', 'tiyatro sezonu İstanbul', 'Yeni oyun listeleri ve abonelik paketleri duyuruldu.', 'Bilet indirimleri', 'Erişilebilirlik', 'tiyatro'],
      ['cafe-restoran-kapanis', 'son-durum', 'Popüler Mekânlar Kapanıyor mu? 2026 Son Durum', 'restoran kapanışları İstanbul', 'Kira ve personel maliyeti sektörü etkiliyor.', 'Rezervasyon ipuçları', 'Alternatif mahalleler', 'restoran'],
      ['gece-hayati-kurallar', 'neden-artiyor', 'Gece Mekânları Kuralları Neden Sıkılaşıyor?', 'gece hayatı kuralları İstanbul', 'Ses ve güvenlik düzenlemeleri işletmeleri etkiliyor.', 'Yaş sınırı ve kimlik', 'Rezervasyon politikası', 'gece hayatı'],
      ['cocuk-etkinligi', 'gercek-mi', 'Çocuk Etkinlikleri Gerçekten Ücretsiz mi? 2026', 'çocuk etkinlikleri İstanbul', 'Belediye ve AVM etkinlikleri takvimden takip edilmeli.', 'Bilet ve kayıt', 'Ulaşım ve park', 'çocuk etkinliği'],
      ['muzeler-ucretsiz', 'ne-zaman', 'Müzeler Ne Zaman Ücretsiz? 2026 Takvimi', 'müze ücretsiz gün İstanbul', 'Belirli günlerde ücretsiz giriş uygulamaları var.', 'Online bilet', 'Rehberli tur seçenekleri', 'müze'],
      ['yaz-etkinlikleri', 'gundem', 'İstanbul Yaz Etkinlikleri: 2026 Gündem Rehberi', 'yaz etkinlikleri İstanbul', 'Sahil şenlikleri ve açık hava sinemalar planlanıyor.', 'Bütçe planlama', 'Kalabalık saatlerden kaçınma', 'yaz etkinlikleri'],
    ],
  },
  {
    category: 'Gündem',
    image: IMG.istanbul,
    extraTag: 'gündem',
    topics: [
      ['belediye-vergi-artisi', 'neden-artiyor', 'Belediye Vergileri Neden Artıyor? İstanbul 2026', 'belediye vergileri 2026', 'Emlak ve çevre temizlik vergisi beyan dönemi yaklaşıyor.', 'Beyanname adımları', 'Taksitlendirme seçenekleri', 'belediye vergisi'],
      ['imar-plani-degisikligi', 'son-durum', 'İmar Planı Değişikliği: 2026 Son Durum', 'imar planı değişikliği İstanbul', 'Dönüşüm alanları konut değerini etkileyebilir.', 'Plan sorgulama', 'İtiraz hakkı', 'imar planı'],
      ['deprem-risk-haritasi', 'gercek-mi', 'Deprem Risk Haritası Gerçek mi? İstanbul 2026', 'deprem risk haritası İstanbul', 'Zemin etüdü ve bina yaşı risk değerlendirmesinde kritik.', 'Bina güçlendirme destekleri', 'Sigorta planlaması', 'deprem riski'],
      ['su-taskini-onlemi', 'ne-zaman', 'Su Baskını Önlemleri Ne Zaman Devreye Giriyor?', 'su baskını önlemi İstanbul', 'Yağmur suyu altyapı projeleri ilçe bazlı ilerliyor.', 'Ev sigortası kapsamı', 'Acil durum planı', 'su baskını'],
      ['orman-yangini', 'gundem', 'Orman Yangını Riski: İstanbul 2026 Gündem', 'orman yangını riski', 'Yaz aylarında piknik ve mangal kuralları sıkı denetleniyor.', 'Yasak bölgeler', 'İhbar hattı', 'orman yangını'],
      ['nufus-artisi', 'son-durum', 'İstanbul Nüfusu Artıyor mu? 2026 Son Durum', 'İstanbul nüfusu 2026', 'Göç ve doğum oranları demografiyi şekillendiriyor.', 'İlçe bazlı yoğunluk', 'Altyapı yatırımları', 'nüfus'],
      ['secim-takvimi', 'neden-artiyor', 'Yerel Seçim Sonrası Düzenlemeler: Neden Konuşuluyor?', 'yerel seçim düzenlemeleri', 'Belediye hizmetleri ve bütçe planlaması gündemde.', 'Vatandaş başvuru kanalları', 'Şeffaf bütçe takibi', 'seçim'],
      ['guvenlik-kamerasi', 'gercek-mi', 'Apartman Güvenlik Kamerası Zorunlu mu?', 'apartman güvenlik kamerası', 'KVKK kuralları kayıt ve erişim süreçlerini belirliyor.', 'Kamera kurulum izni', 'Veri saklama süresi', 'güvenlik kamerası'],
      ['sokak-hayvanlari', 'ne-zaman', 'Sokak Hayvanları Düzenlemesi Ne Zaman?', 'sokak hayvanları düzenlemesi', 'Sahiplendirme ve barınak kapasitesi tartışılıyor.', 'Sahiplendirme süreci', 'Belediye başvurusu', 'sokak hayvanları'],
      ['plaj-sezonu', 'gundem', 'İstanbul Plaj Sezonu Açıldı mı? 2026 Gündem', 'İstanbul plaj sezonu 2026', 'Halk plajları ve giriş ücretleri duyuruldu.', 'Ulaşım ve park', 'Güvenlik kuralları', 'plaj'],
    ],
  },
  {
    category: 'Yaşam',
    image: IMG.travel,
    extraTag: 'yaşam rehberi',
    topics: [
      ['hafta-sonu-gezisi', 'son-durum', 'İstanbul\'a Yakın Hafta Sonu Gezileri: 2026 Son Durum', 'hafta sonu gezisi İstanbul', 'Adalar, Belgrad Ormanı ve sahil kasabaları popüler.', 'Rezervasyon ve bütçe', 'Trafikten kaçınma', 'hafta sonu'],
      ['brunch-mekanlari', 'neden-artiyor', 'Brunch Fiyatları Neden Artıyor? İstanbul 2026', 'brunch fiyatları İstanbul', 'Menü ve servis ücreti toplam maliyeti belirliyor.', 'Rezervasyon ipuçları', 'Alternatif mahalleler', 'brunch'],
      ['avm-indirim', 'gercek-mi', 'AVM İndirim Dönemleri Gerçekten İndirim mi?', 'AVM indirim dönemi', 'Etiket fiyatı ve sepet karşılaştırması yapılmalı.', 'Fiyat takip uygulamaları', 'İade politikası', 'AVM alışveriş'],
      ['kiralik-evcil-arac', 'ne-zaman', 'Kiralık Araç Fiyatları Ne Zaman Düşer? 2026', 'kiralık araç fiyatları İstanbul', 'Tatil dönemlerinde talep artışı fiyatları yükseltiyor.', 'Sigorta ve depozito', 'Km sınırı okuma', 'araç kiralama'],
      ['otobus-turlari', 'gundem', 'Günübirlik Turlar: 2026 Gündem ve Fiyatlar', 'günübirlik turlar İstanbul', 'Organize turlarda iptal koşulları sözleşmede net olmalı.', 'Tur seçimi', 'Sigorta ve güvenlik', 'tur'],
      ['kahvalti-fiyat', 'son-durum', 'Kahvaltı Mekânları: 2026 Fiyat Son Durum', 'kahvaltı fiyatları İstanbul', 'Kişi başı sabit menü ve açık büfe farkı araştırılıyor.', 'Rezervasyon zorunluluğu', 'Servis ücreti', 'kahvaltı'],
      ['ikinci-el-alisveris', 'neden-artiyor', 'İkinci El Pazarları Neden Popüler? 2026', 'ikinci el alışveriş İstanbul', 'Online platform ve semt pazarları alternatif sunuyor.', 'Güvenli alışveriş', 'Fiyat pazarlığı', 'ikinci el'],
      ['cicek-fiyatlari', 'gercek-mi', 'Çiçek Fiyatları Gerçekten Bu Kadar mı? 2026', 'çiçek fiyatları İstanbul', 'Özel günlerde teslimat ücreti artabiliyor.', 'Online sipariş', 'Taze çiçek kontrolü', 'çiçek'],
      ['pet-kuafor', 'ne-zaman', 'Pet Kuaför Randevusu Ne Zaman Alınmalı?', 'pet kuaför İstanbul', 'Yaz tüy dökümü döneminde randevu yoğunluğu artıyor.', 'Fiyat karşılaştırma', 'Aşı ve sağlık kontrolü', 'pet bakım'],
      ['ev-dekorasyon-trend', 'gundem', 'Ev Dekorasyon Trendleri: 2026 Gündem', 'ev dekorasyon trendleri 2026', 'Minimal ve sürdürülebilir malzeme tercihleri öne çıkıyor.', 'Bütçe dostu fikirler', 'Kiralık evde dekorasyon', 'ev dekorasyon'],
    ],
  },
];

function buildSections(keyword, district, groupIdx, topicIdx) {
  const bullets1 = [
    'Resmi kaynakları birincil referans alın',
    'e-Devlet ve kurum duyurularını takip edin',
    'Sözleşme ve dekontları arşivleyin',
    'İlçe müdürlüğü çalışma saatlerini kontrol edin',
    'Dijital başvuru kanallarını tercih edin',
    'Yoğun dönemlerde randevu planlayın',
    'Yazılı teyit ve onay isteyin',
  ];
  const bullets2 = [
    'Eski sosyal medya paylaşımlarına güvenmeyin',
    'Sözlü vaatleri yazılı hale getirin',
    'Son adımda teyit almadan kapatmayın',
    'Üçüncü taraf siteleri çapraz doğrulayın',
    'Gizli maliyet kalemlerini sorun',
    'İptal koşullarını önceden okuyun',
  ];
  return [
    {
      heading: `${keyword} için 2026 güncel adımlar`,
      paragraphs: [
        `${district} ve çevre ilçelerde ${keyword} konusu 2026 boyunca sık gündeme geliyor; resmi duyuruları takip etmek süreci hızlandırır.`,
        'Belgeleri eksiksiz hazırlamak randevu iptallerini ve tekrar ziyaretleri önler; mümkünse dijital başvuru tercih edin.',
      ],
      bullets: bullets1.slice(groupIdx % 2, groupIdx % 2 + 5),
    },
    {
      heading: 'Sık yapılan hatalar ve pratik çözümler',
      paragraphs: [
        'Güncel olmayan blog ve forum yorumları yanlış beklenti oluşturabilir; her zaman resmi tarihleri doğrulayın.',
        'Acele karar vermek yerine en az iki kaynaktan bilgi alın ve yazılı teyit isteyin.',
      ],
      bullets: bullets2.slice(topicIdx % 2, topicIdx % 2 + 4),
    },
    {
      heading: "İstanbul'da verimli uygulama ipuçları",
      paragraphs: [
        `Hafta içi sabah saatlerinde ${district} hattında işlem süreleri genelde daha kısadır.`,
        'Mobil uygulama bildirimleri ve SMS hatırlatmaları son tarih kaçırmayı önler.',
      ],
    },
  ];
}

function buildFaq(keyword, district) {
  return [
    {
      q: `${keyword} için en güncel bilgi nereden alınır?`,
      a: 'e-Devlet, ilgili kurum resmi sitesi ve 2026 duyuruları birincil kaynaktır; üçüncü taraf siteleri tek başına yeterli değildir.',
    },
    {
      q: 'İşlem ücreti veya ek maliyet var mı?',
      a: 'Konuya göre değişir; resmi tarife tablosunu başvuru öncesi kontrol edin ve dekontu saklayın.',
    },
    {
      q: `${district} özelinde fark var mı?`,
      a: 'İlçe müdürlükleri ve altyapı koşulları değişebilir; bulunduğunuz ilçe sayfasındaki notları okuyun.',
    },
  ];
}

const topics = [];
let globalIdx = 0;
for (let gi = 0; gi < GROUPS.length; gi++) {
  const group = GROUPS[gi];
  for (let ti = 0; ti < group.topics.length; ti++) {
    const [base, modifier, title, keyword, intro, s1h, s2h, tag] = group.topics[ti];
    const slug = `istanbul-${base}-${modifier}-2026`;
    const district = DISTRICTS[globalIdx % DISTRICTS.length];
    const sections = buildSections(keyword, district, gi, ti);
    sections[0].heading = `${s1h} — ${keyword}`;
    sections[1].heading = s2h;
    topics.push({
      slug,
      title,
      excerpt: intro.slice(0, 160) + (intro.length > 160 ? '...' : ''),
      metaTitle: title.length > 60 ? title.slice(0, 57) + '...' : title,
      metaDesc: `${keyword} hakkında İstanbul 2026 güncel rehber: adımlar, sık hatalar ve pratik ipuçları.`,
      category: group.category,
      image: group.image,
      keyword,
      extraTags: [tag, group.extraTag, 'gündem'].filter((v, i, a) => a.indexOf(v) === i),
      intro,
      sections,
      faq: buildFaq(keyword, district),
    });
    globalIdx++;
  }
}

if (topics.length !== 100) throw new Error(`Expected 100 topics, got ${topics.length}`);

function escapeStr(s) {
  return JSON.stringify(s);
}

const topicBlocks = topics.map((t) => `  {
    slug: ${escapeStr(t.slug)},
    title: ${escapeStr(t.title)},
    excerpt: ${escapeStr(t.excerpt)},
    metaTitle: ${escapeStr(t.metaTitle)},
    metaDesc: ${escapeStr(t.metaDesc)},
    category: ${escapeStr(t.category)},
    image: ${escapeStr(t.image)},
    keyword: ${escapeStr(t.keyword)},
    extraTags: ${JSON.stringify(t.extraTags)},
    intro: ${escapeStr(t.intro)},
    sections: ${JSON.stringify(t.sections, null, 6).replace(/^/gm, '    ').trim()},
    faq: ${JSON.stringify(t.faq, null, 6).replace(/^/gm, '    ').trim()},
  }`).join(',\n');

const output = `/**
 * 100 otomatik zamanlanmış blog v5 — İstanbul gündem / yüksek etkileşim (clickbait başlık).
 * v4 ile slug çakışması yok; farklı kalıp: neden-artiyor, gercek-mi, ne-zaman, son-durum, gundem.
 */
import type { BlogSeedPost } from './seed-blog';
import { makeEngagementGuidePost, type EngagementGuideConfig } from './blog-engagement-html';

const IMG_ISTANBUL = 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200';
const IMG_TRAFFIC = 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200';
const IMG_TECH = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200';
const IMG_FOOD = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200';
const IMG_HEALTH = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200';
const IMG_HOME = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200';
const IMG_TRAVEL = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200';
const IMG_FINANCE = 'https://images.unsplash.com/photo-1554224311-beee415c201f?w=1200';
const IMG_FUN = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200';
const IMG_EDU = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200';

type TopicInput = {
  slug: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDesc: string;
  category: string;
  image: string;
  keyword: string;
  extraTags: string[];
  intro: string;
  sections: EngagementGuideConfig['sections'];
  faq: EngagementGuideConfig['faq'];
};

function makeTopic(input: TopicInput): BlogSeedPost {
  const tags = [...new Set([...input.extraTags, 'istanbul', '2026', 'yaşam rehberi', 'gündem'])].slice(0, 6);
  return makeEngagementGuidePost({
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    metaTitle: input.metaTitle,
    metaDesc: input.metaDesc,
    category: input.category,
    image: input.image,
    tags,
    keyword: input.keyword,
    intro: input.intro,
    sections: input.sections,
    faq: input.faq,
  });
}

const TOPICS: TopicInput[] = [
${topicBlocks},
];

/** Gündem×2: 20 · Ekonomi: 10 · Ulaşım: 10 · Teknoloji: 10 · Yaşam×2: 20 · Sağlık: 10 · Eğitim: 10 · Eğlence: 10 */
export function generateAllV5Posts(): BlogSeedPost[] {
  if (TOPICS.length !== 100) {
    throw new Error(\`V5 içerik sayısı hatalı: \${TOPICS.length}/100\`);
  }
  return TOPICS.map(makeTopic);
}
`;

writeFileSync(resolve('src/lib/seed-blog-v5-content.ts'), output, 'utf8');
console.log('Generated src/lib/seed-blog-v5-content.ts with', topics.length, 'topics');
