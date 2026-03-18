# Lyfe Run — Multi-Agent CAC Optimizer POC
## Claude Code Execution Plan

> **Scope:** Phases 1 + 2 merged. Simulated data inputs + synthetic evaluation agent.
> No real API integrations. No n8n. Manual trigger loop. H5 (Run Club Community OS) as the primary test case.
> Single hypothesis run, full optimization cycle, decision log as first-class output.

---

## 0. Project Orientation

Before writing any code, read this section in full.

### What you are building

A local Node.js CLI + lightweight web dashboard that simulates one complete optimization cycle of the multi-agent CAC system. The system:

1. Reads **simulated campaign performance data** (seeded JSON files standing in for Meta API, PostHog, Supabase)
2. Runs **five agents** in sequence — each is a structured Claude API call with a defined input schema and output schema
3. Produces **concrete recommendations** (which creative to pause, which LP section to rewrite, where to shift budget)
4. Generates **synthetic campaign results** for those recommendations using a sixth evaluation agent grounded in real Brazilian running market data
5. Writes every agent decision and reasoning to a **decision log** (markdown + JSON)
6. Renders a **dashboard** showing the before/after state of each creative and LP variant

### What you are NOT building

- No real Meta API calls
- No real PostHog/Vercel Analytics calls
- No real Supabase writes
- No n8n workflow
- No deployment pipeline
- No authentication

### Primary test case

All agent runs default to **H5 (Run Club Community OS)**. The system should support H1–H4 via the same data schema but the seeded data and prompts are calibrated for H5.

### Experimental constraint

The simulated input data (`/data/seed/*.json`) must be written **before** any agent is run, and must not be modified after the run starts. This prevents confirmation bias in synthetic evaluation.

---

## 1. Project Initialization

```
Initialize a new Node.js TypeScript project with the following structure:

Project name: lyfe-run-poc
Package manager: npm
TypeScript: strict mode
Node version: 18+

Install dependencies:
- @anthropic-ai/sdk          (agent intelligence)
- next@14                    (dashboard UI)
- react react-dom            (dashboard UI)
- tailwindcss                (dashboard styling)
- @types/node typescript     (dev)
- ts-node                    (dev, for running agents)
- zod                        (runtime schema validation on agent outputs)
- chalk                      (CLI output formatting)
- fs-extra                   (file operations)
- date-fns                   (date formatting in decision log)

Create tsconfig.json with:
- target: ES2022
- moduleResolution: bundler
- strict: true
- paths alias: "@/*" → "./src/*"
```

---

## 2. Directory Structure

```
Create the following directory and file structure. Create all files as empty
stubs — content will be filled in subsequent steps.

lyfe-run-poc/
├── CLAUDE.md                         ← this file (read-only reference)
├── .env.local                        ← ANTHROPIC_API_KEY only
├── .env.example
│
├── data/
│   ├── seed/
│   │   ├── meta-performance.json     ← simulated Meta Ads data (H5 creatives)
│   │   ├── posthog-events.json       ← simulated PostHog session + section events
│   │   └── supabase-leads.json       ← simulated waitlist leads with UTM data
│   ├── state/
│   │   └── campaign-state.json       ← mutable: current variant assignments
│   └── output/
│       ├── decision-log.md           ← human-readable agent decisions
│       ├── decision-log.json         ← machine-readable for dashboard
│       └── synthetic-results.json   ← evaluation agent output
│
├── src/
│   ├── lib/
│   │   ├── claude.ts                 ← Anthropic SDK wrapper + retry logic
│   │   ├── schemas.ts                ← Zod schemas for all agent I/O
│   │   ├── seed-loader.ts            ← loads and validates seed data
│   │   └── decision-log.ts           ← appends to decision log files
│   │
│   ├── agents/
│   │   ├── 01-data-collector.ts      ← normalizes seed data into unified events
│   │   ├── 02-performance-analyst.ts ← scores variants, identifies drop-offs
│   │   ├── 03-creative-generator.ts  ← rewrites ad copy + image prompts
│   │   ├── 04-lp-optimizer.ts        ← rewrites LP sections
│   │   ├── 05-budget-allocator.ts    ← recommends spend redistribution
│   │   └── 06-evaluation.ts          ← synthetic campaign result generator
│   │
│   ├── runner/
│   │   ├── run-cycle.ts              ← orchestrates full agent sequence
│   │   └── run-evaluation.ts         ← runs only the evaluation agent
│   │
│   └── app/                          ← Next.js dashboard
│       ├── layout.tsx
│       ├── page.tsx                  ← overview: all agents, current state
│       ├── api/
│       │   ├── state/route.ts        ← GET current campaign state
│       │   └── log/route.ts          ← GET decision log JSON
│       └── components/
│           ├── CreativeCard.tsx
│           ├── FunnelChart.tsx
│           ├── DecisionLog.tsx
│           └── BudgetTable.tsx

Add scripts to package.json:
  "seed":       "ts-node src/runner/run-cycle.ts"
  "evaluate":   "ts-node src/runner/run-evaluation.ts"
  "dashboard":  "next dev"
  "typecheck":  "tsc --noEmit"
```

