"use client";
import { useState } from "react";
import Link from "next/link";

const CASES = [
  { id: "cleanup", label: "List cleanup", title: "Fix a messy export in minutes.", body: "Normalize websites to clean company domains, flag malformed emails and see which rows are missing the fields you need before anyone writes a message.", steps: ["Import the CSV", "Run domain + email checks", "Export the cleaned list"] },
  { id: "scoring", label: "Lead scoring", title: "Rank leads with a score you can explain.", body: "Every lead gets a 0–100 score from visible rules, with the reasons listed on the row. No black box: you can see exactly why a lead scored 45 or 80.", steps: ["Run the score step", "Sort by score", "Review the listed reasons"] },
  { id: "outbound", label: "Outbound prep", title: "Prepare a list reps can actually work.", body: "Guess likely email patterns, check fit against your ideal customer profile and get a first-line opener that only references facts already in the row.", steps: ["Describe your ICP", "Research selected rows", "Export with openers"] },
  { id: "inbound", label: "Inbound triage", title: "Sort new sign-ups before sales sees them.", body: "Drop in a batch of form fills, score them, and let AI flag which ones look like your customer and which lack the data to tell.", steps: ["Import form fills", "Enrich and score", "Hand off the top tier"] },
  { id: "crm", label: "CRM hygiene", title: "Keep records consistent before they sync.", body: "Standardize domains and spot incomplete contacts in a table first, then export clean CSVs for your CRM's own import tool.", steps: ["Import CRM export", "Standardize and check", "Re-import clean data"] },
];

export function UseCases() {
  const [i, setI] = useState(0);
  const c = CASES[i];
  return (
    <div>
      <div role="tablist" aria-label="Use cases" className="flex flex-wrap gap-2">
        {CASES.map((x, n) => (
          <button key={x.id} role="tab" aria-selected={n === i} onClick={() => setI(n)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${n === i ? "bg-black text-white" : "bg-white text-ink hover:bg-white/70"}`}>
            {x.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-6 grid gap-8 rounded-3xl bg-white p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
        <div>
          <h3 className="display text-3xl md:text-5xl">{c.title}</h3>
          <p className="mt-5 max-w-xl text-lg text-muted">{c.body}</p>
          <Link href="/signup" className="btn btn-primary btn-lg mt-8">Start free trial</Link>
        </div>
        <ol className="space-y-3 self-center">
          {c.steps.map((s, n) => (
            <li key={s} className="flex items-center gap-4 rounded-2xl bg-paper p-4 font-semibold">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-sm">{n + 1}</span>{s}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
