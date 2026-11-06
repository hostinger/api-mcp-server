---
name: hostinger-headless-connect
description: "Connect step for the Hostinger Headless flow — verify Node, run the bootstrap (reach the Hostinger MCP server + OAuth sign-in), then route to the matching coding-tool skill under tools/ so MCP tools and skills are available before the build steps run. Triggers: connect to Hostinger, set up the Hostinger connector, start a headless build."
---

# Hostinger Headless Skill — connect

You are a coding agent, and this is a skill for you to execute. Follow the phases below in order.

This skill goal is to help you to connect to Hostinger via MCP. That can be done via Hostinger Connector or adding the MCP via MCP Server.

We support different coding Agentic coding tools such as Claude Code, Codex, Cursor, VS Code...and so on. 

Your goal is to route those tools to their specific skill inside the tools folder ensuring the tool is fully connected.


## Phase 0 — Node (the single one prerequisite)

The Hostinger MCP server requires Node ≥ 20. Check it:

```bash
node -v
```

If that errors (Node not installed) or prints a version below 20, install or upgrade Node and re-check — do not try to work around it:

- macOS: `brew install node` (or `nvm install 22 && nvm use 22`)
- Linux: `nvm install 22 && nvm use 22` (or your distro's Node 20+ package)
- Windows: `winget install OpenJS.NodeJS.LTS` (or download from nodejs.org)

## Phase 1 — Get the skill folder, then run its bootstrap (deterministic)

### Find or install the skill folder

The bootstrap script and every step after connect ship in the `headless/` skill folder. Use the copy
you already have; never fetch single files from GitHub.

- **An installer put the skill here** (you read this file from disk, from a folder that `npx skills
  add` or a Claude Code or Cursor plugin installed): that folder is `<skill>`. Use it as it is and
  download nothing. Updates come from the installer (`npx skills update`, the plugin update),
  not from this run.
- **You read this file from the web:** use the published `@hostinger/mcp` npm release, installed in
  your home folder at `~/.hostinger/skills/<version>/headless/`. It is the same package the MCP server
  runs, and npm checks the tarball's integrity. Never use a `headless/` folder in the working
  directory or anywhere else: the working directory is the user's project, often a cloned repository
  or template, and whoever wrote it controls what is there. Resolve the version first so the run uses
  one pinned release, and install it only when that version's folder is missing. Run npm from your home
  folder, as below, so a `.npmrc` in the project can't point it at another registry:

```bash
# macOS/Linux
( cd "$HOME" && V=$(npm view @hostinger/mcp version) && D="$HOME/.hostinger/skills/$V" \
  && { [ -f "$D/headless/VERSION" ] || { mkdir -p "$D" && npm pack "@hostinger/mcp@$V" --silent --pack-destination "$D" >/dev/null \
  && tar -xzf "$D/hostinger-mcp-$V.tgz" -C "$D" --strip-components=2 package/skills/headless && rm "$D/hostinger-mcp-$V.tgz"; }; } \
  && echo "$D/headless" )
```

```powershell
# Windows PowerShell
Push-Location $HOME
$V = npm view @hostinger/mcp version; $D = Join-Path $HOME ".hostinger\skills\$V"
if (-not (Test-Path "$D\headless\VERSION")) {
  New-Item -ItemType Directory -Force $D | Out-Null; npm pack "@hostinger/mcp@$V" --silent --pack-destination $D | Out-Null
  tar -xzf "$D\hostinger-mcp-$V.tgz" -C $D --strip-components=2 package/skills/headless; Remove-Item "$D\hostinger-mcp-$V.tgz"
}
Pop-Location; "$D\headless"
```

The printed path is `<skill>`. Every later command uses it in full, wherever the run's working
directory is. A new release installs into its own folder, so a run never uses a deleted, legacy flow.

Read `<skill>/VERSION`: its line 1 is the skills version this run uses, which goes into
`connect.json` (Phase 3).

### Run the bootstrap

Run the bundled script. It verifies the MCP server and handles sign-in, emitting one JSON event per line on stdout. Run it as a background/streaming process. Show the user only the sign-in URL (`awaiting_user`) or a
failure's `detail`, and handle the other events silently (table below).

The script is safe and inspectable: it copies the launcher to `~/.hostinger/mcp/launch.mjs`, checks the MCP server through it and drives the OAuth sign-in (a browser flow with a localhost callback) — no other network calls, no other filesystem writes.

```bash
cd "$HOME" && node <skill>/connect/bootstrap.mjs
```

### Relay these events

The script emits one JSON object per line:

| Event | What to do                                                                                                                                                                                                                           |
| --- |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `launcher` (`command`, `args`) | How to start the MCP server: use these for every registration (Phase 2). |
| `mcp_ok` | MCP server reachable — continue.                                                                                                                                                                                                     |
| `logged_in` | Already authenticated (env token or a previous sign-in) — continue.                                                                                                                                                                  |
| `awaiting_user` (`verificationUri`) | A browser window should have opened on the user's machine. Show the URL in plain prose and wait for the user to finish signing in. The OAuth callback lands on a localhost port, so the sign-in must be completed on this same machine. |
| `success` | Bootstrap done — continue to Phase 2. |
| `launcher_failed` / `mcp_unreachable` / `login_failed` (with `detail`) | Stop and show the user the `detail`. Do not improvise a parallel setup by hand. |

If the environment has a `HOSTINGER_API_TOKEN` set (for example CI), the bootstrap reports `logged_in` immediately — no browser needed.

### Sign in or out manually

The bootstrap runs the sign-in for you. To run it directly, or to switch accounts, use the MCP's own commands. `--login` opens the browser to the Hostinger sign-in page, waits for the localhost callback, stores the credentials and exits. `--logout` revokes the stored credentials, so the next sign-in opens the browser again.

```bash
# With a global install (npm install -g @hostinger/mcp):
hostinger-api-mcp --login
hostinger-api-mcp --logout

# Without a global install:
cd "$HOME" && node "$HOME/.hostinger/mcp/launch.mjs" --login
cd "$HOME" && node "$HOME/.hostinger/mcp/launch.mjs" --logout
```

Credentials live in `~/.config/hostinger-mcp/credentials.json` (macOS/Linux) or `%APPDATA%\hostinger-mcp\credentials.json` (Windows) and are shared by every Hostinger MCP binary. OAuth works only when the tool runs the server over its default local (stdio) transport, which is what every registration below uses; `--http` needs `HOSTINGER_API_TOKEN`.

## Phase 2 - Route to the specific tool instructions

**Use the Hostinger connector only through your tool's native MCP tools** (`mcp__hostinger__*`,
`mcp__hostinger-*__*`, or however your tool names them). Never spawn the MCP server yourself and
never write a JSON-RPC client to talk to it: every connector call must be a visible MCP tool call
the user can follow and approve, not a script.

