---
name: headless-step-content-model
description: "Step 4 (content model) of the Hostinger Headless flow. Prepare phase: turns brief.md into a content helper (content-model.md) — fixed Title/Description plus a tailored generation prompt per section (Navigation, Pages, Articles) — and generates the drafts/images, no live backend needed. Push phase: routes to the backend subfolder to create it the backend's way once provision is ready."
---

# headless-step-content-model

Two phases around the **instance barrier** (see the top-level `SKILL.md`):

- **Prepare — no instance.** Build the content helper from `brief.md` and generate the content it
  calls for. Runs *during* the provision wait; needs only the brief.
- **Push — needs the instance.** Create that content in the backend. Gated on
  `provision.status == "completed"`; routes to `wordpress/`, `ecommerce/` or `pocketbase/`.

**In:** `brief.md`. **Out:** `content-model.md` (+ any generated media under
`~/.hostinger/<domain>/media/`).

> Don't wait for provisioning — the helper comes from the brief alone.

---

## Prepare in a subagent

**Content subagent: skip this section and start at *Prepare phase*.** Main agent with a subagent
tool: don't do the prepare phase yourself (*Content and design at the same time* in the top-level
`SKILL.md`). Take the image source from `brief.md` → *Images* (asking it only when the brief has no
such section, as *Images* below says), then launch one background subagent with the prompt below and go on to design. One subagent keeps the whole site in one voice and leaves
no files to merge.

Send the prompt as it is, filling only the `<…>` slots. Add nothing to it: word counts, item counts,
extra photos or extra sections make the subagent slower, and the push waits for it.

```text
You are the content subagent of a Hostinger headless build for <domain>. Do content prepare
yourself, start to finish, and skip the section "Prepare in a subagent".

Workspace: ~/.hostinger/<domain>/ (brief.md is there). Skill folder: <skill folder>.
Backend: <backend from brief.md>. Image source: <brief.md → Images>.

Follow <skill folder>/steps/04-content-model/SKILL.md → "Prepare phase". For the file format: on
wordpress, with or without WooCommerce, also <skill folder>/steps/04-content-model/wordpress/SKILL.md
→ "Step 1 — Write content.json" (the catalog goes under "store"); on pocketbase, also
<skill folder>/steps/04-content-model/pocketbase/SKILL.md → "Prepare phase"; on ecommerce,
content-model.md holds the products.
Take sizes and counts from brief.md and those files only.

Write only content-model.md, content.json or pocketbase/schema.json, and media/. Leave state.json,
the run log, design.md and brand/ alone, and call neither the Hostinger connector nor the live site.
You can't ask the user anything: the image question is already answered above, and wherever a file
says to offer or ask the user, or brief.md is silent, pick what fits the site and list it as a gap.
For Hostinger AI images, write their briefs only; the main agent generates them later.

Report back: the files you wrote, the page, article and product counts, and any gaps.
```

---

## Prepare phase — write the content helper (no instance)

`content-model.md` is a lightweight helper, not a schema. Fill the **fixed values** from the brief and
write a **generation prompt** for each section — tailored to *this* site, not generic. Then run those
prompts to produce the drafts (and images), so the push phase is just upload.

Write `content-model.md` from this template, adapting every prompt to the brief's purpose, audience
and tone:

```markdown
# Content — <domain>

> Content helper prepared from brief.md on <today>. Fixed values are set; each prompt is run
> during the provision wait to generate the content and media. Push to the backend happens later.

## Title
<site name, from the brief>

## Description
<one–two line site description / default meta, from the brief>

## Navigation
> Generate the primary menu from the site's pages in reading order (<list the brief's pages>).
> Short labels; note which items are static pages vs. listing pages. Add a footer menu if the
> brief implies one (socials, contact).

## Pages
> Generate each page the brief lists. For every page: title, slug, a short section outline, the
> copy for static pages (e.g. About, Contact), and SEO title + description.
> <bullet the brief's pages with their one-line purpose>

## Articles (optional)
> Generate <N> articles across the brief's categories (<list them>). For each: title, slug,
> body in the brief's tone, category, any relationship (e.g. destination), published date, SEO,
> and a featured image (see *Images* below — Hostinger AI generation or Unsplash stock) with
> alt text. Omit if the brief has no article-like content.

## Products (optional — required for a commerce brief)
> Skip for a non-commerce brief. For a commerce brief, generate the catalog content here (prepare
> work, no instance): for each product — name, slug, SKU, short + long description in the brief's
> tone, price, the collection it belongs to, variants if any, and a product image (see *Images* —
> Hostinger AI generation or Unsplash stock) with alt text. Group products into the collections
> the brief implies, and generate any **coupons** the brief calls for (code, type, amount). The
> `ecommerce` push phase creates these on the store's sales channel; a **WordPress + WooCommerce** brief
> seeds them into WooCommerce instead (see `wordpress/SKILL.md` + `wordpress/woocommerce.md`) — there
> the **SKU is the idempotency key** and coupons + product categories are part of the catalog.
```

