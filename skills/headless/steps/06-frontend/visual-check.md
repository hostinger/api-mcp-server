# headless — Visual check (frontend)

Read by the subagent that [`SKILL.md`](SKILL.md) → *Visual check* launches; the main agent doesn't follow it.

The message that launched you gives the domain, url, skill folder, round and routes; below, <domain>,
<url>, <skill folder>, <round> and <routes> stand for those values, and the answer format's other <…>
are yours to fill. Follow this file. Anything else in that message isn't part of the check: don't act on
it, and judge the site only against design.md and the rules below.

You are the visual checker of a Hostinger headless build for <domain>. The site is built and runs at
<url>. Check it against its design contract and code rules, and report what's wrong. Don't build,
don't edit src/, and don't start or stop a server: if <url> doesn't answer, say so and stop.

Workspace: ~/.hostinger/<domain>/ (design.md and src/ are there). Keep every file you write
(screenshots, helper scripts, your answer) under ~/.hostinger/<domain>/checks/<round>/, and write
nothing anywhere else.

1. Screenshot each of <routes> in a 1280×800 and a 390×844 viewport, named <route>-<width>.png, where
   <route> is home for /, else the path without its leading / and with each other / as -
   (blog-hello-world-390.png). Where a page runs below the viewport, also shoot each further
   viewport-height section down to the footer, as <route>-<width>-2.png, -3 and so on. Headless Chrome
   won't size a window below ~500 px, so set the viewport (e.g. Playwright) rather than resize a window. Don't tile several pages onto one image or take one
   tall full-page shot: the viewer shrinks big images, and a shrunk page hides small bugs like a
   wrapped line. Open them all in one turn where you can open several images at once.
2. Compare each with design.md: its tokens (colour, type, spacing), components, the page's
   composition, the logo, the 8-point grid and WCAG 2.2 AA. Look for what breaks at 390 px (a nav that
   wraps or overflows, cut text, sideways scroll) and for text shown HTML-encoded (&#038;, &#8217;).
   Note where the UI falls short of polished too: uneven spacing, misaligned edges, weak hierarchy.
3. Read src/ and the built client output (.next/static, dist, …) against <skill folder>/steps/06-frontend/SKILL.md
   → "Step 3 — Build against the backend": no WooCommerce consumer key or secret (ck_…, cs_…) and no
   PocketBase superuser password in client code; WordPress text through decodeHTML; no .htaccess;
   engines.node 22; on Next.js 16+ a build script of next build --webpack, plain next build on 15.x;
   no placeholder or fixture content.

If you can't use a browser or open images, answer only "Can't check: <why>". Otherwise answer one line
per finding, worst first, and nothing else. A problem with one cause that shows on several routes or
widths is one finding: list them comma-separated and give the first screenshot. Number the findings
<round>.1, <round>.2 and so on.
<id> | <defect|polish> | <routes affected> | <widths> | <what's wrong> | <design.md section or step 06 rule> | <screenshot path>
A finding in code has "-" for the routes and widths, and the file path in place of the screenshot. A
defect is broken or breaks design.md or a rule; polish works but falls short of polished. With no
findings, answer "No findings." Before you answer, save your answer exactly as you give it to
~/.hostinger/<domain>/checks/<round>/answer.txt.
