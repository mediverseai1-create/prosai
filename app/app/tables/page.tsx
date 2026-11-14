import Link from "next/link";
import { requireContext } from "@/lib/session";
import { NewTableForm } from "@/components/NewTableForm";

export const metadata = { title: "Lead tables" };

export default async function Page() {
  const ctx = await requireContext();
  const { data: tables } = await ctx.supabase
    .from("lead_tables").select("id, name, created_at").order("created_at", { ascending: false });
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Lead tables</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <ul className="space-y-3">
          {(tables ?? []).map((t) => (
            <li key={t.id}>
              <Link href={`/app/tables/${t.id}`} className="card block p-4 hover:border-accent">
                <span className="font-semibold">{t.name}</span>
                <span className="block text-xs text-muted">Created {new Date(t.created_at).toLocaleDateString()}</span>
              </Link>
            </li>
          ))}
          {!tables?.length && <li className="card p-6 text-muted">No tables yet. Import your first CSV to begin.</li>}
        </ul>
        <NewTableForm maxRows={ctx.plan.rowsPerTable} />
      </div>
    </div>
  );
}
