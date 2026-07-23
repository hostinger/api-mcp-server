# hostinger-api-mcp

Model Context Protocol (MCP) server for Hostinger API.

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
npm install -g hostinger-api-mcp

# Or with yarn
yarn global add hostinger-api-mcp

# Or with pnpm
pnpm add -g hostinger-api-mcp
```

## Update

To update the MCP server to the latest version, use one of the following commands, depending on your package manager:

```bash
# Update globally from npm
npm update -g hostinger-api-mcp

# Or with yarn
yarn global upgrade hostinger-api-mcp

# Or with pnpm
pnpm update -g hostinger-api-mcp
```

## Binaries

This package installs the following MCP server commands:

- `hostinger-api-mcp` — unified server with every tool (235 total)
- `hostinger-agency-hosting-mcp` — 23 tools for agency-hosting
- `hostinger-billing-mcp` — 8 tools for billing
- `hostinger-dns-mcp` — 8 tools for dns
- `hostinger-domains-mcp` — 23 tools for domains
- `hostinger-ecommerce-mcp` — 12 tools for ecommerce
- `hostinger-horizons-mcp` — 2 tools for horizons
- `hostinger-hosting-mcp` — 48 tools for hosting
- `hostinger-mail-mcp` — 2 tools for mail
- `hostinger-reach-mcp` — 12 tools for reach
- `hostinger-vps-mcp` — 62 tools for vps
- `hostinger-wordpress-mcp` — 35 tools for wordpress

Pick the binary that matches your agent's scope. `hostinger-api-mcp` remains the backwards-compatible default.

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

// Call a tool
const result = await client.callTool({
  name: "billing_getCatalogItemListV1",
  arguments: { category: "DOMAIN" }
});
console.log("Tool result:", result);
```

## Available Tools

This MCP server provides the following tools:

### `hostinger-agency-hosting-mcp`

#### agencyHosting_deployNodeStaticWebsite

Deploy a node-static Agency Plan (h5g) website from an archive file. WARNING: this overwrites the website's existing contents and cannot be undone — always confirm with the user before proceeding. Use this for Agency Plan websites of type node-static (a Node.js-built static site that requires a build step or a plain simple static site). The tool resolves the website from its domain, uploads the archive to the website's file browser over TUS, and triggers the build-assets process which builds the site and deploys the result to public_html. This operation is synchronous: the build and deployment complete before the tool returns, so the website is live as soon as the tool finishes successfully — there is no separate asynchronous build to wait for or poll. For plain PHP applications that should be extracted as-is, use agencyHosting_deployPhpApplication instead. The website UID is automatically resolved from the domain.

- **Method**: `custom`
- **Path**: `custom`

#### agencyHosting_deployPhpApplication

Deploy a PHP (or other non-build) Agency Plan (h5g) website from an archive file. WARNING: this overwrites the website's existing contents and cannot be undone — always confirm with the user before proceeding. Use this for Agency Plan websites where the archive contents should be extracted and served as-is with no build step (e.g., PHP applications). The tool resolves the website from its domain, uploads the archive to the website's file browser over TUS, and triggers the import-archive process which overwrites the website contents with the archive contents. This operation is synchronous: the archive is extracted and deployed before the tool returns, so the website is live as soon as the tool finishes successfully — there is no separate asynchronous build to wait for or poll. For node-static websites that require a build step, use agencyHosting_deployNodeStaticWebsite instead. The website UID is automatically resolved from the domain.

- **Method**: `custom`
- **Path**: `custom`

#### agency-hosting_listAvailableDatacentersForAnAgencyPlanOrderV1

Lists the datacenters available for provisioning a new website on the given Agency Plan
hosting order.

Each datacenter includes a `pinger_url` you can ping from the client to measure round-trip
latency; comparing the results across datacenters lets you pick the nearest one (lowest
ping) before choosing its `code` as the `datacenter_code` when creating a website setup.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/orders/{order_id}/datacenters`

#### agency-hosting_changeAgencyPlanWebsiteDomainV1

Changes the primary domain for an Agency Plan website.

Provide the current domain in the path and the new domain in the request body.
Set domain to null to revert to the temporary domain.

- **Method**: `PUT`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/domains/{from_domain}`

#### agency-hosting_linkDomainToAgencyPlanWebsiteV1

Links a domain to the specified Agency Plan website so it can serve traffic for that domain.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/domains`

#### agency-hosting_listAgencyPlanDomainsV1

Returns a paginated list of domains associated with Agency Plan websites accessible to the authenticated client.

Use the website_uuids filter to narrow results to specific websites.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/domains`

#### agency-hosting_unlinkDomainFromAgencyPlanWebsiteV1

Unlinks a domain from the specified Agency Plan website.

The website stops serving traffic on this domain immediately.

Website files and database are preserved, and any other linked domains remain accessible.

If this is the only domain on the website, unlinking leaves the website without an accessible domain.

- **Method**: `DELETE`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/domains/{domain}`

#### agency-hosting_importAgencyPlanWebsiteFromArchiveV1

Imports an Agency Plan website from an already-uploaded archive.

Upload the archive to the website's root directory via file browser first, then provide its
filename in this request. Website contents are overwritten by the archive contents. Supported
archive types: .zip, .tar, .tar.gz, .tgz.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/files/import-archive`

#### agency-hosting_provisionANewAgencyPlanWebsiteV1

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

#### agency-hosting_getAgencyPlanWebsiteSetupStatusV1

Returns the current status of an Agency Plan website setup started via the setups
endpoint.

Poll this endpoint using the `setup_uuid` returned from the provisioning request until
`status` becomes `completed`, at which point `website_uid` identifies the new website.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/orders/{order_id}/websites/setups/{setup_uuid}`

#### agency-hosting_buildAgencyPlanWebsiteNodeJSAssetsV1

Builds and deploys a Node.js application for an Agency Plan website from an already-uploaded archive.

Upload the archive to file browser first, then provide its relative path from document root in this request.
Website contents are overwritten by the build result, which is deployed to public_html.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/build-assets`

#### agency-hosting_clearAgencyPlanWebsiteCacheV1

Clears cache for all domains associated with an Agency Plan website, including its preview domain.

This operation clears all cache types for the website.

- **Method**: `DELETE`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/cache`

#### agency-hosting_listAgencyPlanWebsiteCronJobsV1

Returns a paginated list of cron jobs configured for an Agency Plan website.

Each entry includes the schedule expression and the command executed on that schedule.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/cron-jobs`

#### agency-hosting_createAgencyPlanWebsiteCronJobV1

Creates a cron job for an Agency Plan website from a schedule expression and a command.

Returns the created cron job, including its uuid, which is required to delete the cron job.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/cron-jobs`

#### agency-hosting_deleteAgencyPlanWebsiteCronJobV1

Permanently deletes the cron job identified by its uuid from an Agency Plan website.

The operation is idempotent: deleting a cron job that does not exist succeeds without error.

- **Method**: `DELETE`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/cron-jobs/{uuid}`

#### agency-hosting_listAgencyPlanWebsiteDatabasesV1

Returns a paginated list of MySQL databases created for an Agency Plan website.

Each entry includes the database's non-system users.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/databases`

#### agency-hosting_createAgencyPlanWebsiteDatabaseV1

Creates a MySQL database with a dedicated user for an Agency Plan website.

The database name, username, and password must all be provided by the caller.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/databases`

#### agency-hosting_deleteAgencyPlanWebsiteDatabaseV1

Permanently deletes a MySQL database and all its data from an Agency Plan website, including its users.

The operation is idempotent: deleting a database that does not exist succeeds without error.

- **Method**: `DELETE`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/databases/{database_name}`

#### agency-hosting_createAgencyPlanWebsiteDatabaseUserV1

Creates a user for an existing database on an Agency Plan website.

