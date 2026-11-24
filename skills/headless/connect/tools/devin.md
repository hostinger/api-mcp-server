---
name: headless-connect-devin
description: "Specific Devin Hostinger MCP Server connection instructions for the Hostinger Headless flow."
---

## Goals

- Make Hostinger MCP tools and Skills available in Devin.
- Don't provision hosting, create stores, install WordPress, or deploy by hand here — the skill does all of that. This entry stops at signed in and checking that Hostinger MCP and skills are reachable.

## Step 1 — Make the MCP tools available

The later stages drive the Hostinger connector through Devin's native MCP tools. Check **both** tool groups (hosting and ecommerce) with a real search, as *Check both tool groups* in `connect/SKILL.md`
says: "list websites" finds `hosting_websites_list` and "list stores" finds `ecommerce_stores_list`,
on any connected Hostinger server. The unified `hostinger` server and `mcp.hostinger.com` carry both;
the scoped servers (`hostinger-hosting`, `hostinger-wordpress`, …) carry no ecommerce. Both pass and
the registrations run the launcher (*An existing Hostinger registration* in `connect/SKILL.md`) → use them and move on.

If the hosting group is missing, register `hostinger` for Devin, which carries both groups; skip it if
it's already registered. The bootstrap already signed you in, so it reuses the cached sign-in
(`~/.config/hostinger-mcp/credentials.json`, or `HOSTINGER_API_TOKEN`) and there are no tokens to handle.

- **Devin CLI:**

  ```bash
  devin mcp add hostinger -- "<command>" "<launcher>"
  ```

- **Devin app:** Settings → MCP Marketplace → **Add Your Own**, transport **STDIO**:

  ```json
  { "command": "<command>", "args": ["<launcher>"] }
  ```

Only when hosting passes and ecommerce doesn't (scoped servers only), register the ecommerce fallback
instead: `devin mcp add hostinger-ecommerce -- "<command>" "<launcher>" hostinger-ecommerce-mcp`, or in
the Devin app:

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
