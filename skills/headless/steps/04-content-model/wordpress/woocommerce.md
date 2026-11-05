# headless — WooCommerce cookbook (headless store on WordPress)

A companion recipe to `SKILL.md` (WordPress content model). Use it whenever the WordPress backend carries
a **WooCommerce store** (`site.json → woocommerce.enabled: true`) — a brief whose **Suggested backend** is
`**WordPress + WooCommerce**` (one site: content **and** commerce).

**WooCommerce is not a separate backend.** It is the `woocommerce` plugin on a normal headless WordPress
install at `/cms` (installed in the provision step). This cookbook is the authoritative home for the store
data layer: how to **seed and CRUD** products, categories and coupons, and how the **storefront** reads
the cart, coupons and checkout.

---

## 1 — The one rule: drive the store through the per-site WP MCP

There is **no seed plugin, no WP-CLI, and no REST consumer key in this flow**: catalog data goes through
the WP MCP. Instead, the **per-site WP MCP** (the Hostinger AI Assistant — the same JWT session the WordPress
content push uses, see `SKILL.md`) exposes **native WooCommerce abilities**. The push seeds the
catalog through them (§3); call them yourself only by hand or for work after the push.

Relevant abilities (names from `hostinger-ai-discover-abilities`; call `get-ability-info` for each schema
before use — they mirror the WooCommerce REST v3 shapes):

| Area | Abilities |
|---|---|
| Products | `wc-products-search` · `wc-products-get` · `wc-products-create` · `wc-products-update` · `wc-products-delete` |
| Categories / tags / brands | `wc-product-categories-{list,create,update,delete}` · `wc-product-tags-*` · `wc-product-brands-*` |
| Coupons | `wc-coupons-{search,get,create,update,delete,batch}` |
| Orders | `wc-orders-{search,get,create,update,delete}` |
| Reports | `wc-reports-{sales,orders-totals,products-totals,coupons-totals,…}` |
| Media | `media-upload-from-url` (product images — WordPress keeps its own copy) |

All run as the install's admin **inside the MCP session** — no consumer keys, no Basic Auth. This is
proven: a `wc-products-create` call makes a product that immediately appears on the public Store API.

---

## 2 — The storefront reads the public Store API

The **frontend** never touches the per-site MCP or any key. It reads the **public WooCommerce Store API**
at `site.json → urls.store_api` (`/cms/wp-json/wc/store/v1`) — public, open CORS, no auth for reads.
Pretty permalinks are on by default on a headless install, so the Store API resolves immediately.

| Store API call | Use |
|---|---|
| `GET /products?per_page=100` · `GET /products/<id>` · `?slug=<slug>` | catalog + product pages |
| `GET /products/categories` | category nav |
| `GET /cart` | current cart (seeds the `Cart-Token`) |
| `POST /cart/add-item` `{ id, quantity }` · `/cart/update-item` `{ key, quantity }` · `/cart/remove-item` `{ key }` | cart mutations |
| `POST /cart/apply-coupon` `{ code }` · `/cart/remove-coupon` `{ code }` | coupons on the cart |
| `POST /checkout` `{ billing_address, shipping_address, payment_method }` | place an order |

**Store API auth for writes** (cart/checkout): send the **`Nonce`** header (read it from the `Nonce` /
`X-WC-Store-API-Nonce` response header of a prior Store API GET and echo it back) **and** the
**`Cart-Token`** header (a JWT the Store API returns on the first cart response — resend it on every
cart call so a headless client keeps one cart; persist it in `localStorage`). Reads need neither.

**Pricing / minor units.** The Store API returns **integer-string** prices in minor units plus the
divisor: `prices.price` (e.g. `"1999"`) with `prices.currency_minor_unit` (e.g. `2`) and
`prices.currency_code`. Display value = `Number(price) / 10 ** currency_minor_unit`. **Pagination:**
`?page=&per_page=` (max 100), with `X-WP-Total` / `X-WP-TotalPages` headers.

---

## 3 — Seeding the catalog (content-model push)

The push seeds the catalog with the rest of the content: put product categories, products and coupons
under `store` in `content.json` and run `push-content.mjs` (`SKILL.md` Steps 1–2). It looks categories up
by slug, products by **SKU** and coupons by **code** before creating, so a re-run never duplicates; uploads
each product image once; checks every SKU and category over the Store API; and records the ids under
`## Created in WooCommerce` in `content-model.md`.

- `price` is a decimal string in **major units** (`"39.99"`); the Store API re-exposes it in minor units.
- Any other WooCommerce product field passes through as given (`sale_price`, `stock_quantity`,
  `attributes`, …). For a **variable product**, the push creates the parent; add its variations by hand
  through the product update / variations ability that discovery lists.
- Coupons: `discount_type` is `percent`, `fixed_cart` or `fixed_product`. WooCommerce stores codes in
  lower case.

---

## 4 — Checkout is owner-completed (the one gate)

A fresh WooCommerce install has **no payment gateway and no shipping zone enabled**, and **neither is
reachable from the headless tooling** — there is no payment/shipping MCP ability, and `wp-settings-update`
only writes standard WordPress settings (it ignores `woocommerce_*` options). So:

- **The catalog, product pages, client-side cart and coupon application all work headlessly.**
- **Checkout (`POST /checkout`) does not work until the owner enables a payment method + a shipping zone
  in wp-admin** (WooCommerce → Settings → Payments / Shipping; reach it via the one-click login in `steps/09-done/SKILL.md`).
  Cash on Delivery is the zero-config choice once enabled.
- Treat this exactly like the Hostinger Ecommerce `payment_enabled: false` gate: record
  `woocommerce.payment_enabled: false`, tell the user in one line that checkout needs that one setup step,
  and **never block the build on it**. The frontend renders a graceful disabled-checkout state and does not
  call `/checkout` while `payment_enabled` is `false`. Flip it to `true` only after the owner confirms a
  gateway is live. **Never ask the user for payment credentials.**

Store **currency** and **address** (`woocommerce_*` options) likewise aren't settable headlessly — they
follow the install default; the owner changes them in wp-admin if needed.

---

## 5 — REST API v3 (optional, owner-only — not used by this flow)

WooCommerce also exposes the authenticated **REST API v3** at `site.json → urls.wc_rest_api`
(`/cms/wp-json/wc/v3`) for external/server-side integrations. **This build never uses it** — seeding goes
through the per-site MCP and the storefront uses the public Store API. Document it for the owner only:

- **Auth:** `Authorization: Basic base64("<consumer_key>:<consumer_secret>")`, **HTTPS only**, server-side
  only — **never ship a key to the browser.**
- **Keys:** the owner generates a key pair in **wp-admin → WooCommerce → Settings → Advanced → REST API**
  (the agent cannot mint one headlessly). Store it in the owner's own environment, not in `site.json` or
  the repo.
- **Endpoints** (same shapes as the abilities above): `GET/POST/PUT/DELETE /products`, `/products/<id>/variations`,
  `/products/categories`, `/coupons`, `/orders`. Idempotency via `?sku=` / `?code=`. Pagination via
  `?page=&per_page=` + `X-WP-Total`.

---

## 6 — Idempotency & verification checklist

- **Idempotency keys:** products → SKU, coupons → code, categories → slug, images → skip when the product
  already has `images`. `push-content.mjs` applies them; follow them too when seeding by hand.
- **Checkout** is verified only when `payment_enabled` is `true`; while `false`, the catalog and cart over
  the Store API are the whole job.
