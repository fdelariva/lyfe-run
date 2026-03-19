'use client';

import { useEffect, useState } from 'react';
import Nav from '../components/Nav';

interface Config {
  mock_agents: boolean;
  thresholds: {
    creative: {
      ctr_loser: number;
      thumb_stop_loser: number;
      cpc_loser: number;
      score_winner: number;
      score_loser: number;
    };
    lp: {
      bounce_rate_max: number;
      form_start_rate_min: number;
      monetization_reach_min: number;
      cvr_min: number;
    };
    budget: {
      min_spend_per_creative: number;
      max_spend_pct: number;
      pause_ctr_below: number;
      pause_cpc_above: number;
      increase_score_above: number;
      increase_ctr_above: number;
    };
  };
}

function ThresholdInput({
  label,
  value,
  onChange,
  suffix,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  step?: number;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-800">
      <label className="text-sm text-zinc-400">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step ?? 0.01}
          className="w-24 text-right bg-zinc-800 text-white text-sm px-2 py-1 rounded border border-zinc-700 focus:border-accent focus:outline-none"
        />
        {suffix && <span className="text-xs text-zinc-600">{suffix}</span>}
      </div>
    </div>
  );
}

export default function ConfigPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [running, setRunning] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then(setConfig)
      .catch(console.error);
  }, []);

  const saveConfig = async () => {
    if (!config) return;
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save config');
    } finally {
      setSaving(false);
    }
  };

  const runPipeline = async (command: 'seed' | 'evaluate') => {
    setRunning(command);
    setOutput(null);
    setError(null);
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
      const data = await res.json();
      if (data.success) {
        setOutput(data.output);
      } else {
        setError(data.error || 'Pipeline failed');
        setOutput(data.output || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setRunning(null);
    }
  };

  const updateCreative = (key: keyof Config['thresholds']['creative'], val: number) => {
    if (!config) return;
    setConfig({ ...config, thresholds: { ...config.thresholds, creative: { ...config.thresholds.creative, [key]: val } } });
  };
  const updateLp = (key: keyof Config['thresholds']['lp'], val: number) => {
    if (!config) return;
    setConfig({ ...config, thresholds: { ...config.thresholds, lp: { ...config.thresholds.lp, [key]: val } } });
  };
  const updateBudget = (key: keyof Config['thresholds']['budget'], val: number) => {
    if (!config) return;
    setConfig({ ...config, thresholds: { ...config.thresholds, budget: { ...config.thresholds.budget, [key]: val } } });
  };

  if (!config) {
    return (
      <>
        <Nav />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-zinc-500 animate-pulse">Loading config...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-heading tracking-wider text-accent mb-8">
          CONFIG & RUN PIPELINE
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Configuration */}
          <div className="space-y-6">
            {/* Mode Toggle */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
              <h2 className="text-lg font-heading tracking-wider text-white mb-3">Mode</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Mock Agents</p>
                  <p className="text-xs text-zinc-600">Use pre-defined responses instead of Claude API</p>
                </div>
                <button
                  onClick={() => setConfig({ ...config, mock_agents: !config.mock_agents })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    config.mock_agents ? 'bg-accent' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-dark transition-transform ${
                      config.mock_agents ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Creative Thresholds */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
              <h2 className="text-lg font-heading tracking-wider text-white mb-3">
                Creative Thresholds
              </h2>
              <ThresholdInput label="CTR (loser below)" value={config.thresholds.creative.ctr_loser} onChange={(v) => updateCreative('ctr_loser', v)} step={0.001} />
              <ThresholdInput label="Thumb-stop (loser below)" value={config.thresholds.creative.thumb_stop_loser} onChange={(v) => updateCreative('thumb_stop_loser', v)} />
              <ThresholdInput label="CPC (loser above)" value={config.thresholds.creative.cpc_loser} onChange={(v) => updateCreative('cpc_loser', v)} suffix="BRL" />
              <ThresholdInput label="Score: winner" value={config.thresholds.creative.score_winner} onChange={(v) => updateCreative('score_winner', v)} step={1} />
              <ThresholdInput label="Score: loser below" value={config.thresholds.creative.score_loser} onChange={(v) => updateCreative('score_loser', v)} step={1} />
            </div>

            {/* LP Thresholds */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
              <h2 className="text-lg font-heading tracking-wider text-white mb-3">
                LP Thresholds
              </h2>
              <ThresholdInput label="Bounce rate (max)" value={config.thresholds.lp.bounce_rate_max} onChange={(v) => updateLp('bounce_rate_max', v)} />
              <ThresholdInput label="Form start rate (min)" value={config.thresholds.lp.form_start_rate_min} onChange={(v) => updateLp('form_start_rate_min', v)} />
              <ThresholdInput label="Monetization reach (min)" value={config.thresholds.lp.monetization_reach_min} onChange={(v) => updateLp('monetization_reach_min', v)} />
              <ThresholdInput label="CVR (min)" value={config.thresholds.lp.cvr_min} onChange={(v) => updateLp('cvr_min', v)} />
            </div>

            {/* Budget Thresholds */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
              <h2 className="text-lg font-heading tracking-wider text-white mb-3">
                Budget Rules
              </h2>
              <ThresholdInput label="Min spend/creative" value={config.thresholds.budget.min_spend_per_creative} onChange={(v) => updateBudget('min_spend_per_creative', v)} suffix="BRL" step={10} />
              <ThresholdInput label="Max spend % of total" value={config.thresholds.budget.max_spend_pct} onChange={(v) => updateBudget('max_spend_pct', v)} />
              <ThresholdInput label="Pause if CTR below" value={config.thresholds.budget.pause_ctr_below} onChange={(v) => updateBudget('pause_ctr_below', v)} step={0.001} />
              <ThresholdInput label="Pause if CPC above" value={config.thresholds.budget.pause_cpc_above} onChange={(v) => updateBudget('pause_cpc_above', v)} suffix="BRL" />
              <ThresholdInput label="Increase if score above" value={config.thresholds.budget.increase_score_above} onChange={(v) => updateBudget('increase_score_above', v)} step={1} />
              <ThresholdInput label="Increase if CTR above" value={config.thresholds.budget.increase_ctr_above} onChange={(v) => updateBudget('increase_ctr_above', v)} step={0.001} />
            </div>

            <button
              onClick={saveConfig}
              disabled={saving}
              className="w-full py-2.5 rounded-lg font-bold text-sm bg-accent text-dark hover:bg-accent/90 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Configuration'}
            </button>
          </div>

          {/* Right: Pipeline Runner */}
          <div className="space-y-4">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
              <h2 className="text-lg font-heading tracking-wider text-white mb-4">
                RUN PIPELINE
              </h2>
              <p className="text-sm text-zinc-500 mb-4">
                Run the optimization agents from the browser.
                {config.mock_agents
                  ? ' Using mock responses (no API cost).'
                  : ' Using live Claude API (will consume tokens).'}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => runPipeline('seed')}
                  disabled={running !== null}
                  className="w-full py-3 rounded-lg font-bold text-sm border border-accent text-accent hover:bg-accent/10 disabled:opacity-50 transition-colors"
                >
                  {running === 'seed' ? (
                    <span className="animate-pulse">Running Agents 01–05...</span>
                  ) : (
                    'Run Optimization Cycle (Agents 01–05)'
                  )}
                </button>

                <button
                  onClick={() => runPipeline('evaluate')}
                  disabled={running !== null}
                  className="w-full py-3 rounded-lg font-bold text-sm border border-zinc-600 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                >
                  {running === 'evaluate' ? (
                    <span className="animate-pulse">Running Agent 06...</span>
                  ) : (
                    'Run Evaluation (Agent 06)'
                  )}
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-600">
                <span className={`w-2 h-2 rounded-full ${config.mock_agents ? 'bg-accent' : 'bg-alert'}`} />
                {config.mock_agents ? 'Mock mode — no API cost' : 'Live mode — uses Claude API'}
              </div>
            </div>

            {/* Output Console */}
            <div className="bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-mono">Output</span>
                {output && (
                  <button
                    onClick={() => { setOutput(null); setError(null); }}
                    className="text-xs text-zinc-600 hover:text-zinc-400"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="p-4 max-h-[500px] overflow-y-auto">
                {running && (
                  <p className="text-accent text-sm animate-pulse font-mono">
                    Running {running}...
                  </p>
                )}
                {error && (
                  <pre className="text-alert text-xs whitespace-pre-wrap font-mono mb-2">
                    {error}
                  </pre>
                )}
                {output ? (
                  <pre className="text-zinc-400 text-xs whitespace-pre-wrap font-mono">
                    {output}
                  </pre>
                ) : (
                  !running && !error && (
                    <p className="text-zinc-700 text-xs font-mono">
                      Pipeline output will appear here...
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