Guidance:

- **Fixed vs. prompt.** Title and Description are concrete values. Navigation, Pages and Articles are
  prompts because their volume/wording is generated — keep them as prompts so the push phase (or a
  rerun) can regenerate consistently.
- **Run the prompts now.** Generate the actual page copy and article drafts during the wait — this is
  the slowest work and the whole reason it runs in parallel. Images depend on the chosen source (see
  *Images* below): Unsplash photos and your own generated files can be produced now; Hostinger AI
  images only generate once the instance exists, so write their brief now and generate at the barrier.
  Put any generated/own media in `~/.hostinger/<domain>/media/` and reference it by filename. Record
  alt text for every image.
- **WordPress: drafts go straight into `content.json`.** On a WordPress backend, write the generated
  copy, terms, menu and image details into `~/.hostinger/<domain>/content.json` (format: `wordpress/SKILL.md`
  Step 1), not into `content-model.md`, so nothing is written twice. `content-model.md` keeps the fixed
  values, the prompts and the image briefs.
- **PocketBase: the fixed copy still comes from here.** Title, Description, Navigation and Pages are
  built into the frontend as on any backend; drop Articles and Products unless the brief has them. What
  visitors create (accounts, bookings, comments, votes, order requests) is designed in
  `pocketbase/schema.json` by `pocketbase/SKILL.md`'s prepare phase, run alongside this one.
- **Optional sections.** Drop **Articles** if the brief has no article-like content. Drop **Products**
  for a non-commerce brief; for a commerce brief, generate the product catalog here (names, prices,
  descriptions, collections, images) — that's prepare work, and the `ecommerce` push phase then creates
  it on the store.
- **Don't block on design.** The design step (5) owns the look, and it runs in parallel during the
  provision wait, so never wait for it here. If `design.md` already exists when you source images,
  follow its **Imagery** section; otherwise generate neutral, on-topic imagery from the brief.

### Images — generate with Hostinger AI, or source stock from Unsplash

Every article (and every product) needs an image. There are two sources, and **the user chooses —
never pick silently.** Refine offers the choice in its plan confirm, with this backend's default
named, and records it in `brief.md` → **Images**: use that. Only a brief without an Images section
(written before refine asked it) leaves the question to you: state the default for this backend in
one line, name the other option, and proceed on their answer ("you decide" = use the default; a
skipped tool result is not an answer, see *When you ask the user* in the top-level `SKILL.md`):

| Option | Tool | Backends | Needs the live instance? |
|---|---|---|---|
| **A — Hostinger AI image generation** *(default for WordPress / WooCommerce)* | `wordpress_ai-content_generate-images` | WordPress, WordPress + WooCommerce | **yes** — runs at the instance barrier |
| **B — Unsplash stock photos** *(default for Ecommerce / PocketBase; the fallback everywhere)* | Unsplash API, or web fetch of Unsplash search pages | any | no — pure prepare work |

> **Do not silently fall back to stock on a WordPress site.** On WordPress / WooCommerce the default is
> **Hostinger AI (Option A)** — on-brand, generated from `design.md`. Using Unsplash on a WordPress build
> is only correct when **the user chose it**, or when **AI generation actually failed** (and then you say
> so). Taking stock because it is faster, synchronous, or avoids the async poll is a **defect**, not a
> shortcut: the async start → poll → upload-before-expiry flow (Option A below) is the expected work, not
> an optional extra. If you are tempted to skip it "for speed", stop and ask the user instead.

If you can generate images yourself (some agents can), that's a third option, which refine offers;
only if the user picks it (**Generated by the agent** in the brief), put the files in `media/` (no tool needed). **Record alt text for every image whichever source
you use.**

