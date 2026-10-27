// Hostinger Headless — logo kit (step 05-design).
//
// Primitives for building a designed logo as outlined SVG: the letters become vector paths, so the
// logo needs no web font and renders identically everywhere. The agent composes the design; this
// file only does the parts that are easy to get wrong.
//
// Workflow (from ~/.hostinger/<domain>/brand/, so packages and this kit sit next to the build):
//   cp <installed skill>/steps/05-design/logo-kit.mjs .
//   npm init -y && npm i opentype.js @resvg/resvg-js @fontsource/<display-family-slug>
//   node logo-build.mjs          // your script: import { … } from './logo-kit.mjs'
//                                // then read logo-preview.png
//   rm -rf node_modules          // package.json keeps the deps; a redesign runs `npm i` again
//
// Packages resolve from the current working directory, so run the build from brand/.

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const requireFromCwd = createRequire(join(process.cwd(), 'logo-build.js'));
const opentype = requireFromCwd('opentype.js');
// Optional: without resvg the kit still builds logos, it just can't measure what's drawn or render.
const Resvg = (() => {
  try {
    return requireFromCwd('@resvg/resvg-js').Resvg;
  } catch {
    return null;
  }
})();

// @fontsource splits each weight into unicode subsets; `latin` alone has no ą č ę ė į š ų ū ž,
// ő, ł, đ… so load every subset that exists and look each character up across them.
const SUBSETS = ['latin', 'latin-ext', 'vietnamese', 'cyrillic', 'cyrillic-ext', 'greek', 'greek-ext'];

function parseWoff(file) {
  const buf = readFileSync(file);
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}

/**
 * Load a static @fontsource weight (the static packages ship .woff, which opentype.js reads;
 * variable packages ship only .woff2, which it can't). The returned font is the `latin` subset
 * with `charToGlyph` widened to every other subset in the package, so accented letters resolve.
 * @param {string} slug  family slug, e.g. "unbounded"
 * @param {number} weight e.g. 900
 */
export function loadFont(slug, weight = 400, style = 'normal') {
  const fonts = [];
  for (const subset of SUBSETS) {
    let file;
    try {
      file = requireFromCwd.resolve(`@fontsource/${slug}/files/${slug}-${subset}-${weight}-${style}.woff`);
    } catch {
      continue;
    }
    fonts.push(parseWoff(file));
  }
  if (!fonts.length) throw new Error(`logo-kit: @fontsource/${slug} has no ${weight} ${style} .woff files`);
  const [primary] = fonts;
  const own = primary.charToGlyph.bind(primary);
  primary.charToGlyph = (ch) => {
    for (const font of fonts) {
      const glyph = font === primary ? own(ch) : font.charToGlyph(ch);
      if (glyph.index) {
        glyph.kitFont = font;
        return glyph;
      }
    }
    return own(ch);
  };
  return primary;
}

const VIEWBOX = /viewBox="0 0 ([\d.]+) ([\d.]+)"/;

const num = (v) => {
  if (!Number.isFinite(v)) throw new Error(`logo-kit: non-finite coordinate ${v}`);
  return +v.toFixed(2);
};

/**
 * Serialize an opentype Path to SVG path data. Use this instead of path.toPathData():
 * opentype.js 2.0 emits "NaN" when a coordinate's fraction is a tiny float residue
 * (its roundDecimal builds strings like "5.6e-14e+2"), and the browser silently stops drawing
 * the path at the first NaN.
 */
export function toD(path) {
  return path.commands
    .map((c) => {
      switch (c.type) {
        case 'Z':
          return 'Z';
        case 'Q':
          return `Q${num(c.x1)} ${num(c.y1)} ${num(c.x)} ${num(c.y)}`;
        case 'C':
          return `C${num(c.x1)} ${num(c.y1)} ${num(c.x2)} ${num(c.y2)} ${num(c.x)} ${num(c.y)}`;
        default:
          return `${c.type}${num(c.x)} ${num(c.y)}`;
      }
    })
    .join('');
}

