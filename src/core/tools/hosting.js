// Auto-generated tool list for group: hosting
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
    "name": "hosting_resetPHPExtensionsV1",
    "description": "Resets all PHP extensions of the website to their default state.\n\nUse it to recover from extension conflicts or restore the original configuration.",
    "method": "PATCH",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/php/extensions/reset",
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
    "name": "hosting_getPHPDetailsV1",
    "description": "Returns the full PHP configuration for the website: current version, available versions\n(supported and unsupported), enabled/disabled extensions, options with their current value,\ndefault, type and the plan limit (`max`), and conflicting extension groups.\n\nUse it to check the current PHP setup before updating the version, extensions or options.",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/php/details",
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
    "name": "hosting_getPHPInfoV1",
    "description": "Returns the full phpinfo page (HTML) for the website.\n\nUse it to debug PHP issues or inspect the complete PHP environment of the website.",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/php/php-info",
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
    "name": "hosting_updatePHPExtensionsV1",
    "description": "Enables or disables PHP extensions (modules) for the website.\n\nUse the Get PHP details endpoint to check the current extension states before changing them.",
    "method": "PATCH",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/php/extensions",
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
        "enable": {
          "type": "array",
          "description": "PHP extensions to enable.",
          "items": {
            "type": "string",
            "description": "enable parameter"
          }
        },
        "disable": {
          "type": "array",
          "description": "PHP extensions to disable.",
          "items": {
            "type": "string",
            "description": "disable parameter"
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
    "name": "hosting_updatePHPOptionsV1",
    "description": "Updates PHP options for the website (e.g. `memory_limit`, `max_execution_time`, `upload_max_filesize`).\nOnly provide the options you want to change, inside the `options` object.\n\nValues above the account plan limit are silently capped to that limit, so the request can succeed\nwith a smaller applied value. Call the Get PHP details endpoint afterwards to read the applied value.",
    "method": "PATCH",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/php/options",
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
        "options": {
          "type": "object",
          "description": "Map of PHP options to update, keyed by option name. Only include options you want to change.",
          "properties": {}
        }
      },
      "required": [
        "username",
        "domain",
        "options"
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
    "name": "hosting_updatePHPVersionV1",
    "description": "Changes the PHP version of the website.\n\nUse the Get PHP details endpoint to see the versions available for the website.",
    "method": "PATCH",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/php/version",
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
        "version": {
          "type": "string",
          "description": "PHP version to switch the website to."
        }
      },
      "required": [
        "username",
        "domain",
        "version"
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
  }
];
