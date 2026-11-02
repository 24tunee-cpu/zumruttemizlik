/**
 * SSS konu parçalama (A6) — hub /sss + niyet sayfaları /sss/[topic].
 * İçerik: seed FAQ kategorileri + hizmet landing FAQ (kopya şişirme yok).
 */
import { FAQ_SEED_DATA, type FaqSeedRow } from '@/lib/seed-faq';
import { SERVICE_LANDINGS } from '@/config/programmatic-seo';

export type SssTopicFaq = { q: string; a: string };

export type SssTopic = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Seed FAQ category eşleşmesi (opsiyonel) */
  seedCategories?: string[];
  /** SERVICE_LANDINGS slug (opsiyonel) */
  serviceSlug?: string;
  /** Ek özgün sorular */
  extraFaqs?: SssTopicFaq[];
};

export const SSS_TOPICS: SssTopic[] = [
  {
    slug: 'fiyat',
    title: 'Temizlik Fiyatları SSS',
    metaTitle: 'Temizlik Fiyatı SSS | İstanbul',
    metaDescription:
      'İstanbul temizlik fiyatı nasıl hesaplanır, keşif ücretsiz mi, paket farkları neler? Net yanıtlar.',
    intro:
      'Fiyat; metrekare, kirlilik, hizmet türü ve ekip planına göre değişir. Aşağıdaki yanıtlar tahmini çerçeveyi açıklar — kesin teklif keşif sonrası verilir.',
    seedCategories: ['Fiyat'],
    extraFaqs: [
      {
        q: 'Online fiyat hesaplama kesin fiyat mı?',
        a: 'Hayır. Anında fiyat aracı tahmini aralık verir; kesin fiyat ücretsiz keşif veya WhatsApp fotoğraf değerlendirmesi sonrası netleşir.',
      },
    ],
  },
  {
    slug: 'randevu',
    title: 'Randevu ve Keşif SSS',
    metaTitle: 'Temizlik Randevu SSS | Ücretsiz Keşif',
    metaDescription:
      'Temizlik randevusu, ücretsiz keşif, mesai dışı ve aynı gün talep hakkında sık sorulan sorular.',
    intro:
      'Randevu ve keşif süreci telefon, WhatsApp veya form üzerinden ilerler. Yoğunluk ve erişim koşullarına göre slot netleştirilir.',
    seedCategories: ['Randevu'],
  },
  {
    slug: 'bolge',
    title: 'Hizmet Bölgesi SSS',
    metaTitle: 'Hangi Bölgelerde Temizlik? | Sarıyer & İstanbul',
    metaDescription:
      'Sarıyer, Zekeriyaköy ve İstanbul ilçelerinde temizlik kapsamı; öncelik hattı ve keşif onayı hakkında SSS.',
    intro:
      'Öncelik hattımız Sarıyer (Zekeriyaköy, Maslak, Tarabya, Bahçeköy, Uskumruköy) ve Avrupa Yakası yakın ilçelerdir. Diğer ilçelerde kapasiteye göre planlanır; kesin onay keşif sonrası verilir.',
    seedCategories: ['Bölge'],
  },
  {
    slug: 'ev-temizligi',
    title: 'Ev Temizliği SSS',
    metaTitle: 'Ev Temizliği SSS | Daire & Villa',
    metaDescription:
      'Ev temizliği süresi, malzeme, düzenli paket ve villa detayı hakkında sık sorulan sorular.',
    intro:
      'Ev temizliği mutfak, banyo ve yaşam alanlarında yüzey tipine uygun planlanır. Villa ve site dairelerinde kapsam keşifte başlıklara ayrılır.',
    serviceSlug: 'ev-temizligi',
    extraFaqs: [
      {
        q: 'Düzenli ev temizliği paketi var mı?',
        a: 'Evet; haftalık veya iki haftada bir periyodik paketler sunuyoruz. Aynı ekip sürekliliği mümkün olduğunca korunur.',
      },
    ],
  },
  {
    slug: 'ofis-temizligi',
    title: 'Ofis Temizliği SSS',
    metaTitle: 'Ofis Temizliği SSS | Kurumsal Hijyen',
    metaDescription:
      'Mesai dışı ofis temizliği, sözleşmeli hizmet ve plaza hijyeni hakkında SSS.',
    intro:
      'Ofis temizliği çalışma saatleri, güvenlik prosedürü ve ortak alan yoğunluğuna göre planlanır.',
    serviceSlug: 'ofis-temizligi',
  },
  {
    slug: 'insaat-sonrasi-temizlik',
    title: 'İnşaat Sonrası Temizlik SSS',
    metaTitle: 'İnşaat Sonrası Temizlik SSS | Teslim',
    metaDescription:
      'İnşaat sonrası temizlik süresi, kapsam ve teslim kontrolü hakkında sık sorulan sorular.',
    intro:
      'İnce toz, boya izi ve cam/fayans detayı inşaat sonrası paketin omurgasıdır. Süre m² ve kirlilik seviyesine göre değişir.',
    serviceSlug: 'insaat-sonrasi-temizlik',
  },
  {
    slug: 'cam-temizligi',
    title: 'Cam Temizliği SSS',
    metaTitle: 'Cam Temizliği SSS | İç & Dış',
    metaDescription:
      'İç/dış cam, periyodik paket ve yüksek erişim cam temizliği SSS.',
    intro:
      'Cam temizliği erişim, güvenlik ve hava koşullarına göre planlanır; iç ve dış aynı gün veya ayrı slot olabilir.',
    serviceSlug: 'cam-temizligi',
  },
];

