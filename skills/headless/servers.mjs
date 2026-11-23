// The local dev and preview servers a Headless build starts, recorded in <workspace>/servers.json so
// the run can stop them when it ends. local-server.mjs is the agent's command for it; run-log.mjs
// stops them at run-start and report.

import { spawn } from 'node:child_process';
import { closeSync, mkdirSync, openSync, readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { groupAlive, processTable, signalGroup } from './processes.mjs';
import { now, writeJsonAtomic } from './workspace.mjs';

// Statuses after which a server is known to be down. Any other (starting, running, still_running,
// not_verified) may still be running, so a later stop tries it again.
const DOWN = ['stopped', 'already_gone'];
export const isDown = (server) => DOWN.includes(server.status);
const STOP_GRACE_MS = 5000;
const KILL_GRACE_MS = 2000;
const START_ATTEMPTS = 3;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const serversPath = (dir) => join(dir, 'servers.json');

// Merges fields into this server's record; servers.json keeps every server the domain started, so a
// pid alone may match an old one.
function updateServer(dir, server, fields) {
  const same = (s) => s.pid === server.pid && s.started_at === server.started_at;
  writeJsonAtomic(serversPath(dir), readServers(dir).map((s) => (same(s) ? { ...s, ...fields } : s)));
}

function readServers(dir) {
  try {
    const servers = JSON.parse(readFileSync(serversPath(dir), 'utf8'));
    return Array.isArray(servers) ? servers : [];
  } catch {
    return [];
  }
}

const STATUS_TEXT = { stopped: 'stopped', already_gone: 'already gone', still_running: 'still running', not_verified: 'could not be confirmed stopped' };
export const describeServer = (s) => `port ${s.port} (pid ${s.pid}, ${s.command}): ${STATUS_TEXT[s.status] ?? s.status}`;

// The servers started since `since` (a run's started_at), as the build report shows them.
export const serversSince = (dir, since) => readServers(dir)
  .filter((s) => s.started_at >= since)
  .map(({ pid, port, command, started_at, stopped_at, status }) => ({ pid, port, command, started_at, stopped_at: stopped_at ?? null, status }));

// Whether something listens on the port, on any address.
const portBusy = (port) => new Promise((resolve) => {
  const probe = createServer();
  probe.once('error', (error) => resolve(error.code === 'EADDRINUSE'));
  probe.listen(port, () => probe.close(() => resolve(false)));
});

// A port the system has just handed out is free, unless another program takes it before the server
// binds it: startServer retries then. One rule for every framework, as Next.js has no port auto-increment.
const freePort = () => new Promise((resolve, reject) => {
  const probe = createServer();
  probe.once('error', reject);
  probe.listen(0, () => {
    const { port } = probe.address();
    probe.close(() => resolve(port));
  });
});

async function gone(pid, ms) {
  for (const until = Date.now() + ms; Date.now() < until; await sleep(100)) if (!groupAlive(pid)) return true;
  return !groupAlive(pid);
}

// A recorded PID now held by a process with another start time was reused: it isn't ours, so it is
// left alone. Without a start time to compare (no process list), the group is stopped only while the
// port is still bound.
async function stopOne(server, table) {
  if (!groupAlive(server.pid)) return 'already_gone';
  const leader = table?.get(server.pid);
  if (leader && server.started && leader.started !== server.started) return 'already_gone';
  if ((!table || !server.started) && !(await portBusy(server.port))) return 'not_verified';
  signalGroup(server.pid, 'SIGTERM');
  return (await gone(server.pid, STOP_GRACE_MS)) ? 'stopped' : kill(server.pid);
}

async function kill(pid) {
  signalGroup(pid, 'SIGKILL');
  return (await gone(pid, KILL_GRACE_MS)) ? 'stopped' : 'still_running';
}

// Stops every server recorded in the workspace that may still be running, and returns those it tried.
// One session builds a domain at a time (run-log.mjs's lock), so whatever is recorded here belongs to
// this session or to one that is gone; servers elsewhere (the user's own, other domains) are never
// looked at.
export async function stopServers(dir) {
  const servers = readServers(dir);
  const live = servers.filter((s) => !isDown(s));
  if (!live.length) return [];
  const table = processTable();
  for (const server of live) {
    server.status = await stopOne(server, table);
    server.stopped_at = now();
  }
  writeJsonAtomic(serversPath(dir), servers);
  return live;
}

// Resolves once the port answers HTTP (any status), or with why the server exited or ran out of time.
async function serving(child, port, timeoutMs) {
  let exited = null;
  child.once('exit', (code, signal) => (exited = `exited with ${signal ?? `code ${code}`}`));
  child.once('error', (error) => (exited = `could not start: ${error.message}`));
  for (const until = Date.now() + timeoutMs; Date.now() < until; await sleep(250)) {
    if (exited) return exited;
    // Astro and Vite listen on localhost, which may be IPv6 only; Next.js listens on every address.
    for (const host of ['127.0.0.1', '[::1]']) {
      try {
        await fetch(`http://${host}:${port}/`, { redirect: 'manual', signal: AbortSignal.timeout(2000) });
        return null;
      } catch {}
    }
  }
  return exited ?? `did not answer on port ${port} within ${timeoutMs / 1000}s`;
}

const tail = (file) => readFileSync(file, 'utf8').trim().split('\n').slice(-15).join('\n');

// Spawns the command on the port, logging to servers/<port>.log, and records it as starting before
// anyone waits on it, so it is still stopped when start is killed mid-wait. Without a process list
// (no start time) a stop only stops it once it binds its port. server is null when it didn't spawn.
function launch(dir, command, port) {
  const [program, ...args] = command.map((a) => a.replaceAll('{port}', String(port)));
  const project = process.cwd();
  const log = join(dir, 'servers', `${port}.log`);
  const out = openSync(log, 'w');
  // Its own process group (detached), so a stop reaches npx, the framework and its workers alike.
  // ASTRO_PREVIEW_BACKGROUND keeps `astro preview` in the foreground under an agent, so the recorded
  // pid is the real server. Windows starts npx and npm through .cmd shims, which need a shell.
  const child = spawn(program, args, {
    cwd: project,
    detached: true,
    stdio: ['ignore', out, out],
    env: { ...process.env, PORT: String(port), ASTRO_PREVIEW_BACKGROUND: '1' },
    shell: process.platform === 'win32',
    windowsHide: true,
  });
  closeSync(out);
  if (!child.pid) return { child, server: null, log };
  const started = processTable()?.get(child.pid)?.started ?? null;
  const server = { pid: child.pid, started, port, command: [program, ...args].join(' '), cwd: project, log, started_at: now(), status: 'starting' };
  writeJsonAtomic(serversPath(dir), [...readServers(dir), server]);
  return { child, server, log };
}

// Starts `command` from the current folder on a free port and records it, replacing the servers this
// domain already runs, since a running server keeps serving the build it started with.
export async function startServer(dir, command, { timeoutMs }) {
  await stopServers(dir);
  mkdirSync(join(dir, 'servers'), { recursive: true });
  for (let attempt = 1; ; attempt += 1) {
    const port = await freePort();
    const { child, server, log } = launch(dir, command, port);
    const error = await serving(child, port, timeoutMs);
    if (!error) {
      child.unref();
      updateServer(dir, server, { status: 'running' });
      return { ok: true, url: `http://localhost:${port}/`, port, pid: child.pid, log };
    }
    if (server) updateServer(dir, server, { status: await kill(server.pid), stopped_at: now() });
    if (attempt < START_ATTEMPTS && /EADDRINUSE/.test(tail(log))) continue;
    return { ok: false, error: `the server ${error}`, log, log_tail: tail(log) };
  }
}
