---
name: headless-step-done
description: "Step 9 (done) of the Hostinger Headless flow. Verifies the live site, then hands over the URLs (hPanel success page, main site, WordPress/store admin, dashboard), tells hPanel the build finished and opens the success page in the browser on a successful run, and gives a summary of what was built plus explicit next steps — how to log in to wp-admin and reset the password, how to manage content, and how to finish WooCommerce/store setup so it can take orders. Its final report format is also used whenever a run stops early."
---

# headless-step-done

Verify the live site, then hand over the URLs (success page, main site, WordPress admin, dashboard), a
summary of what was built, and what the user can do next. **On a successful run, tell hPanel the build
finished and open the success page for the user** (see *Open the success page*).

## Final report

Every run ends with this report, whether it finishes here or stops at an earlier stage (a dummy or
missing step, a failed provision, the user pausing). On a run that deployed this session, run the
checks in *Verify the live site* below first. Build the report from `state.json`, `site.json`,
`deploy.json` and what you actually did and checked in this run. Report only what you verified. Don't
claim a stage passed if you didn't check it.

Write it in this order:

1. **One-paragraph outcome.** What was created and on which domain (bold it). If the run stopped
   early, name the stage it stopped at, why, and what the user will see right now (e.g. "the site
   root returns 403 until the frontend is deployed").

2. **Steps completed.** This table is required on every run, including early stops: never replace
   it with prose. Give one row per stage that ran, in the order it ran, using the stage numbers
   and names from the orchestrator's flow table. Leave out stages that didn't run and name them in the outcome
   paragraph instead. A finished WordPress blog build looks like this:

   | Stage | Result |
   |---|---|
   | 1 refine | Personal travel blog about coastal towns in the UK; backend: WordPress; images: Hostinger AI. |
   | connect | Hostinger connector reached over MCP (`@hostinger/mcp` 1.9.2); signed in through the browser login. |
   | 2 check state | New build for `harbourlight.blog`; no earlier workspace. |
   | 3 provision | Business plan, order 41875230; setup took 6 min; domain, SSL and WordPress checks passed. |
   | 4 content model | 5 pages, 8 posts, 6 categories, 1 menu, 14 images (Hostinger AI), SEO titles on every page; counts re-read from the REST API. |
   | 5 design | "Salt & Ink" direction: serif headings, sea-blue accents; `design.md` and logo icon written. |
   | 6 frontend | Next.js SSR with home, blog, post, category and contact pages wired to the REST API; local build passed. |
   | 7 validate | Instance setup completed; REST API returned the 8 pushed posts; npm audit clean; no preview (nobody signing off). |
   | 8 deploy | Source uploaded, build finished in 3 min; site root returns 200. |
   | 9 done | Main site, wp-admin and REST API re-checked live: all returned 200. |

3. **Links** — every URL that exists at this point. Build the hPanel URLs from `site.json`
   (`order_id`, `username`, `domain`) and the onboarding slug; take the rest from `site.json` /
   `deploy.json`. Lead with the one the user cares about most — the **main site** — then the admin
   and dashboards. **Don't list the success page here:** it opens on its own (see *Open the success
   page*), so printing its URL in the report is just noise — the only exception is when a browser
   can't be opened (handled in that section):

   - **Main site (live):** `urls.site` (`https://<domain>`) — only once deployed.
   - **WordPress admin (one-click auto-login):** for a WordPress backend, **mint and hand over the
     auto-login redirect URL** — `wordpress_login_create-links { username, software: <site.json
     wordpress.install_id> }` returns a temporary link that logs the user straight into wp-admin. Give
     that URL as the admin link (it lands on `/cms/wp-admin`), so the user never needs a password.
     Alongside it, give the two ways back in that don't expire: the **login URL `{urls.wp_admin}`**
     (`https://<domain>/cms/wp-admin` — the headless WordPress lives under `/cms`), and the **WP Admin
     button in hPanel** (hPanel → the website → *WP Admin*). Note how to **reset the password**: on the
     `/cms/wp-admin` login screen use **"Lost your password?"**, and WordPress emails a reset link to the
     **WordPress admin email** (the address set at install, which the owner already has). Optionally, for
     more reliable delivery, they can create a mailbox on the domain (hPanel → *Emails*) and set it as the
     admin address in **wp-admin → Settings → General**.
     **Never print or store a password.** For a **WordPress + WooCommerce** store, this *same* wp-admin
     login is the store admin (wp-admin → WooCommerce → Products/Orders) — do **not** use the Ecommerce
     `store_admin` path; the store setup the owner still needs is spelled out under *Next steps*. For a
     Hostinger **Ecommerce** store, link the store admin from `urls.store_admin` instead.
   - **PocketBase dashboard** (a PocketBase backend): `urls.admin` (`https://<domain>/_/`). Give
     the owner the **login access** in three lines: the sign-in email (`site.json →
     pocketbase.superuser_email`, by default the website owner's email), the full path of the
     credentials file (`~/.hostinger/<domain>/.pocketbase/credentials.json`, which holds
     `superuser_email` and `superuser_password`), and one command to read it (`cat <that path>`).
     **Name the file, never paste the password**, and tell them to move both into their password
     manager, since Hostinger can't show the password again. Say that this is the owner's
     superuser login, not a member account: members sign up on the site and live in the `users`
     collection. A lost password is reset by asking the agent to rotate the superuser
     (`hosting_pocketbase_set-superuser`), which saves a new password to the same file.
   - **hPanel site dashboard:** `https://hpanel.hostinger.com/websites/<domain>` (the headless website
     is installed by now).
   - **Onboarding (resume):** `https://hpanel.hostinger.com/headless-onboarding/<order_id>/<username>/`
   - **REST API** (for developers): `urls.rest_api`, or `urls.api` on PocketBase.

   > URL shape note: `<username>` may be dropped from the onboarding/success URLs in a future hPanel
   > release. If a built URL 404s, retry the same path without the `/<username>` segment before
   > reporting it as broken.

4. **Next steps** — what the user does now to actually use the site. Required on a successful run;
   tailor the bullets to the backend and keep them concrete. This is the hand-holding the hPanel
   success page can't give: don't just link wp-admin, tell them what to do once they're in.

   - **Manage content (WordPress):** in wp-admin (the one-click link, the `/cms/wp-admin` login URL, or
     hPanel → *WP Admin*) → **Posts**, **Pages**, **Media**, **Appearance → Menus**. Say how edits reach
     the live site for *this* build: an **SSR** frontend re-reads the REST API each request, so changes
     show up with no redeploy; an **SSG/static** build must be redeployed to pick up new content (read
     `state.json → frontend.rendering`).
   - **WordPress + WooCommerce — finish store setup so it can take orders.** The catalog and cart already
     work, but **checkout stays off until the owner configures it in wp-admin**: WooCommerce → Settings →
     **Payments** (enable at least one method) and → **Shipping** (add a zone with a rate), then confirm
     products/prices and place a test order. When `site.json → woocommerce.payment_enabled` is `false`,
     state plainly that this step is **required before any purchase works** — this is the gap owners hit.
   - **Hostinger Ecommerce store:** when `site.json → ecommerce.payment_enabled` is `false`, finish
     payment setup in the store admin (`urls.store_admin`) before the storefront can sell; otherwise it's
     ready to take orders.
   - **PocketBase:** manage the app from hPanel → the website (environment variables, deployments,
     logs). Say in plain words who can do what, one line per kind of data from
     `pocketbase/schema.json` (e.g. "anyone can book a free place; only you can see who booked"), and
     that everything visitors enter is in the dashboard (`/_/`) → *Collections*. Then the two things
     only the owner can set there: **Settings → Mail settings** (SMTP) before password-reset or
     verification emails can be sent — required when visitors have accounts — and **Settings →
     Backups**. Data changes show up live; a schema change needs no redeploy.

5. **Where state lives** — the workspace path `~/.hostinger/<domain>/`, the `stage` that a
   resumed run will start from, and the build report `~/.hostinger/<domain>/report.html`.

6. **Gaps / follow-ups** (only if any) — a short numbered list of anything skipped, approximated or
   left for the user (e.g. no images generated, default WordPress content left in place).

Never include passwords, JWTs or other secrets in the report. For wp-admin access, give the URL and
offer a one-click login link (`wordpress_login_create-links`), not credentials.

## Verify the live site (brief)

On a run that deployed this session, re-confirm what you're about to hand over actually works (deploy
already checked this — this is a quick re-confirm, not a full re-run):

