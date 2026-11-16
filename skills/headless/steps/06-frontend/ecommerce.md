# headless — Ecommerce storefront (frontend)

Read from [`SKILL.md`](SKILL.md) Step 3 when `site.json → backend` is `"ecommerce"`.

Ecommerce → the **public Hostinger Storefront Core V2 API** (`https://api-ecommerce.hostinger.com/v2`,
no auth, open CORS), keyed on the **custom sales channel** (`site.json → ecommerce.sales_channel.id`):
`GET /channels/<scha_*>/products` (prices are **minor units** on variants), `POST /channels/<scha_*>/checkout`
for buying. Cart is client-side; never embed a token. Read
`ecommerce_miscellaneous_custom-storefront-setup-instructions` for the authoritative, current guide.
- **Honour `site.json → ecommerce.payment_enabled`.** When it is `false` (free account / no paid
  Ecommerce plan — see the provision gate), there is **no checkout**: build the full catalog, product
  pages and the client-side cart as normal, but **do not call the checkout endpoint**. Instead render
  a clear, graceful state at the checkout step — e.g. a disabled "Checkout" button with a short note
  like "Online checkout isn't available on this plan yet" (and/or a contact/enquiry fallback). A
  missing checkout is **not** a build error here — never leave the storefront half-built, throw, or
  retry checkout because payment is off. When `payment_enabled` is `true`, wire checkout normally.
