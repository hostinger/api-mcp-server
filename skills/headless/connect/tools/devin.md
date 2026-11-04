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
respond → use them and move on.

If either is missing, register the missing server(s) for Devin; skip one already registered. The bootstrap already signed you in, so they reuse the
cached sign-in (`~/.config/hostinger-mcp/credentials.json`, or `HOSTINGER_API_TOKEN`) and there are no
tokens to handle.

- **Devin CLI:**

  ```bash
  devin mcp add hostinger -- npx -y @hostinger/mcp@latest
  devin mcp add hostinger-ecommerce -- npx --package=@hostinger/mcp@latest hostinger-ecommerce-mcp
  ```

- **Devin app:** Settings → MCP Marketplace → **Add Your Own**, transport **STDIO**, once per server:

  ```json
  { "command": "npx", "args": ["-y", "@hostinger/mcp@latest"] }
  ```

  ```json
  { "command": "npx", "args": ["--package=@hostinger/mcp@latest", "hostinger-ecommerce-mcp"] }
  ```

If the tools still aren't in this session, follow *register, restart, resume* in `connect/SKILL.md`:
finish Step 2 and `connect.json`, then ask the user to restart the Devin session (on Devin Desktop,
fully quit and reopen the app) and paste the same prompt. Never spawn the server yourself or write a
JSON-RPC client to reach it.

## Step 2 — Install the skills and hand off

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
