import { STEPS } from "@/lib/enrich";
import { COSTS } from "@/lib/plans";
import { CtaBand, PageHero } from "@/components/marketing/PageHero";
import { ExportMock, ResearchMock, ScoreMock, TableMock } from "@/components/marketing/Mocks";

export const metadata = { title: "Product" };

const SECTIONS = [
  { id: "tables", tag: "Lead tables", title: "A spreadsheet-style table for every list", body: "Create a table, import a CSV, and your columns are detected automatically. Browse rows, select the ones you care about and run steps on just those.", points: ["Columns detected from your CSV headers", "Row selection for targeted runs", "Per-table row limits shown by plan"], visual: <TableMock />, bg: "bg-sky" },
  { id: "steps", tag: "Enrichment", title: "Transparent enrichment steps", body: `Each step works only on the fields in your row and costs ${COSTS.enrichStep} action per row. Results are labelled for what they are: a syntax check is not deliverability verification, and an email guess is not a verified address.`, points: STEPS.map((s) => `${s.label}: ${s.help}`), visual: <ScoreMock />, bg: "bg-lime" },
  { id: "research", tag: "AI research", title: "Structured, grounded AI assessments", body: `Add your ideal customer profile in Settings. For each selected row the AI returns a summary, a fit rating, up to five reasons and a one-line opener. It has no web access, is told never to invent facts, and its output is validated before saving. Each row costs ${COSTS.aiResearch} actions; failures are not charged.`, points: ["Fit: high, medium, low or unclear", "Reasons cite your data and computed scores", "Small batches with clear errors"], visual: <ResearchMock />, bg: "bg-sun" },
  { id: "export", tag: "Export", title: "Take results anywhere with CSV", body: "Export the table, enrichment columns and AI output as a CSV file for your CRM's importer or any outreach tool.", points: ["One click from the table view", "Includes score, reasons and AI fields", "No lock-in"], visual: <ExportMock />, bg: "bg-rose" },
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Product" title="Everything between a raw CSV and a ready list" body="Import, enrich, research and export in one workbench, with usage metering and plan limits built in." />
      <div className="mx-auto mt-16 max-w-6xl space-y-6 px-4">
        {SECTIONS.map((s, i) => (
          <section key={s.id} id={s.id} className={`grid scroll-mt-24 items-center gap-8 rounded-[2rem] p-6 md:grid-cols-2 md:gap-14 md:p-14 ${s.bg}`}>
            <div className={i % 2 ? "md:order-2" : ""}>
              <p className="eyebrow">{s.tag}</p>
              <h2 className="display mt-3 text-4xl md:text-5xl">{s.title}</h2>
              <p className="mt-5 text-lg text-black/70">{s.body}</p>
              <ul className="mt-6 space-y-2 text-sm">{s.points.map((p) => <li key={p} className="rounded-xl bg-white/70 px-4 py-2.5">✓ {p}</li>)}</ul>
            </div>
            <div className={i % 2 ? "md:order-1" : ""}>{s.visual}</div>
          </section>
        ))}
      </div>
      <section className="mx-auto mt-16 max-w-6xl px-4">
        <h2 className="display text-3xl md:text-5xl">Workspace, usage and billing</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[["Dashboard", "See total rows, actions used this month and your plan at a glance."], ["Billing & usage", "A clear view of your plan, monthly action allowance and subscription status."], ["Settings", "Name your workspace and describe your ideal customer so AI research can judge fit."]].map(([t, d]) => (
            <div key={t} className="rounded-3xl bg-white p-6"><h3 className="text-xl font-semibold">{t}</h3><p className="mt-2 text-muted">{d}</p></div>
          ))}
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="rounded-3xl bg-white p-8">
          <h2 className="text-2xl font-semibold">Not in this version</h2>
          <p className="mt-2 max-w-3xl text-muted">Third-party data vendor connections, CRM sync, email sequencing and visual workflow automation are not built yet. We would rather say so than imply otherwise.</p>
        </div>
      </section>
      <CtaBand title="See it on your own list" />
    </>
  );
}
