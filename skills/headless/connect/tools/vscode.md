---
name: headless-connect-vscode
description: "Specific VS Code Hostinger MCP Server connection instructions for the Hostinger Headless flow."
---

## Goals

- Make Hostinger MCP tools and Skills available in VS Code (GitHub Copilot / agent mode).
- Don't provision hosting, create stores, install WordPress, or deploy by hand here — the skill does all of that. This entry stops at signed in and checking that Hostinger MCP and skills are reachable.

## Step 1 — Make the MCP tools available

The later stages drive the Hostinger connector through VS Code's native MCP tools. Check **both** tool groups (hosting and ecommerce) with a real search, as *Check both tool groups* in `connect/SKILL.md`
says: "list websites" finds `hosting_websites_list` and "list stores" finds `ecommerce_stores_list`,
on any connected Hostinger server. The unified `hostinger` server and `mcp.hostinger.com` carry both;
the scoped servers (`hostinger-hosting`, `hostinger-wordpress`, …) carry no ecommerce. Both pass and
the registrations run the launcher (*An existing Hostinger registration* in `connect/SKILL.md`) → use them and move on.

If the hosting group is missing, register `hostinger` for VS Code, which carries both groups; skip it
if it's already registered. The bootstrap already signed you in, so it reuses the cached sign-in
(`~/.config/hostinger-mcp/credentials.json`, or `HOSTINGER_API_TOKEN`) and there are no tokens to
handle. Add it to `.vscode/mcp.json` (workspace) or your user `settings.json` under `mcp`:

```json
// .vscode/mcp.json
{
  "servers": {
    "hostinger": {
      "type": "stdio",
      "command": "<command>",
      "args": ["<launcher>"]
    }
  }
}
```

Or add it in one command:

```bash
code --add-mcp '{"name":"hostinger","command":"<command>","args":["<launcher>"]}'
```

Only when hosting passes and ecommerce doesn't (scoped servers only), add the ecommerce fallback
instead, as a `hostinger-ecommerce` entry with `"args": ["<launcher>", "hostinger-ecommerce-mcp"]` or:

```bash
code --add-mcp '{"name":"hostinger-ecommerce","command":"<command>","args":["<launcher>","hostinger-ecommerce-mcp"]}'
```

VS Code picks up new servers and their tools become available right away, with no editor restart.
(Alternatively, the official Hostinger Connector extension installs the same server:
`code --install-extension hostinger-official.hostinger-connector`.)

If the tools still don't show up, follow *register, restart, resume* in `connect/SKILL.md`, which
says when a restart is needed. When it is, ask the user to run **Developer: Reload Window** and paste the same
prompt. Never spawn the server yourself or write a JSON-RPC client to reach it.

## Step 2 — Hand off

The skills are already in place: Phase 1 of `connect/SKILL.md` found `<skill>` and its
`<skill>/VERSION` stamp. Go back to `connect/SKILL.md`, Phase 4.
