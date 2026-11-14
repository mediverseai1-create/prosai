import { NextResponse } from "next/server";
import { z } from "zod";
import { getContext } from "@/lib/session";

const body = z.object({
  rows: z.array(z.record(z.string(), z.string().max(2000))).min(1).max(1000),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getContext();
  if (!ctx) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid rows" }, { status: 400 });

  const { data: table } = await ctx.supabase.from("lead_tables").select("id, columns").eq("id", id).maybeSingle();
  if (!table) return NextResponse.json({ error: "Table not found" }, { status: 404 });

  const { count } = await ctx.supabase.from("lead_rows").select("id", { count: "exact", head: true }).eq("table_id", id);
  const room = ctx.plan.rowsPerTable - (count ?? 0);
  if (room <= 0) {
    return NextResponse.json({ error: `Your ${ctx.plan.name} plan allows ${ctx.plan.rowsPerTable} rows per table.`, code: "row_limit" }, { status: 402 });
  }
  const rows = parsed.data.rows.slice(0, room);
  const { error } = await ctx.supabase.from("lead_rows").insert(
    rows.map((data) => ({ table_id: id, org_id: ctx.org.id, data })),
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const cols = new Set<string>(table.columns);
  rows.forEach((r) => Object.keys(r).forEach((k) => cols.add(k)));
  await ctx.supabase.from("lead_tables").update({ columns: [...cols].slice(0, 100) }).eq("id", id);

  return NextResponse.json({ imported: rows.length, skipped: parsed.data.rows.length - rows.length });
}
