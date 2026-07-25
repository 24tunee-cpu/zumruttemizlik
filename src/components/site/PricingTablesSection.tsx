import {
  SPACE_TYPES,
  ROOM_PRICES,
  ROOM_OPTIONS,
  M2_RATES,
  EXTRAS,
  formatTL,
  type SpaceTypeId,
} from '@/config/pricing';

const m2Types = SPACE_TYPES.filter((t) => t.mode === 'm2');

export type AdminPricingRow = {
  id: string;
  serviceName: string;
  basePrice: number;
  pricePerSqm: number | null;
  unit: string;
  minPrice: number | null;
  description: string | null;
  features: string[];
};

type PricingTablesSectionProps = {
  adminPricing?: AdminPricingRow[];
};

export function PricingTablesSection({ adminPricing = [] }: PricingTablesSectionProps) {
  return (
    <div>
      {adminPricing.length > 0 && (
        <>
          <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
            Güncel hizmet fiyatları
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Admin panelden güncellenen liste. Kesin fiyat keşif sonrası netleşir.
          </p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-emerald-200 dark:border-emerald-900/40">
            <table className="w-full text-left text-sm">
              <thead className="bg-emerald-50 text-slate-600 dark:bg-emerald-950/40 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Hizmet</th>
                  <th className="px-4 py-3 font-semibold">Başlangıç</th>
                  <th className="px-4 py-3 font-semibold">Birim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {adminPricing.map((row) => (
                  <tr key={row.id} className="text-slate-800 dark:text-slate-200">
                    <td className="px-4 py-3">
                      <p className="font-medium">{row.serviceName}</p>
                      {row.description && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{row.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {formatTL(row.minPrice ?? row.basePrice)}
                      {row.minPrice != null && row.minPrice !== row.basePrice
                        ? ` – ${formatTL(row.basePrice)}`
                        : ''}
                    </td>
                    <td className="px-4 py-3">
                      {row.pricePerSqm != null
                        ? `${row.pricePerSqm} TL/${row.unit}`
                        : 'Paket / keşif'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
        Ev / Daire Temizliği (oda paketi)
      </h3>
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3 font-semibold">Daire Tipi</th>
              <th className="px-4 py-3 font-semibold">Tahmini Fiyat Aralığı</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {ROOM_OPTIONS.map((opt) => (
              <tr key={opt} className="text-slate-800 dark:text-slate-200">
                <td className="px-4 py-3 font-medium">{opt} Daire</td>
                <td className="px-4 py-3">
                  {formatTL(ROOM_PRICES[opt][0])} – {formatTL(ROOM_PRICES[opt][1])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
        Ofis, İşyeri, İnşaat Sonrası ve Dış Cephe (metrekare bazlı)
      </h3>
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3 font-semibold">Hizmet Tipi</th>
              <th className="px-4 py-3 font-semibold">Birim Fiyat (TL/m²)</th>
              <th className="px-4 py-3 font-semibold">Başlangıç (taban)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {m2Types.map((t) => {
              const rate = M2_RATES[t.id as Exclude<SpaceTypeId, 'ev'>];
              return (
                <tr key={t.id} className="text-slate-800 dark:text-slate-200">
                  <td className="px-4 py-3 font-medium">{t.label}</td>
                  <td className="px-4 py-3">
                    {rate.min} – {rate.max} TL/m²
                  </td>
                  <td className="px-4 py-3">
                    {formatTL(rate.floorMin)} – {formatTL(rate.floorMax)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">Ekstralar</h3>
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3 font-semibold">Ekstra Hizmet</th>
              <th className="px-4 py-3 font-semibold">Ek Ücret</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {EXTRAS.map((e) => (
              <tr key={e.id} className="text-slate-800 dark:text-slate-200">
                <td className="px-4 py-3 font-medium">{e.label}</td>
                <td className="px-4 py-3">
                  {e.free ? (
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Ücretsiz (Hediye)
                    </span>
                  ) : (
                    `+${formatTL(e.min)} – ${formatTL(e.max)}`
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
