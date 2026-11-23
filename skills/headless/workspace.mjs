// The folder a Headless build keeps for a domain, ~/.hostinger/<domain>, shared by the scripts that
// write there (run-log.mjs, local-server.mjs).

import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

// A domain names a folder under ~/.hostinger, so "../x" or "a/b" must never reach the file system.
const HOSTNAME = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;

export const now = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

// The domain's workspace folder; throws a message for the agent when the domain isn't one, or when
// the folder is missing and not created (run-start, a run's first command, creates it).
export function workspaceDir(domain, { create = false } = {}) {
  if (!HOSTNAME.test(domain ?? '')) throw new Error(`"${domain ?? ''}" is not a domain (use its ASCII form, e.g. xn--caf-dma.com)`);
  const dir = join(homedir(), '.hostinger', domain);
  if (create) mkdirSync(dir, { recursive: true });
  else if (!existsSync(dir)) throw new Error(`no workspace at ${dir}; run-log.mjs run-start creates it`);
  return dir;
}

// Through a rename, so a reader never sees half of the file.
export function writeJsonAtomic(file, value) {
  const tmp = `${file}.${process.pid}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(tmp, file);
}
