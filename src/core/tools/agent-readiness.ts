// Auto-generated tool list for group: agent-readiness
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
    "name": "agent-readiness_scans_run",
    "title": "Run agent readiness scan",
    "annotations": {
      "title": "Run agent readiness scan",
      "readOnlyHint": false,
      "destructiveHint": false
    },
    "description": "Start a scan of how ready a public website is for AI agents to discover, read and act on.\\n\nScanning is asynchronous: this operation only starts the scan, and the returned scan is usually `pending`\nwith no results yet. To get the results, poll the `Get agent readiness scan` operation with the same\ndomain every few seconds until its status is `completed` or `failed`. The scan itself is limited to 60 seconds,\nplus any time it waits in the queue. A `failed` scan is not retried; run this operation again.\\n\nStarting a scan for a domain that already has a pending scan from the last 5 minutes\nreturns that scan instead of starting a new one.",
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
    "name": "agent-readiness_scans_get",
    "title": "Get agent readiness scan",
    "annotations": {
      "title": "Get agent readiness scan",
      "readOnlyHint": true,
      "destructiveHint": false
    },
    "description": "Get the latest agent readiness scan of a website.\\n\nScans started with the `Run agent readiness scan` operation are asynchronous. While the status is\n`pending`, the result fields are null; wait a few seconds and call this operation again until the status is\n`completed` or `failed`. A `failed` scan is not retried; run the scan again.\\n\nA completed scan has a 0-100 score, a letter grade, a score per category, and the result of every\ncheck with the evidence found and how to fix it. Check names are listed by the `List checks` operation.\\n\nReturns 404 when the domain has never been scanned; use the `Run agent readiness scan` operation first.",
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
