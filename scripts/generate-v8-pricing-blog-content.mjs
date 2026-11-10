/**
 * 100 deep pricing-guide blogs (CTR winners style) → seed-blog-v8-content.ts
 * Run: node scripts/generate-v8-pricing-blog-content.mjs
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
    'Dolu / boş ev (eşya koruma süresi)',
    'Kirlilik seviyesi ve ıslak hacim yoğunluğu',
    'Kat, asansör, otopark / site girişi',
    'Ek işler: cam, koltuk, fırın içi vb.',
  ],
  ofis: [
    'Ofis m² ve workstation sayısı',
    'Frekans (günlük / haftalık / tek sefer)',
    'Mesai dışı / gece / plaza güvenlik izni',
    'Mutfak–çay ocağı ve ıslak hacim adedi',
    'Ortak alan (koridor) dahil mi?',
  ],
  insaat: [
    'Brüt / net m² ve kirlilik sınıfı',
    'Alçı–ince toz yoğunluğu',
    'Pencere/pervaz ve ıslak hacim sayısı',
    'Mobilya öncesi mi sonrası mı',
    'Kat erişimi ve havalandırma imkanı',
  ],
  koltuk: [
    'Koltuk/kanepe takım adedi',
    'Kumaş tipi ve leke yaşı',
    'Pet / koku ek işlemi',
    'Kuruma süresi planı',
    'Adres erişimi (villa / apartman)',
  ],
  hali: [
    'Halı / kilim m²',
    'Leke ve pet notu',
    'Evde yıkama vs taşıma',
    'Kuruma alanı uygunluğu',
    'Kat / asansör erişimi',
  ],
  cam: [
    'Cam paneli / cephe sayısı',
    'İç / dış erişim',
    'Yükseklik ve güvenlik planı',
    'Yönetici / site onayı',
    'Tuz–toz birikimi (Boğaz hattı)',
  ],
  cephe: [
    'Cephe alanı ve malzeme',
    'Erişim yöntemi (güvenlik)',
    'Kir / tuz birikim seviyesi',
    'Site yönetimi koordinasyonu',
    'Peyzaj yok — yalnızca yüzey',
  ],
};

const SCENARIOS = {
  ev: [
    '1+1 / stüdyo: kısa tur, mutfak+banyo odaklı',
    '2+1–3+1 aile: yarım–bir gün tipik',
    'Villa / dubleks: keşif + kat kat plan',
    'Taşınma sonrası: boşaltma checklist ayrı paketlenir',
  ],
  ofis: [
    'Küçük butik ofis: akşam kısa tur',
    'Açık ofis katı: gece vardiyası',
    'Plaza: güvenlik + asansör prosedürü',
    'Periyodik sözleşme: frekans fiyatı düşürür',
  ],
  insaat: [
    'Yeni daire teslim: ince toz programı',
    'Ofis teslim: mobilya öncesi kritik',
    'Tadilat / boya sonrası: sıçrantı + toz',
    'Villa teslim: m² + çoklu banyo',
  ],
  koltuk: [
    'Tek kanepe: birkaç saat + kuruma',
    'Takım (3+1): yarım gün bandı',
    'Leke odaklı lokal işlem',
    'Pet kokusu: ek süre mümkün',
  ],
  hali: [
    'Küçük kilim: kısa evde yıkama',
    'Salon halısı: ölçü + kuruma alanı',
    'Çoklu halı: paket fiyat keşifle',
    'Villa tipi kalın halı: süre uzar',
  ],
  cam: [
    'Daire iç cam: kısa randevu',
    'Cam balkon: montaj sonrası toz ayrı',
    'Villa cephe cam: güvenlik planı',
    'Plaza cam: yönetici onayı şart',
  ],
  cephe: [
    'Küçük villa cephe: keşif şart',
    'Site blok: yönetim koordinasyonu',
    'Boğaz tuzu: periyodik bakım mantıklı',
    'Boyasız yüzey temizliği — boya işi yok',
  ],
};

/** slug, title, keyword, category, hook, audience, duration, service, area, image, tag, compareNote */
const ROWS = [
  ['villa-temizlik-maliyet-analizi-istanbul-2026', 'Villa Temizlik Maliyet Analizi 2026 | İstanbul', 'villa temizlik maliyeti', 'Fiyat Rehberi', 'Villa m², banyo adedi ve cam cephe maliyeti belirler; peyzaj dahil değildir.', 'Villa sahipleri', 'Keşif zorunlu', 'ev', 'zeker', 'villa', 'villa', 'Daire paketinden farklıdır; keşifsiz sabit fiyat yanıltıcıdır.'],
  ['dubleks-temizlik-ucret-rehberi-2026', 'Dubleks Temizlik Ücret Rehberi 2026', 'dubleks temizlik ücreti', 'Fiyat Rehberi', 'Merdiven + iki kat süresi ve ekip dağılımını etkiler.', 'Dubleks sakinleri', 'Kat sayısına göre', 'ev', 'bahce', 'home', 'dubleks', 'Tek kat daireye göre süre genelde uzar.'],
  ['bos-ev-temizlik-ne-kadar-tutar-2026', 'Boş Ev Temizliği Ne Kadar Tutar? 2026', 'boş ev temizlik ücreti', 'Fiyat Rehberi', 'Boş evde erişim kolaydır; toz ve ıslak hacim yine m²’ye bağlıdır.', 'Kiraya veren / alan', 'Daireye göre', 'ev', 'sariyer', 'home', 'boş ev', 'Dolu eve göre süre kısalabilir; kirlilik sınıfı ayrıdır.'],
  ['dolu-ev-temizlik-maliyet-2026-istanbul', 'Dolu Ev Temizlik Maliyeti 2026 İstanbul', 'dolu ev temizlik maliyeti', 'Fiyat Rehberi', 'Eşya koruma ve süpürme turu dolu evde ekstra süre ister.', 'Oturulan evler', '+%20–50 süre mümkün', 'ev', 'sisli', 'home', 'dolu ev', 'Boş ev checklist’i birebir uygulanmaz.'],
  ['periyodik-ev-temizlik-abonelik-ucret-2026', 'Periyodik Ev Temizlik Abonelik Ücreti 2026', 'periyodik ev temizlik ücreti', 'Fiyat Rehberi', 'Haftalık/aylık ritim tek sefere göre birim maliyeti düşürebilir.', 'Düzenli bakım', 'Ziyaret 2–5 saat', 'ev', 'sariyer', 'home', 'periyodik', 'Tek sefer genel temizlik farklı pakettir.'],
  ['tek-sefer-genel-temizlik-fiyat-etkenleri-2026', 'Tek Sefer Genel Temizlik Fiyat Etkenleri 2026', 'tek sefer temizlik fiyat', 'Fiyat Rehberi', 'Taşınma/tadilat sonrası tek seferde kapsam genişler.', 'Tek sefer ihtiyacı', 'Yarım–bir gün', 'ev', 'besiktas', 'home', 'tek sefer', 'Periyodik abonelikten farklı fiyatlanır.'],
  ['tasinma-sonrasi-temizlik-maliyet-istanbul-2026', 'Taşınma Sonrası Temizlik Maliyeti İstanbul 2026', 'taşınma sonrası temizlik maliyeti', 'Fiyat Rehberi', 'Mutfak, banyo ve zemin checklist’i taşınma stresini azaltır.', 'Taşınanlar', '2+1 genelde yarım–bir gün', 'ev', 'kadikoy', 'home', 'taşınma', 'İnşaat tozu varsa ayrı paket düşünülür.'],
  ['tasinma-oncesi-depozito-temizlik-ucret-2026', 'Taşınma Öncesi Depozito Temizlik Ücreti 2026', 'depozito temizlik ücreti', 'Fiyat Rehberi', 'Kiracı tesliminde boşaltma hijyeni fiilen beklenir.', 'Kiracılar', '1+1–3+1', 'ev', 'umraniye', 'home', 'depozito', 'Emlakçı beklentisi keşifte netleştirilir.'],
  ['airbnb-temizlik-ucreti-istanbul-2026', 'Airbnb Temizlik Ücreti İstanbul 2026', 'Airbnb temizlik ücreti', 'Fiyat Rehberi', 'Check-out/check-in arası hızlı standart checklist fiyatı etkiler.', 'Hostlar', '1–3 saat', 'ev', 'besiktas', 'home', 'airbnb', 'Genel ev paketinden daha kısa tur olabilir.'],
  ['yeni-dogan-evi-hijyen-maliyet-2026', 'Yeni Doğan Evi Hijyen Maliyeti 2026', 'yeni doğan hijyen maliyeti', 'Fiyat Rehberi', 'Bebek odası ve sık dokunulan yüzeyler önceliklidir.', 'Yeni ebeveynler', 'Yarım–bir gün', 'ev', 'sariyer', 'home', 'bebek', 'Tıbbi sterilizasyon iddiası yoktur.'],
  ['evcil-hayvanli-ev-temizlik-ek-ucret-2026', 'Evcil Hayvanlı Ev Temizlik Ek Ücret 2026', 'pet ev temizlik ücreti', 'Fiyat Rehberi', 'Tüy ve koku turu ek süre doğurabilir.', 'Pet sahipleri', 'Standart + ek', 'ev', 'kagithane', 'home', 'pet', 'Halı/koltuk ayrı paketlenebilir.'],
  ['mutfak-derin-temizlik-fiyat-2026-istanbul', 'Mutfak Derin Temizlik Fiyat 2026 İstanbul', 'mutfak derin temizlik fiyat', 'Fiyat Rehberi', 'Yağ ve kireç için yüzey uyumlu ürün + süre gerekir.', 'Mutfak öncelikli', '1–3 saat+', 'ev', 'kadikoy', 'home', 'mutfak', 'Genel ev içinde veya lokal paket olabilir.'],
  ['banyo-kirec-temizlik-ucreti-2026', 'Banyo Kireç Temizlik Ücreti 2026', 'banyo kireç temizlik ücreti', 'Fiyat Rehberi', 'Banyo adedi ve kireç seviyesi maliyeti belirler.', 'Kireç şikâyeti', 'Banyo adedine göre', 'ev', 'bakirkoy', 'home', 'banyo', 'Yanlış asit malzemeyi bozar — ürün seçimi kritik.'],
  ['bayram-oncesi-temizlik-fiyat-yogunlugu-2026', 'Bayram Öncesi Temizlik Fiyat Yoğunluğu 2026', 'bayram temizlik fiyat', 'Fiyat Rehberi', 'Bayram öncesi slotlar erken dolar; erken rezervasyon kritik.', 'Misafir bekleyenler', 'Genel süre', 'ev', 'sariyer', 'home', 'bayram', 'Son gün acil taleplerde kapasite sınırlı olabilir.'],
  ['yilbasi-sonrasi-ev-reset-maliyet-2026', 'Yılbaşı Sonrası Ev Reset Maliyeti 2026', 'yılbaşı sonrası temizlik maliyeti', 'Fiyat Rehberi', 'Misafir ve yemek sonrası mutfak+zemin reset’i.', 'Ara–Ocak', 'Yarım–bir gün', 'ev', 'sisli', 'home', 'yılbaşı', 'Cam eklenirse süre uzar.'],
  ['bahar-temizligi-maliyet-plan-2026', 'Bahar Temizliği Maliyet Planı 2026', 'bahar temizlik maliyeti', 'Fiyat Rehberi', 'Erken plan randevu ve fiyat netliğini kolaylaştırır.', 'İlkbahar', 'Genel + cam opsiyon', 'ev', 'maltepe', 'home', 'bahar', 'Cam ve balkon ayrı kalem olabilir.'],
  ['kis-nem-kuf-temizlik-ucret-2026', 'Kış Nem Küf Temizlik Ücreti 2026', 'küf yüzey temizlik ücreti', 'Fiyat Rehberi', 'Yüzey küfü temizlenebilir; yapısal nem ayrı ustalık ister.', 'Kış nem', 'Odalara göre', 'ev', 'bahce', 'home', 'küf', 'İzolasyon/inşaat işi dahil değildir.'],
  ['sariyer-villa-temizlik-maliyet-2026', 'Sarıyer Villa Temizlik Maliyeti 2026', 'Sarıyer villa temizlik maliyeti', 'Yerel Fiyat', 'Sarıyer villa hattında erişim ve m² keşifle netleşir.', 'Sarıyer villa', 'Keşif', 'ev', 'sariyer', 'villa', 'sarıyer', 'Peyzaj yoktur; yüzey temizliği planlanır.'],
  ['zekeriyakoy-villa-temizlik-ucret-detay-2026', 'Zekeriyaköy Villa Temizlik Ücret Detay 2026', 'Zekeriyaköy villa temizlik ücreti', 'Yerel Fiyat', 'Villa yoğun Zekeriyaköy’de süre planı daireden farklıdır.', 'Zekeriyaköy', 'Keşif', 'ev', 'zeker', 'villa', 'zekeriyaköy', 'Online tahmin sonrası keşif önerilir.'],
  ['maslak-ofis-temizlik-m2-ucret-2026', 'Maslak Ofis Temizlik m² Ücret 2026', 'Maslak ofis m² ücreti', 'Yerel Fiyat', 'Plaza güvenlik ve gece slotu maliyeti etkiler.', 'Maslak ofis', 'Gece/akşam', 'ofis', 'maslak', 'office', 'maslak', 'Frekanslı sözleşme birim maliyeti düşürebilir.'],
  ['tarabya-cam-temizlik-maliyet-2026', 'Tarabya Cam Temizlik Maliyeti 2026', 'Tarabya cam temizlik maliyeti', 'Yerel Fiyat', 'Boğaz tuzu/toz periyodik cam bakımını gerektirir.', 'Tarabya', 'Cam sayısına göre', 'cam', 'tarabya', 'window', 'tarabya', 'Yüksek katta güvenlik planı şart.'],
  ['bahcekoy-ev-temizlik-ucret-rehberi-2026', 'Bahçeköy Ev Temizlik Ücret Rehberi 2026', 'Bahçeköy ev temizlik ücreti', 'Yerel Fiyat', 'Orman hattı erişimi randevu planını etkiler.', 'Bahçeköy', 'Keşif', 'ev', 'bahce', 'home', 'bahçeköy', 'İnşaat sonrası ayrı pakettir.'],
  ['uskumrukoy-temizlik-maliyet-2026', 'Uskumruköy Temizlik Maliyeti 2026', 'Uskumruköy temizlik maliyeti', 'Yerel Fiyat', 'Orman içi hattında planlı randevu önemlidir.', 'Uskumruköy', 'Keşif', 'ev', 'uskum', 'home', 'uskumruköy', 'Kış erişiminde sabah slotları tercih edilebilir.'],
  ['sisli-plaza-ofis-temizlik-ucret-2026', 'Şişli Plaza Ofis Temizlik Ücreti 2026', 'Şişli plaza ofis ücreti', 'Yerel Fiyat', 'Mesai dışı temizlik iş sürekliliğini bozmaz.', 'Şişli ofis', 'Akşam/gece', 'ofis', 'sisli', 'office', 'şişli', 'Güvenlik izni önceden alınmalı.'],
  ['besiktas-ev-temizlik-maliyet-2026', 'Beşiktaş Ev Temizlik Maliyeti 2026', 'Beşiktaş ev temizlik maliyeti', 'Yerel Fiyat', 'Otopark ve erişim bilgisi keşifte not edilir.', 'Beşiktaş', 'Yarım–bir gün', 'ev', 'besiktas', 'home', 'beşiktaş', 'Daire tipi fiyatı değiştirir.'],
  ['kadikoy-ev-temizlik-ucret-analizi-2026', 'Kadıköy Ev Temizlik Ücret Analizi 2026', 'Kadıköy ev temizlik ücreti', 'Yerel Fiyat', 'Yoğunlukta sabah randevuları genelde verimlidir.', 'Kadıköy', 'Yarım–bir gün', 'ev', 'kadikoy', 'home', 'kadıköy', 'Anadolu Yakası operasyonu planlıdır.'],
  ['umraniye-ev-temizlik-maliyet-2026', 'Ümraniye Ev Temizlik Maliyeti 2026', 'Ümraniye ev temizlik maliyeti', 'Yerel Fiyat', 'Site giriş prosedürleri önceden alınmalı.', 'Ümraniye', 'Keşif', 'ev', 'umraniye', 'home', 'ümraniye', 'Finans çevresi ofis paketleri ayrıdır.'],
  ['atasehir-ofis-temizlik-abonelik-ucret-2026', 'Ataşehir Ofis Temizlik Abonelik Ücreti 2026', 'Ataşehir ofis abonelik ücreti', 'Yerel Fiyat', 'Frekanslı sözleşme yaygındır.', 'Ataşehir ofis', 'Frekansa göre', 'ofis', 'atasehir', 'office', 'ataşehir', 'Tek sefer açılış temizliği farklıdır.'],
  ['bakirkoy-aile-evi-temizlik-ucret-2026', 'Bakırköy Aile Evi Temizlik Ücreti 2026', 'Bakırköy ev temizlik ücreti', 'Yerel Fiyat', 'Çocuk odası ve mutfak önceliklendirilir.', 'Bakırköy', 'Yarım–bir gün', 'ev', 'bakirkoy', 'home', 'bakırköy', 'Periyodik plan birim maliyeti dengeleyebilir.'],
  ['kagithane-yeni-konut-temizlik-maliyet-2026', 'Kağıthane Yeni Konut Temizlik Maliyeti 2026', 'Kağıthane yeni konut temizlik', 'Yerel Fiyat', 'Yeni konut stokunda teslim tozu ayrı program ister.', 'Kağıthane', 'm²', 'insaat', 'kagithane', 'build', 'kağıthane', 'Standart ev paketi yetmeyebilir.'],
  ['uskudar-ev-temizlik-ucret-rehberi-2026', 'Üsküdar Ev Temizlik Ücret Rehberi 2026', 'Üsküdar ev temizlik ücreti', 'Yerel Fiyat', 'Boğaz ve iç mahalle erişimi planı etkiler.', 'Üsküdar', 'Keşif', 'ev', 'uskudar', 'home', 'üsküdar', 'Dubleks/villa ayrı keşif.'],
  ['maltepe-ev-temizlik-maliyet-2026', 'Maltepe Ev Temizlik Maliyeti 2026', 'Maltepe ev temizlik maliyeti', 'Yerel Fiyat', 'Sahil ve iç mahalle daire tipine göre değişir.', 'Maltepe', 'Yarım–bir gün', 'ev', 'maltepe', 'home', 'maltepe', 'Cam balkon sonrası toz ayrı olabilir.'],
  ['kartal-ev-temizlik-ucret-2026', 'Kartal Ev Temizlik Ücreti 2026', 'Kartal ev temizlik ücreti', 'Yerel Fiyat', 'Konut + işyeri karışımında paket net yazılmalı.', 'Kartal', 'Keşif', 'ev', 'kartal', 'home', 'kartal', 'Ofis talepleri ayrı fiyatlanır.'],
  ['pendik-ev-temizlik-maliyet-2026', 'Pendik Ev Temizlik Maliyeti 2026', 'Pendik ev temizlik maliyeti', 'Yerel Fiyat', 'Geniş ilçede rota planı randevuyu etkiler.', 'Pendik', 'Keşif', 'ev', 'pendik', 'home', 'pendik', 'Aynı gün slot garanti değildir.'],
  ['fatih-ev-temizlik-ucret-2026', 'Fatih Ev Temizlik Ücreti 2026', 'Fatih ev temizlik ücreti', 'Yerel Fiyat', 'Eski bina erişimi süreye yansıyabilir.', 'Fatih', 'Daireye göre', 'ev', 'fatih', 'home', 'fatih', 'Asansörsüz kat bilgisi kritik.'],
  ['eyupsultan-ev-temizlik-maliyet-2026', 'Eyüpsultan Ev Temizlik Maliyeti 2026', 'Eyüpsultan ev temizlik maliyeti', 'Yerel Fiyat', 'Yeni ve eski konut dokusu checklist’i değiştirir.', 'Eyüpsultan', 'Keşif', 'ev', 'eyup', 'home', 'eyüpsultan', 'İnşaat teslimi ayrı paket.'],
  ['zeytinburnu-ev-temizlik-ucret-2026', 'Zeytinburnu Ev Temizlik Ücreti 2026', 'Zeytinburnu ev temizlik ücreti', 'Yerel Fiyat', 'Aile konutlarında mutfak-banyo odaklı plan yaygındır.', 'Zeytinburnu', 'Yarım–bir gün', 'ev', 'zeytinburnu', 'home', 'zeytinburnu', 'Periyodik seçenek sunulabilir.'],
  ['insaat-sonrasi-m2-maliyet-hesap-2026', 'İnşaat Sonrası m² Maliyet Hesap 2026', 'inşaat sonrası m² maliyet', 'İnşaat Fiyat', 'Kirlilik sınıfı olmadan yalnızca m² yetmez.', 'Teslim alanlar', 'm² + sınıf', 'insaat', 'sariyer', 'build', 'inşaat', 'Standart ev turu ile karıştırılmamalı.'],
  ['insaat-sonrasi-ofis-teslim-ucret-2026', 'İnşaat Sonrası Ofis Teslim Ücreti 2026', 'ofis teslim temizlik ücreti', 'İnşaat Fiyat', 'Mobilya öncesi toz programı kritiktir.', 'Ofis teslim', 'm²', 'insaat', 'maslak', 'build', 'ofis teslim', 'Plaza prosedürü ek süre doğurabilir.'],
  ['boya-badana-sonrasi-temizlik-ucret-2026', 'Boya Badana Sonrası Temizlik Ücreti 2026', 'boya sonrası temizlik ücreti', 'İnşaat Fiyat', 'Sıçrantı + toz için uygun ürün gerekir.', 'Tadilat', 'm²', 'insaat', 'kadikoy', 'build', 'boya', 'Boya işçiliği dahil değildir.'],
  ['mobilya-montaj-sonrasi-toz-ucret-2026', 'Mobilya Montaj Sonrası Toz Ücreti 2026', 'montaj sonrası toz temizlik ücreti', 'İnşaat Fiyat', 'İnce partikül mikrofiber turu ister.', 'Yeni mobilya', 'Birkaç saat', 'insaat', 'umraniye', 'build', 'montaj', 'İnşaat tesliminden daha hafif olabilir.'],
  ['yeni-daire-teslim-temizlik-maliyet-2026', 'Yeni Daire Teslim Temizlik Maliyeti 2026', 'yeni daire teslim temizlik maliyeti', 'İnşaat Fiyat', 'İnce toz turu mobilyadan önce yapılmalı.', 'Yeni teslim', 'm²', 'insaat', 'atasehir', 'build', 'teslim', 'Online tahmin + keşif ikilisi önerilir.'],
  ['ofis-temizlik-gece-vardiya-ucret-farki-2026', 'Ofis Temizlik Gece Vardiya Ücret Farkı 2026', 'gece ofis temizlik ücreti', 'Ofis Fiyat', 'Gece slotu mesaiyi bölmez; izin maliyeti etkiler.', 'Ofis yöneticileri', 'Gece', 'ofis', 'maslak', 'office', 'gece', 'Gündüz kısa turdan farklı fiyatlanabilir.'],
  ['ofis-mutfak-cay-ocagi-temizlik-ucret-2026', 'Ofis Mutfak Çay Ocağı Temizlik Ücreti 2026', 'ofis mutfak temizlik ücreti', 'Ofis Fiyat', 'Çay ocağı şikâyetlerin başındadır.', 'Ofis', 'Lokal tur', 'ofis', 'sisli', 'office', 'çay ocağı', 'Genel ofis turuna eklenebilir.'],
  ['plaza-ortak-alan-temizlik-maliyet-2026', 'Plaza Ortak Alan Temizlik Maliyeti 2026', 'plaza ortak alan temizlik maliyeti', 'Ofis Fiyat', 'Koridor ve wet-room yetkiye göre planlanır.', 'Plaza yönetimi', 'Frekans', 'ofis', 'maslak', 'office', 'plaza', 'Peyzaj yoktur.'],
  ['site-ortak-alan-temizlik-ucret-2026', 'Site Ortak Alan Temizlik Ücreti 2026', 'site ortak alan temizlik ücreti', 'Ofis Fiyat', 'Lobi, asansör, merdiven periyodu net olmalı.', 'Site yönetimi', 'Frekansa göre', 'ofis', 'atasehir', 'office', 'site', 'Bahçe düzenleme dahil değil.'],
  ['magaza-vitrin-zemin-temizlik-ucret-2026', 'Mağaza Vitrin Zemin Temizlik Ücreti 2026', 'mağaza temizlik ücreti', 'Ofis Fiyat', 'Vitrin camı ve giriş zemini algıyı etkiler.', 'Mağaza', 'Lokal/periyodik', 'cam', 'besiktas', 'window', 'mağaza', 'Cam + zemin ayrı kalem olabilir.'],
  ['klinik-bekleme-alani-temizlik-ucret-2026', 'Klinik Bekleme Alanı Temizlik Ücreti 2026', 'klinik bekleme temizlik ücreti', 'Ofis Fiyat', 'Sık dokunma yüzeyleri kritik; hastane sterilizasyonu değildir.', 'Klinik', 'Frekanslı', 'ofis', 'sisli', 'office', 'klinik', 'Tıbbi cihaz temizliği dahil değil.'],
  ['yeni-is-yeri-acilis-temizlik-maliyet-2026', 'Yeni İş Yeri Açılış Temizlik Maliyeti 2026', 'iş yeri açılış temizlik maliyeti', 'Ofis Fiyat', 'Açılış öncesi vitrin ve zemin ilk izlenimi belirler.', 'Yeni işyeri', 'Keşif', 'ofis', 'kadikoy', 'office', 'açılış', 'İnşaat tozu varsa ayrı program.'],
  ['koltuk-yikama-takim-ucret-hesap-2026', 'Koltuk Yıkama Takım Ücret Hesap 2026', 'koltuk yıkama takım ücreti', 'Koltuk Fiyat', 'Takım adedi ve kumaş tipi programı değiştirir.', 'Salon takımı', 'Takıma göre', 'koltuk', 'sariyer', 'sofa', 'koltuk', 'Ev tipi agresif kimyasal risklidir.'],
  ['koltuk-yikama-leke-ek-ucret-2026', 'Koltuk Yıkama Leke Ek Ücret 2026', 'koltuk leke yıkama ücreti', 'Koltuk Fiyat', 'Leke yaşı ve tipi ek işlem doğurabilir.', 'Leke şikâyeti', 'Lokal+', 'koltuk', 'kadikoy', 'sofa', 'leke', 'Garanti her lekeyi %100 çıkarmak değildir.'],
  ['sariyer-koltuk-yikama-maliyet-2026', 'Sarıyer Koltuk Yıkama Maliyeti 2026', 'Sarıyer koltuk yıkama maliyeti', 'Koltuk Fiyat', 'Kuruma süresi randevu gününe yazılır.', 'Sarıyer', 'Birkaç saat+kuruma', 'koltuk', 'sariyer', 'sofa', 'sarıyer', 'Villa erişimi süreye yansıyabilir.'],
  ['hali-yikama-m2-ucret-istanbul-2026', 'Halı Yıkama m² Ücret İstanbul 2026', 'halı yıkama m² ücreti', 'Halı Fiyat', 'Ölçü + leke/pet notu fiyatı belirler.', 'Halı sahipleri', 'm² + kuruma', 'hali', 'kadikoy', 'carpet', 'halı', 'Kuruma alanı ayırmamak maliyeti artırır (tekrar).'],
  ['zekeriyakoy-hali-yikama-villa-ucret-2026', 'Zekeriyaköy Halı Yıkama Villa Ücreti 2026', 'Zekeriyaköy halı yıkama ücreti', 'Halı Fiyat', 'Villa tipi halılarda ölçü kritiktir.', 'Villa', 'Boyuta göre', 'hali', 'zeker', 'carpet', 'zekeriyaköy', 'Evde yıkama taşımayı azaltır.'],
  ['cam-temizlik-yuksek-kat-ucret-2026', 'Cam Temizlik Yüksek Kat Ücreti 2026', 'yüksek kat cam temizlik ücreti', 'Cam Fiyat', 'Güvenlik ve erişim olmadan yapılmaz.', 'Yüksek kat', 'Keşif', 'cam', 'sisli', 'window', 'yüksek kat', 'İskele/vinç gerekirse ayrı teklif.'],
  ['cam-balkon-sonrasi-temizlik-ucret-2026', 'Cam Balkon Sonrası Temizlik Ücreti 2026', 'cam balkon sonrası temizlik ücreti', 'Cam Fiyat', 'Montaj sonrası inşaat tipi toz kalabilir.', 'Cam balkon', 'Keşif', 'cam', 'bakirkoy', 'window', 'cam balkon', 'Standart cam turundan farklı olabilir.'],
  ['dis-cephe-temizlik-maliyet-ne-zaman-2026', 'Dış Cephe Temizlik Maliyeti Ne Zaman? 2026', 'dış cephe temizlik maliyeti', 'Cephe Fiyat', 'Yağmur izi ve cephe kiri görünümü etkiler.', 'Site/villa', 'Cepheye göre', 'cephe', 'tarabya', 'build', 'cephe', 'Peyzaj/bahçe düzenleme yoktur.'],
  ['tarabya-deniz-tuzu-cephe-ucret-2026', 'Tarabya Deniz Tuzu Cephe Ücreti 2026', 'Tarabya cephe temizlik ücreti', 'Cephe Fiyat', 'Tuz birikimi periyodik bakım ister.', 'Tarabya', 'Keşif', 'cephe', 'tarabya', 'build', 'tuz', 'Boyama/izolasyon dahil değil.'],
  ['online-fiyat-vs-kesif-fark-analizi-2026', 'Online Fiyat vs Keşif Fark Analizi 2026', 'online fiyat keşif farkı', 'Karar', 'Hesaplayıcı tahmindir; keşif yazılı kapsam içindir.', 'Online kullananlar', '15–40 dk keşif', 'ev', 'sariyer', 'city', 'keşif', 'Fark büyüdükçe kirlilik/erişim notu eksik demektir.'],
  ['ucretsiz-kesif-sonrasi-teklif-nasil-2026', 'Ücretsiz Keşif Sonrası Teklif Nasıl? 2026', 'ücretsiz keşif teklif', 'Karar', 'Keşif ölçü ve öncelikleri netleştirir.', 'İlk kez alanlar', 'Kısa keşif', 'ev', 'sariyer', 'city', 'teklif', 'Satış baskısı değil bilgi turu.'],
  ['temizlik-fiyatini-artan-5-hata-2026', 'Temizlik Fiyatını Artıran 5 Hata 2026', 'temizlik fiyat hataları', 'Karar', 'Kapsamı sözlü bırakmak ve keşifsiz sabit fiyat en pahalı hatalardır.', 'Tüm müşteriler', '—', 'ev', 'sariyer', 'city', 'hata', 'Yazılı checklist maliyeti kontrol eder.'],
  ['yazili-kapsam-fiyat-garantisi-2026', 'Yazılı Kapsam Fiyat Garantisi 2026', 'yazılı kapsam fiyat', 'Karar', 'Garanti keşifte yazılan işlerdir.', 'Kalite soranlar', '—', 'ev', 'sariyer', 'city', 'garanti', 'Keşif dışı ekstra ayrıca teklif edilir.'],
  ['malzeme-dahil-temizlik-ucret-2026', 'Malzeme Dahil Temizlik Ücreti 2026', 'malzeme dahil temizlik ücreti', 'Karar', 'Standart ürünler ekiple gelir; özel marka önceden yazılır.', 'Malzeme merakı', '—', 'ev', 'sariyer', 'home', 'malzeme', 'Özel ürün talebi fiyatı değiştirebilir.'],
  ['ayni-gun-temizlik-ucret-premium-2026', 'Aynı Gün Temizlik Ücret / Premium 2026', 'aynı gün temizlik ücreti', 'Karar', 'Kapasite uygunsa açılır; garanti slot değildir.', 'Acil', 'Aynı gün', 'ev', 'sariyer', 'home', 'acil', 'Yoğun günde ertesi gün daha ekonomik olabilir.'],
  ['profesyonel-vs-gunlukcu-maliyet-2026', 'Profesyonel vs Gündelikçi Maliyet 2026', 'profesyonel temizlik maliyet karşılaştırma', 'Karar', 'Ekip + checklist ölçeklenebilir sonuç verir.', 'Karar vericiler', '—', 'ev', 'sariyer', 'home', 'karşılaştırma', 'Saat ücreti tek başına karşılaştırma kriteri değildir.'],
  ['istanbul-avrupa-yakasi-temizlik-maliyet-2026', 'İstanbul Avrupa Yakası Temizlik Maliyeti 2026', 'Avrupa Yakası temizlik maliyeti', 'Bölge', 'İlçe, villa/daire ve erişim seçimi belirler.', 'Avrupa Yakası', 'Keşif', 'ev', 'sariyer', 'city', 'avrupa', 'Sarıyer–Zekeriyaköy öncelikli operasyon deneyimi.'],
  ['istanbul-anadolu-yakasi-temizlik-maliyet-2026', 'İstanbul Anadolu Yakası Temizlik Maliyeti 2026', 'Anadolu Yakası temizlik maliyeti', 'Bölge', 'Kadıköy–Ataşehir hattında planlı randevu yaygındır.', 'Anadolu Yakası', 'Keşif', 'ev', 'kadikoy', 'city', 'anadolu', 'Trafik slot seçimini etkiler.'],
  ['satis-oncesi-ev-temizlik-maliyet-2026', 'Satış Öncesi Ev Temizlik Maliyeti 2026', 'satış öncesi ev temizlik maliyeti', 'Yaşam Fiyat', 'Emlak gösterimi öncesi ferahlık algısını güçlendirir.', 'Satışa çıkanlar', 'Yarım–bir gün', 'ev', 'besiktas', 'home', 'satış', 'Cam eklenirse fotoğraf kalitesi artar.'],
  ['emlak-fotograf-oncesi-temizlik-ucret-2026', 'Emlak Fotoğraf Öncesi Temizlik Ücreti 2026', 'çekim öncesi temizlik ücreti', 'Yaşam Fiyat', 'Cam ve tezgâh parlaklığı fotoğrafta kritiktir.', 'Host/emlak', 'Kısa+cam', 'ev', 'kadikoy', 'home', 'çekim', 'Derin genel temizlikten kısa olabilir.'],
  ['kiralik-daire-giris-temizlik-ucret-2026', 'Kiralık Daire Giriş Temizlik Ücreti 2026', 'kiralık giriş temizlik ücreti', 'Yaşam Fiyat', 'Yeni kiracı girişinde boş ev hijyeni güven verir.', 'Kiraya veren', 'Daireye göre', 'ev', 'sisli', 'home', 'kiralık', 'Depozito çıkış paketinden farklı niyet.'],
  ['calisan-cift-temizlik-paket-ucret-2026', 'Çalışan Çift Temizlik Paket Ücreti 2026', 'çalışan çift temizlik paketi', 'Yaşam Fiyat', 'Hafta içi kısa + hafta sonu derin dengesi.', 'Çalışan haneler', 'Planlı', 'ev', 'atasehir', 'home', 'yaşam', 'Periyodik abonelik uygun olabilir.'],
  ['ogrenci-evi-temizlik-ucret-2026', 'Öğrenci Evi Temizlik Ücreti 2026', 'öğrenci evi temizlik ücreti', 'Yaşam Fiyat', 'Ortak alan checklist’i çatışmayı azaltır.', 'Öğrenci evleri', 'Kısa', 'ev', 'kadikoy', 'home', 'öğrenci', 'Kapsam önceden yazılmalı.'],
  ['yasli-bakim-hijyen-destek-ucret-siniri-2026', 'Yaşlı Bakım Hijyen Destek Ücret Sınırı 2026', 'yaşlı bakım hijyen ücreti', 'Yaşam Fiyat', 'Ev temizliği destekler; tıbbi bakım değildir.', 'Aileler', 'Keşif', 'ev', 'sariyer', 'home', 'bakım', 'Hemşirelik hizmeti yok.'],
  ['grip-sezonu-yuzey-hijyen-ucret-2026', 'Grip Sezonu Yüzey Hijyen Ücreti 2026', 'yüzey hijyen ücreti grip', 'Yaşam Fiyat', 'Kapı kolu ve batarya turu sezonluk eklenir.', 'Aile/ofis', '1–3 saat', 'ev', 'sisli', 'home', 'hijyen', 'Hastane sterilizasyonu değildir.'],
  ['yesil-urun-tercihi-fiyat-etkisi-2026', 'Yeşil Ürün Tercihi Fiyat Etkisi 2026', 'yeşil temizlik ürün fiyat', 'Karar', 'Yüzey uyumu esastır; mucize iddia edilmez.', 'Hassas kullanıcı', '—', 'ev', 'sariyer', 'home', 'yeşil', 'Özel marka talebi önceden yazılır.'],
  ['whatsapp-teklif-icin-hangi-bilgi-2026', 'WhatsApp Teklif İçin Hangi Bilgi? 2026', 'WhatsApp temizlik teklif bilgi', 'AEO Fiyat', 'Foto/m²/adres ile ön bilgi; kesin teklif keşifle.', 'Hızlı iletişim', '—', 'ev', 'sariyer', 'city', 'whatsapp', 'Eksik bilgi tahmin sapmasını büyütür.'],
  ['fiyat-hesaplama-araci-nasil-okunur-2026', 'Fiyat Hesaplama Aracı Nasıl Okunur? 2026', 'fiyat hesaplama nasıl okunur', 'AEO Fiyat', 'Girdi kalitesi önemlidir; sonucu keşifle doğrulayın.', 'İlk adım', '—', 'ev', 'sariyer', 'city', 'hesaplama', 'Araç tahmindir, sözleşme değildir.'],
  ['sariyer-periyodik-ev-ucret-paketi-2026', 'Sarıyer Periyodik Ev Ücret Paketi 2026', 'Sarıyer periyodik ev ücreti', 'Yerel Fiyat', 'Sabit ritim hijyeni korur; villa/daire ayrı planlanır.', 'Sarıyer', 'Ziyaret planı', 'ev', 'sariyer', 'home', 'periyodik', 'Tek sefer genel temizlik ayrıdır.'],
  ['zekeriyakoy-periyodik-villa-ucret-2026', 'Zekeriyaköy Periyodik Villa Ücreti 2026', 'Zekeriyaköy periyodik villa ücreti', 'Yerel Fiyat', 'Cam ve ıslak hacim rotasyonu planlanır.', 'Villa', 'Ziyaret planı', 'ev', 'zeker', 'villa', 'villa', 'Peyzaj yoktur.'],
  ['maslak-periyodik-ofis-ucret-2026', 'Maslak Periyodik Ofis Ücreti 2026', 'Maslak periyodik ofis ücreti', 'Yerel Fiyat', 'Haftalık ritim çöp-mutfak-ıslak hacmi sabitler.', 'Plaza ofis', 'Frekans', 'ofis', 'maslak', 'office', 'periyodik', 'Gece vardiyası ayrıca netleştirilir.'],
  ['besiktas-cam-temizlik-ucret-detay-2026', 'Beşiktaş Cam Temizlik Ücret Detay 2026', 'Beşiktaş cam temizlik ücreti', 'Cam Fiyat', 'Yönetici onayı ve güvenlik sık gerekir.', 'Beşiktaş', 'Cam sayısı', 'cam', 'besiktas', 'window', 'cam', 'Yüksek kat keşifsiz istenmemeli.'],
  ['kadikoy-koltuk-yikama-ucret-2026', 'Kadıköy Koltuk Yıkama Ücreti 2026', 'Kadıköy koltuk yıkama ücreti', 'Koltuk Fiyat', 'Leke ve kumaş tipi programı değiştirir.', 'Kadıköy', 'Takıma göre', 'koltuk', 'kadikoy', 'sofa', 'koltuk', 'Kuruma süresi planlanmalı.'],
  ['umraniye-hali-yikama-ucret-2026', 'Ümraniye Halı Yıkama Ücreti 2026', 'Ümraniye hali yıkama ücreti', 'Halı Fiyat', 'Evde yıkama taşıma derdini azaltır.', 'Ümraniye', 'm²', 'hali', 'umraniye', 'carpet', 'halı', 'Kuruma alanı şart.'],
  ['sisli-cam-plaza-ucret-2026', 'Şişli Cam Plaza Ücreti 2026', 'Şişli plaza cam ücreti', 'Cam Fiyat', 'Erişim ve güvenlik planı önce gelir.', 'Şişli ofis', 'Keşif', 'cam', 'sisli', 'window', 'cam', 'Yönetici onayı olmadan başlanmaz.'],
  ['bakirkoy-tasinma-temizlik-ucret-2026', 'Bakırköy Taşınma Temizlik Ücreti 2026', 'Bakırköy taşınma temizlik ücreti', 'Taşınma Fiyat', 'Eski–yeni adres planı zaman kazandırır.', 'Bakırköy', 'Daireye göre', 'ev', 'bakirkoy', 'home', 'taşınma', 'İki adres aynı gün mümkün olmayabilir.'],
  ['kagithane-insaat-sonrasi-ucret-2026', 'Kağıthane İnşaat Sonrası Ücreti 2026', 'Kağıthane inşaat sonrası ücreti', 'İnşaat Fiyat', 'İnce toz turu mobilyadan önce.', 'Kağıthane', 'm²', 'insaat', 'kagithane', 'build', 'inşaat', 'Kirlilik sınıfı m² kadar önemlidir.'],
  ['sariyer-insaat-sonrasi-maliyet-detay-2026', 'Sarıyer İnşaat Sonrası Maliyet Detay 2026', 'Sarıyer inşaat sonrası maliyeti', 'İnşaat Fiyat', 'Yeni teslimlerde toz programı şart.', 'Sarıyer teslim', 'm²', 'insaat', 'sariyer', 'build', 'sarıyer', 'Villa tesliminde keşif şart.'],
  ['bahcekoy-insaat-sonrasi-ucret-2026', 'Bahçeköy İnşaat Sonrası Ücreti 2026', 'Bahçeköy inşaat sonrası ücreti', 'İnşaat Fiyat', 'Orman hattı yeni konutlarda toz programı mobilya öncesi.', 'Bahçeköy', 'm²', 'insaat', 'bahce', 'build', 'inşaat', 'Peyzaj dahil değil.'],
  ['uskumrukoy-genel-temizlik-ucret-2026', 'Uskumruköy Genel Temizlik Ücreti 2026', 'Uskumruköy genel temizlik ücreti', 'Yerel Fiyat', 'Kış/erişim slot seçimini etkiler.', 'Uskumruköy', 'Keşif', 'ev', 'uskum', 'home', 'uskumruköy', 'Online tahmin + keşif.'],
  ['tarabya-periyodik-cam-ucret-2026', 'Tarabya Periyodik Cam Ücreti 2026', 'Tarabya periyodik cam ücreti', 'Cam Fiyat', 'Tuz/toz için periyodik bakım planlanır.', 'Tarabya', 'Periyot', 'cam', 'tarabya', 'window', 'cam', 'Tek seferden birim maliyet farkı olabilir.'],
  ['levent-ofis-temizlik-maliyet-analizi-2026', 'Levent Ofis Temizlik Maliyet Analizi 2026', 'Levent ofis temizlik maliyeti', 'Yerel Fiyat', 'Beşiktaş–Levent hattında plaza prosedürü kritik.', 'Levent ofis', 'Frekans/gece', 'ofis', 'besiktas', 'office', 'levent', 'Mevcut ofis fiyat sayfalarından farklı açı: maliyet kırılımı.'],
  ['nisantasi-butik-ofis-temizlik-ucret-2026', 'Nişantaşı Butik Ofis Temizlik Ücreti 2026', 'Nişantaşı ofis temizlik ücreti', 'Yerel Fiyat', 'Küçük butik ofiste akşam kısa tur yaygındır.', 'Butik ofis', 'Akşam', 'ofis', 'sisli', 'office', 'nişantaşı', 'Plaza paketinden farklı kapsam.'],
  ['etiler-villa-temizlik-maliyet-2026', 'Etiler Villa Temizlik Maliyeti 2026', 'Etiler villa temizlik maliyeti', 'Yerel Fiyat', 'Villa m² ve cam keşifle netleşir.', 'Etiler', 'Keşif', 'ev', 'besiktas', 'villa', 'etiler', 'Peyzaj yoktur.'],
  ['bebek-arnavutkoy-ev-temizlik-ucret-2026', 'Bebek Arnavutköy Ev Temizlik Ücreti 2026', 'Bebek Arnavutköy temizlik ücreti', 'Yerel Fiyat', 'Boğaz hattı erişim ve otopark notu fiyatı etkiler.', 'Beşiktaş sahil', 'Keşif', 'ev', 'besiktas', 'home', 'bebek', 'Cam tuzu birikimi ek kalem olabilir.'],
  ['goztepe-ev-temizlik-maliyet-detay-2026', 'Göztepe Ev Temizlik Maliyet Detay 2026', 'Göztepe ev temizlik maliyeti', 'Yerel Fiyat', 'Kadıköy içi mahalle erişimi planı etkiler.', 'Göztepe', 'Yarım–bir gün', 'ev', 'kadikoy', 'home', 'göztepe', 'Mevcut fiyat sluğundan farklı: maliyet kırılımı odaklı.'],
  ['bostanci-ev-temizlik-ucret-2026', 'Bostancı Ev Temizlik Ücreti 2026', 'Bostancı ev temizlik ücreti', 'Yerel Fiyat', 'Sahil konutlarında cam opsiyonu sık sorulur.', 'Bostancı', 'Keşif', 'ev', 'kadikoy', 'home', 'bostancı', 'Genel + cam ayrı yazılmalı.'],
  ['kozyatagi-ofis-temizlik-ucret-2026', 'Kozyatağı Ofis Temizlik Ücreti 2026', 'Kozyatağı ofis temizlik ücreti', 'Yerel Fiyat', 'İş merkezi frekansı maliyeti belirler.', 'Kozyatağı', 'Frekans', 'ofis', 'kadikoy', 'office', 'kozyatağı', 'Gece slotu ayrıca.'],
  ['finans-merkezi-ofis-temizlik-maliyet-2026', 'Finans Merkezi Ofis Temizlik Maliyeti 2026', 'finans merkezi ofis temizlik maliyeti', 'Ofis Fiyat', 'Ümraniye/Ataşehir finans çevresinde güvenlik prosedürü kritik.', 'Kurumsal ofis', 'Gece/frekans', 'ofis', 'umraniye', 'office', 'finans', 'Tek sefer vs abonelik farkı büyüktür.'],
  ['rezidans-ortak-alan-temizlik-ucret-2026', 'Rezidans Ortak Alan Temizlik Ücreti 2026', 'rezidans ortak alan ücreti', 'Ofis Fiyat', 'Lobi ve wet-room yönetimi net kapsam ister.', 'Rezidans yönetimi', 'Frekans', 'ofis', 'atasehir', 'office', 'rezidans', 'Daire içi temizlik ayrı pakettir.'],
  ['hafta-sonu-temizlik-ucret-farki-2026', 'Hafta Sonu Temizlik Ücret Farkı 2026', 'hafta sonu temizlik ücreti', 'Karar', 'Hafta sonu slotları erken dolar; Cuma rezervasyonu önerilir.', 'Hafta sonu', 'Yarım–bir gün', 'ev', 'sariyer', 'home', 'hafta sonu', 'Aynı gün acilden farklı dinamik.'],
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
        : service === 'ofis'
          ? ['Çalışma yüzeyleri', 'Mutfak/çay ocağı', 'Islak hacim', 'Çöp/zemin']
          : ['Mutfak/banyo', 'Zemin', 'Toz alma', 'Yazılı checklist'],
    scopeOut: ['Peyzaj/bahçe düzenleme', 'İnşaat işçiliği', 'Mobilya taşıma'],
    steps: [
      'Online tahmin veya foto/m² paylaş',
      'Keşif / brifing ile kapsam yaz',
      'Teklif onayı',
      'Checklist’li uygulama',
    ],
    mistakes: [
      'Keşifsiz sabit fiyat dayatmak',
      'Kapsamı sözlü bırakmak',
      'Erişim/güvenlik bilgisini vermemek',
    ],
    priceNote: `${keyword} için online hesaplama tahmindir; kesin teklif keşif veya kısa brifing sonrası yazılı verilir.`,
    faq: [
      {
        q: `${keyword} ne kadar tutar?`,
        a: 'm², kirlilik, erişim ve ek işlere göre değişir. Online hesaplayıcı tahmin verir; kesin rakam keşifle netleşir.',
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
    tags: [tag, 'fiyat', 'istanbul', '2026', 'temizlik'],
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
 * 100 v8 derin fiyat/rehber blog — top CTR formatı.
 * Direkt yayın (drip yok). Üretilir: node scripts/generate-v8-pricing-blog-content.mjs
 */
import type { BlogSeedPost } from './seed-blog';
import { makePricingGuidePost, type PricingGuideConfig } from './blog-commercial-html';

const IMG = ${JSON.stringify(IMG, null, 2)} as const;
const SERVICE = ${JSON.stringify(S, null, 2)} as const;
const AREA = ${JSON.stringify(A, null, 2)} as const;

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

const TOPICS: V8Topic[] = ${JSON.stringify(topics, null, 2)};

function metaDesc(keyword: string, hook: string): string {
  const base = \`\${keyword}: \${hook}\`;
  return base.length <= 158 ? base : \`\${base.slice(0, 157).trimEnd()}…\`;
}

function expand(t: V8Topic): PricingGuideConfig {
  const service = SERVICE[t.service];
  const area = AREA[t.area];
  const intro = \`\${t.hook} \${area.label} ve İstanbul genelinde \${t.keyword} için şeffaf maliyet rehberi.\`;
  return {
    slug: t.slug,
    title: t.title,
    metaTitle: t.title.length <= 60 ? t.title : \`\${t.title.slice(0, 59).trimEnd()}…\`,
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
        heading: \`\${t.keyword} — Zümrüt Vadi notu\`,
        paragraphs: [
          \`Sarıyer / Zekeriyaköy öncelikli operasyon deneyimiyle \${service.label.toLowerCase()} paketlerinde yazılı kapsam sunuyoruz.\`,
          'Peyzaj yoktur. Telefon / WhatsApp: 0551 925 09 43.',
        ],
        bullets: ['Online fiyat hesaplama = tahmin', 'Ücretsiz keşif', 'Checklist teslim'],
      },
    ],
  };
}

export function generateAllV8Posts(): BlogSeedPost[] {
  if (TOPICS.length !== 100) throw new Error(\`V8 sayı hatası: \${TOPICS.length}/100\`);
  return TOPICS.map((t) => makePricingGuidePost(expand(t)));
}

export function listV8Slugs(): string[] {
  return TOPICS.map((t) => t.slug);
}
`;

fs.writeFileSync(path.join(root, 'src/lib/seed-blog-v8-content.ts'), out, 'utf8');
console.log('OK wrote 100 → src/lib/seed-blog-v8-content.ts');
