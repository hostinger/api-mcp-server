// Auto-generated tool list for group: gpu
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
    "name": "gpu_instances_get",
    "title": "Get instance details",
    "annotations": {
      "title": "Get instance details",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve detailed information about a specified GPU instance, including its SSH keys.\n\nUse this endpoint to follow the instance `status` after creating or deleting it.",
    "method": "GET",
    "path": "/api/gpu/v1/instances/{instanceId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "instanceId": {
          "type": "integer",
          "description": "GPU instance ID"
        }
      },
      "required": [
        "instanceId"
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
    "name": "gpu_instances_delete",
    "title": "Delete instance",
    "annotations": {
      "title": "Delete instance",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Delete a specified GPU instance.\n\nThe instance is destroyed asynchronously: a successful request returns immediately and the instance\n`status` moves to `destroying`. Deleting fails while the instance is in `created`, `destroying`,\n`destroyed` or `abuse` status, or while another action is in progress on it.\n\nUse this endpoint to stop billing for a GPU instance you no longer need.",
    "method": "DELETE",
    "path": "/api/gpu/v1/instances/{instanceId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "instanceId": {
          "type": "integer",
          "description": "GPU instance ID"
        }
      },
      "required": [
        "instanceId"
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
    "name": "gpu_exposed-services_delete",
    "title": "Delete exposed service",
    "annotations": {
      "title": "Delete exposed service",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Delete a specified exposed service of a GPU instance.\n\nThe service is removed asynchronously: a successful request returns immediately and the service\nstops being reachable from the internet shortly after.\n\nUse this endpoint to close public access to a service on your GPU instance.",
    "method": "DELETE",
    "path": "/api/gpu/v1/instances/{instanceId}/exposed-services/{exposedServiceId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "instanceId": {
          "type": "integer",
          "description": "GPU instance ID"
        },
        "exposedServiceId": {
          "type": "integer",
          "description": "Exposed service ID"
        }
      },
      "required": [
        "instanceId",
        "exposedServiceId"
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
    "name": "gpu_exposed-services_list",
    "title": "Get exposed services",
    "annotations": {
      "title": "Get exposed services",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve the services exposed on a specified GPU instance.\n\nA newly created service is listed once it gets its public hostname and external port.\n\nUse this endpoint to find the public address of services running on your GPU instance.",
    "method": "GET",
    "path": "/api/gpu/v1/instances/{instanceId}/exposed-services",
    "inputSchema": {
      "type": "object",
      "properties": {
        "instanceId": {
          "type": "integer",
          "description": "GPU instance ID"
        }
      },
      "required": [
        "instanceId"
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
    "name": "gpu_exposed-services_create",
    "title": "Create exposed service",
    "annotations": {
      "title": "Create exposed service",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Expose a service running on a specified GPU instance to the internet.\n\nThe service is exposed asynchronously: a successful request returns immediately, and the service\nappears in the exposed services list once it gets its public hostname and external port.\nFails when the instance already has the maximum of 4 exposed services.\n\nUse this endpoint to make an application on your GPU instance publicly reachable.",
    "method": "POST",
    "path": "/api/gpu/v1/instances/{instanceId}/exposed-services",
    "inputSchema": {
      "type": "object",
      "properties": {
        "instanceId": {
          "type": "integer",
          "description": "GPU instance ID"
        },
        "name": {
          "type": "string",
          "description": "Service name, unique within the instance"
        },
        "internal_port": {
          "type": "integer",
          "description": "Port the service listens on inside the instance, unique within the instance"
        },
        "protocol": {
          "type": "string",
          "description": "protocol parameter",
          "enum": [
            "tcp",
            "udp"
          ]
        },
        "type": {
          "type": "string",
          "description": "type parameter",
          "enum": [
            "http",
            "https"
          ]
        }
      },
      "required": [
        "instanceId",
        "name",
        "internal_port",
        "protocol",
        "type"
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
    "name": "gpu_instances_list",
    "title": "Get instances",
    "annotations": {
      "title": "Get instances",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve all GPU instances of your account.\n\nUse this endpoint to view your GPU instances with their status, pool, instance type and OS template.",
    "method": "GET",
    "path": "/api/gpu/v1/instances",
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
  },
  {
    "name": "gpu_instances_create",
    "title": "Create instance",
    "annotations": {
      "title": "Create instance",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Create a new GPU instance.\n\nPick `pool_instance_id` from the pool instance types list and `os_template_id` from the OS templates\navailable for that instance type. Your account must have enough credits to run the instance for its\nfirst hour.\n\nThe instance is created asynchronously: a successful request returns immediately, and the instance\nappears in the instance list while its `status` moves from `created` through `creating` to `running`.\n\nUse this endpoint to provision GPU compute.",
    "method": "POST",
    "path": "/api/gpu/v1/instances",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pool_instance_id": {
          "type": "integer",
          "description": "Instance type ID from the pool instance types list"
        },
        "os_template_id": {
          "type": "integer",
          "description": "OS template ID available for the selected instance type"
        },
        "name": {
          "type": "string",
          "description": "Instance name, unique among your instances. Letters, numbers, dashes and underscores only"
        },
        "public_keys": {
          "type": "array",
          "description": "SSH public keys to add to the instance",
          "items": {
            "type": "string",
            "description": "public_keys parameter"
          }
        }
      },
      "required": [
        "pool_instance_id",
        "os_template_id",
        "name"
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
    "name": "gpu_instances_metrics",
    "title": "Get instance metrics",
    "annotations": {
      "title": "Get instance metrics",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve utilisation metrics of a specified GPU instance for the last hour.\n\nEach data point contains CPU, memory and GPU utilisation, used GPU memory and GPU throughput.\nThe list is empty until the instance is provisioned.\n\nUse this endpoint to monitor GPU instance load.",
    "method": "GET",
    "path": "/api/gpu/v1/instances/{instanceId}/metrics",
    "inputSchema": {
      "type": "object",
      "properties": {
        "instanceId": {
          "type": "integer",
          "description": "GPU instance ID"
        }
      },
      "required": [
        "instanceId"
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
    "name": "gpu_catalog_pool-groups",
    "title": "Get pool groups",
    "annotations": {
      "title": "Get pool groups",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve GPU pool groups, ordered by name.\n\nEach group bundles the pools of one GPU model and lists its currently available pools,\nwhether any of them is available and the lowest hourly price, in credits, among its instance types.\nThe price is returned even when the group is out of stock.\n\nUse this endpoint to show which GPU models can be ordered and from what price.",
    "method": "GET",
    "path": "/api/gpu/v1/pools/groups",
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
