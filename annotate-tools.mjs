#!/usr/bin/env node
// Adds MCP tool annotations (title, readOnlyHint, destructiveHint, idempotentHint)
// to the generated tool lists in src/core/tools/*.{ts,js}. Idempotent: safe to
// re-run after regenerating tools from the OpenAPI spec.
import fs from "fs";
import path from "path";

const TOOLS_DIR = "src/core/tools";

const DESTRUCTIVE_RE =
  /^(delete|remove|uninstall|purge|reset|restore|recreate|revoke|terminate|destroy|deploy|import|overwrite|stop|flush)/i;
const READONLY_RE =
  /^(get|list|show|check|count|preview|suggest|validate|search)/i;

// Per-tool exceptions; win over the method/verb heuristics.
const OVERRIDES = {
  DNS_restoreDNSSnapshotV1: { destructiveHint: true },
  DNS_resetDNSRecordsV1: { destructiveHint: true },
};

const WORD_FIXES = [
  [/\bword ?press\b/gi, "WordPress"],
  [/\bwoo ?commerce\b/gi, "WooCommerce"],
  [/\blite ?speed\b/gi, "LiteSpeed"],
  [/\bphp my admin\b/gi, "phpMyAdmin"],
  [/\bnode ?js\b/gi, "Node.js"],
  [/\bjava ?script\b/gi, "JavaScript"],
  [/\birtp\b/gi, "IRTP"],
  [/\bptr\b/gi, "PTR"],
  [/\bjwt\b/gi, "JWT"],
  [/\bwhois\b/gi, "WHOIS"],
  [/\bdns\b/gi, "DNS"],
  [/\bvps\b/gi, "VPS"],
  [/\bphp\b/gi, "PHP"],
  [/ DIRECT$/g, ""],
];

function title(name) {
  let rest = (name.includes("_") ? name.slice(name.indexOf("_") + 1) : name)
    .replace(/V\d+$/, "")
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  let out = rest
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) => {
      if (/^[A-Z0-9]{2,}$/.test(w)) return w;
      const l = w.toLowerCase();
      return i === 0 ? l[0].toUpperCase() + l.slice(1) : l;
    })
    .join(" ");
  for (const [re, repl] of WORD_FIXES) out = out.replace(re, repl);
  return out.replace(/\s+/g, " ").trim();
}

function annotations(tool) {
  const method = (tool.method || "").toUpperCase();
  const rest = tool.name.slice(tool.name.indexOf("_") + 1);
  const verb = (rest.match(/^[a-z]+/) || [""])[0];
  const t = title(tool.name);
  let ann;
  if (method === "GET") ann = { title: t, readOnlyHint: true, destructiveHint: false };
  else if (["DELETE", "PUT", "PATCH"].includes(method))
    ann = { title: t, readOnlyHint: false, destructiveHint: true, idempotentHint: true };
  else if (READONLY_RE.test(verb)) ann = { title: t, readOnlyHint: true, destructiveHint: false };
  else ann = { title: t, readOnlyHint: false, destructiveHint: DESTRUCTIVE_RE.test(verb) };
  return { ...ann, ...OVERRIDES[tool.name] };
}

for (const file of fs.readdirSync(TOOLS_DIR).sort()) {
  const filePath = path.join(TOOLS_DIR, file);
  const src = fs.readFileSync(filePath, "utf8");
  const marker = file.endsWith(".ts") ? "const tools: OpenApiTool[] = " : "export default ";
  const start = src.indexOf(marker) + marker.length;
  const end = src.lastIndexOf("];") + 1;
  const tools = JSON.parse(src.slice(start, end)).map((tool) => {
    const ann = annotations(tool);
    const out = {};
    for (const [k, v] of Object.entries(tool)) {
      if (k === "title" || k === "annotations") continue;
      out[k] = v;
      if (k === "name") Object.assign(out, { title: ann.title, annotations: ann });
    }
    return out;
  });
  fs.writeFileSync(filePath, src.slice(0, start) + JSON.stringify(tools, null, 2) + src.slice(end));
  console.log(`${file}: ${tools.length} tools annotated`);
}
