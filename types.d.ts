/**
 * Type definitions for the API endpoints
 * Auto-generated from OpenAPI specification
 */

export interface APITools {
  /**
   * This endpoint retrieves a list of catalog items available for order. 

Prices in catalog items is displayed as cents (without floating point), e.g: float `17.99` is displayed as integer `1799`.
   */
  "undefined": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint creates a new service order. 

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
       * items property
       */
      items: array;
      /**
       * coupons property
       */
      coupons?: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint sets default payment method for your account.
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
   * This endpoint deletes a payment method from your account.
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
   * This endpoint retrieves a list of available payment methods that can be used for placing new orders.

If you want to add new payment method, please use [hPanel](https://hpanel.hostinger.com/billing/payment-methods).
   */
  "undefined": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint cancels a subscription and stops any further billing.
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
   * This endpoint retrieves a list of all subscriptions associated with your account.
   */
  "undefined": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint retrieves particular DNS snapshot with the contents of DNS zone records.
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
   * This endpoint retrieves list of DNS snapshots.
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
   * This endpoint restores DNS zone to the selected snapshot.
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
   * This endpoint retrieves DNS zone records for a specific domain.
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
   * This endpoint updates DNS records for the selected domain. 

Using `overwrite = true` will replace existing records with the provided ones. 
Otherwise existing records will be updated and new records will be added.
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
       * zone property
       */
      zone: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint deletes DNS records for the selected domain. 
To filter which records to delete, add the `name` of the record and `type` to the filter. 
Multiple filters can be provided with single request.

If you have multiple records with the same name and type, and you want to delete only part of them,
refer to the `Update zone records` endpoint.
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
   * This endpoint resets DNS zone to the default records.
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
   * This endpoint used to validate DNS records prior update for the selected domain. 

If the validation is successful, the response will contain `200 Success` code.
If there is validation error, the response will fail with `422 Validation error` code.
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
       * zone property
       */
      zone: array;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint retrieves a list of all domains associated with your account.
   */
  "undefined": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint retrieves a list of all data centers available.
   */
  "undefined": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint activates a firewall for a specified virtual machine. 

Only one firewall can be active for a virtual machine at a time.
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
   * This endpoint deactivates a firewall for a specified virtual machine.
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
   * This endpoint retrieves firewall by its ID and rules associated with it.
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
   * This endpoint deletes a specified firewall. 

Any virtual machine that has this firewall activated will automatically have it deactivated.
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
   * This endpoint retrieves a list of all firewalls available.
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
   * This endpoint creates a new firewall.
   */
  "undefined": {
    params: {
      /**
       * name property
       */
      name: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint updates a specific firewall rule from a specified firewall.

Any virtual machine that has this firewall activated will loose sync with the firewall and will have to be synced again manually.
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
       * protocol property
       */
      protocol: string;
      /**
       * Port or port range, ex: 1024:2048
       */
      port: string;
      /**
       * source property
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
   * This endpoint deletes a specific firewall rule from a specified firewall.

Any virtual machine that has this firewall activated will loose sync with the firewall and will have to be synced again manually.
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
   * This endpoint creates new firewall rule from a specified firewall. 
By default, the firewall drops all incoming traffic, which means you must add accept rules for all ports you want to use.

Any virtual machine that has this firewall activated will loose sync with the firewall and will have to be synced again manually.
   */
  "undefined": {
    params: {
      /**
       * Firewall ID
       */
      firewallId: number;
      /**
       * protocol property
       */
      protocol: string;
      /**
       * Port or port range, ex: 1024:2048
       */
      port: string;
      /**
       * source property
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
   * This endpoint syncs a firewall for a specified virtual machine.

Firewall can loose sync with virtual machine if the firewall has new rules added, removed or updated.
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
   * This endpoint retrieves post-install script by its ID.
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
   * This endpoint updates a specific post-install script.
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
   * This endpoint deletes a post-install script from your account. 
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
   * This endpoint retrieves a list of post-install scripts associated with your account.
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
   * This endpoint allows you to add a new post-install script to your account, 
which can then be used run after the installation of a virtual machine instance.

The script contents will be saved to the file `/post_install` with executable attribute set and will be executed once virtual machine is installed.
The output of the script will be redirected to `/post_install.log`. Maximum script size is 48KB. 
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
   * This endpoint attaches an existing public keys from your account to a specified virtual machine.

Multiple keys can be attached to a single virtual machine.
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
   * This endpoint deletes a public key from your account. 

**Deleting public key from account does not remove it from virtual machine** 
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
   * This endpoint retrieves a list of public keys associated with your account.
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
   * This endpoint allows you to add a new public key to your account, 
which can then be attached to virtual machine instances for secure access.
   */
  "undefined": {
    params: {
      /**
       * name property
       */
      name: string;
      /**
       * key property
       */
      key: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint retrieves details of a specific OS template for virtual machines.
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
   * This endpoint retrieves a list of available OS templates for virtual machines.
   */
  "undefined": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint retrieves details of a specific action performed on a specified virtual machine. 

This endpoint allows you to view detailed information about a particular action, including the action name, timestamp, and status.
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
   * This endpoint retrieves a list of actions performed on a specified virtual machine.

Actions are operations or events that have been executed on the virtual machine, such as starting, stopping, or modifying 
the machine. This endpoint allows you to view the history of these actions, providing details about each action, 
such as the action name, timestamp, and status.
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
   * This endpoint retrieves a list of public keys attached to a specified virtual machine.
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
   * This endpoint deletes a specified backup for a virtual machine.
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
   * This endpoint retrieves a list of backups for a specified virtual machine.
   */
  "undefined": {
    params: {
      /**
       * Page number
       */
      page?: number;
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint restores a backup for a specified virtual machine.

The system will then initiate the restore process, which may take some time depending on the size of the backup.

**All data on the virtual machine will be overwritten with the data from the backup.**
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
   * This endpoint sets the hostname for a specified virtual machine. 
Changing hostname does not update PTR record automatically.
If you want your virtual machine to be reachable by a hostname, 
you need to point your domain A/AAAA records to virtual machine IP as well.
   */
  "undefined": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * hostname property
       */
      hostname: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint resets the hostname and PTR record of a specified virtual machine to the default value.
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
   * This endpoint retrieves detailed information about a specified virtual machine.
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
   * This endpoint retrieves a list of all available virtual machines.
   */
  "undefined": {
    params: {

    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint retrieves the scan metrics for the [Monarx](https://www.monarx.com/) malware scanner installed on a specified virtual machine.
The scan metrics provide detailed information about the malware scans performed by Monarx, including the number of scans, 
detected threats, and other relevant statistics. This information is useful for monitoring the security status of the 
virtual machine and assessing the effectiveness of the malware scanner.
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
   * This endpoint installs the Monarx malware scanner on a specified virtual machine. 

[Monarx](https://www.monarx.com/) is a security tool designed to detect and prevent malware infections on virtual machines. 
By installing Monarx, users can enhance the security of their virtual machines, ensuring that they are protected against malicious software.
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
   * This endpoint uninstalls the Monarx malware scanner on a specified virtual machine.
If Monarx is not installed, the request will still be processed without any effect.
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
   * This endpoint retrieves the historical metrics for a specified virtual machine.
It includes the following metrics: 
- CPU usage
- Memory usage
- Disk usage
- Network usage
- Uptime
   */
  "undefined": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * the date-time notation as defined by RFC 3339, section 5.6
       */
      date_from: string;
      /**
       * the date-time notation as defined by RFC 3339, section 5.6
       */
      date_to: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint sets the nameservers for a specified virtual machine.
Be aware, that improper nameserver configuration can lead to the virtual machine being unable to resolve domain names.
   */
  "undefined": {
    params: {
      /**
       * Virtual Machine ID
       */
      virtualMachineId: number;
      /**
       * ns1 property
       */
      ns1: string;
      /**
       * ns2 property
       */
      ns2?: string;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint creates or updates a PTR (Pointer) record for a specified virtual machine.
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
   * This endpoint deletes a PTR (Pointer) record for a specified virtual machine. 

Once deleted, reverse DNS lookups to the virtual machine's IP address will no longer return the previously configured hostname.
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
   * This endpoint sets the panel password for a specified virtual machine. 
If virtual machine does not use panel OS, the request will still be processed without any effect.
Requirements for the password is the same as in the [recreate virtual machine endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).
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
   * This endpoint initiates the recovery mode for a specified virtual machine. 
Recovery mode is a special state that allows users to perform system rescue operations, 
such as repairing file systems, recovering data, or troubleshooting issues that prevent the virtual machine 
from booting normally. 

Virtual machine will boot recovery disk image and original disk image will be mounted in `/mnt` directory.
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
   * This endpoint stops the recovery mode for a specified virtual machine. 
If virtual machine is not in recovery mode, this operation will fail.
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
   * This endpoint will recreate a virtual machine from scratch. 
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
       * Password for the virtual machine. If not provided, random password will be generated. Password will not be shown in the response.
       */
      password?: string;
      /**
       * Post-install script ID
       */
      post_install_script_id?: number;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint restarts a specified virtual machine. This is equivalent to fully stopping and starting the virtual machine.
If the virtual machine was stopped, it will be started.
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
   * This endpoint sets the root password for a specified virtual machine. 
Requirements for the password is the same as in the [recreate virtual machine endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).
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
   * This endpoint will setup newly purchased virtual machine. Such virtual machines has `initial` state. 
New virtual machine can be purchased using [`/api/billing/v1/orders`](/#tag/billing-orders/POST/api/billing/v1/orders) endpoint.                        
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
       * ns1 property
       */
      ns1?: string;
      /**
       * ns2 property
       */
      ns2?: string;
      /**
       * public_key property
       */
      public_key?: object;
    };
    response: any; // Response structure will depend on the API
  };

  /**
   * This endpoint retrieves a snapshot for a specified virtual machine.
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
   * This endpoint creates a snapshot of a specified virtual machine. 
A snapshot captures the state and data of the virtual machine at a specific point in time, 
allowing users to restore the virtual machine to that state if needed. 
This operation is useful for backup purposes, system recovery, 
and testing changes without affecting the current state of the virtual machine.

**Creating new snapshot will overwrite the existing snapshot!**
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
   * This endpoint deletes a snapshot of a specified virtual machine.
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
   * This endpoint restores a specified virtual machine to a previous state using a snapshot. 
Restoring from a snapshot allows users to revert the virtual machine to that state, which is useful for system recovery, undoing changes, or testing.
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
   * This endpoint starts a specified virtual machine. 
If the virtual machine is already running, the request will still be processed without any effect.
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
   * This endpoint stops a specified virtual machine. 
If the virtual machine is already stopped, the request will still be processed without any effect.
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