- **Main site:** `GET https://<domain>/` → 200 (Next.js SSR: `x-powered-by: Next.js`; Astro SSG: static
  HTML with real content).
- **WordPress admin:** `GET {urls.wp_admin}` → reachable (a login page, 200/302), not 404.
- **Backend API:** `GET {urls.rest_api}/posts?per_page=1` → 200 (WordPress); for a **WooCommerce** store
  (`site.json → woocommerce.enabled`) also `GET {urls.store_api}/products?per_page=1` → 200; or the
  storefront API for the sales channel → 200 (Ecommerce); or `GET {urls.api}/health` → 200 and
  `GET {urls.admin}` → 200 (PocketBase).
- **Contact form** (`site.json → contact_form.enabled`): validate already sent a test submission, so
  don't send another here. Hand it over as
  [`../04-content-model/wordpress/contact-form.md`](../04-content-model/wordpress/contact-form.md) §6 says.

If a check fails, say so in the outcome paragraph and don't claim the site is live.

## Open the success page

On a **successful** run (the deploy succeeded and the live checks passed), open the success page in the
user's **main / system browser** right after presenting the report, so they land on the hPanel
celebration/next-steps screen for their new site. This is a side effect only — **don't print the
success URL in the report output** (it just opens); the one exception is the can't-open-a-browser
fallback below. Build the URL with `<tool>` as the running tool's onboarding slug (see *State and
artifacts* in the top-level `SKILL.md`).