---

## 3. Seed Data Files

### 3.1 — Meta Ads performance data

```
Create data/seed/meta-performance.json

This file represents simulated Meta Ads API output for one 7-day window.
H5 hypothesis. Three creatives per campaign (matching the 15 image scripts).
Hard-bind each creative to a landing page variant via lp_variant_id.

Schema per creative:
{
  creative_id: string,           // e.g. "h5-01", "h5-02", "h5-03"
  hypothesis: "H5",
  lp_variant_id: string,         // e.g. "h5-lp-hero-a", "h5-lp-hero-b"
  campaign_id: string,
  ad_name: string,               // human-readable: "H5-01 · The 6am leader"
  angle: "identity" | "pain" | "earn_money",
  image_tool: "midjourney" | "ideogram",
  daily_spend_brl: number,       // total spend for the 7d window in BRL
  impressions: number,
  clicks: number,
  ctr: number,                   // clicks / impressions (derive, don't invent)
  cpc_brl: number,               // spend / clicks
  thumb_stop_rate: number,       // 3s views / impressions (0.0–1.0)
  cpm_brl: number                // cost per 1000 impressions
}

Seed values for H5 (designed so the "pain" angle underperforms and
the "earn_money" angle outperforms — the agents should detect this):

H5-01 (identity · "A líder das 6h"):
  spend: 280, impressions: 18400, clicks: 294, ctr: 0.016,
  cpc: 0.95, thumb_stop: 0.21, cpm: 15.2, lp_variant: "h5-lp-hero-a"

H5-02 (pain · "WhatsApp chaos"):
  spend: 280, impressions: 17900, clicks: 197, ctr: 0.011,
  cpc: 1.42, thumb_stop: 0.14, cpm: 15.6, lp_variant: "h5-lp-hero-a"

H5-03 (earn_money · "Brand + community"):
  spend: 280, impressions: 19200, clicks: 422, ctr: 0.022,
  cpc: 0.66, thumb_stop: 0.29, cpm: 14.6, lp_variant: "h5-lp-hero-b"

Also include 3 creatives each for H1, H2, H3, H4 with mid-range values
(CTR ~0.014, CPC ~1.10, thumb_stop ~0.18) as filler — agents will focus
on H5 but schema must be consistent.
```

### 3.2 — PostHog session events

