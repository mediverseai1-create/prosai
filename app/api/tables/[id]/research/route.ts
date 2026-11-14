import { NextResponse } from "next/server";
import { z } from "zod";
import { creditsUsed, getContext, recordUsage } from "@/lib/session";
import { COSTS } from "@/lib/plans";
import { isAiConfigured, researchLead } from "@/lib/ai";
import type { Row } from "@/lib/enrich";

const body = z.object({ rowIds: z.array(z.string().uuid()).min(1).max(10) });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getContext();
  if (!ctx) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!isAiConfigured()) return NextResponse.json({ error: "AI research is not configured (missing GEMINI_API_KEY)." }, { status: 503 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Select between 1 and 10 rows." }, { status: 400 });

  const { data: rows } = await ctx.supabase
    .from("lead_rows").select("id, data, enrichment").eq("table_id", id).in("id", parsed.data.rowIds);
  if (!rows?.length) return NextResponse.json({ error: "Rows not found" }, { status: 404 });

  const remaining = ctx.plan.actions - (await creditsUsed(ctx.org.id));
  const affordable = Math.floor(remaining / COSTS.aiResearch);
  if (affordable <= 0) return NextResponse.json({ error: "No actions left this month. Upgrade your plan to continue.", code: "no_credits" }, { status: 402 });

  let done = 0;
  const errors: string[] = [];
  for (const r of rows.slice(0, affordable)) {
    try {
      const ai = await researchLead({ icp: ctx.org.icp, row: r.data as Row, enrichment: r.enrichment as Record<string, unknown> });
      await ctx.supabase.from("lead_rows").update({ ai }).eq("id", r.id);
      done++;
    } catch {
      errors.push(r.id); // not charged
    }
  }
  await recordUsage(ctx.org.id, ctx.user.id, "ai_research", done * COSTS.aiResearch);
  return NextResponse.json({ researched: done, failed: errors.length, creditsUsed: done * COSTS.aiResearch });
}
