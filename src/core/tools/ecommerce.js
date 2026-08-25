// Auto-generated tool list for group: ecommerce
export default [
  {
    "name": "ecommerce_listDiscountsV1",
    "description": "List a store's discounts. Filter by free text over code and name, or by disabled state.\nAmounts for fixed discounts are integers in the smallest currency unit; percentage\ndiscounts carry a whole-number value between 1 and 100.",
    "method": "GET",
    "path": "/api/ecommerce/v1/stores/{store_id}/discounts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to list discounts for."
        },
        "q": {
          "type": "string",
          "description": "Free-text search over discount code and name."
        },
        "is_disabled": {
          "type": "string",
          "description": "Filter by disabled state.",
          "enum": [
            "true",
            "false"
          ]
        },
        "page": {
          "type": "integer",
          "description": "Page number"
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
    "name": "ecommerce_createADiscountV1",
    "description": "Create a discount for a store. Fixed discounts take an amount in the smallest currency\nunit (e.g. $10 is 1000); percentage discounts take a whole-number value between 1 and 100.\nFree-shipping discounts ignore value. Returns the created discount.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/discounts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to create the discount for."
        },
        "code": {
          "type": "string",
          "description": "The discount code customers enter at checkout."
        },
        "name": {
          "type": "string",
          "description": "A human-friendly discount name."
        },
        "type": {
          "type": "string",
          "description": "The discount type.",
          "enum": [
            "percentage",
            "fixed",
            "free_shipping"
          ]
        },
        "value": {
          "type": "integer",
          "description": "For percentage discounts a whole number 1-100; for fixed discounts an amount in the smallest currency unit (e.g. $10 is 1000). Ignored for free_shipping."
        },
        "allocation": {
          "type": "string",
          "description": "Whether the discount applies to the cart total or to each eligible item.",
          "enum": [
            "total",
            "item"
          ]
        },
        "starts_at": {
          "type": "string",
          "description": "When the discount becomes active. A bare date (2026-11-27) anchors to time_zone. Defaults to now when omitted."
        },
        "ends_at": {
          "type": "string",
          "description": "When the discount expires. A bare date runs to the end of that day in time_zone. Never expires when omitted."
        },
        "usage_limit": {
          "type": "integer",
          "description": "Maximum number of times the discount can be redeemed."
        },
        "min_cart_value": {
          "type": "integer",
          "description": "Minimum cart value in the smallest currency unit required for the discount to apply."
        },
        "time_zone": {
          "type": "string",
          "description": "IANA time zone used to interpret starts_at and ends_at."
        }
      },
      "required": [
        "store_id",
        "code",
        "type",
        "value"
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
    "name": "ecommerce_cancelAnOrderV1",
    "description": "Cancel the order and optionally email the customer. Returns the updated order summary.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/orders/{order_id}/cancel",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store that owns the order."
        },
        "order_id": {
          "type": "string",
          "description": "The ID of the order to cancel."
        },
        "notify_customer": {
          "type": "boolean",
          "description": "Whether to email the customer about the cancellation. Defaults to true."
        }
      },
      "required": [
        "store_id",
        "order_id"
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
    "name": "ecommerce_fulfilAnOrderV1",
    "description": "Create a fulfilment for the order and attach tracking in one call. Omit items to fulfil\nevery remaining unfulfilled item. Returns the updated order summary.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/orders/{order_id}/fulfill",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store that owns the order."
        },
        "order_id": {
          "type": "string",
          "description": "The ID of the order to fulfil."
        },
        "items": {
          "type": "array",
          "description": "Line items to fulfil. Omit to fulfil every remaining unfulfilled item.",
          "items": {
            "type": "object",
            "description": "items parameter",
            "properties": {
              "line_item_id": {
                "type": "string",
                "description": "The line item to fulfil, from the order detail items[].id."
              },
              "quantity": {
                "type": "integer",
                "description": "Quantity of the line item to fulfil."
              }
            },
            "required": [
              "line_item_id",
              "quantity"
            ]
          }
        },
        "tracking_number": {
          "type": "string",
          "description": "Carrier tracking number for the shipment."
        },
        "tracking_url": {
          "type": "string",
          "description": "Public tracking URL for the shipment. Requires tracking_number."
        },
        "notify_customer": {
          "type": "boolean",
          "description": "Whether to email the customer about the fulfilment. Defaults to true."
        }
      },
      "required": [
        "store_id",
        "order_id"
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
    "name": "ecommerce_listStoreOrdersV1",
    "description": "List a store's orders newest first as summaries. Filter by status, payment or fulfilment\nstatus, customer email, order number or a free-text query. Amounts are in the smallest\ncurrency unit. Retrieve a single order for its line items, addresses and fulfilments.",
    "method": "GET",
    "path": "/api/ecommerce/v1/stores/{store_id}/orders",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to list orders for."
        },
        "status": {
          "type": "array",
          "description": "Order statuses to include.",
          "items": {
            "type": "string",
            "description": "status parameter",
            "enum": [
              "pending",
              "completed",
              "archived",
              "canceled",
              "requires_action"
            ]
          }
        },
        "payment_status": {
          "type": "array",
          "description": "Payment statuses to include. A paid order is \"captured\".",
          "items": {
            "type": "string",
            "description": "payment_status parameter",
            "enum": [
              "not_paid",
              "awaiting",
              "captured",
              "partially_refunded",
              "refunded",
              "canceled",
              "requires_action",
              "not_required"
            ]
          }
        },
        "fulfillment_status": {
          "type": "array",
          "description": "Fulfilment statuses to include.",
          "items": {
            "type": "string",
            "description": "fulfillment_status parameter",
            "enum": [
              "not_fulfilled",
              "partially_fulfilled",
              "fulfilled",
              "partially_shipped",
              "shipped",
              "partially_returned",
              "returned",
              "canceled",
              "requires_action"
            ]
          }
        },
        "email": {
          "type": "string",
          "description": "Customer email, matched exactly."
        },
        "display_id": {
          "type": "string",
          "description": "The order number the merchant and customer see."
        },
        "q": {
          "type": "string",
          "description": "Free-text search over customer name, email, order number and line items."
        },
        "created_at_from": {
          "type": "string",
          "description": "Earliest creation time to include, inclusive. Accepts a date or ISO date-time (UTC)."
        },
        "created_at_to": {
          "type": "string",
          "description": "Latest creation time to include, inclusive. A bare date covers that whole day."
        },
        "page": {
          "type": "integer",
          "description": "Page number"
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
    "name": "ecommerce_retrieveAnOrderV1",
    "description": "Retrieve one order in full: line items (each with the id the fulfil endpoint needs),\naddresses, the totals breakdown and fulfilments with tracking. Amounts are in the\nsmallest currency unit.",
    "method": "GET",
    "path": "/api/ecommerce/v1/stores/{store_id}/orders/{order_id}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store that owns the order."
        },
        "order_id": {
          "type": "string",
          "description": "The ID of the order to retrieve."
        }
      },
      "required": [
        "store_id",
        "order_id"
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
    "name": "ecommerce_createAPaymentProviderConnectLinkV1",
    "description": "Create an onboarding link for connecting a payment gateway to the store. Returns the gateway\nonboarding URL for the merchant to open and a deep-link into the store admin.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/payment-providers/{provider_id}/connect-link",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to connect the payment provider to."
        },
        "provider_id": {
          "type": "string",
          "description": "The ID of the payment gateway to connect, e.g. stripe."
        }
      },
      "required": [
        "store_id",
        "provider_id"
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
    "name": "ecommerce_listStorePaymentProvidersV1",
    "description": "List a store's payment providers, split into providers already connected to the store and\ngateways available to install. Never exposes gateway credentials, secrets, or configuration.",
    "method": "GET",
    "path": "/api/ecommerce/v1/stores/{store_id}/payment-providers",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to list payment providers for."
        },
        "include_currency_unsupported": {
          "type": "boolean",
          "description": "Include gateways that do not support the store currency in the available list."
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
    "name": "ecommerce_createAProductImageUploadURLV1",
    "description": "Returns a signed URL to upload a product image to (multipart/form-data POST). Then call the\nattach-image endpoint with the returned object_name to scan and attach it to the product.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/products/{product_id}/images/upload-url",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store the product belongs to."
        },
        "product_id": {
          "type": "string",
          "description": "The ID of the product the image will be attached to."
        }
      },
      "required": [
        "store_id",
        "product_id"
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
    "name": "ecommerce_deleteAProductV1",
    "description": "Delete a product and its variants from the store. A subscription product with active\nsubscribers is archived instead of deleted so its data stays available.",
    "method": "DELETE",
    "path": "/api/ecommerce/v1/stores/{store_id}/products/{product_id}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store that owns the product."
        },
        "product_id": {
          "type": "string",
          "description": "The ID of the product to delete."
        }
      },
      "required": [
        "store_id",
        "product_id"
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
    "name": "ecommerce_updateAProductV1",
    "description": "Update a product's name, description or status. Set status to published to make it buyable,\ndraft to hide it, or archived to retire it. Variants, prices and inventory are managed\nthrough the variant endpoints, not here. Returns the updated product summary.",
    "method": "PATCH",
    "path": "/api/ecommerce/v1/stores/{store_id}/products/{product_id}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store that owns the product."
        },
        "product_id": {
          "type": "string",
          "description": "The ID of the product to update."
        },
        "name": {
          "type": "string",
          "description": "The product name."
        },
        "description": {
          "type": "string",
          "description": "The product description."
        },
        "status": {
          "type": "string",
          "description": "Set \"published\" to make the product buyable, \"draft\" to hide it, or \"archived\" to retire it.",
          "enum": [
            "draft",
            "published",
            "archived"
          ]
        }
      },
      "required": [
        "store_id",
        "product_id"
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
    "name": "ecommerce_listProductsV1",
    "description": "List a store's products newest first as lean summaries (name, status, thumbnail, variant\ncount and price range). Prices are integers in the smallest currency unit and live on\nvariants. Filter by status, free text or a set of product ids. Use include=variants to\nembed each product's variants with prices and inventory, and include=media to embed its media.",
    "method": "GET",
    "path": "/api/ecommerce/v1/stores/{store_id}/products",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store to list products for."
        },
        "product_ids": {
          "type": "array",
          "description": "Restrict to these product ids. Doubles as a single-product lookup. Up to 200 ids.",
          "items": {
            "type": "string",
            "description": "product_ids parameter"
          }
        },
        "status": {
          "type": "array",
          "description": "Product statuses to include.",
          "items": {
            "type": "string",
            "description": "status parameter",
            "enum": [
              "draft",
              "proposed",
              "published",
              "rejected",
              "archived"
            ]
          }
        },
        "q": {
          "type": "string",
          "description": "Free-text search over product title and SKU."
        },
        "include": {
          "type": "array",
          "description": "Opt-in heavy data: \"variants\" embeds each product's variants; \"media\" embeds its media.",
          "items": {
            "type": "string",
            "description": "include parameter",
            "enum": [
              "variants",
              "media"
            ]
          }
        },
        "page": {
          "type": "integer",
          "description": "Page number"
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
    "name": "ecommerce_uploadAndAttachAProductImageV1",
    "description": "Fetch a raster image (JPEG, PNG, GIF or WebP, max 15MB) from a URL and attach it to a product in a\nsingle call. The image is virus-scanned and validated by content, then stored on the CDN. Set\nis_thumbnail to make it the product's primary image.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/products/{product_id}/images",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store the product belongs to."
        },
        "product_id": {
          "type": "string",
          "description": "The ID of the product to attach the image to."
        },
        "image_url": {
          "type": "string",
          "description": "Publicly reachable URL of the raster image (JPEG, PNG, GIF or WebP), maximum 15MB. The image is\nfetched, virus-scanned and validated by content, then stored on the CDN. SVG is not accepted.\nProvide either this or object_name."
        },
        "object_name": {
          "type": "string",
          "description": "Key returned by the upload-url endpoint. Provide this instead of image_url to attach an uploaded image."
        },
        "is_thumbnail": {
          "type": "boolean",
          "description": "When true, the image becomes the product's thumbnail (primary image). When omitted, it becomes the\nthumbnail only if the product does not have one yet."
        }
      },
      "required": [
        "store_id",
        "product_id"
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
    "name": "ecommerce_createASalesChannelV1",
    "description": "Create a sales channel for a store. A \"custom\" channel is headless: build your own frontend and keep\nyour catalog, orders, shipping and payments in sync through the Ecommerce API. A \"quick-link\" channel\nis a hosted one-page store whose handle is auto-generated.",
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
          "description": "Sales channel type. \"custom\" is a headless channel: it requires a name and takes an optional public url.\n\"quick-link\" is a one-page store whose handle is auto-generated; it supports neither name nor url.",
          "enum": [
            "custom",
            "quick-link"
          ]
        },
        "name": {
          "type": "string",
          "description": "Merchant-facing custom name. Required for custom channels; not supported for quick-link."
        },
        "url": {
          "type": "string",
          "description": "Optional public url for the channel. Custom channels only; not supported for quick-link."
        }
      },
      "required": [
        "store_id",
        "type"
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
  },
  {
    "name": "ecommerce_updateProductVariantsInBatchV1",
    "description": "Update up to 100 existing variants in place by id — title, inventory, stock tracking and\nprices. Variants omitted from the request are left untouched. Prices replace the variant's\nexisting prices in full. Returns the updated variants.",
    "method": "PATCH",
    "path": "/api/ecommerce/v1/stores/{store_id}/products/{product_id}/variants/batch",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store that owns the product."
        },
        "product_id": {
          "type": "string",
          "description": "The ID of the product whose variants are being updated."
        },
        "variants": {
          "type": "array",
          "description": "Variants to update in place by id, up to 100. Variants omitted from the list are left untouched.",
          "items": {
            "type": "object",
            "description": "variants parameter",
            "properties": {
              "variant_id": {
                "type": "string",
                "description": "The id of the variant to update."
              },
              "title": {
                "type": "string",
                "description": "The variant title."
              },
              "inventory_quantity": {
                "type": "integer",
                "description": "Units in stock."
              },
              "manage_inventory": {
                "type": "boolean",
                "description": "Whether stock is tracked for this variant."
              },
              "prices": {
                "type": "array",
                "description": "The full list of prices for the variant, replacing the existing ones. A free item is amount: 0.",
                "items": {
                  "type": "object",
                  "description": "prices parameter",
                  "properties": {
                    "amount": {
                      "type": "integer",
                      "description": "Price in the smallest currency unit (e.g. cents)."
                    },
                    "sale_amount": {
                      "type": "integer",
                      "description": "Optional sale price in the smallest currency unit; must be lower than amount."
                    },
                    "currency": {
                      "type": "string",
                      "description": "ISO 4217 currency code. Defaults to the store's default currency."
                    }
                  },
                  "required": [
                    "amount"
                  ]
                }
              }
            },
            "required": [
              "variant_id"
            ]
          }
        }
      },
      "required": [
        "store_id",
        "product_id",
        "variants"
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
    "name": "ecommerce_deleteAProductVariantV1",
    "description": "Delete a single variant from the product.",
    "method": "DELETE",
    "path": "/api/ecommerce/v1/stores/{store_id}/products/{product_id}/variants/{variant_id}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store that owns the product."
        },
        "product_id": {
          "type": "string",
          "description": "The ID of the product that owns the variant."
        },
        "variant_id": {
          "type": "string",
          "description": "The ID of the variant to delete."
        }
      },
      "required": [
        "store_id",
        "product_id",
        "variant_id"
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
    "name": "ecommerce_listProductVariantsV1",
    "description": "List a product's variants, ordered by rank, with their options, prices and inventory.\nPrices are integers in the smallest currency unit and live on variants.",
    "method": "GET",
    "path": "/api/ecommerce/v1/stores/{store_id}/products/{product_id}/variants",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store that owns the product."
        },
        "product_id": {
          "type": "string",
          "description": "The ID of the product to list variants for."
        },
        "page": {
          "type": "integer",
          "description": "Page number"
        }
      },
      "required": [
        "store_id",
        "product_id"
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
    "name": "ecommerce_createAProductVariantV1",
    "description": "Add a variant to a product along one or more option dimensions (e.g. Size, Color). Options\nmissing from the product are created automatically; provide a value for every option the\nproduct already has. Prices are integers in the smallest currency unit and default to the\nstore currency. Returns the created variant.",
    "method": "POST",
    "path": "/api/ecommerce/v1/stores/{store_id}/products/{product_id}/variants",
    "inputSchema": {
      "type": "object",
      "properties": {
        "store_id": {
          "type": "string",
          "description": "The ID of the store that owns the product."
        },
        "product_id": {
          "type": "string",
          "description": "The ID of the product to add the variant to."
        },
        "title": {
          "type": "string",
          "description": "The variant title. Defaults to the option values joined with ' / ' (e.g. 'Red / L')."
        },
        "sku": {
          "type": "string",
          "description": "The variant SKU."
        },
        "options": {
          "type": "array",
          "description": "Option name/value pairs that distinguish this variant, e.g. [{name: Size, value: M}]. Options missing from the product are created; provide a value for every option the product already has.",
          "items": {
            "type": "object",
            "description": "options parameter",
            "properties": {
              "name": {
                "type": "string",
                "description": "Option name, e.g. Size."
              },
              "value": {
                "type": "string",
                "description": "Option value for this variant, e.g. M."
              }
            },
            "required": [
              "name",
              "value"
            ]
          }
        },
        "prices": {
          "type": "array",
          "description": "Prices per currency. Amounts are integers in the smallest currency unit. A free item is amount: 0.",
          "items": {
            "type": "object",
            "description": "prices parameter",
            "properties": {
              "amount": {
                "type": "integer",
                "description": "Price in the smallest currency unit (e.g. cents)."
              },
              "sale_amount": {
                "type": "integer",
                "description": "Optional sale price in the smallest currency unit; must be lower than amount."
              },
              "currency": {
                "type": "string",
                "description": "ISO 4217 currency code. Defaults to the store's default currency when omitted."
              }
            },
            "required": [
              "amount"
            ]
          }
        },
        "inventory_quantity": {
          "type": "integer",
          "description": "Units in stock. Defaults to 0."
        },
        "manage_inventory": {
          "type": "boolean",
          "description": "Whether stock is tracked for this variant. Defaults to false."
        }
      },
      "required": [
        "store_id",
        "product_id",
        "options"
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
