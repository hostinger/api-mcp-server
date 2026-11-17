---
name: headless-step-frontend
description: "Step 6 (frontend) of the Hostinger Headless flow. Builds the website that renders the backend's content. Figures out (or confirms) the framework — defaulting to Next.js SSR — implements the look already chosen in design.md (the design step's contract), and builds the source into src/. Only ask for the clarifications you actually need."
---

# headless-step-frontend

Build the site's frontend against the backend from `site.json`, implementing the look the design step
already chose and wrote to **`design.md`** (plus the logo in `brand/`). The design is decided; this step
is where it becomes real code. There's no per-framework recipe — use good judgement, follow `design.md`
as the contract, and ask only for the clarifications you genuinely need. **Out:** source in the site
workspace `~/.hostinger/<domain>/src/`.

> **Build mode "Bring your own frontend"? Read this first (any backend).** Read `brief.md` → **Build mode**.
> When it is **Bring your own frontend**, follow [`bring-your-own-frontend.md`](bring-your-own-frontend.md): wire the user's own project to the
> backend instead of scaffolding one. When it is **Agent designs and builds**, proceed normally.

> **PocketBase backend?** A `pocketbase` brief has **no CMS/store**: the app's data lives in the
> PocketBase backend recorded in `site.json → pocketbase`, its collections in `pocketbase/schema.json`
> (and the `## Data` section of `content-model.md`), and its fixed copy in `content-model.md`. A new
> app is scaffolded from `brief.md` and `design.md` and binds its forms and views to the collections
> in `pocketbase/schema.json`; an existing app under **Agent designs and builds** starts from its
> source, keeps its screens and features, wires its data to the backend and rebuilds its UI to
> `design.md`. In Step 3 follow the PocketBase bullet.

## Step 1 — Pick the framework (guess → default → confirm)

**The rendering is already decided in `brief.md` → Rendering** (SSR or SSG, set during refine). Honour
it, and the backend constraint:

- **Ecommerce → SSR required** (carts/search need per-request rendering). Any SSR framework works —
  Next.js is the default, not a requirement (Express, Nuxt, SvelteKit, etc. are all fine).
- **WordPress + WooCommerce → SSR required** (same reason — cart/checkout need per-request rendering).
- **WordPress → SSG (Astro)** when the brief says SSG, otherwise **SSR (Next.js default)**.
- **PocketBase → the app's own stack.** An **existing app** keeps its current framework (don't impose one), including
  one rebuilt under **Agent designs and builds**; a
  **new app** uses whatever fits the brief (SSR or SPA). Either way it deploys as a Node.js app (Step 8) —
  an SSR app runs a server, a SPA builds to static output. The app must not serve anything under
  `/api` or `/_`: PocketBase owns those paths on this domain, so server routes go under another prefix
  (`/server`): Next.js `app/server/…` never `app/api/…`, and likewise no Nuxt `server/api/`, SvelteKit
  `src/routes/api/` or Astro `src/pages/api/`.
- Map rendering → framework: **`ssr` → Next.js**, **`ssg` → Astro** — unless the brief/prompt explicitly
  names another supported framework, in which case use that.

Supported frameworks are the ones in deploy's *Build configurations* table (`../08-deploy/SKILL.md`).

Confirm the framework with the user in one line only if the brief left it open. Record the choice in
`state.json`:

```json
{ "frontend": { "framework": "nextjs", "rendering": "ssr" } }
```

If the brief is silent, default to **Next.js SSR**.

## Step 2 — Implement `design.md` (don't re-design)

The look was already chosen and written by the design step. **Read `~/.hostinger/<domain>/design.md` and
implement it faithfully** — tokens (colour, type, spacing), components, per-page composition, imagery and
accessibility — plus the logo files in `brand/`. Don't re-run design questions or invent a new direction here.

- Treat `design.md` as the contract: the built pages should match its tokens, type scale, components and
  per-page composition, and the 8-point grid / WCAG 2.2 AA rules it carries.
- Build the **logo** and favicon exactly as `design.md` → **Logo** → *Use* says; never recolour or redraw
  what is in `brand/`.
- If `design.md` is **missing** (e.g. a resumed older build), fall back to `brief.md → Design direction`
  (reference site, colours, brand, adjectives) and a tasteful, accessible default — but prefer `design.md`
  whenever it exists.
- **Don't gate on approval here** — the result is shown at **validate** (Step 7).

**Only ask about the code, and only if it matters** (design decisions belong in the design step):
- Where the **source should live** — default `~/.hostinger/<domain>/src/`; ask only if they want a
  specific folder or an existing repo.
- **Git** — initialise / connect / push (default: a local project, no remote).
- A specific **component library** or technical must-have, if they implied one.

## Step 3 — Build against the backend

Two phases around the instance barrier (see the top-level `SKILL.md`): scaffold + build the shell while
provision settles, then wire live data once `provision.status == "completed"`.

Read the backend from `site.json`:

