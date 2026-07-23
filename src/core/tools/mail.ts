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
    "name": "mail_listAccessLogsV1",
    "description": "Retrieve paginated access logs for the domain attached to the given\nmail order. Supports filtering by account, date range, protocol,\nstatus, and deletion flag. Results are sorted by timestamp descending.",
    "method": "GET",
    "path": "/api/mail/v1/orders/{orderId}/logs/access",
    "inputSchema": {
      "type": "object",
      "properties": {
        "orderId": {
          "type": "string",
          "description": "Order resource ID"
        },
        "account": {
          "type": "string",
          "description": "Filter log entries by a specific email account"
        },
        "date": {
          "type": "string",
          "description": "Exact date filter (YYYY-MM-DD). Takes precedence over `from_date`/`to_date` when both are given."
        },
        "from_date": {
          "type": "string",
          "description": "Date range start (RFC 3339)"
        },
        "to_date": {
          "type": "string",
          "description": "Date range end (RFC 3339)"
        },
        "status": {
          "type": "string",
          "description": "Filter log entries by status",
          "enum": [
            "Successful",
            "Failed"
          ]
        },
        "protocol": {
          "type": "string",
          "description": "Filter access log entries by protocol",
          "enum": [
            "imap",
            "pop3",
            "smtp"
          ]
        },
        "has_deletions": {
          "type": "boolean",
          "description": "Filter access log entries by whether the session had deletions"
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
        "orderId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "mail"
  },
  {
    "name": "mail_listActionLogsV1",
    "description": "Retrieve paginated account action logs (administrative and user\nactions) for the given mail order. Supports filtering by account,\ndate range, and status. Results are sorted by timestamp descending.",
    "method": "GET",
    "path": "/api/mail/v1/orders/{orderId}/logs/action",
    "inputSchema": {
      "type": "object",
      "properties": {
        "orderId": {
          "type": "string",
          "description": "Order resource ID"
        },
        "account": {
          "type": "string",
          "description": "Filter log entries by a specific email account"
        },
        "date": {
          "type": "string",
          "description": "Exact date filter (YYYY-MM-DD). Takes precedence over `from_date`/`to_date` when both are given."
        },
        "from_date": {
          "type": "string",
          "description": "Date range start (RFC 3339)"
        },
        "to_date": {
          "type": "string",
          "description": "Date range end (RFC 3339)"
        },
        "status": {
          "type": "string",
          "description": "Filter log entries by status",
          "enum": [
            "Successful",
            "Failed"
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
      "required": [
        "orderId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "mail"
  },
  {
    "name": "mail_listInboundLogsV1",
    "description": "Retrieve paginated inbound (received mail) delivery logs for the\ndomain attached to the given mail order. Supports filtering by\naccount, date range, status, sender, and recipient. Results are\nsorted by timestamp descending.",
    "method": "GET",
    "path": "/api/mail/v1/orders/{orderId}/logs/inbound",
    "inputSchema": {
      "type": "object",
      "properties": {
        "orderId": {
          "type": "string",
          "description": "Order resource ID"
        },
        "account": {
          "type": "string",
          "description": "Filter log entries by a specific email account"
        },
        "date": {
          "type": "string",
          "description": "Exact date filter (YYYY-MM-DD). Takes precedence over `from_date`/`to_date` when both are given."
        },
        "from_date": {
          "type": "string",
          "description": "Date range start (RFC 3339)"
        },
        "to_date": {
          "type": "string",
          "description": "Date range end (RFC 3339)"
        },
        "status": {
          "type": "string",
          "description": "Filter log entries by status",
          "enum": [
            "Successful",
            "Failed"
          ]
        },
        "sender": {
          "type": "string",
          "description": "Filter log entries by sender. Accepts a full email address or a domain."
        },
        "recipient": {
          "type": "string",
          "description": "Filter log entries by recipient. Accepts a full email address or a domain."
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
        "orderId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "mail"
  },
  {
    "name": "mail_listMailboxActionLogsV1",
    "description": "Retrieve paginated mailbox action logs (message and mailbox events)\nfor a mailbox in the given mail order. The mailbox email must belong\nto the order's domain. Supports date range and event type filters.\nResults are sorted by timestamp descending.",
    "method": "GET",
    "path": "/api/mail/v1/orders/{orderId}/logs/mailbox-actions",
    "inputSchema": {
      "type": "object",
      "properties": {
        "orderId": {
          "type": "string",
          "description": "Order resource ID"
        },
        "email": {
          "type": "string",
          "description": "Mailbox email address. Must belong to the order's domain."
        },
        "date": {
          "type": "string",
          "description": "Exact date filter (YYYY-MM-DD). Takes precedence over `from_date`/`to_date` when both are given."
        },
        "from_date": {
          "type": "string",
          "description": "Date range start (RFC 3339)"
        },
        "to_date": {
          "type": "string",
          "description": "Date range end (RFC 3339)"
        },
        "event": {
          "type": "string",
          "description": "Filter mailbox action log entries by event type",
          "enum": [
            "MessageNew",
            "MessageRead",
            "MessageAppend",
            "MessageExpunge",
            "MailboxCreate",
            "MailboxDelete",
            "MailboxRename"
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
      "required": [
        "orderId",
        "email"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "mail"
  },
  {
    "name": "mail_listOutboundLogsV1",
    "description": "Retrieve paginated outbound (sent mail) delivery logs for the domain\nattached to the given mail order. Supports filtering by account, date\nrange, status, sender, and recipient. Results are sorted by timestamp\ndescending.",
    "method": "GET",
    "path": "/api/mail/v1/orders/{orderId}/logs/outbound",
    "inputSchema": {
      "type": "object",
      "properties": {
        "orderId": {
          "type": "string",
          "description": "Order resource ID"
        },
        "account": {
          "type": "string",
          "description": "Filter log entries by a specific email account"
        },
        "date": {
          "type": "string",
          "description": "Exact date filter (YYYY-MM-DD). Takes precedence over `from_date`/`to_date` when both are given."
        },
        "from_date": {
          "type": "string",
          "description": "Date range start (RFC 3339)"
        },
        "to_date": {
          "type": "string",
          "description": "Date range end (RFC 3339)"
        },
        "status": {
          "type": "string",
          "description": "Filter log entries by status",
          "enum": [
            "Successful",
            "Failed"
          ]
        },
        "sender": {
          "type": "string",
          "description": "Filter log entries by sender. Accepts a full email address or a domain."
        },
        "recipient": {
          "type": "string",
          "description": "Filter log entries by recipient. Accepts a full email address or a domain."
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
        "orderId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "mail"
  },
  {
    "name": "mail_listMailboxesV1",
    "description": "Retrieve a paginated list of mailboxes belonging to a mail order.\n\nUse this endpoint to monitor mailboxes of your mail service, including\ntheir status, enabled protocols, attached resource counts, and\nperiodically synced usage numbers (usage may lag behind live values).",
    "method": "GET",
    "path": "/api/mail/v1/orders/{orderId}/mailboxes",
    "inputSchema": {
      "type": "object",
      "properties": {
        "orderId": {
          "type": "string",
          "description": "Order resource ID"
        },
        "search": {
          "type": "string",
          "description": "Filter mailboxes whose email address contains the given string"
        },
        "sort": {
          "type": "string",
          "description": "Sort mailboxes by field. Prefix with `-` for descending order.",
          "enum": [
            "address",
            "-address"
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
      "required": [
        "orderId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "mail"
  },
  {
    "name": "mail_createMailboxV1",
    "description": "Create a mailbox under the given mail order. The full email address is\ncomposed from the given local part and the domain of the order.",
    "method": "POST",
    "path": "/api/mail/v1/orders/{orderId}/mailboxes",
    "inputSchema": {
      "type": "object",
      "properties": {
        "orderId": {
          "type": "string",
          "description": "Order resource ID"
        },
        "local_part": {
          "type": "string",
          "description": "Local part of the mailbox address (the part before the @). The domain is taken from the order. Must start and end with a letter or digit; single dots, underscores and hyphens are allowed in between."
        },
        "password": {
          "type": "string",
          "description": "Mailbox password. Minimum 8 characters with uppercase, lowercase, number and special character."
        }
      },
      "required": [
        "orderId",
        "local_part",
        "password"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "mail"
  },
  {
    "name": "mail_deleteMailboxV1",
    "description": "Delete a mailbox. The mailbox is soft-deleted and stays restorable\nfor a limited period before it is permanently removed.",
    "method": "DELETE",
    "path": "/api/mail/v1/mailboxes/{mailboxId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "mailboxId": {
          "type": "string",
          "description": "Mailbox resource ID"
        }
      },
      "required": [
        "mailboxId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "mail"
  },
  {
    "name": "mail_changeMailboxPasswordV1",
    "description": "Change the password of a mailbox.",
    "method": "PATCH",
    "path": "/api/mail/v1/mailboxes/{mailboxId}/password",
    "inputSchema": {
      "type": "object",
      "properties": {
        "mailboxId": {
          "type": "string",
          "description": "Mailbox resource ID"
        },
        "password": {
          "type": "string",
          "description": "New mailbox password. Minimum 8 characters with uppercase, lowercase, number and special character; must not be a commonly used password."
        }
      },
      "required": [
        "mailboxId",
        "password"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "mail"
  },
  {
    "name": "mail_listOrdersV1",
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
  },
  {
    "name": "mail_getOrderPlanV1",
    "description": "Retrieve the plan the given mail order was purchased with, including\ndomain-level and mailbox-level quotas, limits, and protocol\navailability.",
    "method": "GET",
    "path": "/api/mail/v1/orders/{orderId}/plan",
    "inputSchema": {
      "type": "object",
      "properties": {
        "orderId": {
          "type": "string",
          "description": "Order resource ID"
        }
      },
      "required": [
        "orderId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "mail"
  },
  {
    "name": "mail_createWebhookV1",
    "description": "Create a webhook for the given mailbox. The generated secret is\nreturned only in this response and is sent as a bearer token with\nevery delivery.",
    "method": "POST",
    "path": "/api/mail/v1/mailboxes/{mailboxId}/webhooks",
    "inputSchema": {
      "type": "object",
      "properties": {
        "mailboxId": {
          "type": "string",
          "description": "Mailbox resource ID"
        },
        "name": {
          "type": "string",
          "description": "Human-readable name for this webhook"
        },
        "description": {
          "type": "string",
          "description": "Optional description of the webhook's purpose"
        },
        "events": {
          "type": "array",
          "description": "Events that trigger this webhook",
          "items": {
            "type": "string",
            "description": "events parameter",
            "enum": [
              "message.received"
            ]
          }
        },
        "status": {
          "type": "string",
          "description": "Initial status of the webhook",
          "enum": [
            "active",
            "disabled",
            "paused"
          ]
        },
        "url": {
          "type": "string",
          "description": "Publicly reachable URL that receives the webhook POST requests"
        }
      },
      "required": [
        "mailboxId",
        "name",
        "events",
        "url"
      ]
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
