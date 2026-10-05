# hostinger-api-mcp

Model Context Protocol (MCP) server for Hostinger API.

## Quick start: Hosted remote server

If you don't want to install or run anything locally, connect directly to Hostinger's hosted MCP server:

```
https://mcp.hostinger.com
```

### Claude Code

```bash
claude mcp add --transport http hostinger https://mcp.hostinger.com
```

This opens a browser window to authorize via OAuth. Once approved, the operations below are reachable through `execute` in your session.

### Other MCP-compatible clients

Add `https://mcp.hostinger.com` as a remote Streamable HTTP MCP server in your client's configuration and complete the OAuth prompt when it appears. Refer to your client's docs for how it exposes "add remote MCP server" / "custom connector" settings.

## Prerequisites
- Node.js version 24 or higher

If you don't have Node.js installed, you can download it from the [official website](https://nodejs.org/en/download/).
Alternatively, you can use a package manager like [Homebrew](https://brew.sh/) (for macOS) or [Chocolatey](https://chocolatey.org/) (for Windows) to install Node.js.

We recommend using [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm) to install and manage installed Node.js versions.
After installing NVM, you can install Node.js with the following command:
```bash
nvm install v24
nvm use v24
```

## Installation

To install the MCP server, run one of the following command, depending on your package manager:

```bash
# Install globally from npm
npm install -g @hostinger/mcp

# Or with yarn
yarn global add @hostinger/mcp

# Or with pnpm
pnpm add -g @hostinger/mcp
```

## Update

To update the MCP server to the latest version, use one of the following commands, depending on your package manager:

```bash
# Update globally from npm
npm update -g @hostinger/mcp

# Or with yarn
yarn global upgrade @hostinger/mcp

# Or with pnpm
pnpm update -g @hostinger/mcp
```

## Binaries

This package installs the following MCP server commands:

- `hostinger-api-mcp` — unified server over every operation (407 total)
- `hostinger-agency-hosting-mcp` — 42 operations for agency-hosting
- `hostinger-billing-mcp` — 9 operations for billing
- `hostinger-dns-mcp` — 8 operations for dns
- `hostinger-domains-mcp` — 42 operations for domains
- `hostinger-ecommerce-mcp` — 29 operations for ecommerce
- `hostinger-horizons-mcp` — 6 operations for horizons
- `hostinger-hosting-mcp` — 79 operations for hosting
- `hostinger-mail-mcp` — 38 operations for mail
- `hostinger-reach-mcp` — 52 operations for reach
- `hostinger-vps-mcp` — 64 operations for vps
- `hostinger-wordpress-mcp` — 38 operations for wordpress

Every binary exposes the same three tools; a scoped binary only searches and executes its own group's operations. `hostinger-api-mcp` remains the backwards-compatible default.

## Configuration

The following environment variables can be configured when running the server:
- `DEBUG`: Enable debug logging (true/false) (default: false)
- `HOSTINGER_API_TOKEN`: Your API token, which will be sent in the `Authorization` header. When set, OAuth is bypassed entirely.
- `API_TOKEN`: Deprecated alias for `HOSTINGER_API_TOKEN`. Will be removed in a future version — prefer `HOSTINGER_API_TOKEN`.
- `OAUTH_ISSUER`: OAuth server base URL (default: `https://auth.hostinger.com`). Only used when `HOSTINGER_API_TOKEN` is not set.

## Authentication

The server supports two authentication methods:

### API Token (recommended for CI/scripts)

Set `HOSTINGER_API_TOKEN` in the environment or `.env` file. When present it always takes precedence — no OAuth code runs.

### OAuth 2.0 with PKCE (interactive sign-in)

When `HOSTINGER_API_TOKEN` is not set and the server runs in stdio mode, OAuth 2.0 with PKCE is used automatically on the first authenticated tool call:

1. A dynamic OAuth client is registered with the issuer (RFC 7591) — once per machine.
2. A browser window opens to the authorization page.
3. After sign-in, the server captures the redirect on a local ephemeral port, exchanges the code for tokens, and stores them.
4. Subsequent calls reuse the stored access token; expired tokens are refreshed automatically. If a refresh token is revoked, the browser flow is re-launched.

Credentials are stored at:
- macOS / Linux: `~/.config/hostinger-mcp/credentials.json` (mode 0600)
- Windows: `%APPDATA%\hostinger-mcp\credentials.json`

Credentials are shared across all Hostinger MCP binaries (`hostinger-api-mcp`, `hostinger-vps-mcp`, etc.).

**Manual commands:**

```bash
# Run the OAuth sign-in flow immediately (don't wait for the first tool call)
hostinger-api-mcp --login

# Revoke stored credentials
hostinger-api-mcp --logout
```

**HTTP transport note:** OAuth sign-in is not supported in `--http` mode. Set `HOSTINGER_API_TOKEN` before using `--http`.

## Usage

### JSON configuration for Claude, Cursor, etc.

```json
{
    "mcpServers": {
        "hostinger-api": {
            "command": "hostinger-api-mcp",
            "env": {
                "DEBUG": "false",
                "HOSTINGER_API_TOKEN": "YOUR API TOKEN"
            }
        }
    }
}
```

### Transport Options

The MCP server supports two transport modes:

#### Standard I/O Transport

The server can use standard input / output (stdio) transport (default). This provides local streaming:

#### Streamable HTTP Transport

The server can use HTTP streaming transport. This provides bidirectional streaming over HTTP:

```bash
# Default HTTP transport on localhost:8100
hostinger-api-mcp --http

# Specify custom host and port
hostinger-api-mcp --http --host 0.0.0.0 --port 8150
```

#### Command Line Options

```
Options:
  --http           Use HTTP streaming transport (requires HOSTINGER_API_TOKEN env var)
  --stdio          Use Server-Sent Events transport (default)
  --host {host}    Hostname or IP address to listen on (default: 127.0.0.1)
  --port {port}    Port to bind to (default: 8100)
  --login          Run OAuth sign-in flow and exit
  --logout         Revoke stored OAuth credentials and exit
  --help           Show help message
```

### Using as an MCP Tool Provider

This server implements the Model Context Protocol (MCP) and can be used with any MCP-compatible consumer.

Example of connecting to this server using HTTP streaming transport:

```javascript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

// Create HTTP transport
const transport = new StreamableHTTPClientTransport({
  url: "http://localhost:8100/",
  headers: {
    "Authorization": `Bearer ${process.env.HOSTINGER_API_TOKEN}`
  }
});

// Connect to the MCP server
const client = new Client({
  name: "my-client",
  version: "1.0.0"
}, {
  capabilities: {}
});

await client.connect(transport);

// List available tools
const { tools } = await client.listTools();
console.log("Available tools:", tools);

// Execute an operation
const result = await client.callTool({
  name: "execute",
  arguments: { operation: "billing_catalog_list", params: { category: "DOMAIN" } }
});
console.log("Tool result:", result);
```

## Tools

Every server exposes three tools:

- `search` — find operations by keyword; returns each match with its `inputSchema`.
- `execute` — run one operation: `{ "operation": "<name>", "params": { ... } }`.
- `multi-execute` — run up to 20 operations in order, stopping at the first failure. A params value that is exactly `"$steps.<i>.<path>"` is replaced by that value from an earlier step's result.

## Operations

The operations reachable through `execute`, by binary:

### `hostinger-agency-hosting-mcp`

#### agency-hosting_deploy-node-static-website

Deploy a node-static Agency Plan (h5g) website from an archive file. WARNING: this overwrites the website's existing contents and cannot be undone — always confirm with the user before proceeding. Use this for Agency Plan websites of type node-static (a Node.js-built static site that requires a build step or a plain simple static site). The tool resolves the website from its domain, uploads the archive to the website's file browser over TUS, and triggers the build-assets process which builds the site and deploys the result to public_html. This operation is synchronous: the build and deployment complete before the tool returns, so the website is live as soon as the tool finishes successfully — there is no separate asynchronous build to wait for or poll. Upload credentials are generated and used internally — do not call a separate upload-url endpoint or upload the archive yourself, this tool does it end-to-end. For plain PHP applications that should be extracted as-is, use agency-hosting_deploy-php-application instead. The website UID is automatically resolved from the domain.

- **Method**: `custom`
- **Path**: `custom`

#### agency-hosting_deploy-php-application

Deploy a PHP (or other non-build) Agency Plan (h5g) website from an archive file. WARNING: this overwrites the website's existing contents and cannot be undone — always confirm with the user before proceeding. Use this for Agency Plan websites where the archive contents should be extracted and served as-is with no build step (e.g., PHP applications). The tool resolves the website from its domain, uploads the archive to the website's file browser over TUS, and triggers the import-archive process which overwrites the website contents with the archive contents. This operation is synchronous: the archive is extracted and deployed before the tool returns, so the website is live as soon as the tool finishes successfully — there is no separate asynchronous build to wait for or poll. Upload credentials are generated and used internally — do not call a separate upload-url endpoint or upload the archive yourself, this tool does it end-to-end. For node-static websites that require a build step, use agency-hosting_deploy-node-static-website instead. The website UID is automatically resolved from the domain.

- **Method**: `custom`
- **Path**: `custom`

#### agency-hosting_datacenters_list

Lists the datacenters available for provisioning a new website on the given Agency Plan
hosting order.

Each datacenter includes a `pinger_url` you can ping from the client to measure round-trip
latency; comparing the results across datacenters lets you pick the nearest one (lowest
ping) before choosing its `code` as the `datacenter_code` when creating a website setup.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/orders/{order_id}/datacenters`

#### agency-hosting_domains_change-website

Changes the primary domain for an Agency Plan website.

Provide the current domain in the path and the new domain in the request body.
Set domain to null to revert to the temporary domain.

- **Method**: `PUT`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/domains/{from_domain}`

#### agency-hosting_domains_link-to-website

Links a domain to the specified Agency Plan website so it can serve traffic for that domain.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/domains`

#### agency-hosting_domains_list

Returns a paginated list of domains associated with Agency Plan websites accessible to the authenticated client.

Use the website_uuids filter to narrow results to specific websites.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/domains`

#### agency-hosting_domains_unlink-from-website

Unlinks a domain from the specified Agency Plan website.

The website stops serving traffic on this domain immediately.

Website files and database are preserved, and any other linked domains remain accessible.

If this is the only domain on the website, unlinking leaves the website without an accessible domain.

- **Method**: `DELETE`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/domains/{domain}`

#### agency-hosting_files_generate-upload-url

Generate a file browser upload URL with authentication credentials for uploading files
to an Agency Plan website's file storage.

Returns `url`, `auth_key` and `rest_auth_key`. Use these to upload a file to the
website's file storage via the TUS resumable upload protocol (TUS 1.0.0). Send
`X-Auth: {auth_key}` and `X-Auth-Rest: {rest_auth_key}` headers on every request below.

1. Create the upload: `POST` to `{url}/{relative_file_path}?override=true` with headers
   `upload-length: {file size in bytes}` and `upload-offset: 0`. Expect `201 Created`.
2. Upload the file: send the file bytes to the same location (any TUS 1.0.0 client, or
   `PATCH` requests with an `upload-offset` header tracking progress) until complete.

`relative_file_path` is the destination path inside the website's file storage, e.g.
`app.zip`.

Instead of a TUS client, plain `curl` also works:
```
FILE=app.zip
SIZE=$(stat -f%z "$FILE")   # stat -c%s on Linux

curl -i -X POST "{url}/${FILE}?override=true" \
  -H "X-Auth: {auth_key}" \
  -H "X-Auth-Rest: {rest_auth_key}" \
  -H "Tus-Resumable: 1.0.0" \
  -H "Upload-Length: ${SIZE}" \
  -H "Upload-Offset: 0"
# -> 201 Created

curl -i -X PATCH "{url}/${FILE}?override=true" \
  -H "X-Auth: {auth_key}" \
  -H "X-Auth-Rest: {rest_auth_key}" \
  -H "Tus-Resumable: 1.0.0" \
  -H "Content-Type: application/offset+octet-stream" \
  -H "Upload-Offset: 0" \
  --data-binary "@${FILE}"
# -> 204 No Content, Upload-Offset response header equals SIZE when done
```

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/files/upload-urls`

#### agency-hosting_files_import-website-from-archive

Imports an Agency Plan website from an already-uploaded archive.

Upload the archive to the website's root directory via file browser first, then provide its
filename in this request. Website contents are overwritten by the archive contents. Supported
archive types: .zip, .tar, .tar.gz, .tgz.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/files/import-archive`

#### agency-hosting_metrics_list-plan-order-disk-usage

Returns aggregated disk and inode usage for the Agency Plan order over the
selected time frame, plus the plan quotas. Figures cover the whole order
account. Values may be up to one hour stale. CPU, memory, and process usage
are on the resource-usage-metrics endpoint.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/orders/{order_id}/disk-usage-metrics`

#### agency-hosting_orders_list

Returns a paginated list of Agency Plan orders accessible to the authenticated client.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/orders`

#### agency-hosting_metrics_list-order-resource-usage

Returns aggregated CPU, memory, and process usage for the Agency Plan order
over the selected time frame, plus the plan quotas and a per-website
breakdown. Each website is identified by uid. Suspended and deleted websites
are excluded from both the order totals and the per-website breakdown.
Values may be up to one hour stale. Disk and inode usage are on the
disk-usage-metrics endpoint.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/orders/{order_id}/resource-usage-metrics`

#### agency-hosting_php_list-extensions-for-website

Lists every PHP extension available to an Agency Plan website and whether it is currently enabled.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/php-settings/extensions`

#### agency-hosting_php_replace-website-extensions

Replaces the set of PHP extensions enabled on an Agency Plan website with the ones provided. Any toggleable extension not in the request is disabled, so call the extensions endpoint first and send the full desired set. Extensions compiled into PHP, reported with the "built-in" state, are always active and are unaffected.

- **Method**: `PUT`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/php-settings/extensions`

#### agency-hosting_php_list-options-for-website

Lists the php.ini directives that can be configured for an Agency Plan website, each with its default, the value currently in effect, and the values it accepts.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/php-settings/options`

#### agency-hosting_php_replace-website-options

Replaces the custom php.ini values on an Agency Plan website with the ones provided. Any option not in the request is reset to its default, so call the options endpoint first and send the full desired set. Sending an empty array resets every option to its default.

- **Method**: `PUT`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/php-settings/options`

#### agency-hosting_php_list-versions-for-order

Lists the PHP versions available to websites created under an Agency Plan order, determined by the server the order is hosted on. Use this before creating a website; for a website that already exists, call the website-scoped versions endpoint instead.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/orders/{order_id}/websites/php-settings/versions`

#### agency-hosting_php_list-versions-for-website

Lists the PHP versions an Agency Plan website can be switched to. The version the website is currently running is returned as settings.php.version by the website details endpoint.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/php-settings/versions`

#### agency-hosting_php_update-website-version

Switches an Agency Plan website to a different PHP version. Call the available versions endpoint first to see which versions can be selected. The website restarts on the new version, so requests served during the switch may fail and code that is incompatible with the target version will break.

- **Method**: `PATCH`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/php-settings/version`

#### agency-hosting_website-setups_create

Provisions a new website on one of your Agency Plan hosting orders.

Choose the datacenter, stack (`flavor`), and PHP version for the site. Optionally attach
your own `domain` — omit it, set it to `null`, or leave it unavailable and a free
`*.hostingersite.com` subdomain is generated instead — and/or install WordPress by
supplying the `wordpress` details (admin account, site title, and language).

Common setups:
- **Plain PHP site**: `flavor` set to `php-fpm`, with `settings.php.version`; omit
  `wordpress` and `type`.
- **WordPress site**: `flavor` set to the desired WordPress version (e.g. `wp-7.0`), plus
  the `wordpress` block (admin account, title, language).
- **Static/Node.js frontend app**: `flavor` set to `php-fpm` and `type` set to
  `node-static`.

Provisioning runs in the background, so the response returns immediately with a setup UUID
that identifies the job. The new website becomes reachable once provisioning finishes.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/orders/{order_id}/websites/setups`

#### agency-hosting_website-setups_status

Returns the current status of an Agency Plan website setup started via the setups
endpoint.

Poll this endpoint using the `setup_uuid` returned from the provisioning request until
`status` becomes `completed`, at which point `website_uid` identifies the new website.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/orders/{order_id}/websites/setups/{setup_uuid}`

#### agency-hosting_ssl_reinstall-website

Replaces the Let's Encrypt certificate of the domain: the current platform certificate, when
one is recorded, is revoked and removed, then a new setup starts in the background. Returns at
once; `Get website SSL status` reports `installing` while it runs, then `active` or `failed`.

Returns 422 for free subdomains, when a certificate process is recorded for the domain (a
failed setup counts until it is cleaned up), or when the domain hit its limit of three setups
per seven days. Returns 429 when the same domain was requested less than a minute ago, and 403
when the website is suspended or locked, and 404 when the website or the domain does not exist.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/domains/{domain}/ssl/reinstall`

#### agency-hosting_ssl_install-website

Starts a Let's Encrypt certificate setup for the domain and returns at once; the setup runs in
the background. `Get website SSL status` reports `installing` while it runs, then `active` or
`failed`; the `ssl_setup` entry of `List website processes` shows the same progress.

Returns 422 when the domain already has a platform certificate that is not expired, when a
certificate process is recorded for the domain (a failed setup counts until it is cleaned up),
or when the domain hit its limit of three setups per seven days. Returns 429 when the same
domain was requested less than a minute ago, 403 when the website is suspended or locked, and
404 when the website or the domain does not exist.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/domains/{domain}/ssl/setup`

#### agency-hosting_ssl_website-status

Returns the SSL state of one domain of an Agency Plan website: the certificate `status`,
whether the certificate was uploaded by the customer, and when it stops being valid.

`installing` means a certificate setup is running or retrying; the `ssl_setup` entry of
`List website processes` shows the same progress. `active` means a valid certificate is in
place: uploaded by the customer, issued by the platform, or a lifetime certificate bought for
the domain. `failed` means the last setup gave up and no valid certificate is in place.
`expired` means the certificate has run out. `not_installed` means the domain has no
certificate and no setup process. Returns 404 when the website or the domain does not exist.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/domains/{domain}/ssl/status`

#### agency-hosting_ssl_uninstall-website

Removes the platform-issued Let's Encrypt certificate of the domain: the certificate is revoked
and deleted before the response, so the domain is no longer served with a platform certificate
until a new setup completes. Also succeeds when the domain has no platform certificate to
remove. Uploaded (custom) certificates are not affected.

Returns 422 when a certificate process is recorded for the domain (a failed setup counts until
it is cleaned up), 429 when the same domain was requested less than a minute ago, and 403 when
the website is suspended or locked, and 404 when the website or the domain does not exist.

- **Method**: `DELETE`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/domains/{domain}/ssl`

#### agency-hosting_websites_build-nodejs-assets

Builds and deploys a Node.js application for an Agency Plan website from an already-uploaded archive.

Upload the archive to file browser first, then provide its relative path from document root in this request.
Website contents are overwritten by the build result, which is deployed to public_html.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/build-assets`

#### agency-hosting_cache_clear-website

Clears cache for all domains associated with an Agency Plan website, including its preview domain.

This operation clears all cache types for the website.

- **Method**: `DELETE`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/cache`

#### agency-hosting_cron-jobs_list-website

Returns a paginated list of cron jobs configured for an Agency Plan website.

Each entry includes the schedule expression and the command executed on that schedule.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/cron-jobs`

#### agency-hosting_cron-jobs_create-website

Creates a cron job for an Agency Plan website from a schedule expression and a command.

Returns the created cron job, including its uuid, which is required to delete the cron job.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/cron-jobs`

#### agency-hosting_cron-jobs_delete-website

Permanently deletes the cron job identified by its uuid from an Agency Plan website.

The operation is idempotent: deleting a cron job that does not exist succeeds without error.

- **Method**: `DELETE`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/cron-jobs/{uuid}`

#### agency-hosting_databases_list-website

Returns a paginated list of MySQL databases created for an Agency Plan website.

Each entry includes the database's non-system users.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/databases`

#### agency-hosting_databases_create-website

Creates a MySQL database with a dedicated user for an Agency Plan website.

The database name, username, and password must all be provided by the caller.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/databases`

#### agency-hosting_databases_delete-website

Permanently deletes a MySQL database and all its data from an Agency Plan website, including its users.

The operation is idempotent: deleting a database that does not exist succeeds without error.

- **Method**: `DELETE`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/databases/{database_name}`

#### agency-hosting_databases_create-website-user

Creates a user for an existing database on an Agency Plan website.

Each database supports a single non-system user; creating a user for a database that already has one fails.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/databases/{database_name}/users`

#### agency-hosting_databases_delete-website-user

Permanently deletes a database user from an Agency Plan website database, revoking all access it had.

The operation is idempotent: deleting a user that does not exist succeeds without error.

- **Method**: `DELETE`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/databases/{database_name}/users/{database_user_name}`

#### agency-hosting_websites_get

Retrieves detailed information about a specific Agency Plan website, including configuration,
status, metadata, hosting plan details, and resource quotas.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}`

#### agency-hosting_websites_delete

Permanently deletes an Agency Plan website. Deletion is processed asynchronously: the
website is immediately transitioned to a deleting state and the underlying server
resources are removed in the background.

- **Method**: `DELETE`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}`

