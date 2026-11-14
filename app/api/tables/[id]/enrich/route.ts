import { NextResponse } from "next/server";
import { z } from "zod";
import { creditsUsed, getContext, recordUsage } from "@/lib/session";
import { COSTS } from "@/lib/plans";
import { enrichRow, type Row } from "@/lib/enrich";

const body = z.object({
  steps: z.array(z.enum(["domain", "email_check", "email_guess", "score"])).min(1),
  rowIds: z.array(z.string().uuid()).max(500).optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getContext();
  if (!ctx) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { steps, rowIds } = parsed.data;

  let q = ctx.supabase.from("lead_rows").select("id, data, enrichment").eq("table_id", id).order("created_at").limit(500);
  if (rowIds) q = q.in("id", rowIds);
  const { data: rows, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!rows?.length) return NextResponse.json({ error: "No rows to enrich" }, { status: 404 });

  const perRow = steps.length * COSTS.enrichStep;
  const remaining = ctx.plan.actions - (await creditsUsed(ctx.org.id));
  const affordable = Math.floor(remaining / perRow);
  if (affordable <= 0) {
    return NextResponse.json({ error: "No actions left this month. Upgrade your plan to continue.", code: "no_credits" }, { status: 402 });
  }
  const batch = rows.slice(0, affordable);

  let failed = 0;
  for (const r of batch) {
    const enrichment = enrichRow(r.data as Row, steps, r.enrichment as Record<string, unknown>);
    const { error: e } = await ctx.supabase.from("lead_rows").update({ enrichment }).eq("id", r.id);
    if (e) failed++;
  }
  const done = batch.length - failed;
  await recordUsage(ctx.org.id, ctx.user.id, "enrich", done * perRow);
  return NextResponse.json({ enriched: done, failed, creditsUsed: done * perRow, truncated: batch.length < rows.length });
}
