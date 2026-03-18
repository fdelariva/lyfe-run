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
import fsExtra from 'fs-extra';
import { loadAllSeedData } from '../lib/seed-loader';
import { run as runEvaluation } from '../agents/06-evaluation';
import { CreativeGeneratorOutputType, LpOptimizerOutputType, BudgetAllocatorOutputType } from '../lib/schemas';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const STATE_DIR = path.resolve(PROJECT_ROOT, 'data', 'state');

async function main() {
  console.log(chalk.bold('\n📊 Lyfe Run POC — Evaluation\n'));

  // ─── Check state files exist ───────────────────────────────────────────────
  const campaignStatePath = path.resolve(STATE_DIR, 'campaign-state.json');
  if (!fs.existsSync(campaignStatePath)) {
    console.error(
      chalk.red('Error: data/state/campaign-state.json not found.\n') +
      chalk.yellow('Run the optimization cycle first: npm run cycle')
    );
    process.exit(1);
  }

  const proposedCreativesPath = path.resolve(STATE_DIR, 'proposed-creatives.json');
  const proposedLpVariantsPath = path.resolve(STATE_DIR, 'proposed-lp-variants.json');
  const budgetAllocationPath = path.resolve(STATE_DIR, 'budget-allocation.json');

  if (!fs.existsSync(proposedCreativesPath) || !fs.existsSync(proposedLpVariantsPath) || !fs.existsSync(budgetAllocationPath)) {
    console.error(
      chalk.red('Error: Missing state files from optimization cycle.\n') +
      chalk.yellow('Run the optimization cycle first: npm run cycle')
    );
    process.exit(1);
  }

  // ─── Load state ────────────────────────────────────────────────────────────
  const proposedCreatives: CreativeGeneratorOutputType = await fsExtra.readJson(proposedCreativesPath);
  const proposedLpVariants: LpOptimizerOutputType = await fsExtra.readJson(proposedLpVariantsPath);
  const budgetAllocation: BudgetAllocatorOutputType = await fsExtra.readJson(budgetAllocationPath);
  const seedData = await loadAllSeedData();

  console.log(chalk.cyan('State loaded:'));
  console.log(`  Proposed creative : ${proposedCreatives.new_creative.proposed_id}`);
  console.log(`  Proposed LP variant : ${proposedLpVariants.proposed_variant.variant_id}`);
  console.log(`  Budget allocations : ${budgetAllocation.recommended_allocation.length}`);
  console.log('');

  // ─── Agent 06: Evaluation ──────────────────────────────────────────────────
  console.log(chalk.yellow('▶ Agent 06: Evaluation...'));
  const evalOutput = await runEvaluation(proposedCreatives, proposedLpVariants, budgetAllocation, seedData);
  console.log(chalk.green('  ✓ Evaluation complete'));
  console.log('');

  // Print projected creative results
  console.log(chalk.bold('  Projected Creative Results:'));
  console.log(chalk.gray('  ──────────────────────────────────────────────────────────────────'));
  console.log(
    chalk.gray('  creative_id'.padEnd(20)) +
    chalk.gray('CTR'.padEnd(10)) +
    chalk.gray('CPC R$'.padEnd(12)) +
    chalk.gray('thumb_stop'.padEnd(14)) +
    chalk.gray('confidence')
  );
  console.log(chalk.gray('  ──────────────────────────────────────────────────────────────────'));
  for (const pr of evalOutput.projected_results) {
    const confColor =
      pr.confidence === 'high' ? chalk.green :
      pr.confidence === 'medium' ? chalk.yellow :
      chalk.red;
    console.log(
      `  ${pr.creative_id.padEnd(20)}${pr.projected_ctr.toFixed(4).padEnd(10)}${('R$' + pr.projected_cpc_brl.toFixed(2)).padEnd(12)}${pr.projected_thumb_stop.toFixed(4).padEnd(14)}${confColor(pr.confidence)}`
    );
  }
  console.log('');

  // Print projected LP results
  console.log(chalk.bold('  Projected LP Results:'));
  console.log(chalk.gray('  ──────────────────────────────────────────────────────────────────'));
  console.log(
    chalk.gray('  variant_id'.padEnd(24)) +
    chalk.gray('CVR'.padEnd(10)) +
    chalk.gray('form_start'.padEnd(14)) +
    chalk.gray('monet_reach'.padEnd(14)) +
    chalk.gray('confidence')
  );
  console.log(chalk.gray('  ──────────────────────────────────────────────────────────────────'));
  for (const lp of evalOutput.projected_lp_results) {
    const confColor =
      lp.confidence === 'high' ? chalk.green :
      lp.confidence === 'medium' ? chalk.yellow :
      chalk.red;
    console.log(
      `  ${lp.variant_id.padEnd(24)}${lp.projected_cvr.toFixed(4).padEnd(10)}${lp.projected_form_start_rate.toFixed(4).padEnd(14)}${lp.projected_monetization_reach_pct.toFixed(4).padEnd(14)}${confColor(lp.confidence)}`
    );
  }
  console.log('');

  // Print CAC improvement summary
  console.log(chalk.bold('  CAC Improvement:'));
  console.log(chalk.gray('  ──────────────────────────────────────────────────────'));
  console.log(`  Current CAC     : ${chalk.red('R$' + evalOutput.vs_current_cac_brl.toFixed(2))}`);
  console.log(`  Projected CAC   : ${chalk.green('R$' + evalOutput.projected_cac_brl.toFixed(2))}`);

  const improvementColor = evalOutput.improvement_pct > 0 ? chalk.green : chalk.red;
  console.log(`  Improvement     : ${improvementColor(evalOutput.improvement_pct.toFixed(1) + '%')}`);
  console.log('');

  console.log(chalk.gray('  Review data/output/decision-log.md for full reasoning.'));
  console.log('');
}

main().catch((err) => {
  console.error(chalk.red('Error running evaluation:'), err);
  process.exit(1);
});