#### agency-hosting_websites_list-plan

Retrieve a paginated list of Agency Plan websites (H5G, Builder, and Horizons) accessible to
the authenticated client.

This endpoint returns websites from your hosting accounts as well as
websites from other client hosting accounts that have shared access
with you.

The response shape differs per platform — see the `platform` field on each item.

Use `website_types` to list only websites of a given detected type, e.g. only
WordPress websites (`website_types=wordpress`) or only Node.js websites
(`website_types=nodejs`). Combine with `order_ids`, `states`, or `domain` for more
targeted results.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites`

#### agency-hosting_websites_list-processes

Lists active and recently completed asynchronous processes for an Agency Plan website.

Each process has a unique ID (for tracking), a type, and a status (running, completed, failed).
Poll this endpoint after initiating async operations (SSL setup, backups, cloning) to track progress.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/processes`

#### agency-hosting_wordpress_change-version

Changes the installed WordPress core version on an Agency Plan website to one of the versions available for installation.

- **Method**: `PATCH`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/wordpress/settings/version`

#### agency-hosting_wordpress_settings

Returns the current WordPress settings for an Agency Plan website: installed core version,
LiteSpeed Cache plugin status, object cache status, and maintenance mode status.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/wordpress/settings`

#### agency-hosting_wordpress_list-versions

Lists the WordPress core versions available for installation on an Agency Plan website.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/wordpress/settings/versions`

### `hostinger-billing-mcp`

#### billing_catalog_list

Retrieve catalog items available for order.

Prices in catalog items is displayed as cents (without floating point),
e.g: float `17.99` is displayed as integer `1799`.

Use this endpoint to view available services and pricing before placing orders.

- **Method**: `GET`
- **Path**: `/api/billing/v1/catalog`

#### billing_orders_create-purchase

Create a purchase order for any Hostinger product.

This unified endpoint places an order for one or more catalog items and
works across all Hostinger products, leveraging the existing billing
infrastructure. Use the [catalog endpoint](#tag/billing-catalog) to look
up the `item_id` values available for purchase.

If no payment method is provided, your default payment method will be used automatically.

If the response is `202 Accepted`, the payment is still being processed and the order will
complete asynchronously once the payment is confirmed.

This endpoint only places the order. Product-specific provisioning
(e.g. VPS setup or domain registration) is not performed here — once the
order completes, use the relevant product endpoints or
[hPanel](https://hpanel.hostinger.com/) to finalize setup.

Use this endpoint to purchase any product available in the catalog.

- **Method**: `POST`
- **Path**: `/api/billing/v1/orders`

#### billing_payment-methods_set-default

Set the default payment method for your account.

Use this endpoint to configure the primary payment method for future orders.

- **Method**: `POST`
- **Path**: `/api/billing/v1/payment-methods/{paymentMethodId}`

#### billing_payment-methods_delete

Delete a payment method from your account.

Use this endpoint to remove unused payment methods from user accounts.

- **Method**: `DELETE`
- **Path**: `/api/billing/v1/payment-methods/{paymentMethodId}`

#### billing_payment-methods_list

Retrieve available payment methods that can be used for placing new orders.

If you want to add new payment method,
please use [hPanel](https://hpanel.hostinger.com/billing/payment-methods).

Use this endpoint to view available payment options before creating orders.

- **Method**: `GET`
- **Path**: `/api/billing/v1/payment-methods`

#### billing_subscriptions_list

Retrieve a list of all subscriptions associated with your account.

Use this endpoint to monitor active services and billing status.

- **Method**: `GET`
- **Path**: `/api/billing/v1/subscriptions`

#### billing_subscriptions_disable-auto-renewal

Disable auto-renewal for a subscription.

Use this endpoint when disable auto-renewal for a subscription.

- **Method**: `DELETE`
- **Path**: `/api/billing/v1/subscriptions/{subscriptionId}/auto-renewal/disable`

#### billing_subscriptions_enable-auto-renewal

Enable auto-renewal for a subscription.

Use this endpoint when enable auto-renewal for a subscription.

- **Method**: `PATCH`
- **Path**: `/api/billing/v1/subscriptions/{subscriptionId}/auto-renewal/enable`

#### billing_subscriptions_renew

Create a renewal order for an existing Hostinger subscription.

This endpoint places a renewal order for a single subscription, leveraging
the existing billing infrastructure. Use the
[subscriptions endpoint](#tag/billing-subscriptions) to look up the
`subscriptionId` values available for renewal.

If no payment method is provided, your default payment method will be used automatically.

If the response is `202 Accepted`, the payment is still being processed and the renewal will
complete asynchronously once the payment is confirmed.

Use this endpoint to renew any subscription available in your account.

- **Method**: `POST`
- **Path**: `/api/billing/v1/subscriptions/{subscriptionId}/renew`

### `hostinger-dns-mcp`

#### dns_snapshots_get

Retrieve particular DNS snapshot with contents of DNS zone records.

Use this endpoint to view historical DNS configurations for domains.

- **Method**: `GET`
- **Path**: `/api/dns/v1/snapshots/{domain}/{snapshotId}`

#### dns_snapshots_list

Retrieve DNS snapshots for a domain.

Use this endpoint to view available DNS backup points for restoration.

- **Method**: `GET`
- **Path**: `/api/dns/v1/snapshots/{domain}`

#### dns_snapshots_restore

Restore DNS zone to the selected snapshot.

Use this endpoint to revert domain DNS to a previous configuration.

- **Method**: `POST`
- **Path**: `/api/dns/v1/snapshots/{domain}/{snapshotId}/restore`

#### dns_records_list

Retrieve DNS zone records for a specific domain.

Use this endpoint to view current DNS configuration for domain management.

- **Method**: `GET`
- **Path**: `/api/dns/v1/zones/{domain}`

#### dns_records_update

Update DNS records for the selected domain.

Using `overwrite = true` will replace existing records with the provided ones. 
Otherwise existing records will be updated and new records will be added.

Use this endpoint to modify domain DNS configuration.

- **Method**: `PUT`
- **Path**: `/api/dns/v1/zones/{domain}`

#### dns_records_delete

Delete DNS records for the selected domain.

To filter which records to delete, add the `name` of the record and `type` to the filter. 
Multiple filters can be provided with single request.

If you have multiple records with the same name and type, and you want to delete only part of them,
refer to the `Update zone records` endpoint.

Use this endpoint to remove specific DNS records from domains.

- **Method**: `DELETE`
- **Path**: `/api/dns/v1/zones/{domain}`

#### dns_records_reset

Reset DNS zone to the default records.

Use this endpoint to restore domain DNS to original configuration.

- **Method**: `POST`
- **Path**: `/api/dns/v1/zones/{domain}/reset`

#### dns_records_validate

Validate DNS records prior to update for the selected domain.

If the validation is successful, the response will contain `200 Success` code.
If there is validation error, the response will fail with `422 Validation error` code.

Use this endpoint to verify DNS record validity before applying changes.

- **Method**: `POST`
- **Path**: `/api/dns/v1/zones/{domain}/validate`

### `hostinger-domains-mcp`

#### domains_verifications_direct

Retrieve a list of pending and completed domain verifications.

- **Method**: `GET`
- **Path**: `/api/v2/direct/verifications/active`

#### domains_availability_suggest-names-from-description

Suggest available domain names based on a free-text description of your project.

Suggestions are generated by an AI model, so they differ between calls.

Endpoint has rate limit of 90 requests per minute.

Use this endpoint to find a domain name when you only know what the website is about.

- **Method**: `POST`
- **Path**: `/api/domains/v1/availability/alternatives-from-description`

#### domains_availability_suggest-names-from

Suggest available domain names based on a domain name you already have in mind.

Suggestions are generated by an AI model, so they differ between calls.

Endpoint has rate limit of 90 requests per minute.

Use this endpoint when the domain you wanted is taken and you need close alternatives.

- **Method**: `POST`
- **Path**: `/api/domains/v1/availability/alternatives-from-domain`

#### domains_availability_check

Check availability of domain names across multiple TLDs.

Multiple TLDs can be checked at once.
If you want alternative domains with response, provide only one TLD and set `with_alternatives` to `true`.
TLDs should be provided without leading dot (e.g. `com`, `net`, `org`).

Endpoint has rate limit of 90 requests per minute.

Use this endpoint to verify domain availability before purchase.

- **Method**: `POST`
- **Path**: `/api/domains/v1/availability`

#### domains_forwarding_get

Retrieve domain forwarding data.

Use this endpoint to view current redirect configuration for domains.

- **Method**: `GET`
- **Path**: `/api/domains/v1/forwarding/{domain}`

#### domains_forwarding_update

Update domain forwarding configuration.

Use this endpoint to modify existing redirect configuration for domains.

- **Method**: `PUT`
- **Path**: `/api/domains/v1/forwarding/{domain}`

#### domains_forwarding_delete

Delete domain forwarding data.

Use this endpoint to remove redirect configuration from domains.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/forwarding/{domain}`

#### domains_forwarding_create

Create domain forwarding configuration.

Use this endpoint to set up domain redirects to other URLs.

- **Method**: `POST`
- **Path**: `/api/domains/v1/forwarding`

#### domains_whois_pending-irtp-verification

Retrieve a pending IRTP verification for a domain.

Both the old and new registrant must confirm it before the WHOIS change takes effect.

Use this endpoint to check the status of a WHOIS change awaiting registrant confirmation.

- **Method**: `GET`
- **Path**: `/api/domains/v1/irtp/{domain}`

#### domains_whois_cancel-pending-irtp-verification

Cancel a pending IRTP verification.

Use this endpoint to back out of a WHOIS change that is stuck waiting on registrant confirmation,
for example when the confirmation email cannot be received, without waiting out the 5-day expiry.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/irtp/{domain}`

#### domains_move_incoming

Retrieve the incoming move for a specified domain.

Returns 404 when no account is moving this domain to you.

Use this endpoint to check whether a domain addressed to you is still waiting to be accepted.

- **Method**: `GET`
- **Path**: `/api/domains/v1/move/incoming/{domain}`

#### domains_move_accept-incoming

Accept an incoming move for a specified domain.

The provided WHOIS profiles become the contacts of the domain, so they must belong
to your account and satisfy the requirements of the TLD. Only the contact types the
domain actually uses are applied, but all four profile IDs have to be provided.

The move has to still be waiting for your decision, already accepted moves
cannot be accepted again.

Accepting does not complete the move. A confirmation email is sent to the email address of
the new owner contact, and the domain changes hands only after the change is confirmed from it.
Until then the move stays in the `activating` status, which can be followed with the
[incoming move endpoint](#tag/domains-move).

Use this endpoint to take ownership of a domain offered to you.

- **Method**: `PUT`
- **Path**: `/api/domains/v1/move/incoming/{domain}`

#### domains_move_reject-incoming

Reject an incoming move for a specified domain.

The domain stays in the account which initiated the move.
Moves you have already accepted cannot be rejected anymore.

Use this endpoint to decline a domain you do not want to take over.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/move/incoming/{domain}`

#### domains_move_incoming-list

Retrieve all domains other Hostinger accounts are moving to your account.

Moves of every status are returned, including the ones which already completed.

Use this endpoint to find domains waiting for you to accept them.

- **Method**: `GET`
- **Path**: `/api/domains/v1/move/incoming`

#### domains_move_outgoing

Retrieve the outgoing move for a specified domain.

Returns 404 when the domain has no move in progress.

Use this endpoint to track the status of a move you have initiated for a single domain.

- **Method**: `GET`
- **Path**: `/api/domains/v1/move/outgoing/{domain}`

#### domains_move_start-outgoing

Initiate a move of a specified domain to another Hostinger account.

The receiving account has to already exist and accept the move before the domain changes hands.

The domain must be active. The subscription it belongs to is resolved automatically,
and the request is rejected with a 404 status code when the domain has no domain
subscription of its own.

Domains protected by premium protection require an additional verification step,
such requests are rejected with a 428 status code.

Use this endpoint to hand a domain over to another Hostinger user.

- **Method**: `POST`
- **Path**: `/api/domains/v1/move/outgoing/{domain}`

#### domains_move_cancel-outgoing

Cancel an outgoing move for a specified domain.

The move can only be cancelled while the receiving account has not accepted it yet.
The domain stays in your account.

