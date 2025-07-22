#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import minimist from 'minimist';
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
    "description": "This endpoint retrieves a list of catalog items available for order. \n\nPrices in catalog items is displayed as cents (without floating point), e.g: float `17.99` is displayed as integer `1799`.",
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
    "name": "billing_createNewServiceOrderV1",
    "description": "This endpoint creates a new service order. \n\n**DEPRECATED**\n\nTo purchase a domain, use [`POST /api/domains/v1/portfolio`](/#tag/domains-portfolio/POST/api/domains/v1/portfolio) instead.\n\nTo purchase a VPS, use [`POST /api/vps/v1/virtual-machines`](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines) instead.\n\n\nTo place order, you need to provide payment method ID and list of price items from the catalog endpoint together with quantity.\nCoupons also can be provided during order creation.\n\nOrders created using this endpoint will be set for automatic renewal.\n\nSome `credit_card` payments might need additional verification, rendering purchase unprocessed.\nWe recommend use other payment methods than `credit_card` if you encounter this issue.",
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
    "description": "This endpoint sets default payment method for your account.",
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
    "description": "This endpoint deletes a payment method from your account.",
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
    "description": "This endpoint retrieves a list of available payment methods that can be used for placing new orders.\n\nIf you want to add new payment method, please use [hPanel](https://hpanel.hostinger.com/billing/payment-methods).",
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
    "description": "This endpoint cancels a subscription and stops any further billing.",
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
    "description": "This endpoint retrieves a list of all subscriptions associated with your account.",
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
    "name": "DNS_getSnapshotV1",
    "description": "This endpoint retrieves particular DNS snapshot with the contents of DNS zone records.",
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
    "name": "DNS_getSnapshotListV1",
    "description": "This endpoint retrieves list of DNS snapshots.",
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
    "name": "DNS_restoreSnapshotV1",
    "description": "This endpoint restores DNS zone to the selected snapshot.",
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
    "name": "DNS_getRecordsV1",
    "description": "This endpoint retrieves DNS zone records for a specific domain.",
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
    "name": "DNS_updateZoneRecordsV1",
    "description": "This endpoint updates DNS records for the selected domain. \n\nUsing `overwrite = true` will replace existing records with the provided ones. \nOtherwise existing records will be updated and new records will be added.",
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
    "name": "DNS_deleteZoneRecordsV1",
    "description": "This endpoint deletes DNS records for the selected domain. \nTo filter which records to delete, add the `name` of the record and `type` to the filter. \nMultiple filters can be provided with single request.\n\nIf you have multiple records with the same name and type, and you want to delete only part of them,\nrefer to the `Update zone records` endpoint.",
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
    "name": "DNS_resetZoneRecordsV1",
    "description": "This endpoint resets DNS zone to the default records.",
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
    "name": "DNS_validateZoneRecordsV1",
    "description": "This endpoint used to validate DNS records prior update for the selected domain. \n\nIf the validation is successful, the response will contain `200 Success` code.\nIf there is validation error, the response will fail with `422 Validation error` code.",
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
    "description": "This endpoint checks the availability of a domain name. Multiple TLDs can be checked at once.\nIf you want to get alternative domains with response, provide only one TLD in the request and set `with_alternatives` to `true`.\nTLDs should be provided without the leading dot (e.g. `com`, `net`, `org`).\n\nEndpoint has rate limit of 10 requests per minute.",
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
    "name": "domains_getForwardingDataV1",
    "description": "This endpoint retrieves domain forwarding data.",
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
    "name": "domains_deleteForwardingDataV1",
    "description": "This endpoint deletes domain forwarding data.",
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
    "name": "domains_createForwardingDataV1",
    "description": "This endpoint creates domain forwarding data.",
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
    "description": "This endpoint enables domain lock for the domain. When domain lock is enabled, \nthe domain cannot be transferred to another registrar without first disabling the lock.",
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
    "description": "This endpoint disables domain lock for the domain. Domain lock needs to be disabled \nbefore transferring the domain to another registrar.",
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
    "name": "domains_getDomainV1",
    "description": "This endpoint retrieves details for specified domain.",
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
    "description": "This endpoint retrieves a list of all domains associated with your account.",
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
    "description": "This endpoint allows you to buy (purchase) and register a new domain name. \n\nIf registration fails, login to [hPanel](https://hpanel.hostinger.com/) and check the domain registration status.\n\nIf no payment method is provided, your default payment method will be used automatically.\n\nIf no WHOIS information is provided, the default contact information for that TLD (Top-Level Domain) will be used. \nBefore making a request, ensure that WHOIS information for the desired TLD exists in your account.\n\nSome TLDs require `additional_details` to be provided and these will be validated before completing the purchase. The required additional details vary by TLD.",
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
    "description": "This endpoint enables privacy protection for the domain.\nWhen privacy protection is enabled, the domain owner's personal information is hidden from the public WHOIS database.",
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
    "description": "This endpoint disables privacy protection for the domain.\nWhen privacy protection is disabled, the domain owner's personal information is visible in the public WHOIS database.",
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
    "name": "domains_updateNameserversV1",
    "description": "This endpoint sets the nameservers for a specified domain.\n\nBe aware, that improper nameserver configuration can lead to the domain being unresolvable or unavailable. ",
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
    "description": "This endpoint retrieves a WHOIS contact profile.",
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
    "description": "This endpoint deletes WHOIS contact profile.",
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
    "description": "This endpoint retrieves a list of WHOIS contact profiles.",
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
    "description": "This endpoint creates WHOIS contact profile.",
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
    "description": "This endpoint retrieves a domain list where provided WHOIS contact profile is used.",
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
    "name": "VPS_getDataCentersListV1",
    "description": "This endpoint retrieves a list of all data centers available.",
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
    "name": "VPS_activateFirewallV1",
    "description": "This endpoint activates a firewall for a specified virtual machine. \n\nOnly one firewall can be active for a virtual machine at a time.",
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
    "description": "This endpoint deactivates a firewall for a specified virtual machine.",
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
    "name": "VPS_getFirewallV1",
    "description": "This endpoint retrieves firewall by its ID and rules associated with it.",
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
    "description": "This endpoint deletes a specified firewall. \n\nAny virtual machine that has this firewall activated will automatically have it deactivated.",
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
    "description": "This endpoint retrieves a list of all firewalls available.",
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
    "description": "This endpoint creates a new firewall.",
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
    "description": "This endpoint updates a specific firewall rule from a specified firewall.\n\nAny virtual machine that has this firewall activated will loose sync with the firewall and will have to be synced again manually.",
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
    "description": "This endpoint deletes a specific firewall rule from a specified firewall.\n\nAny virtual machine that has this firewall activated will loose sync with the firewall and will have to be synced again manually.",
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
    "description": "This endpoint creates new firewall rule from a specified firewall. \nBy default, the firewall drops all incoming traffic, which means you must add accept rules for all ports you want to use.\n\nAny virtual machine that has this firewall activated will loose sync with the firewall and will have to be synced again manually.",
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
    "description": "This endpoint syncs a firewall for a specified virtual machine.\n\nFirewall can loose sync with virtual machine if the firewall has new rules added, removed or updated.",
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
    "description": "This endpoint retrieves post-install script by its ID.",
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
    "description": "This endpoint updates a specific post-install script.",
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
    "name": "VPS_deleteAPostInstallScriptV1",
    "description": "This endpoint deletes a post-install script from your account. ",
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
    "name": "VPS_getPostInstallScriptListV1",
    "description": "This endpoint retrieves a list of post-install scripts associated with your account.",
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
    "description": "This endpoint allows you to add a new post-install script to your account, \nwhich can then be used run after the installation of a virtual machine instance.\n\nThe script contents will be saved to the file `/post_install` with executable attribute set and will be executed once virtual machine is installed.\nThe output of the script will be redirected to `/post_install.log`. Maximum script size is 48KB. ",
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
    "description": "This endpoint attaches an existing public keys from your account to a specified virtual machine.\n\nMultiple keys can be attached to a single virtual machine.",
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
    "name": "VPS_deleteAPublicKeyV1",
    "description": "This endpoint deletes a public key from your account. \n\n**Deleting public key from account does not remove it from virtual machine** ",
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
    "name": "VPS_getPublicKeyListV1",
    "description": "This endpoint retrieves a list of public keys associated with your account.",
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
    "name": "VPS_createNewPublicKeyV1",
    "description": "This endpoint allows you to add a new public key to your account, \nwhich can then be attached to virtual machine instances for secure access.",
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
    "name": "VPS_getTemplateV1",
    "description": "This endpoint retrieves details of a specific OS template for virtual machines.",
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
    "name": "VPS_getTemplateListV1",
    "description": "This endpoint retrieves a list of available OS templates for virtual machines.",
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
    "name": "VPS_getActionV1",
    "description": "This endpoint retrieves details of a specific action performed on a specified virtual machine. \n\nThis endpoint allows you to view detailed information about a particular action, including the action name, timestamp, and status.",
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
    "name": "VPS_getActionListV1",
    "description": "This endpoint retrieves a list of actions performed on a specified virtual machine.\n\nActions are operations or events that have been executed on the virtual machine, such as starting, stopping, or modifying \nthe machine. This endpoint allows you to view the history of these actions, providing details about each action, \nsuch as the action name, timestamp, and status.",
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
    "description": "This endpoint retrieves a list of public keys attached to a specified virtual machine.",
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
    "name": "VPS_deleteBackupV1",
    "description": "This endpoint deletes a specified backup for a virtual machine.",
    "method": "DELETE",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/backups/{backupId}",
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
    "name": "VPS_getBackupListV1",
    "description": "This endpoint retrieves a list of backups for a specified virtual machine.",
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
    "description": "This endpoint restores a backup for a specified virtual machine.\n\nThe system will then initiate the restore process, which may take some time depending on the size of the backup.\n\n**All data on the virtual machine will be overwritten with the data from the backup.**",
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
    "description": "This endpoint sets the hostname for a specified virtual machine. \nChanging hostname does not update PTR record automatically.\nIf you want your virtual machine to be reachable by a hostname, \nyou need to point your domain A/AAAA records to virtual machine IP as well.",
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
    "description": "This endpoint resets the hostname and PTR record of a specified virtual machine to the default value.",
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
    "name": "VPS_getVirtualMachineV1",
    "description": "This endpoint retrieves detailed information about a specified virtual machine.",
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
    "name": "VPS_getVirtualMachineListV1",
    "description": "This endpoint retrieves a list of all available virtual machines.",
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
    "description": "This endpoint allows you to buy (purchase) and setup a new virtual machine.\n\nIf virtual machine setup fails for any reason, login to [hPanel](https://hpanel.hostinger.com/) and complete the setup manually.\n\nIf no payment method is provided, your default payment method will be used automatically.                        ",
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
    "description": "This endpoint retrieves the scan metrics for the [Monarx](https://www.monarx.com/) malware scanner installed on a specified virtual machine.\nThe scan metrics provide detailed information about the malware scans performed by Monarx, including the number of scans, \ndetected threats, and other relevant statistics. This information is useful for monitoring the security status of the \nvirtual machine and assessing the effectiveness of the malware scanner.",
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
    "description": "This endpoint installs the Monarx malware scanner on a specified virtual machine. \n\n[Monarx](https://www.monarx.com/) is a security tool designed to detect and prevent malware infections on virtual machines. \nBy installing Monarx, users can enhance the security of their virtual machines, ensuring that they are protected against malicious software.",
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
    "description": "This endpoint uninstalls the Monarx malware scanner on a specified virtual machine.\nIf Monarx is not installed, the request will still be processed without any effect.",
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
    "description": "This endpoint retrieves the historical metrics for a specified virtual machine.\nIt includes the following metrics: \n- CPU usage\n- Memory usage\n- Disk usage\n- Network usage\n- Uptime",
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
    "description": "This endpoint sets the nameservers for a specified virtual machine.\nBe aware, that improper nameserver configuration can lead to the virtual machine being unable to resolve domain names.",
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
    "description": "This endpoint creates or updates a PTR (Pointer) record for a specified virtual machine.",
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
    "description": "This endpoint deletes a PTR (Pointer) record for a specified virtual machine. \n\nOnce deleted, reverse DNS lookups to the virtual machine's IP address will no longer return the previously configured hostname.",
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
    "description": "This endpoint sets the panel password for a specified virtual machine. \nIf virtual machine does not use panel OS, the request will still be processed without any effect.\nRequirements for the password is the same as in the [recreate virtual machine endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).",
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
    "description": "This endpoint initiates the recovery mode for a specified virtual machine. \nRecovery mode is a special state that allows users to perform system rescue operations, \nsuch as repairing file systems, recovering data, or troubleshooting issues that prevent the virtual machine \nfrom booting normally. \n\nVirtual machine will boot recovery disk image and original disk image will be mounted in `/mnt` directory.",
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
    "description": "This endpoint stops the recovery mode for a specified virtual machine. \nIf virtual machine is not in recovery mode, this operation will fail.",
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
    "description": "This endpoint will recreate a virtual machine from scratch. \nThe recreation process involves reinstalling the operating system and resetting the virtual machine to its initial state.\nSnapshots, if there are any, will be deleted.\n\n## Password Requirements\nPassword will be checked against leaked password databases. \nRequirements for the password are:\n- At least 8 characters long\n- At least one uppercase letter\n- At least one lowercase letter\n- At least one number\n- Is not leaked publicly\n\n**This operation is irreversible and will result in the loss of all data stored on the virtual machine!**",
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
    "description": "This endpoint restarts a specified virtual machine. This is equivalent to fully stopping and starting the virtual machine.\nIf the virtual machine was stopped, it will be started.",
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
    "description": "This endpoint sets the root password for a specified virtual machine. \nRequirements for the password is the same as in the [recreate virtual machine endpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).",
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
    "name": "VPS_setupNewVirtualMachineV1",
    "description": "This endpoint will setup newly purchased virtual machine with `initial` state. ",
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
    "description": "This endpoint retrieves a snapshot for a specified virtual machine.",
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
    "description": "This endpoint creates a snapshot of a specified virtual machine. \nA snapshot captures the state and data of the virtual machine at a specific point in time, \nallowing users to restore the virtual machine to that state if needed. \nThis operation is useful for backup purposes, system recovery, \nand testing changes without affecting the current state of the virtual machine.\n\n**Creating new snapshot will overwrite the existing snapshot!**",
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
    "description": "This endpoint deletes a snapshot of a specified virtual machine.",
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
    "description": "This endpoint restores a specified virtual machine to a previous state using a snapshot. \nRestoring from a snapshot allows users to revert the virtual machine to that state, which is useful for system recovery, undoing changes, or testing.",
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
    "description": "This endpoint starts a specified virtual machine. \nIf the virtual machine is already running, the request will still be processed without any effect.",
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
    "description": "This endpoint stops a specified virtual machine. \nIf the virtual machine is already stopped, the request will still be processed without any effect.",
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
 * Generated from OpenAPI spec version 0.0.81
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
        version: "0.0.27",
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
    
    headers['User-Agent'] = 'hostinger-mcp-server/0.0.27';
    
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

      // Apply security headers based on tool security requirements
      if (tool.security && Array.isArray(tool.security)) {
        for (const requirement of tool.security) {
          for (const securitySchemeName of Object.keys(requirement)) {
            const securityDefinition = SECURITY_SCHEMES[securitySchemeName];

            if (securityDefinition) {
              const authType = securityDefinition.type;

              // Handle API key
              if (authType === 'apiKey') {
                const apiKeyName = securityDefinition.name;
                const envVarName = `${securitySchemeName.toUpperCase()}_${apiKeyName.toUpperCase()}`;
                const apiKeyValue = process.env[envVarName];

                if (apiKeyValue) {
                  if (securityDefinition.in === 'header') {
                    config.headers[apiKeyName] = apiKeyValue;
                  } else if (securityDefinition.in === 'query') {
                    config.params = config.params || {};
                    config.params[apiKeyName] = apiKeyValue;
                  }
                } else {
                  this.log('warning', `API Key environment variable not found: ${envVarName}`);
                }
              }
              // Handle bearer token
              else if (authType === 'http' && securityDefinition.scheme === 'bearer') {
                const envVarName = `${securitySchemeName.toUpperCase()}`;
                const bearerToken = process.env[envVarName];

                if (bearerToken) {
                  config.headers['Authorization'] = `Bearer ${bearerToken}`;
                } else {
                  this.log('warning', `Bearer Token environment variable not found: ${envVarName}`);
                }
              }
              // Handle basic auth
              else if (authType === 'http' && securityDefinition.scheme === 'basic') {
                const username = process.env[`${securitySchemeName.toUpperCase()}_USERNAME`];
                const password = process.env[`${securitySchemeName.toUpperCase()}_PASSWORD`];

                if (username && password) {
                  const auth = Buffer.from(`${username}:${password}`).toString('base64');
                  config.headers['Authorization'] = `Basic ${auth}`;
                } else {
                  this.log('warning', `Basic auth credentials not found for ${securitySchemeName}`);
                }
              }
            }
          }
        }
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
   * Start the sse server
   */
  async startSse(host, port) {
    try {
      // Create sse transport
      const app = express();
      app.use(express.json());

      let transport = null;
      const sessions = {};

      app.get('/sse', (req, res) => {
        transport = new SSEServerTransport('/messages', res);
        sessions[transport.sessionId] = transport;
        
        res.on('close', () => {
           delete sessions[transport.sessionId];
        });
        
        this.server.connect(transport);
      });

      app.post('/messages', (req, res) => {
        const sessionId = req.query.sessionId;
        const transport = sessions[sessionId];
        if (transport) {
          transport.handlePostMessage(req, res);
        } else {
          res.status(400).send('No transport found for sessionId');
        }
      });

      app.listen(port, host);
      this.log('info', `MCP Server with SSE transport started successfully with ${this.tools.size} tools`);
      this.log('info', `Listening on ${host}:${port}`);
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
        boolean: ['sse'],
        default: {
            host: '127.0.0.1',
            port: 8100,
        }
    });
    
    const server = new MCPServer();
    if (argv.sse) {
        await server.startSse(argv.host, argv.port);
    } else {
        await server.startStdio();
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
