// Auto-generated tool list for group: domains
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export interface OpenApiTool extends Tool {
  method: string;
  path: string;
  security: unknown[];
  custom?: boolean;
  group?: string;
}

const tools: OpenApiTool[] = [
  {
    "name": "v2_getDomainVerificationsDIRECT",
    "description": "Retrieve a list of pending and completed domain verifications.",
    "method": "GET",
    "path": "/api/v2/direct/verifications/active",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "domains"
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
    ],
    "group": "domains"
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
    ],
    "group": "domains"
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
    ],
    "group": "domains"
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
    ],
    "group": "domains"
  },
  {
    "name": "domains_enableDomainLockV1",
    "description": "Enable domain lock for the domain.\n\nWhen domain lock is enabled,\nthe domain cannot be transferred to another registrar without first disabling the lock.\n\nUse this endpoint to secure domains against unauthorized transfers.",
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
    ],
    "group": "domains"
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
    ],
    "group": "domains"
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
    ],
    "group": "domains"
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
    ],
    "group": "domains"
  },
  {
    "name": "domains_purchaseNewDomainV1",
    "description": "Purchase and register a new domain name.\n\nIf registration fails, login to [hPanel](https://hpanel.hostinger.com/) and check domain registration status.\n\nIf no payment method is provided, your default payment method will be used automatically.\n\nIf no WHOIS information is provided, default contact information for that TLD will be used.\nBefore making request, ensure WHOIS information for desired TLD exists in your account.\n\nSome TLDs require `additional_details` to be provided and these will be validated before completing purchase.\n\nUse this endpoint to register new domains for users.",
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
    ],
    "group": "domains"
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
    ],
    "group": "domains"
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
    ],
    "group": "domains"
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
    ],
    "group": "domains"
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
    ],
    "group": "domains"
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
    ],
    "group": "domains"
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
    ],
    "group": "domains"
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
    ],
    "group": "domains"
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
    ],
    "group": "domains"
  }
];
export default tools;
