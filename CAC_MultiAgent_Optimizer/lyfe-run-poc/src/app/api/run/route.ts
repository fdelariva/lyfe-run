import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { command } = body as { command: string };

  if (!['seed', 'evaluate'].includes(command)) {
    return NextResponse.json({ error: 'Invalid command' }, { status: 400 });
  }

  // Read mock_agents setting from config file
  const configPath = path.join(process.cwd(), 'data', 'config.json');
  let mockAgents = 'true'; // default to mock
  if (fs.existsSync(configPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      mockAgents = cfg.mock_agents ? 'true' : 'false';
    } catch {
      // use default
    }
  }

  const projectRoot = path.resolve(process.cwd());
  const script = command === 'seed' ? 'src/runner/run-cycle.ts' : 'src/runner/run-evaluation.ts';
  const cmd = `cd "${projectRoot}" && MOCK_AGENTS=${mockAgents} npx ts-node ${script}`;

  return new Promise<NextResponse>((resolve) => {
    exec(cmd, { timeout: 120000, env: { ...process.env } }, (error, stdout, stderr) => {
      // Strip ANSI color codes for clean output
      const cleanStdout = stdout.replace(/\x1b\[[0-9;]*m/g, '');
      const cleanStderr = stderr.replace(/\x1b\[[0-9;]*m/g, '');

      if (error) {
        resolve(
          NextResponse.json(
            { success: false, output: cleanStdout, error: cleanStderr || error.message },
            { status: 500 }
          )
        );
      } else {
        resolve(
          NextResponse.json(
            { success: true, output: cleanStdout },
            { headers: { 'Cache-Control': 'no-store' } }
          )
        );
      }
    });
  });
}
