import Link from "next/link";
import { PLANS, PUBLIC_PLANS, COSTS } from "@/lib/plans";

export const metadata = { title: "Pricing" };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-36">
      <h1 className="text-4xl font-bold tracking-tight">Pricing that scales with your volume</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Actions measure the work done: {COSTS.enrichStep} per row per enrichment step, {COSTS.aiResearch} per row of AI research. Failed runs are not charged.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PUBLIC_PLANS.map((id) => {
          const p = PLANS[id];
          return (
            <section key={id} className={`card flex flex-col p-6 ${id === "growth" ? "ring-2 ring-accent" : ""}`}>
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="mt-2 text-3xl font-bold">
                {p.priceMonthly === null ? "Custom" : `$${p.priceMonthly}`}
                <span className="text-sm font-medium text-muted">{p.priceMonthly ? "/mo" : ""}</span>
              </p>
              <p className="mt-2 text-sm text-muted">{p.blurb}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">{p.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
              <Link href="/signup" className={`btn mt-6 ${id === "growth" ? "btn-accent" : "btn-ghost"}`}>
                {id === "free" ? "Start free" : id === "enterprise" ? "Talk to us" : `Choose ${p.name}`}
              </Link>
            </section>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-muted">Paid plans are activated after verified payment confirmation, not on return from checkout.</p>
    </div>
  );
}
