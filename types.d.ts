/**
 * Type definitions for the API endpoints
 * Auto-generated from OpenAPI specification
 */

export interface APITools {
  /**
   * Deploy a node-static Agency Plan (h5g) website from an archive file. WARNING: this overwrites the website's existing contents and cannot be undone — always confirm with the user before proceeding. Use this for Agency Plan websites of type node-static (a Node.js-built static site that requires a build step or a plain simple static site). The tool resolves the website from its domain, uploads the archive to the website's file browser over TUS, and triggers the build-assets process which builds the site and deploys the result to public_html. This operation is synchronous: the build and deployment complete before the tool returns, so the website is live as soon as the tool finishes successfully — there is no separate asynchronous build to wait for or poll. For plain PHP applications that should be extracted as-is, use agencyHosting_deployPhpApplication instead. The website UID is automatically resolved from the domain.
   */
  "agencyHosting_deployNodeStaticWebsite": {
    params: {
      /**
       * Domain name of the Agency Plan website (e.g., example.com)
       */
      domain: string;
      /**
       * Absolute or relative path to the website archive file. Supported formats: zip, tar, tar.gz, tgz. The archive must contain the application source files. If user provides a directory path, create an archive from it before proceeding using EXACTLY this naming pattern: directoryname_YYYYMMDD_HHMMSS.zip (e.g., mywebsite_20250115_143022.zip)
       */
      archivePath: string;
      /**
       * Whether to remove the local archive file after successful deployment (default: true)
       */
      removeArchive?: boolean;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Deploy a PHP (or other non-build) Agency Plan (h5g) website from an archive file. WARNING: this overwrites the website's existing contents and cannot be undone — always confirm with the user before proceeding. Use this for Agency Plan websites where the archive contents should be extracted and served as-is with no build step (e.g., PHP applications). The tool resolves the website from its domain, uploads the archive to the website's file browser over TUS, and triggers the import-archive process which overwrites the website contents with the archive contents. This operation is synchronous: the archive is extracted and deployed before the tool returns, so the website is live as soon as the tool finishes successfully — there is no separate asynchronous build to wait for or poll. For node-static websites that require a build step, use agencyHosting_deployNodeStaticWebsite instead. The website UID is automatically resolved from the domain.
   */
  "agencyHosting_deployPhpApplication": {
    params: {
      /**
       * Domain name of the Agency Plan website (e.g., example.com)
       */
      domain: string;
      /**
       * Absolute or relative path to the website archive file. Supported formats: zip, tar, tar.gz, tgz. If user provides a directory path, create an archive from it before proceeding using EXACTLY this naming pattern: directoryname_YYYYMMDD_HHMMSS.zip (e.g., mywebsite_20250115_143022.zip)
       */
      archivePath: string;
      /**
       * Whether to remove the local archive file after successful deployment (default: true)
       */
      removeArchive?: boolean;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Import a WordPress website from an archive file to a hosting server. This tool uploads a website archive (zip, tar, tar.gz, etc.) and a database dump (.sql file) to deploy a complete WordPress website. The archive will be extracted on the server automatically. Note: This process may take a while for larger sites. After upload completion, files are being extracted and the site will be available in a few minutes. The username will be automatically resolved from the domain.
   */
  "hosting_importWordpressWebsite": {
    params: {
      /**
       * Domain name associated with the hosting account (e.g., example.com)
       */
      domain: string;
      /**
       * Absolute or relative path to the website archive file. Supported formats: zip, tar, tar.gz, tgz, 7z, gz, gzip. If user provides directory path, create archive from it before proceeding using EXACTLY this naming pattern: directoryname_YYYYMMDD_HHMMSS.zip (e.g., mywebsite_20250115_143022.zip)
       */
      archivePath: string;
      /**
       * Absolute or relative path to a database dump file (.sql)
       */
      databaseDump: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Deploy a WordPress plugin from a directory to a hosting server. This tool uploads all plugin files and triggers plugin deployment.
   */
  "hosting_deployWordpressPlugin": {
    params: {
      /**
       * Domain name associated with the hosting account (e.g., example.com)
       */
      domain: string;
      /**
       * WordPress plugin slug (e.g., omnisend)
       */
      slug: string;
      /**
       * Absolute or relative path to the plugin directory containing all plugin files
       */
      pluginPath: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Deploy a WordPress theme from a directory to a hosting server. This tool uploads all theme files and triggers theme deployment. The uploaded theme can optionally be activated after deployment.
   */
  "hosting_deployWordpressTheme": {
    params: {
      /**
       * Domain name associated with the hosting account (e.g., example.com)
       */
      domain: string;
      /**
       * WordPress theme slug (e.g., twentytwentyfive)
       */
      slug: string;
      /**
       * Absolute or relative path to the theme directory containing all theme files
       */
      themePath: string;
      /**
       * Whether to activate the theme after deployment (default: false)
       */
      activate?: boolean;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Deploy a JavaScript application from an archive file to a hosting server. IMPORTANT: the archive must ONLY contain application source files, not the build output, skip node_modules directory; also exclude all files matched by .gitignore if the ignore file exists. The build process will be triggered automatically on the server after the archive is uploaded. After deployment, use the hosting_listJsDeployments tool to check deployment status and track build progress.
   */
  "hosting_deployJsApplication": {
    params: {
      /**
       * Domain name associated with the hosting account (e.g., example.com)
       */
      domain: string;
      /**
       * Absolute or relative path to the application archive file. Supported formats: zip, tar, tar.gz, tgz, 7z, gz, gzip. If user provides directory path, create archive from it before proceeding. IMPORTANT: the archive must ONLY contain application source files, not the build output, skip node_modules directory.
       */
      archivePath: string;
      /**
       * Whether to remove the archive file after successful deployment (default: false)
       */
      removeArchive?: boolean;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Deploy a static website from an archive file to a hosting server. IMPORTANT: This tool only works for static websites with no build process. The archive must contain pre-built static files (HTML, CSS, JavaScript, images, etc.) ready to be served. If the website has a package.json file or requires a build command, use hosting_deployJsApplication instead. The archive will be extracted and deployed directly without any build steps. The username will be automatically resolved from the domain.
   */
  "hosting_deployStaticWebsite": {
    params: {
      /**
       * Domain name associated with the hosting account (e.g., example.com)
       */
      domain: string;
      /**
       * Absolute or relative path to the static website archive file. Supported formats: zip, tar, tar.gz, tgz, 7z, gz, gzip. If user provides directory path, create archive from it before proceeding using EXACTLY this naming pattern: directoryname_YYYYMMDD_HHMMSS.zip (e.g., mystaticwebsite_20250115_143022.zip)
       */
      archivePath: string;
      /**
       * Whether to remove the archive file after successful deployment (default: false)
       */
      removeArchive?: boolean;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * List javascript application deployments for checking their status. Use this tool when customer asks for the status of the deployment. This tool retrieves a paginated list of Node.js application deployments for a domain with optional filtering by deployment states.
   */
  "hosting_listJsDeployments": {
    params: {
      /**
       * Domain name associated with the hosting account (e.g., example.com)
       */
      domain: string;
      /**
       * Page number for pagination (optional)
       */
      page?: number;
      /**
       * Number of items per page (optional)
       */
      perPage?: number;
      /**
       * Filter by deployment states (optional). Valid values: pending, completed, running, failed
       */
      states?: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve logs for a specified JavaScript application deployment for debugging purposes in case of failure.
   */
  "hosting_showJsDeploymentLogs": {
    params: {
      /**
       * Domain name associated with the hosting account (e.g., example.com)
       */
      domain: string;
      /**
       * Line from which to retrieve logs (optional, default 0)
       */
      fromLine?: number;
      /**
       * UUID of the JavaScript deployment build
       */
      buildUuid: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Lists the datacenters available for provisioning a new website on the given Agency Plan
hosting order.

Each datacenter includes a `pinger_url` you can ping from the client to measure round-trip
latency; comparing the results across datacenters lets you pick the nearest one (lowest
ping) before choosing its `code` as the `datacenter_code` when creating a website setup.
   */
  "agency-hosting_listAvailableDatacentersForAnAgencyPlanOrderV1": {
    params: {
      /**
       * Agency Plan order ID
       */
      order_id: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Changes the primary domain for an Agency Plan website.

Provide the current domain in the path and the new domain in the request body.
Set domain to null to revert to the temporary domain.
   */
  "agency-hosting_changeAgencyPlanWebsiteDomainV1": {
    params: {
      /**
       * Agency Plan website UID
       */
      website_uid: string;
      /**
       * Current domain name to change from
       */
      from_domain: string;
      /**
       * New domain to assign to the website. Set to null to revert to the temporary domain.
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Links a domain to the specified Agency Plan website so it can serve traffic for that domain.
   */
  "agency-hosting_linkDomainToAgencyPlanWebsiteV1": {
    params: {
      /**
       * Agency Plan website UID
       */
      website_uid: string;
      /**
       * Fully qualified domain name to link to the website
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Returns a paginated list of domains associated with Agency Plan websites accessible to the authenticated client.

Use the website_uuids filter to narrow results to specific websites.
   */
  "agency-hosting_listAgencyPlanDomainsV1": {
    params: {
      /**
       * Page number
       */
      page?: number;
      /**
       * Number of items per page
       */
      per_page?: number;
      /**
       * Filter by website UIDs
       */
      website_uuids?: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Unlinks a domain from the specified Agency Plan website.

The website stops serving traffic on this domain immediately.

Website files and database are preserved, and any other linked domains remain accessible.

If this is the only domain on the website, unlinking leaves the website without an accessible domain.
   */
  "agency-hosting_unlinkDomainFromAgencyPlanWebsiteV1": {
    params: {
      /**
       * Agency Plan website UID
       */
      website_uid: string;
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Imports an Agency Plan website from an already-uploaded archive.

Upload the archive to the website's root directory via file browser first, then provide its
filename in this request. Website contents are overwritten by the archive contents. Supported
archive types: .zip, .tar, .tar.gz, .tgz.
   */
  "agency-hosting_importAgencyPlanWebsiteFromArchiveV1": {
    params: {
      /**
       * Agency Plan website UID
       */
      website_uid: string;
      /**
       * Archive filename (e.g., archive.zip). The file must already be uploaded to the website's .h5g/ directory.
       */
      archive_name: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Provisions a new website on one of your Agency Plan hosting orders.

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
   */
  "agency-hosting_provisionANewAgencyPlanWebsiteV1": {
    params: {
      /**
       * Agency Plan order ID
       */
      order_id: number;
      /**
       * Datacenter code where the website should be provisioned. Available codes depend on live capacity and are not a fixed set.
       */
      datacenter_code: string;
      /**
       * Setup flavor: a specific WordPress version in the format `wp-<major>.<minor>` or `wp-<major>.<minor>.<patch>` (e.g. `wp-6.8.2`), or `php-fpm` for a plain PHP stack. Generic versions like `wp-latest` are not allowed.
       */
      flavor: string;
      /**
       * Website settings
       */
      settings: object;
      /**
       * Primary domain to attach to the website. Omit or set to null to get a free auto-generated *.hostingersite.com subdomain instead.
       */
      domain?: string;
      /**
       * Website type
       */
      type?: string;
      /**
       * WordPress installation options
       */
      wordpress?: object;
      /**
       * Clone the new website from an existing website
       */
      clone?: object;
      /**
       * Derive the domain from an existing vhost
       */
      derive_domain?: object;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Returns the current status of an Agency Plan website setup started via the setups
endpoint.

Poll this endpoint using the `setup_uuid` returned from the provisioning request until
`status` becomes `completed`, at which point `website_uid` identifies the new website.
   */
  "agency-hosting_getAgencyPlanWebsiteSetupStatusV1": {
    params: {
      /**
       * Agency Plan order ID
       */
      order_id: number;
      /**
       * Website setup UUID
       */
      setup_uuid: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Builds and deploys a Node.js application for an Agency Plan website from an already-uploaded archive.

Upload the archive to file browser first, then provide its relative path from document root in this request.
Website contents are overwritten by the build result, which is deployed to public_html.
   */
  "agency-hosting_buildAgencyPlanWebsiteNodeJSAssetsV1": {
    params: {
      /**
       * Agency Plan website UID
       */
      website_uid: string;
      /**
       * Directory, relative to the website document root, where the uploaded site archive currently lives. Most commonly this is simply `public_html`.
       */
      archive_path: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieves detailed information about a specific Agency Plan website, including configuration,
status, metadata, hosting plan details, and resource quotas.
   */
  "agency-hosting_getAgencyPlanWebsiteDetailsV1": {
    params: {
      /**
       * Agency Plan website UID
       */
      website_uid: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Deletes an Agency Plan website and schedules cleanup of its resources.

This action is irreversible. Website files, databases, and linked domains are removed.
   */
  "agency-hosting_deleteAgencyPlanWebsiteV1": {
    params: {
      /**
       * Agency Plan website UID
       */
      website_uid: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Lists active and recently completed asynchronous processes for an Agency Plan website.

Each process has a unique ID (for tracking), a type, and a status (running, completed, failed).
Poll this endpoint after initiating async operations (SSL setup, backups, cloning) to track progress.
   */
  "agency-hosting_listRunningAgencyPlanWebsiteProcessesV1": {
    params: {
      /**
       * Agency Plan website UID
       */
      website_uid: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve catalog items available for order.

Prices in catalog items is displayed as cents (without floating point),
e.g: float `17.99` is displayed as integer `1799`.

Use this endpoint to view available services and pricing before placing orders.
   */
  "billing_getCatalogItemListV1": {
    params: {
      /**
       * Filter catalog items by category
       */
      category?: string;
      /**
       * Filter catalog items by name. Use `*` for wildcard search, e.g. `.COM*` to find .com domain
       */
      name?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Set the default payment method for your account.

Use this endpoint to configure the primary payment method for future orders.
   */
  "billing_setDefaultPaymentMethodV1": {
    params: {
      /**
       * Payment method ID
       */
      paymentMethodId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Delete a payment method from your account.

Use this endpoint to remove unused payment methods from user accounts.
   */
  "billing_deletePaymentMethodV1": {
    params: {
      /**
       * Payment method ID
       */
      paymentMethodId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve available payment methods that can be used for placing new orders.

If you want to add new payment method,
please use [hPanel](https://hpanel.hostinger.com/billing/payment-methods).

Use this endpoint to view available payment options before creating orders.
   */
  "billing_getPaymentMethodListV1": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve a list of all subscriptions associated with your account.

Use this endpoint to monitor active services and billing status.
   */
  "billing_getSubscriptionListV1": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Disable auto-renewal for a subscription.

Use this endpoint when disable auto-renewal for a subscription.
   */
  "billing_disableAutoRenewalV1": {
    params: {
      /**
       * Subscription ID
       */
      subscriptionId: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Enable auto-renewal for a subscription.

Use this endpoint when enable auto-renewal for a subscription.
   */
  "billing_enableAutoRenewalV1": {
    params: {
      /**
       * Subscription ID
       */
      subscriptionId: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve particular DNS snapshot with contents of DNS zone records.

Use this endpoint to view historical DNS configurations for domains.
   */
  "DNS_getDNSSnapshotV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
      /**
       * Snapshot ID
       */
      snapshotId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve DNS snapshots for a domain.

Use this endpoint to view available DNS backup points for restoration.
   */
  "DNS_getDNSSnapshotListV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Restore DNS zone to the selected snapshot.

Use this endpoint to revert domain DNS to a previous configuration.
   */
  "DNS_restoreDNSSnapshotV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
      /**
       * Snapshot ID
       */
      snapshotId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve DNS zone records for a specific domain.

Use this endpoint to view current DNS configuration for domain management.
   */
  "DNS_getDNSRecordsV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Update DNS records for the selected domain.

Using `overwrite = true` will replace existing records with the provided ones. 
Otherwise existing records will be updated and new records will be added.

Use this endpoint to modify domain DNS configuration.
   */
  "DNS_updateDNSRecordsV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
      /**
       * If `true`, resource records (RRs) matching name and type will be deleted and new RRs will be created,
otherwise resource records' ttl's are updated and new records are appended.
If no matching RRs are found, they are created.
       */
      overwrite?: boolean;
      /**
       * zone parameter
       */
      zone: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Delete DNS records for the selected domain.

To filter which records to delete, add the `name` of the record and `type` to the filter. 
Multiple filters can be provided with single request.

If you have multiple records with the same name and type, and you want to delete only part of them,
refer to the `Update zone records` endpoint.

Use this endpoint to remove specific DNS records from domains.
   */
  "DNS_deleteDNSRecordsV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Reset DNS zone to the default records.

Use this endpoint to restore domain DNS to original configuration.
   */
  "DNS_resetDNSRecordsV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
      /**
       * Determines if operation should be run synchronously
       */
      sync?: boolean;
      /**
       * Determines if email records should be reset
       */
      reset_email_records?: boolean;
      /**
       * Specifies which record types to not reset
       */
      whitelisted_record_types?: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Validate DNS records prior to update for the selected domain.

If the validation is successful, the response will contain `200 Success` code.
If there is validation error, the response will fail with `422 Validation error` code.

Use this endpoint to verify DNS record validity before applying changes.
   */
  "DNS_validateDNSRecordsV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
      /**
       * If `true`, resource records (RRs) matching name and type will be deleted and new RRs will be created,
otherwise resource records' ttl's are updated and new records are appended.
If no matching RRs are found, they are created.
       */
      overwrite?: boolean;
      /**
       * zone parameter
       */
      zone: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve a list of pending and completed domain verifications.
   */
  "v2_getDomainVerificationsDIRECT": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Check availability of domain names across multiple TLDs.

Multiple TLDs can be checked at once.
If you want alternative domains with response, provide only one TLD and set `with_alternatives` to `true`.
TLDs should be provided without leading dot (e.g. `com`, `net`, `org`).

Endpoint has rate limit of 10 requests per minute.

Use this endpoint to verify domain availability before purchase.
   */
  "domains_checkDomainAvailabilityV1": {
    params: {
      /**
       * Domain name (without TLD)
       */
      domain: string;
      /**
       * TLDs list
       */
      tlds: array;
      /**
       * Should response include alternatives
       */
      with_alternatives?: boolean;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve domain forwarding data.

Use this endpoint to view current redirect configuration for domains.
   */
  "domains_getDomainForwardingV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Delete domain forwarding data.

Use this endpoint to remove redirect configuration from domains.
   */
  "domains_deleteDomainForwardingV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create domain forwarding configuration.

Use this endpoint to set up domain redirects to other URLs.
   */
  "domains_createDomainForwardingV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
      /**
       * Redirect type
       */
      redirect_type: string;
      /**
       * URL to forward domain to
       */
      redirect_url: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Enable domain lock for the domain.

When domain lock is enabled,
the domain cannot be transferred to another registrar without first disabling the lock.

Use this endpoint to secure domains against unauthorized transfers.
   */
  "domains_enableDomainLockV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Disable domain lock for the domain.

Domain lock needs to be disabled before transferring the domain to another registrar.

Use this endpoint to prepare domains for transfer to other registrars.
   */
  "domains_disableDomainLockV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve detailed information for specified domain.

Use this endpoint to view comprehensive domain configuration and status.
   */
  "domains_getDomainDetailsV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve all domains associated with your account.

Use this endpoint to view user's domain portfolio.
   */
  "domains_getDomainListV1": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Purchase and register a new domain name.

If registration fails, login to [hPanel](https://hpanel.hostinger.com/) and check domain registration status.

If no payment method is provided, your default payment method will be used automatically.

If no WHOIS information is provided, default contact information for that TLD will be used.
Before making request, ensure WHOIS information for desired TLD exists in your account.

Some TLDs require `additional_details` to be provided and these will be validated before completing purchase.

Use this endpoint to register new domains for users.
   */
  "domains_purchaseNewDomainV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
      /**
       * Catalog price item ID
       */
      item_id: string;
      /**
       * Payment method ID, default will be used if not provided
       */
      payment_method_id?: number;
      /**
       * Domain contact information
       */
      domain_contacts?: object;
      /**
       * Additional registration data, possible values depends on TLD
       */
      additional_details?: object;
      /**
       * Discount coupon codes
       */
      coupons?: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Enable privacy protection for the domain.

When privacy protection is enabled, domain owner's personal information is hidden from public WHOIS database.

Use this endpoint to protect domain owner's personal information from public view.
   */
  "domains_enablePrivacyProtectionV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Disable privacy protection for the domain.

When privacy protection is disabled, domain owner's personal information is visible in public WHOIS database.

Use this endpoint to make domain owner's information publicly visible.
   */
  "domains_disablePrivacyProtectionV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve renewal information for a specified domain, including its status and current
expiration date.

Use this endpoint to build renewal automation and expiry monitoring for a single domain.
   */
  "domains_getDomainRenewalInformationV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Set nameservers for a specified domain.

Be aware, that improper nameserver configuration can lead to the domain being unresolvable or unavailable.

Use this endpoint to configure custom DNS hosting for domains.
   */
  "domains_updateDomainNameserversV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
      /**
       * First name server
       */
      ns1: string;
      /**
       * Second name server
       */
      ns2: string;
      /**
       * Third name server
       */
      ns3?: string;
      /**
       * Fourth name server
       */
      ns4?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve a WHOIS contact profile.

Use this endpoint to view domain registration contact information.
   */
  "domains_getWHOISProfileV1": {
    params: {
      /**
       * WHOIS ID
       */
      whoisId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Delete WHOIS contact profile.

Use this endpoint to remove unused contact profiles from account.
   */
  "domains_deleteWHOISProfileV1": {
    params: {
      /**
       * WHOIS ID
       */
      whoisId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve WHOIS contact profiles.

Use this endpoint to view available contact profiles for domain registration.
   */
  "domains_getWHOISProfileListV1": {
    params: {
      /**
       * Filter by TLD (without leading dot)
       */
      tld?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create WHOIS contact profile.

Use this endpoint to add new contact information for domain registration.
   */
  "domains_createWHOISProfileV1": {
    params: {
      /**
       * TLD of the domain (without leading dot)
       */
      tld: string;
      /**
       * ISO 3166 2-letter country code
       */
      country: string;
      /**
       * Legal entity type
       */
      entity_type: string;
      /**
       * TLD details
       */
      tld_details?: object;
      /**
       * WHOIS details
       */
      whois_details: object;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve domain list where provided WHOIS contact profile is used.

Use this endpoint to view which domains use specific contact profiles.
   */
  "domains_getWHOISProfileUsageV1": {
    params: {
      /**
       * WHOIS ID
       */
      whoisId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve step-by-step setup instructions, formatted as Markdown, for connecting a custom sales
channel to your store and keeping your catalog, orders, shipping and payments in sync through
the Ecommerce API.
   */
  "ecommerce_getCustomStorefrontSetupInstructionsV1": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Enable a manual payment method so the store can accept orders without an online payment provider.
   */
  "ecommerce_enableManualPaymentMethodV1": {
    params: {
      /**
       * The ID of the store to enable manual payment for.
       */
      store_id: string;
      /**
       * Optional display name shown to customers at checkout.
       */
      title?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create a published digital product with a single variant and an optional external download link.
   */
  "ecommerce_createDigitalProductV1": {
    params: {
      /**
       * The ID of the store to create the product in.
       */
      store_id: string;
      /**
       * The product name.
       */
      name: string;
      /**
       * Price in the smallest currency unit (e.g. cents). Must be positive.
       */
      price: number;
      /**
       * The product description.
       */
      description?: string;
      /**
       * ISO 4217 currency code. Defaults to the store's default currency when omitted.
       */
      currency?: string;
      /**
       * Optional external download link delivered to the customer after purchase.
       */
      download_url?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create a published physical product with a single variant priced in the store currency.
   */
  "ecommerce_createPhysicalProductV1": {
    params: {
      /**
       * The ID of the store to create the product in.
       */
      store_id: string;
      /**
       * The product name.
       */
      name: string;
      /**
       * Price in the smallest currency unit (e.g. cents). Must be positive.
       */
      price: number;
      /**
       * The product description.
       */
      description?: string;
      /**
       * ISO 4217 currency code. Defaults to the store's default currency when omitted.
       */
      currency?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * List a store's active sales channels with their full metadata.
   */
  "ecommerce_listSalesChannelsV1": {
    params: {
      /**
       * The ID of the store to list sales channels for.
       */
      store_id: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create a custom sales channel for a store. Build your own frontend and keep your catalog,
orders, shipping and payments in sync through the Ecommerce API.
   */
  "ecommerce_createCustomSalesChannelV1": {
    params: {
      /**
       * The ID of the store to create the sales channel for.
       */
      store_id: string;
      /**
       * Sales channel type. Only "custom" channels can be created via the API.
       */
      type: string;
      /**
       * Merchant-facing custom name shown in the sales channels list.
       */
      name: string;
      /**
       * Optional public address where the custom sales channel lives.
       */
      url?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Update a custom sales channel. The merchant-facing `name` and the public `url`
(returned as the channel `domain`) can be changed. Pass `null` to clear a value.
   */
  "ecommerce_updateSalesChannelV1": {
    params: {
      /**
       * The ID of the store that owns the sales channel.
       */
      store_id: string;
      /**
       * The ID of the sales channel to update.
       */
      sales_channel_id: string;
      /**
       * Merchant-facing custom name shown in the sales channels list. Pass null to clear it.
       */
      name?: string;
      /**
       * Public address where the custom sales channel lives. Pass null to clear it.
       */
      url?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Set the flat-rate shipping price for a store, creating the shipping zone if it does not exist yet.
   */
  "ecommerce_setStoreShippingV1": {
    params: {
      /**
       * The ID of the store to configure shipping for.
       */
      store_id: string;
      /**
       * Flat shipping rate in the smallest currency unit (e.g. cents). Use 0 for free shipping.
       */
      price: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Soft-delete a store owned by your account.

The underlying store data is preserved; only the store is marked as deleted.
   */
  "ecommerce_deleteStoreV1": {
    params: {
      /**
       * The ID of the store to delete.
       */
      store_id: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve the stores associated with your account.
   */
  "ecommerce_getStoresV1": {
    params: {
      /**
       * Page number
       */
      page?: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create a new store for your account.

A primary sales channel is created alongside the store.
   */
  "ecommerce_createStoreV1": {
    params: {
      /**
       * name parameter
       */
      name?: string;
      /**
       * ISO 3166-1 alpha-2 country code.
       */
      country_code?: string;
      /**
       * company_email parameter
       */
      company_email?: string;
      /**
       * company_name parameter
       */
      company_name?: string;
      /**
       * ISO 639-1 language code.
       */
      language?: string;
      /**
       * sales_channel parameter
       */
      sales_channel?: object;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Get a store's readiness metadata: whether payment methods and shipping are configured,
plus its default currency. Useful to verify prerequisites before building a storefront.
   */
  "ecommerce_getStoreMetadataV1": {
    params: {
      /**
       * The ID of the store to read metadata for.
       */
      store_id: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create new Hostinger Horizons website from the given message.\n
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
   */
  "horizons_createWebsiteV1": {
    params: {
      /**
       * message parameter
       */
      message: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Get a link for the user to edit their website in Hostinger Horizons interface.\n
Use this tool when user wants to modify, edit or add new features to an existing website.\n
Websites can only be edited in Hostinger Horizons interface in the provided website URL.
   */
  "horizons_getWebsiteV1": {
    params: {
      /**
       * The website ID
       */
      websiteId: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Permanently clears all server-side cache for the website at once. Use it when content was
updated and needs to be visible immediately, or after making major changes.

Also purges the Hostinger CDN cache when CDN is enabled on the website. For a WordPress
installation living in a subdirectory, pass the directory query parameter to clear its cache.
   */
  "hosting_clearWebsiteCacheV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * Directory of the website installation to clear, relative to the website root.
Defaults to the website root.
       */
      directory?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Turns development (cacheless) mode on or off, based on the enabled flag. When enabled, nothing
is cached, effectively turning off all caching for the website; use it while actively developing,
testing changes, debugging issues, or when real-time updates must be visible. Disable it after
finishing development work to restore the performance benefits of caching.
   */
  "hosting_toggleCachelessModeV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * Turn development (cacheless) mode on (true) or off (false) for the website.
       */
      enabled: boolean;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Turns server-side caching for the website on or off, based on the enabled flag. Enable it for
faster page loads, reduced server load, and improved user experience; recommended for production
websites. Disabling may impact performance; to temporarily bypass caching while developing or
debugging, prefer toggling cacheless mode instead.

Does nothing if caching is already in the requested state.
   */
  "hosting_toggleWebsiteCacheV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * Turn server-side caching on (true) or off (false) for the website.
       */
      enabled: boolean;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Returns the list of cron jobs configured for the specified account, including their schedule and command.
   */
  "hosting_listAccountCronJobsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Creates a cron job for the specified account from a schedule expression and a command.

Returns the created cron job, including its uid, which is required to delete the cron job or fetch its output.
   */
  "hosting_createAccountCronJobV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Cron schedule expression (for example "0 2 * * *" runs daily at 02:00).
       */
      time: string;
      /**
       * Command to execute on the schedule.
       */
      command: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Permanently deletes the cron job identified by its uid.

The uid is returned by the list cron jobs endpoint.
   */
  "hosting_deleteAccountCronJobV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Unique identifier of the cron job as returned by the list cron jobs endpoint.
       */
      uid: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Returns the output captured from the last execution of the cron job identified by its uid.

The uid is returned by the list cron jobs endpoint.
   */
  "hosting_getCronJobOutputV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Unique identifier of the cron job as returned by the list cron jobs endpoint.
       */
      uid: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Changes the password for the specified database user.

The database name must be the full name returned by the list databases endpoint.
The password must also be updated in any website configuration that uses this database.
   */
  "hosting_changeDatabasePasswordV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Full database name as returned by the list databases endpoint.
       */
      name: string;
      /**
       * New database user password.
       */
      password: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Returns a paginated list of databases for the specified account.

Use the domain and is_assigned filters to find databases assigned to a specific domain.
   */
  "hosting_listAccountDatabasesV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Page number
       */
      page?: number;
      /**
       * Number of items per page
       */
      per_page?: number;
      /**
       * Filter by domain name (exact match)
       */
      domain?: string;
      /**
       * When used with domain, return only databases assigned to that domain.
       */
      is_assigned?: boolean;
      /**
       * Search databases by name, user, or creation date.
       */
      search?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Creates a database with a database user and password for the specified account.

The database name and user are automatically prefixed with the account username when needed.
   */
  "hosting_createAccountDatabaseV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Database name. If the account username prefix is omitted, it is added automatically.
       */
      name: string;
      /**
       * Database user. If the account username prefix is omitted, it is added automatically.
       */
      user: string;
      /**
       * Database user password.
       */
      password: string;
      /**
       * Website domain assigned to the database.
       */
      website_domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Permanently deletes a database and its remote connections.

The database name must be the full name returned by the list databases endpoint.
   */
  "hosting_deleteAccountDatabaseV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Full database name as returned by the list databases endpoint.
       */
      name: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Allows a remote host to connect to the specified database.

Provide an IPv4/IPv6 address, or "%" to allow any host. The database name must be
the full name returned by the list databases endpoint.
   */
  "hosting_createAccountDatabaseRemoteConnectionV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Full database name as returned by the list databases endpoint.
       */
      name: string;
      /**
       * Remote host to allow: an IPv4/IPv6 address, or "%" for any host.
       */
      ip: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Permanently removes a remote-access rule, revoking the given host's remote access to the database.

Identify the rule with the required ip query parameter (the IPv4/IPv6 address, or "%",
exactly as returned by the list remote connections endpoint). The database name must be
the full name returned by the list databases endpoint.
   */
  "hosting_deleteAccountDatabaseRemoteConnectionV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Full database name as returned by the list databases endpoint.
       */
      name: string;
      /**
       * Remote host to revoke: the IPv4/IPv6 address, or "%",
exactly as returned by the list remote connections endpoint.
       */
      ip: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Returns the remote-access rules for the specified account: the remote hosts
(IPv4/IPv6 addresses, or "%" for any host) allowed to connect to the account databases.

Use the domain filter to only return rules for databases assigned to a specific domain.
   */
  "hosting_listAccountDatabaseRemoteConnectionsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Filter remote connections by the domain the database is assigned to.
Rules for databases not assigned to any domain are always included.
       */
      domain?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Repairs corrupted database tables asynchronously.

Use when database errors, crashes, or corruption are reported.
The database name must be the full name returned by the list databases endpoint.
   */
  "hosting_repairDatabaseV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Full database name as returned by the list databases endpoint.
       */
      name: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Returns a direct sign-on link to phpMyAdmin for the specified database.

Use this when a visual database interface is needed for SQL queries, imports, exports, or table management.
The database name must be the full name returned by the list databases endpoint.
   */
  "hosting_getPhpMyAdminLinkV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Full database name as returned by the list databases endpoint.
       */
      name: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve a list of datacenters available for setting up hosting plans
based on available datacenter capacity and hosting plan of your order.
The first item in the list is the best match for your specific order
requirements.
   */
  "hosting_listAvailableDatacentersV1": {
    params: {
      /**
       * Order ID
       */
      order_id: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Generate a unique free subdomain that can be used for hosting services without purchasing custom domains.
Free subdomains allow you to start using hosting services immediately
and you can always connect a custom domain to your site later.
   */
  "hosting_generateAFreeSubdomainV1": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve all parked or alias domains created under the selected website.

Use this endpoint to inspect parked domain configuration for a specific website,
including the parent domain and root directory assigned to each parked domain.
   */
  "hosting_listWebsiteParkedDomainsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create a parked or alias domain for the selected website.

Provide a domain name or IP address to park on the website so it serves the same content
as the parent domain.
   */
  "hosting_createWebsiteParkedDomainV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * Domain name or IP address to park on the selected website
       */
      parked_domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Delete an existing parked or alias domain from the selected website.

Use this endpoint to remove parked domains that are no longer needed.
   */
  "hosting_deleteWebsiteParkedDomainV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * parkedDomain parameter
       */
      parkedDomain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve all subdomains created under the selected website.

Use this endpoint to inspect subdomain configuration for a specific website,
including the parent domain and root directory assigned to each subdomain.
   */
  "hosting_listWebsiteSubdomainsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create a new subdomain for the selected website.

Provide a subdomain prefix and, optionally, a custom directory or the
website public directory to use as the subdomain root.
   */
  "hosting_createWebsiteSubdomainV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * Subdomain prefix to create under the selected website
       */
      subdomain: string;
      /**
       * Directory name for the subdomain relative to the website root
       */
      directory?: string;
      /**
       * Use the website public directory as the subdomain root directory
       */
      is_using_public_directory?: boolean;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Delete an existing subdomain from the selected website.

Use this endpoint to remove subdomains that are no longer needed.
   */
  "hosting_deleteWebsiteSubdomainV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * subdomain parameter
       */
      subdomain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Verify ownership of a single domain and return the verification status.

Use this endpoint to check if a domain is accessible for you before using it for new websites.
If the domain is accessible, the response will have `is_accessible: true`.
If not, add the given TXT record to your domain's DNS records and try verifying again.
Keep in mind that it may take up to 10 minutes for new TXT DNS records to propagate.

Skip this verification when using Hostinger's free subdomains (*.hostingersite.com).
   */
  "hosting_verifyDomainOwnershipV1": {
    params: {
      /**
       * Domain to verify ownership for
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve a paginated list of Node.js build processes for a specific website.

Each build represents a single run of the Node.js build pipeline. Use the `states`
query parameter to filter results by build state (pending, running, completed, failed).
Use the `uuid` from a build to poll its output via the `Get Node.js Build Logs` endpoint.
   */
  "hosting_listNodeJSBuildsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * Page number
       */
      page?: number;
      /**
       * Number of items per page
       */
      per_page?: number;
      /**
       * Build states to filter by
       */
      states?: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Upload a project archive, auto-detect build settings, and immediately start a Node.js build.

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
   */
  "hosting_createNodeJSBuildFromArchiveV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * Project archive file (.zip, .tar.gz, or .tgz), maximum 50MB
       */
      archive: string;
      /**
       * Node.js version override (auto-detected from package.json if omitted)
       */
      node_version?: number;
      /**
       * Node.js application type override
       */
      app_type?: string;
      /**
       * Application root directory override (where package.json is located) relative to public_html
       */
      root_directory?: string;
      /**
       * Build output directory override relative to the root directory
       */
      output_directory?: string;
      /**
       * Build script override
       */
      build_script?: string;
      /**
       * Main entry point file override
       */
      entry_file?: string;
      /**
       * Package manager override
       */
      package_manager?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve logs from a specific Node.js build process.

To stream live output while a build is running, poll this endpoint repeatedly
while the build state is `running`, passing the previously returned `lines` count
as `from_line` to fetch only new output since the last call.
Log content may contain ANSI escape sequences (color codes).
   */
  "hosting_getNodeJSBuildLogsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * Build UUID
       */
      uuid: string;
      /**
       * Line from which to start retrieving logs
       */
      from_line?: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Restarts the Node.js server process for the website. Does not rebuild or redeploy the
application. Use it to apply environment or configuration changes, or to recover a hung
application.

Only applicable to server-side applications (Express, Next.js, NestJS, etc.). Static
front-end apps (React, Vue, Vite) have no persistent server process, so restarting them
has no effect. Returns success even when the website has no server process to restart.
   */
  "hosting_restartNode_jsApplicationV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Lists known npm package vulnerabilities detected on a Node.js website, enriched with
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
   */
  "hosting_listNode_jsVulnerabilitiesV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * Severities to filter by
       */
      severities?: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Patches the selected Node.js vulnerabilities by updating the affected package versions
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
   */
  "hosting_patchNode_jsVulnerabilitiesV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * List of vulnerability IDs to patch, as returned by the list vulnerabilities endpoint.
       */
      vulnerability_ids: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve a paginated list of orders accessible to the authenticated client.

This endpoint returns orders of your hosting accounts as well as orders
of other client hosting accounts that have shared access with you.

Use the available query parameters to filter results by order statuses
or specific order IDs for more targeted results.
   */
  "hosting_listOrdersV1": {
    params: {
      /**
       * Page number
       */
      page?: number;
      /**
       * Number of items per page
       */
      per_page?: number;
      /**
       * Filter by order statuses
       */
      statuses?: array;
      /**
       * Filter by specific order IDs
       */
      order_ids?: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Resets all PHP extensions of the website to their default state.

Use it to recover from extension conflicts or restore the original configuration.
   */
  "hosting_resetPHPExtensionsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Returns the full PHP configuration for the website: current version, available versions
(supported and unsupported), enabled/disabled extensions, options with their current value,
default, type and the plan limit (`max`), and conflicting extension groups.

Use it to check the current PHP setup before updating the version, extensions or options.
   */
  "hosting_getPHPDetailsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Returns the full phpinfo page (HTML) for the website.

Use it to debug PHP issues or inspect the complete PHP environment of the website.
   */
  "hosting_getPHPInfoV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Enables or disables PHP extensions (modules) for the website.

Use the Get PHP details endpoint to check the current extension states before changing them.
   */
  "hosting_updatePHPExtensionsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * PHP extensions to enable.
       */
      enable?: array;
      /**
       * PHP extensions to disable.
       */
      disable?: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Updates PHP options for the website (e.g. `memory_limit`, `max_execution_time`, `upload_max_filesize`).
Only provide the options you want to change, inside the `options` object.

Values above the account plan limit are silently capped to that limit, so the request can succeed
with a smaller applied value. Call the Get PHP details endpoint afterwards to read the applied value.
   */
  "hosting_updatePHPOptionsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * Map of PHP options to update, keyed by option name. Only include options you want to change.
       */
      options: object;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Changes the PHP version of the website.

Use the Get PHP details endpoint to see the versions available for the website.
   */
  "hosting_updatePHPVersionV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain name
       */
      domain: string;
      /**
       * PHP version to switch the website to.
       */
      version: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve a paginated list of websites (main and addon types) accessible to the authenticated client.

This endpoint returns websites from your hosting accounts as well as
websites from other client hosting accounts that have shared access
with you.

Use the available query parameters to filter results by username,
order ID, enabled status, or domain name for more targeted results.
   */
  "hosting_listWebsitesV1": {
    params: {
      /**
       * Page number
       */
      page?: number;
      /**
       * Number of items per page
       */
      per_page?: number;
      /**
       * Filter by specific username
       */
      username?: string;
      /**
       * Order ID
       */
      order_id?: number;
      /**
       * Filter by enabled status
       */
      is_enabled?: boolean;
      /**
       * Filter by domain name (exact match)
       */
      domain?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create a new website for the authenticated client.

Provide the domain name and associated order ID to create a new website.
The datacenter_code parameter is required when creating the first website
on a new hosting plan - this will set up and configure new hosting account
in the selected datacenter.

Subsequent websites will be hosted on the same datacenter automatically.

Website creation takes up to a few minutes to complete. Check the
websites list endpoint to see when your new website becomes available.
   */
  "hosting_createWebsiteV1": {
    params: {
      /**
       * Domain name for the website. Cannot start with "www."
       */
      domain: string;
      /**
       * ID of the associated order
       */
      order_id: number;
      /**
       * Datacenter code. This parameter is required when creating the first website on a new hosting plan.
       */
      datacenter_code?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Permanently deletes a website and all of its data. This action is destructive
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
   */
  "hosting_deleteWebsiteV1": {
    params: {
      /**
       * Domain name
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Delete a contact with the specified UUID.

This endpoint permanently removes a contact from the email marketing system.
   */
  "reach_deleteAContactV1": {
    params: {
      /**
       * UUID of the contact to delete
       */
      uuid: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Get a list of all contact groups.

This endpoint returns a list of contact groups that can be used to organize contacts.
   */
  "reach_listContactGroupsV1": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Get a list of contacts, optionally filtered by group and subscription status.

This endpoint returns a paginated list of contacts with their basic information.
You can filter contacts by group UUID and subscription status.
   */
  "reach_listContactsV1": {
    params: {
      /**
       * Filter contacts by group UUID
       */
      group_uuid?: string;
      /**
       * Filter contacts by subscription status
       */
      subscription_status?: string;
      /**
       * Page number
       */
      page?: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create a new contact in the email marketing system.

This endpoint allows you to create a new contact with basic information like name, email, and surname.

If double opt-in is enabled,
the contact will be created with a pending status and a confirmation email will be sent.
   */
  "reach_createANewContactV1": {
    params: {
      /**
       * email parameter
       */
      email: string;
      /**
       * name parameter
       */
      name?: string;
      /**
       * surname parameter
       */
      surname?: string;
      /**
       * Phone number in E.164 format (leading "+" then 7-15 digits)
       */
      phone?: string;
      /**
       * note parameter
       */
      note?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Get a list of all contact segments.

This endpoint returns a list of contact segments that can be used to organize contacts.
   */
  "reach_listSegmentsV1": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create a new contact segment.

This endpoint allows creating a new contact segment that can be used to organize contacts.
The segment can be configured with specific criteria like email, name, subscription status, etc.
   */
  "reach_createANewContactSegmentV1": {
    params: {
      /**
       * name parameter
       */
      name: string;
      /**
       * conditions parameter
       */
      conditions: array;
      /**
       * logic parameter
       */
      logic: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve contacts associated with a specific segment for a given profile.

This endpoint allows you to fetch and filter contacts that belong to a particular segment,
identified by its UUID, scoped to a specific profile.
   */
  "reach_listProfileSegmentContactsV1": {
    params: {
      /**
       * Profile uuid parameter
       */
      profileUuid: string;
      /**
       * Segment uuid parameter
       */
      segmentUuid: string;
      /**
       * Page number
       */
      page?: number;
      /**
       * Number of items per page
       */
      per_page?: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve contacts associated with a specific segment.

This endpoint allows you to fetch and filter contacts that belong to a particular segment,
identified by its UUID.
   */
  "reach_listSegmentContactsV1": {
    params: {
      /**
       * Segment uuid parameter
       */
      segmentUuid: string;
      /**
       * Page number
       */
      page?: number;
      /**
       * Number of items per page
       */
      per_page?: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Get details of a specific segment.

This endpoint retrieves information about a single segment identified by UUID.
Segments are used to organize and group contacts based on specific criteria.
   */
  "reach_getSegmentDetailsV1": {
    params: {
      /**
       * Segment uuid parameter
       */
      segmentUuid: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create a new contact in the email marketing system.

This endpoint allows you to create a new contact with basic information like name, email, and surname.

If double opt-in is enabled, the contact will be created with a pending status
and a confirmation email will be sent.
   */
  "reach_createNewContactsV1": {
    params: {
      /**
       * Profile uuid parameter
       */
      profileUuid: string;
      /**
       * email parameter
       */
      email: string;
      /**
       * name parameter
       */
      name?: string;
      /**
       * surname parameter
       */
      surname?: string;
      /**
       * Phone number in E.164 format (leading "+" then 7-15 digits)
       */
      phone?: string;
      /**
       * note parameter
       */
      note?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve the DNS configuration status for a profile's domain.

This endpoint reports the state of MX, SPF, DKIM and DMARC records, including the
actual records found and the suggested records required for correct email delivery.
   */
  "reach_getProfileDomainDNSStatusV1": {
    params: {
      /**
       * Profile uuid parameter
       */
      profileUuid: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint returns all profiles available to the client, including their basic information.
   */
  "reach_listProfilesV1": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve all available data centers.

Use this endpoint to view location options before deploying VPS instances.
   */
  "VPS_getDataCenterListV1": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieves a list of all containers belonging to a specific Docker Compose project on the virtual machine. 

This endpoint returns detailed information about each container including
their current status, port mappings, and runtime configuration.

Use this to monitor the health and state of all services within your Docker Compose project.
   */
  "VPS_getProjectContainersV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Docker Compose project name using alphanumeric characters, dashes, and underscores only
       */
      projectName: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieves the complete project information including the docker-compose.yml
file contents, project metadata, and current deployment status.

This endpoint provides the full configuration and state details of a specific Docker Compose project. 

Use this to inspect project settings, review the compose file, or check the overall project health.
   */
  "VPS_getProjectContentsV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Docker Compose project name using alphanumeric characters, dashes, and underscores only
       */
      projectName: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Completely removes a Docker Compose project from the virtual machine, stopping all containers and cleaning up 
associated resources including networks, volumes, and images. 

This operation is irreversible and will delete all project data. 

Use this when you want to permanently remove a project and free up system resources.
   */
  "VPS_deleteProjectV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Docker Compose project name using alphanumeric characters, dashes, and underscores only
       */
      projectName: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieves a list of all Docker Compose projects currently deployed on the virtual machine. 

This endpoint returns basic information about each project including name,
status, file path and list of containers with details about their names,
image, status, health and ports. Container stats are omitted in this
endpoint. If you need to get detailed information about container with
stats included, use the `Get project containers` endpoint.

Use this to get an overview of all Docker projects on your VPS instance.
   */
  "VPS_getProjectListV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Deploy new project from docker-compose.yaml contents or download contents from URL. 

URL can be Github repository url in format https://github.com/[user]/[repo]
and it will be automatically resolved to docker-compose.yaml file in
master branch. Any other URL provided must return docker-compose.yaml
file contents.

If project with the same name already exists, existing project will be replaced.
   */
  "VPS_createNewProjectV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Docker Compose project name using alphanumeric characters, dashes, and underscores only
       */
      project_name: string;
      /**
       * URL pointing to docker-compose.yaml file, Github repository or raw YAML content of the compose file
       */
      content: string;
      /**
       * Project environment variables
       */
      environment?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieves aggregated log entries from all services within a Docker Compose project. 

This endpoint returns recent log output from each container, organized by service name with timestamps. 
The response contains the last 300 log entries across all services. 

Use this for debugging, monitoring application behavior, and
troubleshooting issues across your entire project stack.
   */
  "VPS_getProjectLogsV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Docker Compose project name using alphanumeric characters, dashes, and underscores only
       */
      projectName: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Restarts all services in a Docker Compose project by stopping and starting
containers in the correct dependency order.

This operation preserves data volumes and network configurations while refreshing the running containers. 

Use this to apply configuration changes or recover from service failures.
   */
  "VPS_restartProjectV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Docker Compose project name using alphanumeric characters, dashes, and underscores only
       */
      projectName: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Starts all services in a Docker Compose project that are currently stopped. 

This operation brings up containers in the correct dependency order as defined in the compose file. 

Use this to resume a project that was previously stopped or to start services after a system reboot.
   */
  "VPS_startProjectV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Docker Compose project name using alphanumeric characters, dashes, and underscores only
       */
      projectName: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Stops all running services in a Docker Compose project while preserving
container configurations and data volumes.

This operation gracefully shuts down containers in reverse dependency order. 

Use this to temporarily halt a project without removing data or configurations.
   */
  "VPS_stopProjectV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Docker Compose project name using alphanumeric characters, dashes, and underscores only
       */
      projectName: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Updates a Docker Compose project by pulling the latest image versions and
recreating containers with new configurations.

This operation preserves data volumes while applying changes from the compose file. 

Use this to deploy application updates, apply configuration changes, or
refresh container images to their latest versions.
   */
  "VPS_updateProjectV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Docker Compose project name using alphanumeric characters, dashes, and underscores only
       */
      projectName: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Activate a firewall for a specified virtual machine.

Only one firewall can be active for a virtual machine at a time.

Use this endpoint to apply firewall rules to VPS instances.
   */
  "VPS_activateFirewallV1": {
    params: {
      /**
       * Firewall ID
       */
      firewallId: number;
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Deactivate a firewall for a specified virtual machine.

Use this endpoint to remove firewall protection from VPS instances.
   */
  "VPS_deactivateFirewallV1": {
    params: {
      /**
       * Firewall ID
       */
      firewallId: number;
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve firewall by its ID and rules associated with it.

Use this endpoint to view specific firewall configuration and rules.
   */
  "VPS_getFirewallDetailsV1": {
    params: {
      /**
       * Firewall ID
       */
      firewallId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Delete a specified firewall.

Any virtual machine that has this firewall activated will automatically have it deactivated.

Use this endpoint to remove unused firewall configurations.
   */
  "VPS_deleteFirewallV1": {
    params: {
      /**
       * Firewall ID
       */
      firewallId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve all available firewalls.

Use this endpoint to view existing firewall configurations.
   */
  "VPS_getFirewallListV1": {
    params: {
      /**
       * Page number
       */
      page?: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create a new firewall.

Use this endpoint to set up new firewall configurations for VPS security.
   */
  "VPS_createNewFirewallV1": {
    params: {
      /**
       * name parameter
       */
      name: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Update a specific firewall rule from a specified firewall.

Any virtual machine that has this firewall activated will lose sync with the firewall
and will have to be synced again manually.

Use this endpoint to modify existing firewall rules.
   */
  "VPS_updateFirewallRuleV1": {
    params: {
      /**
       * Firewall ID
       */
      firewallId: number;
      /**
       * Firewall Rule ID
       */
      ruleId: number;
      /**
       * protocol parameter
       */
      protocol: string;
      /**
       * Port or port range, ex: 1024:2048
       */
      port: string;
      /**
       * source parameter
       */
      source: string;
      /**
       * IP range, CIDR, single IP or `any`
       */
      source_detail: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Delete a specific firewall rule from a specified firewall.

Any virtual machine that has this firewall activated will lose sync with the firewall
and will have to be synced again manually.

Use this endpoint to remove specific firewall rules.
   */
  "VPS_deleteFirewallRuleV1": {
    params: {
      /**
       * Firewall ID
       */
      firewallId: number;
      /**
       * Firewall Rule ID
       */
      ruleId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create new firewall rule for a specified firewall.

By default, the firewall drops all incoming traffic,
which means you must add accept rules for all ports you want to use.

Any virtual machine that has this firewall activated will lose sync with the firewall
and will have to be synced again manually.

Use this endpoint to add new security rules to firewalls.
   */
  "VPS_createFirewallRuleV1": {
    params: {
      /**
       * Firewall ID
       */
      firewallId: number;
      /**
       * protocol parameter
       */
      protocol: string;
      /**
       * Port or port range, ex: 1024:2048
       */
      port: string;
      /**
       * source parameter
       */
      source: string;
      /**
       * IP range, CIDR, single IP or `any`
       */
      source_detail: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Sync a firewall for a specified virtual machine.

Firewall can lose sync with virtual machine if the firewall has new rules added, removed or updated.

Use this endpoint to apply updated firewall rules to VPS instances.
   */
  "VPS_syncFirewallV1": {
    params: {
      /**
       * Firewall ID
       */
      firewallId: number;
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve post-install script by its ID.

Use this endpoint to view specific automation script details.
   */
  "VPS_getPostInstallScriptV1": {
    params: {
      /**
       * Post-install script ID
       */
      postInstallScriptId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Update a specific post-install script.

Use this endpoint to modify existing automation scripts.
   */
  "VPS_updatePostInstallScriptV1": {
    params: {
      /**
       * Post-install script ID
       */
      postInstallScriptId: number;
      /**
       * Name of the script
       */
      name: string;
      /**
       * Content of the script
       */
      content: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Delete a post-install script from your account.
       
Use this endpoint to remove unused automation scripts.
   */
  "VPS_deletePostInstallScriptV1": {
    params: {
      /**
       * Post-install script ID
       */
      postInstallScriptId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve post-install scripts associated with your account.

Use this endpoint to view available automation scripts for VPS deployment.
   */
  "VPS_getPostInstallScriptsV1": {
    params: {
      /**
       * Page number
       */
      page?: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Add a new post-install script to your account, which can then be used after virtual machine installation.

The script contents will be saved to the file `/post_install` with executable attribute set
and will be executed once virtual machine is installed.
The output of the script will be redirected to `/post_install.log`. Maximum script size is 48KB.

Use this endpoint to create automation scripts for VPS setup tasks.
   */
  "VPS_createPostInstallScriptV1": {
    params: {
      /**
       * Name of the script
       */
      name: string;
      /**
       * Content of the script
       */
      content: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Attach existing public keys from your account to a specified virtual machine.

Multiple keys can be attached to a single virtual machine.

Use this endpoint to enable SSH key authentication for VPS instances.
   */
  "VPS_attachPublicKeyV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Public Key IDs to attach
       */
      ids: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Delete a public key from your account. 

**Deleting public key from account does not remove it from virtual machine** 
       
Use this endpoint to remove unused SSH keys from account.
   */
  "VPS_deletePublicKeyV1": {
    params: {
      /**
       * Public Key ID
       */
      publicKeyId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve public keys associated with your account.

Use this endpoint to view available SSH keys for VPS authentication.
   */
  "VPS_getPublicKeysV1": {
    params: {
      /**
       * Page number
       */
      page?: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Add a new public key to your account.

Use this endpoint to register SSH keys for VPS authentication.
   */
  "VPS_createPublicKeyV1": {
    params: {
      /**
       * name parameter
       */
      name: string;
      /**
       * key parameter
       */
      key: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve detailed information about a specific OS template for virtual machines.

Use this endpoint to view specific template specifications before deployment.
   */
  "VPS_getTemplateDetailsV1": {
    params: {
      /**
       * Template ID
       */
      templateId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve available OS templates for virtual machines.

Use this endpoint to view operating system options before creating or recreating VPS instances.
   */
  "VPS_getTemplatesV1": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve detailed information about a specific action performed on a specified virtual machine.

Use this endpoint to monitor specific VPS operation status and details.
   */
  "VPS_getActionDetailsV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Action ID
       */
      actionId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve actions performed on a specified virtual machine.

Actions are operations or events that have been executed on the virtual
machine, such as starting, stopping, or modifying the machine. This endpoint
allows you to view the history of these actions, providing details about
each action, such as the action name, timestamp, and status.

Use this endpoint to view VPS operation history and troubleshoot issues.
   */
  "VPS_getActionsV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Page number
       */
      page?: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve public keys attached to a specified virtual machine.

Use this endpoint to view SSH keys configured for specific VPS instances.
   */
  "VPS_getAttachedPublicKeysV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Page number
       */
      page?: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve backups for a specified virtual machine.

Use this endpoint to view available backup points for VPS data recovery.
   */
  "VPS_getBackupsV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Page number
       */
      page?: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Restore a backup for a specified virtual machine.

The system will then initiate the restore process, which may take some time depending on the size of the backup.

**All data on the virtual machine will be overwritten with the data from the backup.**

Use this endpoint to recover VPS data from backup points.
   */
  "VPS_restoreBackupV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Backup ID
       */
      backupId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Set hostname for a specified virtual machine.

Changing hostname does not update PTR record automatically.
If you want your virtual machine to be reachable by a hostname, 
you need to point your domain A/AAAA records to virtual machine IP as well.

Use this endpoint to configure custom hostnames for VPS instances.
   */
  "VPS_setHostnameV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * hostname parameter
       */
      hostname: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Reset hostname and PTR record of a specified virtual machine to default value.

Use this endpoint to restore default hostname configuration for VPS instances.
   */
  "VPS_resetHostnameV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve detailed information about a specified virtual machine.

Use this endpoint to view comprehensive VPS configuration and status.
   */
  "VPS_getVirtualMachineDetailsV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve all available virtual machines.

Use this endpoint to view available VPS instances.
   */
  "VPS_getVirtualMachinesV1": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Purchase and setup a new virtual machine.

If virtual machine setup fails for any reason, login to
[hPanel](https://hpanel.hostinger.com/) and complete the setup manually.

If no payment method is provided, your default payment method will be used automatically.

Use this endpoint to create new VPS instances.
   */
  "VPS_purchaseNewVirtualMachineV1": {
    params: {
      /**
       * Catalog price item ID
       */
      item_id: string;
      /**
       * Payment method ID, default will be used if not provided
       */
      payment_method_id?: number;
      /**
       * setup parameter
       */
      setup: string;
      /**
       * Discount coupon codes
       */
      coupons?: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve scan metrics for the [Monarx](https://www.monarx.com/) malware scanner
installed on a specified virtual machine.

The scan metrics provide detailed information about malware scans performed
by Monarx, including number of scans, detected threats, and other relevant
statistics. This information is useful for monitoring security status of the
virtual machine and assessing effectiveness of the malware scanner.

Use this endpoint to monitor VPS security scan results and threat detection.
   */
  "VPS_getScanMetricsV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Install the Monarx malware scanner on a specified virtual machine.

[Monarx](https://www.monarx.com/) is a security tool designed to detect and
prevent malware infections on virtual machines. By installing Monarx, users
can enhance the security of their virtual machines, ensuring that they are
protected against malicious software.

Use this endpoint to enable malware protection on VPS instances.
   */
  "VPS_installMonarxV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Uninstall the Monarx malware scanner on a specified virtual machine.

If Monarx is not installed, the request will still be processed without any effect.

Use this endpoint to remove malware scanner from VPS instances.
   */
  "VPS_uninstallMonarxV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve historical metrics for a specified virtual machine.

It includes the following metrics: 
- CPU usage
- Memory usage
- Disk usage
- Network usage
- Uptime

Use this endpoint to monitor VPS performance and resource utilization over time.
   */
  "VPS_getMetricsV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * date_from parameter
       */
      date_from: string;
      /**
       * date_to parameter
       */
      date_to: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Set nameservers for a specified virtual machine.

Be aware, that improper nameserver configuration can lead to the virtual
machine being unable to resolve domain names.

Use this endpoint to configure custom DNS resolvers for VPS instances.
   */
  "VPS_setNameserversV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * ns1 parameter
       */
      ns1: string;
      /**
       * ns2 parameter
       */
      ns2?: string;
      /**
       * ns3 parameter
       */
      ns3?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create or update a PTR (Pointer) record for a specified virtual machine.

Use this endpoint to configure reverse DNS lookup for VPS IP addresses.
   */
  "VPS_createPTRRecordV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * IP Address ID
       */
      ipAddressId: number;
      /**
       * Pointer record domain
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Delete a PTR (Pointer) record for a specified virtual machine.

Once deleted, reverse DNS lookups to the virtual machine's IP address will
no longer return the previously configured hostname.

Use this endpoint to remove reverse DNS configuration from VPS instances.
   */
  "VPS_deletePTRRecordV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * IP Address ID
       */
      ipAddressId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Set panel password for a specified virtual machine.

If virtual machine does not use panel OS, the request will still be processed without any effect.
Requirements for password are same as in the [recreate virtual machine
endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).

Use this endpoint to configure control panel access credentials for VPS instances.
   */
  "VPS_setPanelPasswordV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Panel password for the virtual machine
       */
      password: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Initiate recovery mode for a specified virtual machine.

Recovery mode is a special state that allows users to perform system rescue operations, 
such as repairing file systems, recovering data, or troubleshooting issues that prevent the virtual machine 
from booting normally. 

Virtual machine will boot recovery disk image and original disk image will be mounted in `/mnt` directory.

Use this endpoint to enable system rescue operations on VPS instances.
   */
  "VPS_startRecoveryModeV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Temporary root password for recovery mode
       */
      root_password: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Stop recovery mode for a specified virtual machine.

If virtual machine is not in recovery mode, this operation will fail.

Use this endpoint to exit system rescue mode and return VPS to normal operation.
   */
  "VPS_stopRecoveryModeV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Recreate a virtual machine from scratch.

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
   */
  "VPS_recreateVirtualMachineV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Template ID
       */
      template_id: number;
      /**
       * Root password for the virtual machine. If not provided, random password will be generated.
Password will not be shown in the response.
       */
      password?: string;
      /**
       * Panel password for the panel-based OS template. If not provided, random password will be generated.
If OS does not support panel_password this field will be ignored.
Password will not be shown in the response.
       */
      panel_password?: string;
      /**
       * Post-install script to execute after virtual machine was recreated
       */
      post_install_script_id?: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Restart a specified virtual machine by fully stopping and starting it.

If the virtual machine was stopped, it will be started.

Use this endpoint to reboot VPS instances.
   */
  "VPS_restartVirtualMachineV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Set root password for a specified virtual machine.

Requirements for password are same as in the [recreate virtual machine
endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).

Use this endpoint to update administrator credentials for VPS instances.
   */
  "VPS_setRootPasswordV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Root password for the virtual machine
       */
      password: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Setup newly purchased virtual machine with `initial` state.

Use this endpoint to configure and initialize purchased VPS instances.
   */
  "VPS_setupPurchasedVirtualMachineV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * Template ID
       */
      template_id: number;
      /**
       * Data center ID
       */
      data_center_id: number;
      /**
       * Post-install script ID
       */
      post_install_script_id?: number;
      /**
       * Password for the virtual machine. If not provided, random password will be generated.
Password will not be shown in the response.
       */
      password?: string;
      /**
       * Override default hostname of the virtual machine
       */
      hostname?: string;
      /**
       * Install Monarx malware scanner (if supported)
       */
      install_monarx?: boolean;
      /**
       * Enable weekly backup schedule
       */
      enable_backups?: boolean;
      /**
       * Name server 1
       */
      ns1?: string;
      /**
       * Name server 2
       */
      ns2?: string;
      /**
       * Use SSH key
       */
      public_key?: object;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve snapshot for a specified virtual machine.

Use this endpoint to view current VPS snapshot information.
   */
  "VPS_getSnapshotV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create a snapshot of a specified virtual machine.

A snapshot captures the state and data of the virtual machine at a specific point in time, 
allowing users to restore the virtual machine to that state if needed. 
This operation is useful for backup purposes, system recovery, 
and testing changes without affecting the current state of the virtual machine.

**Creating new snapshot will overwrite the existing snapshot!**

Use this endpoint to capture VPS state for backup and recovery purposes.
   */
  "VPS_createSnapshotV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Delete a snapshot of a specified virtual machine.

Use this endpoint to remove VPS snapshots.
   */
  "VPS_deleteSnapshotV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Restore a specified virtual machine to a previous state using a snapshot.

Restoring from a snapshot allows users to revert the virtual machine to that state,
which is useful for system recovery, undoing changes, or testing.

Use this endpoint to revert VPS instances to previous saved states.
   */
  "VPS_restoreSnapshotV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Start a specified virtual machine.

If the virtual machine is already running, the request will still be processed without any effect.

Use this endpoint to power on stopped VPS instances.
   */
  "VPS_startVirtualMachineV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Stop a specified virtual machine.

If the virtual machine is already stopped, the request will still be processed without any effect.

Use this endpoint to power off running VPS instances.
   */
  "VPS_stopVirtualMachineV1": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Show the current AI option status for the Hostinger Tools plugin on the
specified WordPress installation. Filter by `option` to return a single
option, or omit it to return all options.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_showAIOptionStatusV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Filter the status by a single AI option.
       */
      option?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Enable or disable an AI option for the Hostinger Tools plugin on the specified
WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_setAIOptionStatusV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * AI option name
       */
      option: string;
      /**
       * Enable (true) or disable (false) the AI option.
       */
      enable: boolean;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Check whether one or more WordPress installations are valid and working
correctly. Detects broken installations caused by missing files, broken
plugins, themes and similar issues.

Provide the WordPress installation (software) identifiers in the body. They
can be obtained from GET /api/hosting/v1/wordpress/installations (the `id`
field).
   */
  "hosting_checkIfWordPressInstallationsAreValidV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifiers to validate.
       */
      software_ids: array;
      /**
       * Force fresh validation without cache. Preferable for troubleshooting purposes.
       */
      force?: boolean;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Delete the specified WordPress installation, with optional file and database
removal. This removes all associated components including plugins, themes,
staging websites and any other related data.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_deleteWordPressInstallationV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Trigger a background scan to detect WordPress installations for the account.

This operation is asynchronous: a successful response only means the scan has
been queued. Poll GET /api/hosting/v1/wordpress/installations to fetch the
detected installations once the scan completes.
   */
  "hosting_detectWordPressInstallationsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Install WordPress on an existing website.

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
   */
  "hosting_installWordPressV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * Domain of the existing website where WordPress will be installed
       */
      domain: string;
      /**
       * Title of the WordPress site
       */
      site_title: string;
      /**
       * WordPress locale. Defaults to en_US when omitted.
       */
      language?: string;
      /**
       * Relative directory to install WordPress into. Defaults to the website root when omitted.
       */
      directory?: string;
      /**
       * When false (default), does not replace an existing installation. If WordPress is already installed on the domain/path, the async install job fails unless true.
       */
      overwrite?: boolean;
      /**
       * WordPress core auto-update policy
       */
      auto_updates?: string;
      /**
       * WordPress core version to install. If omitted, the latest core version compatible with the account vhost PHP version is selected.
       */
      version?: string;
      /**
       * WordPress admin credentials
       */
      credentials: object;
      /**
       * Optional. If the named database already exists, it will be used for this WordPress install. Otherwise a new database is created with a generated name and random credentials.
       */
      database?: object;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * List WordPress installations accessible to the authenticated client.

Use this endpoint to discover existing WordPress installations and to poll
for installation status after calling the install endpoint. When a newly
requested installation appears in this list, WordPress is ready. Filter by
username and domain to narrow results to a specific website.

Each installation includes a `valid` flag and, when invalid, a
`validationError` describing why.
   */
  "hosting_listWordPressInstallationsV1": {
    params: {
      /**
       * Filter by specific username
       */
      username?: string;
      /**
       * Filter by domain name (exact match)
       */
      domain?: string;
      /**
       * Filter by ownership type. Defaults to "owned". Use "all" to include both owned and managed installations.
       */
      ownership?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * List available WordPress core updates for the specified installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_listAvailableWordPressCoreUpdatesV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Return a JWT token used to authenticate requests against the specified
WordPress installation, including its MCP (Model Context Protocol) endpoint.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_getInstallationJWTTokenV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Show the WordPress core version for the specified installation, along with
known vulnerabilities affecting it.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_showWordPressCoreVersionV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Update the WordPress core for the specified installation (minor update or a
specific version).

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the update
job has been queued.
   */
  "hosting_updateWordPressCoreV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Update the minor version only.
       */
      minor?: boolean;
      /**
       * Update to a specific WordPress core version.
       */
      version?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Purge the LiteSpeed Cache for the specified WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_purgeLiteSpeedCacheV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Show the LiteSpeed Cache status for the specified WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_showLiteSpeedCacheStatusV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create temporary auto-login links for the specified WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_createLoginLinksV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Show the maintenance mode status for the specified WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_showMaintenanceStatusV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Enable or disable maintenance mode for the specified WordPress installation,
based on the `enabled` flag.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_toggleMaintenanceModeV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Enable (true) or disable (false) maintenance mode for the WordPress installation.
       */
      enabled: boolean;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Show the Memcached object cache status for the specified WordPress
installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_showMemcachedObjectCacheStatusV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Activate or deactivate the Memcached object cache for the specified WordPress
installation, based on the `enabled` flag.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_toggleMemcachedObjectCacheV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Activate (true) or deactivate (false) the Memcached object cache for the WordPress installation.
       */
      enabled: boolean;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Activate an installed plugin on a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the activation
job has been queued.
   */
  "hosting_activateWordPressPluginV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Slug of the installed plugin to activate.
       */
      plugin: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Deactivate an installed plugin on a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the
deactivation job has been queued.
   */
  "hosting_deactivateWordPressPluginV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Slug of the installed plugin to deactivate.
       */
      plugin: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Install one or more plugins on an existing WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id`
field). Use GET /api/hosting/v1/wordpress/plugins to discover the plugin
slugs available for installation.

This operation is asynchronous: a successful response only means the install
job has been queued, not that the plugins are ready.
   */
  "hosting_installWordPressPluginsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Plugin slugs to install. Use GET /api/hosting/v1/wordpress/plugins to discover available slugs.
       */
      plugins: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * List plugins recommended for installation on a WordPress installation that are
not yet installed.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_listAvailableWordPressPluginsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * List plugins installed on a WordPress installation, including their status,
available updates and known vulnerabilities.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_listInstalledWordPressPluginsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Filter installed plugins by category.
       */
      category?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Search the WordPress.org plugin directory for plugins available to install.

Use the returned `slug` values with
POST /api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/install.
   */
  "hosting_searchWordPressPluginsV1": {
    params: {
      /**
       * Search term to match against plugin names. Minimum 3 characters.
       */
      search: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * List curated plugin suggestions grouped by website type.

Use the returned `slug` values with
POST /api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/install.
   */
  "hosting_listSuggestedWordPressPluginsV1": {
    params: {
      /**
       * Optionally scope suggestions to a specific order.
       */
      order_id?: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Check whether WooCommerce is installed on any WordPress installation of a
domain. Optionally filter by domain to scope the check.
   */
  "hosting_checkIfWooCommerceIsInstalledV1": {
    params: {
      /**
       * Filter by domain name (exact match)
       */
      domain?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Uninstall one or more plugins from a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the uninstall
job has been queued.
   */
  "hosting_uninstallWordPressPluginsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Slugs of the installed plugins to uninstall.
       */
      plugins: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Update a Hostinger plugin to its latest version on a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the update job
has been queued.
   */
  "hosting_updateHostingerWordPressPluginV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Slug of the Hostinger plugin to update to its latest version.
       */
      slug: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Update one or more installed plugins to their latest version on a WordPress
installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the update job
has been queued.
   */
  "hosting_updateWordPressPluginsV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Slugs of the installed plugins to update to their latest version.
       */
      plugins: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Activate an installed theme on a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the activation
job has been queued.
   */
  "hosting_activateWordPressThemeV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Slug of the installed theme to activate.
       */
      theme: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Install a theme on an existing WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id`
field).

When the theme is one of the Hostinger themes (hostinger-blog,
hostinger-affiliate-theme, hostinger-ai-theme), the optional `palette`,
`layout`, and `font` fields are forwarded to the custom installer (defaults:
palette1, layout1, default). For any other theme they are ignored.

This operation is asynchronous: a successful response only means the install
job has been queued, not that the theme is ready.
   */
  "hosting_installWordPressThemeV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Slug of the theme to install. Hostinger theme slugs (hostinger-blog, hostinger-affiliate-theme, hostinger-ai-theme) trigger the custom installer and forward the optional palette/layout/font fields; any other WordPress theme slug uses the standard installer and ignores those fields.
       */
      theme: string;
      /**
       * Palette identifier. Only applied when the theme is a Hostinger theme; the default is used when omitted.
       */
      palette?: string;
      /**
       * Layout identifier. Only applied when the theme is a Hostinger theme; the default is used when omitted.
       */
      layout?: string;
      /**
       * Font identifier. Only applied when the theme is a Hostinger theme; the default is used when omitted.
       */
      font?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * List themes installed on a WordPress installation, including their status,
available updates and known vulnerabilities.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).
   */
  "hosting_listInstalledWordPressThemesV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * List WordPress themes available to install.

Use the returned `slug` values with
POST /api/hosting/v1/accounts/{username}/wordpress/{software}/themes/install.
   */
  "hosting_listWordPressThemesV1": {
    params: {
      /**
       * Optionally scope themes to a specific order.
       */
      order_id?: number;
      /**
       * Search term to match against theme names.
       */
      search?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Uninstall one or more themes from a WordPress installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the uninstall
job has been queued.
   */
  "hosting_uninstallWordPressThemesV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Slugs of the installed themes to uninstall.
       */
      themes: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Update one or more installed themes to their latest version on a WordPress
installation.

Provide the WordPress installation (software) identifier in the path. It can
be obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).

This operation is asynchronous: a successful response only means the update job
has been queued.
   */
  "hosting_updateWordPressThemesV1": {
    params: {
      /**
       * username parameter
       */
      username: string;
      /**
       * WordPress installation (software) identifier
       */
      software: string;
      /**
       * Slugs of the installed themes to update to their latest version.
       */
      themes: array;
    };
    response: any; // Response structure will depend on the API
  };
}
