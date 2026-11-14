# ProsAI — reference audit and product definition

## Reference audit (clay.com, public pages only, read 2026-11-14)
Pages read: home, pricing, customers, about, enterprise, integrations, agent, workflows, sequencer, university. `/product` returned 404. No page needed login; the in-app product (app.clay.com) was **not inspected**, so dashboard structure is inferred from marketing and docs text. Visual details (exact colours, fonts, CSS) could **not** be verified from fetched text; the ProsAI palette is an original warm, paper-and-ink scheme with pastel accents, inspired only by the reference's playful, illustrated tone.

What the reference does: a GTM data platform built around a spreadsheet-like table. Rows are leads or companies; columns are enrichments (multi-provider "waterfalls"), AI research agent prompts, formulas and actions. Supporting modules: audiences, signals, CRM sync, workflows, a cold-email sequencer, ad audiences, 150+ provider integrations. Pricing is credit-based (actions + data credits) across Free / Launch / Growth / Enterprise tiers. Target users: GTM engineers, RevOps, sales and marketing ops, agencies.

## ProsAI scope (original product)
A lead research workbench: **import → enrich → research → export**, metered by plan.

| Reference capability | ProsAI v1 | Status |
|---|---|---|
| Tables + CSV import/export | Lead tables, CSV import, selectable rows, CSV export | Built |
| Enrichment columns | Four deterministic steps (domain, email check, email pattern guess, lead score) | Built |
| AI research agent | Gemini assessment grounded in row data + ICP, zod-validated, no web access | Built (needs `GEMINI_API_KEY`) |
| Credits / plans | Monthly actions, row limits, usage page | Built |
| Third-party data providers, waterfalls | Not connected (needs provider contracts/keys) | Not built |
| CRM sync, sequencer, signals, workflows, ad audiences | Out of v1 scope | Not built |

## Architecture
Next.js 16 App Router + TypeScript + Tailwind 4. Supabase Auth (cookie sessions via `proxy.ts`), Postgres with RLS (`supabase/migrations/0001_init.sql`). Business logic in `lib/` (`plans`, `enrich`, `ai`, `session`). Writes to subscriptions and usage use the service-role client server-side only. Payment activation happens only via the HMAC-signed `POST /api/webhooks/payments`.
