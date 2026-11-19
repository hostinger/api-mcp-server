---
name: headless-step-deploy
description: "Step 8 (deploy) of the Hostinger Headless flow. Archives the frontend source, then deploys through the connector's one-shot hosting_deploy (type nodejs — it uploads the source, runs npm install and the build on the server) with the chosen framework's build settings (appType + output dir) passed explicitly, polls to completion with hosting_get-deployment, verifies the live site and that the backend survived, then writes deploy.json."
---

# headless-step-deploy

Ship the frontend to the live domain through the Hostinger connector. You hand the connector a zip of
the project **source** and it uploads it, runs `npm install` + the build script on the server, and
serves the result. **Out:** `deploy.json`.

This is an **instance-barrier** step: run it only after `provision.status == "completed"` and validate
has passed (on a first deploy that includes its dependency audit, even when the rest of validate is
skipped). All operations go through the connector (`execute`).

> **Connected to the hosted server (`mcp.hostinger.com`)?** Its `hosting_deploy` deploys Git
> repositories only and cannot read a local `path`. Run this step through the local
> `hostinger-api-mcp` server instead (see the connect step:
> `<command> <launcher>`).

> **With a shell and the Hostinger CLI installed**, the same deploy is one command, with the build
> settings passed exactly as the table below says. Run it from the project, since it links the current directory:
> `cd ~/.hostinger/<domain>/src && hostinger up --domain <domain> --type nodejs --app-type <appType> --output-directory <dir> --build-script build --node-version 22 --package-manager npm --message "<what this deploy changes, like a commit message>" --yes --format json`.
> If it fails with `unknown flag: --message` (an older CLI), run `brew upgrade hostinger/tap/hostinger` or rerun it without `--message`.
> It uploads, builds, waits and returns `data.buildUuid` and `data.buildState`; add `--no-wait` to
> return at once and wait with `cd "$HOME" && node <skill>/wait.mjs build <domain> <uuid>`. Then continue at
> "Verify" below. Recent CLI versions see that the site is headless (`data.headless: true`) and
> deploy only its Node.js frontend, leaving `/cms` alone; still pass the settings above.

**In:** the project in `~/.hostinger/<domain>/src/`, `site.json` (`username`, `urls`), `state.json`
(`frontend.framework`, `frontend.rendering`).

> ## ⚠️ The one rule that makes this work: pass build settings explicitly
> If you let `hosting_deploy` **auto-detect** build settings, for a headless site that detection returns
> **null** (`appType:null`, `outputDirectory:null`, Node 20) — the build "completes" but the **root
> serves 403** (no `appType`/output → the vhost serves a directory with no entry). This is reproducible.
> **Always pass `appType`, `outputDirectory`, `nodeVersion`, `buildScript`, `packageManager` and
> `rootDirectory` on the `hosting_deploy` call** with the framework's values; the deploy then resolves
> them and serves correctly, and `/cms` is preserved.

## Build configurations

Map `frontend.framework` (from `state.json`) to its `appType` + build output directory, and pass those
on the `hosting_deploy` call. `appType` is the framework's value, e.g. `next`, `nuxt`, `astro`,
`svelte-kit`, `nest`, `express`, `fastify`, `react`, `create-react-app`, `gatsby`, `vite`, `vue`,
`angular`, `parcel`, `svelte`, `other`.

Common cases (all `nodeVersion: 22`, `buildScript: "build"`, `packageManager: "npm"`, `rootDirectory: "."`):

| Framework / mode | Local config | `appType` | `outputDirectory` |
|---|---|---|---|
| **Next.js — SSR** *(default)* | `output: 'standalone'` | `next` | `.next` |
| **Nuxt — SSR** | default | `nuxt` | `.output` |
| **SvelteKit — SSR** | node adapter | `svelte-kit` | `build` |
| **Astro — static** | `output: 'static'` | `astro` | `dist` |
| **Vite / React / Vue — static (SPA)** | — | `vite` (or `react`/`vue`) | `dist` |
| **Express / NestJS / Fastify — server** | — | `express`/`nest`/`fastify` | build output dir |

SSR/server frameworks run a persistent Node process (root sends `x-powered-by` / `cache-control: no-store`);
static frameworks serve their output dir as files. If unsure of a framework's output dir, check the
framework's own build output.

## Step 1 — Pre-flight

