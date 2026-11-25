---
name: make-website-agent-ready
description: "Make a website ready for AI agents: runs the Hostinger agent readiness scan on the live site, ranks the failed checks by points lost, fixes them in the local codebase (robots.txt, sitemap, llms.txt, head tags, JSON-LD, contact and pricing links, server-rendered content, Link headers, Markdown negotiation, WebMCP tools, MCP server card), verifies each fix against a local build, and reports what was fixed, skipped and left open. Never deploys. Triggers: make my site agent ready, agent readiness score, is my website AI-ready, improve my agent readiness grade, can ChatGPT / Claude read my site, add llms.txt, fix my agent readiness scan."
---

# Make a website agent ready

The scan runs against the live site; the fixes go into the local codebase; nothing is deployed. The scanner cannot reach `localhost`, private IPs or ports other than 80/443, so local changes are verified with the local checks in [references/checks.md](references/checks.md), and the score only moves after the user deploys and re-scans.

## Calling the operations

- Read the `inputSchema` that `search` returns before the first call of each operation. If a name below is rejected as unknown, `search` for "agent readiness".
- `agent-readiness_scans_run` starts a scan, `agent-readiness_scans_get` reads the latest one, `agent-readiness_checks_list` names every `check_id`.

## 1. Pin down the site and the code

- Confirm the public domain with the user. A domain in `.hostinger/site.json` or the project config is a hint, not an answer: a cloned repo can carry someone else's.
- Confirm the current directory is that site's source: the framework, where static files are served from (`public/`, `static/`, the web root), the layout or template that renders the homepage `<head>`, and how to build and serve a production build locally. Ask when it is not obvious.
- Builder and Horizons sites have no local codebase. Report the scan and stop.

## 2. Scan

1. `agent-readiness_scans_get` with `domain`. Use it when it is `completed`, `is_outdated` is false, and `scanned_at` is newer than the last deploy. Otherwise:
2. `agent-readiness_scans_run` with `domain`, then poll `agent-readiness_scans_get` every 5 seconds until `status` is `completed` or `failed` (up to about two minutes). A `failed` scan is not retried by the API: run it once more, and on a second failure tell the user and stop.
3. `agent-readiness_checks_list` once, for check names and weights.

`is_unreachable: true` means the homepage did not return 2xx over HTTPS and no check ran. That is a hosting problem: hand over to the `troubleshoot-website` skill.

## 3. Triage

Take every result with `status` `fail` or `partial`. `error` results (the scanner could not evaluate them) are reported, not fixed. Rank by points lost (`possible - earned`). For each, look up the check in [references/checks.md](references/checks.md) and put it in one bucket:

- **Fix in code**: the change is a file, markup or server config in this repo.
- **Needs the owner**: the fix states a policy or a fact the code does not hold. Never invent it, ask:
  - whether AI crawlers may read the site (`ai_crawlers_allowed`)
  - the `Content-Signal` terms, e.g. whether `ai-train` is `yes` or `no` (`content_signals`)
  - business phone, address and social profiles for JSON-LD (`organization_completeness`, `same_as`, `machine_readable_contact`)
  - whether an MCP server or WebMCP actions exist to advertise (`mcp_server_card`, `webmcp_tools`). Never publish a server card for an endpoint that does not exist.
- **Off-site**: a CDN or WAF blocks agents (`not_bot_blocked`), HTTPS is not set up, or a CDN strips headers. Name where it is fixed and skip it.

Show the user the score, grade, the categories and the ranked list in those three buckets, and the planned change per check. Get the answers for "needs the owner" and agreement on the plan before editing.

## 4. Fix

Group the work by the file it touches, not one check at a time:

| Artifact | Checks |
|---|---|
| `robots.txt` | `robots_txt_valid`, `ai_crawlers_allowed`, `content_signals`, `sitemap_declared` |
| sitemap | `sitemap_valid`, `sitemap_freshness` |
| homepage `<head>` and body | `head_metadata`, `heading_structure`, `content_without_js`, `token_budget` |
| JSON-LD in the homepage HTML | `json_ld_present`, `organization_completeness`, `same_as`, `schema_breadth`, `machine_readable_contact`, `pricing_reachable` |
| homepage links | `trust_anchors`, `machine_readable_contact`, `pricing_reachable` |
| `llms.txt` | `llms_txt_exists`, `llms_txt_quality` |
| server or framework config | `real_status_codes`, `redirect_hygiene`, `link_headers`, `markdown_negotiation` |
| front-end JS or forms | `webmcp_tools` |
| `/.well-known/mcp/server-card.json` | `mcp_server_card` |

- Use the framework's own mechanism: its sitemap or metadata plugin, its routing for 404s, its middleware or the server config it ships (`.htaccess` on Hostinger web hosting) for headers. Hand-written files go where the framework serves static files from.
- Generate content from what the repo already holds: page routes for the sitemap and `llms.txt`, existing copy for titles and descriptions, the owner's answers for business facts.
- Everything the scanner checks is read from the raw homepage HTML; it does not run JavaScript. Tags injected client-side do not count.
- Keep each change minimal and in the project's style. Do not touch unrelated code, and do not commit unless the user asks.

## 5. Verify locally

- Run the project's tests and linters when it has them, and build it.
- Serve the production build (not the dev server, which often differs on 404s, headers and server rendering) and run the local check for every fixed item from [references/checks.md](references/checks.md) against it.
- Fixes that live in server config the local server does not run (`.htaccess`, CDN rules) cannot be verified locally; mark them "verify after deploy".
- Open the homepage and confirm it still renders and works as before. A fix that breaks the page is reverted and reported.

## 6. Report

```
# Agent readiness: example.com
Live scan: 52/100 (D), scanner v4, 2026-11-25

## Fixed locally (verified)
- robots.txt: added Sitemap line and Content-Signal "search=yes, ai-train=no" (+6)
- Homepage JSON-LD: Organization with name, url, telephone, address, sameAs (+12)

## Fixed locally (verify after deploy)
- .htaccess: Link header to /llms.txt (+1)

## Skipped
- not_bot_blocked: Cloudflare challenges ClaudeBot; allowlist AI user agents in the WAF (+6)
- mcp_server_card: the site has no MCP server (+4)

## Unresolved
- webmcp_tools: registered a search tool, but the build fails in Safari; reverted

Estimated after deploy: about 70/100 (C)
```

The estimate is the live score plus the points of the verified fixes. Then offer the next step: the user deploys (the `deploy-to-hosting` skill, only when they ask), and a fresh `agent-readiness_scans_run` confirms the score. Compare it check by check with the first scan.
