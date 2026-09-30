---
name: deploy-to-hosting
description: "Deploy an existing project to a website on Hostinger web hosting (Shared, Cloud or Agency plans) and keep it deployed: picks the right deploy for static sites, Node.js apps (Next.js, Nuxt, Express, Vite and similar), PHP apps and WordPress plugins or themes, sets up auto-deploy from GitHub or GitLab, manages Node.js environment variables and MySQL databases, and verifies the live site. Triggers: deploy this project, deploy to Hostinger, push my app live, redeploy, set up auto-deploy, connect my GitHub repo, add environment variables, my app needs a database, deploy my WordPress plugin or theme."
---

# Deploy to hosting

Ship a project that already exists — on disk or in a Git repository — to a Hostinger website. Building a new site from a prompt (design, store, blog) is the `hostinger-headless` skill; this one takes code as it is.

## Calling the operations

- Read the `inputSchema` that `search` returns before the first call of each operation. If a name below is rejected as unknown, `search` for what the step does (e.g. "deploy static").
- Batch reads with `multi-execute`; values pass between steps as `$steps.<i>.<path>`. Batches chain operations from one server only — the Hostinger Connector runs `hosting`, `wordpress` and `agency-hosting` as separate servers.
- Every deploy overwrites the website's current contents. Confirm the target domain with the user before the first deploy to a site that already has content.

## 1. Pick the target website

