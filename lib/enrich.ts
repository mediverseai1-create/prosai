// Deterministic, provider-free enrichment. No third-party data is fetched here;
// results are derived only from the row's own fields and are labelled as such.

export type Row = Record<string, string>;
export type EnrichmentStep = "domain" | "email_check" | "email_guess" | "score";
export const STEPS: { id: EnrichmentStep; label: string; help: string }[] = [
  { id: "domain", label: "Company domain", help: "Normalize a website or email into a bare domain." },
  { id: "email_check", label: "Email check", help: "Syntax check, free-mail and role-address flags. Does not verify deliverability." },
  { id: "email_guess", label: "Email pattern guess", help: "Suggest first.last@domain. Unverified guess." },
  { id: "score", label: "Lead score", help: "Rule-based 0–100 score from title seniority and data completeness." },
];

const FREE = new Set(["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "proton.me", "protonmail.com", "aol.com"]);
const ROLE = new Set(["info", "sales", "support", "admin", "contact", "hello", "team", "office"]);

function pick(row: Row, names: string[]): string {
  const keys = Object.keys(row);
  for (const n of names) {
    const k = keys.find((x) => x.toLowerCase().replace(/[\s_-]/g, "") === n);
    if (k && row[k]?.trim()) return row[k].trim();
  }
  return "";
}

export const field = {
  email: (r: Row) => pick(r, ["email", "emailaddress", "workemail"]),
  website: (r: Row) => pick(r, ["website", "domain", "url", "companywebsite", "companydomain"]),
  first: (r: Row) => pick(r, ["firstname", "first"]),
  last: (r: Row) => pick(r, ["lastname", "last"]),
  name: (r: Row) => pick(r, ["name", "fullname"]),
  title: (r: Row) => pick(r, ["title", "jobtitle", "role", "position"]),
  company: (r: Row) => pick(r, ["company", "companyname", "organization"]),
  size: (r: Row) => pick(r, ["employees", "companysize", "size", "headcount"]),
};

export function normalizeDomain(input: string): string | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  const host = s.includes("@")
    ? s.split("@").pop()!
    : s.replace(/^[a-z]+:\/\//, "").split(/[/?#]/)[0];
  const d = host.replace(/^www\./, "").replace(/:\d+$/, "");
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(d) ? d : null;
}

export function seniority(title: string): { level: string; points: number } {
  const t = title.toLowerCase();
  if (/\b(founder|co-founder|ceo|cto|cfo|coo|cmo|chief|owner|president)\b/.test(t)) return { level: "C-level / founder", points: 40 };
  if (/\b(vp|vice president|head of)\b/.test(t)) return { level: "VP / head", points: 32 };
  if (/\bdirector\b/.test(t)) return { level: "Director", points: 26 };
  if (/\bmanager|lead\b/.test(t)) return { level: "Manager", points: 16 };
  if (t) return { level: "Individual contributor", points: 8 };
  return { level: "Unknown", points: 0 };
}

export function enrichRow(row: Row, steps: EnrichmentStep[], prev: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...prev };
  const email = field.email(row);
  const domain = normalizeDomain(field.website(row)) ?? normalizeDomain(email);

  if (steps.includes("domain")) out.domain = domain;

  if (steps.includes("email_check")) {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const local = email.split("@")[0]?.toLowerCase() ?? "";
    const d = email.split("@")[1]?.toLowerCase() ?? "";
    out.email_status = !email ? "missing" : !valid ? "invalid_syntax" : ROLE.has(local) ? "role_address" : FREE.has(d) ? "free_provider" : "syntax_ok";
  }

  if (steps.includes("email_guess")) {
    const first = (field.first(row) || field.name(row).split(" ")[0] || "").toLowerCase().replace(/[^a-z]/g, "");
    const last = (field.last(row) || field.name(row).split(" ").slice(1).join("") || "").toLowerCase().replace(/[^a-z]/g, "");
    const d = (out.domain as string | null) ?? domain;
    out.email_guess = first && last && d ? `${first}.${last}@${d}` : null;
  }

  if (steps.includes("score")) {
    const s = seniority(field.title(row));
    let score = s.points;
    const reasons = [`Seniority: ${s.level} (+${s.points})`];
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { score += 20; reasons.push("Valid-looking email (+20)"); }
    if (domain) { score += 15; reasons.push("Company domain known (+15)"); }
    if (field.company(row)) { score += 10; reasons.push("Company name present (+10)"); }
    const size = parseInt(field.size(row).replace(/[^\d]/g, ""), 10);
    if (Number.isFinite(size) && size >= 10) { score += 15; reasons.push("Company size 10+ (+15)"); }
    out.score = Math.min(100, score);
    out.score_reasons = reasons;
  }
  return out;
}
