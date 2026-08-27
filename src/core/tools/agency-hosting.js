// Auto-generated tool list for group: agency-hosting
export default [
  {
    "name": "agency-hosting_deployNodeStaticWebsite",
    "title": "Deploy node static website",
    "annotations": {
      "title": "Deploy node static website",
      "readOnlyHint": false,
      "destructiveHint": true
    },
    "topic": "agency-hosting",
    "description": "Deploy a node-static Agency Plan (h5g) website from an archive file. WARNING: this overwrites the website's existing contents and cannot be undone — always confirm with the user before proceeding. Use this for Agency Plan websites of type node-static (a Node.js-built static site that requires a build step or a plain simple static site). The tool resolves the website from its domain, uploads the archive to the website's file browser over TUS, and triggers the build-assets process which builds the site and deploys the result to public_html. This operation is synchronous: the build and deployment complete before the tool returns, so the website is live as soon as the tool finishes successfully — there is no separate asynchronous build to wait for or poll. Upload credentials are generated and used internally — do not call a separate upload-url endpoint or upload the archive yourself, this tool does it end-to-end. For plain PHP applications that should be extracted as-is, use agencyHosting_deployPhpApplication instead. The website UID is automatically resolved from the domain.",
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
    "name": "agency-hosting_deployPhpApplication",
    "title": "Deploy PHP application",
    "annotations": {
      "title": "Deploy PHP application",
      "readOnlyHint": false,
      "destructiveHint": true
    },
    "topic": "agency-hosting",
    "description": "Deploy a PHP (or other non-build) Agency Plan (h5g) website from an archive file. WARNING: this overwrites the website's existing contents and cannot be undone — always confirm with the user before proceeding. Use this for Agency Plan websites where the archive contents should be extracted and served as-is with no build step (e.g., PHP applications). The tool resolves the website from its domain, uploads the archive to the website's file browser over TUS, and triggers the import-archive process which overwrites the website contents with the archive contents. This operation is synchronous: the archive is extracted and deployed before the tool returns, so the website is live as soon as the tool finishes successfully — there is no separate asynchronous build to wait for or poll. Upload credentials are generated and used internally — do not call a separate upload-url endpoint or upload the archive yourself, this tool does it end-to-end. For node-static websites that require a build step, use agencyHosting_deployNodeStaticWebsite instead. The website UID is automatically resolved from the domain.",
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
    "name": "agency-hosting_listAvailableDatacentersV1",
    "title": "List available datacenters",
    "annotations": {
      "title": "List available datacenters",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "name": "agency-hosting_changeWebsiteDomainV1",
    "title": "Change website domain",
    "annotations": {
      "title": "Change website domain",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
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
    "name": "agency-hosting_linkDomainToWebsiteV1",
    "title": "Link domain to website",
    "annotations": {
      "title": "Link domain to website",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "name": "agency-hosting_listDomainsV1",
    "title": "List domains",
    "annotations": {
      "title": "List domains",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "name": "agency-hosting_unlinkDomainFromWebsiteV1",
    "title": "Unlink domain from website",
    "annotations": {
      "title": "Unlink domain from website",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
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
    "name": "agency-hosting_generateUploadURLV1",
    "title": "Generate upload URL",
    "annotations": {
      "title": "Generate upload URL",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Generate a file browser upload URL with authentication credentials for uploading files\nto an Agency Plan website's file storage.\n\nReturns `url`, `auth_key` and `rest_auth_key`. Use these to upload a file to the\nwebsite's file storage via the TUS resumable upload protocol (TUS 1.0.0). Send\n`X-Auth: {auth_key}` and `X-Auth-Rest: {rest_auth_key}` headers on every request below.\n\n1. Create the upload: `POST` to `{url}/{relative_file_path}?override=true` with headers\n   `upload-length: {file size in bytes}` and `upload-offset: 0`. Expect `201 Created`.\n2. Upload the file: send the file bytes to the same location (any TUS 1.0.0 client, or\n   `PATCH` requests with an `upload-offset` header tracking progress) until complete.\n\n`relative_file_path` is the destination path inside the website's file storage, e.g.\n`app.zip`.\n\nInstead of a TUS client, plain `curl` also works:\n```\nFILE=app.zip\nSIZE=$(stat -f%z \"$FILE\")   # stat -c%s on Linux\n\ncurl -i -X POST \"{url}/${FILE}?override=true\" \\\n  -H \"X-Auth: {auth_key}\" \\\n  -H \"X-Auth-Rest: {rest_auth_key}\" \\\n  -H \"Tus-Resumable: 1.0.0\" \\\n  -H \"Upload-Length: ${SIZE}\" \\\n  -H \"Upload-Offset: 0\"\n# -> 201 Created\n\ncurl -i -X PATCH \"{url}/${FILE}?override=true\" \\\n  -H \"X-Auth: {auth_key}\" \\\n  -H \"X-Auth-Rest: {rest_auth_key}\" \\\n  -H \"Tus-Resumable: 1.0.0\" \\\n  -H \"Content-Type: application/offset+octet-stream\" \\\n  -H \"Upload-Offset: 0\" \\\n  --data-binary \"@${FILE}\"\n# -> 204 No Content, Upload-Offset response header equals SIZE when done\n```",
    "method": "POST",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/files/upload-urls",
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
    "name": "agency-hosting_importWebsiteFromArchiveV1",
    "title": "Import website from archive",
    "annotations": {
      "title": "Import website from archive",
      "readOnlyHint": false,
      "destructiveHint": true
    },
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
    "name": "agency-hosting_listAgencyPlanOrderDiskUsageMetricsV1",
    "title": "List agency plan order disk usage metrics",
    "annotations": {
      "title": "List agency plan order disk usage metrics",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Returns aggregated disk and inode usage for the Agency Plan order over the\nselected time frame, plus the plan quotas. Figures cover the whole order\naccount. Values may be up to one hour stale. CPU, memory, and process usage\nare on the resource-usage-metrics endpoint.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/orders/{order_id}/disk-usage-metrics",
    "inputSchema": {
      "type": "object",
      "properties": {
        "order_id": {
          "type": "integer",
          "description": "Agency Plan order ID"
        },
        "time_frame_days": {
          "type": "integer",
          "description": "Length of the window in days, ending now. Bucket size grows with the window.",
          "enum": [
            1,
            7,
            14,
            30
          ]
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
    "name": "agency-hosting_listOrdersV1",
    "title": "List orders",
    "annotations": {
      "title": "List orders",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Returns a paginated list of Agency Plan orders accessible to the authenticated client.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/orders",
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
    "name": "agency-hosting_listOrderResourceUsageMetricsV1",
    "title": "List order resource usage metrics",
    "annotations": {
      "title": "List order resource usage metrics",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Returns aggregated CPU, memory, and process usage for the Agency Plan order\nover the selected time frame, plus the plan quotas and a per-website\nbreakdown. Each website is identified by uid. Suspended and deleted websites\nare excluded from both the order totals and the per-website breakdown.\nValues may be up to one hour stale. Disk and inode usage are on the\ndisk-usage-metrics endpoint.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/orders/{order_id}/resource-usage-metrics",
    "inputSchema": {
      "type": "object",
      "properties": {
        "order_id": {
          "type": "integer",
          "description": "Agency Plan order ID"
        },
        "time_frame_hours": {
          "type": "integer",
          "description": "Length of the window in hours, ending now. Bucket size grows with the window.",
          "enum": [
            1,
            24,
            168,
            336,
            720
          ]
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
    "name": "agency-hosting_listPHPExtensionsForAWebsiteV1",
    "title": "List PHP extensions for a website",
    "annotations": {
      "title": "List PHP extensions for a website",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Lists every PHP extension available to an Agency Plan website and whether it is currently enabled.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/php-settings/extensions",
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
    "name": "agency-hosting_replaceWebsitePHPExtensionsV1",
    "title": "Replace website PHP extensions",
    "annotations": {
      "title": "Replace website PHP extensions",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Replaces the set of PHP extensions enabled on an Agency Plan website with the ones provided. Any toggleable extension not in the request is disabled, so call the extensions endpoint first and send the full desired set. Extensions compiled into PHP, reported with the \"built-in\" state, are always active and are unaffected.",
    "method": "PUT",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/php-settings/extensions",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "extensions": {
          "type": "array",
          "description": "Extension names, exactly as returned by the extensions endpoint.",
          "items": {
            "type": "string",
            "description": "extensions parameter"
          }
        }
      },
      "required": [
        "website_uid",
        "extensions"
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
    "name": "agency-hosting_listPHPOptionsForAWebsiteV1",
    "title": "List PHP options for a website",
    "annotations": {
      "title": "List PHP options for a website",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Lists the php.ini directives that can be configured for an Agency Plan website, each with its default, the value currently in effect, and the values it accepts.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/php-settings/options",
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
    "name": "agency-hosting_replaceWebsitePHPOptionsV1",
    "title": "Replace website PHP options",
    "annotations": {
      "title": "Replace website PHP options",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Replaces the custom php.ini values on an Agency Plan website with the ones provided. Any option not in the request is reset to its default, so call the options endpoint first and send the full desired set. Sending an empty array resets every option to its default.",
    "method": "PUT",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/php-settings/options",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "options": {
          "type": "array",
          "description": "Option names and values. Each name must be one of the options returned by the options endpoint, and each value must satisfy that option's allowed_values when it declares them.",
          "items": {
            "type": "object",
            "description": "options parameter",
            "properties": {
              "name": {
                "type": "string",
                "description": "php.ini directive name."
              },
              "value": {
                "type": "string",
                "description": "Value to apply."
              }
            },
            "required": [
              "name",
              "value"
            ]
          }
        }
      },
      "required": [
        "website_uid",
        "options"
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
    "name": "agency-hosting_listAvailablePHPVersionsForAnOrderV1",
    "title": "List available PHP versions for an order",
    "annotations": {
      "title": "List available PHP versions for an order",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Lists the PHP versions available to websites created under an Agency Plan order, determined by the server the order is hosted on. Use this before creating a website; for a website that already exists, call the website-scoped versions endpoint instead.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/orders/{order_id}/websites/php-settings/versions",
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
    "name": "agency-hosting_listAvailablePHPVersionsForAWebsiteV1",
    "title": "List available PHP versions for a website",
    "annotations": {
      "title": "List available PHP versions for a website",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Lists the PHP versions an Agency Plan website can be switched to. The version the website is currently running is returned as settings.php.version by the website details endpoint.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/php-settings/versions",
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
    "name": "agency-hosting_updateWebsitePHPVersionV1",
    "title": "Update website PHP version",
    "annotations": {
      "title": "Update website PHP version",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Switches an Agency Plan website to a different PHP version. Call the available versions endpoint first to see which versions can be selected. The website restarts on the new version, so requests served during the switch may fail and code that is incompatible with the target version will break.",
    "method": "PATCH",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/php-settings/version",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "version": {
          "type": "string",
          "description": "PHP version to switch the website to, as major.minor. Must be one of the versions returned by the available versions endpoint."
        }
      },
      "required": [
        "website_uid",
        "version"
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
    "name": "agency-hosting_createANewWebsiteV1",
    "title": "Create a new website",
    "annotations": {
      "title": "Create a new website",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "name": "agency-hosting_getWebsiteSetupStatusV1",
    "title": "Get website setup status",
    "annotations": {
      "title": "Get website setup status",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "name": "agency-hosting_buildWebsiteNodeJSAssetsV1",
    "title": "Build website Node.js assets",
    "annotations": {
      "title": "Build website Node.js assets",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "name": "agency-hosting_clearWebsiteCacheV1",
    "title": "Clear website cache",
    "annotations": {
      "title": "Clear website cache",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
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
    "name": "agency-hosting_listWebsiteCronJobsV1",
    "title": "List website cron jobs",
    "annotations": {
      "title": "List website cron jobs",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "name": "agency-hosting_createWebsiteCronJobV1",
    "title": "Create website cron job",
    "annotations": {
      "title": "Create website cron job",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "name": "agency-hosting_deleteWebsiteCronJobV1",
    "title": "Delete website cron job",
    "annotations": {
      "title": "Delete website cron job",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
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
    "name": "agency-hosting_listWebsiteDatabasesV1",
    "title": "List website databases",
    "annotations": {
      "title": "List website databases",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "name": "agency-hosting_createWebsiteDatabaseV1",
    "title": "Create website database",
    "annotations": {
      "title": "Create website database",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "name": "agency-hosting_deleteWebsiteDatabaseV1",
    "title": "Delete website database",
    "annotations": {
      "title": "Delete website database",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
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
    "name": "agency-hosting_createWebsiteDatabaseUserV1",
    "title": "Create website database user",
    "annotations": {
      "title": "Create website database user",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "name": "agency-hosting_deleteWebsiteDatabaseUserV1",
    "title": "Delete website database user",
    "annotations": {
      "title": "Delete website database user",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
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
    "name": "agency-hosting_getWebsiteDetailsV1",
    "title": "Get website details",
    "annotations": {
      "title": "Get website details",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "name": "agency-hosting_deleteWebsiteV1",
    "title": "Delete website",
    "annotations": {
      "title": "Delete website",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Permanently deletes an Agency Plan website. Deletion is processed asynchronously: the\nwebsite is immediately transitioned to a deleting state and the underlying server\nresources are removed in the background.",
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
    "name": "agency-hosting_listAgencyPlanWebsitesV1",
    "title": "List agency plan websites",
    "annotations": {
      "title": "List agency plan websites",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve a paginated list of Agency Plan websites (H5G, Builder, and Horizons) accessible to\nthe authenticated client.\n\nThis endpoint returns websites from your hosting accounts as well as\nwebsites from other client hosting accounts that have shared access\nwith you.\n\nThe response shape differs per platform — see the `platform` field on each item.\n\nUse `website_types` to list only websites of a given detected type, e.g. only\nWordPress websites (`website_types=wordpress`) or only Node.js websites\n(`website_types=nodejs`). Combine with `order_ids`, `states`, or `domain` for more\ntargeted results.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/websites",
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
        "order_ids": {
          "type": "array",
          "description": "Filter by order IDs. Accepts a comma-separated list.",
          "items": {
            "type": "integer",
            "description": "order_ids parameter"
          }
        },
        "states": {
          "type": "array",
          "description": "Filter by website state. Accepts a comma-separated list.",
          "items": {
            "type": "string",
            "description": "states parameter",
            "enum": [
              "active",
              "locked",
              "suspended",
              "deleting",
              "deleted"
            ]
          }
        },
        "website_types": {
          "type": "array",
          "description": "Filter by detected website type, e.g. wordpress,nodejs. Accepts a comma-separated list.",
          "items": {
            "type": "string",
            "description": "website_types parameter",
            "enum": [
              "wordpress",
              "builder",
              "horizons",
              "nodejs",
              "other"
            ]
          }
        },
        "domain": {
          "type": "string",
          "description": "Filter by domain name (case-insensitive substring match)"
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
    "name": "agency-hosting_listWebsiteProcessesV1",
    "title": "List website processes",
    "annotations": {
      "title": "List website processes",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
  },
  {
    "name": "agency-hosting_changeWordPressVersionV1",
    "title": "Change WordPress version",
    "annotations": {
      "title": "Change WordPress version",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Changes the installed WordPress core version on an Agency Plan website to one of the versions available for installation.",
    "method": "PATCH",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/wordpress/settings/version",
    "inputSchema": {
      "type": "object",
      "properties": {
        "website_uid": {
          "type": "string",
          "description": "Agency Plan website UID"
        },
        "version": {
          "type": "string",
          "description": "Target WordPress core version to install. Must be one of the available versions."
        }
      },
      "required": [
        "website_uid",
        "version"
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
    "name": "agency-hosting_getWordPressSettingsV1",
    "title": "Get WordPress settings",
    "annotations": {
      "title": "Get WordPress settings",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Returns the current WordPress settings for an Agency Plan website: installed core version,\nLiteSpeed Cache plugin status, object cache status, and maintenance mode status.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/wordpress/settings",
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
    "name": "agency-hosting_listAvailableWordPressVersionsV1",
    "title": "List available WordPress versions",
    "annotations": {
      "title": "List available WordPress versions",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Lists the WordPress core versions available for installation on an Agency Plan website.",
    "method": "GET",
    "path": "/api/agency-hosting/v1/websites/{website_uid}/wordpress/settings/versions",
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
