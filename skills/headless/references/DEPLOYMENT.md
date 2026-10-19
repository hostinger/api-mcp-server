# Deployment — getting the build live

Match the deploy method to what the project actually is — this is the single most common failure point.

On the local `hostinger-api-mcp` server one operation does every deploy: `hosting_deploy` with `domain` and `path` (the project directory; it detects the type, packs the files itself; it skips `node_modules`, `.git` and `.env` files, reporting the `.env` ones as `skippedFiles` (set their values with `hosting_nodejs_replace-environment-variables`); it does not read `.gitignore`, so keep build output out of the directory) or `git: { repository, branch }` with `type: "static"` or `"nodejs"` (a new site is not yet detected as Node.js). It reads files from this machine, so the hosted server (`mcp.hostinger.com`) does not have it: there, upload the files and deploy from the upload as described in the `deploy-to-hosting` skill ("Without the local deploy operations"). Agency Plan sites deploy through the Agency operations listed there as well.

## Static site → `hosting_deploy` (detected as `static`)

For pre-built files only: plain HTML/CSS/JS, or the **build output** of a framework (run the build locally first, then pass the output directory as `path`).

- `index.html` must be at the **root** of that directory — not nested inside a folder.
- Deployment is effectively immediate — verify right after.

## Node.js app → `hosting_deploy` (detected as `nodejs`)

For anything that needs a server or a server-side build (Express, Next.js, NestJS, SSR frameworks). Pass the project's **source** directory, not the output: the install and build run on Hostinger.

- The call returns a `buildUuid` and the build runs on the server. Track it with `hosting_get-deployment` (`domain`) until `build.state` is `completed` or `failed`; on failure the response carries the logs and an analysis — fix, and deploy again. Poll with backoff: builds take minutes, not seconds.
- When the framework, output directory or entry file is detected wrong, pass `appType`, `outputDirectory`, `buildScript` or `entryFile` to `hosting_deploy`. A TypeScript or other compiled server app always needs `entryFile` set to the built file (for example `dist/server.js`).

## WordPress → `hosting_deploy` with `type: "wordpress-site"` / plugin & theme directories

Only when the user explicitly wants a WordPress *site* migrated or themed. A site import takes the site directory plus `databaseDump` (a `.sql` file) and can run for several minutes; a plugin or theme directory is detected from its header (`activate: true` activates a theme). (WordPress as a headless content backend behind an agent-built frontend is a different flow — that's `WORDPRESS.md`, installed fresh via the API, not imported here.)

## Verify (every deploy)

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://YOURDOMAIN/
curl -s https://YOURDOMAIN/ | grep -o "SOME_REAL_HEADLINE_TEXT"
```

Replace the grep target with copy you actually rendered — a 200 alone can be a placeholder page. A freshly created site may serve a default page for a short while; if content doesn't match, clear the cache (`hosting_cache_clear-website`) and retry before assuming the deploy failed. For store runs, also run the checkout verification in `STORE.md`.

When the site is live, report the URL and remind the user the site is managed from hPanel (https://hpanel.hostinger.com).