Each database supports a single non-system user; creating a user for a database that already has one fails.

- **Method**: `POST`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/databases/{database_name}/users`

#### agency-hosting_deleteAgencyPlanWebsiteDatabaseUserV1

Permanently deletes a database user from an Agency Plan website database, revoking all access it had.

The operation is idempotent: deleting a user that does not exist succeeds without error.

- **Method**: `DELETE`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/databases/{database_name}/users/{database_user_name}`

#### agency-hosting_getAgencyPlanWebsiteDetailsV1

Retrieves detailed information about a specific Agency Plan website, including configuration,
status, metadata, hosting plan details, and resource quotas.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}`

#### agency-hosting_deleteAgencyPlanWebsiteV1

Deletes an Agency Plan website and schedules cleanup of its resources.

This action is irreversible. Website files, databases, and linked domains are removed.

- **Method**: `DELETE`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}`

#### agency-hosting_listRunningAgencyPlanWebsiteProcessesV1

Lists active and recently completed asynchronous processes for an Agency Plan website.

Each process has a unique ID (for tracking), a type, and a status (running, completed, failed).
Poll this endpoint after initiating async operations (SSL setup, backups, cloning) to track progress.

- **Method**: `GET`
- **Path**: `/api/agency-hosting/v1/websites/{website_uid}/processes`

### `hostinger-billing-mcp`

#### billing_getCatalogItemListV1

Retrieve catalog items available for order.

Prices in catalog items is displayed as cents (without floating point),
e.g: float `17.99` is displayed as integer `1799`.

Use this endpoint to view available services and pricing before placing orders.

- **Method**: `GET`
- **Path**: `/api/billing/v1/catalog`

#### billing_createPurchaseOrderV1

Create a purchase order for any Hostinger product.

