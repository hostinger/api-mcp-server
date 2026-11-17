import fs from "node:fs"

const REQUEST_TIMEOUT_MS = 20000
const WAKE_UP_RETRY_DELAY_MS = 3000
const RETRYABLE_STATUSES = new Set([502, 503, 504])
const RETRYABLE_STATUSES_FOR_WRITES = new Set([503])
const SAFE_METHODS = new Set(["GET", "HEAD"])

export function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"))
  } catch (error) {
    fail(`Cannot read ${path}: ${error.message}`)
  }
}

export function readCredentials(path) {
  const creds = readJson(path)
  const mode = fs.statSync(path).mode
  const readableByOthers = (mode & 0o077) !== 0
  if (readableByOthers && process.platform !== "win32") {
    try {
      fs.chmodSync(path, 0o600)
      console.warn(`WARN  ${path} was readable by other users; it is now mode 600. If this computer is shared, rotate the password with hosting_pocketbase_set-superuser.`)
    } catch {
      console.warn(`WARN  ${path} is readable by other users; run: chmod 600 ${path}`)
    }
  }
  return creds
}

export function fail(message) {
  console.error(`ERROR ${message}`)
  process.exit(1)
}

export function baseUrlFrom(creds) {
  const raw = creds.api_url ?? (creds.domain ? `https://${creds.domain}` : null)
  if (!raw) fail("The credentials file has no domain or api_url. Save the full hosting_pocketbase_create-backend response.")
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return withScheme.replace(/\/+$/, "").replace(/\/api$/i, "")
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function request(base, path, { method = "GET", token, body, retries = 2 } = {}) {
  const canRetryNetworkErrors = SAFE_METHODS.has(method)
  const retryableStatuses = SAFE_METHODS.has(method) ? RETRYABLE_STATUSES : RETRYABLE_STATUSES_FOR_WRITES
  let lastError
  for (let attempt = 0; attempt <= retries; attempt++) {
    const isLastAttempt = attempt === retries
    try {
      const response = await fetch(`${base}${path}`, {
        method,
        headers: {
          Accept: "application/json",
          ...(body ? { "Content-Type": "application/json" } : {}),
          ...(token ? { Authorization: token } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
      if (retryableStatuses.has(response.status) && !isLastAttempt) {
        await sleep(WAKE_UP_RETRY_DELAY_MS)
        continue
      }
      const text = await response.text()
      let data = null
      try {
        data = text ? JSON.parse(text) : null
      } catch {
        data = text
      }
      return { status: response.status, data }
    } catch (error) {
      lastError = error
      if (!canRetryNetworkErrors || isLastAttempt) break
      await sleep(WAKE_UP_RETRY_DELAY_MS)
    }
  }
  return { status: 0, data: { message: lastError?.message ?? "request failed" } }
}

export async function wakeUp(base) {
  const health = await request(base, "/api/health", { retries: 5 })
  if (health.status !== 200) {
    fail(`${base}/api/health returned ${health.status} (${health.data?.message ?? "no message"}). Check the domain and that the backend exists (hosting_pocketbase_backend).`)
  }
}

export async function superuserToken(base, creds) {
  const email = creds.superuser_email
  const password = creds.superuser_password
  if (!email || !password) fail("The credentials file has no superuser_email or superuser_password.")
  const res = await request(base, "/api/collections/_superusers/auth-with-password", {
    method: "POST",
    body: { identity: email, password },
    retries: 4,
  })
  if (res.status !== 200) {
    fail(
      `Superuser sign-in failed (${res.status}: ${res.data?.message ?? "no message"}). ` +
        "If the password was lost, rotate it with hosting_pocketbase_set-superuser and save the response.",
    )
  }
  return res.data.token
}

export async function listCollections(base, token) {
  const res = await request(base, "/api/collections?perPage=1000", { token })
  if (res.status !== 200) fail(`Cannot list collections: ${describeError(res)}`)
  return new Map(res.data.items.map((item) => [item.name, item]))
}

export function describeError(res) {
  const details = res.data?.data && Object.keys(res.data.data).length ? JSON.stringify(res.data.data) : ""
  return `${res.status} ${res.data?.message ?? ""} ${details}`.trim()
}

export function mergeRateLimitRules(current, desired) {
  const keyOf = (rule) => `${rule.label}|${rule.audience ?? ""}`
  const desiredKeys = new Set(desired.map(keyOf))
  const normalized = desired.map((rule) => ({ audience: "", ...rule }))
  return [...current.filter((rule) => !desiredKeys.has(keyOf(rule))), ...normalized]
}
