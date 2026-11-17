---
name: headless-step-content-model-pocketbase
description: "Step 4 (content model) for the PocketBase backend of the Hostinger Headless flow. Prepare phase: turns the brief's visitor features into pocketbase/schema.json (collections, access rules, unique indexes, rate limits, seed records) from tested recipes and validates it offline. Push phase: applies it to the live backend with pb-apply-schema.mjs and checks it with pb-verify.mjs. Idempotent, instance-gated."
---

# headless-step-content-model-pocketbase

Runs for the **PocketBase** backend (`site.json → backend: "pocketbase"`). Such an app keeps what
its **visitors** enter: accounts, bookings, comments, votes, scores, order requests, uploads, live
messages. This step designs that data and its access rules, and seeds the records the owner starts
with (classes, menu items, rooms, events). The site's fixed copy (Title, Description, Navigation,
Pages) still comes from `content-model.md` and is built into the frontend. An app that stores nothing
yet still gets a schema (`{ "collections": [] }`): apply is a no-op, and verify still proves the backend.

The one rule that matters: **access is decided by the collection rules, never by frontend code**, so
every rule is written on purpose and checked against the live backend.

**In:** `brief.md`, `content-model.md` (when the shared prepare phase wrote one), `site.json` (push only). **Out:**
`~/.hostinger/<domain>/pocketbase/schema.json`, applied to the backend.

`<here>` below is this folder (`steps/04-content-model/pocketbase/` in the installed skill). The
scripts need Node.js 18 or later and nothing else.

## Prepare phase — write and check the schema (no instance)

Runs during the provision wait, alongside the shared prepare phase in `../SKILL.md`.

1. **List the visitor features** from the brief's **Purpose**, **Pages** and **Must-haves**: what
   visitors create, who may read it, who may change it, and whether visitors need accounts.
2. **Start each one from the closest recipe** in `<here>/patterns.md` (contact form, comments, likes
   and votes, leaderboard, private notes, live chat, order requests, bookings with limited places,
   admin area). Rename collections and fields to fit the site, and combine the recipes in one
   `collections` array. `<here>/schema.md` has the file format, `<here>/rules.md` the rule syntax,
   `<here>/schema.example.json` a complete example.
3. **Seed what the owner starts with** (the classes and their places, the menu, the rooms) with
   `seed` records drawn from `content-model.md`. Seed records are inserted only into an empty
   collection, so a re-run never duplicates them.
4. **Accounts only when the site needs them.** No per-person data (contact form, guestbook, anonymous
   polls, bookings, order requests) → no login; the rules protect it. Owners of their own records,
   private data or moderators → email and password, as `<here>/auth.md` says. Only the site owner
   signs in → a separate auth collection with `create` set to `null`.
5. Write it to `~/.hostinger/<domain>/pocketbase/schema.json`, then validate it offline:

   ```bash
   node <here>/scripts/pb-apply-schema.mjs --check ~/.hostinger/<domain>/pocketbase/schema.json
   ```

   Fix every reported problem until it passes. Then list each collection and what it holds under a
   `## Data` section of `content-model.md`, creating the file with just that section when the shared
   prepare phase didn't write one, so the frontend step finds the whole data model in one place.

Rules that prevent the common failures:

- A rule is a filter: `null` = superusers only, `""` = everyone. Start from a recipe, never from `""`
  everywhere.
- What a visitor must not change goes in the rule, not in frontend code: ownership
  (`@request.body.owner = @request.auth.id`), locked fields (`@request.body.status:isset = false`),
  state (`@request.body.room.open = true`).
- One per person, and any fixed number of places, is a unique index, not a frontend check.
- Text length is the field's `max`, not a rule.
- Anything anyone can create gets a honeypot field and a rate limit (`patterns.md`, contact form).
- To take a record off other people's screens, delete it: subscribers get no realtime event for a
  record they can no longer see, so a "hidden" flag leaves it on their screen.

## Push phase — apply and verify (needs the instance)

Only once `provision.status == "completed"`.

```bash
node <here>/scripts/pb-apply-schema.mjs ~/.hostinger/<domain>/pocketbase/schema.json ~/.hostinger/<domain>/.pocketbase/credentials.json
```

Fix every reported problem and run it again until it prints `DONE`. It is idempotent: it never
deletes fields or data, adds `created` and `updated` timestamps, inserts `seed` records into empty
collections and merges `rateLimits`. Re-run it after every schema change; a schema change needs no
redeploy.

Then check the backend against the schema:

```bash
node <here>/scripts/pb-verify.mjs ~/.hostinger/<domain>/.pocketbase/credentials.json ~/.hostinger/<domain>/pocketbase/schema.json
```

Every `FAIL` must be fixed here except the last one, *the website itself returned …; deploy the
frontend*: the frontend isn't deployed yet, so deploy runs the same command again and expects
`READY`. A realtime `WARN` over HTTP/1.1 is fine for browsers; `<here>/troubleshooting.md` covers it
and the other traps.

Delete any test records you created by hand before handing over. Then update `state.json` and continue
to the frontend **data** phase.
