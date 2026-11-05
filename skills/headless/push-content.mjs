#!/usr/bin/env node
// Hostinger Headless content push: creates a WordPress site's content from one JSON file in a single
// command, instead of one agent call per category, image, page, post and product.
//
//   node push-content.mjs <domain>   # reads ~/.hostinger/<domain>/site.json and content.json
//
// It mints the installation token through the local Hostinger MCP server (it never prints or writes
// it), opens the site's WP MCP, and creates the site title, categories, tags, images, pages, posts, the
// menu, Yoast fields and the WooCommerce catalog. Every create looks the item up first, so a re-run
// reuses what exists. Then it reads the result back over public wp/v2 and the Store API, and writes the
// created-id map into content-model.md.
//
// Progress goes to stderr; stdout is one JSON line. Exit 0 when everything was pushed and verified;
// 1 when the call, the files or some items need fixing (the JSON names what; fix it and re-run); 2 when
// it couldn't reach the site (`fallback` names the by-hand recipe).

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { connect } from './hostinger-mcp.mjs';
import { listOf, openSite } from './wp-mcp.mjs';

const FALLBACK = 'steps/04-content-model/wordpress/by-hand.md';
const log = (message) => process.stderr.write(`push-content: ${message}\n`);
let localMcp = null;
const finish = (code, result) => {
  localMcp?.close();
  process.stdout.write(`${JSON.stringify(result)}\n`);
  process.exit(code);
};

// ── the content file ───────────────────────────────────────────────────────────────────────────────

const IMAGE_KEYS = ['url', 'alt', 'title', 'filename', 'caption', 'description'];
const SEO_KEYS = ['title', 'description', 'focus_keyword'];
const SHAPES = {
  top: { keys: ['site', 'categories', 'tags', 'pages', 'posts', 'menu', 'store'] },
  site: { keys: ['title', 'description'] },
  term: { keys: ['name', 'slug', 'description', 'parent'], required: ['name', 'slug'] },
  page: { keys: ['slug', 'title', 'content', 'excerpt', 'parent', 'menu_order', 'image', 'seo'], required: ['slug', 'title', 'content'] },
  post: { keys: ['slug', 'title', 'content', 'excerpt', 'categories', 'tags', 'image', 'seo'], required: ['slug', 'title', 'content'] },
  menu: { keys: ['name', 'slug', 'items'], required: ['name', 'items'] },
  menuItem: { keys: ['title', 'page', 'url'], required: ['title'] },
  store: { keys: ['categories', 'products', 'coupons'] },
  // Products take any other WooCommerce product field (stock_quantity, attributes, …) as given.
  product: { required: ['sku', 'name', 'price'] },
  coupon: { keys: ['code', 'discount_type', 'amount', 'description', 'minimum_amount', 'usage_limit', 'date_expires', 'free_shipping'], required: ['code', 'discount_type', 'amount'] },
};

