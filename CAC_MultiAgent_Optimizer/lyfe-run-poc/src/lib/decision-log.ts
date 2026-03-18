import fs from 'fs-extra';
import path from 'path';
import { format } from 'date-fns';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const OUTPUT_DIR = path.resolve(PROJECT_ROOT, 'data', 'output');
const JSON_LOG_PATH = path.resolve(OUTPUT_DIR, 'decision-log.json');
const MD_LOG_PATH = path.resolve(OUTPUT_DIR, 'decision-log.md');

export interface LogEntry {
  timestamp: string;
  agent: string;
  input_summary: string;
  output_summary: string;
  raw_output: any;
  tokens_used: { input: number; output: number };
}

/**
 * Clears and reinitializes both log files.
 * - decision-log.json → empty array
 * - decision-log.md → header with run timestamp
 */
export async function initLog(): Promise<void> {
  await fs.ensureDir(OUTPUT_DIR);

  // Initialize JSON log as empty array
  await fs.writeJson(JSON_LOG_PATH, [], { spaces: 2 });

  // Initialize Markdown log with header
  const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const header = `# CAC Multi-Agent Optimizer — Decision Log\n\n**Run started:** ${now}\n\n---\n\n`;
  await fs.writeFile(MD_LOG_PATH, header, 'utf-8');
}

/**
 * Appends a log entry to both decision-log.json and decision-log.md.
 */
export async function appendLog(entry: LogEntry): Promise<void> {
  await fs.ensureDir(OUTPUT_DIR);

  // Append to JSON log
  let entries: LogEntry[] = [];
  try {
    entries = await fs.readJson(JSON_LOG_PATH);
  } catch {
    // File may not exist yet; start fresh
    entries = [];
  }
  entries.push(entry);
  await fs.writeJson(JSON_LOG_PATH, entries, { spaces: 2 });

  // Append to Markdown log
  const formattedTime = format(new Date(entry.timestamp), 'HH:mm:ss');
  const totalTokens = entry.tokens_used.input + entry.tokens_used.output;

  const mdBlock = [
    `## ${entry.agent}`,
    ``,
    `**Time:** ${formattedTime} | **Tokens:** ${totalTokens} (${entry.tokens_used.input} in / ${entry.tokens_used.output} out)`,
    ``,
    `**Input:** ${entry.input_summary}`,
    ``,
    `**Output:** ${entry.output_summary}`,
    ``,
    `<details>`,
    `<summary>Raw output</summary>`,
    ``,
    '```json',
    JSON.stringify(entry.raw_output, null, 2),
    '```',
    ``,
    `</details>`,
    ``,
    `---`,
    ``,
  ].join('\n');

  await fs.appendFile(MD_LOG_PATH, mdBlock, 'utf-8');
}
