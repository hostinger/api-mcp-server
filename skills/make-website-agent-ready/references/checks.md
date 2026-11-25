# Agent readiness checks

Pass rules as of scanner version 4. When a scan reports a higher `scanner_version`, its `evidence` and `fix` win over this file.

How the scanner reads a site:

- Every request goes to `https://DOMAIN`. Only the homepage HTML is analysed: the raw response, cut at 1 MiB, with no JavaScript run (except `webmcp_tools`).
- The homepage must return 2xx, or the scan is `unreachable` and no check runs.
- The AI crawlers are GPTBot, ClaudeBot, ChatGPT-User, Google-Extended and PerplexityBot. The bot-blocking probe uses the user agent `Mozilla/5.0 (compatible; ClaudeBot/1.0)`.
- Grades: A ≥ 90, B ≥ 75, C ≥ 60, D ≥ 40, otherwise F.

Each check below gives its points, when it passes, and a local check. Local checks use `B` for the base URL of the local production build, e.g. `B=http://localhost:4173`.

## Crawl permission (20)

**`crawl_permission.robots_txt_valid`** (4)
- Passes: `/robots.txt` returns 2xx with a non-empty body.
- Local: `curl -s -o /dev/null -w '%{http_code}' $B/robots.txt` prints 200, and the body is not blank.

**`crawl_permission.ai_crawlers_allowed`** (7)
- Passes: robots.txt allows `/` for each AI crawler; points scale with how many are allowed. No robots.txt also passes.
- Local: no `Disallow: /` in a group matching one of the five bots, or in `*` without a more specific `Allow` for them.

**`crawl_permission.not_bot_blocked`** (6)
- Passes: the homepage with the ClaudeBot user agent returns 2xx (not 401/403/429/503) and is not a JS challenge page ("just a moment", "checking your browser").
- Local: `curl -s -A 'Mozilla/5.0 (compatible; ClaudeBot/1.0)' -o /dev/null -w '%{http_code}' $B/`. A block on the live site only is a CDN or WAF rule: off-site.

**`crawl_permission.content_signals`** (3)
- Passes: robots.txt has a `Content-Signal:` line with at least one `key=value` pair, e.g. `Content-Signal: search=yes, ai-train=no`.
- Local: `curl -s $B/robots.txt | grep -i '^content-signal:'`

## Findability (16)

**`findability.sitemap_valid`** (5)
- Passes: the first `Sitemap:` URL in robots.txt (or `/sitemap.xml`) returns 2xx XML whose root is `urlset` or `sitemapindex`, with at least one entry.
- Local: `curl -s $B/sitemap.xml | head -c 400`. The sitemap's URLs must use the live `https://DOMAIN`, not localhost.

**`findability.sitemap_declared`** (3)
- Passes: robots.txt has a non-empty `Sitemap:` line.
- Local: `curl -s $B/robots.txt | grep -i '^sitemap:'`. Use the absolute live URL.

**`findability.sitemap_freshness`** (3)
- Passes: the newest `<lastmod>` among the top-level entries is at most 180 days old.
- Local: `curl -s $B/sitemap.xml | grep -o '<lastmod>[^<]*' | sort | tail -1`. Emit lastmod from content dates or the build date.

**`findability.real_status_codes`** (3)
- Passes: a missing path ends in 404 or 410 after redirects.
- Local: `curl -sL -o /dev/null -w '%{http_code}' $B/__agent-readiness-probe-0123456789ab`. SPA fallbacks that return 200 fail.

**`findability.redirect_hygiene`** (2)
- Passes: `https://DOMAIN/` reaches its final URL in at most 2 redirects and ends on `https://`.
- Live only: `curl -sIL https://DOMAIN/ | grep -i '^location'`. HTTPS itself is hosting setup (`connect-domain` skill).

## Readability (18)

All read the raw homepage HTML: `curl -s $B/ > /tmp/home.html`.

**`readability.content_without_js`** (8)
- Passes: the page text is at least 600 characters (200–599 is partial). The count is all text in the HTML, inline scripts included.
- Local: the main copy appears in `/tmp/home.html` without running JS. Client-rendered apps need SSR, SSG or prerendering of the homepage.

**`readability.token_budget`** (3)
- Passes: text is at least 5% of the HTML, and the HTML is at most 400,000 characters.
- Local: `wc -c /tmp/home.html`. Move large inline scripts, styles and SVGs to files.

**`readability.head_metadata`** (4)
- Passes: a non-empty `<title>`, `<meta name="description" content="…">` and `<link rel="canonical" href="…">`; points per tag. `name` and `rel` must be exactly lowercase.
- Local: `grep -oE '<title>[^<]*|name="description"|rel="canonical"' /tmp/home.html`. Canonical is the live `https://DOMAIN/`.

**`readability.heading_structure`** (3)
- Passes: exactly one `<h1>`.
- Local: `grep -oE '<h1[ >]' /tmp/home.html | wc -l` prints 1. Demote the others to `<h2>` without changing their look.

