---
name: headless-step-provision
description: "Step 3 (provision) of the Hostinger Headless flow. Chooses the backend from brief.md (wordpress | ecommerce | webapp), then routes to the matching subfolder to provision it; writes site.json."
---

# headless-step-provision

Router. The backend is decided in **refine** and recorded in `brief.md`; this step only routes to the
matching subfolder, which provisions it.

**In:** `brief.md`. **Out:** `site.json` (written by the subfolder).

**This stage runs in the background.** Provisioning is mostly a poll wait, so it splits in two: a
**fire** half (detect + create, returns straight away) and a **join** half (poll to `completed`,
verify, write `site.json`). Fire it, record `provision.in_progress`, then go do the prepare work of
the other stages (content-model prepare, frontend shell) while it settles. Only cross back to
the join half when an instance-barrier step needs the live backend. See *Background provision & the
instance barrier* in the top-level `SKILL.md`. An agent that can't interleave simply does fire and
join back-to-back — still correct, just no overlap.

## Step 1 — Route on the suggested backend

Read the brief's **Suggested backend** section:

| Suggested backend | Follow |
|---|---|
| WordPress | `wordpress/SKILL.md` |
| Ecommerce | `ecommerce/SKILL.md` |
| Webapp | `webapp/SKILL.md` |

If the section is missing or names something else, go back to **refine** — don't pick one here.
Tell the user the backend and its one-line reason before provisioning.

> **Supported backends: `wordpress`, `ecommerce` and `webapp`.** `webapp` is a plain Node.js app host
> (an empty website — no CMS, no store, no `/cms`) for any app/SPA that brings its own code and data; it
> never installs WordPress. PocketBase is not available in this version — refine never proposes it, and
> there is no `pocketbase/` subfolder; if a brief somehow names it, stop and tell the user rather than
> improvising it. A **WordPress + Ecommerce** brief has no single combined `start-setup` type yet: stop,
> tell the user it isn't supported as one site, and offer to continue with just WordPress or just
> Ecommerce — then route to that one subfolder.

## Step 2 — Fire (don't block)

Follow the chosen subfolder's `SKILL.md` through **detect + create** (its "start-setup" call). The
moment the create is accepted and queued, record it in `state.json` and **return** — do not sit on the
readiness poll:

```json
{ "stage": "content_model",
  "provision": { "status": "in_progress", "domain": "<domain>", "started_at": "<now>" } }
```

Now go run the prepare work that doesn't need the backend (content-model prepare, frontend
shell). The subfolder's readiness poll, verification and `site.json` are the **join** half below.

## Step 3 — Join (at the instance barrier)

When an instance-barrier step is about to run (content-model push, frontend data wiring, deploy) — or
right away, if the agent can't interleave — finish the subfolder's `SKILL.md`: **poll to `completed`**,
run its verification, and write `site.json` (which records the chosen `backend`). Then set
`provision.status` to `"completed"` in `state.json` with a fresh `updated_at`. On resume, treat a
stored `in_progress` as a hint only — re-poll `hosting_websites_list-setups` for the truth first.
