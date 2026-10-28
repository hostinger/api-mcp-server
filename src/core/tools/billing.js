// Auto-generated tool list for group: billing
export default [
  {
    "name": "changelog_list-entries",
    "title": "List changelog and roadmap entries (what's new, what's coming)",
    "annotations": {
      "title": "List changelog and roadmap entries (what's new, what's coming)",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "topic": "common",
    "description": "What's new and what's coming at Hostinger: list entries of the public Hostinger changelog (release notes, product updates, recent changes, new features and improvements) and of the public roadmap (upcoming features not released yet). Released entries come newest first; upcoming items come soonest expected release first. Reads released changelog entries by default; pick upcoming for the roadmap or all for both. Filter by product or date. Each entry has its title, summary, product, URL, status (released or upcoming), and plan when the entry states one; released entries have their date, upcoming items their expected release date when set. Needs no API token.",
    "method": "",
    "path": "",
    "inputSchema": {
      "type": "object",
      "properties": {
        "status": {
          "type": "string",
          "description": "Which entries to list: released (default) reads the changelog, for what's new; upcoming reads the roadmap's unreleased items, for what's coming; all reads both.",
          "enum": [
            "released",
            "upcoming",
            "all"
          ],
          "default": "released"
        },
        "product": {
          "type": "string",
          "description": "Only entries for this product, matched case-insensitively. Products include AI Builder, Web Hosting, VPS, Domains, Hostinger Mail, Reach, Ecommerce, WordPress, Hostinger Agent, AI Automation Apps, Web Pro, Billing, Growth and Payments."
        },
        "since": {
          "type": "string",
          "format": "date",
          "description": "Only released entries dated on or after this date, as YYYY-MM-DD. Upcoming items are not filtered by date."
        },
        "limit": {
          "type": "integer",
          "description": "Most entries to return",
          "minimum": 1,
          "maximum": 100,
          "default": 20
        }
      },
      "required": []
    },
    "security": [],
    "custom": true,
    "templateFile": "list-changelog-entries.template.js",
    "templateFileTS": "list-changelog-entries.template.ts",
    "handlerMethod": "handleChangelogListEntries",
    "everyServer": true
  },
  {
    "name": "billing_catalog_list",
    "title": "Get catalog item list",
    "annotations": {
      "title": "Get catalog item list",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve catalog items available for order.\n\nPrices in catalog items is displayed as cents (without floating point),\ne.g: float `17.99` is displayed as integer `1799`.\n\nUse this endpoint to view available services and pricing before placing orders.",
    "method": "GET",
    "path": "/api/billing/v1/catalog",
    "inputSchema": {
      "type": "object",
      "properties": {
        "category": {
          "type": "string",
          "description": "Filter catalog items by category",
          "enum": [
            "DOMAIN",
            "VPS",
            "EMAIL",
            "HOSTING"
          ]
        },
        "name": {
          "type": "string",
          "description": "Filter catalog items by name. Use `*` for wildcard search, e.g. `.COM*` to find .com domain"
        }
      },
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "billing"
  },
  {
    "name": "billing_orders_create-purchase",
    "title": "Create purchase order",
    "annotations": {
      "title": "Create purchase order",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Create a purchase order for any Hostinger product.\n\nThis unified endpoint places an order for one or more catalog items and\nworks across all Hostinger products, leveraging the existing billing\ninfrastructure. Use the [catalog endpoint](#tag/billing-catalog) to look\nup the `item_id` values available for purchase.\n\nIf no payment method is provided, your default payment method will be used automatically.\n\nIf the response is `202 Accepted`, the payment is still being processed and the order will\ncomplete asynchronously once the payment is confirmed.\n\nThis endpoint only places the order. Product-specific provisioning\n(e.g. VPS setup or domain registration) is not performed here — once the\norder completes, use the relevant product endpoints or\n[hPanel](https://hpanel.hostinger.com/) to finalize setup.\n\nUse this endpoint to purchase any product available in the catalog.",
    "method": "POST",
    "path": "/api/billing/v1/orders",
    "inputSchema": {
      "type": "object",
      "properties": {
        "payment_method_id": {
          "type": "integer",
          "description": "Payment method ID, default will be used if not provided"
        },
        "items": {
          "type": "array",
          "description": "Catalog price items to purchase",
          "items": {
            "type": "object",
            "description": "items parameter",
            "properties": {
              "item_id": {
                "type": "string",
                "description": "Catalog price item ID"
              },
              "quantity": {
                "type": "integer",
                "description": "Quantity to purchase"
              }
            },
            "required": [
              "item_id"
            ]
          }
        },
        "coupons": {
          "type": "array",
          "description": "Discount coupon codes",
          "items": {
            "type": "string",
            "description": "coupons parameter"
          }
        }
      },
      "required": [
        "items"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "billing"
  },
  {
    "name": "billing_payment-methods_set-default",
    "title": "Set default payment method",
    "annotations": {
      "title": "Set default payment method",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Set the default payment method for your account.\n\nUse this endpoint to configure the primary payment method for future orders.",
    "method": "POST",
    "path": "/api/billing/v1/payment-methods/{paymentMethodId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "paymentMethodId": {
          "type": "integer",
          "description": "Payment method ID"
        }
      },
      "required": [
        "paymentMethodId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "billing"
  },
  {
    "name": "billing_payment-methods_delete",
    "title": "Delete payment method",
    "annotations": {
      "title": "Delete payment method",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Delete a payment method from your account.\n\nUse this endpoint to remove unused payment methods from user accounts.",
    "method": "DELETE",
    "path": "/api/billing/v1/payment-methods/{paymentMethodId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "paymentMethodId": {
          "type": "integer",
          "description": "Payment method ID"
        }
      },
      "required": [
        "paymentMethodId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "billing"
  },
  {
    "name": "billing_payment-methods_list",
    "title": "Get payment method list",
    "annotations": {
      "title": "Get payment method list",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve available payment methods that can be used for placing new orders.\n\nIf you want to add new payment method,\nplease use [hPanel](https://hpanel.hostinger.com/billing/payment-methods).\n\nUse this endpoint to view available payment options before creating orders.",
    "method": "GET",
    "path": "/api/billing/v1/payment-methods",
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
    "group": "billing"
  },
  {
    "name": "billing_subscriptions_list",
    "title": "Get subscription list",
    "annotations": {
      "title": "Get subscription list",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve a list of all subscriptions associated with your account.\n\nUse this endpoint to monitor active services and billing status.",
    "method": "GET",
    "path": "/api/billing/v1/subscriptions",
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
    "group": "billing"
  },
  {
    "name": "billing_subscriptions_disable-auto-renewal",
    "title": "Disable auto-renewal",
    "annotations": {
      "title": "Disable auto-renewal",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Disable auto-renewal for a subscription.\n\nUse this endpoint when disable auto-renewal for a subscription.",
    "method": "DELETE",
    "path": "/api/billing/v1/subscriptions/{subscriptionId}/auto-renewal/disable",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subscriptionId": {
          "type": "string",
          "description": "Subscription ID"
        }
      },
      "required": [
        "subscriptionId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "billing"
  },
  {
    "name": "billing_subscriptions_enable-auto-renewal",
    "title": "Enable auto-renewal",
    "annotations": {
      "title": "Enable auto-renewal",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Enable auto-renewal for a subscription.\n\nUse this endpoint when enable auto-renewal for a subscription.",
    "method": "PATCH",
    "path": "/api/billing/v1/subscriptions/{subscriptionId}/auto-renewal/enable",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subscriptionId": {
          "type": "string",
          "description": "Subscription ID"
        }
      },
      "required": [
        "subscriptionId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "billing"
  },
  {
    "name": "billing_subscriptions_renew",
    "title": "Renew subscription",
    "annotations": {
      "title": "Renew subscription",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Create a renewal order for an existing Hostinger subscription.\n\nThis endpoint places a renewal order for a single subscription, leveraging\nthe existing billing infrastructure. Use the\n[subscriptions endpoint](#tag/billing-subscriptions) to look up the\n`subscriptionId` values available for renewal.\n\nIf no payment method is provided, your default payment method will be used automatically.\n\nIf the response is `202 Accepted`, the payment is still being processed and the renewal will\ncomplete asynchronously once the payment is confirmed.\n\nUse this endpoint to renew any subscription available in your account.",
    "method": "POST",
    "path": "/api/billing/v1/subscriptions/{subscriptionId}/renew",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subscriptionId": {
          "type": "string",
          "description": "Subscription ID"
        },
        "payment_method_id": {
          "type": "integer",
          "description": "Payment method ID, default will be used if not provided"
        },
        "coupons": {
          "type": "array",
          "description": "Discount coupon codes",
          "items": {
            "type": "string",
            "description": "coupons parameter"
          }
        }
      },
      "required": [
        "subscriptionId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "billing"
  }
];
