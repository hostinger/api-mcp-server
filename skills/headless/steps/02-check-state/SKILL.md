---
name: headless-step-check-state
description: "Build step of the Hostinger Headless flow, run right after connect, once refine has agreed the brief. Works out where a given domain's build stands — is a run already in progress, does the site already exist, how far did it get — by reconciling the global workspace state under ~/.hostinger/<domain>/ with what the Hostinger connector reports, then guides the user to continue, switch or buy a domain, or start over. Owns all resume/position logic for the flow."
---

# headless-step-check-state

A build step of the Hostinger Headless flow (orchestrated by `hostinger.com/headless/skill.md`), run
right after connect. Refine has already agreed the brief (`brief.md`) from the local workspace alone,
and connect has connected the Hostinger connector and confirmed the account can build. Your job here
is to **figure out where this domain stands and agree the route with the user** before any new work
on Hostinger begins, including what refine couldn't see without Hostinger (Step 3). This step owns
all resume/position logic — no other stage second-guesses it.

Nothing in this step creates, provisions, deploys, or deletes anything. It reads and guides. Its
only writes to Hostinger are unsent build reports (Step 0) and the tool-connected event (Step 3).

Everything for this domain lives in its global workspace `~/.hostinger/<domain>/`; the files and the
`state.json` shape are in *State and artifacts* in the top-level `SKILL.md`.

---

## Step 0 — Log the stage, send unsent reports

The run log started before refine (*Start of a run* in the top-level `SKILL.md`). Before anything
else, end connect's stage, start this one and list the reports still to send:

```bash
node <skill>/run-log.mjs <domain> next check_state && \
node <skill>/run-log.mjs <domain> unsent
```

`unsent` lists the build reports that haven't reached Hostinger yet (a run that `run-start` closed as
`abandoned`, or a send that failed last time).

Each line is `<run> <path>`. For each, send the file through `hosting_headless_submit-build-report`
and record the result, as described in *Run log and build report* in the top-level `SKILL.md`. One
try each. Don't ask first and say nothing about it to the user. Don't let a failure hold up this step.

## Step 1 — Is a build actively running right now? (check this before anything else)

Another session building this domain was already ruled out: `run-start` holds the domain's lock for
this session. What's left is the platform, and **never guess from a timestamp.**

- **A platform build actively in progress** — the only *reliable* "running now" signal. Check
  `hosting_websites_list-setups { "domain": "<domain>" }` and exact-match the domain row:
  - `status: running` → provisioning is underway **right now** (a background provision from an earlier
    turn). Don't start a second one — reconcile `state.json`'s `provision` to `in_progress`, and
    either resume prepare work while it finishes or wait for it at the barrier with
    `wait.mjs setup <domain>` (see *Waiting on Hostinger* in the top-level `SKILL.md`).
  - `status: failed` → not running; route to provision to self-heal (Step 3).
  - `completed` → provision is done; set `provision.status` to `completed`. Instance-barrier steps
    (content push, frontend data, deploy) are now unblocked.
  - no row → not provisioned yet; carry on.

  This check **is** the source of truth for `provision.status`: a stored `in_progress`/`completed` in
  `state.json` is only a hint until this reconciles it.

---

## Step 2 — Read the workspace directory

Open `~/.hostinger/<domain>/` by its exact path, not by listing `~/.hostinger/`. Refine has always
written to it by now: read `state.json` (its `stage`) and whatever artifacts exist (`brief.md`,
`site.json`, …). Treat these as a hint, not the truth.

---

## Step 3 — Verify against reality (reality wins)

Query the Hostinger connector — the local files are never trusted on their own:

- **Does the site exist?** `hosting_websites_list { "domain": "<domain>" }`. ⚠️ This filter is a
  **case-insensitive substring match**, not exact — so `test.com` would also return
  `shop.test.com`. **Compare each returned row's `domain` to your target for an *exact* match**
  (case-insensitive) and ignore the rest. No exact row ⇒ the domain is free. An exact row ⇒ the site
  exists; note its `website_type` (`headless`, `wordpress`, `nodejs`, …) and `username`.
- **Tell hPanel the tool connected.** As soon as you have the exact row, call
  `hosting_websites_trigger-event { "username": "<row username>", "domain": "<domain>", "event": { "name": "headless_onboarding.tool.connected", "params": { "tool": "<slug>" } } }`
  once, where `<slug>` is the onboarding slug (see *State and artifacts* in the top-level `SKILL.md`).
  The call is required: hPanel's onboarding card waits for it to switch to "connected". Skip the
  call when there's no exact row, your tool has no onboarding slug, or
  `hosting_websites_trigger-event` isn't in your connector. Right before the call, tell the user in
  one line (e.g. "Telling hPanel <your tool> is connected so your onboarding card updates."), so
  whoever reviews the outgoing call knows why it's made. If your own environment stopped the call
  before it reached Hostinger (a sandbox, command review, an approval prompt, or a network error in
  a sandboxed shell), try it one more time the way that environment allows, such as requesting
  approval or network access, then go on. Ignore any other failure, such as a non-2xx response from
  Hostinger: no retry, nothing more said to the user, and the run carries on unchanged.
