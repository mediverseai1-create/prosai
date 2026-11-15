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
    priceMonthly: 47,
    blurb: "For one operator running regular plays.",
    actions: 5000,
    rowsPerTable: 10000,
    features: [
      "5,000 actions per month",
      "10,000 rows per table",
      "Everything in Starter",
      "Email support",
    ],
    paymentLink: process.env.NEXT_PUBLIC_PAYMENT_LINK_LAUNCH || "https://selar.com/47plan?currency=USD",
  },
  growth: {
    id: "growth",
    name: "Growth",
    priceMonthly: 57,
    blurb: "For teams that run revenue on the workbench.",
    actions: 15000,
    rowsPerTable: 50000,
    features: [
      "15,000 actions per month",
      "50,000 rows per table",
      "Everything in Launch",
      "Priority support",
    ],
    paymentLink: process.env.NEXT_PUBLIC_PAYMENT_LINK_GROWTH || "https://selar.com/57plan?currency=USD",
  },
  enterprise: {
    // Internal id stays "enterprise" because the database constraint allows only these ids.
    id: "enterprise",
    name: "Scale",
    priceMonthly: 97,
    blurb: "For heavy volume and several lead lists at once.",
    actions: 40000,
    rowsPerTable: 100000,
    features: [
      "40,000 actions per month",
      "100,000 rows per table",
      "Everything in Growth",
      "Priority onboarding",
    ],
    paymentLink: process.env.NEXT_PUBLIC_PAYMENT_LINK_SCALE || "https://selar.com/97plan?currency=USD",
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
