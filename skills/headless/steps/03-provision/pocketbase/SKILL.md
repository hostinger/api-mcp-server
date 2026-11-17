---
name: headless-step-provision-pocketbase
description: "Provision the PocketBase backend for the Hostinger Headless flow: create a headless website (type headless_pocketbase) or adopt the one onboarding made, then create its PocketBase backend with hosting_pocketbase_create-backend (database, visitor sign-in, file storage and realtime at /api, the owner's dashboard at /_/), save the one-time superuser password outside the deployable source, verify it answers, and record it in site.json. For any app, SPA or site whose visitors create its data."
---

# headless-step-provision-pocketbase

Provision a **headless website with a PocketBase backend** for `<domain>` and prove it is ready. This
is the backend for **any app, SPA or site whose visitors create the data it keeps** — accounts,
bookings, comments, votes, scores, order requests, uploads, live messages. There is no CMS and no store
engine here. PocketBase runs on the site's own domain: the REST and realtime API at
`https://<domain>/api`, the owner's dashboard at `https://<domain>/_/`. Every other path is the
frontend that the frontend step builds and the deploy step ships as a Node.js application.
**Out:** `site.json` and `~/.hostinger/<domain>/.pocketbase/credentials.json`.

> **Not WordPress, not Ecommerce.** Never provision `headless_wordpress` / `headless_ecommerce` for a
> PocketBase build, and never install WordPress at `/cms`: Hostinger refuses a PocketBase backend on a
> headless WordPress site. The app owns every route except `/api` and `/_`.

All website operations below go through the Hostinger connector (`execute`). Read each operation's
`inputSchema` (from `search`) before its first call.

