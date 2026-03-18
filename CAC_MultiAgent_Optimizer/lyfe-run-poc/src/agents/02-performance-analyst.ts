import { callAgent } from '../lib/claude';
import { AnalystOutput, AnalystOutputType, DataCollectorOutputType } from '../lib/schemas';
import { appendLog } from '../lib/decision-log';
import { AllSeedData } from '../lib/seed-loader';

const CONTEXT = `You are operating as part of the Lyfe Run multi-agent CAC optimization system. Lyfe Run is a SaaS coaching management platform targeting the Brazilian running market. The current hypothesis under test is H5: a free run club management platform monetized via brand sponsorships, where community leaders receive a revenue share. Brazil has ~14 million runners in a R$1.1 billion market. 45% of 2025 race participants were first-timers (Ticket Sports data). Target customer: run club leaders managing 50–2000 runners, currently using WhatsApp + spreadsheets. All copy must be in Brazilian Portuguese. All currency is BRL.`;

const SYSTEM_PROMPT = `${CONTEXT}

You are the Performance Analyst agent. Your job is to score each creative and flag underperforming LP sections.

CREATIVE THRESHOLD RULES (a creative is a "loser" if ANY of these are true):
- CTR < 0.013 → loser
- thumb_stop_rate < 0.15 → loser
- CPC > 1.30 BRL → loser

LP THRESHOLD RULES (an alert is triggered if ANY of these are true):
- bounce_rate > 0.60
- form_start_rate < 0.20
- monetization scroll_reach_pct < 0.45
- overall_cvr < 0.06

CREATIVE SCORING (0–100):
- CTR weight: 40%
- thumb_stop_rate weight: 35%
- CPC inverse weight: 25%
For CTR: normalize to 0–100 where 0.030 = 100. Score = min(100, (ctr / 0.030) * 100) * 0.40
For thumb_stop: normalize to 0–100 where 0.40 = 100. Score = min(100, (thumb_stop / 0.40) * 100) * 0.35
For CPC inverse: normalize to 0–100 where 0.30 BRL = 100. Score = min(100, (0.30 / cpc) * 100) * 0.25

Status assignment:
- score >= 70 → "winner"
- score >= 40 → "neutral"
- score < 40 → "loser"

For each LP variant, check ALL threshold rules and create an alert entry for each triggered rule.

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "scoring_summary": "<brief narrative of findings>",
  "creative_scores": [
    {
      "creative_id": "<string>",
      "score": <number 0-100>,
      "status": "winner" | "neutral" | "loser",
      "reason": "<string>"
    }
  ],
  "lp_alerts": [
    {
      "lp_variant_id": "<string>",
      "section": "<string>",
      "metric": "<string>",
      "value": <number>,
      "threshold": <number>,
      "triggered": true,
      "action_required": "<string>"
    }
  ],
  "recommended_actions": ["<string>"]
}`;

export async function run(
  collectorOutput: DataCollectorOutputType,
  seedData: AllSeedData
): Promise<AnalystOutputType> {
  const userMessage = `Analyze this campaign data and score each creative. Flag any underperforming LP sections.

DATA COLLECTOR OUTPUT:
${JSON.stringify(collectorOutput, null, 2)}

META ADS PERFORMANCE (full data):
${JSON.stringify(seedData.metaPerformance, null, 2)}

POSTHOG LP EVENTS (full data):
${JSON.stringify(seedData.posthogEvents, null, 2)}`;

  const result = await callAgent({
    agent_name: 'performance-analyst',
    system: SYSTEM_PROMPT,
    user: userMessage,
    max_tokens: 3000,
  });

  const parsed = JSON.parse(result.content);
  const validated = AnalystOutput.parse(parsed);

  await appendLog({
    timestamp: new Date().toISOString(),
    agent: 'performance-analyst',
    input_summary: `DataCollectorOutput + ${seedData.metaPerformance.length} creatives + ${seedData.posthogEvents.length} LP variants`,
    output_summary: `${validated.creative_scores.length} creatives scored, ${validated.lp_alerts.filter(a => a.triggered).length} LP alerts triggered, ${validated.recommended_actions.length} actions`,
    raw_output: validated,
    tokens_used: result.usage,
  });

  return validated;
}
