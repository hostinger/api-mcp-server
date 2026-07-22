// Auto-generated tool list for group: mail
export default [
  {
    "name": "mail_getMailboxListV1",
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
