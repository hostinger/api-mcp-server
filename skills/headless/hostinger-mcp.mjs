// The local Hostinger MCP server (the management API), spoken to over newline-delimited JSON-RPC on
// stdio. It reuses the sign-in from the connect step. Shared by wait.mjs and push-content.mjs.

import { spawn } from 'node:child_process';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

// ── always through the launcher, which runs npx from the home folder, never in the project ─────────
const MCP = [process.execPath, fileURLToPath(new URL('./connect/launch.mjs', import.meta.url))];

// One server per script run. Once it dies every pending and later call rejects, so the caller ends with
// exit 2 rather than hanging.
export function connect(clientName) {
  const child = spawn(MCP[0], MCP.slice(1), { stdio: ['pipe', 'pipe', 'pipe'], cwd: homedir() });
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
  // it, it answers like an error reply. A stalled start ends the run. The start gets longer: a cold `npx`
  // fetch of the server takes 13-40 s on an idle machine and over 60 s on a busy one.
  const rpc = (method, params, seconds = 60) =>
    new Promise((resolve, reject) => {
      if (dead) return reject(dead);
      const id = (nextId += 1);
      const timer = setTimeout(() => {
        pending.delete(id);
        resolve({ error: { message: `no reply to ${method} in ${seconds} s` } });
      }, seconds * 1000);
      const settle = (fn) => (value) => {
        clearTimeout(timer);
        fn(value);
      };
      pending.set(id, { resolve: settle(resolve), reject: settle(reject) });
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
    });
  const ready = rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: clientName, version: '1' } }, 180)
    .then((reply) => {
      if (reply.error) throw new Error(`the Hostinger MCP server didn't start: ${reply.error.message}`);
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })}\n`);
    });
  // Runs one API operation: { data } on success, else { error, status } with the HTTP status the server
  // keeps in its error text (NaN when there is none).
  const execute = async (operation, params) => {
    await ready;
    const reply = await rpc('tools/call', { name: 'execute', arguments: { operation, params } });
    const text = reply.result?.content?.[0]?.text ?? reply.error?.message ?? 'unknown error';
    if (reply.error || reply.result?.isError) return { error: text.slice(0, 300), status: Number(text.match(/HTTP (\d{3})/)?.[1]) };
    try {
      return { data: JSON.parse(text) };
    } catch {
      return { error: text.slice(0, 300), status: NaN };
    }
  };
  return { execute, close: () => child.kill() };
}
