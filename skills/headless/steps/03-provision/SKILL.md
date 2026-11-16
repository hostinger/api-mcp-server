---
name: headless-step-provision
description: "Step 3 (provision) of the Hostinger Headless flow. Chooses the backend from brief.md (wordpress | ecommerce | webapp), then routes to the matching subfolder to provision it; writes site.json. WordPress + WooCommerce routes to the wordpress subfolder with the WooCommerce store turned on — it is not a separate backend."
---

# headless-step-provision

Router. The backend is decided in **refine** and recorded in `brief.md`; this step only routes to the
matching subfolder, which provisions it.

**In:** `brief.md`. **Out:** `site.json` (written by the subfolder).

## Step 1 — Route on the suggested backend

Read the brief's **Suggested backend** section:

| Suggested backend | Follow |
|---|---|
| WordPress | `wordpress/SKILL.md` |
| WordPress + WooCommerce | `wordpress/SKILL.md` **with the WooCommerce store on** (its Steps 4–5; `site.json → backend` stays `"wordpress"`) |
| Ecommerce | `ecommerce/SKILL.md` |
| Webapp | `webapp/SKILL.md` |

If the section is missing or names something else, go back to **refine** — don't pick one here.
Tell the user the backend and its one-line reason before provisioning.

> **Supported backends: `wordpress` (optionally with a WooCommerce store), `ecommerce` and `webapp`.**
> `webapp` is a plain Node.js app host (an empty website — no CMS, no store, no `/cms`) for any app/SPA
> that brings its own code and data; it never installs WordPress. PocketBase is not available in this
> version — refine never proposes it, and there is no `pocketbase/` subfolder; if a brief somehow names
> it, stop and tell the user rather than improvising it. A **WordPress + Ecommerce** brief (two separate
> backends — a WordPress site **and** a Hostinger Ecommerce store) has no single combined `hosting_websites_create`
> type yet: stop, tell the user it isn't supported as one site, and offer either to continue with just
> WordPress or just Ecommerce (route to that one subfolder), **or**, if they want content and a store on
> **one** site, to switch the brief to **WordPress + WooCommerce** — the one-site path, which routes to
> `wordpress/SKILL.md` with the store on.

## Onboarding handoff — swap an existing empty headless shell (do this before creating anything)

Onboarding can create the website **before** you ever run, as an **empty headless shell**
(`hosting_websites_create { type: "headless_empty" }`: `website_type` is `headless`, but **nothing
is installed**). The single-instance gate in Step 2 is the checklist.

> **Webapp is not part of this handoff at all.** `webapp` is **not** reached on the usual onboarding
> flow — it is only triggered by experimental actions — so it **ignores headless instances entirely**:
> it never detects, adopts or swaps an empty headless shell, and provisions its own **Node.js app host**
> exactly as `webapp/SKILL.md` defines today. The swap below is **WordPress and Ecommerce only**.
>
> **But webapp must still never create a second instance for this build.** Only route here when the
> brief's backend is `webapp` — a `wordpress` or `ecommerce` brief is never provisioned as a webapp. And
> if this build's domain already has a headless shell/site (an onboarding `headless_empty`, or any row
> from the single-instance gate below), **do not** spin up a separate Node.js host on another domain:
> stop and tell the user the domain already has a headless instance, rather than leaving the build split
> across two sites.

## Step 2 — Fire (don't block)

> **Single-instance gate — pass all four before you create anything:**
> 1. **Exact-match the domain** in `hosting_websites_list` (substring filter — match the exact `domain`).
> 2. **A `headless` row already exists → adopt + swap it, never create.** Install the backend into that
>    same site (WordPress → `wordpress_installations_install { type: "headless" }` into `/cms`; Ecommerce
>    → adopt as the storefront host). **Do not call `hosting_websites_create` again** — that makes a second site.
> 3. **No row at all → create one fresh** with the backend's own `hosting_websites_create` type. Create it for **this
>    build's domain only** — never provision the backend on a different domain than the frontend (the CMS
>    is the `/cms` path of the same site, never a separate `cms.<domain>`).
> 4. **A row of a different kind** (`website_type` not `headless`) → **stop and tell the user**; never
>    overwrite it.
>
> `wordpress/SKILL.md` Step 1 and `ecommerce/SKILL.md` Step 1 say how to tell an empty shell from an
> already-provisioned backend.

Follow the chosen subfolder's `SKILL.md` through **detect + create** (its `hosting_websites_create` call). The
moment the create is accepted and queued, record it in `state.json` and **return** — do not wait for
it yet:

```json
{ "stage": "content_model",
  "provision": { "status": "in_progress", "domain": "<domain>", "started_at": "<now>" } }
```

Now go run the prepare work that doesn't need the backend (content-model prepare, frontend
shell). The subfolder's readiness poll, verification and `site.json` are the **join** half below.

## Step 3 — Join (at the instance barrier)

When an instance-barrier step is about to run (content-model push, frontend data wiring, deploy) — or
right away, if the agent can't interleave — finish the subfolder's `SKILL.md`: run its `wait.mjs` (it
returns at once if the job is already done), run its verification, and write `site.json` (which
records the chosen `backend`). Then set `provision.status` to `"completed"` in `state.json` with a
fresh `updated_at`.

