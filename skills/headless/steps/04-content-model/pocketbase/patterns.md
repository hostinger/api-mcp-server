# Recipes

Ready-made `schema.json` entries for the apps people ask for most. Copy the closest one, rename collections and fields to fit the app, and combine recipes in one `collections` array. Every recipe was checked against PocketBase 0.40.

## Contents

- Contact form, sign-up list, feedback (anonymous, owner reads)
- Comments on pages (anonymous or signed in)
- Likes, votes, polls, RSVPs (one per person)
- Leaderboard (scores)
- Private notes, to-dos, saved items (per user)
- Live chat or Q&A in rooms
- Order requests without payment
- Bookings with limited places
- Admin area inside the app
- Starting data (seed)

## Contact form, sign-up list, feedback

Anyone can send; only the owner reads, in the dashboard. No login.

```json
{
  "collections": [
    {
      "name": "messages",
      "rules": { "list": null, "view": null, "create": "@request.body.website = \"\"", "update": null, "delete": null },
      "fields": [
        { "name": "name", "type": "text", "required": true, "max": 100 },
        { "name": "email", "type": "email", "required": true },
        { "name": "message", "type": "text", "required": true, "max": 3000 },
        { "name": "website", "type": "text", "max": 200 }
      ]
    }
  ],
  "rateLimits": [{ "label": "messages:create", "audience": "@guest", "maxRequests": 5, "duration": 600 }]
}
```

- `website` is a honeypot: render it as a visually hidden input with `tabindex="-1"` and `autocomplete="off"`. Bots fill it and the rule rejects them; people leave it empty.
- The rate limit allows 5 messages per 10 minutes per IP address.
- Because `list` is `null`, the form cannot show past entries. After `create` succeeds, show a thank-you message.
- PocketBase sends no email for a new message by itself. The owner reads messages in the dashboard (`/_/`, collection `messages`). Say so in the summary.

## Comments on pages

Public read. Anonymous posting with a display name; switch to signed-in authors when the app has accounts.

```json
{
  "name": "comments",
  "rules": { "list": "", "view": "", "create": "@request.body.website = \"\"", "update": null, "delete": null },
  "fields": [
    { "name": "page", "type": "text", "required": true, "max": 200 },
    { "name": "author_name", "type": "text", "required": true, "max": 60 },
    { "name": "text", "type": "text", "required": true, "max": 2000 },
    { "name": "website", "type": "text", "max": 200 }
  ],
  "indexes": ["CREATE INDEX idx_comments_page ON comments (page)"]
}
```

Add `{ "label": "comments:create", "audience": "@guest", "maxRequests": 10, "duration": 600 }` to `rateLimits`. Load with `getList(1, 50, { filter: pb.filter("page = {:p}", { p: location.pathname }), sort: "-created" })`. The owner deletes spam in the dashboard, which removes it from open pages live.

Signed-in version: replace `author_name` with `{ "name": "author", "type": "relation", "collection": "users", "required": true, "cascadeDelete": true }`, set `create` to `@request.auth.id != "" && @request.body.author = @request.auth.id` and `delete` to `author = @request.auth.id`, and load with `expand: "author"`.

## Likes, votes, polls, RSVPs

One per person through a unique index. Signed-in version:

```json
{
  "name": "votes",
  "rules": { "list": "", "view": "", "create": "@request.auth.id != \"\" && @request.body.voter = @request.auth.id", "update": null, "delete": "voter = @request.auth.id" },
  "fields": [
    { "name": "poll", "type": "relation", "collection": "polls", "required": true, "cascadeDelete": true },
    { "name": "choice", "type": "select", "values": ["a", "b", "c"], "maxSelect": 1, "required": true },
    { "name": "voter", "type": "relation", "collection": "users", "required": true, "cascadeDelete": true }
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_votes_poll_voter ON votes (poll, voter)"]
}
```

Anonymous version: make `voter` a `text` field holding a random id the browser keeps in `localStorage` (`crypto.randomUUID()`), set `create` to `""`, `delete` to `null`, and add a rate limit. That stops accidental double votes, not someone determined to cheat; use the signed-in version when it matters.

Counting: a view collection gives totals without downloading every vote.

```json
{ "name": "vote_totals", "type": "view", "rules": { "list": "", "view": "" },
  "viewQuery": "SELECT (poll || choice) AS id, poll, choice, COUNT(*) AS total FROM votes GROUP BY poll, choice" }
```

View collections send no realtime events. For live totals, subscribe to `votes` and refetch `vote_totals` when an event arrives.

## Leaderboard

