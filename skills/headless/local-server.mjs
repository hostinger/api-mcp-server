#!/usr/bin/env node
// Hostinger Headless local server: starts a build's local dev or preview server, and stops them, so a
// run never leaves one behind.
//
//   cd <project> && node local-server.mjs start <domain> [--timeout 90s] -- <command…>
//   node local-server.mjs stop <domain>
//
// start replaces the servers this domain already runs, picks a free port, runs the command from the
// current folder with PORT set and every {port} in its arguments replaced, waits until the port answers
// HTTP and records the server in ~/.hostinger/<domain>/servers.json. stop stops every server recorded
// there that may still be running. run-log.mjs stops them too, at run-start and report.
//
// stdout is one JSON line. Exit 0 when done; 1 when the server didn't come up (`error`, `log_tail`) or
// a server couldn't be confirmed stopped; 2 when it couldn't run (`error`).

import { isDown, startServer, stopServers } from './servers.mjs';
import { workspaceDir } from './workspace.mjs';

const finish = (code, result) => {
  process.stdout.write(`${JSON.stringify(result)}\n`);
  process.exit(code);
};
const fail = (message) => finish(2, { ok: false, error: message });
const DEFAULT_TIMEOUT = '90s';

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

const argv = process.argv.slice(2);
const dash = argv.includes('--') ? argv.indexOf('--') : argv.length;
const { positional: [action, domain, ...extra], flags } = parseArgs(argv.slice(0, dash));
const command = argv.slice(dash + 1);
if (!['start', 'stop'].includes(action) || extra.length) fail(`usage: start <domain> [--timeout ${DEFAULT_TIMEOUT}] -- <command…> | stop <domain>`);
if (action === 'start' && !command.length) fail('give the server command after --, e.g. start <domain> -- npx next start -p {port}');
let dir;
try {
  dir = workspaceDir(domain);
} catch (error) {
  fail(error.message);
}

if (action === 'start') {
  const result = await startServer(dir, command, { timeoutMs: duration(flags.timeout ?? DEFAULT_TIMEOUT) });
  finish(result.ok ? 0 : 1, result);
}
const tried = await stopServers(dir);
const ok = tried.every(isDown);
finish(ok ? 0 : 1, { ok, stopped: tried.map(({ port, pid, command: cmd, status }) => ({ port, pid, command: cmd, status })) });
