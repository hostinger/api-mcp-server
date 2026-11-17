# API rules

Rules are PocketBase filter expressions checked on every request, including realtime events. They are the app's security: the frontend can be bypassed, the rules cannot. `patterns.md` has complete, tested rule sets per app type; this file is the syntax.

- `null`: superusers only. Use it for anything visitors must never touch.
- `""`: everyone, signed in or not.
- An expression: allowed when it is true for the record and the request.

## Building blocks

| Expression | Means |
| --- | --- |
| `@request.auth.id != ""` | Signed in |
| `owner = @request.auth.id` | The record belongs to the caller (list, view, update, delete) |
| `@request.body.owner = @request.auth.id` | On create: callers can only create records owned by themselves |
| `@request.body.status:isset = false` | The request may not send this field at all |
| `@request.body.website = ""` | The field is empty or absent (honeypot) |
| `@request.body.owner:changed = false` | On update: this field may not change |
| `@request.body.score > score` | On update: the new value must be higher than the stored one |
| `room.open = true` | Follow a relation of the stored record |
| `@request.body.room.open = true` | On create: follow the relation being submitted |
| `@request.body.room = question.room` | Two relations must point to the same parent |
| `@request.auth.is_admin = true` | A field on the signed-in user's own record |
| `@request.body.tags:length <= 3` | Number of items in a multi-value field (select, relation, file) |
| `@request.body.text:lower !~ "casino"` | Case-insensitive "does not contain" |
| `@collection.members.user ?= @request.auth.id && @collection.members.team ?= team` | Membership through another collection (`?=` means any match) |

Operators: `=`, `!=`, `>`, `>=`, `<`, `<=`, `~` (contains), `!~`, and `?`-prefixed versions for "any item matches". Combine with `&&`, `||` and parentheses. Strings use double quotes, escaped as `\"` inside JSON.

Not valid or not safe:

- `:length` on a text field is rejected ("invalid left operand"). Limit text with the field's `max`.
- A text field with `"max": 0` means the default limit (5000 characters), not zero.
- `@request.headers.x_token = "..."` as a password: anything the browser sends is visible to the visitor.

## How a rejected request looks

| Operation | Rule fails |
| --- | --- |
| list | 200 with only the allowed records (often an empty list) |
| view, update, delete | 404 "The requested resource wasn't found." |
| create | 400 "Failed to create record." with empty `data` |
| Any rule set to `null`, called by a non-superuser | 403 |

A 400 that names a field (`data.email.code`) is field validation, not a rule.

## Picking a rule set

| Data | Pattern in `patterns.md` |
| --- | --- |
| Anyone sends, owner reads (contact, sign-up list, feedback, order requests) | Contact form |
| Public read, anyone or signed-in users post | Comments |
| One per person | Likes, votes |
| Public read, owner writes | Leaderboard, or comments signed-in version |
| Private to each user | Private notes |
| Activity inside a space the host controls | Live chat or Q&A |
| Admin-only actions | Admin area |
| Shared by a team | `members` collection with `team` and `user`, rules with `@collection.members...` as in the table above |

## Realtime and rules

A subscriber receives an event only if it may view the record after the change. When an update makes a record invisible to someone (a `hidden` flag, `published = false`), that person gets no event and their screen keeps the old record. To take something off other people's screens, delete it. Use a hide flag only for data that is never shown live. View collections send no realtime events at all.

## Checking a rule

Run `pb-verify.mjs`, then try the forbidden action signed out and as a second user and expect the failure from the table above. The most common mistake is a `""` that silently allows everything: check each one on purpose.