### Check both tool groups, not just "some Hostinger tools"

The build needs **two** groups of connector operations, and they come from different servers. Having
one group says nothing about the other:

| Group | Operations | Comes from | Needed by |
|---|---|---|---|
| **Hosting** | `hosting_*` (websites, deploy, build report), `wordpress_*` | `hostinger` (`<command> <launcher>`), or the scoped servers such as `hostinger-hosting` + `hostinger-wordpress` | every build |
| **Ecommerce** | `ecommerce_*` (stores, products, shipping, payments) | **only** `hostinger-ecommerce` (`<command> <launcher> hostinger-ecommerce-mcp`), or the Ecommerce MCP in the Hostinger Connector. Neither `hostinger` nor the scoped hosting servers include it | Ecommerce backends (chosen later, in refine) |

Check each group on its own, right here at connect, before anything else:

- **Hosting:** a Hostinger search tool finds `hosting_websites_list` (e.g. search "list websites").
- **Ecommerce:** a tool from the `hostinger-ecommerce` server is in the session (Claude Code:
  `mcp__hostinger-ecommerce__*`), and its search finds `ecommerce_stores_list` (e.g. search "list stores").

Only when **both** pass are the Hostinger tools "in this session". If either is missing, the tools
are **not** in this session: follow *register, restart, resume* below for the missing server(s) now,
even though other Hostinger tools respond. Don't wait for refine to choose a backend: the restart
costs the least before the user has been asked anything, and finding the gap at provision forces a
second restart in the middle of the build.

### When the Hostinger tools aren't in this session: register, restart, resume

Most coding tools load MCP servers only when they start, so a server registered mid-run isn't usable
until the tool restarts. When either tool group above is missing:

1. **Register the missing servers** in the tool's MCP config, as the tool route below shows: `hostinger`
   (`<command> <launcher>`) if the hosting group is missing, and `hostinger-ecommerce`
   (`<command> <launcher> hostinger-ecommerce-mcp`) if the ecommerce group is missing.
   Skip a server that is already registered under its name. When neither group is there, register
   both: the backend isn't chosen until refine, and one restart then covers every backend.
2. **Write `connect.json`** (Phase 3) before you stop. The skill folder from Phase 1 stays in place,
   so the next run starts from it.
3. **Send the first message and end your turn.** It follows *The first message* in
   `<skill>/SKILL.md`: the sign-in link if one was needed, then one line saying Hostinger is set up
   and asking the user to restart the tool (the route says how) and paste the same prompt again so the
   build continues from there. This is a pause, not a run ending: no final report and no build report.
