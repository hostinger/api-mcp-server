// Auto-generated tool list for group: agent-readiness
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
    "name": "agent-readiness_checks_list",
    "title": "List checks",
    "annotations": {
      "title": "List checks",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "List every check an agent readiness scan runs, with its name, category and weight.\\n\nUse it to show the human-readable name of each `check_id` in a scan's results.",
    "method": "GET",
    "path": "/api/agent-readiness/v1/checks",
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
    "group": "agent-readiness"
  },
  {
    "name": "agent-readiness_scans_run-website",
    "title": "Run website scan",
    "annotations": {
      "title": "Run website scan",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Start a scan of how ready a public website is for AI agents to discover, read and act on.\\n\nScanning is asynchronous: this operation only starts the scan, and the returned scan is usually `pending`\nwith no results yet. To get the results, poll the `Get website scan` operation with the same domain every\nfew seconds until its status is `completed` or `failed`. The scan itself is limited to 60 seconds,\nplus any time it waits in the queue. A `failed` scan is not retried; run this operation again.\\n\nStarting a scan for a domain that already has a pending scan from the last 5 minutes\nreturns that scan instead of starting a new one.",
    "method": "POST",
    "path": "/api/agent-readiness/v1/scans",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name or full URL of the website to scan. Only the host is used."
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
    "group": "agent-readiness"
  },
  {
    "name": "agent-readiness_scans_website",
    "title": "Get website scan",
    "annotations": {
      "title": "Get website scan",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get the latest agent readiness scan of a website.\\n\nScans started with the `Run website scan` operation are asynchronous. While the status is `pending`,\nthe result fields are null; wait a few seconds and call this operation again until the status is\n`completed` or `failed`. A `failed` scan is not retried; run the scan again.\\n\nA completed scan has a 0-100 score, a letter grade, a score per category, and the result of every\ncheck with the evidence found and how to fix it. Check names are listed by the `List checks` operation.\\n\nReturns 404 when the domain has never been scanned; use the `Run website scan` operation first.",
    "method": "GET",
    "path": "/api/agent-readiness/v1/scans/{domain}",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Domain name the scan was run for"
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
    "group": "agent-readiness"
  }
];
export default tools;