## Structured meaning (14)

JSON-LD is read from `<script type="application/ld+json">` blocks in the raw homepage. A block may be one object, an `@graph` (one level), or an array. Each block must be valid JSON.

**`structured_meaning.json_ld_present`** (6)
- Passes: at least one valid JSON-LD object.
- Local: extract each block and parse it, e.g. with `node -e` or `python3 -m json.tool`.

**`structured_meaning.organization_completeness`** (4)
- Passes: the first node typed exactly `Organization`, `LocalBusiness`, `Store` or `Restaurant` has non-empty `name`, `url`, `telephone` and `address`; points per field. Subtypes like `Bakery` do not match, so list both: `"@type": ["LocalBusiness", "Bakery"]`.
- Local: read the node. Phone and address come from the owner, never invented.

**`structured_meaning.same_as`** (2)
- Passes: any node has a non-empty `sameAs`.
- Local: read the node. Only profiles the owner confirms exist.

**`structured_meaning.schema_breadth`** (2)
- Passes: at least 3 distinct `@type` values across nodes (1–2 is partial).
- Local: e.g. `Organization`, `WebSite`, plus `Product`, `Service`, `FAQPage` or `Article` for content the page really has.

## Commercial legibility (12)

Read from homepage links (`<a href>`, path only, host ignored). Paths with a `blog`, `news`, `post`, `posts`, `article` or 4-digit segment are ignored.

**`commercial_legibility.trust_anchors`** (4)
- Passes: the homepage links an about page (path contains `about`, `company`, `who-we-are`), a contact page (`contact`, `support`) and a terms page (`terms`, `privacy`, `legal`); points per kind.
- Local: `grep -o 'href="[^"]*"' /tmp/home.html`. Link existing pages (a footer is fine); create a page only when the owner agrees.

**`commercial_legibility.machine_readable_contact`** (4)
- Passes: a `mailto:` or `tel:` link, or a JSON-LD node with non-empty `telephone`, `email` or `contactPoint`.
- Local: `grep -oE 'href="(mailto|tel):[^"]*"' /tmp/home.html`

**`commercial_legibility.pricing_reachable`** (4)
- Passes: a JSON-LD `Offer`, `Product` or `AggregateOffer` node, or any node with `offers`, or a link whose path contains `pricing`, `prices` or `plans`. Not applicable when no link path mentions shop, store, product, pricing, prices, plans or menu.
- Local: real prices only; give `Offer` a `price` and `priceCurrency`.

## Agent-native content (10)

**`agent_native_content.llms_txt_exists`** (4)
- Passes: `/llms.txt` returns 2xx and is not HTML (no `<html` in the first 200 bytes).
- Local: `curl -s -w '\n%{http_code}\n' $B/llms.txt | head -5`

**`agent_native_content.llms_txt_quality`** (3)
- Passes: a `# ` heading and at least one Markdown link with an absolute `http(s)://` URL (otherwise partial).
- Format: `# Site name`, `> one-line summary`, then `## Section` lists of `- [Page](https://DOMAIN/page): what it covers`.

**`agent_native_content.markdown_negotiation`** (2)
- Passes: `GET /` with `Accept: text/markdown, text/plain;q=0.5` returns a `Content-Type` containing `text/markdown`.
- Local: `curl -sI -H 'Accept: text/markdown, text/plain;q=0.5' $B/ | grep -i '^content-type'`. Needs middleware or a server rule serving a Markdown version of the homepage; on static Hostinger hosting, an `.htaccess` rewrite on the `Accept` header to `index.md` (verify after deploy).

**`agent_native_content.link_headers`** (1)
- Passes: the homepage response has a non-empty `Link` header.
- Local: `curl -sI $B/ | grep -i '^link:'`, e.g. `Link: </llms.txt>; rel="alternate"; type="text/plain"`.

## Agent interaction (10)

**`agent_interaction.webmcp_tools`** (6)
- Passes: the rendered homepage (Chromium) registers at least one complete WebMCP tool: `navigator.modelContext.registerTool()` with a name, description and `execute` callback (add an `inputSchema`), or a `<form>` with `toolname` and `tooldescription` attributes.
- Local: only for a real action the site already has (search, contact, booking); the declarative form attributes are the smaller change. In a browser, the attributes are in the DOM, or the registration runs without errors when `navigator.modelContext` exists and is skipped when it does not.

**`agent_interaction.mcp_server_card`** (4)
- Passes: `/.well-known/mcp/server-card.json` returns exactly 200 with a JSON object holding `name`, `version` (top level or under `serverInfo`), an endpoint (`endpoint`, `url`, `transport.endpoint`, `remotes[].url` or `endpoints[].url`, absolute or `/path`) and capabilities (non-empty `capabilities`, or a `tools`, `resources` or `prompts` list).
- Local: `curl -s $B/.well-known/mcp/server-card.json | python3 -m json.tool`. Only when the site runs an MCP server; the endpoint must be real.
