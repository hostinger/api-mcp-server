# headless — Keep the current look (design)

Read from [`SKILL.md`](SKILL.md) Step 1 when the brief says to keep the current look. Step numbers
below are that file's; 5.x are its Step 5 checks.

1. **Read the look from what the brief points at.** A live site: use Step 2's reference-site method
   (computed fonts, colours by painted area, the feel), but this site is the owner's own, so take its
   logo file as it is (the header `<img>` or inline `<svg>`, plus its favicon if it has one) and save
   it unchanged in `brand/`. Screenshots or a brand guide: read the colours and lettering from them;
   a logo seen only in a screenshot counts as no logo file, so list "logo file needed" under gaps in
   the final report. The app in this folder (the path under `brief.md` → **Existing project**):
   read its source; no build or browser needed.
   - *Colours:* the theme tokens (Tailwind v4 `@theme`, v3 `tailwind.config.*` `theme`/`theme.extend`,
     `:root` custom properties), ranked by how often the code uses them (class names, `var()`), with
     the page background and body text taken from the root layout or `body`.
   - *Fonts:* theme font tokens, `@fontsource` imports or dependencies, Google Fonts `<link>` or
     `@import`, and the `font-family` on `body` and headings.
   - *Logo:* files named `logo*` in `public/`, `static/`, `src/assets/` or `assets/`;
     `favicon*`, `icon*` or `apple-icon*` in `public/`, `static/`, `app/` or `src/app/`; or the icon
     declared by `<link rel="icon">` in `index.html` or the root layout's `metadata.icons`. Copy them
     unchanged into `brand/`.

   Files or exact colours and fonts the owner supplied win over anything you read.
2. **Confirm in one question.** Describe the kept look in two plain sentences and ask: *keep it, or
   change something?* "Keep the look we have" still gets this question; skip it only when the brief
   says to change nothing at all ("keep it exactly as it is"). A skipped tool result is not Keep; see
   *When you ask the user* in the top-level `SKILL.md`. Change →
   apply only what they asked for; a request for a new logo runs Step 6 for the logo alone.
3. **Check it** as in Step 5. The kept colours are fixed like brand colours: a pair that fails gets a
   shade of the same hue in that role only. Spacing moves to the nearest grid value, and a font
   without an `@fontsource` package swaps to the closest one that resolves (5.4).
4. **Logo.** Reuse the existing logo and favicon unchanged; never redraw or recolour them. With no
   existing logo, the header shows the site name as text in the kept display font; no icon is drawn.
5. **Write `design.md`** (Step 7) from the kept look, then hand off as usual. In **Logo**:
   - *Files* and *Use* name the files as saved (a `.png` stays a `.png`), or say "No favicon kept".
   - With no logo: *Files* says "None", *Use* says the header link holds the site name as text in
     `--font-display` and the browser's default favicon stays, and the *Don't* line is dropped.
