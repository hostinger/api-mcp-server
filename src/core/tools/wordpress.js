// Auto-generated tool list for group: wordpress
export default [
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