> **Fire vs join (background provision).** For a **fresh site**, the fire half is Step 2's
> `hosting_websites_create`; the join half is `wait.mjs setup`, then Step 3 (the backend), Step 4 and
> Step 5. For an **adopted shell** (onboarding's `headless_empty` or `headless_pocketbase` site), the
> fire half is Step 3's `hosting_pocketbase_create-backend` call plus saving its response — one call
> that returns at once — and the join half is `wait.mjs pocketbase`, Step 4 and Step 5. Record
> `provision.in_progress` after the fire and return to the prepare work (see the router `../SKILL.md`);
> join when an instance-barrier step needs the backend, or immediately if the agent can't interleave.
> A site whose backend Step 1 already finds means provision is done: record `provision.completed` and
> adopt it.

## Step 0 — Preflight

`search` with the query `pocketbase`. You need `hosting_pocketbase_create-backend`,
`hosting_pocketbase_backend` and `hosting_pocketbase_set-superuser`; read each one's `inputSchema`
before its first call. If any is missing, the connector is outdated: update it (connect's Phase 1
install), log an `issue` event and stop. **Never improvise a database in its place.**

## Step 1 — Detect before you create (never provision twice)

Run these in order: the kind checks (points 1–3) decide whether this site may be used at all, before
its setup status (point 4) says where to pick it up.

1. `hosting_websites_list { "domain": "<domain>" }` — substring filter, so **exact-match** the row's
   `domain`. If a row exists, note `username`, `order_id`, `website_type`. No exact row → nothing
   exists on this domain → **create fresh** (Step 2).
2. **A row of another kind** (`website_type` not `headless`: a WordPress or store site) → stop and
   tell the user — this domain already hosts something else. **Never create a second site.**
3. **A `headless` row.** `wordpress_installations_list { username, domain, ownership: "all" }` with a
   `directory: "cms"` row → stop and tell the user: this is a headless WordPress site, and Hostinger
   refuses PocketBase there. Otherwise `hosting_pocketbase_backend { username, domain }`:
   - a backend (any `state` but `missing`) → **adopt it**; Step 3 point 1 settles the credentials
     (rotate the superuser when this build made the backend and the file is gone, otherwise ask).
   - 404, or `state: "missing"` → the shell is empty (onboarding's `headless_empty`, or a
     `headless_pocketbase` site whose backend wasn't created yet): **adopt the site, don't call
     `hosting_websites_create`**, and create the backend on it in Step 3 with this row's `username`.
   **Only provision PocketBase for a `pocketbase` brief.** A `wordpress` or `ecommerce` brief belongs
   in those subfolders — never give it a PocketBase backend.
4. **Where to pick it up.** `hosting_websites_list-setups { "domain": "<domain>" }` — exact-match the row:
   - `completed`, or no row (it drops off after 24 h) → the website is ready → Step 3.
   - `running` → the setup is still going: at the join, `cd "$HOME" && node <skill>/wait.mjs setup <domain>`
     before Step 3.
   - `failed` → tell the user and point them at hPanel; do **not** call `hosting_websites_create` again on your own.

## Step 2 — Create (only when nothing exists)

1. Pick the plan: `hosting_orders_list { "statuses": ["active"] }`. One active order → use it; several
   → ask the user which.
2. Start the setup as a **headless website marked for PocketBase** (it installs nothing yet; Step 3
   creates the backend):

   ```json
   { "operation": "hosting_websites_create",
     "params": { "order_id": <order_id>, "type": "headless_pocketbase", "domain": "<domain>" } }
   ```

   `domain` must be a **customer-owned** domain. For a temporary `*.hostingersite.com` subdomain,
   **omit `domain`** — the setup generates one itself and returns it in the response. Don't call a
   separate subdomain op to make one first: there's no need in this flow. The response then carries the
   generated domain: if it differs from the workspace directory name, move `~/.hostinger/<old>/` to
   `~/.hostinger/<new>/`
   (if `<new>/` already exists, stop and ask instead of moving into it),
   update the domain in `brief.md`, and tell the user the new domain.
3. Don't wait here. At the join, `cd "$HOME" && node <skill>/wait.mjs setup <domain>` (see *Waiting on Hostinger* in
   the top-level `SKILL.md`) returns once the setup is `completed`, usually at once by then. A `failed`
   setup → stop, point at hPanel. Then Step 3.

## Step 3 — Create the backend

Needs the website (setup `completed`). On an adopted shell this is the **fire** half; on a fresh site
it runs at the join.

1. **Already there?** `hosting_pocketbase_backend { username, domain }`. A backend plus
   `~/.hostinger/<domain>/.pocketbase/credentials.json` with a matching `domain` → adopt it and go to
   point 4. A backend without that file → the password is gone (Hostinger returns it once and never
   stores it): when this build made it (a resumed run, `site.json → backend: "pocketbase"`), rotate it
   with `hosting_pocketbase_set-superuser { username, domain }` (no password, so a strong one is
   generated) and save the response as in point 2; when it may belong to something else, **ask** first.
2. **Create it.** `hosting_pocketbase_create-backend { username, domain }` **without**
   `superuser_password`. Before the call, make the folder private:
   `mkdir -p ~/.hostinger/<domain>/.pocketbase && chmod 700 ~/.hostinger/<domain>/.pocketbase`, so
   other users of this computer can't read the file even before its own `chmod`. As soon as the call
   returns, before any other step or message, write the
   **full response** to `~/.hostinger/<domain>/.pocketbase/credentials.json` with your file-writing
   tool and `chmod 600` it (on Windows the profile folder is already private). It holds `domain`,
   `api_url`, `admin_url`, `superuser_email`, `superuser_password`, `instance_id`, `state` and
   `version`; **the password is returned only this once**. The file sits in the workspace, outside
   `src/`, so no deploy archive can include it. Never print the password or put it in `site.json`,
   `brief.md`, the run log or a chat reply.
3. **A 422 is not always "already exists"**: read its message and show it to the user when you stop.
   - *This website already has a PocketBase instance* → go back to point 1 (once; if it still finds no
     backend, stop and show the user the message).
   - *not supported on headless WordPress websites* or *cannot be added to a parked domain* → stop
     and tell the user: this domain can't take PocketBase.
   - *not available* / *no access yet* (PocketBase is rolling out gradually and this account isn't
     enabled yet) → stop and tell the user PocketBase isn't enabled on their account yet, quoting the
     message; log an `issue` event. **Never improvise a database in its place.**
   - Any other message → stop and show it to the user. Never retry a 422 blindly.
4. **Wait for it.** `state` may be `null` right after creation; that's normal.
   `cd "$HOME" && node <skill>/wait.mjs pocketbase <domain>` returns once `https://<domain>/api/health`
   answers 200 (over `http://` with `https_pending: true` while a new domain's certificate is still
   installing — fine, go on). If it times out, re-read `hosting_pocketbase_backend`: `failed` means
   the last start didn't succeed and Hostinger retries it on its own after `retry_after_seconds`
   (the data is intact — wait that long and read again, never delete the backend); `unregistered`
   means it's broken → stop and show the user; `missing` means its files are gone → point 2 creates
   a new, empty one. The backend sleeps after about 5 idle minutes, so one 503 on a first request is
   a wake-up.

PocketBase owns `/api` and `/_` on this domain; the app's own server routes use another prefix (e.g.
`/server`). The owner sets outgoing mail (SMTP), backups and social sign-in in the dashboard: they
aren't in the API. `hosting_pocketbase_delete-backend` destroys every record and upload — never call
it in this flow.

