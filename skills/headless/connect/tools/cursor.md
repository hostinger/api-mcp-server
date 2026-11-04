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

The Hostinger MCP is the npm package `@hostinger/mcp`. You do **not** need a global install — Cursor (and this session) can run it through `npx`. Prefer the unified binary `hostinger-api-mcp` (every operation). Scoped binaries such as `hostinger-hosting-mcp` are optional.

### Option A — no global install (recommended)

```bash
# Verify the package/binary is reachable
npx --yes --package=@hostinger/mcp@latest hostinger-api-mcp --version
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
present → skip registration: go to Step 2 only if you still need sign-in, otherwise go to Step 3.

If either is missing, register the missing server(s) in `~/.cursor/mcp.json` (global, so every project and every
later run has them). Merge them into any existing `mcpServers` rather than replacing the file.
**Do not** put `HOSTINGER_API_TOKEN` in this file when you want OAuth: leave the token unset so
OAuth can run:

```json
{
  "mcpServers": {
    "hostinger": {
      "command": "npx",
      "args": ["--yes", "--package=@hostinger/mcp@latest", "hostinger-api-mcp"]
    },
    "hostinger-ecommerce": {
      "command": "npx",
      "args": ["--yes", "--package=@hostinger/mcp@latest", "hostinger-ecommerce-mcp"]
    }
  }
}
```

Cursor loads MCP servers only when the editor starts, so after Step 2 and Step 3 follow
*register, restart, resume* in `connect/SKILL.md`: ask the user to fully quit and reopen Cursor
(and, if Cursor asks, enable the two Hostinger servers under Settings → MCP), then paste the same
prompt. Never spawn the server yourself or write a JSON-RPC client to reach it: every connector call
must be a native MCP tool call.

## Step 2 — Authenticate with OAuth (browser opens)

Prefer OAuth for interactive Cursor use. OAuth works only in **stdio** mode (Cursor's default for this local server). Skip this step if `HOSTINGER_API_TOKEN` is already set in the environment (that bypasses OAuth entirely).

If the connect bootstrap already emitted `logged_in` / `success`, credentials are already on disk — continue to Step 3.

Otherwise run the login command. It registers a dynamic OAuth client (once per machine), **opens the user's browser** to Hostinger's authorization page, listens on a localhost callback, stores tokens, and exits:

```bash
npx --yes --package=@hostinger/mcp@latest hostinger-api-mcp --login
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
npx --yes --package=@hostinger/mcp@latest hostinger-api-mcp --logout
```

**API token (optional, CI / scripts):** set `HOSTINGER_API_TOKEN` in the environment before launching Cursor. When present it always wins and no OAuth code runs. Do not commit the token.

## Step 3 — Install the skills and hand off

Download the Hostinger skills locally **at the start of every run** so your agent then reads the files
directly with no further network calls during the run. **Always pull the latest and overwrite any
existing local `headless/` copy** so a run never uses a stale skill version. The repo is **public**, so
fetch just the skill folder over HTTPS — no git, no credentials (see `connect/tools/claude-code.md` for
the full tarball command):

```bash
# macOS/Linux — downloads only skills/headless from the public repo
curl -fsSL https://codeload.github.com/hostinger/api-mcp-server/tar.gz/refs/heads/main \
  | tar -xz --strip-components=2 'api-mcp-server-main/skills/headless'
```

Then read the `headless/VERSION` stamp (record it in `connect.json`), open `headless/SKILL.md` and follow its steps. That skill owns the rest of the run.