// Returns every problem with the file at once, so one fix-and-rerun covers them all.
function validate(content) {
  const problems = [];
  const shape = (value, kind, where) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return problems.push(`${where}: should be an object`) && false;
    const { keys, required = [] } = SHAPES[kind];
    for (const k of required) if (value[k] === undefined || value[k] === '') problems.push(`${where}.${k}: missing`);
    if (keys) for (const k of Object.keys(value)) if (!keys.includes(k)) problems.push(`${where}.${k}: unknown field (allowed: ${keys.join(', ')})`);
    return true;
  };
  const list = (value, where) => {
    if (value === undefined) return [];
    if (Array.isArray(value)) return value;
    problems.push(`${where}: should be an array`);
    return [];
  };
  const subset = (value, allowed, where) => {
    if (value === undefined) return;
    if (!value || typeof value !== 'object') return problems.push(`${where}: should be an object`);
    for (const k of Object.keys(value)) if (!allowed.includes(k)) problems.push(`${where}.${k}: unknown field (allowed: ${allowed.join(', ')})`);
  };
  const image = (value, where) => {
    if (value === undefined) return;
    subset(value, IMAGE_KEYS, where);
    if (!/^https:\/\//.test(value?.url ?? '')) problems.push(`${where}.url: should be a direct https file URL`);
    if (!value?.alt) problems.push(`${where}.alt: missing`);
  };
  const refs = (value, known, where) => {
    for (const slug of list(value, where)) if (!known.has(slug)) problems.push(`${where}: "${slug}" is not a slug defined in the file`);
  };
  const unique = (items, key, where) => {
    const seen = new Set();
    for (const item of items) {
      if (seen.has(item?.[key])) problems.push(`${where}: ${key} "${item[key]}" appears twice`);
      seen.add(item?.[key]);
    }
    return seen;
  };
  // Lookups match the slug WordPress stores (sanitize_title: lower case, non-ASCII percent-encoded), so a
  // slug in any other form would never match on a re-run and be created again as <slug>-2.
  const slugForm = (slug, where) => {
    if (typeof slug === 'string' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) problems.push(`${where}.slug: use lower-case ASCII letters, digits and dashes, like "about-us"`);
  };
  const slugList = (items, where) => {
    items.forEach((item, i) => slugForm(item?.slug, `${where}[${i}]`));
    return unique(items, 'slug', where);
  };
  // The push creates items in file order, so a parent must come before its child.
  const parentsFirst = (items, where) => items.forEach((item, i) => {
    if (item?.parent === undefined) return;
    if (!items.slice(0, i).some((earlier) => earlier?.slug === item.parent)) problems.push(`${where}[${i}].parent: "${item.parent}" should be a slug listed earlier in ${where}`);
  });

  if (!shape(content, 'top', 'content')) return problems;
  if (content.site !== undefined) shape(content.site, 'site', 'site');
  const categories = list(content.categories, 'categories');
  const tags = list(content.tags, 'tags');
  const pages = list(content.pages, 'pages');
  const posts = list(content.posts, 'posts');
  categories.forEach((t, i) => shape(t, 'term', `categories[${i}]`));
  tags.forEach((t, i) => shape(t, 'term', `tags[${i}]`));
  const categorySlugs = slugList(categories, 'categories');
  const tagSlugs = slugList(tags, 'tags');
  const pageSlugs = slugList(pages, 'pages');
  slugList(posts, 'posts');
  parentsFirst(categories, 'categories');
  parentsFirst(pages, 'pages');
  for (const [kind, items] of [['page', pages], ['post', posts]]) {
    items.forEach((item, i) => {
      const where = `${kind}s[${i}]`;
      if (!shape(item, kind, where)) return;
      image(item.image, `${where}.image`);
      subset(item.seo, SEO_KEYS, `${where}.seo`);
      refs(item.categories, categorySlugs, `${where}.categories`);
      refs(item.tags, tagSlugs, `${where}.tags`);
    });
  }
  if (content.menu !== undefined && shape(content.menu, 'menu', 'menu')) {
    slugForm(content.menu.slug, 'menu');
    list(content.menu.items, 'menu.items').forEach((item, i) => {
      const where = `menu.items[${i}]`;
      if (!shape(item, 'menuItem', where)) return;
      if (!item.page === !item.url) problems.push(`${where}: give exactly one of page (a page slug) or url`);
      if (item.page) refs([item.page], pageSlugs, `${where}.page`);
    });
  }
  if (content.store !== undefined && shape(content.store, 'store', 'store')) {
    const storeCategories = list(content.store.categories, 'store.categories');
    const products = list(content.store.products, 'store.products');
    const coupons = list(content.store.coupons, 'store.coupons');
    storeCategories.forEach((t, i) => shape(t, 'term', `store.categories[${i}]`));
    const storeCategorySlugs = slugList(storeCategories, 'store.categories');
    parentsFirst(storeCategories, 'store.categories');
    products.forEach((p, i) => {
      const where = `store.products[${i}]`;
      if (!shape(p, 'product', where)) return;
      if (!/^\d+(\.\d+)?$/.test(String(p.price))) problems.push(`${where}.price: should be a decimal in major units, like "12.50"`);
      image(p.image, `${where}.image`);
      refs(p.categories, storeCategorySlugs, `${where}.categories`);
    });
    unique(products, 'sku', 'store.products');
    coupons.forEach((c, i) => {
      const where = `store.coupons[${i}]`;
      if (!shape(c, 'coupon', where)) return;
      if (!['percent', 'fixed_cart', 'fixed_product'].includes(c.discount_type)) problems.push(`${where}.discount_type: should be percent, fixed_cart or fixed_product`);
    });
  }
  // A re-run finds an earlier upload by its title, so two different images can't share one.
  const imageUrls = new Map();
  for (const [where, items] of [['pages', pages], ['posts', posts], ['store.products', Array.isArray(content.store?.products) ? content.store.products : []]]) {
    items.forEach((item, i) => {
      const img = item?.image;
      if (!img?.url) return;
      const title = img.title ?? img.alt;
      if (imageUrls.has(title) && imageUrls.get(title) !== img.url) problems.push(`${where}[${i}].image: title "${title}" is already used by another image; give each image its own title`);
      imageUrls.set(title, img.url);
    });
  }
  return problems;
}

