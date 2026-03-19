'use client';

import { useEffect, useState } from 'react';
import Nav from '../components/Nav';

interface NewCreative {
  proposed_id: string;
  hypothesis: string;
  angle: string;
  image_tool: string;
  image_prompt: string;
  headline_pt: string;
  cta_pt: string;
  rationale: string;
}

interface ExistingCreative {
  creative_id: string;
  ad_name: string;
  angle: string;
  image_tool: string;
  ctr: number;
  cpc_brl: number;
  thumb_stop_rate: number;
}

const EXISTING_CREATIVES: ExistingCreative[] = [
  { creative_id: 'h5-01', ad_name: 'H5-01 · The 6am leader', angle: 'identity', image_tool: 'midjourney', ctr: 0.016, cpc_brl: 0.95, thumb_stop_rate: 0.21 },
  { creative_id: 'h5-02', ad_name: 'H5-02 · WhatsApp chaos', angle: 'pain', image_tool: 'ideogram', ctr: 0.011, cpc_brl: 1.42, thumb_stop_rate: 0.14 },
  { creative_id: 'h5-03', ad_name: 'H5-03 · Brand + community', angle: 'earn_money', image_tool: 'midjourney', ctr: 0.022, cpc_brl: 0.66, thumb_stop_rate: 0.29 },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-xs px-2 py-1 rounded border border-zinc-700 text-zinc-400 hover:text-accent hover:border-accent transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function CreativesPage() {
  const [proposed, setProposed] = useState<NewCreative | null>(null);
  const [triggeredBy, setTriggeredBy] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, { score: number; status: string }>>({});

  useEffect(() => {
    fetch('/api/state')
      .then((r) => r.json())
      .then((data) => {
        if (data.proposedCreatives) {
          setProposed(data.proposedCreatives.new_creative);
          setTriggeredBy(data.proposedCreatives.triggered_by);
        }
      })
      .catch(() => {});

    fetch('/api/log')
      .then((r) => r.json())
      .then((entries: Array<{ agent: string; raw_output: unknown }>) => {
        const analyst = entries.find((e) => e.agent === 'performance-analyst');
        if (analyst) {
          const parsed = typeof analyst.raw_output === 'string'
            ? JSON.parse(analyst.raw_output)
            : analyst.raw_output;
          if (parsed?.creative_scores) {
            const map: Record<string, { score: number; status: string }> = {};
            for (const s of parsed.creative_scores) {
              map[s.creative_id] = { score: s.score, status: s.status };
            }
            setScores(map);
          }
        }
      })
      .catch(() => {});
  }, []);

  const statusColor = (status: string) => {
    if (status === 'winner') return 'text-accent';
    if (status === 'loser') return 'text-alert';
    return 'text-zinc-400';
  };

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-heading tracking-wider text-accent mb-8">
          CREATIVE ADS
        </h1>

        {/* Existing Creatives */}
        <h2 className="text-xl font-heading tracking-wider text-zinc-300 mb-4 border-b border-zinc-800 pb-2">
          CURRENT H5 CREATIVES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {EXISTING_CREATIVES.map((c) => {
            const s = scores[c.creative_id];
            const isReplaced = c.creative_id === triggeredBy;
            return (
              <div
                key={c.creative_id}
                className={`rounded-lg border p-5 ${
                  isReplaced
                    ? 'border-alert/40 bg-alert/5 opacity-60'
                    : 'border-zinc-800 bg-zinc-900'
                }`}
              >
                {isReplaced && (
                  <span className="text-xs text-alert font-bold uppercase block mb-2">
                    Being Replaced
                  </span>
                )}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading text-lg tracking-wider text-white">
                    {c.creative_id.toUpperCase()}
                  </h3>
                  {s && (
                    <span className={`text-sm font-bold ${statusColor(s.status)}`}>
                      {s.score} · {s.status}
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 mb-2">{c.ad_name}</p>

                <div className="flex gap-3 text-xs text-zinc-500 mb-3">
                  <span className="bg-zinc-800 px-2 py-0.5 rounded">{c.angle}</span>
                  <span className="bg-zinc-800 px-2 py-0.5 rounded">{c.image_tool}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <p className="text-zinc-600 text-xs">CTR</p>
                    <p className="text-white font-heading">{(c.ctr * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 text-xs">CPC</p>
                    <p className="text-white font-heading">R${c.cpc_brl.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 text-xs">Thumb-stop</p>
                    <p className="text-white font-heading">{(c.thumb_stop_rate * 100).toFixed(0)}%</p>
                  </div>
                </div>

                {/* Ad mockup */}
                <div className="mt-4 rounded bg-dark border border-zinc-800 p-4">
                  <div className="w-full aspect-[4/5] bg-zinc-800 rounded flex items-center justify-center mb-3">
                    <span className="text-zinc-600 text-xs">Ad Image ({c.image_tool})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Proposed Creative */}
        {proposed && (
          <>
            <h2 className="text-xl font-heading tracking-wider text-accent mb-4 border-b border-accent/20 pb-2">
              PROPOSED CREATIVE
            </h2>
            <div className="border-2 border-dashed border-accent/50 rounded-lg bg-accent/5 p-6 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ad Mockup */}
                <div>
                  <div className="rounded bg-dark border border-zinc-800 overflow-hidden">
                    <div className="w-full aspect-[4/5] bg-gradient-to-b from-zinc-900 to-dark flex flex-col items-center justify-center p-6 relative">
                      <div className="absolute inset-0 flex items-end p-4">
                        <div className="w-full">
                          <p className="text-accent font-heading text-2xl leading-tight mb-2">
                            {proposed.headline_pt}
                          </p>
                          <div className="bg-accent text-dark px-4 py-2 rounded text-sm font-bold text-center">
                            {proposed.cta_pt}
                          </div>
                        </div>
                      </div>
                      <span className="text-zinc-700 text-xs absolute top-3 right-3">
                        {proposed.image_tool}
                      </span>
                    </div>
                    <div className="p-3 border-t border-zinc-800">
                      <p className="text-xs text-zinc-500">Lyfe Run · Sponsored</p>
                      <p className="text-sm text-white mt-1">{proposed.headline_pt}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <span className="bg-accent/10 text-accent text-xs px-2 py-0.5 rounded">
                      {proposed.proposed_id.toUpperCase()}
                    </span>
                    <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded">
                      {proposed.angle}
                    </span>
                    <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded">
                      replaces {triggeredBy}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs text-zinc-500 uppercase mb-1">Headline (PT-BR)</h4>
                    <p className="text-white">{proposed.headline_pt}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-zinc-500 uppercase mb-1">CTA (PT-BR)</h4>
                    <p className="text-accent font-medium">{proposed.cta_pt}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-zinc-500 uppercase mb-1">Angle</h4>
                    <p className="text-zinc-300">{proposed.angle}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-zinc-500 uppercase mb-1">Rationale</h4>
                    <p className="text-sm text-zinc-400">{proposed.rationale}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs text-zinc-500 uppercase">
                        Image Prompt ({proposed.image_tool})
                      </h4>
                      <CopyButton text={proposed.image_prompt} />
                    </div>
                    <pre className="text-xs text-zinc-500 bg-zinc-950 rounded p-3 whitespace-pre-wrap break-words border border-zinc-800">
                      {proposed.image_prompt}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {!proposed && (
          <div className="text-zinc-600 text-sm mt-4">
            No proposed creative yet. Run <code className="text-accent">npm run seed</code> or use the Config & Run page.
          </div>
        )}
      </main>
    </>
  );
}
