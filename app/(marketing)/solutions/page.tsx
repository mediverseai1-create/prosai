import { CtaBand, PageHero } from "@/components/marketing/PageHero";

export const metadata = { title: "Solutions" };

const ITEMS = [
  { id: "cleanup", title: "List cleanup", who: "Ops and marketing teams", body: "Event exports, purchased lists and old CRM dumps are rarely clean. Normalize websites to domains, flag malformed or free-mail addresses and see exactly which rows are missing the fields you need.", flow: ["Import the file", "Run domain and email checks", "Export the cleaned table"] },
  { id: "scoring", title: "Lead scoring", who: "Sales and RevOps", body: "Score every lead from 0 to 100 using visible rules for title seniority and data completeness. Each score lists its reasons, so reps and managers can debate the rules rather than the number.", flow: ["Run the score step", "Sort highest first", "Review the reasons"] },
  { id: "outbound", title: "Outbound prep", who: "SDRs and founders", body: "Describe who you sell to, research a shortlist and get a fit rating with reasons and an opener that references only facts in the row. Unverified email guesses are labelled as guesses.", flow: ["Set your ICP", "Research selected rows", "Export with openers"] },
  { id: "inbound", title: "Inbound triage", who: "Growth and sales teams", body: "Import a batch of form fills, score them and let AI separate likely-fit leads from rows with too little data to judge, before anyone spends time on follow-up.", flow: ["Import the batch", "Enrich and score", "Route the top tier"] },
  { id: "agencies", title: "Agencies and consultants", who: "Teams serving several clients", body: "Keep each client's list in its own table, apply the same transparent rules across them and hand back clean, scored exports.", flow: ["One table per client", "Same steps every time", "Deliver CSVs"] },
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Solutions" title="Where teams use ProsAI" body="Different jobs, one workbench: import a list, run the steps that matter and export something your team can act on." />
      <div className="mx-auto mt-16 max-w-6xl space-y-6 px-4">
        {ITEMS.map((s) => (
          <section key={s.id} id={s.id} className="grid scroll-mt-24 gap-8 rounded-[2rem] bg-white p-8 md:grid-cols-[1.3fr_1fr] md:p-12">
            <div>
              <p className="eyebrow text-green">{s.who}</p>
              <h2 className="display mt-3 text-4xl md:text-5xl">{s.title}</h2>
              <p className="mt-5 text-lg text-muted">{s.body}</p>
            </div>
            <ol className="space-y-3 self-center">
              {s.flow.map((f, n) => (
                <li key={f} className="flex items-center gap-4 rounded-2xl bg-paper p-4 font-semibold"><span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-sm">{n + 1}</span>{f}</li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      <CtaBand title="Pick a job and try it free" />
    </>
  );
}
