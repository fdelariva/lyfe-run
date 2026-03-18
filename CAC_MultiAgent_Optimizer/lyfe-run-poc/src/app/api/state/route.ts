import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const dataDir = path.join(process.cwd(), 'data', 'state');

  const readJSON = (file: string) => {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  };

  const state = {
    campaign: readJSON('campaign-state.json'),
    proposedCreatives: readJSON('proposed-creatives.json'),
    proposedLpVariants: readJSON('proposed-lp-variants.json'),
    budgetAllocation: readJSON('budget-allocation.json'),
  };

  return NextResponse.json(state, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
