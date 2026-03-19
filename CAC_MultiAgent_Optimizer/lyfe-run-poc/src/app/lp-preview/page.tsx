'use client';

import { useEffect, useState } from 'react';
import Nav from '../components/Nav';

interface ProposedVariant {
  variant_id: string;
  section: string;
  original_copy: string;
  new_copy: {
    headline_pt: string;
    subheadline_pt: string;
    body_pt: string;
  };
  rationale: string;
  a_b_split: string;
}

interface TriggeredBy {
  lp_variant_id: string;
  section: string;
  metric: string;
  current_value: number;
}

// Original LP copy from the agent system prompt
const ORIGINAL_LP: Record<string, Record<string, { headline: string; subheadline?: string; body: string }>> = {
  'h5-lp-hero-a': {
    hero: {
      headline: 'Transforme seu grupo de corrida em um negócio',
      subheadline: 'A plataforma gratuita que conecta líderes de corrida a marcas patrocinadoras',
      body: '',
    },
    pain_strip: {
      headline: 'Seu grupo de corrida merece mais do que um grupo no WhatsApp.',
      body: '',
    },
    monetization: {
      headline: 'Marcas querem patrocinar sua comunidade',
      body: 'Conectamos assessorias e grupos de corrida com marcas esportivas que pagam para alcançar corredores engajados.',
    },
    faq: {
      headline: 'Perguntas Frequentes',
      body: 'Seção de perguntas e respostas padrão',
    },
  },
  'h5-lp-hero-b': {
    hero: {
      headline: 'Quanto vale sua comunidade de corrida?',
      subheadline: 'Líderes de corrida estão transformando seus grupos em negócios reais',
      body: '',
    },
    pain_strip: {
      headline: 'Você lidera treinos de graça. Marcas lucram com seus corredores.',
      body: '',
    },
    monetization: {
      headline: 'Ganhe dinheiro com o que você já faz',
      body: 'Marcas esportivas pagam para alcançar comunidades engajadas como a sua. A Lyfe Run conecta você diretamente.',
    },
    faq: {
      headline: 'Perguntas Frequentes',
      body: 'Seção de perguntas e respostas padrão',
    },
  },
};

// Posthog metrics per variant
const LP_METRICS: Record<string, { sessions: number; bounce_rate: number; form_start_rate: number; monetization_reach: number; cvr: number; avg_time: number; hero_framing: string }> = {
  'h5-lp-hero-a': { sessions: 198, bounce_rate: 0.61, form_start_rate: 0.18, monetization_reach: 0.39, cvr: 0.047, avg_time: 74, hero_framing: 'operational_relief' },
  'h5-lp-hero-b': { sessions: 224, bounce_rate: 0.44, form_start_rate: 0.27, monetization_reach: 0.61, cvr: 0.083, avg_time: 98, hero_framing: 'earning_potential' },
};

function MetricBadge({ label, value, threshold, inverse }: { label: string; value: number; threshold: number; inverse?: boolean }) {
  const pct = (value * 100).toFixed(1) + '%';
  const breached = inverse ? value > threshold : value < threshold;
  return (
    <div className={`text-center px-3 py-2 rounded ${breached ? 'bg-alert/10 border border-alert/30' : 'bg-zinc-800/50'}`}>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`text-sm font-mono font-bold ${breached ? 'text-alert' : 'text-white'}`}>{pct}</p>
    </div>
  );
}

function LpSection({ title, copy, isChanged, isTargetSection }: {
  title: string;
  copy: { headline: string; subheadline?: string; body: string };
  isChanged?: boolean;
  isTargetSection?: boolean;
}) {
  return (
    <div className={`rounded-lg p-4 ${
      isTargetSection
        ? 'border-2 border-alert/40 bg-alert/5'
        : isChanged
        ? 'border border-accent/30 bg-accent/5'
        : 'border border-zinc-800 bg-zinc-900'
    }`}>
      {isTargetSection && (
        <span className="text-xs text-alert font-bold uppercase block mb-2">Alert Triggered</span>
      )}
      <p className="text-xs text-zinc-500 uppercase mb-2">{title}</p>
      <p className="text-white font-heading text-lg tracking-wider">{copy.headline}</p>
      {copy.subheadline && (
        <p className="text-zinc-400 text-sm mt-1">{copy.subheadline}</p>
      )}
      {copy.body && (
        <p className="text-zinc-500 text-sm mt-2">{copy.body}</p>
      )}
    </div>
  );
}

