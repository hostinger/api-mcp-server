// Auto-generated tool list for group: all
export default [
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
  }
];