```
Create data/seed/posthog-events.json

Represents 7 days of PostHog analytics for two LP variants:
  h5-lp-hero-a  →  lyferunclub.vercel.app  (current hero: operational relief)
  h5-lp-hero-b  →  lyferunclub.vercel.app  (variant hero: earning potential)

Schema per variant:
{
  lp_variant_id: string,
  hypothesis: "H5",
  hero_framing: "operational_relief" | "earning_potential",
  sessions: number,
  avg_time_on_page_sec: number,
  bounce_rate: number,              // 0.0–1.0
  sections: {
    hero: {
      viewed_pct: number,           // always 1.0 (everyone sees hero)
      form_start_rate: number,      // users who clicked a form field / sessions
    },
    pain_strip: {
      scroll_reach_pct: number,     // % of sessions that scrolled past
    },
    features: {
      scroll_reach_pct: number,
    },
    monetization: {
      scroll_reach_pct: number,     // KEY METRIC — earning section reach
    },
    faq: {
      scroll_reach_pct: number,
    }
  },
  form_start_to_submit_rate: number, // submit / form_start
  overall_cvr: number                // leads / sessions
}

Seed values:

h5-lp-hero-a (operational relief):
  sessions: 198, avg_time: 74, bounce: 0.61
  hero.form_start_rate: 0.18
  pain_strip: 0.71, features: 0.58, monetization: 0.39, faq: 0.22
  form_start_to_submit: 0.52, overall_cvr: 0.047

h5-lp-hero-b (earning potential):
  sessions: 224, avg_time: 98, bounce: 0.44
  hero.form_start_rate: 0.27
  pain_strip: 0.79, features: 0.68, monetization: 0.61, faq: 0.34
  form_start_to_submit: 0.63, overall_cvr: 0.083
```

### 3.3 — Supabase leads

```
Create data/seed/supabase-leads.json

Array of lead objects. Total: 29 leads across both LP variants.
Each lead has UTM params linking back to creative_id.

Schema per lead:
{
  id: string,
  created_at: string,             // ISO timestamp within 7d window
  name: string,                   // Brazilian first names only
  city: string,                   // SP, RJ, BH, Curitiba, Porto Alegre
  group_size: "lt30" | "30-100" | "100-300" | "gt300",
  lp_variant_id: string,
  utm: {
    source: "instagram",
    medium: "paid",
    campaign: "h5-poc",
    content: string               // maps to creative_id
  }
}

Distribution:
  h5-lp-hero-a: 9 leads  (from 198 sessions = 4.7% CVR)
  h5-lp-hero-b: 20 leads (from 224 sessions = 8.3% CVR — matches posthog)

Group size distribution (across all 29):
  lt30: 5 leads, 30-100: 11 leads, 100-300: 9 leads, gt300: 4 leads

Note: do NOT make all leads from São Paulo — distribution should be
realistic: SP 40%, RJ 25%, BH 15%, Curitiba 10%, Porto Alegre 10%.
```

---

## 4. Core Libraries

### 4.1 — Claude SDK wrapper

```
Create src/lib/claude.ts

Export a single async function: callAgent(params)

Interface:
  params: {
    agent_name: string,          // for logging
    system: string,              // system prompt
    user: string,                // user message (JSON stringified context)
    max_tokens?: number          // default 2000
  }
  returns: { content: string, usage: { input: number, output: number } }

Implementation:
- Use @anthropic-ai/sdk, model "claude-sonnet-4-5"
- Wrap in try/catch — on error, log agent_name + error, rethrow
- Log to console: chalk.blue("[agent_name]") + chalk.gray("→ thinking...")
  before the call, chalk.green("✓") + token count after
- Do not stream — use standard messages.create
```

### 4.2 — Zod schemas

