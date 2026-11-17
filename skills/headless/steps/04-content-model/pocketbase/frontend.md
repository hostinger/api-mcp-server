# Connecting the app

The backend is on the same domain as the site, so the browser needs no API URL, no CORS setup and no keys.

## Contents

- Bundled apps, plain HTML, local development
- Everyday calls, pagination, errors
- Files
- Realtime
- Node.js apps on the same website
- Routing for single-page apps

## Bundled apps (Vite, React, Vue, Svelte, Next.js static export)

```bash
npm install pocketbase@0.28.1
```

```ts
import PocketBase from "pocketbase"

export const pb = new PocketBase(import.meta.env.DEV ? "https://<domain>" : window.location.origin)
pb.autoCancellation(false)
```

`autoCancellation(false)` matters: by default the SDK aborts an earlier request to the same collection when a new one starts, so parallel loads fail with "The request was aborted". For Next.js use `process.env.NODE_ENV === "development"` in place of `import.meta.env.DEV`.

## Plain HTML

```html
<script src="https://cdn.jsdelivr.net/npm/pocketbase@0.28.1/dist/pocketbase.umd.js"></script>
<script>
  const pb = new PocketBase(window.location.origin)
  pb.autoCancellation(false)
</script>
```

## Local development

There is one backend, the live one. In development the app talks to it directly (above), not through a dev-server proxy: a proxy works for REST but realtime through it depends on HTTP/1.1 (`troubleshooting.md`). Records created while testing are real data; delete them in the dashboard before handing over, or use a test account. Opening the app from `file://` does not work for same-origin calls; use the dev server.

## Everyday calls

```ts
const page = await pb.collection("posts").getList(1, 20, {
  filter: pb.filter("published = {:p} && author = {:a}", { p: true, a: userId }),
  sort: "-created",
  expand: "author",
})
const all = await pb.collection("products").getFullList({ sort: "name" })
const one = await pb.collection("posts").getOne(id)
const first = await pb.collection("rooms").getFirstListItem(pb.filter("slug = {:s}", { s: slug }))
const post = await pb.collection("posts").create({ title, author: pb.authStore.record.id })
await pb.collection("posts").update(post.id, { published: true })
await pb.collection("posts").delete(post.id)
```

- Build every filter with `pb.filter(expr, params)`; never put user input into a filter string yourself.
- `getList` returns `{ items, page, perPage, totalItems, totalPages }`; `perPage` goes up to 1000. Show "Load more" with the next `page`, or pass `skipTotal: true` when the count is not needed (faster).
- `getFullList` fetches every page; use it only for small collections such as a catalog.
- `expand: "author"` puts the related record in `record.expand.author`, but only if the caller may view it under that collection's rules.

## Errors

Errors are `ClientResponseError` with `status` and `response`:

- 400 with `response.data.<field>.message`: show that message next to the field.
- 400 "Failed to create record." with empty `data`: the create rule rejected it (honeypot filled, wrong owner, room closed). Show a general "Could not send" and check the rule.
- 404 on view, update or delete: not found or not allowed by the rule.
- 403: the rule is `null` (superusers only).
- 429: rate limit. Ask the visitor to wait a minute.
- `status` 0: network error or aborted request.

## Files

```ts
const form = new FormData()
form.append("title", title)
form.append("cover", fileInput.files[0])
const post = await pb.collection("posts").create(form)
const url = pb.files.getURL(post, post.cover, { thumb: "400x300" })
```

- Files over the field's `maxSize` (default 5 MB) are rejected with a field error; check `file.size` before uploading.
- Thumbnails work only for sizes listed in the field's `thumbs`.
- For `protected` file fields, fetch a token first: `const token = await pb.files.getToken()` and pass `{ token }` to `getURL`. It expires after a few minutes.

## Realtime

```ts
const unsubscribe = await pb.collection("messages").subscribe(
  "*",
  (event) => {
    if (event.action === "create") add(event.record)
    if (event.action === "update") replace(event.record)
    if (event.action === "delete") remove(event.record.id)
  },
  { filter: pb.filter("room = {:room}", { room: roomId }), expand: "author" },
)
```

- Load the initial list first, then subscribe, and merge by `id` so nothing shows twice.
- Call `unsubscribe()` when the view unmounts.
- `pb.realtime.isConnected` tells whether the stream is up; show a small "Live" or "Connecting" indicator.
- Events follow the collection's view rule: a visitor only receives records they may view.
- An idle backend sleeps after about 5 minutes and wakes on the next request; an open realtime stream keeps it awake. The first request after sleep can take a few seconds or return 503 once, so retry once and keep timeouts at 10 s or more.

## Node.js apps on the same website

A Node.js app on the site can call its own backend at `https://<domain>` for trusted server-side work (webhooks, scheduled jobs, writes visitors must not make):

1. Store `PB_URL`, `PB_SUPERUSER_EMAIL` and `PB_SUPERUSER_PASSWORD` as Node.js environment variables. `hosting_nodejs_replace-environment-variables` replaces the full set, so read the current ones first and send them all.
2. Do superuser work on its own client in a server-only module (e.g. `src/lib/pb-admin.ts`), used only by that trusted work: authenticate it once at startup with `admin.collection("_superusers").authWithPassword(email, password)` and again on a 401. Never sign in the shared `pb` client: pages rendered and requests handled for visitors would then run as superuser and skip every collection rule. Server code acting for a visitor uses a client with no superuser sign-in (a new `PocketBase` per request when it carries the visitor's own sign-in).
3. The app's own routes must not start with `/api` or `/_`; those paths go to PocketBase.
4. For realtime subscriptions from Node.js, check the HTTP/1.1 note in `troubleshooting.md`.

## Routing for single-page apps

PocketBase owns `/api/*` and `/_/*`. If the app uses history routing (`/rooms/42`) on a static deploy, add `public/.htaccess` so unknown paths load `index.html` without catching the backend:

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/(api|_)(/|$)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]
```

Hash routing (`/#/rooms/42`) needs nothing.