export function getSssTopic(slug: string): SssTopic | null {
  return SSS_TOPICS.find((t) => t.slug === slug) ?? null;
}

function seedFaqsForCategories(categories: string[]): SssTopicFaq[] {
  const set = new Set(categories.map((c) => c.toLowerCase()));
  return FAQ_SEED_DATA.filter(
    (f) => f.isActive && set.has(f.category.toLowerCase())
  )
    .sort((a, b) => a.order - b.order)
    .map((f: FaqSeedRow) => ({ q: f.question, a: f.answer }));
}

/** Konu sayfası için birleşik FAQ listesi (tekil sorular) */
export function buildSssTopicFaqs(topic: SssTopic): SssTopicFaq[] {
  const out: SssTopicFaq[] = [];
  const seen = new Set<string>();

  const push = (items: SssTopicFaq[]) => {
    for (const item of items) {
      const key = item.q.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
  };

  if (topic.seedCategories?.length) {
    push(seedFaqsForCategories(topic.seedCategories));
  }

  if (topic.serviceSlug) {
    const service = SERVICE_LANDINGS.find((s) => s.slug === topic.serviceSlug);
    if (service) {
      push(service.faq.map((f) => ({ q: f.q, a: f.a })));
      // Hizmet konusu: genel “Hizmet” seed’lerinden yalnızca ilgili olanları alma —
      // ev/ofis/inşaat için seed faq-04/05/09 seçici ekle
      if (topic.serviceSlug === 'ev-temizligi') {
        push(
          seedFaqsForCategories(['Hizmet']).filter((f) =>
            /ev temizliği|ofis temizliği ile ev/i.test(f.q)
          )
        );
      }
      if (topic.serviceSlug === 'insaat-sonrasi-temizlik') {
        push(
          seedFaqsForCategories(['Hizmet']).filter((f) => /inşaat sonrası/i.test(f.q))
        );
      }
      if (topic.serviceSlug === 'ofis-temizligi') {
        push(
          seedFaqsForCategories(['Hizmet']).filter((f) =>
            /ofis temizliği|mesai dışı/i.test(f.q)
          )
        );
      }
    }
  }

  if (topic.extraFaqs?.length) push(topic.extraFaqs);

  return out;
}

export function allSssTopicPaths(): string[] {
  return SSS_TOPICS.map((t) => `/sss/${t.slug}`);
}
