'use client';

interface LpVariant {
  lp_variant_id: string;
  hero_framing: string;
  sessions: number;
  bounce_rate: number;
  sections: Record<string, { scroll_reach_pct?: number; form_start_rate?: number; viewed_pct?: number }>;
  overall_cvr: number;
}

interface ProposedVariant {
  variant_id: string;
  section: string;
  new_copy: {
    headline_pt: string;
    subheadline_pt: string;
    body_pt: string;
  };
  rationale: string;
}

interface FunnelChartProps {
  variants: LpVariant[];
  proposedVariant?: ProposedVariant | null;
}

const THRESHOLDS: Record<string, number> = {
  bounce_rate: 0.60,
  form_start_rate: 0.20,
  monetization_reach: 0.45,
  overall_cvr: 0.06,
};

function CellValue({ value, threshold, inverse }: { value: number; threshold?: number; inverse?: boolean }) {
  const pct = (value * 100).toFixed(1) + '%';
  let breached = false;
  if (threshold !== undefined) {
    breached = inverse ? value > threshold : value < threshold;
  }
  return (
    <span className={breached ? 'text-alert font-bold' : 'text-white'}>
      {pct}
    </span>
  );
}

export default function FunnelChart({ variants, proposedVariant }: FunnelChartProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-2 text-zinc-500 font-body font-normal">Metric</th>
              {variants.map((v) => (
                <th key={v.lp_variant_id} className="text-right py-2 text-zinc-400 font-body font-normal">
                  {v.lp_variant_id}
                  <span className="block text-xs text-zinc-600">{v.hero_framing}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono">
            <tr className="border-b border-zinc-900">
              <td className="py-2 text-zinc-400">Sessions</td>
              {variants.map((v) => (
                <td key={v.lp_variant_id} className="text-right py-2 text-white">{v.sessions}</td>
              ))}
            </tr>
            <tr className="border-b border-zinc-900">
              <td className="py-2 text-zinc-400">Bounce Rate</td>
              {variants.map((v) => (
                <td key={v.lp_variant_id} className="text-right py-2">
                  <CellValue value={v.bounce_rate} threshold={THRESHOLDS.bounce_rate} inverse />
                </td>
              ))}
            </tr>
            <tr className="border-b border-zinc-900">
              <td className="py-2 text-zinc-400">Form Start Rate</td>
              {variants.map((v) => (
                <td key={v.lp_variant_id} className="text-right py-2">
                  <CellValue value={v.sections.hero?.form_start_rate ?? 0} threshold={THRESHOLDS.form_start_rate} />
                </td>
              ))}
            </tr>
            <tr className="border-b border-zinc-900">
              <td className="py-2 text-zinc-400">Monetization Reach</td>
              {variants.map((v) => (
                <td key={v.lp_variant_id} className="text-right py-2">
                  <CellValue value={v.sections.monetization?.scroll_reach_pct ?? 0} threshold={THRESHOLDS.monetization_reach} />
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 text-zinc-400">CVR</td>
              {variants.map((v) => (
                <td key={v.lp_variant_id} className="text-right py-2">
                  <CellValue value={v.overall_cvr} threshold={THRESHOLDS.overall_cvr} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {proposedVariant && (
        <div className="border border-dashed border-accent/40 rounded-lg p-4 bg-accent/5">
          <h4 className="text-sm font-heading tracking-wider text-accent mb-2">
            PROPOSED: {proposedVariant.variant_id} — {proposedVariant.section} rewrite
          </h4>
          <div className="space-y-1 text-sm">
            <p className="text-white font-medium">{proposedVariant.new_copy.headline_pt}</p>
            <p className="text-zinc-400">{proposedVariant.new_copy.subheadline_pt}</p>
            <p className="text-zinc-500 text-xs mt-2">{proposedVariant.new_copy.body_pt}</p>
          </div>
          <p className="text-xs text-zinc-600 mt-3">{proposedVariant.rationale}</p>
        </div>
      )}
    </div>
  );
}
