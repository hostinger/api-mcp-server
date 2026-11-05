---
name: headless-step-content-model-wordpress
description: "Push phase of Step 4 for a headless WordPress backend: write the drafted content into one content.json and run push-content.mjs, which creates the site title, categories, tags, images, pages, posts, menu, Yoast fields and the WooCommerce catalog through the per-site WP MCP and records the created ids. By-hand recipe only when the script can't run. Idempotent, instance-gated."
---

# headless-step-content-model-wordpress

**Push phase — needs the live instance.** Run only after `provision.status == "completed"`.

**In:** `content-model.md`, `site.json`, the drafts from the prepare phase. **Out:** the content in
WordPress, and the created-id map in `content-model.md`.

Writes go through the **per-site WP MCP** (the Hostinger AI Assistant plugin), authenticated with the
installation JWT. The management MCP (`wordpress_*`) has no content endpoints, and `wp/v2` REST is the
public read surface the frontend uses, not a write path for that token. `push-content.mjs` handles all
of this: you write one file and run one command.

Also on this step, when the brief calls for them:

- **A store** (`site.json → woocommerce.enabled: true`): the catalog goes in the same content file
  (`store` below). Checkout stays owner-completed; see [`woocommerce.md`](woocommerce.md) §4.
- **A contact form** (`site.json → contact_form.enabled: true`): after the push, follow
  [`contact-form.md`](contact-form.md) to find the form id and deploy the spam guard.
- **Custom post types, taxonomies or a settings page:** deploy the plugin from
  [`custom-plugins.md`](custom-plugins.md) before the push, and create its entries with `cpt-create` after.

## Step 1 — Write `content.json`

Write `~/.hostinger/<domain>/content.json` in one go, from the drafts you generated in the prepare phase.
Leave out any section the site doesn't have. Every field below is what the script accepts; anything
else is refused, with the field named.

```json
{
  "site": { "title": "Crumb & Co", "description": "Sourdough baked daily in Lisbon" },
  "categories": [ { "name": "Bread", "slug": "bread" } ],
  "tags": [ { "name": "Sourdough", "slug": "sourdough" } ],
  "pages": [
    { "slug": "about", "title": "About us", "content": "<p>…</p>", "excerpt": "…",
      "image": { "url": "https://…", "alt": "…" },
      "seo": { "title": "…", "description": "…" } }
  ],
  "posts": [
    { "slug": "why-sourdough", "title": "Why sourdough", "content": "<h2>…</h2><p>…</p>", "excerpt": "…",
      "categories": ["bread"], "tags": ["sourdough"],
      "image": { "url": "https://images.unsplash.com/photo-…?w=1600&q=80&fm=jpg&fit=max",
                 "alt": "Loaves on a wooden shelf", "title": "Loaves on a shelf",
                 "filename": "crumb-loaves.jpg", "caption": "Photo by <Photographer> on Unsplash" },
      "seo": { "title": "…", "description": "…", "focus_keyword": "…" } }
  ],
  "menu": { "name": "Primary", "items": [ { "title": "About", "page": "about" }, { "title": "Journal", "url": "/journal" } ] },
  "store": {
    "categories": [ { "name": "Breads", "slug": "breads" } ],
    "products": [ { "sku": "CR-LOAF", "name": "Country loaf", "price": "6.50", "description": "<p>…</p>",
                    "short_description": "…", "categories": ["breads"], "image": { "url": "https://…", "alt": "…" } } ],
    "coupons": [ { "code": "WELCOME10", "discount_type": "percent", "amount": "10" } ]
  }
}
```

- **Slugs** are lower-case ASCII with dashes (`about-us`). References are slugs defined in the same
  file: a post's `categories` and `tags`, a menu item's `page`, a product's `categories`, and a page's
  or term's `parent`, which must be listed before its child.
- `content` and `excerpt` are HTML strings. A page can also take `parent` and `menu_order`; a term can take
  `description` and `parent`.
- **Images:** `url` must be a direct `https` file URL that answers 200 with an image type: an Unsplash
  web-size URL, or a Hostinger-AI image `url` (it expires, so generate right before the push; see the
  content-model `SKILL.md`, *Images* Option A, and leave `caption` empty). `alt` is required. `title` (it
  defaults to `alt`) is how a re-run finds the upload, so keep it unique per image. The same `url` used
  twice uploads once.
- **`seo`** sets the Yoast title, description and focus keyword. It's skipped when `site.json →
  seo.enabled` is `false`.
- **`store`** is only for a WooCommerce brief. `price` is a decimal string in major units (`"6.50"`). A
  product passes any other WooCommerce product field as given (`sale_price`, `stock_quantity`,
  `attributes`, …). Variations of a variable product are by hand. `discount_type` is `percent`,
  `fixed_cart` or `fixed_product`.

## Step 2 — Run the push

```bash
node <skill>/push-content.mjs <domain>
```

It mints the token itself (never printed), removes WordPress's "Hello world!" post and "Sample Page",
then creates the site title, terms, images, pages, posts with their featured images, the menu, the
Yoast fields and the store, each looked up first, so a re-run reuses what exists and updates pages,
posts and products to match the file. Then it checks the result over public `wp/v2` and the Store API
(every slug and SKU there once, featured images set, no duplicate uploads), and writes the id map into
`content-model.md` under `## Created in WordPress` and `## Created in WooCommerce`. Progress goes to
stderr; stdout is one JSON line with `counts`, `verify` and `ids`.

| Exit | Meaning | Do |
|---|---|---|
| `0` | Everything pushed and verified | Go on to Step 3 |
| `1` with `invalid` or `error` | The call or a file is wrong; nothing was pushed | Fix what it names and re-run |
| `1` with `failed` | Those items failed; the rest is in | Fix the cause the `error` names and re-run. If the same item fails twice, create just that item with [`by-hand.md`](by-hand.md) |
| `2` | It couldn't reach the site (sign-in, the site's MCP, a missing ability); `error` says why | Push with [`by-hand.md`](by-hand.md) |

A run cut short (a tool timeout, a kill) is safe to repeat: just run it again.

## Step 3 — Hand off

Run the contact-form and custom-type work above if the brief has them. Then update `state.json`
(`provision` stays `completed`; advance `stage` toward the frontend **data** phase) with a fresh
`updated_at`. The frontend reads `urls.rest_api` (and, for a store, `urls.store_api`), and nav from
`content-model.md`.
