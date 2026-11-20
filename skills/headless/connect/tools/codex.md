---
name: headless-connect-codex
description: "Specific Codex Hostinger MCP Server connection instructions for the Hostinger Headless flow."
---

## Goals

- Make Hostinger MCP tools and Skills available in Codex.
- Don't provision hosting, create stores, install WordPress, or deploy by hand here — the skill does all of that. This entry stops at signed in and checking that Hostinger MCP and skills are reachable.

## Step 1 — Make the MCP tools available

The later stages drive the Hostinger connector through Codex's native MCP tools. Check **both** tool groups (hosting and ecommerce), as *Check both tool groups* in `connect/SKILL.md`
says: other Hostinger tools responding doesn't mean the `hostinger-ecommerce` ones are there. Both
respond and both registrations run the launcher (*An existing Hostinger registration* in `connect/SKILL.md`) → use them and move on.

If either is missing, register the missing server(s); skip one already registered. The bootstrap already signed you in, so they reuse the cached
sign-in (`~/.config/hostinger-mcp/credentials.json`, or `HOSTINGER_API_TOKEN`) and there are no tokens
to handle:

```bash
codex mcp add hostinger -- "<command>" "<launcher>"
codex mcp add hostinger-ecommerce -- "<command>" "<launcher>" hostinger-ecommerce-mcp
```

or add them to `~/.codex/config.toml`:

```toml
[mcp_servers.hostinger]
command = "<command>"
args = ["<launcher>"]

[mcp_servers.hostinger-ecommerce]
command = "<command>"
args = ["<launcher>", "hostinger-ecommerce-mcp"]
```

Codex loads MCP servers only when it starts, so follow *register, restart, resume* in
`connect/SKILL.md`, which says when a restart is needed. When it is, ask the user to restart Codex and paste the
same prompt. Never spawn the server yourself or write a JSON-RPC client to reach it.

## Step 2 — Hand off

The skills are already in place: Phase 1 of `connect/SKILL.md` found `<skill>` and its
`<skill>/VERSION` stamp. Go back to `connect/SKILL.md`, Phase 4.
