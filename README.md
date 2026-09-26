# DrugGuard Backend

Express + MongoDB API for the DrugGuard MVP. Pairs with the frontend at
https://drug-guard-kappa.vercel.app/.

## Stack
- Node.js (runtime) — Bun used only for `bun install` if you prefer it over npm/yarn
- Express.js
- MongoDB via Mongoose

## Setup

```bash
bun install        # or npm install
cp .env.example .env
# fill in MONGODB_URI (Atlas connection string) and CORS_ORIGIN
npm run seed        # loads sample data — READ THE WARNING BELOW FIRST
npm run dev          # starts on http://localhost:5000
```

## ⚠️ Before you demo or ship this

`src/data/seed.js` is a **hand-compiled sample**, not real NAFDAC ingestion.
Two entries (P-Alaxin TS, P-Alaxin) have NAFDAC numbers confirmed from a
cited public source. Every other entry has a NAFDAC number shaped like
`A4-XXXXXX-VERIFY` — a placeholder, not a real registration number. Replace
every `-VERIFY` entry with the real number from NAFDAC Greenbook
(greenbook.nafdac.gov.ng) or a confirmed EMDEX export before this touches a
real user. Presenting a fabricated number as "registered" is exactly the
failure mode the PRD's safety section is trying to prevent — don't ship it.

## API

### `GET /api/health`
Liveness check.

### `GET /api/medicines?q=<search term>`
Searches by product name (text index + partial-match fallback).

Response shapes:
```json
// found
{ "status": "registered", "query": "p-alaxin", "results": [ { ...medicine } ] }

// not found
{ "status": "not_found", "query": "xyz", "message": "...", "results": [] }
```

### `GET /api/medicines/nafdac/:number`
Exact lookup by NAFDAC registration number. Case-insensitive (normalized to
uppercase). Returns the medicine plus any linked `safetyAlerts`.

```json
// found
{ "status": "registered", "medicine": { ... }, "safetyAlerts": [ ... ] }

// not found
{ "status": "not_found", "nafdacNumber": "X1-1234", "message": "..." }
```

**`status` is only ever `"registered"` or `"not_found"` — never `"fake"`.**
This mirrors the PRD's core safety rule and is enforced in the controller,
not left to the frontend to interpret.

## Data model

- `Medicine` — one document per registered product (see `src/models/Medicine.js`)
- `SafetyAlert` — recalls/alerts, referenced by `medicine` ObjectId

`dataSource` on each Medicine tracks provenance (`manual-seed` for now;
swap to `nafdac-greenbook` / `emdex` once real ingestion exists), so you can
tell seeded rows from ingested ones later without a migration.

## Deploying to Render

1. Push this repo to GitHub.
2. New Web Service on Render → connect the repo.
3. Build command: `npm install` (or `bun install`)
4. Start command: `npm start`
5. Add environment variables: `MONGODB_URI`, `CORS_ORIGIN` (your Vercel
   frontend URL), `NODE_ENV=production`.
6. After first deploy, run `npm run seed` locally against the same
   `MONGODB_URI` (Atlas), or add a one-off Render job — don't seed from
   inside the web service's boot sequence, or every redeploy wipes your data.

## Not implemented yet (matches PRD's "Do Not Build Yet")
No user accounts, AI chatbot, OCR, personalized dosage calculator, SMS/USSD,
marketplace, or crowd reporting. `dosageReference` is static reference text
only — never generate personalized dosage with an LLM, per PRD §7.
