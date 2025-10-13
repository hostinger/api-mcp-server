/**
 * Type definitions for the API endpoints
 * Auto-generated from OpenAPI specification
 */

export interface APITools {
  /**
   * Retrieve catalog items available for order.

Prices in catalog items is displayed as cents (without floating point), e.g: float `17.99` is displayed as integer `1799`.

Use this endpoint to view available services and pricing before placing orders.
   */
  "undefined": {
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
   * Create a new service order. 

**DEPRECATED**

To purchase a domain, use [`POST /api/domains/v1/portfolio`](/#tag/domains-portfolio/POST/api/domains/v1/portfolio) instead.

To purchase a VPS, use [`POST /api/vps/v1/virtual-machines`](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines) instead.


To place order, you need to provide payment method ID and list of price items from the catalog endpoint together with quantity.
Coupons also can be provided during order creation.

Orders created using this endpoint will be set for automatic renewal.

Some `credit_card` payments might need additional verification, rendering purchase unprocessed.
We recommend use other payment methods than `credit_card` if you encounter this issue.
   */
  "undefined": {
    params: {
      /**
       * Payment method ID
       */
      payment_method_id: number;
      /**
       * items parameter
       */
      items: array;
      /**
       * Discount coupon codes
       */
      coupons?: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Set the default payment method for your account.

Use this endpoint to configure the primary payment method for future orders.
   */
  "undefined": {
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
  "undefined": {
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

If you want to add new payment method, please use [hPanel](https://hpanel.hostinger.com/billing/payment-methods).

Use this endpoint to view available payment options before creating orders.
   */
  "undefined": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Cancel a subscription and stop any further billing.

Use this endpoint when users want to terminate active services.
   */
  "undefined": {
    params: {
      /**
       * Subscription ID
       */
      subscriptionId: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve a list of all subscriptions associated with your account.

Use this endpoint to monitor active services and billing status.
   */
  "undefined": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Disable auto-renewal for a subscription.

Use this endpoint when disable auto-renewal for a subscription.
   */
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
    params: {
      /**
       * Domain name
       */
      domain: string;
      /**
       * If `true`, resource records (RRs) matching name and type will be deleted and new RRs will be created, otherwise resource records' ttl's are updated and new records are appended. If no matching RRs are found, they are created.
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
    params: {
      /**
       * Domain name
       */
      domain: string;
      /**
       * If `true`, resource records (RRs) matching name and type will be deleted and new RRs will be created, otherwise resource records' ttl's are updated and new records are appended. If no matching RRs are found, they are created.
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
   * Check availability of domain names across multiple TLDs.

Multiple TLDs can be checked at once.
If you want alternative domains with response, provide only one TLD and set `with_alternatives` to `true`.
TLDs should be provided without leading dot (e.g. `com`, `net`, `org`).

Endpoint has rate limit of 10 requests per minute.

Use this endpoint to verify domain availability before purchase.
   */
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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

When domain lock is enabled, the domain cannot be transferred to another registrar without first disabling the lock.

Use this endpoint to secure domains against unauthorized transfers.
   */
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
    params: {
      /**
       * WHOIS ID
       */
      whoisId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve a list of datacenters available for setting up hosting plans based on available datacenter capacity and hosting plan of your order.
The first item in the list is the best match for your specific order requirements.
   */
  "undefined": {
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
Free subdomains allow you to start using hosting services immediately and you can always connect a custom domain to your site later.
   */
  "undefined": {
    params: {

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
  "undefined": {
    params: {
      /**
       * Domain to verify ownership for
       */
      domain: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve a paginated list of orders accessible to the authenticated client.

This endpoint returns orders of your hosting accounts as well as orders of other client hosting accounts that have shared access with you.

Use the available query parameters to filter results by order statuses or specific order IDs for more targeted results.
   */
  "undefined": {
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
   * Retrieve a paginated list of websites (main and addon types) accessible to the authenticated client.

This endpoint returns websites from your hosting accounts as well as websites from other client hosting accounts that have shared access with you.

Use the available query parameters to filter results by username, order ID, or enabled status for more targeted results.
   */
  "undefined": {
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
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Create a new website for the authenticated client.

Provide the domain name and associated order ID to create a new website. The datacenter_code parameter is required when creating the first website on a new hosting plan - this will set up and configure new hosting account in the selected datacenter.

Subsequent websites will be hosted on the same datacenter automatically.

Website creation takes up to a few minutes to complete. Check the websites list endpoint to see when your new website becomes available.
   */
  "undefined": {
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
   * Delete a contact with the specified UUID.

This endpoint permanently removes a contact from the email marketing system.
   */
  "undefined": {
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
  "undefined": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Get a list of contacts, optionally filtered by group and subscription status.

This endpoint returns a paginated list of contacts with their basic information.
You can filter contacts by group UUID and subscription status.
   */
  "undefined": {
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
You can optionally assign the contact to specific groups and add notes.

The contact will be automatically subscribed to email communications.
   */
  "undefined": {
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
       * group_uuids parameter
       */
      group_uuids?: array;
      /**
       * note parameter
       */
      note?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve all available data centers.

Use this endpoint to view location options before deploying VPS instances.
   */
  "undefined": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieves a list of all containers belonging to a specific Docker Compose project on the virtual machine. 

This endpoint returns detailed information about each container including their current status, port mappings, and runtime configuration. 

Use this to monitor the health and state of all services within your Docker Compose project.
   */
  "undefined": {
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
   * Retrieves the complete project information including the docker-compose.yml file contents, project metadata, and current deployment status. 

This endpoint provides the full configuration and state details of a specific Docker Compose project. 

Use this to inspect project settings, review the compose file, or check the overall project health.
   */
  "undefined": {
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
  "undefined": {
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

This endpoint returns basic information about each project including name, status, file path and list of containers with 
details about their names, image, status, health and ports. Container stats are omitted in this endpoint.
If you need to get detailed information about container with stats included, use the `Get project containers` endpoint. 

Use this to get an overview of all Docker projects on your VPS instance.
   */
  "undefined": {
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

URL can be Github repository url in format https://github.com/[user]/[repo] and it will be automatically resolved to 
docker-compose.yaml file in master branch. Any other URL provided must return docker-compose.yaml file contents.

If project with the same name already exists, existing project will be replaced.
   */
  "undefined": {
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

Use this for debugging, monitoring application behavior, and troubleshooting issues across your entire project stack.
   */
  "undefined": {
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
   * Restarts all services in a Docker Compose project by stopping and starting containers in the correct dependency order. 

This operation preserves data volumes and network configurations while refreshing the running containers. 

Use this to apply configuration changes or recover from service failures.
   */
  "undefined": {
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
  "undefined": {
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
   * Stops all running services in a Docker Compose project while preserving container configurations and data volumes. 

This operation gracefully shuts down containers in reverse dependency order. 

Use this to temporarily halt a project without removing data or configurations.
   */
  "undefined": {
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
   * Updates a Docker Compose project by pulling the latest image versions and recreating containers with new configurations. 

This operation preserves data volumes while applying changes from the compose file. 

Use this to deploy application updates, apply configuration changes, or refresh container images to their latest versions.
   */
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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

Any virtual machine that has this firewall activated will lose sync with the firewall and will have to be synced again manually.

Use this endpoint to modify existing firewall rules.
   */
  "undefined": {
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

Any virtual machine that has this firewall activated will lose sync with the firewall and will have to be synced again manually.
       
Use this endpoint to remove specific firewall rules.
   */
  "undefined": {
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

By default, the firewall drops all incoming traffic, which means you must add accept rules for all ports you want to use.

Any virtual machine that has this firewall activated will lose sync with the firewall and will have to be synced again manually.

Use this endpoint to add new security rules to firewalls.
   */
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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

The script contents will be saved to the file `/post_install` with executable attribute set and will be executed once virtual machine is installed.
The output of the script will be redirected to `/post_install.log`. Maximum script size is 48KB.

Use this endpoint to create automation scripts for VPS setup tasks.
   */
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Retrieve detailed information about a specific action performed on a specified virtual machine.

Use this endpoint to monitor specific VPS operation status and details.
   */
  "undefined": {
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

Actions are operations or events that have been executed on the virtual machine, such as starting, stopping, or modifying 
the machine. This endpoint allows you to view the history of these actions, providing details about each action, 
such as the action name, timestamp, and status.

Use this endpoint to view VPS operation history and troubleshoot issues.
   */
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * Purchase and setup a new virtual machine.

If virtual machine setup fails for any reason, login to [hPanel](https://hpanel.hostinger.com/) and complete the setup manually.

If no payment method is provided, your default payment method will be used automatically.

Use this endpoint to create new VPS instances.                        
   */
  "undefined": {
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
   * Retrieve scan metrics for the [Monarx](https://www.monarx.com/) malware scanner installed on a specified virtual machine.

The scan metrics provide detailed information about malware scans performed by Monarx, including number of scans, 
detected threats, and other relevant statistics. This information is useful for monitoring security status of the 
virtual machine and assessing effectiveness of the malware scanner.

Use this endpoint to monitor VPS security scan results and threat detection.
   */
  "undefined": {
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

[Monarx](https://www.monarx.com/) is a security tool designed to detect and prevent malware infections on virtual machines. 
By installing Monarx, users can enhance the security of their virtual machines, ensuring that they are protected against malicious software.

Use this endpoint to enable malware protection on VPS instances.
   */
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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

Be aware, that improper nameserver configuration can lead to the virtual machine being unable to resolve domain names.

Use this endpoint to configure custom DNS resolvers for VPS instances.
   */
  "undefined": {
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
  "undefined": {
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

Once deleted, reverse DNS lookups to the virtual machine's IP address will no longer return the previously configured hostname.

Use this endpoint to remove reverse DNS configuration from VPS instances.
   */
  "undefined": {
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
Requirements for password are same as in the [recreate virtual machine endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).

Use this endpoint to configure control panel access credentials for VPS instances.
   */
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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

Use this endpoint to completely rebuild VPS instances with fresh OS installation.
   */
  "undefined": {
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
       * Root password for the virtual machine. If not provided, random password will be generated. Password will not be shown in the response.
       */
      password?: string;
      /**
       * Panel password for the panel-based OS template. If not provided, random password will be generated. If OS does not support panel_password this field will be ignored. Password will not be shown in the response.
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
  "undefined": {
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

Requirements for password are same as in the [recreate virtual machine endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).

Use this endpoint to update administrator credentials for VPS instances.
   */
  "undefined": {
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
  "undefined": {
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
       * Password for the virtual machine. If not provided, random password will be generated. Password will not be shown in the response.
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
  "undefined": {
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
  "undefined": {
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
  "undefined": {
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

Restoring from a snapshot allows users to revert the virtual machine to that state, which is useful for system recovery, undoing changes, or testing.

Use this endpoint to revert VPS instances to previous saved states.
   */
  "undefined": {
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
  "undefined": {
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
  "undefined": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };
}