```
Create src/lib/schemas.ts

Define and export Zod schemas for every agent's OUTPUT. This is critical —
every agent must validate its Claude output before passing it downstream.

Schemas to define:

DataCollectorOutput: {
  normalized_at: string,
  window_days: number,
  top_performing_creative: { creative_id, ctr, cpc_brl, hypothesis },
  bottom_performing_creative: { creative_id, ctr, cpc_brl, hypothesis },
  lp_variants: Array<{
    lp_variant_id: string,
    overall_cvr: number,
    weakest_section: string,        // section with lowest scroll_reach_pct
    weakest_section_metric: number
  }>
}

AnalystOutput: {
  scoring_summary: string,          // 2–3 sentence natural language summary
  creative_scores: Array<{
    creative_id: string,
    score: number,                  // 0–100
    status: "winner" | "neutral" | "loser",
    reason: string
  }>,
  lp_alerts: Array<{
    lp_variant_id: string,
    section: string,
    metric: string,
    value: number,
    threshold: number,
    triggered: boolean,
    action_required: string
  }>,
  recommended_actions: string[]     // ordered list of next actions
}

CreativeGeneratorOutput: {
  triggered_by: string,             // creative_id that underperformed
  new_creative: {
    proposed_id: string,
    hypothesis: string,
    angle: string,
    image_tool: "midjourney" | "ideogram",
    image_prompt: string,
    headline_pt: string,
    cta_pt: string,
    rationale: string               // why this angle was chosen
  }
}

LpOptimizerOutput: {
  triggered_by: {
    lp_variant_id: string,
    section: string,
    metric: string,
    current_value: number
  },
  proposed_variant: {
    variant_id: string,
    section: string,
    original_copy: string,
    new_copy: {
      headline_pt: string,
      subheadline_pt: string,
      body_pt: string
    },
    rationale: string,
    a_b_split: "50/50"
  }
}

BudgetAllocatorOutput: {
  current_allocation: Array<{ creative_id, daily_spend_brl, cac_brl }>,
  recommended_allocation: Array<{
    creative_id: string,
    action: "increase" | "maintain" | "pause",
    recommended_daily_spend_brl: number,
    reason: string
  }>,
  total_budget_unchanged: boolean,  // must sum to same total
  manual_steps: string[]            // ordered instructions for human to execute in Meta
}

EvaluationOutput: {
  simulation_notes: string,         // key assumptions made
  projected_results: Array<{
    creative_id: string,
    projected_ctr: number,
    projected_cpc_brl: number,
    projected_thumb_stop: number,
    confidence: "low" | "medium" | "high",
    reasoning: string
  }>,
  projected_lp_results: Array<{
    variant_id: string,
    projected_cvr: number,
    projected_form_start_rate: number,
    projected_monetization_reach_pct: number,
    confidence: "low" | "medium" | "high",
    reasoning: string
  }>,
  projected_cac_brl: number,
  vs_current_cac_brl: number,
  improvement_pct: number
}
```

### 4.3 — Decision log

```
Create src/lib/decision-log.ts

Export two functions:

appendLog(entry: LogEntry): void
  - LogEntry: { timestamp, agent, input_summary, output_summary, raw_output, tokens_used }
  - Appends to data/output/decision-log.json (array of entries)
  - Appends formatted markdown block to data/output/decision-log.md

initLog(): void
  - Clears and reinitializes both log files
  - Writes header to .md: "# Lyfe Run POC — Decision Log\n[timestamp]"
```

---

## 5. Agent Implementations

> **Ground rule for all agent system prompts:** Every prompt must include
> the following context paragraph verbatim, before any specific instructions:
>
> "You are operating as part of the Lyfe Run multi-agent CAC optimization
> system. Lyfe Run is a SaaS coaching management platform targeting the
> Brazilian running market. The current hypothesis under test is H5:
> a free run club management platform monetized via brand sponsorships,
> where community leaders receive a revenue share. Brazil has ~14 million
> runners in a R$1.1 billion market. 45% of 2025 race participants were
> first-timers (Ticket Sports data). Target customer: run club leaders
> managing 50–2000 runners, currently using WhatsApp + spreadsheets.
> All copy must be in Brazilian Portuguese. All currency is BRL."

### 5.1 — Agent 01: Data Collector

