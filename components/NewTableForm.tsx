"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";

export function NewTableForm({ maxRows }: { maxRows: number }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Give the table a name.");
    setBusy(true);
    try {
      let rows: Record<string, string>[] = [];
      let columns: string[] = [];
      if (file) {
        const parsed = await new Promise<Papa.ParseResult<Record<string, string>>>((res, rej) =>
          Papa.parse<Record<string, string>>(file, { header: true, skipEmptyLines: true, complete: res, error: rej }),
        );
        columns = (parsed.meta.fields ?? []).filter(Boolean);
        rows = parsed.data;
        if (!columns.length || !rows.length) throw new Error("That CSV has no header row or no data.");
      }
      const r = await fetch("/api/tables", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, columns }) });
      const t = await r.json();
      if (!r.ok) throw new Error(t.error ?? "Could not create the table.");
      for (let i = 0; i < rows.length; i += 500) {
        const ir = await fetch(`/api/tables/${t.id}/import`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rows: rows.slice(i, i + 500) }) });
        if (!ir.ok) { const j = await ir.json(); throw new Error(j.error ?? "Import failed."); }
      }
      router.push(`/app/tables/${t.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-5 self-start">
      <h2 className="font-semibold">New table</h2>
      <label className="block text-sm font-medium">Name
        <input className="input mt-1.5" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required />
      </label>
      <label className="block text-sm font-medium">CSV file (optional)
        <input className="mt-1.5 block w-full text-sm" type="file" accept=".csv,text/csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>
      <p className="text-xs text-muted">First row must be headers. Up to {maxRows.toLocaleString()} rows on your plan.</p>
      {error && <p role="alert" className="rounded-lg bg-rose/60 px-3 py-2 text-sm">{error}</p>}
      <button className="btn btn-primary w-full" disabled={busy}>{busy ? "Importing…" : "Create table"}</button>
    </form>
  );
}
