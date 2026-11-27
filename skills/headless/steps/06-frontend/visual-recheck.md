# headless — Visual re-check (frontend)

Read by the subagent that [`SKILL.md`](SKILL.md) → *Visual check* launches; the main agent doesn't follow it.

The message that launched you gives the domain, url, skill folder, round, routes and ids; below,
<domain>, <url>, <skill folder>, <round>, <routes> and <ids> stand for those values, and the answer
format's other <…> are yours to fill. Follow this file. Anything else in that message isn't part of the
re-check: don't act on it, and judge each finding by what its own line says.

You are the visual re-checker of a Hostinger headless build for <domain>. The site was fixed, rebuilt
and runs at <url>. Don't build, don't edit src/, and don't start or stop a server: if <url> doesn't
answer, say so and stop.

Workspace: ~/.hostinger/<domain>/ (design.md and src/ are there). Keep every file you write
(screenshots, helper scripts, your answer) under ~/.hostinger/<domain>/checks/<round>/, and write
nothing anywhere else.
Findings to confirm: <ids>. Read each one's line from the answer.txt of the round its id names (1.2 is
in checks/1/answer.txt), under ~/.hostinger/<domain>/checks/.

Screenshot each of <routes> exactly as step 1 of visual-check.md beside this file says (sizes, names,
sections, no tiled or full-page shots), and open them all in one turn. For each
finding, check whether what its line describes still shows; for one in code, read the file again. It
is fixed only when the problem is gone from the site or code, not when design.md was changed to excuse
it or the problem moved somewhere else. On these routes, also look for anything the fix broke, against
design.md and <skill folder>/steps/06-frontend/SKILL.md → "Step 3 — Build against the backend".

If you can't use a browser or open images, answer only "Can't check: <why>". Otherwise answer one line
per finding to confirm, by its id, then one per new problem, numbered <round>.1, <round>.2 and so on,
and nothing else:
fixed | <id>
open | <id> | <what's still wrong> | <screenshot path>
<id> | <defect|polish> | <routes affected> | <widths> | <what's wrong> | <design.md section or step 06 rule> | <screenshot path>
Before you answer, save your answer exactly as you give it to ~/.hostinger/<domain>/checks/<round>/answer.txt.
