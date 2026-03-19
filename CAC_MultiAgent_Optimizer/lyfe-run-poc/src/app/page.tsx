'use client';

import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import CreativeCard from './components/CreativeCard';
import FunnelChart from './components/FunnelChart';
import BudgetTable from './components/BudgetTable';
import DecisionLog from './components/DecisionLog';

// Seed data types
interface MetaCreative {
  creative_id: string;
  hypothesis: string;
  ad_name: string;
  angle: string;
  daily_spend_brl: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc_brl: number;
  thumb_stop_rate: number;
}

interface CreativeScore {
  creative_id: string;
  score: number;
  status: 'winner' | 'neutral' | 'loser';
  reason: string;
}

interface State {
  campaign: {
    scoring_summary: string;
    creative_scores: CreativeScore[];
    lp_alerts: Array<{
      lp_variant_id: string;
      section: string;
      metric: string;
      value: number;
      threshold: number;
      triggered: boolean;
    }>;
  } | null;
  proposedCreatives: {
    triggered_by: string;
    new_creative: {
      proposed_id: string;
      hypothesis: string;
      angle: string;
      headline_pt: string;
      cta_pt: string;
      rationale: string;
    };
  } | null;
  proposedLpVariants: {
    triggered_by: { lp_variant_id: string; section: string; metric: string; current_value: number };
    proposed_variant: {
      variant_id: string;
      section: string;
      new_copy: { headline_pt: string; subheadline_pt: string; body_pt: string };
      rationale: string;
    };
  } | null;
  budgetAllocation: {
    current_allocation: Array<{ creative_id: string; daily_spend_brl: number; cac_brl: number }>;
    recommended_allocation: Array<{
      creative_id: string;
      action: 'increase' | 'maintain' | 'decrease' | 'pause';
      recommended_daily_spend_brl: number;
      reason: string;
    }>;
    manual_steps: string[];
  } | null;
}

interface EvaluationData {
  simulation_notes: string;
  projected_results: Array<{
    creative_id: string;
    projected_ctr: number;
    projected_cpc_brl: number;
    projected_thumb_stop: number;
    confidence: string;
    reasoning: string;
  }>;
  projected_lp_results: Array<{
    variant_id: string;
    projected_cvr: number;
    projected_form_start_rate: number;
    projected_monetization_reach_pct: number;
    confidence: string;
    reasoning: string;
  }>;
  projected_cac_brl: number;
  vs_current_cac_brl: number;
  improvement_pct: number;
}

// H5 seed data (loaded client-side from known values)
const H5_CREATIVES: MetaCreative[] = [
  { creative_id: 'h5-01', hypothesis: 'H5', ad_name: 'H5-01 · The 6am leader', angle: 'identity', daily_spend_brl: 280, impressions: 18400, clicks: 294, ctr: 0.016, cpc_brl: 0.95, thumb_stop_rate: 0.21 },
  { creative_id: 'h5-02', hypothesis: 'H5', ad_name: 'H5-02 · WhatsApp chaos', angle: 'pain', daily_spend_brl: 280, impressions: 17900, clicks: 197, ctr: 0.011, cpc_brl: 1.42, thumb_stop_rate: 0.14 },
  { creative_id: 'h5-03', hypothesis: 'H5', ad_name: 'H5-03 · Brand + community', angle: 'earn_money', daily_spend_brl: 280, impressions: 19200, clicks: 422, ctr: 0.022, cpc_brl: 0.66, thumb_stop_rate: 0.29 },
];

