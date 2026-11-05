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
`connect/SKILL.md`: write `connect.json`, then ask the user to exit Claude Code, start it
again in the same folder (`claude`, or `claude --continue` to keep this conversation) and paste the
same prompt. Never spawn the server yourself or write a JSON-RPC client to reach it.

## Step 2 — Hand off

The skills are already in place: Phase 1 of `connect/SKILL.md` found the installed `<skill>`
folder or installed it from the `@hostinger/mcp` release. Don't download them again here. Read the
`<skill>/VERSION` stamp (record it in `connect.json`), open `<skill>/SKILL.md` and follow its
steps. That skill owns the rest of the run.
