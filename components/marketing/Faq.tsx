export const FAQS = [
  { q: "What does ProsAI actually do?", a: "It is a spreadsheet-style workbench for lead lists. You import a CSV, run enrichment steps that follow readable rules, ask AI to assess fit against your ideal customer profile, and export the result." },
  { q: "Where does the data come from?", a: "From your own CSV. Built-in enrichment works on the fields you import. ProsAI does not currently connect to third-party data vendors or browse the web, and the AI is told it has no web access." },
  { q: "Can the AI make things up?", a: "The AI is instructed to use only the row data and the computed scores, to say \"unclear\" when data is thin, and its output is validated against a strict schema before it is saved. Treat it as an assistant, not a source of record." },
  { q: "How are actions counted?", a: "Each enrichment step costs 1 action per row and each AI-researched row costs 5. Runs that fail are not charged. Your usage is shown on the dashboard and billing page." },
  { q: "How do paid plans get activated?", a: "Plans change only after a verified payment confirmation reaches our server. Returning from a checkout page never upgrades an account by itself." },
  { q: "Is my data private?", a: "Each workspace's data is isolated with database row-level security, and sensitive writes happen only on the server. See the Security page for details." },
  { q: "Does it sync with my CRM or send emails?", a: "Not yet. You can export clean CSVs for your CRM's import tool. CRM sync, sequencing and workflow automation are not part of this version." },
];

export function Faq() {
  return (
    <div className="divide-y divide-line rounded-3xl bg-white">
      {FAQS.map((f) => (
        <details key={f.q} className="faq group px-6 py-5 md:px-8">
          <summary className="flex items-center justify-between gap-4 text-lg font-semibold">
            {f.q}
            <span aria-hidden className="plus grid h-8 w-8 shrink-0 place-items-center rounded-full bg-paper text-xl transition-transform">+</span>
          </summary>
          <p className="mt-3 max-w-3xl text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
