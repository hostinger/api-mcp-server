// Auto-generated tool list for group: wordpress
export default [
  {
    "name": "hosting_showAIOptionStatusV1",
    "title": "Show AI option status",
    "annotations": {
      "title": "Show AI option status",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Show the current AI option status for the Hostinger Tools plugin on the\nspecified WordPress installation. Filter by `option` to return a single\noption, or omit it to return all options.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/hostinger-plugins/ai-option/status",
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
        "option": {
          "type": "string",
          "description": "Filter the status by a single AI option.",
          "enum": [
            "llmstxt",
            "web2agent"
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
    "name": "hosting_setAIOptionStatusV1",
    "title": "Set AI option status",
    "annotations": {
      "title": "Set AI option status",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Enable or disable an AI option for the Hostinger Tools plugin on the specified\nWordPress installation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "PATCH",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/hostinger-plugins/ai-option/status",
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
        "option": {
          "type": "string",
          "description": "AI option name",
          "enum": [
            "llmstxt",
            "web2agent"
          ]
        },
        "enable": {
          "type": "boolean",
          "description": "Enable (true) or disable (false) the AI option."
        }
      },
      "required": [
        "username",
        "software",
        "option",
        "enable"
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
    "name": "hosting_checkIfWordPressInstallationsAreValidV1",
    "title": "Check if WordPress installations are valid",
    "annotations": {
      "title": "Check if WordPress installations are valid",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Check whether one or more WordPress installations are valid and working\ncorrectly. Detects broken installations caused by missing files, broken\nplugins, themes and similar issues.\n\nProvide the WordPress installation (software) identifiers in the body. They\ncan be obtained from GET /api/hosting/v1/wordpress/installations (the `id`\nfield).",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/installations/check-is-valid",
    "inputSchema": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "username parameter"
        },
        "software_ids": {
          "type": "array",
          "description": "WordPress installation (software) identifiers to validate.",
          "items": {
            "type": "string",
            "description": "Software identifier"
          }
        },
        "force": {
          "type": "boolean",
          "description": "Force fresh validation without cache. Preferable for troubleshooting purposes."
        }
      },
      "required": [
        "username",
        "software_ids"
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
    "name": "hosting_deleteWordPressInstallationV1",
    "title": "Delete WordPress installation",
    "annotations": {
      "title": "Delete WordPress installation",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Delete the specified WordPress installation, with optional file and database\nremoval. This removes all associated components including plugins, themes,\nstaging websites and any other related data.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "DELETE",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}",
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
    "name": "hosting_detectWordPressInstallationsV1",
    "title": "Detect WordPress installations",
    "annotations": {
      "title": "Detect WordPress installations",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Trigger a background scan to detect WordPress installations for the account.\n\nThis operation is asynchronous: a successful response only means the scan has\nbeen queued. Poll GET /api/hosting/v1/wordpress/installations to fetch the\ndetected installations once the scan completes.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/installations/detect",
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
    "group": "wordpress"
  },
  {
    "name": "hosting_importWordPressWebsiteV1",
    "title": "Import WordPress website",
    "annotations": {
      "title": "Import WordPress website",
      "readOnlyHint": false,
      "destructiveHint": true
    },
    "description": "Import WordPress website to the specified domain.\n\nWARNING: this overwrites the website's existing contents and cannot be undone —\nverify this is intended before calling this endpoint.\n\nThis endpoint allows you to import a WordPress website from archive and\ndatabase files that have been uploaded to the website's directory.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/wordpress/import",
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
        "archive_path": {
          "type": "string",
          "description": "Path to the WordPress archive file (relative to website root)"
        },
        "sql_path": {
          "type": "string",
          "description": "Path to the database SQL file (relative to website root)"
        }
      },
      "required": [
        "username",
        "domain",
        "archive_path",
        "sql_path"
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
    "name": "hosting_installWordPressV1",
    "title": "Install WordPress",
    "annotations": {
      "title": "Install WordPress",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "title": "List WordPress installations",
    "annotations": {
      "title": "List WordPress installations",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
          "description": "Filter by domain name (case-insensitive substring match)"
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
    "name": "hosting_listAvailableWordPressCoreUpdatesV1",
    "title": "List available WordPress core updates",
    "annotations": {
      "title": "List available WordPress core updates",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "List available WordPress core updates for the specified installation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/updates",
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
    "name": "hosting_getInstallationJWTTokenV1",
    "title": "Get installation JWT token",
    "annotations": {
      "title": "Get installation JWT token",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Return a JWT token used to authenticate requests against the specified\nWordPress installation, including its MCP (Model Context Protocol) endpoint.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/jwt-token",
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
    "name": "hosting_showWordPressCoreVersionV1",
    "title": "Show WordPress core version",
    "annotations": {
      "title": "Show WordPress core version",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Show the WordPress core version for the specified installation, along with\nknown vulnerabilities affecting it.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/version",
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
    "name": "hosting_updateWordPressCoreV1",
    "title": "Update WordPress core",
    "annotations": {
      "title": "Update WordPress core",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Update the WordPress core for the specified installation (minor update or a\nspecific version).\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).\n\nThis operation is asynchronous: a successful response only means the update\njob has been queued.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/update",
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
        "minor": {
          "type": "boolean",
          "description": "Update the minor version only."
        },
        "version": {
          "type": "string",
          "description": "Update to a specific WordPress core version."
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
    "name": "hosting_purgeLiteSpeedCacheV1",
    "title": "Purge LiteSpeed cache",
    "annotations": {
      "title": "Purge LiteSpeed cache",
      "readOnlyHint": false,
      "destructiveHint": true
    },
    "description": "Purge the LiteSpeed Cache for the specified WordPress installation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/litespeed-cache/purge",
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
    "name": "hosting_showLiteSpeedCacheStatusV1",
    "title": "Show LiteSpeed cache status",
    "annotations": {
      "title": "Show LiteSpeed cache status",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Show the LiteSpeed Cache status for the specified WordPress installation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/litespeed-cache/status",
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
    "name": "hosting_createLoginLinksV1",
    "title": "Create login links",
    "annotations": {
      "title": "Create login links",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Create temporary auto-login links for the specified WordPress installation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/login/links",
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
    "name": "hosting_showMaintenanceStatusV1",
    "title": "Show maintenance status",
    "annotations": {
      "title": "Show maintenance status",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Show the maintenance mode status for the specified WordPress installation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/maintenance/status",
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
    "name": "hosting_toggleMaintenanceModeV1",
    "title": "Toggle maintenance mode",
    "annotations": {
      "title": "Toggle maintenance mode",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Enable or disable maintenance mode for the specified WordPress installation,\nbased on the `enabled` flag.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "PATCH",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/maintenance/toggle",
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
        "enabled": {
          "type": "boolean",
          "description": "Enable (true) or disable (false) maintenance mode for the WordPress installation."
        }
      },
      "required": [
        "username",
        "software",
        "enabled"
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
    "name": "hosting_showMemcachedObjectCacheStatusV1",
    "title": "Show memcached object cache status",
    "annotations": {
      "title": "Show memcached object cache status",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Show the Memcached object cache status for the specified WordPress\ninstallation.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "GET",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/memcached/status",
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
    "name": "hosting_toggleMemcachedObjectCacheV1",
    "title": "Toggle memcached object cache",
    "annotations": {
      "title": "Toggle memcached object cache",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Activate or deactivate the Memcached object cache for the specified WordPress\ninstallation, based on the `enabled` flag.\n\nProvide the WordPress installation (software) identifier in the path. It can\nbe obtained from GET /api/hosting/v1/wordpress/installations (the `id` field).",
    "method": "PATCH",
    "path": "/api/hosting/v1/accounts/{username}/wordpress/{software}/memcached/toggle",
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
        "enabled": {
          "type": "boolean",
          "description": "Activate (true) or deactivate (false) the Memcached object cache for the WordPress installation."
        }
      },
      "required": [
        "username",
        "software",
        "enabled"
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
    "name": "hosting_activateWordPressPluginV1",
    "title": "Activate WordPress plugin",
    "annotations": {
      "title": "Activate WordPress plugin",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "title": "Deactivate WordPress plugin",
    "annotations": {
      "title": "Deactivate WordPress plugin",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "name": "hosting_deployWordPressPluginV1",
    "title": "Deploy WordPress plugin",
    "annotations": {
      "title": "Deploy WordPress plugin",
      "readOnlyHint": false,
      "destructiveHint": true
    },
    "description": "Deploy a WordPress plugin from an already uploaded directory.\n\nThis endpoint allows you to deploy a WordPress plugin that has been uploaded to the website's directory.\nThe plugin will be activated and made available in the WordPress admin panel.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/wordpress/plugins/deploy",
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
        "slug": {
          "type": "string",
          "description": "Slug of the plugin"
        },
        "plugin_path": {
          "type": "string",
          "description": "Relative path to the plugin directory from wp-content/plugins"
        }
      },
      "required": [
        "username",
        "domain",
        "slug",
        "plugin_path"
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
    "title": "Install WordPress plugins",
    "annotations": {
      "title": "Install WordPress plugins",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "title": "List available WordPress plugins",
    "annotations": {
      "title": "List available WordPress plugins",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "title": "List installed WordPress plugins",
    "annotations": {
      "title": "List installed WordPress plugins",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "title": "Search WordPress plugins",
    "annotations": {
      "title": "Search WordPress plugins",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "title": "List suggested WordPress plugins",
    "annotations": {
      "title": "List suggested WordPress plugins",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "title": "Check if WooCommerce is installed",
    "annotations": {
      "title": "Check if WooCommerce is installed",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Check whether WooCommerce is installed on any WordPress installation of a\ndomain. Optionally filter by domain to scope the check.",
    "method": "GET",
    "path": "/api/hosting/v1/wordpress/plugins/is-woocommerce-installed",
    "inputSchema": {
      "type": "object",
      "properties": {
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
    "group": "wordpress"
  },
  {
    "name": "hosting_uninstallWordPressPluginsV1",
    "title": "Uninstall WordPress plugins",
    "annotations": {
      "title": "Uninstall WordPress plugins",
      "readOnlyHint": false,
      "destructiveHint": true
    },
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
    "title": "Update hostinger WordPress plugin",
    "annotations": {
      "title": "Update hostinger WordPress plugin",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "title": "Update WordPress plugins",
    "annotations": {
      "title": "Update WordPress plugins",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "title": "Activate WordPress theme",
    "annotations": {
      "title": "Activate WordPress theme",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "name": "hosting_deployWordPressThemeV1",
    "title": "Deploy WordPress theme",
    "annotations": {
      "title": "Deploy WordPress theme",
      "readOnlyHint": false,
      "destructiveHint": true
    },
    "description": "Deploy a WordPress theme from an already uploaded directory.\n\nThis endpoint allows you to deploy a WordPress theme that has been uploaded to the website's directory.\nThe theme can be optionally activated after deployment.",
    "method": "POST",
    "path": "/api/hosting/v1/accounts/{username}/websites/{domain}/wordpress/themes/deploy",
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
        "slug": {
          "type": "string",
          "description": "Slug of the theme"
        },
        "theme_path": {
          "type": "string",
          "description": "Relative path to the theme directory from wp-content/themes"
        },
        "is_activated": {
          "type": "boolean",
          "description": "Whether to activate the theme after deployment"
        }
      },
      "required": [
        "username",
        "domain",
        "slug",
        "theme_path"
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
    "title": "Install WordPress theme",
    "annotations": {
      "title": "Install WordPress theme",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "title": "List installed WordPress themes",
    "annotations": {
      "title": "List installed WordPress themes",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "title": "List WordPress themes",
    "annotations": {
      "title": "List WordPress themes",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "title": "Uninstall WordPress themes",
    "annotations": {
      "title": "Uninstall WordPress themes",
      "readOnlyHint": false,
      "destructiveHint": true
    },
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
    "title": "Update WordPress themes",
    "annotations": {
      "title": "Update WordPress themes",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