```
Create src/agents/01-data-collector.ts

Purpose: Load all three seed files, normalize into a unified summary,
identify top/bottom performers, flag LP section weaknesses.

Input: reads directly from data/seed/*.json via seed-loader.ts
Output: DataCollectorOutput (validate with Zod before returning)

System prompt instructions:
- You are the Data Collector agent.
- Your job is to normalize raw campaign performance data into a clean summary.
- Compute derived metrics: CTR = clicks/impressions, CPC = spend/clicks.
- Identify the single best and worst performing creative for H5 by CTR.
- For each LP variant, find the section with the lowest scroll_reach_pct
  (excluding the hero which is always 1.0).
- Output ONLY valid JSON matching the DataCollectorOutput schema.
- Do not include markdown code fences or explanation text.

User message: JSON stringified object containing all three seed files.

After receiving output:
- Validate with DataCollectorOutput Zod schema
- Write to data/state/campaign-state.json
- Append to decision log
- Print summary to console
```

### 5.2 — Agent 02: Performance Analyst

```
Create src/agents/02-performance-analyst.ts

Purpose: Score every creative and LP variant. Apply threshold rules.
Generate ordered list of recommended actions.

Input: DataCollectorOutput from Agent 01

Threshold rules to encode in system prompt:
  Creative thresholds (trigger = "loser"):
    CTR < 0.013            → creative underperforming
    thumb_stop_rate < 0.15 → image failing to stop scroll
    CPC > 1.30 BRL         → too expensive per click

  LP thresholds (trigger alert):
    bounce_rate > 0.60             → hero section needs rewrite
    hero.form_start_rate < 0.20    → hero CTA underperforming
    monetization.scroll_reach < 0.45 → earning section not reached
    overall_cvr < 0.06             → below target (8% target for validation)

System prompt must also say:
- Score each creative 0–100 using: CTR (40%), thumb_stop (35%), CPC inverse (25%)
- For LP alerts, always specify the exact metric value, threshold, and
  a one-sentence hypothesis for WHY it is underperforming
- recommended_actions must be ordered by expected impact on CAC
- Output ONLY valid JSON. No markdown. No explanation.

After receiving output:
- Validate with AnalystOutput Zod schema
- Update data/state/campaign-state.json
- Append to decision log with scoring summary as human-readable prefix
```

### 5.3 — Agent 03: Creative Generator

```
Create src/agents/03-creative-generator.ts

Purpose: Take the lowest-scoring creative from Analyst output.
Generate a replacement creative with a new angle and image prompt.

Input: AnalystOutput — specifically the creative with status "loser"
       and lowest score among H5 creatives.

System prompt must include:
- The three original H5 creative angles and their performance:
  identity (H5-01), pain (H5-02), earn_money (H5-03)
- Instruction: if the failing creative uses "pain" angle, pivot to
  a new variation of "earn_money" with a different visual execution.
  If "identity" is failing, test "social proof" (show club size / follower count).
  Never generate the same angle twice in a cycle.
- Image prompts must follow the Lyfe Run brief:
  dark asphalt background, Bebas Neue typography when text appears in image,
  electric yellow-green (#E8FF3A) or fire orange (#FF4D00) as accent,
  Brazilian urban running aesthetic, authentic not staged.
- For Midjourney: always end with "--ar 4:5 --style raw --v 6.1"
- For Ideogram: always end with "--ar 4:5"
- CTA must be a question, Brazilian Portuguese, max 12 words.
- Output ONLY valid JSON. No markdown. No explanation.

After receiving output:
- Validate with CreativeGeneratorOutput Zod schema
- Append proposed creative to data/state/campaign-state.json
  under "proposed_creatives" array
- Append to decision log with rationale as human-readable prefix
```

### 5.4 — Agent 04: LP Optimizer

