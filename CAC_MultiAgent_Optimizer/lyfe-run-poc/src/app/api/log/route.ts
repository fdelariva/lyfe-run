import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'output', 'decision-log.json');

  if (!fs.existsSync(filePath)) {
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const log = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  return NextResponse.json(log, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