// ── the push ───────────────────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
if (args.length !== 1 || args[0].startsWith('-')) finish(1, { ok: false, error: 'usage: push-content.mjs <domain>' });
const [domain] = args;
const workspace = path.join(homedir(), '.hostinger', domain);
function readJson(file) {
  const full = path.join(workspace, file);
  if (!existsSync(full)) finish(1, { ok: false, error: `no ${file} at ${full}` });
  try {
    return JSON.parse(readFileSync(full, 'utf8'));
  } catch (e) {
    return finish(1, { ok: false, invalid: [`${file}: ${e.message}`] });
  }
}
const site = readJson('site.json');
const content = readJson('content.json');
const problems = validate(content);
if (problems.length) finish(1, { ok: false, invalid: problems });
const username = site.username;
const software = site.wordpress?.install_id;
if (!username || !software) finish(1, { ok: false, error: 'site.json has no username or wordpress.install_id' });
const restApi = site.urls?.rest_api ?? `https://${domain}/cms/wp-json/wp/v2`;
const storeApi = site.urls?.store_api ?? `https://${domain}/cms/wp-json/wc/store/v1`;
const store = content.store;

localMcp = connect('headless-push-content');
const mint = async () => {
  const { data, error } = await localMcp.execute('wordpress_installations_jwt-token', { username, software });
  if (error || !data?.token) throw new Error(`couldn't mint the installation token: ${error ?? 'no token in the reply'}`);
  return { token: data.token, url: data.mcp_url ?? site.urls?.wp_mcp };
};
const wp = await openSite(mint).catch((e) => finish(2, { ok: false, error: `couldn't open the site's WP MCP: ${e.message}`, fallback: FALLBACK }));

// The abilities each part of the file needs, checked before anything is written.
const NEEDS = [
  [true, ['posts-search', 'posts-delete', 'pages-search', 'pages-delete']],
  [content.site, ['wp-settings-update']],
  [content.categories?.length, ['categories-list', 'categories-create']],
  [content.tags?.length, ['tags-list', 'tags-create']],
  [content.pages?.length, ['pages-create', 'pages-update']],
  [content.posts?.length, ['posts-create', 'posts-update']],
  [[...(content.pages ?? []), ...(content.posts ?? []), ...(store?.products ?? [])].some((i) => i.image), ['media-search', 'media-upload-from-url']],
  [content.menu, ['menus-search', 'menus-create', 'menu-items-search', 'menu-items-create']],
  [store?.categories?.length, ['wc-product-categories-list', 'wc-product-categories-create']],
  [store?.products?.length, ['wc-products-search', 'wc-products-create', 'wc-products-update']],
  [store?.coupons?.length, ['wc-coupons-search', 'wc-coupons-create']],
];
const missing = NEEDS.filter(([wanted]) => wanted).flatMap(([, abilities]) => abilities).filter((a) => !wp.has(a));
if (missing.length) finish(2, { ok: false, error: `the site's MCP lacks ${missing.join(', ')}`, fallback: FALLBACK });

