#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import minimist from 'minimist';
import cors from "cors";
import express from "express";
import axios from "axios";
import { config as dotenvConfig } from "dotenv";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Load environment variables
dotenvConfig();

// Define tool schemas
const TOOLS = [
  {
    "name": "billing_getCatalogItemListV1",
    "description": "Retrieve catalog items available for order.\n\nPrices in catalog items is displayed as cents (without floating point), e.g: float `17.99` is displayed as integer `1799`.\n\nUse this endpoint to view available services and pricing before placing orders.",
    "method": "GET",
    "path": "/api/billing/v1/catalog",
    "inputSchema": {
      "type": "object",
      "properties": {
        "category": {
          "type": "string",
          "description": "Filter catalog items by category",
          "enum": [
            "DOMAIN",
            "VPS"
          ]
        },
        "name": {
          "type": "string",
          "description": "Filter catalog items by name. Use `*` for wildcard search, e.g. `.COM*` to find .com domain"
        }
      },
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "billing_createServiceOrderV1",
    "description": "Create a new service order. \n\n**DEPRECATED**\n\nTo purchase a domain, use [`POST /api/domains/v1/portfolio`](/#tag/domains-portfolio/POST/api/domains/v1/portfolio) instead.\n\nTo purchase a VPS, use [`POST /api/vps/v1/virtual-machines`](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines) instead.\n\n\nTo place order, you need to provide payment method ID and list of price items from the catalog endpoint together with quantity.\nCoupons also can be provided during order creation.\n\nOrders created using this endpoint will be set for automatic renewal.\n\nSome `credit_card` payments might need additional verification, rendering purchase unprocessed.\nWe recommend use other payment methods than `credit_card` if you encounter this issue.",
    "method": "POST",
    "path": "/api/billing/v1/orders",
    "inputSchema": {
      "type": "object",
      "properties": {
        "payment_method_id": {
          "type": "integer",
          "description": "Payment method ID"
        },
        "items": {
          "type": "array",
          "description": "items parameter",
          "items": {
            "type": "object",
            "description": "items parameter",
            "properties": {
              "item_id": {
                "type": "string",
                "description": "Price Item ID"
              },
              "quantity": {
                "type": "integer",
                "description": "quantity parameter"
              }
            },
            "required": [
              "item_id",
              "quantity"
            ]
          }
        },
        "coupons": {
          "type": "array",
          "description": "Discount coupon codes",
          "items": {
            "type": "string",
            "description": "coupons parameter"
          }
        }
      },
      "required": [
        "payment_method_id",
        "items"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "billing_setDefaultPaymentMethodV1",
    "description": "Set the default payment method for your account.\n\nUse this endpoint to configure the primary payment method for future orders.",
    "method": "POST",
    "path": "/api/billing/v1/payment-methods/{paymentMethodId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "paymentMethodId": {
          "type": "integer",
          "description": "Payment method ID"
        }
      },
      "required": [
        "paymentMethodId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "billing_deletePaymentMethodV1",
    "description": "Delete a payment method from your account.\n\nUse this endpoint to remove unused payment methods from user accounts.",
    "method": "DELETE",
    "path": "/api/billing/v1/payment-methods/{paymentMethodId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "paymentMethodId": {
          "type": "integer",
          "description": "Payment method ID"
        }
      },
      "required": [
        "paymentMethodId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "billing_getPaymentMethodListV1",
    "description": "Retrieve available payment methods that can be used for placing new orders.\n\nIf you want to add new payment method, please use [hPanel](https://hpanel.hostinger.com/billing/payment-methods).\n\nUse this endpoint to view available payment options before creating orders.",
    "method": "GET",
    "path": "/api/billing/v1/payment-methods",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "billing_cancelSubscriptionV1",
    "description": "Cancel a subscription and stop any further billing.\n\nUse this endpoint when users want to terminate active services.",
    "method": "DELETE",
    "path": "/api/billing/v1/subscriptions/{subscriptionId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subscriptionId": {
          "type": "string",
          "description": "Subscription ID"
        }
      },
      "required": [
        "subscriptionId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "billing_getSubscriptionListV1",
    "description": "Retrieve a list of all subscriptions associated with your account.\n\nUse this endpoint to monitor active services and billing status.",
    "method": "GET",
    "path": "/api/billing/v1/subscriptions",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "DNS_getDNSSnapshotV1",
    "description": "Retrieve particular DNS snapshot with contents of DNS zone records.\n\nUse this endpoint to view historical DNS configurations for domains.",
    "method": "GET",
    "path": "/api/dns/v1/snapshots/{domain}/{snapshotId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "snapshotId": {
          "type": "integer",
          "description": "Snapshot ID"
        }
      },
      "required": [
        "domain",
        "snapshotId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "DNS_getDNSSnapshotListV1",
    "description": "Retrieve DNS snapshots for a domain.\n\nUse this endpoint to view available DNS backup points for restoration.",
    "method": "GET",
    "path": "/api/dns/v1/snapshots/{domain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "DNS_restoreDNSSnapshotV1",
    "description": "Restore DNS zone to the selected snapshot.\n\nUse this endpoint to revert domain DNS to a previous configuration.",
    "method": "POST",
    "path": "/api/dns/v1/snapshots/{domain}/{snapshotId}/restore",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "snapshotId": {
          "type": "integer",
          "description": "Snapshot ID"
        }
      },
      "required": [
        "domain",
        "snapshotId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "DNS_getDNSRecordsV1",
    "description": "Retrieve DNS zone records for a specific domain.\n\nUse this endpoint to view current DNS configuration for domain management.",
    "method": "GET",
    "path": "/api/dns/v1/zones/{domain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "DNS_updateDNSRecordsV1",
    "description": "Update DNS records for the selected domain.\n\nUsing `overwrite = true` will replace existing records with the provided ones. \nOtherwise existing records will be updated and new records will be added.\n\nUse this endpoint to modify domain DNS configuration.",
    "method": "PUT",
    "path": "/api/dns/v1/zones/{domain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "overwrite": {
          "type": "boolean",
          "description": "If `true`, resource records (RRs) matching name and type will be deleted and new RRs will be created, otherwise resource records' ttl's are updated and new records are appended. If no matching RRs are found, they are created."
        },
        "zone": {
          "type": "array",
          "description": "zone parameter",
          "items": {
            "type": "object",
            "description": "zone parameter",
            "properties": {
              "name": {
                "type": "string",
                "description": "Name of the record (use `@` for wildcard name)"
              },
              "records": {
                "type": "array",
                "description": "Records assigned to the name",
                "items": {
                  "type": "object",
                  "description": "records parameter",
                  "properties": {
                    "content": {
                      "type": "string",
                      "description": "Content of the name record"
                    }
                  },
                  "required": [
                    "content"
                  ]
                }
              },
              "ttl": {
                "type": "integer",
                "description": "TTL (Time-To-Live) of the record"
              },
              "type": {
                "type": "string",
                "description": "Type of the record",
                "enum": [
                  "A",
                  "AAAA",
                  "CNAME",
                  "ALIAS",
                  "MX",
                  "TXT",
                  "NS",
                  "SOA",
                  "SRV",
                  "CAA"
                ]
              }
            },
            "required": [
              "name",
              "records",
              "type"
            ]
          }
        }
      },
      "required": [
        "domain",
        "zone"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "DNS_deleteDNSRecordsV1",
    "description": "Delete DNS records for the selected domain.\n\nTo filter which records to delete, add the `name` of the record and `type` to the filter. \nMultiple filters can be provided with single request.\n\nIf you have multiple records with the same name and type, and you want to delete only part of them,\nrefer to the `Update zone records` endpoint.\n\nUse this endpoint to remove specific DNS records from domains.",
    "method": "DELETE",
    "path": "/api/dns/v1/zones/{domain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "DNS_resetDNSRecordsV1",
    "description": "Reset DNS zone to the default records.\n\nUse this endpoint to restore domain DNS to original configuration.",
    "method": "POST",
    "path": "/api/dns/v1/zones/{domain}/reset",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "sync": {
          "type": "boolean",
          "description": "Determines if operation should be run synchronously"
        },
        "reset_email_records": {
          "type": "boolean",
          "description": "Determines if email records should be reset"
        },
        "whitelisted_record_types": {
          "type": "array",
          "description": "Specifies which record types to not reset",
          "items": {
            "type": "string",
            "description": "whitelisted_record_types parameter"
          }
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "DNS_validateDNSRecordsV1",
    "description": "Validate DNS records prior to update for the selected domain.\n\nIf the validation is successful, the response will contain `200 Success` code.\nIf there is validation error, the response will fail with `422 Validation error` code.\n\nUse this endpoint to verify DNS record validity before applying changes.",
    "method": "POST",
    "path": "/api/dns/v1/zones/{domain}/validate",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "overwrite": {
          "type": "boolean",
          "description": "If `true`, resource records (RRs) matching name and type will be deleted and new RRs will be created, otherwise resource records' ttl's are updated and new records are appended. If no matching RRs are found, they are created."
        },
        "zone": {
          "type": "array",
          "description": "zone parameter",
          "items": {
            "type": "object",
            "description": "zone parameter",
            "properties": {
              "name": {
                "type": "string",
                "description": "Name of the record (use `@` for wildcard name)"
              },
              "records": {
                "type": "array",
                "description": "Records assigned to the name",
                "items": {
                  "type": "object",
                  "description": "records parameter",
                  "properties": {
                    "content": {
                      "type": "string",
                      "description": "Content of the name record"
                    }
                  },
                  "required": [
                    "content"
                  ]
                }
              },
              "ttl": {
                "type": "integer",
                "description": "TTL (Time-To-Live) of the record"
              },
              "type": {
                "type": "string",
                "description": "Type of the record",
                "enum": [
                  "A",
                  "AAAA",
                  "CNAME",
                  "ALIAS",
                  "MX",
                  "TXT",
                  "NS",
                  "SOA",
                  "SRV",
                  "CAA"
                ]
              }
            },
            "required": [
              "name",
              "records",
              "type"
            ]
          }
        }
      },
      "required": [
        "domain",
        "zone"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_checkDomainAvailabilityV1",
    "description": "Check availability of domain names across multiple TLDs.\n\nMultiple TLDs can be checked at once.\nIf you want alternative domains with response, provide only one TLD and set `with_alternatives` to `true`.\nTLDs should be provided without leading dot (e.g. `com`, `net`, `org`).\n\nEndpoint has rate limit of 10 requests per minute.\n\nUse this endpoint to verify domain availability before purchase.",
    "method": "POST",
    "path": "/api/domains/v1/availability",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name (without TLD)"
        },
        "tlds": {
          "type": "array",
          "description": "TLDs list",
          "items": {
            "type": "string",
            "description": "TLD without leading dot"
          }
        },
        "with_alternatives": {
          "type": "boolean",
          "description": "Should response include alternatives"
        }
      },
      "required": [
        "domain",
        "tlds"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_getDomainForwardingV1",
    "description": "Retrieve domain forwarding data.\n\nUse this endpoint to view current redirect configuration for domains.",
    "method": "GET",
    "path": "/api/domains/v1/forwarding/{domain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_deleteDomainForwardingV1",
    "description": "Delete domain forwarding data.\n\nUse this endpoint to remove redirect configuration from domains.",
    "method": "DELETE",
    "path": "/api/domains/v1/forwarding/{domain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_createDomainForwardingV1",
    "description": "Create domain forwarding configuration.\n\nUse this endpoint to set up domain redirects to other URLs.",
    "method": "POST",
    "path": "/api/domains/v1/forwarding",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "redirect_type": {
          "type": "string",
          "description": "Redirect type",
          "enum": [
            "301",
            "302"
          ]
        },
        "redirect_url": {
          "type": "string",
          "description": "URL to forward domain to"
        }
      },
      "required": [
        "domain",
        "redirect_type",
        "redirect_url"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_enableDomainLockV1",
    "description": "Enable domain lock for the domain.\n\nWhen domain lock is enabled, the domain cannot be transferred to another registrar without first disabling the lock.\n\nUse this endpoint to secure domains against unauthorized transfers.",
    "method": "PUT",
    "path": "/api/domains/v1/portfolio/{domain}/domain-lock",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_disableDomainLockV1",
    "description": "Disable domain lock for the domain.\n\nDomain lock needs to be disabled before transferring the domain to another registrar.\n\nUse this endpoint to prepare domains for transfer to other registrars.",
    "method": "DELETE",
    "path": "/api/domains/v1/portfolio/{domain}/domain-lock",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_getDomainDetailsV1",
    "description": "Retrieve detailed information for specified domain.\n\nUse this endpoint to view comprehensive domain configuration and status.",
    "method": "GET",
    "path": "/api/domains/v1/portfolio/{domain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_getDomainListV1",
    "description": "Retrieve all domains associated with your account.\n\nUse this endpoint to view user's domain portfolio.",
    "method": "GET",
    "path": "/api/domains/v1/portfolio",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_purchaseNewDomainV1",
    "description": "Purchase and register a new domain name.\n\nIf registration fails, login to [hPanel](https://hpanel.hostinger.com/) and check domain registration status.\n\nIf no payment method is provided, your default payment method will be used automatically.\n\nIf no WHOIS information is provided, default contact information for that TLD will be used. \nBefore making request, ensure WHOIS information for desired TLD exists in your account.\n\nSome TLDs require `additional_details` to be provided and these will be validated before completing purchase.\n\nUse this endpoint to register new domains for users.",
    "method": "POST",
    "path": "/api/domains/v1/portfolio",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "item_id": {
          "type": "string",
          "description": "Catalog price item ID"
        },
        "payment_method_id": {
          "type": "integer",
          "description": "Payment method ID, default will be used if not provided"
        },
        "domain_contacts": {
          "type": "object",
          "description": "Domain contact information",
          "properties": {
            "owner_id": {
              "type": "integer",
              "description": "Owner contact WHOIS record ID"
            },
            "admin_id": {
              "type": "integer",
              "description": "Administrative contact WHOIS record ID"
            },
            "billing_id": {
              "type": "integer",
              "description": "Billing contact WHOIS record ID"
            },
            "tech_id": {
              "type": "integer",
              "description": "Technical contact WHOIS record ID"
            }
          }
        },
        "additional_details": {
          "type": "object",
          "description": "Additional registration data, possible values depends on TLD",
          "properties": {}
        },
        "coupons": {
          "type": "array",
          "description": "Discount coupon codes",
          "items": {
            "type": "string",
            "description": "coupons parameter"
          }
        }
      },
      "required": [
        "domain",
        "item_id"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_enablePrivacyProtectionV1",
    "description": "Enable privacy protection for the domain.\n\nWhen privacy protection is enabled, domain owner's personal information is hidden from public WHOIS database.\n\nUse this endpoint to protect domain owner's personal information from public view.",
    "method": "PUT",
    "path": "/api/domains/v1/portfolio/{domain}/privacy-protection",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_disablePrivacyProtectionV1",
    "description": "Disable privacy protection for the domain.\n\nWhen privacy protection is disabled, domain owner's personal information is visible in public WHOIS database.\n\nUse this endpoint to make domain owner's information publicly visible.",
    "method": "DELETE",
    "path": "/api/domains/v1/portfolio/{domain}/privacy-protection",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_updateDomainNameserversV1",
    "description": "Set nameservers for a specified domain.\n\nBe aware, that improper nameserver configuration can lead to the domain being unresolvable or unavailable.\n\nUse this endpoint to configure custom DNS hosting for domains.",
    "method": "PUT",
    "path": "/api/domains/v1/portfolio/{domain}/nameservers",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "ns1": {
          "type": "string",
          "description": "First name server"
        },
        "ns2": {
          "type": "string",
          "description": "Second name server"
        },
        "ns3": {
          "type": "string",
          "description": "Third name server"
        },
        "ns4": {
          "type": "string",
          "description": "Fourth name server"
        }
      },
      "required": [
        "domain",
        "ns1",
        "ns2"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_getWHOISProfileV1",
    "description": "Retrieve a WHOIS contact profile.\n\nUse this endpoint to view domain registration contact information.",
    "method": "GET",
    "path": "/api/domains/v1/whois/{whoisId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "whoisId": {
          "type": "integer",
          "description": "WHOIS ID"
        }
      },
      "required": [
        "whoisId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_deleteWHOISProfileV1",
    "description": "Delete WHOIS contact profile.\n\nUse this endpoint to remove unused contact profiles from account.",
    "method": "DELETE",
    "path": "/api/domains/v1/whois/{whoisId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "whoisId": {
          "type": "integer",
          "description": "WHOIS ID"
        }
      },
      "required": [
        "whoisId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_getWHOISProfileListV1",
    "description": "Retrieve WHOIS contact profiles.\n\nUse this endpoint to view available contact profiles for domain registration.",
    "method": "GET",
    "path": "/api/domains/v1/whois",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tld": {
          "type": "string",
          "description": "Filter by TLD (without leading dot)"
        }
      },
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_createWHOISProfileV1",
    "description": "Create WHOIS contact profile.\n\nUse this endpoint to add new contact information for domain registration.",
    "method": "POST",
    "path": "/api/domains/v1/whois",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tld": {
          "type": "string",
          "description": "TLD of the domain (without leading dot)"
        },
        "country": {
          "type": "string",
          "description": "ISO 3166 2-letter country code"
        },
        "entity_type": {
          "type": "string",
          "description": "Legal entity type",
          "enum": [
            "individual",
            "organization"
          ]
        },
        "tld_details": {
          "type": "object",
          "description": "TLD details",
          "properties": {}
        },
        "whois_details": {
          "type": "object",
          "description": "WHOIS details",
          "properties": {}
        }
      },
      "required": [
        "tld",
        "entity_type",
        "country",
        "whois_details"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "domains_getWHOISProfileUsageV1",
    "description": "Retrieve domain list where provided WHOIS contact profile is used.\n\nUse this endpoint to view which domains use specific contact profiles.",
    "method": "GET",
    "path": "/api/domains/v1/whois/{whoisId}/usage",
    "inputSchema": {
      "type": "object",
      "properties": {
        "whoisId": {
          "type": "integer",
          "description": "WHOIS ID"
        }
      },
      "required": [
        "whoisId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getDataCenterListV1",
    "description": "Retrieve all available data centers.\n\nUse this endpoint to view location options before deploying VPS instances.",
    "method": "GET",
    "path": "/api/vps/v1/data-centers",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getProjectContainersV1",
    "description": "Retrieves a list of all containers belonging to a specific Docker Compose project on the virtual machine. \n\nThis endpoint returns detailed information about each container including their current status, port mappings, and runtime configuration. \n\nUse this to monitor the health and state of all services within your Docker Compose project.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/containers",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getProjectContentsV1",
    "description": "Retrieves the complete project information including the docker-compose.yml file contents, project metadata, and current deployment status. \n\nThis endpoint provides the full configuration and state details of a specific Docker Compose project. \n\nUse this to inspect project settings, review the compose file, or check the overall project health.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_deleteProjectV1",
    "description": "Completely removes a Docker Compose project from the virtual machine, stopping all containers and cleaning up \nassociated resources including networks, volumes, and images. \n\nThis operation is irreversible and will delete all project data. \n\nUse this when you want to permanently remove a project and free up system resources.",
    "method": "DELETE",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/down",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getProjectListV1",
    "description": "Retrieves a list of all Docker Compose projects currently deployed on the virtual machine. \n\nThis endpoint returns basic information about each project including name, status, and file path. \n\nUse this to get an overview of all Docker projects on your VPS instance.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_createNewProjectV1",
    "description": "Deploy new project from docker-compose.yaml contents or download contents from URL. \n\nURL can be Github repository url in format https://github.com/[user]/[repo] and it will be automatically resolved to \ndocker-compose.yaml file in master branch. Any other URL provided must return docker-compose.yaml file contents.\n\nIf project already exists, it will be replaced.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "project_name": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        },
        "content": {
          "type": "string",
          "description": "URL pointing to docker-compose.yaml file, Github repository or raw YAML content of the compose file"
        }
      },
      "required": [
        "virtualMachineId",
        "project_name",
        "content"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getProjectLogsV1",
    "description": "Retrieves aggregated log entries from all services within a Docker Compose project. \n\nThis endpoint returns recent log output from each container, organized by service name with timestamps. \nThe response contains the last 300 log entries across all services. \n\nUse this for debugging, monitoring application behavior, and troubleshooting issues across your entire project stack.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/logs",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_restartAProjectV1",
    "description": "Restarts all services in a Docker Compose project by stopping and starting containers in the correct dependency order. \n\nThis operation preserves data volumes and network configurations while refreshing the running containers. \n\nUse this to apply configuration changes or recover from service failures.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/restart",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_startAProjectV1",
    "description": "Starts all services in a Docker Compose project that are currently stopped. \n\nThis operation brings up containers in the correct dependency order as defined in the compose file. \n\nUse this to resume a project that was previously stopped or to start services after a system reboot.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/start",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_stopAProjectV1",
    "description": "Stops all running services in a Docker Compose project while preserving container configurations and data volumes. \n\nThis operation gracefully shuts down containers in reverse dependency order. \n\nUse this to temporarily halt a project without removing data or configurations.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/stop",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_updateAProjectV1",
    "description": "Updates a Docker Compose project by pulling the latest image versions and recreating containers with new configurations. \n\nThis operation preserves data volumes while applying changes from the compose file. \n\nUse this to deploy application updates, apply configuration changes, or refresh container images to their latest versions.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/update",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_activateFirewallV1",
    "description": "Activate a firewall for a specified virtual machine.\n\nOnly one firewall can be active for a virtual machine at a time.\n\nUse this endpoint to apply firewall rules to VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/firewall/{firewallId}/activate/{virtualMachineId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        },
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "firewallId",
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_deactivateFirewallV1",
    "description": "Deactivate a firewall for a specified virtual machine.\n\nUse this endpoint to remove firewall protection from VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/firewall/{firewallId}/deactivate/{virtualMachineId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        },
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "firewallId",
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getFirewallDetailsV1",
    "description": "Retrieve firewall by its ID and rules associated with it.\n\nUse this endpoint to view specific firewall configuration and rules.",
    "method": "GET",
    "path": "/api/vps/v1/firewall/{firewallId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        }
      },
      "required": [
        "firewallId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_deleteFirewallV1",
    "description": "Delete a specified firewall.\n\nAny virtual machine that has this firewall activated will automatically have it deactivated.\n\nUse this endpoint to remove unused firewall configurations.",
    "method": "DELETE",
    "path": "/api/vps/v1/firewall/{firewallId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        }
      },
      "required": [
        "firewallId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getFirewallListV1",
    "description": "Retrieve all available firewalls.\n\nUse this endpoint to view existing firewall configurations.",
    "method": "GET",
    "path": "/api/vps/v1/firewall",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "integer",
          "description": "Page number"
        }
      },
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_createNewFirewallV1",
    "description": "Create a new firewall.\n\nUse this endpoint to set up new firewall configurations for VPS security.",
    "method": "POST",
    "path": "/api/vps/v1/firewall",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "name parameter"
        }
      },
      "required": [
        "name"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_updateFirewallRuleV1",
    "description": "Update a specific firewall rule from a specified firewall.\n\nAny virtual machine that has this firewall activated will lose sync with the firewall and will have to be synced again manually.\n\nUse this endpoint to modify existing firewall rules.",
    "method": "PUT",
    "path": "/api/vps/v1/firewall/{firewallId}/rules/{ruleId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        },
        "ruleId": {
          "type": "integer",
          "description": "Firewall Rule ID"
        },
        "protocol": {
          "type": "string",
          "description": "protocol parameter",
          "enum": [
            "TCP",
            "UDP",
            "ICMP",
            "GRE",
            "any",
            "ESP",
            "AH",
            "ICMPv6",
            "SSH",
            "HTTP",
            "HTTPS",
            "MySQL",
            "PostgreSQL"
          ]
        },
        "port": {
          "type": "string",
          "description": "Port or port range, ex: 1024:2048"
        },
        "source": {
          "type": "string",
          "description": "source parameter",
          "enum": [
            "any",
            "custom"
          ]
        },
        "source_detail": {
          "type": "string",
          "description": "IP range, CIDR, single IP or `any`"
        }
      },
      "required": [
        "firewallId",
        "ruleId",
        "protocol",
        "port",
        "source",
        "source_detail"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_deleteFirewallRuleV1",
    "description": "Delete a specific firewall rule from a specified firewall.\n\nAny virtual machine that has this firewall activated will lose sync with the firewall and will have to be synced again manually.\n       \nUse this endpoint to remove specific firewall rules.",
    "method": "DELETE",
    "path": "/api/vps/v1/firewall/{firewallId}/rules/{ruleId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        },
        "ruleId": {
          "type": "integer",
          "description": "Firewall Rule ID"
        }
      },
      "required": [
        "firewallId",
        "ruleId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_createFirewallRuleV1",
    "description": "Create new firewall rule for a specified firewall.\n\nBy default, the firewall drops all incoming traffic, which means you must add accept rules for all ports you want to use.\n\nAny virtual machine that has this firewall activated will lose sync with the firewall and will have to be synced again manually.\n\nUse this endpoint to add new security rules to firewalls.",
    "method": "POST",
    "path": "/api/vps/v1/firewall/{firewallId}/rules",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        },
        "protocol": {
          "type": "string",
          "description": "protocol parameter",
          "enum": [
            "TCP",
            "UDP",
            "ICMP",
            "GRE",
            "any",
            "ESP",
            "AH",
            "ICMPv6",
            "SSH",
            "HTTP",
            "HTTPS",
            "MySQL",
            "PostgreSQL"
          ]
        },
        "port": {
          "type": "string",
          "description": "Port or port range, ex: 1024:2048"
        },
        "source": {
          "type": "string",
          "description": "source parameter",
          "enum": [
            "any",
            "custom"
          ]
        },
        "source_detail": {
          "type": "string",
          "description": "IP range, CIDR, single IP or `any`"
        }
      },
      "required": [
        "firewallId",
        "protocol",
        "port",
        "source",
        "source_detail"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_syncFirewallV1",
    "description": "Sync a firewall for a specified virtual machine.\n\nFirewall can lose sync with virtual machine if the firewall has new rules added, removed or updated.\n\nUse this endpoint to apply updated firewall rules to VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/firewall/{firewallId}/sync/{virtualMachineId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        },
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "firewallId",
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getPostInstallScriptV1",
    "description": "Retrieve post-install script by its ID.\n\nUse this endpoint to view specific automation script details.",
    "method": "GET",
    "path": "/api/vps/v1/post-install-scripts/{postInstallScriptId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "postInstallScriptId": {
          "type": "integer",
          "description": "Post-install script ID"
        }
      },
      "required": [
        "postInstallScriptId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_updatePostInstallScriptV1",
    "description": "Update a specific post-install script.\n\nUse this endpoint to modify existing automation scripts.",
    "method": "PUT",
    "path": "/api/vps/v1/post-install-scripts/{postInstallScriptId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "postInstallScriptId": {
          "type": "integer",
          "description": "Post-install script ID"
        },
        "name": {
          "type": "string",
          "description": "Name of the script"
        },
        "content": {
          "type": "string",
          "description": "Content of the script"
        }
      },
      "required": [
        "postInstallScriptId",
        "name",
        "content"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_deletePostInstallScriptV1",
    "description": "Delete a post-install script from your account.\n       \nUse this endpoint to remove unused automation scripts.",
    "method": "DELETE",
    "path": "/api/vps/v1/post-install-scripts/{postInstallScriptId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "postInstallScriptId": {
          "type": "integer",
          "description": "Post-install script ID"
        }
      },
      "required": [
        "postInstallScriptId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getPostInstallScriptsV1",
    "description": "Retrieve post-install scripts associated with your account.\n\nUse this endpoint to view available automation scripts for VPS deployment.",
    "method": "GET",
    "path": "/api/vps/v1/post-install-scripts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "integer",
          "description": "Page number"
        }
      },
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_createPostInstallScriptV1",
    "description": "Add a new post-install script to your account, which can then be used after virtual machine installation.\n\nThe script contents will be saved to the file `/post_install` with executable attribute set and will be executed once virtual machine is installed.\nThe output of the script will be redirected to `/post_install.log`. Maximum script size is 48KB.\n\nUse this endpoint to create automation scripts for VPS setup tasks.",
    "method": "POST",
    "path": "/api/vps/v1/post-install-scripts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Name of the script"
        },
        "content": {
          "type": "string",
          "description": "Content of the script"
        }
      },
      "required": [
        "name",
        "content"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_attachPublicKeyV1",
    "description": "Attach existing public keys from your account to a specified virtual machine.\n\nMultiple keys can be attached to a single virtual machine.\n\nUse this endpoint to enable SSH key authentication for VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/public-keys/attach/{virtualMachineId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "ids": {
          "type": "array",
          "description": "Public Key IDs to attach",
          "items": {
            "type": "integer",
            "description": "ids parameter"
          }
        }
      },
      "required": [
        "virtualMachineId",
        "ids"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_deletePublicKeyV1",
    "description": "Delete a public key from your account. \n\n**Deleting public key from account does not remove it from virtual machine** \n       \nUse this endpoint to remove unused SSH keys from account.",
    "method": "DELETE",
    "path": "/api/vps/v1/public-keys/{publicKeyId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "publicKeyId": {
          "type": "integer",
          "description": "Public Key ID"
        }
      },
      "required": [
        "publicKeyId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getPublicKeysV1",
    "description": "Retrieve public keys associated with your account.\n\nUse this endpoint to view available SSH keys for VPS authentication.",
    "method": "GET",
    "path": "/api/vps/v1/public-keys",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "integer",
          "description": "Page number"
        }
      },
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_createPublicKeyV1",
    "description": "Add a new public key to your account.\n\nUse this endpoint to register SSH keys for VPS authentication.",
    "method": "POST",
    "path": "/api/vps/v1/public-keys",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "name parameter"
        },
        "key": {
          "type": "string",
          "description": "key parameter"
        }
      },
      "required": [
        "name",
        "key"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getTemplateDetailsV1",
    "description": "Retrieve detailed information about a specific OS template for virtual machines.\n\nUse this endpoint to view specific template specifications before deployment.",
    "method": "GET",
    "path": "/api/vps/v1/templates/{templateId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "templateId": {
          "type": "integer",
          "description": "Template ID"
        }
      },
      "required": [
        "templateId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getTemplatesV1",
    "description": "Retrieve available OS templates for virtual machines.\n\nUse this endpoint to view operating system options before creating or recreating VPS instances.",
    "method": "GET",
    "path": "/api/vps/v1/templates",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getActionDetailsV1",
    "description": "Retrieve detailed information about a specific action performed on a specified virtual machine.\n\nUse this endpoint to monitor specific VPS operation status and details.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/actions/{actionId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "actionId": {
          "type": "integer",
          "description": "Action ID"
        }
      },
      "required": [
        "virtualMachineId",
        "actionId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getActionsV1",
    "description": "Retrieve actions performed on a specified virtual machine.\n\nActions are operations or events that have been executed on the virtual machine, such as starting, stopping, or modifying \nthe machine. This endpoint allows you to view the history of these actions, providing details about each action, \nsuch as the action name, timestamp, and status.\n\nUse this endpoint to view VPS operation history and troubleshoot issues.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/actions",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "page": {
          "type": "integer",
          "description": "Page number"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getAttachedPublicKeysV1",
    "description": "Retrieve public keys attached to a specified virtual machine.\n\nUse this endpoint to view SSH keys configured for specific VPS instances.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/public-keys",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "page": {
          "type": "integer",
          "description": "Page number"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getBackupsV1",
    "description": "Retrieve backups for a specified virtual machine.\n\nUse this endpoint to view available backup points for VPS data recovery.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/backups",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "page": {
          "type": "integer",
          "description": "Page number"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_restoreBackupV1",
    "description": "Restore a backup for a specified virtual machine.\n\nThe system will then initiate the restore process, which may take some time depending on the size of the backup.\n\n**All data on the virtual machine will be overwritten with the data from the backup.**\n\nUse this endpoint to recover VPS data from backup points.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/backups/{backupId}/restore",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "backupId": {
          "type": "integer",
          "description": "Backup ID"
        }
      },
      "required": [
        "virtualMachineId",
        "backupId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_setHostnameV1",
    "description": "Set hostname for a specified virtual machine.\n\nChanging hostname does not update PTR record automatically.\nIf you want your virtual machine to be reachable by a hostname, \nyou need to point your domain A/AAAA records to virtual machine IP as well.\n\nUse this endpoint to configure custom hostnames for VPS instances.",
    "method": "PUT",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/hostname",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "hostname": {
          "type": "string",
          "description": "hostname parameter"
        }
      },
      "required": [
        "virtualMachineId",
        "hostname"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_resetHostnameV1",
    "description": "Reset hostname and PTR record of a specified virtual machine to default value.\n\nUse this endpoint to restore default hostname configuration for VPS instances.",
    "method": "DELETE",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/hostname",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getVirtualMachineDetailsV1",
    "description": "Retrieve detailed information about a specified virtual machine.\n\nUse this endpoint to view comprehensive VPS configuration and status.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getVirtualMachinesV1",
    "description": "Retrieve all available virtual machines.\n\nUse this endpoint to view available VPS instances.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_purchaseNewVirtualMachineV1",
    "description": "Purchase and setup a new virtual machine.\n\nIf virtual machine setup fails for any reason, login to [hPanel](https://hpanel.hostinger.com/) and complete the setup manually.\n\nIf no payment method is provided, your default payment method will be used automatically.\n\nUse this endpoint to create new VPS instances.                        ",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines",
    "inputSchema": {
      "type": "object",
      "properties": {
        "item_id": {
          "type": "string",
          "description": "Catalog price item ID"
        },
        "payment_method_id": {
          "type": "integer",
          "description": "Payment method ID, default will be used if not provided"
        },
        "setup": {
          "type": "string",
          "description": "setup parameter"
        },
        "coupons": {
          "type": "array",
          "description": "Discount coupon codes",
          "items": {
            "type": "string",
            "description": "coupons parameter"
          }
        }
      },
      "required": [
        "item_id",
        "setup"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getScanMetricsV1",
    "description": "Retrieve scan metrics for the [Monarx](https://www.monarx.com/) malware scanner installed on a specified virtual machine.\n\nThe scan metrics provide detailed information about malware scans performed by Monarx, including number of scans, \ndetected threats, and other relevant statistics. This information is useful for monitoring security status of the \nvirtual machine and assessing effectiveness of the malware scanner.\n\nUse this endpoint to monitor VPS security scan results and threat detection.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/monarx",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_installMonarxV1",
    "description": "Install the Monarx malware scanner on a specified virtual machine.\n\n[Monarx](https://www.monarx.com/) is a security tool designed to detect and prevent malware infections on virtual machines. \nBy installing Monarx, users can enhance the security of their virtual machines, ensuring that they are protected against malicious software.\n\nUse this endpoint to enable malware protection on VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/monarx",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_uninstallMonarxV1",
    "description": "Uninstall the Monarx malware scanner on a specified virtual machine.\n\nIf Monarx is not installed, the request will still be processed without any effect.\n\nUse this endpoint to remove malware scanner from VPS instances.",
    "method": "DELETE",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/monarx",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getMetricsV1",
    "description": "Retrieve historical metrics for a specified virtual machine.\n\nIt includes the following metrics: \n- CPU usage\n- Memory usage\n- Disk usage\n- Network usage\n- Uptime\n\nUse this endpoint to monitor VPS performance and resource utilization over time.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/metrics",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "date_from": {
          "type": "string",
          "description": "date_from parameter"
        },
        "date_to": {
          "type": "string",
          "description": "date_to parameter"
        }
      },
      "required": [
        "virtualMachineId",
        "date_from",
        "date_to"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_setNameserversV1",
    "description": "Set nameservers for a specified virtual machine.\n\nBe aware, that improper nameserver configuration can lead to the virtual machine being unable to resolve domain names.\n\nUse this endpoint to configure custom DNS resolvers for VPS instances.",
    "method": "PUT",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/nameservers",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "ns1": {
          "type": "string",
          "description": "ns1 parameter"
        },
        "ns2": {
          "type": "string",
          "description": "ns2 parameter"
        },
        "ns3": {
          "type": "string",
          "description": "ns3 parameter"
        }
      },
      "required": [
        "virtualMachineId",
        "ns1"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_createPTRRecordV1",
    "description": "Create or update a PTR (Pointer) record for a specified virtual machine.\n\nUse this endpoint to configure reverse DNS lookup for VPS IP addresses.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/ptr",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_deletePTRRecordV1",
    "description": "Delete a PTR (Pointer) record for a specified virtual machine.\n\nOnce deleted, reverse DNS lookups to the virtual machine's IP address will no longer return the previously configured hostname.\n\nUse this endpoint to remove reverse DNS configuration from VPS instances.",
    "method": "DELETE",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/ptr",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_setPanelPasswordV1",
    "description": "Set panel password for a specified virtual machine.\n\nIf virtual machine does not use panel OS, the request will still be processed without any effect.\nRequirements for password are same as in the [recreate virtual machine endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).\n\nUse this endpoint to configure control panel access credentials for VPS instances.",
    "method": "PUT",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/panel-password",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "password": {
          "type": "string",
          "description": "Panel password for the virtual machine"
        }
      },
      "required": [
        "virtualMachineId",
        "password"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_startRecoveryModeV1",
    "description": "Initiate recovery mode for a specified virtual machine.\n\nRecovery mode is a special state that allows users to perform system rescue operations, \nsuch as repairing file systems, recovering data, or troubleshooting issues that prevent the virtual machine \nfrom booting normally. \n\nVirtual machine will boot recovery disk image and original disk image will be mounted in `/mnt` directory.\n\nUse this endpoint to enable system rescue operations on VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/recovery",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "root_password": {
          "type": "string",
          "description": "Temporary root password for recovery mode"
        }
      },
      "required": [
        "virtualMachineId",
        "root_password"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_stopRecoveryModeV1",
    "description": "Stop recovery mode for a specified virtual machine.\n\nIf virtual machine is not in recovery mode, this operation will fail.\n\nUse this endpoint to exit system rescue mode and return VPS to normal operation.",
    "method": "DELETE",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/recovery",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_recreateVirtualMachineV1",
    "description": "Recreate a virtual machine from scratch.\n\nThe recreation process involves reinstalling the operating system and resetting the virtual machine to its initial state.\nSnapshots, if there are any, will be deleted.\n\n## Password Requirements\nPassword will be checked against leaked password databases. \nRequirements for the password are:\n- At least 8 characters long\n- At least one uppercase letter\n- At least one lowercase letter\n- At least one number\n- Is not leaked publicly\n\n**This operation is irreversible and will result in the loss of all data stored on the virtual machine!**\n\nUse this endpoint to completely rebuild VPS instances with fresh OS installation.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/recreate",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "template_id": {
          "type": "integer",
          "description": "Template ID"
        },
        "password": {
          "type": "string",
          "description": "Password for the virtual machine. If not provided, random password will be generated. Password will not be shown in the response."
        },
        "post_install_script_id": {
          "type": "integer",
          "description": "Post-install script ID"
        }
      },
      "required": [
        "virtualMachineId",
        "template_id"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_restartVirtualMachineV1",
    "description": "Restart a specified virtual machine by fully stopping and starting it.\n\nIf the virtual machine was stopped, it will be started.\n\nUse this endpoint to reboot VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/restart",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_setRootPasswordV1",
    "description": "Set root password for a specified virtual machine.\n\nRequirements for password are same as in the [recreate virtual machine endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).\n\nUse this endpoint to update administrator credentials for VPS instances.",
    "method": "PUT",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/root-password",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "password": {
          "type": "string",
          "description": "Root password for the virtual machine"
        }
      },
      "required": [
        "virtualMachineId",
        "password"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_setupPurchasedVirtualMachineV1",
    "description": "Setup newly purchased virtual machine with `initial` state.\n\nUse this endpoint to configure and initialize purchased VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/setup",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "template_id": {
          "type": "integer",
          "description": "Template ID"
        },
        "data_center_id": {
          "type": "integer",
          "description": "Data center ID"
        },
        "post_install_script_id": {
          "type": "integer",
          "description": "Post-install script ID"
        },
        "password": {
          "type": "string",
          "description": "Password for the virtual machine. If not provided, random password will be generated. Password will not be shown in the response."
        },
        "hostname": {
          "type": "string",
          "description": "Override default hostname of the virtual machine"
        },
        "install_monarx": {
          "type": "boolean",
          "description": "Install Monarx malware scanner (if supported)"
        },
        "enable_backups": {
          "type": "boolean",
          "description": "Enable weekly backup schedule"
        },
        "ns1": {
          "type": "string",
          "description": "Name server 1"
        },
        "ns2": {
          "type": "string",
          "description": "Name server 2"
        },
        "public_key": {
          "type": "object",
          "description": "Use SSH key",
          "properties": {
            "name": {
              "type": "string",
              "description": "Name of the SSH key"
            },
            "key": {
              "type": "string",
              "description": "Contents of the SSH key"
            }
          }
        }
      },
      "required": [
        "virtualMachineId",
        "data_center_id",
        "template_id"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_getSnapshotV1",
    "description": "Retrieve snapshot for a specified virtual machine.\n\nUse this endpoint to view current VPS snapshot information.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_createSnapshotV1",
    "description": "Create a snapshot of a specified virtual machine.\n\nA snapshot captures the state and data of the virtual machine at a specific point in time, \nallowing users to restore the virtual machine to that state if needed. \nThis operation is useful for backup purposes, system recovery, \nand testing changes without affecting the current state of the virtual machine.\n\n**Creating new snapshot will overwrite the existing snapshot!**\n\nUse this endpoint to capture VPS state for backup and recovery purposes.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_deleteSnapshotV1",
    "description": "Delete a snapshot of a specified virtual machine.\n\nUse this endpoint to remove VPS snapshots.",
    "method": "DELETE",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_restoreSnapshotV1",
    "description": "Restore a specified virtual machine to a previous state using a snapshot.\n\nRestoring from a snapshot allows users to revert the virtual machine to that state, which is useful for system recovery, undoing changes, or testing.\n\nUse this endpoint to revert VPS instances to previous saved states.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot/restore",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_startVirtualMachineV1",
    "description": "Start a specified virtual machine.\n\nIf the virtual machine is already running, the request will still be processed without any effect.\n\nUse this endpoint to power on stopped VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/start",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  },
  {
    "name": "VPS_stopVirtualMachineV1",
    "description": "Stop a specified virtual machine.\n\nIf the virtual machine is already stopped, the request will still be processed without any effect.\n\nUse this endpoint to power off running VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/stop",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ]
  }
];
const SECURITY_SCHEMES = {
  "apiToken": {
    "type": "http",
    "description": "API Token authentication",
    "scheme": "bearer"
  }
};