export default function LpPreviewPage() {
  const [proposed, setProposed] = useState<ProposedVariant | null>(null);
  const [triggeredBy, setTriggeredBy] = useState<TriggeredBy | null>(null);
  const [lpAlerts, setLpAlerts] = useState<Array<{ lp_variant_id: string; section: string; metric: string; value: number; threshold: number; triggered: boolean }>>([]);

  useEffect(() => {
    fetch('/api/state')
      .then((r) => r.json())
      .then((data) => {
        if (data.proposedLpVariants) {
          setProposed(data.proposedLpVariants.proposed_variant);
          setTriggeredBy(data.proposedLpVariants.triggered_by);
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
          if (parsed?.lp_alerts) setLpAlerts(parsed.lp_alerts);
        }
      })
      .catch(() => {});
  }, []);

  const variants = Object.keys(ORIGINAL_LP);

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-heading tracking-wider text-accent mb-8">
          LANDING PAGES
        </h1>

        {/* Current LP Variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {variants.map((variantId) => {
            const lp = ORIGINAL_LP[variantId];
            const metrics = LP_METRICS[variantId];
            const alerts = lpAlerts.filter((a) => a.lp_variant_id === variantId && a.triggered);
            const alertSections = alerts.map((a) => a.section);

            return (
              <div key={variantId} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-heading tracking-wider text-white">
                    {variantId.toUpperCase()}
                  </h2>
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                    {metrics.hero_framing}
                  </span>
                </div>

                {/* Metrics bar */}
                <div className="grid grid-cols-5 gap-1">
                  <MetricBadge label="Bounce" value={metrics.bounce_rate} threshold={0.60} inverse />
                  <MetricBadge label="Form Start" value={metrics.form_start_rate} threshold={0.20} />
                  <MetricBadge label="Monet." value={metrics.monetization_reach} threshold={0.45} />
                  <MetricBadge label="CVR" value={metrics.cvr} threshold={0.06} />
                  <div className="text-center px-3 py-2 rounded bg-zinc-800/50">
                    <p className="text-xs text-zinc-500">Time</p>
                    <p className="text-sm font-mono text-white">{metrics.avg_time}s</p>
                  </div>
                </div>

                {alerts.length > 0 && (
                  <p className="text-xs text-alert">
                    {alerts.length} alert{alerts.length > 1 ? 's' : ''} triggered
                  </p>
                )}

                {/* LP sections as wireframe */}
                <div className="rounded-lg border border-zinc-800 bg-dark overflow-hidden">
                  <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-alert" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-zinc-600 ml-2">lyferun.com.br/{variantId}</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {Object.entries(lp).map(([section, copy]) => (
                      <LpSection
                        key={section}
                        title={section.replace('_', ' ')}
                        copy={copy}
                        isTargetSection={alertSections.includes(section) || alertSections.includes('overall')}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Proposed LP Change - Before / After */}
        {proposed && triggeredBy && (
          <>
            <h2 className="text-xl font-heading tracking-wider text-accent mb-4 border-b border-accent/20 pb-2">
              PROPOSED CHANGE: {proposed.variant_id.toUpperCase()}
            </h2>

            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 mb-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-zinc-500">Triggered by:</span>
                <span className="text-alert font-mono">{triggeredBy.metric} = {(triggeredBy.current_value * 100).toFixed(0)}%</span>
                <span className="text-zinc-600">on</span>
                <span className="text-white">{triggeredBy.lp_variant_id}</span>
                <span className="text-zinc-600">section:</span>
                <span className="text-white">{triggeredBy.section}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                  A/B Split: {proposed.a_b_split}
                </span>
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                  Section: {proposed.section}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Before */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-alert" />
                  BEFORE — {proposed.section.replace('_', ' ')}
                </h3>
                <div className="bg-dark rounded p-4 border border-zinc-800">
                  <p className="text-white">{proposed.original_copy}</p>
                </div>
              </div>

              {/* After */}
              <div className="rounded-lg border border-accent/30 bg-accent/5 p-5">
                <h3 className="text-xs text-accent uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  AFTER — {proposed.section.replace('_', ' ')}
                </h3>
                <div className="bg-dark rounded p-4 border border-accent/20 space-y-2">
                  <p className="text-accent font-heading text-lg tracking-wider">
                    {proposed.new_copy.headline_pt}
                  </p>
                  <p className="text-zinc-300 text-sm">
                    {proposed.new_copy.subheadline_pt}
                  </p>
                  <p className="text-zinc-500 text-sm">
                    {proposed.new_copy.body_pt}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
              <h4 className="text-xs text-zinc-500 uppercase mb-2">Rationale</h4>
              <p className="text-sm text-zinc-400">{proposed.rationale}</p>
            </div>
          </>
        )}

        {!proposed && (
          <div className="text-zinc-600 text-sm">
            No LP proposals yet. Run <code className="text-accent">npm run seed</code> or use the Config & Run page.
          </div>
        )}
      </main>
    </>
  );
}