One best score per signed-in player, readable by everyone, raised only upward.

```json
{
  "name": "scores",
  "rules": {
    "list": "", "view": "",
    "create": "@request.auth.id != \"\" && @request.body.player = @request.auth.id",
    "update": "player = @request.auth.id && @request.body.player:changed = false && @request.body.score > score",
    "delete": null
  },
  "fields": [
    { "name": "player", "type": "relation", "collection": "users", "required": true, "cascadeDelete": true },
    { "name": "player_name", "type": "text", "required": true, "max": 40 },
    { "name": "score", "type": "number", "required": true, "min": 0, "onlyInt": true }
  ],
  "indexes": ["CREATE UNIQUE INDEX idx_scores_player ON scores (player)"]
}
```

Top 10: `getList(1, 10, { sort: "-score,created" })`. Keep a display name on the score itself, because the default `users` rules hide other users' records. Scores come from the browser, so a player can submit a fake one. Tell the user that plainly; truly cheat-proof scores need the game logic on a server.

## Private notes, to-dos, saved items

Each user sees only their own records.

```json
{
  "name": "notes",
  "rules": {
    "list": "owner = @request.auth.id", "view": "owner = @request.auth.id",
    "create": "@request.auth.id != \"\" && @request.body.owner = @request.auth.id",
    "update": "owner = @request.auth.id && @request.body.owner:changed = false",
    "delete": "owner = @request.auth.id"
  },
  "fields": [
    { "name": "owner", "type": "relation", "collection": "users", "required": true, "cascadeDelete": true },
    { "name": "title", "type": "text", "required": true, "max": 200 },
    { "name": "body", "type": "text", "max": 20000 },
    { "name": "done", "type": "bool" }
  ],
  "indexes": ["CREATE INDEX idx_notes_owner ON notes (owner)"]
}
```

Create with `{ ..., owner: pb.authStore.record.id }`.

## Live chat or Q&A in rooms

Rooms are created by the host in the dashboard (or by signed-in users); anyone in an open room can post.

```json
{
  "collections": [
    {
      "name": "rooms",
      "rules": { "list": "", "view": "", "create": null, "update": null, "delete": null },
      "fields": [
        { "name": "title", "type": "text", "required": true, "max": 80 },
        { "name": "open", "type": "bool" }
      ],
      "seed": [{ "title": "General", "open": true }]
    },
    {
      "name": "chat_messages",
      "rules": {
        "list": "room.open = true", "view": "room.open = true",
        "create": "@request.body.room.open = true && @request.body.website = \"\"",
        "update": null, "delete": null
      },
      "fields": [
        { "name": "room", "type": "relation", "collection": "rooms", "required": true, "cascadeDelete": true },
        { "name": "author_name", "type": "text", "required": true, "max": 40 },
        { "name": "text", "type": "text", "required": true, "max": 500 },
        { "name": "website", "type": "text", "max": 200 }
      ],
      "indexes": ["CREATE INDEX idx_chat_messages_room ON chat_messages (room)"]
    }
  ],
  "rateLimits": [{ "label": "chat_messages:create", "audience": "@guest", "maxRequests": 30, "duration": 60 }]
}
```

Load the last 50 (`sort: "-created"`, then reverse), then subscribe with `{ filter: pb.filter("room = {:r}", { r: roomId }) }`. Moderation is deleting the message, which removes it from every screen.

Many people on one network (a venue, a classroom) share one IP address. The default limit for the whole API on this platform is 200 requests per 5 minutes per IP (`pb-verify.mjs` prints the current limits). For an event, raise it in `rateLimits`: `{ "label": "/api", "maxRequests": 3000, "duration": 300 }`.

## Order requests without payment

Visitors send an order; the owner handles it from the dashboard. For paid checkout use the `hostinger-headless` store instead.

```json
{
  "name": "orders",
  "rules": {
    "list": null, "view": null,
    "create": "@request.body.status:isset = false && @request.body.website = \"\"",
    "update": null, "delete": null
  },
  "fields": [
    { "name": "customer_name", "type": "text", "required": true, "max": 100 },
    { "name": "customer_email", "type": "email", "required": true },
    { "name": "items", "type": "json", "required": true, "maxSize": 20000 },
    { "name": "note", "type": "text", "max": 1000 },
    { "name": "status", "type": "select", "values": ["new", "confirmed", "done", "cancelled"], "maxSelect": 1 },
    { "name": "website", "type": "text", "max": 200 }
  ]
}
```

