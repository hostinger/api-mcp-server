---
name: headless-step-validate
description: "Step 7 (validate) of the Hostinger Headless flow. Quick gate before deploy: every prior stage already self-verifies, so this is a fast confirmation (instance live + backend API answers with seeded content), an npm audit of the frontend before the first deploy (fix high/critical advisories, rebuild clean), plus optional local preview and user sign-off. Skip the heavy parts when nobody needs to approve."
---

# headless-step-validate

> **Fast.** Every stage before this one already verifies its own work (provision checks the
> backend, content-model push checks the REST counts, frontend builds clean and looks right at desktop
> and phone width), and **deploy verifies the live result**. So validate is **not** a re-run of all
> that — it's two quick checks, an npm audit before the first deploy, and the optional human
> preview/sign-off. **Skip Steps 4–5 (rebuild + approval) entirely** on an autonomous or temp-domain run
> where no one is signing off. Spend time here only when a person wants to see it before it goes live.

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

## 3 — Dependency audit (first deploy only, even when nobody signs off)

Run this only when `~/.hostinger/<domain>/deploy.json` doesn't exist yet: deploy writes it after the
first passing deploy, so iterate and redeploy runs skip this step and don't report the skip. Deploy
ships `package-lock.json` and the server installs from it, so the fix lands in the lockfile here. In
`~/.hostinger/<domain>/src/`:

1. **Audit.** `npm audit`. No vulnerabilities → note "npm audit clean" in validate's *Steps completed*
   row of the final report and go on to Step 4. If it can't run (no `package-lock.json`, registry
   unreachable), log an `issue` event
   `{"stage":"validate","symptom":"npm audit could not run","cause":"<error>","severity":"medium","resolved":false}`,
   list it under *Gaps / follow-ups*, and go on.
2. **Back up.** Copy `package.json` and `package-lock.json` to `~/.hostinger/<domain>/audit-backup/`
   (outside `src/`, so the deploy archive doesn't pick them up). This is the last working pair. Delete
   `audit-backup/` when this step ends.
3. **Safe fixes.** `npm audit fix`, then rebuild clean: delete the build output (`.next` for Next.js,
   `.output` for Nuxt, `build` for SvelteKit, `dist` for Astro and Vite/React/Vue; for any
   other framework, the folder `npm run build` writes), run `npm run build`, and run the project's `check` or
   `check:dist` script if it has one. Passes → copy the pair to the backup again. Fails → restore the
   backup and `npm ci`. Never run `npm audit fix --force`: it takes breaking major upgrades across the
   whole tree. Low and moderate advisories this can't fix stay.
4. **High and critical.** If `npm audit --audit-level=high` still fails, run `npm audit --json`. For
   each entry under `vulnerabilities` whose `severity` is `high` or `critical` and whose `fixAvailable`
   is an object, run `npm install <fixAvailable.name>@<fixAvailable.version>`. Rebuild clean as in
   item 3. Fails → restore the backup, `npm ci`, and treat those advisories as leftovers.
   `fixAvailable: false` means no dependency upgrade fixes it.

**Leftovers.** A high or critical advisory that no upgrade fixes, or whose upgrade breaks the build,
doesn't block the deploy: deploy the last working pair, log one event for all of them, and list each
(package, severity, advisory ID, why it stays) under *Gaps / follow-ups* in the final report
([`../09-done/SKILL.md`](../09-done/SKILL.md)):

```bash
node <skill>/run-log.mjs <domain> event issue '{"stage":"validate","symptom":"npm audit: <n> high/critical advisories left","cause":"<package>@<version> <advisory ID>: no fix through an upgrade | upgrade breaks the build; …","severity":"high","resolved":false}'
```

## 4 — Clean rebuild against the live API (optional — skip unless signing off)

Frontend already produced a clean build; only redo this if you want a from-scratch guarantee before a
human sign-off. Remove the build output and rebuild; a failed or incomplete build is a stop (no
fixtures, placeholder copy or `.htaccess` in the output).

- **Astro (SSG):** `rm -rf dist && npm run build && npm run check:dist`.
- **Next.js (SSR):** `rm -rf .next && npm run check && npm run build`.

## 5 — Preview & approval (optional — only when a person is signing off)

When someone wants to see it first: start the local preview (Astro: `npm run preview`; Next.js:
`npx next start`), show the user a couple of key routes at desktop and phone width (capture phone width
as in frontend's *Visual check*; frontend already caught the layout bugs, so this is for the user, not a
re-review) and navigation, and present it for **explicit approval**. If preview tooling is unavailable,
give the user the command and URL. On an autonomous or temp-domain run, skip this — deploy will verify the live result anyway.

Then (after approval, or immediately if 4–5 were skipped): `state.json` → `stage: "deploy"`, fresh
`updated_at`; leave `provision` unchanged.
