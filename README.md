# hostinger-api-mcp

Model Context Protocol (MCP) server for Hostinger API.

## Prerequisites
- Node.js version 20 or higher

If you don't have Node.js installed, you can download it from the [official website](https://nodejs.org/en/download/).
Alternatively, you can use a package manager like [Homebrew](https://brew.sh/) (for macOS) or [Chocolatey](https://chocolatey.org/) (for Windows) to install Node.js.

We recommend using [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm) to install and manage installed Node.js versions.
After installing NVM, you can install Node.js with the following command:
```bash
nvm install v20
nvm use v20
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

## Configuration

The following environment variables can be configured when running the server:
- `DEBUG`: Enable debug logging (true/false) (default: false)


- `APITOKEN`: Your API token, which will be sent in the `Authorization` header.



## Usage

### JSON configuration for Claude, Cursor, etc.

```json
{
    "mcpServers": {
        "hostinger-api": {
            "command": "hostinger-api-mcp",
            "env": {
                "DEBUG": "false",
                "API_TOKEN": "YOUR API TOKEN"
            }
        }
    }
}
```

### Using SSE Transport

To use the MCP server with SSE transport, you must run the server with the `--sse` option. 
This will enable the server to communicate with clients using Server-Sent Events on localhost port 8100.
Additionally, you can specify the `--host` and `--port` options to set the host and port for the server to listen on.

Example of running the server with SSE transport:

```bash
hostinger-api-mcp --sse --host 127.0.0.1 --port 8100
```

### Using as an MCP Tool Provider

This server implements the Model Context Protocol (MCP) and can be used with any MCP-compatible consumer, like Claude.js client or other MCP consumers.

Example of connecting to this server from a Claude.js client:

```javascript
import { MCP } from "claude-js";
import { createStdio } from "claude-js/mcp";

// Create stdin/stdout transport
const transport = createStdio({ command: "hostinger-api-mcp" });

// Connect to the MCP server
const mcp = new MCP({ transport });
await mcp.connect();

// List available tools
const { tools } = await mcp.listTools();
console.log("Available tools:", tools);

// Call a tool
const result = await mcp.callTool({
    id: "TOOL-ID",
    arguments: { param1: "value1" }
});
console.log("Tool result:", result);
```

## Available Tools

This MCP server provides the following tools:

### billing_getCatalogItemListV1

This endpoint retrieves a list of catalog items available for order. 

Prices in catalog items is displayed as cents (without floating point), e.g: float `17.99` is displayed as integer `1799`.

- **Method**: `GET`
- **Path**: `/api/billing/v1/catalog`

**Parameters**:

- `category`: Filter catalog items by category 
- `name`: Filter catalog items by name. Use `*` for wildcard search, e.g. `.COM*` to find .com domain 

### billing_createNewServiceOrderV1

This endpoint creates a new service order. 

**DEPRECATED**

To purchase a domain, use [`POST /api/domains/v1/portfolio`](/#tag/domains-portfolio/POST/api/domains/v1/portfolio) instead.

To purchase a VPS, use [`POST /api/vps/v1/virtual-machines`](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines) instead.


To place order, you need to provide payment method ID and list of price items from the catalog endpoint together with quantity.
Coupons also can be provided during order creation.

Orders created using this endpoint will be set for automatic renewal.

Some `credit_card` payments might need additional verification, rendering purchase unprocessed.
We recommend use other payment methods than `credit_card` if you encounter this issue.

- **Method**: `POST`
- **Path**: `/api/billing/v1/orders`

**Parameters**:

- `payment_method_id`: Payment method ID (required)
- `items`: items parameter (required)
- `coupons`: Discount coupon codes 

### billing_setDefaultPaymentMethodV1

This endpoint sets default payment method for your account.

- **Method**: `POST`
- **Path**: `/api/billing/v1/payment-methods/{paymentMethodId}`

**Parameters**:

- `paymentMethodId`: Payment method ID (required)

### billing_deletePaymentMethodV1

This endpoint deletes a payment method from your account.

- **Method**: `DELETE`
- **Path**: `/api/billing/v1/payment-methods/{paymentMethodId}`

**Parameters**:

- `paymentMethodId`: Payment method ID (required)

### billing_getPaymentMethodListV1

This endpoint retrieves a list of available payment methods that can be used for placing new orders.

If you want to add new payment method, please use [hPanel](https://hpanel.hostinger.com/billing/payment-methods).

- **Method**: `GET`
- **Path**: `/api/billing/v1/payment-methods`



### billing_cancelSubscriptionV1

This endpoint cancels a subscription and stops any further billing.

- **Method**: `DELETE`
- **Path**: `/api/billing/v1/subscriptions/{subscriptionId}`

**Parameters**:

- `subscriptionId`: Subscription ID (required)

### billing_getSubscriptionListV1

This endpoint retrieves a list of all subscriptions associated with your account.

- **Method**: `GET`
- **Path**: `/api/billing/v1/subscriptions`



### DNS_getSnapshotV1

This endpoint retrieves particular DNS snapshot with the contents of DNS zone records.

- **Method**: `GET`
- **Path**: `/api/dns/v1/snapshots/{domain}/{snapshotId}`

**Parameters**:

- `domain`: Domain name (required)
- `snapshotId`: Snapshot ID (required)

### DNS_getSnapshotListV1

This endpoint retrieves list of DNS snapshots.

- **Method**: `GET`
- **Path**: `/api/dns/v1/snapshots/{domain}`

**Parameters**:

- `domain`: Domain name (required)

### DNS_restoreSnapshotV1

This endpoint restores DNS zone to the selected snapshot.

- **Method**: `POST`
- **Path**: `/api/dns/v1/snapshots/{domain}/{snapshotId}/restore`

**Parameters**:

- `domain`: Domain name (required)
- `snapshotId`: Snapshot ID (required)

### DNS_getRecordsV1

This endpoint retrieves DNS zone records for a specific domain.

- **Method**: `GET`
- **Path**: `/api/dns/v1/zones/{domain}`

**Parameters**:

- `domain`: Domain name (required)

### DNS_updateZoneRecordsV1

This endpoint updates DNS records for the selected domain. 

Using `overwrite = true` will replace existing records with the provided ones. 
Otherwise existing records will be updated and new records will be added.

- **Method**: `PUT`
- **Path**: `/api/dns/v1/zones/{domain}`

**Parameters**:

- `domain`: Domain name (required)
- `overwrite`: If `true`, resource records (RRs) matching name and type will be deleted and new RRs will be created, otherwise resource records' ttl's are updated and new records are appended. If no matching RRs are found, they are created. 
- `zone`: zone parameter (required)

### DNS_deleteZoneRecordsV1

This endpoint deletes DNS records for the selected domain. 
To filter which records to delete, add the `name` of the record and `type` to the filter. 
Multiple filters can be provided with single request.

If you have multiple records with the same name and type, and you want to delete only part of them,
refer to the `Update zone records` endpoint.

- **Method**: `DELETE`
- **Path**: `/api/dns/v1/zones/{domain}`

**Parameters**:

- `domain`: Domain name (required)

### DNS_resetZoneRecordsV1

This endpoint resets DNS zone to the default records.

- **Method**: `POST`
- **Path**: `/api/dns/v1/zones/{domain}/reset`

**Parameters**:

- `domain`: Domain name (required)
- `sync`: Determines if operation should be run synchronously 
- `reset_email_records`: Determines if email records should be reset 
- `whitelisted_record_types`: Specifies which record types to not reset 

### DNS_validateZoneRecordsV1

This endpoint used to validate DNS records prior update for the selected domain. 

If the validation is successful, the response will contain `200 Success` code.
If there is validation error, the response will fail with `422 Validation error` code.

- **Method**: `POST`
- **Path**: `/api/dns/v1/zones/{domain}/validate`

**Parameters**:

- `domain`: Domain name (required)
- `overwrite`: If `true`, resource records (RRs) matching name and type will be deleted and new RRs will be created, otherwise resource records' ttl's are updated and new records are appended. If no matching RRs are found, they are created. 
- `zone`: zone parameter (required)

### domains_checkDomainAvailabilityV1

This endpoint checks the availability of a domain name. Multiple TLDs can be checked at once.
If you want to get alternative domains with response, provide only one TLD in the request and set `with_alternatives` to `true`.
TLDs should be provided without the leading dot (e.g. `com`, `net`, `org`).

Endpoint has rate limit of 10 requests per minute.

- **Method**: `POST`
- **Path**: `/api/domains/v1/availability`

**Parameters**:

- `domain`: Domain name (without TLD) (required)
- `tlds`: TLDs list (required)
- `with_alternatives`: Should response include alternatives 

### domains_getForwardingDataV1

This endpoint retrieves domain forwarding data.

- **Method**: `GET`
- **Path**: `/api/domains/v1/forwarding/{domain}`

**Parameters**:

- `domain`: Domain name (required)

### domains_deleteForwardingDataV1

This endpoint deletes domain forwarding data.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/forwarding/{domain}`

**Parameters**:

- `domain`: Domain name (required)

### domains_createForwardingDataV1

This endpoint creates domain forwarding data.

- **Method**: `POST`
- **Path**: `/api/domains/v1/forwarding`

**Parameters**:

- `domain`: Domain name (required)
- `redirect_type`: Redirect type (required)
- `redirect_url`: URL to forward domain to (required)

### domains_enableDomainLockV1

This endpoint enables domain lock for the domain. When domain lock is enabled, 
the domain cannot be transferred to another registrar without first disabling the lock.

- **Method**: `PUT`
- **Path**: `/api/domains/v1/portfolio/{domain}/domain-lock`

**Parameters**:

- `domain`: Domain name (required)

### domains_disableDomainLockV1

This endpoint disables domain lock for the domain. Domain lock needs to be disabled 
before transferring the domain to another registrar.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/portfolio/{domain}/domain-lock`

**Parameters**:

- `domain`: Domain name (required)

### domains_getDomainV1

This endpoint retrieves details for specified domain.

- **Method**: `GET`
- **Path**: `/api/domains/v1/portfolio/{domain}`

**Parameters**:

- `domain`: Domain name (required)

### domains_getDomainListV1

This endpoint retrieves a list of all domains associated with your account.

- **Method**: `GET`
- **Path**: `/api/domains/v1/portfolio`



### domains_purchaseNewDomainV1

This endpoint allows you to buy (purchase) and register a new domain name. 

If registration fails, login to [hPanel](https://hpanel.hostinger.com/) and check the domain registration status.

If no payment method is provided, your default payment method will be used automatically.

If no WHOIS information is provided, the default contact information for that TLD (Top-Level Domain) will be used. 
Before making a request, ensure that WHOIS information for the desired TLD exists in your account.

Some TLDs require `additional_details` to be provided and these will be validated before completing the purchase. The required additional details vary by TLD.

- **Method**: `POST`
- **Path**: `/api/domains/v1/portfolio`

**Parameters**:

- `domain`: Domain name (required)
- `item_id`: Catalog price item ID (required)
- `payment_method_id`: Payment method ID, default will be used if not provided 
- `domain_contacts`: Domain contact information 
- `additional_details`: Additional registration data, possible values depends on TLD 
- `coupons`: Discount coupon codes 

### domains_enablePrivacyProtectionV1

This endpoint enables privacy protection for the domain.
When privacy protection is enabled, the domain owner's personal information is hidden from the public WHOIS database.

- **Method**: `PUT`
- **Path**: `/api/domains/v1/portfolio/{domain}/privacy-protection`

**Parameters**:

- `domain`: Domain name (required)

### domains_disablePrivacyProtectionV1

This endpoint disables privacy protection for the domain.
When privacy protection is disabled, the domain owner's personal information is visible in the public WHOIS database.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/portfolio/{domain}/privacy-protection`

**Parameters**:

- `domain`: Domain name (required)

### domains_updateNameserversV1

This endpoint sets the nameservers for a specified domain.

Be aware, that improper nameserver configuration can lead to the domain being unresolvable or unavailable. 

- **Method**: `PUT`
- **Path**: `/api/domains/v1/portfolio/{domain}/nameservers`

**Parameters**:

- `domain`: Domain name (required)
- `ns1`: First name server (required)
- `ns2`: Second name server (required)
- `ns3`: Third name server 
- `ns4`: Fourth name server 

### domains_getWHOISProfileV1

This endpoint retrieves a WHOIS contact profile.

- **Method**: `GET`
- **Path**: `/api/domains/v1/whois/{whoisId}`

**Parameters**:

- `whoisId`: WHOIS ID (required)

### domains_deleteWHOISProfileV1

This endpoint deletes WHOIS contact profile.

- **Method**: `DELETE`
- **Path**: `/api/domains/v1/whois/{whoisId}`

**Parameters**:

- `whoisId`: WHOIS ID (required)

### domains_getWHOISProfileListV1

This endpoint retrieves a list of WHOIS contact profiles.

- **Method**: `GET`
- **Path**: `/api/domains/v1/whois`

**Parameters**:

- `tld`: Filter by TLD (without leading dot) 

### domains_createWHOISProfileV1

This endpoint creates WHOIS contact profile.

- **Method**: `POST`
- **Path**: `/api/domains/v1/whois`

**Parameters**:

- `tld`: TLD of the domain (without leading dot) (required)
- `country`: ISO 3166 2-letter country code (required)
- `entity_type`: Legal entity type (required)
- `tld_details`: TLD details 
- `whois_details`: WHOIS details (required)

### domains_getWHOISProfileUsageV1

This endpoint retrieves a domain list where provided WHOIS contact profile is used.

- **Method**: `GET`
- **Path**: `/api/domains/v1/whois/{whoisId}/usage`

**Parameters**:

- `whoisId`: WHOIS ID (required)

### VPS_getDataCentersListV1

This endpoint retrieves a list of all data centers available.

- **Method**: `GET`
- **Path**: `/api/vps/v1/data-centers`



### VPS_activateFirewallV1

This endpoint activates a firewall for a specified virtual machine. 

Only one firewall can be active for a virtual machine at a time.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall/{firewallId}/activate/{virtualMachineId}`

**Parameters**:

- `firewallId`: Firewall ID (required)
- `virtualMachineId`: Virtual Machine ID (required)

### VPS_deactivateFirewallV1

This endpoint deactivates a firewall for a specified virtual machine.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall/{firewallId}/deactivate/{virtualMachineId}`

**Parameters**:

- `firewallId`: Firewall ID (required)
- `virtualMachineId`: Virtual Machine ID (required)

### VPS_getFirewallV1

This endpoint retrieves firewall by its ID and rules associated with it.

- **Method**: `GET`
- **Path**: `/api/vps/v1/firewall/{firewallId}`

**Parameters**:

- `firewallId`: Firewall ID (required)

### VPS_deleteFirewallV1

This endpoint deletes a specified firewall. 

Any virtual machine that has this firewall activated will automatically have it deactivated.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/firewall/{firewallId}`

**Parameters**:

- `firewallId`: Firewall ID (required)

### VPS_getFirewallListV1

This endpoint retrieves a list of all firewalls available.

- **Method**: `GET`
- **Path**: `/api/vps/v1/firewall`

**Parameters**:

- `page`: Page number 

### VPS_createNewFirewallV1

This endpoint creates a new firewall.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall`

**Parameters**:

- `name`: name parameter (required)

### VPS_updateFirewallRuleV1

This endpoint updates a specific firewall rule from a specified firewall.

Any virtual machine that has this firewall activated will loose sync with the firewall and will have to be synced again manually.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/firewall/{firewallId}/rules/{ruleId}`

**Parameters**:

- `firewallId`: Firewall ID (required)
- `ruleId`: Firewall Rule ID (required)
- `protocol`: protocol parameter (required)
- `port`: Port or port range, ex: 1024:2048 (required)
- `source`: source parameter (required)
- `source_detail`: IP range, CIDR, single IP or `any` (required)

### VPS_deleteFirewallRuleV1

This endpoint deletes a specific firewall rule from a specified firewall.

Any virtual machine that has this firewall activated will loose sync with the firewall and will have to be synced again manually.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/firewall/{firewallId}/rules/{ruleId}`

**Parameters**:

- `firewallId`: Firewall ID (required)
- `ruleId`: Firewall Rule ID (required)

### VPS_createFirewallRuleV1

This endpoint creates new firewall rule from a specified firewall. 
By default, the firewall drops all incoming traffic, which means you must add accept rules for all ports you want to use.

Any virtual machine that has this firewall activated will loose sync with the firewall and will have to be synced again manually.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall/{firewallId}/rules`

**Parameters**:

- `firewallId`: Firewall ID (required)
- `protocol`: protocol parameter (required)
- `port`: Port or port range, ex: 1024:2048 (required)
- `source`: source parameter (required)
- `source_detail`: IP range, CIDR, single IP or `any` (required)

### VPS_syncFirewallV1

This endpoint syncs a firewall for a specified virtual machine.

Firewall can loose sync with virtual machine if the firewall has new rules added, removed or updated.

- **Method**: `POST`
- **Path**: `/api/vps/v1/firewall/{firewallId}/sync/{virtualMachineId}`

**Parameters**:

- `firewallId`: Firewall ID (required)
- `virtualMachineId`: Virtual Machine ID (required)

### VPS_getPostInstallScriptV1

This endpoint retrieves post-install script by its ID.

- **Method**: `GET`
- **Path**: `/api/vps/v1/post-install-scripts/{postInstallScriptId}`

**Parameters**:

- `postInstallScriptId`: Post-install script ID (required)

### VPS_updatePostInstallScriptV1

This endpoint updates a specific post-install script.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/post-install-scripts/{postInstallScriptId}`

**Parameters**:

- `postInstallScriptId`: Post-install script ID (required)
- `name`: Name of the script (required)
- `content`: Content of the script (required)

### VPS_deleteAPostInstallScriptV1

This endpoint deletes a post-install script from your account. 

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/post-install-scripts/{postInstallScriptId}`

**Parameters**:

- `postInstallScriptId`: Post-install script ID (required)

### VPS_getPostInstallScriptListV1

This endpoint retrieves a list of post-install scripts associated with your account.

- **Method**: `GET`
- **Path**: `/api/vps/v1/post-install-scripts`

**Parameters**:

- `page`: Page number 

### VPS_createPostInstallScriptV1

This endpoint allows you to add a new post-install script to your account, 
which can then be used run after the installation of a virtual machine instance.

The script contents will be saved to the file `/post_install` with executable attribute set and will be executed once virtual machine is installed.
The output of the script will be redirected to `/post_install.log`. Maximum script size is 48KB. 

- **Method**: `POST`
- **Path**: `/api/vps/v1/post-install-scripts`

**Parameters**:

- `name`: Name of the script (required)
- `content`: Content of the script (required)

### VPS_attachPublicKeyV1

This endpoint attaches an existing public keys from your account to a specified virtual machine.

Multiple keys can be attached to a single virtual machine.

- **Method**: `POST`
- **Path**: `/api/vps/v1/public-keys/attach/{virtualMachineId}`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
- `ids`: Public Key IDs to attach (required)

### VPS_deleteAPublicKeyV1

This endpoint deletes a public key from your account. 

**Deleting public key from account does not remove it from virtual machine** 

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/public-keys/{publicKeyId}`

**Parameters**:

- `publicKeyId`: Public Key ID (required)

### VPS_getPublicKeyListV1

This endpoint retrieves a list of public keys associated with your account.

- **Method**: `GET`
- **Path**: `/api/vps/v1/public-keys`

**Parameters**:

- `page`: Page number 

### VPS_createNewPublicKeyV1

This endpoint allows you to add a new public key to your account, 
which can then be attached to virtual machine instances for secure access.

- **Method**: `POST`
- **Path**: `/api/vps/v1/public-keys`

**Parameters**:

- `name`: name parameter (required)
- `key`: key parameter (required)

### VPS_getTemplateV1

This endpoint retrieves details of a specific OS template for virtual machines.

- **Method**: `GET`
- **Path**: `/api/vps/v1/templates/{templateId}`

**Parameters**:

- `templateId`: Template ID (required)

### VPS_getTemplateListV1

This endpoint retrieves a list of available OS templates for virtual machines.

- **Method**: `GET`
- **Path**: `/api/vps/v1/templates`



### VPS_getActionV1

This endpoint retrieves details of a specific action performed on a specified virtual machine. 

This endpoint allows you to view detailed information about a particular action, including the action name, timestamp, and status.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/actions/{actionId}`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
- `actionId`: Action ID (required)

### VPS_getActionListV1

This endpoint retrieves a list of actions performed on a specified virtual machine.

Actions are operations or events that have been executed on the virtual machine, such as starting, stopping, or modifying 
the machine. This endpoint allows you to view the history of these actions, providing details about each action, 
such as the action name, timestamp, and status.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/actions`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
- `page`: Page number 

### VPS_getAttachedPublicKeysV1

This endpoint retrieves a list of public keys attached to a specified virtual machine.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/public-keys`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
- `page`: Page number 

### VPS_getBackupListV1

This endpoint retrieves a list of backups for a specified virtual machine.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/backups`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
- `page`: Page number 

### VPS_restoreBackupV1

This endpoint restores a backup for a specified virtual machine.

The system will then initiate the restore process, which may take some time depending on the size of the backup.

**All data on the virtual machine will be overwritten with the data from the backup.**

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/backups/{backupId}/restore`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
- `backupId`: Backup ID (required)

### VPS_setHostnameV1

This endpoint sets the hostname for a specified virtual machine. 
Changing hostname does not update PTR record automatically.
If you want your virtual machine to be reachable by a hostname, 
you need to point your domain A/AAAA records to virtual machine IP as well.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/hostname`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
- `hostname`: hostname parameter (required)

### VPS_resetHostnameV1

This endpoint resets the hostname and PTR record of a specified virtual machine to the default value.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/hostname`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)

### VPS_getVirtualMachineV1

This endpoint retrieves detailed information about a specified virtual machine.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)

### VPS_getVirtualMachineListV1

This endpoint retrieves a list of all available virtual machines.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines`



### VPS_purchaseNewVirtualMachineV1

This endpoint allows you to buy (purchase) and setup a new virtual machine.

If virtual machine setup fails for any reason, login to [hPanel](https://hpanel.hostinger.com/) and complete the setup manually.

If no payment method is provided, your default payment method will be used automatically.                        

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines`

**Parameters**:

- `item_id`: Catalog price item ID (required)
- `payment_method_id`: Payment method ID, default will be used if not provided 
- `setup`: setup parameter (required)
- `coupons`: Discount coupon codes 

### VPS_getScanMetricsV1

This endpoint retrieves the scan metrics for the [Monarx](https://www.monarx.com/) malware scanner installed on a specified virtual machine.
The scan metrics provide detailed information about the malware scans performed by Monarx, including the number of scans, 
detected threats, and other relevant statistics. This information is useful for monitoring the security status of the 
virtual machine and assessing the effectiveness of the malware scanner.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/monarx`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)

### VPS_installMonarxV1

This endpoint installs the Monarx malware scanner on a specified virtual machine. 

[Monarx](https://www.monarx.com/) is a security tool designed to detect and prevent malware infections on virtual machines. 
By installing Monarx, users can enhance the security of their virtual machines, ensuring that they are protected against malicious software.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/monarx`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)

### VPS_uninstallMonarxV1

This endpoint uninstalls the Monarx malware scanner on a specified virtual machine.
If Monarx is not installed, the request will still be processed without any effect.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/monarx`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)

### VPS_getMetricsV1

This endpoint retrieves the historical metrics for a specified virtual machine.
It includes the following metrics: 
- CPU usage
- Memory usage
- Disk usage
- Network usage
- Uptime

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/metrics`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
- `date_from`: date_from parameter (required)
- `date_to`: date_to parameter (required)

### VPS_setNameserversV1

This endpoint sets the nameservers for a specified virtual machine.
Be aware, that improper nameserver configuration can lead to the virtual machine being unable to resolve domain names.

- **Method**: `PUT`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/nameservers`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
- `ns1`: ns1 parameter (required)
- `ns2`: ns2 parameter 
- `ns3`: ns3 parameter 

### VPS_createPTRRecordV1

This endpoint creates or updates a PTR (Pointer) record for a specified virtual machine.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/ptr`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)

### VPS_deletePTRRecordV1

This endpoint deletes a PTR (Pointer) record for a specified virtual machine. 

Once deleted, reverse DNS lookups to the virtual machine's IP address will no longer return the previously configured hostname.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/ptr`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)