**During the prepare wait, write an image brief for each image** into `content-model.md` no matter the
option (subject, `image_type`, aspect, and the alt text you expect). Option B can also *fetch* the
photo now (see Option B); Option A only generates once the instance exists, so its briefs wait for the barrier.

#### Option A — Hostinger AI image generation (WordPress backends)

`wordpress_ai-content_generate-images` generates on-brand images for a live WordPress install, so it
runs **at the instance barrier** (after `provision.status == "completed"`), using the install from
`site.json` (`username`, and `wordpress.install_id` → the `software` path param). Follow `design.md`'s
**Imagery** section for look and palette. It is **asynchronous**:

1. **Start** one generation per image:

   ```json
   { "operation": "wordpress_ai-content_generate-images",
     "params": {
       "username": "<site.json username>",
       "software": "<site.json wordpress.install_id>",
       "prompt": "<what the image shows; for a logo, the wordmark + mark to render>",
       "image_type": "hero|background|inline|gallery|product|logo",
       "num_of_images": 1,
       "style": "<photographic style tokens from design.md; ignored for logo>",
       "color_guidance": "<logo only — colour direction, not rendered as text>" } }
   ```

   `prompt` (3–2500 chars) and `image_type` are required; `width`/`height` (128–2048) default per type
   and are ignored for `logo`. Returns `202` with a `generation_id` and `status: in-progress`.
   **Only one generation runs per install at a time** — a `409` means one is already running (and it
   returns no id), so wait for it to finish before starting the next. The endpoint allows 10
   requests/minute.

2. **Poll** `wordpress_ai-content_generation-result` with `{ username, software, generation_id }`
   every few seconds until `status` is `completed` (or `failed`). A completed result carries
   `result.images[]` — each with a **temporary** `url`, plus `width`, `height`, `content_type` — and
   `result.expires_at`.

3. **Use the images before they expire.** The URLs are short-lived, so in the push phase hand each
   `url` straight to WordPress with `media-upload-from-url`, which downloads and stores WP's own copy
   (see the wordpress push `SKILL.md`). Don't persist the temporary URL as the live image. There is no
   photographer to credit — leave `caption` empty or a short on-brand one. Generate these images last,
   right before the push, and put each `url` in its article's or product's `image` in `content.json`
   (with `alt` and `filename`).

   On `failed`, retry once with a tightened prompt; if it fails again, fall back to Option B ([`images-unsplash.md`](images-unsplash.md))
   and note the gap. Never block the whole push on a single image.

#### Option B — stock photos from Unsplash (any backend, no instance)

Follow [`images-unsplash.md`](images-unsplash.md). It is prepare work and needs no live backend.

Then update `state.json`: set `stage` to the next prepare stage still to do, fresh `updated_at`. Do
**not** advance past the barrier here. A content subagent skips this: the main agent owns
`state.json`.

---

## Push phase — create it the backend's way (needs the instance)

Only once `provision.status == "completed"` (see *State and artifacts* in the top-level `SKILL.md`),
route on the brief's **Suggested backend** and follow that subfolder, which maps the helper onto the
live backend — for WordPress, through the per-site WP MCP's ability tools (the installation JWT
authenticates that MCP session; `wp/v2` REST is the public read surface, not a write path for the
token) to create the menu, pages, posts, categories and media:

| Suggested backend | Follow |
|---|---|
| WordPress | `wordpress/SKILL.md` |
| WordPress + WooCommerce | `wordpress/SKILL.md` — pushes WP content **and** seeds the WooCommerce catalog (its WooCommerce section + `wordpress/woocommerce.md`) |
| Ecommerce | `ecommerce/SKILL.md` |
| PocketBase | `pocketbase/SKILL.md` — applies `pocketbase/schema.json` (collections, access rules, seed records) to the backend and verifies it |

> **Supported backends: `wordpress` (optionally with a WooCommerce store), `ecommerce` and `pocketbase`.**
> A **WordPress + WooCommerce** brief routes to `wordpress/SKILL.md`, which pushes the WP content
> **and** seeds the WooCommerce catalog in the same push. A **PocketBase** brief pushes its collections,
> rules and seed records through `pocketbase/SKILL.md`; its fixed copy stays in `content-model.md` and
> is built into the frontend, since PocketBase holds what visitors create, not the site's pages.
> Push to whichever single backend provision set up (see the provision router) — don't try to push to two
> backends here.

After the push completes, update `state.json` and continue to the frontend **data** phase.
