import { execFileSync } from "node:child_process"
import { homedir } from "node:os"
import path from "node:path"
import { baseUrlFrom, listCollections, readCredentials, readJson, request, superuserToken } from "./pb-lib.mjs"

const REALTIME_PROBE_SECONDS = "8"
const PAGE_TIMEOUT_MS = 15000

const [credsPath, schemaPath] = process.argv.slice(2)
if (!credsPath) {
  console.error("Usage: node pb-verify.mjs <credentials.json> [schema.json]")
  process.exit(1)
}

const creds = readCredentials(credsPath)
const schema = schemaPath ? readJson(schemaPath) : { collections: [] }
const base = baseUrlFrom(creds)
let failures = 0
let warnings = 0

const pass = (message) => console.log(`PASS  ${message}`)
const warn = (message) => {
  warnings++
  console.log(`WARN  ${message}`)
}
const bad = (message) => {
  failures++
  console.log(`FAIL  ${message}`)
}

const health = await request(base, "/api/health", { retries: 5 })
if (health.status !== 200) {
  bad(`/api/health returned ${health.status}; the backend is missing or still waking up. Retry in 10 s, then check hosting_pocketbase_backend.`)
  finish()
}
pass("API is healthy")

const token = await superuserToken(base, creds)
pass("superuser sign-in works")

const byName = await listCollections(base, token)

for (const collection of schema.collections ?? []) {
  const live = byName.get(collection.name)
  if (!live) {
    bad(`collection ${collection.name} is missing; run pb-apply-schema.mjs`)
    continue
  }
  const missing = (collection.fields ?? []).filter((field) => !live.fields.some((f) => f.name === field.name)).map((f) => f.name)
  if (missing.length) bad(`${collection.name} is missing fields: ${missing.join(", ")}`)
  else if (live.type !== "view") pass(`${collection.name} has all ${collection.fields?.length ?? 0} declared fields`)

  const timestampsWanted = collection.timestamps !== false && live.type !== "view"
  if (timestampsWanted && !live.fields.some((field) => field.name === "created")) {
    warn(`${collection.name} has no "created" field, so sort: "-created" fails; re-run pb-apply-schema.mjs`)
  }

  const recordsPath = `/api/collections/${collection.name}/records`
  const anonList = await request(base, `${recordsPath}?perPage=1`)
  if (live.listRule === null) {
    anonList.status === 403
      ? pass(`${collection.name}: visitors cannot list (superusers only)`)
      : bad(`${collection.name}: listRule is null but an anonymous list returned ${anonList.status}`)
  } else if (anonList.status === 200) {
    const scope = live.listRule === "" ? "everyone" : `rule "${live.listRule}"`
    pass(`${collection.name}: listing works, filtered by ${scope}`)
  } else {
    bad(`${collection.name}: anonymous list returned ${anonList.status} ${anonList.data?.message ?? ""}`)
  }

  if (live.type !== "view" && live.createRule === null) {
    const anonCreate = await request(base, recordsPath, { method: "POST", body: {} })
    anonCreate.status === 403
      ? pass(`${collection.name}: visitors cannot create`)
      : bad(`${collection.name}: createRule is null but an anonymous create returned ${anonCreate.status}`)
  }
  if (live.createRule === "" && live.type === "base") warn(`${collection.name}: anyone can create records; fine for a public form, otherwise tighten it`)
  if (live.updateRule === "" || live.deleteRule === "") warn(`${collection.name}: anyone can update or delete any record; this is almost never intended`)
}

const settings = await request(base, "/api/settings", { token })
const limits = settings.data?.rateLimits
if (limits?.enabled) {
  const summary = (limits.rules ?? []).map((rule) => `${rule.label}${rule.audience ? ` ${rule.audience}` : ""} ${rule.maxRequests}/${rule.duration}s`).join(", ")
  pass(`rate limits per IP: ${summary}`)
}
if (settings.data?.smtp && !settings.data.smtp.enabled) {
  console.log("INFO  outgoing mail (SMTP) is off: verification and password-reset emails are not sent")
}

// curl is found by name, and Windows looks in the working directory (the user's project, maybe a
// cloned repository) before PATH, as does a relative PATH entry elsewhere: run it from the home folder
// with only absolute PATH entries, as connect/launch.mjs does for npx.
const curlEnv = { ...process.env }
for (const key of Object.keys(curlEnv).filter((k) => k.toUpperCase() === "PATH")) {
  curlEnv[key] = curlEnv[key].split(path.delimiter).filter((p) => path.isAbsolute(p)).join(path.delimiter)
}

function probeRealtime(protocol) {
  try {
    const out = execFileSync("curl", ["-sS", "-N", protocol, "--max-time", REALTIME_PROBE_SECONDS, "-H", "Accept: text/event-stream", `${base}/api/realtime`], {
      cwd: homedir(),
      env: curlEnv,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
    return out.includes("PB_CONNECT") ? "ok" : "no-event"
  } catch (error) {
    if (error.code === "ENOENT") return "no-curl"
    return String(error.stdout ?? "").includes("PB_CONNECT") ? "ok" : "no-event"
  }
}

const http2 = probeRealtime("--http2")
if (http2 === "no-curl") {
  warn("curl is not installed, so realtime was not checked; open the site in two tabs and check a change appears in both")
} else {
  http2 === "ok" ? pass("realtime connects over HTTP/2 (browsers)") : bad("realtime does not connect over HTTP/2; see troubleshooting.md")
  probeRealtime("--http1.1") === "ok"
    ? pass("realtime connects over HTTP/1.1 (Node.js clients, dev proxies)")
    : warn("realtime does not connect over HTTP/1.1: browsers are fine, Node.js subscribers need the workaround in troubleshooting.md")
}

const dashboard = await fetch(`${base}/_/`, { signal: AbortSignal.timeout(PAGE_TIMEOUT_MS) }).catch(() => null)
dashboard?.status === 200 ? pass(`dashboard is at ${base}/_/`) : bad(`dashboard returned ${dashboard?.status ?? "no response"}`)

const home = await fetch(`${base}/`, { signal: AbortSignal.timeout(PAGE_TIMEOUT_MS) }).catch(() => null)
const homeText = home ? await home.text() : ""
if (!home || home.status >= 400) bad(`the website itself returned ${home?.status ?? "no response"}; deploy the frontend`)
else if (/<title>\s*Coming soon\s*<\/title>/i.test(homeText)) {
  warn("the website still shows Hostinger's placeholder page; deploy the frontend")
} else pass("the website is serving the app")

finish()

function finish() {
  console.log(`\n${failures ? "NOT READY" : "READY"}: ${failures} failed, ${warnings} warnings`)
  process.exit(failures ? 1 : 0)
}
