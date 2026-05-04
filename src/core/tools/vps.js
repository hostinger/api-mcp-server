// Auto-generated tool list for group: vps
export default [
  {
    "name": "VPS_getDataCenterListV1",
    "description": "Retrieve all available data centers.\n\nUse this endpoint to view location options before deploying VPS instances.",
    "method": "GET",
    "path": "/api/vps/v1/data-centers",
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
    "group": "vps"
  },
  {
    "name": "VPS_getProjectContainersV1",
    "description": "Retrieves a list of all containers belonging to a specific Docker Compose project on the virtual machine. \n\nThis endpoint returns detailed information about each container including\ntheir current status, port mappings, and runtime configuration.\n\nUse this to monitor the health and state of all services within your Docker Compose project.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/containers",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getProjectContentsV1",
    "description": "Retrieves the complete project information including the docker-compose.yml\nfile contents, project metadata, and current deployment status.\n\nThis endpoint provides the full configuration and state details of a specific Docker Compose project. \n\nUse this to inspect project settings, review the compose file, or check the overall project health.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_deleteProjectV1",
    "description": "Completely removes a Docker Compose project from the virtual machine, stopping all containers and cleaning up \nassociated resources including networks, volumes, and images. \n\nThis operation is irreversible and will delete all project data. \n\nUse this when you want to permanently remove a project and free up system resources.",
    "method": "DELETE",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/down",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getProjectListV1",
    "description": "Retrieves a list of all Docker Compose projects currently deployed on the virtual machine. \n\nThis endpoint returns basic information about each project including name,\nstatus, file path and list of containers with details about their names,\nimage, status, health and ports. Container stats are omitted in this\nendpoint. If you need to get detailed information about container with\nstats included, use the `Get project containers` endpoint.\n\nUse this to get an overview of all Docker projects on your VPS instance.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_createNewProjectV1",
    "description": "Deploy new project from docker-compose.yaml contents or download contents from URL. \n\nURL can be Github repository url in format https://github.com/[user]/[repo]\nand it will be automatically resolved to docker-compose.yaml file in\nmaster branch. Any other URL provided must return docker-compose.yaml\nfile contents.\n\nIf project with the same name already exists, existing project will be replaced.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "project_name": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        },
        "content": {
          "type": "string",
          "description": "URL pointing to docker-compose.yaml file, Github repository or raw YAML content of the compose file"
        },
        "environment": {
          "type": "string",
          "description": "Project environment variables"
        }
      },
      "required": [
        "virtualMachineId",
        "project_name",
        "content"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getProjectLogsV1",
    "description": "Retrieves aggregated log entries from all services within a Docker Compose project. \n\nThis endpoint returns recent log output from each container, organized by service name with timestamps. \nThe response contains the last 300 log entries across all services. \n\nUse this for debugging, monitoring application behavior, and\ntroubleshooting issues across your entire project stack.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/logs",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_restartProjectV1",
    "description": "Restarts all services in a Docker Compose project by stopping and starting\ncontainers in the correct dependency order.\n\nThis operation preserves data volumes and network configurations while refreshing the running containers. \n\nUse this to apply configuration changes or recover from service failures.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/restart",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_startProjectV1",
    "description": "Starts all services in a Docker Compose project that are currently stopped. \n\nThis operation brings up containers in the correct dependency order as defined in the compose file. \n\nUse this to resume a project that was previously stopped or to start services after a system reboot.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/start",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_stopProjectV1",
    "description": "Stops all running services in a Docker Compose project while preserving\ncontainer configurations and data volumes.\n\nThis operation gracefully shuts down containers in reverse dependency order. \n\nUse this to temporarily halt a project without removing data or configurations.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/stop",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_updateProjectV1",
    "description": "Updates a Docker Compose project by pulling the latest image versions and\nrecreating containers with new configurations.\n\nThis operation preserves data volumes while applying changes from the compose file. \n\nUse this to deploy application updates, apply configuration changes, or\nrefresh container images to their latest versions.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/update",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "projectName": {
          "type": "string",
          "description": "Docker Compose project name using alphanumeric characters, dashes, and underscores only"
        }
      },
      "required": [
        "virtualMachineId",
        "projectName"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_activateFirewallV1",
    "description": "Activate a firewall for a specified virtual machine.\n\nOnly one firewall can be active for a virtual machine at a time.\n\nUse this endpoint to apply firewall rules to VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/firewall/{firewallId}/activate/{virtualMachineId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        },
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "firewallId",
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_deactivateFirewallV1",
    "description": "Deactivate a firewall for a specified virtual machine.\n\nUse this endpoint to remove firewall protection from VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/firewall/{firewallId}/deactivate/{virtualMachineId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        },
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "firewallId",
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getFirewallDetailsV1",
    "description": "Retrieve firewall by its ID and rules associated with it.\n\nUse this endpoint to view specific firewall configuration and rules.",
    "method": "GET",
    "path": "/api/vps/v1/firewall/{firewallId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        }
      },
      "required": [
        "firewallId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_deleteFirewallV1",
    "description": "Delete a specified firewall.\n\nAny virtual machine that has this firewall activated will automatically have it deactivated.\n\nUse this endpoint to remove unused firewall configurations.",
    "method": "DELETE",
    "path": "/api/vps/v1/firewall/{firewallId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        }
      },
      "required": [
        "firewallId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getFirewallListV1",
    "description": "Retrieve all available firewalls.\n\nUse this endpoint to view existing firewall configurations.",
    "method": "GET",
    "path": "/api/vps/v1/firewall",
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
    "group": "vps"
  },
  {
    "name": "VPS_createNewFirewallV1",
    "description": "Create a new firewall.\n\nUse this endpoint to set up new firewall configurations for VPS security.",
    "method": "POST",
    "path": "/api/vps/v1/firewall",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "name parameter"
        }
      },
      "required": [
        "name"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_updateFirewallRuleV1",
    "description": "Update a specific firewall rule from a specified firewall.\n\nAny virtual machine that has this firewall activated will lose sync with the firewall\nand will have to be synced again manually.\n\nUse this endpoint to modify existing firewall rules.",
    "method": "PUT",
    "path": "/api/vps/v1/firewall/{firewallId}/rules/{ruleId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        },
        "ruleId": {
          "type": "integer",
          "description": "Firewall Rule ID"
        },
        "protocol": {
          "type": "string",
          "description": "protocol parameter",
          "enum": [
            "TCP",
            "UDP",
            "ICMP",
            "GRE",
            "any",
            "ESP",
            "AH",
            "ICMPv6",
            "SSH",
            "HTTP",
            "HTTPS",
            "MySQL",
            "PostgreSQL"
          ]
        },
        "port": {
          "type": "string",
          "description": "Port or port range, ex: 1024:2048"
        },
        "source": {
          "type": "string",
          "description": "source parameter",
          "enum": [
            "any",
            "custom"
          ]
        },
        "source_detail": {
          "type": "string",
          "description": "IP range, CIDR, single IP or `any`"
        }
      },
      "required": [
        "firewallId",
        "ruleId",
        "protocol",
        "port",
        "source",
        "source_detail"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_deleteFirewallRuleV1",
    "description": "Delete a specific firewall rule from a specified firewall.\n\nAny virtual machine that has this firewall activated will lose sync with the firewall\nand will have to be synced again manually.\n\nUse this endpoint to remove specific firewall rules.",
    "method": "DELETE",
    "path": "/api/vps/v1/firewall/{firewallId}/rules/{ruleId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        },
        "ruleId": {
          "type": "integer",
          "description": "Firewall Rule ID"
        }
      },
      "required": [
        "firewallId",
        "ruleId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_createFirewallRuleV1",
    "description": "Create new firewall rule for a specified firewall.\n\nBy default, the firewall drops all incoming traffic,\nwhich means you must add accept rules for all ports you want to use.\n\nAny virtual machine that has this firewall activated will lose sync with the firewall\nand will have to be synced again manually.\n\nUse this endpoint to add new security rules to firewalls.",
    "method": "POST",
    "path": "/api/vps/v1/firewall/{firewallId}/rules",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        },
        "protocol": {
          "type": "string",
          "description": "protocol parameter",
          "enum": [
            "TCP",
            "UDP",
            "ICMP",
            "GRE",
            "any",
            "ESP",
            "AH",
            "ICMPv6",
            "SSH",
            "HTTP",
            "HTTPS",
            "MySQL",
            "PostgreSQL"
          ]
        },
        "port": {
          "type": "string",
          "description": "Port or port range, ex: 1024:2048"
        },
        "source": {
          "type": "string",
          "description": "source parameter",
          "enum": [
            "any",
            "custom"
          ]
        },
        "source_detail": {
          "type": "string",
          "description": "IP range, CIDR, single IP or `any`"
        }
      },
      "required": [
        "firewallId",
        "protocol",
        "port",
        "source",
        "source_detail"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_syncFirewallV1",
    "description": "Sync a firewall for a specified virtual machine.\n\nFirewall can lose sync with virtual machine if the firewall has new rules added, removed or updated.\n\nUse this endpoint to apply updated firewall rules to VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/firewall/{firewallId}/sync/{virtualMachineId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firewallId": {
          "type": "integer",
          "description": "Firewall ID"
        },
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "firewallId",
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getPostInstallScriptV1",
    "description": "Retrieve post-install script by its ID.\n\nUse this endpoint to view specific automation script details.",
    "method": "GET",
    "path": "/api/vps/v1/post-install-scripts/{postInstallScriptId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "postInstallScriptId": {
          "type": "integer",
          "description": "Post-install script ID"
        }
      },
      "required": [
        "postInstallScriptId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_updatePostInstallScriptV1",
    "description": "Update a specific post-install script.\n\nUse this endpoint to modify existing automation scripts.",
    "method": "PUT",
    "path": "/api/vps/v1/post-install-scripts/{postInstallScriptId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "postInstallScriptId": {
          "type": "integer",
          "description": "Post-install script ID"
        },
        "name": {
          "type": "string",
          "description": "Name of the script"
        },
        "content": {
          "type": "string",
          "description": "Content of the script"
        }
      },
      "required": [
        "postInstallScriptId",
        "name",
        "content"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_deletePostInstallScriptV1",
    "description": "Delete a post-install script from your account.\n       \nUse this endpoint to remove unused automation scripts.",
    "method": "DELETE",
    "path": "/api/vps/v1/post-install-scripts/{postInstallScriptId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "postInstallScriptId": {
          "type": "integer",
          "description": "Post-install script ID"
        }
      },
      "required": [
        "postInstallScriptId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getPostInstallScriptsV1",
    "description": "Retrieve post-install scripts associated with your account.\n\nUse this endpoint to view available automation scripts for VPS deployment.",
    "method": "GET",
    "path": "/api/vps/v1/post-install-scripts",
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
    "group": "vps"
  },
  {
    "name": "VPS_createPostInstallScriptV1",
    "description": "Add a new post-install script to your account, which can then be used after virtual machine installation.\n\nThe script contents will be saved to the file `/post_install` with executable attribute set\nand will be executed once virtual machine is installed.\nThe output of the script will be redirected to `/post_install.log`. Maximum script size is 48KB.\n\nUse this endpoint to create automation scripts for VPS setup tasks.",
    "method": "POST",
    "path": "/api/vps/v1/post-install-scripts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Name of the script"
        },
        "content": {
          "type": "string",
          "description": "Content of the script"
        }
      },
      "required": [
        "name",
        "content"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_attachPublicKeyV1",
    "description": "Attach existing public keys from your account to a specified virtual machine.\n\nMultiple keys can be attached to a single virtual machine.\n\nUse this endpoint to enable SSH key authentication for VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/public-keys/attach/{virtualMachineId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "ids": {
          "type": "array",
          "description": "Public Key IDs to attach",
          "items": {
            "type": "integer",
            "description": "ids parameter"
          }
        }
      },
      "required": [
        "virtualMachineId",
        "ids"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_deletePublicKeyV1",
    "description": "Delete a public key from your account. \n\n**Deleting public key from account does not remove it from virtual machine** \n       \nUse this endpoint to remove unused SSH keys from account.",
    "method": "DELETE",
    "path": "/api/vps/v1/public-keys/{publicKeyId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "publicKeyId": {
          "type": "integer",
          "description": "Public Key ID"
        }
      },
      "required": [
        "publicKeyId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getPublicKeysV1",
    "description": "Retrieve public keys associated with your account.\n\nUse this endpoint to view available SSH keys for VPS authentication.",
    "method": "GET",
    "path": "/api/vps/v1/public-keys",
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
    "group": "vps"
  },
  {
    "name": "VPS_createPublicKeyV1",
    "description": "Add a new public key to your account.\n\nUse this endpoint to register SSH keys for VPS authentication.",
    "method": "POST",
    "path": "/api/vps/v1/public-keys",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "name parameter"
        },
        "key": {
          "type": "string",
          "description": "key parameter"
        }
      },
      "required": [
        "name",
        "key"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getTemplateDetailsV1",
    "description": "Retrieve detailed information about a specific OS template for virtual machines.\n\nUse this endpoint to view specific template specifications before deployment.",
    "method": "GET",
    "path": "/api/vps/v1/templates/{templateId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "templateId": {
          "type": "integer",
          "description": "Template ID"
        }
      },
      "required": [
        "templateId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getTemplatesV1",
    "description": "Retrieve available OS templates for virtual machines.\n\nUse this endpoint to view operating system options before creating or recreating VPS instances.",
    "method": "GET",
    "path": "/api/vps/v1/templates",
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
    "group": "vps"
  },
  {
    "name": "VPS_getActionDetailsV1",
    "description": "Retrieve detailed information about a specific action performed on a specified virtual machine.\n\nUse this endpoint to monitor specific VPS operation status and details.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/actions/{actionId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "actionId": {
          "type": "integer",
          "description": "Action ID"
        }
      },
      "required": [
        "virtualMachineId",
        "actionId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getActionsV1",
    "description": "Retrieve actions performed on a specified virtual machine.\n\nActions are operations or events that have been executed on the virtual\nmachine, such as starting, stopping, or modifying the machine. This endpoint\nallows you to view the history of these actions, providing details about\neach action, such as the action name, timestamp, and status.\n\nUse this endpoint to view VPS operation history and troubleshoot issues.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/actions",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "page": {
          "type": "integer",
          "description": "Page number"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getAttachedPublicKeysV1",
    "description": "Retrieve public keys attached to a specified virtual machine.\n\nUse this endpoint to view SSH keys configured for specific VPS instances.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/public-keys",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "page": {
          "type": "integer",
          "description": "Page number"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getBackupsV1",
    "description": "Retrieve backups for a specified virtual machine.\n\nUse this endpoint to view available backup points for VPS data recovery.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/backups",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "page": {
          "type": "integer",
          "description": "Page number"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_restoreBackupV1",
    "description": "Restore a backup for a specified virtual machine.\n\nThe system will then initiate the restore process, which may take some time depending on the size of the backup.\n\n**All data on the virtual machine will be overwritten with the data from the backup.**\n\nUse this endpoint to recover VPS data from backup points.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/backups/{backupId}/restore",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "backupId": {
          "type": "integer",
          "description": "Backup ID"
        }
      },
      "required": [
        "virtualMachineId",
        "backupId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_setHostnameV1",
    "description": "Set hostname for a specified virtual machine.\n\nChanging hostname does not update PTR record automatically.\nIf you want your virtual machine to be reachable by a hostname, \nyou need to point your domain A/AAAA records to virtual machine IP as well.\n\nUse this endpoint to configure custom hostnames for VPS instances.",
    "method": "PUT",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/hostname",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "hostname": {
          "type": "string",
          "description": "hostname parameter"
        }
      },
      "required": [
        "virtualMachineId",
        "hostname"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_resetHostnameV1",
    "description": "Reset hostname and PTR record of a specified virtual machine to default value.\n\nUse this endpoint to restore default hostname configuration for VPS instances.",
    "method": "DELETE",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/hostname",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getVirtualMachineDetailsV1",
    "description": "Retrieve detailed information about a specified virtual machine.\n\nUse this endpoint to view comprehensive VPS configuration and status.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getVirtualMachinesV1",
    "description": "Retrieve all available virtual machines.\n\nUse this endpoint to view available VPS instances.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines",
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
    "group": "vps"
  },
  {
    "name": "VPS_purchaseNewVirtualMachineV1",
    "description": "Purchase and setup a new virtual machine.\n\nIf virtual machine setup fails for any reason, login to\n[hPanel](https://hpanel.hostinger.com/) and complete the setup manually.\n\nIf no payment method is provided, your default payment method will be used automatically.\n\nUse this endpoint to create new VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines",
    "inputSchema": {
      "type": "object",
      "properties": {
        "item_id": {
          "type": "string",
          "description": "Catalog price item ID"
        },
        "payment_method_id": {
          "type": "integer",
          "description": "Payment method ID, default will be used if not provided"
        },
        "setup": {
          "type": "string",
          "description": "setup parameter"
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
        "item_id",
        "setup"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getScanMetricsV1",
    "description": "Retrieve scan metrics for the [Monarx](https://www.monarx.com/) malware scanner\ninstalled on a specified virtual machine.\n\nThe scan metrics provide detailed information about malware scans performed\nby Monarx, including number of scans, detected threats, and other relevant\nstatistics. This information is useful for monitoring security status of the\nvirtual machine and assessing effectiveness of the malware scanner.\n\nUse this endpoint to monitor VPS security scan results and threat detection.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/monarx",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_installMonarxV1",
    "description": "Install the Monarx malware scanner on a specified virtual machine.\n\n[Monarx](https://www.monarx.com/) is a security tool designed to detect and\nprevent malware infections on virtual machines. By installing Monarx, users\ncan enhance the security of their virtual machines, ensuring that they are\nprotected against malicious software.\n\nUse this endpoint to enable malware protection on VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/monarx",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_uninstallMonarxV1",
    "description": "Uninstall the Monarx malware scanner on a specified virtual machine.\n\nIf Monarx is not installed, the request will still be processed without any effect.\n\nUse this endpoint to remove malware scanner from VPS instances.",
    "method": "DELETE",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/monarx",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getMetricsV1",
    "description": "Retrieve historical metrics for a specified virtual machine.\n\nIt includes the following metrics: \n- CPU usage\n- Memory usage\n- Disk usage\n- Network usage\n- Uptime\n\nUse this endpoint to monitor VPS performance and resource utilization over time.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/metrics",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "date_from": {
          "type": "string",
          "description": "date_from parameter"
        },
        "date_to": {
          "type": "string",
          "description": "date_to parameter"
        }
      },
      "required": [
        "virtualMachineId",
        "date_from",
        "date_to"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_setNameserversV1",
    "description": "Set nameservers for a specified virtual machine.\n\nBe aware, that improper nameserver configuration can lead to the virtual\nmachine being unable to resolve domain names.\n\nUse this endpoint to configure custom DNS resolvers for VPS instances.",
    "method": "PUT",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/nameservers",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "ns1": {
          "type": "string",
          "description": "ns1 parameter"
        },
        "ns2": {
          "type": "string",
          "description": "ns2 parameter"
        },
        "ns3": {
          "type": "string",
          "description": "ns3 parameter"
        }
      },
      "required": [
        "virtualMachineId",
        "ns1"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_createPTRRecordV1",
    "description": "Create or update a PTR (Pointer) record for a specified virtual machine.\n\nUse this endpoint to configure reverse DNS lookup for VPS IP addresses.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/ptr/{ipAddressId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "ipAddressId": {
          "type": "integer",
          "description": "IP Address ID"
        },
        "domain": {
          "type": "string",
          "description": "Pointer record domain"
        }
      },
      "required": [
        "virtualMachineId",
        "ipAddressId",
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_deletePTRRecordV1",
    "description": "Delete a PTR (Pointer) record for a specified virtual machine.\n\nOnce deleted, reverse DNS lookups to the virtual machine's IP address will\nno longer return the previously configured hostname.\n\nUse this endpoint to remove reverse DNS configuration from VPS instances.",
    "method": "DELETE",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/ptr/{ipAddressId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "ipAddressId": {
          "type": "integer",
          "description": "IP Address ID"
        }
      },
      "required": [
        "virtualMachineId",
        "ipAddressId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_setPanelPasswordV1",
    "description": "Set panel password for a specified virtual machine.\n\nIf virtual machine does not use panel OS, the request will still be processed without any effect.\nRequirements for password are same as in the [recreate virtual machine\nendpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).\n\nUse this endpoint to configure control panel access credentials for VPS instances.",
    "method": "PUT",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/panel-password",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "password": {
          "type": "string",
          "description": "Panel password for the virtual machine"
        }
      },
      "required": [
        "virtualMachineId",
        "password"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_startRecoveryModeV1",
    "description": "Initiate recovery mode for a specified virtual machine.\n\nRecovery mode is a special state that allows users to perform system rescue operations, \nsuch as repairing file systems, recovering data, or troubleshooting issues that prevent the virtual machine \nfrom booting normally. \n\nVirtual machine will boot recovery disk image and original disk image will be mounted in `/mnt` directory.\n\nUse this endpoint to enable system rescue operations on VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/recovery",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "root_password": {
          "type": "string",
          "description": "Temporary root password for recovery mode"
        }
      },
      "required": [
        "virtualMachineId",
        "root_password"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_stopRecoveryModeV1",
    "description": "Stop recovery mode for a specified virtual machine.\n\nIf virtual machine is not in recovery mode, this operation will fail.\n\nUse this endpoint to exit system rescue mode and return VPS to normal operation.",
    "method": "DELETE",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/recovery",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_recreateVirtualMachineV1",
    "description": "Recreate a virtual machine from scratch.\n\nThe recreation process involves reinstalling the operating system and\nresetting the virtual machine to its initial state.\nSnapshots, if there are any, will be deleted.\n\n## Password Requirements\nPassword will be checked against leaked password databases. \nRequirements for the password are:\n- At least 12 characters long\n- At least one uppercase letter\n- At least one lowercase letter\n- At least one number\n- Is not leaked publicly\n\n**This operation is irreversible and will result in the loss of all data stored on the virtual machine!**\n\nUse this endpoint to completely rebuild VPS instances with fresh OS installation.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/recreate",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "template_id": {
          "type": "integer",
          "description": "Template ID"
        },
        "password": {
          "type": "string",
          "description": "Root password for the virtual machine. If not provided, random password will be generated.\nPassword will not be shown in the response."
        },
        "panel_password": {
          "type": "string",
          "description": "Panel password for the panel-based OS template. If not provided, random password will be generated.\nIf OS does not support panel_password this field will be ignored.\nPassword will not be shown in the response."
        },
        "post_install_script_id": {
          "type": "integer",
          "description": "Post-install script to execute after virtual machine was recreated"
        }
      },
      "required": [
        "virtualMachineId",
        "template_id"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_restartVirtualMachineV1",
    "description": "Restart a specified virtual machine by fully stopping and starting it.\n\nIf the virtual machine was stopped, it will be started.\n\nUse this endpoint to reboot VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/restart",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_setRootPasswordV1",
    "description": "Set root password for a specified virtual machine.\n\nRequirements for password are same as in the [recreate virtual machine\nendpoint](/#tag/vps-virtual-machine/POST/api/vps/v1/virtual-machines/{virtualMachineId}/recreate).\n\nUse this endpoint to update administrator credentials for VPS instances.",
    "method": "PUT",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/root-password",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "password": {
          "type": "string",
          "description": "Root password for the virtual machine"
        }
      },
      "required": [
        "virtualMachineId",
        "password"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_setupPurchasedVirtualMachineV1",
    "description": "Setup newly purchased virtual machine with `initial` state.\n\nUse this endpoint to configure and initialize purchased VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/setup",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        },
        "template_id": {
          "type": "integer",
          "description": "Template ID"
        },
        "data_center_id": {
          "type": "integer",
          "description": "Data center ID"
        },
        "post_install_script_id": {
          "type": "integer",
          "description": "Post-install script ID"
        },
        "password": {
          "type": "string",
          "description": "Password for the virtual machine. If not provided, random password will be generated.\nPassword will not be shown in the response."
        },
        "hostname": {
          "type": "string",
          "description": "Override default hostname of the virtual machine"
        },
        "install_monarx": {
          "type": "boolean",
          "description": "Install Monarx malware scanner (if supported)"
        },
        "enable_backups": {
          "type": "boolean",
          "description": "Enable weekly backup schedule"
        },
        "ns1": {
          "type": "string",
          "description": "Name server 1"
        },
        "ns2": {
          "type": "string",
          "description": "Name server 2"
        },
        "public_key": {
          "type": "object",
          "description": "Use SSH key",
          "properties": {
            "name": {
              "type": "string",
              "description": "Name of the SSH key"
            },
            "key": {
              "type": "string",
              "description": "Contents of the SSH key"
            }
          }
        }
      },
      "required": [
        "virtualMachineId",
        "data_center_id",
        "template_id"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_getSnapshotV1",
    "description": "Retrieve snapshot for a specified virtual machine.\n\nUse this endpoint to view current VPS snapshot information.",
    "method": "GET",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_createSnapshotV1",
    "description": "Create a snapshot of a specified virtual machine.\n\nA snapshot captures the state and data of the virtual machine at a specific point in time, \nallowing users to restore the virtual machine to that state if needed. \nThis operation is useful for backup purposes, system recovery, \nand testing changes without affecting the current state of the virtual machine.\n\n**Creating new snapshot will overwrite the existing snapshot!**\n\nUse this endpoint to capture VPS state for backup and recovery purposes.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_deleteSnapshotV1",
    "description": "Delete a snapshot of a specified virtual machine.\n\nUse this endpoint to remove VPS snapshots.",
    "method": "DELETE",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_restoreSnapshotV1",
    "description": "Restore a specified virtual machine to a previous state using a snapshot.\n\nRestoring from a snapshot allows users to revert the virtual machine to that state,\nwhich is useful for system recovery, undoing changes, or testing.\n\nUse this endpoint to revert VPS instances to previous saved states.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/snapshot/restore",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_startVirtualMachineV1",
    "description": "Start a specified virtual machine.\n\nIf the virtual machine is already running, the request will still be processed without any effect.\n\nUse this endpoint to power on stopped VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/start",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  },
  {
    "name": "VPS_stopVirtualMachineV1",
    "description": "Stop a specified virtual machine.\n\nIf the virtual machine is already stopped, the request will still be processed without any effect.\n\nUse this endpoint to power off running VPS instances.",
    "method": "POST",
    "path": "/api/vps/v1/virtual-machines/{virtualMachineId}/stop",
    "inputSchema": {
      "type": "object",
      "properties": {
        "virtualMachineId": {
          "type": "integer",
          "description": "Virtual Machine ID"
        }
      },
      "required": [
        "virtualMachineId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "vps"
  }
];
