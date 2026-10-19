---
name: headless-step-refine
description: "Step 2 (refine) of the Hostinger Headless flow. Turns the user's seed — often just a domain — into a brief through conversation: asks what they want to build (purpose, audience, tone, pages, products, must-haves; images, local files, links all welcome), recommends the backend that fits (WordPress, Ecommerce, WordPress + Ecommerce, or Webapp for a custom app/SPA), lets the user confirm it, then writes brief.md."
---

# headless-step-refine

Find out what the user wants to build, guess which backend fits, and write it down. This is a
**conversation, not a form**: the pasted prompt names a domain and nothing else, so everything about
the site comes from talking to the user.

**Keep it short.** The only thing you must know is *what they are building* — enough to guess the
backend. Every other question is skippable: the more the user gives, the better the site, but never
hold the build hostage to refinement. Fill gaps with sensible defaults and say so in the brief.

**In:** the domain (the workspace directory name), plus anything the user already shared.
**Out:** `~/.hostinger/<domain>/brief.md`.

Nothing in this step touches Hostinger. It only asks, decides and writes.

---

## Step 1 — Read the workspace, then the resume check

Read everything already in `~/.hostinger/<domain>/` (`state.json`, `connect.json`, any notes, images
or files the user dropped there) — it all counts as input.

If `brief.md` already exists for this domain, **don't overwrite it**. Show the user a three-line
summary (what the site is, its pages, the suggested backend) and ask: *keep it, or change something?*
Keep → go to Step 6. Change → edit only what they asked for, then re-confirm (Step 5).

If the site is already provisioned (`site.json` exists), the backend is **fixed** — never change the
Suggested backend on a provisioned site. Explain that switching backends means a new domain.

## Step 2 — Gather what you already have

Before asking anything, collect what the user has already given you, so you don't ask for it again:

- Anything in the pasted prompt beyond the domain (a sentence, a link, a screenshot).
- Files in the current project that look like site material (copy, logos, product lists, images).
- What the agent already knows about the user from local memory or this conversation.
- The domain name itself — a hint only (`coral-pottery.com` suggests pottery), never a conclusion.

## Step 3 — Ask

If Step 2 already answers *what are you building* and *will they sell*, skip straight to Step 4.

Otherwise open with one line: *"Tell me what you want to build — a sentence is enough. Links,
screenshots or files help too. Skip anything you don't want to answer."*

Ask in **short rounds of 2–3 questions**, and adapt each round to the previous answers. If your tool
has a structured question UI (multiple choice with an "other" field), use it for the choice-shaped
questions. **At most 3 rounds**, and stop early as soon as you can guess the backend and the user
seems done — "just build it", "you decide", or a skipped question means *use defaults*, not *ask
again*.

**Round 1 — what it is (the only required round):**

1. **What are you building?** The business or project, and what the site is for.
2. **Will you sell anything on it?** Physical products, digital products, services with checkout —
   or nothing. *This decides the backend.* Skip it only when the answer is already unmistakable
   ("an online shop for my candles", "my personal blog"); when in doubt, ask.
3. **Who is it for?** The audience, and how they'll find the site. *(skippable)*

**Round 2 — what goes on it (optional, adapt to Round 1):**

- **Content they'll publish over time** — blog posts, articles, news, recipes, portfolio pieces,
  case studies? How often? Or is it a handful of pages that rarely change?
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

If the user asks for something outside the scope (user accounts, member areas, bookings with a
calendar backend, user-generated content), say plainly that the headless flow doesn't support it yet
and record it under **Out of scope** — don't promise it.

## Step 4 — Recommend the backend

Pick the backend that fits what the user told you:

| Backend | Choose when | What it gives the owner |
|---|---|---|
| **WordPress** | No selling. The owner publishes and edits content: pages, blog, articles, portfolio. | Headless WordPress at `/cms` — write and edit content in wp-admin. |
| **Ecommerce** | Selling is the point, and the rest is a few static pages (About, Contact, FAQ, policies). No ongoing blog. | Hostinger Ecommerce store — products, collections, checkout, payments, shipping, orders. |
| **WordPress + Ecommerce** | Selling **and** regular editorial content (a blog, guides, lookbooks, recipes) the owner keeps adding to. | Both: WordPress for content, the Ecommerce store for products and checkout. |
| **Webapp** | A custom **app, SPA or web application** that brings its own code and data — a dashboard, tool, calculator, booking app, a project the user is deploying — **not** a content site or a store. No CMS and no store engine. | A plain Node.js app host (an empty website, no `/cms`), with a MySQL database when the app needs one. The app owns all its routes and data. |

