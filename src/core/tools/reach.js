// Auto-generated tool list for group: reach
export default [
  {
    "name": "reach_getAutomationDetailsV1",
    "title": "Get automation details",
    "annotations": {
      "title": "Get automation details",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get a single automation with the counts of contacts that entered it, are moving through it,\nfinished it or failed on the way.\n\nThis describes the automation itself. To see the workflow it runs, use the steps endpoint.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/automations/{automationUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "automationUuid": {
          "type": "string",
          "description": "Automation uuid parameter"
        }
      },
      "required": [
        "profileUuid",
        "automationUuid"
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
    "name": "reach_listAutomationsV1",
    "title": "List automations",
    "annotations": {
      "title": "List automations",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get a paginated list of the automations in a profile.\n\nEvery automation comes with the counts of contacts that entered it, are moving through it,\nfinished it or failed on the way. Those counts describe the contact journey and are not\nemail engagement metrics - for opens, clicks and unsubscribes use the campaign statistics\nendpoint instead.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/automations",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "status": {
          "type": "string",
          "description": "Filter automations by status.\n\nThere is no `completed` status. An automation that has finished for every contact still\nreports `active`.",
          "enum": [
            "active",
            "paused",
            "draft"
          ]
        },
        "sort_direction": {
          "type": "string",
          "description": "Order automations by creation date. Newest first unless set to `asc`.",
          "enum": [
            "asc",
            "desc"
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
    "name": "reach_listAutomationStepsV1",
    "title": "List automation steps",
    "annotations": {
      "title": "List automation steps",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get the workflow of an automation as a flat list of steps.\n\nThe steps form a tree rather than a straight line: follow `parent_uuid` to reconstruct the\nbranches, and use `step_order` to order the steps that share a parent. An automation with no\nsteps yet returns an empty list.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/automations/{automationUuid}/steps",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "automationUuid": {
          "type": "string",
          "description": "Automation uuid parameter"
        }
      },
      "required": [
        "profileUuid",
        "automationUuid"
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
    "name": "reach_getCampaignDetailsV1",
    "title": "Get campaign details",
    "annotations": {
      "title": "Get campaign details",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get a single campaign with its sender, subject, template reference, targeting and delivery\nprogress.\n\nThis describes how the campaign was set up and how far it has got. For opens, clicks and\nunsubscribes use the campaign statistics endpoint.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/campaigns/{campaignUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "campaignUuid": {
          "type": "string",
          "description": "Campaign uuid parameter"
        }
      },
      "required": [
        "profileUuid",
        "campaignUuid"
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
    "name": "reach_listCampaignsV1",
    "title": "List campaigns",
    "annotations": {
      "title": "List campaigns",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get a paginated list of the campaigns in a profile.\n\nEach campaign carries its headline engagement rates. Filter by status to find drafts,\nscheduled, sending or sent campaigns, keeping in mind that a fully sent campaign has the\nstatus `publish`. By default only regular campaigns are returned - pass `type` to get the\nemails sent by automations or the double opt-in confirmations instead.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/campaigns",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "status": {
          "type": "string",
          "description": "Filter campaigns by status.\n\nA fully sent campaign has the status `publish`. There is no `sent` status, and campaigns can\nbe neither paused nor archived.",
          "enum": [
            "draft",
            "scheduled",
            "sending",
            "publish",
            "failed"
          ]
        },
        "type": {
          "type": "string",
          "description": "Filter campaigns by type.\n\nDefaults to `campaign`, which leaves out the emails sent by automations and the double\nopt-in confirmations.",
          "enum": [
            "campaign",
            "automation",
            "double_opt_in"
          ]
        },
        "sort_direction": {
          "type": "string",
          "description": "Order campaigns by creation date. Newest first unless set to `asc`.",
          "enum": [
            "asc",
            "desc"
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
    "name": "reach_createADraftCampaignV1",
    "title": "Create a draft campaign",
    "annotations": {
      "title": "Create a draft campaign",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Create a campaign in a profile.\n\nThe campaign is created as a draft, so nothing is sent and no contact is touched. It has no\naudience yet either - targeting and scheduling are not part of this request, the draft is\nfinished and sent from the Reach interface.",
    "method": "POST",
    "path": "/api/reach/v1/profiles/{profileUuid}/campaigns",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "sender_name": {
          "type": "string",
          "description": "From name shown to the recipients."
        },
        "sender_email": {
          "type": "string",
          "description": "From address of the campaign. Its domain has to be verified on the profile before\nthe campaign can be sent."
        },
        "title": {
          "type": "string",
          "description": "Name the campaign is listed under. Not shown to the recipients."
        },
        "subject": {
          "type": "string",
          "description": "Subject line of the email."
        },
        "template_uuid": {
          "type": "string",
          "description": "Template to send, as returned by the template endpoints. Can be left out and\nattached later, but the campaign cannot be sent without one."
        },
        "metadata": {
          "type": "object",
          "description": "Extra campaign fields. Any key outside the listed ones is rejected.",
          "properties": {
            "preheader": {
              "type": "string",
              "description": "Preview text shown after the subject line in the inbox."
            },
            "source": {
              "type": "string",
              "description": "Where the campaign was created from."
            }
          }
        }
      },
      "required": [
        "profileUuid",
        "sender_name",
        "sender_email"
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
    "name": "reach_getCampaignPerformanceV1",
    "title": "Get campaign performance",
    "annotations": {
      "title": "Get campaign performance",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get the performance of a campaign: delivery, opens, clicks and unsubscribes, with the\nmatching rates.\n\nEvery count is unique contacts rather than raw events, so a contact who opens the same email\nfive times is counted once.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/campaigns/{campaignUuid}/statistics",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "campaignUuid": {
          "type": "string",
          "description": "Campaign uuid parameter"
        }
      },
      "required": [
        "profileUuid",
        "campaignUuid"
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
    "name": "reach_deleteAContactV1",
    "title": "Delete a contact",
    "annotations": {
      "title": "Delete a contact",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
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
    "title": "Delete a contact field",
    "annotations": {
      "title": "Delete a contact field",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
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
    "title": "Update a contact field",
    "annotations": {
      "title": "Update a contact field",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
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
    "title": "List contact fields",
    "annotations": {
      "title": "List contact fields",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "title": "Create a contact field",
    "annotations": {
      "title": "Create a contact field",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "title": "List contact groups",
    "annotations": {
      "title": "List contact groups",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "title": "List contacts",
    "annotations": {
      "title": "List contacts",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "title": "Create a new contact",
    "annotations": {
      "title": "Create a new contact",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
        },
        "tag_uuids": {
          "type": "array",
          "description": "Existing tags to attach to the created contact",
          "items": {
            "type": "string",
            "description": "tag_uuids parameter"
          }
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
    "title": "Get contact details",
    "annotations": {
      "title": "Get contact details",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "title": "Delete a profile contact",
    "annotations": {
      "title": "Delete a profile contact",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
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
    "title": "Update a contact",
    "annotations": {
      "title": "Update a contact",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
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
    "title": "Create contacts in bulk",
    "annotations": {
      "title": "Create contacts in bulk",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
    "title": "List profile contacts",
    "annotations": {
      "title": "List profile contacts",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "title": "Create new contacts",
    "annotations": {
      "title": "Create new contacts",
      "readOnlyHint": false,
      "destructiveHint": false
    },
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
        },
        "tag_uuids": {
          "type": "array",
          "description": "Existing tags to attach to the created contact",
          "items": {
            "type": "string",
            "description": "tag_uuids parameter"
          }
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
    "title": "List segments",
    "annotations": {
      "title": "List segments",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get a list of all contact segments.\n\nThis endpoint returns a list of contact segments that can be used to organize contacts.\n\n**Deprecated.** This endpoint cannot target a profile, so it always falls back to\nthe client's default profile and cannot list the segments of any other profile. Use\n`GET /api/reach/v1/profiles/{profileUuid}/segmentation/segments` instead.",
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
    "title": "Create a new contact segment",
    "annotations": {
      "title": "Create a new contact segment",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Create a new contact segment.\n\nThis endpoint allows creating a new contact segment that can be used to organize contacts.\nThe segment can be configured with specific criteria like email, name, subscription status, etc.\n\n**Deprecated.** This endpoint cannot target a profile, so it always falls back to\nthe client's default profile and cannot create segments in any other profile. Use\n`POST /api/reach/v1/profiles/{profileUuid}/segmentation/segments` instead.",
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
                  "soft_bounced",
                  "not_soft_bounced",
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
    "name": "reach_countProfileSegmentContactsV1",
    "title": "Count profile segment contacts",
    "annotations": {
      "title": "Count profile segment contacts",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Count the contacts currently matching a segment without listing them.\n\nCheaper than paging through the segment contacts endpoint when only the size is needed.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}/count",
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
    "name": "reach_listProfileSegmentContactsV1",
    "title": "List profile segment contacts",
    "annotations": {
      "title": "List profile segment contacts",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "name": "reach_getProfileSegmentDetailsV1",
    "title": "Get profile segment details",
    "annotations": {
      "title": "Get profile segment details",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get a single segment of a profile, including the conditions that define it.\n\nTo retrieve the contacts currently matching those conditions, use the segment contacts\nendpoint instead.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}",
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
    "name": "reach_updateAProfileSegmentV1",
    "title": "Update a profile segment",
    "annotations": {
      "title": "Update a profile segment",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Rename a segment and/or replace the conditions that define it.\n\n`name` is always required. Omit `conditions` to rename without touching the conditions;\nsupply them and they replace the existing set entirely rather than being merged into it.\nContacts are never modified, but which of them match the segment can change immediately.",
    "method": "PUT",
    "path": "/api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}",
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
        "name": {
          "type": "string",
          "description": "name parameter"
        },
        "conditions": {
          "type": "array",
          "description": "Replaces the existing conditions entirely. Omit to keep the current ones.",
          "items": {
            "type": "object",
            "description": "conditions parameter",
            "properties": {
              "attribute": {
                "type": "string",
                "description": "A built-in contact attribute, or `cf:{fieldUuid}` to target a custom\ncontact field. Custom fields are addressed by field UUID; their slug\nis not accepted.\n\nBuilt-in attributes: `email`, `note`, `domain`, `source`,\n`opt_in_method`, `subscription_status`, `subscribed_at`,\n`unsubscribed_at`, `created_at`, `tag`, `campaigns`, `processed`,\n`opened`, `clicked`, `delivered`, `bounced`, `soft_bounced`,\n`dropped`.\n\nWhich operators are accepted depends on the attribute."
              },
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
                  "soft_bounced",
                  "not_soft_bounced",
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
                "description": "Always a string, including for numeric and date comparisons"
              }
            },
            "required": [
              "attribute",
              "operator",
              "value"
            ]
          }
        },
        "logic": {
          "type": "string",
          "description": "How to combine multiple conditions. Required when conditions are given.",
          "enum": [
            "AND",
            "OR"
          ]
        }
      },
      "required": [
        "profileUuid",
        "segmentUuid",
        "name"
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
    "name": "reach_deleteAProfileSegmentV1",
    "title": "Delete a profile segment",
    "annotations": {
      "title": "Delete a profile segment",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Delete a segment.\n\nOnly the segment definition is removed. The contacts that matched it are left untouched.",
    "method": "DELETE",
    "path": "/api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}",
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
    "name": "reach_listSegmentFilterAttributesV1",
    "title": "List segment filter attributes",
    "annotations": {
      "title": "List segment filter attributes",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "List every attribute a segment condition can filter on, with the operators each attribute\naccepts, the value format they expect and, where the value is constrained, the allowed\nvalues.\n\nThe list is profile specific: it includes the profile's custom contact fields, its tags and\nits 20 most recently published campaigns, so the valid attributes cannot be hardcoded. Read\nit before creating or updating a segment to discover the valid `attribute`, `operator` and\n`value` combinations.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/segmentation/filters/attributes",
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
    "name": "reach_previewContactsMatchingConditionsV1",
    "title": "Preview contacts matching conditions",
    "annotations": {
      "title": "Preview contacts matching conditions",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Preview the contacts matching a set of conditions without saving a segment.\n\nThe body is the same set of conditions accepted when creating or updating a segment, so this\nis how to check who a filter reaches, and how many, before persisting it. Nothing is stored\nand no contact is modified.\n\nCall the segment filter attributes endpoint first to discover the valid `attribute`,\n`operator` and `value` combinations.",
    "method": "POST",
    "path": "/api/reach/v1/profiles/{profileUuid}/segmentation/filters/contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "conditions": {
          "type": "array",
          "description": "Conditions a contact must satisfy to appear in the preview",
          "items": {
            "type": "object",
            "description": "conditions parameter",
            "properties": {
              "attribute": {
                "type": "string",
                "description": "A built-in contact attribute, or `cf:{fieldUuid}` to target a custom\ncontact field. Which operators are accepted depends on the attribute,\nso read the segment filter attributes endpoint for the authoritative\nlist."
              },
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
                  "soft_bounced",
                  "not_soft_bounced",
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
                "description": "Always a string, including for numeric and date comparisons"
              }
            },
            "required": [
              "attribute",
              "operator",
              "value"
            ]
          }
        },
        "logic": {
          "type": "string",
          "description": "How to combine multiple conditions",
          "enum": [
            "AND",
            "OR"
          ]
        },
        "page": {
          "type": "integer",
          "description": "Page number"
        },
        "per_page": {
          "type": "integer",
          "description": "Number of items per page"
        },
        "search": {
          "type": "string",
          "description": "Narrow the preview to contacts whose email matches"
        },
        "sort_by": {
          "type": "string",
          "description": "sort_by parameter",
          "enum": [
            "email",
            "name",
            "surname",
            "phone",
            "subscription_status"
          ]
        },
        "sort_direction": {
          "type": "string",
          "description": "sort_direction parameter",
          "enum": [
            "asc",
            "desc"
          ]
        }
      },
      "required": [
        "profileUuid",
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
    "name": "reach_listProfileSegmentsV1",
    "title": "List profile segments",
    "annotations": {
      "title": "List profile segments",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get a paginated list of the segments defined in a profile.\n\nEach entry carries the number of contacts currently matching it, which is recalculated on\nread rather than stored. Use `count_type` to count either every matching contact or only\nthe subscribed ones.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/segmentation/segments",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "count_type": {
          "type": "string",
          "description": "Which matching contacts to count for each segment",
          "enum": [
            "all",
            "subscribed"
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
    "name": "reach_createAProfileSegmentV1",
    "title": "Create a profile segment",
    "annotations": {
      "title": "Create a profile segment",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Create a segment in a profile.\n\nA segment is a saved set of conditions rather than a fixed list, so its membership changes\nas contacts change. Creating one does not modify any contact.",
    "method": "POST",
    "path": "/api/reach/v1/profiles/{profileUuid}/segmentation/segments",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "name": {
          "type": "string",
          "description": "name parameter"
        },
        "conditions": {
          "type": "array",
          "description": "Conditions a contact must satisfy to fall into the segment",
          "items": {
            "type": "object",
            "description": "conditions parameter",
            "properties": {
              "attribute": {
                "type": "string",
                "description": "A built-in contact attribute, or `cf:{fieldUuid}` to target a custom\ncontact field. Custom fields are addressed by field UUID; their slug\nis not accepted.\n\nBuilt-in attributes: `email`, `note`, `domain`, `source`,\n`opt_in_method`, `subscription_status`, `subscribed_at`,\n`unsubscribed_at`, `created_at`, `tag`, `campaigns`, `processed`,\n`opened`, `clicked`, `delivered`, `bounced`, `soft_bounced`,\n`dropped`.\n\nWhich operators are accepted depends on the attribute."
              },
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
                  "soft_bounced",
                  "not_soft_bounced",
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
                "description": "Always a string, including for numeric and date comparisons"
              }
            },
            "required": [
              "attribute",
              "operator",
              "value"
            ]
          }
        },
        "logic": {
          "type": "string",
          "description": "How to combine multiple conditions",
          "enum": [
            "AND",
            "OR"
          ]
        }
      },
      "required": [
        "profileUuid",
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
    "name": "reach_listSegmentContactsV1",
    "title": "List segment contacts",
    "annotations": {
      "title": "List segment contacts",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Retrieve contacts associated with a specific segment.\n\nThis endpoint allows you to fetch and filter contacts that belong to a particular segment,\nidentified by its UUID.\n\n**Deprecated.** This endpoint cannot target a profile, so it always falls back to\nthe client's default profile and cannot read segments of any other profile. Use\n`GET /api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}/contacts` instead.",
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
    "title": "Get segment details",
    "annotations": {
      "title": "Get segment details",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get details of a specific segment.\n\nThis endpoint retrieves information about a single segment identified by UUID.\nSegments are used to organize and group contacts based on specific criteria.\n\n**Deprecated.** This endpoint cannot target a profile, so it always falls back to\nthe client's default profile and cannot read segments of any other profile. Use\n`GET /api/reach/v1/profiles/{profileUuid}/segmentation/segments/{segmentUuid}` instead.",
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
    "name": "reach_assignAContactToATagV1",
    "title": "Assign a contact to a tag",
    "annotations": {
      "title": "Assign a contact to a tag",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Assign a tag to a single contact.\n\nUnlike the bulk endpoint this is applied immediately rather than queued. Assigning a tag\nthe contact already carries succeeds without duplicating it.",
    "method": "POST",
    "path": "/api/reach/v1/profiles/{profileUuid}/tags/{tagUuid}/contacts/{contactUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "tagUuid": {
          "type": "string",
          "description": "Tag uuid parameter"
        },
        "contactUuid": {
          "type": "string",
          "description": "Contact uuid parameter"
        }
      },
      "required": [
        "profileUuid",
        "tagUuid",
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
    "name": "reach_removeAContactFromATagV1",
    "title": "Remove a contact from a tag",
    "annotations": {
      "title": "Remove a contact from a tag",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Remove a tag from a single contact.\n\nUnlike the bulk endpoint this is applied immediately rather than queued. Neither the tag\nnor the contact is deleted.",
    "method": "DELETE",
    "path": "/api/reach/v1/profiles/{profileUuid}/tags/{tagUuid}/contacts/{contactUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "tagUuid": {
          "type": "string",
          "description": "Tag uuid parameter"
        },
        "contactUuid": {
          "type": "string",
          "description": "Contact uuid parameter"
        }
      },
      "required": [
        "profileUuid",
        "tagUuid",
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
    "name": "reach_assignContactsToATagV1",
    "title": "Assign contacts to a tag",
    "annotations": {
      "title": "Assign contacts to a tag",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Assign a tag to many contacts at once.\n\nPass `contact_uuids` to target specific contacts, or `all_contacts` to target every contact\nin the profile. The work is queued, so a success response means it was accepted rather than\nfinished. Contacts that already carry the tag are left alone.",
    "method": "POST",
    "path": "/api/reach/v1/profiles/{profileUuid}/tags/{tagUuid}/contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "tagUuid": {
          "type": "string",
          "description": "Tag uuid parameter"
        },
        "contact_uuids": {
          "type": "array",
          "description": "Contacts to apply the change to. Required unless all_contacts is true.",
          "items": {
            "type": "string",
            "description": "contact_uuids parameter"
          }
        },
        "all_contacts": {
          "type": "boolean",
          "description": "Apply to every contact in the profile"
        }
      },
      "required": [
        "profileUuid",
        "tagUuid"
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
    "name": "reach_removeContactsFromATagV1",
    "title": "Remove contacts from a tag",
    "annotations": {
      "title": "Remove contacts from a tag",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Remove a tag from many contacts at once.\n\nPass `contact_uuids` to target specific contacts, or `all_contacts` to target every contact\nin the profile. The work is queued, so a success response means it was accepted rather than\nfinished. The tag itself and the contacts are not deleted.",
    "method": "DELETE",
    "path": "/api/reach/v1/profiles/{profileUuid}/tags/{tagUuid}/contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "tagUuid": {
          "type": "string",
          "description": "Tag uuid parameter"
        }
      },
      "required": [
        "profileUuid",
        "tagUuid"
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
    "name": "reach_deleteATagV1",
    "title": "Delete a tag",
    "annotations": {
      "title": "Delete a tag",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Delete a tag and remove it from every contact carrying it.\n\nThe contacts themselves are not deleted. This is idempotent: deleting a tag that does not\nexist in the profile still succeeds.",
    "method": "DELETE",
    "path": "/api/reach/v1/profiles/{profileUuid}/tags/{tagUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "tagUuid": {
          "type": "string",
          "description": "Tag uuid parameter"
        }
      },
      "required": [
        "profileUuid",
        "tagUuid"
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
    "name": "reach_renameATagV1",
    "title": "Rename a tag",
    "annotations": {
      "title": "Rename a tag",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Rename a tag.\n\nThe contacts assigned to the tag are unaffected. Names are unique within a profile, so\nrenaming a tag to a name that is already taken is rejected.",
    "method": "PATCH",
    "path": "/api/reach/v1/profiles/{profileUuid}/tags/{tagUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "tagUuid": {
          "type": "string",
          "description": "Tag uuid parameter"
        },
        "value": {
          "type": "string",
          "description": "New tag name"
        }
      },
      "required": [
        "profileUuid",
        "tagUuid",
        "value"
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
    "name": "reach_listProfileTagsV1",
    "title": "List profile tags",
    "annotations": {
      "title": "List profile tags",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get all tags defined in a profile.\n\nTags are the way contacts are grouped in Reach, and can be used to filter the contact\nlist or to build segments.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/tags",
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
    "name": "reach_createOrFindTagsV1",
    "title": "Create or find tags",
    "annotations": {
      "title": "Create or find tags",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Create tags in a profile.\n\nNames that already exist in the profile are not duplicated: the existing tag is returned\ninstead, so the call is safe to repeat. Every tag in the request is returned, whether it\nwas created now or already existed.",
    "method": "POST",
    "path": "/api/reach/v1/profiles/{profileUuid}/tags",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "names": {
          "type": "array",
          "description": "names parameter",
          "items": {
            "type": "string",
            "description": "names parameter"
          }
        }
      },
      "required": [
        "profileUuid",
        "names"
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
    "name": "reach_getFormDetailsV1",
    "title": "Get form details",
    "annotations": {
      "title": "Get form details",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get a single form with the URL of its hosted template and the tags it applies to the contacts\nit captures.\n\nThere is no ready-made embed snippet in the response - either serve the template HTML yourself\nor build your own embed around the form uuid.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/forms/{formUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "formUuid": {
          "type": "string",
          "description": "Form uuid parameter"
        }
      },
      "required": [
        "profileUuid",
        "formUuid"
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
    "name": "reach_deleteFormV1",
    "title": "Delete form",
    "annotations": {
      "title": "Delete form",
      "readOnlyHint": false,
      "destructiveHint": true,
      "idempotentHint": true
    },
    "description": "Permanently delete a form together with its template.\n\nA form that has already captured submissions cannot be deleted, so that the contacts it collected\nare never silently discarded - pause the form instead to stop it collecting new ones. Views alone\ndo not block deletion.",
    "method": "DELETE",
    "path": "/api/reach/v1/profiles/{profileUuid}/forms/{formUuid}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "formUuid": {
          "type": "string",
          "description": "Form uuid parameter"
        }
      },
      "required": [
        "profileUuid",
        "formUuid"
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
    "name": "reach_listFormsV1",
    "title": "List forms",
    "annotations": {
      "title": "List forms",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get a paginated list of the signup forms in a profile.\n\nEach form carries a reference to the template that renders it. Get the form details for a\ndirectly usable template URL and for the tags the form puts on the contacts it captures.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/forms",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
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
    "name": "reach_getProfileDomainDNSStatusV1",
    "title": "Get profile domain DNS status",
    "annotations": {
      "title": "Get profile domain DNS status",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
    "name": "reach_getConnectedSendingDomainV1",
    "title": "Get connected sending domain",
    "annotations": {
      "title": "Get connected sending domain",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get the sending domain connected to the profile, its verification status and any suspended\nsender addresses.\n\nCampaigns only go out once a domain is connected and active, so this is the cheapest way to\ncheck that precondition before building one. A profile with no domain connected returns the\nsame shape with every field set to `null`. For the individual MX, SPF, DKIM and DMARC records\nbehind the status, use the DNS status endpoint.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/domains",
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
    "name": "reach_listPlanFeatureAccessV1",
    "title": "List plan feature access",
    "annotations": {
      "title": "List plan feature access",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "List which plan features the profile can use.\n\nThis is the feature lock matrix, not a usage quota. `available` means the feature can be\nused right now and `locked` means it is not part of the base plan, so an upgrade is needed.\nFor remaining emails, recipients and AI credits use the limits endpoint instead.\n\nWorth checking before building something that cannot be activated afterwards, such as an\nautomation on a plan without automation activation.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/features",
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
    "name": "reach_getRemainingPlanLimitsV1",
    "title": "Get remaining plan limits",
    "annotations": {
      "title": "Get remaining plan limits",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get how much of the plan is left for the current period.\n\nTwo things to keep in mind before you build alerting on this. The period is a calendar month\nrather than a billing anniversary, so the counters reset on the 1st no matter when the\nsubscription started. And usage is tracked per order, so every profile on the same order shares\none pool and reports the same numbers here. Only the current period is available, past usage is\nnot kept.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/limits",
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
    "title": "List Profiles",
    "annotations": {
      "title": "List Profiles",
      "readOnlyHint": true,
      "destructiveHint": false
    },
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
  },
  {
    "name": "reach_listEmailTemplatesV1",
    "title": "List email templates",
    "annotations": {
      "title": "List email templates",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get a list of the email templates in a profile, most recently updated first.\n\nTemplates are the reusable email bodies a campaign is built from. The list is not paginated\nand only the metadata is returned - the template content itself is not exposed. Use the\n`uuid` of a template as the `template_uuid` when creating a campaign.",
    "method": "GET",
    "path": "/api/reach/v1/profiles/{profileUuid}/templates",
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
    "name": "reach_createAnEmailTemplateV1",
    "title": "Create an email template",
    "annotations": {
      "title": "Create an email template",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Create an email template in a profile.\n\nThe template holds the HTML body a campaign reuses, so it can be created before any\ncampaign exists. Only the template metadata comes back - keep the returned `uuid` to\nreference it as the `template_uuid` of a campaign.",
    "method": "POST",
    "path": "/api/reach/v1/profiles/{profileUuid}/templates",
    "inputSchema": {
      "type": "object",
      "properties": {
        "profileUuid": {
          "type": "string",
          "description": "Profile uuid parameter"
        },
        "template_content": {
          "type": "string",
          "description": "The email body as HTML. It is sanitised before it is stored, so the saved template\ncan differ from what was sent - inline any styles the email clients need and keep\nthe markup self-contained."
        },
        "title": {
          "type": "string",
          "description": "Name the template is listed under. Not shown to the recipients."
        }
      },
      "required": [
        "profileUuid",
        "template_content"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "reach"
  }
];
