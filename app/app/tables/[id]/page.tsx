import { notFound } from "next/navigation";
import { requireContext } from "@/lib/session";
import { isAiConfigured } from "@/lib/ai";
import { Workbench, type RowRecord } from "@/components/Workbench";

export const metadata = { title: "Lead table" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const ctx = await requireContext();
  const { data: table } = await ctx.supabase.from("lead_tables").select("id, name, columns").eq("id", id).maybeSingle();
  if (!table) notFound();
  const { data: rows, count } = await ctx.supabase
    .from("lead_rows").select("id, data, enrichment, ai", { count: "exact" })
    .eq("table_id", id).order("created_at").limit(500);
  return (
    <Workbench
      tableId={table.id} name={table.name} columns={table.columns}
      rows={(rows ?? []) as RowRecord[]} totalRows={count ?? 0} aiReady={isAiConfigured()}
    />
  );
}
