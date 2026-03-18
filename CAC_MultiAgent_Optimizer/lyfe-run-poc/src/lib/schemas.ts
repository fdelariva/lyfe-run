import { z } from 'zod';

// ─── Agent 1: Data Collector Output ────────────────────────────────────────

export const LpVariantSummary = z.object({
  lp_variant_id: z.string(),
  overall_cvr: z.number(),
  weakest_section: z.string(),
  weakest_section_metric: z.number(),
});

export const DataCollectorOutput = z.object({
  normalized_at: z.string(),
  window_days: z.number(),
  top_performing_creative: z.object({
    creative_id: z.string(),
    ctr: z.number(),
    cpc_brl: z.number(),
    hypothesis: z.string(),
  }),
  bottom_performing_creative: z.object({
    creative_id: z.string(),
    ctr: z.number(),
    cpc_brl: z.number(),
    hypothesis: z.string(),
  }),
  lp_variants: z.array(LpVariantSummary),
});

export type DataCollectorOutputType = z.infer<typeof DataCollectorOutput>;

// ─── Agent 2: Performance Analyst Output ───────────────────────────────────

export const CreativeScore = z.object({
  creative_id: z.string(),
  score: z.number().min(0).max(100),
  status: z.enum(['winner', 'neutral', 'loser']),
  reason: z.string(),
});

export const LpAlert = z.object({
  lp_variant_id: z.string(),
  section: z.string(),
  metric: z.string(),
  value: z.number(),
  threshold: z.number(),
  triggered: z.boolean(),
  action_required: z.string(),
});

export const AnalystOutput = z.object({
  scoring_summary: z.string(),
  creative_scores: z.array(CreativeScore),
  lp_alerts: z.array(LpAlert),
  recommended_actions: z.array(z.string()),
});

export type AnalystOutputType = z.infer<typeof AnalystOutput>;

// ─── Agent 3: Creative Generator Output ────────────────────────────────────

export const NewCreative = z.object({
  proposed_id: z.string(),
  hypothesis: z.string(),
  angle: z.string(),
  image_tool: z.string(),
  image_prompt: z.string(),
  headline_pt: z.string(),
  cta_pt: z.string(),
  rationale: z.string(),
});

export const CreativeGeneratorOutput = z.object({
  triggered_by: z.string(),
  new_creative: NewCreative,
});

export type CreativeGeneratorOutputType = z.infer<typeof CreativeGeneratorOutput>;

// ─── Agent 4: LP Optimizer Output ──────────────────────────────────────────

export const ProposedVariant = z.object({
  variant_id: z.string(),
  section: z.string(),
  original_copy: z.string(),
  new_copy: z.object({
    headline_pt: z.string(),
    subheadline_pt: z.string(),
    body_pt: z.string(),
  }),
  rationale: z.string(),
  a_b_split: z.string(),
});

export const LpOptimizerOutput = z.object({
  triggered_by: z.object({
    lp_variant_id: z.string(),
    section: z.string(),
    metric: z.string(),
    current_value: z.number(),
  }),
  proposed_variant: ProposedVariant,
});

export type LpOptimizerOutputType = z.infer<typeof LpOptimizerOutput>;

// ─── Agent 5: Budget Allocator Output ──────────────────────────────────────

export const CurrentAllocation = z.object({
  creative_id: z.string(),
  daily_spend_brl: z.number(),
  cac_brl: z.number(),
});

export const RecommendedAllocation = z.object({
  creative_id: z.string(),
  action: z.enum(['increase', 'maintain', 'decrease', 'pause']),
  recommended_daily_spend_brl: z.number(),
  reason: z.string(),
});

export const BudgetAllocatorOutput = z.object({
  current_allocation: z.array(CurrentAllocation),
  recommended_allocation: z.array(RecommendedAllocation),
  total_budget_unchanged: z.boolean(),
  manual_steps: z.array(z.string()),
});

export type BudgetAllocatorOutputType = z.infer<typeof BudgetAllocatorOutput>;

// ─── Agent 6: Evaluation Output ────────────────────────────────────────────

export const ProjectedCreativeResult = z.object({
  creative_id: z.string(),
  projected_ctr: z.number(),
  projected_cpc_brl: z.number(),
  projected_thumb_stop: z.number(),
  confidence: z.enum(['high', 'medium', 'low']),
  reasoning: z.string(),
});

export const ProjectedLpResult = z.object({
  variant_id: z.string(),
  projected_cvr: z.number(),
  projected_form_start_rate: z.number(),
  projected_monetization_reach_pct: z.number(),
  confidence: z.enum(['high', 'medium', 'low']),
  reasoning: z.string(),
});

export const EvaluationOutput = z.object({
  simulation_notes: z.string(),
  projected_results: z.array(ProjectedCreativeResult),
  projected_lp_results: z.array(ProjectedLpResult),
  projected_cac_brl: z.number(),
  vs_current_cac_brl: z.number(),
  improvement_pct: z.number(),
});

export type EvaluationOutputType = z.infer<typeof EvaluationOutput>;
