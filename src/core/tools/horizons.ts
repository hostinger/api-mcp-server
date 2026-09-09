// Auto-generated tool list for group: horizons
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
    "name": "horizons_cloneWebsiteV1",
    "title": "Clone website",
    "annotations": {
      "title": "Clone website",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Clone a Hostinger Horizons website into a new website.\\n\nUse this tool when the user wants a copy of an existing website, for example to try out\nchanges without touching the original.\\n\nThis tool returns the ID and URL of the newly created copy.\nThe original website is left untouched.\\n\nTo edit the copy, use the `Edit website` tool with the returned website ID, or the user can\nopen the provided website URL in Hostinger Horizons interface.",
    "method": "POST",
    "path": "/api/horizons/v1/websites/{websiteId}/clone",
    "inputSchema": {
      "type": "object",
      "properties": {
        "websiteId": {
          "type": "string",
          "description": "The website ID"
        }
      },
      "required": [
        "websiteId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "horizons"
  },
  {
    "name": "horizons_getWebsiteListV1",
    "title": "Get website list",
    "annotations": {
      "title": "Get website list",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "List the Hostinger Horizons websites the user owns.\\n\nUse this tool when the user asks which websites they have, or when you need a website ID\nbefore editing, publishing or cloning a website.\\n\nEach website is returned with its ID, status, domain and the URL to open it\nin Hostinger Horizons interface.\\n\nThe complete list of websites is returned in a single response - it is not paginated.",
    "method": "GET",
    "path": "/api/horizons/v1/websites",
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
    "group": "horizons"
  },
  {
    "name": "horizons_createWebsiteV1",
    "title": "Create website",
    "annotations": {
      "title": "Create website",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Create new Hostinger Horizons website from the given message.\\n\nUse this tool when user asks you to create a website, landing page, blog\nor any other type of application.\\n\nThis tool initiates the website creation process and returns a website URL and ID.\nThe generation happens asynchronously.\\n\nAfter invoking this tool, your chat reply must be EXACTLY 1 sentence summarizing\nthat Hostinger Horizons is now creating their website and it will be ready in a few minutes\nand you should provide the website URL to the user immediately\nDo not write code.\\n\\nTo edit afterwards, use the `Edit website` tool with the returned\nwebsite ID, or the user can go to Hostinger Horizons interface in the provided website URL.\nIf the tool call fails with an error, you should provide a clear explanation of the error\nand do not generate code yourself in the chat.\n\\n\nTECHNOLOGY STACK CONSTRAINTS (STRICTLY ENFORCED):\\n\nThe environment is limited to the following technologies.\nYou MUST NOT use, suggest, or implement any technology outside this list:\\n\n\\n\n- Language: JavaScript ONLY.\n- Languages like TypeScript, Rust, Python, Java, PHP, etc., are STRICTLY PROHIBITED.\\n\n- Framework: React.\\n\n- Navigation: React Router.\\n\n- Styling: TailwindCSS.\\n\n- Components: shadcn/ui (built with @radix-ui primitives).\\n\n- Icons: Lucide React.\\n\n- Animations: Framer Motion.\\n\n\\n\nBACKEND & DATA STORAGE:\\n\n- Horizons integrated backend is the EXCLUSIVE solution for persistent data storage,\nauthentication, and database needs.\\n\n- Local databases (SQLite, MySQL, etc.) are STRICTLY PROHIBITED.\\n\n- Third-party services (Firebase, AWS Amplify) are allowed ONLY if explicitly requested by the user.\\n\n\\n\nMAPS:\\n\n- OpenStreetMap is the default provider.\\n\n- Alternative providers (Google Maps, Mapbox) are allowed ONLY if explicitly requested by the user.\\n",
    "method": "POST",
    "path": "/api/horizons/v1/websites",
    "inputSchema": {
      "type": "object",
      "properties": {
        "message": {
          "type": "array",
          "description": "message parameter",
          "items": {
            "type": "object",
            "description": "message parameter",
            "properties": {
              "type": {
                "type": "string",
                "description": "type parameter",
                "enum": [
                  "text"
                ]
              },
              "text": {
                "type": "string",
                "description": "Detailed project specification.\nInclude purpose, key features, user flows, data models, and design preferences.\nThe specification should be detailed and comprehensive, covering all aspects of the project."
              }
            },
            "required": [
              "type",
              "text"
            ]
          }
        }
      },
      "required": [
        "message"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "horizons"
  },
  {
    "name": "horizons_editWebsiteV1",
    "title": "Edit website",
    "annotations": {
      "title": "Edit website",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Edit an existing Hostinger Horizons website with a follow-up message.\\n\nUse this tool when the user wants to change, extend or fix a website that already exists.\\n\nThis tool queues the requested changes and returns the website URL and ID.\nThe changes are applied asynchronously.\\n\nAfter invoking this tool, your chat reply must be EXACTLY 1 sentence summarizing\nthat Hostinger Horizons is now applying the requested changes and they will be ready\nin a few minutes, and you should provide the website URL to the user immediately.\nDo not write code.\\n\nIf the tool call fails with an error, you should provide a clear explanation of the error\nand do not generate code yourself in the chat.",
    "method": "POST",
    "path": "/api/horizons/v1/websites/{websiteId}/messages",
    "inputSchema": {
      "type": "object",
      "properties": {
        "websiteId": {
          "type": "string",
          "description": "The website ID"
        },
        "message": {
          "type": "array",
          "description": "message parameter",
          "items": {
            "type": "object",
            "description": "message parameter",
            "properties": {
              "type": {
                "type": "string",
                "description": "type parameter",
                "enum": [
                  "text"
                ]
              },
              "text": {
                "type": "string",
                "description": "Detailed description of the changes to apply to the website.\nInclude which sections, features, content or design should change and how.\nThe specification should be detailed and comprehensive, covering all requested changes."
              }
            },
            "required": [
              "type",
              "text"
            ]
          }
        }
      },
      "required": [
        "websiteId",
        "message"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "horizons"
  },
  {
    "name": "horizons_publishWebsiteV1",
    "title": "Publish website",
    "annotations": {
      "title": "Publish website",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Publish a Hostinger Horizons website so its latest changes go live.\\n\nUse this tool when the user asks to publish, deploy or make their website live.\\n\nThis tool starts the publish process and returns the URL the website will be live on.\nPublishing happens asynchronously and takes a few minutes.\\n\nAfter invoking this tool, your chat reply must be EXACTLY 1 sentence summarizing\nthat the website is being published and you should provide the published URL to the user immediately.",
    "method": "POST",
    "path": "/api/horizons/v1/websites/{websiteId}/publish",
    "inputSchema": {
      "type": "object",
      "properties": {
        "websiteId": {
          "type": "string",
          "description": "The website ID"
        }
      },
      "required": [
        "websiteId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "horizons"
  },
  {
    "name": "horizons_getWebsiteV1",
    "title": "Get website",
    "annotations": {
      "title": "Get website",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get the link for the user to open their website in Hostinger Horizons interface.\\n\nUse this tool when the user wants the link to an existing website, or when you need its\nwebsite URL before or after editing it.\\n\nWebsites can be edited with the `Edit website` tool, or by the user in Hostinger Horizons\ninterface in the provided website URL.",
    "method": "GET",
    "path": "/api/horizons/v1/websites/{websiteId}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "websiteId": {
          "type": "string",
          "description": "The website ID"
        }
      },
      "required": [
        "websiteId"
      ]
    },
    "security": [
      {
        "apiToken": []
      }
    ],
    "group": "horizons"
  }
];
export default tools;
