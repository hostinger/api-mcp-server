# headless — Option B: stock photos from Unsplash (any backend, no instance)

Read from [`SKILL.md`](SKILL.md) *Images* when the user picks stock photos, the backend isn't
WordPress, or Hostinger AI generation (Option A) failed twice. Step numbers below are this file's.

This is still prepare work and needs no live backend: you pick the photos and record their URLs (step 5),
and the push phase uploads them.

Source every image in a few batched calls, not a search and a fetch per photo:

1. **Find candidates, a page of them per fetch.** Group the image briefs into a few themes (e.g.
   "sourdough bread", "bakery interior", "Lisbon street").
   - With an `UNSPLASH_ACCESS_KEY` in the environment, use the official API, one call per theme:
     `GET https://api.unsplash.com/search/photos?query=<theme>&orientation=landscape&per_page=20` with
     header `Authorization: Client-ID <key>`. Each result's `urls.raw` is the file (its `photo-…`
     part, before `?`, is the `<file id>`), `id` the `<page id>`, `alt_description` what it shows and
     `user.name` the photographer; for each photo you keep, also `GET` its
     `links.download_location` (same header), as the API terms require.
   - Without a key, open the theme's search page `https://unsplash.com/s/photos/<theme-with-dashes>`
     with your **web-fetch tool**, once per theme, with this prompt (a short fixed answer keeps the
     fetch fast):

     ```text
     List up to 12 free photos on this page, one line each, in this exact format and nothing else:
     <file id> | <page id> | <alt text> | <photographer>
     <file id> is the photo-… part of its images.unsplash.com URL, copied exactly, before any "?".
     <page id> is the part after unsplash.com/photos/ in its photo page link.
     Skip plus.unsplash.com/premium_photo-… results: they are Unsplash+ and not free.
     ```

     Fetch the themes in parallel when your tool allows several calls at once. Fall back to a web
     search limited to `unsplash.com` plus a fetch of one photo page (`https://unsplash.com/photos/<…>`)
     only for a subject no search page covers.
   - Every other `unsplash.com` request (curl on any page, `/photos/<id>/download`, `/napi/…`,
     `/oembed`) hits a bot challenge: a `307` to `/.within.website` (Anubis) or a 401. If your fetch
     tool gets the challenge page too, stop: no user-agent spoofing or other workarounds. On a
     WordPress backend where Option A hasn't already failed, offer it; otherwise ask the user for an
     `UNSPLASH_ACCESS_KEY` or record the gap (step 5).
2. **Check them all in one command.** Pick a candidate per image brief from its alt text, then in one
   shell command request each web-size URL
   (`https://images.unsplash.com/<file id>?w=1600&q=80&fm=jpg&fit=max`, query string replaced) and
   confirm 200 `image/jpeg`, and save a small preview (`?w=500`) of each into one folder, e.g.:

   ```bash
   mkdir -p ~/.hostinger/<domain>/media/previews && cd ~/.hostinger/<domain>/media/previews && \
   for id in <file id> <file id>; do
     curl -s -o /dev/null -w "$id %{http_code} %{content_type}\n" "https://images.unsplash.com/$id?w=1600&q=80&fm=jpg&fit=max"
     curl -s -o "$id.jpg" "https://images.unsplash.com/$id?w=500&q=60&fm=jpg&fit=max"
   done
   ```

   The upload ability needs this direct file URL, not the photo page.
3. **Look before you keep it.** View the previews, all in one turn where your tool can open several
   images at once. Alt text from a search page describes the photo better than a search snippet, but
   a photo often isn't quite what its title says. Reject anything off-topic and take the next
   candidate from the same list. If nothing fits exactly, take the closest real photo and note the gap
   rather than mislabel it.
4. **Write alt text from what the photo shows**, not from the article's image brief. For example,
   use "Shopfronts and parked scooters on a Hanoi street" even if the article is about rain.
5. **Record it** under each article in `content-model.md` (on WordPress, in the article's `image` in
   `content.json` instead: `url`, `alt`, `filename`, and the credit as `caption`):

   ```markdown
   Image: https://images.unsplash.com/<file id>?w=1600&q=80&fm=jpg&fit=max
   Image credit: <Photographer> — https://unsplash.com/photos/<page id> (Unsplash License)
   Image alt: <what the photo shows>
   Image file: <site>-<subject>.jpg
   ```

   If you can't get a real photo, write `Image gap: <reason>` in place of these lines and tell the
   user. Never substitute drawn or generated images without saying so.

Unsplash photos are free to use under the Unsplash License. Still credit the photographer: the push
phase stores "Photo by <Photographer> on Unsplash" as the image caption.
