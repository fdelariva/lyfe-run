'use client';

import { useState } from 'react';

interface LogEntry {
  timestamp: string;
  agent: string;
  input_summary: string;
  output_summary: string;
  raw_output: string;
  tokens_used: number;
}

interface DecisionLogProps {
  entries: LogEntry[];
}

function LogItem({ entry }: { entry: LogEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-zinc-900 py-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left flex items-start gap-3"
      >
        <span className="text-accent text-xs font-mono mt-0.5 shrink-0">
          {expanded ? '▼' : '▶'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-heading tracking-wider text-white">
              {entry.agent}
            </span>
            <span className="text-xs text-zinc-600 font-mono">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
            {entry.tokens_used > 0 && (
              <span className="text-xs text-zinc-700">
                {entry.tokens_used} tokens
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mt-0.5 truncate">
            {entry.output_summary}
          </p>
        </div>
      </button>
      {expanded && (
        <div className="ml-6 mt-2 space-y-2">
          <div>
            <p className="text-xs text-zinc-600 uppercase">Input</p>
            <p className="text-xs text-zinc-500">{entry.input_summary}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-600 uppercase">Raw Output</p>
            <pre className="text-xs text-zinc-500 bg-zinc-950 rounded p-3 overflow-x-auto max-h-64 overflow-y-auto">
              {typeof entry.raw_output === 'string'
                ? entry.raw_output
                : JSON.stringify(entry.raw_output, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DecisionLog({ entries }: DecisionLogProps) {
  if (!entries || entries.length === 0) {
    return (
      <p className="text-zinc-600 text-sm">
        No decisions logged yet. Run <code className="text-accent">npm run seed</code> first.
      </p>
    );
  }

  return (
    <div className="max-h-[500px] overflow-y-auto">
      {entries.map((entry, i) => (
        <LogItem key={i} entry={entry} />
      ))}
    </div>
  );
}