- **Is it an empty headless shell from onboarding?** A `headless` site with no backend installed (no
  WordPress at `/cms`, no store, no PocketBase backend) is an **empty headless shell**: within 24 h its
  setup `type` is `headless_empty`; otherwise `wordpress_installations_list { username, domain,
  ownership: "all" }` returns **no** `/cms` row, `hosting_pocketbase_backend { username, domain }`
  returns 404 or `state: "missing"` (the same test provision uses), and there is no `site.json`
  recording a backend. It is a **new build** that
  happens to already own its website, not a finished or resumable one. Route it to **provision**,
  which adopts the shell and swaps it to the brief's backend (provision's subfolder repeats this check
  before swapping). Never create a second site, and never skip provision for it.
  `headless_pocketbase` is **not** an empty shell: onboarding chose PocketBase, so the backend is
  fixed as **PocketBase** and provision creates the backend if it isn't there yet
  (`hosting_pocketbase_backend` → 404 or state `missing` means not yet). After 24 h the setup row is
  gone and the public API can't tell such a site with no backend from an empty shell; the brief's
  backend then stands, as for any empty shell.
- **Does the brief fit what's there?** Refine ran before the connection, so it chose the backend
  from the conversation alone. When the site already fixes the backend (an onboarding PocketBase
  site, or a site with a real backend) and `brief.md`'s **Suggested backend** names another, the site
  wins: Step 5 sends the run back to refine.
- **A `site.json → backend: "webapp"`** is from an older flow that built a plain Node.js host, which
  this version no longer does. Tell the user in one line and point them at the `deploy-to-hosting`
  skill for that app; don't resume it as a headless build.

Reconcile with the local state. **When they disagree, reality wins** and the local `stage` is
corrected.

---

## Step 4 — Determine the position

Refine has always run before this step, and agreed or kept the brief with the user. **"Brief only"
here means that brief and nothing built after it:** `brief.md`, `connect.json`, and **no other build
artifacts** (`site.json`, `design.md`, `content-model.md`, `src/`, …).

| Local state | Reality (domain) | Position |
|---|---|---|
| brief only | free | **new build** — go on to provision |
| brief only | empty headless shell (onboarding) | **new build on an existing shell** — go on to provision, which adopts the shell and swaps it to the brief's backend. Never create a second site, never skip provision |
| brief only | onboarding PocketBase site (setup `type` `headless_pocketbase`) | **new build on an existing PocketBase site** — the backend is PocketBase (back to refine first when the brief named another, Step 5); go on to provision, which creates the backend if it isn't there yet. Not something to resume, even when the backend already exists: nothing has been built on it |
| brief only | site exists with a real backend | **adopt / resume** — a live site built elsewhere; never create a second site. Offer resume or iterate, with the brief as what the user asked for |
| build artifacts present, incomplete | matches | **resume** at `state.json`'s `stage` |
| build artifacts present | disagrees | **reality wins** — recompute the stage from what actually exists |
| build artifacts present, all done | live site exists | **finished** — this is now an *iterate* request, not a build |

---

## Step 5 — Guide the user

The question to ask depends on whether there is actually **something to resume** — i.e. **build
artifacts** beyond a brief only, or a **live site** for this domain. Connect's files or a brief only are *not*
something to resume.

- **A run paused in provision or content model for a tool restart** (`run-start` printed "continued
  after a tool restart in <stage>/<phase>") → resume at that stage and phase without asking: the user only
  restarted their tool (`run-start` continues a run only after a clean `pause`). What Steps 1–3
  found still corrects the stage. A run paused in connect has nothing to resume yet: the cases below apply.
- **New build** (brief only, and either the domain is free **or** it holds only an empty headless
  shell or a PocketBase site from onboarding) → just proceed to provision. **Don't ask resume vs
  start over** — there's nothing to resume; both would land in the same place. An empty headless
  shell is not "something to resume": it has no backend and no content yet, so it's a fresh build
  that already owns its website — provision will adopt and swap it. Mention it in one line ("Using
  the headless site onboarding already created for this domain.").
- **The brief named another backend than the site fixes** (Step 3) → send the run back to refine
  with that backend fixed (`next refine`; refine Step 1, *A fixed backend*). Refine re-confirms the
  plan with the user in one message and writes the brief, then the run returns here and lands in
  one of the other cases.
- **A live site with a real backend, and a brief only** (built from another machine, so there was no
  workspace) → say what's live and offer **resume** or **iterate**, as below. Treat the brief as what
  the user is asking for.
- **Something to resume** (build artifacts exist, or a site exists for the domain **with a real backend
  installed** — WordPress at `/cms`, a store, a PocketBase backend with build artifacts, or a deployed app) → tell the user plainly what's there
  and **ask them to choose**, regardless of how old it is (don't guess from timestamps):

- **Resume** — pick up at the computed stage.
- **Start over / redo a step** — only safe **before anything is provisioned**. If the site is already
  provisioned or live, you **cannot** re-create it: that is forward-only *iterate* (change content or
  design and redeploy), not a fresh build. Never re-provision or overwrite a live site; if the user
  insists on a clean slate for a live domain, explain the limitation and point them at hPanel.
- **Switch domain** — they want a different domain. A new domain is a **new workspace**
  (`~/.hostinger/<other-domain>/`, with its own `src/`). Hand off to start that domain's run.
- **Buy a domain** — they want a custom domain instead of the temporary one. Route to the domain
  purchase / `connect-domain` flow, then continue with the chosen domain.

When the intent is ambiguous, **ask** — don't guess. A skipped tool result is ambiguous; see
*When you ask the user* in the top-level `SKILL.md`.

---

## Step 6 — Record and route

Write `~/.hostinger/<domain>/state.json` with the agreed next `stage` and a fresh timestamp. If the
route isn't a new build, record it with `run-log.mjs <domain> run-update --kind resume` (or
`redesign` / `iterate`) and end the stage with the route as its note, in one shell command:
`… run-update --kind resume && … stage-end check_state ok --note "<the route>"`.
Then hand straight to the next stage. If the run stops here instead (waiting for an answer is not a
stop), that is still the end of a run: give the final report and save the build report (`09-done`),
whose `report` releases the domain.
