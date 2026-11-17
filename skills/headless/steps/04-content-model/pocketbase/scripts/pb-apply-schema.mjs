import {
  baseUrlFrom,
  describeError,
  fail,
  listCollections,
  mergeRateLimitRules,
  readCredentials,
  readJson,
  request,
  superuserToken,
  wakeUp,
} from "./pb-lib.mjs"

const args = process.argv.slice(2)
const checkOnly = args.includes("--check")
const [schemaPath, credsPath] = args.filter((arg) => arg !== "--check")
if (!schemaPath || (!credsPath && !checkOnly)) {
  fail("Usage: node pb-apply-schema.mjs <schema.json> <credentials.json>   or   node pb-apply-schema.mjs --check <schema.json>")
}

const RULE_KEYS = {
  list: "listRule",
  view: "viewRule",
  create: "createRule",
  update: "updateRule",
  delete: "deleteRule",
  auth: "authRule",
  manage: "manageRule",
}
const AUTH_ONLY_RULE_KEYS = new Set(["auth", "manage"])
const COLLECTION_KEYS = new Set(["name", "type", "rules", "fields", "indexes", "authOptions", "timestamps", "viewQuery", "seed"])
const COLLECTION_TYPES = new Set(["base", "auth", "view"])
const FIELD_TYPES = new Set(["text", "editor", "number", "bool", "email", "url", "date", "autodate", "select", "file", "relation", "json", "geoPoint"])
const INDEX_NAME = /INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?/i
const TIMESTAMPS = [
  { name: "created", type: "autodate", onCreate: true, onUpdate: false },
  { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
]

const schema = readJson(schemaPath)
const wanted = Array.isArray(schema.collections) ? schema.collections : fail('schema.json needs a top-level "collections" array')
validateSchema()
if (checkOnly) {
  console.log(`OK    ${schemaPath} is valid (${wanted.length} collections). Relation targets outside the file are checked when applied.`)
  process.exit(0)
}

const creds = readCredentials(credsPath)
const base = baseUrlFrom(creds)
await wakeUp(base)
const token = await superuserToken(base, creds)

const isView = (collection) => (collection.type ?? "base") === "view"
let collections = await listCollections(base, token)
await createMissingCollections(wanted.filter((collection) => !isView(collection)))
collections = await listCollections(base, token)
await updateFieldsAndIndexes(wanted.filter((collection) => !isView(collection)))
await createMissingCollections(wanted.filter(isView))
collections = await listCollections(base, token)
await updateFieldsAndIndexes(wanted.filter(isView))
await applyRules()
await applyRateLimits()
await seedEmptyCollections()
console.log(`DONE  schema applied to ${base}`)

function validateSchema() {
  const problems = []
  const names = new Set()
  for (const collection of wanted) {
    const label = collection.name ?? "(unnamed)"
    if (!collection.name || !/^[a-z_][a-z0-9_]*$/i.test(collection.name)) problems.push(`invalid collection name "${collection.name}"`)
    if (names.has(collection.name)) problems.push(`${label}: listed twice`)
    names.add(collection.name)
    for (const key of Object.keys(collection)) {
      if (!COLLECTION_KEYS.has(key)) problems.push(`${label}: unknown key "${key}" (allowed: ${[...COLLECTION_KEYS].join(", ")})`)
    }
    const type = collection.type ?? "base"
    if (!COLLECTION_TYPES.has(type)) problems.push(`${label}: type must be base, auth or view`)
    if (type === "view" && !collection.viewQuery) problems.push(`${label}: view collections need "viewQuery"`)
    if (type !== "view" && collection.viewQuery) problems.push(`${label}: "viewQuery" only applies to type "view"`)
    for (const key of Object.keys(collection.rules ?? {})) {
      if (!(key in RULE_KEYS)) problems.push(`${label}: unknown rule "${key}" (allowed: ${Object.keys(RULE_KEYS).join(", ")})`)
      if (AUTH_ONLY_RULE_KEYS.has(key) && type !== "auth") problems.push(`${label}: rule "${key}" only applies to auth collections`)
      const value = collection.rules[key]
      if (value !== null && typeof value !== "string") problems.push(`${label}: rule "${key}" must be a string or null`)
    }
    if (type === "view" && collection.rules) {
      for (const key of ["create", "update", "delete"]) {
        if (key in collection.rules) problems.push(`${label}: view collections are read-only; remove the "${key}" rule`)
      }
    }
    for (const field of collection.fields ?? []) {
      if (!field.name) problems.push(`${label}: a field has no name`)
      if (!FIELD_TYPES.has(field.type)) problems.push(`${label}.${field.name}: unknown field type "${field.type}"`)
      if (field.type === "relation" && !field.collection) problems.push(`${label}.${field.name}: relation fields need "collection" (the target collection name)`)
      if (field.type === "select" && !(Array.isArray(field.values) && field.values.length)) problems.push(`${label}.${field.name}: select fields need a "values" array`)
    }
    if (type === "view" && collection.fields?.length) problems.push(`${label}: view collections take their fields from viewQuery; remove "fields"`)
    if (collection.seed !== undefined && !Array.isArray(collection.seed)) problems.push(`${label}: "seed" must be an array of records`)
  }
  if (schema.rateLimits !== undefined && !Array.isArray(schema.rateLimits)) problems.push('"rateLimits" must be an array')
  for (const rule of Array.isArray(schema.rateLimits) ? schema.rateLimits : []) {
    if (!rule?.label || !(rule.maxRequests > 0) || !(rule.duration > 0)) {
      problems.push(`each rateLimits entry needs "label", "maxRequests" and "duration" (seconds): ${JSON.stringify(rule)}`)
    }
  }
  if (problems.length) fail(`schema.json has ${problems.length} problem(s):\n  - ${problems.join("\n  - ")}`)
}

function toApiField(field) {
  const { collection, ...rest } = field
  if (field.type !== "relation") return rest
  const collectionId = collections.get(collection)?.id
  if (!collectionId) fail(`Relation target "${collection}" does not exist. Add it to schema.json or fix the name.`)
  return { maxSelect: 1, cascadeDelete: false, ...rest, collectionId }
}

function mergeFields(existing, desired) {
  const byName = new Map((existing?.fields ?? []).map((field) => [field.name, field]))
  const merged = desired.map((field) => {
    const current = byName.get(field.name)
    if (current && current.type !== field.type) {
      fail(`Field "${field.name}" exists with type ${current.type}; changing it to ${field.type} would drop data. Use a new field name instead.`)
    }
    return current ? { ...current, ...field, id: current.id } : field
  })
  const desiredNames = new Set(desired.map((field) => field.name))
  const kept = (existing?.fields ?? []).filter((field) => !desiredNames.has(field.name))
  return [...kept.filter((field) => field.system), ...merged, ...kept.filter((field) => !field.system)]
}

function indexName(sql) {
  return INDEX_NAME.exec(sql)?.[1]
}

function indexDefinition(sql) {
  return sql.replace(INDEX_NAME, "INDEX").replace(/[`"]/g, "").replace(/\s+/g, " ").trim().toLowerCase()
}

function mergeIndexes(existing, desired) {
  if (!desired) return existing ?? []
  const names = new Set(desired.map(indexName))
  const definitions = new Set(desired.map(indexDefinition))
  const kept = (existing ?? []).filter((sql) => !names.has(indexName(sql)) && !definitions.has(indexDefinition(sql)))
  return [...kept, ...desired]
}

function withTimestamps(collection, fields, existingFields = []) {
  if (collection.timestamps === false) return fields
  const present = (name) => fields.some((field) => field.name === name) || existingFields.some((field) => field.name === name)
  return [...fields, ...TIMESTAMPS.filter((timestamp) => !present(timestamp.name))]
}

async function createMissingCollections(group) {
  for (const collection of group) {
    if (collections.has(collection.name)) continue
    const type = collection.type ?? "base"
    const body = { name: collection.name, type }
    if (type === "view") {
      body.viewQuery = collection.viewQuery
    } else {
      const plainFields = (collection.fields ?? []).filter((field) => field.type !== "relation")
      body.fields = withTimestamps(collection, plainFields)
    }
    const res = await request(base, "/api/collections", { method: "POST", token, body })
    if (res.status !== 200) fail(`Cannot create ${collection.name}: ${describeError(res)}`)
    console.log(`NEW   ${collection.name}`)
  }
}

async function updateFieldsAndIndexes(group) {
  for (const collection of group) {
    const existing = collections.get(collection.name)
    const body = {}
    if (existing.type === "view") {
      if (collection.viewQuery && collection.viewQuery !== existing.viewQuery) body.viewQuery = collection.viewQuery
    } else {
      const desired = withTimestamps(collection, (collection.fields ?? []).map(toApiField), existing.fields)
      body.fields = mergeFields(existing, desired)
      body.indexes = mergeIndexes(existing.indexes, collection.indexes)
      // A new field is writable under the old rules until applyRules() runs (it goes last because rules
      // may name fields of collections synced later), so lock the writes it will replace meanwhile. An
      // aborted run then leaves them superuser-only, not open.
      if (desired.some((field) => !existing.fields.some((f) => f.name === field.name))) {
        for (const key of ["create", "update"]) {
          if (key in (collection.rules ?? {})) body[RULE_KEYS[key]] = null
        }
      }
    }
    if (collection.authOptions) Object.assign(body, collection.authOptions)
    if (!Object.keys(body).length) continue
    const res = await request(base, `/api/collections/${existing.id}`, { method: "PATCH", token, body })
    if (res.status !== 200) fail(`Cannot update ${collection.name}: ${describeError(res)}`)
    console.log(`SYNC  ${collection.name} (${res.data.fields.length} fields, ${res.data.indexes.length} indexes)`)
  }
}

async function applyRules() {
  for (const collection of wanted) {
    if (!collection.rules) continue
    const body = {}
    for (const [key, apiKey] of Object.entries(RULE_KEYS)) {
      if (key in collection.rules) body[apiKey] = collection.rules[key]
    }
    const res = await request(base, `/api/collections/${collections.get(collection.name).id}`, { method: "PATCH", token, body })
    if (res.status !== 200) fail(`Cannot set rules on ${collection.name}: ${describeError(res)}`)
    console.log(`RULES ${collection.name}`)
  }
}

async function applyRateLimits() {
  if (!schema.rateLimits?.length) return
  const settings = await request(base, "/api/settings", { token })
  if (settings.status !== 200) fail(`Cannot read settings: ${describeError(settings)}`)
  const current = settings.data.rateLimits ?? { enabled: true, rules: [] }
  const rules = mergeRateLimitRules(current.rules ?? [], schema.rateLimits)
  const res = await request(base, "/api/settings", { method: "PATCH", token, body: { rateLimits: { ...current, enabled: true, rules } } })
  if (res.status !== 200) fail(`Cannot set rate limits: ${describeError(res)}`)
  console.log(`LIMIT ${schema.rateLimits.map((rule) => rule.label).join(", ")}`)
}

async function seedEmptyCollections() {
  for (const collection of wanted) {
    if (!collection.seed?.length) continue
    const recordsPath = `/api/collections/${collection.name}/records`
    const count = await request(base, `${recordsPath}?perPage=1&skipTotal=0`, { token })
    if (count.status !== 200) fail(`Cannot read ${collection.name}: ${describeError(count)}`)
    if (count.data.totalItems > 0) {
      console.log(`SEED  ${collection.name} skipped (already has ${count.data.totalItems} records)`)
      continue
    }
    const inserted = []
    for (const record of collection.seed) {
      const res = await request(base, recordsPath, { method: "POST", token, body: record })
      if (res.status === 200) {
        inserted.push(res.data.id)
        continue
      }
      await removeRecords(recordsPath, inserted)
      const after = await request(base, `${recordsPath}?perPage=1&skipTotal=0`, { token })
      const left = after.status === 200 ? after.data.totalItems : null
      const cleanup = left === 0
        ? ""
        : ` ${left ?? "Some"} record(s) are still in ${collection.name} (a request that failed may still have been saved); delete them in the dashboard, or the next run skips this collection's seed.`
      fail(`Cannot seed ${collection.name} with ${JSON.stringify(record)}: ${describeError(res)}.${cleanup}`)
    }
    console.log(`SEED  ${collection.name} (${collection.seed.length} records)`)
  }
}

async function removeRecords(recordsPath, ids) {
  for (const id of ids) await request(base, `${recordsPath}/${id}`, { method: "DELETE", token })
}
