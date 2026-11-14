import Link from "next/link";
import { HeroScene } from "@/components/marketing/HeroScene";
import { UseCases } from "@/components/marketing/UseCases";
import { Faq } from "@/components/marketing/Faq";
import { ExportMock, ResearchMock, ScoreMock, TableMock } from "@/components/marketing/Mocks";
import { COSTS, PLANS, PUBLIC_PLANS } from "@/lib/plans";
import { STEPS } from "@/lib/enrich";

const FACTS = [
  ["4", "built-in enrichment steps"],
  ["0–100", "lead score with listed reasons"],
  [`${COSTS.aiResearch} actions`, "per AI-researched row"],
  ["0", "charges for failed runs"],
];

const BLOCKS = [
  { tag: "Workbench", title: "One table for every lead you're working", body: "Import a CSV and your columns become a live table. Select rows, run steps on just those, and watch new columns fill in. Nothing is hidden in a separate tool.", cta: "Explore the workbench", href: "/features", visual: <TableMock />, bg: "bg-sky" },
  { tag: "Enrichment", title: "Rules you can read, scores you can defend", body: "Normalize domains, check emails, suggest address patterns and score every lead 0–100. Each score lists the reasons behind it, so nobody has to trust a mystery number.", cta: "See the steps", href: "/features#steps", visual: <ScoreMock />, bg: "bg-lime" },
  { tag: "AI research", title: "AI that tells you when it doesn't know", body: "Describe your ideal customer once. For each row the AI returns a fit rating, reasons and an opener grounded in the data you supplied, and says \"unclear\" when the data is too thin.", cta: "How research works", href: "/features#research", visual: <ResearchMock />, bg: "bg-sun" },
  { tag: "Handoff", title: "Export a list your team can act on", body: "Download the enriched table as CSV with scores, fit ratings and openers included, ready for your CRM's import or your outreach tool of choice.", cta: "Start free", href: "/signup", visual: <ExportMock />, bg: "bg-rose" },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate min-h-[640px] overflow-hidden bg-green md:min-h-[760px]">
        <HeroScene />
        <div className="relative mx-auto flex min-h-[640px] max-w-6xl flex-col justify-end gap-8 px-4 pb-16 pt-32 md:min-h-[760px] md:flex-row md:items-end md:justify-between md:pb-20">
          <h1 className="display max-w-2xl text-[3.25rem] text-white drop-shadow-sm sm:text-7xl md:text-[5.5rem]">
            Turn lead lists into a pipeline you trust
          </h1>
          <div className="max-w-xs">
            <p className="text-lg font-medium text-white">A workbench to import, enrich and research leads, with every number explained.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/signup" className="btn btn-primary btn-lg">Start free trial →</Link>
              <Link href="/features" className="btn btn-accent btn-lg">See the product</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FACT STRIP (product facts, not customer claims) */}
      <section aria-label="Product facts" className="-mt-10 relative z-10 mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-6 rounded-3xl bg-white p-8 shadow-sm md:grid-cols-4 md:p-10">
          {FACTS.map(([n, l]) => (
            <div key={l}><p className="display text-3xl md:text-4xl">{n}</p><p className="mt-2 text-sm text-muted">{l}</p></div>
          ))}
        </div>
      </section>

      {/* USE CASES */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <p className="eyebrow text-green">Built for revenue teams</p>
        <h2 className="display mt-3 max-w-3xl text-4xl md:text-6xl">Revenue teams build with ProsAI</h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">Pick the job. The same table, steps and AI research adapt to it.</p>
        <div className="mt-8 rounded-[2rem] bg-sky/60 p-4 md:p-6"><UseCases /></div>
      </section>

      {/* FEATURE BLOCKS */}
      <div className="mx-auto mt-24 max-w-6xl space-y-6 px-4">
        {BLOCKS.map((b, i) => (
          <section key={b.tag} className={`grid items-center gap-8 rounded-[2rem] p-6 md:grid-cols-2 md:gap-14 md:p-14 ${b.bg}`}>
            <div className={i % 2 ? "md:order-2" : ""}>
              <p className="eyebrow">{b.tag}</p>
              <h2 className="display mt-3 text-4xl md:text-5xl">{b.title}</h2>
              <p className="mt-5 text-lg text-black/70">{b.body}</p>
              <Link href={b.href} className="btn btn-primary btn-lg mt-8">{b.cta}</Link>
            </div>
            <div className={i % 2 ? "md:order-1" : ""}>{b.visual}</div>
          </section>
        ))}
      </div>

      {/* STEPS */}
      <section id="steps" className="mx-auto mt-24 max-w-6xl px-4">
        <p className="eyebrow text-green">Built-in enrichment</p>
        <h2 className="display mt-3 max-w-3xl text-4xl md:text-6xl">Four steps, no black boxes</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="rounded-3xl bg-white p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent font-bold">{i + 1}</span>
              <h3 className="mt-4 text-xl font-semibold">{s.label}</h3>
              <p className="mt-2 text-sm text-muted">{s.help}</p>
              <p className="mt-4 text-xs font-semibold text-green">{COSTS.enrichStep} action per row</p>
            </div>
          ))}
        </div>
      </section>

      {/* HONEST SCOPE (dark panel) */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <div className="grid gap-10 rounded-[2rem] bg-green p-8 text-white md:grid-cols-2 md:p-14">
          <div>
            <p className="eyebrow text-accent">Principles</p>
            <h2 className="display mt-3 text-4xl md:text-5xl">Numbers are computed. AI explains them.</h2>
            <p className="mt-5 text-lg text-white/75">Scores, domains and email checks come from deterministic rules. The AI layer interprets those results against your profile and is explicit when it lacks the data to judge.</p>
          </div>
          <ul className="space-y-3">
            {[["Usage you can see", "Every step and research run is metered in actions, with limits shown on your dashboard."], ["Private by default", "Row-level security isolates each workspace's data in the database."], ["Honest about scope", "Built-in enrichment uses your data. Third-party data vendors and CRM sync are not connected yet."]].map(([t, d]) => (
              <li key={t} className="rounded-2xl bg-white/10 p-5"><b>{t}</b><p className="mt-1 text-sm text-white/75">{d}</p></li>
            ))}
          </ul>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <p className="eyebrow text-green">Pricing</p>
        <h2 className="display mt-3 max-w-3xl text-4xl md:text-6xl">Start free. Pay for the work you run.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PUBLIC_PLANS.map((id) => {
            const p = PLANS[id];
            return (
              <div key={id} className={`rounded-3xl p-6 ${id === "growth" ? "bg-black text-white" : "bg-white"}`}>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="display mt-3 text-4xl">{p.priceMonthly === null ? "Custom" : `$${p.priceMonthly}`}<span className="text-sm font-medium opacity-60">{p.priceMonthly ? "/mo" : ""}</span></p>
                <p className={`mt-3 text-sm ${id === "growth" ? "text-white/70" : "text-muted"}`}>{p.blurb}</p>
                <p className="mt-4 text-sm font-semibold">{p.actions.toLocaleString()} actions / month</p>
              </div>
            );
          })}
        </div>
        <Link href="/pricing" className="btn btn-primary btn-lg mt-8">Compare plans</Link>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto mt-24 max-w-4xl scroll-mt-24 px-4">
        <h2 className="display text-4xl md:text-6xl">Questions, answered plainly</h2>
        <div className="mt-8"><Faq /></div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-green px-6 py-20 text-center text-white md:py-28">
          <h2 className="display mx-auto max-w-3xl text-4xl md:text-6xl">Turn your next lead list into ranked, researched pipeline</h2>
          <p className="mx-auto mt-5 max-w-xl text-white/75">Create a free workspace, import a CSV and see the first scores in minutes.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn btn-cream btn-lg">Start free trial →</Link>
            <Link href="/pricing" className="btn btn-accent btn-lg">View pricing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
