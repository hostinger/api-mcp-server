# headless — WordPress content push by hand

The recipe `push-content.mjs` runs, for when it exits 2, or for one item that failed twice (create only
that item). The content is the same as in `content.json` (`SKILL.md` Step 1).

1. **Session.** Mint the token with `wordpress_installations_jwt-token { username, software: <site.json
   wordpress.install_id> }`; never print, log or store it. POST JSON-RPC to `urls.wp_mcp` with the header
   `X-Hostinger-JWT-Token: <token>` and `Accept: application/json, text/event-stream`. `initialize`
   answers an `Mcp-Session-Id` header: send it on every later request. Then post
   `notifications/initialized`; a 404 on it is harmless. A 401/403 means the token expired: re-mint.
2. **Abilities.** `tools/list` shows either one tool per ability or the meta-tools
   `hostinger-ai-discover-abilities`, `hostinger-ai-get-ability-info { name }` and
   `hostinger-ai-execute-ability { name, parameters }`. Abilities are named `hostinger-ai/<thing>-<action>`;
   read each schema before use. A result is `{ ability, result }`: the new `id` is `result.id`, a list is
   `result.data`, and an error is a normal result holding `{ code, message, data: { status } }`.
3. **Look up, then create.** Search first by slug (`posts-search`, `pages-search`, `categories-list`,
   `tags-list`, `menus-search` take `slug: [<slug>]`), products by `sku`, coupons by `code`, and reuse a hit.
4. **In this order:** delete `hello-world` (`posts-search`, `posts-delete`) and `sample-page`; then
   `wp-settings-update { title, description }`; categories and tags; images with
   `media-upload-from-url { url, filename, title, alt_text, caption }`; `pages-create` and
   `posts-create` with `slug`, `status: "publish"`, `categories`, `tags`, `featured_media`; `menus-create`,
   then `menu-items-create { title: { raw }, type: "post_type", object: "page", object_id, menus }` (or
   `type: "custom", url`); `seo-bulk-update { posts: [ { id, seo_title, meta_description } ] }`; then
   `wc-product-categories-create`, `wc-products-create { sku, name, type: "simple", regular_price,
   categories: [ { id } ], images: [ { id } ] }` and `wc-coupons-create`.
5. **Two traps.** Pass `title`, `content` and `excerpt` as `{ "raw": "…" }` objects: a bare string is
   dropped while the create still succeeds. And `media-search` matches titles, not filenames, so before
   uploading again, check the post's `featured_media` (`posts-get`), then search by the title you set.
6. **Verify and record.** `GET {urls.rest_api}/posts?per_page=100` (and `/pages`, `/media`) and
   `GET {urls.store_api}/products?per_page=100` show each item once with its image. Write the id map into
   `content-model.md` under `## Created in WordPress` (and `## Created in WooCommerce`).
