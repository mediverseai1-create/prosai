import Link from "next/link";
import { STEPS } from "@/lib/enrich";

export const metadata = { title: "Features" };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">What&apos;s inside the workbench</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-xl font-semibold">Lead tables</h2>
          <p className="mt-2 text-muted">Import CSVs, browse rows, select records and export the enriched result back to CSV.</p>
        </section>
        <section className="card p-6">
          <h2 className="text-xl font-semibold">AI research</h2>
          <p className="mt-2 text-muted">Structured assessments — summary, fit rating, reasons and an outreach opener — grounded in each row and your workspace&apos;s ideal customer profile.</p>
        </section>
        <section className="card p-6 md:col-span-2">
          <h2 className="text-xl font-semibold">Built-in enrichment steps</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {STEPS.map((s) => (
              <li key={s.id} className="rounded-xl bg-paper p-4"><b>{s.label}</b><p className="mt-1 text-sm text-muted">{s.help}</p></li>
            ))}
          </ul>
        </section>
        <section className="card p-6 md:col-span-2">
          <h2 className="text-xl font-semibold">Plans and usage</h2>
          <p className="mt-2 text-muted">Each plan includes monthly actions and a per-table row limit. See your usage and plan any time from the billing page.</p>
          <Link href="/pricing" className="btn btn-primary mt-4">View pricing</Link>
        </section>
      </div>
    </div>
  );
}
