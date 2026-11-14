export type PlanId = "free" | "launch" | "growth" | "enterprise";

export type Plan = {
  id: PlanId;
  name: string;
  priceMonthly: number | null;
  blurb: string;
  actions: number; // monthly action credits
  rowsPerTable: number;
  features: string[];
  paymentLink: string | null;
};

// Prices are placeholders for the owner to adjust; payment links come from env.
export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Starter",
    priceMonthly: 0,
    blurb: "Try the workbench on a small list.",
    actions: 500,
    rowsPerTable: 200,
    features: [
      "500 actions per month",
      "200 rows per table",
      "Built-in enrichment and scoring",
      "AI research (5 actions per row)",
      "CSV import and export",
    ],
    paymentLink: null,
  },
  launch: {
    id: "launch",
    name: "Launch",
    priceMonthly: 99,
    blurb: "For one operator running regular plays.",
    actions: 15000,
    rowsPerTable: 50000,
    features: [
      "15,000 actions per month",
      "50,000 rows per table",
      "Everything in Starter",
      "Higher AI research volume",
      "Email support",
    ],
    paymentLink: process.env.NEXT_PUBLIC_PAYMENT_LINK_LAUNCH ?? null,
  },
  growth: {
    id: "growth",
    name: "Growth",
    priceMonthly: 299,
    blurb: "For teams that run revenue on the workbench.",
    actions: 40000,
    rowsPerTable: 100000,
    features: [
      "40,000 actions per month",
      "100,000 rows per table",
      "Everything in Launch",
      "Priority support",
    ],
    paymentLink: process.env.NEXT_PUBLIC_PAYMENT_LINK_GROWTH ?? null,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: null,
    blurb: "Custom limits, security review and onboarding.",
    actions: 1_000_000,
    rowsPerTable: 1_000_000,
    features: ["Custom action volume", "Security review", "Dedicated contact"],
    paymentLink: null,
  },
};

export const PUBLIC_PLANS: PlanId[] = ["free", "launch", "growth", "enterprise"];

export const COSTS = {
  enrichStep: 1, // actions per row per built-in enrichment step
  aiResearch: 5, // actions per row
} as const;

export function getPlan(id: string | null | undefined): Plan {
  return PLANS[(id as PlanId) in PLANS ? (id as PlanId) : "free"];
}

export function billingPeriodStart(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}
