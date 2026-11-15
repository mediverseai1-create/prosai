import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { parseSelarSale } from "@/lib/selar";

// Selar sale notifications. Selar publishes no signature scheme, so the webhook
// URL carries a long random secret (SELAR_WEBHOOK_TOKEN):
//   https://<site>/api/webhooks/selar?token=<SELAR_WEBHOOK_TOKEN>
// A sale is matched to a workspace by the buyer's email, which must equal the
// email of a ProsAI account (owner). Unmatched or unrecognised sales are
// acknowledged (202) but change nothing, and are logged for manual handling.

function tokenOk(provided: string | null) {
  const secret = process.env.SELAR_WEBHOOK_TOKEN;
  if (!secret || !provided) return false;
  const a = Buffer.from(provided), b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function readBody(req: Request): Promise<unknown> {
  const raw = await req.text();
  try { return JSON.parse(raw); } catch { /* fall through to form encoding */ }
  const params = new URLSearchParams(raw);
  return Object.fromEntries(params.entries());
}

async function findUserIdByEmail(email: string) {
  const db = createAdminClient();
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const u = data.users.find((x) => x.email?.toLowerCase() === email);
    if (u) return u.id;
    if (data.users.length < 200) break;
  }
  return null;
}

export async function POST(req: Request) {
  if (!process.env.SELAR_WEBHOOK_TOKEN) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  const url = new URL(req.url);
  if (!tokenOk(url.searchParams.get("token") ?? req.headers.get("x-webhook-token"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sale = parseSelarSale(await readBody(req));
  if (!sale.email || (!sale.plan && !sale.refunded)) {
    console.warn("[selar] unrecognised payload; no change made", { hasEmail: Boolean(sale.email), amount: sale.amount, currency: sale.currency });
    return NextResponse.json({ ok: true, matched: false, reason: "unrecognised payload" }, { status: 202 });
  }

  const userId = await findUserIdByEmail(sale.email);
  if (!userId) {
    console.warn("[selar] no ProsAI account for buyer email; needs manual activation", { plan: sale.plan, reference: sale.reference });
    return NextResponse.json({ ok: true, matched: false, reason: "no account for email" }, { status: 202 });
  }

  const db = createAdminClient();
  const { data: m } = await db.from("memberships").select("org_id").eq("user_id", userId).eq("role", "owner").limit(1).maybeSingle();
  if (!m) return NextResponse.json({ ok: true, matched: false, reason: "no workspace" }, { status: 202 });

  const now = new Date().toISOString();
  const patch = sale.refunded
    ? { plan: "free", status: "canceled", updated_at: now }
    : { plan: sale.plan!, status: "active", external_id: sale.reference?.slice(0, 200) ?? null, updated_at: now };
  const { error } = await db.from("subscriptions").update(patch).eq("org_id", m.org_id);
  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ ok: true, matched: true, plan: patch.plan });
}