This unified endpoint places an order for one or more catalog items and
works across all Hostinger products, leveraging the existing billing
infrastructure. Use the [catalog endpoint](#tag/billing-catalog) to look
up the `item_id` values available for purchase.

If no payment method is provided, your default payment method will be used automatically.

This endpoint only places the order. Product-specific provisioning
(e.g. VPS setup or domain registration) is not performed here — once the
order completes, use the relevant product endpoints or
[hPanel](https://hpanel.hostinger.com/) to finalize setup.

Use this endpoint to purchase any product available in the catalog.

- **Method**: `POST`
- **Path**: `/api/billing/v1/orders`

#### billing_setDefaultPaymentMethodV1

Set the default payment method for your account.

Use this endpoint to configure the primary payment method for future orders.

- **Method**: `POST`
- **Path**: `/api/billing/v1/payment-methods/{paymentMethodId}`

#### billing_deletePaymentMethodV1

Delete a payment method from your account.

Use this endpoint to remove unused payment methods from user accounts.

- **Method**: `DELETE`
- **Path**: `/api/billing/v1/payment-methods/{paymentMethodId}`

#### billing_getPaymentMethodListV1

Retrieve available payment methods that can be used for placing new orders.

If you want to add new payment method,
please use [hPanel](https://hpanel.hostinger.com/billing/payment-methods).

Use this endpoint to view available payment options before creating orders.

- **Method**: `GET`
- **Path**: `/api/billing/v1/payment-methods`

#### billing_getSubscriptionListV1

Retrieve a list of all subscriptions associated with your account.

Use this endpoint to monitor active services and billing status.

- **Method**: `GET`
- **Path**: `/api/billing/v1/subscriptions`

#### billing_disableAutoRenewalV1

Disable auto-renewal for a subscription.

Use this endpoint when disable auto-renewal for a subscription.

- **Method**: `DELETE`
- **Path**: `/api/billing/v1/subscriptions/{subscriptionId}/auto-renewal/disable`

#### billing_enableAutoRenewalV1

Enable auto-renewal for a subscription.

Use this endpoint when enable auto-renewal for a subscription.

- **Method**: `PATCH`
- **Path**: `/api/billing/v1/subscriptions/{subscriptionId}/auto-renewal/enable`

### `hostinger-dns-mcp`

#### DNS_getDNSSnapshotV1

Retrieve particular DNS snapshot with contents of DNS zone records.

Use this endpoint to view historical DNS configurations for domains.

- **Method**: `GET`
- **Path**: `/api/dns/v1/snapshots/{domain}/{snapshotId}`

#### DNS_getDNSSnapshotListV1

Retrieve DNS snapshots for a domain.

Use this endpoint to view available DNS backup points for restoration.

- **Method**: `GET`
- **Path**: `/api/dns/v1/snapshots/{domain}`

#### DNS_restoreDNSSnapshotV1

Restore DNS zone to the selected snapshot.

Use this endpoint to revert domain DNS to a previous configuration.

- **Method**: `POST`
- **Path**: `/api/dns/v1/snapshots/{domain}/{snapshotId}/restore`

#### DNS_getDNSRecordsV1

Retrieve DNS zone records for a specific domain.

Use this endpoint to view current DNS configuration for domain management.

- **Method**: `GET`
- **Path**: `/api/dns/v1/zones/{domain}`

#### DNS_updateDNSRecordsV1

Update DNS records for the selected domain.

Using `overwrite = true` will replace existing records with the provided ones. 
Otherwise existing records will be updated and new records will be added.

Use this endpoint to modify domain DNS configuration.

- **Method**: `PUT`
- **Path**: `/api/dns/v1/zones/{domain}`

#### DNS_deleteDNSRecordsV1

Delete DNS records for the selected domain.

To filter which records to delete, add the `name` of the record and `type` to the filter. 
Multiple filters can be provided with single request.

If you have multiple records with the same name and type, and you want to delete only part of them,
refer to the `Update zone records` endpoint.

Use this endpoint to remove specific DNS records from domains.

- **Method**: `DELETE`
- **Path**: `/api/dns/v1/zones/{domain}`

#### DNS_resetDNSRecordsV1

Reset DNS zone to the default records.

Use this endpoint to restore domain DNS to original configuration.

- **Method**: `POST`
- **Path**: `/api/dns/v1/zones/{domain}/reset`

#### DNS_validateDNSRecordsV1

Validate DNS records prior to update for the selected domain.

If the validation is successful, the response will contain `200 Success` code.
If there is validation error, the response will fail with `422 Validation error` code.

Use this endpoint to verify DNS record validity before applying changes.

- **Method**: `POST`
- **Path**: `/api/dns/v1/zones/{domain}/validate`

### `hostinger-domains-mcp`

#### v2_getDomainVerificationsDIRECT

Retrieve a list of pending and completed domain verifications.

- **Method**: `GET`
- **Path**: `/api/v2/direct/verifications/active`

#### domains_checkDomainAvailabilityV1

Check availability of domain names across multiple TLDs.

Multiple TLDs can be checked at once.
If you want alternative domains with response, provide only one TLD and set `with_alternatives` to `true`.
TLDs should be provided without leading dot (e.g. `com`, `net`, `org`).

Endpoint has rate limit of 10 requests per minute.

Use this endpoint to verify domain availability before purchase.

- **Method**: `POST`
- **Path**: `/api/domains/v1/availability`

#### domains_getDomainForwardingV1

Retrieve domain forwarding data.

Use this endpoint to view current redirect configuration for domains.

- **Method**: `GET`
- **Path**: `/api/domains/v1/forwarding/{domain}`

#### domains_updateDomainForwardingV1

Update domain forwarding configuration.

Use this endpoint to modify existing redirect configuration for domains.

- **Method**: `PUT`
- **Path**: `/api/domains/v1/forwarding/{domain}`

#### domains_deleteDomainForwardingV1

Delete domain forwarding data.

Use this endpoint to remove redirect configuration from domains.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/forwarding/{domain}`

#### domains_createDomainForwardingV1

Create domain forwarding configuration.

Use this endpoint to set up domain redirects to other URLs.

- **Method**: `POST`
- **Path**: `/api/domains/v1/forwarding`

#### domains_getDomainAuthorizationCodeV1

Retrieve the authorization (EPP) code for a specified domain so it can be transferred
away from Hostinger to another registrar.

Requesting a new code invalidates any code retrieved previously.

Use this endpoint to obtain the code required to transfer a domain to another registrar.

- **Method**: `GET`
- **Path**: `/api/domains/v1/portfolio/{domain}/auth-code`

#### domains_enableDomainLockV1

Enable domain lock for the domain.

When domain lock is enabled,
the domain cannot be transferred to another registrar without first disabling the lock.

Use this endpoint to secure domains against unauthorized transfers.

- **Method**: `PUT`
- **Path**: `/api/domains/v1/portfolio/{domain}/domain-lock`

#### domains_disableDomainLockV1

Disable domain lock for the domain.

Domain lock needs to be disabled before transferring the domain to another registrar.

Use this endpoint to prepare domains for transfer to other registrars.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/portfolio/{domain}/domain-lock`

#### domains_getDomainDetailsV1

Retrieve detailed information for specified domain.

Use this endpoint to view comprehensive domain configuration and status.

- **Method**: `GET`
- **Path**: `/api/domains/v1/portfolio/{domain}`

#### domains_getDomainListV1

Retrieve all domains associated with your account.

Use this endpoint to view user's domain portfolio.

- **Method**: `GET`
- **Path**: `/api/domains/v1/portfolio`

#### domains_purchaseNewDomainV1

Purchase and register a new domain name.

If registration fails, login to [hPanel](https://hpanel.hostinger.com/) and check domain registration status.

If no payment method is provided, your default payment method will be used automatically.

If no WHOIS information is provided, default contact information for that TLD will be used.
Before making request, ensure WHOIS information for desired TLD exists in your account.

Some TLDs require `additional_details` to be provided and these will be validated before completing purchase.

Use this endpoint to register new domains for users.

- **Method**: `POST`
- **Path**: `/api/domains/v1/portfolio`

#### domains_enablePrivacyProtectionV1

Enable privacy protection for the domain.

When privacy protection is enabled, domain owner's personal information is hidden from public WHOIS database.

Use this endpoint to protect domain owner's personal information from public view.

- **Method**: `PUT`
- **Path**: `/api/domains/v1/portfolio/{domain}/privacy-protection`

#### domains_disablePrivacyProtectionV1

Disable privacy protection for the domain.

When privacy protection is disabled, domain owner's personal information is visible in public WHOIS database.

Use this endpoint to make domain owner's information publicly visible.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/portfolio/{domain}/privacy-protection`

#### domains_getDomainRenewalInformationV1

Retrieve renewal information for a specified domain, including its status and current
expiration date.

Use this endpoint to build renewal automation and expiry monitoring for a single domain.

- **Method**: `GET`
- **Path**: `/api/domains/v1/portfolio/{domain}/renewal`

#### domains_updateDomainNameserversV1

Set nameservers for a specified domain.

Be aware, that improper nameserver configuration can lead to the domain being unresolvable or unavailable.

Use this endpoint to configure custom DNS hosting for domains.

- **Method**: `PUT`
- **Path**: `/api/domains/v1/portfolio/{domain}/nameservers`

#### domains_getTransferV1

Retrieve the transfer for a specified domain.

Use this endpoint to track an incoming or outgoing registrar transfer and its status.

- **Method**: `GET`
- **Path**: `/api/domains/v1/transfers/{domain}`

#### domains_getTransferListV1

Retrieve all domain transfers in your portfolio.

Use this endpoint to monitor incoming and outgoing registrar transfers across your domains.

- **Method**: `GET`
- **Path**: `/api/domains/v1/transfers`

#### domains_getWHOISProfileV1

Retrieve a WHOIS contact profile.

Use this endpoint to view domain registration contact information.

- **Method**: `GET`
- **Path**: `/api/domains/v1/whois/{whoisId}`

#### domains_deleteWHOISProfileV1

Delete WHOIS contact profile.

Use this endpoint to remove unused contact profiles from account.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/whois/{whoisId}`

#### domains_getWHOISProfileListV1

Retrieve WHOIS contact profiles.

Use this endpoint to view available contact profiles for domain registration.

- **Method**: `GET`
- **Path**: `/api/domains/v1/whois`

#### domains_createWHOISProfileV1

Create WHOIS contact profile.

Use this endpoint to add new contact information for domain registration.

- **Method**: `POST`
- **Path**: `/api/domains/v1/whois`

#### domains_getWHOISProfileUsageV1

Retrieve domain list where provided WHOIS contact profile is used.

Use this endpoint to view which domains use specific contact profiles.

- **Method**: `GET`
- **Path**: `/api/domains/v1/whois/{whoisId}/usage`

### `hostinger-ecommerce-mcp`

#### ecommerce_getCustomStorefrontSetupInstructionsV1

Retrieve step-by-step setup instructions, formatted as Markdown, for connecting a custom sales
channel to your store and keeping your catalog, orders, shipping and payments in sync through
the Ecommerce API.

- **Method**: `GET`
- **Path**: `/api/ecommerce/v1/miscellaneous/custom-storefront-instructions`

#### ecommerce_enableManualPaymentMethodV1

Enable a manual payment method so the store can accept orders without an online payment provider.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/payment-methods/manual`

#### ecommerce_createDigitalProductV1

Create a published digital product with a single variant and an optional external download link.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/products/digital`

#### ecommerce_createPhysicalProductV1

Create a published physical product with a single variant priced in the store currency.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/products/physical`

#### ecommerce_listSalesChannelsV1

List a store's active sales channels with their full metadata.

- **Method**: `GET`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/sales-channels`

#### ecommerce_createCustomSalesChannelV1

Create a custom sales channel for a store. Build your own frontend and keep your catalog,
orders, shipping and payments in sync through the Ecommerce API.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/sales-channels`

#### ecommerce_updateSalesChannelV1

Update a custom sales channel. The merchant-facing `name` and the public `url`
(returned as the channel `domain`) can be changed. Pass `null` to clear a value.

- **Method**: `PATCH`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/sales-channels/{sales_channel_id}`

#### ecommerce_setStoreShippingV1

Set the flat-rate shipping price for a store, creating the shipping zone if it does not exist yet.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/shipping`

#### ecommerce_deleteStoreV1

Soft-delete a store owned by your account.

The underlying store data is preserved; only the store is marked as deleted.

- **Method**: `DELETE`
- **Path**: `/api/ecommerce/v1/stores/{store_id}`

#### ecommerce_getStoresV1

Retrieve the stores associated with your account.

- **Method**: `GET`
- **Path**: `/api/ecommerce/v1/stores`

#### ecommerce_createStoreV1

Create a new store for your account.

A primary sales channel is created alongside the store.

- **Method**: `POST`
- **Path**: `/api/ecommerce/v1/stores`

#### ecommerce_getStoreMetadataV1

Get a store's readiness metadata: whether payment methods and shipping are configured,
plus its default currency. Useful to verify prerequisites before building a storefront.

- **Method**: `GET`
- **Path**: `/api/ecommerce/v1/stores/{store_id}/metadata`

### `hostinger-horizons-mcp`

#### horizons_createWebsiteV1

Create new Hostinger Horizons website from the given message.\n
Use this tool when user asks you to create a website, landing page, blog
or any other type of application.\n
This tool initiates the website creation process and returns a website URL and ID.
The generation happens asynchronously.\n
After invoking this tool, your chat reply must be EXACTLY 1 sentence summarizing
that Hostinger Horizons is now creating their website and it will be ready in a few minutes
and you should provide the website URL to the user immediately
Do not write code.\n\nTo edit afterwards, users must go to Hostinger Horizons interface
in the provided website URL.
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

#### horizons_getWebsiteV1

Get a link for the user to edit their website in Hostinger Horizons interface.\n
Use this tool when user wants to modify, edit or add new features to an existing website.\n
Websites can only be edited in Hostinger Horizons interface in the provided website URL.

- **Method**: `GET`
- **Path**: `/api/horizons/v1/websites/{websiteId}`

### `hostinger-hosting-mcp`

#### hosting_importWordpressWebsite

Import a WordPress website from an archive file to a hosting server. This tool uploads a website archive (zip, tar, tar.gz, etc.) and a database dump (.sql file) to deploy a complete WordPress website. The archive will be extracted on the server automatically. Note: This process may take a while for larger sites. After upload completion, files are being extracted and the site will be available in a few minutes. The username will be automatically resolved from the domain.

- **Method**: `custom`
- **Path**: `custom`

#### hosting_deployWordpressPlugin

Deploy a WordPress plugin from a directory to a hosting server. This tool uploads all plugin files and triggers plugin deployment.

- **Method**: `custom`
- **Path**: `custom`

#### hosting_deployWordpressTheme

Deploy a WordPress theme from a directory to a hosting server. This tool uploads all theme files and triggers theme deployment. The uploaded theme can optionally be activated after deployment.

- **Method**: `custom`
- **Path**: `custom`

#### hosting_deployJsApplication

Deploy a JavaScript application from an archive file to a hosting server. IMPORTANT: the archive must ONLY contain application source files, not the build output, skip node_modules directory; also exclude all files matched by .gitignore if the ignore file exists. The build process will be triggered automatically on the server after the archive is uploaded. After deployment, use the hosting_listJsDeployments tool to check deployment status and track build progress.

- **Method**: `custom`
- **Path**: `custom`

#### hosting_deployStaticWebsite

Deploy a static website from an archive file to a hosting server. IMPORTANT: This tool only works for static websites with no build process. The archive must contain pre-built static files (HTML, CSS, JavaScript, images, etc.) ready to be served. If the website has a package.json file or requires a build command, use hosting_deployJsApplication instead. The archive will be extracted and deployed directly without any build steps. The username will be automatically resolved from the domain.

- **Method**: `custom`
- **Path**: `custom`

#### hosting_listJsDeployments

List javascript application deployments for checking their status. Use this tool when customer asks for the status of the deployment. This tool retrieves a paginated list of Node.js application deployments for a domain with optional filtering by deployment states.

- **Method**: `custom`
- **Path**: `custom`

#### hosting_showJsDeploymentLogs

Retrieve logs for a specified JavaScript application deployment for debugging purposes in case of failure.

- **Method**: `custom`
- **Path**: `custom`

#### hosting_clearWebsiteCacheV1

Permanently clears all server-side cache for the website at once. Use it when content was
updated and needs to be visible immediately, or after making major changes.

Also purges the Hostinger CDN cache when CDN is enabled on the website. For a WordPress
installation living in a subdirectory, pass the directory query parameter to clear its cache.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/cache/clear`

#### hosting_toggleCachelessModeV1

Turns development (cacheless) mode on or off, based on the enabled flag. When enabled, nothing
is cached, effectively turning off all caching for the website; use it while actively developing,
testing changes, debugging issues, or when real-time updates must be visible. Disable it after
finishing development work to restore the performance benefits of caching.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/cacheless-mode/toggle`

#### hosting_toggleWebsiteCacheV1

Turns server-side caching for the website on or off, based on the enabled flag. Enable it for
faster page loads, reduced server load, and improved user experience; recommended for production
websites. Disabling may impact performance; to temporarily bypass caching while developing or
debugging, prefer toggling cacheless mode instead.

Does nothing if caching is already in the requested state.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/cache/toggle`

#### hosting_listAccountCronJobsV1

Returns the list of cron jobs configured for the specified account, including their schedule and command.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/cron-jobs`

#### hosting_createAccountCronJobV1

Creates a cron job for the specified account from a schedule expression and a command.

Returns the created cron job, including its uid, which is required to delete the cron job or fetch its output.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/cron-jobs`

#### hosting_deleteAccountCronJobV1

Permanently deletes the cron job identified by its uid.

The uid is returned by the list cron jobs endpoint.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/cron-jobs/{uid}`

#### hosting_getCronJobOutputV1

Returns the output captured from the last execution of the cron job identified by its uid.

The uid is returned by the list cron jobs endpoint.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/cron-jobs/{uid}/output`

#### hosting_changeDatabasePasswordV1

Changes the password for the specified database user.

The database name must be the full name returned by the list databases endpoint.
The password must also be updated in any website configuration that uses this database.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/databases/{name}/change-password`

#### hosting_listAccountDatabasesV1

Returns a paginated list of databases for the specified account.

Use the domain and is_assigned filters to find databases assigned to a specific domain.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/databases`

#### hosting_createAccountDatabaseV1

Creates a database with a database user and password for the specified account.

The database name and user are automatically prefixed with the account username when needed.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/databases`

#### hosting_deleteAccountDatabaseV1

Permanently deletes a database and its remote connections.

The database name must be the full name returned by the list databases endpoint.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/databases/{name}`

#### hosting_createAccountDatabaseRemoteConnectionV1

Allows a remote host to connect to the specified database.

Provide an IPv4/IPv6 address, or "%" to allow any host. The database name must be
the full name returned by the list databases endpoint.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/databases/{name}/remote-connections`

#### hosting_deleteAccountDatabaseRemoteConnectionV1

Permanently removes a remote-access rule, revoking the given host's remote access to the database.

Identify the rule with the required ip query parameter (the IPv4/IPv6 address, or "%",
exactly as returned by the list remote connections endpoint). The database name must be
the full name returned by the list databases endpoint.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/databases/{name}/remote-connections`

#### hosting_listAccountDatabaseRemoteConnectionsV1

Returns the remote-access rules for the specified account: the remote hosts
(IPv4/IPv6 addresses, or "%" for any host) allowed to connect to the account databases.

Use the domain filter to only return rules for databases assigned to a specific domain.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/databases/remote-connections`

#### hosting_repairDatabaseV1

Repairs corrupted database tables asynchronously.

Use when database errors, crashes, or corruption are reported.
The database name must be the full name returned by the list databases endpoint.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/databases/{name}/repair`

#### hosting_getPhpMyAdminLinkV1

Returns a direct sign-on link to phpMyAdmin for the specified database.

Use this when a visual database interface is needed for SQL queries, imports, exports, or table management.
The database name must be the full name returned by the list databases endpoint.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/databases/{name}/phpmyadmin-link`

#### hosting_listAvailableDatacentersV1

Retrieve a list of datacenters available for setting up hosting plans
based on available datacenter capacity and hosting plan of your order.
The first item in the list is the best match for your specific order
requirements.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/datacenters`

#### hosting_generateAFreeSubdomainV1

Generate a unique free subdomain that can be used for hosting services without purchasing custom domains.
Free subdomains allow you to start using hosting services immediately
and you can always connect a custom domain to your site later.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/domains/free-subdomains`

#### hosting_listWebsiteParkedDomainsV1

Retrieve all parked or alias domains created under the selected website.

Use this endpoint to inspect parked domain configuration for a specific website,
including the parent domain and root directory assigned to each parked domain.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/parked-domains`

#### hosting_createWebsiteParkedDomainV1

Create a parked or alias domain for the selected website.

Provide a domain name or IP address to park on the website so it serves the same content
as the parent domain.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/parked-domains`

#### hosting_deleteWebsiteParkedDomainV1

Delete an existing parked or alias domain from the selected website.

Use this endpoint to remove parked domains that are no longer needed.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/parked-domains/{parkedDomain}`

#### hosting_listWebsiteSubdomainsV1

Retrieve all subdomains created under the selected website.

Use this endpoint to inspect subdomain configuration for a specific website,
including the parent domain and root directory assigned to each subdomain.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/subdomains`

#### hosting_createWebsiteSubdomainV1

Create a new subdomain for the selected website.

Provide a subdomain prefix and, optionally, a custom directory or the
website public directory to use as the subdomain root.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/subdomains`

#### hosting_deleteWebsiteSubdomainV1

Delete an existing subdomain from the selected website.

Use this endpoint to remove subdomains that are no longer needed.

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/subdomains/{subdomain}`

#### hosting_verifyDomainOwnershipV1

Verify ownership of a single domain and return the verification status.

Use this endpoint to check if a domain is accessible for you before using it for new websites.
If the domain is accessible, the response will have `is_accessible: true`.
If not, add the given TXT record to your domain's DNS records and try verifying again.
Keep in mind that it may take up to 10 minutes for new TXT DNS records to propagate.

Skip this verification when using Hostinger's free subdomains (*.hostingersite.com).

- **Method**: `POST`
- **Path**: `/api/hosting/v1/domains/verify-ownership`

#### hosting_listNodeJSBuildsV1

Retrieve a paginated list of Node.js build processes for a specific website.

Each build represents a single run of the Node.js build pipeline. Use the `states`
query parameter to filter results by build state (pending, running, completed, failed).
Use the `uuid` from a build to poll its output via the `Get Node.js Build Logs` endpoint.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds`

#### hosting_createNodeJSBuildFromArchiveV1

Upload a project archive, auto-detect build settings, and immediately start a Node.js build.

This is the recommended single-step approach for deploying a Node.js application.
The archive is uploaded to the website's file storage, build settings are auto-detected
from the package.json inside the archive, and the build process starts automatically.
Optional override fields take precedence over auto-detected values.
Maximum archive size is 50MB.

Before archiving, exclude `node_modules/` and any build output directories
(e.g. `dist/`, `.next/`, `build/`) — they are not needed because the build
process runs the install step automatically, and including them unnecessarily
increases the archive size. This also helps keep the archive well under the 50MB limit.

Example (zip):
```
zip -r archive.zip . --exclude "node_modules/*" --exclude "dist/*"
```

The returned build `uuid` can be used to poll progress and retrieve logs via
the `Get Node.js Build Logs` endpoint.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds/from-archive`

#### hosting_getNodeJSBuildLogsV1

Retrieve logs from a specific Node.js build process.

To stream live output while a build is running, poll this endpoint repeatedly
while the build state is `running`, passing the previously returned `lines` count
as `from_line` to fetch only new output since the last call.
Log content may contain ANSI escape sequences (color codes).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds/{uuid}/logs`

#### hosting_restartNode_jsApplicationV1

Restarts the Node.js server process for the website. Does not rebuild or redeploy the
application. Use it to apply environment or configuration changes, or to recover a hung
application.

Only applicable to server-side applications (Express, Next.js, NestJS, etc.). Static
front-end apps (React, Vue, Vite) have no persistent server process, so restarting them
has no effect. Returns success even when the website has no server process to restart.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/server/restart`

#### hosting_listNode_jsVulnerabilitiesV1

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

#### hosting_patchNode_jsVulnerabilitiesV1

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

#### hosting_listOrdersV1

Retrieve a paginated list of orders accessible to the authenticated client.

This endpoint returns orders of your hosting accounts as well as orders
of other client hosting accounts that have shared access with you.

Use the available query parameters to filter results by order statuses
or specific order IDs for more targeted results.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/orders`

#### hosting_resetPHPExtensionsV1

Resets all PHP extensions of the website to their default state.

Use it to recover from extension conflicts or restore the original configuration.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/php/extensions/reset`

#### hosting_getPHPDetailsV1

Returns the full PHP configuration for the website: current version, available versions
(supported and unsupported), enabled/disabled extensions, options with their current value,
default, type and the plan limit (`max`), and conflicting extension groups.

Use it to check the current PHP setup before updating the version, extensions or options.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/php/details`

#### hosting_getPHPInfoV1

Returns the full phpinfo page (HTML) for the website.

Use it to debug PHP issues or inspect the complete PHP environment of the website.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/php/php-info`

#### hosting_updatePHPExtensionsV1

Enables or disables PHP extensions (modules) for the website.

Use the Get PHP details endpoint to check the current extension states before changing them.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/php/extensions`

#### hosting_updatePHPOptionsV1

Updates PHP options for the website (e.g. `memory_limit`, `max_execution_time`, `upload_max_filesize`).
Only provide the options you want to change, inside the `options` object.

Values above the account plan limit are silently capped to that limit, so the request can succeed
with a smaller applied value. Call the Get PHP details endpoint afterwards to read the applied value.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/php/options`

#### hosting_updatePHPVersionV1

Changes the PHP version of the website.

Use the Get PHP details endpoint to see the versions available for the website.

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/websites/{domain}/php/version`

#### hosting_listWebsitesV1

Retrieve a paginated list of websites (main and addon types) accessible to the authenticated client.

This endpoint returns websites from your hosting accounts as well as
websites from other client hosting accounts that have shared access
with you.

Use the available query parameters to filter results by username,
order ID, enabled status, or domain name for more targeted results.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/websites`

#### hosting_createWebsiteV1

Create a new website for the authenticated client.

Provide the domain name and associated order ID to create a new website.
The datacenter_code parameter is required when creating the first website
on a new hosting plan - this will set up and configure new hosting account
in the selected datacenter.

Subsequent websites will be hosted on the same datacenter automatically.

Website creation takes up to a few minutes to complete. Check the
websites list endpoint to see when your new website becomes available.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/websites`

#### hosting_deleteWebsiteV1

Permanently deletes a website and all of its data. This action is destructive
and cannot be undone. Always ask the user for explicit confirmation before
calling this endpoint.

All website files, databases and related configuration will be removed.
The hosting plan itself is kept, so a new website can be created on it afterwards.

The confirm field must be boolean true, otherwise the request is rejected.

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

#### mail_getMailboxListV1

Retrieve a paginated list of mailboxes belonging to a mail order.

Use this endpoint to monitor mailboxes of your mail service, including
their status, enabled protocols, attached resource counts, and
periodically synced usage numbers (usage may lag behind live values).

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders/{orderId}/mailboxes`

#### mail_getMailOrderListV1

Retrieve a paginated list of mail orders associated with your account.

Use this endpoint to monitor your mail services, including their status,
plan, attached domain, and expiration details.

- **Method**: `GET`
- **Path**: `/api/mail/v1/orders`

### `hostinger-reach-mcp`

#### reach_deleteAContactV1

Delete a contact with the specified UUID.

This endpoint permanently removes a contact from the email marketing system.

- **Method**: `DELETE`
- **Path**: `/api/reach/v1/contacts/{uuid}`

#### reach_listContactGroupsV1

Get a list of all contact groups.

This endpoint returns a list of contact groups that can be used to organize contacts.

- **Method**: `GET`
- **Path**: `/api/reach/v1/contacts/groups`

#### reach_listContactsV1

Get a list of contacts, optionally filtered by group and subscription status.

This endpoint returns a paginated list of contacts with their basic information.
You can filter contacts by group UUID and subscription status.

- **Method**: `GET`
- **Path**: `/api/reach/v1/contacts`

#### reach_createANewContactV1

Create a new contact in the email marketing system.

This endpoint allows you to create a new contact with basic information like name, email, and surname.

If double opt-in is enabled,
the contact will be created with a pending status and a confirmation email will be sent.

- **Method**: `POST`
- **Path**: `/api/reach/v1/contacts`

#### reach_listSegmentsV1

Get a list of all contact segments.

This endpoint returns a list of contact segments that can be used to organize contacts.

- **Method**: `GET`
- **Path**: `/api/reach/v1/segmentation/segments`

#### reach_createANewContactSegmentV1

Create a new contact segment.

This endpoint allows creating a new contact segment that can be used to organize contacts.
The segment can be configured with specific criteria like email, name, subscription status, etc.

- **Method**: `POST`
- **Path**: `/api/reach/v1/segmentation/segments`

#### reach_listProfileSegmentContactsV1

Retrieve contacts associated with a specific segment for a given profile.

This endpoint allows you to fetch and filter contacts that belong to a particular segment,
identified by its UUID, scoped to a specific profile.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}/contacts`

#### reach_listSegmentContactsV1

Retrieve contacts associated with a specific segment.

This endpoint allows you to fetch and filter contacts that belong to a particular segment,
identified by its UUID.

- **Method**: `GET`
- **Path**: `/api/reach/v1/segmentation/segments/{segmentUuid}/contacts`

#### reach_getSegmentDetailsV1

Get details of a specific segment.

This endpoint retrieves information about a single segment identified by UUID.
Segments are used to organize and group contacts based on specific criteria.

- **Method**: `GET`
- **Path**: `/api/reach/v1/segmentation/segments/{segmentUuid}`

#### reach_createNewContactsV1

Create a new contact in the email marketing system.

This endpoint allows you to create a new contact with basic information like name, email, and surname.

If double opt-in is enabled, the contact will be created with a pending status
and a confirmation email will be sent.

- **Method**: `POST`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/contacts`

#### reach_getProfileDomainDNSStatusV1

Retrieve the DNS configuration status for a profile's domain.

This endpoint reports the state of MX, SPF, DKIM and DMARC records, including the
actual records found and the suggested records required for correct email delivery.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles/{profileUuid}/domains/dns-status`

#### reach_listProfilesV1

This endpoint returns all profiles available to the client, including their basic information.

- **Method**: `GET`
- **Path**: `/api/reach/v1/profiles`

### `hostinger-vps-mcp`

#### VPS_getDataCenterListV1

Retrieve all available data centers.

Use this endpoint to view location options before deploying VPS instances.

- **Method**: `GET`
- **Path**: `/api/vps/v1/data-centers`

#### VPS_getProjectContainersV1

Retrieves a list of all containers belonging to a specific Docker Compose project on the virtual machine. 

This endpoint returns detailed information about each container including
their current status, port mappings, and runtime configuration.

Use this to monitor the health and state of all services within your Docker Compose project.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/containers`

#### VPS_getProjectContentsV1

Retrieves the complete project information including the docker-compose.yml
file contents, project metadata, and current deployment status.

This endpoint provides the full configuration and state details of a specific Docker Compose project. 

Use this to inspect project settings, review the compose file, or check the overall project health.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}`

#### VPS_deleteProjectV1

Completely removes a Docker Compose project from the virtual machine, stopping all containers and cleaning up 
associated resources including networks, volumes, and images. 

This operation is irreversible and will delete all project data. 

Use this when you want to permanently remove a project and free up system resources.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/down`

#### VPS_getProjectListV1

Retrieves a list of all Docker Compose projects currently deployed on the virtual machine. 

This endpoint returns basic information about each project including name,
status, file path and list of containers with details about their names,
image, status, health and ports. Container stats are omitted in this
endpoint. If you need to get detailed information about container with
stats included, use the `Get project containers` endpoint.

Use this to get an overview of all Docker projects on your VPS instance.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker`

#### VPS_createNewProjectV1

Deploy new project from docker-compose.yaml contents or download contents from URL. 

URL can be Github repository url in format https://github.com/[user]/[repo]
and it will be automatically resolved to docker-compose.yaml file in
master branch. Any other URL provided must return docker-compose.yaml
file contents.

If project with the same name already exists, existing project will be replaced.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker`

#### VPS_getProjectLogsV1

Retrieves aggregated log entries from all services within a Docker Compose project. 

This endpoint returns recent log output from each container, organized by service name with timestamps. 
The response contains the last 300 log entries across all services. 

Use this for debugging, monitoring application behavior, and
troubleshooting issues across your entire project stack.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/logs`

#### VPS_restartProjectV1

Restarts all services in a Docker Compose project by stopping and starting
containers in the correct dependency order.

This operation preserves data volumes and network configurations while refreshing the running containers. 

Use this to apply configuration changes or recover from service failures.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/restart`

#### VPS_startProjectV1

Starts all services in a Docker Compose project that are currently stopped. 

This operation brings up containers in the correct dependency order as defined in the compose file. 

Use this to resume a project that was previously stopped or to start services after a system reboot.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/start`

#### VPS_stopProjectV1

Stops all running services in a Docker Compose project while preserving
container configurations and data volumes.

This operation gracefully shuts down containers in reverse dependency order. 

Use this to temporarily halt a project without removing data or configurations.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/stop`

#### VPS_updateProjectV1

Updates a Docker Compose project by pulling the latest image versions and
recreating containers with new configurations.

This operation preserves data volumes while applying changes from the compose file. 

Use this to deploy application updates, apply configuration changes, or
refresh container images to their latest versions.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/update`

#### VPS_activateFirewallV1

Activate a firewall for a specified virtual machine.

Only one firewall can be active for a virtual machine at a time.

Use this endpoint to apply firewall rules to VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall/{firewallId}/activate/{virtualMachineId}`

#### VPS_deactivateFirewallV1

Deactivate a firewall for a specified virtual machine.

Use this endpoint to remove firewall protection from VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall/{firewallId}/deactivate/{virtualMachineId}`

#### VPS_getFirewallDetailsV1

Retrieve firewall by its ID and rules associated with it.

Use this endpoint to view specific firewall configuration and rules.

- **Method**: `GET`
- **Path**: `/api/vps/v1/firewall/{firewallId}`

#### VPS_deleteFirewallV1

Delete a specified firewall.

Any virtual machine that has this firewall activated will automatically have it deactivated.

Use this endpoint to remove unused firewall configurations.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/firewall/{firewallId}`

#### VPS_getFirewallListV1

Retrieve all available firewalls.

Use this endpoint to view existing firewall configurations.

- **Method**: `GET`
- **Path**: `/api/vps/v1/firewall`

#### VPS_createNewFirewallV1

Create a new firewall.

Use this endpoint to set up new firewall configurations for VPS security.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall`

#### VPS_updateFirewallRuleV1

Update a specific firewall rule from a specified firewall.

Any virtual machine that has this firewall activated will lose sync with the firewall
and will have to be synced again manually.

Use this endpoint to modify existing firewall rules.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/firewall/{firewallId}/rules/{ruleId}`

#### VPS_deleteFirewallRuleV1

Delete a specific firewall rule from a specified firewall.

Any virtual machine that has this firewall activated will lose sync with the firewall
and will have to be synced again manually.

Use this endpoint to remove specific firewall rules.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/firewall/{firewallId}/rules/{ruleId}`

#### VPS_createFirewallRuleV1

Create new firewall rule for a specified firewall.

By default, the firewall drops all incoming traffic,
which means you must add accept rules for all ports you want to use.

Any virtual machine that has this firewall activated will lose sync with the firewall
and will have to be synced again manually.

Use this endpoint to add new security rules to firewalls.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall/{firewallId}/rules`

#### VPS_syncFirewallV1

Sync a firewall for a specified virtual machine.

Firewall can lose sync with virtual machine if the firewall has new rules added, removed or updated.

Use this endpoint to apply updated firewall rules to VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall/{firewallId}/sync/{virtualMachineId}`

#### VPS_getPostInstallScriptV1

Retrieve post-install script by its ID.

Use this endpoint to view specific automation script details.

- **Method**: `GET`
- **Path**: `/api/vps/v1/post-install-scripts/{postInstallScriptId}`

#### VPS_updatePostInstallScriptV1

Update a specific post-install script.

Use this endpoint to modify existing automation scripts.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/post-install-scripts/{postInstallScriptId}`

#### VPS_deletePostInstallScriptV1

Delete a post-install script from your account.
       
Use this endpoint to remove unused automation scripts.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/post-install-scripts/{postInstallScriptId}`

#### VPS_getPostInstallScriptsV1

Retrieve post-install scripts associated with your account.

Use this endpoint to view available automation scripts for VPS deployment.

- **Method**: `GET`
- **Path**: `/api/vps/v1/post-install-scripts`

#### VPS_createPostInstallScriptV1

Add a new post-install script to your account, which can then be used after virtual machine installation.

The script contents will be saved to the file `/post_install` with executable attribute set
and will be executed once virtual machine is installed.
The output of the script will be redirected to `/post_install.log`. Maximum script size is 48KB.

Use this endpoint to create automation scripts for VPS setup tasks.

- **Method**: `POST`
- **Path**: `/api/vps/v1/post-install-scripts`

#### VPS_attachPublicKeyV1

Attach existing public keys from your account to a specified virtual machine.

Multiple keys can be attached to a single virtual machine.

Use this endpoint to enable SSH key authentication for VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/public-keys/attach/{virtualMachineId}`

#### VPS_deletePublicKeyV1

Delete a public key from your account. 

**Deleting public key from account does not remove it from virtual machine** 
       
Use this endpoint to remove unused SSH keys from account.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/public-keys/{publicKeyId}`

#### VPS_getPublicKeysV1

Retrieve public keys associated with your account.

Use this endpoint to view available SSH keys for VPS authentication.

- **Method**: `GET`
- **Path**: `/api/vps/v1/public-keys`

#### VPS_createPublicKeyV1

Add a new public key to your account.

Use this endpoint to register SSH keys for VPS authentication.

- **Method**: `POST`
- **Path**: `/api/vps/v1/public-keys`

#### VPS_getTemplateDetailsV1

Retrieve detailed information about a specific OS template for virtual machines.

Use this endpoint to view specific template specifications before deployment.

- **Method**: `GET`
- **Path**: `/api/vps/v1/templates/{templateId}`

#### VPS_getTemplatesV1

Retrieve available OS templates for virtual machines.

Use this endpoint to view operating system options before creating or recreating VPS instances.

- **Method**: `GET`
- **Path**: `/api/vps/v1/templates`

#### VPS_getActionDetailsV1

Retrieve detailed information about a specific action performed on a specified virtual machine.

Use this endpoint to monitor specific VPS operation status and details.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/actions/{actionId}`

#### VPS_getActionsV1

Retrieve actions performed on a specified virtual machine.

Actions are operations or events that have been executed on the virtual
machine, such as starting, stopping, or modifying the machine. This endpoint
allows you to view the history of these actions, providing details about
each action, such as the action name, timestamp, and status.

Use this endpoint to view VPS operation history and troubleshoot issues.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/actions`

#### VPS_getAttachedPublicKeysV1

Retrieve public keys attached to a specified virtual machine.

Use this endpoint to view SSH keys configured for specific VPS instances.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/public-keys`

#### VPS_getBackupsV1

Retrieve backups for a specified virtual machine.

Use this endpoint to view available backup points for VPS data recovery.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/backups`

#### VPS_restoreBackupV1

Restore a backup for a specified virtual machine.

The system will then initiate the restore process, which may take some time depending on the size of the backup.

**All data on the virtual machine will be overwritten with the data from the backup.**

Use this endpoint to recover VPS data from backup points.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/backups/{backupId}/restore`

#### VPS_setHostnameV1

Set hostname for a specified virtual machine.

Changing hostname does not update PTR record automatically.
If you want your virtual machine to be reachable by a hostname, 
you need to point your domain A/AAAA records to virtual machine IP as well.

Use this endpoint to configure custom hostnames for VPS instances.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/hostname`

#### VPS_resetHostnameV1

Reset hostname and PTR record of a specified virtual machine to default value.

Use this endpoint to restore default hostname configuration for VPS instances.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/hostname`

#### VPS_getVirtualMachineDetailsV1

Retrieve detailed information about a specified virtual machine.

Use this endpoint to view comprehensive VPS configuration and status.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}`

#### VPS_getVirtualMachinesV1

Retrieve all available virtual machines.

Use this endpoint to view available VPS instances.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines`

#### VPS_purchaseNewVirtualMachineV1

Purchase and setup a new virtual machine.

If virtual machine setup fails for any reason, login to
[hPanel](https://hpanel.hostinger.com/) and complete the setup manually.

If no payment method is provided, your default payment method will be used automatically.

Use this endpoint to create new VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines`

#### VPS_getScanMetricsV1

Retrieve scan metrics for the [Monarx](https://www.monarx.com/) malware scanner
installed on a specified virtual machine.

The scan metrics provide detailed information about malware scans performed
by Monarx, including number of scans, detected threats, and other relevant
statistics. This information is useful for monitoring security status of the
virtual machine and assessing effectiveness of the malware scanner.

Use this endpoint to monitor VPS security scan results and threat detection.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/monarx`

#### VPS_installMonarxV1

Install the Monarx malware scanner on a specified virtual machine.

[Monarx](https://www.monarx.com/) is a security tool designed to detect and
prevent malware infections on virtual machines. By installing Monarx, users
can enhance the security of their virtual machines, ensuring that they are
protected against malicious software.

Use this endpoint to enable malware protection on VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/monarx`

#### VPS_uninstallMonarxV1

Uninstall the Monarx malware scanner on a specified virtual machine.

If Monarx is not installed, the request will still be processed without any effect.

Use this endpoint to remove malware scanner from VPS instances.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/monarx`

#### VPS_getMetricsV1

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

#### VPS_setNameserversV1

Set nameservers for a specified virtual machine.

Be aware, that improper nameserver configuration can lead to the virtual
machine being unable to resolve domain names.

Use this endpoint to configure custom DNS resolvers for VPS instances.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/nameservers`

#### VPS_createPTRRecordV1

Create or update a PTR (Pointer) record for a specified virtual machine.

Use this endpoint to configure reverse DNS lookup for VPS IP addresses.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/ptr/{ipAddressId}`

#### VPS_deletePTRRecordV1

Delete a PTR (Pointer) record for a specified virtual machine.

Once deleted, reverse DNS lookups to the virtual machine's IP address will
no longer return the previously configured hostname.

Use this endpoint to remove reverse DNS configuration from VPS instances.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/ptr/{ipAddressId}`

#### VPS_setPanelPasswordV1

Set panel password for a specified virtual machine.

If virtual machine does not use panel OS, the request will still be processed without any effect.
Requirements for password are same as in the [recreate virtual machine
endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).

Use this endpoint to configure control panel access credentials for VPS instances.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/panel-password`

#### VPS_startRecoveryModeV1

Initiate recovery mode for a specified virtual machine.

Recovery mode is a special state that allows users to perform system rescue operations, 
such as repairing file systems, recovering data, or troubleshooting issues that prevent the virtual machine 
from booting normally. 

Virtual machine will boot recovery disk image and original disk image will be mounted in `/mnt` directory.

Use this endpoint to enable system rescue operations on VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/recovery`

#### VPS_stopRecoveryModeV1

Stop recovery mode for a specified virtual machine.

If virtual machine is not in recovery mode, this operation will fail.

Use this endpoint to exit system rescue mode and return VPS to normal operation.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/recovery`

#### VPS_recreateVirtualMachineV1

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

#### VPS_restartVirtualMachineV1

Restart a specified virtual machine by fully stopping and starting it.

If the virtual machine was stopped, it will be started.

Use this endpoint to reboot VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/restart`

#### VPS_setRootPasswordV1

Set root password for a specified virtual machine.

Requirements for password are same as in the [recreate virtual machine
endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).

Use this endpoint to update administrator credentials for VPS instances.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/root-password`

#### VPS_setupPurchasedVirtualMachineV1

Setup newly purchased virtual machine with `initial` state.

Use this endpoint to configure and initialize purchased VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/setup`

#### VPS_getSnapshotV1

Retrieve snapshot for a specified virtual machine.

Use this endpoint to view current VPS snapshot information.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot`

#### VPS_createSnapshotV1

Create a snapshot of a specified virtual machine.

A snapshot captures the state and data of the virtual machine at a specific point in time, 
allowing users to restore the virtual machine to that state if needed. 
This operation is useful for backup purposes, system recovery, 
and testing changes without affecting the current state of the virtual machine.

**Creating new snapshot will overwrite the existing snapshot!**

Use this endpoint to capture VPS state for backup and recovery purposes.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot`

#### VPS_deleteSnapshotV1

Delete a snapshot of a specified virtual machine.

Use this endpoint to remove VPS snapshots.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot`

#### VPS_restoreSnapshotV1

Restore a specified virtual machine to a previous state using a snapshot.

Restoring from a snapshot allows users to revert the virtual machine to that state,
which is useful for system recovery, undoing changes, or testing.

Use this endpoint to revert VPS instances to previous saved states.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot/restore`

#### VPS_startVirtualMachineV1

Start a specified virtual machine.

If the virtual machine is already running, the request will still be processed without any effect.

Use this endpoint to power on stopped VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/start`

#### VPS_stopVirtualMachineV1

Stop a specified virtual machine.

If the virtual machine is already stopped, the request will still be processed without any effect.

Use this endpoint to power off running VPS instances.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/stop`

### `hostinger-wordpress-mcp`

#### hosting_showAIOptionStatusV1

Show the current AI option status for the Hostinger Tools plugin on the
specified WordPress installation. Filter by `option` to return a single
option, or omit it to return all options.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/hostinger-plugins/ai-option/status`

#### hosting_setAIOptionStatusV1

Enable or disable an AI option for the Hostinger Tools plugin on the specified
WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/hostinger-plugins/ai-option/status`

#### hosting_checkIfWordPressInstallationsAreValidV1

Check whether one or more WordPress installations are valid and working
correctly. Detects broken installations caused by missing files, broken
plugins, themes and similar issues.

Provide the WordPress installation (software) identifiers in the body. They
can be obtained from GET /api/hosting/v1/wordpress/installations (the `id`
field).

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/installations/check-is-valid`

#### hosting_deleteWordPressInstallationV1

Delete the specified WordPress installation, with optional file and database
removal. This removes all associated components including plugins, themes,
staging websites and any other related data.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `DELETE`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}`

#### hosting_detectWordPressInstallationsV1

Trigger a background scan to detect WordPress installations for the account.

This operation is asynchronous: a successful response only means the scan has
been queued. Poll GET /api/hosting/v1/wordpress/installations to fetch the
detected installations once the scan completes.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/installations/detect`

#### hosting_installWordPressV1

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

#### hosting_listWordPressInstallationsV1

List WordPress installations accessible to the authenticated client.

Use this endpoint to discover existing WordPress installations and to poll
for installation status after calling the install endpoint. When a newly
requested installation appears in this list, WordPress is ready. Filter by
username and domain to narrow results to a specific website.

Each installation includes a `valid` flag and, when invalid, a
`validationError` describing why.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/wordpress/installations`

#### hosting_listAvailableWordPressCoreUpdatesV1

List available WordPress core updates for the specified installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/updates`

#### hosting_getInstallationJWTTokenV1

Return a JWT token used to authenticate requests against the specified
WordPress installation, including its MCP (Model Context Protocol) endpoint.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/jwt-token`

#### hosting_showWordPressCoreVersionV1

Show the WordPress core version for the specified installation, along with
known vulnerabilities affecting it.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/version`

#### hosting_updateWordPressCoreV1

Update the WordPress core for the specified installation (minor update or a
specific version).

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the update
job has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/update`

#### hosting_purgeLiteSpeedCacheV1

Purge the LiteSpeed Cache for the specified WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/litespeed-cache/purge`

#### hosting_showLiteSpeedCacheStatusV1

Show the LiteSpeed Cache status for the specified WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/litespeed-cache/status`

#### hosting_createLoginLinksV1

Create temporary auto-login links for the specified WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/login/links`

#### hosting_showMaintenanceStatusV1

Show the maintenance mode status for the specified WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/maintenance/status`

#### hosting_toggleMaintenanceModeV1

Enable or disable maintenance mode for the specified WordPress installation,
based on the `enabled` flag.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/maintenance/toggle`

#### hosting_showMemcachedObjectCacheStatusV1

Show the Memcached object cache status for the specified WordPress
installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/memcached/status`

#### hosting_toggleMemcachedObjectCacheV1

Activate or deactivate the Memcached object cache for the specified WordPress
installation, based on the `enabled` flag.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `PATCH`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/memcached/toggle`

#### hosting_activateWordPressPluginV1

Activate an installed plugin on a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the activation
job has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/activate`

#### hosting_deactivateWordPressPluginV1

Deactivate an installed plugin on a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the
deactivation job has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/deactivate`

#### hosting_installWordPressPluginsV1

Install one or more plugins on an existing WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id`
field). Use GET /api/hosting/v1/wordpress/plugins to discover the plugin
slugs available for installation.

This operation is asynchronous: a successful response only means the install
job has been queued, not that the plugins are ready.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/install`

#### hosting_listAvailableWordPressPluginsV1

List plugins recommended for installation on a WordPress installation that are
not yet installed.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/available`

#### hosting_listInstalledWordPressPluginsV1

List plugins installed on a WordPress installation, including their status,
available updates and known vulnerabilities.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins`

#### hosting_searchWordPressPluginsV1

Search the WordPress.org plugin directory for plugins available to install.

Use the returned `slug` values with
POST /api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/install.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/wordpress/plugins`

#### hosting_listSuggestedWordPressPluginsV1

List curated plugin suggestions grouped by website type.

Use the returned `slug` values with
POST /api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/install.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/wordpress/plugins/suggested`

#### hosting_checkIfWooCommerceIsInstalledV1

Check whether WooCommerce is installed on any WordPress installation of a
domain. Optionally filter by domain to scope the check.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/wordpress/plugins/is-woocommerce-installed`

#### hosting_uninstallWordPressPluginsV1

Uninstall one or more plugins from a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the uninstall
job has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/uninstall`

#### hosting_updateHostingerWordPressPluginV1

Update a Hostinger plugin to its latest version on a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the update job
has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/hostinger/update`

#### hosting_updateWordPressPluginsV1

Update one or more installed plugins to their latest version on a WordPress
installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the update job
has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/update`

#### hosting_activateWordPressThemeV1

Activate an installed theme on a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the activation
job has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/themes/activate`

#### hosting_installWordPressThemeV1

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

#### hosting_listInstalledWordPressThemesV1

List themes installed on a WordPress installation, including their status,
available updates and known vulnerabilities.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

- **Method**: `GET`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/themes`

#### hosting_listWordPressThemesV1

List WordPress themes available to install.

Use the returned `slug` values with
POST /api/hosting/v1/accounts/{username}/wordpress/{software}/themes/install.

- **Method**: `GET`
- **Path**: `/api/hosting/v1/wordpress/themes`

#### hosting_uninstallWordPressThemesV1

Uninstall one or more themes from a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the uninstall
job has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/themes/uninstall`

#### hosting_updateWordPressThemesV1

Update one or more installed themes to their latest version on a WordPress
installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the update job
has been queued.

- **Method**: `POST`
- **Path**: `/api/hosting/v1/accounts/{username}/wordpress/{software}/themes/update`
