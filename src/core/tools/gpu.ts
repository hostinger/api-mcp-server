// Auto-generated tool list for group: gpu
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export interface OpenApiTool extends Tool {
  method: string;
  path: string;
  security: unknown[];
  custom?: boolean;
  hidden?: boolean;
  replacesHidden?: boolean;
  group?: string;
  everyServer?: boolean;
  topic?: string;
  handlerMethod?: string;
  templateFile?: string;
  templateFileTS?: string;
}

const tools: OpenApiTool[] = [
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
    "name": "gpu_catalog_pool-groups",
    "title": "Get pool groups",
    "annotations": {
      "title": "Get pool groups",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve GPU pool groups, ordered by name.\n\nEach group bundles the pools of one GPU model and lists its currently available pools,\nwhether any of them is available and the lowest hourly price among its instance types.\nThe price is returned even when the group is out of stock.\n\nUse this endpoint to show which GPU models can be ordered and from what price.",
    "method": "GET",
    "path": "/api/gpu/v1/pools/groups",
    "inputSchema": {
      "type": "object",
      "properties": {
        "currency": {
          "type": "string",
          "description": "Currency of the returned prices, `USD` by default",
          "enum": [
            "USD",
            "ARS",
            "AMD",
            "AUD",
            "AZN",
            "BDT",
            "BRL",
            "BTC",
            "BYN",
            "CAD",
            "CHF",
            "CLP",
            "CNY",
            "COP",
            "CZK",
            "DKK",
            "EGP",
            "EUR",
            "GBP",
            "GEL",
            "HKD",
            "HRK",
            "HUF",
            "IDR",
            "ILS",
            "INR",
            "JPY",
            "KGS",
            "KRW",
            "KZT",
            "MAD",
            "MXN",
            "MYR",
            "NGN",
            "NOK",
            "NZD",
            "PEN",
            "PHP",
            "PKR",
            "PLN",
            "SEK",
            "SGD",
            "THB",
            "TJS",
            "TRY",
            "TWD",
            "UAH",
            "VND",
            "ZAR"
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
    "group": "gpu"
  },
  {
    "name": "gpu_catalog_pool-instance-types",
    "title": "Get pool instance types",
    "annotations": {
      "title": "Get pool instance types",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve the instance types offered by a specified GPU pool, ordered by CPU core count.\n\nEach instance type describes its CPU, memory and storage, and its hourly price.\nOnly instance types that can currently be ordered are returned.\n\nUse this endpoint to choose the `pool_instance_id` for a new GPU instance.",
    "method": "GET",
    "path": "/api/gpu/v1/pools/{poolId}/instances",
    "inputSchema": {
      "type": "object",
      "properties": {
        "poolId": {
          "type": "integer",
          "description": "GPU pool ID"
        }
      },
      "required": [
        "poolId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "gpu"
  },
  {
    "name": "gpu_catalog_pool-os-templates",
    "title": "Get pool OS templates",
    "annotations": {
      "title": "Get pool OS templates",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve the OS templates that can be installed on a specified GPU pool instance type.\n\nUse this endpoint to choose the `os_template_id` for a new GPU instance.",
    "method": "GET",
    "path": "/api/gpu/v1/pools/{poolId}/instances/{poolInstanceId}/os-templates",
    "inputSchema": {
      "type": "object",
      "properties": {
        "poolId": {
          "type": "integer",
          "description": "GPU pool ID"
        },
        "poolInstanceId": {
          "type": "integer",
          "description": "GPU pool instance type ID"
        }
      },
      "required": [
        "poolId",
        "poolInstanceId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "gpu"
  },
  {
    "name": "gpu_catalog_pool",
    "title": "Get pool list",
    "annotations": {
      "title": "Get pool list",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve all available GPU pools, ordered by name.\n\nA pool serves GPU accelerators of one model from a single region.\n\nUse this endpoint to choose a pool before listing its instance types.",
    "method": "GET",
    "path": "/api/gpu/v1/pools",
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
    "group": "gpu"
  }
];
export default tools;
