// Auto-generated tool list for group: all
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
    "name": "hosting_importWordpressWebsite",
    "topic": "hosting",
    "description": "Import a WordPress website from an archive file to a hosting server. This tool uploads a website archive (zip, tar, tar.gz, etc.) and a database dump (.sql file) to deploy a complete WordPress website. The archive will be extracted on the server automatically. Note: This process may take a while for larger sites. After upload completion, files are being extracted and the site will be available in a few minutes. The username will be automatically resolved from the domain.",
    "method": "",
    "path": "",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name associated with the hosting account (e.g., example.com)"
        },
        "archivePath": {
          "type": "string",
          "description": "Absolute or relative path to the website archive file. Supported formats: zip, tar, tar.gz, tgz, 7z, gz, gzip. If user provides directory path, create archive from it before proceeding using EXACTLY this naming pattern: directoryname_YYYYMMDD_HHMMSS.zip (e.g., mywebsite_20250115_143022.zip)"
        },
        "databaseDump": {
          "type": "string",
          "description": "Absolute or relative path to a database dump file (.sql)"
        }
      },
      "required": [
        "domain",
        "archivePath",
        "databaseDump"
      ]
    },
    "security": [],
    "custom": true,
    "templateFile": "import-wordpress.template.js",
    "templateFileTS": "import-wordpress.template.ts",
    "handlerMethod": "handleWordpressWebsiteImport",
    "group": "hosting"
  },
  {
    "name": "hosting_deployWordpressPlugin",
    "topic": "hosting",
    "description": "Deploy a WordPress plugin from a directory to a hosting server. This tool uploads all plugin files and triggers plugin deployment.",
    "method": "",
    "path": "",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name associated with the hosting account (e.g., example.com)"
        },
        "slug": {
          "type": "string",
          "description": "WordPress plugin slug (e.g., omnisend)"
        },
        "pluginPath": {
          "type": "string",
          "description": "Absolute or relative path to the plugin directory containing all plugin files"
        }
      },
      "required": [
        "domain",
        "slug",
        "pluginPath"
      ]
    },
    "security": [],
    "custom": true,
    "templateFile": "deploy-wordpress-plugin.template.js",
    "templateFileTS": "deploy-wordpress-plugin.template.ts",
    "handlerMethod": "handleWordpressPluginDeploy",
    "group": "hosting"
  },
  {
    "name": "hosting_deployWordpressTheme",
    "topic": "hosting",
    "description": "Deploy a WordPress theme from a directory to a hosting server. This tool uploads all theme files and triggers theme deployment. The uploaded theme can optionally be activated after deployment.",
    "method": "",
    "path": "",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name associated with the hosting account (e.g., example.com)"
        },
        "slug": {
          "type": "string",
          "description": "WordPress theme slug (e.g., twentytwentyfive)"
        },
        "themePath": {
          "type": "string",
          "description": "Absolute or relative path to the theme directory containing all theme files"
        },
        "activate": {
          "type": "boolean",
          "description": "Whether to activate the theme after deployment (default: false)"
        }
      },
      "required": [
        "domain",
        "slug",
        "themePath"
      ]
    },
    "security": [],
    "custom": true,
    "templateFile": "deploy-wordpress-theme.template.js",
    "templateFileTS": "deploy-wordpress-theme.template.ts",
    "handlerMethod": "handleWordpressThemeDeploy",
    "group": "hosting"
  },
  {
    "name": "hosting_deployJsApplication",
    "topic": "hosting",
    "description": "Deploy a JavaScript application from an archive file to a hosting server. IMPORTANT: the archive must ONLY contain application source files, not the build output, skip node_modules directory; also exclude all files matched by .gitignore if the ignore file exists. The build process will be triggered automatically on the server after the archive is uploaded. After deployment, use the hosting_listJsDeployments tool to check deployment status and track build progress.",
    "method": "",
    "path": "",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name associated with the hosting account (e.g., example.com)"
        },
        "archivePath": {
          "type": "string",
          "description": "Absolute or relative path to the application archive file. Supported formats: zip, tar, tar.gz, tgz, 7z, gz, gzip. If user provides directory path, create archive from it before proceeding. IMPORTANT: the archive must ONLY contain application source files, not the build output, skip node_modules directory."
        },
        "removeArchive": {
          "type": "boolean",
          "description": "Whether to remove the archive file after successful deployment (default: false)"
        }
      },
      "required": [
        "domain",
        "archivePath"
      ]
    },
    "security": [],
    "custom": true,
    "templateFile": "deploy-javascript-app.template.js",
    "templateFileTS": "deploy-javascript-app.template.ts",
    "handlerMethod": "handleJavascriptApplicationDeploy",
    "group": "hosting"
  },
  {
    "name": "hosting_deployStaticWebsite",
    "topic": "hosting",
    "description": "Deploy a static website from an archive file to a hosting server. IMPORTANT: This tool only works for static websites with no build process. The archive must contain pre-built static files (HTML, CSS, JavaScript, images, etc.) ready to be served. If the website has a package.json file or requires a build command, use hosting_deployJsApplication instead. The archive will be extracted and deployed directly without any build steps. The username will be automatically resolved from the domain.",
    "method": "",
    "path": "",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name associated with the hosting account (e.g., example.com)"
        },
        "archivePath": {
          "type": "string",
          "description": "Absolute or relative path to the static website archive file. Supported formats: zip, tar, tar.gz, tgz, 7z, gz, gzip. If user provides directory path, create archive from it before proceeding using EXACTLY this naming pattern: directoryname_YYYYMMDD_HHMMSS.zip (e.g., mystaticwebsite_20250115_143022.zip)"
        },
        "removeArchive": {
          "type": "boolean",
          "description": "Whether to remove the archive file after successful deployment (default: false)"
        }
      },
      "required": [
        "domain",
        "archivePath"
      ]
    },
    "security": [],
    "custom": true,
    "templateFile": "deploy-static-website.template.js",
    "templateFileTS": "deploy-static-website.template.ts",
    "handlerMethod": "handleStaticWebsiteDeploy",
    "group": "hosting"
  },
  {
    "name": "hosting_listJsDeployments",
    "topic": "hosting",
    "description": "List javascript application deployments for checking their status. Use this tool when customer asks for the status of the deployment. This tool retrieves a paginated list of Node.js application deployments for a domain with optional filtering by deployment states.",
    "method": "",
    "path": "",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name associated with the hosting account (e.g., example.com)"
        },
        "page": {
          "type": "integer",
          "description": "Page number for pagination (optional)"
        },
        "perPage": {
          "type": "integer",
          "description": "Number of items per page (optional)"
        },
        "states": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "pending",
              "completed",
              "running",
              "failed"
            ]
          },
          "description": "Filter by deployment states (optional). Valid values: pending, completed, running, failed"
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [],
    "custom": true,
    "templateFile": "list-javascript-deployments.template.js",
    "templateFileTS": "list-javascript-deployments.template.ts",
    "handlerMethod": "handleListJavascriptDeployments",
    "group": "hosting"
  },
  {
    "name": "hosting_showJsDeploymentLogs",
    "topic": "hosting",
    "description": "Retrieve logs for a specified JavaScript application deployment for debugging purposes in case of failure.",
    "method": "",
    "path": "",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name associated with the hosting account (e.g., example.com)"
        },
        "fromLine": {
          "type": "integer",
          "description": "Line from which to retrieve logs (optional, default 0)"
        },
        "buildUuid": {
          "type": "string",
          "description": "UUID of the JavaScript deployment build"
        }
      },
      "required": [
        "domain",
        "buildUuid"
      ]
    },
    "security": [],
    "custom": true,
    "templateFile": "show-javascript-deployment-logs.template.js",
    "templateFileTS": "show-javascript-deployment-logs.template.ts",
    "handlerMethod": "handleShowJsDeploymentLogs",
    "group": "hosting"
  },
  {
    "name": "billing_getCatalogItemListV1",
    "description": "Retrieve catalog items available for order.\n\nPrices in catalog items is displayed as cents (without floating point),\ne.g: float `17.99` is displayed as integer `1799`.\n\nUse this endpoint to view available services and pricing before placing orders.",
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
    ],
    "group": "billing"
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
    ],
    "group": "billing"
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
    ],
    "group": "billing"
  },
  {
    "name": "billing_getPaymentMethodListV1",
    "description": "Retrieve available payment methods that can be used for placing new orders.\n\nIf you want to add new payment method,\nplease use [hPanel](https://hpanel.hostinger.com/billing/payment-methods).\n\nUse this endpoint to view available payment options before creating orders.",
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
    ],
    "group": "billing"
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
    ],
    "group": "billing"
  },
  {
    "name": "billing_disableAutoRenewalV1",
    "description": "Disable auto-renewal for a subscription.\n\nUse this endpoint when disable auto-renewal for a subscription.",
    "method": "DELETE",
    "path": "/api/billing/v1/subscriptions/{subscriptionId}/auto-renewal/disable",
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
    ],
    "group": "billing"
  },
  {
    "name": "billing_enableAutoRenewalV1",
    "description": "Enable auto-renewal for a subscription.\n\nUse this endpoint when enable auto-renewal for a subscription.",
    "method": "PATCH",
    "path": "/api/billing/v1/subscriptions/{subscriptionId}/auto-renewal/enable",
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
    ],
    "group": "billing"
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
    ],
    "group": "dns"
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
    ],
    "group": "dns"
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
    ],
    "group": "dns"
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
    ],
    "group": "dns"
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
          "description": "If `true`, resource records (RRs) matching name and type will be deleted and new RRs will be created,\notherwise resource records' ttl's are updated and new records are appended.\nIf no matching RRs are found, they are created."
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
    ],
    "group": "dns"
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
    ],
    "group": "dns"
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
    ],
    "group": "dns"
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
          "description": "If `true`, resource records (RRs) matching name and type will be deleted and new RRs will be created,\notherwise resource records' ttl's are updated and new records are appended.\nIf no matching RRs are found, they are created."
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
    ],
    "group": "dns"
  },
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
  },
  {
    "name": "ecommerce_enableManualPaymentMethodV1",
    "description": "Enable a manual payment method so the store can accept orders without an online payment provider.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/payment-methods/manual",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to enable manual payment for."
        },
        "title": {
          "type": "string",
          "description": "Optional display name shown to customers at checkout."
        }
      },
      "required": [
        "store_id"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_createDigitalProductV1",
    "description": "Create a published digital product with a single variant and an optional external download link.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/products/digital",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to create the product in."
        },
        "name": {
          "type": "string",
          "description": "The product name."
        },
        "price": {
          "type": "integer",
          "description": "Price in the smallest currency unit (e.g. cents). Must be positive."
        },
        "description": {
          "type": "string",
          "description": "The product description."
        },
        "currency": {
          "type": "string",
          "description": "ISO 4217 currency code. Defaults to the store's default currency when omitted."
        },
        "download_url": {
          "type": "string",
          "description": "Optional external download link delivered to the customer after purchase."
        }
      },
      "required": [
        "store_id",
        "name",
        "price"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_createPhysicalProductV1",
    "description": "Create a published physical product with a single variant priced in the store currency.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/products/physical",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to create the product in."
        },
        "name": {
          "type": "string",
          "description": "The product name."
        },
        "price": {
          "type": "integer",
          "description": "Price in the smallest currency unit (e.g. cents). Must be positive."
        },
        "description": {
          "type": "string",
          "description": "The product description."
        },
        "currency": {
          "type": "string",
          "description": "ISO 4217 currency code. Defaults to the store's default currency when omitted."
        }
      },
      "required": [
        "store_id",
        "name",
        "price"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_setStoreShippingV1",
    "description": "Set the flat-rate shipping price for a store, creating the shipping zone if it does not exist yet.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/shipping",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to configure shipping for."
        },
        "price": {
          "type": "integer",
          "description": "Flat shipping rate in the smallest currency unit (e.g. cents). Use 0 for free shipping."
        }
      },
      "required": [
        "store_id",
        "price"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_deleteStoreV1",
    "description": "Soft-delete a store owned by your account.\n\nThe underlying store data is preserved; only the store is marked as deleted.",
    "method": "DELETE",
    "path": "/api/ecommerce/v1/stores/{store_id}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to delete."
        }
      },
      "required": [
        "store_id"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_getStoresV1",
    "description": "Retrieve the stores associated with your account.",
    "method": "GET",
    "path": "/api/ecommerce/v1/stores",
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
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_createStoreV1",
    "description": "Create a new store for your account.\n\nA primary sales channel is created alongside the store.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "name parameter"
        },
        "country_code": {
          "type": "string",
          "description": "ISO 3166-1 alpha-2 country code."
        },
        "company_email": {
          "type": "string",
          "description": "company_email parameter"
        },
        "company_name": {
          "type": "string",
          "description": "company_name parameter"
        },
        "language": {
          "type": "string",
          "description": "ISO 639-1 language code."
        },
        "sales_channel": {
          "type": "object",
          "description": "sales_channel parameter",
          "properties": {
            "type": {
              "type": "string",
              "description": "Sales channel type. Only \"custom\" channels can be created via the API.",
              "enum": [
                "custom"
              ]
            },
            "external_id": {
              "type": "string",
              "description": "External identifier for the sales channel."
            }
          }
        }
      },
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "horizons_createWebsiteV1",
    "description": "Create new Hostinger Horizons website from the given message.\\n\nUse this tool when user asks you to create a website, landing page, blog\nor any other type of application.\\n\nThis tool initiates the website creation process and returns a website URL and ID.\nThe generation happens asynchronously.\\n\nAfter invoking this tool, your chat reply must be EXACTLY 1 sentence summarizing\nthat Hostinger Horizons is now creating their website and it will be ready in a few minutes\nand you should provide the website URL to the user immediately\nDo not write code.\\n\\nTo edit afterwards, users must go to Hostinger Horizons interface\nin the provided website URL.\nIf the tool call fails with an error, you should provide a clear explanation of the error\nand do not generate code yourself in the chat.\n\\n\nTECHNOLOGY STACK CONSTRAINTS (STRICTLY ENFORCED):\\n\nThe environment is limited to the following technologies.\nYou MUST NOT use, suggest, or implement any technology outside this list:\\n\n\\n\n- Language: JavaScript ONLY.\n- Languages like TypeScript, Rust, Python, Java, PHP, etc., are STRICTLY PROHIBITED.\\n\n- Framework: React.\\n\n- Navigation: React Router.\\n\n- Styling: TailwindCSS.\\n\n- Components: shadcn/ui (built with @radix-ui primitives).\\n\n- Icons: Lucide React.\\n\n- Animations: Framer Motion.\\n\n\\n\nBACKEND & DATA STORAGE:\\n\n- Horizons integrated backend is the EXCLUSIVE solution for persistent data storage,\nauthentication, and database needs.\\n\n- Local databases (SQLite, MySQL, etc.) are STRICTLY PROHIBITED.\\n\n- Third-party services (Firebase, AWS Amplify) are allowed ONLY if explicitly requested by the user.\\n\n\\n\nMAPS:\\n\n- OpenStreetMap is the default provider.\\n\n- Alternative providers (Google Maps, Mapbox) are allowed ONLY if explicitly requested by the user.\\n",
    "method": "POST",
    "path": "/api/horizons/v1/websites",
    "inputSchema": {
      "type": "object",
      "properties": {
        "message": {
          "type": "array",
          "description": "message parameter",
          "items": {
            "type": "object",
            "description": "message parameter",
            "properties": {
              "type": {
                "type": "string",
                "description": "type parameter",
                "enum": [
                  "text"
                ]
              },
              "text": {
                "type": "string",
                "description": "Detailed project specification.\nInclude purpose, key features, user flows, data models, and design preferences.\nThe specification should be detailed and comprehensive, covering all aspects of the project."
              }
            },
            "required": [
              "type",
              "text"
            ]
          }
        }
      },
      "required": [
        "message"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "horizons"
  },
  {
    "name": "horizons_getWebsiteV1",
    "description": "Get a link for the user to edit their website in Hostinger Horizons interface.\\n\nUse this tool when user wants to modify, edit or add new features to an existing website.\\n\nWebsites can only be edited in Hostinger Horizons interface in the provided website URL.",
    "method": "GET",
    "path": "/api/horizons/v1/websites/{websiteId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "websiteId": {
          "type": "string",
          "description": "The website ID"
        }
      },
      "required": [
        "websiteId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "horizons"
  },
  {
    "name": "hosting_listAccountCronJobsV1",
    "description": "Returns the list of cron jobs configured for the specified account, including their schedule and command.",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/cron-jobs",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        }
      },
      "required": [
        "username"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_createAccountCronJobV1",
    "description": "Creates a cron job for the specified account from a schedule expression and a command.\n\nReturns the created cron job, including its uid, which is required to delete the cron job or fetch its output.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/cron-jobs",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "time": {
          "type": "string",
          "description": "Cron schedule expression (for example \"0 2 * * *\" runs daily at 02:00)."
        },
        "command": {
          "type": "string",
          "description": "Command to execute on the schedule."
        }
      },
      "required": [
        "username",
        "time",
        "command"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_deleteAccountCronJobV1",
    "description": "Permanently deletes the cron job identified by its uid.\n\nThe uid is returned by the list cron jobs endpoint.",
    "method": "DELETE",
    "path": "/api/hosting/v1/accounts/{username}/cron-jobs/{uid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "uid": {
          "type": "string",
          "description": "Unique identifier of the cron job as returned by the list cron jobs endpoint."
        }
      },
      "required": [
        "username",
        "uid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_getCronJobOutputV1",
    "description": "Returns the output captured from the last execution of the cron job identified by its uid.\n\nThe uid is returned by the list cron jobs endpoint.",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/cron-jobs/{uid}/output",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "uid": {
          "type": "string",
          "description": "Unique identifier of the cron job as returned by the list cron jobs endpoint."
        }
      },
      "required": [
        "username",
        "uid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_changeDatabasePasswordV1",
    "description": "Changes the password for the specified database user.\n\nThe database name must be the full name returned by the list databases endpoint.\nThe password must also be updated in any website configuration that uses this database.",
    "method": "PATCH",
    "path": "/api/hosting/v1/accounts/{username}/databases/{name}/change-password",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "name": {
          "type": "string",
          "description": "Full database name as returned by the list databases endpoint."
        },
        "password": {
          "type": "string",
          "description": "New database user password."
        }
      },
      "required": [
        "username",
        "name",
        "password"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_listAccountDatabasesV1",
    "description": "Returns a paginated list of databases for the specified account.\n\nUse the domain and is_assigned filters to find databases assigned to a specific domain.",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/databases",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "page": {
          "type": "integer",
          "description": "Page number"
        },
        "per_page": {
          "type": "integer",
          "description": "Number of items per page"
        },
        "domain": {
          "type": "string",
          "description": "Filter by domain name (exact match)"
        },
        "is_assigned": {
          "type": "boolean",
          "description": "When used with domain, return only databases assigned to that domain."
        },
        "search": {
          "type": "string",
          "description": "Search databases by name, user, or creation date."
        }
      },
      "required": [
        "username"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_createAccountDatabaseV1",
    "description": "Creates a database with a database user and password for the specified account.\n\nThe database name and user are automatically prefixed with the account username when needed.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/databases",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "name": {
          "type": "string",
          "description": "Database name. If the account username prefix is omitted, it is added automatically."
        },
        "user": {
          "type": "string",
          "description": "Database user. If the account username prefix is omitted, it is added automatically."
        },
        "password": {
          "type": "string",
          "description": "Database user password."
        },
        "website_domain": {
          "type": "string",
          "description": "Website domain assigned to the database."
        }
      },
      "required": [
        "username",
        "name",
        "user",
        "password",
        "website_domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_deleteAccountDatabaseV1",
    "description": "Permanently deletes a database and its remote connections.\n\nThe database name must be the full name returned by the list databases endpoint.",
    "method": "DELETE",
    "path": "/api/hosting/v1/accounts/{username}/databases/{name}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "name": {
          "type": "string",
          "description": "Full database name as returned by the list databases endpoint."
        }
      },
      "required": [
        "username",
        "name"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_createAccountDatabaseRemoteConnectionV1",
    "description": "Allows a remote host to connect to the specified database.\n\nProvide an IPv4/IPv6 address, or \"%\" to allow any host. The database name must be\nthe full name returned by the list databases endpoint.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/databases/{name}/remote-connections",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "name": {
          "type": "string",
          "description": "Full database name as returned by the list databases endpoint."
        },
        "ip": {
          "type": "string",
          "description": "Remote host to allow: an IPv4/IPv6 address, or \"%\" for any host."
        }
      },
      "required": [
        "username",
        "name",
        "ip"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_deleteAccountDatabaseRemoteConnectionV1",
    "description": "Permanently removes a remote-access rule, revoking the given host's remote access to the database.\n\nIdentify the rule with the required ip query parameter (the IPv4/IPv6 address, or \"%\",\nexactly as returned by the list remote connections endpoint). The database name must be\nthe full name returned by the list databases endpoint.",
    "method": "DELETE",
    "path": "/api/hosting/v1/accounts/{username}/databases/{name}/remote-connections",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "name": {
          "type": "string",
          "description": "Full database name as returned by the list databases endpoint."
        },
        "ip": {
          "type": "string",
          "description": "Remote host to revoke: the IPv4/IPv6 address, or \"%\",\nexactly as returned by the list remote connections endpoint."
        }
      },
      "required": [
        "username",
        "name",
        "ip"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_listAccountDatabaseRemoteConnectionsV1",
    "description": "Returns the remote-access rules for the specified account: the remote hosts\n(IPv4/IPv6 addresses, or \"%\" for any host) allowed to connect to the account databases.\n\nUse the domain filter to only return rules for databases assigned to a specific domain.",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/databases/remote-connections",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "domain": {
          "type": "string",
          "description": "Filter remote connections by the domain the database is assigned to.\nRules for databases not assigned to any domain are always included."
        }
      },
      "required": [
        "username"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_repairDatabaseV1",
    "description": "Repairs corrupted database tables asynchronously.\n\nUse when database errors, crashes, or corruption are reported.\nThe database name must be the full name returned by the list databases endpoint.",
    "method": "PATCH",
    "path": "/api/hosting/v1/accounts/{username}/databases/{name}/repair",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "name": {
          "type": "string",
          "description": "Full database name as returned by the list databases endpoint."
        }
      },
      "required": [
        "username",
        "name"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_getPhpMyAdminLinkV1",
    "description": "Returns a direct sign-on link to phpMyAdmin for the specified database.\n\nUse this when a visual database interface is needed for SQL queries, imports, exports, or table management.\nThe database name must be the full name returned by the list databases endpoint.",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/databases/{name}/phpmyadmin-link",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "name": {
          "type": "string",
          "description": "Full database name as returned by the list databases endpoint."
        }
      },
      "required": [
        "username",
        "name"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_listAvailableDatacentersV1",
    "description": "Retrieve a list of datacenters available for setting up hosting plans\nbased on available datacenter capacity and hosting plan of your order.\nThe first item in the list is the best match for your specific order\nrequirements.",
    "method": "GET",
    "path": "/api/hosting/v1/datacenters",
    "inputSchema": {
      "type": "object",
      "properties": {
        "order_id": {
          "type": "integer",
          "description": "Order ID"
        }
      },
      "required": [
        "order_id"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_generateAFreeSubdomainV1",
    "description": "Generate a unique free subdomain that can be used for hosting services without purchasing custom domains.\nFree subdomains allow you to start using hosting services immediately\nand you can always connect a custom domain to your site later.",
    "method": "POST",
    "path": "/api/hosting/v1/domains/free-subdomains",
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
    "group": "hosting"
  },
  {
    "name": "hosting_listWebsiteParkedDomainsV1",
    "description": "Retrieve all parked or alias domains created under the selected website.\n\nUse this endpoint to inspect parked domain configuration for a specific website,\nincluding the parent domain and root directory assigned to each parked domain.",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/parked-domains",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "username",
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_createWebsiteParkedDomainV1",
    "description": "Create a parked or alias domain for the selected website.\n\nProvide a domain name or IP address to park on the website so it serves the same content\nas the parent domain.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/parked-domains",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "parked_domain": {
          "type": "string",
          "description": "Domain name or IP address to park on the selected website"
        }
      },
      "required": [
        "username",
        "domain",
        "parked_domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_deleteWebsiteParkedDomainV1",
    "description": "Delete an existing parked or alias domain from the selected website.\n\nUse this endpoint to remove parked domains that are no longer needed.",
    "method": "DELETE",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/parked-domains/{parkedDomain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "parkedDomain": {
          "type": "string",
          "description": "parkedDomain parameter"
        }
      },
      "required": [
        "username",
        "domain",
        "parkedDomain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_listWebsiteSubdomainsV1",
    "description": "Retrieve all subdomains created under the selected website.\n\nUse this endpoint to inspect subdomain configuration for a specific website,\nincluding the parent domain and root directory assigned to each subdomain.",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/subdomains",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "username",
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_createWebsiteSubdomainV1",
    "description": "Create a new subdomain for the selected website.\n\nProvide a subdomain prefix and, optionally, a custom directory or the\nwebsite public directory to use as the subdomain root.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/subdomains",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "subdomain": {
          "type": "string",
          "description": "Subdomain prefix to create under the selected website"
        },
        "directory": {
          "type": "string",
          "description": "Directory name for the subdomain relative to the website root"
        },
        "is_using_public_directory": {
          "type": "boolean",
          "description": "Use the website public directory as the subdomain root directory"
        }
      },
      "required": [
        "username",
        "domain",
        "subdomain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_deleteWebsiteSubdomainV1",
    "description": "Delete an existing subdomain from the selected website.\n\nUse this endpoint to remove subdomains that are no longer needed.",
    "method": "DELETE",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/subdomains/{subdomain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "subdomain": {
          "type": "string",
          "description": "subdomain parameter"
        }
      },
      "required": [
        "username",
        "domain",
        "subdomain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_verifyDomainOwnershipV1",
    "description": "Verify ownership of a single domain and return the verification status.\n\nUse this endpoint to check if a domain is accessible for you before using it for new websites.\nIf the domain is accessible, the response will have `is_accessible: true`.\nIf not, add the given TXT record to your domain's DNS records and try verifying again.\nKeep in mind that it may take up to 10 minutes for new TXT DNS records to propagate.\n\nSkip this verification when using Hostinger's free subdomains (*.hostingersite.com).",
    "method": "POST",
    "path": "/api/hosting/v1/domains/verify-ownership",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain to verify ownership for"
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
    "group": "hosting"
  },
  {
    "name": "hosting_listNodeJSBuildsV1",
    "description": "Retrieve a paginated list of Node.js build processes for a specific website.\n\nEach build represents a single run of the Node.js build pipeline. Use the `states`\nquery parameter to filter results by build state (pending, running, completed, failed).\nUse the `uuid` from a build to poll its output via the `Get Node.js Build Logs` endpoint.",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "page": {
          "type": "integer",
          "description": "Page number"
        },
        "per_page": {
          "type": "integer",
          "description": "Number of items per page"
        },
        "states": {
          "type": "array",
          "description": "Build states to filter by",
          "items": {
            "type": "string",
            "description": "states parameter",
            "enum": [
              "pending",
              "running",
              "completed",
              "failed"
            ]
          }
        }
      },
      "required": [
        "username",
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_createNodeJSBuildFromArchiveV1",
    "description": "Upload a project archive, auto-detect build settings, and immediately start a Node.js build.\n\nThis is the recommended single-step approach for deploying a Node.js application.\nThe archive is uploaded to the website's file storage, build settings are auto-detected\nfrom the package.json inside the archive, and the build process starts automatically.\nOptional override fields take precedence over auto-detected values.\nMaximum archive size is 50MB.\n\nBefore archiving, exclude `node_modules/` and any build output directories\n(e.g. `dist/`, `.next/`, `build/`) — they are not needed because the build\nprocess runs the install step automatically, and including them unnecessarily\nincreases the archive size. This also helps keep the archive well under the 50MB limit.\n\nExample (zip):\n```\nzip -r archive.zip . --exclude \"node_modules/*\" --exclude \"dist/*\"\n```\n\nThe returned build `uuid` can be used to poll progress and retrieve logs via\nthe `Get Node.js Build Logs` endpoint.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds/from-archive",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "archive": {
          "type": "string",
          "description": "Project archive file (.zip, .tar.gz, or .tgz), maximum 50MB"
        },
        "node_version": {
          "type": "integer",
          "description": "Node.js version override (auto-detected from package.json if omitted)",
          "enum": [
            18,
            20,
            22,
            24
          ]
        },
        "app_type": {
          "type": "string",
          "description": "Node.js application type override",
          "enum": [
            "create-react-app",
            "vite",
            "angular",
            "react",
            "vue",
            "parcel",
            "express",
            "fastify",
            "nest"
          ]
        },
        "root_directory": {
          "type": "string",
          "description": "Application root directory override (where package.json is located) relative to public_html"
        },
        "output_directory": {
          "type": "string",
          "description": "Build output directory override relative to the root directory"
        },
        "build_script": {
          "type": "string",
          "description": "Build script override"
        },
        "entry_file": {
          "type": "string",
          "description": "Main entry point file override"
        },
        "package_manager": {
          "type": "string",
          "description": "Package manager override",
          "enum": [
            "npm",
            "yarn",
            "pnpm"
          ]
        }
      },
      "required": [
        "username",
        "domain",
        "archive"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_getNodeJSBuildLogsV1",
    "description": "Retrieve logs from a specific Node.js build process.\n\nTo stream live output while a build is running, poll this endpoint repeatedly\nwhile the build state is `running`, passing the previously returned `lines` count\nas `from_line` to fetch only new output since the last call.\nLog content may contain ANSI escape sequences (color codes).",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds/{uuid}/logs",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "uuid": {
          "type": "string",
          "description": "Build UUID"
        },
        "from_line": {
          "type": "integer",
          "description": "Line from which to start retrieving logs"
        }
      },
      "required": [
        "username",
        "domain",
        "uuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_listOrdersV1",
    "description": "Retrieve a paginated list of orders accessible to the authenticated client.\n\nThis endpoint returns orders of your hosting accounts as well as orders\nof other client hosting accounts that have shared access with you.\n\nUse the available query parameters to filter results by order statuses\nor specific order IDs for more targeted results.",
    "method": "GET",
    "path": "/api/hosting/v1/orders",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "integer",
          "description": "Page number"
        },
        "per_page": {
          "type": "integer",
          "description": "Number of items per page"
        },
        "statuses": {
          "type": "array",
          "description": "Filter by order statuses",
          "items": {
            "type": "string",
            "description": "statuses parameter",
            "enum": [
              "active",
              "deleting",
              "deleted",
              "suspended"
            ]
          }
        },
        "order_ids": {
          "type": "array",
          "description": "Filter by specific order IDs",
          "items": {
            "type": "integer",
            "description": "order_ids parameter"
          }
        }
      },
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_listWebsitesV1",
    "description": "Retrieve a paginated list of websites (main and addon types) accessible to the authenticated client.\n\nThis endpoint returns websites from your hosting accounts as well as\nwebsites from other client hosting accounts that have shared access\nwith you.\n\nUse the available query parameters to filter results by username,\norder ID, enabled status, or domain name for more targeted results.",
    "method": "GET",
    "path": "/api/hosting/v1/websites",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "integer",
          "description": "Page number"
        },
        "per_page": {
          "type": "integer",
          "description": "Number of items per page"
        },
        "username": {
          "type": "string",
          "description": "Filter by specific username"
        },
        "order_id": {
          "type": "integer",
          "description": "Order ID"
        },
        "is_enabled": {
          "type": "boolean",
          "description": "Filter by enabled status"
        },
        "domain": {
          "type": "string",
          "description": "Filter by domain name (exact match)"
        }
      },
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "hosting_createWebsiteV1",
    "description": "Create a new website for the authenticated client.\n\nProvide the domain name and associated order ID to create a new website.\nThe datacenter_code parameter is required when creating the first website\non a new hosting plan - this will set up and configure new hosting account\nin the selected datacenter.\n\nSubsequent websites will be hosted on the same datacenter automatically.\n\nWebsite creation takes up to a few minutes to complete. Check the\nwebsites list endpoint to see when your new website becomes available.",
    "method": "POST",
    "path": "/api/hosting/v1/websites",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name for the website. Cannot start with \"www.\""
        },
        "order_id": {
          "type": "integer",
          "description": "ID of the associated order"
        },
        "datacenter_code": {
          "type": "string",
          "description": "Datacenter code. This parameter is required when creating the first website on a new hosting plan."
        }
      },
      "required": [
        "domain",
        "order_id"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "hosting"
  },
  {
    "name": "reach_deleteAContactV1",
    "description": "Delete a contact with the specified UUID.\n\nThis endpoint permanently removes a contact from the email marketing system.",
    "method": "DELETE",
    "path": "/api/reach/v1/contacts/{uuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "uuid": {
          "type": "string",
          "description": "UUID of the contact to delete"
        }
      },
      "required": [
        "uuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_listContactGroupsV1",
    "description": "Get a list of all contact groups.\n\nThis endpoint returns a list of contact groups that can be used to organize contacts.",
    "method": "GET",
    "path": "/api/reach/v1/contacts/groups",
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
    "group": "reach"
  },
  {
    "name": "reach_listContactsV1",
    "description": "Get a list of contacts, optionally filtered by group and subscription status.\n\nThis endpoint returns a paginated list of contacts with their basic information.\nYou can filter contacts by group UUID and subscription status.",
    "method": "GET",
    "path": "/api/reach/v1/contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "group_uuid": {
          "type": "string",
          "description": "Filter contacts by group UUID"
        },
        "subscription_status": {
          "type": "string",
          "description": "Filter contacts by subscription status",
          "enum": [
            "subscribed",
            "unsubscribed"
          ]
        },
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
    ],
    "group": "reach"
  },
  {
    "name": "reach_createANewContactV1",
    "description": "Create a new contact in the email marketing system.\n\nThis endpoint allows you to create a new contact with basic information like name, email, and surname.\n\nIf double opt-in is enabled,\nthe contact will be created with a pending status and a confirmation email will be sent.",
    "method": "POST",
    "path": "/api/reach/v1/contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "email": {
          "type": "string",
          "description": "email parameter"
        },
        "name": {
          "type": "string",
          "description": "name parameter"
        },
        "surname": {
          "type": "string",
          "description": "surname parameter"
        },
        "phone": {
          "type": "string",
          "description": "Phone number in E.164 format (leading \"+\" then 7-15 digits)"
        },
        "note": {
          "type": "string",
          "description": "note parameter"
        }
      },
      "required": [
        "email"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_listSegmentsV1",
    "description": "Get a list of all contact segments.\n\nThis endpoint returns a list of contact segments that can be used to organize contacts.",
    "method": "GET",
    "path": "/api/reach/v1/segmentation/segments",
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
    "group": "reach"
  },
  {
    "name": "reach_createANewContactSegmentV1",
    "description": "Create a new contact segment.\n\nThis endpoint allows creating a new contact segment that can be used to organize contacts.\nThe segment can be configured with specific criteria like email, name, subscription status, etc.",
    "method": "POST",
    "path": "/api/reach/v1/segmentation/segments",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "name parameter"
        },
        "conditions": {
          "type": "array",
          "description": "conditions parameter",
          "items": {
            "type": "object",
            "description": "conditions parameter",
            "properties": {
              "operator": {
                "type": "string",
                "description": "operator parameter",
                "enum": [
                  "equals",
                  "not_equals",
                  "contains",
                  "not_contains",
                  "gte",
                  "lte",
                  "exists",
                  "within_last_days",
                  "not_within_last_days",
                  "older_than_days",
                  "processed",
                  "not_processed",
                  "delivered",
                  "not_delivered",
                  "dropped",
                  "not_dropped",
                  "bounced",
                  "not_bounced",
                  "opened",
                  "not_opened",
                  "clicked",
                  "not_clicked",
                  "unsubscribed",
                  "not_unsubscribed"
                ]
              },
              "value": {
                "type": "string",
                "description": "value parameter"
              },
              "attribute": {
                "type": "string",
                "description": "attribute parameter",
                "enum": [
                  "note",
                  "comment",
                  "domain",
                  "integration",
                  "source",
                  "name",
                  "surname",
                  "email",
                  "subscribed_at",
                  "unsubscribed_at",
                  "subscription_status",
                  "processed",
                  "opened",
                  "clicked",
                  "delivered",
                  "bounced",
                  "unsubscribed",
                  "dropped",
                  "tag",
                  "campaigns"
                ]
              }
            }
          }
        },
        "logic": {
          "type": "string",
          "description": "logic parameter",
          "enum": [
            "AND",
            "OR"
          ]
        }
      },
      "required": [
        "name",
        "conditions",
        "logic"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_listProfileSegmentContactsV1",
    "description": "Retrieve contacts associated with a specific segment for a given profile.\n\nThis endpoint allows you to fetch and filter contacts that belong to a particular segment,\nidentified by its UUID, scoped to a specific profile.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}/contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "segmentUuid": {
          "type": "string",
          "description": "Segment uuid parameter"
        },
        "page": {
          "type": "integer",
          "description": "Page number"
        },
        "per_page": {
          "type": "integer",
          "description": "Number of items per page"
        }
      },
      "required": [
        "profileUuid",
        "segmentUuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_listSegmentContactsV1",
    "description": "Retrieve contacts associated with a specific segment.\n\nThis endpoint allows you to fetch and filter contacts that belong to a particular segment,\nidentified by its UUID.",
    "method": "GET",
    "path": "/api/reach/v1/segmentation/segments/{segmentUuid}/contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "segmentUuid": {
          "type": "string",
          "description": "Segment uuid parameter"
        },
        "page": {
          "type": "integer",
          "description": "Page number"
        },
        "per_page": {
          "type": "integer",
          "description": "Number of items per page"
        }
      },
      "required": [
        "segmentUuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_getSegmentDetailsV1",
    "description": "Get details of a specific segment.\n\nThis endpoint retrieves information about a single segment identified by UUID.\nSegments are used to organize and group contacts based on specific criteria.",
    "method": "GET",
    "path": "/api/reach/v1/segmentation/segments/{segmentUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "segmentUuid": {
          "type": "string",
          "description": "Segment uuid parameter"
        }
      },
      "required": [
        "segmentUuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_createNewContactsV1",
    "description": "Create a new contact in the email marketing system.\n\nThis endpoint allows you to create a new contact with basic information like name, email, and surname.\n\nIf double opt-in is enabled, the contact will be created with a pending status\nand a confirmation email will be sent.",
    "method": "POST",
    "path": "/api/reach/v1/profiles/{profileUuid}/contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "email": {
          "type": "string",
          "description": "email parameter"
        },
        "name": {
          "type": "string",
          "description": "name parameter"
        },
        "surname": {
          "type": "string",
          "description": "surname parameter"
        },
        "phone": {
          "type": "string",
          "description": "Phone number in E.164 format (leading \"+\" then 7-15 digits)"
        },
        "note": {
          "type": "string",
          "description": "note parameter"
        }
      },
      "required": [
        "profileUuid",
        "email"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_getProfileDomainDNSStatusV1",
    "description": "Retrieve the DNS configuration status for a profile's domain.\n\nThis endpoint reports the state of MX, SPF, DKIM and DMARC records, including the\nactual records found and the suggested records required for correct email delivery.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/domains/dns-status",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        }
      },
      "required": [
        "profileUuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_listProfilesV1",
    "description": "This endpoint returns all profiles available to the client, including their basic information.",
    "method": "GET",
    "path": "/api/reach/v1/profiles",
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
    "group": "reach"
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getProjectContainersV1",
    "description": "Retrieves a list of all containers belonging to a specific Docker Compose project on the virtual machine. \n\nThis endpoint returns detailed information about each container including\ntheir current status, port mappings, and runtime configuration.\n\nUse this to monitor the health and state of all services within your Docker Compose project.",
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getProjectContentsV1",
    "description": "Retrieves the complete project information including the docker-compose.yml\nfile contents, project metadata, and current deployment status.\n\nThis endpoint provides the full configuration and state details of a specific Docker Compose project. \n\nUse this to inspect project settings, review the compose file, or check the overall project health.",
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getProjectListV1",
    "description": "Retrieves a list of all Docker Compose projects currently deployed on the virtual machine. \n\nThis endpoint returns basic information about each project including name,\nstatus, file path and list of containers with details about their names,\nimage, status, health and ports. Container stats are omitted in this\nendpoint. If you need to get detailed information about container with\nstats included, use the `Get project containers` endpoint.\n\nUse this to get an overview of all Docker projects on your VPS instance.",
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_createNewProjectV1",
    "description": "Deploy new project from docker-compose.yaml contents or download contents from URL. \n\nURL can be Github repository url in format https://github.com/[user]/[repo]\nand it will be automatically resolved to docker-compose.yaml file in\nmaster branch. Any other URL provided must return docker-compose.yaml\nfile contents.\n\nIf project with the same name already exists, existing project will be replaced.",
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
        },
        "environment": {
          "type": "string",
          "description": "Project environment variables"
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getProjectLogsV1",
    "description": "Retrieves aggregated log entries from all services within a Docker Compose project. \n\nThis endpoint returns recent log output from each container, organized by service name with timestamps. \nThe response contains the last 300 log entries across all services. \n\nUse this for debugging, monitoring application behavior, and\ntroubleshooting issues across your entire project stack.",
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_restartProjectV1",
    "description": "Restarts all services in a Docker Compose project by stopping and starting\ncontainers in the correct dependency order.\n\nThis operation preserves data volumes and network configurations while refreshing the running containers. \n\nUse this to apply configuration changes or recover from service failures.",
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_startProjectV1",
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_stopProjectV1",
    "description": "Stops all running services in a Docker Compose project while preserving\ncontainer configurations and data volumes.\n\nThis operation gracefully shuts down containers in reverse dependency order. \n\nUse this to temporarily halt a project without removing data or configurations.",
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_updateProjectV1",
    "description": "Updates a Docker Compose project by pulling the latest image versions and\nrecreating containers with new configurations.\n\nThis operation preserves data volumes while applying changes from the compose file. \n\nUse this to deploy application updates, apply configuration changes, or\nrefresh container images to their latest versions.",
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_updateFirewallRuleV1",
    "description": "Update a specific firewall rule from a specified firewall.\n\nAny virtual machine that has this firewall activated will lose sync with the firewall\nand will have to be synced again manually.\n\nUse this endpoint to modify existing firewall rules.",
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_deleteFirewallRuleV1",
    "description": "Delete a specific firewall rule from a specified firewall.\n\nAny virtual machine that has this firewall activated will lose sync with the firewall\nand will have to be synced again manually.\n\nUse this endpoint to remove specific firewall rules.",
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_createFirewallRuleV1",
    "description": "Create new firewall rule for a specified firewall.\n\nBy default, the firewall drops all incoming traffic,\nwhich means you must add accept rules for all ports you want to use.\n\nAny virtual machine that has this firewall activated will lose sync with the firewall\nand will have to be synced again manually.\n\nUse this endpoint to add new security rules to firewalls.",
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_createPostInstallScriptV1",
    "description": "Add a new post-install script to your account, which can then be used after virtual machine installation.\n\nThe script contents will be saved to the file `/post_install` with executable attribute set\nand will be executed once virtual machine is installed.\nThe output of the script will be redirected to `/post_install.log`. Maximum script size is 48KB.\n\nUse this endpoint to create automation scripts for VPS setup tasks.",
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getActionsV1",
    "description": "Retrieve actions performed on a specified virtual machine.\n\nActions are operations or events that have been executed on the virtual\nmachine, such as starting, stopping, or modifying the machine. This endpoint\nallows you to view the history of these actions, providing details about\neach action, such as the action name, timestamp, and status.\n\nUse this endpoint to view VPS operation history and troubleshoot issues.",
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_purchaseNewVirtualMachineV1",
    "description": "Purchase and setup a new virtual machine.\n\nIf virtual machine setup fails for any reason, login to\n[hPanel](https://hpanel.hostinger.com/) and complete the setup manually.\n\nIf no payment method is provided, your default payment method will be used automatically.\n\nUse this endpoint to create new VPS instances.",
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getScanMetricsV1",
    "description": "Retrieve scan metrics for the [Monarx](https://www.monarx.com/) malware scanner\ninstalled on a specified virtual machine.\n\nThe scan metrics provide detailed information about malware scans performed\nby Monarx, including number of scans, detected threats, and other relevant\nstatistics. This information is useful for monitoring security status of the\nvirtual machine and assessing effectiveness of the malware scanner.\n\nUse this endpoint to monitor VPS security scan results and threat detection.",
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_installMonarxV1",
    "description": "Install the Monarx malware scanner on a specified virtual machine.\n\n[Monarx](https://www.monarx.com/) is a security tool designed to detect and\nprevent malware infections on virtual machines. By installing Monarx, users\ncan enhance the security of their virtual machines, ensuring that they are\nprotected against malicious software.\n\nUse this endpoint to enable malware protection on VPS instances.",
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_setNameserversV1",
    "description": "Set nameservers for a specified virtual machine.\n\nBe aware, that improper nameserver configuration can lead to the virtual\nmachine being unable to resolve domain names.\n\nUse this endpoint to configure custom DNS resolvers for VPS instances.",
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_createPTRRecordV1",
    "description": "Create or update a PTR (Pointer) record for a specified virtual machine.\n\nUse this endpoint to configure reverse DNS lookup for VPS IP addresses.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/ptr/{ipAddressId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "ipAddressId": {
          "type": "integer",
          "description": "IP Address ID"
        },
        "domain": {
          "type": "string",
          "description": "Pointer record domain"
        }
      },
      "required": [
        "virtualMachineId",
        "ipAddressId",
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_deletePTRRecordV1",
    "description": "Delete a PTR (Pointer) record for a specified virtual machine.\n\nOnce deleted, reverse DNS lookups to the virtual machine's IP address will\nno longer return the previously configured hostname.\n\nUse this endpoint to remove reverse DNS configuration from VPS instances.",
    "method": "DELETE",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/ptr/{ipAddressId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "ipAddressId": {
          "type": "integer",
          "description": "IP Address ID"
        }
      },
      "required": [
        "virtualMachineId",
        "ipAddressId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_setPanelPasswordV1",
    "description": "Set panel password for a specified virtual machine.\n\nIf virtual machine does not use panel OS, the request will still be processed without any effect.\nRequirements for password are same as in the [recreate virtual machine\nendpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).\n\nUse this endpoint to configure control panel access credentials for VPS instances.",
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_recreateVirtualMachineV1",
    "description": "Recreate a virtual machine from scratch.\n\nThe recreation process involves reinstalling the operating system and\nresetting the virtual machine to its initial state.\nSnapshots, if there are any, will be deleted.\n\n## Password Requirements\nPassword will be checked against leaked password databases. \nRequirements for the password are:\n- At least 12 characters long\n- At least one uppercase letter\n- At least one lowercase letter\n- At least one number\n- Is not leaked publicly\n\n**This operation is irreversible and will result in the loss of all data stored on the virtual machine!**\n\nUse this endpoint to completely rebuild VPS instances with fresh OS installation.",
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
          "description": "Root password for the virtual machine. If not provided, random password will be generated.\nPassword will not be shown in the response."
        },
        "panel_password": {
          "type": "string",
          "description": "Panel password for the panel-based OS template. If not provided, random password will be generated.\nIf OS does not support panel_password this field will be ignored.\nPassword will not be shown in the response."
        },
        "post_install_script_id": {
          "type": "integer",
          "description": "Post-install script to execute after virtual machine was recreated"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_setRootPasswordV1",
    "description": "Set root password for a specified virtual machine.\n\nRequirements for password are same as in the [recreate virtual machine\nendpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).\n\nUse this endpoint to update administrator credentials for VPS instances.",
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
    ],
    "group": "vps"
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
          "description": "Password for the virtual machine. If not provided, random password will be generated.\nPassword will not be shown in the response."
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
  },
  {
    "name": "VPS_restoreSnapshotV1",
    "description": "Restore a specified virtual machine to a previous state using a snapshot.\n\nRestoring from a snapshot allows users to revert the virtual machine to that state,\nwhich is useful for system recovery, undoing changes, or testing.\n\nUse this endpoint to revert VPS instances to previous saved states.",
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
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
    ],
    "group": "vps"
  },
  {
    "name": "hosting_installWordPressV1",
    "description": "Install WordPress on an existing website.\n\nThe website must already exist before calling this endpoint. To create a new\nwebsite first, use POST /api/hosting/v1/websites and poll\nGET /api/hosting/v1/websites until it appears.\n\nCall GET /api/hosting/v1/wordpress/installations filtered by username and\ndomain before proceeding to check whether WordPress is already installed on\nthe target domain/path. If WordPress already exists and `overwrite` is false\n(the default), the async job will fail.\n\nThis operation is asynchronous: a successful response only means the install\njob has been queued, not that WordPress is ready. Installation typically\ntakes 1-2 minutes. Poll GET /api/hosting/v1/wordpress/installations filtered\nby username and domain to track progress. When the installation appears in\nthat list, WordPress is ready.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/installations",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "domain": {
          "type": "string",
          "description": "Domain of the existing website where WordPress will be installed"
        },
        "site_title": {
          "type": "string",
          "description": "Title of the WordPress site"
        },
        "language": {
          "type": "string",
          "description": "WordPress locale. Defaults to en_US when omitted."
        },
        "directory": {
          "type": "string",
          "description": "Relative directory to install WordPress into. Defaults to the website root when omitted."
        },
        "overwrite": {
          "type": "boolean",
          "description": "When false (default), does not replace an existing installation. If WordPress is already installed on the domain/path, the async install job fails unless true."
        },
        "auto_updates": {
          "type": "string",
          "description": "WordPress core auto-update policy",
          "enum": [
            "all",
            "none",
            "minor"
          ]
        },
        "version": {
          "type": "string",
          "description": "WordPress core version to install. If omitted, the latest core version compatible with the account vhost PHP version is selected."
        },
        "credentials": {
          "type": "object",
          "description": "WordPress admin credentials",
          "properties": {
            "email": {
              "type": "string",
              "description": "email parameter"
            },
            "login": {
              "type": "string",
              "description": "WordPress admin username"
            },
            "password": {
              "type": "string",
              "description": "password parameter"
            }
          },
          "required": [
            "email",
            "login",
            "password"
          ]
        },
        "database": {
          "type": "object",
          "description": "Optional. If the named database already exists, it will be used for this WordPress install. Otherwise a new database is created with a generated name and random credentials.",
          "properties": {
            "name": {
              "type": "string",
              "description": "Database name (username prefix added if missing)"
            },
            "password": {
              "type": "string",
              "description": "password parameter"
            }
          }
        }
      },
      "required": [
        "username",
        "domain",
        "site_title",
        "credentials"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_listWordPressInstallationsV1",
    "description": "List WordPress installations accessible to the authenticated client.\n\nUse this endpoint to discover existing WordPress installations and to poll\nfor installation status after calling the install endpoint. When a newly\nrequested installation appears in this list, WordPress is ready. Filter by\nusername and domain to narrow results to a specific website.\n\nEach installation includes a `valid` flag and, when invalid, a\n`validationError` describing why.",
    "method": "GET",
    "path": "/api/hosting/v1/wordpress/installations",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "Filter by specific username"
        },
        "domain": {
          "type": "string",
          "description": "Filter by domain name (exact match)"
        },
        "ownership": {
          "type": "string",
          "description": "Filter by ownership type. Defaults to \"owned\". Use \"all\" to include both owned and managed installations.",
          "enum": [
            "owned",
            "managed",
            "all"
          ]
        }
      },
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_activateWordPressPluginV1",
    "description": "Activate an installed plugin on a WordPress installation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).\n\nThis operation is asynchronous: a successful response only means the activation\njob has been queued.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/activate",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "software": {
          "type": "string",
          "description": "WordPress installation (software) identifier"
        },
        "plugin": {
          "type": "string",
          "description": "Slug of the installed plugin to activate."
        }
      },
      "required": [
        "username",
        "software",
        "plugin"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_deactivateWordPressPluginV1",
    "description": "Deactivate an installed plugin on a WordPress installation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).\n\nThis operation is asynchronous: a successful response only means the\ndeactivation job has been queued.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/deactivate",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "software": {
          "type": "string",
          "description": "WordPress installation (software) identifier"
        },
        "plugin": {
          "type": "string",
          "description": "Slug of the installed plugin to deactivate."
        }
      },
      "required": [
        "username",
        "software",
        "plugin"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_installWordPressPluginsV1",
    "description": "Install one or more plugins on an existing WordPress installation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id`\nfield). Use GET /api/hosting/v1/wordpress/plugins to discover the plugin\nslugs available for installation.\n\nThis operation is asynchronous: a successful response only means the install\njob has been queued, not that the plugins are ready.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/install",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "software": {
          "type": "string",
          "description": "WordPress installation (software) identifier"
        },
        "plugins": {
          "type": "array",
          "description": "Plugin slugs to install. Use GET /api/hosting/v1/wordpress/plugins to discover available slugs.",
          "items": {
            "type": "string",
            "description": "Plugin slug"
          }
        }
      },
      "required": [
        "username",
        "software",
        "plugins"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_listAvailableWordPressPluginsV1",
    "description": "List plugins recommended for installation on a WordPress installation that are\nnot yet installed.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/available",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "software": {
          "type": "string",
          "description": "WordPress installation (software) identifier"
        }
      },
      "required": [
        "username",
        "software"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_listInstalledWordPressPluginsV1",
    "description": "List plugins installed on a WordPress installation, including their status,\navailable updates and known vulnerabilities.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "software": {
          "type": "string",
          "description": "WordPress installation (software) identifier"
        },
        "category": {
          "type": "string",
          "description": "Filter installed plugins by category.",
          "enum": [
            "cache"
          ]
        }
      },
      "required": [
        "username",
        "software"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_searchWordPressPluginsV1",
    "description": "Search the WordPress.org plugin directory for plugins available to install.\n\nUse the returned `slug` values with\nPOST /api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/install.",
    "method": "GET",
    "path": "/api/hosting/v1/wordpress/plugins",
    "inputSchema": {
      "type": "object",
      "properties": {
        "search": {
          "type": "string",
          "description": "Search term to match against plugin names. Minimum 3 characters."
        }
      },
      "required": [
        "search"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_listSuggestedWordPressPluginsV1",
    "description": "List curated plugin suggestions grouped by website type.\n\nUse the returned `slug` values with\nPOST /api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/install.",
    "method": "GET",
    "path": "/api/hosting/v1/wordpress/plugins/suggested",
    "inputSchema": {
      "type": "object",
      "properties": {
        "order_id": {
          "type": "integer",
          "description": "Optionally scope suggestions to a specific order."
        }
      },
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_checkIfWooCommerceIsInstalledV1",
    "description": "Check whether WooCommerce is installed on any WordPress installation of a\ndomain. Optionally filter by domain to scope the check.",
    "method": "GET",
    "path": "/api/hosting/v1/wordpress/plugins/is-woocommerce-installed",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Filter by domain name (exact match)"
        }
      },
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_uninstallWordPressPluginsV1",
    "description": "Uninstall one or more plugins from a WordPress installation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).\n\nThis operation is asynchronous: a successful response only means the uninstall\njob has been queued.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/uninstall",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "software": {
          "type": "string",
          "description": "WordPress installation (software) identifier"
        },
        "plugins": {
          "type": "array",
          "description": "Slugs of the installed plugins to uninstall.",
          "items": {
            "type": "string",
            "description": "Plugin slug"
          }
        }
      },
      "required": [
        "username",
        "software",
        "plugins"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_updateHostingerWordPressPluginV1",
    "description": "Update a Hostinger plugin to its latest version on a WordPress installation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).\n\nThis operation is asynchronous: a successful response only means the update job\nhas been queued.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/hostinger/update",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "software": {
          "type": "string",
          "description": "WordPress installation (software) identifier"
        },
        "slug": {
          "type": "string",
          "description": "Slug of the Hostinger plugin to update to its latest version.",
          "enum": [
            "hostinger",
            "hostinger-ai-assistant",
            "hostinger-affiliate-plugin",
            "hostinger-easy-onboarding",
            "hostinger-reach"
          ]
        }
      },
      "required": [
        "username",
        "software",
        "slug"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_updateWordPressPluginsV1",
    "description": "Update one or more installed plugins to their latest version on a WordPress\ninstallation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).\n\nThis operation is asynchronous: a successful response only means the update job\nhas been queued.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/plugins/update",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "software": {
          "type": "string",
          "description": "WordPress installation (software) identifier"
        },
        "plugins": {
          "type": "array",
          "description": "Slugs of the installed plugins to update to their latest version.",
          "items": {
            "type": "string",
            "description": "Plugin slug"
          }
        }
      },
      "required": [
        "username",
        "software",
        "plugins"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_activateWordPressThemeV1",
    "description": "Activate an installed theme on a WordPress installation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).\n\nThis operation is asynchronous: a successful response only means the activation\njob has been queued.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/themes/activate",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "software": {
          "type": "string",
          "description": "WordPress installation (software) identifier"
        },
        "theme": {
          "type": "string",
          "description": "Slug of the installed theme to activate."
        }
      },
      "required": [
        "username",
        "software",
        "theme"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_installWordPressThemeV1",
    "description": "Install a theme on an existing WordPress installation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id`\nfield).\n\nWhen the theme is one of the Hostinger themes (hostinger-blog,\nhostinger-affiliate-theme, hostinger-ai-theme), the optional `palette`,\n`layout`, and `font` fields are forwarded to the custom installer (defaults:\npalette1, layout1, default). For any other theme they are ignored.\n\nThis operation is asynchronous: a successful response only means the install\njob has been queued, not that the theme is ready.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/themes/install",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "software": {
          "type": "string",
          "description": "WordPress installation (software) identifier"
        },
        "theme": {
          "type": "string",
          "description": "Slug of the theme to install. Hostinger theme slugs (hostinger-blog, hostinger-affiliate-theme, hostinger-ai-theme) trigger the custom installer and forward the optional palette/layout/font fields; any other WordPress theme slug uses the standard installer and ignores those fields."
        },
        "palette": {
          "type": "string",
          "description": "Palette identifier. Only applied when the theme is a Hostinger theme; the default is used when omitted."
        },
        "layout": {
          "type": "string",
          "description": "Layout identifier. Only applied when the theme is a Hostinger theme; the default is used when omitted."
        },
        "font": {
          "type": "string",
          "description": "Font identifier. Only applied when the theme is a Hostinger theme; the default is used when omitted.",
          "enum": [
            "professional",
            "modern",
            "elegant",
            "creative",
            "dynamic",
            "default"
          ]
        }
      },
      "required": [
        "username",
        "software",
        "theme"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_listInstalledWordPressThemesV1",
    "description": "List themes installed on a WordPress installation, including their status,\navailable updates and known vulnerabilities.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/themes",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "software": {
          "type": "string",
          "description": "WordPress installation (software) identifier"
        }
      },
      "required": [
        "username",
        "software"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_listWordPressThemesV1",
    "description": "List WordPress themes available to install.\n\nUse the returned `slug` values with\nPOST /api/hosting/v1/accounts/{username}/wordpress/{software}/themes/install.",
    "method": "GET",
    "path": "/api/hosting/v1/wordpress/themes",
    "inputSchema": {
      "type": "object",
      "properties": {
        "order_id": {
          "type": "integer",
          "description": "Optionally scope themes to a specific order."
        },
        "search": {
          "type": "string",
          "description": "Search term to match against theme names."
        }
      },
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_uninstallWordPressThemesV1",
    "description": "Uninstall one or more themes from a WordPress installation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).\n\nThis operation is asynchronous: a successful response only means the uninstall\njob has been queued.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/themes/uninstall",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "software": {
          "type": "string",
          "description": "WordPress installation (software) identifier"
        },
        "themes": {
          "type": "array",
          "description": "Slugs of the installed themes to uninstall.",
          "items": {
            "type": "string",
            "description": "Theme slug"
          }
        }
      },
      "required": [
        "username",
        "software",
        "themes"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  },
  {
    "name": "hosting_updateWordPressThemesV1",
    "description": "Update one or more installed themes to their latest version on a WordPress\ninstallation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).\n\nThis operation is asynchronous: a successful response only means the update job\nhas been queued.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/themes/update",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "software": {
          "type": "string",
          "description": "WordPress installation (software) identifier"
        },
        "themes": {
          "type": "array",
          "description": "Slugs of the installed themes to update to their latest version.",
          "items": {
            "type": "string",
            "description": "Theme slug"
          }
        }
      },
      "required": [
        "username",
        "software",
        "themes"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "wordpress"
  }
];
export default tools;