Use this endpoint to withdraw a move you no longer want to complete.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/move/outgoing/{domain}`

#### domains_move_outgoing-list

Retrieve all domains you are moving to other Hostinger accounts.

Only moves which have not completed yet are returned.

Use this endpoint to track moves you have initiated and the accounts they are addressed to.

- **Method**: `GET`
- **Path**: `/api/domains/v1/move/outgoing`

#### domains_portfolio_authorization-code

Retrieve the authorization (EPP) code for a specified domain so it can be transferred
away from Hostinger to another registrar.

Requesting a new code invalidates any code retrieved previously.

Use this endpoint to obtain the code required to transfer a domain to another registrar.

- **Method**: `GET`
- **Path**: `/api/domains/v1/portfolio/{domain}/auth-code`

#### domains_portfolio_claim-free

Claim a free domain available on your account and register it.

Unlike purchasing a domain, this consumes a free domain you already have,
so no payment method is required.

A successful response means the domain is registered. If registration fails, login to
[hPanel](https://hpanel.hostinger.com/) and check domain registration status.

If no WHOIS information is provided, default contact information for that TLD will be used.
Before making request, ensure WHOIS information for desired TLD exists in your account.

Some TLDs require `additional_details` to be provided and these will be validated before claiming.

Requests which cannot be fulfilled are rejected with an error code in the response body,
for example `2037` when no free domain is available.

Use this endpoint to register a domain using a free domain from your account.

- **Method**: `POST`
- **Path**: `/api/domains/v1/portfolio/claim`

#### domains_portfolio_enable-lock

Enable domain lock for the domain.

When domain lock is enabled,
the domain cannot be transferred to another registrar without first disabling the lock.

Use this endpoint to secure domains against unauthorized transfers.

- **Method**: `PUT`
- **Path**: `/api/domains/v1/portfolio/{domain}/domain-lock`

#### domains_portfolio_disable-lock

Disable domain lock for the domain.

Domain lock needs to be disabled before transferring the domain to another registrar.

Use this endpoint to prepare domains for transfer to other registrars.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/portfolio/{domain}/domain-lock`

#### domains_portfolio_get

Retrieve detailed information for specified domain.

Use this endpoint to view comprehensive domain configuration and status.

- **Method**: `GET`
- **Path**: `/api/domains/v1/portfolio/{domain}`

#### domains_portfolio_list

Retrieve all domains associated with your account.

Use this endpoint to view user's domain portfolio.

- **Method**: `GET`
- **Path**: `/api/domains/v1/portfolio`

#### domains_portfolio_purchase

Purchase and register a new domain name.

