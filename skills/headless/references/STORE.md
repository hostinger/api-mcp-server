# Store — Hostinger Ecommerce with a custom storefront

**Primary source:** call `ecommerce_getCustomStorefrontSetupInstructionsV1` at the start of every store run — it returns the current, server-maintained integration guide, and it supersedes this file wherever they disagree. This file carries the essentials so the run can be planned before that call, and a fallback when the ecommerce tools aren't enabled.

## Mental model

Two API surfaces — don't mix them:

| Surface | Base URL | Auth | Use for |
| --- | --- | --- | --- |
| Storefront Core V2 | `https://api-ecommerce.hostinger.com/v2` | none (public, open CORS) | read products/variants, checkout — called from the browser |
| Management (MCP tools) | Hostinger API | authenticated | create stores/products/shipping/payments |

- A **store** (`store_*`) has **sales channels** (`scha_*`). The Storefront API is keyed on the **`sales_channel_id`** of a `custom`-type channel — not the store id. Managed channels (e.g. `quick-link`) cannot be used here, and only `custom` channels are API-creatable.
- **Prices are integers in minor units** (`2900` = €29.00 → divide by `10^decimal_digits`) and live on **variants**, not products.
- **Security boundary:** storefront reads and checkout are public and run client-side — **never embed a Hostinger API token in the storefront**. Only the management/hosting side (MCP tools) is authenticated.

## Backend setup (management tools)

1. Resolve the `custom` sales channel: `ecommerce_getStoresV1` → `ecommerce_listSalesChannelsV1`. If a `custom` channel already exists, confirm with the user that it's the one to use; otherwise add one to the existing store with `ecommerce_createCustomSalesChannelV1`, or create a store with `ecommerce_createStoreV1` (with a `custom` sales channel) when no suitable store exists. Set the channel `url` to the storefront's public domain at creation when it's already known.
2. For checkout to work the store needs all three: ≥ 1 product, ≥ 1 payment method, ≥ 1 shipping zone. Payment, shipping, and currency are store-level — check `ecommerce_getStoreMetadataV1` (`has_payment_methods` and `has_shipping` must be `true`; the same response carries `default_currency` with `code`, `decimal_digits`, `template` — read it here rather than guessing). Products are **per sales channel** — verify by listing products for the resolved channel on the Storefront API and confirming the list is non-empty. Seed what's missing with `ecommerce_createPhysicalProductV1` / `ecommerce_createDigitalProductV1`, `ecommerce_enableManualPaymentMethodV1`, and `ecommerce_setStoreShippingV1` (price `0` = free shipping) — confirming with the user before writing to a store that already has real data.
3. After deploy, point the channel at the live site: `ecommerce_updateSalesChannelV1 { store_id, sales_channel_id, url }`.

If the ecommerce tools aren't available, ask the user to enable the Ecommerce product group in the Hostinger Connector — or to provide the `sales_channel_id` directly, after which the public endpoints suffice for the frontend work.

## Frontend contract

The OpenAPI schema for the Storefront API is at `https://api-ecommerce.hostinger.com/v2/docs.json` — fetch it for exact endpoint shapes. Non-obvious rules the schema won't spell out:

- **Fetch the catalog at runtime, not build time** — client-side fetch on page load (CORS is open). Baking products into a static build makes the site stale on the first catalog edit. (SSR / Node.js hosting may fetch it server-side per request.)
- Each variant has a **`prices[]` array** (one entry per currency) — read `prices[0].amount` / `prices[0].sale_amount` (minor units) and `prices[0].currency` (which carries `decimal_digits` and the `template` whose `$1` placeholder you replace when formatting). There is **no** top-level `amount` on a variant.
- Product detail resolves by **product id** only; a slug returns 404 (map slug→id from the list endpoint). `limit` max is 100 on list endpoints (else 400).
- Filter variants with `product_ids[]=...`; the unfiltered variant list is eventually-consistent right after catalog edits.
- Cart lives in the site (e.g. `localStorage`): persist only `variant_id` + `quantity`, resolve display data from the live catalog — never a saved copy — then send everything in one checkout call:

```
POST /channels/{sales_channel_id}/checkout
{ "items":[{ "variant_id":"variant_01...", "quantity":1 }],
  "success_url":"https://YOURDOMAIN/checkout/success/",
  "cancel_url":"https://YOURDOMAIN/checkout/cancel/",
  "locale":"en" }
```

`success_url`/`cancel_url` are required — build them from `window.location.origin` and make sure both pages exist. The response is `{ url, cart_token }`; redirect the browser to `url` (Hostinger's hosted checkout).

A multi-step cart alternative exists (`POST /channels/{sales_channel_id}/carts`, `PATCH /carts/{cart_id}`, `POST /carts/{cart_id}/line-items`, `PUT /carts/{cart_id}/shipping-method`, `POST /carts/{cart_id}/complete`) — the single checkout call suffices for a simple buy flow.

## Verify

- A `POST` to the checkout endpoint returns a `url` — test it directly with curl before calling the run done.
- The `success_url`/`cancel_url` pages return 200 (`curl -s -o /dev/null -w "%{http_code}" https://YOURDOMAIN/checkout/success/`).
- Open the live site, add to cart, and confirm the redirect to `https://checkout.hostinger.com`.