/**
 * Lay out a string with kerning. Positions are relative to x = 0 on the baseline.
 * One glyph per character: no ligatures or other substitutions, so `char` always matches its glyph
 * (and fonts whose substitution tables opentype.js can't run still work).
 * @returns {{ glyphs: { glyph, char: string, x: number, width: number }[], width: number, ascent: number, capHeight: number, xHeight: number }}
 */
export function layout(font, text, size, { tracking = 0 } = {}) {
  const scale = size / font.unitsPerEm;
  const chars = [...text];
  const glyphs = chars.map((ch) => font.charToGlyph(ch));
  glyphs.forEach((glyph, i) => {
    if (!glyph.index && chars[i].trim()) {
      throw new Error(`logo-kit: "${chars[i]}" is not in this font (it would render as an empty box); pick a font that has it`);
    }
  });
  let x = 0;
  const out = glyphs.map((glyph, i) => {
    // Kerning pairs only exist inside one subset file; across subsets the indexes don't match.
    if (i && (glyphs[i - 1].kitFont ?? font) === (glyph.kitFont ?? font)) {
      const kern = font.getKerningValue(glyphs[i - 1], glyph);
      x += (Number.isFinite(kern) ? kern : 0) * scale + tracking;
    }
    const item = { glyph, char: chars[i] ?? '', x, width: glyph.advanceWidth * scale };
    x += item.width;
    return item;
  });
  const capHeight = (font.tables.os2?.sCapHeight || font.ascender * 0.7) * scale;
  const xHeight = (font.tables.os2?.sxHeight || font.ascender * 0.5) * scale;
  return { glyphs: out, width: x, ascent: font.ascender * scale, capHeight, xHeight };
}

/**
 * Tight bounding box of a word's outlines at (x, baselineY), before any transform. Use it to size
 * the viewBox; add room for outlines, shadows and rotations yourself.
 * @returns {{ x1: number, y1: number, x2: number, y2: number }}
 */
export function pathBox(font, text, x, baselineY, size, opts) {
  const path = new opentype.Path();
  for (const g of layout(font, text, size, opts).glyphs) path.extend(g.glyph.getPath(x + g.x, baselineY, size));
  return path.getBoundingBox();
}

/** Path data for one glyph with its origin at (x, baselineY). */
export const glyphPath = (glyph, x, baselineY, size) => toD(glyph.getPath(x, baselineY, size));

/** Path data for a whole string starting at (x, baselineY). */
export function textPath(font, text, x, baselineY, size, opts) {
  return layout(font, text, size, opts)
    .glyphs.map((g) => glyphPath(g.glyph, x + g.x, baselineY, size))
    .join('');
}

/**
 * Set text around a circle (seals, badges). Each glyph is centred on its arc position and rotated
 * to stand on the circle. `fill: true` stretches the spacing so the text closes the full ring.
 * @returns {{ d: string, transform: string, char: string }[]} style each glyph however you like
 */
export function arcText(font, text, { cx, cy, r, size, startDeg = -90, fill = true }) {
  const { glyphs, width, capHeight } = layout(font, text, size);
  const k = fill ? (2 * Math.PI * r) / width : 1;
  const offset = fill ? 0 : -width / 2; // centred on startDeg when not filling
  return glyphs.map((g) => {
    const along = (g.x + g.width / 2 + offset) * k;
    const angle = along / r + (startDeg * Math.PI) / 180;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    const deg = (angle * 180) / Math.PI + 90;
    return {
      d: glyphPath(g.glyph, -g.width / 2, capHeight / 2, size),
      transform: `translate(${num(px)} ${num(py)}) rotate(${num(deg)})`,
      char: g.char,
    };
  });
}