- **WordPress** → `urls.rest_api` (`wp/v2`), public read. Content is in the posts/pages/categories/media
  the content-model push created; nav/plan come from `content-model.md`. Map each item's **SEO** from its
  `yoast_head_json` into the page `<head>` (title, description, Open Graph, JSON-LD schema) — Yoast is
  installed by default at provision (`site.json → seo.enabled: true`). If `seo.enabled` is `false`
  (Yoast absent), fall back to generating per-page title/description/OG tags from each item's content.
  - **Decode WordPress text.** WordPress returns titles and names HTML-encoded (`Tea &#038; Cake`,
    `don&#8217;t`). Add the `entities` package and, in the one data module, run every title, name
    and SEO field you render as plain text (posts, pages, terms, Yoast, Store API products and
    categories) through `decodeHTML` once; strip an excerpt's tags first if you show it as text.
    Leave HTML fields (`content.rendered`, an excerpt shown as HTML) as they are, and never inject a
    decoded field as raw HTML.
  - **Contact form** (`site.json → contact_form.enabled: true`, any WordPress backend) → render the
    contact page's form and submit it **client-side** to `contact_form.feedback_url` exactly as
    [`../04-content-model/wordpress/contact-form.md`](../04-content-model/wordpress/contact-form.md) §3
    says. When `contact_form.enabled` is `false` or absent, render the contact page with plain contact
    details and **no form** — graceful, like disabled checkout; never half-build.
- **WordPress + WooCommerce** (`site.json → woocommerce.enabled: true`) → the WordPress bullet above **plus**
  the store, read over the **public WooCommerce Store API** (`site.json → urls.store_api`): follow
  [`../04-content-model/wordpress/woocommerce.md`](../04-content-model/wordpress/woocommerce.md) §2 for
  the calls, headers and minor-unit prices, and §4 for `site.json → woocommerce.payment_enabled` (while
  `false`, a graceful disabled-checkout state, no `/checkout` call, not a build error). **Never embed a
  consumer key client-side.**
- **Ecommerce** → the public Hostinger Storefront Core V2 API: follow [`ecommerce.md`](ecommerce.md).
- **PocketBase** → the `pocketbase` SDK against the backend on the same domain, following
  [`../04-content-model/pocketbase/frontend.md`](../04-content-model/pocketbase/frontend.md) (skip its
  static `.htaccess` section: a headless site deploys as Node.js and keeps no `.htaccess`). In the one
  data module: `new PocketBase(<origin>)` where the origin is `window.location.origin` in the browser
  and `site.json → urls.site` in local dev and on the server, then `pb.autoCancellation(false)` once.
  Build filters with `pb.filter()`, load a list then subscribe to it for live views, and unsubscribe on
  unmount. Build each form and view against the fields in `pocketbase/schema.json`, and show a rule
  rejection (a 400 with no field errors, a 404 on update) as a normal "not allowed" state. Add the
  sign-in form only when the schema has an auth collection visitors use
  ([`../04-content-model/pocketbase/auth.md`](../04-content-model/pocketbase/auth.md)). A public form
  includes its recipe's honeypot field, empty and hidden. **The superuser password never reaches the
  frontend**; server-side superuser work reads `PB_URL`, `PB_SUPERUSER_EMAIL` and
  `PB_SUPERUSER_PASSWORD` from the app's environment variables and signs in **its own** server-only
  client, never the shared `pb` that renders pages for visitors (`frontend.md`, Node.js apps). For an
  existing app, keep its screens and swap its data calls to the backend.

Guidelines (framework-agnostic):

- **One data module** is the single place that talks to the backend (e.g. `src/lib/data.ts`) — one file
  to inspect, one base URL to switch. Keep it swappable so the shell can build against stubs first.
- **Fetch at request time for SSR** (fresh content, no rebuild); a static build fetches at build time.
- **A failed or incomplete fetch is an error, not a silent empty/placeholder.** Planned content missing
  from the API is a build error too — a site that builds with holes ships with holes. *(On PocketBase
  the planned content is the fixed pages plus the seed records.)*
- **`content-model.md` is the source for what should exist** (pages, nav, collections mapping) — on
  every backend; on PocketBase it also carries the `## Data` section.
- **No `.htaccess`** in the project (deploy would overwrite the live one); don't commit `node_modules`
  or build output.
- Set `engines.node` to `22` (the deploy builds on Node 22).
- **Next.js 16+ only:** set the `build` script to `next build --webpack`, not plain `next build`. Next.js
  16 defaults `next build` to **Turbopack**, whose native compiler needs a newer glibc than the Hostinger
  build server has, so a Turbopack build fails on deploy and won't fall back to webpack. Webpack builds
  clean there. The `--webpack` flag exists only on Next.js 16+; on **Next.js 15.x** leave the build script
  as plain `next build` (it already defaults to webpack). (Alternative: pin Next.js to `15.x`, keeping
  plain `next build`.)

## Step 4 — Hand off

Confirm the project builds clean locally against the live backend, looks right at desktop and phone
width (below), no placeholder/fixture content remains, and `state.json → frontend` matches what you
built. Update `state.json` (`stage: "validate"`).
Validate (Step 7) owns the clean rebuild + user preview; deploy (Step 8) ships it with the `app_type`
and output directory that match the chosen framework + rendering.

**Visual check.** With the site running locally against the live backend, look at the home page and one
page of each template (e.g. a post, a product, the contact page) at desktop and phone width. Take all the
screenshots first, then open them all in one turn where your tool can open several images at once, since
each separate look costs a model turn. Don't tile several pages onto one image or take one tall
full-page shot: the viewer shrinks big images, and a shrunk page hides small bugs like a wrapped line.
After a fix, re-shoot only what changed. Phone width is where most layout bugs show. Headless Chrome
won't size a window below ~500 px, so a phone-width window comes back cropped: set a 390 px viewport
(e.g. Playwright), or put one route in 1280 px and 390 px iframes side by side on a local page to get
both widths in one image. The live site runs this same build, so it needs no screenshots; deploy checks
that it serves.

> **PocketBase:** the app reaches the live backend from local dev (`frontend.md`, Local development),
> so check one list and one create against it here, then delete the test records before handing over.
