// Auto-generated tool list for group: ecommerce
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
    "name": "ecommerce_getCustomStorefrontSetupInstructionsV1",
    "description": "Retrieve step-by-step setup instructions, formatted as Markdown, for connecting a custom sales\nchannel to your store and keeping your catalog, orders, shipping and payments in sync through\nthe Ecommerce API.",
    "method": "GET",
    "path": "/api/ecommerce/v1/miscellaneous/custom-storefront-instructions",
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
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_enableManualPaymentMethodV1",
    "description": "Enable a manual payment method so the store can accept orders without an online payment provider.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/payment-methods/manual",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to enable manual payment for."
        },
        "title": {
          "type": "string",
          "description": "Optional display name shown to customers at checkout."
        }
      },
      "required": [
        "store_id"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_createDigitalProductV1",
    "description": "Create a published digital product with a single variant and an optional external download link.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/products/digital",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to create the product in."
        },
        "name": {
          "type": "string",
          "description": "The product name."
        },
        "price": {
          "type": "integer",
          "description": "Price in the smallest currency unit (e.g. cents). Must be positive."
        },
        "description": {
          "type": "string",
          "description": "The product description."
        },
        "currency": {
          "type": "string",
          "description": "ISO 4217 currency code. Defaults to the store's default currency when omitted."
        },
        "download_url": {
          "type": "string",
          "description": "Optional external download link delivered to the customer after purchase."
        }
      },
      "required": [
        "store_id",
        "name",
        "price"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_createPhysicalProductV1",
    "description": "Create a published physical product with a single variant priced in the store currency.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/products/physical",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to create the product in."
        },
        "name": {
          "type": "string",
          "description": "The product name."
        },
        "price": {
          "type": "integer",
          "description": "Price in the smallest currency unit (e.g. cents). Must be positive."
        },
        "description": {
          "type": "string",
          "description": "The product description."
        },
        "currency": {
          "type": "string",
          "description": "ISO 4217 currency code. Defaults to the store's default currency when omitted."
        }
      },
      "required": [
        "store_id",
        "name",
        "price"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_listSalesChannelsV1",
    "description": "List a store's active sales channels with their full metadata.",
    "method": "GET",
    "path": "/api/ecommerce/v1/stores/{store_id}/sales-channels",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to list sales channels for."
        }
      },
      "required": [
        "store_id"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_createCustomSalesChannelV1",
    "description": "Create a custom sales channel for a store. Build your own frontend and keep your catalog,\norders, shipping and payments in sync through the Ecommerce API.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/sales-channels",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to create the sales channel for."
        },
        "type": {
          "type": "string",
          "description": "Sales channel type. Only \"custom\" channels can be created via the API.",
          "enum": [
            "custom"
          ]
        },
        "name": {
          "type": "string",
          "description": "Merchant-facing custom name shown in the sales channels list."
        },
        "url": {
          "type": "string",
          "description": "Optional public address where the custom sales channel lives."
        }
      },
      "required": [
        "store_id",
        "type",
        "name"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_updateSalesChannelV1",
    "description": "Update a custom sales channel. The merchant-facing `name` and the public `url`\n(returned as the channel `domain`) can be changed. Pass `null` to clear a value.",
    "method": "PATCH",
    "path": "/api/ecommerce/v1/stores/{store_id}/sales-channels/{sales_channel_id}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store that owns the sales channel."
        },
        "sales_channel_id": {
          "type": "string",
          "description": "The ID of the sales channel to update."
        },
        "name": {
          "type": "string",
          "description": "Merchant-facing custom name shown in the sales channels list. Pass null to clear it."
        },
        "url": {
          "type": "string",
          "description": "Public address where the custom sales channel lives. Pass null to clear it."
        }
      },
      "required": [
        "store_id",
        "sales_channel_id"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_setStoreShippingV1",
    "description": "Set the flat-rate shipping price for a store, creating the shipping zone if it does not exist yet.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/shipping",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to configure shipping for."
        },
        "price": {
          "type": "integer",
          "description": "Flat shipping rate in the smallest currency unit (e.g. cents). Use 0 for free shipping."
        }
      },
      "required": [
        "store_id",
        "price"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_deleteStoreV1",
    "description": "Soft-delete a store owned by your account.\n\nThe underlying store data is preserved; only the store is marked as deleted.",
    "method": "DELETE",
    "path": "/api/ecommerce/v1/stores/{store_id}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to delete."
        }
      },
      "required": [
        "store_id"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_getStoresV1",
    "description": "Retrieve the stores associated with your account.",
    "method": "GET",
    "path": "/api/ecommerce/v1/stores",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "integer",
          "description": "Page number"
        }
      },
      "required": []
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_createStoreV1",
    "description": "Create a new store for your account.\n\nA primary sales channel is created alongside the store.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "name parameter"
        },
        "country_code": {
          "type": "string",
          "description": "ISO 3166-1 alpha-2 country code."
        },
        "company_email": {
          "type": "string",
          "description": "company_email parameter"
        },
        "company_name": {
          "type": "string",
          "description": "company_name parameter"
        },
        "language": {
          "type": "string",
          "description": "ISO 639-1 language code."
        },
        "sales_channel": {
          "type": "object",
          "description": "sales_channel parameter",
          "properties": {
            "type": {
              "type": "string",
              "description": "Sales channel type. Only \"custom\" channels can be created via the API.",
              "enum": [
                "custom"
              ]
            },
            "external_id": {
              "type": "string",
              "description": "External identifier for the sales channel."
            }
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
    "group": "ecommerce"
  },
  {
    "name": "ecommerce_getStoreMetadataV1",
    "description": "Get a store's readiness metadata: whether payment methods and shipping are configured,\nplus its default currency. Useful to verify prerequisites before building a storefront.",
    "method": "GET",
    "path": "/api/ecommerce/v1/stores/{store_id}/metadata",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to read metadata for."
        }
      },
      "required": [
        "store_id"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "ecommerce"
  }
];
export default tools;
