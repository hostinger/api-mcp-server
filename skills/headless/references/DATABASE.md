# Database and runtime — MySQL hosts, env vars, and what to poll

Use this when the app needs MySQL, or when a deploy "succeeded" but the app cannot reach its database. Everything here uses the **hosting** MCP tools; Agency Plan differences are at the end.

## 1. Create the database

1. `hosting_createAccountDatabaseV1` on the site's `username` with a database name, a user and a password you generate — name and user are prefixed with the account username automatically.
2. Read the full, prefixed `name` and `user` back from `hosting_listAccountDatabasesV1`; every other database tool wants the full name.
3. Do not print the password to the user once it is stored, and never commit it.

## 2. Which host the app connects to

| Where the code runs | Host | Port | Why |
| --- | --- | --- | --- |
| PHP on the website | `localhost` or `127.0.0.1` | 3306 | `localhost` uses the MySQL socket; both are granted |
| Node.js on the website | `127.0.0.1` | 3306 | `localhost` may resolve to IPv6 `::1`, and not every database user has that grant |
| Outside Hostinger (a laptop, another server) | the `host` from `hosting_listAccountDatabasesV1` (`srvNNNN.hstgr.io`) | 3306 | needs `hosting_createDatabaseRemoteConnectionV1` for that client's IP first — never `%`, it opens the database to every address on the internet |

Do not put the remote `host` into the deployed app — it has no grant for connections that come from the server itself.

## 3. Hand credentials to the app

- **Node.js:** environment variables via `hosting_replaceNode_jsEnvironmentVariablesV1`. Conventional keys: `DB_HOST=127.0.0.1`, `DB_PORT=3306`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, plus `DATABASE_URL=mysql://USER:PASSWORD@127.0.0.1:3306/NAME` for ORMs that want one string — URL-encode `USER` and `PASSWORD` there (`encodeURIComponent`), or a password containing `@`, `:`, `/` or `#` breaks the URL. The call is a **full replace**: list the current keys with `hosting_listNode_jsEnvironmentVariablesV1` (values come back masked as `********` — never copy those), then send the complete set with real values. Saving restarts the process; frameworks that bake variables into the build (Next.js, `NEXT_PUBLIC_*`) need a new `hosting_startNode_jsBuildV1` afterwards.
- **PHP:** a config file on the server that the app reads (its own `config.php`, WordPress's `wp-config.php`). Ship it with the deploy, keep it out of git.
- **Never** in client-side JavaScript, in a committed `.env`, or in chat replies.

## 4. What is asynchronous, and what to poll

| You called | Poll this until | Typical wait |
| --- | --- | --- |
| `hosting_createWebsiteV1` | `hosting_listWebsitesV1` lists the domain | up to a few minutes |
| `hosting_deployJsApplication` | `hosting_listJsDeployments` shows the build finished | minutes |
| `hosting_startNode_jsBuildV1` | `hosting_getNode_jsBuildDetailsV1` state is `completed` or `failed` | minutes |
| `hosting_installWordPressV1`, plugin/theme/core jobs | `hosting_listWordPressInstallationsV1` lists the install | 1–2 minutes |
| `hosting_repairDatabaseV1`, `hosting_deleteWebsiteV1` | nothing to poll — runs in the background | minutes |
| `agency-hosting_createANewWebsiteV1` | `agency-hosting_getWebsiteSetupStatusV1` with `setup_uuid` is `completed` | minutes |

Poll with backoff (a few seconds, then tens of seconds). A queued response is not a failure, and re-sending the write does not speed it up.

## 5. When the app is up but broken

- Build failed: `hosting_getNodeJSBuildLogsV1` for the raw log, `hosting_analyseFailedNode_jsBuildV1` for a diagnosis.
- Build passed, app errors: `hosting_getNode_jsRuntimeLogsV1` with a `period` such as `1h`; entries before `last_deployed_at` belong to the previous deploy.
- `Access denied for user 'x'@'::1'`: the app used `localhost` from Node.js — set `DB_HOST` to `127.0.0.1`.
- PHP limits (memory, upload size): `hosting_getPHPDetailsV1`, then `hosting_updatePHPOptionsV1`.

## Agency Plan websites (`agency-hosting_*`)

`agency-hosting_createWebsiteDatabaseV1` creates the database and its single user; the user is granted on `localhost`, so the PHP app connects to `localhost`. Deploys are synchronous there — `agency-hosting_deployPhpApplication` returns when the site is live. Other jobs (SSL, backups) show up in `agency-hosting_listWebsiteProcessesV1`.