### VPS_setPanelPasswordV1

This endpoint sets the panel password for a specified virtual machine. 
If virtual machine does not use panel OS, the request will still be processed without any effect.
Requirements for the password is the same as in the [recreate virtual machine endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).

- **Method**: `PUT`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/panel-password`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
- `password`: Panel password for the virtual machine (required)

### VPS_startRecoveryModeV1

This endpoint initiates the recovery mode for a specified virtual machine. 
Recovery mode is a special state that allows users to perform system rescue operations, 
such as repairing file systems, recovering data, or troubleshooting issues that prevent the virtual machine 
from booting normally. 

Virtual machine will boot recovery disk image and original disk image will be mounted in `/mnt` directory.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/recovery`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
- `root_password`: Temporary root password for recovery mode (required)

### VPS_stopRecoveryModeV1

This endpoint stops the recovery mode for a specified virtual machine. 
If virtual machine is not in recovery mode, this operation will fail.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/recovery`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)

### VPS_recreateVirtualMachineV1

This endpoint will recreate a virtual machine from scratch. 
The recreation process involves reinstalling the operating system and resetting the virtual machine to its initial state.
Snapshots, if there are any, will be deleted.

## Password Requirements
Password will be checked against leaked password databases. 
Requirements for the password are:
- At least 8 characters long
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Is not leaked publicly

**This operation is irreversible and will result in the loss of all data stored on the virtual machine!**

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/recreate`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
- `template_id`: Template ID (required)
- `password`: Password for the virtual machine. If not provided, random password will be generated. Password will not be shown in the response. 
- `post_install_script_id`: Post-install script ID 

