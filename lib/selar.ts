import type { PlanId } from "@/lib/plans";

// Selar does not publish a payload schema or webhook signature that we could
// verify, so this parser is deliberately tolerant: it flattens whatever it is
// sent and looks for an email, an amount/currency, a plan marker and a status.
// Authenticity comes from a secret token on the webhook URL (see the route).

export type SelarSale = {
  email: string | null;
  plan: PlanId | null;
  amount: number | null;
  currency: string | null;
  reference: string | null;
  refunded: boolean;
};

const PRICE_TO_PLAN: Record<number, PlanId> = { 47: "launch", 57: "growth", 97: "enterprise" };
const SLUG_TO_PLAN: [RegExp, PlanId][] = [[/\b47plan\b/i, "launch"], [/\b57plan\b/i, "growth"], [/\b97plan\b/i, "enterprise"]];

function flatten(value: unknown, path = "", out: [string, string][] = [], depth = 0): [string, string][] {
  if (depth > 6 || out.length > 500) return out;
  if (value === null || value === undefined) return out;
  if (typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) flatten(v, path ? `${path}.${k}` : k, out, depth + 1);
  } else {
    out.push([path.toLowerCase(), String(value)]);
  }
  return out;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseSelarSale(payload: unknown): SelarSale {
  const flat = flatten(payload);
  const find = (re: RegExp, ok: (v: string) => boolean = () => true) => flat.find(([k, v]) => re.test(k) && ok(v))?.[1] ?? null;

  const email = find(/(^|\.)(customer_)?email(_address)?$/, (v) => EMAIL.test(v.trim()))?.trim().toLowerCase() ?? null;
  const amountRaw = find(/(^|\.)(amount|price|total|amount_paid|product_price)$/, (v) => Number.isFinite(Number(v)));
  const amount = amountRaw === null ? null : Number(amountRaw);
  const currency = find(/(^|\.)currency(_code)?$/, (v) => /^[A-Za-z]{3}$/.test(v))?.toUpperCase() ?? null;
  const reference = find(/(^|\.)(reference|order_id|order_reference|transaction_id|id)$/) ;
  const status = (find(/(^|\.)(status|event|type)$/) ?? "").toLowerCase();
  const refunded = /refund|chargeback|cancel/.test(status);

  // Prefer an explicit product marker (link slug), then a USD amount match.
  let plan: PlanId | null = null;
  for (const [, v] of flat) {
    const hit = SLUG_TO_PLAN.find(([re]) => re.test(v));
    if (hit) { plan = hit[1]; break; }
  }
  if (!plan && amount !== null && (currency === null || currency === "USD")) plan = PRICE_TO_PLAN[Math.round(amount)] ?? null;

  return { email, plan, amount, currency, reference, refunded };
}