## Step 4 — Verify

| Check | How | Expect |
|---|---|---|
| Website exists | `hosting_websites_list` exact row | the row is present, `username` known |
| Setup finished *(fresh site only)* | `hosting_websites_list-setups` exact row | `status: completed` |
| Backend healthy | `hosting_pocketbase_backend { username, domain }` | `state` is `asleep`, `starting` or `running` |
| PocketBase answers | `GET https://<domain>/api/health` and `GET https://<domain>/_/` | 200 and 200 |
| Credentials saved | `~/.hostinger/<domain>/.pocketbase/credentials.json` | present, mode `600`, `domain` matches |

`GET https://<domain>/` returns the Hostinger default page (or 403) until the frontend is deployed —
expected, not a failure. There is **no `/cms`** on this domain; the app itself serves every route but
`/api` and `/_` once it is deployed (Step 8).

If a check fails: retry once after ~30 s; if it still fails, stop and point the user at hPanel.

## Step 5 — Record `site.json`

```json
{
  "backend": "pocketbase",
  "website_type": "headless",
  "order_id": 1007223428,
  "username": "u…",
  "runtime": "nodejs",
  "pocketbase": {
    "instance_id": "…",
    "version": "…",
    "superuser_email": "…",
    "credentials_file": ".pocketbase/credentials.json"
  },
  "urls": {
    "site": "https://<domain>",
    "api": "https://<domain>/api",
    "admin": "https://<domain>/_/"
  },
  "provisioned_at": "…",
  "verified_at": "…"
}
```

`credentials_file` is relative to the workspace `~/.hostinger/<domain>/`. No passwords or tokens in
`site.json` — the superuser password lives only in the credentials file. Together, `superuser_email`
and that file are the owner's **login access** to the dashboard at `urls.admin`; the done step hands
them over by name (the email, the file's full path, never the password itself).

## Content model & deploy (what happens next)

- **Content model** runs `../../04-content-model/pocketbase/SKILL.md`: it designs the collections,
  access rules and seed records in `pocketbase/schema.json` during the provision wait, then applies
  and verifies them against this backend at the instance barrier. The shared prepare phase still
  writes the site's fixed copy (title, navigation, pages) to `content-model.md`.
- **Deploy** is a standard Node.js application deploy, handled by `../../08-deploy/SKILL.md`: it archives
  the **source** (not the build output; exclude `node_modules/`, `.next/`, `dist/`, build output and
  `.git/`), then deploys with `hosting_deploy` (`type: "nodejs"`, upload + server-side `npm install` +
  build, one shot) passing the framework's `appType` + `outputDirectory` inline, and polls
  `hosting_get-deployment` until the build completes. Any supported `appType` works (Next.js, Nuxt,
  Express, NestJS, Fastify, Vite/React/Vue SPA, …). `/api` and `/_` keep belonging to PocketBase; deploy
  checks they survived.
