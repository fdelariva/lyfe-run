import fs from 'fs-extra';
import path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const SEED_DIR = path.resolve(PROJECT_ROOT, 'data', 'seed');

export interface MetaPerformanceEntry {
  creative_id: string;
  hypothesis: string;
  lp_variant_id: string;
  campaign_id: string;
  ad_name: string;
  angle: string;
  image_tool: string;
  daily_spend_brl: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc_brl: number;
  thumb_stop_rate: number;
  cpm_brl: number;
}

export interface PosthogSection {
  viewed_pct?: number;
  form_start_rate?: number;
  scroll_reach_pct?: number;
}

export interface PosthogEventsEntry {
  lp_variant_id: string;
  hypothesis: string;
  hero_framing: string;
  sessions: number;
  avg_time_on_page_sec: number;
  bounce_rate: number;
  sections: Record<string, PosthogSection>;
  form_start_to_submit_rate: number;
  overall_cvr: number;
}

export interface SupabaseLeadEntry {
  id: string;
  created_at: string;
  name: string;
  city: string;
  group_size: string;
  lp_variant_id: string;
  utm: {
    source: string;
    medium: string;
    campaign: string;
    content: string;
  };
}

export async function loadMetaPerformance(): Promise<MetaPerformanceEntry[]> {
  const filePath = path.resolve(SEED_DIR, 'meta-performance.json');
  return fs.readJson(filePath);
}

export async function loadPosthogEvents(): Promise<PosthogEventsEntry[]> {
  const filePath = path.resolve(SEED_DIR, 'posthog-events.json');
  return fs.readJson(filePath);
}

export async function loadSupabaseLeads(): Promise<SupabaseLeadEntry[]> {
  const filePath = path.resolve(SEED_DIR, 'supabase-leads.json');
  return fs.readJson(filePath);
}

export interface AllSeedData {
  metaPerformance: MetaPerformanceEntry[];
  posthogEvents: PosthogEventsEntry[];
  supabaseLeads: SupabaseLeadEntry[];
}

export async function loadAllSeedData(): Promise<AllSeedData> {
  const [metaPerformance, posthogEvents, supabaseLeads] = await Promise.all([
    loadMetaPerformance(),
    loadPosthogEvents(),
    loadSupabaseLeads(),
  ]);

  return { metaPerformance, posthogEvents, supabaseLeads };
}
