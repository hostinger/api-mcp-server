---
name: headless-step-refine
description: "Step 1 (refine) of the Hostinger Headless flow, the first stage the user talks to, run before the Hostinger connection. Turns the user's seed — often just a domain — into a brief through conversation: asks what they want to build (purpose, audience, tone, pages, products, must-haves; images, local files, links all welcome), then *infers* the backend that fits (WordPress, Ecommerce, WordPress + Ecommerce, WordPress + WooCommerce for a one-site content+store, or PocketBase for a custom app/SPA or any site whose visitors create its data: accounts, bookings, comments, votes, order requests) — it never asks the user to pick a backend or a technology; it asks for the site name (suggesting a few when the user has none), the user confirms the plan (and the image source) in plain language, and only after their yes it writes brief.md. Hostinger Ecommerce stays the default for selling; WooCommerce is chosen only when the user explicitly asks for it or wants content and a store on one WordPress site."
---

# headless-step-refine

Find out what the user wants to build, guess which backend fits, and write it down. This is a
**conversation, not a form**: the pasted prompt names a domain and nothing else, so everything about
the site comes from talking to the user.

**Keep it short.** You must know what they are building, whether they sell and whether they'll publish
content over time — enough to guess the backend — plus the **site name** the user gave or picked and,
when Step 2 found a project in the folder, the **Existing project** confirms. Every other question is
optional: the more the user gives, the better the site, but never hold the build hostage to
refinement. Fill gaps with sensible defaults (never the site name) and say so in the brief. A skipped
question tool is not the user passing on a question; see *When you ask the user* in the top-level
`SKILL.md`.

> **Never ask the user to choose a backend or a technology.** Don't ask "WordPress or Ecommerce?",
> don't present WordPress/Ecommerce/WooCommerce/PocketBase as options, and don't surface the backend in a
> multiple-choice UI. Open with **"What do you want to build?"** and infer the backend yourself in
> Step 4 from what they describe (and whether they sell). The backend is a technical decision the flow
> makes *for* the user — they confirm the **plan** (what the site is and does), not the plumbing. The
> only exception is when the user *volunteers* a backend ("build it on WordPress", "use WooCommerce"):
> then honour their choice and note it in the brief.

**In:** the domain (the workspace directory name), plus anything the user already shared.
**Out:** `~/.hostinger/<domain>/brief.md`.

Nothing in this step touches Hostinger. It runs before the connection (*Start of a run* in the
top-level `SKILL.md`), so it reads only the local workspace and the user; check-state checks the plan
against Hostinger afterwards and sends the run back here when the site fixes the backend. Refine is
the only writer of `brief.md`. It only asks, decides and writes.

---

## Step 1 — Read the workspace, then the resume check

Read everything already in `~/.hostinger/<domain>/` (`state.json`, any notes, images or files the
user dropped there) — it all counts as input.

If `brief.md` already exists for this domain, **don't overwrite it**:

- **Later build artifacts exist too** (`site.json`, `design.md`, `content-model.md`, `src/`): the
  build is under way, and check-state offers to resume it once you're connected. Ask nothing here,
  even when the pasted prompt says to start by asking what to build:
  `node <skill>/run-log.mjs <domain> stage-end refine skipped --note "build under way"`, and go on.
- **Only the brief:** show the user a three-line summary (what the site is, its pages, the suggested
  backend) and ask: *keep it, or change something?* Keep → go to Step 6, unless the brief has no
  **Site name** or **Images** section: then ask what's missing first (Round 1 question 4, or the
  Step 5 images line) and add it. Change → edit only what they asked for, then re-confirm (Step 5).
  A skipped tool result is not Keep; see *When you ask the user* in the top-level `SKILL.md`.

**A fixed backend.** On the first pass the backend is yours to pick from the conversation: what
onboarding set up on Hostinger isn't visible before the connection. It is **fixed** — never change
the Suggested backend — in two cases:

- **The site is already provisioned** (`site.json` exists). Explain that switching backends means a
  new domain.
