import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";

// Trusted payment confirmation. The payment provider (or a small adapter you
// control) must POST JSON with header `x-prosai-signature` = hex HMAC-SHA256 of
// the raw body using PAYMENT_WEBHOOK_SECRET. Returning from a payment link alone
// never changes a plan.
const event = z.object({
  type: z.enum(["subscription.activated", "subscription.canceled"]),
  org_id: z.string().uuid(),
  plan: z.enum(["launch", "growth", "enterprise"]).optional(),
  external_id: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });

  const raw = await req.text();
  const sig = req.headers.get("x-prosai-signature") ?? "";
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let json: unknown;
  try { json = JSON.parse(raw); } catch { return NextResponse.json({ error: "Bad JSON" }, { status: 400 }); }
  const parsed = event.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Bad event" }, { status: 400 });
  const e = parsed.data;

  const db = createAdminClient();
  const patch = e.type === "subscription.activated"
    ? { plan: e.plan ?? "launch", status: "active", external_id: e.external_id ?? null, updated_at: new Date().toISOString() }
    : { plan: "free", status: "canceled", updated_at: new Date().toISOString() };
  if (e.type === "subscription.activated" && !e.plan) return NextResponse.json({ error: "plan required" }, { status: 400 });
  const { error } = await db.from("subscriptions").update(patch).eq("org_id", e.org_id);
  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
