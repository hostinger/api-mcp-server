---
name: headless-step-content-model-wordpress
description: "Push phase of Step 4 for a headless WordPress backend: open an authenticated session to the per-site WP MCP with the installation JWT, then create the content helper's Title/Description, categories, media, pages, posts and navigation through the MCP ability tools. wp/v2 REST is the public read surface, not a write path for this token. Idempotent, instance-gated."
---

# headless-step-content-model-wordpress

**Push phase — needs the live instance.** Run only after `provision.status == "completed"` (re-verify
against `hosting_websites_list-setups`). It maps the backend-agnostic `content-model.md` onto real
WordPress objects.

**In:** `content-model.md`, `site.json` (both prepared earlier), generated media under
`~/.hostinger/<domain>/media/`. **Out:** content created in WordPress; created IDs recorded back into
`content-model.md`.

## What creates what — and what authenticates it

The Hostinger **management** MCP (`wordpress_*`) is infra-only: it installs WordPress, plugins and
themes but has **no content endpoints**.

Writes go through the **per-site WP MCP** (the Hostinger AI Assistant plugin), authenticated with the
installation JWT. **The JWT authenticates the MCP endpoint only** — it is wired as the MCP server's
`authenticate_request`, and the plugin registers no global `determine_current_user` /
`rest_authentication_errors` filter. So a raw `POST /wp/v2/posts` with this token is **not**
authenticated; the admin user context (`wp_set_current_user`) exists only *inside* an MCP session.

| Surface | Base (from `site.json`) | Role |
|---|---|---|
| **Per-site WP MCP** | `urls.wp_mcp` (`mcp_url`) | **all writes** — create content through its ability tools |
| **WP REST API** `wp/v2` | `urls.rest_api` | **public reads only** (no auth needed) — what the Step 6 frontend consumes; do not write to it with the JWT |

> **The WordPress content model is posts, pages and categories** (plus media). For **SEO**, install
> **Yoast** through the connector so meta + schema come from a maintained plugin; the frontend reads each
> item's `yoast_head_json` (Step 4.7 below).

## Step 1 — Open the authenticated MCP session

Mint a short-lived token through the Hostinger connector:

```json
{ "operation": "wordpress_installations_jwt-token",
  "params": { "username": "<site.json username>", "software": "<site.json wordpress.install_id>" } }
```

Returns `token` (+ `mcp_url`, already stored as `urls.wp_mcp`). Connect to `urls.wp_mcp` as an MCP
client (`initialize` → `tools/list` → `tools/call`) and send the token on **every** request as:

- `X-Hostinger-JWT-Token: <token>` — the plugin's preferred header (checked first), **or**
- `Authorization: Bearer <token>` — accepted as a fallback (case-insensitive `bearer ` prefix).

The token lives ~24 h — mint on demand, **never print, log, or write it to `site.json` /
`content-model.md`**. If a call returns `401/403` with `token_invalid`/`invalid_api_key`, the token
expired or was revoked → re-mint and reconnect.

> **Transport gotchas (streamable HTTP MCP).** The endpoint is session-based: `initialize` returns an
> **`Mcp-Session-Id` response header** — capture it and send it on **every** subsequent request
> (`tools/list`, `tools/call`), or they fail with `-32600 Missing Mcp-Session-Id header`. Send
> `Accept: application/json, text/event-stream`. After `initialize`, post the `notifications/initialized`
> notification, and **tolerate a non-2xx on it** (it can answer 404 with no body — harmless; don't let
> it abort the session). A raw curl/HTTP client works fine for all this.

## Step 2 — Discover the ability tools

