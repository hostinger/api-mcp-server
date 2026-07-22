// Auto-generated tool list for group: agency-hosting
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export interface OpenApiTool extends Tool {
  method: string;
  path: string;
  security: unknown[];
  custom?: boolean;
  group?: string;
  topic?: string;
  handlerMethod?: string;
  templateFile?: string;
  templateFileTS?: string;
}

const tools: OpenApiTool[] = [
  {
    "name": "agencyHosting_deployNodeStaticWebsite",
    "topic": "agency-hosting",
    "description": "Deploy a node-static Agency Plan (h5g) website from an archive file. WARNING: this overwrites the website's existing contents and cannot be undone — always confirm with the user before proceeding. Use this for Agency Plan websites of type node-static (a Node.js-built static site that requires a build step or a plain simple static site). The tool resolves the website from its domain, uploads the archive to the website's file browser over TUS, and triggers the build-assets process which builds the site and deploys the result to public_html. This operation is synchronous: the build and deployment complete before the tool returns, so the website is live as soon as the tool finishes successfully — there is no separate asynchronous build to wait for or poll. For plain PHP applications that should be extracted as-is, use agencyHosting_deployPhpApplication instead. The website UID is automatically resolved from the domain.",
    "method": "",
    "path": "",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name of the Agency Plan website (e.g., example.com)"
        },
        "archivePath": {
          "type": "string",
          "description": "Absolute or relative path to the website archive file. Supported formats: zip, tar, tar.gz, tgz. The archive must contain the application source files. If user provides a directory path, create an archive from it before proceeding using EXACTLY this naming pattern: directoryname_YYYYMMDD_HHMMSS.zip (e.g., mywebsite_20250115_143022.zip)"
        },
        "removeArchive": {
          "type": "boolean",
          "description": "Whether to remove the local archive file after successful deployment (default: true)"
        }
      },
      "required": [
        "domain",
        "archivePath"
      ]
    },
    "security": [],
    "custom": true,
    "templateFile": "deploy-node-static.template.js",
    "templateFileTS": "deploy-node-static.template.ts",
    "handlerMethod": "handleNodeStaticDeploy",
    "group": "agency-hosting"
  },
  {
    "name": "agencyHosting_deployPhpApplication",
    "topic": "agency-hosting",
    "description": "Deploy a PHP (or other non-build) Agency Plan (h5g) website from an archive file. WARNING: this overwrites the website's existing contents and cannot be undone — always confirm with the user before proceeding. Use this for Agency Plan websites where the archive contents should be extracted and served as-is with no build step (e.g., PHP applications). The tool resolves the website from its domain, uploads the archive to the website's file browser over TUS, and triggers the import-archive process which overwrites the website contents with the archive contents. This operation is synchronous: the archive is extracted and deployed before the tool returns, so the website is live as soon as the tool finishes successfully — there is no separate asynchronous build to wait for or poll. For node-static websites that require a build step, use agencyHosting_deployNodeStaticWebsite instead. The website UID is automatically resolved from the domain.",
    "method": "",
    "path": "",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name of the Agency Plan website (e.g., example.com)"
        },
        "archivePath": {
          "type": "string",
          "description": "Absolute or relative path to the website archive file. Supported formats: zip, tar, tar.gz, tgz. If user provides a directory path, create an archive from it before proceeding using EXACTLY this naming pattern: directoryname_YYYYMMDD_HHMMSS.zip (e.g., mywebsite_20250115_143022.zip)"
        },
        "removeArchive": {
          "type": "boolean",
          "description": "Whether to remove the local archive file after successful deployment (default: true)"
        }
      },
      "required": [
        "domain",
        "archivePath"
      ]
    },
    "security": [],
    "custom": true,
    "templateFile": "deploy-php-app.template.js",
    "templateFileTS": "deploy-php-app.template.ts",
    "handlerMethod": "handlePhpAppDeploy",
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_listAvailableDatacentersForAnAgencyPlanOrderV1",
    "description": "Lists the datacenters available for provisioning a new website on the given Agency Plan\nhosting order.\n\nEach datacenter includes a `pinger_url` you can ping from the client to measure round-trip\nlatency; comparing the results across datacenters lets you pick the nearest one (lowest\nping) before choosing its `code` as the `datacenter_code` when creating a website setup.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/orders/{order_id}/datacenters",
    "inputSchema": {
      "type": "object",
      "properties": {
        "order_id": {
          "type": "integer",
          "description": "Agency Plan order ID"
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
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_changeAgencyPlanWebsiteDomainV1",
    "description": "Changes the primary domain for an Agency Plan website.\n\nProvide the current domain in the path and the new domain in the request body.\nSet domain to null to revert to the temporary domain.",
    "method": "PUT",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/domains/{from_domain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "from_domain": {
          "type": "string",
          "description": "Current domain name to change from"
        },
        "domain": {
          "type": "string",
          "description": "New domain to assign to the website. Set to null to revert to the temporary domain."
        }
      },
      "required": [
        "website_uid",
        "from_domain",
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_linkDomainToAgencyPlanWebsiteV1",
    "description": "Links a domain to the specified Agency Plan website so it can serve traffic for that domain.",
    "method": "POST",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/domains",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "domain": {
          "type": "string",
          "description": "Fully qualified domain name to link to the website"
        }
      },
      "required": [
        "website_uid",
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_listAgencyPlanDomainsV1",
    "description": "Returns a paginated list of domains associated with Agency Plan websites accessible to the authenticated client.\n\nUse the website_uuids filter to narrow results to specific websites.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/domains",
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
        "website_uuids": {
          "type": "array",
          "description": "Filter by website UIDs",
          "items": {
            "type": "string",
            "description": "website_uuids parameter"
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
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_unlinkDomainFromAgencyPlanWebsiteV1",
    "description": "Unlinks a domain from the specified Agency Plan website.\n\nThe website stops serving traffic on this domain immediately.\n\nWebsite files and database are preserved, and any other linked domains remain accessible.\n\nIf this is the only domain on the website, unlinking leaves the website without an accessible domain.",
    "method": "DELETE",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/domains/{domain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "website_uid",
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_importAgencyPlanWebsiteFromArchiveV1",
    "description": "Imports an Agency Plan website from an already-uploaded archive.\n\nUpload the archive to the website's root directory via file browser first, then provide its\nfilename in this request. Website contents are overwritten by the archive contents. Supported\narchive types: .zip, .tar, .tar.gz, .tgz.",
    "method": "POST",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/files/import-archive",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "archive_name": {
          "type": "string",
          "description": "Archive filename (e.g., archive.zip). The file must already be uploaded to the website's .h5g/ directory."
        }
      },
      "required": [
        "website_uid",
        "archive_name"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_provisionANewAgencyPlanWebsiteV1",
    "description": "Provisions a new website on one of your Agency Plan hosting orders.\n\nChoose the datacenter, stack (`flavor`), and PHP version for the site. Optionally attach\nyour own `domain` — omit it, set it to `null`, or leave it unavailable and a free\n`*.hostingersite.com` subdomain is generated instead — and/or install WordPress by\nsupplying the `wordpress` details (admin account, site title, and language).\n\nCommon setups:\n- **Plain PHP site**: `flavor` set to `php-fpm`, with `settings.php.version`; omit\n  `wordpress` and `type`.\n- **WordPress site**: `flavor` set to the desired WordPress version (e.g. `wp-7.0`), plus\n  the `wordpress` block (admin account, title, language).\n- **Static/Node.js frontend app**: `flavor` set to `php-fpm` and `type` set to\n  `node-static`.\n\nProvisioning runs in the background, so the response returns immediately with a setup UUID\nthat identifies the job. The new website becomes reachable once provisioning finishes.",
    "method": "POST",
    "path": "/api/agency-hosting/v1/orders/{order_id}/websites/setups",
    "inputSchema": {
      "type": "object",
      "properties": {
        "order_id": {
          "type": "integer",
          "description": "Agency Plan order ID"
        },
        "datacenter_code": {
          "type": "string",
          "description": "Datacenter code where the website should be provisioned. Available codes depend on live capacity and are not a fixed set."
        },
        "flavor": {
          "type": "string",
          "description": "Setup flavor: a specific WordPress version in the format `wp-<major>.<minor>` or `wp-<major>.<minor>.<patch>` (e.g. `wp-6.8.2`), or `php-fpm` for a plain PHP stack. Generic versions like `wp-latest` are not allowed."
        },
        "settings": {
          "type": "object",
          "description": "Website settings",
          "properties": {
            "php": {
              "type": "object",
              "description": "php parameter",
              "properties": {
                "version": {
                  "type": "string",
                  "description": "PHP version"
                }
              },
              "required": [
                "version"
              ]
            }
          },
          "required": [
            "php"
          ]
        },
        "domain": {
          "type": "string",
          "description": "Primary domain to attach to the website. Omit or set to null to get a free auto-generated *.hostingersite.com subdomain instead."
        },
        "type": {
          "type": "string",
          "description": "Website type",
          "enum": [
            "horizons",
            "node-static"
          ]
        },
        "wordpress": {
          "type": "object",
          "description": "WordPress installation options",
          "properties": {
            "language": {
              "type": "string",
              "description": "language parameter"
            },
            "title": {
              "type": "string",
              "description": "title parameter"
            },
            "admin": {
              "type": "object",
              "description": "admin parameter",
              "properties": {
                "user": {
                  "type": "string",
                  "description": "user parameter"
                },
                "password": {
                  "type": "string",
                  "description": "password parameter"
                },
                "email": {
                  "type": "string",
                  "description": "email parameter"
                }
              },
              "required": [
                "user",
                "password",
                "email"
              ]
            }
          },
          "required": [
            "language",
            "title",
            "admin"
          ]
        },
        "clone": {
          "type": "object",
          "description": "Clone the new website from an existing website",
          "properties": {
            "website_uid": {
              "type": "string",
              "description": "website_uid parameter"
            }
          },
          "required": [
            "website_uid"
          ]
        },
        "derive_domain": {
          "type": "object",
          "description": "Derive the domain from an existing vhost",
          "properties": {
            "from_vhost": {
              "type": "object",
              "description": "from_vhost parameter",
              "properties": {
                "username": {
                  "type": "string",
                  "description": "username parameter"
                },
                "vhost": {
                  "type": "string",
                  "description": "vhost parameter"
                }
              },
              "required": [
                "username",
                "vhost"
              ]
            }
          },
          "required": [
            "from_vhost"
          ]
        }
      },
      "required": [
        "order_id",
        "datacenter_code",
        "flavor",
        "settings"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_getAgencyPlanWebsiteSetupStatusV1",
    "description": "Returns the current status of an Agency Plan website setup started via the setups\nendpoint.\n\nPoll this endpoint using the `setup_uuid` returned from the provisioning request until\n`status` becomes `completed`, at which point `website_uid` identifies the new website.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/orders/{order_id}/websites/setups/{setup_uuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "order_id": {
          "type": "integer",
          "description": "Agency Plan order ID"
        },
        "setup_uuid": {
          "type": "string",
          "description": "Website setup UUID"
        }
      },
      "required": [
        "order_id",
        "setup_uuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_buildAgencyPlanWebsiteNodeJSAssetsV1",
    "description": "Builds and deploys a Node.js application for an Agency Plan website from an already-uploaded archive.\n\nUpload the archive to file browser first, then provide its relative path from document root in this request.\nWebsite contents are overwritten by the build result, which is deployed to public_html.",
    "method": "POST",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/build-assets",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "archive_path": {
          "type": "string",
          "description": "Directory, relative to the website document root, where the uploaded site archive currently lives. Most commonly this is simply `public_html`."
        }
      },
      "required": [
        "website_uid",
        "archive_path"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_clearAgencyPlanWebsiteCacheV1",
    "description": "Clears cache for all domains associated with an Agency Plan website, including its preview domain.\n\nThis operation clears all cache types for the website.",
    "method": "DELETE",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/cache",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        }
      },
      "required": [
        "website_uid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_listAgencyPlanWebsiteCronJobsV1",
    "description": "Returns a paginated list of cron jobs configured for an Agency Plan website.\n\nEach entry includes the schedule expression and the command executed on that schedule.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/cron-jobs",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
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
        "website_uid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_createAgencyPlanWebsiteCronJobV1",
    "description": "Creates a cron job for an Agency Plan website from a schedule expression and a command.\n\nReturns the created cron job, including its uuid, which is required to delete the cron job.",
    "method": "POST",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/cron-jobs",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "time": {
          "type": "string",
          "description": "Cron schedule expression (standard 5-field crontab syntax)."
        },
        "command": {
          "type": "string",
          "description": "Command to run on the schedule. Must not contain pipe (|) or redirection (<, >) characters."
        }
      },
      "required": [
        "website_uid",
        "time",
        "command"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_deleteAgencyPlanWebsiteCronJobV1",
    "description": "Permanently deletes the cron job identified by its uuid from an Agency Plan website.\n\nThe operation is idempotent: deleting a cron job that does not exist succeeds without error.",
    "method": "DELETE",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/cron-jobs/{uuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "uuid": {
          "type": "string",
          "description": "Unique identifier of the cron job as returned by the list cron jobs endpoint."
        }
      },
      "required": [
        "website_uid",
        "uuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_listAgencyPlanWebsiteDatabasesV1",
    "description": "Returns a paginated list of MySQL databases created for an Agency Plan website.\n\nEach entry includes the database's non-system users.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/databases",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
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
        "website_uid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_createAgencyPlanWebsiteDatabaseV1",
    "description": "Creates a MySQL database with a dedicated user for an Agency Plan website.\n\nThe database name, username, and password must all be provided by the caller.",
    "method": "POST",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/databases",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "database_name": {
          "type": "string",
          "description": "Database name to create (alphanumeric characters)."
        },
        "database_user": {
          "type": "string",
          "description": "Database username to create alongside the database (alphanumeric characters)."
        },
        "password": {
          "type": "string",
          "description": "Password for the database user (requires mixed case, letters, and numbers)."
        }
      },
      "required": [
        "website_uid",
        "database_name",
        "database_user",
        "password"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_deleteAgencyPlanWebsiteDatabaseV1",
    "description": "Permanently deletes a MySQL database and all its data from an Agency Plan website, including its users.\n\nThe operation is idempotent: deleting a database that does not exist succeeds without error.",
    "method": "DELETE",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/databases/{database_name}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "database_name": {
          "type": "string",
          "description": "Full database name as returned by the list databases endpoint."
        }
      },
      "required": [
        "website_uid",
        "database_name"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_createAgencyPlanWebsiteDatabaseUserV1",
    "description": "Creates a user for an existing database on an Agency Plan website.\n\nEach database supports a single non-system user; creating a user for a database that already has one fails.",
    "method": "POST",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/databases/{database_name}/users",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "database_name": {
          "type": "string",
          "description": "Full database name as returned by the list databases endpoint."
        },
        "database_user": {
          "type": "string",
          "description": "Database username to create (alphanumeric and underscores)."
        },
        "password": {
          "type": "string",
          "description": "Password for the database user (requires mixed case, letters, and numbers)."
        },
        "host": {
          "type": "string",
          "description": "Host the user connects from (IPv4, IPv6, % wildcard, or localhost). Defaults to localhost."
        }
      },
      "required": [
        "website_uid",
        "database_name",
        "database_user",
        "password"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_deleteAgencyPlanWebsiteDatabaseUserV1",
    "description": "Permanently deletes a database user from an Agency Plan website database, revoking all access it had.\n\nThe operation is idempotent: deleting a user that does not exist succeeds without error.",
    "method": "DELETE",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/databases/{database_name}/users/{database_user_name}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "database_name": {
          "type": "string",
          "description": "Full database name as returned by the list databases endpoint."
        },
        "database_user_name": {
          "type": "string",
          "description": "Database username as returned by the list databases endpoint."
        }
      },
      "required": [
        "website_uid",
        "database_name",
        "database_user_name"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_getAgencyPlanWebsiteDetailsV1",
    "description": "Retrieves detailed information about a specific Agency Plan website, including configuration,\nstatus, metadata, hosting plan details, and resource quotas.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/websites/{website_uid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        }
      },
      "required": [
        "website_uid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_deleteAgencyPlanWebsiteV1",
    "description": "Deletes an Agency Plan website and schedules cleanup of its resources.\n\nThis action is irreversible. Website files, databases, and linked domains are removed.",
    "method": "DELETE",
    "path": "/api/agency-hosting/v1/websites/{website_uid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        }
      },
      "required": [
        "website_uid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  },
  {
    "name": "agency-hosting_listRunningAgencyPlanWebsiteProcessesV1",
    "description": "Lists active and recently completed asynchronous processes for an Agency Plan website.\n\nEach process has a unique ID (for tracking), a type, and a status (running, completed, failed).\nPoll this endpoint after initiating async operations (SSL setup, backups, cloning) to track progress.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/processes",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        }
      },
      "required": [
        "website_uid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "agency-hosting"
  }
];
export default tools;