/**
 * The outlined "cut-out" treatment: an ink outline drawn behind the fill (paint-order) plus an
 * optional hard offset shadow. `shadowColor` defaults to the ink; set it separately on dark
 * backgrounds, where a dark ink outline vanishes but a coloured shadow still reads.
 * Returns SVG markup.
 */
export function sticker(d, { fill, ink = '#000', strokeWidth = 8, shadow = 8, shadowColor = ink, transform = '' }) {
  const t = transform ? ` transform="${transform}"` : '';
  const shade = shadow
    ? `<path data-kit="shadow" d="${d}" fill="${shadowColor}" stroke="${shadowColor}" stroke-width="${strokeWidth}" stroke-linejoin="round" transform="translate(${shadow} ${shadow})"/>`
    : '';
  return `<g${t}>${shade}<path d="${d}" fill="${fill}" stroke="${ink}" stroke-width="${strokeWidth}" stroke-linejoin="round" paint-order="stroke"/></g>`;
}

/** The solid rounded tile behind `logo-mark.svg` and `favicon.svg`; draw the symbol after it. */
export function tile(size, fill) {
  return `<rect data-kit="tile" width="${num(size)}" height="${num(size)}" rx="${num(size / 4)}" fill="${fill}"/>`;
}

/** Root SVG with an accessible name. Pass a distinct `id` if two logos are inlined on one page. */
export function svgDoc({ width, height, title, body, id = 'logo-title' }) {
  const esc = String(title).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(width)} ${num(height)}" role="img" aria-labelledby="${id}"><title id="${id}">${esc}</title>${body}</svg>`;
}

/**
 * Validate a finished SVG string before writing it. Throws on: NaN/undefined/Infinity in the
 * markup, live <text> (the logo must be outlined), a missing <title>, a missing viewBox, or an "&" that
 * doesn't start an XML entity (a browser shows nothing for an SVG file that isn't well-formed XML).
 * @returns {{ bytes: number }}
 */
export function check(svg) {
  const problems = markupProblems(svg);
  if (problems.length) throw new Error(`logo-kit check failed: ${problems.join('; ')}`);
  return { bytes: Buffer.byteLength(svg) };
}

function markupProblems(svg) {
  const problems = [];
  if (/NaN|undefined|Infinity/.test(svg)) problems.push('contains NaN/undefined/Infinity');
  if (/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[\dA-Fa-f]+);)/.test(svg)) {
    problems.push('contains a bare "&" or an HTML-only entity such as &nbsp;; build the file with svgDoc(), which escapes the title');
  }
  if (/<text[\s>]/.test(svg)) problems.push('contains <text>; outline the letters with textPath/glyphPath');
  if (!/<title[^>]*>[^<]+<\/title>/.test(svg)) problems.push('missing <title>');
  if (!VIEWBOX.test(svg)) problems.push('missing or invalid viewBox');
  return problems;
}

const MIN_LETTER_PX = 16;
const MAX_SMALL_WIDTH_PX = 192;
const MIN_DESKTOP_PX = 48;
const MAX_HEADER_PX = 80; // automatic heights only: taller header logos crowd the nav, and stacked lockups reached 144
const HEADROOM = 0.02; // of the viewBox height, on every edge
const CLIP_SLACK = 0.5; // viewBox units of anti-aliasing a "nothing outside the viewBox" check allows

function viewBoxOf(svg) {
  const m = svg.match(VIEWBOX);
  if (!m) throw new Error('logo-kit: missing or invalid viewBox');
  return { width: +m[1], height: +m[2] };
}

/** Gap between everything drawn (strokes, shadows, transforms) and each viewBox edge, smallest first. */
function edgeGaps(svg, vb) {
  const b = new Resvg(svg).getBBox();
  if (!b) return [];
  const gaps = { top: b.y, bottom: vb.height - b.y - b.height, left: b.x, right: vb.width - b.x - b.width };
  return Object.entries(gaps).sort((a, b) => a[1] - b[1]);
}