```
Create src/agents/04-lp-optimizer.ts

Purpose: Take the highest-priority LP alert from Analyst output.
Generate a rewritten section variant in Brazilian Portuguese.

Input: AnalystOutput — specifically the first lp_alert where triggered === true,
       ordered by expected impact (monetization > hero > pain_strip > faq).

Context to inject into system prompt about the current LP sections:

Current h5-lp-hero-a copy (operational relief framing):
  headline: "Seu grupo de corrida merece mais do que um grupo no WhatsApp."
  subheadline: "Gerencie suas saídas, engaje seus corredores e ainda ganhe
    dinheiro com as marcas que já patrocinam o esporte."

Current monetization section:
  headline: "Você construiu a comunidade. Agora ela trabalha por você."
  body: "Marcas de calçados, nutrição, seguros e eventos pagam para se
    conectar com grupos de corrida ativos."

System prompt must say:
- If hero.form_start_rate < 0.20: rewrite the hero section.
  Test earning_potential framing: lead with "Quanto você ganha liderando
  seu grupo?" rather than operational relief.
- If monetization.scroll_reach < 0.45: rewrite the pain strip above
  monetization to create stronger narrative pull toward the earning section.
- Copy must be direct, peer-to-peer, no corporate language.
  Use "grupo" not "clube". Pain statements must be visceral.
- proposed_variant.variant_id should follow pattern: {lp_variant_id}-v2
- Output ONLY valid JSON. No markdown. No explanation.

After receiving output:
- Validate with LpOptimizerOutput Zod schema
- Append to data/state/campaign-state.json under "proposed_lp_variants"
- Append to decision log with before/after copy diff as human-readable prefix
```

### 5.5 — Agent 05: Budget Allocator

```
Create src/agents/05-budget-allocator.ts

Purpose: Redistribute ad spend across H5 creatives to minimize CPC/CAC.
Output human-executable manual steps for Meta Ads Manager.

Input: AnalystOutput (creative scores) + meta-performance.json (current spend)

Allocation rules to encode in system prompt:
- Total budget must not change (sum of recommended = sum of current)
- Minimum spend per active creative: 80 BRL/day
- Maximum spend on single creative: 60% of total budget
- Pause any creative where: CTR < 0.010 AND CPC > 1.50 for the full window
- Increase spend proportionally on creatives with score ≥ 75 AND CTR > 0.018
- CAC estimate = (daily_spend * 7) / (sessions_from_creative * cvr_of_bound_lp)
  (use posthog-events.json CVR for the bound LP variant)
- manual_steps must be specific enough to execute without context:
  e.g. "In Meta Ads Manager → Campaigns → H5-POC → Ad Set H5-01:
  increase daily budget from R$40 to R$68"
- Output ONLY valid JSON. No markdown. No explanation.

After receiving output:
- Validate with BudgetAllocatorOutput Zod schema
- Append to data/state/campaign-state.json under "budget_recommendation"
- Append to decision log
- Print manual steps to console formatted as a numbered checklist
```

### 5.6 — Agent 06: Evaluation (Synthetic)

