#!/usr/bin/env node
// Hostinger Headless — starts the latest Hostinger MCP server for a coding tool or a script.
//   node launch.mjs [hostinger-<group>-mcp] [--login | --logout | --version]
//
// Coding tools start stdio servers in the user's project, often a cloned repository or template.
// npx run there puts <project>/node_modules/.bin, and the same folder of every parent, first on PATH
// (no npm flag turns that off) and reads the project's .npmrc, so the project's own `node` would run
// the server with the user's Hostinger credentials. This launcher runs npx from the home folder, with
// no relative or node_modules entries left on PATH, so nothing in the project is ever looked up.
import { spawn } from 'node:child_process';
import { homedir } from 'node:os';
import path from 'node:path';

const [PACKAGE, DEFAULT_BIN] = ['--package=@hostinger/mcp@latest', 'hostinger-api-mcp'];
const isWin = process.platform === 'win32';
const home = homedir();

const args = process.argv.slice(2);
// npx.cmd needs a shell on Windows (CVE-2024-27980), so every argument must be shell-inert.
if (args.some((a) => !/^[\w@.=:/-]+$/.test(a))) {
  process.stderr.write(`launch.mjs: unexpected argument in ${JSON.stringify(args)}\n`);
  process.exit(2);
}
const bin = /^[a-z0-9-]+-mcp$/.test(args[0] ?? '') ? args.shift() : DEFAULT_BIN;

// Windows may spell it Path; a relative entry or a node_modules folder can come from the project.
// The server returns to the project once started, so relative paths in tool arguments still work
// (launch.sh has already moved to home and names the project itself).
const env = { ...process.env, MCP_PROJECT_DIR: process.env.MCP_PROJECT_DIR || process.cwd() };
for (const key of Object.keys(env).filter((k) => k.toUpperCase() === 'PATH')) {
  env[key] = env[key].split(path.delimiter)
    .filter((p) => path.isAbsolute(p) && !p.split(/[\\/]/).includes('node_modules'))
    .join(path.delimiter);
}

const child = spawn(isWin ? 'npx.cmd' : 'npx', ['-y', PACKAGE, bin, ...args], { cwd: home, env, stdio: 'inherit', shell: isWin });
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(signal, () => child.kill(signal));
child.on('error', (e) => {
  process.stderr.write(`launch.mjs: could not start npx: ${e.message}\n`);
  process.exit(1);
});
child.on('exit', (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
