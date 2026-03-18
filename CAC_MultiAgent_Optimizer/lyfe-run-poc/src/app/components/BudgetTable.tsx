'use client';

interface CurrentAllocation {
  creative_id: string;
  daily_spend_brl: number;
  cac_brl: number;
}

interface RecommendedAllocation {
  creative_id: string;
  action: 'increase' | 'maintain' | 'decrease' | 'pause';
  recommended_daily_spend_brl: number;
  reason: string;
}

interface BudgetTableProps {
  current: CurrentAllocation[];
  recommended: RecommendedAllocation[];
  manual_steps: string[];
}

const actionColors: Record<string, string> = {
  increase: 'bg-green-900/50 text-green-400 border-green-800',
  maintain: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  decrease: 'bg-yellow-900/50 text-yellow-400 border-yellow-800',
  pause: 'bg-red-900/50 text-alert border-red-800',
};

export default function BudgetTable({ current, recommended, manual_steps }: BudgetTableProps) {
  if (!current || !recommended) return null;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-2 text-zinc-500 font-body font-normal">Creative</th>
              <th className="text-right py-2 text-zinc-500 font-body font-normal">Current</th>
              <th className="text-center py-2 text-zinc-500 font-body font-normal">Action</th>
              <th className="text-right py-2 text-zinc-500 font-body font-normal">Recommended</th>
              <th className="text-left py-2 pl-4 text-zinc-500 font-body font-normal">Reason</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {recommended.map((rec) => {
              const cur = current.find((c) => c.creative_id === rec.creative_id);
              return (
                <tr key={rec.creative_id} className="border-b border-zinc-900">
                  <td className="py-2 text-white font-heading tracking-wider">
                    {rec.creative_id.toUpperCase()}
                  </td>
                  <td className="text-right py-2 text-zinc-400">
                    R${cur?.daily_spend_brl?.toFixed(0) ?? '—'}/d
                  </td>
                  <td className="text-center py-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded border ${actionColors[rec.action]}`}
                    >
                      {rec.action.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-right py-2 text-white font-bold">
                    R${rec.recommended_daily_spend_brl.toFixed(0)}/d
                  </td>
                  <td className="text-left py-2 pl-4 text-zinc-500 text-xs font-body max-w-xs">
                    {rec.reason}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {manual_steps.length > 0 && (
        <div className="border border-zinc-800 rounded-lg p-4">
          <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
            Manual Steps — Meta Ads Manager
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-400">
            {manual_steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
