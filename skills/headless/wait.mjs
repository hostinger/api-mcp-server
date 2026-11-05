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

import { connect } from './hostinger-mcp.mjs';

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

// A 409 while the setup runs, a 429 or a 5xx is a poll that didn't answer; any other 4xx (expired
// sign-in) or an unknown domain won't fix itself by waiting.
const isTerminal = ({ error, status }) => (status >= 400 && status < 500 && ![408, 409, 425, 429].includes(status)) || /No website found/.test(error);

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
        const reply = await mcp.execute('hosting_websites_list-setups', { domain });
        const { data, error } = reply;
        if (error) return { status: `list-setups: ${error}`, terminal: isTerminal(reply) };
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
        const reply = await mcp.execute('wordpress_installations_list', { username, domain, ownership: 'all' });
        const { data, error } = reply;
        if (error) return { status: `installations: ${error}`, terminal: isTerminal(reply) };
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
        const reply = await mcp.execute('hosting_get-deployment', { domain, buildUuid });
        const { data, error } = reply;
        if (error) return { status: `get-deployment: ${error}`, terminal: isTerminal(reply) };
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
const mcp = spec.fallback ? connect('headless-wait') : null;
const result = await spec.run(mcp, params, timeoutMs).catch((e) => fail(e.message));
mcp?.close();
finish(result.ok ? 0 : 1, { wait: kind, domain, ...result });