Rules of thumb:

- **Is it an app, or a site?** A custom application the user builds/brings (its own logic, its own data,
  maybe a database) → **Webapp**. A content site or a shop → one of the three above. When the user says
  "my app / SPA / dashboard / tool", or hands you an existing app project to deploy, that's **Webapp**.
- **Selling decides first (for sites).** No selling → WordPress. Selling → Ecommerce or
  WordPress + Ecommerce.
- **Then the content.** Selling plus only a few fixed pages → Ecommerce. Selling plus content the
  owner will keep publishing → WordPress + Ecommerce.
- **Don't add WordPress "just in case".** A second backend is a second admin to learn. Recommend the
  combination only when the user described ongoing content.
- Selling a single service by enquiry (no checkout, no cart) is **not** commerce → WordPress with a
  contact page.
- **Webapp never uses WordPress or a store.** If the user wants a custom app *and* a CMS/shop, that's two
  different sites — build the app as a Webapp and tell them the content/commerce backend is a separate
  domain.

**Then set rendering** (write it in the brief's **Rendering** section): **Ecommerce → SSR required**
(carts/search need per-request rendering — any SSR framework works; Next.js is the default, not a
requirement); **WordPress → SSG (Astro)** if the site is mostly static and the owner is fine rebuilding
to publish, otherwise **SSR**; **Webapp → whatever the app is** (SSR for a server app, SPA for a
client-only app) — it deploys as a Node.js app either way. When unsure, default to **Next.js SSR**.

## Step 5 — Confirm in one message

Send **one** message that carries both the recommendation and the brief summary:

- **Backend** — the choice, the one-line reason, and what it means day to day (where they'll edit
  content and products). Name the alternative if it was a close call.
- **Brief** — what it is, audience, pages, products (if any), tone. Mark anything you defaulted
  (*"assumed: warm, minimal look"*) so the user sees what they skipped.

End with *"Good to go, or anything to change?"* A yes (or silence-equivalent like "go") → write
`brief.md`. Changes → apply them and write it; don't loop back into questions. If they pick a
different backend, use theirs and note it in the brief.

## Step 6 — Write `brief.md` and hand off

Write `brief.md` from the template below. Fill every section from the conversation, defaulting what
the user skipped and tagging it `(assumed)`; leave out **Products** when nothing is sold. Use the
user's own words where you can. Then update `state.json`:
`"stage": "provision"`, fresh `updated_at`.

The **Suggested backend** section is the contract with `03-provision/SKILL.md`, which routes on it.
Its first line must be exactly one of `**WordPress**`, `**Ecommerce**`, `**WordPress + Ecommerce**` or
`**Webapp**`, followed by an em dash and the one-line reason.

## `brief.md` template

```markdown
# Brief — <domain>

> Brief agreed with the user on <today>.

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
user didn't specify.>

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

## Suggested backend
**<WordPress | Ecommerce | WordPress + Ecommerce | Webapp>** — <one-line reason>.
<"Confirmed by the user." or "User chose this over the recommended <X> because <reason>.">

## Rendering
**<SSR | SSG>** — <reason>. Rules: **Ecommerce requires SSR** (carts/search need per-request
rendering — any SSR framework works; Next.js is the default, not a requirement); **WordPress may be
SSG (Astro)** when the site is mostly static and rarely changes, otherwise **SSR**. Default when
unsure: **Next.js SSR**.
```

## Example — WordPress + Ecommerce

> A ceramicist sells around 30 handmade pieces and writes a monthly studio journal.

```markdown
## Suggested backend
**WordPress + Ecommerce** — sells ~30 products with checkout, and the owner publishes a monthly
studio journal they want to edit themselves.
Confirmed by the user.
```
