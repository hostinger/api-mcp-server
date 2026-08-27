// Auto-generated tool list for group: dns
export default [
  {
    "name": "DNS_getDNSSnapshotV1",
    "title": "Get DNS snapshot",
    "annotations": {
      "title": "Get DNS snapshot",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve particular DNS snapshot with contents of DNS zone records.\n\nUse this endpoint to view historical DNS configurations for domains.",
    "method": "GET",
    "path": "/api/dns/v1/snapshots/{domain}/{snapshotId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "snapshotId": {
          "type": "integer",
          "description": "Snapshot ID"
        }
      },
      "required": [
        "domain",
        "snapshotId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "dns"
  },
  {
    "name": "DNS_getDNSSnapshotListV1",
    "title": "Get DNS snapshot list",
    "annotations": {
      "title": "Get DNS snapshot list",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve DNS snapshots for a domain.\n\nUse this endpoint to view available DNS backup points for restoration.",
    "method": "GET",
    "path": "/api/dns/v1/snapshots/{domain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "dns"
  },
  {
    "name": "DNS_restoreDNSSnapshotV1",
    "title": "Restore DNS snapshot",
    "annotations": {
      "title": "Restore DNS snapshot",
      "readOnlyHint": false,
      "destructiveHint": true
    },
    "description": "Restore DNS zone to the selected snapshot.\n\nUse this endpoint to revert domain DNS to a previous configuration.",
    "method": "POST",
    "path": "/api/dns/v1/snapshots/{domain}/{snapshotId}/restore",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "snapshotId": {
          "type": "integer",
          "description": "Snapshot ID"
        }
      },
      "required": [
        "domain",
        "snapshotId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "dns"
  },
  {
    "name": "DNS_getDNSRecordsV1",
    "title": "Get DNS records",
    "annotations": {
      "title": "Get DNS records",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve DNS zone records for a specific domain.\n\nUse this endpoint to view current DNS configuration for domain management.",
    "method": "GET",
    "path": "/api/dns/v1/zones/{domain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "dns"
  },
  {
    "name": "DNS_updateDNSRecordsV1",
    "title": "Update DNS records",
    "annotations": {
      "title": "Update DNS records",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Update DNS records for the selected domain.\n\nUsing `overwrite = true` will replace existing records with the provided ones. \nOtherwise existing records will be updated and new records will be added.\n\nUse this endpoint to modify domain DNS configuration.",
    "method": "PUT",
    "path": "/api/dns/v1/zones/{domain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "overwrite": {
          "type": "boolean",
          "description": "If `true`, resource records (RRs) matching name and type will be deleted and new RRs will be created,\notherwise resource records' ttl's are updated and new records are appended.\nIf no matching RRs are found, they are created."
        },
        "zone": {
          "type": "array",
          "description": "zone parameter",
          "items": {
            "type": "object",
            "description": "zone parameter",
            "properties": {
              "name": {
                "type": "string",
                "description": "Name of the record (use `@` for wildcard name)"
              },
              "records": {
                "type": "array",
                "description": "Records assigned to the name",
                "items": {
                  "type": "object",
                  "description": "records parameter",
                  "properties": {
                    "content": {
                      "type": "string",
                      "description": "Content of the name record"
                    }
                  },
                  "required": [
                    "content"
                  ]
                }
              },
              "ttl": {
                "type": "integer",
                "description": "TTL (Time-To-Live) of the record"
              },
              "type": {
                "type": "string",
                "description": "Type of the record",
                "enum": [
                  "A",
                  "AAAA",
                  "CNAME",
                  "ALIAS",
                  "MX",
                  "TXT",
                  "NS",
                  "SOA",
                  "SRV",
                  "CAA"
                ]
              }
            },
            "required": [
              "name",
              "records",
              "type"
            ]
          }
        }
      },
      "required": [
        "domain",
        "zone"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "dns"
  },
  {
    "name": "DNS_deleteDNSRecordsV1",
    "title": "Delete DNS records",
    "annotations": {
      "title": "Delete DNS records",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Delete DNS records for the selected domain.\n\nTo filter which records to delete, add the `name` of the record and `type` to the filter. \nMultiple filters can be provided with single request.\n\nIf you have multiple records with the same name and type, and you want to delete only part of them,\nrefer to the `Update zone records` endpoint.\n\nUse this endpoint to remove specific DNS records from domains.",
    "method": "DELETE",
    "path": "/api/dns/v1/zones/{domain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "dns"
  },
  {
    "name": "DNS_resetDNSRecordsV1",
    "title": "Reset DNS records",
    "annotations": {
      "title": "Reset DNS records",
      "readOnlyHint": false,
      "destructiveHint": true
    },
    "description": "Reset DNS zone to the default records.\n\nUse this endpoint to restore domain DNS to original configuration.",
    "method": "POST",
    "path": "/api/dns/v1/zones/{domain}/reset",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "sync": {
          "type": "boolean",
          "description": "Determines if operation should be run synchronously"
        },
        "reset_email_records": {
          "type": "boolean",
          "description": "Determines if email records should be reset"
        },
        "whitelisted_record_types": {
          "type": "array",
          "description": "Specifies which record types to not reset",
          "items": {
            "type": "string",
            "description": "whitelisted_record_types parameter"
          }
        }
      },
      "required": [
        "domain"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "dns"
  },
  {
    "name": "DNS_validateDNSRecordsV1",
    "title": "Validate DNS records",
    "annotations": {
      "title": "Validate DNS records",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Validate DNS records prior to update for the selected domain.\n\nIf the validation is successful, the response will contain `200 Success` code.\nIf there is validation error, the response will fail with `422 Validation error` code.\n\nUse this endpoint to verify DNS record validity before applying changes.",
    "method": "POST",
    "path": "/api/dns/v1/zones/{domain}/validate",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name"
        },
        "overwrite": {
          "type": "boolean",
          "description": "If `true`, resource records (RRs) matching name and type will be deleted and new RRs will be created,\notherwise resource records' ttl's are updated and new records are appended.\nIf no matching RRs are found, they are created."
        },
        "zone": {
          "type": "array",
          "description": "zone parameter",
          "items": {
            "type": "object",
            "description": "zone parameter",
            "properties": {
              "name": {
                "type": "string",
                "description": "Name of the record (use `@` for wildcard name)"
              },
              "records": {
                "type": "array",
                "description": "Records assigned to the name",
                "items": {
                  "type": "object",
                  "description": "records parameter",
                  "properties": {
                    "content": {
                      "type": "string",
                      "description": "Content of the name record"
                    }
                  },
                  "required": [
                    "content"
                  ]
                }
              },
              "ttl": {
                "type": "integer",
                "description": "TTL (Time-To-Live) of the record"
              },
              "type": {
                "type": "string",
                "description": "Type of the record",
                "enum": [
                  "A",
                  "AAAA",
                  "CNAME",
                  "ALIAS",
                  "MX",
                  "TXT",
                  "NS",
                  "SOA",
                  "SRV",
                  "CAA"
                ]
              }
            },
            "required": [
              "name",
              "records",
              "type"
            ]
          }
        }
      },
      "required": [
        "domain",
        "zone"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "dns"
  }
];
