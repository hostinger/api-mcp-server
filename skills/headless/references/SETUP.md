# Setup — plan check and website provisioning

Everything here uses the **hosting** MCP tools. If they're missing, ask the user to enable the Websites product group in the Hostinger Connector (or use the `hostinger-hosting-mcp` scoped binary).

## 1. Plan check (gate — run this first)

A website can only be created on an active hosting plan.

1. `hosting_listWebsitesV1` — if it returns websites, the account has a working plan; note any existing `order_id` and `username` for step 2.
2. Otherwise `hosting_listOrdersV1` — look for an order in a usable state. A fresh order that has never hosted a website still works; note its `order_id`.
3. If there is no usable order: **stop and tell the user** that an active Hostinger hosting plan is required to deploy, link https://www.hostinger.com/web-hosting, and offer to continue building the site locally in the meantime. When they confirm the purchase, re-run this check.

Never purchase a plan, domain, or any paid item without the user explicitly approving that specific purchase.

## 2. Choose the domain

- **Default: free subdomain.** `hosting_generateAFreeSubdomainV1` returns a `*.hostingersite.com` domain. No verification needed. Tell the user a custom domain can be connected later.
- **User-owned domain:** `hosting_verifyDomainOwnershipV1` first. If not accessible, relay the TXT record it returns, remind them propagation can take ~10 minutes, and re-verify before continuing.
- **New domain purchase:** only on explicit request — check availability with `domains_checkDomainAvailabilityV1`, state the price, and get an explicit yes before `domains_purchaseNewDomainV1` (needs the domains product group).

## 3. Create the website and wait for it

Generating a subdomain does **not** create a website — deploying straight to it fails with `No website found for domain`. The working sequence:

1. `hosting_createWebsiteV1 { domain, order_id }` — `datacenter_code` is required only for the first website on a brand-new plan (pick the first entry from `hosting_listAvailableDatacentersV1`).
2. **Poll** `hosting_listWebsitesV1` filtered by the domain until the site appears. Creation takes up to a few minutes — poll with backoff, don't fail fast.
3. Note the site's `username` — deployment and database tools are keyed on it.

If the domain already has a website (an `iterate` run, or the user pointed at an existing site), skip creation entirely.

## 4. Optional extras (only when the run needs them)

- **Database:** `hosting_createAccountDatabaseV1` for Node.js apps that need MySQL; pass the credentials to the app via its environment/config, never hard-coded into client-side code.
- **DNS records:** the DNS tools (`DNS_updateDNSRecordsV1` etc.) for custom-domain records; take a snapshot (`DNS_getDNSSnapshotListV1` context) before destructive changes.