The server advertises either every ability as its own tool, or three **discovery meta-tools**
(discover → get-info → execute) to keep `tools/list` small. Call `tools/list` first and work with
what's there; with discovery, list abilities, then execute by ability name. The content tools that
cover this step (exact names come from discovery — don't hardcode them):

`SettingsTools` · `CategoriesTools` · `TagsTools` · `MediaUploadTools` / `MediaTools` · `PagesTools` ·
`PostsTools` · `MenusTools` / `NavigationTools` · `SeoTools`. A generic
`RestEndpointTool` can reach any `wp/v2` route *through the authenticated session* if no dedicated tool
fits.

Seen on a live install (Hostinger AI Assistant, discovery mode): the meta-tools are
`hostinger-ai-discover-abilities`, `hostinger-ai-get-ability-info { name }` and
`hostinger-ai-execute-ability { name, parameters }`. The abilities are named
`hostinger-ai/<thing>-<action>`, e.g. `posts-create`, `posts-update`, `media-upload-from-url`,
`media-delete`. Call `get-ability-info` for each schema before using it. Results come back as
`{ ability, result: { data, … } }` for lists and `{ ability, result: {…} }` for single objects.

## Step 3 — Idempotency rule (makes resume safe)

Every create is **list/get-by-slug first, then create only if absent** — a re-run must not duplicate.
Use the matching read ability (or `RestEndpointTool` → `GET /wp/v2/posts?slug=…&status=any`): a hit →
reuse its `id`; empty → create. Capture each returned `id` and record the id map back into
`content-model.md` so later references resolve without re-querying.

## Step 4 — Create in dependency order

0. **Remove WordPress's default content first.** A fresh install ships a **"Hello world!" post**
   (id 1), a **"Sample Page"**, and a default comment — they will otherwise show up on the live site.
   Delete the default post (`posts-delete { id: 1, force: true }`) and, if present, the sample page
   (find it via `pages-search` for slug `sample-page`, then `pages-delete`). This is idempotent: if
   they're already gone, skip. Leave the default `Uncategorized` category — it's harmless once no post
   uses it (the frontend only lists categories with posts).
1. **Site Title & Description** (the helper's global part) → the Settings ability.
2. **Categories / tags** — one per term in the helper → Categories / Tags abilities. Keep `name → id`.
3. **Media.** Upload every image in the helper, set `alt_text`, and keep `filename → id`. See
   *Media upload* below for both sources: a generated file in `media/`, or an Unsplash URL.
4. **Pages** — each static/index page → Pages ability (`title`, `slug`, block/HTML `content`,
   `status: publish`). Keep `slug → id`.
5. **Posts (articles)** — each → Posts ability (`title`, `slug`, `content`, `status: publish`,
   `categories: [id]`, `tags: [id…]`, `featured_media: <id>`, `date`). (The plugin block-converts post
   content on insert via `rest_pre_insert_post`, so HTML bodies are fine.)
6. **Navigation** — Menus / Navigation abilities: create the menu, then an item per nav entry
   referencing a page `id` (or a custom URL for listing routes). **Headless note:** the Step 6
   frontend renders nav from `content-model.md`, so the WP menu is for owners editing in wp-admin, not
   what the live site reads — create it, but it isn't the source of truth.
7. **SEO** — prefer **Yoast SEO**, installed through the connector:
   `wordpress_plugins_install { username, software, plugins: ["wordpress-seo"] }` (async), poll
   `wordpress_plugins_list-installed { username, software }` until `wordpress-seo` appears, then
   `wordpress_plugins_activate { username, software, plugin: "wordpress-seo" }`. It generates meta +
   schema, and the frontend reads `yoast_head_json` per post/page. Set each post's Yoast
   title/description if an ability exposes it; otherwise the excerpt + title are a fine fallback. Don't
   fail the push over SEO fields.

### Media upload

**From a URL (Unsplash or any direct file URL).** Use `hostinger-ai/media-upload-from-url`.
WordPress downloads the file and stores its own copy, so the site never depends on the external URL
staying up:

```json
{ "name": "hostinger-ai/media-upload-from-url",
  "parameters": {
    "url": "https://images.unsplash.com/photo-<…>?w=1600&q=80&fm=jpg&fit=max",
    "filename": "<site>-<subject>.jpg",
    "title": "<short title>",
    "alt_text": "<what the photo shows>",
    "caption": "Photo by <Photographer> on Unsplash",
    "description": "Source: https://unsplash.com/photos/<id> (Unsplash License)",
    "post_id": <post id, if the post already exists> } }
```

- `url` must return 200 with an image content type. A photo *page* URL fails.
- The result carries the attachment `id` and `source_url`. WordPress also generates the smaller
  sizes (`300x200`, `768x…`, `1024x…`, …) under `media_details.sizes`, which the frontend can use
  for `srcset`.
- Set `filename` yourself, so files in `wp-content/uploads/` have readable names.

**From a local file in `media/`.** Use the Media-upload ability that discovery lists for local
files.

**Set the featured image.** Pass `featured_media: <id>` when creating the post (Step 4.5). If the
post already exists (on resume, or when images are added later), use
`hostinger-ai/posts-update { id, featured_media }`.

**Idempotency trap: don't look up earlier uploads by filename.** `media-search` matches titles and
content, not filenames or the slug you passed. A search for `<site>-lisbon-tram` finds nothing even
though the file exists, so a re-run would upload the image again. WordPress then stores the duplicate
as `…-1.jpg` and silently repoints the post at it. Check this way instead:

1. `posts-get { id }`. If `featured_media` is already set, skip that post. Its image exists.
2. Otherwise, search by the **title** you set on upload (`media-search { search: "<title>" }`),
   and reuse a hit.
3. Only upload when both checks come up empty.

If duplicates do slip in, point each post back at the original with `posts-update`, then delete the
duplicates with `media-delete { id, force: true }`.

## Step 5 — Verify and record

- Read a couple of created objects back through `wp/v2` (public GET, no auth): e.g.
  `GET {urls.rest_api}/posts?per_page=1` and check the `X-WP-Total` header against the planned article
  count; fetch one post with `_embed` to confirm `featured_media` and `categories` resolved.
- Media: `GET {urls.rest_api}/media?per_page=1` → `X-WP-Total` equals the number of images planned
  (more means duplicates). `GET {urls.rest_api}/media?include=<ids>` confirms `alt_text` and
  `caption` on each image. Each `source_url` must return 200 with an image type. Each post's
  `featured_media` must point at its image.
- Write the created-id map into `content-model.md` (a `## Created in WordPress` section: object → slug
  → id) so the frontend data phase and any re-run resolve references directly. Include one row per
  media item: filename, credit and source page, the post it's featured on, and its id.

## Step 6 — Hand off

Update `state.json` (`provision` stays `completed`; advance `stage` toward the frontend **data**
phase) with a fresh `updated_at`. The backend now holds the content; Step 6's data wiring points the
frontend at `urls.rest_api`.
