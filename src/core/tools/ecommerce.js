// Auto-generated tool list for group: ecommerce
export default [
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
  }
];
