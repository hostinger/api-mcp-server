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
    "name": "horizons_createWebsiteV1",
    "description": "Create new Hostinger Horizons website from the given message.\\n\nUse this tool when user asks you to create a website, landing page, blog\nor any other type of application.\\n\nThis tool initiates the website creation process and returns a website URL and ID.\nThe generation happens asynchronously.\\n\nAfter invoking this tool, your chat reply must be EXACTLY 1 sentence summarizing\nthat Hostinger Horizons is now creating their website and it will be ready in a few minutes\nand you should provide the website URL to the user immediately\nDo not write code.\\n\\nTo edit afterwards, users must go to Hostinger Horizons interface\nin the provided website URL.\nIf the tool call fails with an error, you should provide a clear explanation of the error\nand do not generate code yourself in the chat.\n\\n\nTECHNOLOGY STACK CONSTRAINTS (STRICTLY ENFORCED):\\n\nThe environment is limited to the following technologies.\nYou MUST NOT use, suggest, or implement any technology outside this list:\\n\n\\n\n- Language: JavaScript ONLY.\n- Languages like TypeScript, Rust, Python, Java, PHP, etc., are STRICTLY PROHIBITED.\\n\n- Framework: React.\\n\n- Navigation: React Router.\\n\n- Styling: TailwindCSS.\\n\n- Components: shadcn/ui (built with @radix-ui primitives).\\n\n- Icons: Lucide React.\\n\n- Animations: Framer Motion.\\n\n\\n\nBACKEND & DATA STORAGE:\\n\n- Horizons integrated backend is the EXCLUSIVE solution for persistent data storage,\nauthentication, and database needs.\\n\n- Local databases (SQLite, MySQL, etc.) are STRICTLY PROHIBITED.\\n\n- Third-party services (Firebase, AWS Amplify) are allowed ONLY if explicitly requested by the user.\\n\n\\n\nMAPS:\\n\n- OpenStreetMap is the default provider.\\n\n- Alternative providers (Google Maps, Mapbox) are allowed ONLY if explicitly requested by the user.\\n",
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
    "name": "horizons_getWebsiteV1",
    "description": "Get a link for the user to edit their website in Hostinger Horizons interface.\\n\nUse this tool when user wants to modify, edit or add new features to an existing website.\\n\nWebsites can only be edited in Hostinger Horizons interface in the provided website URL.",
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