```
Create src/agents/06-evaluation.ts

Purpose: Given the proposed new creatives and LP variants from Agents 03 and 04,
project what campaign performance would look like after implementing the
recommendations. Ground projections in real Brazilian market benchmarks.

Input: 
  - CreativeGeneratorOutput (new creative specs)
  - LpOptimizerOutput (new LP section copy)
  - BudgetAllocatorOutput (new spend distribution)
  - current seed data (for baseline comparison)

Real-world anchors to inject into system prompt:
  Brazilian Instagram running audience benchmarks (encode these directly):
  - Average CTR for fitness/sports ads in Brazil: 1.2–1.8%
  - "Earn money" framing in creator/community apps: CTR uplift 30–50% vs pain
  - WhatsApp fatigue messaging: performs well with 30–40yo Brazilian audience
  - Early morning running culture content (6am aesthetic): thumb-stop ~22–28%
  - Landing page CVR benchmarks for fitness SaaS waitlists in Brazil: 6–10%
  - Pain-first hero vs benefit-first hero: benefit-first converts 15–25% better
    for audiences with existing problem awareness (run club leaders qualify)
  - "Quanto você ganha" framing (earning potential lead): 
    historically high engagement in Brazilian creator economy content

  Market context:
  - 14M runners in Brazil, R$1.1B market
  - 45% of 2025 race participants were first-timers (Ticket Sports)
  - No existing platform combines free club mgmt + sponsorship revenue share
  - Target leaders: 50–2000 runners, currently WhatsApp + spreadsheets

System prompt must say:
- Generate projected performance for the NEW creative based on its angle,
  visual execution, and the benchmark data above.
- Generate projected CVR for the NEW LP variant based on its framing change.
- Be honest about confidence levels. "low" if projecting from a single change,
  "medium" if the change is well-supported by multiple benchmarks,
  "high" only if the benchmark data strongly predicts the outcome.
- Do NOT project improvements larger than the benchmarks support.
- projected_cac_brl = (total_spend_brl) / (projected_total_leads)
- vs_current_cac_brl: compute from seed data (total spend / total leads)
- Output ONLY valid JSON. No markdown. No explanation.

After receiving output:
- Validate with EvaluationOutput Zod schema
- Write to data/output/synthetic-results.json
- Append to decision log with before/after CAC comparison
- Print final projected CAC improvement to console
```

---

## 6. Runner: Full Cycle

```
Create src/runner/run-cycle.ts

This is the main entry point. Execute agents 01–05 in sequence.

Steps:
1. Call initLog() to reset decision log
2. Print banner: chalk.bold("🏃 Lyfe Run POC — Optimization Cycle\n")
3. Load seed data and print seed summary (total spend, total sessions, total leads)
4. Run Agent 01 → print "✓ Data collected"
5. Run Agent 02 → print analyst scoring table (creative_id | score | status)
6. Check if any creative has status "loser" — if none, print warning and continue
7. Run Agent 03 → print proposed creative headline and CTA
8. Run Agent 04 → print triggered section + new headline
9. Run Agent 05 → print budget reallocation table + manual steps
10. Print: chalk.bold("\n✓ Optimization cycle complete. Run 'npm run evaluate' for synthetic projections.\n")
11. Print current CAC: total_spend / total_leads (from seed data)

Create src/runner/run-evaluation.ts

1. Check data/state/campaign-state.json exists — error if not
2. Load proposed_creatives and proposed_lp_variants from state
3. Run Agent 06
4. Print projected CAC improvement table
5. Print: "Review data/output/decision-log.md for full reasoning."
```

---

## 7. Dashboard (Next.js)

```
Build the dashboard in src/app/. This is a read-only view of the decision log
and current campaign state. No interactive editing.

Design brief:
  Dark background (#0A0A0A), electric yellow-green accent (#E8FF3A),
  fire orange for alerts (#FF4D00). Bebas Neue for large numbers/headings,
  DM Sans for body. Same design system as the Lyfe Run landing pages.
  Monochromatic, high contrast, data-first — no decorative elements.

PAGE: src/app/page.tsx — Dashboard overview

Section 1 — Campaign Header
  "H5 · Run Club Community OS — POC Optimization Cycle"
  Subtext: window dates, total spend BRL, total leads, current CAC BRL

Section 2 — Creative Scorecard (3 cards for H5-01, H5-02, H5-03)
  Each card shows: creative name, angle tag, CTR, CPC, thumb-stop rate,
  score badge (0–100), status chip (winner/neutral/loser in appropriate colors).
  Proposed new creative card (from Agent 03) rendered with dashed border
  and "Proposed" badge.

Section 3 — Funnel Table (2 columns: LP-hero-a vs LP-hero-b)
  Rows: sessions | bounce | form_start | monetization_reach | CVR
  Highlight cells where value breached threshold in red/orange.
  Proposed LP variant section shown below as a "diff" — original vs new copy
  with the changed field highlighted.

Section 4 — Budget Recommendation Table
  Columns: creative | current spend | action | recommended spend | reason
  Action column: green chip for "increase", gray for "maintain", red for "pause"
  Manual steps list below the table.

Section 5 — Synthetic Projection (only visible after evaluate script runs)
  Before/After CAC comparison: current CAC vs projected CAC
  Confidence level badge. 2-3 sentence simulation notes.

Section 6 — Decision Log
  Scrollable list of all agent decisions. Each entry shows:
  timestamp, agent name, input summary, output summary (truncated to 150 chars).
  Clicking an entry expands to show full raw output.

API routes:
  GET /api/state → returns data/state/campaign-state.json
  GET /api/log   → returns data/output/decision-log.json
  Use Next.js route handlers that read files from disk (no DB).
  Add 0s cache headers so dashboard always reflects latest run.
```

