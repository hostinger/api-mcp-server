// Auto-generated tool list for group: reach
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
    "name": "reach_deleteAContactV1",
    "description": "Delete a contact with the specified UUID.\n\nThis endpoint permanently removes a contact from the email marketing system.\n\n**Deprecated.** This endpoint cannot target a profile, so it always falls back to the\nclient's default profile and cannot delete contacts of any other profile. Use\n`DELETE /api/reach/v1/profiles/{profileUuid}/contacts/{contactUuid}` instead.",
    "method": "DELETE",
    "path": "/api/reach/v1/contacts/{uuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "uuid": {
          "type": "string",
          "description": "UUID of the contact to delete"
        }
      },
      "required": [
        "uuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_deleteAContactFieldV1",
    "description": "Delete a custom contact field.\n\nEvery value contacts hold for the field is deleted with it, and for the choice types so\nare its options. The contacts themselves are not affected.",
    "method": "DELETE",
    "path": "/api/reach/v1/profiles/{profileUuid}/contacts/fields/{fieldUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "fieldUuid": {
          "type": "string",
          "description": "Contact field uuid parameter"
        }
      },
      "required": [
        "profileUuid",
        "fieldUuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_updateAContactFieldV1",
    "description": "Rename a custom contact field and, for the choice types, replace its option set.\n\nOptions carrying a uuid are kept and relabelled, options without one are created, and any\nexisting option left out of the list is deleted along with the values contacts hold for\nit. The field type and slug cannot be changed.",
    "method": "PATCH",
    "path": "/api/reach/v1/profiles/{profileUuid}/contacts/fields/{fieldUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "fieldUuid": {
          "type": "string",
          "description": "Contact field uuid parameter"
        },
        "label": {
          "type": "string",
          "description": "label parameter"
        },
        "options": {
          "type": "array",
          "description": "Replaces the option set when provided. Entries carrying a uuid are kept and relabelled, entries without one are created, and any existing option missing from the list is deleted along with the values contacts hold for it.",
          "items": {
            "type": "object",
            "description": "options parameter",
            "properties": {
              "uuid": {
                "type": "string",
                "description": "uuid parameter"
              },
              "label": {
                "type": "string",
                "description": "label parameter"
              }
            },
            "required": [
              "label"
            ]
          }
        }
      },
      "required": [
        "profileUuid",
        "fieldUuid",
        "label"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_listContactFieldsV1",
    "description": "Get the custom contact fields defined in a profile.\n\nCustom fields let you store your own attributes on contacts. The returned uuids are what\nyou pass to the contact update endpoint to set values, and choice fields also list the\noptions available to pick from.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/contacts/fields",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        }
      },
      "required": [
        "profileUuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_createAContactFieldV1",
    "description": "Define a new custom contact field in a profile.\n\nThe `slug` is derived from the label and, like the field type, cannot be changed later.\nUse the returned uuid to set values on contacts.",
    "method": "POST",
    "path": "/api/reach/v1/profiles/{profileUuid}/contacts/fields",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "type": {
          "type": "string",
          "description": "Immutable once the field exists",
          "enum": [
            "text",
            "number",
            "date",
            "single_choice",
            "multi_choice"
          ]
        },
        "label": {
          "type": "string",
          "description": "label parameter"
        },
        "options": {
          "type": "array",
          "description": "Required for single_choice and multi_choice, ignored for the scalar types. Labels must be unique regardless of casing.",
          "items": {
            "type": "string",
            "description": "options parameter"
          }
        }
      },
      "required": [
        "profileUuid",
        "type",
        "label"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_listContactGroupsV1",
    "description": "Get a list of all contact groups.\n\nThis endpoint returns a list of contact groups that can be used to organize contacts.",
    "method": "GET",
    "path": "/api/reach/v1/contacts/groups",
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
    "group": "reach"
  },
  {
    "name": "reach_listContactsV1",
    "description": "Get a list of contacts, optionally filtered by group and subscription status.\n\nThis endpoint returns a paginated list of contacts with their basic information.\nYou can filter contacts by group UUID and subscription status.\n\n**Deprecated.** This endpoint cannot target a profile, so it always falls back to the\nclient's default profile and cannot list contacts of any other profile. Use\n`GET /api/reach/v1/profiles/{profileUuid}/contacts` instead, which also replaces the\ngroup filter with a tag filter.",
    "method": "GET",
    "path": "/api/reach/v1/contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "group_uuid": {
          "type": "string",
          "description": "Filter contacts by group UUID"
        },
        "subscription_status": {
          "type": "string",
          "description": "Filter contacts by subscription status",
          "enum": [
            "subscribed",
            "unsubscribed",
            "confirmed",
            "pending"
          ]
        },
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
    "group": "reach"
  },
  {
    "name": "reach_createANewContactV1",
    "description": "Create a new contact in the email marketing system.\n\nThis endpoint allows you to create a new contact with basic information like name, email, and surname.\n\nIf double opt-in is enabled,\nthe contact will be created with a pending status and a confirmation email will be sent.",
    "method": "POST",
    "path": "/api/reach/v1/contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "email": {
          "type": "string",
          "description": "email parameter"
        },
        "name": {
          "type": "string",
          "description": "name parameter"
        },
        "surname": {
          "type": "string",
          "description": "surname parameter"
        },
        "phone": {
          "type": "string",
          "description": "Phone number in E.164 format (leading \"+\" then 7-15 digits)"
        },
        "note": {
          "type": "string",
          "description": "note parameter"
        }
      },
      "required": [
        "email"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_getContactDetailsV1",
    "description": "Get the full details of a single contact.\n\nAlongside the contact's own attributes this returns the tags assigned to it and the\nvalues it holds for the profile's custom contact fields.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/contacts/{contactUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "contactUuid": {
          "type": "string",
          "description": "Contact uuid parameter"
        }
      },
      "required": [
        "profileUuid",
        "contactUuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_deleteAProfileContactV1",
    "description": "Permanently delete a contact from a profile.\n\nThe contact is removed together with its custom field values and tag assignments.",
    "method": "DELETE",
    "path": "/api/reach/v1/profiles/{profileUuid}/contacts/{contactUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "contactUuid": {
          "type": "string",
          "description": "Contact uuid parameter"
        }
      },
      "required": [
        "profileUuid",
        "contactUuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_updateAContactV1",
    "description": "Update a contact's attributes and custom field values.\n\nOnly the properties present in the request body are changed, so a partial body is enough\nto change a single attribute. Sending a property as `null` clears it.\n\nThe response carries the contact's core attributes. Read back its tags, custom field\nvalues, source and note with `GET /api/reach/v1/profiles/{profileUuid}/contacts/{contactUuid}`.",
    "method": "PATCH",
    "path": "/api/reach/v1/profiles/{profileUuid}/contacts/{contactUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "contactUuid": {
          "type": "string",
          "description": "Contact uuid parameter"
        },
        "email": {
          "type": "string",
          "description": "email parameter"
        },
        "name": {
          "type": "string",
          "description": "name parameter"
        },
        "surname": {
          "type": "string",
          "description": "surname parameter"
        },
        "phone": {
          "type": "string",
          "description": "Phone number in E.164 format (leading \"+\" then 7-15 digits)"
        },
        "subscription_status": {
          "type": "string",
          "description": "subscription_status parameter",
          "enum": [
            "subscribed",
            "unsubscribed",
            "confirmed",
            "pending"
          ]
        },
        "note": {
          "type": "string",
          "description": "note parameter"
        },
        "fields": {
          "type": "array",
          "description": "Set custom field values. Omit to leave untouched, send an empty array to clear them all.",
          "items": {
            "type": "object",
            "description": "fields parameter",
            "properties": {
              "uuid": {
                "type": "string",
                "description": "uuid parameter"
              },
              "value": {
                "type": "string",
                "description": "For the scalar field types"
              },
              "selected_option_uuids": {
                "type": "array",
                "description": "For the choice field types",
                "items": {
                  "type": "string",
                  "description": "selected_option_uuids parameter"
                }
              }
            },
            "required": [
              "uuid"
            ]
          }
        }
      },
      "required": [
        "profileUuid",
        "contactUuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_createContactsInBulkV1",
    "description": "Create many contacts in a profile in a single call.\n\nThe contacts are imported in the background, so a success response means the import was\naccepted rather than finished. Contacts whose email already exists in the profile are\nleft as they are. If double opt-in is enabled, new contacts start off pending and are\nsent a confirmation email.",
    "method": "POST",
    "path": "/api/reach/v1/profiles/{profileUuid}/contacts/bulk",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "contacts": {
          "type": "array",
          "description": "contacts parameter",
          "items": {
            "type": "object",
            "description": "contacts parameter",
            "properties": {
              "email": {
                "type": "string",
                "description": "email parameter"
              },
              "name": {
                "type": "string",
                "description": "name parameter"
              },
              "surname": {
                "type": "string",
                "description": "surname parameter"
              },
              "phone": {
                "type": "string",
                "description": "Phone number in E.164 format (leading \"+\" then 7-15 digits)"
              }
            },
            "required": [
              "email"
            ]
          }
        },
        "tag_uuids": {
          "type": "array",
          "description": "Existing tags to attach to every created contact",
          "items": {
            "type": "string",
            "description": "tag_uuids parameter"
          }
        },
        "note": {
          "type": "string",
          "description": "Note applied to every created contact"
        }
      },
      "required": [
        "profileUuid",
        "contacts"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_listProfileContactsV1",
    "description": "Get a paginated list of contacts belonging to a profile.\n\nContacts can be filtered by subscription status, by tag, and by an email search term.\nThe `meta.total` field of the response is the number of contacts matching the filters,\nso calling this endpoint without filters gives the profile's total contact count.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "subscription_status": {
          "type": "string",
          "description": "Filter contacts by subscription status",
          "enum": [
            "subscribed",
            "unsubscribed",
            "confirmed",
            "pending"
          ]
        },
        "tag_uuid": {
          "type": "string",
          "description": "Filter contacts by tag UUID"
        },
        "search": {
          "type": "string",
          "description": "Search contacts by email"
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
        "profileUuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_createNewContactsV1",
    "description": "Create a new contact in the email marketing system.\n\nThis endpoint allows you to create a new contact with basic information like name, email, and surname.\n\nIf double opt-in is enabled, the contact will be created with a pending status\nand a confirmation email will be sent.",
    "method": "POST",
    "path": "/api/reach/v1/profiles/{profileUuid}/contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "email": {
          "type": "string",
          "description": "email parameter"
        },
        "name": {
          "type": "string",
          "description": "name parameter"
        },
        "surname": {
          "type": "string",
          "description": "surname parameter"
        },
        "phone": {
          "type": "string",
          "description": "Phone number in E.164 format (leading \"+\" then 7-15 digits)"
        },
        "note": {
          "type": "string",
          "description": "note parameter"
        }
      },
      "required": [
        "profileUuid",
        "email"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_listSegmentsV1",
    "description": "Get a list of all contact segments.\n\nThis endpoint returns a list of contact segments that can be used to organize contacts.",
    "method": "GET",
    "path": "/api/reach/v1/segmentation/segments",
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
    "group": "reach"
  },
  {
    "name": "reach_createANewContactSegmentV1",
    "description": "Create a new contact segment.\n\nThis endpoint allows creating a new contact segment that can be used to organize contacts.\nThe segment can be configured with specific criteria like email, name, subscription status, etc.",
    "method": "POST",
    "path": "/api/reach/v1/segmentation/segments",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "name parameter"
        },
        "conditions": {
          "type": "array",
          "description": "conditions parameter",
          "items": {
            "type": "object",
            "description": "conditions parameter",
            "properties": {
              "operator": {
                "type": "string",
                "description": "operator parameter",
                "enum": [
                  "equals",
                  "not_equals",
                  "contains",
                  "not_contains",
                  "gte",
                  "lte",
                  "exists",
                  "within_last_days",
                  "not_within_last_days",
                  "older_than_days",
                  "processed",
                  "not_processed",
                  "delivered",
                  "not_delivered",
                  "dropped",
                  "not_dropped",
                  "bounced",
                  "not_bounced",
                  "opened",
                  "not_opened",
                  "clicked",
                  "not_clicked",
                  "unsubscribed",
                  "not_unsubscribed"
                ]
              },
              "value": {
                "type": "string",
                "description": "value parameter"
              },
              "attribute": {
                "type": "string",
                "description": "attribute parameter",
                "enum": [
                  "note",
                  "comment",
                  "domain",
                  "integration",
                  "source",
                  "name",
                  "surname",
                  "email",
                  "subscribed_at",
                  "unsubscribed_at",
                  "subscription_status",
                  "processed",
                  "opened",
                  "clicked",
                  "delivered",
                  "bounced",
                  "unsubscribed",
                  "dropped",
                  "tag",
                  "campaigns"
                ]
              }
            }
          }
        },
        "logic": {
          "type": "string",
          "description": "logic parameter",
          "enum": [
            "AND",
            "OR"
          ]
        }
      },
      "required": [
        "name",
        "conditions",
        "logic"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_listProfileSegmentContactsV1",
    "description": "Retrieve contacts associated with a specific segment for a given profile.\n\nThis endpoint allows you to fetch and filter contacts that belong to a particular segment,\nidentified by its UUID, scoped to a specific profile.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}/contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "segmentUuid": {
          "type": "string",
          "description": "Segment uuid parameter"
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
        "profileUuid",
        "segmentUuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_listSegmentContactsV1",
    "description": "Retrieve contacts associated with a specific segment.\n\nThis endpoint allows you to fetch and filter contacts that belong to a particular segment,\nidentified by its UUID.",
    "method": "GET",
    "path": "/api/reach/v1/segmentation/segments/{segmentUuid}/contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "segmentUuid": {
          "type": "string",
          "description": "Segment uuid parameter"
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
        "segmentUuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_getSegmentDetailsV1",
    "description": "Get details of a specific segment.\n\nThis endpoint retrieves information about a single segment identified by UUID.\nSegments are used to organize and group contacts based on specific criteria.",
    "method": "GET",
    "path": "/api/reach/v1/segmentation/segments/{segmentUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "segmentUuid": {
          "type": "string",
          "description": "Segment uuid parameter"
        }
      },
      "required": [
        "segmentUuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_getProfileDomainDNSStatusV1",
    "description": "Retrieve the DNS configuration status for a profile's domain.\n\nThis endpoint reports the state of MX, SPF, DKIM and DMARC records, including the\nactual records found and the suggested records required for correct email delivery.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/domains/dns-status",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        }
      },
      "required": [
        "profileUuid"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  },
  {
    "name": "reach_listProfilesV1",
    "description": "This endpoint returns all profiles available to the client, including their basic information.",
    "method": "GET",
    "path": "/api/reach/v1/profiles",
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
    "group": "reach"
  }
];
export default tools;
