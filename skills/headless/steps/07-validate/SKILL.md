---
name: headless-step-validate
description: "Step 7 (validate) of the Hostinger Headless flow. OPTIONAL quick gate before deploy: every prior stage already self-verifies, so this is a fast confirmation (instance live + backend API answers with seeded content) plus optional local preview and user sign-off. Skip the heavy parts when nobody needs to approve."
---

# headless-step-validate

> **Optional / fast.** Every stage before this one already verifies its own work (provision checks the
> backend, content-model push checks the REST counts, frontend builds clean and looks right at desktop
> and phone width), and **deploy verifies the live result**. So validate is **not** a re-run of all
> that — it's a quick confirmation, plus the optional human preview/sign-off. **Skip Steps 3–4 (rebuild + approval) entirely** on an autonomous or
> temp-domain run where no one is signing off; just do the two 10-second checks below and move on. Spend
> time here only when a person wants to see it before it goes live.

**In:** project in `~/.hostinger/<domain>/src/`, `site.json`, `state.json`.

## 1 — Instance status (always, quick)

`provision.status == "completed"` in `state.json`. Anything else → not ready; return to the instance
barrier, don't deploy. Deploy's pre-flight asks the connector again (see *State and artifacts* in the
top-level `SKILL.md`).

## 2 — Backend API status (every backend, always, quick)

Hit the live API from `site.json` and confirm it answers **with the content the push created** — a 200
with an empty catalog means the push didn't land:

- **WordPress:** `GET {urls.rest_api}/posts?per_page=1` → 200 JSON array; check `X-WP-Total` against the
  planned post count, and `GET {urls.rest_api}/media?per_page=1` → `X-WP-Total` matches the planned
  image count (more = duplicates).
- **WordPress + WooCommerce** (`site.json → woocommerce.enabled`): the WordPress check above **plus**
  `GET {urls.store_api}/products?per_page=100` → 200 with the seeded products and `prices` (minor units);
  count matches the plan. Don't test checkout while `woocommerce.payment_enabled` is `false`.
- **Ecommerce:** query `urls.storefront_api` for the sales channel → 200 with the seeded products and
  prices *(confirm against the store)*.
- **PocketBase** (`site.json → backend: "pocketbase"`): `GET {urls.api}/health` → 200, and every
  collection with `seed` records in `pocketbase/schema.json` lists them
  (`GET {urls.api}/collections/<name>/records?perPage=1` → `totalItems` at least the seed count, for
  collections visitors may list). `pb-verify.mjs` already ran at the content-model push, so don't
  repeat it here.
- **Contact form** (`site.json → contact_form.enabled`, Contact Form 7, WordPress only): send the two
  throwaway test submissions in
  [`../04-content-model/wordpress/contact-form.md`](../04-content-model/wordpress/contact-form.md) §5: the
  first must return `status` **`mail_sent`**, the one with the honeypot filled **`spam`**.

Fail or counts off → fix content-model push before building against live data.

## 3 — Clean rebuild against the live API (optional — skip unless signing off)

Frontend already produced a clean build; only redo this if you want a from-scratch guarantee before a
human sign-off. Remove the build output and rebuild; a failed or incomplete build is a stop (no
fixtures, placeholder copy or `.htaccess` in the output).

- **Astro (SSG):** `rm -rf dist && npm run build && npm run check:dist`.
- **Next.js (SSR):** `rm -rf .next && npm run check && npm run build`.

## 4 — Preview & approval (optional — only when a person is signing off)

When someone wants to see it first: start the local preview (Astro: `npm run preview`; Next.js:
`npx next start`), show the user a couple of key routes at desktop and phone width (capture phone width
as in frontend's *Visual check*; frontend already caught the layout bugs, so this is for the user, not a
re-review) and navigation, and present it for **explicit approval**. If preview tooling is unavailable,
give the user the command and URL. On an autonomous or temp-domain run, skip this — deploy will verify the live result anyway.

Then (after approval, or immediately if 3–4 were skipped): `state.json` → `stage: "deploy"`, fresh
`updated_at`; leave `provision` unchanged.
