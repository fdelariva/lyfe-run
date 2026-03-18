import fs from 'fs';
import path from 'path';

// ─── Load .env.local ──────────────────────────────────────────────────────────
const ENV_PATH = path.resolve(__dirname, '..', '..', '.env.local');
if (fs.existsSync(ENV_PATH)) {
  const lines = fs.readFileSync(ENV_PATH, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

import chalk from 'chalk';
import { initLog } from '../lib/decision-log';
import { loadAllSeedData } from '../lib/seed-loader';
import { run as runDataCollector } from '../agents/01-data-collector';
import { run as runPerformanceAnalyst } from '../agents/02-performance-analyst';
import { run as runCreativeGenerator } from '../agents/03-creative-generator';
import { run as runLpOptimizer } from '../agents/04-lp-optimizer';
import { run as runBudgetAllocator } from '../agents/05-budget-allocator';
import fsExtra from 'fs-extra';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const STATE_DIR = path.resolve(PROJECT_ROOT, 'data', 'state');

async function main() {
  // 1. Reset decision log
  await initLog();

  // 2. Banner
  console.log(chalk.bold('\n🏃 Lyfe Run POC — Optimization Cycle\n'));

  // 3. Load seed data and print summary
  const seedData = await loadAllSeedData();
  const totalSpend = seedData.metaPerformance.reduce((s, c) => s + c.daily_spend_brl, 0);
  const totalSessions = seedData.posthogEvents.reduce((s, lp) => s + lp.sessions, 0);
  const totalLeads = seedData.supabaseLeads.length;

  console.log(chalk.cyan('Seed data loaded:'));
  console.log(`  Total daily spend : R$${totalSpend.toFixed(2)}`);
  console.log(`  Total sessions    : ${totalSessions}`);
  console.log(`  Total leads       : ${totalLeads}`);
  console.log('');

  // ─── Agent 01: Data Collector ───────────────────────────────────────────────
  console.log(chalk.yellow('▶ Agent 01: Data Collector...'));
  const collectorOutput = await runDataCollector();
  console.log(chalk.green('  ✓ Data collected'));
  console.log('');

  // ─── Agent 02: Performance Analyst ──────────────────────────────────────────
  console.log(chalk.yellow('▶ Agent 02: Performance Analyst...'));
  const analystOutput = await runPerformanceAnalyst(collectorOutput, seedData);
  console.log(chalk.green('  ✓ Analysis complete'));
  console.log('');

  // Print scoring table
  console.log(chalk.bold('  Creative Scoring:'));
  console.log(chalk.gray('  ─────────────────────────────────────────────────'));
  console.log(
    chalk.gray('  creative_id'.padEnd(20)) +
    chalk.gray('score'.padEnd(10)) +
    chalk.gray('status')
  );
  console.log(chalk.gray('  ─────────────────────────────────────────────────'));
  for (const cs of analystOutput.creative_scores) {
    const statusColor =
      cs.status === 'winner' ? chalk.green :
      cs.status === 'neutral' ? chalk.yellow :
      chalk.red;
    console.log(
      `  ${cs.creative_id.padEnd(20)}${String(cs.score).padEnd(10)}${statusColor(cs.status)}`
    );
  }
  console.log('');

  // Check for losers
  const losers = analystOutput.creative_scores.filter(c => c.status === 'loser');
  if (losers.length === 0) {
    console.log(chalk.yellow('  ⚠ No "loser" creatives found — creative generator may not trigger a pivot.'));
    console.log('');
  }

  // ─── Agent 03: Creative Generator ──────────────────────────────────────────
  console.log(chalk.yellow('▶ Agent 03: Creative Generator...'));
  const creativeOutput = await runCreativeGenerator(analystOutput);
  console.log(chalk.green('  ✓ New creative proposed'));
  console.log(`    Headline : ${chalk.white(creativeOutput.new_creative.headline_pt)}`);
  console.log(`    CTA      : ${chalk.white(creativeOutput.new_creative.cta_pt)}`);
  console.log('');

  // ─── Agent 04: LP Optimizer ────────────────────────────────────────────────
  console.log(chalk.yellow('▶ Agent 04: LP Optimizer...'));
  const lpOutput = await runLpOptimizer(analystOutput);
  console.log(chalk.green('  ✓ LP variant proposed'));
  console.log(`    Triggered : ${chalk.white(lpOutput.triggered_by.section)} (${lpOutput.triggered_by.metric} = ${lpOutput.triggered_by.current_value})`);
  console.log(`    New headline : ${chalk.white(lpOutput.proposed_variant.new_copy.headline_pt)}`);
  console.log('');

  // Save proposed outputs to state for evaluation agent
  await fsExtra.ensureDir(STATE_DIR);
  await fsExtra.writeJson(
    path.resolve(STATE_DIR, 'proposed-creatives.json'),
    creativeOutput,
    { spaces: 2 }
  );
  await fsExtra.writeJson(
    path.resolve(STATE_DIR, 'proposed-lp-variants.json'),
    lpOutput,
    { spaces: 2 }
  );

  // ─── Agent 05: Budget Allocator ────────────────────────────────────────────
  console.log(chalk.yellow('▶ Agent 05: Budget Allocator...'));
  const budgetOutput = await runBudgetAllocator(analystOutput, seedData);
  console.log(chalk.green('  ✓ Budget reallocation complete'));
  console.log('');

  // Print reallocation table
  console.log(chalk.bold('  Budget Reallocation:'));
  console.log(chalk.gray('  ─────────────────────────────────────────────────────────────'));
  console.log(
    chalk.gray('  creative_id'.padEnd(20)) +
    chalk.gray('action'.padEnd(12)) +
    chalk.gray('daily R$'.padEnd(12)) +
    chalk.gray('reason')
  );
  console.log(chalk.gray('  ─────────────────────────────────────────────────────────────'));
  for (const ra of budgetOutput.recommended_allocation) {
    const actionColor =
      ra.action === 'increase' ? chalk.green :
      ra.action === 'pause' ? chalk.red :
      ra.action === 'decrease' ? chalk.yellow :
      chalk.white;
    console.log(
      `  ${ra.creative_id.padEnd(20)}${actionColor(ra.action.padEnd(12))}${('R$' + ra.recommended_daily_spend_brl.toFixed(2)).padEnd(12)}${ra.reason}`
    );
  }
  console.log('');

  // Print manual steps
  console.log(chalk.bold('  Manual Steps:'));
  budgetOutput.manual_steps.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step}`);
  });
  console.log('');

  // Save budget output to state
  await fsExtra.writeJson(
    path.resolve(STATE_DIR, 'budget-allocation.json'),
    budgetOutput,
    { spaces: 2 }
  );

  // ─── Summary ───────────────────────────────────────────────────────────────
  const currentCAC = (totalSpend * 7) / totalLeads;
  console.log(chalk.bold('\n✓ Optimization cycle complete. Run \'npm run evaluate\' for synthetic projections.\n'));
  console.log(chalk.cyan(`  Current CAC: R$${currentCAC.toFixed(2)} (total_spend R$${(totalSpend * 7).toFixed(2)} / ${totalLeads} leads)`));
  console.log('');
}

main().catch((err) => {
  console.error(chalk.red('Error running optimization cycle:'), err);
  process.exit(1);
});