If registration fails, login to [hPanel](https://hpanel.hostinger.com/) and check domain registration status.

If no payment method is provided, your default payment method will be used automatically.

If the response is `202 Accepted`, the payment is still being processed and the domain was
**not** registered. Once the order completes, register the domain from
[hPanel](https://hpanel.hostinger.com/).

If no WHOIS information is provided, default contact information for that TLD will be used.
Before making request, ensure WHOIS information for desired TLD exists in your account.

Some TLDs require `additional_details` to be provided and these will be validated before completing purchase.

Use this endpoint to register new domains for users.

- **Method**: `POST`
- **Path**: `/api/domains/v1/portfolio`

#### domains_portfolio_enable-privacy-protection

Enable privacy protection for the domain.

When privacy protection is enabled, domain owner's personal information is hidden from public WHOIS database.

Use this endpoint to protect domain owner's personal information from public view.

- **Method**: `PUT`
- **Path**: `/api/domains/v1/portfolio/{domain}/privacy-protection`

#### domains_portfolio_disable-privacy-protection

Disable privacy protection for the domain.

When privacy protection is disabled, domain owner's personal information is visible in public WHOIS database.

Use this endpoint to make domain owner's information publicly visible.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/portfolio/{domain}/privacy-protection`

#### domains_portfolio_renewal-information

Retrieve renewal information for a specified domain, including its status and current
expiration date.

Use this endpoint to build renewal automation and expiry monitoring for a single domain.

- **Method**: `GET`
- **Path**: `/api/domains/v1/portfolio/{domain}/renewal`

#### domains_portfolio_complete-setup

Register a domain you have already paid for but which has not been set up yet.

Use this endpoint when an order completed without registering the domain, for example when
`Purchase new domain` returned `202 Accepted` and the domain was added to your account without
being registered, or when an earlier setup attempt failed. No new order is placed and no payment
is taken: the subscription you already own is used, for the period you already paid for.

A domain is left awaiting setup when the details needed to register it were missing or invalid
as the order completed. Domains ordered elsewhere can be awaiting setup for the same reason.
Complete the missing information, then call this endpoint. If the order itself has not completed
yet, the domain is not on your account, wait until it appears in `Get domain list`.

If `domain_contacts` is omitted, the default WHOIS profile of that TLD is used for all four
roles. The profile must exist and be complete for the TLD, an incomplete profile is the most
common reason a domain is left awaiting setup. Create one with `Create WHOIS profile`.

Some TLDs require `additional_details`. These are validated before setup, so a missing or
invalid value is rejected without any registration being attempted.

The domain is set up with the default nameservers and without privacy protection. Use
`Update domain nameservers` and `Enable privacy protection` afterwards to change either.

A successful response means the setup request was accepted, not that the domain is already
registered. Poll `Get domain list` for the outcome, the domain appears in `Get domain details`
only once it is registered.

Use this endpoint to finish registering a domain that is awaiting setup on your account.

- **Method**: `POST`
- **Path**: `/api/domains/v1/portfolio/{domain}/setup`

#### domains_portfolio_update-nameservers

Set nameservers for a specified domain.

Be aware, that improper nameserver configuration can lead to the domain being unresolvable or unavailable.

Use this endpoint to configure custom DNS hosting for domains.

- **Method**: `PUT`
- **Path**: `/api/domains/v1/portfolio/{domain}/nameservers`

#### domains_transfer_claim-free

Claim a free domain transfer available on your account and start the transfer.

Unlike purchasing a transfer, this consumes a free domain transfer you already have,
so no payment method is required.

Before making request, unlock the domain at the current registrar and get its authorization
code. The transfer is validated first, so domains which cannot be transferred are rejected
before the free domain transfer is consumed.

A successful response means the transfer has been started. Completion depends on the current
registrar and can be followed with the [transfer list endpoint](#tag/domains-transfer).

If no WHOIS information is provided, default contact information for that TLD will be used.
Before making request, ensure WHOIS information for desired TLD exists in your account.

Requests which cannot be fulfilled are rejected with an error code in the response body.

Use this endpoint to transfer a domain using a free domain transfer from your account.

- **Method**: `POST`
- **Path**: `/api/domains/v1/transfers/claim`

#### domains_transfer_get

Retrieve the transfer for a specified domain.

Use this endpoint to track an incoming or outgoing registrar transfer and its status.

- **Method**: `GET`
- **Path**: `/api/domains/v1/transfers/{domain}`

#### domains_transfer_list

Retrieve all domain transfers in your portfolio.

Use this endpoint to monitor incoming and outgoing registrar transfers across your domains.

- **Method**: `GET`
- **Path**: `/api/domains/v1/transfers`

#### domains_transfer_start

Transfer a domain from another registrar to your account.

The transfer runs on a domain transfer service you have already purchased.

Before making request, unlock the domain at the current registrar and get its authorization
code.

A successful response means the transfer has been started. Completion depends on the current
registrar and can be followed with the [transfer list endpoint](#tag/domains-transfer).

If no WHOIS information is provided, default contact information for that TLD will be used.
Before making request, ensure WHOIS information for desired TLD exists in your account.

Use this endpoint to bring domains registered elsewhere into your account.

- **Method**: `POST`
- **Path**: `/api/domains/v1/transfers`

#### domains_whois_change-for

Change WHOIS contact profile for a domain.

Repoints the given contact roles to a new WHOIS profile and submits the change to the registry.
The profile currently assigned to those roles is resolved automatically;
the request fails if the given roles are not all on the same profile today.

Changing transfer sensitive fields on the owner contact starts an IRTP verification.

The change is processed asynchronously.

Use this endpoint to move a registered domain onto different contact information.

- **Method**: `PUT`
- **Path**: `/api/domains/v1/whois/change`

#### domains_whois_set-as-default

Set WHOIS contact profile as default.

The default profile is pre-selected for the TLD it belongs to when registering new domains.

Use this endpoint to avoid picking contact information for every registration.

- **Method**: `PUT`
- **Path**: `/api/domains/v1/whois/default/{whoisId}`

#### domains_whois_unset-default

Unset WHOIS contact profile as default.

The profile itself is kept, it is only no longer pre-selected for its TLD.

Use this endpoint to stop reusing contact information for new registrations.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/whois/default/{whoisId}`

#### domains_whois_get

Retrieve a WHOIS contact profile.

Use this endpoint to view domain registration contact information.

- **Method**: `GET`
- **Path**: `/api/domains/v1/whois/{whoisId}`

#### domains_whois_delete

Delete WHOIS contact profile.

Use this endpoint to remove unused contact profiles from account.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/whois/{whoisId}`

#### domains_whois_list

Retrieve WHOIS contact profiles.

Use this endpoint to view available contact profiles for domain registration.

- **Method**: `GET`
- **Path**: `/api/domains/v1/whois`

#### domains_whois_create

Create WHOIS contact profile.

Use this endpoint to add new contact information for domain registration.

- **Method**: `POST`
- **Path**: `/api/domains/v1/whois`

#### domains_whois_usage

Retrieve domain list where provided WHOIS contact profile is used.

Use this endpoint to view which domains use specific contact profiles.

- **Method**: `GET`
- **Path**: `/api/domains/v1/whois/{whoisId}/usage`

### `hostinger-ecommerce-mcp`

#### ecommerce_discounts_list

List a store's discounts. Filter by free text over code and name, or by disabled state.
Amounts for fixed discounts are integers in the smallest currency unit; percentage
discounts carry a whole-number value between 1 and 100.

- **Method**: `GET`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/discounts`

#### ecommerce_discounts_create

Create a discount for a store. Fixed discounts take an amount in the smallest currency
unit (e.g. $10 is 1000); percentage discounts take a whole-number value between 1 and 100.
Free-shipping discounts ignore value. Returns the created discount.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/discounts`

#### ecommerce_miscellaneous_custom-storefront-setup-instructions

Retrieve step-by-step setup instructions, formatted as Markdown, for connecting a custom sales
channel to your store and keeping your catalog, orders, shipping and payments in sync through
the Ecommerce API.

- **Method**: `GET`
- **Path**: `/api/ecommerce/v1/miscellaneous/custom-storefront-instructions`

#### ecommerce_orders_cancel

Cancel the order and optionally email the customer. Returns the updated order summary.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/orders/{order_id}/cancel`

#### ecommerce_orders_fulfil

Create a fulfilment for the order and attach tracking in one call. Omit items to fulfil
every remaining unfulfilled item. Returns the updated order summary.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/orders/{order_id}/fulfill`

#### ecommerce_orders_list-store

List a store's orders newest first as summaries. Filter by status, payment or fulfilment
status, customer email, order number or a free-text query. Amounts are in the smallest
currency unit. Retrieve a single order for its line items, addresses and fulfilments.

- **Method**: `GET`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/orders`

#### ecommerce_orders_retrieve

Retrieve one order in full: line items (each with the id the fulfil endpoint needs),
addresses, the totals breakdown and fulfilments with tracking. Amounts are in the
smallest currency unit.

- **Method**: `GET`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/orders/{order_id}`

#### ecommerce_payments_enable-manual-method

Enable a manual payment method so the store can accept orders without an online payment provider.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/payment-methods/manual`

#### ecommerce_payments_create-provider-connect-link

Create an onboarding link for connecting a payment gateway to the store. Returns the gateway
onboarding URL for the merchant to open and a deep-link into the store admin.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/payment-providers/{provider_id}/connect-link`

#### ecommerce_payments_list-store-providers

List a store's payment providers, split into providers already connected to the store and
gateways available to install. Never exposes gateway credentials, secrets, or configuration.

- **Method**: `GET`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/payment-providers`

#### ecommerce_products_create-image-upload-url

Returns a signed URL to upload a product image to (multipart/form-data POST). Then call the
attach-image endpoint with the returned object_name to scan and attach it to the product.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/products/{product_id}/images/upload-url`

#### ecommerce_products_delete

Delete a product and its variants from the store. A subscription product with active
subscribers is archived instead of deleted so its data stays available.

- **Method**: `DELETE`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/products/{product_id}`

#### ecommerce_products_update

Update a product's name, description or status. Set status to published to make it buyable,
draft to hide it, or archived to retire it. Variants, prices and inventory are managed
through the variant endpoints, not here. Returns the updated product summary.

- **Method**: `PATCH`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/products/{product_id}`

#### ecommerce_products_create-digital

Create a published digital product with a single variant and an optional external download link.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/products/digital`

#### ecommerce_products_list

List a store's products newest first as lean summaries (name, status, thumbnail, variant
count and price range). Prices are integers in the smallest currency unit and live on
variants. Filter by status, free text or a set of product ids. Use include=variants to
embed each product's variants with prices and inventory, and include=media to embed its media.

- **Method**: `GET`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/products`

#### ecommerce_products_create-physical

Create a published physical product with a single variant priced in the store currency.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/products/physical`

#### ecommerce_products_upload-and-attach-image

Fetch a raster image (JPEG, PNG, GIF or WebP, max 15MB) from a URL and attach it to a product in a
single call. Image downloads require HTTPS on port 443 without embedded credentials. At most one redirect
is allowed, and its destination must meet the same requirements. Private or reserved network
destinations, unsupported URLs and longer redirect chains are rejected. The image is virus-scanned
and validated by content, then stored on the CDN. Set is_thumbnail to make it the product's primary image.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/products/{product_id}/images`

#### ecommerce_sales-channels_list

List a store's active sales channels with their full metadata.

- **Method**: `GET`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/sales-channels`

#### ecommerce_sales-channels_create

Create a sales channel for a store. A "custom" channel is headless: build your own frontend and keep
your catalog, orders, shipping and payments in sync through the Ecommerce API. A "quick-link" channel
is a hosted one-page store whose handle is auto-generated.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/sales-channels`

#### ecommerce_sales-channels_update

Update a custom sales channel. The merchant-facing `name` and the public `url`
(returned as the channel `domain`) can be changed. Pass `null` to clear a value.

- **Method**: `PATCH`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/sales-channels/{sales_channel_id}`

#### ecommerce_shipping_set-store

Set the flat-rate shipping price for a store, creating the shipping zone if it does not exist yet.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/shipping`

#### ecommerce_stores_delete

Soft-delete a store owned by your account.

The underlying store data is preserved; only the store is marked as deleted.

- **Method**: `DELETE`
- **Path**: `/api/ecommerce/v1/stores/{store_id}`

#### ecommerce_stores_list

Retrieve the stores associated with your account.

- **Method**: `GET`
- **Path**: `/api/ecommerce/v1/stores`

#### ecommerce_stores_create

Create a new store for your account.

A primary sales channel is created alongside the store.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores`

#### ecommerce_stores_metadata

Get a store's readiness metadata: whether payment methods and shipping are configured,
plus its default currency. Useful to verify prerequisites before building a storefront.

- **Method**: `GET`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/metadata`

#### ecommerce_product-variants_update-in-batch

Update up to 100 existing variants in place by id — title, inventory, stock tracking and
prices. Variants omitted from the request are left untouched. Prices replace the variant's
existing prices in full. Returns the updated variants.

- **Method**: `PATCH`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/products/{product_id}/variants/batch`

#### ecommerce_product-variants_delete

Delete a single variant from the product.

- **Method**: `DELETE`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/products/{product_id}/variants/{variant_id}`

#### ecommerce_product-variants_list

List a product's variants, ordered by rank, with their options, prices and inventory.
Prices are integers in the smallest currency unit and live on variants.

- **Method**: `GET`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/products/{product_id}/variants`

#### ecommerce_product-variants_create

Add a variant to a product along one or more option dimensions (e.g. Size, Color). Options
missing from the product are created automatically; provide a value for every option the
product already has. Prices are integers in the smallest currency unit and default to the
store currency. Returns the created variant.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/products/{product_id}/variants`

### `hostinger-horizons-mcp`

#### horizons_websites_clone

Clone a Hostinger Horizons website into a new website.\n
Use this tool when the user wants a copy of an existing website, for example to try out
changes without touching the original.\n
This tool returns the ID and URL of the newly created copy.
The original website is left untouched.\n
To edit the copy, use the `Edit website` tool with the returned website ID, or the user can
open the provided website URL in Hostinger Horizons interface.

- **Method**: `POST`
- **Path**: `/api/horizons/v1/websites/{websiteId}/clone`

#### horizons_websites_list

List the Hostinger Horizons websites the user owns.\n
Use this tool when the user asks which websites they have, or when you need a website ID
before editing, publishing or cloning a website.\n
Each website is returned with its ID, status, domain and the URL to open it
in Hostinger Horizons interface.\n
The complete list of websites is returned in a single response - it is not paginated.

- **Method**: `GET`
- **Path**: `/api/horizons/v1/websites`

#### horizons_websites_create

Create new Hostinger Horizons website from the given message.\n
Use this tool when user asks you to create a website, landing page, blog
or any other type of application.\n
This tool initiates the website creation process and returns a website URL and ID.
The generation happens asynchronously.\n
After invoking this tool, your chat reply must be EXACTLY 1 sentence summarizing
that Hostinger Horizons is now creating their website and it will be ready in a few minutes
and you should provide the website URL to the user immediately
Do not write code.\n\nTo edit afterwards, use the `Edit website` tool with the returned
website ID, or the user can go to Hostinger Horizons interface in the provided website URL.
If the tool call fails with an error, you should provide a clear explanation of the error
and do not generate code yourself in the chat.
\n
TECHNOLOGY STACK CONSTRAINTS (STRICTLY ENFORCED):\n
The environment is limited to the following technologies.
You MUST NOT use, suggest, or implement any technology outside this list:\n
\n
- Language: JavaScript ONLY.
- Languages like TypeScript, Rust, Python, Java, PHP, etc., are STRICTLY PROHIBITED.\n
- Framework: React.\n
- Navigation: React Router.\n
- Styling: TailwindCSS.\n
- Components: shadcn/ui (built with @radix-ui primitives).\n
- Icons: Lucide React.\n
- Animations: Framer Motion.\n
\n
BACKEND & DATA STORAGE:\n
- Horizons integrated backend is the EXCLUSIVE solution for persistent data storage,
authentication, and database needs.\n
- Local databases (SQLite, MySQL, etc.) are STRICTLY PROHIBITED.\n
- Third-party services (Firebase, AWS Amplify) are allowed ONLY if explicitly requested by the user.\n
\n
MAPS:\n
- OpenStreetMap is the default provider.\n
- Alternative providers (Google Maps, Mapbox) are allowed ONLY if explicitly requested by the user.\n

- **Method**: `POST`
- **Path**: `/api/horizons/v1/websites`

#### horizons_websites_edit

Edit an existing Hostinger Horizons website with a follow-up message.\n
Use this tool when the user wants to change, extend or fix a website that already exists.\n
This tool queues the requested changes and returns the website URL and ID.
The changes are applied asynchronously.\n
After invoking this tool, your chat reply must be EXACTLY 1 sentence summarizing
that Hostinger Horizons is now applying the requested changes and they will be ready
in a few minutes, and you should provide the website URL to the user immediately.
Do not write code.\n
If the tool call fails with an error, you should provide a clear explanation of the error
and do not generate code yourself in the chat.

- **Method**: `POST`
- **Path**: `/api/horizons/v1/websites/{websiteId}/messages`

#### horizons_websites_publish

Publish a Hostinger Horizons website so its latest changes go live.\n
Use this tool when the user asks to publish, deploy or make their website live.\n
This tool starts the publish process and returns the URL the website will be live on.
Publishing happens asynchronously and takes a few minutes.\n
After invoking this tool, your chat reply must be EXACTLY 1 sentence summarizing
that the website is being published and you should provide the published URL to the user immediately.

- **Method**: `POST`
- **Path**: `/api/horizons/v1/websites/{websiteId}/publish`

#### horizons_websites_get

Get the link for the user to open their website in Hostinger Horizons interface.\n
Use this tool when the user wants the link to an existing website, or when you need its
website URL before or after editing it.\n
Websites can be edited with the `Edit website` tool, or by the user in Hostinger Horizons
interface in the provided website URL.

- **Method**: `GET`
- **Path**: `/api/horizons/v1/websites/{websiteId}`

### `hostinger-hosting-mcp`

#### hosting_import-wordpress-website

Import a WordPress website from an archive file to a hosting server. This tool uploads a website archive (zip, tar, tar.gz, etc.) and a database dump (.sql file) to deploy a complete WordPress website. The archive will be extracted on the server automatically. Note: This process may take a while for larger sites. After upload completion, files are being extracted and the site will be available in a few minutes. Upload credentials are generated and used internally — do not call a separate upload-url endpoint or upload the files yourself, this tool does it end-to-end. The username will be automatically resolved from the domain.

- **Method**: `custom`
- **Path**: `custom`

#### hosting_deploy-wordpress-plugin

Deploy a WordPress plugin from a directory to a hosting server. This tool uploads all plugin files and triggers plugin deployment. Upload credentials are generated and used internally — do not call a separate upload-url endpoint or upload the files yourself, this tool does it end-to-end.

- **Method**: `custom`
- **Path**: `custom`

#### hosting_deploy-wordpress-theme

Deploy a WordPress theme from a directory to a hosting server. This tool uploads all theme files and triggers theme deployment. The uploaded theme can optionally be activated after deployment. Upload credentials are generated and used internally — do not call a separate upload-url endpoint or upload the files yourself, this tool does it end-to-end.

- **Method**: `custom`
- **Path**: `custom`

#### hosting_deploy-js-application

Deploy a JavaScript application from an archive file to a hosting server. IMPORTANT: the archive must ONLY contain application source files, not the build output, skip node_modules directory; also exclude all files matched by .gitignore if the ignore file exists. The build process will be triggered automatically on the server after the archive is uploaded. Upload credentials are generated and used internally — do not call a separate upload-url endpoint or upload the archive yourself, this tool does it end-to-end. After deployment, use the hosting_list-js-deployments tool to check deployment status and track build progress.

- **Method**: `custom`
- **Path**: `custom`

#### hosting_deploy-static-website

Deploy a static website from an archive file to a hosting server. IMPORTANT: This tool only works for static websites with no build process. The archive must contain pre-built static files (HTML, CSS, JavaScript, images, etc.) ready to be served. If the website has a package.json file or requires a build command, use hosting_deploy-js-application instead. The tool uploads the archive to the website's file browser over TUS and triggers deployment; the archive is extracted and deployed directly without any build steps. Upload credentials are generated and used internally — do not call a separate upload-url endpoint or upload the archive yourself, this tool does it end-to-end. The username will be automatically resolved from the domain.

- **Method**: `custom`
- **Path**: `custom`

#### hosting_list-js-deployments

List javascript application deployments for checking their status. Use this tool when customer asks for the status of the deployment. This tool retrieves a paginated list of Node.js application deployments for a domain with optional filtering by deployment states.

- **Method**: `custom`
- **Path**: `custom`

#### hosting_show-js-deployment-logs

Retrieve logs for a specified JavaScript application deployment for debugging purposes in case of failure.

- **Method**: `custom`
- **Path**: `custom`

#### hosting_cache_clear-website

Permanently clears all server-side cache for the website at once. Use it when content was
updated and needs to be visible immediately, or after making major changes.

Also purges the Hostinger CDN cache when CDN is enabled on the website. For a WordPress
installation living in a subdirectory, pass the directory query parameter to clear its cache.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/cache/clear`

#### hosting_cache_toggle-cacheless

Turns development (cacheless) mode on or off, based on the enabled flag. When enabled, nothing
is cached, effectively turning off all caching for the website; use it while actively developing,
testing changes, debugging issues, or when real-time updates must be visible. Disable it after
finishing development work to restore the performance benefits of caching.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/cacheless-mode/toggle`

#### hosting_cache_toggle-website

Turns server-side caching for the website on or off, based on the enabled flag. Enable it for
faster page loads, reduced server load, and improved user experience; recommended for production
websites. Disabling may impact performance; to temporarily bypass caching while developing or
debugging, prefer toggling cacheless mode instead.

Does nothing if caching is already in the requested state.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/cache/toggle`

#### hosting_cron-jobs_list

Returns the list of cron jobs configured for the specified account, including their schedule and command.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/cron-jobs`

#### hosting_cron-jobs_create

Creates a cron job for the specified account from a schedule expression and a command.

Returns the created cron job, including its uid, which is required to delete the cron job or fetch its output.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/cron-jobs`

#### hosting_cron-jobs_delete

Permanently deletes the cron job identified by its uid.

The uid is returned by the list cron jobs endpoint.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/cron-jobs/{uid}`

#### hosting_cron-jobs_output

Returns the output captured from the last execution of the cron job identified by its uid.

The uid is returned by the list cron jobs endpoint.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/cron-jobs/{uid}/output`

#### hosting_databases_change-password

Changes the password for the specified database user.

The database name must be the full name returned by the list databases endpoint.
The password must also be updated in any website configuration that uses this database.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/databases/{name}/change-password`

#### hosting_databases_list

Returns a paginated list of databases for the specified account.

Use the domain and is_assigned filters to find databases assigned to a specific domain.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/databases`

#### hosting_databases_create

Creates a database with a database user and password for the specified account.

The database name and user are automatically prefixed with the account username when needed.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/databases`

#### hosting_databases_delete

Permanently deletes a database and its remote connections.

The database name must be the full name returned by the list databases endpoint.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/databases/{name}`

#### hosting_databases_create-remote-connection

Allows a remote host to connect to the specified database.

Provide an IPv4/IPv6 address, or "%" to allow any host. The database name must be
the full name returned by the list databases endpoint. Database creation is synchronous,
so a 404 here means no database with that name exists under the username, not that it
is still being created.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/databases/{name}/remote-connections`

#### hosting_databases_delete-remote-connection

Permanently removes a remote-access rule, revoking the given host's remote access to the database.

Identify the rule with the required ip query parameter (the IPv4/IPv6 address, or "%",
exactly as returned by the list remote connections endpoint). The database name must be
the full name returned by the list databases endpoint.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/databases/{name}/remote-connections`

#### hosting_databases_list-remote-connections

Returns the remote-access rules for the specified account: the remote hosts
(IPv4/IPv6 addresses, or "%" for any host) allowed to connect to the account databases.

Use the domain filter to only return rules for databases assigned to a specific domain.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/databases/remote-connections`

#### hosting_databases_repair

Repairs corrupted database tables asynchronously.

Use when database errors, crashes, or corruption are reported.
The database name must be the full name returned by the list databases endpoint.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/databases/{name}/repair`

#### hosting_databases_setup-website

Creates a new MySQL database for the website and writes its connection details into the
website's environment variables, then restarts the application. The platform generates the
password (and the database name and user, unless supplied). The password is never returned;
the application reads it from the environment.

Written variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` and
`DATABASE_URL` (`mysql://user:password@host:port/name`, user and password percent-encoded).
Existing variables are kept. If the website already has any variable with one of these
names the call fails with 422 and nothing is created; the `Replace Node.js environment
variables` endpoint removes them.

After this call the variables are ordinary environment variables: the
`Replace Node.js environment variables` endpoint changes or removes them like any other.

A restart is enough for apps that read environment variables at process start, such as
Express or NestJS. Frameworks that bake variables into the build output (Next.js,
`NEXT_PUBLIC_*`) see the new values only after a fresh build (`Start Node.js build` endpoint).

A password in the request is ignored; the platform always generates it. The optional `name`
and `user` are identifiers, not secrets.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/databases/setup`

#### hosting_databases_phpmyadmin-link

Returns a direct sign-on link to phpMyAdmin for the specified database.

Use this when a visual database interface is needed for SQL queries, imports, exports, or table management.
The database name must be the full name returned by the list databases endpoint.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/databases/{name}/phpmyadmin-link`

#### hosting_datacenters_list

Retrieve a list of datacenters available for setting up hosting plans
based on available datacenter capacity and hosting plan of your order.
The first item in the list is the best match for your specific order
requirements.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/datacenters`

#### hosting_domains_generate-free-subdomain

Generate a unique free subdomain that can be used for hosting services without purchasing custom domains.
Free subdomains allow you to start using hosting services immediately
and you can always connect a custom domain to your site later.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/domains/free-subdomains`

#### hosting_domains_list-website-parked

Retrieve all parked or alias domains created under the selected website.

Use this endpoint to inspect parked domain configuration for a specific website,
including the parent domain and root directory assigned to each parked domain.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/parked-domains`

#### hosting_domains_create-website-parked

Create a parked or alias domain for the selected website.

Provide a domain name or IP address to park on the website so it serves the same content
as the parent domain.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/parked-domains`

#### hosting_domains_delete-website-parked

Delete an existing parked or alias domain from the selected website.

Use this endpoint to remove parked domains that are no longer needed.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/parked-domains/{parkedDomain}`

#### hosting_domains_list-website-subdomains

Retrieve all subdomains created under the selected website.

Use this endpoint to inspect subdomain configuration for a specific website,
including the parent domain and root directory assigned to each subdomain.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/subdomains`

#### hosting_domains_create-website-subdomain

Create a new subdomain for the selected website.

Provide a subdomain prefix and, optionally, a custom directory or the
website public directory to use as the subdomain root.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/subdomains`

#### hosting_domains_delete-website-subdomain

Delete an existing subdomain from the selected website.

Use this endpoint to remove subdomains that are no longer needed.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/subdomains/{subdomain}`

#### hosting_domains_verify-ownership

Verify ownership of a single domain and return the verification status.

Use this endpoint to check if a domain is accessible for you before using it for new websites.
If the domain is accessible, the response will have `is_accessible: true`.
If not, add the given TXT record to your domain's DNS records and try verifying again.
Keep in mind that it may take up to 10 minutes for new TXT DNS records to propagate.

Skip this verification when using Hostinger's free subdomains (*.hostingersite.com).

- **Method**: `POST`
- **Path**: `/api/hosting/v1/domains/verify-ownership`

#### hosting_files_generate-upload-url

Generate a file browser upload URL with authentication credentials
for uploading files directly to a website's file storage.

While the website is still being set up (`status: running` on the list website setups
endpoint) this endpoint returns 409 with a `Retry-After` header: wait that many
seconds and retry, or poll the website setups until the status is `completed`.

Returns `url`, `auth_key` and `rest_auth_key`. Use these to upload a file to the
website's `public_html` directory via the TUS resumable upload protocol (TUS 1.0.0).
Send `X-Auth: {auth_key}` and `X-Auth-Rest: {rest_auth_key}` headers on every request
below.

1. Create the upload: `POST` to `{url}/{relative_file_path}?override=true` with headers
   `upload-length: {file size in bytes}` and `upload-offset: 0`. Expect `201 Created`.
2. Upload the file: send the file bytes to the same location (any TUS 1.0.0 client, or
   `PATCH` requests with an `upload-offset` header tracking progress) until complete.

`relative_file_path` is the destination path inside `public_html`, e.g. `app.zip`.

Instead of a TUS client, plain `curl` also works:
```
FILE=app.zip
SIZE=$(stat -f%z "$FILE")   # stat -c%s on Linux

curl -i -X POST "{url}/${FILE}?override=true" \
  -H "X-Auth: {auth_key}" \
  -H "X-Auth-Rest: {rest_auth_key}" \
  -H "Tus-Resumable: 1.0.0" \
  -H "Upload-Length: ${SIZE}" \
  -H "Upload-Offset: 0"
# -> 201 Created

curl -i -X PATCH "{url}/${FILE}?override=true" \
  -H "X-Auth: {auth_key}" \
  -H "X-Auth-Rest: {rest_auth_key}" \
  -H "Tus-Resumable: 1.0.0" \
  -H "Content-Type: application/offset+octet-stream" \
  -H "Upload-Offset: 0" \
  --data-binary "@${FILE}"
# -> 204 No Content, Upload-Offset response header equals SIZE when done
```

- **Method**: `POST`
- **Path**: `/api/hosting/v1/files/upload-urls`

#### hosting_files_list-website-and-directories

List files and directories under a website's document root.

Use `directory` to browse a subdirectory relative to the document root. Symlinked entries
are listed but never traversed into or resolved.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/domains/{domain}/files`

#### hosting_files_website-content

Get a single file's content, relative to a website's document root.

Read-only; refuses symlinks, oversized files, non-text file types, and files identified as
containing secrets (e.g. credential files) — none of these are returned by this endpoint.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/domains/{domain}/files/content`

#### hosting_git_auto-deployment-settings

Returns the Git auto-deployment settings of the website: which repository and branch deploy
into which directory, and whether pushes trigger a deployment. `is_enabled` false keeps the
repository link but ignores pushes.

When the website has no auto-deployment configured every field is null. Save settings with
`Update Git auto-deployment settings`.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/git/auto-deployments/settings`

#### hosting_git_update-auto-deployment-settings

Creates or replaces the Git auto-deployment settings of the website: repository, branch, the
directory under the document root to deploy into, and `is_enabled`. Send the full set;
`is_enabled` defaults to true and `directory` to the document root. `installation_uuid` must
be an installation from `List Git installations` that belongs to the same customer as the
website.

For PHP and static websites, saving with `is_enabled` true deploys the branch right away and
every later push to that branch deploys again. For Node.js and Website Builder websites saving
does not clone anything. On a Node.js website start the first deploy with
`Start Node.js build` using `source_type` `git`; pushes then trigger new builds with the build
settings stored for the website.

- **Method**: `PUT`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/git/auto-deployments/settings`

#### hosting_git_delete-auto-deployment-settings

Removes the Git auto-deployment settings of the website. Files already deployed stay on the
website; pushes stop deploying until settings are saved again. Succeeds also when nothing is
configured.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/git/auto-deployments/settings`

#### hosting_git_list-installations

Lists the Git provider accounts the customer has connected. Only installations with status
`active` are returned unless the `status` filter says otherwise.

An empty list means the customer has no active installation. Check `status=suspended` and
`status=pending` as well. If there is none at all, a Git provider (GitHub or GitLab) has to be
connected once in hPanel (Websites, Manage, Advanced, Git; or Add Website, Node.js Web App,
Import Git Repository); this endpoint then lists the new installation.

Use `uuid` as the path parameter of `List Git installation repositories`, and as
`installation_uuid` in `Start Node.js build` with `source_type` `git` and in
`Update Git auto-deployment settings`.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/git/installations`

#### hosting_git_list-installation-repositories

Lists the repositories the Git installation can access, read live from the provider. Works
for github and gitlab installations. Use an active installation: a suspended or pending one
is still queried and the call fails with whatever the provider answers. The list is cut at
the first 500 repositories in the order the provider returns them; when the account has
more, name the repository directly instead of searching this list.

`owner`, `name` and a branch (`default_branch` or another one) go into `source_options` of
`Start Node.js build` or into `Update Git auto-deployment settings`. Returns 404 when the
installation does not belong to the customer. Limited to 10 calls per minute per API client
(429 above that).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/git/installations/{uuid}/repositories`

#### hosting_git_deploy-website-repository

Clones a Git repository into a directory of the website, or pulls it again. An empty or missing
directory gets a clone of the branch. A directory that already holds this repository and branch is
reset to its last commit and pulled: changes made on the server to files the repository tracks are
discarded, files it does not track stay. A directory that holds other files, including another
repository or another branch of this one, is rejected. `composer install` runs after the clone or
pull when the repository has a `composer.json`.

The call waits for the deployment and returns its log. `is_success` false means Git or composer
failed and the log says why. A second call for the same directory is rejected while the first is
still waiting for the server. If the request times out, the deployment may still finish on the
server; calling again later with the same repository and branch pulls.

Private repositories need an SSH URL and the account's Git SSH key from `Generate Git SSH key`,
added to the repository as a deploy key.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/git/repositories/deploy`

#### hosting_git_list-website-repositories

Lists the Git repositories linked to directories of the website, with
`Deploy website Git repository` or in the Git section of hPanel: clone URL, branch and directory of
each one. A repository whose clone failed stays listed; deploying it again retries the clone. GitHub
and GitLab auto-deployments are not listed here; see `Get Git auto-deployment settings`.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/git/repositories`

#### hosting_git_ssh-public-key

Returns the public SSH key of the hosting account. `Deploy website Git repository` uses this key to
clone and pull over SSH, so a private repository works once the key is added to it as a deploy key
on the Git host. `public_key` is null when the account has no key yet.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/git/ssh-key`

#### hosting_git_generate-ssh-key

Creates the SSH key pair of the hosting account and returns the public key. When the account already
has a key, returns that key unchanged. One key serves every website of the account; add the public
key to a private repository as a deploy key before deploying it.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/git/ssh-key`

#### hosting_nodejs_list-builds

Retrieve a paginated list of Node.js build processes for a specific website.

Each build represents a single run of the Node.js build pipeline. Use the `states`
query parameter to filter results by build state (pending, running, completed, failed).
Use the `uuid` from a build to poll its output via the `Get Node.js Build Logs` endpoint.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds`

#### hosting_nodejs_start-build

Start a Node.js build process using files already present on the website's file storage.

WARNING: on success this overwrites the website's existing contents and cannot be
undone — verify this is intended before calling this endpoint.

With `source_type` `archive`, `source_options.archive_path` must point to an existing
archive file on the server (relative to the website document root). Use the
`Generate Upload URL` endpoint to obtain credentials and upload the archive first. To
auto-detect build settings from an archive before starting, first call the
`Get Node.js Build Settings from Archive` endpoint.

With `source_type` `git`, `source_options` carries `owner`, `repository`, `branch` and
`installation_uuid`. Take the installation from `List Git installations` and the owner and
repository from `List Git installation repositories`; the branch is cloned at its current
head. The installation must belong to the same customer as the website.

The returned build `uuid` can be used to poll progress and retrieve logs via
the `Get Node.js Build Logs` endpoint.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds`

#### hosting_nodejs_build-settings

Returns the build settings stored for the website: framework (`app_type`), Node.js version,
root and output directory, build script, entry file and package manager. Stored settings
drive Git auto-deployment builds. A build started through the API uses the values sent in
that request and saves them here only when no settings exist yet.

Returns 404 until the first build or the first settings update stores them. Use this after
a failed build to check whether the framework or the entry file were detected wrong, then
fix them with the `Update Node.js build settings` endpoint.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds/settings`

#### hosting_nodejs_update-build-settings

Replaces the build settings stored for the website. Send the full set: `node_version` is
required and every nullable field you omit is stored as null. Creates the settings when
none exist yet.

This does not start a build. Stored settings drive Git auto-deployment builds; a build
started through the API uses the values sent in that request, so to rebuild with corrected
settings call `Start Node.js build` with the same values. Typical fixes: a wrong `app_type`
after auto-detection, or a missing `entry_file` for express, fastify, nest, nuxt and hono
apps.

- **Method**: `PUT`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds/settings`

#### hosting_nodejs_build-settings-from-archive

Auto-detect Node.js build settings from a package.json inside an archive already on the server.

Use this before calling `Start Node.js Build` to preview what settings will be used,
or to let the user review and override values (framework, node version, root directory,
output directory, build script) before committing to a build.

The archive must already be present on the website's file storage. Use the
`Generate Upload URL` endpoint to obtain credentials and upload the archive first.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds/settings/from-archive`

#### hosting_nodejs_list-environment-variables

Lists the Node.js environment variables currently set for the website. Values are always
masked as `********` and cannot be read back through this API. Use this endpoint to see
which keys are configured or to verify a change, not to read values.

To change variables, use the `Replace Node.js environment variables` endpoint. It replaces
the whole set, so never copy the masked values from this response into that request; send
the full desired set with real values taken from the project `.env` file or the user
prompt instead.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds/settings/env`

#### hosting_nodejs_replace-environment-variables

Replaces the website's Node.js environment variables with the ones provided. This is a
full replace: any variable not in the request is deleted, and sending an empty `env_vars`
array deletes every variable. Saving writes the values and restarts the running Node.js
process.

A restart is enough for apps that read environment variables at process start, such as
Express or NestJS. It is not enough for frameworks that bake variables into the build.
Next.js standalone is one of those: build-time values (including `NEXT_PUBLIC_*`) need a
fresh build. After this call, use the `Start Node.js build` endpoint so those apps
pick up the new values.

The `List Node.js environment variables` endpoint returns masked values (`********`), so
never copy values from it into this request. Always send the full desired set with real
values taken from the project `.env` file or the user prompt.

- **Method**: `PUT`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds/settings/env`

#### hosting_nodejs_analyse-failed-build

Returns an AI analysis of why a build failed and how to fix it, based on the build logs,
the project file list and package.json. Only builds in the `failed` state can be analysed;
any other state returns 422. When no analysis could be produced both `analysis` and
`solution` are null, in which case read `Get NodeJS build logs` instead.

Each call runs the analysis again, so call it once per failed build and keep the result.
Limited to 5 calls per minute per API client (429 above that).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds/{uuid}/analysis`

#### hosting_nodejs_build

Returns one build by UUID: its state (`pending`, `running`, `completed`, `failed`), the
options it ran with and timestamps. Poll this while a build is pending or running. When it
is failed, read `Get NodeJS build logs` and `Analyse failed Node.js build` for the cause.
Returns 404 when the UUID does not belong to a build of this website.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds/{uuid}`

#### hosting_nodejs_build-logs

Retrieve logs from a specific Node.js build process.

To stream live output while a build is running, poll this endpoint repeatedly
while the build state is `running`, passing the previously returned `lines` count
as `from_line` to fetch only new output since the last call.
Log content may contain ANSI escape sequences (color codes).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds/{uuid}/logs`

#### hosting_nodejs_runtime-logs

Returns the Node.js application's runtime console log entries, oldest first, each with
timestamp, level and message. On the first call send `period` (`1h`, `1d`, `1w` or `1m`)
and optionally `levels` and `limit` (1-5000, default 1000); when more entries match than
`limit`, the newest are kept.

To poll for new entries send `total_lines + 1` from the previous response as `from_line`
and omit `period`; `period` and `from_line` cannot be combined. Lines that are not JSON
with a timestamp, level and message are skipped, so `logs` may hold fewer than `limit`
entries while `total_lines` counts every raw line. Entries with a timestamp before
`last_deployed_at` belong to the previous deployment. Returns an empty `logs` list when
the application has not written a log file yet.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/runtime-logs`

#### hosting_nodejs_clear-runtime-logs

Empties the Node.js application's runtime log file. This cannot be undone, so confirm with
the user before calling it. Returns success even when no log file exists yet.

Use it before reproducing a problem so the next `Get Node.js runtime logs` call returns
only fresh entries; start that call with `period` again instead of reusing a `from_line`
from before the clear.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/runtime-logs`

#### hosting_nodejs_restart-application

Restarts the Node.js server process for the website. Does not rebuild or redeploy the
application. Use it to apply environment or configuration changes, or to recover a hung
application.

Only applicable to server-side applications (Express, Next.js, NestJS, etc.). Static
front-end apps (React, Vue, Vite) have no persistent server process, so restarting them
has no effect. Returns success even when the website has no server process to restart.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/server/restart`

#### hosting_nodejs_list-vulnerabilities

Lists known npm package vulnerabilities detected on a Node.js website, enriched with
advisory metadata (severity, CVSS score, CVE, advisory URL). Results are sorted from
the most severe to the least severe, then by publish date (newest first). Use the
`severities` query parameter to filter.

Vulnerabilities with `is_patchable` set to `true` can be auto-fixed via the
`Patch Node.js Vulnerabilities` endpoint, which opens a GitHub pull request with
updated package versions. Auto-fix is only available for websites deployed from a
connected GitHub repository. Vulnerabilities with `is_patching_in_progress` set to
`true` are already included in an open patch pull request; while any patch pull
request is open, new patch requests for this website are rejected until it is merged
or closed.

Data comes from periodic dependency scans, so it may lag behind the latest deployment.
An empty list means the most recent scan found no vulnerabilities; it does not
guarantee the current deployment is vulnerability-free. Available on Business and
Cloud Hosting plans.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/vulnerabilities`

#### hosting_nodejs_patch-vulnerabilities

Patches the selected Node.js vulnerabilities by updating the affected package versions
in `package.json` and opening a GitHub pull request in the connected repository. The
customer reviews and merges the pull request; merging triggers the automatic deployment.

Auto-fix is only available for websites deployed from a connected GitHub repository.
Websites deployed from an archive have no auto-fix path and return a 404. The Hostinger
GitHub App needs write access to the repository; without it the request fails with a
403 explaining the missing permission.

Only vulnerabilities with `is_patchable` set to `true` can be patched. Non-patchable
IDs in the selection are skipped; the pull request covers the patchable subset, listed
in `patched_vulnerability_ids`. Selections without any patchable vulnerability are
rejected with a 422. Only one patch pull request can be open at a time per website;
close or merge it before patching again. Available on Business and Cloud Hosting plans.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/vulnerabilities/patch`

#### hosting_websites_list-setups

Returns the website setups started in the last 24 hours for the hosting accounts
accessible to the authenticated client, newest first.

Meant for polling right after creating a website: the website shows up in the
websites list before its server-side setup has finished, and while the setup is
`running` endpoints that operate on that website may respond with `404` or `409`.
Poll this endpoint with the `domain` filter every 10 to 15 seconds and wait for
`status: completed` before uploading files, deploying or creating databases.
`failed` means the setup stopped before finishing or has not reported progress for
over an hour. Setups older than 24 hours are not listed.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/onboardings`

#### hosting_orders_list

Retrieve a paginated list of orders accessible to the authenticated client.

Only Web and Cloud hosting orders are listed. Agency Plan orders are listed by
`GET /api/agency-hosting/v1/orders`.

This endpoint returns orders of your hosting accounts as well as orders
of other client hosting accounts that have shared access with you.

Use the available query parameters to filter results by order statuses
or specific order IDs for more targeted results.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/orders`

#### hosting_php_reset-extensions

Resets all PHP extensions of the website to their default state.

Use it to recover from extension conflicts or restore the original configuration.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/php/extensions/reset`

#### hosting_php_get

Returns the full PHP configuration for the website: current version, available versions
(supported and unsupported), enabled/disabled extensions, options with their current value,
default, type and the plan limit (`max`), and conflicting extension groups.

Use it to check the current PHP setup before updating the version, extensions or options.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/php/details`

#### hosting_php_info

Returns the full phpinfo page (HTML) for the website.

Use it to debug PHP issues or inspect the complete PHP environment of the website.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/php/php-info`

#### hosting_php_update-extensions

Enables or disables PHP extensions (modules) for the website.

Use the Get PHP details endpoint to check the current extension states before changing them.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/php/extensions`

#### hosting_php_update-options

Updates PHP options for the website (e.g. `memory_limit`, `max_execution_time`, `upload_max_filesize`).
Only provide the options you want to change, inside the `options` object.

Values above the account plan limit are silently capped to that limit, so the request can succeed
with a smaller applied value. Call the Get PHP details endpoint afterwards to read the applied value.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/php/options`

#### hosting_php_update-version

Changes the PHP version of the website.

Use the Get PHP details endpoint to see the versions available for the website.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/php/version`

#### hosting_redirects_list-website

Returns a paginated list of redirects configured for the selected website.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/redirects`

#### hosting_redirects_create-website

Creates a redirect from a URL on the selected website to another URL or IP address.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/redirects`

#### hosting_redirects_delete-website

Permanently deletes the redirect identified by its source URL.

Pass the `from` value exactly as returned by the list redirects endpoint.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/redirects`

#### hosting_ssl_install

Requests a lifetime SSL certificate for the website. The installation runs in the background;
`Get SSL status` reports `active` or `failed` when it ends. An `active` lifetime certificate
does not block the request: a new installation is requested, which is how a certificate is
reinstalled.

Returns 422 for free subdomains (their certificate is managed by the platform), while an
installation is `installing` or `waiting_for_retry`, when the website's certificate was
revoked (it cannot be reissued), and when an uploaded custom certificate is installed; that
one has to be uninstalled first.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/ssl/setup`

#### hosting_ssl_status

Returns the SSL state of the website: the certificate `status` and `provider`, whether the
certificate is a lifetime one managed by the platform, whether HTTP requests are redirected to
HTTPS, when the certificate stops being valid and the last installation error.

`installing` and `waiting_for_retry` mean an installation is in progress. `failed` means the
last installation gave up, or the website was not updated for 60 minutes while `installing`;
`last_error` holds the reason when it is a known message, otherwise it is null. `expired`
means the assigned certificate's validity has ended. `not_installed` means no certificate is
assigned. Free subdomains use a platform-managed certificate: with no installation recorded
they report `active` with `provider` and `expires_at` null.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/ssl/status`

#### hosting_ssl_toggle-https-redirect

Turns the HTTP to HTTPS redirect of the website on or off, based on `is_enabled`. Does
nothing when the redirect is already in the requested state. Turning it on requires an
installed certificate (`status` `active` or `expired` on `Get SSL status`) and returns 422
when there is none; turning it off is always accepted.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/ssl/https-redirect/toggle`

#### hosting_ssl_uninstall

Removes the SSL certificate assigned to the website, turns the HTTPS redirect off and cancels
a pending installation retry. The website serves plain HTTP until a new installation
completes. `Get SSL status` reports `not_installed` as soon as the call returns; the call also
succeeds when no certificate is assigned, so repeating it is safe.

Returns 422 for free subdomains (their certificate is managed by the platform) and while an
installation is `installing`.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/ssl`

#### hosting_websites_list

Retrieve a paginated list of websites (CloudLinux, Builder, and Horizons) accessible to the
authenticated client.

This endpoint returns websites from your hosting accounts as well as
websites from other client hosting accounts that have shared access
with you.

Each website includes a `website_type` field describing the type of
website detected on the underlying platform (`wordpress`, `builder`,
`horizons`, `nodejs`, or `other`). Some fields, such as
`vhost_type`, `username`, and `root_directory`, only apply to
CloudLinux websites and are null for other platforms.

Use `website_types` to list only websites of a given detected type, e.g. only
WordPress websites (`website_types=wordpress`) or only Node.js websites
(`website_types=nodejs`). Combine with the other available query parameters to
filter by username, order ID, enabled status, or domain name for more targeted
results.

A website appears in this list before its server-side setup has finished, and
`is_enabled` reflects suspension, not readiness. To know when a newly created website
is ready for file, deploy or database operations, poll the list website setups
endpoint instead.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/websites`

#### hosting_websites_create

Create a new website for the authenticated client.

You must choose which hosting order to create this website on. Pass that
order as `order_id` together with the domain name. List orders to see
available IDs; the website is provisioned on that order's hosting plan.

Only Web and Cloud hosting orders are accepted. To create a website on an Agency
Plan order, use `POST /api/agency-hosting/v1/orders/{order_id}/websites/setups`.

The datacenter_code parameter is required when creating the first website
on a new hosting plan - this will set up and configure new hosting account
in the selected datacenter.

Subsequent websites will be hosted on the same datacenter automatically.

Website creation is asynchronous and takes up to a few minutes. Poll the list website
setups endpoint with the `domain` filter every 10 to 15 seconds and wait for `status:
completed` before uploading files, deploying or creating databases. While the setup is
`running`, endpoints that operate on the website may respond with `404` or `409`.
`is_enabled` on the websites list reflects suspension, not readiness.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/websites`

#### hosting_websites_deploy-static-site-archive

Deploy a static application from an archive file.

WARNING: this overwrites the website's existing contents and cannot be undone —
verify this is intended before calling this endpoint.

This endpoint allows you to deploy a static application from an archive
file that has been uploaded to the website's directory.

This only works for static sites (pre-built HTML/CSS/JS with no build step). For
Node.js applications, use `Create NodeJS build from archive` instead, or
`Start Node.js build` if the archive is already uploaded. For WordPress sites,
use `Import WordPress website`.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/deploy`

#### hosting_websites_delete

This endpoint permanently removes a website and all of its data. This action
cannot be undone. Before calling it, make sure the user understands the
consequences and explicitly confirms that they want to proceed.

All website files, databases and related configuration will be removed.
The hosting plan itself is kept, so a new website can be created on it afterwards.

Supported websites: main and addon domain websites on web hosting plans, and
Website Builder websites. Parked domains and subdomains cannot be deleted with
this endpoint. The domain must be the exact website domain, not a preview
domain or an alias.

Returns 404 when the domain does not exist or does not belong to the
authenticated client.

Website removal is processed asynchronously and can take a few minutes to
complete. The response returns before the removal finishes.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/websites/{domain}`

### `hostinger-mail-mcp`

#### mail_aliases_create-alias

Create an alias for the given mailbox. The alias address is formed
from the given local part and the domain of the mailbox. Messages
sent to the alias are delivered to the mailbox.

- **Method**: `POST`
- **Path**: `/api/mail/v1/mailboxes/{mailboxId}/aliases`

#### mail_aliases_delete-alias

Delete an alias. Messages sent to the alias address are no longer
delivered to the mailbox.

- **Method**: `DELETE`
- **Path**: `/api/mail/v1/aliases/{aliasId}`

#### mail_aliases_list

Retrieve a paginated list of aliases across all mailboxes of a mail
order.

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders/{orderId}/aliases`

#### mail_api-tokens_create

Create an API token for the given mail order. The token grants access
to the [Hostinger Email API](https://api.mail.hostinger.com/), where
you can provision and manage the mailboxes it is scoped to.

The plaintext token is returned only in this response, never again.
A maximum of 10 tokens can exist per order. Use
`scope.has_all_mailboxes` to cover all current and future mailboxes,
or list specific mailboxes in `scope.mailbox_ids`.

- **Method**: `POST`
- **Path**: `/api/mail/v1/orders/{orderId}/api-tokens`

#### mail_api-tokens_revoke

Revoke an API token. The token immediately loses access to the
[Hostinger Email API](https://api.mail.hostinger.com/). This action
cannot be undone.

- **Method**: `DELETE`
- **Path**: `/api/mail/v1/api-tokens/{tokenId}`

#### mail_api-tokens_list

Retrieve a paginated list of
[Hostinger Email API](https://api.mail.hostinger.com/) tokens across
all your mail orders, optionally filtered by order. Plaintext tokens
are never included; they are returned only when a token is created.

- **Method**: `GET`
- **Path**: `/api/mail/v1/api-tokens`

#### mail_autoreplies_create

Create an automatic reply for the given mailbox. A mailbox can have
only one autoreply. Omit `starts_at` to activate the autoreply
immediately and omit `ends_at` to keep it active indefinitely.

- **Method**: `POST`
- **Path**: `/api/mail/v1/mailboxes/{mailboxId}/autoreplies`

#### mail_autoreplies_update

Replace the autoreply with the given content and schedule. Omitted
optional fields are cleared: omit `starts_at` to activate the
autoreply immediately and omit `ends_at` to keep it active
indefinitely.

- **Method**: `PUT`
- **Path**: `/api/mail/v1/autoreplies/{autoreplyId}`

#### mail_autoreplies_delete

Delete the autoreply of a mailbox. The mailbox stops sending
automatic replies immediately.

- **Method**: `DELETE`
- **Path**: `/api/mail/v1/autoreplies/{autoreplyId}`

#### mail_autoreplies_list

Retrieve a paginated list of autoreplies across all mailboxes of a
mail order.

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders/{orderId}/autoreplies`

#### mail_catchalls_create-catch-all

Create a catch-all that routes all messages sent to unknown addresses
of the domain to the given mailbox. The mailbox address receives a
confirmation email and the catch-all becomes active only after it is
confirmed. A domain can have only one catch-all.

- **Method**: `POST`
- **Path**: `/api/mail/v1/mailboxes/{mailboxId}/catchalls`

#### mail_catchalls_delete-catch-all

Delete a catch-all. Messages sent to unknown addresses of the domain
are no longer routed to the mailbox.

- **Method**: `DELETE`
- **Path**: `/api/mail/v1/catchalls/{catchallId}`

#### mail_catchalls_list-catch-alls

Retrieve a paginated list of catch-alls across all mailboxes of a
mail order.

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders/{orderId}/catchalls`

#### mail_catchalls_resend-catch-all-confirmation

Resend the confirmation email to the mailbox address of an
unconfirmed catch-all.

- **Method**: `POST`
- **Path**: `/api/mail/v1/catchalls/{catchallId}/confirmation/resend`

#### mail_forwarders_create

Create a forwarder from the given mailbox to the destination address.
The destination receives a confirmation email and forwarding becomes
active only after it is confirmed.

- **Method**: `POST`
- **Path**: `/api/mail/v1/mailboxes/{mailboxId}/forwarders`

#### mail_forwarders_delete

Delete a forwarder. The mailbox stops forwarding messages to the
destination address immediately.

- **Method**: `DELETE`
- **Path**: `/api/mail/v1/forwarders/{forwarderId}`

#### mail_forwarders_list

Retrieve a paginated list of forwarders across all mailboxes of a
mail order.

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders/{orderId}/forwarders`

#### mail_forwarders_resend-confirmation

Resend the confirmation email to the destination address of an
unconfirmed forwarder.

- **Method**: `POST`
- **Path**: `/api/mail/v1/forwarders/{forwarderId}/confirmation/resend`

#### mail_forwarders_update-keep-copy-setting

Enable or disable keeping a copy of forwarded messages in the
mailbox.

- **Method**: `PATCH`
- **Path**: `/api/mail/v1/forwarders/{forwarderId}/keep-copy`

#### mail_logs_list-access

Retrieve paginated access logs for the domain attached to the given
mail order. Supports filtering by account, date range, protocol,
status, and deletion flag. Results are sorted by timestamp descending.

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders/{orderId}/logs/access`

#### mail_logs_list-action

Retrieve paginated account action logs (administrative and user
actions) for the given mail order. Supports filtering by account,
date range, and status. Results are sorted by timestamp descending.

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders/{orderId}/logs/action`

#### mail_logs_list-inbound

Retrieve paginated inbound (received mail) delivery logs for the
domain attached to the given mail order. Supports filtering by
account, date range, status, sender, and recipient. Results are
sorted by timestamp descending.

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders/{orderId}/logs/inbound`

#### mail_logs_list-mailbox-action

Retrieve paginated mailbox action logs (message and mailbox events)
for a mailbox in the given mail order. The mailbox email must belong
to the order's domain. Supports date range and event type filters.
Results are sorted by timestamp descending.

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders/{orderId}/logs/mailbox-actions`

#### mail_logs_list-outbound

Retrieve paginated outbound (sent mail) delivery logs for the domain
attached to the given mail order. Supports filtering by account, date
range, status, sender, and recipient. Results are sorted by timestamp
descending.

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders/{orderId}/logs/outbound`

#### mail_mailboxes_list

Retrieve a paginated list of mailboxes belonging to a mail order.

Use this endpoint to monitor mailboxes of your mail service, including
their status, enabled protocols, attached resource counts, and
periodically synced usage numbers (usage may lag behind live values).

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders/{orderId}/mailboxes`

#### mail_mailboxes_create-mailbox

Create a mailbox under the given mail order. The full email address is
composed from the given local part and the domain of the order.

- **Method**: `POST`
- **Path**: `/api/mail/v1/orders/{orderId}/mailboxes`

#### mail_mailboxes_delete-mailbox

Delete a mailbox. The mailbox is soft-deleted and stays restorable
for a limited period before it is permanently removed.

- **Method**: `DELETE`
- **Path**: `/api/mail/v1/mailboxes/{mailboxId}`

#### mail_mailboxes_change-mailbox-password

Change the password of a mailbox.

- **Method**: `PATCH`
- **Path**: `/api/mail/v1/mailboxes/{mailboxId}/password`

#### mail_orders_list

Retrieve a paginated list of mail orders associated with your account.

Use this endpoint to monitor your mail services, including their status,
plan, attached domain, and expiration details.

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders`

#### mail_orders_plan

Retrieve the plan the given mail order was purchased with, including
domain-level and mailbox-level quotas, limits, and protocol
availability.

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders/{orderId}/plan`

#### mail_webhooks_create

Create a webhook for the given mailbox. The generated secret is
returned only in this response and is sent as a bearer token with
every delivery.

- **Method**: `POST`
- **Path**: `/api/mail/v1/mailboxes/{mailboxId}/webhooks`

#### mail_webhooks_list-delivery-logs

Retrieve a paginated list of webhook delivery logs for the given mail
order, including delivery outcome, duration, and retry counts.
Supports filtering by mailbox.

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders/{orderId}/webhooks/delivery-logs`

#### mail_webhooks_get

Retrieve the details of a single webhook. The webhook secret is never
included; it is returned only when a webhook is created or its secret
is regenerated.

- **Method**: `GET`
- **Path**: `/api/mail/v1/webhooks/{webhookId}`

#### mail_webhooks_delete

Permanently delete a webhook. This action cannot be undone. After
deletion the URL no longer receives event notifications.

- **Method**: `DELETE`
- **Path**: `/api/mail/v1/webhooks/{webhookId}`

#### mail_webhooks_update

Partially update a webhook. Only the fields included in the request
body are changed; omitted fields retain their current values. Pass
`"description": null` to clear the description.

- **Method**: `PATCH`
- **Path**: `/api/mail/v1/webhooks/{webhookId}`

#### mail_webhooks_list

Retrieve a paginated list of webhooks belonging to the given mail
order. Supports filtering by mailbox and status. The webhook secret
is never included; it is returned only when a webhook is created or
its secret is regenerated.

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders/{orderId}/webhooks`

#### mail_webhooks_regenerate-secret

Regenerate the secret of a webhook. The previous secret is
immediately invalidated. The new secret is returned only in this
response and is sent as a bearer token with every delivery.

- **Method**: `POST`
- **Path**: `/api/mail/v1/webhooks/{webhookId}/regenerate-secret`

#### mail_webhooks_test

Send a test delivery to the webhook URL and return the result. Test
requests are rate limited upstream.

- **Method**: `POST`
- **Path**: `/api/mail/v1/webhooks/{webhookId}/test`

### `hostinger-reach-mcp`

#### reach_automations_get

Get a single automation with the counts of contacts that entered it, are moving through it,
finished it or failed on the way.

This describes the automation itself. To see the workflow it runs, use the steps endpoint.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/automations/{automationUuid}`

#### reach_automations_list

Get a paginated list of the automations in a profile.

Every automation comes with the counts of contacts that entered it, are moving through it,
finished it or failed on the way. Those counts describe the contact journey and are not
email engagement metrics - for opens, clicks and unsubscribes use the campaign statistics
endpoint instead.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/automations`

#### reach_automations_list-steps

Get the workflow of an automation as a flat list of steps.

The steps form a tree rather than a straight line: follow `parent_uuid` to reconstruct the
branches, and use `step_order` to order the steps that share a parent. An automation with no
steps yet returns an empty list.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/automations/{automationUuid}/steps`

#### reach_campaigns_get

Get a single campaign with its sender, subject, template reference, targeting and delivery
progress.

This describes how the campaign was set up and how far it has got. For opens, clicks and
unsubscribes use the campaign statistics endpoint.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/campaigns/{campaignUuid}`

#### reach_campaigns_list

Get a paginated list of the campaigns in a profile.

Each campaign carries its headline engagement rates. Filter by status to find drafts,
scheduled, sending or sent campaigns, keeping in mind that a fully sent campaign has the
status `publish`. By default only regular campaigns are returned - pass `type` to get the
emails sent by automations or the double opt-in confirmations instead.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/campaigns`

#### reach_campaigns_create-draft

Create a campaign in a profile.

The campaign is created as a draft, so nothing is sent and no contact is touched. It has no
audience yet either - targeting and scheduling are not part of this request, the draft is
finished and sent from the Reach interface.

- **Method**: `POST`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/campaigns`

#### reach_campaigns_performance

Get the performance of a campaign: delivery, opens, clicks and unsubscribes, with the
matching rates.

Every count is unique contacts rather than raw events, so a contact who opens the same email
five times is counted once.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/campaigns/{campaignUuid}/statistics`

#### reach_contacts_delete

Delete a contact with the specified UUID.

This endpoint permanently removes a contact from the email marketing system.

**Deprecated.** This endpoint cannot target a profile, so it always falls back to the
client's default profile and cannot delete contacts of any other profile. Use
`DELETE /api/reach/v1/profiles/{profileUuid}/contacts/{contactUuid}` instead.

- **Method**: `DELETE`
- **Path**: `/api/reach/v1/contacts/{uuid}`

#### reach_contact-fields_delete

Delete a custom contact field.

Every value contacts hold for the field is deleted with it, and for the choice types so
are its options. The contacts themselves are not affected.

- **Method**: `DELETE`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/contacts/fields/{fieldUuid}`

#### reach_contact-fields_update

Rename a custom contact field and, for the choice types, replace its option set.

Options carrying a uuid are kept and relabelled, options without one are created, and any
existing option left out of the list is deleted along with the values contacts hold for
it. The field type and slug cannot be changed.

- **Method**: `PATCH`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/contacts/fields/{fieldUuid}`

#### reach_contact-fields_list

Get the custom contact fields defined in a profile.

Custom fields let you store your own attributes on contacts. The returned uuids are what
you pass to the contact update endpoint to set values, and choice fields also list the
options available to pick from.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/contacts/fields`

#### reach_contact-fields_create

Define a new custom contact field in a profile.

The `slug` is derived from the label and, like the field type, cannot be changed later.
Use the returned uuid to set values on contacts.

- **Method**: `POST`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/contacts/fields`

#### reach_contacts_list-groups

Get a list of all contact groups.

This endpoint returns a list of contact groups that can be used to organize contacts.

- **Method**: `GET`
- **Path**: `/api/reach/v1/contacts/groups`

#### reach_contacts_list

Get a list of contacts, optionally filtered by group and subscription status.

This endpoint returns a paginated list of contacts with their basic information.
You can filter contacts by group UUID and subscription status.

**Deprecated.** This endpoint cannot target a profile, so it always falls back to the
client's default profile and cannot list contacts of any other profile. Use
`GET /api/reach/v1/profiles/{profileUuid}/contacts` instead, which also replaces the
group filter with a tag filter.

- **Method**: `GET`
- **Path**: `/api/reach/v1/contacts`

#### reach_contacts_create

Create a new contact in the email marketing system.

This endpoint allows you to create a new contact with basic information like name, email, and surname.

If double opt-in is enabled,
the contact will be created with a pending status and a confirmation email will be sent.

- **Method**: `POST`
- **Path**: `/api/reach/v1/contacts`

#### reach_contacts_get

Get the full details of a single contact.

Alongside the contact's own attributes this returns the tags assigned to it and the
values it holds for the profile's custom contact fields.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/contacts/{contactUuid}`

#### reach_contacts_delete-profile

Permanently delete a contact from a profile.

The contact is removed together with its custom field values and tag assignments.

- **Method**: `DELETE`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/contacts/{contactUuid}`

#### reach_contacts_update

Update a contact's attributes and custom field values.

Only the properties present in the request body are changed, so a partial body is enough
to change a single attribute. Sending a property as `null` clears it.

The response carries the contact's core attributes. Read back its tags, custom field
values, source and note with `GET /api/reach/v1/profiles/{profileUuid}/contacts/{contactUuid}`.

- **Method**: `PATCH`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/contacts/{contactUuid}`

#### reach_contacts_create-in-bulk

Create many contacts in a profile in a single call.

The contacts are imported in the background, so a success response means the import was
accepted rather than finished. Contacts whose email already exists in the profile are
left as they are. If double opt-in is enabled, new contacts start off pending and are
sent a confirmation email.

- **Method**: `POST`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/contacts/bulk`

#### reach_contacts_list-profile

Get a paginated list of contacts belonging to a profile.

Contacts can be filtered by subscription status, by tag, and by an email search term.
The `meta.total` field of the response is the number of contacts matching the filters,
so calling this endpoint without filters gives the profile's total contact count.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/contacts`

#### reach_contacts_create-bulk

Create a new contact in the email marketing system.

This endpoint allows you to create a new contact with basic information like name, email, and surname.

If double opt-in is enabled, the contact will be created with a pending status
and a confirmation email will be sent.

- **Method**: `POST`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/contacts`

#### reach_segments_list

Get a list of all contact segments.

This endpoint returns a list of contact segments that can be used to organize contacts.

**Deprecated.** This endpoint cannot target a profile, so it always falls back to
the client's default profile and cannot list the segments of any other profile. Use
`GET /api/reach/v1/profiles/{profileUuid}/segmentation/segments` instead.

- **Method**: `GET`
- **Path**: `/api/reach/v1/segmentation/segments`

#### reach_segments_create

Create a new contact segment.

This endpoint allows creating a new contact segment that can be used to organize contacts.
The segment can be configured with specific criteria like email, name, subscription status, etc.

**Deprecated.** This endpoint cannot target a profile, so it always falls back to
the client's default profile and cannot create segments in any other profile. Use
`POST /api/reach/v1/profiles/{profileUuid}/segmentation/segments` instead.

- **Method**: `POST`
- **Path**: `/api/reach/v1/segmentation/segments`

#### reach_segments_count-profile-contacts

Count the contacts currently matching a segment without listing them.

Cheaper than paging through the segment contacts endpoint when only the size is needed.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}/count`

#### reach_segments_list-profile-contacts

Retrieve contacts associated with a specific segment for a given profile.

This endpoint allows you to fetch and filter contacts that belong to a particular segment,
identified by its UUID, scoped to a specific profile.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}/contacts`

#### reach_segments_profile

Get a single segment of a profile, including the conditions that define it.

To retrieve the contacts currently matching those conditions, use the segment contacts
endpoint instead.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}`

#### reach_segments_update-profile

Rename a segment and/or replace the conditions that define it.

`name` is always required. Omit `conditions` to rename without touching the conditions;
supply them and they replace the existing set entirely rather than being merged into it.
Contacts are never modified, but which of them match the segment can change immediately.

- **Method**: `PUT`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}`

#### reach_segments_delete-profile

Delete a segment.

Only the segment definition is removed. The contacts that matched it are left untouched.

- **Method**: `DELETE`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}`

#### reach_segments_list-filter-attributes

List every attribute a segment condition can filter on, with the operators each attribute
accepts, the value format they expect and, where the value is constrained, the allowed
values.

The list is profile specific: it includes the profile's custom contact fields, its tags and
its 20 most recently published campaigns, so the valid attributes cannot be hardcoded. Read
it before creating or updating a segment to discover the valid `attribute`, `operator` and
`value` combinations.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/segmentation/filters/attributes`

#### reach_segments_preview-contacts-matching-conditions

Preview the contacts matching a set of conditions without saving a segment.

The body is the same set of conditions accepted when creating or updating a segment, so this
is how to check who a filter reaches, and how many, before persisting it. Nothing is stored
and no contact is modified.

Call the segment filter attributes endpoint first to discover the valid `attribute`,
`operator` and `value` combinations.

- **Method**: `POST`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/segmentation/filters/contacts`

#### reach_segments_list-profile

Get a paginated list of the segments defined in a profile.

Each entry carries the number of contacts currently matching it, which is recalculated on
read rather than stored. Use `count_type` to count either every matching contact or only
the subscribed ones.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/segmentation/segments`

#### reach_segments_create-profile

Create a segment in a profile.

A segment is a saved set of conditions rather than a fixed list, so its membership changes
as contacts change. Creating one does not modify any contact.

- **Method**: `POST`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/segmentation/segments`

#### reach_segments_list-contacts

Retrieve contacts associated with a specific segment.

This endpoint allows you to fetch and filter contacts that belong to a particular segment,
identified by its UUID.

**Deprecated.** This endpoint cannot target a profile, so it always falls back to
the client's default profile and cannot read segments of any other profile. Use
`GET /api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}/contacts` instead.

- **Method**: `GET`
- **Path**: `/api/reach/v1/segmentation/segments/{segmentUuid}/contacts`

#### reach_segments_get

Get details of a specific segment.

This endpoint retrieves information about a single segment identified by UUID.
Segments are used to organize and group contacts based on specific criteria.

**Deprecated.** This endpoint cannot target a profile, so it always falls back to
the client's default profile and cannot read segments of any other profile. Use
`GET /api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}` instead.

- **Method**: `GET`
- **Path**: `/api/reach/v1/segmentation/segments/{segmentUuid}`

#### reach_tags_assign-contact-to

Assign a tag to a single contact.

Unlike the bulk endpoint this is applied immediately rather than queued. Assigning a tag
the contact already carries succeeds without duplicating it.

- **Method**: `POST`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/tags/{tagUuid}/contacts/{contactUuid}`

#### reach_tags_remove-contact-from

Remove a tag from a single contact.

Unlike the bulk endpoint this is applied immediately rather than queued. Neither the tag
nor the contact is deleted.

- **Method**: `DELETE`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/tags/{tagUuid}/contacts/{contactUuid}`

#### reach_tags_assign-contacts-to

Assign a tag to many contacts at once.

Pass `contact_uuids` to target specific contacts, or `all_contacts` to target every contact
in the profile. The work is queued, so a success response means it was accepted rather than
finished. Contacts that already carry the tag are left alone.

- **Method**: `POST`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/tags/{tagUuid}/contacts`

#### reach_tags_remove-contacts-from

Remove a tag from many contacts at once.

Pass `contact_uuids` to target specific contacts, or `all_contacts` to target every contact
in the profile. The work is queued, so a success response means it was accepted rather than
finished. The tag itself and the contacts are not deleted.

- **Method**: `DELETE`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/tags/{tagUuid}/contacts`

#### reach_tags_delete

Delete a tag and remove it from every contact carrying it.

The contacts themselves are not deleted. This is idempotent: deleting a tag that does not
exist in the profile still succeeds.

- **Method**: `DELETE`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/tags/{tagUuid}`

#### reach_tags_rename

Rename a tag.

The contacts assigned to the tag are unaffected. Names are unique within a profile, so
renaming a tag to a name that is already taken is rejected.

- **Method**: `PATCH`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/tags/{tagUuid}`

#### reach_tags_list-profile

Get all tags defined in a profile.

Tags are the way contacts are grouped in Reach, and can be used to filter the contact
list or to build segments.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/tags`

#### reach_tags_create-or-find

Create tags in a profile.

Names that already exist in the profile are not duplicated: the existing tag is returned
instead, so the call is safe to repeat. Every tag in the request is returned, whether it
was created now or already existed.

- **Method**: `POST`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/tags`

#### reach_forms_get

Get a single form with the URL of its hosted template and the tags it applies to the contacts
it captures.

There is no ready-made embed snippet in the response - either serve the template HTML yourself
or build your own embed around the form uuid.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/forms/{formUuid}`

#### reach_forms_delete

Permanently delete a form together with its template.

A form that has already captured submissions cannot be deleted, so that the contacts it collected
are never silently discarded - pause the form instead to stop it collecting new ones. Views alone
do not block deletion.

- **Method**: `DELETE`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/forms/{formUuid}`

#### reach_forms_list

Get a paginated list of the signup forms in a profile.

Each form carries a reference to the template that renders it. Get the form details for a
directly usable template URL and for the tags the form puts on the contacts it captures.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/forms`

#### reach_profiles_domain-dns-status

Retrieve the DNS configuration status for a profile's domain.

This endpoint reports the state of MX, SPF, DKIM and DMARC records, including the
actual records found and the suggested records required for correct email delivery.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/domains/dns-status`

#### reach_profiles_connected-sending-domain

Get the sending domain connected to the profile, its verification status and any suspended
sender addresses.

Campaigns only go out once a domain is connected and active, so this is the cheapest way to
check that precondition before building one. A profile with no domain connected returns the
same shape with every field set to `null`. For the individual MX, SPF, DKIM and DMARC records
behind the status, use the DNS status endpoint.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/domains`

#### reach_profiles_list-plan-feature-access

List which plan features the profile can use.

This is the feature lock matrix, not a usage quota. `available` means the feature can be
used right now and `locked` means it is not part of the base plan, so an upgrade is needed.
For remaining emails, recipients and AI credits use the limits endpoint instead.

Worth checking before building something that cannot be activated afterwards, such as an
automation on a plan without automation activation.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/features`

#### reach_profiles_remaining-plan-limits

Get how much of the plan is left for the current period.

Two things to keep in mind before you build alerting on this. The period is a calendar month
rather than a billing anniversary, so the counters reset on the 1st no matter when the
subscription started. And usage is tracked per order, so every profile on the same order shares
one pool and reports the same numbers here. Only the current period is available, past usage is
not kept.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/limits`

#### reach_profiles_list

This endpoint returns all profiles available to the client, including their basic information.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles`

#### reach_templates_list-email

Get a list of the email templates in a profile, most recently updated first.

Templates are the reusable email bodies a campaign is built from. The list is not paginated
and only the metadata is returned - the template content itself is not exposed. Use the
`uuid` of a template as the `template_uuid` when creating a campaign.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/templates`

#### reach_templates_create-email

Create an email template in a profile.

The template holds the HTML body a campaign reuses, so it can be created before any
campaign exists. Only the template metadata comes back - keep the returned `uuid` to
reference it as the `template_uuid` of a campaign.

- **Method**: `POST`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/templates`

### `hostinger-vps-mcp`

#### vps_data-centers_list

Retrieve all available data centers.

Use this endpoint to view location options before deploying VPS instances.

- **Method**: `GET`
- **Path**: `/api/vps/v1/data-centers`

#### vps_docker_containers

Retrieves a list of all containers belonging to a specific Docker Compose project on the virtual machine. 

This endpoint returns detailed information about each container including
their current status, port mappings, and runtime configuration.

Use this to monitor the health and state of all services within your Docker Compose project.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/containers`

#### vps_docker_get

Retrieves the complete project information including the docker-compose.yml
file contents, project metadata, and current deployment status.

This endpoint provides the full configuration and state details of a specific Docker Compose project. 

Use this to inspect project settings, review the compose file, or check the overall project health.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}`

#### vps_docker_delete

Completely removes a Docker Compose project from the virtual machine, stopping all containers and cleaning up 
associated resources including networks, volumes, and images. 

This operation is irreversible and will delete all project data. 

Use this when you want to permanently remove a project and free up system resources.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/down`

#### vps_docker_list

Retrieves a list of all Docker Compose projects currently deployed on the virtual machine. 

This endpoint returns basic information about each project including name,
status, file path and list of containers with details about their names,
image, status, health and ports. Container stats are omitted in this
endpoint. If you need to get detailed information about container with
stats included, use the `Get project containers` endpoint.

Use this to get an overview of all Docker projects on your VPS instance.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker`

#### vps_docker_create

Deploy new project from docker-compose.yaml contents or download contents from URL. 

URL can be Github repository url in format https://github.com/[user]/[repo]
and it will be automatically resolved to docker-compose.yaml file in
master branch. Any other URL provided must return docker-compose.yaml
file contents.

If project with the same name already exists, existing project will be replaced.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker`

#### vps_docker_logs

Retrieves aggregated log entries from all services within a Docker Compose project. 

This endpoint returns recent log output from each container, organized by service name with timestamps. 
The response contains the last 300 log entries across all services. 

Use this for debugging, monitoring application behavior, and
troubleshooting issues across your entire project stack.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/logs`

#### vps_docker_restart

Restarts all services in a Docker Compose project by stopping and starting
containers in the correct dependency order.

This operation preserves data volumes and network configurations while refreshing the running containers. 

Use this to apply configuration changes or recover from service failures.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/restart`

#### vps_docker_start

Starts all services in a Docker Compose project that are currently stopped. 

This operation brings up containers in the correct dependency order as defined in the compose file. 

Use this to resume a project that was previously stopped or to start services after a system reboot.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/start`

#### vps_docker_stop

Stops all running services in a Docker Compose project while preserving
container configurations and data volumes.

This operation gracefully shuts down containers in reverse dependency order. 

Use this to temporarily halt a project without removing data or configurations.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/stop`

#### vps_docker_update

Updates a Docker Compose project by pulling the latest image versions and
recreating containers with new configurations.

This operation preserves data volumes while applying changes from the compose file. 

Use this to deploy application updates, apply configuration changes, or
refresh container images to their latest versions.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/update`

#### vps_firewall_activate

Activate a firewall for a specified virtual machine.

Only one firewall can be active for a virtual machine at a time.

Use this endpoint to apply firewall rules to VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall/{firewallId}/activate/{virtualMachineId}`

#### vps_firewall_deactivate

Deactivate a firewall for a specified virtual machine.

Use this endpoint to remove firewall protection from VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall/{firewallId}/deactivate/{virtualMachineId}`

#### vps_firewall_get

Retrieve firewall by its ID and rules associated with it.

Use this endpoint to view specific firewall configuration and rules.

- **Method**: `GET`
- **Path**: `/api/vps/v1/firewall/{firewallId}`

#### vps_firewall_delete

Delete a specified firewall.

Any virtual machine that has this firewall activated will automatically have it deactivated.

Use this endpoint to remove unused firewall configurations.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/firewall/{firewallId}`

#### vps_firewall_list

Retrieve all available firewalls.

Use this endpoint to view existing firewall configurations.

- **Method**: `GET`
- **Path**: `/api/vps/v1/firewall`

#### vps_firewall_create

Create a new firewall.

Use this endpoint to set up new firewall configurations for VPS security.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall`

#### vps_firewall_update-rule

Update a specific firewall rule from a specified firewall.

Any virtual machine that has this firewall activated will lose sync with the firewall
and will have to be synced again manually.

Use this endpoint to modify existing firewall rules.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/firewall/{firewallId}/rules/{ruleId}`

#### vps_firewall_delete-rule

Delete a specific firewall rule from a specified firewall.

Any virtual machine that has this firewall activated will lose sync with the firewall
and will have to be synced again manually.

Use this endpoint to remove specific firewall rules.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/firewall/{firewallId}/rules/{ruleId}`

#### vps_firewall_replace-all-rules-in-group

Replaces all firewall rules within a specified firewall group with the provided set of rules
in a single atomic operation, instead of creating or deleting rules one by one.

Any virtual machine using this firewall group will need to be synchronized after replacing rules;
pass the "sync" parameter to trigger synchronization immediately.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/firewall/{firewallId}/rules`

#### vps_firewall_create-rule

Create new firewall rule for a specified firewall.

By default, the firewall drops all incoming traffic,
which means you must add accept rules for all ports you want to use.

Any virtual machine that has this firewall activated will lose sync with the firewall
and will have to be synced again manually.

Use this endpoint to add new security rules to firewalls.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall/{firewallId}/rules`

#### vps_firewall_sync-to-all-assigned-v-ms

Sync a firewall's rules to every virtual machine it's assigned to.

Firewall can lose sync with a virtual machine if the firewall has new rules added, removed or updated.

Use this endpoint to apply updated firewall rules to all VPS instances assigned to the firewall.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall/{firewallId}/sync`

#### vps_firewall_sync

Deprecated: use `POST /api/vps/v1/firewall/{firewallId}/sync` instead, which syncs the firewall
to all virtual machines assigned to it.

Sync a firewall for a specified virtual machine.

Firewall can lose sync with virtual machine if the firewall has new rules added, removed or updated.

Use this endpoint to apply updated firewall rules to VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall/{firewallId}/sync/{virtualMachineId}`

#### vps_post-install-scripts_get

Retrieve post-install script by its ID.

Use this endpoint to view specific automation script details.

- **Method**: `GET`
- **Path**: `/api/vps/v1/post-install-scripts/{postInstallScriptId}`

#### vps_post-install-scripts_update

Update a specific post-install script.

Use this endpoint to modify existing automation scripts.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/post-install-scripts/{postInstallScriptId}`

#### vps_post-install-scripts_delete

Delete a post-install script from your account.
       
Use this endpoint to remove unused automation scripts.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/post-install-scripts/{postInstallScriptId}`

#### vps_post-install-scripts_list

Retrieve post-install scripts associated with your account.

Use this endpoint to view available automation scripts for VPS deployment.

- **Method**: `GET`
- **Path**: `/api/vps/v1/post-install-scripts`

#### vps_post-install-scripts_create

Add a new post-install script to your account, which can then be used after virtual machine installation.

The script contents will be saved to the file `/post_install` with executable attribute set
and will be executed once virtual machine is installed.
The output of the script will be redirected to `/post_install.log`. Maximum script size is 48KB.

Use this endpoint to create automation scripts for VPS setup tasks.

- **Method**: `POST`
- **Path**: `/api/vps/v1/post-install-scripts`

#### vps_public-keys_attach

Attach existing public keys from your account to a specified virtual machine.

Multiple keys can be attached to a single virtual machine.

Use this endpoint to enable SSH key authentication for VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/public-keys/attach/{virtualMachineId}`

#### vps_public-keys_delete

Delete a public key from your account. 

**Deleting public key from account does not remove it from virtual machine** 
       
Use this endpoint to remove unused SSH keys from account.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/public-keys/{publicKeyId}`

#### vps_public-keys_list

Retrieve public keys associated with your account.

Use this endpoint to view available SSH keys for VPS authentication.

- **Method**: `GET`
- **Path**: `/api/vps/v1/public-keys`

#### vps_public-keys_create

Add a new public key to your account.

Use this endpoint to register SSH keys for VPS authentication.

- **Method**: `POST`
- **Path**: `/api/vps/v1/public-keys`

#### vps_templates_get

Retrieve detailed information about a specific OS template for virtual machines.

Use this endpoint to view specific template specifications before deployment.

- **Method**: `GET`
- **Path**: `/api/vps/v1/templates/{templateId}`

#### vps_templates_list

Retrieve available OS templates for virtual machines.

Use this endpoint to view operating system options before creating or recreating VPS instances.

- **Method**: `GET`
- **Path**: `/api/vps/v1/templates`

#### vps_actions_get

Retrieve detailed information about a specific action performed on a specified virtual machine.

Use this endpoint to monitor specific VPS operation status and details.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/actions/{actionId}`

#### vps_actions_list

Retrieve actions performed on a specified virtual machine.

Actions are operations or events that have been executed on the virtual
machine, such as starting, stopping, or modifying the machine. This endpoint
allows you to view the history of these actions, providing details about
each action, such as the action name, timestamp, and status.

Use this endpoint to view VPS operation history and troubleshoot issues.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/actions`

#### vps_virtual-machines_attached-public-keys

Retrieve public keys attached to a specified virtual machine.

Use this endpoint to view SSH keys configured for specific VPS instances.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/public-keys`

#### vps_backups_list

Retrieve backups for a specified virtual machine.

Use this endpoint to view available backup points for VPS data recovery.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/backups`

#### vps_backups_restore

Restore a backup for a specified virtual machine.

The system will then initiate the restore process, which may take some time depending on the size of the backup.

**All data on the virtual machine will be overwritten with the data from the backup.**

Use this endpoint to recover VPS data from backup points.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/backups/{backupId}/restore`

#### vps_virtual-machines_set-hostname

Set hostname for a specified virtual machine.

Changing hostname does not update PTR record automatically.
If you want your virtual machine to be reachable by a hostname, 
you need to point your domain A/AAAA records to virtual machine IP as well.

Use this endpoint to configure custom hostnames for VPS instances.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/hostname`

#### vps_virtual-machines_reset-hostname

Reset hostname and PTR record of a specified virtual machine to default value.

Use this endpoint to restore default hostname configuration for VPS instances.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/hostname`

#### vps_virtual-machines_get

Retrieve detailed information about a specified virtual machine.

Use this endpoint to view comprehensive VPS configuration and status.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}`

#### vps_virtual-machines_list

Retrieve all available virtual machines.

Use this endpoint to view available VPS instances.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines`

#### vps_virtual-machines_purchase

Purchase and setup a new virtual machine.

If virtual machine setup fails for any reason, login to
[hPanel](https://hpanel.hostinger.com/) and complete the setup manually.

If no payment method is provided, your default payment method will be used automatically.

If the response is `202 Accepted`, the payment is still being processed and the virtual machine
was not set up. Login to
[hPanel](https://hpanel.hostinger.com/) and complete the setup manually.

Use this endpoint to create new VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines`

#### vps_monarx_scan-metrics

Retrieve scan metrics for the [Monarx](https://www.monarx.com/) malware scanner
installed on a specified virtual machine.

The scan metrics provide detailed information about malware scans performed
by Monarx, including number of scans, detected threats, and other relevant
statistics. This information is useful for monitoring security status of the
virtual machine and assessing effectiveness of the malware scanner.

Use this endpoint to monitor VPS security scan results and threat detection.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/monarx`

#### vps_monarx_install

Install the Monarx malware scanner on a specified virtual machine.

[Monarx](https://www.monarx.com/) is a security tool designed to detect and
prevent malware infections on virtual machines. By installing Monarx, users
can enhance the security of their virtual machines, ensuring that they are
protected against malicious software.

Use this endpoint to enable malware protection on VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/monarx`

#### vps_monarx_uninstall

Uninstall the Monarx malware scanner on a specified virtual machine.

If Monarx is not installed, the request will still be processed without any effect.

Use this endpoint to remove malware scanner from VPS instances.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/monarx`

#### vps_virtual-machines_metrics

Retrieve historical metrics for a specified virtual machine.

It includes the following metrics: 
- CPU usage
- Memory usage
- Disk usage
- Network usage
- Uptime

Use this endpoint to monitor VPS performance and resource utilization over time.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/metrics`

#### vps_virtual-machines_set-nameservers

Set nameservers for a specified virtual machine.

Be aware, that improper nameserver configuration can lead to the virtual
machine being unable to resolve domain names.

Use this endpoint to configure custom DNS resolvers for VPS instances.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/nameservers`

#### vps_ptr_create

Create or update a PTR (Pointer) record for a specified virtual machine.

Use this endpoint to configure reverse DNS lookup for VPS IP addresses.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/ptr/{ipAddressId}`

#### vps_ptr_delete

Delete a PTR (Pointer) record for a specified virtual machine.

Once deleted, reverse DNS lookups to the virtual machine's IP address will
no longer return the previously configured hostname.

Use this endpoint to remove reverse DNS configuration from VPS instances.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/ptr/{ipAddressId}`

#### vps_virtual-machines_set-panel-password

Set panel password for a specified virtual machine.

If virtual machine does not use panel OS, the request will still be processed without any effect.
Requirements for password are same as in the [recreate virtual machine
endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).

Use this endpoint to configure control panel access credentials for VPS instances.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/panel-password`

#### vps_recovery_start

Initiate recovery mode for a specified virtual machine.

Recovery mode is a special state that allows users to perform system rescue operations, 
such as repairing file systems, recovering data, or troubleshooting issues that prevent the virtual machine 
from booting normally. 

Virtual machine will boot recovery disk image and original disk image will be mounted in `/mnt` directory.

Use this endpoint to enable system rescue operations on VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/recovery`

#### vps_recovery_stop

Stop recovery mode for a specified virtual machine.

If virtual machine is not in recovery mode, this operation will fail.

Use this endpoint to exit system rescue mode and return VPS to normal operation.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/recovery`

#### vps_virtual-machines_recreate

Recreate a virtual machine from scratch.

The recreation process involves reinstalling the operating system and
resetting the virtual machine to its initial state.
Snapshots, if there are any, will be deleted.

## Password Requirements
Password will be checked against leaked password databases. 
Requirements for the password are:
- At least 12 characters long
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Is not leaked publicly

**This operation is irreversible and will result in the loss of all data stored on the virtual machine!**

Use this endpoint to completely rebuild VPS instances with fresh OS installation.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/recreate`

#### vps_virtual-machines_restart

Restart a specified virtual machine by fully stopping and starting it.

If the virtual machine was stopped, it will be started.

Use this endpoint to reboot VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/restart`

#### vps_virtual-machines_set-root-password

Set root password for a specified virtual machine.

Requirements for password are same as in the [recreate virtual machine
endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).

Use this endpoint to update administrator credentials for VPS instances.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/root-password`

#### vps_virtual-machines_setup

Setup newly purchased virtual machine with `initial` state.

Use this endpoint to configure and initialize purchased VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/setup`

#### vps_snapshots_get

Retrieve snapshot for a specified virtual machine.

Use this endpoint to view current VPS snapshot information.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot`

#### vps_snapshots_create

Create a snapshot of a specified virtual machine.

A snapshot captures the state and data of the virtual machine at a specific point in time, 
allowing users to restore the virtual machine to that state if needed. 
This operation is useful for backup purposes, system recovery, 
and testing changes without affecting the current state of the virtual machine.

**Creating new snapshot will overwrite the existing snapshot!**

Use this endpoint to capture VPS state for backup and recovery purposes.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot`

#### vps_snapshots_delete

Delete a snapshot of a specified virtual machine.

Use this endpoint to remove VPS snapshots.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot`

#### vps_snapshots_restore

Restore a specified virtual machine to a previous state using a snapshot.

Restoring from a snapshot allows users to revert the virtual machine to that state,
which is useful for system recovery, undoing changes, or testing.

Use this endpoint to revert VPS instances to previous saved states.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot/restore`

#### vps_virtual-machines_start

Start a specified virtual machine.

If the virtual machine is already running, the request will still be processed without any effect.

Use this endpoint to power on stopped VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/start`

#### vps_virtual-machines_stop

Stop a specified virtual machine.

If the virtual machine is already stopped, the request will still be processed without any effect.

This is a compute-only power state change and does not affect billing. To stop future charges,
disable auto-renewal on the owning subscription.

Use this endpoint to power off running VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/stop`

### `hostinger-wordpress-mcp`

#### wordpress_ai-tools_show-option-status

Show the current AI option status for the Hostinger Tools plugin on the
specified WordPress installation. Filter by `option` to return a single
option, or omit it to return all options.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/hostinger-plugins/ai-option/status`

#### wordpress_ai-tools_set-option-status

Enable or disable an AI option for the Hostinger Tools plugin on the specified
WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/hostinger-plugins/ai-option/status`

#### wordpress_installations_check-if-are-valid

Check whether one or more WordPress installations are valid and working
correctly. Detects broken installations caused by missing files, broken
plugins, themes and similar issues.

Provide the WordPress installation (software) identifiers in the body. They
can be obtained from GET /api/hosting/v1/wordpress/installations (the `id`
field).

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/installations/check-is-valid`

#### wordpress_installations_delete

Delete the specified WordPress installation, with optional file and database
removal. This removes all associated components including plugins, themes,
staging websites and any other related data.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}`

#### wordpress_installations_detect

Trigger a background scan to detect WordPress installations for the account.

This operation is asynchronous: a successful response only means the scan has
been queued. Poll GET /api/hosting/v1/wordpress/installations to fetch the
detected installations once the scan completes.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/installations/detect`

#### wordpress_installations_import-website

Import WordPress website to the specified domain.

WARNING: this overwrites the website's existing contents and cannot be undone —
verify this is intended before calling this endpoint.

This endpoint allows you to import a WordPress website from archive and
database files that have been uploaded to the website's directory.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/wordpress/import`

#### wordpress_installations_install

Install WordPress on an existing website.

The website must already exist before calling this endpoint. To create a new
website first, use POST /api/hosting/v1/websites and poll
GET /api/hosting/v1/websites until it appears.

Call GET /api/hosting/v1/wordpress/installations filtered by username and
domain before proceeding to check whether WordPress is already installed on
the target domain/path. If WordPress already exists and `overwrite` is false
(the default), the async job will fail.

This operation is asynchronous: a successful response only means the install
job has been queued, not that WordPress is ready. Installation typically
takes 1-2 minutes. Poll GET /api/hosting/v1/wordpress/installations filtered
by username and domain to track progress. When the installation appears in
that list, WordPress is ready.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/installations`

#### wordpress_installations_list

List WordPress installations accessible to the authenticated client.

Use this endpoint to discover existing WordPress installations and to poll
for installation status after calling the install endpoint. When a newly
requested installation appears in this list, WordPress is ready. Filter by
username and domain to narrow results to a specific website.

Each installation includes a `valid` flag and, when invalid, a
`validationError` describing why.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/wordpress/installations`

#### wordpress_installations_list-core-updates

List available WordPress core updates for the specified installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/updates`

#### wordpress_installations_jwt-token

Return a JWT token used to authenticate requests against the specified
WordPress installation, including its MCP (Model Context Protocol) endpoint.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/jwt-token`

#### wordpress_installations_show-core-version

Show the WordPress core version for the specified installation, along with
known vulnerabilities affecting it.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/version`

#### wordpress_installations_update-core

Update the WordPress core for the specified installation (minor update or a
specific version).

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the update
job has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/update`

#### wordpress_litespeed-cache_purge-lite-speed

Purge the LiteSpeed Cache for the specified WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/litespeed-cache/purge`

#### wordpress_litespeed-cache_show-lite-speed-status

Show the LiteSpeed Cache status for the specified WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/litespeed-cache/status`

#### wordpress_login_create-links

Create temporary auto-login links for the specified WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/login/links`

#### wordpress_maintenance_show-status

Show the maintenance mode status for the specified WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/maintenance/status`

#### wordpress_maintenance_toggle

Enable or disable maintenance mode for the specified WordPress installation,
based on the `enabled` flag.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/maintenance/toggle`

#### wordpress_object-cache_show-memcached-status

Show the Memcached object cache status for the specified WordPress
installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/memcached/status`

#### wordpress_object-cache_toggle-memcached

Activate or deactivate the Memcached object cache for the specified WordPress
installation, based on the `enabled` flag.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/memcached/toggle`

#### wordpress_plugins_activate

Activate an installed plugin on a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the activation
job has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/activate`

#### wordpress_plugins_deactivate

Deactivate an installed plugin on a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the
deactivation job has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/deactivate`

#### wordpress_plugins_deploy

Deploy a WordPress plugin from an already uploaded directory.

This endpoint allows you to deploy a WordPress plugin that has been uploaded to the website's directory.
The plugin will be activated and made available in the WordPress admin panel.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/wordpress/plugins/deploy`

#### wordpress_plugins_install

Install one or more plugins on an existing WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id`
field). Use GET /api/hosting/v1/wordpress/plugins to discover the plugin
slugs available for installation.

This operation is asynchronous: a successful response only means the install
job has been queued, not that the plugins are ready.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/install`

#### wordpress_plugins_list

List plugins recommended for installation on a WordPress installation that are
not yet installed.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/available`

#### wordpress_plugins_list-installed

List plugins installed on a WordPress installation, including their status,
available updates and known vulnerabilities.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins`

#### wordpress_plugins_search

Search the WordPress.org plugin directory for plugins available to install.

Use the returned `slug` values with
POST /api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/install.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/wordpress/plugins`

#### wordpress_plugins_list-suggested

List curated plugin suggestions grouped by website type.

Use the returned `slug` values with
POST /api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/install.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/wordpress/plugins/suggested`

#### wordpress_plugins_check-if-woo-commerce-is-installed

Check whether WooCommerce is installed on any WordPress installation of a
domain. Optionally filter by domain to scope the check.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/wordpress/plugins/is-woocommerce-installed`

#### wordpress_plugins_uninstall

Uninstall one or more plugins from a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the uninstall
job has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/uninstall`

#### wordpress_plugins_update-hostinger

Update a Hostinger plugin to its latest version on a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the update job
has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/hostinger/update`

#### wordpress_plugins_update

Update one or more installed plugins to their latest version on a WordPress
installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the update job
has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/update`

#### wordpress_themes_activate

Activate an installed theme on a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the activation
job has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/themes/activate`

#### wordpress_themes_deploy

Deploy a WordPress theme from an already uploaded directory.

This endpoint allows you to deploy a WordPress theme that has been uploaded to the website's directory.
The theme can be optionally activated after deployment.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/wordpress/themes/deploy`

#### wordpress_themes_install

Install a theme on an existing WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id`
field).

When the theme is one of the Hostinger themes (hostinger-blog,
hostinger-affiliate-theme, hostinger-ai-theme), the optional `palette`,
`layout`, and `font` fields are forwarded to the custom installer (defaults:
palette1, layout1, default). For any other theme they are ignored.

This operation is asynchronous: a successful response only means the install
job has been queued, not that the theme is ready.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/themes/install`

#### wordpress_themes_list-installed

List themes installed on a WordPress installation, including their status,
available updates and known vulnerabilities.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/themes`

#### wordpress_themes_list

List WordPress themes available to install.

Use the returned `slug` values with
POST /api/hosting/v1/accounts/{username}/wordpress/{software}/themes/install.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/wordpress/themes`

#### wordpress_themes_uninstall

Uninstall one or more themes from a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the uninstall
job has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/themes/uninstall`

#### wordpress_themes_update

Update one or more installed themes to their latest version on a WordPress
installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the update job
has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/themes/update`
