# Schema file format

`scripts/pb-apply-schema.mjs` reads `pocketbase/schema.json` and makes the backend match it. Run it with `--check` first to validate the file offline, then without to apply. It is safe to run again after every change.

```json
{
  "collections": [
    {
      "name": "posts",
      "type": "base",
      "rules": { "list": "", "view": "", "create": "@request.auth.id != \"\"", "update": "author = @request.auth.id", "delete": "author = @request.auth.id" },
      "fields": [
        { "name": "title", "type": "text", "required": true, "max": 120 },
        { "name": "author", "type": "relation", "collection": "users", "required": true, "cascadeDelete": true }
      ],
      "indexes": ["CREATE INDEX idx_posts_author ON posts (author)"],
      "seed": []
    }
  ],
  "rateLimits": [{ "label": "posts:create", "audience": "@auth", "maxRequests": 20, "duration": 600 }]
}
```

`patterns.md` has ready-made collections; `schema.example.json` is a complete posts, comments and likes app.

## Collection keys

| Key | Meaning |
| --- | --- |
| `name` | Letters, digits, underscore. Becomes the URL segment `/api/collections/<name>/records`. |
| `type` | `base` (default), `auth` (people who sign in) or `view` (read-only SQL query). The built-in `users` auth collection already exists; list it to change its rules or add fields. |
| `rules` | `list`, `view`, `create`, `update`, `delete`, and for auth collections `auth` (who may sign in) and `manage`. Leave a key out to keep the current rule. New collections start with every rule `null`. See `rules.md`. |
| `fields` | Your fields. `id` is automatic; `created` and `updated` are added for you (`"timestamps": false` turns that off). |
| `indexes` | Plain SQL. Index names are unique across the whole database: use `idx_<collection>_<columns>`. |
| `viewQuery` | View collections only: a `SELECT` that returns an `id` column. Fields come from the query, so leave `fields` out. |
| `seed` | Records inserted only when the collection is empty. Plain values; no references to other records' ids. |
| `authOptions` | Auth collections only: raw PocketBase options such as `{ "passwordAuth": { "enabled": true, "identityFields": ["email"] } }`. |

## Top-level `rateLimits`

Each entry is merged into the backend's rate-limit settings by `label` and `audience`; entries not in the file stay as they are. Limits count requests per client IP.

| Key | Meaning |
| --- | --- |
| `label` | `<collection>:<action>` (`messages:create`, `users:auth`), `*:<action>` for all collections, or a path prefix such as `/api` |
| `audience` | `@guest` (signed out), `@auth` (signed in) or `""` (everyone, the default) |
| `maxRequests`, `duration` | At most `maxRequests` per `duration` seconds |

The platform default is `/api` 200 requests per 300 s and `*:auth` 20 per 300 s for guests. `pb-verify.mjs` prints the active limits.

## Field types (PocketBase 0.23 and later)

| `type` | Useful options |
| --- | --- |
| `text` | `required`, `min`, `max` (0 = default 5000), `pattern` (regex) |
| `editor` | Rich text (HTML). `maxSize` in bytes. Sanitize before rendering it. |
| `number` | `min`, `max`, `onlyInt`. `required` rejects 0. |
| `bool` | Defaults to false. `required` means it must be true. |
| `email`, `url` | `onlyDomains`, `exceptDomains` |
| `date` | ISO date string, `min`, `max` |
| `autodate` | `onCreate`, `onUpdate` (the script adds `created` and `updated`) |
| `select` | `values` (required array), `maxSelect` (1 = single value) |
| `file` | `maxSelect`, `maxSize` in bytes (default 5 MB), `mimeTypes`, `thumbs` (for example `["400x300"]`), `protected` |
| `relation` | `collection` (target collection name; the script resolves its id), `maxSelect` (default 1), `minSelect`, `cascadeDelete` |
| `json` | `maxSize` in bytes |
| `geoPoint` | `{ lon, lat }` |

## What the script guarantees

- `--check` catches unknown keys, field types and rule names, relations without a target, selects without values, and views without a query, before anything is sent.
- Base and auth collections are created first without relations, then given relations, so circular relations work. View collections are created after that, so their query can use every field.
- Fields and indexes that are not in the file are kept, so nothing is dropped by omission. An index with a new name but the same definition replaces the old one.
- Changing a field's type is refused because PocketBase would drop the column. Add a field with a new name and copy the data.
- Errors print PocketBase's own message, for example which rule refers to an unknown field.

## Changing the schema later

Edit `schema.json`, run `--check`, apply, then run `pb-verify.mjs`. The app keeps running: schema changes need no redeploy. Removing a field or collection deletes data, so do it in the dashboard (`/_/`) only after the user agrees.
