import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const email = data.email as string;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Replace @ with _ for the filename
    const filename = email.replace("@", "_") + ".json";
    const waitlistDir = path.join(process.cwd(), "waitlist");

    await mkdir(waitlistDir, { recursive: true });

    const filepath = path.join(waitlistDir, filename);
    const record = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    await writeFile(filepath, JSON.stringify(record, null, 2), "utf-8");

    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error("[Waitlist] Error saving record:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