- `.hostinger/site.json` in the project: reuse its `domain` and `username` (or `website_uid`).
- Otherwise look the domain up with `hosting_websites_list` (Shared and Cloud; substring match — take the exact entry) and `agency-hosting_websites_list-plan` (Agency; keep `details.uid`).
- No website yet:
  - Shared and Cloud: take a domain (the user's own, or `hosting_domains_generate-free-subdomain`) and an `order_id` from `hosting_orders_list`, then `hosting_websites_create`. `datacenter_code` is needed only for the first website on a new plan (first entry of `hosting_datacenters_list`). Poll `hosting_websites_list-setups` with `domain` every 10–15 s until `status: completed` — uploads and deploys return 404 or 409 before that.
  - Agency: `agency-hosting_website-setups_create` with `flavor: "php-fpm"` (plus `type: "node-static"` for built frontends), `settings.php.version` from `agency-hosting_php_list-versions-for-order` and `datacenter_code` from `agency-hosting_datacenters_list`. Poll `agency-hosting_website-setups_status` until `completed`; it returns the `website_uid`.
- Node.js apps run on Business and Cloud plans (`hostinger_business_*`, `cloud_*` in `hosting_orders_list`). On other plans, build locally and deploy the output as a static site.

## 2. Choose the deploy

Wrong method is the most common failure. Decide from the project on disk:

| Project | Shared / Cloud |
| --- | --- |
| Plain HTML/CSS/JS, or a framework's static build output | `hosting_deploy-static-website` |
| `package.json` with a build or a server (Next.js, Nuxt, Express, Vite…) | `hosting_deploy-js-application` |
| PHP code, no build step | `hosting_deploy-static-website` (extracts the archive as-is) |
| WordPress plugin or theme folder | `hosting_deploy-wordpress-plugin` / `hosting_deploy-wordpress-theme` (`activate` optional) |
| A whole WordPress site from elsewhere | the `migrate-to-hosting` skill |

On Agency the website's type decides (`agency-hosting_websites_get`): sites created as `node-static` take `agency-hosting_deploy-node-static-website`, which runs the build when the project has one; every other site takes `agency-hosting_deploy-php-application`, which extracts the archive as-is. WordPress plugins and themes on Agency sites are installed from wp-admin.

Archive rules (name archives `name_YYYYMMDD_HHMMSS.zip`):

- **Static:** build locally first. `index.html` must be at the archive root, not inside a folder: `cd dist && zip -r ../site_20260101_120000.zip .`
- **Node.js source:** no `node_modules/`, no build output (`dist/`, `.next/`, `build/`), no `.env*`, nothing matched by `.gitignore`; 50 MB at most. `git archive --format=zip -o app_20260101_120000.zip HEAD` produces exactly the committed files — mention that uncommitted changes are left out.
- Agency deploys are synchronous: the site is live when the call returns.

The operations in the table read the archive from this machine, so only the local `hostinger-api-mcp` server has them. On the hosted server (`mcp.hostinger.com`) `search` does not find them — upload the files yourself as below.

### Without the local deploy operations

1. Get upload credentials: `hosting_files_generate-upload-url` (`username`, `domain`); Agency: `agency-hosting_files_generate-upload-url` (`website_uid`). Both return `url`, `auth_key` and `rest_auth_key`, which authenticate the upload instead of the API token.
2. Upload each file with TUS, where `DEST` is its path in the website's storage:

```bash
SIZE=$(wc -c < "$FILE" | tr -d ' ')
curl -sS -X POST "$URL/$DEST?override=true" -H "X-Auth: $AUTH_KEY" -H "X-Auth-Rest: $REST_AUTH_KEY" -H "Tus-Resumable: 1.0.0" -H "Upload-Length: $SIZE" -H "Upload-Offset: 0"
curl -sS -X PATCH "$URL/$DEST?override=true" -H "X-Auth: $AUTH_KEY" -H "X-Auth-Rest: $REST_AUTH_KEY" -H "Tus-Resumable: 1.0.0" -H "Content-Type: application/offset+octet-stream" -H "Upload-Offset: 0" --data-binary "@$FILE"
```

   The first call returns `201`, the second `204` with an `Upload-Offset` header equal to the file size. `override=true` makes a retry safe.
3. Deploy from the uploaded files (`RANDOM8` is any fresh 8-character string, e.g. `$(LC_ALL=C tr -dc 'a-z0-9' < /dev/urandom | head -c 8)`):

| Project | `DEST` | Then |
| --- | --- | --- |
| Static or PHP | `site.zip` | `hosting_websites_deploy-static-site-archive` with `archive_path: "site.zip"` |
| Node.js | `app.zip` | `hosting_nodejs_build-settings-from-archive` with `archive_path: "app.zip"`, then `hosting_nodejs_start-build` with those settings, `source_type: "archive"` and `source_options.archive_path: "app.zip"` |
| WordPress plugin | every file, as `wp-content/plugins/SLUG-RANDOM8/<path in the plugin>` | `wordpress_plugins_deploy` with `slug` and `plugin_path: "SLUG-RANDOM8"` |
| WordPress theme | every file, as `wp-content/themes/SLUG-RANDOM8/<path in the theme>` | `wordpress_themes_deploy` with `slug`, `theme_path: "SLUG-RANDOM8"` and optional `is_activated` |
| Agency, extracted as-is | `.h5g/site.zip` | `agency-hosting_files_import-website-from-archive` with `archive_name: "site.zip"` |
| Agency `node-static` | `.h5g/RANDOM8/app.zip` | `agency-hosting_websites_build-nodejs-assets` with `archive_path: ".h5g/RANDOM8"` — the directory, not the file |

## 3. Node.js builds

`hosting_deploy-js-application` uploads the archive to the document root, detects settings from `package.json` and starts a build. Track it with `hosting_nodejs_list-builds` and `hosting_nodejs_build` (by `uuid`), polling every 10–20 s — builds take minutes.

- Failed build: `hosting_nodejs_analyse-failed-build` once per build (5 calls a minute), then `hosting_nodejs_build-logs` if the analysis is empty.
- Wrong detection (framework, `output_directory`, or a missing `entry_file` for express, fastify, nest, nuxt and hono): run `hosting_nodejs_start-build` with explicit values, `source_type: "archive"` and `source_options.archive_path` set to the archive's file name in the document root (check it is there with `hosting_files_list-website-and-directories`). Store the same values with `hosting_nodejs_update-build-settings`.
- To review detected settings before any build: upload the archive with `hosting_files_generate-upload-url` (the TUS steps are in its description), then `hosting_nodejs_build-settings-from-archive`.

## 4. Auto-deploy from Git

1. `hosting_git_list-installations`. With no `active` installation (check `status: "pending"` and `"suspended"` too), the user connects GitHub or GitLab once in hPanel under Websites → Manage → Advanced → Git; there is no API for that step.
2. `hosting_git_list-installation-repositories` with the installation `uuid` gives `owner`, `name` and `default_branch` (10 calls a minute).
3. `hosting_git_update-auto-deployment-settings` with `installation_uuid`, `owner`, `repository`, `branch` and optional `directory`.
   - PHP and static sites deploy the branch immediately and again on every push.
   - Node.js sites clone nothing on save: start the first build with `hosting_nodejs_start-build`, `source_type: "git"` and the same `source_options`. Later pushes build with the stored settings, so keep `hosting_nodejs_update-build-settings` correct.
4. Confirm with `hosting_git_auto-deployment-settings`.

Agency Plan sites have no Git operations; deploy archives.

## 5. Environment variables (Node.js)

`hosting_nodejs_replace-environment-variables` replaces the whole set — anything not sent is deleted.

1. `hosting_nodejs_list-environment-variables` for the current keys. Values come back as `********`; never send those back.
2. Build the full set: every current key plus the new ones, with real values from the project's `.env` or the user. When the real value of an existing key is unknown, ask — do not drop it.
3. Send it once; the app restarts. Values baked in at build time (Next.js `NEXT_PUBLIC_*`, Vite `VITE_*`) need a new `hosting_nodejs_start-build`.

Keys use uppercase letters, digits and underscores. Never commit `.env` files or repeat secret values back to the user.

## 6. Database

- **Node.js:** `hosting_databases_setup-website` creates a MySQL database and writes `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` and `DATABASE_URL` into the environment, then restarts the app. The password is generated and never returned. It fails with 422 when any of those keys exists — remove them first with the step 5 replace.
- **PHP:** `hosting_databases_create` with `name`, `user`, a strong generated `password` and `website_domain`; read the prefixed full name back from `hosting_databases_list`. The app reads credentials from a config file on the server that stays out of Git, and connects to `localhost` or `127.0.0.1`.
- **Agency:** `agency-hosting_databases_create-website`; the app connects to `localhost`.
- The `srvNNNN.hstgr.io` host from `hosting_databases_list` is only for connections from outside Hostinger — never put it in the deployed app.

## 7. Verify and record

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://DOMAIN/
curl -s https://DOMAIN/ | grep -o "TEXT THE PROJECT RENDERS"
```

A `200` alone can be a placeholder page; match real copy. A new site may serve a default page briefly — clear it with `hosting_cache_clear-website` and retry before calling the deploy failed.

Write `.hostinger/site.json` in the project so later runs reuse the target: `{ "domain", "username" or "website_uid", "type": "static" | "nodejs" | "php" }`, keeping any fields already there.
