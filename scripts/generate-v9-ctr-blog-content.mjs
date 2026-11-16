/**
 * 100 v9 CTR / hook blog (Ads destek: koltuk + inşaat ağırlıklı)
 * Marka-güvenli clickbait başlık; peyzaj yok; drip yok.
 * Run: node scripts/generate-v9-ctr-blog-content.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const IMG = {
  home: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
  sofa: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
  carpet: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200',
  window: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200',
  build: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200',
  villa: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
  city: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200',
};

const S = {
  ev: { href: '/hizmetler/ev-temizligi', label: 'Ev temizliği' },
  ofis: { href: '/hizmetler/ofis-temizligi', label: 'Ofis temizliği' },
  insaat: { href: '/hizmetler/insaat-sonrasi-temizlik', label: 'İnşaat sonrası temizlik' },
  koltuk: { href: '/hizmetler/koltuk-yikama', label: 'Koltuk yıkama' },
  hali: { href: '/hizmetler/hali-yikama', label: 'Halı yıkama' },
  cam: { href: '/hizmetler/cam-temizligi', label: 'Cam temizliği' },
  cephe: { href: '/hizmetler/dis-cephe-temizligi', label: 'Dış cephe temizliği' },
};

const A = {
  sariyer: { href: '/bolgeler/sariyer', label: 'Sarıyer temizlik' },
  zeker: { href: '/bolgeler/sariyer/zekeriyakoy', label: 'Zekeriyaköy temizlik' },
  maslak: { href: '/bolgeler/sariyer/maslak', label: 'Maslak temizlik' },
  tarabya: { href: '/bolgeler/sariyer/tarabya', label: 'Tarabya temizlik' },
  bahce: { href: '/bolgeler/sariyer/bahcekoy', label: 'Bahçeköy temizlik' },
  uskum: { href: '/bolgeler/sariyer/uskumrukoy', label: 'Uskumruköy temizlik' },
  sisli: { href: '/bolgeler/sisli', label: 'Şişli temizlik' },
  besiktas: { href: '/bolgeler/besiktas', label: 'Beşiktaş temizlik' },
  kadikoy: { href: '/bolgeler/kadikoy', label: 'Kadıköy temizlik' },
  umraniye: { href: '/bolgeler/umraniye', label: 'Ümraniye temizlik' },
  atasehir: { href: '/bolgeler/atasehir', label: 'Ataşehir temizlik' },
  bakirkoy: { href: '/bolgeler/bakirkoy', label: 'Bakırköy temizlik' },
  kagithane: { href: '/bolgeler/kagithane', label: 'Kağıthane temizlik' },
  uskudar: { href: '/bolgeler/uskudar', label: 'Üsküdar temizlik' },
  maltepe: { href: '/bolgeler/maltepe', label: 'Maltepe temizlik' },
  kartal: { href: '/bolgeler/kartal', label: 'Kartal temizlik' },
  pendik: { href: '/bolgeler/pendik', label: 'Pendik temizlik' },
  fatih: { href: '/bolgeler/fatih', label: 'Fatih temizlik' },
  eyup: { href: '/bolgeler/eyupsultan', label: 'Eyüpsultan temizlik' },
  zeytinburnu: { href: '/bolgeler/zeytinburnu', label: 'Zeytinburnu temizlik' },
};

const FACTORS = {
  ev: [
    'Net m² ve oda/banyo sayısı',
    'Dolu / boş ev',
    'Kirlilik ve ıslak hacim',
    'Kat, asansör, site girişi',
    'Ek işler: cam, koltuk',
  ],
  ofis: [
    'Ofis m² ve workstation',
    'Frekans (günlük/haftalık/tek)',
    'Mesai dışı / güvenlik izni',
    'Mutfak–çay ocağı',
    'Ortak alan dahil mi?',
  ],
  insaat: [
    'Brüt/net m² ve kirlilik sınıfı',
    'Alçı–ince toz yoğunluğu',
    'Pencere/pervaz ve ıslak hacim',
    'Mobilya öncesi mi sonrası mı',
    'Kat erişimi / havalandırma',
  ],
  koltuk: [
    'Takım / parça adedi',
    'Kumaş tipi ve leke yaşı',
    'Pet / koku ek işlemi',
    'Kuruma süresi planı',
    'Villa / apartman erişimi',
  ],
  hali: [
    'Halı m²',
    'Leke ve pet notu',
    'Evde yıkama vs taşıma',
    'Kuruma alanı',
    'Kat / asansör',
  ],
  cam: [
    'Cam paneli sayısı',
    'İç / dış erişim',
    'Yükseklik ve güvenlik',
    'Site / yönetici onayı',
    'Tuz–toz (Boğaz hattı)',
  ],
  cephe: [
    'Cephe alanı ve malzeme',
    'Erişim yöntemi',
    'Kir / tuz birikimi',
    'Site koordinasyonu',
    'Peyzaj yok — yalnız yüzey',
  ],
};

const SCENARIOS = {
  ev: [
    '1+1 kısa tur',
    '2+1–3+1 aile yarım–bir gün',
    'Villa / dubleks keşif',
    'Taşınma sonrası checklist',
  ],
  ofis: [
    'Butik ofis akşam turu',
    'Açık ofis gece',
    'Plaza güvenlik prosedürü',
    'Periyodik sözleşme',
  ],
  insaat: [
    'Yeni daire ince toz',
    'Ofis teslim mobilya öncesi',
    'Boya / tadilat sonrası',
    'Villa teslim m² planı',
  ],
  koltuk: [
    'Tek kanepe + kuruma',
    'Takım (3+1) yarım gün',
    'Leke odaklı lokal',
    'Pet koku ek süre',
  ],
  hali: [
    'Küçük kilim',
    'Salon halısı ölçü',
    'Çoklu halı paket',
    'Kalın villa hali',
  ],
  cam: [
    'Daire iç cam',
    'Cam balkon sonrası',
    'Villa cephe cam',
    'Plaza cam onayı',
  ],
  cephe: [
    'Küçük villa cephe',
    'Site blok koordinasyon',
    'Boğaz tuzu bakım',
    'Boyasız yüzey temizliği',
  ],
};

/** slug, title, keyword, category, hook, audience, duration, service, area, image, tag, compareNote */
const ROWS = [
  // —— KOLTUK (Ads) 35 ——
  ['sariyer-koltuk-yikama-kimse-soylemiyor-2026', 'Sarıyer Koltuk Yıkama: Kimse Söylemiyor (2026)', 'Sarıyer koltuk yıkama', 'CTR Hook', 'Yerinde yıkamada kuruma süresi ve kumaş tipi fiyatı belirler; “sabit ucuz” vaadi yanıltıcıdır.', 'Sarıyer', 'Birkaç saat+kuruma', 'koltuk', 'sariyer', 'sofa', 'sarıyer', 'Platform fiyatı ile keşif teklifi farklıdır.'],
  ['koltuk-yikama-fiyatlari-sok-mu-gercek-2026', 'Koltuk Yıkama Fiyatları Şok mu? Gerçek Tablo 2026', 'koltuk yıkama fiyatları', 'CTR Hook', 'Tekli, köşe ve takım fiyatları aynı kalemde toplanmaz; adet ve leke ayrı yazılır.', 'Fiyat arayan', 'Takıma göre', 'koltuk', 'sariyer', 'sofa', 'fiyat', 'm² değil parça/takım mantığı hâkimdir.'],
  ['yerinde-koltuk-yikama-yapmadan-once-2026', 'Yerinde Koltuk Yıkama Yapmadan Önce Bunu Okuyun', 'yerinde koltuk yıkama', 'CTR Hook', 'Ev tipi agresif kimyasal kumaşı bozabilir; profesyonel ürün + vakum şarttır.', 'Ev sahipleri', 'Takıma göre', 'koltuk', 'sariyer', 'sofa', 'yerinde', 'Atölye taşıma ile yerinde farklı senaryodur.'],
  ['1-hatayla-koltuk-kumasini-mahvedersiniz-2026', '1 Hatayla Koltuk Kumaşını Mahvedersiniz (2026)', 'koltuk kumaş yıkama hatası', 'CTR Hook', 'Yanlış solvent ve aşırı ıslatma renk solması ve çekme riski yaratır.', 'DIY denemiş', 'Lokal/takım', 'koltuk', 'kadikoy', 'sofa', 'hata', 'Garanti her lekeyi %100 çıkarmak değildir.'],
  ['zekeriyakoy-koltuk-yikama-villa-dikkat-2026', 'Zekeriyaköy Koltuk Yıkama: Villa Sahipleri Dikkat', 'Zekeriyaköy koltuk yıkama', 'CTR Hook', 'Villa erişimi ve kuruma alanı randevu gününe yazılmalı; peyzaj dahil değildir.', 'Villa', 'Keşif', 'koltuk', 'zeker', 'sofa', 'zekeriyaköy', 'Apartman kısa turundan süre farkı olabilir.'],
  ['kose-koltuk-yikama-ucreti-neden-yuksek-2026', 'Köşe Koltuk Yıkama Ücreti Neden Yüksek? 2026', 'köşe koltuk yıkama ücreti', 'CTR Hook', 'L/köşe takımda yüzey ve minder sayısı tek kanepeden fazladır.', 'Köşe takım', 'Yarım gün+', 'koltuk', 'sariyer', 'sofa', 'köşe', 'Tekli fiyatı çarpı 3 diye hesaplanmaz.'],
  ['deri-mi-kumas-mi-koltuk-yikama-2026', 'Deri mi Kumaş mı? Koltuk Yıkama Kararı 2026', 'deri kumaş koltuk yıkama', 'CTR Hook', 'Deri ve kumaş farklı ürün ister; tek şampuanla ikisi birden risklidir.', 'Karar', 'Tipe göre', 'koltuk', 'besiktas', 'sofa', 'deri', 'Nubuk/hassas yüzeyde keşif şart.'],
  ['koltuk-leke-cikarma-garanti-mi-2026', 'Koltuk Leke Çıkarma Garanti mi? Net Cevap 2026', 'koltuk leke çıkarma', 'CTR Hook', 'Leke tipi ve yaşı başarıyı belirler; çıkmayacak leke önceden söylenir.', 'Leke', 'Lokal+', 'koltuk', 'sisli', 'sofa', 'leke', 'Kalıcı mürekkep/boya için boş vaat yok.'],
  ['evcil-hayvan-koltuk-koku-yikama-2026', 'Evcil Hayvan Koltuk Kokusu: Yıkama İşe Yarar mı?', 'koltuk koku giderme', 'CTR Hook', 'Pet koku turu ek süre doğurabilir; tek yıkamada mucize iddiası yok.', 'Pet', 'Ek süre', 'koltuk', 'kagithane', 'sofa', 'pet', 'Halı ayrı paketlenebilir.'],
  ['maslak-koltuk-yikama-rezidans-2026', 'Maslak Koltuk Yıkama: Rezidans İçin Kısa Rehber', 'Maslak koltuk yıkama', 'CTR Hook', 'Site/rezidans giriş ve otopark notu randevuyu hızlandırır.', 'Maslak', 'Takıma göre', 'koltuk', 'maslak', 'sofa', 'maslak', 'Plaza ofis paketiyle karıştırılmaz.'],
  ['tarabya-koltuk-yikama-randevu-ipuclari-2026', 'Tarabya Koltuk Yıkama Randevu İpuçları 2026', 'Tarabya koltuk yıkama', 'CTR Hook', 'Boğaz hattında trafik slot seçimini etkiler; sabah genelde verimlidir.', 'Tarabya', 'Birkaç saat', 'koltuk', 'tarabya', 'sofa', 'tarabya', 'Aynı gün garanti değildir.'],
  ['bahcekoy-koltuk-yikama-orman-hatti-2026', 'Bahçeköy Koltuk Yıkama: Orman Hattı Notları', 'Bahçeköy koltuk yıkama', 'CTR Hook', 'Erişim ve villa tipi takım keşifte netleşir.', 'Bahçeköy', 'Keşif', 'koltuk', 'bahce', 'sofa', 'bahçeköy', 'Peyzaj/bahçe düzenleme yok.'],
  ['istinye-koltuk-yikama-fiyat-hook-2026', 'İstinye Koltuk Yıkama Fiyatı: Ne Beklemeli?', 'İstinye koltuk yıkama', 'CTR Hook', 'Parça adedi + leke yaşı teklifi şekillendirir; online tahmin sonrası teyit.', 'İstinye', 'Takıma göre', 'koltuk', 'sariyer', 'sofa', 'istinye', 'Sabit internet fiyatı yanıltıcı olabilir.'],
  ['yenikoy-koltuk-yikama-yerinde-2026', 'Yeniköy’de Yerinde Koltuk Yıkama: 2026 Özet', 'Yeniköy koltuk yıkama', 'CTR Hook', 'Yerinde servis taşımayı kaldırır; kuruma planı şart.', 'Yeniköy', 'Kuruma dahil plan', 'koltuk', 'sariyer', 'sofa', 'yeniköy', 'Atölye modeliyle süre farklıdır.'],
  ['uskumrukoy-koltuk-yikama-2026-hook', 'Uskumruköy Koltuk Yıkama: Erken Rezervasyon Neden?', 'Uskumruköy koltuk yıkama', 'CTR Hook', 'Orman içi hattında rota planı randevuyu etkiler.', 'Uskumruköy', 'Keşif', 'koltuk', 'uskum', 'sofa', 'uskumruköy', 'Kış erişiminde sabah tercih edilir.'],
  ['buharli-koltuk-yikama-gerekiyor-mu-2026', 'Buharlı Koltuk Yıkama Gerekiyor mu? 2026', 'buharlı koltuk yıkama', 'CTR Hook', 'Hassas kumaşta buhar tercih edilebilir; her kumaşa aynı yöntem yok.', 'Hassas kumaş', 'Tipe göre', 'koltuk', 'kadikoy', 'sofa', 'buhar', 'Sıcak su ekstraksiyonu ile karıştırılmamalı.'],
  ['koltuk-takimi-yikama-3-2-1-ucret-2026', '3+2+1 Koltuk Takımı Yıkama Ücreti 2026', 'koltuk takımı yıkama ücreti', 'CTR Hook', 'Takım paketi tek parça toplamından farklı fiyatlanabilir.', 'Salon takımı', 'Yarım gün', 'koltuk', 'sariyer', 'sofa', 'takım', 'Minderli/mindersiz farkı yazılır.'],
  ['berjer-yikama-ucreti-kucuk-ama-2026', 'Berjer Yıkama Ücreti Küçük ama Kritik 2026', 'berjer yıkama ücreti', 'CTR Hook', 'Tekli berjer kısa sürer; leke varsa lokal ek işlem açılır.', 'Berjer', '1–2 saat', 'koltuk', 'besiktas', 'sofa', 'berjer', 'Kanepe fiyatıyla karıştırılmaz.'],
  ['cekyat-yikama-acmadan-once-2026', 'Çekyat Yıkama: Açmadan Önce Bunları Bilin', 'çekyat yıkama', 'CTR Hook', 'Mekanizma ve kumaş birlikte değerlendirilir; ıslak bırakılmaz.', 'Çekyat', 'Birkaç saat', 'koltuk', 'umraniye', 'sofa', 'çekyat', 'Yatak yüzeyi ayrı not edilebilir.'],
  ['koltuk-yikama-kuruma-suresi-gercek-2026', 'Koltuk Yıkama Kuruma Süresi: Gerçek Aralık 2026', 'koltuk yıkama kuruma süresi', 'CTR Hook', 'Tipik 4–12 saat; ısı, kumaş ve yöntem süreyi değiştirir.', 'Kuruma soran', '4–12 saat', 'koltuk', 'sariyer', 'sofa', 'kuruma', 'Aynı gün oturma her zaman mümkün değildir.'],
  ['sariyer-yerinde-koltuk-yikama-teklif-2026', 'Sarıyer Yerinde Koltuk Yıkama Teklifi Nasıl Alınır?', 'Sarıyer yerinde koltuk yıkama', 'CTR Hook', 'Foto + parça sayısı WhatsApp’ta hızlandırır; kesin rakam keşifle.', 'Sarıyer lead', 'Hızlı brifing', 'koltuk', 'sariyer', 'sofa', 'teklif', 'Eksik bilgi sapmayı büyütür.'],
  ['profesyonel-koltuk-yikama-vs-kendin-yap-2026', 'Profesyonel Koltuk Yıkama vs Kendin Yap 2026', 'profesyonel koltuk yıkama', 'CTR Hook', 'Ekipman + ürün uyumu riski düşürür; saat ücreti tek kriter değildir.', 'Karşılaştırma', '—', 'koltuk', 'kadikoy', 'sofa', 'diy', 'DIY hata maliyeti sık unutulur.'],
  ['koltuk-temizleme-mi-yikama-mi-2026', 'Koltuk Temizleme mi Yıkama mı? Fark Ne?', 'koltuk temizleme', 'CTR Hook', 'Yüzey silme ile derin yıkama aynı şey değildir; niyet net yazılmalı.', 'Arama niyeti', 'Tipe göre', 'koltuk', 'sisli', 'sofa', 'temizleme', 'Leke için derin yıkama gerekir.'],
  ['l-koltuk-yikama-fiyat-hook-2026', 'L Koltuk Yıkama Fiyatı: Hesabı Böyle Yapın', 'L koltuk yıkama fiyatı', 'CTR Hook', 'L formda ek kanat ve puf ayrıca sayılır.', 'L takım', 'Yarım gün+', 'koltuk', 'atasehir', 'sofa', 'l koltuk', 'Standart 3’lü ile kıyas yanıltır.'],
  ['kumas-koltuk-yikama-renk-solmaz-mi-2026', 'Kumaş Koltuk Yıkama Renk Solmaz mı?', 'kumaş koltuk yıkama', 'CTR Hook', 'Doğru ürünle solma riski düşer; aşınmış kumaşta beklenti keşifte netleşir.', 'Kumaş', 'Takıma göre', 'koltuk', 'bakirkoy', 'sofa', 'kumaş', 'Eski solma yıkamadan kaynaklanmaz.'],
  ['koltuk-yikama-randevu-ayni-gun-2026', 'Koltuk Yıkama Aynı Gün Olur mu? 2026', 'koltuk yıkama aynı gün', 'CTR Hook', 'Kapasite uygunsa açılır; yoğun günde ertesi gün daha gerçekçidir.', 'Acil', 'Aynı gün?', 'koltuk', 'sariyer', 'sofa', 'acil', 'Garanti slot değildir.'],
  ['koltuk-yikama-firmasi-nasil-secilir-2026', 'Koltuk Yıkama Firması Nasıl Seçilir? 2026', 'koltuk yıkama firması', 'CTR Hook', 'Yazılı kapsam, ürün uyumu ve kuruma planı sorun; yalnızca fiyata bakmayın.', 'Firma seçen', '—', 'koltuk', 'sariyer', 'sofa', 'firma', 'Platform en ucuz = en iyi değildir.'],
  ['koltuk-yikama-sirketi-ucretsiz-kesif-2026', 'Koltuk Yıkama Şirketi + Ücretsiz Keşif Mantığı', 'koltuk yıkama şirketi', 'CTR Hook', 'Keşif satış baskısı değil; kumaş ve leke için bilgi turudur.', 'İlk kez', 'Kısa keşif', 'koltuk', 'sariyer', 'sofa', 'şirket', 'Online tahmin sözleşmeye dönüşmez.'],
  ['bebekli-ev-koltuk-yikama-hijyen-2026', 'Bebekli Evde Koltuk Yıkama: Hijyen Notları', 'bebek koltuk yıkama', 'CTR Hook', 'Sık dokunulan yüzey ve kuruma planı önceliklidir; tıbbi sterilizasyon iddiası yok.', 'Bebekli aile', 'Takım+kuruma', 'koltuk', 'sariyer', 'sofa', 'bebek', 'Ürün uyumu önceden sorulur.'],
  ['ofis-bekleme-koltuk-yikama-2026', 'Ofis Bekleme Koltuğu Yıkama: Kısa Rehber', 'ofis koltuk yıkama', 'CTR Hook', 'Plaza/ofis izinleri randevu öncesi alınmalı.', 'Ofis', 'Lokal', 'koltuk', 'maslak', 'sofa', 'ofis', 'Ev takımı paketinden farklı olabilir.'],
  ['kilyos-koltuk-yikama-yaz-sezonu-2026', 'Kilyos Koltuk Yıkama: Yaz Sezonu Notu 2026', 'Kilyos koltuk yıkama', 'CTR Hook', 'Sezon yoğunluğunda erken rezervasyon slotu korur.', 'Kilyos', 'Keşif', 'koltuk', 'sariyer', 'sofa', 'kilyos', 'Aynı gün garanti değildir.'],
  ['koltuk-yikama-ne-kadar-tutar-hook-2026', 'Koltuk Yıkama Ne Kadar Tutar? 30 Sn Cevap', 'koltuk yıkama ne kadar', 'CTR Hook', 'Parça/takım + leke + erişim; net rakam keşif veya foto brifing ile.', 'Fiyat', '—', 'koltuk', 'sariyer', 'sofa', 'ne kadar', 'Tek rakam her eve uymaz.'],
  ['koltuk-yikama-ucreti-gizli-maliyet-2026', 'Koltuk Yıkama Ücreti: Gizli Maliyet Var mı?', 'koltuk yıkama ücreti', 'CTR Hook', 'Yazılı kapsam dışına çıkılmaz; keşif dışı ekstra ayrıca teklif edilir.', 'Şeffaflık', '—', 'koltuk', 'sariyer', 'sofa', 'ücret', 'Sürpriz ek ücret dili kullanılmaz.'],
  ['sariyer-koltuk-yikama-fiyatlari-2026-hook', 'Sarıyer Koltuk Yıkama Fiyatları 2026: Hook Rehber', 'Sarıyer koltuk yıkama fiyatları', 'CTR Hook', 'İlçe + takım tipi birleşince teklif netleşir; platform aralığı yalnızca referanstır.', 'Sarıyer', 'Takıma göre', 'koltuk', 'sariyer', 'sofa', 'fiyat', 'Villa erişimi süreye yansıyabilir.'],
  ['kadikoy-koltuk-yikama-tiklanma-2026', 'Kadıköy Koltuk Yıkama: Tıklanınca Ne Beklenir?', 'Kadıköy koltuk yıkama', 'CTR Hook', 'Randevu, yerinde uygulama, kuruma planı — sırayla ilerler.', 'Kadıköy', 'Takıma göre', 'koltuk', 'kadikoy', 'sofa', 'kadıköy', 'Anadolu Yakası planlı rota.'],

  // —— İNŞAAT / TADİLAT (Ads) 25 ——
  ['insaat-sonrasi-temizlik-kimse-anlatmiyor-2026', 'İnşaat Sonrası Temizlik: Kimse Anlatmıyor (2026)', 'inşaat sonrası temizlik', 'CTR Hook', 'İnce toz turu mobilyadan önce yapılmalı; standart ev paketi yetmez.', 'Teslim', 'm²+sınıf', 'insaat', 'sariyer', 'build', 'inşaat', 'Kaba ve ince aşama farklıdır.'],
  ['insaat-sonrasi-temizlik-fiyatlari-gercek-2026', 'İnşaat Sonrası Temizlik Fiyatları: Gerçek Tablo', 'inşaat sonrası temizlik fiyatları', 'CTR Hook', 'Yalnızca m² yetmez; kirlilik sınıfı ve cam/pervaz sayısı kritiktir.', 'Fiyat', 'm²', 'insaat', 'sariyer', 'build', 'fiyat', 'Online tahmin keşifle doğrulanır.'],
  ['kaba-insaat-temizligi-yapmadan-once-2026', 'Kaba İnşaat Temizliği Yapmadan Önce', 'kaba inşaat temizliği', 'CTR Hook', 'Moloz ve kalın kir sonrası ince toz programı ayrı planlanır.', 'Şantiye/teslim', 'Aşama', 'insaat', 'kagithane', 'build', 'kaba', 'İnce temizlik aynı gün yetmeyebilir.'],
  ['ince-insaat-temizligi-neden-sart-2026', 'İnce İnşaat Temizliği Neden Şart? 2026', 'ince inşaat temizliği', 'CTR Hook', 'Görünmeyen alçı tozu mobilya sonrası kabusa döner.', 'Yeni daire', 'm²', 'insaat', 'atasehir', 'build', 'ince', 'Kaba tur yetmez.'],
  ['tadilat-sonrasi-temizlik-hata-2026', 'Tadilat Sonrası Temizlik: 5 Pahalı Hata', 'tadilat sonrası temizlik', 'CTR Hook', 'Boya sıçrantısı yanlış ürünle yüzeyi çizer; keşif şart.', 'Tadilat', 'm²', 'insaat', 'kadikoy', 'build', 'tadilat', 'Ustalık işi temizlik değildir.'],
  ['sifir-daire-temizligi-mobilyadan-once-2026', 'Sıfır Daire Temizliği: Mobilyadan Önce!', 'sıfır daire temizliği', 'CTR Hook', 'Teslim tozu mobilya altına yerleşmeden çıkarılmalı.', 'Yeni teslim', 'm²', 'insaat', 'sariyer', 'build', 'sıfır', 'Standart ev turu farklıdır.'],
  ['anahtar-teslim-temizlik-ne-demek-2026', 'Anahtar Teslim Temizlik Ne Demek? 2026', 'anahtar teslim temizlik', 'CTR Hook', 'Oturuma hazır yüzey checklist’i; peyzaj ve inşaat işçiliği yok.', 'Teslim', 'Keşif', 'insaat', 'sariyer', 'build', 'anahtar', 'Müteahhit işi ile karıştırılmaz.'],
  ['sariyer-insaat-sonrasi-hook-2026', 'Sarıyer İnşaat Sonrası: Villa/Daire Farkı', 'Sarıyer inşaat sonrası temizlik', 'CTR Hook', 'Villa m² ve çoklu banyo keşifsiz fiyatı bozar.', 'Sarıyer', 'Keşif', 'insaat', 'sariyer', 'build', 'sarıyer', 'Online + keşif ikilisi.'],
  ['zekeriyakoy-insaat-sonrasi-villa-2026', 'Zekeriyaköy İnşaat Sonrası Villa Temizliği', 'Zekeriyaköy inşaat sonrası', 'CTR Hook', 'Orman/villa hattında erişim ve toz programı yazılır.', 'Villa teslim', 'Keşif', 'insaat', 'zeker', 'build', 'zekeriyaköy', 'Peyzaj yoktur.'],
  ['boya-sonrasi-temizlik-sirlar-2026', 'Boya Sonrası Temizlik: Bilinen Yanlışlar', 'boya sonrası temizlik', 'CTR Hook', 'Sıçrantı + ince toz birlikte planlanır; boya işçiliği dahil değil.', 'Boya', 'm²', 'insaat', 'besiktas', 'build', 'boya', 'Asitli ürün risklidir.'],
  ['badana-sonrasi-toz-temizlik-2026', 'Badana Sonrası Toz Temizliği 2026', 'badana sonrası temizlik', 'CTR Hook', 'Alçı tozu mikrofiber turu ister; tek süpürme yetmez.', 'Badana', 'm²', 'insaat', 'umraniye', 'build', 'badana', 'Ev genelinden ayrı sınıf.'],
  ['yeni-daire-teslim-temizlik-tikla-2026', 'Yeni Daire Teslim Temizliği: Tıklayınca Ne Olur?', 'yeni daire teslim temizliği', 'CTR Hook', 'Keşif → yazılı kapsam → ince toz checklist → teslim.', 'Teslim alan', 'm²', 'insaat', 'maltepe', 'build', 'teslim', 'Mobilya sonrası zorlaşır.'],
  ['ofis-teslim-insaat-temizlik-2026', 'Ofis Teslim İnşaat Temizliği: Plaza Notu', 'ofis teslim temizliği', 'CTR Hook', 'Güvenlik ve asansör prosedürü mobilya öncesi kritiktir.', 'Ofis', 'm²', 'insaat', 'maslak', 'build', 'ofis teslim', 'Gece slotu gerekebilir.'],
  ['kagithane-insaat-sonrasi-hook-2026', 'Kağıthane İnşaat Sonrası: Yeni Konut Uyarısı', 'Kağıthane inşaat sonrası', 'CTR Hook', 'Yeni stokta ince toz yoğunluğu yüksektir.', 'Kağıthane', 'm²', 'insaat', 'kagithane', 'build', 'kağıthane', 'Standart ev yetmeyebilir.'],
  ['bahcekoy-insaat-sonrasi-hook-2026', 'Bahçeköy İnşaat Sonrası Temizlik Hook Rehber', 'Bahçeköy inşaat sonrası', 'CTR Hook', 'Yeni villa/site teslimlerinde toz + cam kalemi ayrı yazılır.', 'Bahçeköy', 'Keşif', 'insaat', 'bahce', 'build', 'bahçeköy', 'Peyzaj yok.'],
  ['insaat-sonrasi-m2-yalanlari-2026', 'İnşaat Sonrası m² Yalanları 2026', 'inşaat sonrası m² fiyat', 'CTR Hook', 'Ucuz m² vaadi kirlilik sınıfını gizler; keşif şart.', 'Fiyat', 'm²+sınıf', 'insaat', 'sariyer', 'build', 'm²', 'Brüt/net farkı sorun yaratır.'],
  ['tadilat-sonrasi-temizlik-fiyatlari-2026-h', 'Tadilat Sonrası Temizlik Fiyatları Hook 2026', 'tadilat sonrası temizlik fiyatları', 'CTR Hook', 'Kapsam: toz, sıçrantı, ıslak hacim — yazılı olmadan sabit fiyat riskli.', 'Tadilat', 'm²', 'insaat', 'sisli', 'build', 'fiyat', 'Usta işi ayrıdır.'],
  ['insaat-sonrasi-temizlik-sirketi-sec-2026', 'İnşaat Sonrası Temizlik Şirketi Seçerken', 'inşaat sonrası temizlik şirketi', 'CTR Hook', 'Checklist, ekipman ve keşif sorun; yalnızca “ucuz ekip” yetmez.', 'Firma', '—', 'insaat', 'sariyer', 'build', 'şirket', 'Referans foto gerçek iş olmalı.'],
  ['insaat-sonrasi-temizlik-firmasi-hook-2026', 'İnşaat Sonrası Temizlik Firması: 2026 Kontrol', 'inşaat sonrası temizlik firması', 'CTR Hook', 'Sigorta, kapsam yazımı ve teslim kontrolü sorun.', 'Firma', '—', 'insaat', 'sariyer', 'build', 'firma', 'Platform puanı tek başına yetmez.'],
  ['istanbul-insaat-sonrasi-temizlik-hook-2026', 'İstanbul İnşaat Sonrası Temizlik: Odak Sarıyer', 'İstanbul inşaat sonrası temizlik', 'CTR Hook', 'Şehir genelinde aransa da operasyon önceliği Sarıyer hattıdır.', 'İstanbul', 'Keşif', 'insaat', 'sariyer', 'build', 'istanbul', 'Uzak ilçe aynı gün olmayabilir.'],
  ['montaj-sonrasi-toz-temizlik-hook-2026', 'Montaj Sonrası Toz: Küçük İş Büyük Risk', 'montaj sonrası toz temizliği', 'CTR Hook', 'İnce partikül mobilya sonrasında daha pahalıya patlar.', 'Montaj', 'Birkaç saat', 'insaat', 'kadikoy', 'build', 'montaj', 'İnşaat tesliminden hafif olabilir.'],
  ['cam-balkon-montaj-sonrasi-toz-2026', 'Cam Balkon Montaj Sonrası Toz Temizliği', 'cam balkon sonrası toz', 'CTR Hook', 'Montaj tozu standart cam turundan farklıdır.', 'Cam balkon', 'Keşif', 'insaat', 'bakirkoy', 'build', 'cam balkon', 'Cam+toz birlikte planlanabilir.'],
  ['insaat-sonrasi-ucretsiz-kesif-neden-2026', 'İnşaat Sonrası Ücretsiz Keşif Neden Şart?', 'inşaat sonrası ücretsiz keşif', 'CTR Hook', 'Kirlilik sınıfı yerinde görülmeden net fiyat çıkmaz.', 'Keşif', '15–40 dk', 'insaat', 'sariyer', 'build', 'keşif', 'Foto bazen yeter; villa’da yerinde daha iyi.'],
  ['kaba-vs-ince-insaat-temizlik-2026', 'Kaba vs İnce İnşaat Temizliği: Hangisi Önce?', 'kaba ince inşaat temizliği', 'CTR Hook', 'Önce kaba, sonra ince; ters sıra maliyeti artırır.', 'Aşama', '2 aşama', 'insaat', 'sariyer', 'build', 'aşama', 'Tek pakette birleştirilebilir.'],
  ['villa-insaat-sonrasi-temizlik-hook-2026', 'Villa İnşaat Sonrası Temizlik: Pahalı Hata Listesi', 'villa inşaat sonrası temizlik', 'CTR Hook', 'Çoklu banyo + cam + m² keşifsiz teklifi bozar.', 'Villa', 'Keşif', 'insaat', 'zeker', 'build', 'villa', 'Peyzaj dahil değil.'],

  // —— EV / YAŞAM / GEO CTR 40 ——
  ['sariyer-ev-temizlik-kimse-soylemiyor-2026', 'Sarıyer Ev Temizliği: Kimse Söylemiyor', 'Sarıyer ev temizliği', 'CTR Hook', 'Villa/daire farkı ve erişim notu fiyatı belirler; peyzaj yoktur.', 'Sarıyer', 'Keşif', 'ev', 'sariyer', 'home', 'sarıyer', 'Online tahmin keşifle netleşir.'],
  ['zekeriyakoy-ev-temizlik-villa-uyari-2026', 'Zekeriyaköy Ev Temizliği: Villa Uyarısı 2026', 'Zekeriyaköy ev temizliği', 'CTR Hook', 'Kat kat plan ve cam opsiyonu daire paketinden farklıdır.', 'Villa', 'Keşif', 'ev', 'zeker', 'villa', 'zekeriyaköy', 'Peyzaj yok.'],
  ['maslak-ofis-temizlik-gece-mi-2026', 'Maslak Ofis Temizliği Gece mi Gündüz mü?', 'Maslak ofis temizliği', 'CTR Hook', 'Gece slotu mesaiyi bölmez; güvenlik izni maliyeti etkiler.', 'Ofis', 'Gece/akşam', 'ofis', 'maslak', 'office', 'maslak', 'Frekans birim maliyeti düşürür.'],
  ['tarabya-cam-temizlik-tuz-uyari-2026', 'Tarabya Cam Temizliği: Tuz Uyarısı 2026', 'Tarabya cam temizliği', 'CTR Hook', 'Boğaz tuzu periyodik bakımı gerektirir; tek sefer yetmeyebilir.', 'Tarabya', 'Cam sayısı', 'cam', 'tarabya', 'window', 'tarabya', 'Yüksek kat keşif şart.'],
  ['hali-yikama-mi-koltuk-mu-once-2026', 'Önce Halı mı Koltuk mu Yıkanır? 2026', 'halı koltuk yıkama sırası', 'CTR Hook', 'Genelde koltuk sonrası halı kuruma alanı çakışmasını azaltır; keşifte planlanır.', 'Ev', 'Plan', 'hali', 'sariyer', 'carpet', 'sıra', 'Aynı gün her zaman olmaz.'],
  ['bos-ev-temizlik-depozito-kurtarir-mi-2026', 'Boş Ev Temizliği Depozitoyu Kurtarır mı?', 'boş ev depozito temizliği', 'CTR Hook', 'Kiracı teslim checklist’i yardımcı olur; emlakçı beklentisi keşifte netleşir.', 'Kiracı', 'Daire', 'ev', 'sisli', 'home', 'depozito', 'Hukuki garanti değildir.'],
  ['tasinma-sonrasi-temizlik-unuttugunuz-2026', 'Taşınma Sonrası Temizlik: Unuttuğunuz 7 Yer', 'taşınma sonrası temizlik', 'CTR Hook', 'Dolap içi, süpürgelik ve davlumbaz sık atlanır.', 'Taşınma', 'Yarım–bir gün', 'ev', 'kadikoy', 'home', 'taşınma', 'İnşaat tozu varsa ayrı paket.'],
  ['airbnb-temizlik-puan-dusuren-2026', 'Airbnb Temizlik: Puan Düşüren Hatalar 2026', 'Airbnb temizlik', 'CTR Hook', 'Check-out hızı ile hijyen dengesi yazılı checklist ister.', 'Host', '1–3 saat', 'ev', 'besiktas', 'home', 'airbnb', 'Derin genel temizlikten kısa olabilir.'],
  ['periyodik-ev-temizlik-abonelik-tuzagi-2026', 'Periyodik Ev Temizlik Aboneliği Tuzağı mı?', 'periyodik ev temizlik', 'CTR Hook', 'Kapsamı sözlü bırakmak aboneliği pahalılaştırır; yazılı ritim şart.', 'Abonelik', 'Ziyaret planı', 'ev', 'sariyer', 'home', 'periyodik', 'Tek seferden farklı paket.'],
  ['mutfak-yag-temizlik-kendin-yapma-2026', 'Mutfak Yağ Temizliği: Kendin Yapma Sebepleri', 'mutfak yağ temizliği', 'CTR Hook', 'Yanlış aşındırıcı tezgâhı çizer; yüzey uyumlu ürün gerekir.', 'Mutfak', '1–3 saat', 'ev', 'kadikoy', 'home', 'mutfak', 'Genel eve eklenebilir.'],
  ['banyo-kirec-temizlik-yanlis-asit-2026', 'Banyo Kireç: Yanlış Asit Pahalıya Patlar', 'banyo kireç temizliği', 'CTR Hook', 'Asitli ürün bazı yüzeyleri matlaştırır; ürün seçimi kritik.', 'Banyo', 'Adede göre', 'ev', 'bakirkoy', 'home', 'banyo', 'Kireç seviyesi süreye yansır.'],
  ['cam-temizlik-yuksek-kat-korku-2026', 'Yüksek Kat Cam Temizliği: Korkmadan Önce', 'yüksek kat cam temizliği', 'CTR Hook', 'Güvenlik ve erişim olmadan yapılmaz; iskele gerekirse ayrı teklif.', 'Yüksek kat', 'Keşif', 'cam', 'sisli', 'window', 'cam', 'DIY pencere dışı riskli.'],
  ['dis-cephe-temizlik-peyzaj-degil-2026', 'Dış Cephe Temizliği Peyzaj Değildir (2026)', 'dış cephe temizliği', 'CTR Hook', 'Yalnızca yüzey; bahçe düzenleme / peyzaj hizmetimiz yoktur.', 'Site/villa', 'Keşif', 'cephe', 'tarabya', 'build', 'cephe', 'Boyama/izolasyon yok.'],
  ['villa-temizlik-ucreti-neden-farkli-2026', 'Villa Temizlik Ücreti Neden Farklı? 2026', 'villa temizlik ücreti', 'CTR Hook', 'm², banyo, cam ve erişim daire paketini geçersiz kılar.', 'Villa', 'Keşif', 'ev', 'zeker', 'villa', 'villa', 'Keşifsiz sabit fiyat riskli.'],
  ['ofis-cay-ocagi-sikayet-1-2026', 'Ofis Şikâyet #1: Çay Ocağı Temizliği', 'ofis çay ocağı temizliği', 'CTR Hook', 'Lokal tur genel ofise eklenebilir; frekans maliyeti düşürür.', 'Ofis', 'Lokal', 'ofis', 'sisli', 'office', 'çay ocağı', 'Gece vardiyası ayrı.'],
  ['site-ortak-alan-temizlik-yonetici-2026', 'Site Ortak Alan Temizliği: Yönetici Checklist', 'site ortak alan temizliği', 'CTR Hook', 'Lobi, asansör, merdiven periyodu net yazılmalı; bahçe düzenleme yok.', 'Yönetim', 'Frekans', 'ofis', 'atasehir', 'office', 'site', 'Daire içi ayrı paket.'],
  ['ucretsiz-kesif-gercekten-ucretsiz-mi-2026', 'Ücretsiz Keşif Gerçekten Ücretsiz mi?', 'ücretsiz keşif temizlik', 'CTR Hook', 'Keşif bilgi turudur; baskı satış değildir. Kesin fiyat yazılı kapsamda.', 'İlk kez', '15–40 dk', 'ev', 'sariyer', 'city', 'keşif', 'Online araç tahmindir.'],
  ['online-fiyat-hesaplama-yaniltir-mi-2026', 'Online Fiyat Hesaplama Yanıltır mı?', 'online fiyat hesaplama temizlik', 'CTR Hook', 'Girdi kalitesi şart; sonucu keşifle doğrulayın.', 'Online', '—', 'ev', 'sariyer', 'city', 'hesaplama', 'Sözleşme değildir.'],
  ['whatsapp-temizlik-teklif-hangi-foto-2026', 'WhatsApp Temizlik Teklifi: Hangi Foto?', 'WhatsApp temizlik teklifi', 'CTR Hook', 'm²/oda, ıslak hacim ve sorunlu nokta foto sapmayı küçültür.', 'Hızlı lead', '—', 'ev', 'sariyer', 'city', 'whatsapp', 'Eksik bilgi = geniş aralık.'],
  ['ayni-gun-temizlik-gercekci-mi-2026', 'Aynı Gün Temizlik Gerçekçi mi? 2026', 'aynı gün temizlik', 'CTR Hook', 'Kapasiteye bağlıdır; garanti slot değildir.', 'Acil', 'Aynı gün?', 'ev', 'sariyer', 'home', 'acil', 'Ertesi gün daha ekonomik olabilir.'],
  ['profesyonel-vs-gunlukcu-hangisi-2026', 'Profesyonel mi Gündelikçi mi? Net Fark 2026', 'profesyonel temizlik farkı', 'CTR Hook', 'Ekip + checklist ölçeklenebilir sonuç verir; saat ücreti tek kriter değil.', 'Karar', '—', 'ev', 'sariyer', 'home', 'karşılaştırma', 'Kapsam yazımı kritik.'],
  ['bahar-temizligi-ne-zaman-basla-2026', 'Bahar Temizliği Ne Zaman Başlamalı? 2026', 'bahar temizliği 2026', 'CTR Hook', 'Erken rezervasyon slot ve fiyat netliği sağlar; cam opsiyon ayrı.', 'İlkbahar', 'Genel+cam', 'ev', 'maltepe', 'home', 'bahar', 'Son hafta yoğunluk artar.'],
  ['grip-sezonu-yuzey-hijyen-hook-2026', 'Grip Sezonu Yüzey Hijyeni: Abartmadan', 'yüzey hijyen grip', 'CTR Hook', 'Kapı kolu/batarya turu eklenir; hastane sterilizasyonu değildir.', 'Aile/ofis', '1–3 saat', 'ev', 'sisli', 'home', 'hijyen', 'Tıbbi iddia yok.'],
  ['yeni-dogan-evi-temizlik-checklist-2026', 'Yeni Doğan Evi Temizlik Checklist 2026', 'yeni doğan ev temizliği', 'CTR Hook', 'Bebek odası ve sık dokunma yüzeyleri öncelik; mucize iddia yok.', 'Ebeveyn', 'Yarım–bir gün', 'ev', 'sariyer', 'home', 'bebek', 'Tıbbi sterilizasyon yok.'],
  ['pet-ev-temizlik-tuy-koku-2026', 'Pet Ev Temizliği: Tüy ve Koku Gerçeği', 'pet ev temizliği', 'CTR Hook', 'Tüy turu ek süre doğurur; koltuk/halı ayrı paketlenebilir.', 'Pet', 'Standart+ek', 'ev', 'kagithane', 'home', 'pet', 'Kalıcı koku her seferde bitmez.'],
  ['satis-oncesi-ev-temizlik-fotograf-2026', 'Satış Öncesi Ev Temizliği: Fotoğraf Etkisi', 'satış öncesi ev temizliği', 'CTR Hook', 'Cam ve tezgâh parlaklığı emlak fotoğrafını güçlendirir.', 'Satış', 'Yarım–bir gün', 'ev', 'besiktas', 'home', 'satış', 'Derin vs kısa tur niyete göre.'],
  ['emlak-cekimi-oncesi-temizlik-2026', 'Emlak Çekimi Öncesi Temizlik: 60 Dk Plan', 'çekim öncesi temizlik', 'CTR Hook', 'Kısa + cam odaklı tur çoğu çekim için yeter.', 'Host/emlak', 'Kısa+cam', 'ev', 'kadikoy', 'home', 'çekim', 'İnşaat tozu varsa yetmez.'],
  ['besiktas-ev-temizlik-otopark-notu-2026', 'Beşiktaş Ev Temizliği: Otopark Notu Kritik', 'Beşiktaş ev temizliği', 'CTR Hook', 'Erişim ve otopark bilgisi süre/maliyeti etkiler.', 'Beşiktaş', 'Yarım–bir gün', 'ev', 'besiktas', 'home', 'beşiktaş', 'Daire tipi değişir.'],
  ['sisli-plaza-ofis-temizlik-izin-2026', 'Şişli Plaza Ofis: İzin Almadan Başlama', 'Şişli plaza ofis temizliği', 'CTR Hook', 'Güvenlik izni ve asansör prosedürü önceden alınmalı.', 'Plaza', 'Akşam/gece', 'ofis', 'sisli', 'office', 'şişli', 'Mesai içi riskli olabilir.'],
  ['uskudar-ev-temizlik-bogaz-hatti-2026', 'Üsküdar Ev Temizliği: Boğaz Hattı Notları', 'Üsküdar ev temizliği', 'CTR Hook', 'Sahil/iç mahalle erişimi planı etkiler; dubleks ayrı keşif.', 'Üsküdar', 'Keşif', 'ev', 'uskudar', 'home', 'üsküdar', 'Cam tuzu ek kalem olabilir.'],
  ['atasehir-ofis-abonelik-mi-tek-2026', 'Ataşehir Ofis: Abonelik mi Tek Sefer mi?', 'Ataşehir ofis temizliği', 'CTR Hook', 'Frekans birim maliyeti düşürür; açılış temizliği ayrı pakettir.', 'Ofis', 'Frekans', 'ofis', 'atasehir', 'office', 'ataşehir', 'Gece slotu ayrıca.'],
  ['bakirkoy-aile-evi-temizlik-hook-2026', 'Bakırköy Aile Evi Temizliği: Odak Noktaları', 'Bakırköy ev temizliği', 'CTR Hook', 'Çocuk odası + mutfak/banyo önceliği yazılı checklist ister.', 'Aile', 'Yarım–bir gün', 'ev', 'bakirkoy', 'home', 'bakırköy', 'Periyodik seçenek var.'],
  ['fatih-eski-bina-temizlik-asansor-2026', 'Fatih Eski Bina Temizliği: Asansörsüz Kat', 'Fatih ev temizliği', 'CTR Hook', 'Asansörsüz kat bilgisi süreye yansır; önceden yazın.', 'Fatih', 'Daireye göre', 'ev', 'fatih', 'home', 'fatih', 'Erişim kritik.'],
  ['maltepe-cam-balkon-sonrasi-2026', 'Maltepe Cam Balkon Sonrası Temizlik', 'Maltepe cam balkon temizliği', 'CTR Hook', 'Montaj tozu + cam birlikte planlanabilir.', 'Maltepe', 'Keşif', 'cam', 'maltepe', 'window', 'cam balkon', 'Standart camdan farklı.'],
  ['pendik-randevu-rota-plani-2026', 'Pendik Temizlik Randevusu: Rota Planı Neden?', 'Pendik ev temizliği', 'CTR Hook', 'Geniş ilçede rota planı aynı gün slotunu etkiler.', 'Pendik', 'Keşif', 'ev', 'pendik', 'home', 'pendik', 'Garanti aynı gün yok.'],
  ['eyupsultan-yeni-eski-konut-2026', 'Eyüpsultan: Yeni vs Eski Konut Temizliği', 'Eyüpsultan ev temizliği', 'CTR Hook', 'Yeni teslim tozu ile oturulan daire checklist’i farklıdır.', 'Eyüpsultan', 'Keşif', 'ev', 'eyup', 'home', 'eyüpsultan', 'İnşaat paketi ayrı.'],
  ['zeytinburnu-aile-temizlik-hook-2026', 'Zeytinburnu Aile Temizliği: Pratik Plan 2026', 'Zeytinburnu ev temizliği', 'CTR Hook', 'Mutfak-banyo odaklı plan yaygındır; periyodik seçenek sunulabilir.', 'Zeytinburnu', 'Yarım–bir gün', 'ev', 'zeytinburnu', 'home', 'zeytinburnu', 'Cam eklenirse süre uzar.'],
  ['yazili-kapsam-olmadan-temizlik-alma-2026', 'Yazılı Kapsam Olmadan Temizlik Aldırtmayın', 'yazılı kapsam temizlik', 'CTR Hook', 'Garanti keşifte yazılan işlerdir; sözlü vaat pahalıya patlar.', 'Kalite', '—', 'ev', 'sariyer', 'city', 'kapsam', 'Keşif dışı ekstra ayrı teklif.'],
  ['temizlik-fiyatini-artan-gizli-5-2026', 'Temizlik Fiyatını Artıran Gizli 5 Neden', 'temizlik fiyatını artıran', 'CTR Hook', 'Erişim, kirlilik, ek cam/koltuk, dolu ev ve acil slot maliyeti şişirir.', 'Fiyat', '—', 'ev', 'sariyer', 'city', 'fiyat', 'Önceden yazmak sürprizi keser.'],
  ['sariyer-koltuk-ve-insaat-birlikte-mi-2026', 'Sarıyer’de Koltuk + İnşaat Aynı Gün mü?', 'Sarıyer koltuk inşaat temizlik', 'CTR Hook', 'Genelde ayrı planlanır; toz bitmeden koltuk yıkamak risklidir.', 'Kombine', 'Ayrı randevu', 'insaat', 'sariyer', 'build', 'kombine', 'Sıra: önce inşaat/toz, sonra koltuk.'],
];