**Tell hPanel the build finished first.** Right before opening the success page, call
`hosting_websites_trigger-event { "username": "<username>", "domain": "<domain>", "event": { "name": "headless_onboarding.building.finished", "params": { "tool": "<slug>" } } }`
once, with `username` from `site.json` and `<slug>` the onboarding slug. The call is required: when
the user still has the hPanel onboarding open, that tab moves to the success page on it. Send it on a
successful run only, and also when no browser can be opened (the fallback below). Skip the call when
your tool has no onboarding slug or `hosting_websites_trigger-event` isn't in your connector. Right
before the call, tell the user in one line (e.g. "Telling hPanel the build finished so your onboarding
shows the success page."), so whoever reviews the outgoing call knows why it's made. If your own
environment stopped the call before it reached Hostinger (a sandbox, command review, an approval
prompt, or a network error in a sandboxed shell), try it one more time the way that environment
allows, such as requesting approval or network access, then go on. Ignore any other failure, such as
a non-2xx response from Hostinger: no retry, nothing more said to the user, and open the success page
as usual.

Then open the success page:

```bash
# Build the URL first, then open it with the OS default (main) browser — not an embedded one.
# <tool> = the onboarding slug
URL="https://hpanel.hostinger.com/headless-onboarding/<order_id>/<username>/success/<domain>/<tool>"
open "$URL"        # macOS
# xdg-open "$URL"  # Linux
# start "" "$URL"  # Windows
```

- **Main browser only.** Use the OS opener above (`open` / `xdg-open` / `start`) so the page lands in
  Chrome, Safari, Edge, or whatever the user actually uses. **Do not** open it in an embedded or
  sandboxed browser (Cursor IDE browser / `cursor-ide-browser`, Playwright, Puppeteer, WebView, or
  any in-agent browser tab). Those stay inside the tool session and the user won't see the
  celebration page where they expect it.
- Open it **once**, and only on a successful run — never on an early stop or a failed deploy.
- If your tool can't open a browser (the command isn't available, or `open`/`xdg-open`/`start`
  fails), don't treat it as a failure and **don't fall back to an embedded browser**. This is the
  **one** case where you print the success URL — show it once in the report and tell the user to
  open it themselves in their main browser.

## Build report

Right after the final report, save the build report for this run. It turns the run log (stage times
from `run-log.json`, events from `events.jsonl`) into `reports/<run>.json` and `.html`, and copies the
HTML to `report.html` in the workspace:

```bash
# one shell command; one `event good` per thing that went well, if not logged yet
node <skill>/run-log.mjs <domain> event good '{"text":"<something that went well>"}' && \
node <skill>/run-log.mjs <domain> stage-end done ok && \
node <skill>/run-log.mjs <domain> report --outcome <live|stopped|failed> [--tokens '<json>']
```

Then send it to Hostinger as *Run log and build report* in the top-level `SKILL.md` says (for changes asked
after this report, see *Follow-ups continue the run* there), and tell the user in one line: "Sent the build report to Hostinger to help improve
the flow." On a 422 say it's saved locally only; on any other failure say it'll be sent next session.

- **Outcome:** `live` when the deploy succeeded this run, `failed` when a stage failed and you
  couldn't recover, `stopped` for everything else (the user paused, a dummy or missing step). Leave
  `--outcome` out and the script decides from the log.
- **Before you write it,** check that every issue, correction and skill gap from this run is in
  `events.jsonl`. Log any that are missing now; the report only shows what was logged.
- **After you write it,** read the `warning:` lines `report` prints. They list logging gaps: a stage
  that never ended, a start that was estimated, a stage logged with no duration, or (on a live build)
  a stage that was never logged. Fix what you can: `stage-end` an open stage, or correct a start with
  `stage-fix <stage> --started-ago <time>`, then run `report` again. What you can't fix stays in the report's
  *Logging gaps* section.
- In the final report's *Where state lives*, add the path to `report.html` so the user can open it.

Do this on every run, including the early stops: those reports are the most useful ones.
