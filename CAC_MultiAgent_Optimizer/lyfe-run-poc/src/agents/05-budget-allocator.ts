import { callAgent } from '../lib/claude';
import { BudgetAllocatorOutput, BudgetAllocatorOutputType, AnalystOutputType } from '../lib/schemas';
import { appendLog } from '../lib/decision-log';
import { AllSeedData } from '../lib/seed-loader';

const CONTEXT = `You are operating as part of the Lyfe Run multi-agent CAC optimization system. Lyfe Run is a SaaS coaching management platform targeting the Brazilian running market. The current hypothesis under test is H5: a free run club management platform monetized via brand sponsorships, where community leaders receive a revenue share. Brazil has ~14 million runners in a R$1.1 billion market. 45% of 2025 race participants were first-timers (Ticket Sports data). Target customer: run club leaders managing 50–2000 runners, currently using WhatsApp + spreadsheets. All copy must be in Brazilian Portuguese. All currency is BRL.`;

const SYSTEM_PROMPT = `${CONTEXT}

You are the Budget Allocator agent. Your job is to reallocate daily ad spend across creatives based on performance scores.

BUDGET RULES:
1. Total daily budget MUST remain unchanged (sum of all current daily_spend_brl values).
2. Minimum spend for any active (non-paused) creative: 80 BRL/day.
3. Maximum spend on any single creative: 60% of total daily budget.
4. PAUSE rule: If a creative has CTR < 0.010 AND CPC > 1.50 BRL, it MUST be paused (daily_spend_brl = 0).
5. INCREASE rule: If a creative has score >= 75 AND CTR > 0.018, increase its budget proportionally.
6. Reallocate budget from paused creatives to active ones proportionally by score.

CAC ESTIMATE FORMULA:
For each creative: cac_brl = (daily_spend_brl * 7) / estimated_leads_7d
Where estimated_leads_7d = (daily_spend_brl / cpc_brl) * overall_cvr_of_linked_lp
If no leads data available, use: cac_brl = daily_spend_brl / (clicks_per_day * average_lp_cvr)

MANUAL STEPS:
Each manual_step must be a specific Meta Ads Manager instruction, e.g.:
"In Meta Ads Manager → Campaigns → [campaign] → Ad Set [name]: [action]"

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "current_allocation": [
    { "creative_id": "<string>", "daily_spend_brl": <number>, "cac_brl": <number> }
  ],
  "recommended_allocation": [
    {
      "creative_id": "<string>",
      "action": "increase" | "maintain" | "decrease" | "pause",
      "recommended_daily_spend_brl": <number>,
      "reason": "<string>"
    }
  ],
  "total_budget_unchanged": true,
  "manual_steps": ["<specific Meta Ads Manager instruction>"]
}`;

export async function run(
  analystOutput: AnalystOutputType,
  seedData: AllSeedData
): Promise<BudgetAllocatorOutputType> {
  const userMessage = `Reallocate budget based on the performance analysis and raw data.

PERFORMANCE ANALYST SCORES:
${JSON.stringify(analystOutput.creative_scores, null, 2)}

META ADS PERFORMANCE (current spend and metrics):
${JSON.stringify(seedData.metaPerformance, null, 2)}

POSTHOG LP EVENTS (for CVR data):
${JSON.stringify(seedData.posthogEvents, null, 2)}

RECOMMENDED ACTIONS FROM ANALYST:
${JSON.stringify(analystOutput.recommended_actions, null, 2)}

Apply the budget rules and generate specific Meta Ads Manager instructions.`;

  const result = await callAgent({
    agent_name: 'budget-allocator',
    system: SYSTEM_PROMPT,
    user: userMessage,
    max_tokens: 2500,
  });

  const parsed = JSON.parse(result.content);
  const validated = BudgetAllocatorOutput.parse(parsed);

  const totalCurrent = validated.current_allocation.reduce((sum, a) => sum + a.daily_spend_brl, 0);
  const totalRecommended = validated.recommended_allocation.reduce((sum, a) => sum + a.recommended_daily_spend_brl, 0);

  await appendLog({
    timestamp: new Date().toISOString(),
    agent: 'budget-allocator',
    input_summary: `${analystOutput.creative_scores.length} scored creatives, ${seedData.metaPerformance.length} meta entries`,
    output_summary: `Budget: R$${totalCurrent}/day → R$${totalRecommended}/day, ${validated.recommended_allocation.filter(a => a.action === 'pause').length} paused, ${validated.manual_steps.length} manual steps`,
    raw_output: validated,
    tokens_used: result.usage,
  });

  return validated;
}