if (ROWS.length !== 100) {
  console.error('Expected 100 rows, got', ROWS.length);
  process.exit(1);
}

const topics = ROWS.map((row) => {
  const [slug, title, keyword, category, hook, audience, durationHint, service, area, image, tag, compareNote] = row;
  const factors = FACTORS[service] ?? FACTORS.ev;
  const scenarios = SCENARIOS[service] ?? SCENARIOS.ev;
  return {
    slug,
    title,
    keyword,
    category,
    hook,
    audience,
    durationHint,
    service,
    area,
    image,
    compareNote,
    priceFactors: factors,
    scenarios,
    scopeIn:
      service === 'insaat'
        ? ['İnce/kalın toz turu', 'Pervaz ve ıslak hacim', 'Zemin']
        : service === 'koltuk'
          ? ['Yerinde yıkama', 'Kumaşa uygun ürün', 'Kuruma planı']
          : service === 'ofis'
            ? ['Çalışma yüzeyleri', 'Mutfak/çay ocağı', 'Islak hacim', 'Çöp/zemin']
            : ['Mutfak/banyo', 'Zemin', 'Toz alma', 'Yazılı checklist'],
    scopeOut: ['Peyzaj/bahçe düzenleme', 'İnşaat işçiliği', 'Mobilya taşıma'],
    steps: [
      'Online tahmin veya foto/m² / parça bilgisi paylaş',
      'Keşif / brifing ile kapsam yaz',
      'Teklif onayı',
      'Checklist’li uygulama',
    ],
    mistakes: [
      'Keşifsiz sabit fiyat dayatmak',
      'Kapsamı sözlü bırakmak',
      'Kuruma / erişim bilgisini vermemek',
    ],
    priceNote: `${keyword} için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.`,
    faq: [
      {
        q: `${keyword} ne kadar tutar?`,
        a: 'Kapsam, kirlilik/leke, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir.',
      },
      {
        q: 'Fiyat garanti mi?',
        a: 'Garanti sınırı yazılı kapsamdaki işlerdir. Keşif dışı ekstra ayrıca teklif edilir.',
      },
      {
        q: 'Peyzaj dahil mi?',
        a: 'Hayır. Peyzaj/bahçe düzenleme hizmetimiz yoktur.',
      },
    ],
    tags: [tag, 'ctr', 'istanbul', '2026', 'temizlik'],
  };
});