1. **Instance live (the deploy gate).** `provision.status == "completed"`, re-verified with
   `hosting_websites_list-setups { "domain": "<domain>" }`: deploy overwrites the site root, so it never
   trusts `state.json` alone.
2. **Build output exists locally** (the framework's output dir — e.g. `.next/`, `dist/`, `.output/`) and
   the project builds clean (frontend/validate already did this). If not, go back.
   - **Next.js 16+:** `package.json`'s `build` script is `next build --webpack`, not plain `next build` —
     the server's glibc can't run Turbopack's native compiler, and Turbopack doesn't fall back to webpack
     (see `../06-frontend/SKILL.md` Step 3). On Next.js 15.x leave it as plain `next build`. Fix it here if it isn't.
3. **PocketBase: nothing under `/api` or `/_`.** The app serves no route under those
   prefixes, whatever its framework (Next.js `app/api/` or `pages/api/`, Nuxt `server/api/`, SvelteKit
   `src/routes/api/`, Astro `src/pages/api/`, an Express or Fastify route), and `src/` holds no
   `.pocketbase/` folder or `credentials.json`. Fix it here if it does.
4. **Env vars (only if used).** Build-time vars (e.g. `NEXT_PUBLIC_*`) must be set **before** the build
   with `hosting_nodejs_replace-environment-variables` (full replace: list the current keys first and
   send the complete set). Never put secrets in the repo or the archive. On PocketBase, server-side
   superuser work reads `PB_URL`, `PB_SUPERUSER_EMAIL` and `PB_SUPERUSER_PASSWORD` from here (the
   values come from `~/.hostinger/<domain>/.pocketbase/credentials.json`, never from the archive).

## Step 2 — Archive the source

Zip the project **source** with `package.json` at the archive root. **Include** the app/source,
`public/`, the framework config (`next.config.mjs` / `astro.config.mjs`), `tsconfig.json`,
`package.json`, `package-lock.json`, `.nvmrc`. **Exclude** `node_modules/`, the build output
(`.next/`, `dist/`, `out/`), `.git/`, and any `.htaccess` — the server installs and builds from source.
**Never archive secrets:** the commands below also leave out `.env*` files, `.npmrc` and key/certificate
files (`*.pem`, `*.key`, `*.p12`, `*.pfx`) and any `.pocketbase/` folder. A brought-in project often has a `.env.local`; its values go in
as environment variables (Step 1), never in the archive. `hosting_deploy` also skips any file named
`credentials.json` itself and lists it in `skippedFiles`.

> ## ⚠️ Write the archive outside `~/.hostinger/` (the deploy refuses it there)
> `hosting_deploy` refuses any `path` under a hidden folder at the top of the home directory
> (`~/.hostinger`, `~/.config`, …) with *"it is, or contains, a home, system or credentials location"*:
> a deploy publishes what it reads, so the connector protects dotfolders that can hold tokens. That
> covers both `~/.hostinger/<domain>/app.zip` **and** the `~/.hostinger/<domain>/src/` directory
> itself, so neither can be passed as `path`. Keep the source in the workspace as usual, but write the
> archive to a fresh temp directory and pass that. Don't copy the archive somewhere else after a
> refusal, and don't move `src/` out of the workspace.

```bash
# macOS/Linux — the OS temp dir is outside the home directory
cd ~/.hostinger/<domain>/src
DEPLOY_DIR=$(mktemp -d)
zip -r -X "$DEPLOY_DIR/app.zip" . -x 'node_modules/*' '.next/*' 'dist/*' 'out/*' '.git/*' '**/.htaccess' \
  '.env*' '*/.env*' '.npmrc' '*/.npmrc' '*.pem' '*.key' '*.p12' '*.pfx' '.pocketbase/*' '*/.pocketbase/*'
echo "$DEPLOY_DIR/app.zip"   # the absolute path to pass as `path` in Step 3
```

```powershell
# Windows PowerShell — %TEMP% sits under AppData, which the deploy also refuses; use a plain folder in your
# profile, which only you can write to (never a folder under C:\, which every local account can write into)
cd $HOME\.hostinger\<domain>\src
$DeployDir = Join-Path $HOME "hostinger-deploy\<domain>"; New-Item -ItemType Directory -Force $DeployDir | Out-Null
tar -a -cf "$DeployDir\app.zip" --exclude=node_modules --exclude=.next --exclude=dist --exclude=out --exclude=.git --exclude=.htaccess `
  --exclude=.env* --exclude=.npmrc --exclude=*.pem --exclude=*.key --exclude=*.p12 --exclude=*.pfx --exclude=.pocketbase .
"$DeployDir\app.zip"        # the absolute path to pass as `path` in Step 3
```

Delete the temp directory once the build in Step 4 is `completed`.

## Step 3 — Deploy (one shot: settings + upload + build)

Pass the framework's build settings **inline** on the deploy call — there is no separate settings step.
`path` is the absolute path of the archive from Step 2, in its temp directory. Never pass a path under
`~/.hostinger/`, the `src/` directory included: the deploy refuses it (see Step 2).
`message` says what this deploy ships, written like a commit message (first line under 72 characters,
at most 500): it labels the deploy in the website's deployment history, which otherwise shows only the
archive's file name.

```json
{ "operation": "hosting_deploy",
  "params": {
    "domain": "<domain>",
    "path": "<absolute path printed in Step 2, e.g. /var/folders/…/tmp.XXXX/app.zip>",
    "type": "nodejs",
    "appType": "<framework appType, e.g. next>",
    "outputDirectory": "<framework output dir, e.g. .next>",
    "nodeVersion": 22,
    "buildScript": "build",
    "packageManager": "npm",
    "rootDirectory": ".",
    "message": "<one-line summary of what this deploy ships, e.g. Add pricing page>" } }
```

`hosting_deploy` uploads the source and triggers `npm install` + the build **end-to-end** — do not call
any upload or build operation yourself. It returns a build `buildUuid` at once. This **overwrites the
website root** (expected) and keeps the backend's paths intact (`/cms` for WordPress; `/api` and `/_/`
for PocketBase). `type` is always `"nodejs"` for a headless site, with the explicit `appType`/`outputDirectory` from
*Build configurations* —
**never `"static"`**, which serves the build as plain files over the document root and **overwrites
`/cms`**, destroying the WordPress backend, and would likewise break the routing that keeps `/api` and
`/_/` on a PocketBase backend. A static-built SPA (Vite/React/Vue) still deploys as
`type: "nodejs"` with its `appType`.

## Step 4 — Wait for the build and the live root

Wait for it in one command (see *Waiting on Hostinger* in the top-level `SKILL.md`):

```bash
cd "$HOME" && node <skill>/wait.mjs build <domain> <buildUuid>
```

It waits for `hosting_get-deployment` to report the build `completed`, then up to 5 minutes for
`https://<domain>/` (or `http://` while the certificate is pending) to serve 200. What its result means here:

- `ok: true`: the build is done and the root serves 200. Go on to Step 5.
- `ok: true` with `https_pending: true`: the build is done and `http://<domain>/` serves 200, but the
  new domain's SSL certificate is still installing (this can take the better part of an hour). The
  deploy worked: tell the user HTTPS will follow on its own, run Step 5 over `http://`, and don't
  wait for the certificate.
- `ok: false` with `build.state: failed`: read `log_tail` (the end of the build log) and `analysis`, fix
  locally, re-archive and redeploy (pass `fromLine` to `hosting_get-deployment` to read only new log
  output).
- `ok: false` with `build settings missing`: the settings didn't take (the root would 403 for good). Fix
  the deploy call and redeploy.
- `ok: false` with `timed_out`: `last_status` says whether the build was still running or the root
  wasn't serving 200 yet (see Step 5's note on a 403). For an SSR app that built but hangs,
  `hosting_nodejs_restart-application { username, domain }` recovers the server without a rebuild.

