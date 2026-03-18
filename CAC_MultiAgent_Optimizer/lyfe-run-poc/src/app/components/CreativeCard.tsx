'use client';

interface CreativeCardProps {
  creative_id: string;
  ad_name?: string;
  angle: string;
  ctr: number;
  cpc_brl: number;
  thumb_stop: number;
  score?: number;
  status?: 'winner' | 'neutral' | 'loser';
  reason?: string;
  proposed?: boolean;
  headline_pt?: string;
  cta_pt?: string;
}

const statusColors: Record<string, string> = {
  winner: 'bg-accent text-dark',
  neutral: 'bg-zinc-700 text-zinc-200',
  loser: 'bg-alert text-white',
};

export default function CreativeCard({
  creative_id,
  ad_name,
  angle,
  ctr,
  cpc_brl,
  thumb_stop,
  score,
  status,
  reason,
  proposed,
  headline_pt,
  cta_pt,
}: CreativeCardProps) {
  return (
    <div
      className={`rounded-lg p-5 ${
        proposed
          ? 'border-2 border-dashed border-accent/60 bg-accent/5'
          : 'border border-zinc-800 bg-zinc-900'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-heading tracking-wider text-white">
            {creative_id.toUpperCase()}
            {proposed && (
              <span className="ml-2 text-xs font-body font-medium text-accent">
                PROPOSED
              </span>
            )}
          </h3>
          {ad_name && (
            <p className="text-sm text-zinc-400">{ad_name}</p>
          )}
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
            {angle}
          </span>
        </div>
        {score !== undefined && status && (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded ${statusColors[status]}`}
          >
            {score}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-zinc-500 uppercase">CTR</p>
          <p className="text-lg font-heading text-white">
            {(ctr * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase">CPC</p>
          <p className="text-lg font-heading text-white">
            R${cpc_brl.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase">Thumb-stop</p>
          <p className="text-lg font-heading text-white">
            {(thumb_stop * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {proposed && headline_pt && (
        <div className="mt-3 pt-3 border-t border-zinc-800">
          <p className="text-sm text-accent font-medium">{headline_pt}</p>
          {cta_pt && (
            <p className="text-xs text-zinc-400 mt-1">CTA: {cta_pt}</p>
          )}
        </div>
      )}

      {reason && (
        <p className="mt-3 text-xs text-zinc-500 leading-relaxed">
          {reason}
        </p>
      )}
    </div>
  );
}
