// Auto-generated tool list for group: wordpress
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
  }
];
export default tools;
