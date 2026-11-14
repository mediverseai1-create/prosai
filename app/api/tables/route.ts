import { NextResponse } from "next/server";
import { z } from "zod";
import { getContext } from "@/lib/session";

const body = z.object({
  name: z.string().trim().min(1).max(120),
  columns: z.array(z.string().max(120)).max(100).default([]),
});

export async function POST(req: Request) {
  const ctx = await getContext();
  if (!ctx) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid table details" }, { status: 400 });
  const { data, error } = await ctx.supabase
    .from("lead_tables")
    .insert({ org_id: ctx.org.id, name: parsed.data.name, columns: parsed.data.columns, created_by: ctx.user.id })
    .select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
