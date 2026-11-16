# headless — Build mode "Bring your own frontend" (frontend)

Read from [`SKILL.md`](SKILL.md) when `brief.md` → **Build mode** is **Bring your own frontend** (any backend).

The user already has a
frontend (the project in the folder the command was run in) and this step **wires it to the backend
from `site.json` — it does not scaffold a new project and there is usually no `design.md` to
implement** (the design step deferred to the user). **Use their project as the source**: copy or
point `~/.hostinger/<domain>/src/` at it, keep its framework and UI, and collaborate on changes at
the user's direction (vibe-code with them). Your job is to connect it to the live backend (WordPress
`wp/v2` reads, the WooCommerce/Ecommerce Store API, env/keys) and make it deployable (set
`engines.node` to `22`, remove any `.htaccess`), then hand off to deploy. This generalises the Webapp
"existing app" case in `SKILL.md` to WordPress and Ecommerce too.