---

## 8. Environment Configuration

```
Create .env.example:

# Required
ANTHROPIC_API_KEY=sk-ant-...

# Optional: set to "true" to skip Claude API calls and use mock responses
# Useful for testing dashboard without consuming API credits
MOCK_AGENTS=false

Create .env.local with the actual ANTHROPIC_API_KEY.

In src/lib/claude.ts, check process.env.MOCK_AGENTS === "true".
If true, return a mock response object with hardcoded valid JSON
matching the expected schema for each agent (one mock per agent_name).
This allows testing the full pipeline and dashboard without API calls.
```

---

## 9. Validation & Testing

```
After building all files, run the following validation sequence.
Fix any errors before proceeding to the next step.

Step 1: Type check
  npm run typecheck
  Expected: 0 errors

Step 2: Mock run (no API calls)
  MOCK_AGENTS=true npm run seed
  Expected: all 5 agents complete, decision-log.md written,
  campaign-state.json populated

Step 3: Mock evaluate
  MOCK_AGENTS=true npm run evaluate
  Expected: synthetic-results.json written, CAC comparison printed

Step 4: Dashboard smoke test
  npm run dashboard
  Open localhost:3000 — verify all 6 sections render without errors.
  Verify API routes return JSON.

Step 5: Live run (uses API credits — only run once validated)
  npm run seed
  npm run evaluate
  Verify decision-log.md is coherent and agent reasoning is sound.
```

---

## 10. Execution Sequence Summary

When Claude Code executes this plan, follow this order:

1. Project init + install dependencies
2. Create all directory stubs
3. Write seed data files (3.1, 3.2, 3.3) — **seal these before writing any agent code**
4. Write core libraries (4.1, 4.2, 4.3)
5. Write agents in order: 01 → 02 → 03 → 04 → 05 → 06
6. Write runners (6)
7. Write dashboard (7)
8. Write env config (8)
9. Run validation sequence (9) — fix all errors

**Do not skip the validation sequence. Do not modify seed data after step 3.**

---

## 11. Key Design Decisions (do not override)

| Decision | Rationale |
|----------|-----------|
| Seed data written before agents | Prevents confirmation bias in synthetic evaluation |
| Zod validation on every agent output | Prevents malformed JSON from silently corrupting downstream agents |
| MOCK_AGENTS flag | Allows full pipeline testing without API costs during development |
| Decision log as first-class output | Enables post-hoc audit of agent reasoning independent of outcome |
| H5 as primary test case | Single hypothesis focus produces clean signal vs 5 simultaneous |
| Budget total unchanged in Allocator | Mirrors real-world constraint: POC budget is fixed |
| Manual steps in Budget Allocator output | Explicit human-in-the-loop for any money movement |
| No n8n / no scheduling | Reduces infrastructure complexity to zero for POC |
| Proposed variants flagged, not deployed | Agents recommend, humans decide — appropriate for POC phase |

---

*Document version 1.0 · March 2026 · Lyfe Run · Multi-Agent CAC Optimizer POC*
*Phases 1 + 2 merged. No real integrations. H5 primary test case.*