const seen = new Set();
for (const t of topics) {
  if (seen.has(t.slug)) throw new Error('dup ' + t.slug);
  seen.add(t.slug);
  if (!/^[a-z0-9-]+$/.test(t.slug)) throw new Error('bad slug ' + t.slug);
  if (!t.slug.includes('2026')) throw new Error('no year ' + t.slug);
}

const out = `/**
 * 100 v9 CTR / hook blog — Ads (koltuk + inşaat) destekli, marka-güvenli clickbait.
 * Direkt yayın (drip yok). Üretilir: node scripts/generate-v9-ctr-blog-content.mjs
 */
import type { BlogSeedPost } from './seed-blog';
import { makePricingGuidePost, type PricingGuideConfig } from './blog-commercial-html';

const IMG = ${JSON.stringify(IMG, null, 2)} as const;
const SERVICE = ${JSON.stringify(S, null, 2)} as const;
const AREA = ${JSON.stringify(A, null, 2)} as const;

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

const TOPICS: V9Topic[] = ${JSON.stringify(topics, null, 2)};

function metaDesc(keyword: string, hook: string): string {
  const base = \`\${keyword}: \${hook}\`;
  return base.length <= 158 ? base : \`\${base.slice(0, 157).trimEnd()}…\`;
}

function expand(t: V9Topic): PricingGuideConfig {
  const service = SERVICE[t.service];
  const area = AREA[t.area];
  const intro = \`\${t.hook} \${area.label} ve İstanbul genelinde \${t.keyword} için tıklanma odaklı ama şeffaf rehber.\`;
  return {
    slug: t.slug,
    title: t.title,
    metaTitle: t.title.length <= 60 ? t.title : \`\${t.title.slice(0, 59).trimEnd()}…\`,
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
        heading: \`\${t.keyword} — Zümrüt Vadi notu\`,
        paragraphs: [
          \`Sarıyer / Zekeriyaköy öncelikli operasyonla \${service.label.toLowerCase()} paketlerinde yazılı kapsam sunuyoruz.\`,
          'Peyzaj yoktur. Telefon / WhatsApp: 0551 925 09 43. Ads niyetiyle gelenler için net CTA: keşif / fiyat.',
        ],
        bullets: ['Online fiyat = tahmin', 'Ücretsiz keşif', 'Checklist teslim', 'Koltuk + inşaat Ads köprüsü'],
      },
    ],
  };
}

export function generateAllV9Posts(): BlogSeedPost[] {
  if (TOPICS.length !== 100) throw new Error(\`V9 sayı hatası: \${TOPICS.length}/100\`);
  return TOPICS.map((t) => makePricingGuidePost(expand(t)));
}

export function listV9Slugs(): string[] {
  return TOPICS.map((t) => t.slug);
}
`;

fs.writeFileSync(path.join(root, 'src/lib/seed-blog-v9-content.ts'), out, 'utf8');
console.log('OK wrote 100 → src/lib/seed-blog-v9-content.ts');
