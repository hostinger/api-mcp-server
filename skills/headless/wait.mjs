#!/usr/bin/env node
// Hostinger Headless wait: polls one slow Hostinger job to its end in a single command, so the agent
// doesn't spend a model turn on every sleep-and-check.
//
//   node wait.mjs setup <domain>              # hosting_websites_list-setups row → completed (fresh site)
//   node wait.mjs cms <domain> <username>     # wordpress_installations_list → /cms row is_valid (shell swap)
//   node wait.mjs build <domain> <buildUuid>  # hosting_get-deployment → build completed, then the root serves 200
//   node wait.mjs live <domain>               # https://<domain>/ serves 200
//   any of them: [--timeout 10m]
//
// It talks to the local Hostinger MCP server, which reuses the sign-in from the connect step. Progress
// goes to stderr; stdout is one JSON line. Exit 0 when done, 1 when the job failed, timed out or hit an
// error retrying can't fix (the JSON says which), 2 when it couldn't run (`fallback` names the
// operation to poll by hand instead).

import { spawn } from 'node:child_process';
import { homedir } from 'node:os';

// ── platform-safe binary names (npm/npx are .cmd on Windows), as in connect/bootstrap.mjs ──────────
const isWin = process.platform === 'win32';
const bin = (name) => (isWin ? `${name}.cmd` : name);
const MCP = [bin('npx'), '-y', '--package=@hostinger/mcp@latest', 'hostinger-api-mcp'];
// Node >= 18.20.2 / 20.12.2 refuses to spawn a .cmd/.bat without a shell
// (CVE-2024-27980), so npx.cmd needs shell:true on Windows. Our args are all
// fixed literals, so enabling the shell introduces no injection risk.
const spawnShell = isWin;

const log = (message) => process.stderr.write(`wait: ${message}\n`);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let fallback = null;
const finish = (code, result) => {
  process.stdout.write(`${JSON.stringify(result)}\n`);
  process.exit(code);
};
const fail = (message) => finish(2, { ok: false, error: message, ...(fallback ? { fallback } : {}) });

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[(i += 1)] : true;
      flags[key] = value;
    } else positional.push(argv[i]);
  }
  return { positional, flags };
}

function duration(text) {
  const m = typeof text === 'string' && text.match(/^(\d+(?:\.\d+)?)\s*([smh])$/);
  if (!m) fail(`--timeout "${text}" should look like 90s, 10m or 1h`);
  return Number(m[1]) * { s: 1e3, m: 6e4, h: 36e5 }[m[2]];
}

// One MCP server for the whole wait, spoken to over newline-delimited JSON-RPC on stdio. Once the
// server dies every pending and later call rejects, so the wait ends with exit 2 rather than hanging.
function connect() {
  const child = spawn(MCP[0], MCP.slice(1), { stdio: ['pipe', 'pipe', 'pipe'], shell: spawnShell, cwd: homedir() });
  const pending = new Map();
  let buffer = '';
  let diag = '';
  let dead = null;
  let nextId = 0;
  const die = (reason) => {
    dead ??= new Error(`the Hostinger MCP server stopped (${reason}): ${diag.trim().slice(-500)}`);
    for (const { reject } of pending.values()) reject(dead);
    pending.clear();
  };
  child.on('error', (e) => die(e.message));
  // 'close' comes after stderr is drained, so the reason is in diag. A write to a dying server fails
  // with EPIPE before that; 'close' still follows, so the EPIPE itself is ignored.
  child.on('close', (code) => die(`exit code ${code}`));
  child.stdin.on('error', () => {});
  child.stderr.on('data', (chunk) => (diag = (diag + chunk).slice(-2000)));
  child.stdout.on('data', (chunk) => {
    buffer += chunk;
    let i;
    while ((i = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, i);
      buffer = buffer.slice(i + 1);
      try {
        const message = JSON.parse(line);
        pending.get(message.id)?.resolve(message);
        pending.delete(message.id);
      } catch {
        /* not a JSON-RPC line */
      }
    }
  });
  // A call can stall on a live server (a stuck upstream request), so each one has its own deadline; past
  // it, it answers like an error reply. A stalled poll is retried; a stalled start ends the wait.
  const rpc = (method, params) =>
    new Promise((resolve, reject) => {
      if (dead) return reject(dead);
      const id = (nextId += 1);
      const timer = setTimeout(() => {
        pending.delete(id);
        resolve({ error: { message: `no reply to ${method} in 60 s` } });
      }, 60_000);
      const settle = (fn) => (value) => {
        clearTimeout(timer);
        fn(value);
      };
      pending.set(id, { resolve: settle(resolve), reject: settle(reject) });
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
    });
  const ready = rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'headless-wait', version: '1' } })
    .then((reply) => {
      if (reply.error) throw new Error(`the Hostinger MCP server didn't start: ${reply.error.message}`);
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })}\n`);
    });
  // The server keeps "HTTP <status>" in its error text. A 409 while the setup runs, a 429 or a 5xx is a
  // poll that didn't answer; any other 4xx (expired sign-in) or an unknown domain won't fix itself by waiting.
  const execute = async (operation, params) => {
    await ready;
    const reply = await rpc('tools/call', { name: 'execute', arguments: { operation, params } });
    const text = reply.result?.content?.[0]?.text ?? reply.error?.message ?? 'unknown error';
    if (reply.error || reply.result?.isError) {
      const status = Number(text.match(/HTTP (\d{3})/)?.[1]);
      const terminal = (status >= 400 && status < 500 && ![408, 409, 425, 429].includes(status)) || /No website found/.test(text);
      return { error: text.slice(0, 300), terminal };
    }
    try {
      return { data: JSON.parse(text) };
    } catch {
      return { error: text.slice(0, 300), terminal: false };
    }
  };
  return { execute, close: () => child.kill() };
}

async function httpStatus(url) {
  try {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30_000) });
    return response.status;
  } catch {
    return 0;
  }
}

// Polls check() until it returns a result, with pauses growing from 5 s to 30 s.
async function poll(label, timeoutMs, check) {
  const started = Date.now();
  const waited = () => Math.round((Date.now() - started) / 1000);
  let pause = 5_000;
  let last = null;
  for (;;) {
    const outcome = await check();
    if (outcome.done) return { ...outcome.done, waited_s: waited() };
    if (outcome.terminal) return { ok: false, error: outcome.status, waited_s: waited() };
    if (outcome.status !== last) log(`${label}: ${outcome.status}`);
    last = outcome.status;
    if (Date.now() - started + pause > timeoutMs) return { ok: false, timed_out: true, last_status: last, waited_s: waited() };
    await sleep(pause);
    pause = Math.min(pause * 1.5, 30_000);
  }
}

// List operations answer an array, or an object holding it in `data`; their domain filter is loose.
const rowsFor = (data, domain) =>
  (Array.isArray(data) ? data : data?.data ?? []).filter((r) => r.domain?.toLowerCase() === domain.toLowerCase());

const waitLive = (domain, timeoutMs) =>
  poll('live', timeoutMs, async () => {
    const status = await httpStatus(`https://${domain}/`);
    return status === 200 ? { done: { ok: true, live: `https://${domain}/` } } : { status: `root ${status || 'unreachable'}` };
  });

