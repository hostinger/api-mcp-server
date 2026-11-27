#!/usr/bin/env node
// Hostinger Headless visual check findings: turns the check subagents' answers into the run's issue
// events, one per finding, so the build report counts what the check caught.
//
//   set -o pipefail; node check-findings.mjs <domain> --stage <frontend|validate> \
//     | while IFS= read -r e; do node run-log.mjs <domain> event issue "$e" || exit 1; done
//
// Reads ~/.hostinger/<domain>/checks/<round>/answer.txt for every round written since the current
// run started, as the subagents saved them. A finding line is `<id> | <defect|polish> | <routes> |
// <widths> | <what's wrong> | <rule> | <screenshot or file>`, its id `<round>.<n>`; a re-check answers
// `fixed | <id>` or `open | <id> | …`. A finding is resolved when the latest round that named it
// answered `fixed`. A finding this run already logged (its id in a `visual check:` issue event) is
// skipped, so running it again, or again at validate, logs only what is new.
//
// stdout is one `issue` event per line (`medium` for a defect, `low` for polish), for run-log.mjs to
// log: run-log.mjs takes the agent's session from its parent, so it runs from the agent's shell, not
// from here. stderr lists the unresolved findings and every line it couldn't place. Exit 0 when done;
// 1 when an answer needs fixing (a line it couldn't place, a status for an unknown id, a round with no
// answer.txt), after printing the events it could read; 2 when it couldn't run.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { workspaceDir } from './workspace.mjs';

const STAGES = ['frontend', 'validate'];
const SEVERITY = { defect: 'medium', polish: 'low' };
const LOGGED_ID = /^visual check: .* \((\d+\.\d+)\)$/;

const fail = (message) => {
  console.error(`check-findings: ${message}`);
  process.exit(2);
};

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

const readJson = (file, fallback) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
};

// A line's fields, without the list markers, bold or backticks a model may wrap it in.
const fields = (line) => line.replace(/^\s*(?:[-*]\s+)?/, '').split('|').map((f) => f.trim().replace(/^[*`]+|[*`]+$/g, ''));

const { positional, flags } = parseArgs(process.argv.slice(2));
const [domain, ...extra] = positional;
if (extra.length) fail(`unexpected arguments: ${extra.join(' ')}`);
if (!STAGES.includes(flags.stage)) fail(`--stage must be one of ${STAGES.join(', ')}`);
let dir;
try {
  dir = workspaceDir(domain);
} catch (error) {
  fail(error.message);
}
const run = readJson(join(dir, 'run-log.json'), {}).run;
if (!run?.id || !run.started_at) fail('no run started; run-log.mjs run-start comes first');
const since = Date.parse(run.started_at);
const logged = new Set(
  (existsSync(join(dir, 'events.jsonl')) ? readFileSync(join(dir, 'events.jsonl'), 'utf8').split('\n') : [])
    .map((line) => { try { return JSON.parse(line); } catch { return null; } })
    .filter((e) => e?.type === 'issue' && e.run === run.id)
    .map((e) => LOGGED_ID.exec(e.symptom ?? '')?.[1])
    .filter(Boolean),
);

const checks = join(dir, 'checks');
// A round whose answer was written before this run started belongs to an earlier build of the domain.
// Rounds count from 1 on every build, and overwriting a file leaves its folder's mtime alone, so the
// answer's own mtime decides; the folder's only when the round has no answer.
const stamp = (round) => {
  const answer = join(checks, round, 'answer.txt');
  return statSync(existsSync(answer) ? answer : join(checks, round)).mtimeMs;
};
const rounds = (existsSync(checks) ? readdirSync(checks) : [])
  .filter((d) => /^\d+$/.test(d) && stamp(d) >= since - 1000)
  .map(Number)
  .sort((a, b) => a - b);
const findings = new Map();
const problems = [];
for (const round of rounds) {
  const file = join(checks, String(round), 'answer.txt');
  if (!existsSync(file)) {
    problems.push(`round ${round}: no answer.txt`);
    continue;
  }
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line.trim()) continue;
    const f = fields(line);
    const kind = f[1]?.toLowerCase();
    if (/^no findings\.?$/i.test(f[0])) continue;
    if (/^can't check/i.test(f[0])) {
      console.error(`round ${round}: ${line.trim()}`);
      continue;
    }
    if (/^\d+\.\d+$/.test(f[0]) && SEVERITY[kind] && f.length >= 7) {
      const [id, , routes, widths] = f;
      if (id.split('.')[0] !== String(round) || findings.has(id)) {
        problems.push(`round ${round}: id ${id} isn't a new ${round}.<n> id: ${line.trim()}`);
        continue;
      }
      // What's wrong may hold a |, so the rule and the path are counted from the end.
      const [rule, where] = f.slice(-2);
      const wrong = f.slice(4, -2).join(' | ');
      const place = routes === '-' ? where : `${routes} at ${widths}`;
      findings.set(id, { id, kind, symptom: `visual check: ${place}: ${wrong} (${id})`, cause: rule, resolved: false });
    } else if (/^(fixed|open)$/i.test(f[0])) {
      const finding = findings.get(f[1]);
      if (finding) finding.resolved = f[0].toLowerCase() === 'fixed';
      else if (!logged.has(f[1])) problems.push(`round ${round}: ${f[0]} for unknown id ${f[1]}: ${line.trim()}`);
    } else {
      problems.push(`round ${round}: not in the answer format: ${line.trim()}`);
    }
  }
}

const fresh = [...findings.values()].filter((f) => !logged.has(f.id));
for (const f of fresh) {
  process.stdout.write(`${JSON.stringify({ stage: flags.stage, symptom: f.symptom, cause: f.cause, severity: SEVERITY[f.kind], resolved: f.resolved })}\n`);
}
const open = fresh.filter((f) => !f.resolved);
console.error(`${fresh.length} findings to log, ${open.length} unresolved${open.map((f) => `\nunresolved ${f.symptom}`).join('')}`);
if (open.length) console.error('List each unresolved finding under *Gaps / follow-ups* in the final report, with why it wasn\'t fixed.');
if (problems.length) {
  console.error(`${problems.join('\n')}\nFix these lines in answer.txt to the answer format, as the subagent answered, and run the command again: findings already logged aren't logged twice.`);
  process.exit(1);
}
