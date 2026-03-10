import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { Resend } from "resend";
import leadsConfig from "@/leads.config";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const email = data.email as string;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const record = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    // 1. Save lead to local JSON file
    try {
      const filename = email.replace("@", "_") + ".json";
      const waitlistDir = path.join(process.cwd(), leadsConfig.waitlistDir);
      await mkdir(waitlistDir, { recursive: true });
      await writeFile(
        path.join(waitlistDir, filename),
        JSON.stringify(record, null, 2),
        "utf-8"
      );
    } catch (fileError) {
      // File saving may fail on serverless (read-only filesystem)
      console.warn("[Waitlist] Could not save file (expected on Vercel):", fileError);
    }

    // 2. Send email notification
    if (resend) {
      try {
        await resend.emails.send({
          from: leadsConfig.emailFrom,
          to: leadsConfig.emailTo,
          subject: `Novo lead Lyfe Run: ${data.firstName} ${data.lastName}`,
          html: `
            <h2>Novo lead cadastrado no Lyfe Run</h2>
            <table style="border-collapse:collapse;width:100%;max-width:500px;font-family:sans-serif;">
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Nome</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${data.firstName} ${data.lastName}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">E-mail</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${data.email}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Telefone</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${data.phone}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Assessoria</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${data.practiceName}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Subdomínio</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${data.subdomain}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Plano</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${data.plan === "gold" ? "Gold (3%)" : "Basic (R$ 200/mês)"}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Bio</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.bio || "—"}</td></tr>
              <tr><td style="padding:8px;color:#666;">Data</td><td style="padding:8px;font-weight:600;">${record.createdAt}</td></tr>
            </table>
          `,
        });
      } catch (emailError) {
        console.error("[Waitlist] Failed to send email:", emailError);
      }
    } else {
      console.warn("[Waitlist] RESEND_API_KEY not set — skipping email notification");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Waitlist] Error processing lead:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
