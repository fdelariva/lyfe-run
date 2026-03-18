import { callAgent } from '../lib/claude';
import {
  EvaluationOutput,
  EvaluationOutputType,
  CreativeGeneratorOutputType,
  LpOptimizerOutputType,
  BudgetAllocatorOutputType,
} from '../lib/schemas';
import { appendLog } from '../lib/decision-log';
import { AllSeedData } from '../lib/seed-loader';

const CONTEXT = `You are operating as part of the Lyfe Run multi-agent CAC optimization system. Lyfe Run is a SaaS coaching management platform targeting the Brazilian running market. The current hypothesis under test is H5: a free run club management platform monetized via brand sponsorships, where community leaders receive a revenue share. Brazil has ~14 million runners in a R$1.1 billion market. 45% of 2025 race participants were first-timers (Ticket Sports data). Target customer: run club leaders managing 50–2000 runners, currently using WhatsApp + spreadsheets. All copy must be in Brazilian Portuguese. All currency is BRL.`;

const SYSTEM_PROMPT = `${CONTEXT}

You are the Evaluation agent. Your job is to project the impact of all proposed changes and estimate the new CAC.

BRAZILIAN MARKET BENCHMARKS:
- Instagram fitness/running ad CTR: 1.2% – 1.8% (0.012 – 0.018)
- earn_money angle typically shows 30–50% CTR uplift vs pain angle
- social_proof angle typically shows 15–25% CTR uplift vs generic identity
- LP CVR for lead gen in Brazil fitness: 5–9%
- benefit-first LP framing converts 15–25% better than problem-first
- Thumb-stop rate benchmark for vertical video: 0.18 – 0.30

PROJECTION RULES:
1. Be CONSERVATIVE in all projections. Use the lower end of benchmark ranges.
2. Assign confidence levels:
   - "high" = based on unchanged creative/LP with existing data
   - "medium" = based on well-benchmarked change (e.g., angle pivot with market data)
   - "low" = based on speculative change without direct benchmark
3. New creatives should be projected at 70–85% of the best current performer (conservative ramp-up).
4. LP changes should project 15–25% improvement on the changed metric (use lower bound).

CAC CALCULATION:
projected_cac_brl = total_weekly_spend / projected_total_leads_7d

Where:
- total_weekly_spend = sum of all recommended_daily_spend_brl * 7
- For each creative: projected_leads = (daily_spend * 7 / projected_cpc_brl) * projected_lp_cvr
- projected_total_leads_7d = sum of projected_leads across all active creatives

Also compute:
- vs_current_cac_brl: the current weighted average CAC from current_allocation data
- improvement_pct: ((vs_current_cac_brl - projected_cac_brl) / vs_current_cac_brl) * 100

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "simulation_notes": "<narrative of methodology and key assumptions>",
  "projected_results": [
    {
      "creative_id": "<string>",
      "projected_ctr": <number>,
      "projected_cpc_brl": <number>,
      "projected_thumb_stop": <number>,
      "confidence": "high" | "medium" | "low",
      "reasoning": "<string>"
    }
  ],
  "projected_lp_results": [
    {
      "variant_id": "<string>",
      "projected_cvr": <number>,
      "projected_form_start_rate": <number>,
      "projected_monetization_reach_pct": <number>,
      "confidence": "high" | "medium" | "low",
      "reasoning": "<string>"
    }
  ],
  "projected_cac_brl": <number>,
  "vs_current_cac_brl": <number>,
  "improvement_pct": <number>
}`;

export async function run(
  creativeOutput: CreativeGeneratorOutputType,
  lpOutput: LpOptimizerOutputType,
  budgetOutput: BudgetAllocatorOutputType,
  seedData: AllSeedData
): Promise<EvaluationOutputType> {
  const userMessage = `Project the impact of all proposed changes and estimate the new CAC.

CREATIVE GENERATOR OUTPUT (new creative):
${JSON.stringify(creativeOutput, null, 2)}

LP OPTIMIZER OUTPUT (LP changes):
${JSON.stringify(lpOutput, null, 2)}

BUDGET ALLOCATOR OUTPUT (budget changes):
${JSON.stringify(budgetOutput, null, 2)}

CURRENT META ADS PERFORMANCE:
${JSON.stringify(seedData.metaPerformance, null, 2)}

CURRENT POSTHOG LP EVENTS:
${JSON.stringify(seedData.posthogEvents, null, 2)}

CURRENT SUPABASE LEADS:
${JSON.stringify(seedData.supabaseLeads, null, 2)}

Use conservative projections with confidence levels. Calculate projected CAC using the formula: total_weekly_spend / projected_total_leads_7d.`;

  const result = await callAgent({
    agent_name: 'evaluation',
    system: SYSTEM_PROMPT,
    user: userMessage,
    max_tokens: 3000,
  });

  const parsed = JSON.parse(result.content);
  const validated = EvaluationOutput.parse(parsed);

  await appendLog({
    timestamp: new Date().toISOString(),
    agent: 'evaluation',
    input_summary: `Creative: ${creativeOutput.new_creative.proposed_id}, LP: ${lpOutput.proposed_variant.variant_id}, Budget: ${budgetOutput.recommended_allocation.length} allocations`,
    output_summary: `Projected CAC: R$${validated.projected_cac_brl} (current: R$${validated.vs_current_cac_brl}, improvement: ${validated.improvement_pct}%)`,
    raw_output: validated,
    tokens_used: result.usage,
  });

  return validated;
}