/**
 * MCP Server for Hostinger API
 * Generated from OpenAPI spec version 0.0.94
 */
class MCPServer {
  constructor() {
    // Initialize class properties
    this.server = null;
    this.tools = new Map();
    this.debug = process.env.DEBUG === "true";
    this.baseUrl = process.env.API_BASE_URL || "https://developers.hostinger.com";
    this.headers = this.parseHeaders(process.env.API_HEADERS || "");

    // Initialize tools map - do this before creating server
    this.initializeTools();

    // Create MCP server with correct capabilities
    this.server = new Server(
      {
        name: "hostinger-api-mcp",
        version: "0.1.4",
      },
      {
        capabilities: {
          tools: {}, // Enable tools capability
        },
      }
    );

    // Set up request handlers - don't log here
    this.setupHandlers();
  }

  /**
   * Parse headers from string
   */
  parseHeaders(headerStr) {
    const headers = {};
    if (headerStr) {
      headerStr.split(",").forEach((header) => {
        const [key, value] = header.split(":");
        if (key && value) headers[key.trim()] = value.trim();
      });
    }
    
    headers['User-Agent'] = 'hostinger-mcp-server/0.1.4';
    
    return headers;
  }

  /**
   * Initialize tools map from OpenAPI spec
   * This runs before the server is connected, so don't log here
   */
  initializeTools() {
    // Initialize each tool in the tools map
    for (const tool of TOOLS) {
      this.tools.set(tool.name, {
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        // Don't include security at the tool level
      });
    }

    // Don't log here, we're not connected yet
    console.error(`Initialized ${this.tools.size} tools`);
  }

