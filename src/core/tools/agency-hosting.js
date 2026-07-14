// Auto-generated tool list for group: agency-hosting
export default [
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
