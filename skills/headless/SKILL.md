---
name: hostinger-headless
description: "Build, connect, or iterate on a website hosted on Hostinger — provision hosting and a domain, optionally seed an ecommerce store with a real hosted checkout, build the frontend, deploy, and verify. Requires an authenticated Hostinger MCP session (see entry/skill.md). Triggers: build me a site on Hostinger, deploy this to Hostinger, connect this project to Hostinger, add a store to my Hostinger site, update my Hostinger site."
---

# Hostinger Headless

This skill turns a prompt into a live website on Hostinger. Its job is to own the full run: check the account, provision hosting and a domain, seed the backend (an ecommerce store when the intent calls for selling), build the frontend, deploy it, and verify the result.

The frontend is built ad-hoc to the user's intent — there is no template library. The backend pieces are real Hostinger products: web hosting (static or Node.js), domains and DNS, and Hostinger Ecommerce with its public Storefront API and hosted checkout.

## Preconditions

1. An authenticated Hostinger MCP session — the entry skill's bootstrap handled this. If MCP tools fail with auth errors, send the user back through `entry/skill.md`.
2. The Hostinger MCP tools for **hosting** (and **ecommerce**, when the run involves a store). Tool availability varies per user — product groups can be toggled in the Hostinger Connector, and some clients cap the number of exposed tools. When a needed tool is missing, ask the user to enable that product group (or configure the scoped binary, e.g. `hostinger-hosting-mcp`) rather than improvising around it.
3. An active hosting plan (checked in Setup §1). Hostinger hosting is a paid product: if the account has no usable plan, inform the user plainly that a subscription is required, link them to https://www.hostinger.com/web-hosting, and pause until they confirm the purchase. Do not treat this as an error — it is a normal step for new accounts. Everything that doesn't need hosting (planning, building the frontend locally) can proceed while they decide.

## Resolving the operation

Resolve by intent first, disk second — never let an empty directory override what the user is asking for. Check `iterate` first (it's decided by an unambiguous on-disk signal):

- `iterate` — a `.hostinger/site.json` is present in the project: the site is already deployed through this skill and the user wants changes. Reuse the recorded domain/site details; apply only the delta the new intent needs (edit frontend → redeploy; add a store → run `references/STORE.md` then redeploy). Never re-provision an existing site.
- `connect` — a frontend project already on disk (or brought in as a zip/export/URL) that is not yet on Hostinger, with language like "deploy this / host this on Hostinger / connect this project". Emptiness of the CWD at trigger time is not a create signal when a design is brought in from elsewhere.
- `create` — a new site from a prompt with nothing brought in: "build me a store / portfolio / site…".

If signals conflict, ask the user — don't guess.

## The run

1. **Discovery** — from the prompt (and the project on disk for connect/iterate), infer: does this run need a store (any buy/sell/product intent → yes)? What brand, copy, and structure does the site need? What stack fits — plain static HTML/CSS/JS for simple sites (default), a static-output framework build, or a Node.js app when SSR or server code is genuinely required? Prefer static: it deploys fastest and has no build-failure surface. Ask the user only what you cannot infer.
2. **Setup** (`references/SETUP.md`) — plan check, then provision the website on a free subdomain (or the user's own domain) and wait until it's ready.
3. **Store** (`references/STORE.md`, only when commerce is needed) — resolve or create the store and its `custom` sales channel, seed products/shipping/payment, and note the `sales_channel_id` for the frontend.
4. **Build** — create or wire the frontend. For store runs, follow the frontend contract in `references/STORE.md` (catalog fetched at runtime from the public Storefront API, cart in `localStorage`, client-side checkout — never embed an API token in the site).
5. **Deploy** (`references/DEPLOYMENT.md`) — archive and deploy via the matching hosting tool, polling build logs for Node.js runs.
6. **Verify** — curl the live URL for a 200 and a piece of real page copy; for store runs, confirm a checkout POST returns a redirect URL. Show the user the live URL and where to manage things (hPanel: https://hpanel.hostinger.com, and the store dashboard for commerce).
7. **Record** — write `.hostinger/site.json` into the project: `{ "domain", "username", "type": "static"|"nodejs", "sales_channel_id"?, "store_id"? }`. This is what makes future runs resolve as `iterate`.

Run non-interactively wherever possible. The exceptions that must involve the user: the paid-plan confirmation, anything that costs money (a domain purchase, a new subscription), and picking between genuinely equal options the prompt doesn't decide.

## Paths

| What | Path |
| --- | --- |
| Plan check + website/domain provisioning | `references/SETUP.md` |
| Store: seed the backend + the frontend API contract | `references/STORE.md` |
| Deploy: static vs Node.js, archive rules, logs, verify | `references/DEPLOYMENT.md` |

## Where the how comes from

The MCP tool descriptions are authoritative for request shapes — read them before calling. Two live sources supersede anything written here when they disagree:

- The ecommerce MCP tool `ecommerce_getCustomStorefrontSetupInstructionsV1` returns the current storefront integration guide from the server — call it at the start of any store run.
- The Hostinger API reference at https://developers.hostinger.com describes every endpoint behind the tools.