## Step 5 — Verify the live site (all must pass)

| Check | How | Expect |
|---|---|---|
| Root serves | `GET https://<domain>/` | **200** (not 403 / 404) |
| SSR is live *(server frameworks)* | response headers | `x-powered-by` present, `cache-control: no-store` |
| Static serves *(static frameworks)* | `GET https://<domain>/` | 200 HTML with real home content |
| Key routes | a couple of planned routes + one deep route | 200, real content |
| **Backend survived** *(WordPress / WooCommerce)* | `GET https://<domain>/cms/wp-json/wp/v2/posts?per_page=1` | 200 |
| **Backend survived** *(PocketBase)* | `GET https://<domain>/api/health` and `GET https://<domain>/_/` | 200 and 200 |
| **No credentials served** *(PocketBase)* | `GET https://<domain>/.pocketbase/credentials.json` | 404 |

> **Only WordPress (including WordPress + WooCommerce) has a `/cms` on the domain**, and only PocketBase
> has `/api` and `/_/`, so the *Backend survived* check depends on the backend.
> - **WordPress + WooCommerce:** also confirm the store survived the deploy —
>   `GET https://<domain>/cms/wp-json/wc/store/v1/products?per_page=1` → 200. There is nothing external to
>   link (no sales-channel step — that's Ecommerce only). **Checkout** stays owner-completed: when
>   `site.json → woocommerce.payment_enabled` is `false`, don't test `/checkout`; a catalog that serves 200
>   is a passing, complete deploy.
> - **Ecommerce:** the backend is the **Hostinger Ecommerce store**, read over the external Storefront API
>   (`api-ecommerce.hostinger.com`) — nothing a deploy touches lives on this domain. There is no `/cms`;
>   confirm the storefront still fetches products as a frontend check if you like. **Only check that
>   checkout can be reached when `site.json → ecommerce.payment_enabled` is `true`** — on a free account
>   (`payment_enabled: false`) there is no checkout, so **skip that check entirely**; a catalog that serves
>   200 is a passing, complete deploy. Never fail or hold the deploy because checkout is unavailable.
> - **PocketBase** (`site.json → backend: "pocketbase"`): the backend lives on this domain at `/api`
>   and `/_`, so check both survived and that the credentials URL is a 404, then run
>   `node <skill>/steps/04-content-model/pocketbase/scripts/pb-verify.mjs ~/.hostinger/<domain>/.pocketbase/credentials.json ~/.hostinger/<domain>/pocketbase/schema.json`
>   and expect `READY` (its last check, the website serving the app, now passes). If `/api/health`
>   fails while the root serves the app, the app is answering `/api`: move its routes off that prefix
>   and redeploy. If the credentials URL returns anything but 404, rotate the superuser at once
>   (`hosting_pocketbase_set-superuser`, see `../03-provision/pocketbase/SKILL.md` Step 3) and
>   redeploy without the file.

The root check is already done when `wait.mjs build` returned `ok: true`; check the rest in one shell
command (`curl` each URL). A `completed` build whose root 403s almost always means the build settings
weren't passed to `hosting_deploy` (null settings) — pass them and redeploy. Caching can briefly serve a
stale root; re-check after ~30 s.

## Step 6 — Record `deploy.json`

```json
{
  "build_uuid": "…",
  "stack": "nextjs",
  "rendering": "ssr",
  "app_type": "next",
  "output_directory": ".next",
  "node_version": 22,
  "method": "hosting_deploy (type: nodejs, settings passed inline)",
  "deployed_at": "…",
  "verified_at": "…",
  "urls": { "live": "https://<domain>", "cms": "https://<domain>/cms" },
  "checks": { "root": 200, "ssr_headers": true, "backend_preserved": true }
}
```

No secrets in `deploy.json`. The `urls.cms` field and the `backend_preserved` check above are
**WordPress-only** — adjust the record to the backend:

- **WordPress:** keep `urls.cms` and `checks.backend_preserved` as shown.
- **WordPress + WooCommerce:** keep `urls.cms` + `checks.backend_preserved` (it *is* WordPress), and add
  `urls.store_api` from `site.json`; no external link step.
- **Ecommerce:** omit `urls.cms`/`backend_preserved`; record the store URLs instead (`urls.storefront_api`,
  `urls.store_admin` from `site.json`) and link the custom sales channel to the live domain —
  `ecommerce_sales-channels_update { store_id, sales_channel_id, url }` (see the ecommerce provision step).
- **PocketBase:** omit `urls.cms`; add `urls.api` and `urls.admin` from `site.json`,
  `checks.backend_preserved` (the `/api/health` and `/_/` checks) and `checks.pb_verify: "READY"`.

Update `state.json` (`stage` → `done`), then continue to Step 9 (done).

`hosting_deploy` on the local server is the only path: give its `path` a local **archive** (`zip`, `tar`,
`tar.gz`, `tgz`, `7z`) written outside `~/.hostinger/` as in Step 2. There is no separate upload or
build step to fall back to.
