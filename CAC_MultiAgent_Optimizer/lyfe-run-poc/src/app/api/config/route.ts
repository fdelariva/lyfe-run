import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'data', 'config.json');

const DEFAULT_CONFIG = {
  mock_agents: true,
  thresholds: {
    creative: {
      ctr_loser: 0.013,
      thumb_stop_loser: 0.15,
      cpc_loser: 1.30,
      score_winner: 70,
      score_loser: 40,
    },
    lp: {
      bounce_rate_max: 0.60,
      form_start_rate_min: 0.20,
      monetization_reach_min: 0.45,
      cvr_min: 0.06,
    },
    budget: {
      min_spend_per_creative: 80,
      max_spend_pct: 0.60,
      pause_ctr_below: 0.010,
      pause_cpc_above: 1.50,
      increase_score_above: 75,
      increase_ctr_above: 0.018,
    },
  },
};

export async function GET() {
  if (!fs.existsSync(CONFIG_PATH)) {
    return NextResponse.json(DEFAULT_CONFIG, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  return NextResponse.json(config, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  // Ensure data directory exists
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(body, null, 2));

  return NextResponse.json({ success: true }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