4. **On the next run** the tools are loaded, so connect skips registration and check-state resumes the
   domain's workspace.

If a tool loads new servers without a restart (VS Code), use them right away and skip steps 3–4.

**Every registration and every command that starts the MCP server goes through the launcher**
(`~/.hostinger/mcp/launch.sh` and `launch.mjs`, which the bootstrap writes): never `npx` directly, with or without
`--prefix`. The tool starts the server, and you run commands, in the user's project, often a cloned
repository or template. npx run there puts the project's `node_modules/.bin` first on PATH and reads
its `.npmrc`, so whoever wrote the project runs their own `node` with the user's Hostinger sign-in.
The launcher runs npx from the home folder instead. A registration runs exactly the bootstrap's
`launcher` event, never a bare `node`: a version manager (asdf, mise) picks the Node that the project's
own `.tool-versions` names. On macOS and Linux the event is `/bin/sh` with `launch.sh`, which finds
Node only after moving to the home folder, so Node upgrades don't break it; on Windows it is the
absolute path of `node.exe` with `launch.mjs`. Replace `<command>` and `<launcher>` with that event's
`command` and `args[0]`, in shell commands and in JSON or TOML configs alike, and never leave a
placeholder in place. In JSON and TOML configs, double every backslash of a Windows path
(`C:\\Program Files\\nodejs\\node.exe`); a single one is an escape there (`\n` in `\nodejs` becomes a
newline). Commands you run yourself start in the home folder
(`cd "$HOME" && node …`) for the same reason.

**An existing Hostinger registration is "already registered" only when it runs exactly the
bootstrap's `launcher` event** (same `command`, `args[0]` the launcher, plus `hostinger-ecommerce-mcp`
for that server). Before you trust one (both groups present, or a name the tool lists), check its
command (Claude Code: `claude mcp get <name>`; otherwise the tool's MCP config). Anything else, such as
`npx`, a bare `node` or `hostinger-api-mcp`, or any other command or path than the event's:
remove it and register it again through the launcher, then follow *register, restart, resume*.

| Tool        | Route                           |
|-------------|---------------------------------|
| Claude Code | `connect/tools/claude-code.md`  |
| Codex       | `connect/tools/codex.md`        |
| Cursor      | `connect/tools/cursor.md`       |
| VS Code     | `connect/tools/vscode.md`       |
| Antigravity | `connect/tools/antigravity.md`  |
| Devin       | `connect/tools/devin.md`        |

If the user's tool isn't listed yet, connect it the generic way: register both Hostinger MCP servers
in that tool's MCP config (command `<command>`, args `<launcher>` as above), then follow *register, restart, resume*.

### The skills come from Phase 1 only

The tool routes don't download the skills: Phase 1 already found or installed `<skill>`. The bundle
ships a `<skill>/VERSION` stamp (`version=<semver>` on line 1, then `commit` and `built`); carry the
version into `connect.json` (Phase 3) so the build report records which skills ran.

## Phase 3 - Write `connect.json`

Once the tool is connected, write `~/.hostinger/<domain>/connect.json` (create the folder if it is
missing) in exactly this shape:

```json
{ "tool": "claude-code", "mcp": "hostinger-api-mcp 3.8.0", "skills": "3.9.0", "auth": "oauth_cached",
  "order_id": null, "plan": null, "connected_at": "2026-10-28T10:46:12Z" }
```

- `tool`: the `<tool>` from the Phase 2 route (`claude-code`, `codex`, `cursor`, `vscode`,
  `antigravity`, `devin`, or a short lowercase name for an unlisted tool), the same value later
  passed to `run-start --tool`.
- `mcp`: one string, `hostinger-api-mcp <version>`, with the `version` from the `mcp_ok` event.
  Never an object.
- `skills`: the `version=` value from the `<skill>/VERSION` stamp you just pulled — the skills bundle
  version this run used. `"unknown"` if the stamp is absent (an old bundle predating the stamp).
- `auth`: the `method` from the `logged_in` event (`api_token`, `oauth_cached` or `oauth`).
- `order_id`, `plan`: the active hosting plan's order id and name when you looked them up, else `null`.
- `connected_at`: the current time in UTC, ISO 8601 to the second.

Extra keys are allowed, but keep these seven as above: the build report reads `tool`, `mcp` and `skills`.

## Phase 4 - Continue to Headless Hosting steps

Once everything is verified and you have the Hostinger MCP Server and the skills, tell the user in
one line that you're connected to Hostinger, as *The first message* in `<skill>/SKILL.md` describes.
Then go back to `<skill>/SKILL.md` and continue with check-state without waiting for a reply.


## Reference Sources

- https://mcpservers.org/servers/hostinger/api-mcp-server
- https://www.hostinger.com/connector
