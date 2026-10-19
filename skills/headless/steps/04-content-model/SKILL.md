---
name: headless-step-content-model
description: "Step 4 (content model) of the Hostinger Headless flow. Prepare phase: turns brief.md into a content helper (content-model.md) — fixed Title/Description plus a tailored generation prompt per section (Navigation, Pages, Articles) — and generates the drafts/images, no live backend needed. Push phase: routes to the backend subfolder to create it the backend's way once provision is ready."
---

# headless-step-content-model

Two phases around the **instance barrier** (see the top-level `SKILL.md`):

- **Prepare — no instance.** Build the content helper from `brief.md` and generate the content it
  calls for. Runs *during* the provision wait; needs only the brief.
- **Push — needs the instance.** Create that content in the backend. Gated on
  `provision.status == "completed"`; routes to `wordpress/` or `ecommerce/`.

**In:** `brief.md`. **Out:** `content-model.md` (+ any generated media under
`~/.hostinger/<domain>/media/`).

> Don't wait for provisioning — the helper comes from the brief alone.

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
> and a featured image (generated into media/, or sourced from Unsplash — see *Images* below) with
> alt text. Omit if the brief has no article-like content.

## Products (optional — required for a commerce brief)
> Skip for a non-commerce brief. For a commerce brief, generate the catalog content here (prepare
> work, no instance): for each product — name, slug, SKU, short + long description in the brief's
> tone, price, the collection it belongs to, variants if any, and a product image (generated into
> media/, or sourced from Unsplash — see *Images*) with alt text. Group products into the collections
> the brief implies. The `ecommerce` push phase creates these on the store's sales channel.
```

Guidance:

- **Fixed vs. prompt.** Title and Description are concrete values. Navigation, Pages and Articles are
  prompts because their volume/wording is generated — keep them as prompts so the push phase (or a
  rerun) can regenerate consistently.
- **Run the prompts now.** Generate the actual page copy, article drafts and images during the wait —
  this is the slowest work and the whole reason it runs in parallel. Put generated media in
  `~/.hostinger/<domain>/media/` and reference it by filename. Record Unsplash images by URL (see
  *Images* below). Record alt text for every image.
- **Optional sections.** Drop **Articles** if the brief has no article-like content. Drop **Products**
  for a non-commerce brief; for a commerce brief, generate the product catalog here (names, prices,
  descriptions, collections, images) — that's prepare work, and the `ecommerce` push phase then creates
  it on the store.
- **Don't block on design.** The design step (5) owns the look, and it runs in parallel during the
  provision wait, so never wait for it here. If `design.md` already exists when you source images,
  follow its **Imagery** section; otherwise generate neutral, on-topic imagery from the brief.

### Images — source from Unsplash when you can't generate them

Every article needs a featured image. If you can generate images, put them in `media/`. If you
can't (most coding agents can't), source real photos from Unsplash. This is still prepare work and
needs no live backend: you only pick the photos and record their URLs here. The push phase uploads
them.

1. **Find candidates.** Use one photo per article, matching its subject and destination.
   - With an `UNSPLASH_ACCESS_KEY` in the environment, use the official API:
     `GET https://api.unsplash.com/search/photos?query=<subject>&orientation=landscape` with header
     `Authorization: Client-ID <key>`.
   - Without a key, use web search limited to `unsplash.com` (e.g. "unsplash photo Lisbon tram") and
     take the photo id from the result URL: the last segment of `unsplash.com/photos/<slug>-<id>`, or
     the whole segment for `unsplash.com/photos/<id>`.
   - Don't call `unsplash.com/napi/…`. It sits behind a bot challenge and returns 401.
2. **Resolve a direct file URL.** `GET https://unsplash.com/photos/<id>/download?force=true` (don't
   follow the redirect) answers `302` with `Location: https://images.unsplash.com/photo-<…>?…`. The
   `dl=` parameter in it also carries the photographer's name. Drop the query string and request a
   web size: `https://images.unsplash.com/photo-<…>?w=1600&q=80&fm=jpg&fit=max`. The upload ability
   needs this direct file URL, which returns 200 with `image/jpeg`. A photo *page* URL won't work.
3. **Look before you keep it.** Download a small preview (`?w=500`) and view it. Search snippets
   only show captions, and a photo often isn't quite what its title says. Reject anything off-topic.
   If nothing fits exactly, take the closest real photo and note the gap rather than mislabel it.
4. **Write alt text from what the photo shows**, not from the article's image brief. For example,
   use "Shopfronts and parked scooters on a Hanoi street" even if the article is about rain.
5. **Record it** under each article in `content-model.md`:

   ```markdown
   Image: https://images.unsplash.com/photo-<…>?w=1600&q=80&fm=jpg&fit=max
   Image credit: <Photographer> — https://unsplash.com/photos/<id> (Unsplash License)
   Image alt: <what the photo shows>
   Image file: <site>-<subject>.jpg
   ```

Unsplash photos are free to use under the Unsplash License. Still credit the photographer: the push
phase stores "Photo by <Photographer> on Unsplash" as the image caption.

Then update `state.json`: set `stage` to the next prepare stage still to do, fresh `updated_at`. Do
**not** advance past the barrier here.

---

## Push phase — create it the backend's way (needs the instance)

Only once `provision.status == "completed"` (re-verified against `hosting_websites_list-setups`),
route on the brief's **Suggested backend** and follow that subfolder, which maps the helper onto the
live backend — for WordPress, through the per-site WP MCP's ability tools (the installation JWT
authenticates that MCP session; `wp/v2` REST is the public read surface, not a write path for the
token) to create the menu, pages, posts, categories and media:

| Suggested backend | Follow |
|---|---|
| WordPress | `wordpress/SKILL.md` |
| Ecommerce | `ecommerce/SKILL.md` |
| Webapp | — (no push; skip to frontend) |

> **Supported backends: `wordpress`, `ecommerce`, and `webapp`** — where `webapp` is "supported" by
> **skipping this whole stage** (it has no content backend; see the note below). PocketBase is not
> available in this version. Push to whichever single backend provision set up (see the provision
> router) — don't try to push to two backends here.
>
> **Webapp has no content backend.** There is no CMS or store to seed, so a `webapp` brief **skips this
> whole stage** — both prepare and push. The app owns its own data (its own API or database). Leave
> `content-model.md` unwritten, mark content-model `skipped` in the run log, and go straight to the
> frontend step.

After the push completes, update `state.json` and continue to the frontend **data** phase.