const LP_VARIANTS = [
  { lp_variant_id: 'h5-lp-hero-a', hypothesis: 'H5', hero_framing: 'operational_relief', sessions: 198, avg_time_on_page_sec: 74, bounce_rate: 0.61, sections: { hero: { viewed_pct: 1.0, form_start_rate: 0.18 }, pain_strip: { scroll_reach_pct: 0.71 }, features: { scroll_reach_pct: 0.58 }, monetization: { scroll_reach_pct: 0.39 }, faq: { scroll_reach_pct: 0.22 } }, form_start_to_submit_rate: 0.52, overall_cvr: 0.047 },
  { lp_variant_id: 'h5-lp-hero-b', hypothesis: 'H5', hero_framing: 'earning_potential', sessions: 224, avg_time_on_page_sec: 98, bounce_rate: 0.44, sections: { hero: { viewed_pct: 1.0, form_start_rate: 0.27 }, pain_strip: { scroll_reach_pct: 0.79 }, features: { scroll_reach_pct: 0.68 }, monetization: { scroll_reach_pct: 0.61 }, faq: { scroll_reach_pct: 0.34 } }, form_start_to_submit_rate: 0.63, overall_cvr: 0.083 },
];

const TOTAL_SPEND_7D = 4200;
const TOTAL_LEADS = 29;
const CURRENT_CAC = TOTAL_SPEND_7D / TOTAL_LEADS;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-heading tracking-wider text-accent mb-4 border-b border-zinc-800 pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Dashboard() {
  const [state, setState] = useState<State | null>(null);
  const [log, setLog] = useState<Array<Record<string, unknown>>>([]);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/state').then((r) => r.json()),
      fetch('/api/log').then((r) => r.json()),
    ])
      .then(([stateData, logData]) => {
        setState(stateData);
        setLog(logData);

        // Extract analyst scores and evaluation data from decision log
        const entries = logData as Array<{ agent: string; raw_output: unknown }>;

        // Get analyst output (has creative_scores)
        const analystEntry = entries.find((e) => e.agent === 'performance-analyst');
        if (analystEntry) {
          try {
            const parsed = typeof analystEntry.raw_output === 'string'
              ? JSON.parse(analystEntry.raw_output)
              : analystEntry.raw_output;
            if (parsed?.creative_scores) {
              setState((prev) =>
                prev ? { ...prev, campaign: { ...prev.campaign, ...parsed } } : prev
              );
            }
          } catch {
            // ignore
          }
        }

        // Get evaluation output (has projected_cac_brl)
        const evalEntry = entries.find((e) => e.agent === 'evaluation');
        if (evalEntry) {
          try {
            const parsed = typeof evalEntry.raw_output === 'string'
              ? JSON.parse(evalEntry.raw_output)
              : evalEntry.raw_output;
            if (parsed?.projected_cac_brl) {
              setEvaluation(parsed);
            }
          } catch {
            // ignore
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500 font-heading text-xl tracking-widest animate-pulse">
          LOADING...
        </p>
      </div>
    );
  }

  const scores = state?.campaign?.creative_scores ?? [];
  const getScore = (id: string) => scores.find((s) => s.creative_id === id);
  const proposed = state?.proposedCreatives?.new_creative;

  return (
    <>
    <Nav />
    <main className="max-w-5xl mx-auto px-6 py-10">
      {/* Section 1: Campaign Header */}
      <Section title="Campaign Overview — H5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase">Hypothesis</p>
            <p className="text-xl font-heading text-white mt-1">H5</p>
            <p className="text-xs text-zinc-600">Run Club Leaders</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase">7-Day Spend</p>
            <p className="text-xl font-heading text-white mt-1">
              R${TOTAL_SPEND_7D.toLocaleString()}
            </p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase">Leads</p>
            <p className="text-xl font-heading text-white mt-1">{TOTAL_LEADS}</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase">Current CAC</p>
            <p className="text-xl font-heading text-alert mt-1">
              R${CURRENT_CAC.toFixed(2)}
            </p>
          </div>
        </div>
      </Section>

      {/* Section 2: Creative Scorecard */}
      <Section title="Creative Scorecard">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {H5_CREATIVES.map((c) => {
            const s = getScore(c.creative_id);
            return (
              <CreativeCard
                key={c.creative_id}
                creative_id={c.creative_id}
                ad_name={c.ad_name}
                angle={c.angle}
                ctr={c.ctr}
                cpc_brl={c.cpc_brl}
                thumb_stop={c.thumb_stop_rate}
                score={s?.score}
                status={s?.status}
                reason={s?.reason}
              />
            );
          })}
          {proposed && (
            <CreativeCard
              creative_id={proposed.proposed_id}
              angle={proposed.angle}
              ctr={0}
              cpc_brl={0}
              thumb_stop={0}
              proposed
              headline_pt={proposed.headline_pt}
              cta_pt={proposed.cta_pt}
              reason={proposed.rationale}
            />
          )}
        </div>
      </Section>

      {/* Section 3: Funnel Table */}
      <Section title="Landing Page Funnel">
        <FunnelChart
          variants={LP_VARIANTS}
          proposedVariant={state?.proposedLpVariants?.proposed_variant ?? null}
        />
      </Section>

      {/* Section 4: Budget Recommendation */}
      <Section title="Budget Recommendation">
        {state?.budgetAllocation ? (
          <BudgetTable
            current={state.budgetAllocation.current_allocation}
            recommended={state.budgetAllocation.recommended_allocation}
            manual_steps={state.budgetAllocation.manual_steps}
          />
        ) : (
          <p className="text-zinc-600 text-sm">
            No budget data. Run <code className="text-accent">npm run seed</code> first.
          </p>
        )}
      </Section>

      {/* Section 5: Synthetic Projection */}
      <Section title="Synthetic Projection">
        {evaluation ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 text-center">
                <p className="text-xs text-zinc-500 uppercase">Current CAC</p>
                <p className="text-2xl font-heading text-alert mt-1">
                  R${evaluation.vs_current_cac_brl.toFixed(2)}
                </p>
              </div>
              <div className="bg-zinc-900 rounded-lg p-4 border border-accent/30 text-center">
                <p className="text-xs text-zinc-500 uppercase">Projected CAC</p>
                <p className="text-2xl font-heading text-accent mt-1">
                  R${evaluation.projected_cac_brl.toFixed(2)}
                </p>
              </div>
              <div className="bg-zinc-900 rounded-lg p-4 border border-green-800 text-center">
                <p className="text-xs text-zinc-500 uppercase">Improvement</p>
                <p className="text-2xl font-heading text-green-400 mt-1">
                  {evaluation.improvement_pct.toFixed(1)}%
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-600">{evaluation.simulation_notes}</p>

            {evaluation.projected_results.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-2 text-zinc-500 font-body font-normal">Creative</th>
                      <th className="text-right py-2 text-zinc-500 font-body font-normal">Proj. CTR</th>
                      <th className="text-right py-2 text-zinc-500 font-body font-normal">Proj. CPC</th>
                      <th className="text-center py-2 text-zinc-500 font-body font-normal">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {evaluation.projected_results.map((r) => (
                      <tr key={r.creative_id} className="border-b border-zinc-900">
                        <td className="py-2 text-white font-heading tracking-wider">
                          {r.creative_id.toUpperCase()}
                        </td>
                        <td className="text-right py-2 text-white">
                          {(r.projected_ctr * 100).toFixed(1)}%
                        </td>
                        <td className="text-right py-2 text-white">
                          R${r.projected_cpc_brl.toFixed(2)}
                        </td>
                        <td className="text-center py-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              r.confidence === 'high'
                                ? 'bg-green-900/50 text-green-400'
                                : r.confidence === 'medium'
                                ? 'bg-yellow-900/50 text-yellow-400'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {r.confidence}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <p className="text-zinc-600 text-sm">
            No evaluation data. Run <code className="text-accent">npm run evaluate</code> to generate projections.
          </p>
        )}
      </Section>

      {/* Section 6: Decision Log */}
      <Section title="Decision Log">
        <DecisionLog entries={log as never[]} />
      </Section>
    </main>
    </>
  );
}
