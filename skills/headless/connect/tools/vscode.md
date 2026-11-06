---
name: headless-connect-vscode
description: "Specific VS Code Hostinger MCP Server connection instructions for the Hostinger Headless flow."
---

## Goals

- Make Hostinger MCP tools and Skills available in VS Code (GitHub Copilot / agent mode).
- Don't provision hosting, create stores, install WordPress, or deploy by hand here — the skill does all of that. This entry stops at signed in and checking that Hostinger MCP and skills are reachable.

## Step 1 — Make the MCP tools available

The later stages drive the Hostinger connector through VS Code's native MCP tools. Check **both** tool groups (hosting and ecommerce), as *Check both tool groups* in `connect/SKILL.md`
says: other Hostinger tools responding doesn't mean the `hostinger-ecommerce` ones are there. Both
respond and both registrations run the launcher (*An existing Hostinger registration* in `connect/SKILL.md`) → use them and move on.

If either is missing, register the missing server(s) for VS Code; skip one already registered. The bootstrap already signed you in, so they reuse
the cached sign-in (`~/.config/hostinger-mcp/credentials.json`, or `HOSTINGER_API_TOKEN`) and there are
no tokens to handle. Add them to `.vscode/mcp.json` (workspace) or your user `settings.json` under
`mcp`:

```json
// .vscode/mcp.json
{
  "servers": {
    "hostinger": {
      "type": "stdio",
      "command": "<command>",
      "args": ["<launcher>"]
    },
    "hostinger-ecommerce": {
      "type": "stdio",
      "command": "<command>",
      "args": ["<launcher>", "hostinger-ecommerce-mcp"]
    }
  }
}
```

Or add them in two commands:

```bash
code --add-mcp '{"name":"hostinger","command":"<command>","args":["<launcher>"]}'
code --add-mcp '{"name":"hostinger-ecommerce","command":"<command>","args":["<launcher>","hostinger-ecommerce-mcp"]}'
```

VS Code picks up new servers and their tools become available right away, with no editor restart.
(Alternatively, the official Hostinger Connector extension installs the same server:
`code --install-extension hostinger-official.hostinger-connector`.)

If the tools still don't show up, follow *register, restart, resume* in `connect/SKILL.md`: write
`connect.json`, then ask the user to run **Developer: Reload Window** and paste the same
prompt. Never spawn the server yourself or write a JSON-RPC client to reach it.

## Step 2 — Hand off

The skills are already in place: Phase 1 of `connect/SKILL.md` found the installed `<skill>`
folder or installed it from the `@hostinger/mcp` release. Don't download them again here. Read the
`<skill>/VERSION` stamp (record it in `connect.json`), open `<skill>/SKILL.md` and follow its
steps. That skill owns the rest of the run.
