// Auto-generated tool list for group: mail
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
    "name": "mail_getMailOrderListV1",
    "description": "Retrieve a paginated list of mail orders associated with your account.\n\nUse this endpoint to monitor your mail services, including their status,\nplan, attached domain, and expiration details.",
    "method": "GET",
    "path": "/api/mail/v1/orders",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Filter orders by domain name (exact match)"
        },
        "status": {
          "type": "string",
          "description": "Filter orders by status",
          "enum": [
            "pending_setup",
            "active",
            "suspended"
          ]
        },
        "is_trial": {
          "type": "boolean",
          "description": "Filter orders by trial state"
        },
        "sort": {
          "type": "string",
          "description": "Sort orders by field. Prefix with `-` for descending order.",
          "enum": [
            "created_at",
            "-created_at",
            "expires_at",
            "-expires_at"
          ]
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
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "mail"
  }
];
export default tools;
