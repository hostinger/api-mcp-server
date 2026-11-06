#!/usr/bin/env node
// Hostinger Headless — bootstrap.
// Verifies the Hostinger MCP server is reachable and drives the OAuth sign-in,
// emitting one JSON event per line on stdout so a coding agent can relay
// progress to the user. Its only writes are the launcher (~/.hostinger/mcp/launch.mjs, which
// coding tools register) and what the MCP itself stores (OAuth credentials); no network calls of its own.
import { spawn, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

// ── tiny event protocol (one JSON object per line) ───────────────────────────
const emit = (event, extra = {}) =>
  process.stdout.write(JSON.stringify({ event, ...extra }) + '\n');
const fail = (event, extra = {}) => {
  emit(event, { ok: false, ...extra });
  process.exit(1);
};

// ── the MCP server, always through the launcher ──────────────────────────────
// launch.mjs runs the latest published package via npx from the home folder (see its header for why
// npx must never run in the project). Coding tools register the home copy, which every run refreshes,
// so a registration keeps working when the skill folder moves to a new version.
const isWin = process.platform === 'win32';
const LAUNCHER = path.join(os.homedir(), '.hostinger', 'mcp', 'launch.mjs');
try {
  mkdirSync(path.dirname(LAUNCHER), { recursive: true });
  copyFileSync(new URL('./launch.mjs', import.meta.url), LAUNCHER);
  copyFileSync(new URL('./launch.sh', import.meta.url), LAUNCHER.replace(/\.mjs$/, '.sh'));
} catch (e) {
  fail('launcher_failed', { detail: String(e) });
}
const MCP = [process.execPath, LAUNCHER];
// A registration never names a bare `node`: Windows looks it up in the working directory (the project)
// first, and a version manager's shim (asdf, mise) runs the Node the project's .tool-versions names.
// macOS/Linux register /bin/sh with launch.sh, which finds node only after moving to home, so Node
// upgrades keep working. Windows names this Node by absolute path (this script runs from home).
emit('launcher', isWin
  ? { command: process.execPath, args: [LAUNCHER] }
  : { command: '/bin/sh', args: [LAUNCHER.replace(/\.mjs$/, '.sh')] });

function capture(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', cwd: os.homedir() });
  return { status: r.status ?? 1, out: `${r.stdout || ''}${r.stderr || ''}`, error: r.error };
}

// ── 1. MCP server reachable ──────────────────────────────────────────────────
function checkMcp() {
  const r = capture(MCP[0], [...MCP.slice(1), '--version']);
  if (r.status !== 0) fail('mcp_unreachable', { detail: r.out.trim().slice(0, 400) });
  // npx interleaves "npm notice …" lines, so pick the first semver-looking token.
  const version = (r.out.match(/\d+\.\d+\.\d+[^\s]*/) || [])[0] || r.out.trim().split('\n').pop();
  emit('mcp_ok', { version });
}

// ── 2. Existing auth? ────────────────────────────────────────────────────────
// An env token always wins (the MCP bypasses OAuth entirely when it is set).
// Otherwise stored OAuth credentials mean a previous sign-in can be reused —
// the MCP refreshes expired tokens automatically on the first tool call.
function existingAuth() {
  if (process.env.HOSTINGER_API_TOKEN || process.env.API_TOKEN) {
    return 'api_token';
  }
  const base = isWin ? (process.env.APPDATA || os.homedir()) : path.join(os.homedir(), '.config');
  const credsPath = path.join(base, 'hostinger-mcp', 'credentials.json');
  if (existsSync(credsPath)) {
    try {
      const creds = JSON.parse(readFileSync(credsPath, 'utf8'));
      if (creds.refresh_token || (creds.access_token && creds.expires_at > Date.now())) {
        return 'oauth_cached';
      }
    } catch {
      /* unreadable credentials — fall through to a fresh login */
    }
  }
  return null;
}

// ── 3. Login (human-in-the-loop browser flow) ────────────────────────────────
// `hostinger-api-mcp --login` opens the Hostinger sign-in page and listens on
// an ephemeral localhost port for the OAuth callback, so the browser must run
// on this same machine. It prints the sign-in URL to stderr with a stable
// prefix — forward it so the agent can show it if the browser didn't open.
function login() {
  return new Promise((resolve) => {
    const child = spawn(MCP[0], [...MCP.slice(1), '--login'], { cwd: os.homedir() });
    let diag = '';
    let urlSent = false;
    const collect = (chunk) => {
      diag = (diag + chunk).slice(-2000);
      if (!urlSent) {
        const m = diag.match(/Opening browser for sign-in:\s*\n\s*(https?:\/\/\S+)/);
        if (m) {
          urlSent = true;
          emit('awaiting_user', {
            verificationUri: m[1],
            note: 'A browser window should have opened. If not, open this URL manually on this machine and sign in.',
          });
        }
      }
    };
    child.stderr?.on('data', collect);
    child.stdout?.on('data', collect);
    child.on('close', (code) => {
      if (code === 0 && /Sign-in successful/i.test(diag)) {
        emit('logged_in', { method: 'oauth' });
        resolve();
        return;
      }
      const detail = diag.trim().slice(-1500) || `--login exited (code ${code}) with no output.`;
      fail('login_failed', { code, detail });
    });
    child.on('error', (e) => fail('login_failed', { detail: String(e) }));
  });
}

// ── main ─────────────────────────────────────────────────────────────────────
checkMcp();
const method = existingAuth();
if (method) {
  emit('logged_in', { method });
} else {
  await login();
}
emit('success');
