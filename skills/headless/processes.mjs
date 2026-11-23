// The process list and process-tree signals, shared by run-log.mjs (the domain lock) and
// local-server.mjs (the servers a run starts). Both tell a live process from a reused PID by its
// start time.

import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { basename, delimiter, isAbsolute, join } from 'node:path';

export const processName = (name) => basename(name.replace(/\\/g, '/')).replace(/^-/, '').replace(/\.exe$/i, '').toLowerCase();

// These scripts run in the user's project, maybe a cloned repository. Windows looks a bare program name
// up in the working directory before PATH, as does a relative PATH entry elsewhere, so system programs
// run from home with only absolute, non-node_modules PATH entries (as connect/launch.mjs runs npx),
// and Windows programs are named by their full path.
const helperEnv = { ...process.env, LC_ALL: 'C', TZ: 'UTC' };
for (const key of Object.keys(helperEnv).filter((k) => k.toUpperCase() === 'PATH')) {
  helperEnv[key] = helperEnv[key].split(delimiter)
    .filter((p) => isAbsolute(p) && !p.split(/[\\/]/).includes('node_modules'))
    .join(delimiter);
}
const systemRoot = isAbsolute(process.env.SystemRoot ?? '') ? process.env.SystemRoot : 'C:\\Windows';
const POWERSHELL = join(systemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
const TASKKILL = join(systemRoot, 'System32', 'taskkill.exe');

// pid -> { ppid, started, name }; null when the process list can't be read (a sandbox that blocks ps).
export function processTable() {
  const windows = process.platform === 'win32';
  const r = windows
    ? spawnSync(POWERSHELL, ['-NoProfile', '-NonInteractive', '-Command',
      'Get-CimInstance Win32_Process | ForEach-Object { "$($_.ProcessId)`t$($_.ParentProcessId)`t$(if ($_.CreationDate) { $_.CreationDate.ToUniversalTime().ToString(\'o\') })`t$($_.Name)" }'], { encoding: 'utf8', cwd: homedir(), env: helperEnv })
    : spawnSync('ps', ['-A', '-o', 'pid=,ppid=,lstart=,comm='], { encoding: 'utf8', cwd: homedir(), env: helperEnv });
  if (r.status !== 0 || !r.stdout) return null;
  const table = new Map();
  for (const line of r.stdout.split(/\r?\n/)) {
    const m = windows ? line.match(/^(\d+)\t(\d+)\t([^\t]*)\t(.*)$/) : line.trim().match(/^(\d+)\s+(\d+)\s+(\w+\s+\w+\s+\d+\s+[\d:]+\s+\d+)\s+(.*)$/);
    if (m) table.set(Number(m[1]), { ppid: Number(m[2]), started: m[3].replace(/\s+/g, ' ') || null, name: m[4] });
  }
  return table.size ? table : null;
}

// Whether the process group led by pid (on Windows, the process itself) still has a member.
export function groupAlive(pid) {
  if (process.platform === 'win32') return processTable()?.has(pid) ?? false;
  try {
    process.kill(-pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

// Signals the process group led by pid: a server started detached leads its own group, so npx, the
// framework and its workers all get it. Windows has no groups: taskkill /T walks the tree instead.
export function signalGroup(pid, signal) {
  if (process.platform === 'win32') {
    spawnSync(TASKKILL, ['/PID', String(pid), '/T', ...(signal === 'SIGKILL' ? ['/F'] : [])], { cwd: homedir(), env: helperEnv, stdio: 'ignore' });
    return;
  }
  try {
    process.kill(-pid, signal);
  } catch {}
}
