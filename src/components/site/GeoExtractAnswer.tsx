/**
 * AI/snippet extract — kısa doğrudan cevap (TL;DR).
 * Blog GEO passage ile aynı marker sınıfları.
 */
type GeoExtractAnswerProps = {
  answer: string;
  label?: string;
  className?: string;
};

export function GeoExtractAnswer({
  answer,
  label = 'Kısa cevap',
  className = '',
}: GeoExtractAnswerProps) {
  if (!answer.trim()) return null;

  return (
    <aside
      className={`rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-left ${className}`}
      data-geo-extract="true"
      aria-label={label}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">{label}</p>
      <p className="geo-passage-answer mt-2 text-base leading-relaxed text-slate-100">
        <strong className="font-semibold text-white">Özet:</strong> {answer}
      </p>
    </aside>
  );
}

/** Hizmet sayfası için deterministik extract cümlesi */
export function buildServiceExtractAnswer(params: {
  serviceName: string;
  shortDesc: string;
}): string {
  const base = params.shortDesc.trim().replace(/\s+/g, ' ');
  const clipped = base.length > 180 ? `${base.slice(0, 177).trim()}…` : base;
  return `${params.serviceName}: ${clipped} Zümrüt Vadi Temizlik Sarıyer, Zekeriyaköy ve İstanbul Avrupa Yakası’nda ücretsiz keşif ile planlar.`;
}

/** İlçe×hizmet sayfası için deterministik extract cümlesi */
export function buildPairExtractAnswer(params: {
  districtName: string;
  serviceName: string;
  heroLead: string;
}): string {
  const lead = params.heroLead.trim().replace(/\s+/g, ' ');
  const clipped = lead.length > 160 ? `${lead.slice(0, 157).trim()}…` : lead;
  return `${params.districtName} ${params.serviceName}: ${clipped} Net fiyat keşif sonrası; randevu ve fiyat hesaplama ile başlayın.`;
}