  /**
   * Set up request handlers
   */
  setupHandlers() {
    // Handle tool listing requests
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      this.log('debug', "Handling ListTools request");
      // Return tools in the format expected by MCP SDK
      return {
        tools: Array.from(this.tools.entries()).map(([id, tool]) => ({
          id,
          ...tool,
        })),
      };
    });

    // Handle tool execution requests
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { id, name, arguments: params } = request.params;
      this.log('debug', "Handling CallTool request", { id, name, params });

      let toolName;
      let toolDetails;

      // Find the requested tool
      for (const [tid, tool] of this.tools.entries()) {
        if (tool.name === name) {
          toolName = name;
          break;
        }
      }

      if (!toolName) {
        throw new Error(`Tool not found: ${name}`);
      }

      toolDetails = TOOLS.find(t => t.name === toolName);
      if (!toolDetails) {
        throw new Error(`Tool details not found for ID: ${toolName}`);
      }
        
      try {
        this.log('info', `Executing tool: ${toolName}`);

        // Execute the API call
        const result = await this.executeApiCall(toolDetails, params || {});

        // Return the result in the correct MCP format
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result)
            }
          ]
        };

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const response = error.response; 
        this.log('error', `Error executing tool ${name}: ${errorMessage}`);

        throw error;
      }
    });
  }

  /**
   * Execute an API call for a tool
   */
  async executeApiCall(tool, params) {
    // Get method and path from tool
    const method = tool.method;
    let path = tool.path;

    // Clone params to avoid modifying the original
    const requestParams = { ...params };

    // Replace path parameters with values from params
    Object.entries(requestParams).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      if (path.includes(placeholder)) {
        path = path.replace(placeholder, encodeURIComponent(String(value)));
        delete requestParams[key]; // Remove used parameter
      }
    });

    // Build the full URL
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const url = new URL(cleanPath, baseUrl).toString();

    this.log('debug', `API Request: ${method} ${url}`);

    try {
      // Configure the request
      const config = {
        method: method.toLowerCase(),
        url,
        headers: { ...this.headers },
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        }
      };
    
      const bearerToken = process.env['API_TOKEN'] || process.env['APITOKEN']; // APITOKEN for backwards compatibility
      if (bearerToken) {
        config.headers['Authorization'] = `Bearer ${bearerToken}`;
      } else {
        this.log('error', `Bearer Token environment variable not found: API_TOKEN`);
      }

      // Add parameters based on request method
      if (["GET", "DELETE"].includes(method)) {
        // For GET/DELETE, send params as query string
        config.params = { ...(config.params || {}), ...requestParams };
      } else {
        // For POST/PUT/PATCH, send params as JSON body
        config.data = requestParams;
        config.headers["Content-Type"] = "application/json";
      }

      this.log('debug', "Request config:", {
        url: config.url,
        method: config.method,
        params: config.params,
        headers: Object.keys(config.headers)
      });

      // Execute the request
      const response = await axios(config);
      this.log('debug', `Response status: ${response.status}`);

      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `API request failed: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;

        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });

        // Rethrow with more context for better error handling
        const detailedError = new Error(`API request failed with status ${responseStatus}: ${errorMessage}`);
        detailedError.response = error.response;
        throw detailedError;
      }

      throw error;
    }
  }

  /**
   * Log messages with appropriate level
   * Only sends to MCP if we're connected
   */
  log(level, message, data) {
    // Always log to stderr for visibility
    console.error(`[${level.toUpperCase()}] ${message}${data ? ': ' + JSON.stringify(data) : ''}`);

    // Only try to send via MCP if we're in debug mode or it's important
    if (this.debug || level !== 'debug') {
      try {
        // Only send if server exists and is connected
        if (this.server && this.server.isConnected) {
          this.server.sendLoggingMessage({
            level,
            data: `[MCP Server] ${message}${data ? ': ' + JSON.stringify(data) : ''}`
          });
        }
      } catch (e) {
        // If logging fails, log to stderr
        console.error('Failed to send log via MCP:', e.message);
      }
    }
  }

  /**
   * Create and configure Express app with shared middleware
   */
  createApp() {
    const app = express();
    app.use(express.json());
    app.use(cors());
    return app;
  }

  /**
   * Start the server with HTTP streaming transport
   */
  async startHttp(host, port) {
    try {
      const app = this.createApp();

      // Create HTTP transport with session management
      const httpTransport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => {
          // Generate a simple session ID
          return `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        },
      });

      // Set up CORS for all routes
      app.options("*", (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-session-id");
        res.sendStatus(200);
      });

      // Health check endpoint
      app.get("/health", (req, res) => {
        res.status(200).json({ status: "ok", transport: "http" });
      });

      // Set up the HTTP transport endpoint
      app.post("/", async (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-session-id");
        await httpTransport.handleRequest(req, res, req.body);
      });

      // Start the server
      const server = app.listen(port, host, () => {
        this.log('info', `MCP Server with HTTP streaming transport started successfully with ${this.tools.size} tools`);
        this.log('info', `Listening on http://${host}:${port}`);
      });

      // Connect the MCP server to the transport
      await this.server.connect(httpTransport);

    } catch (error) {
      console.error("Failed to start MCP server:", error);
      process.exit(1);
    }
  }

  /**
   * Start the server
   */
  async startStdio() {
    try {
      // Create stdio transport
      const transport = new StdioServerTransport();
      console.error("MCP Server starting on stdio transport");

      // Connect to the transport
      await this.server.connect(transport);

      // Now we can safely log via MCP
      console.error(`Registered ${this.tools.size} tools`);
      this.log('info', `MCP Server with stdio transport started successfully with ${this.tools.size} tools`);
    } catch (error) {
      console.error("Failed to start MCP server:", error);
      process.exit(1);
    }
  }
}

// Start the server
async function main() {
  try {
    const argv = minimist(process.argv.slice(2), { 
        string: ['host'], 
        int: ['port'], 
        boolean: ['stdio', 'http', 'help'],
        default: {
            host: '127.0.0.1',
            port: 8100,
            stdio: true,
        }
    });
        
    // Show help if requested
    if (argv.help) {
      console.log(`
        Hostinger API MCP Server
        Usage: hostinger-api-mcp [options]
        Options:
          --http           Use HTTP streaming transport
          --stdio          Use standard input/output transport (default)
          --host <host>    Host to bind to (default: 127.0.0.1)
          --port <port>    Port to bind to (default: 8100)
          --help           Show this help message
        Environment Variables:
          API_TOKEN        Your Hostinger API token (required)
          DEBUG            Enable debug logging (true/false)
        `);
      process.exit(0);
    }
    
    const server = new MCPServer();
    if (argv.http) {
        await server.startHttp(argv.host, argv.port);
    } else {
        await server.startStdio();
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