- **Check-state sent you back because the site fixes it** (an onboarding PocketBase site, or a live
  site with a real backend). Re-decide
  what follows from that backend (Step 4's rendering, the Step 5 images line), then go to Step 5: its
  message opens by saying the site already runs on that backend and what changes for the user. When
  the plan needs what that backend can't do (checkout, a CMS the owner writes in), say so in the same
  message and offer to build on another domain instead.

A `brief.md` whose Suggested backend is **Webapp** is from an older flow: re-decide it in Step 4 (it
becomes **PocketBase**, or the user is pointed at the `deploy-to-hosting` skill).

## Step 2 — Gather what you already have

Before asking anything, collect what the user has already given you, so you don't ask for it again:

- **Inspect the directory the command was run in** — this is the biggest signal for the build mode
  (Step 3). Look for an existing **frontend / webapp / commerce project**: a `package.json`, a
  framework config (`next.config.*`, `astro.config.*`, `vite.config.*`, `svelte.config.*`, `nuxt.*`),
  a `src/` or `app/` tree, `index.html`, a storefront/cart, etc. A real project here usually means the
  user **already has their own frontend** and mainly needs a Hostinger backend to wire it to — lean
  toward "bring your own frontend" in Step 3. That is what *Step 2 found a project in the folder*
  means everywhere below.
- Anything in the pasted prompt beyond the domain (a sentence, a link, a screenshot).
- Files in the current project that look like site material (copy, logos, product lists, images).
- What the agent already knows about the user from local memory or this conversation (a prior build,
  stack preferences, a frontend they always use).
- The domain name itself — a hint only (`coral-pottery.com` suggests pottery), never a conclusion.

## Step 3 — Ask

When Step 2 found a project in the folder, ask **Build mode** and the **Existing project** confirms
below in the opener, after Round 1 when Round 1 still needs asking; they don't count toward
the 3 rounds, and code that answers Round 1 never skips them. Otherwise don't ask Build mode: it
defaults (see *Build mode* below).

If Step 2 already answers the Round 1 questions, skip the Round 1–3 questions below. Otherwise
open with one line and **wait for the user's answer**: *"Tell me what you want to build — a
sentence is enough. Links, screenshots or files help too. Skip anything you don't want to answer."*

The opener is the run's first message (see *The first message* in the top-level `SKILL.md`), sent
before any Hostinger setup. Of the rounds it asks Round 1 only (plus the
Build mode and Existing project confirms above, when they apply). Never fold Round 2 or 3 into it
(audience, pages, look, content or logo), not even as a numbered list under the opening question.

> **"What do you want to build?" is an OPEN question — ask it in plain prose and wait.** Never turn it
> into a multiple-choice list of pre-baked site ideas ("Coffee shop / Travel blog / Portfolio …"):
> that puts words in the user's mouth and defeats the point of asking. Let them describe it in their
> own words. The structured question UI is only for genuinely *choice-shaped* follow-ups (selling
> yes/no, which pages, tone adjectives, the build mode) — not for the opening question, and never for
> the backend.

Ask in **short rounds of 2–3 questions**, and adapt each round to the previous answers. If your tool
has a structured question UI (multiple choice with an "other" field), use it for the choice-shaped
follow-up questions (pages, selling yes/no, tone) — **never for the opening "what do you want to
build?" and never for the backend** (that's your decision, not theirs). **At most 3 rounds**, and stop
early as soon as you can guess the backend and the user seems done — "just build it" or "you decide"
means *use defaults*, not *ask again*, except for the site name and the Step 5 confirm. A skipped tool
result is not their answer: re-ask that round in plain text, as *When you ask the user* in the
top-level `SKILL.md` says. The re-ask repeats the round; it doesn't count toward the 3.

**Round 1 — what it is (required; the first three decide the backend):**

1. **What are you building?** The business or project, and what the site is for.
2. **Will you sell anything on it?** Physical products, digital products, services with checkout —
   or nothing. Skip it only when the answer is already unmistakable ("an online shop for my
   candles", "my personal blog"); when in doubt, ask.
3. **Will you publish content over time?** Blog posts, articles, news, recipes, portfolio pieces,
   case studies, and how often — or a handful of pages that rarely change. Skip it only when the
   answer is already unmistakable ("my personal blog", an app the user is deploying).
4. **What's the site called?** The business or brand name the site and logo will carry. Skip it when
   the user already named the business anywhere ("I run Paper Moon"), and use that name as given, even
   when it differs from the domain: asking again tells them you weren't listening. With no name, or
   "you decide", suggest 2–3 names that fit the business plus one taken from the domain
   (`kowalski-plumbing.co.uk` → "Kowalski Plumbing"), and wait for their pick: "you decide" means
   *pick from your suggestions*, because a name they never saw ends up on their logo and every page.

**Round 2 — what goes on it (optional, adapt to Round 1):**

- **Who is it for?** The audience, and how they'll find the site.
- **Pages** — propose a page list from what you know and ask them to add or remove.
- If they sell: **what and how many** — a rough product count, categories, whether products have
  variants (size, colour), and the shipping regions.

**Round 3 — how it should feel (optional, skip what you already know):**

This is the round that captures **all design input** — the design step reads it from `brief.md` to derive
the design directions, so it is **not** asked again later; gather it here:

- **Reference & look** — a **site they like (URL)** and what to take from it, plus a few adjectives for
  the vibe. Screenshots welcome.
- **Colours & brand** — brand/accent colours, logo, fonts, existing copy, photos. Note where they live.
- **Must-haves and no-gos** — contact form, newsletter, bookings, languages, things to avoid.

**Existing project — when Step 2 found a project in the folder (required, in the Build mode message):**

Build mode answers the look. The code shows the rest, but the user knows what has to survive the
move, so ask each as a confirm of what you found, naming it, so the user only says yes or corrects you:

1. **Routes that open directly** — the client-side routes you found (name them, e.g. `/stats`,
   `/settings`) must open from a typed link and survive a refresh? Ask only when the code routes in
   the browser (React Router, Vue Router, a history or hash router); a server-routed app has none.
2. **Data** — what the app stores, and where. An app **already written against a database of its
   own** — MySQL, Postgres, MongoDB, Supabase, Firebase: its code imports the client
   (`mysql2`, `pg`, `@supabase/supabase-js`, `firebase`), reads `DB_*`/`DATABASE_URL`, or has a
   `supabase/` folder — is **not a headless build**: say so plainly, point the user at the
   `deploy-to-hosting` skill (it deploys the app with its database), and stop here without writing a
   brief. An app with no backend yet, or that stores nothing, continues: what it stores goes to
   **PocketBase** (Step 4). Placeholder values in `.env.example` alone don't mean the app is wired to
   something; confirm with the user when the code is ambiguous.

Record the routes and data in **Existing project**.

Visitor accounts, member areas, bookings with limited places, comments, votes, leaderboards, live
chat and order requests without payment make the site a **PocketBase** build (Step 4) — don't record
them as out of scope. Bookings that sync with an outside calendar and payments outside a store stay
out of scope either way: say so plainly and record them under **Out of scope** — don't promise them.

> **A contact form *is* supported.** If the user wants one, keep it in **Must-haves** and name it
> "Contact form". On a **WordPress** backend, provision installs **Contact Form 7** and the frontend
> wires a contact page that emails the site owner. On a **PocketBase** backend it is a `messages`
> collection the owner reads in the dashboard (the contact-form recipe in
> `../04-content-model/pocketbase/patterns.md`), not Contact Form 7. It's **opt-in**: built only when
> the brief asks for it. A plain name/email/message enquiry form never turns a content site into a
> PocketBase build.

### Build mode — a user choice when the folder holds a project

The backend is your call, but **how the frontend gets built is the user's**. When Step 2 found a
project in the folder, ask **one** question (a structured choice is ideal here); it also settles the
app's look:

- **Bring your own frontend — keep my app's look** *(the default)* — the agent **uses the user's
  existing project in the current folder as the source**, collaborates on design/code at the user's
  direction, and wires it to the provisioned backend. There is **no agent-generated design** — the
  design step defers to the user (see the Build mode box at the top of the design step), and the
  frontend step builds on their project rather than scaffolding a new one. Build mode is **Bring your
  own frontend**; write "Keep the look we have: the app in this folder" in **Design direction**.
- **Agent rebuilds it — keep my app's look** — the design step reads the look (colours, fonts, logo)
  from their project, and the frontend step starts from the project's source, keeping its screens and
  features, and rebuilds its UI to that look. Build mode is **Agent designs and builds**; write "Keep
  the look we have: the app in this folder" in **Design direction**.
- **Agent rebuilds it — a new design** — the design step proposes directions and the frontend step
  rebuilds the app from them. Build mode is **Agent designs and builds**; take **Design direction**
  from Round 3.

A skipped tool result is not a pick: re-ask in plain text, and use the default only when the user
says so (see *When you ask the user* in the top-level `SKILL.md`).

Otherwise don't ask: Build mode is **Agent designs and builds**. When the user says they have their
own code elsewhere, ask for its path, inspect it as in Step 2, and from then on treat it as a project
found in the folder.

Record the Build mode the chosen option names in the brief's **Build mode**, and its look in **Design
direction**. This is the one frontend/technology question you *do* put to the user; everything else
about the stack (framework, SSR/SSG) is still inferred. The deliverable is the same either way — a working
site on the backend; only *who drives the frontend* changes.

## Step 4 — Decide the backend (your call, from the brief — not a question)

From what the user described, **you** pick the backend that fits — this is an internal decision, never
a question put back to the user. Pick the backend that fits what the user told you:

| Backend | Choose when | What it gives the owner |
|---|---|---|
| **WordPress** | No selling. The owner publishes and edits content: pages, blog, articles, portfolio. | Headless WordPress at `/cms` — write and edit content in wp-admin. |
| **Ecommerce** | Selling is the point, and the rest is a few static pages (About, Contact, FAQ, policies). No ongoing blog. | Hostinger Ecommerce store — products, collections, checkout, payments, shipping, orders. |
| **WordPress + Ecommerce** | Selling **and** regular editorial content (a blog, guides, lookbooks, recipes) the owner keeps adding to, run as **two** backends (WordPress site + separate Hostinger Ecommerce store). | Both: WordPress for content, the Ecommerce store for products and checkout. |
| **WordPress + WooCommerce** | **Only** when the user explicitly names WooCommerce, or explicitly wants content **and** a store on **one** WordPress site (one admin, one domain). The one-site alternative to WordPress + Ecommerce. | A single headless WordPress at `/cms` with the WooCommerce plugin — products, cart, coupons and checkout (Cash on Delivery) over the WooCommerce Store API, plus WP posts/pages on the same site. |
| **PocketBase** | A custom **app, SPA or web application** — a dashboard, tool, calculator, booking app, a project the user is deploying — **not** a content site or a store. Also any site whose **visitors create the data** it keeps and shows: accounts or a member area, bookings with limited places, comments, likes or votes, a leaderboard, live chat, order requests without payment. No CMS and no store engine. | A headless website with a **PocketBase** backend on the same domain: database, visitor sign-in, file storage and realtime at `/api`, the owner's dashboard at `/_/`. The app owns every other route. |

Rules of thumb:

- **Is it an app, or a site?** A custom application the user builds/brings (its own logic, its own
  data) → **PocketBase**. So is a site whose **visitors** write the data and the site shows it back
  (bookings, comments, votes, scores, messages, accounts): the owner writing pages, posts or products
  is a content site or a store; visitors writing records is an app. A plain contact form doesn't make
  it an app. A content site or a shop → one of the three above. When the user says "my app / SPA /
  dashboard / tool", or hands you an existing app project to deploy, that's **PocketBase** — even an
  app that stores nothing yet (a calculator, a static tool): it gets the backend with an empty schema,
  so there is one app path. An app already on its own database is not a headless build (Step 3).
- **Selling decides first (for sites).** No selling → WordPress. Selling → Ecommerce or
  WordPress + Ecommerce.
- **Then the content.** Selling plus only a few fixed pages → Ecommerce. Selling plus content the
  owner will keep publishing → WordPress + Ecommerce.
- **Hostinger Ecommerce is the default for selling — WooCommerce is never the default and is never
  recommended on its own.** Choose **WordPress + WooCommerce** only when the user explicitly names
  WooCommerce, or explicitly wants content **and** a store on one WordPress site (one admin, one
  domain — the one-site alternative to WordPress + Ecommerce). For every other selling case, keep
  Hostinger Ecommerce. If the user wants both content and a store but hasn't said "one site" or
  "WooCommerce", offer it as an option — don't switch to it silently.
- **Don't add WordPress "just in case".** A second backend is a second admin to learn. Recommend the
  combination only when the user described ongoing content.
- Selling a single service by enquiry (no checkout, no cart) is **not** commerce → WordPress with a
  contact page.
- **PocketBase never sits beside WordPress or a store.** Hostinger runs one backend per headless site
  and refuses PocketBase on a headless WordPress site. A site that is mainly content the owner
  publishes stays WordPress (a blog's comments are WordPress comments). If the user wants a custom app
  *and* a CMS/shop, that's two different sites — build the app on PocketBase and tell them the
  content/commerce backend is a separate domain.
- **PocketBase never takes payments.** Selling with checkout is Ecommerce; a PocketBase app stores
  order requests the owner handles by hand.
- **"Supabase" or "Firebase" with nothing wired yet** → PocketBase. Say once: *"Your Hostinger site
  comes with its own backend on the same domain, so you don't need a separate Supabase account. I'll
  use that."* Switch only if they insist, and then it is not a headless build (Step 3).

**Then set rendering** (write it in the brief's **Rendering** section): **Ecommerce → SSR required**
(carts/search need per-request rendering — any SSR framework works; Next.js is the default, not a
requirement); **WordPress + WooCommerce → SSR required** (same reason — cart/checkout need per-request
rendering); **WordPress → SSG (Astro)** if the site is mostly static and the owner is fine rebuilding
to publish, otherwise **SSR**; **PocketBase → whatever the app is** (SSR for a server app, SPA for a
client-only app) — it deploys as a Node.js app either way, and it never serves its own routes under
`/api` or `/_` (they belong to PocketBase). When unsure, default to **Next.js SSR**.

## Step 5 — Confirm the plan in one message

This confirm always happens, even after "you decide" or "just build it": an owner who said "go" early
hasn't seen the name or the plan yet. Send **one** message, on its own, that confirms **what you'll
build** — the plan, not the plumbing. Lead with the site, not the backend:

- **The name** — the site name from Round 1, as it will appear on the logo and pages.
- **The plan** — what it is, audience, pages, products (if any), tone. Mark anything you defaulted
  (*"assumed: warm, minimal look"*) so the user sees what they skipped.
- **Your app** *(when Step 2 found a project in the folder)* — one line: keeps its look or gets a new
  one, the routes that must open directly, and what it will store on the site.
- **How it's built** — state the backend as a *consequence* in one plain line, focused on what it
  means for them day to day ("I'll build this on WordPress, so you edit pages and posts in a normal
  WordPress admin"; for PocketBase: "Bookings and accounts are saved on your site, and you see and
  manage them in your site's dashboard"), **not** as a choice you're asking them to make. Don't ask "is WordPress OK?" or
  offer alternatives unless it was a genuine close call *and* the difference matters to the user.
- **Images** — where the site's photos come from, as one line with this backend's default and the
  other options, both from the table in `../04-content-model/SKILL.md` → *Images*. For example, on
  WordPress: "I'll generate the images with Hostinger AI to match the design; say if you'd rather have
  stock photos from Unsplash." It's content's one choice, asked here because it needs the user and
  not Hostinger, so nothing later stops to ask it.

End with *"Good to go, or anything to change?"* and end your turn there: nothing after refine
(provision, content, design, logo) starts until the user replies (see *When you ask the user* in the
top-level `SKILL.md` for a run no one will answer). A yes (or "go") → write `brief.md`, with the
default image source unless they picked another. A skipped tool
result is not a yes (see *When you ask the user* in the top-level `SKILL.md`). Changes → apply them
and write it; don't loop back into questions. If the user *volunteers* a different backend, use theirs
and note it in the brief.

## Step 6 — Write `brief.md` and hand off

Write `brief.md` from the template below. Fill every section from the conversation, defaulting what
the user skipped and tagging it `(assumed)`; leave out **Products** when nothing is sold and
**Existing project** unless Step 2 found a project in the folder. Use the user's own words where you
can. Then set `state.json` → `stage` to the stage *Start of a run* in the top-level `SKILL.md` names
after refine (`connect` on the first pass, else the stage that sent the run back here), with a fresh
`updated_at`, and go on to it.

The **Suggested backend** section is the contract with `03-provision/SKILL.md`, which routes on it.
Its first line must be exactly one of `**WordPress**`, `**Ecommerce**`, `**WordPress + Ecommerce**`,
`**WordPress + WooCommerce**` or `**PocketBase**`, followed by an em dash and the one-line reason.

## `brief.md` template

```markdown
# Brief — <domain>

> Brief agreed with the user on <today>.

## Site name
**<site name>** — <"Given by the user." | "Picked by the user from: <the suggestions>." | "Taken from
the domain; no one was there to answer.">

## Purpose
<what the site is, who runs it, what it's for — 2–3 sentences>

## Audience
<who visits, how they arrive, what device they mostly use>

## Tone
<voice in a sentence or two>

## Design direction
<look & feel in a few adjectives; **reference site(s)** the user named (URLs) and what to take from them
(layout, structure, mood); colours / brand palette; any screenshots. This is where ALL design questions
land — the frontend step reads this and does not re-ask. Write "Agent's choice: <short style>" when the
user didn't specify. Record in the user's own words a request to keep their current look ("Keep the look
we have: <site URL | screenshots | brand guide | the app in this folder>") and any logo idea they describe; the design step acts
on both.>

## Pages
- **<Page>** — <one-line purpose>
- …

## Products
<only when selling: what is sold, rough count, categories, variants, shipping regions, payments>

## Content
<what the owner will publish over time and how often — or "A few fixed pages; no ongoing content.">

## Must-haves
- …

## Out of scope
- …

## Assets
<logo, colours, photos, copy the user provided and where they are; "None yet" if none>

## Existing project
<only when Step 2 found a project in the folder: its path; the framework; the client-side
routes that must open directly and on refresh (or "None"); what the app stores (or "Nothing"); the env
var names the app reads — names only, never values>

## Suggested backend
**<WordPress | Ecommerce | WordPress + Ecommerce | WordPress + WooCommerce | PocketBase>** — <one-line reason>.
<"Confirmed by the user." or "User chose this over the recommended <X> because <reason>.">

## Images
**<Hostinger AI | Unsplash | Generated by the agent>** — <"Chosen by the user." | "Default for this
backend, shown in the plan confirm.">

## Build mode
**<Bring your own frontend | Agent designs and builds>** — <one line>. <When "Bring your own frontend":
how they want to drive design/code; the project's path is under **Existing project**. When "Agent designs and builds": leave the design + frontend steps to run as
normal; with **Existing project** filled, the frontend starts from that app's source and rebuilds its UI
to design.md.>

## Rendering
**<SSR | SSG>** — <reason; the rules are in Step 4's *Then set rendering*>.
```
