import { callAgent } from '../lib/claude';
import { CreativeGeneratorOutput, CreativeGeneratorOutputType, AnalystOutputType } from '../lib/schemas';
import { appendLog } from '../lib/decision-log';

const CONTEXT = `You are operating as part of the Lyfe Run multi-agent CAC optimization system. Lyfe Run is a SaaS coaching management platform targeting the Brazilian running market. The current hypothesis under test is H5: a free run club management platform monetized via brand sponsorships, where community leaders receive a revenue share. Brazil has ~14 million runners in a R$1.1 billion market. 45% of 2025 race participants were first-timers (Ticket Sports data). Target customer: run club leaders managing 50–2000 runners, currently using WhatsApp + spreadsheets. All copy must be in Brazilian Portuguese. All currency is BRL.`;

const SYSTEM_PROMPT = `${CONTEXT}

You are the Creative Generator agent. Your job is to propose a replacement creative for the lowest-scoring H5 loser.

PIVOT RULES BY ANGLE:
- If the loser used "pain" angle → pivot to "earn_money" variation (revenue visualization, dashboard imagery)
- If the loser used "identity" angle → pivot to "social_proof" (community size, real leader testimonials)
- If the loser used "earn_money" angle → pivot to "identity" variation (leadership identity, community builder)

IMAGE PROMPT SPECIFICATIONS:
- Visual style: dark asphalt ground, urban Brazilian running environment
- Typography: Bebas Neue font
- Brand colors: electric yellow-green #E8FF3A or vibrant orange #FF4D00
- Mood: authentic, not staged; cinematic lighting; Brazilian urban running culture
- Midjourney suffix: "--ar 4:5 --style raw --v 6.1"
- Ideogram suffix: "--ar 4:5"

COPY RULES:
- CTA must be phrased as a QUESTION
- All copy in Brazilian Portuguese (PT-BR)
- CTA maximum 12 words
- Headline should address the run club leader directly

The proposed_id should follow the pattern h5-XX where XX is the next number in sequence.

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "triggered_by": "<creative_id of the loser>",
  "new_creative": {
    "proposed_id": "<string>",
    "hypothesis": "H5",
    "angle": "<string>",
    "image_tool": "midjourney" | "ideogram",
    "image_prompt": "<full prompt with suffix>",
    "headline_pt": "<string in PT-BR>",
    "cta_pt": "<question in PT-BR, max 12 words>",
    "rationale": "<string explaining the pivot>"
  }
}`;

export async function run(analystOutput: AnalystOutputType): Promise<CreativeGeneratorOutputType> {
  // Find the loser creative with the lowest score among H5
  const losers = analystOutput.creative_scores
    .filter(c => c.status === 'loser')
    .sort((a, b) => a.score - b.score);

  const targetLoser = losers[0];
  if (!targetLoser) {
    throw new Error('No loser creative found in analyst output');
  }

  const userMessage = `The following creative has been identified as the lowest-scoring loser and needs replacement:

LOSER CREATIVE:
${JSON.stringify(targetLoser, null, 2)}

ALL CREATIVE SCORES (for context):
${JSON.stringify(analystOutput.creative_scores, null, 2)}

RECOMMENDED ACTIONS:
${JSON.stringify(analystOutput.recommended_actions, null, 2)}

Generate a replacement creative following the pivot rules and image prompt specifications.`;

  const result = await callAgent({
    agent_name: 'creative-generator',
    system: SYSTEM_PROMPT,
    user: userMessage,
    max_tokens: 2000,
  });

  const parsed = JSON.parse(result.content);
  const validated = CreativeGeneratorOutput.parse(parsed);

  await appendLog({
    timestamp: new Date().toISOString(),
    agent: 'creative-generator',
    input_summary: `Loser creative: ${targetLoser.creative_id} (score ${targetLoser.score})`,
    output_summary: `New creative: ${validated.new_creative.proposed_id} (angle: ${validated.new_creative.angle}, tool: ${validated.new_creative.image_tool})`,
    raw_output: validated,
    tokens_used: result.usage,
  });

  return validated;
}
