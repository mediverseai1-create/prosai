import { CtaBand, PageHero } from "@/components/marketing/PageHero";

export const metadata = { title: "Security" };

const ITEMS = [
  ["Workspace isolation", "Every table and row belongs to a workspace, and database row-level security policies restrict access to that workspace's members."],
  ["Server-side secrets", "The Supabase service-role key, AI key and payment webhook secret are server-only environment variables and never reach the browser."],
  ["Verified billing", "Paid plans activate only when a payment confirmation with a valid HMAC signature reaches our server. Returning from checkout never upgrades an account."],
  ["Protected usage and plans", "Subscription and usage records can be written only by the server, so a user cannot raise their own plan or edit their usage."],
  ["Validated input", "Every API route validates its input on the server and enforces plan limits before doing work."],
  ["AI boundaries", "The AI receives only the row being assessed and your ICP. Row values are treated as untrusted data, and responses are schema-validated before they are saved."],
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Security" title="Your lead data stays yours" body="What the application does today to keep workspaces separate and billing trustworthy." />
      <div className="mx-auto mt-16 grid max-w-6xl gap-4 px-4 md:grid-cols-2">
        {ITEMS.map(([t, d]) => (
          <section key={t} className="rounded-3xl bg-white p-8"><h2 className="text-2xl font-semibold">{t}</h2><p className="mt-3 text-muted">{d}</p></section>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-6xl px-4 text-sm text-muted">This page describes application controls. It is not a compliance certification; no third-party audit is claimed.</p>
      <CtaBand title="Try it with a small list first" />
    </>
  );
}
