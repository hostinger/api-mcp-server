---
name: headless-connect-antigravity
description: "Specific Antigravity Hostinger MCP Server connection instructions for the Hostinger Headless flow."
---

## Goals

- Make Hostinger MCP tools and Skills available in Google Antigravity.
- Don't provision hosting, create stores, install WordPress, or deploy by hand here — the skill does all of that. This entry stops at signed in and checking that Hostinger MCP and skills are reachable.

## Step 1 — Make the MCP tools available

The later stages drive the Hostinger connector through Antigravity's native MCP tools. Check **both** tool groups (hosting and ecommerce), as *Check both tool groups* in `connect/SKILL.md`
says: other Hostinger tools responding doesn't mean the `hostinger-ecommerce` ones are there. Both
respond → use them and move on.

If either is missing, add the missing server(s) to `~/.gemini/antigravity/mcp_config.json` (Windows:
`C:\Users\<USERNAME>\.gemini\antigravity\mcp_config.json`), which you can reach from the Agent panel's
"..." → MCP Servers → Manage MCP Servers → View raw config. Merge them into any existing
`mcpServers` rather than replacing the file. The bootstrap already signed you in, so they reuse the
cached sign-in (`~/.config/hostinger-mcp/credentials.json`, or `HOSTINGER_API_TOKEN`) and there are
no tokens to handle:

```json
{
  "mcpServers": {
    "hostinger": {
      "command": "npx",
      "args": ["-y", "@hostinger/mcp@latest"]
    },
    "hostinger-ecommerce": {
      "command": "npx",
      "args": ["--package=@hostinger/mcp@latest", "hostinger-ecommerce-mcp"]
    }
  }
}
```

Antigravity loads MCP servers only when the editor starts, so follow *register, restart, resume* in
`connect/SKILL.md`: write `connect.json`, then ask the user to fully quit and reopen
Antigravity and paste the same prompt. Never spawn the server yourself or write a JSON-RPC client to
reach it.

## Step 2 — Hand off

The skills are already in place: Phase 1 of `connect/SKILL.md` found the installed `<skill>`
folder or installed it from the `@hostinger/mcp` release. Don't download them again here. Read the
`<skill>/VERSION` stamp (record it in `connect.json`), open `<skill>/SKILL.md` and follow its
steps. That skill owns the rest of the run.
