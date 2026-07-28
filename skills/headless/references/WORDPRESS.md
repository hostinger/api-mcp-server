# WordPress — headless CMS and blog backend

Use WordPress when the site has **owner-managed content**: a blog, news, articles, or any content the owner must edit without a developer or a redeploy. The frontend stays agent-built and is deployed like any other run; WordPress runs separately as the content backend, and the owner writes in wp-admin.

**When NOT to use this:** static copy that rarely changes (an about page, a services list, a brochure site) — bake that into the frontend. Installing WordPress for content the owner will never edit adds a moving part for nothing. Any buy/sell intent is `STORE.md`, not this file.

Everything in Setup uses the **hosting** and **wordpress** MCP tool groups; ask the user to enable them in the Hostinger Connector if tools are missing.

## Mental model

Two surfaces, like the store recipe:

| Surface | Base URL | Auth | Use for |
| --- | --- | --- | --- |
| WP REST API | `https://CMS_DOMAIN/wp-json/wp/v2` | none for published content (open CORS) | frontend reads: posts, pages, media, categories |
| Management (MCP tools + wp-admin) | Hostinger API / wp-admin | authenticated | install WP, plugins, cache; the owner writes content |

- Published content is publicly readable and the REST API allows cross-origin browser reads — a static frontend on another domain fetches it directly at runtime.
- Drafts, previews, and **writes need authentication** (WP application passwords). Never put credentials of any kind in the frontend; a public site only needs the anonymous read path.

## Setup (management tools)

1. **Check for an existing installation first**: `hosting_listWordPressInstallationsV1` filtered by the site's username/domain. Reuse a valid install when the user agrees — never overwrite one silently.
2. **Choose where WordPress lives.** Default: a dedicated subdomain of the site, e.g. `cms.<domain>` — create it with `hosting_createWebsiteSubdomainV1` so the main domain stays free for the frontend. A separate free-subdomain website (per `SETUP.md`) also works when the plan allows another website.
3. **Install**: `hosting_installWordPressV1` on that domain. The call only queues the job — **poll** `hosting_listWordPressInstallationsV1` until the installation appears (typically 1–2 minutes). Don't proceed on the queued response alone.
4. **Hand the owner their editor**: mint a one-click wp-admin link with `hosting_createLoginLinksV1` and show it to the user. Content authoring happens in wp-admin — the skill does not seed posts (there is no anonymous write path, by design). The fresh install ships with a sample post, which is enough to build and verify the frontend against.
5. **Caching** (recommended before finishing): enable the object cache with `hosting_toggleMemcachedObjectCacheV1`; after config changes, purge with `hosting_purgeLiteSpeedCacheV1`.

## Frontend contract

All paths relative to `https://CMS_DOMAIN/wp-json/wp/v2`. Non-obvious rules:

- **Fetch at runtime, not build time** — content changes whenever the owner publishes; baking it into a static build defeats the purpose. Client-side fetch on page load is fine (CORS is open).
- List posts with `/posts?per_page=10&_embed` — `_embed` inlines featured images (`_embedded['wp:featuredmedia'][0].source_url`), authors, and terms; without it you get IDs that need extra requests.
- Post bodies are **rendered HTML**: use `title.rendered` / `content.rendered` / `excerpt.rendered` and render them as HTML — do not treat them as plain text and do not try to restyle their inner markup beyond CSS.
- Single post by slug: `/posts?slug=my-post` — returns an **array** (take the first element); there is no direct slug path.
- Pagination comes from the `X-WP-Total` / `X-WP-TotalPages` response headers, not the body.
- Only **published** content is returned anonymously. An empty list is a normal state — the frontend must render it gracefully, not error.
- SEO is the frontend's job: page titles, meta tags, and the sitemap come from the frontend build, not from WordPress plugins.

## Verify

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://CMS_DOMAIN/wp-json/wp/v2/posts?per_page=1"
```

Expect 200 with a JSON array. Then confirm the deployed frontend renders the sample post (or a clean empty state), and show the user two links: the live site and the wp-admin login for writing content.

## Record

Add `"cms_domain"` to `.hostinger/site.json` (see `SKILL.md` §Record) so iterate runs know a WordPress backend exists and reuse it instead of installing again.
