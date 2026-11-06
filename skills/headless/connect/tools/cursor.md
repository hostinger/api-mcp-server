---
name: headless-connect-cursor
description: "Specific Cursor Hostinger MCP Server connection instructions for the Hostinger Headless flow."
---

## Goals

- Install (or reach) the Hostinger MCP in Cursor.
- Sign the user in with OAuth 2.0 PKCE — the MCP opens a browser so they only need to log in.
- Don't provision hosting, create stores, install WordPress, or deploy by hand here — the skill does all of that. This entry stops at signed in and checking that Hostinger MCP and skills are reachable.

## Step 1 — Install / reach Hostinger MCP

**Prerequisite:** Node.js 20 or newer on `PATH` (`node -v`). The published package engines require `>=20`; use Node 24 if you follow the package README.

The Hostinger MCP is the npm package `@hostinger/mcp`. You do **not** need a global install — Cursor (and this session) run it through the launcher (`~/.hostinger/mcp/`, written by the connect bootstrap), which starts the latest release with `npx` from your home folder. Never run `npx` for it directly: from the project, npx would run the project's own `node`. `<command>` and `<launcher>` below come from the bootstrap's `launcher` event (see `connect/SKILL.md`). Prefer the unified binary `hostinger-api-mcp` (every operation). Scoped binaries such as `hostinger-hosting-mcp` are optional.

### Option A — no global install (recommended)

```bash
# Verify the package/binary is reachable
cd "$HOME" && node "$HOME/.hostinger/mcp/launch.mjs" --version
```

### Option B — global install

```bash
npm install -g @hostinger/mcp
# or: yarn global add @hostinger/mcp
# or: pnpm add -g @hostinger/mcp

hostinger-api-mcp --version
```

### Register the servers in Cursor

Check **both** tool groups, as *Check both tool groups* in `connect/SKILL.md` says: hosting
(`mcp__hostinger__*` or `mcp__hostinger-hosting__*`) **and** ecommerce (`mcp__hostinger-ecommerce__*`).
The scoped `mcp__hostinger-*__*` servers never include ecommerce, so they alone don't count. Both
present and both registrations run the launcher (*An existing Hostinger registration* in `connect/SKILL.md`) → skip registration: go to Step 2 only if you still need sign-in, otherwise go to Step 3.

If either is missing, register the missing server(s) in `~/.cursor/mcp.json` (global, so every project and every
later run has them). Merge them into any existing `mcpServers` rather than replacing the file.
**Do not** put `HOSTINGER_API_TOKEN` in this file when you want OAuth: leave the token unset so
OAuth can run:

```json
{
  "mcpServers": {
    "hostinger": {
      "command": "<command>",
      "args": ["<launcher>"]
    },
    "hostinger-ecommerce": {
      "command": "<command>",
      "args": ["<launcher>", "hostinger-ecommerce-mcp"]
    }
  }
}
```

Cursor loads MCP servers only when the editor starts, so after Step 2 write `connect.json` and follow
*register, restart, resume* in `connect/SKILL.md`: ask the user to fully quit and reopen Cursor
(and, if Cursor asks, enable the two Hostinger servers under Settings → MCP), then paste the same
prompt. Never spawn the server yourself or write a JSON-RPC client to reach it: every connector call
must be a native MCP tool call.

## Step 2 — Authenticate with OAuth (browser opens)

Prefer OAuth for interactive Cursor use. OAuth works only in **stdio** mode (Cursor's default for this local server). Skip this step if `HOSTINGER_API_TOKEN` is already set in the environment (that bypasses OAuth entirely).

If the connect bootstrap already emitted `logged_in` / `success`, credentials are already on disk — continue to Step 3.

Otherwise run the login command. It registers a dynamic OAuth client (once per machine), **opens the user's browser** to Hostinger's authorization page, listens on a localhost callback, stores tokens, and exits:

```bash
cd "$HOME" && node "$HOME/.hostinger/mcp/launch.mjs" --login
```

(With a global install: `hostinger-api-mcp --login`.)

What to tell the user:

1. A browser window should open automatically for Hostinger sign-in.
2. If it does not, the process prints `[OAuth] Opening browser for sign-in:` plus the URL on stderr — show that URL and ask them to open it on **this same machine** (the callback is `http://127.0.0.1:<ephemeral-port>/oauth/callback`).
3. Wait until the command prints that sign-in succeeded and exits 0.

Credentials are stored and reused automatically:

- macOS / Linux: `~/.config/hostinger-mcp/credentials.json` (mode 0600)
- Windows: `%APPDATA%\hostinger-mcp\credentials.json`

They are shared across every Hostinger MCP binary. Expired access tokens refresh on their own; a revoked refresh token re-triggers the browser flow.

To sign out later:

```bash
cd "$HOME" && node "$HOME/.hostinger/mcp/launch.mjs" --logout
```

**API token (optional, CI / scripts):** set `HOSTINGER_API_TOKEN` in the environment before launching Cursor. When present it always wins and no OAuth code runs. Do not commit the token.

## Step 3 — Hand off

The skills are already in place: Phase 1 of `connect/SKILL.md` found the installed `<skill>`
folder or installed it from the `@hostinger/mcp` release. Don't download them again here. Read the
`<skill>/VERSION` stamp (record it in `connect.json`), open `<skill>/SKILL.md` and follow its
steps. That skill owns the rest of the run.
