---
name: headless-step-provision
description: "Step 3 (provision) of the Hostinger Headless flow. Chooses the backend from brief.md (wordpress | ecommerce | pocketbase), then routes to the matching subfolder to provision it; writes site.json. WordPress + WooCommerce routes to the wordpress subfolder with the WooCommerce store turned on — it is not a separate backend."
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
| PocketBase | `pocketbase/SKILL.md` |

If the section is missing or names something else, go back to **refine** — don't pick one here.
Tell the user the backend and its one-line reason before provisioning.

> **Supported backends: `wordpress` (optionally with a WooCommerce store), `ecommerce` and `pocketbase`.**
> `pocketbase` is a headless website whose backend is PocketBase at `/api` and `/_/` of the same
> domain (database, visitor sign-in, file storage, realtime), for any app or site whose visitors create
> its data; it never installs WordPress. Every backend is a headless website: there is no plain
> Node.js app host in this flow. A brief that names **Webapp** is from an older flow: go back to
> refine. A **WordPress + Ecommerce** brief (two separate
> backends — a WordPress site **and** a Hostinger Ecommerce store) has no single combined `hosting_websites_create`
> type yet: stop, tell the user it isn't supported as one site, and offer either to continue with just
> WordPress or just Ecommerce (route to that one subfolder), **or**, if they want content and a store on
> **one** site, to switch the brief to **WordPress + WooCommerce** — the one-site path, which routes to
> `wordpress/SKILL.md` with the store on.

## Onboarding handoff — swap an existing empty headless shell (do this before creating anything)

Onboarding can create the website **before** you ever run, as an **empty headless shell**
(`hosting_websites_create { type: "headless_empty" }`: `website_type` is `headless`, but **nothing
is installed**), or, when onboarding already chose PocketBase, as a `headless_pocketbase` site whose
backend may not exist yet. The single-instance gate in Step 2 is the checklist. Every backend goes
through it: none of them ever creates a second website for a domain that already has a headless one.

## Step 2 — Fire (don't block)

> **Single-instance gate — pass all four before you create anything:**
> 1. **Exact-match the domain** in `hosting_websites_list` (substring filter — match the exact `domain`).
> 2. **A `headless` row already exists → adopt + swap it, never create.** Install the backend into that
>    same site (WordPress → `wordpress_installations_install { type: "headless" }` into `/cms`; Ecommerce
>    → adopt as the storefront host; PocketBase → `hosting_pocketbase_create-backend` on it, which turns a
>    `headless_empty` site into `headless_pocketbase`). **Do not
>    call `hosting_websites_create` again** — that makes a second site.
> 3. **No row at all → create one fresh** with the backend's own `hosting_websites_create` type. Create it for **this
>    build's domain only** — never provision the backend on a different domain than the frontend (the CMS
>    is the `/cms` path of the same site, never a separate `cms.<domain>`).
> 4. **A row of a different kind** (`website_type` not `headless`) → **stop and tell the user**; never
>    overwrite it.
>
> `wordpress/SKILL.md` Step 1, `ecommerce/SKILL.md` Step 1 and `pocketbase/SKILL.md` Step 1 say how to
> tell an empty shell from an already-provisioned backend.

Follow the chosen subfolder's `SKILL.md` through **detect + create** (its `hosting_websites_create` call,
or for a PocketBase shell swap its `hosting_pocketbase_create-backend` call). The
moment the create is accepted and queued, record it in `state.json` and **return** — do not wait for
it yet:

```json
{ "stage": "content_model",
  "provision": { "status": "in_progress", "domain": "<domain>", "started_at": "<now>" } }
```

Now go run the prepare work that doesn't need the backend: content-model prepare and design (at the
same time when you have a subagent tool, see *Content and design at the same time* in the top-level
`SKILL.md`), then the frontend shell. The subfolder's readiness poll, verification and `site.json`
are the **join** half below.

## Step 3 — Join (at the instance barrier)

When an instance-barrier step is about to run (content-model push, frontend data wiring, deploy) — or
right away, if the agent can't interleave — finish the subfolder's `SKILL.md`: run its `wait.mjs`
(`setup`, `cms` or `pocketbase`; it
returns at once if the job is already done), run its verification, and write `site.json` (which
records the chosen `backend`). Then set `provision.status` to `"completed"` in `state.json` with a
fresh `updated_at`.