const px = (v) => +v.toFixed(1);
const ceil1 = (v) => Math.ceil(v * 10) / 10;
const ceil8 = (v) => Math.ceil(v / 8) * 8;
const floor8 = (v) => Math.floor(v / 8) * 8;

const minHeaderPx = (letterHeight, height) => ceil8((MIN_LETTER_PX * height) / letterHeight);
const maxWidthAt = (height, smallPx) => Math.floor((MAX_SMALL_WIDTH_PX * height) / smallPx);

function autoHeights(letterHeight, height) {
  const small = Math.min(minHeaderPx(letterHeight, height), MAX_HEADER_PX);
  return { desktop: Math.max(small, MIN_DESKTOP_PX), small };
}

/**
 * The widest viewBox a logo of this height can have and still fit 192 px on small screens at the
 * height `checkLogo` picks. Call it while composing, before the first build: it is roughly
 * 10–12 × `letterHeight`, so a long name stacks or tags instead of running on one line.
 * @param {number} letterHeight viewBox units, as passed to `checkLogo`
 * @param {number} height the viewBox height
 */
export function widthBudget(letterHeight, height) {
  return maxWidthAt(height, autoHeights(letterHeight, height).small);
}

/** Collects PASS/FAIL/SKIP lines; `print` returns how many failed. */
function sizeReport(label, vb) {
  const lines = [];
  return {
    rule(ok, text, fix) {
      lines.push(ok ? `PASS ${text}` : `FAIL ${text} → ${fix}`);
    },
    skip(text) {
      lines.push(`SKIP ${text}`);
    },
    headroom(svg, of) {
      if (!Resvg) return this.skip('headroom: install @resvg/resvg-js to measure it');
      const [edge, gap] = edgeGaps(svg, vb)[0] ?? [];
      if (edge === undefined) return this.skip(`headroom: nothing drawn on ${of}`);
      const min = HEADROOM * vb.height;
      this.rule(gap >= min, `headroom ${px(gap)} at the ${edge} of ${of} (≥ ${px(min)} viewBox units)`,
        `add ${ceil1(min - gap)} viewBox units at the ${edge}: grow the viewBox on that side or move the drawing in; accents, descenders, tilt, outline and shadow all need room`);
    },
    print() {
      console.log(`${label} (viewBox ${px(vb.width)} × ${px(vb.height)}):`);
      for (const line of lines) console.log(`  ${line}`);
      return lines.filter((l) => l.startsWith('FAIL')).length;
    },
  };
}

