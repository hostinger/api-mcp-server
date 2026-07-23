---
name: hostinger-headless-entry
description: "Build a complete website on Hostinger from a single prompt — hosting, domain, and (optionally) a store with real checkout. The deterministic first steps — verifying the Hostinger MCP server and signing in — are handled by a single bootstrap script; the agent then installs the full skill and hands the run to it. Triggers: build me a site, create a website, make me a website, online store, I want to sell X, start a business online, launch a site, ecommerce, portfolio, business website, sell online, online shop, connect this project to Hostinger, host this on Hostinger, deploy this to Hostinger."
---

# Hostinger Headless Skill — cold-start entry

You are a coding agent, and this is a skill for you to execute. Follow the phases below in order — do not summarize them. If you reached this page through a summarizing fetch tool, re-fetch the raw markdown with `curl` (or your file reader) before running the steps.

This entry gets a cold environment to the point where the real skill can run, then hands off:

1. Bootstrap (deterministic, scripted). A single script verifies the Hostinger MCP server is reachable and handles sign-in, so the run starts from a known-good, authenticated state. You just run it and relay its events.
2. Hand off (agentic). Install the skill, then open `headless/SKILL.md` and follow it — it resolves the operation (create / connect / iterate) and owns the whole build.

Three starting points come through here, all handled the same way — run the bootstrap, then hand off:

- new — a prompt with no project (empty CWD)
- connect — an existing frontend not yet on Hostinger
- iterate — a project already deployed to Hostinger (`.hostinger/site.json` present)

The bootstrap only verifies the MCP and signs you in, so it is safe to run in every case (an existing session just reports `logged_in`).

## Phase 0 — Node (the one manual prerequisite)

The Hostinger MCP server requires Node ≥ 20. Check it:

```bash
node -v
```

If that errors (Node not installed) or prints a version below 20, install or upgrade Node and re-check — do not try to work around it:

- macOS: `brew install node` (or `nvm install 22 && nvm use 22`)
- Linux: `nvm install 22 && nvm use 22` (or your distro's Node 20+ package)
- Windows: `winget install OpenJS.NodeJS.LTS` (or download from nodejs.org)

## Phase 1 — Run the bootstrap (deterministic)

Download the bootstrap script, then run it. It verifies the MCP server and handles sign-in, emitting one JSON event per line on stdout. Run it as a background/streaming process and relay its events to the user.

The script is safe and inspectable: it only checks the MCP server via `npx` and drives the OAuth sign-in (a browser flow with a localhost callback) — no other network calls, no filesystem writes. Read it first if your sandbox flags externally-downloaded code.

```bash
# macOS/Linux:
curl -fsSL -O https://raw.githubusercontent.com/hostinger/api-mcp-server/main/skills/headless/entry/bootstrap.mjs
# Windows PowerShell:
iwr https://raw.githubusercontent.com/hostinger/api-mcp-server/main/skills/headless/entry/bootstrap.mjs -OutFile bootstrap.mjs

node bootstrap.mjs
```

### Relay these events

The script emits one JSON object per line:

| Event | What to do |
| --- | --- |
| `mcp_ok` | MCP server reachable — continue. |
| `logged_in` | Already authenticated (env token or a previous sign-in) — continue. |
| `awaiting_user` (`verificationUri`) | A browser window should have opened on the user's machine. Show the URL in plain prose and wait for the user to finish signing in. The OAuth callback lands on a localhost port, so the sign-in must be completed on this same machine. |
| `success` | Bootstrap done — continue to Phase 2. |
| `mcp_unreachable` / `login_failed` (with `detail`) | Stop and show the user the `detail`. Do not improvise a parallel setup by hand. |

If the environment has a `HOSTINGER_API_TOKEN` set (for example CI), the bootstrap reports `logged_in` immediately — no browser needed.

## Phase 2 — Install the skill and hand off

Install the Hostinger skills locally so your agent reads files directly with no network calls:

```bash
npx skills add hostinger/api-mcp-server --yes
```

If the installer is unavailable, fetch the files directly instead — the full set is listed in the skill folder at `https://github.com/hostinger/api-mcp-server/tree/main/skills/headless`.

Then open `headless/SKILL.md` and follow it. That skill owns the rest of the run — it resolves the operation (create / connect / iterate), checks the account has a usable hosting plan, provisions the website and domain, seeds the store when commerce is requested, builds, deploys, and verifies.

- Don't provision hosting, create stores, or deploy by hand here — the skill does all of that (`references/SETUP.md`, `references/DEPLOYMENT.md`, `references/STORE.md`). This entry stops at signed in.
- You're already authenticated from Phase 1, so every Hostinger MCP tool call will work without prompting again.
