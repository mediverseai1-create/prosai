# ProsAI

Lead research workbench: import CSVs, enrich with transparent rules, get AI research grounded in your data. See [docs/PRODUCT.md](docs/PRODUCT.md).

## Setup
1. `npm install`
2. Create a Supabase project and run `supabase/migrations/0001_init.sql` in the SQL editor.
3. Supabase Auth > URL configuration: add your site URL and `<site>/auth/callback` as redirect URLs.
4. Copy `.env.example` to `.env.local` and fill in values.
5. `npm run dev`

## Environment variables
See `.env.example`. `SUPABASE_SERVICE_ROLE_KEY` and `PAYMENT_WEBHOOK_SECRET` are server-only.

## Payments
Upgrade buttons open your payment links with `client_reference_id=<workspace id>`. Plans change **only** when `POST /api/webhooks/payments` receives a body like `{"type":"subscription.activated","org_id":"…","plan":"launch"}` signed with header `x-prosai-signature` (hex HMAC-SHA256 of the raw body using `PAYMENT_WEBHOOK_SECRET`). Your payment provider's native webhook needs a small adapter that maps its event to this format.

## Deploy (Vercel)
Import the repo, set every variable from `.env.example` in Project Settings, deploy. Set `NEXT_PUBLIC_SITE_URL` to the production domain.

## Selar webhook
Selar publishes no webhook schema or signature, so `POST /api/webhooks/selar?token=<SELAR_WEBHOOK_TOKEN>` authenticates with a secret token in the URL and matches a sale to a workspace by the **buyer's email** (it must equal the email of a ProsAI account). The plan comes from a `47plan`/`57plan`/`97plan` marker in the payload, otherwise from a USD amount of 47/57/97. Status words containing refund, chargeback or cancel downgrade to Starter. Unmatched sales return 202 and are logged (`[selar] ...`) for manual activation.

Setup: set `SELAR_WEBHOOK_TOKEN` to a long random string, then paste `https://<your-domain>/api/webhooks/selar?token=<that value>` into Selar's webhook/notification setting. Send one real test purchase and check the Vercel logs: the field-name matching in `lib/selar.ts` was written without an official payload sample.