function logoSizes(svg, { letterHeight, heights }) {
  if (!letterHeight || (heights && (!heights.desktop || !heights.small))) {
    throw new TypeError('logo-kit checkLogo: pass letterHeight, and heights: { desktop, small } only to set both');
  }
  const vb = viewBoxOf(svg);
  const report = sizeReport('logo.svg', vb);
  const minHeaderH = minHeaderPx(letterHeight, vb.height);
  const maxSmall = floor8((MAX_SMALL_WIDTH_PX * vb.height) / vb.width);
  const { desktop, small } = heights ?? autoHeights(letterHeight, vb.height);
  const lettersAt = (h) => (letterHeight / vb.height) * h;
  const width = (vb.width / vb.height) * small;
  const canLowerSmall = small > minHeaderH && minHeaderH <= maxSmall;
  const widthFixes = [
    ...(canLowerSmall ? [`--logo-h-sm ${minHeaderH === maxSmall ? minHeaderH : `${minHeaderH}–${maxSmall}`} px passes both`] : []),
    `make the viewBox at most ${maxWidthAt(vb.height, small)} units wide (now ${px(vb.width)}) at this height: stack or tag the words, tighten gaps, or show logo-mark.svg with the name beside it on small screens`,
  ];

  report.rule(desktop % 8 === 0 && small % 8 === 0, `heights ${desktop} / ${small} px are multiples of 8`, 'round them to multiples of 8');
  const capped = !heights && minHeaderH > MAX_HEADER_PX;
  const minLetterAtCap = ceil1((MIN_LETTER_PX * vb.height) / MAX_HEADER_PX);
  const maxHeightAtCap = Math.floor((letterHeight * MAX_HEADER_PX) / MIN_LETTER_PX);
  const lettersFixes = (name) => capped
    ? [`the header logo stops at ${MAX_HEADER_PX} px: make letterHeight at least ${minLetterAtCap} viewBox units (now ${px(letterHeight)})`,
      `make the viewBox at most ${maxHeightAtCap} units tall (now ${px(vb.height)}): trim empty space or set the mark beside the words instead of above them`]
    : [`raise ${name} to ${minHeaderH} px or more`, 'enlarge the letters inside the viewBox', 'trim empty viewBox space'];
  const letterChecks = desktop === small ? [['--logo-h and --logo-h-sm', small]] : [['--logo-h', desktop], ['--logo-h-sm', small]];
  for (const [name, h] of letterChecks) {
    report.rule(lettersAt(h) >= MIN_LETTER_PX, `letters ${px(lettersAt(h))} px tall at ${name} ${h} px (≥ ${MIN_LETTER_PX})`,
      lettersFixes(name).join(', or '));
  }
  report.rule(width <= MAX_SMALL_WIDTH_PX, `width ${px(width)} px at --logo-h-sm ${small} px (≤ ${MAX_SMALL_WIDTH_PX})`,
    widthFixes.join(', or '));
  report.headroom(svg, 'the viewBox');
  const measured = `- **Measured:** letters ${px(lettersAt(small))} px tall at \`--logo-h-sm\`; width ${px(width)} px at \`--logo-h-sm\``;
  return { report, heights: { desktop, small }, measured };
}

function tileChecks(svg, { favicon = false } = {}) {
  const vb = viewBoxOf(svg);
  const report = sizeReport(favicon ? 'favicon.svg' : 'logo-mark.svg', vb);
  const tileTag = svg.match(/<rect data-kit="tile"[^>]*\/>/)?.[0];
  report.rule(Boolean(tileTag), 'drawn on a tile()', "draw the tile with the kit's tile(size, fill)");
  if (!Resvg) report.skip('clipping: install @resvg/resvg-js to measure it');
  else {
    const gap = edgeGaps(svg, vb)[0]?.[1] ?? 0;
    report.rule(gap >= -CLIP_SLACK, 'nothing drawn outside the viewBox', 'shrink or move the drawing in; the tile already fills the viewBox');
  }
  if (tileTag) report.headroom(svg.replace(tileTag, ''), 'the tile');
  if (favicon) {
    report.rule(!/data-kit="shadow"|<filter|drop-shadow/.test(svg), 'no shadow', 'pass shadow: 0 to sticker() and draw no other shadow');
  }
  return report;
}

function renderPreview({ logo, mark, favicon, heights, background, out }) {
  const render = (svg, h, zoom) => {
    const img = new Resvg(svg, { fitTo: { mode: 'height', value: h } }).render();
    return { w: img.width * zoom, h: img.height * zoom, href: `data:image/png;base64,${img.asPng().toString('base64')}` };
  };
  const tiles = (fill) => ({ fill, items: [render(mark, 32, 1), render(mark, 32, 4), render(favicon, 16, 1), render(favicon, 16, 8)] });
  const bands = [
    {
      label: `logo.svg at --logo-h ${heights.desktop} px and --logo-h-sm ${heights.small} px, then 2×, on the page background`,
      fill: background,
      items: [render(logo, heights.desktop, 1), render(logo, heights.small, 1), render(logo, heights.desktop, 2), render(logo, heights.small, 2)],
    },
    { label: 'light: logo-mark.svg at 32 px and 4×, favicon.svg at 16 px and 8×', ...tiles('#f1f3f4') },
    { label: 'dark: the same', ...tiles('#202124') },
  ];
  const PAD = 16;
  const LABEL = 28;
  let body = '';
  let y = 0;
  let width = 480;
  for (const { label, fill, items } of bands) {
    const rowH = Math.max(...items.map((i) => i.h)) + PAD * 2;
    body += `<text x="${PAD}" y="${y + 19}" font-family="sans-serif" font-size="13" fill="#555">${label}</text>`;
    y += LABEL;
    body += `<rect y="${y}" width="100%" height="${rowH}" fill="${fill}"/>`;
    let x = PAD;
    for (const i of items) {
      body += `<image href="${i.href}" x="${x}" y="${y + (rowH - i.h) / 2}" width="${i.w}" height="${i.h}" image-rendering="optimizeSpeed"/>`;
      x += i.w + PAD * 2;
    }
    width = Math.max(width, x - PAD);
    y += rowH;
  }
  const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${y}"><rect width="100%" height="100%" fill="#fff"/>${body}</svg>`;
  writeFileSync(out, new Resvg(sheet).render().asPng());
}