const KINDS = {
  setup: {
    args: [],
    timeout: '10m',
    fallback: 'hosting_websites_list-setups',
    run: (mcp, { domain }, timeoutMs) =>
      poll('setup', timeoutMs, async () => {
        const { data, error, terminal } = await mcp.execute('hosting_websites_list-setups', { domain });
        if (error) return { status: `list-setups: ${error}`, terminal };
        const [row] = rowsFor(data, domain);
        if (row?.status === 'completed') return { done: { ok: true, setup: row } };
        if (row?.status === 'failed') return { done: { ok: false, setup: row } };
        return { status: row ? row.status : 'no setup row yet' };
      }),
  },

  cms: {
    args: ['username'],
    timeout: '5m',
    fallback: 'wordpress_installations_list',
    // The list can lag a few seconds behind the install finishing and answer [], so an empty list is a wait.
    run: (mcp, { domain, username }, timeoutMs) =>
      poll('cms', timeoutMs, async () => {
        const { data, error, terminal } = await mcp.execute('wordpress_installations_list', { username, domain, ownership: 'all' });
        if (error) return { status: `installations: ${error}`, terminal };
        const rows = rowsFor(data, domain).filter((r) => r.directory === 'cms');
        const valid = rows.find((r) => r.is_valid ?? r.valid);
        if (valid) return { done: { ok: true, install: valid } };
        return { status: rows.length ? `/cms install not valid yet: ${rows[0].validationError ?? 'pending'}` : 'no /cms install yet' };
      }),
  },

  build: {
    args: ['buildUuid'],
    timeout: '15m',
    fallback: 'hosting_get-deployment',
    run: async (mcp, { domain, buildUuid }, timeoutMs) => {
      const started = Date.now();
      const build = await poll('build', timeoutMs, async () => {
        const { data, error, terminal } = await mcp.execute('hosting_get-deployment', { domain, buildUuid });
        if (error) return { status: `get-deployment: ${error}`, terminal };
        const state = data?.build?.state;
        if (state === 'failed') {
          const logTail = String(data.logs?.logs ?? '').split('\n').slice(-40).join('\n');
          return { done: { ok: false, build: data.build, analysis: data.analysis, log_tail: logTail } };
        }
        if (state === 'completed') return { done: { ok: true, build: data.build, buildSettings: data.buildSettings } };
        return { status: `build ${state ?? 'not found yet'}` };
      });
      if (!build.ok) return build;
      // Settings that didn't take make the root 403 for good, so don't wait for it to go live.
      const missing = ['app_type', 'output_directory', 'node_version'].filter((k) => build.buildSettings?.[k] == null);
      if (missing.length) return { ...build, ok: false, error: `build settings missing: ${missing.join(', ')}; pass them on hosting_deploy and redeploy` };
      const live = await waitLive(domain, timeoutMs - (Date.now() - started));
      return { ...build, ...live, waited_s: Math.round((Date.now() - started) / 1000) };
    },
  },

  live: {
    args: [],
    timeout: '5m',
    run: (_mcp, { domain }, timeoutMs) => waitLive(domain, timeoutMs),
  },
};

const { positional, flags } = parseArgs(process.argv.slice(2));
const [kind, domain, ...rest] = positional;
const spec = KINDS[kind];
const usage = Object.entries(KINDS).map(([k, s]) => `wait.mjs ${k} <domain>${s.args.map((a) => ` <${a}>`).join('')}`).join(' | ');
if (!spec || !domain || rest.length < spec.args.length) fail(`usage: ${usage} [--timeout 10m]`);
const params = { domain, ...Object.fromEntries(spec.args.map((a, i) => [a, rest[i]])) };
const timeoutMs = duration(flags.timeout ?? spec.timeout);
fallback = spec.fallback ?? null;
const mcp = spec.fallback ? connect() : null;
const result = await spec.run(mcp, params, timeoutMs).catch((e) => fail(e.message));
mcp?.close();
finish(result.ok ? 0 : 1, { wait: kind, domain, ...result });
