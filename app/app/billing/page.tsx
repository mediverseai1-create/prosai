import { creditsUsed, requireContext } from "@/lib/session";
import { PLANS, type PlanId } from "@/lib/plans";

export const metadata = { title: "Billing & usage" };

function checkoutUrl(link: string | null, orgId: string) {
  if (!link) return null;
  try {
    const u = new URL(link);
    u.searchParams.set("client_reference_id", orgId); // lets the confirmation webhook map payment → workspace
    return u.toString();
  } catch { return null; }
}

export default async function Page() {
  const ctx = await requireContext();
  const used = await creditsUsed(ctx.org.id);
  const pct = Math.min(100, Math.round((used / ctx.plan.actions) * 100));
  const upgrades: PlanId[] = ["launch", "growth", "enterprise"];
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Billing &amp; usage</h1>
      <div className="card mt-6 p-6">
        <p className="text-sm text-muted">Current plan</p>
        <p className="text-2xl font-bold">{ctx.plan.name} <span className="text-sm font-medium text-muted">({ctx.status})</span></p>
        <p className="mt-4 text-sm">{used.toLocaleString()} of {ctx.plan.actions.toLocaleString()} actions used this month ({pct}%). Resets on the 1st (UTC).</p>
        <div className="mt-2 h-2 rounded-full bg-paper"><div className="h-2 rounded-full bg-accent" style={{ width: `${pct}%` }} /></div>
        <p className="mt-3 text-sm text-muted">Row limit per table: {ctx.plan.rowsPerTable.toLocaleString()}</p>
      </div>
      <h2 className="mt-8 text-xl font-semibold">Upgrade</h2>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {upgrades.map((id) => {
          const p = PLANS[id];
          const url = checkoutUrl(p.paymentLink, ctx.org.id);
          return (
            <div key={id} className="card p-5">
              <h3 className="font-semibold">{p.name} — ${p.priceMonthly}/mo</h3>
              <p className="mt-1 text-sm text-muted">{p.actions.toLocaleString()} actions, {p.rowsPerTable.toLocaleString()} rows per table.</p>
              {ctx.plan.id === id ? <p className="mt-4 text-sm font-medium">Your current plan</p>
                : url ? <a className="btn btn-accent mt-4" href={url}>Upgrade to {p.name}</a>
                : <p className="mt-4 text-sm text-muted">Payment link not configured yet.</p>}
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-muted">Your plan changes only after we receive verified payment confirmation, which can take a moment after checkout. To cancel or downgrade, contact support.</p>
    </div>
  );
}
