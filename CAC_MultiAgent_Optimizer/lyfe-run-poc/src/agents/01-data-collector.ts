import fs from 'fs-extra';
import path from 'path';
import { callAgent } from '../lib/claude';
import { DataCollectorOutput, DataCollectorOutputType } from '../lib/schemas';
import { loadAllSeedData } from '../lib/seed-loader';
import { appendLog } from '../lib/decision-log';

const CONTEXT = `You are operating as part of the Lyfe Run multi-agent CAC optimization system. Lyfe Run is a SaaS coaching management platform targeting the Brazilian running market. The current hypothesis under test is H5: a free run club management platform monetized via brand sponsorships, where community leaders receive a revenue share. Brazil has ~14 million runners in a R$1.1 billion market. 45% of 2025 race participants were first-timers (Ticket Sports data). Target customer: run club leaders managing 50–2000 runners, currently using WhatsApp + spreadsheets. All copy must be in Brazilian Portuguese. All currency is BRL.`;

const SYSTEM_PROMPT = `${CONTEXT}

You are the Data Collector agent. Your job is to normalize raw campaign data and compute derived metrics.

Instructions:
1. Parse the three data sources provided: Meta Ads performance, PostHog LP events, and Supabase leads.
2. Compute derived metrics for each creative:
   - CTR = clicks / impressions
   - CPC = daily_spend_brl / clicks (if clicks > 0)
3. Identify the best-performing H5 creative by CTR (highest CTR).
4. Identify the worst-performing H5 creative by CTR (lowest CTR).
5. For each LP variant, determine the weakest section by finding the section with the lowest key metric (viewed_pct, form_start_rate, or scroll_reach_pct).
6. Set window_days to 7 (the seed data covers a 7-day window).

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "normalized_at": "<ISO 8601 timestamp>",
  "window_days": 7,
  "top_performing_creative": {
    "creative_id": "<string>",
    "ctr": <number>,
    "cpc_brl": <number>,
    "hypothesis": "<string>"
  },
  "bottom_performing_creative": {
    "creative_id": "<string>",
    "ctr": <number>,
    "cpc_brl": <number>,
    "hypothesis": "<string>"
  },
  "lp_variants": [
    {
      "lp_variant_id": "<string>",
      "overall_cvr": <number>,
      "weakest_section": "<string>",
      "weakest_section_metric": <number>
    }
  ]
}`;

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const STATE_DIR = path.resolve(PROJECT_ROOT, 'data', 'state');

export async function run(): Promise<DataCollectorOutputType> {
  const seedData = await loadAllSeedData();

  const userMessage = `Here is the raw campaign data. Please normalize it and compute derived metrics.

META ADS PERFORMANCE:
${JSON.stringify(seedData.metaPerformance, null, 2)}

POSTHOG LP EVENTS:
${JSON.stringify(seedData.posthogEvents, null, 2)}

SUPABASE LEADS:
${JSON.stringify(seedData.supabaseLeads, null, 2)}`;

  const result = await callAgent({
    agent_name: 'data-collector',
    system: SYSTEM_PROMPT,
    user: userMessage,
    max_tokens: 2000,
  });

  const parsed = JSON.parse(result.content);
  const validated = DataCollectorOutput.parse(parsed);

  // Write state for downstream agents
  await fs.ensureDir(STATE_DIR);
  await fs.writeJson(path.resolve(STATE_DIR, 'campaign-state.json'), validated, { spaces: 2 });

  // Append to decision log
  await appendLog({
    timestamp: new Date().toISOString(),
    agent: 'data-collector',
    input_summary: `3 seed files: ${seedData.metaPerformance.length} creatives, ${seedData.posthogEvents.length} LP variants, ${seedData.supabaseLeads.length} leads`,
    output_summary: `Top creative: ${validated.top_performing_creative.creative_id} (CTR ${validated.top_performing_creative.ctr}), Bottom: ${validated.bottom_performing_creative.creative_id} (CTR ${validated.bottom_performing_creative.ctr})`,
    raw_output: validated,
    tokens_used: result.usage,
  });

  return validated;
}
