"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { STEPS, type EnrichmentStep } from "@/lib/enrich";
import { COSTS } from "@/lib/plans";

export type RowRecord = {
  id: string;
  data: Record<string, string>;
  enrichment: Record<string, unknown>;
  ai: { summary: string; fit: string; reasons: string[]; opener: string } | null;
};

export function Workbench({ tableId, name, columns, rows, totalRows, aiReady }: {
  tableId: string; name: string; columns: string[]; rows: RowRecord[]; totalRows: number; aiReady: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [steps, setSteps] = useState<Set<EnrichmentStep>>(new Set(["domain", "email_check", "score"]));
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [open, setOpen] = useState<RowRecord | null>(null);

  const visibleCols = useMemo(() => columns.slice(0, 6), [columns]);
  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  async function call(path: string, body: unknown, label: string) {
    setBusy(label); setNotice(null);
    try {
      const r = await fetch(`/api/tables/${tableId}/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Request failed");
      router.refresh();
      return j;
    } catch (e) {
      setNotice({ kind: "err", text: e instanceof Error ? e.message : "Request failed" });
    } finally { setBusy(""); }
  }

  async function enrich() {
    const j = await call("enrich", { steps: [...steps], rowIds: selected.size ? [...selected] : undefined }, "enrich");
    if (j) setNotice({ kind: "ok", text: `Enriched ${j.enriched} rows using ${j.creditsUsed} actions.${j.truncated ? " Stopped early: not enough actions left." : ""}${j.failed ? ` ${j.failed} failed.` : ""}` });
  }
  async function research() {
    if (!selected.size) return setNotice({ kind: "err", text: "Select 1–10 rows to research." });
    const j = await call("research", { rowIds: [...selected].slice(0, 10) }, "research");
    if (j) setNotice({ kind: "ok", text: `Researched ${j.researched} rows using ${j.creditsUsed} actions.${j.failed ? ` ${j.failed} failed and were not charged.` : ""}` });
  }
  function exportCsv() {
    const flat = rows.map((r) => ({
      ...r.data,
      ...Object.fromEntries(Object.entries(r.enrichment).map(([k, v]) => [`enriched_${k}`, Array.isArray(v) ? v.join("; ") : v ?? ""])),
      ...(r.ai ? { ai_fit: r.ai.fit, ai_summary: r.ai.summary, ai_opener: r.ai.opener } : {}),
    }));
    const blob = new Blob([Papa.unparse(flat)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `${name}.csv`; a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
      <p className="mt-1 text-sm text-muted">{totalRows.toLocaleString()} rows{totalRows > rows.length ? ` (showing first ${rows.length})` : ""} · {selected.size} selected</p>

      <section className="card mt-6 p-4" aria-label="Actions">
        <fieldset>
          <legend className="text-sm font-semibold">Enrichment steps <span className="font-normal text-muted">({COSTS.enrichStep} action per row per step)</span></legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {STEPS.map((s) => (
              <label key={s.id} title={s.help} className="flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm">
                <input type="checkbox" checked={steps.has(s.id)} onChange={() => setSteps((p) => { const n = new Set(p); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n; })} />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={enrich} disabled={!!busy || !steps.size || !rows.length}>
            {busy === "enrich" ? "Enriching…" : selected.size ? `Enrich ${selected.size} selected` : "Enrich all rows"}
          </button>
          <button className="btn btn-accent" onClick={research} disabled={!!busy || !aiReady} title={aiReady ? "" : "AI is not configured"}>
            {busy === "research" ? "Researching…" : `AI research (${COSTS.aiResearch}/row)`}
          </button>
          <button className="btn btn-ghost" onClick={exportCsv} disabled={!rows.length}>Export CSV</button>
        </div>
        {!aiReady && <p className="mt-2 text-xs text-muted">AI research is unavailable until GEMINI_API_KEY is set on the server.</p>}
        {notice && <p role={notice.kind === "err" ? "alert" : "status"} className={`mt-3 rounded-lg px-3 py-2 text-sm ${notice.kind === "err" ? "bg-rose/60" : "bg-lime/60"}`}>{notice.text}</p>}
      </section>

      {rows.length === 0 ? (
        <p className="card mt-6 p-8 text-center text-muted">This table has no rows yet.</p>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase text-muted">
              <tr>
                <th className="p-3"><span className="sr-only">Select</span></th>
                {visibleCols.map((c) => <th key={c} className="p-3">{c}</th>)}
                <th className="p-3">Score</th><th className="p-3">Email</th><th className="p-3">AI fit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="cursor-pointer border-b border-line last:border-0 hover:bg-paper" onClick={() => setOpen(r)}>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" aria-label="Select row" checked={selected.has(r.id)} onChange={() => toggle(r.id)} />
                  </td>
                  {visibleCols.map((c) => <td key={c} className="max-w-[14rem] truncate p-3">{r.data[c]}</td>)}
                  <td className="p-3 font-semibold">{r.enrichment.score !== undefined ? String(r.enrichment.score) : "—"}</td>
                  <td className="p-3">{r.enrichment.email_status ? String(r.enrichment.email_status) : "—"}</td>
                  <td className="p-3">{r.ai?.fit ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Row details" className="fixed inset-0 z-10 flex justify-end bg-black/40" onClick={() => setOpen(null)}>
          <aside className="h-full w-full max-w-md overflow-y-auto bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <button className="btn btn-ghost mb-4" onClick={() => setOpen(null)}>Close</button>
            <h2 className="font-semibold">Row data</h2>
            <dl className="mt-2 space-y-1 text-sm">{Object.entries(open.data).map(([k, v]) => <div key={k}><dt className="inline text-muted">{k}: </dt><dd className="inline">{v}</dd></div>)}</dl>
            <h2 className="mt-6 font-semibold">Enrichment</h2>
            {Object.keys(open.enrichment).length === 0 ? <p className="text-sm text-muted">Not enriched yet.</p> : (
              <dl className="mt-2 space-y-1 text-sm">{Object.entries(open.enrichment).map(([k, v]) => <div key={k}><dt className="inline text-muted">{k}: </dt><dd className="inline">{Array.isArray(v) ? v.join("; ") : String(v ?? "—")}</dd></div>)}</dl>
            )}
            <h2 className="mt-6 font-semibold">AI research</h2>
            {!open.ai ? <p className="text-sm text-muted">Not researched yet.</p> : (
              <div className="mt-2 space-y-2 text-sm">
                <p><b>Fit:</b> {open.ai.fit}</p><p>{open.ai.summary}</p>
                <ul className="list-disc pl-5">{open.ai.reasons.map((x) => <li key={x}>{x}</li>)}</ul>
                <p className="rounded-lg bg-paper p-3"><b>Opener:</b> {open.ai.opener}</p>
                <p className="text-xs text-muted">Generated from this row&apos;s data only; verify before outreach.</p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
