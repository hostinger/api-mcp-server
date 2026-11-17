# Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Create returns `state: null` | The state was not read yet; the backend usually works | `GET https://<domain>/api/health` should return 200 |
| Create returns 422 | A backend already exists, or PocketBase isn't enabled on this account yet (it rolls out gradually), or the site is headless WordPress or a parked domain | Read the message. Existing backend: `hosting_pocketbase_backend`; use the saved credentials, or rotate the superuser (`../../03-provision/pocketbase/SKILL.md`, Step 3). Not enabled yet: tell the user and stop |
| `hosting_pocketbase_backend` returns `state: failed` | The last start did not succeed (often `failure_reason: process_limit`: no free process slots on the account) | Hostinger starts it again after `retry_after_seconds`; wait and read again. The data is intact, never delete the backend |
| `hosting_pocketbase_backend` returns `state: missing` | The instance files are gone from the server | `hosting_pocketbase_create-backend` sets up a new, empty one; re-run `pb-apply-schema.mjs` |
| First request takes several seconds or returns 503 | The instance was asleep (after about 5 minutes idle) | Retry once; keep client timeouts at 10 s or more. The scripts retry on their own |
| Superuser sign-in fails | Wrong or lost password | `hosting_pocketbase_set-superuser`, then save the new response |
| `pb-apply-schema.mjs` reports an invalid rule | A field in the rule does not exist, a typo, or `:length` on a text field | The message names the field. Limit text length with the field's `max` |
| "The index name is already used" | Index names are unique across the whole database | Name indexes `idx_<collection>_<columns>` |
| Create returns 400 "Failed to create record." with empty `data` | The create rule rejected it | Compare the request body with the rule (`rules.md`, How a rejected request looks) |
| Update or delete returns 404 for a record that exists | The update or delete rule rejected it | Same as above |
| 429 Too Many Requests | Per-IP rate limit (default `/api` 200 per 5 minutes) | Fewer requests (subscribe instead of polling), or raise it with `rateLimits` in `schema.json` |
| Records do not appear for visitors | The list or view rule is `null` or too strict | `null` is superusers only; check with `rules.md` |
| Anyone can edit or delete | A rule is `""` | `pb-verify.mjs` warns about this; tighten it |
| Parallel requests fail with "The request was aborted" | SDK auto-cancellation | `pb.autoCancellation(false)` |
| A hidden or unpublished item stays on other screens | No realtime event is sent for records the viewer can no longer see | Delete instead of hiding for live views (`rules.md`, Realtime) |
| Totals from a view collection do not update live | View collections send no realtime events | Subscribe to the source collection and refetch the view |
| Sorting by `-created` fails | The collection has no `created` field | Re-run `pb-apply-schema.mjs`; it adds timestamps |
| `expand` returns nothing | The caller may not view the related record | Store the needed value (a display name) on the record itself, or loosen the related view rule |
| No password-reset or verification email arrives | SMTP is off on a new backend | The owner sets it in the dashboard, Settings > Mail settings |
| The app's own `/api/...` routes return PocketBase errors | PocketBase owns `/api` and `/_` | Move the app's routes to another prefix |
| History-routed pages 404 on refresh | No SPA fallback on static hosting | `.htaccess` from `frontend.md` |
| `hosting_deploy` fails while uploading | Temporary file-upload service error | Wait a minute and run the same deploy once more; otherwise deploy from Git (`deploy-to-hosting`) |
| Realtime stays "Connecting" in local dev | The dev-server proxy uses HTTP/1.1 | Point the SDK at the deployed domain in dev (`frontend.md`) |

## Realtime over HTTP/1.1

`pb-verify.mjs` tests the realtime stream (`/api/realtime`) over both HTTP/2 and HTTP/1.1 on every run. If HTTP/1.1 fails:

- **Browsers** use HTTP/2 and are fine.
- **Node.js** subscriptions (`EventSource` and `fetch` speak HTTP/1.1) need an HTTP/2 client:

  ```bash
  npm install eventsource undici
  ```

  ```js
  import { EventSource } from "eventsource"
  import { Agent, fetch as undiciFetch } from "undici"

  const dispatcher = new Agent({ allowH2: true })
  globalThis.EventSource = class extends EventSource {
    constructor(url, init) {
      super(url, { ...init, fetch: (input, options) => undiciFetch(input, { ...options, dispatcher }) })
    }
  }
  ```

  Run this before creating the PocketBase client. Setting undici's global dispatcher is not enough: Node's built-in `EventSource` ignores it.
- **Dev proxies:** connect the SDK straight to the deployed domain.

To check by hand: `curl -N --http1.1 --max-time 8 https://<domain>/api/realtime` should print `event:PB_CONNECT` within a second.
