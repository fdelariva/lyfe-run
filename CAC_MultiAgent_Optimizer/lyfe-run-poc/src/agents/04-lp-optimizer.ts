import { callAgent } from '../lib/claude';
import { LpOptimizerOutput, LpOptimizerOutputType, AnalystOutputType } from '../lib/schemas';
import { appendLog } from '../lib/decision-log';

const CONTEXT = `You are operating as part of the Lyfe Run multi-agent CAC optimization system. Lyfe Run is a SaaS coaching management platform targeting the Brazilian running market. The current hypothesis under test is H5: a free run club management platform monetized via brand sponsorships, where community leaders receive a revenue share. Brazil has ~14 million runners in a R$1.1 billion market. 45% of 2025 race participants were first-timers (Ticket Sports data). Target customer: run club leaders managing 50–2000 runners, currently using WhatsApp + spreadsheets. All copy must be in Brazilian Portuguese. All currency is BRL.`;

const SYSTEM_PROMPT = `${CONTEXT}

You are the LP Optimizer agent. Your job is to propose copy changes for the first triggered LP alert, following a priority order.

ALERT PRIORITY ORDER (highest to lowest):
1. monetization (scroll_reach_pct < 0.45)
2. hero (form_start_rate < 0.20)
3. pain_strip
4. faq

CURRENT LP COPY FOR h5-lp-hero-a:
- Hero headline: "Transforme seu grupo de corrida em um negócio"
- Hero subheadline: "A plataforma gratuita que conecta líderes de corrida a marcas patrocinadoras"
- Pain strip: "Seu grupo de corrida merece mais do que um grupo no WhatsApp."
- Monetization headline: "Marcas querem patrocinar sua comunidade"
- Monetization body: "Conectamos assessorias e grupos de corrida com marcas esportivas que pagam para alcançar corredores engajados."
- FAQ section: standard objection-handling

REWRITE RULES:
- If form_start_rate < 0.20 → rewrite hero section with earning_potential framing (lead with revenue question, show concrete numbers)
- If monetization scroll_reach_pct < 0.45 → rewrite pain strip to create narrative pull toward monetization section (use curiosity gap, revenue teaser)
- If bounce_rate > 0.60 → hero is not compelling enough, strengthen value proposition
- If overall_cvr < 0.06 → review entire funnel flow

All new copy must be in Brazilian Portuguese (PT-BR).
The proposed variant_id should append "-v2" to the original variant ID.
Always recommend a 50/50 A/B split.

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "triggered_by": {
    "lp_variant_id": "<string>",
    "section": "<string>",
    "metric": "<string>",
    "current_value": <number>
  },
  "proposed_variant": {
    "variant_id": "<string>",
    "section": "<string being rewritten>",
    "original_copy": "<current copy for that section>",
    "new_copy": {
      "headline_pt": "<string in PT-BR>",
      "subheadline_pt": "<string in PT-BR>",
      "body_pt": "<string in PT-BR>"
    },
    "rationale": "<string explaining the change>",
    "a_b_split": "50/50"
  }
}`;

export async function run(analystOutput: AnalystOutputType): Promise<LpOptimizerOutputType> {
  // Find the first triggered LP alert by priority
  const priorityOrder = ['monetization', 'hero', 'pain_strip', 'faq'];
  const triggeredAlerts = analystOutput.lp_alerts.filter(a => a.triggered);

  let targetAlert = null;
  for (const section of priorityOrder) {
    const found = triggeredAlerts.find(a => a.section === section);
    if (found) {
      targetAlert = found;
      break;
    }
  }

  // Fallback: if no priority match, pick the first triggered alert
  if (!targetAlert && triggeredAlerts.length > 0) {
    targetAlert = triggeredAlerts[0];
  }

  if (!targetAlert) {
    throw new Error('No triggered LP alerts found in analyst output');
  }

  const userMessage = `The following LP alert has been triggered and needs optimization (selected by priority: monetization > hero > pain_strip > faq):

TRIGGERED ALERT:
${JSON.stringify(targetAlert, null, 2)}

ALL LP ALERTS:
${JSON.stringify(analystOutput.lp_alerts, null, 2)}

RECOMMENDED ACTIONS:
${JSON.stringify(analystOutput.recommended_actions, null, 2)}

Propose a copy rewrite for this section following the rewrite rules.`;

  const result = await callAgent({
    agent_name: 'lp-optimizer',
    system: SYSTEM_PROMPT,
    user: userMessage,
    max_tokens: 2000,
  });

  const parsed = JSON.parse(result.content);
  const validated = LpOptimizerOutput.parse(parsed);

  await appendLog({
    timestamp: new Date().toISOString(),
    agent: 'lp-optimizer',
    input_summary: `Triggered alert: ${targetAlert.lp_variant_id} / ${targetAlert.section} (${targetAlert.metric} = ${targetAlert.value})`,
    output_summary: `Proposed variant: ${validated.proposed_variant.variant_id}, section: ${validated.proposed_variant.section}, split: ${validated.proposed_variant.a_b_split}`,
    raw_output: validated,
    tokens_used: result.usage,
  });

  return validated;
}
