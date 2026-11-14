import Link from "next/link";
import { creditsUsed, requireContext } from "@/lib/session";

export const metadata = { title: "Overview" };

export default async function Page() {
  const ctx = await requireContext();
  const used = await creditsUsed(ctx.org.id);
  const [{ count: tables }, { count: rows }] = await Promise.all([
    ctx.supabase.from("lead_tables").select("id", { count: "exact", head: true }),
    ctx.supabase.from("lead_rows").select("id", { count: "exact", head: true }),
  ]);
  const pct = Math.min(100, Math.round((used / ctx.plan.actions) * 100));
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-muted">Lead tables</p><p className="mt-1 text-3xl font-bold">{tables ?? 0}</p></div>
        <div className="card p-5"><p className="text-sm text-muted">Total rows</p><p className="mt-1 text-3xl font-bold">{rows ?? 0}</p></div>
        <div className="card p-5">
          <p className="text-sm text-muted">Actions this month</p>
          <p className="mt-1 text-3xl font-bold">{used.toLocaleString()} <span className="text-base font-medium text-muted">/ {ctx.plan.actions.toLocaleString()}</span></p>
          <div className="mt-3 h-2 rounded-full bg-paper" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><div className="h-2 rounded-full bg-accent" style={{ width: `${pct}%` }} /></div>
        </div>
      </div>
      {(tables ?? 0) === 0 && (
        <div className="card mt-6 p-8 text-center">
          <h2 className="text-xl font-semibold">Start with a lead list</h2>
          <p className="mx-auto mt-2 max-w-md text-muted">Import a CSV with columns like name, title, company, email and website. Then enrich and research it.</p>
          <Link href="/app/tables" className="btn btn-accent mt-5">Create your first table</Link>
        </div>
      )}
      {!ctx.org.icp && (
        <p className="mt-6 text-sm text-muted">Tip: describe your ideal customer in <Link className="underline" href="/app/settings">Settings</Link> so AI research can judge fit.</p>
      )}
    </div>
  );
}