/**
 * Check the three finished files and render one PNG to look at instead of the SVG source.
 * Throws first if any file fails `check()`.
 * - logo.svg: letters ≥ 16 px at both header heights, width ≤ 192 px on small screens, 2% headroom
 *   around everything drawn, heights in multiples of 8. Without `heights`, `--logo-h-sm` is the
 *   smallest multiple of 8 that makes the letters 16 px, and `--logo-h` the same but at least 48 px;
 *   both stop at 80 px, so letters too small for 80 px fail.
 * - logo-mark.svg, favicon.svg: drawn on a `tile()`, nothing outside the viewBox, 2% headroom
 *   around the symbol; the favicon has no shadow.
 * - logo-preview.png: the logo at both heights on the page background, the mark at 32 px and the
 *   favicon at 16 px on a light and a dark strip, each also enlarged with hard pixels.
 * Prints the heights and the Measured line first, then every PASS/FAIL line, each failure with its
 * fixes, renders the preview, then throws if anything failed.
 * @param {object} o
 * @param {number} o.letterHeight viewBox units: `layout().xHeight` (mostly lowercase) or
 *   `.capHeight` (capitals) of the smaller word
 * @param {{ desktop: number, small: number }} [o.heights] set both header heights yourself
 * @param {string} [o.background] the page background colour
 * @returns {{ heights: { desktop: number, small: number }, measured: string }} heights for
 *   `--logo-h` / `--logo-h-sm`, and the design.md → Logo → **Measured** line
 */
export function checkLogo({ logo, mark, favicon, letterHeight, heights, background = '#ffffff', out = 'logo-preview.png' }) {
  // resvg can't measure or render a file check() rejects, so these fail before any size line.
  const broken = Object.entries({ 'logo.svg': logo, 'logo-mark.svg': mark, 'favicon.svg': favicon })
    .flatMap(([name, svg]) => markupProblems(svg).map((p) => `${name}: ${p}`));
  if (broken.length) throw new Error(`logo-kit checkLogo: ${broken.join('; ')}`);
  const sizes = logoSizes(logo, { letterHeight, heights });
  // First, so piping the output through `head` can't cut them off.
  console.log(`--logo-h: ${sizes.heights.desktop}px; --logo-h-sm: ${sizes.heights.small}px`);
  console.log(sizes.measured);
  const reports = [sizes.report, tileChecks(mark), tileChecks(favicon, { favicon: true })];
  const failed = reports.reduce((n, r) => n + r.print(), 0);
  if (Resvg) {
    renderPreview({ logo, mark, favicon, heights: sizes.heights, background, out });
    console.log(`preview: read ${out}`);
  } else {
    console.log('preview not rendered: @resvg/resvg-js is not installed; list "logo not visually checked" under gaps');
  }
  if (failed) throw new Error(`logo-kit checkLogo: ${failed} check(s) failed, see the FAIL lines above`);
  return { heights: sizes.heights, measured: sizes.measured };
}
