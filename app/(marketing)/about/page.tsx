import { CtaBand, PageHero } from "@/components/marketing/PageHero";

export const metadata = { title: "About" };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Company" title="Lead research without the guesswork" body="ProsAI exists because revenue teams spend hours cleaning lists and still can't explain why one lead outranks another." />
      <div className="mx-auto mt-16 grid max-w-6xl gap-4 px-4 md:grid-cols-3">
        {[["Explain every number", "Scores list their reasons. Enrichment results say what they are and are not."], ["AI as an assistant", "AI interprets computed results and your data. It does not invent facts, and says so when data is thin."], ["Say what's not built", "We name what the product does not do yet so teams can plan around it."]].map(([t, d]) => (
          <section key={t} className="rounded-3xl bg-white p-8"><h2 className="text-2xl font-semibold">{t}</h2><p className="mt-3 text-muted">{d}</p></section>
        ))}
      </div>
      <section className="mx-auto mt-6 max-w-6xl px-4">
        <div className="rounded-3xl bg-sky p-8 md:p-12">
          <h2 className="display text-3xl md:text-4xl">Independent by design</h2>
          <p className="mt-4 max-w-3xl text-black/70">ProsAI is an independent product with its own brand, design and code. It is not affiliated with or endorsed by any other company.</p>
        </div>
      </section>
      <CtaBand title="Build your first table today" />
    </>
  );
}
