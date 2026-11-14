import Link from "next/link";

const steps = [
  { n: "01", title: "Import", body: "Drop in a CSV of people or companies. Columns are detected automatically and stored in your private workspace.", tint: "bg-sky" },
  { n: "02", title: "Enrich", body: "Run transparent rules: normalize domains, check email syntax, suggest address patterns and score leads 0–100.", tint: "bg-lime" },
  { n: "03", title: "Research", body: "Ask AI to judge fit against your ideal customer profile, using only the data in the row and the scores computed above.", tint: "bg-sun" },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20">
        <p className="mb-4 inline-block rounded-full bg-lime px-3 py-1 text-xs font-semibold text-black">Lead research workbench</p>
        <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Turn a raw lead list into a ranked, researched pipeline.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          ProsAI is a spreadsheet-style workbench for revenue teams. Import contacts, enrich them with rules you can read, and get AI assessments that cite your own data instead of guessing.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className="btn btn-accent">Start free</Link>
          <Link href="/features" className="btn btn-ghost">See how it works</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-3" aria-label="How it works">
        {steps.map((s) => (
          <div key={s.n} className="card p-6">
            <span className={`inline-grid h-10 w-10 place-items-center rounded-xl text-sm font-bold text-black ${s.tint}`}>{s.n}</span>
            <h2 className="mt-4 text-xl font-semibold">{s.title}</h2>
            <p className="mt-2 text-muted">{s.body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="card grid gap-8 p-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Numbers are computed. AI explains them.</h2>
            <p className="mt-3 text-muted">Scores, domains and email checks come from deterministic rules. The AI layer interprets those results against your ICP and tells you when the data is too thin to judge.</p>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="rounded-xl bg-paper p-4"><b>Usage you can see.</b> Every enrichment and research run is metered in actions, with limits shown in your dashboard.</li>
            <li className="rounded-xl bg-paper p-4"><b>Private by default.</b> Row-level security keeps each workspace&apos;s data isolated.</li>
            <li className="rounded-xl bg-paper p-4"><b>Honest about scope.</b> Built-in enrichment uses your data only. Third-party data providers are not connected yet.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