const ids = { categories: {}, tags: {}, media: {}, pages: {}, posts: {}, menu: null, product_categories: {}, products: {}, coupons: {} };
const counts = {};
const failed = [];
const warnings = [];
const media = []; // { id, image, owner: { kind, slug } }
const tally = (kind, verb) => {
  counts[kind] ??= {};
  counts[kind][verb] = (counts[kind][verb] ?? 0) + 1;
};
const failure = (item, error) => {
  log(`${item}: FAILED ${error}`);
  failed.push({ item, error });
  return null;
};
const asRaw = (text) => (text === undefined ? undefined : { raw: String(text) });
const defined = (object) => Object.fromEntries(Object.entries(object).filter(([, v]) => v !== undefined));
const imageTitle = (image) => image.title ?? image.alt;
// WordPress stores and renders titles escaped and texturized (& → &#038;, ' → ’), so titles are compared
// on their letters and digits only.
const titleKey = (title) => String(title ?? '').replace(/&#?\w+;/g, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
const sameTitle = (a, b) => titleKey(a) === titleKey(b);
const mediaName = (image) => image.filename ?? imageTitle(image);
const parentOf = (item, known) => (item.parent === undefined ? undefined : known[item.parent]);

// Looks an item up and reuses a hit, else creates it. `key` is "<kind>/<slug>"; returns the id or null.
async function ensure(key, { find, match, create }) {
  const kind = key.split('/')[0];
  const found = await wp.run(...find);
  if (found.error) return failure(key, `lookup: ${found.error}`);
  const hit = listOf(found.data).find(match);
  if (hit) {
    tally(kind, 'reused');
    return hit.id;
  }
  const created = await wp.run(...create);
  if (!created.id) return failure(key, created.error ?? 'no id in the reply');
  tally(kind, created.error ? 'reused' : 'created'); // term_exists names the existing id
  log(`${key} → ${created.id}`);
  return created.id;
}

// Looks an item up, then updates the hit or creates it; write(hit) returns the [ability, params] call.
async function upsert(key, { find, match, write }) {
  const kind = key.split('/')[0];
  const found = await wp.run(...find);
  if (found.error) return failure(key, `lookup: ${found.error}`);
  const hit = listOf(found.data).find(match);
  const result = await wp.run(...(await write(hit)));
  const id = hit?.id ?? result.id;
  if (result.error || !id) return failure(key, result.error ?? 'no id in the reply');
  tally(kind, hit ? 'updated' : 'created');
  log(`${key} → ${id}`);
  return id;
}

// Images. An owner that already has an image keeps it. Otherwise an earlier upload is found by its exact
// title (media-search matches titles, not filenames), and only then is the URL uploaded, once per URL.
const uploads = new Map();
async function imageFor(image, existing, owner) {
  if (!image) return existing || undefined;
  const key = `media/${mediaName(image)}`;
  let id = existing || uploads.get(image.url);
  if (!id) {
    const title = imageTitle(image);
    const found = await wp.run('media-search', { search: title, per_page: 20 });
    if (found.error) return failure(key, `lookup: ${found.error}`) ?? undefined;
    id = listOf(found.data).find((r) => sameTitle(r.post_title ?? r.title?.rendered ?? r.title, title));
    id = id?.ID ?? id?.id;
    if (id) tally('media', 'reused');
    else {
      const created = await wp.run('media-upload-from-url', defined({
        url: image.url, filename: image.filename, title, alt_text: image.alt, caption: image.caption, description: image.description,
      }));
      if (!created.id) return failure(key, created.error ?? 'no id in the reply') ?? undefined;
      id = created.id;
      tally('media', 'created');
      log(`${key} → ${id}`);
    }
    uploads.set(image.url, id);
  }
  ids.media[mediaName(image)] = id;
  media.push({ id, image, owner });
  return id;
}

// 1. Site title and tagline.
if (content.site) {
  const { error } = await wp.run('wp-settings-update', defined({ title: content.site.title, description: content.site.description }));
  if (error) failure('site', error);
  else tally('site', 'updated');
}

// 2. WordPress's sample post and page, unless the file reuses their slugs.
for (const [kind, slug] of [['posts', 'hello-world'], ['pages', 'sample-page']]) {
  if (content[kind]?.some((item) => item.slug === slug)) continue;
  const found = await wp.run(`${kind}-search`, { slug: [slug] });
  for (const row of listOf(found.data)) {
    const { error } = await wp.run(`${kind}-delete`, { id: row.id });
    if (error) failure(`${kind}/${slug}`, `delete: ${error}`);
    else tally(`sample_${kind}`, 'deleted');
  }
}

// 3. Terms, by slug.
for (const [kind, prefix] of [['categories', 'categories'], ['tags', 'tags'], ['product_categories', 'wc-product-categories']]) {
  const terms = kind === 'product_categories' ? store?.categories : content[kind];
  for (const item of terms ?? []) {
    // The wp/v2 term lists take an array of slugs; WooCommerce's takes one.
    const slug = kind === 'product_categories' ? item.slug : [item.slug];
    const id = await ensure(`${kind}/${item.slug}`, {
      find: [`${prefix}-list`, { slug, hide_empty: false }],
      match: (r) => r.slug === item.slug,
      create: [`${prefix}-create`, defined({ name: item.name, slug: item.slug, description: item.description, parent: parentOf(item, ids[kind]) })],
    });
    if (id) ids[kind][item.slug] = id;
  }
}

// 4. Pages, then posts, by slug; an existing one is updated to match the file.
for (const kind of ['pages', 'posts']) {
  for (const item of content[kind] ?? []) {
    const key = `${kind}/${item.slug}`;
    const id = await upsert(key, {
      find: [`${kind}-search`, { slug: [item.slug] }],
      match: (r) => r.slug === item.slug,
      write: async (hit) => {
        const fields = defined({
          title: asRaw(item.title), content: asRaw(item.content), excerpt: asRaw(item.excerpt),
          featured_media: await imageFor(item.image, hit?.featured_media, { kind, slug: item.slug }),
          parent: parentOf(item, ids.pages), menu_order: item.menu_order,
          categories: item.categories?.map((s) => ids.categories[s]).filter(Boolean),
          tags: item.tags?.map((s) => ids.tags[s]).filter(Boolean),
        });
        return hit ? [`${kind}-update`, { id: hit.id, ...fields }] : [`${kind}-create`, { slug: item.slug, status: 'publish', ...fields }];
      },
    });
    if (id) ids[kind][item.slug] = id;
  }
}

// 5. The menu (owners edit it in wp-admin; the frontend reads nav from content-model.md). Items are
// matched by title, so a re-run adds only the missing ones.
if (content.menu) {
  const slug = content.menu.slug ?? content.menu.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const menuId = await ensure(`menu/${slug}`, {
    find: ['menus-search', { slug: [slug] }],
    match: (r) => r.slug === slug,
    create: ['menus-create', { name: content.menu.name, slug }],
  });
  if (menuId) {
    ids.menu = { slug, id: menuId, items: {} };
    const existing = await wp.run('menu-items-search', { menus: [menuId], per_page: 100 });
    const byTitle = new Map(listOf(existing.data).map((r) => [r.title?.raw ?? r.title?.rendered ?? r.title, r.id]));
    for (const [i, item] of content.menu.items.entries()) {
      if (byTitle.has(item.title)) {
        ids.menu.items[item.title] = byTitle.get(item.title);
        tally('menu_items', 'reused');
        continue;
      }
      const target = item.page ? { type: 'post_type', object: 'page', object_id: ids.pages[item.page] } : { type: 'custom', url: item.url };
      if (item.page && !target.object_id) {
        failure(`menu/${item.title}`, `page ${item.page} wasn't created`);
        continue;
      }
      const created = await wp.run('menu-items-create', { title: { raw: item.title }, status: 'publish', menus: menuId, menu_order: i + 1, ...target });
      if (!created.id) failure(`menu/${item.title}`, created.error ?? 'no id in the reply');
      else {
        ids.menu.items[item.title] = created.id;
        tally('menu_items', 'created');
      }
    }
  }
}

// 6. Yoast fields, 50 items a call. SEO never fails the push: a miss is a warning.
const seoItems = ['pages', 'posts'].flatMap((kind) => (content[kind] ?? []).map((p) => [ids[kind][p.slug], p.seo])).filter(([id, seo]) => id && seo);
if (seoItems.length && site.seo?.enabled === false) warnings.push('seo: site.json says SEO is off, so the seo fields were skipped');
else if (seoItems.length && !wp.has('seo-bulk-update')) warnings.push('seo: the site has no seo-bulk-update ability, so the seo fields were skipped');
else {
  for (let i = 0; i < seoItems.length; i += 50) {
    const posts = seoItems.slice(i, i + 50).map(([id, seo]) => defined({ id, seo_title: seo.title, meta_description: seo.description, focus_keyword: seo.focus_keyword }));
    const { error } = await wp.run('seo-bulk-update', { posts });
    if (error) warnings.push(`seo: ${error}`);
    else counts.seo = { updated: (counts.seo?.updated ?? 0) + posts.length };
  }
}

// 7. Products by SKU (updated to match the file), coupons by code.
for (const product of store?.products ?? []) {
  const { sku, name, price, image, categories, ...rest } = product;
  const id = await upsert(`products/${sku}`, {
    find: ['wc-products-search', { sku }],
    match: (r) => r.sku === sku,
    write: async (hit) => {
      const imageId = await imageFor(image, hit?.images?.[0]?.id, { kind: 'products', slug: sku });
      const fields = defined({
        name, type: 'simple', status: 'publish', regular_price: String(price), ...rest,
        categories: categories?.map((s) => ids.product_categories[s]).filter(Boolean).map((c) => ({ id: c })),
        images: imageId && !hit?.images?.length ? [{ id: imageId }] : undefined,
      });
      return hit ? ['wc-products-update', { id: hit.id, ...fields }] : ['wc-products-create', { sku, ...fields }];
    },
  });
  if (id) ids.products[sku] = id;
}
for (const coupon of store?.coupons ?? []) {
  const code = coupon.code.toLowerCase(); // WooCommerce stores codes in lower case
  const id = await ensure(`coupons/${code}`, {
    find: ['wc-coupons-search', { code }],
    match: (r) => r.code?.toLowerCase() === code,
    create: ['wc-coupons-create', { ...coupon, amount: String(coupon.amount) }],
  });
  if (id) ids.coupons[code] = id;
}

// 8. Read it back over the public APIs: each planned slug and SKU exactly once, featured images set,
// and one image per title (a second one is a duplicate upload).
async function getAll(base, query) {
  const all = [];
  for (let page = 1; page <= 20; page += 1) {
    try {
      const response = await fetch(`${base}?${query}&per_page=100&page=${page}&_=${Date.now()}`, { signal: AbortSignal.timeout(30_000) });
      if (!response.ok) return { error: `GET ${base} answered ${response.status}` };
      all.push(...(await response.json()));
      if (page >= Number(response.headers.get('x-wp-totalpages') ?? 1)) break;
    } catch (e) {
      return { error: `GET ${base}: ${e.message}` };
    }
  }
  return { all };
}
const verify = {};
// Runs one read-back: check(all) returns the problems found ({} when none).
async function verifyEach(what, planned, url, query, check) {
  if (!planned) return;
  const { all, error } = await getAll(url, query);
  const issues = error ?? defined(Object.fromEntries(Object.entries(check(all)).map(([k, v]) => [k, v.length ? v : undefined])));
  if (typeof issues === 'string' || Object.keys(issues).length) {
    verify[what] = issues;
    failure(`verify/${what}`, issues);
  } else verify[what] = `${planned} ok`;
}
for (const kind of ['pages', 'posts']) {
  const planned = content[kind] ?? [];
  await verifyEach(kind, planned.length, `${restApi}/${kind}`, '_fields=id,slug,featured_media', (all) => ({
    missing: planned.filter((p) => !all.some((r) => r.slug === p.slug)).map((p) => p.slug),
    duplicates: all.filter((r) => planned.some((p) => new RegExp(`^${p.slug}-\\d+$`).test(r.slug))).map((r) => r.slug),
    no_featured_image: planned.filter((p) => p.image && !all.find((r) => r.slug === p.slug)?.featured_media).map((p) => p.slug),
  }));
}
const titles = new Set(media.map((m) => imageTitle(m.image)));
await verifyEach('media', titles.size, `${restApi}/media`, '_fields=id,title', (all) => ({
  duplicates: [...titles].filter((t) => all.filter((r) => sameTitle(r.title?.rendered, t)).length > 1),
}));
await verifyEach('products', store?.products?.length, `${storeApi}/products`, 'status=publish', (all) => ({
  missing_or_duplicated: store.products.filter((p) => all.filter((r) => r.sku === p.sku).length !== 1).map((p) => p.sku),
  no_image: store.products.filter((p) => p.image && !all.find((r) => r.sku === p.sku)?.images?.length).map((p) => p.sku),
}));
await verifyEach('product_categories', store?.categories?.length, `${storeApi}/products/categories`, '', (all) => ({
  missing: store.categories.filter((c) => !all.some((r) => r.slug === c.slug)).map((c) => c.slug),
}));

// 9. The id map, into content-model.md (its own sections, replaced on a re-run).
const cell = (text) => String(text ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const featured = (kind, slug) => media.find((m) => m.owner.kind === kind && m.owner.slug === slug)?.id;
const mediaRow = (m) => ['media', cell(mediaName(m.image)), m.id, cell(`on ${m.owner.kind}/${m.owner.slug}${m.image.caption ? `; ${m.image.caption}` : ''}`)];
const SECTIONS = [
  ['Created in WordPress', [
    ...Object.entries(ids.categories).map(([s, id]) => ['category', s, id, '']),
    ...Object.entries(ids.tags).map(([s, id]) => ['tag', s, id, '']),
    ...['pages', 'posts'].flatMap((kind) => Object.entries(ids[kind]).map(([s, id]) => [kind.slice(0, -1), s, id, featured(kind, s) ? `featured image ${featured(kind, s)}` : ''])),
    ...(ids.menu ? [['menu', ids.menu.slug, ids.menu.id, `${Object.keys(ids.menu.items).length} items`]] : []),
    ...media.filter((m) => m.owner.kind !== 'products').map(mediaRow),
  ]],
  ['Created in WooCommerce', [
    ...Object.entries(ids.product_categories).map(([s, id]) => ['product category', s, id, '']),
    ...Object.entries(ids.products).map(([s, id]) => ['product', s, id, featured('products', s) ? `image ${featured('products', s)}` : '']),
    ...media.filter((m) => m.owner.kind === 'products').map(mediaRow),
    ...Object.entries(ids.coupons).map(([c, id]) => ['coupon', c, id, '']),
  ]],
];
const modelPath = path.join(workspace, 'content-model.md');
try {
  let model = existsSync(modelPath) ? readFileSync(modelPath, 'utf8') : `# Content — ${domain}\n`;
  for (const [title, rows] of SECTIONS) {
    const text = rows.length
      ? `## ${title}\n\n> Written by push-content.mjs on ${new Date().toISOString()}. A re-run reuses these.\n\n| Kind | Key | ID | Notes |\n|---|---|---|---|\n${rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}\n`
      : '';
    const at = model.search(new RegExp(`^## ${title}\\s*$`, 'm'));
    if (at >= 0) {
      const next = model.slice(at + 3).search(/^## /m);
      model = model.slice(0, at) + text + (next >= 0 ? `\n${model.slice(at + 3 + next)}` : '');
    } else if (text) model = `${model.trimEnd()}\n\n${text}`;
  }
  writeFileSync(modelPath, model);
} catch (e) {
  warnings.push(`content-model.md: ${e.message}`);
}

finish(failed.length ? 1 : 0, defined({
  ok: failed.length === 0,
  domain,
  counts,
  verify,
  failed: failed.length ? failed : undefined,
  warnings: warnings.length ? warnings : undefined,
  ids,
  content_model: modelPath,
}));