### VPS_restartVirtualMachineV1

This endpoint restarts a specified virtual machine. This is equivalent to fully stopping and starting the virtual machine.
If the virtual machine was stopped, it will be started.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/restart`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)

### VPS_setRootPasswordV1

This endpoint sets the root password for a specified virtual machine. 
Requirements for the password is the same as in the [recreate virtual machine endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).

- **Method**: `PUT`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/root-password`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
- `password`: Root password for the virtual machine (required)

### VPS_setupNewVirtualMachineV1

This endpoint will setup newly purchased virtual machine with `initial` state. 

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/setup`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
- `template_id`: Template ID (required)
- `data_center_id`: Data center ID (required)
- `post_install_script_id`: Post-install script ID 
- `password`: Password for the virtual machine. If not provided, random password will be generated. Password will not be shown in the response. 
- `hostname`: Override default hostname of the virtual machine 
- `install_monarx`: Install Monarx malware scanner (if supported) 
- `enable_backups`: Enable weekly backup schedule 
- `ns1`: Name server 1 
- `ns2`: Name server 2 
- `public_key`: Use SSH key 

### VPS_getSnapshotV1

This endpoint retrieves a snapshot for a specified virtual machine.

- **Method**: `GET`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)

### VPS_createSnapshotV1

This endpoint creates a snapshot of a specified virtual machine. 
A snapshot captures the state and data of the virtual machine at a specific point in time, 
allowing users to restore the virtual machine to that state if needed. 
This operation is useful for backup purposes, system recovery, 
and testing changes without affecting the current state of the virtual machine.

**Creating new snapshot will overwrite the existing snapshot!**

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)

### VPS_deleteSnapshotV1

This endpoint deletes a snapshot of a specified virtual machine.

- **Method**: `DELETE`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)

### VPS_restoreSnapshotV1

This endpoint restores a specified virtual machine to a previous state using a snapshot. 
Restoring from a snapshot allows users to revert the virtual machine to that state, which is useful for system recovery, undoing changes, or testing.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot/restore`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)

### VPS_startVirtualMachineV1

This endpoint starts a specified virtual machine. 
If the virtual machine is already running, the request will still be processed without any effect.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/start`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)

### VPS_stopVirtualMachineV1

This endpoint stops a specified virtual machine. 
If the virtual machine is already stopped, the request will still be processed without any effect.

- **Method**: `POST`
- **Path**: `/api/vps/v1/virtual-machines/{virtualMachineId}/stop`

**Parameters**:

- `virtualMachineId`: Virtual Machine ID (required)