Add a `orders:create` rate limit as in the contact form. Prices and totals sent by the browser can be edited by the sender, so the owner confirms the price; never treat a submitted total as paid. A `products` collection with `list: ""`, `view: ""` and every write `null` holds the catalog the owner edits in the dashboard.

## Bookings with limited places

Classes, workshops, tables or tours with a fixed number of places. Visitors book with a name and email; nobody can book a full, cancelled or past session; only the owner sees who booked. The cap is enforced by the database, so it holds even when many people book at the same moment.

```json
{
  "collections": [
    {
      "name": "sessions",
      "rules": { "list": "", "view": "", "create": null, "update": null, "delete": null },
      "fields": [
        { "name": "title", "type": "text", "required": true, "max": 80 },
        { "name": "starts_at", "type": "date", "required": true },
        { "name": "capacity", "type": "number", "required": true, "min": 1, "max": 500, "onlyInt": true },
        { "name": "cancelled", "type": "bool" }
      ],
      "indexes": ["CREATE INDEX idx_sessions_starts_at ON sessions (starts_at)"]
    },
    {
      "name": "bookings",
      "rules": {
        "list": null, "view": null,
        "create": "@request.body.website = \"\" && @request.body.session.cancelled = false && @request.body.session.starts_at > @now && @request.body.spot <= @request.body.session.capacity",
        "update": null, "delete": null
      },
      "fields": [
        { "name": "session", "type": "relation", "collection": "sessions", "required": true, "cascadeDelete": true },
        { "name": "name", "type": "text", "required": true, "max": 80 },
        { "name": "email", "type": "email", "required": true },
        { "name": "spot", "type": "number", "required": true, "min": 1, "max": 500, "onlyInt": true },
        { "name": "website", "type": "text", "max": 200 }
      ],
      "indexes": [
        "CREATE UNIQUE INDEX idx_bookings_session_spot ON bookings (session, spot)",
        "CREATE UNIQUE INDEX idx_bookings_session_email ON bookings (session, email)"
      ]
    },
    {
      "name": "taken_spots", "type": "view",
      "rules": { "list": "", "view": "" },
      "viewQuery": "SELECT id, session, spot FROM bookings"
    }
  ],
  "rateLimits": [{ "label": "bookings:create", "audience": "@guest", "maxRequests": 20, "duration": 600 }]
}
```

- Each session has its own `capacity`. A booking holds a `spot` number, unique per session, and the create rule only accepts numbers from 1 to that session's `capacity`. When every number is taken there is none left to claim, so the database refuses the next booking. The field's `max` (500) is only an upper bound for any session.
- `taken_spots` shows visitors which numbers are taken, and nothing about who took them. Places left = `capacity` minus the number of rows for the session.
- Lowering `capacity` below the bookings already made does not remove anyone; only new bookings are limited.
- To book, load the session's `capacity` and its taken numbers, pick a free number from 1 to `capacity` and create the booking. If the create fails with `data.spot.code` `validation_not_unique`, someone took that number a moment earlier: reload and try another. When no number is free, the session is full. `data.email.code` `validation_not_unique` means this email already booked the session.
- Lowercase and trim the email before sending, so the same person cannot book twice with different capitalisation.
- To cancel a session, set `cancelled` to true rather than deleting it: the booking list stays, so the owner can tell the people who booked.
- `date` values are stored in UTC. Convert the owner's local time to UTC before saving and show times in the business's time zone (`Intl.DateTimeFormat` with `timeZone`).
- For an owner screen inside the app, combine this with "Admin area inside the app" and give `bookings` `list`, `view` and `delete` rules for admins.

## Admin area inside the app

Usually the dashboard (`/_/`) is the admin area and nothing needs building. When the app itself needs admin-only screens, add a locked flag to `users`:

```json
{
  "name": "users", "type": "auth",
  "rules": {
    "list": "id = @request.auth.id", "view": "id = @request.auth.id",
    "create": "@request.body.is_admin:isset = false",
    "update": "id = @request.auth.id && @request.body.is_admin:isset = false",
    "delete": "id = @request.auth.id"
  },
  "fields": [{ "name": "is_admin", "type": "bool" }]
}
```

The owner ticks `is_admin` on their own account in the dashboard. Rules then use `@request.auth.is_admin = true`, for example `"delete": "@request.auth.is_admin = true"`. In the frontend, `pb.authStore.record?.is_admin` decides what to show; the rules are what enforce it.

## Starting data (seed)

Any collection can carry `"seed": [ {...}, {...} ]`. `pb-apply-schema.mjs` inserts those records only when the collection is empty, so re-running never duplicates them. Seed values cannot reference other records by id; link them in the dashboard or create them from the app.
