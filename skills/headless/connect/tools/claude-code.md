---
name: headless-connect-claude-code
description: "Specific Claude Code Hostinger MCP Server connection instructions for the Hostinger Headless flow."
---

## Goals

- Your goal is to make Hostinger MCP tools and Skills available in Claude Code. 
- Don't provision hosting, create stores, install WordPress, or deploy by hand here — the skill does all of that. This entry stops at signed in and checking that Hostinger MCP and skills are available.


## Step 1 — Make the MCP tools available

Stages 2–10 drive the Hostinger connector through Claude Code's native MCP tools. Check **both** tool
groups as *Check both tool groups* in `connect/SKILL.md` says:

- **Hosting:** `mcp__hostinger__*`, or the scoped `mcp__hostinger-hosting__*`.
- **Ecommerce:** `mcp__hostinger-ecommerce__*`. The scoped servers (`hostinger-hosting`,
  `hostinger-wordpress`, `hostinger-domains`, …) never include it, so a session full of
  `mcp__hostinger-*__*` tools can still be missing it.

Both present → use them and move on. Either missing → register the missing server(s) at user scope
now (`claude mcp list` shows what's already registered; skip those). The bootstrap already signed you
in, so they reuse the cached sign-in (`~/.config/hostinger-mcp/credentials.json`, or
`HOSTINGER_API_TOKEN`) and there are no tokens to handle:

```bash
claude mcp add hostinger --scope user -- npx -y @hostinger/mcp@latest                                     # hosting group missing
claude mcp add hostinger-ecommerce --scope user -- npx --package=@hostinger/mcp@latest hostinger-ecommerce-mcp  # ecommerce group missing
```

Claude Code loads MCP servers only at startup, so follow *register, restart, resume* in
`connect/SKILL.md`: finish Step 2 and `connect.json`, then ask the user to exit Claude Code, start it
again in the same folder (`claude`, or `claude --continue` to keep this conversation) and paste the
same prompt. Never spawn the server yourself or write a JSON-RPC client to reach it.

## Step 2 — Install the skills and hand off

Download the Hostinger skills locally **at the start of every run** so your agent then reads the files directly with no further network calls during the run. **Always pull the latest and let it overwrite any existing local `headless/` folder** — a build must never run on a stale skill copy (an outdated local copy is how a deleted, legacy flow ends up executing). The repo is **public**, so fetch just the skill folder over HTTPS — no git, no credentials:

```bash
# macOS/Linux — downloads only skills/headless from the public repo
curl -fsSL https://codeload.github.com/hostinger/api-mcp-server/tar.gz/refs/heads/main \
  | tar -xz --strip-components=2 'api-mcp-server-main/skills/headless'
```

```powershell
# Windows PowerShell
curl.exe -fsSL https://codeload.github.com/hostinger/api-mcp-server/tar.gz/refs/heads/main -o headless-skill.tar.gz
tar -xf headless-skill.tar.gz --strip-components=2 'api-mcp-server-main/skills/headless'
```

This leaves a local `headless/` folder with the full skill set. The bundle carries a `headless/VERSION` stamp (`version=<semver>`, commit, build date) — after pulling, read it and tell the user which skills version this run uses; it is the value to record in `connect.json`. If the tarball is ever blocked, browse the public folder at `https://github.com/hostinger/api-mcp-server/tree/main/skills/headless` and save each file under a local `headless/` directory, preserving the paths.

Then open `headless/SKILL.md` and follow the steps on it. That skill owns the rest of the run — it resolves the operations sequence.

