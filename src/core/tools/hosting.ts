// Auto-generated tool list for group: hosting
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
  }
];
export default tools;
