---
name: headless-connect-devin
description: "Specific Devin Hostinger MCP Server connection instructions for the Hostinger Headless flow."
---

## Goals

- Make Hostinger MCP tools and Skills available in Devin.
- Don't provision hosting, create stores, install WordPress, or deploy by hand here — the skill does all of that. This entry stops at signed in and checking that Hostinger MCP and skills are reachable.

## Step 1 — Make the MCP tools available

The later stages drive the Hostinger connector through Devin's native MCP tools. Check **both** tool groups (hosting and ecommerce), as *Check both tool groups* in `connect/SKILL.md`
says: other Hostinger tools responding doesn't mean the `hostinger-ecommerce` ones are there. Both
respond and both registrations run the launcher (*An existing Hostinger registration* in `connect/SKILL.md`) → use them and move on.

If either is missing, register the missing server(s) for Devin; skip one already registered. The bootstrap already signed you in, so they reuse the
cached sign-in (`~/.config/hostinger-mcp/credentials.json`, or `HOSTINGER_API_TOKEN`) and there are no
tokens to handle.

- **Devin CLI:**

  ```bash
  devin mcp add hostinger -- "<command>" "<launcher>"
  devin mcp add hostinger-ecommerce -- "<command>" "<launcher>" hostinger-ecommerce-mcp
  ```

- **Devin app:** Settings → MCP Marketplace → **Add Your Own**, transport **STDIO**, once per server:

  ```json
  { "command": "<command>", "args": ["<launcher>"] }
  ```

  ```json
  { "command": "<command>", "args": ["<launcher>", "hostinger-ecommerce-mcp"] }
  ```

If the tools still aren't in this session, follow *register, restart, resume* in `connect/SKILL.md`,
which says when a restart is needed. When it is, ask the user to restart the Devin session (on Devin Desktop,
fully quit and reopen the app) and paste the same prompt. Never spawn the server yourself or write a
JSON-RPC client to reach it.

## Step 2 — Hand off

The skills are already in place: Phase 1 of `connect/SKILL.md` found `<skill>` and its
`<skill>/VERSION` stamp. Go back to `connect/SKILL.md`, Phase 4.
