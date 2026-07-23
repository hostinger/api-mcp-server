# Deployment — getting the build live

Match the deploy method to what the project actually is — this is the single most common failure point.

## Static site → `hosting_deployStaticWebsite`

For pre-built files only: plain HTML/CSS/JS, or the **build output** of a framework (run the build locally first).

- The archive (zip/tar) must have `index.html` at its **root** — not nested inside a folder.
- Name it `name_YYYYMMDD_HHMMSS.zip`; pass `removeArchive: true` to clean up after upload.
- Deployment is effectively immediate — verify right after.

## Node.js app → `hosting_deployJsApplication`

For anything that needs a server or a server-side build (Express, Next.js, NestJS, SSR frameworks).

- Archive the **source**, not the output: exclude `node_modules/`, `dist/`, `.next/`, `build/`, and everything matched by `.gitignore`. The install and build run on Hostinger.
- Hard cap: **50 MB** archive.
- The upload starts a build. Track it with `hosting_listJsDeployments`; on failure pull `hosting_showJsDeploymentLogs`, fix, and redeploy. Poll with backoff — builds take minutes, not seconds.

## WordPress → `hosting_importWordpressWebsite` / plugin & theme tools

Only when the user explicitly wants WordPress. Site imports take an archive plus a `.sql` dump and can run for several minutes.

## Verify (every deploy)

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://YOURDOMAIN/
curl -s https://YOURDOMAIN/ | grep -o "SOME_REAL_HEADLINE_TEXT"
```

Replace the grep target with copy you actually rendered — a 200 alone can be a placeholder page. A freshly created site may serve a default page for a short while; if content doesn't match, clear the cache (`hosting_clearWebsiteCacheV1`) and retry before assuming the deploy failed. For store runs, also run the checkout verification in `STORE.md`.

When the site is live, report the URL and remind the user the site is managed from hPanel (https://hpanel.hostinger.com).
