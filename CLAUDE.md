# Empowered Mind — Project Notes for Claude

This file is a handoff document. If you're a Claude instance working on this site, **read this first** before making changes. It captures everything that isn't obvious from reading the code alone.

---

## What this is

A static marketing site for **Dr. Adrian Tubero, Psy.D.** — a clinical psychologist whose practice centers on **Core Self Reclamation Therapy (CSRT)**, an experiential, depth-oriented approach for high-functioning adults navigating midlife and stuck patterns.

Adrian is also the founder of **Periwink** (a separate community platform for women in perimenopause). This site is for the *individual practice* — a separate brand from Periwink, but with overlapping audience.

The site exists to:

1. Let new clients understand the work and the practitioner
2. Apply for the **12-session CSRT package** ($5,000)
3. Apply for **The Midlife Shift** — a 6-week experiential group for women (Spring 2026: Thursdays May 15 – June 19, 4:30–6:00 PM EST, virtual via Zoom, 5–8 women)
4. Read writing on midlife, the inner voice, and patterns

Voice: contemplative, second-person, short paragraphs, italics for emphasis, pull quotes for rhythmic standalone lines. Never sales-y, never listicle. The site is intentionally **anti-commercial** in tone — the group and program are mentioned subtly via italic asides woven into copy, not banners.

---

## Live + repo

- **Live site:** https://drtubero03.github.io/empowered-mind/
- **GitHub repo:** https://github.com/drtubero03/empowered-mind (public)
- **Default branch:** `main` (deploys via GitHub Pages on every push)
- **Archive branches:** `v1-periwink-botanical`, `v2-ocean` — earlier design exploration; ignore for normal work
- **Custom domain:** `dradriantubero.com` — DNS wired (Apr 2026). CNAME file in repo root. Enable HTTPS in GitHub Pages settings once cert provisions (Settings → Pages → Enforce HTTPS).

---

## Stack (intentionally minimal)

- Vanilla HTML, CSS, JS. **No build step.** No framework, no bundler, no JS libraries.
- Google Fonts: **Cormorant Garamond** (headings) + **DM Sans** (body) — `display=swap`.
- One MP4 (`hero-bg.mp4`, ~3.5 MB) for the looping hero on the group page.
- One portrait JPEG of Adrian (`adrian.jpg`).
- Lotus brand mark PNG (`lotus.png`) with transparent background.
- Pexels photography for blog hero/thumbs in `img/blog/`.
- Mail relay = a small Flask service on Google Cloud Run (see "Mail relay" below).

To preview locally: open `index.html` in a browser, or `python -m http.server 8000` and visit http://localhost:8000.

---

## File map

```
empowered-mind/
├── index.html                      Home — hero, recognition, about preview, "different way", scope, 12-session teaser, FAQ, final CTA
├── about.html                      Adrian's bio + portrait + 3 approach cards + contact strip
├── csrt-package.html               12-session CSRT program — overview, focus areas, features, $5,000 pricing, fit, FAQ
├── group-therapy.html              The Midlife Shift — 6-week group, Spring 2026 (May 15 – Jun 19)
├── apply.html                      Application form — POSTs to mail relay, mailto fallback
├── blog.html                       Blog index — featured-first card grid, currently 10 posts
├── blog-*.html                     Individual blog posts (10 of them)
├── styles.css                      Shared design system (~1500 lines, well-commented sections)
├── script.js                       Shared interactions (nav scroll, mobile menu, FAQ accordion, scroll fade-up, video fade-in, foam particles, apply form POST + fallback)
├── lotus.png                       Brand mark — sage leaves + dusty pink lotus petal, transparent
├── favicon.ico, favicon-32.png, apple-touch-icon.png
├── adrian.jpg, adrian-sq.jpg       Portrait photos
├── hero-bg.mp4                     Looping ocean reference for group-page hero
├── img/blog/                       10 blog hero images (1600×900) + matching thumbs (640×360)
├── blog-img/                       Source originals (high-res, not used at runtime — kept for re-cropping)
├── mail-relay/                     Cloud Run service source (deployed separately)
│   ├── main.py                     Flask app with /apply endpoint
│   ├── requirements.txt
│   ├── Procfile                    For Cloud Run buildpacks
│   └── README.md                   Deploy instructions
├── README.md                       Public-facing readme
└── CLAUDE.md                       This file
```

---

## Design system

### Palette (sand + turquoise — two-color discipline)

Defined in `:root` of `styles.css`. **Don't introduce other colors** — pinks, slate blue, mauve coral are deliberately absent. Old shared rule names (`--mauve`, `--sky-pink`, `--sage`, `--teal`) are aliased to sand/turquoise tones so existing rules still pick up palette colors.

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#F6EFE3` | warm sand wash background |
| `--bg-soft` | `#EBDFCB` | slightly darker section background |
| `--bg-warm` | `#F2E5CD` | sun-warmed sand |
| `--sand` | `#DCC8AC` | primary sand |
| `--sand-soft` | `#EFE2C8` | foam-pale sand |
| `--sand-deep` | `#B69874` | toasted sand |
| `--sand-shadow` | `#8C7558` | deep sand shadow |
| `--turq-pale` | `#DEF1EE` | foamy turquoise wash |
| `--turq-light` | `#A8DBD6` | light turquoise |
| `--turq` | `#5BB8B5` | primary turquoise |
| `--turq-deep` | `#2E8B87` | deeper turquoise |
| `--turq-dark` | `#1B5F5C` | deepest turquoise |
| `--deep` | `#163A40` | deep ocean ink (dark text + dark CTA bg) |
| `--light-text` | `#5A6B6E` | body text |
| `--muted` | `#9C9180` | subtle/secondary text |
| `--border` | `#DCCFB8` | borders & dividers |

### Section background variants

Apply via class on `<section>`:

- `.bg-linen` — solid `--bg`
- `.bg-soft` — solid `--bg-soft`
- `.bg-foam` — gradient sand-soft → bg
- `.bg-sand` — gradient warmer sand → bg
- `.bg-tide` — radial sky-pink top + turquoise bottom over foam (used for pricing/feature sections)
- `.bg-mist` — radial turquoise halo at top over bg
- `.bg-teal` — solid turquoise gradient (white text). Eyebrow and link colors auto-invert.
- `.bg-dark` — deep ocean ink (white text). Used for final CTAs.

Each neutral section also has a **faint horizontal ripple** (`section.bg-*::after`) — a 96px banded `repeating-linear-gradient` at ~5% turquoise opacity. This carries the ocean feel through the body. **Don't remove this.**

### Components

- **`.btn` / `.btn-primary` / `.btn-outline` / `.btn-ghost`** — pill-shaped buttons. Primary is turquoise.
- **`.card`** — bordered card with a colored top accent bar. Variants: `.accent-teal`, `.accent-mauve` (sand-deep), `.accent-slate` (turquoise-deep).
- **`.chip-grid` + `.chip-card`** — compact item grid (used on focus-area lists).
- **`.list-section`** — two-column "do/don't" or "for/not-for" split with `.col` and `.col.col-no` (with `.col-note` callout).
- **`.faq-list` + `.faq-item`** — accordion. JS handles open/close with single-open-at-a-time behavior.
- **`.pricing` + `.price` + `.price-includes`** — pricing card.
- **`.pull-quote`** — large italic serif quote (used in dark sections).
- **`.familiar-list`** — bulleted list with sand-pink dot markers (used on home recognition).
- **`.portrait-frame`** — Adrian's photo frame (sand+turquoise gradient backdrop, white inner border, turquoise outline accent).
- **`.contact-strip`** — phone + email row with icons.
- **`.tide-glyph`** — three-wave SVG accent placed under section headlines.
- **`.wave-sep`** — SVG wave divider between sections (only used on home for the deep-color transitions).
- **`.group-circle`** — animated turquoise concentric rings (used on group-therapy page).
- **`.group-aside`** — italic serif paragraph used to weave the Midlife Shift mention into copy. **Use this — never a banner.**
- **`.blog-list` / `.blog-entry` / `.blog-thumb`** — blog index card grid (featured-first variant via `.featured-first` modifier).
- **`.article` / `.article-hero` / `.article-meta` / `.photo-credit`** — blog post layout.

### Animations (all CSS / IntersectionObserver, no libs)

- `.fade-up` → `.fade-up.visible` triggered by IntersectionObserver in `script.js`. Add `.delay-1` through `.delay-5` for staggered children.
- Hero h1 lines have built-in stagger (`.line` spans).
- Hero video on group page fades in once decoded (`.hero-video.loaded`).
- Foam particles on group hero spawn via `script.js initFoamParticles()`.
- Honors `prefers-reduced-motion`.

### Typography rules

- Headings: Cormorant Garamond, weight 400 (300 for h1 hero), tight line-height (1.2), slightly open letter-spacing.
- Body: DM Sans, 17px base, line-height 1.75.
- **Italic emphasis** is part of the voice — use it in copy. The Cormorant italic is intentionally one tone warmer than the regular weight.

---

## Mail relay (Cloud Run + Resend)

The apply form POSTs to a small Flask service deployed on **Google Cloud Run** in the `periwink-prod` GCP project. Source lives in `mail-relay/`.

| Item | Value |
|---|---|
| Service URL | `https://empowered-mind-mailer-784102208397.us-east1.run.app` |
| Endpoint | `POST /apply` (also `OPTIONS /apply` for CORS preflight, `GET /` for health) |
| Project | `periwink-prod` |
| Region | `us-east1` |
| Image | Buildpack-built from `mail-relay/` |
| Secrets | `RESEND_API_KEY` mounted from Secret Manager (`periwink-resend-api-key:latest`) — same secret Periwink uses |
| From | `Empowered Mind <noreply@cannacrypted.com>` (only verified Resend domain on Adrian's account) |
| To | `Drtubero03@gmail.com` |
| Reply-To | applicant's submitted email (so Adrian's reply lands with them) |
| CORS allowlist | `https://drtubero03.github.io`, `https://dradriantubero.com`, `https://www.dradriantubero.com`, `http://localhost:8000`, `http://127.0.0.1:8000` |

**Honeypot:** the apply form has a hidden `website` input. Any submission with that field populated is silently dropped (returns 200 OK to the bot, nothing sent).

**Fallback:** if the relay fails for any reason (network, 5xx), the form shows a small error notice with a "Send via your email app instead →" link that opens a pre-filled `mailto:` to Drtubero03@gmail.com. Nothing is ever lost.

### Common mail-relay tasks

**Redeploy after editing `main.py`:**

```sh
cd mail-relay
gcloud run deploy empowered-mind-mailer \
  --source . \
  --project periwink-prod \
  --region us-east1 \
  --allow-unauthenticated \
  --set-secrets RESEND_API_KEY=periwink-resend-api-key:latest \
  --memory 256Mi --cpu 1 --max-instances 3 \
  --quiet
```

**Test the live endpoint:**

```sh
curl -X POST https://empowered-mind-mailer-784102208397.us-east1.run.app/apply \
  -H "Origin: https://drtubero03.github.io" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"you@example.com","inquiry":"group","message":"Test"}'
```

**Rotate the Resend key:**

```sh
echo -n "<new-key>" | gcloud secrets versions add periwink-resend-api-key --data-file=- --project=periwink-prod
# Cloud Run picks up :latest on the next request — no redeploy needed
```

**Add a verified domain to Resend** (so we can send `noreply@empoweredmindstudio.com` or similar instead of `noreply@cannacrypted.com`): add the domain in https://resend.com/domains, set the DNS records it provides, then update `FROM_EMAIL` env var on the Cloud Run service.

---

## Apply form

Lives in `apply.html`. Single `<form id="apply-form">` with these fields:

| name | type | notes |
|---|---|---|
| `name` | text | required |
| `email` | email | required, regex-validated client + server |
| `phone` | tel | optional |
| `inquiry` | select | one of: `csrt`, `group`, `waitlist`, `ongoing`, `not-sure`, `other`. **Pre-selectable via `?inquiry=group` URL param** — every group-page CTA uses `apply.html?inquiry=group` |
| `source` | select | how they heard about Adrian |
| `message` | textarea | optional, "what brings you here" |
| `therapy_history` | radio | Yes / No / Currently in therapy |
| `availability` | checkboxes (multi) | weekday mornings / afternoons / evenings / weekends |
| `website` | text (hidden honeypot) | bots only — silently drops the submission |

`script.js initApplyForm()` handles the POST + thanks state + mailto fallback.

---

## Subtle group mentions (`.group-aside`)

The Spring 2026 group is mentioned in **italic serif asides** woven into existing copy on:

- `index.html` — bottom of about-preview paragraph
- `about.html` — bottom of bio
- `csrt-package.html` — under "Who it's for"
- `blog.html` — centered under post list
- Each blog post — near the closing CTA (also `blog-disorientation.html` has it inline in the closing section)
- `apply.html` — as a select option

**Never replace these with banners or strips.** The user explicitly requested subtle in-copy treatment — "not overcommercial." If you add new pages, follow the same pattern: one quiet italic serif sentence that links to `group-therapy.html`, never a card or banner.

---

## Blog

10 posts as of Apr 2026. Index at `blog.html` is a card grid with thumbnails. The newest post takes the full top row (featured-first).

### Add a new blog post

1. Create `blog-<slug>.html` in repo root. Use any existing blog post as a template (`blog-not-alone-midlife.html` is a good model). Required structure:
   - Standard nav + footer
   - `<section class="bg-foam" style="padding-top:8rem;">` wrapping the article
   - `<figure class="article-hero"><img src="img/blog/<slug>.jpg" alt=""></figure>` at the top
   - `<p class="photo-credit">Photo by <a href="...">Photographer</a> on Pexels</p>`
   - `<article class="article">` containing back link, `.article-meta`, h1, body
   - Close with the standard CTA + group aside
2. Add hero image to `img/blog/<slug>.jpg` (1600×900) and `img/blog/<slug>-thumb.jpg` (640×360). Use Pexels for free, contemplative imagery (water, light, sand, mist — match the tone of existing posts).
3. Add a card to `blog.html` — copy any existing `.blog-entry` block and update slug/date/title/excerpt/image.

### Voice guidelines for posts (Adrian's voice)

Read 2–3 existing posts before writing. Key markers:

- **Short paragraphs**, often one sentence each
- **Second person** ("you")
- **Italics** for emphasis on key felt-sense words
- **Subheadings** as gentle frames, not titles
- **Pull quotes** (`<p class="pullquote">`) for the rhythmic standalone lines that deserve weight
- **Lists** for symptoms / patterns (numbered or bulleted, sparing)
- **Closes with personal-but-professional invitation** — never sales pressure
- Use em-dashes and ellipses naturally
- Avoid jargon; use felt-sense language ("the system slows", "underneath", "the part of you that")
- Reference CSRT, the practice, and The Midlife Shift naturally — not as products

### Pexels image sourcing

Pexels CDN URLs are predictable from the photo ID:

```
https://images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg?auto=compress&cs=tinysrgb&w=1600
```

Always credit the photographer. Avoid images with visible text/branding/logos.

To resize a Pexels image to hero + thumb dimensions:

```python
from PIL import Image, ImageOps
img = ImageOps.exif_transpose(Image.open('source.jpg')).convert('RGB')
# 16:9 hero
sw, sh = img.size; tw, th = 1600, 900
src_ratio = sw / sh; target_ratio = tw / th
if src_ratio > target_ratio:
    new_w = int(sh * target_ratio); left = (sw - new_w) // 2
    crop = img.crop((left, 0, left + new_w, sh))
else:
    new_h = int(sw / target_ratio); top = max(0, int(sh * 0.05)) if sh > new_h * 1.5 else (sh - new_h) // 2
    top = min(top, sh - new_h); crop = img.crop((0, top, sw, top + new_h))
hero = crop.resize((tw, th), Image.LANCZOS); hero.save('hero.jpg', 'JPEG', quality=82, optimize=True, progressive=True)
hero.resize((640, 360), Image.LANCZOS).save('thumb.jpg', 'JPEG', quality=80, optimize=True, progressive=True)
```

---

## Common edits

### Change phone number or email

Find-and-replace across all HTML files:
- Phone: `917-568-7909` (and `tel:9175687909` for the link href)
- Email: `Drtubero03@gmail.com` (and `mailto:Drtubero03@gmail.com`)
- Also update the `TO_EMAIL` env var on the Cloud Run service if recipient changes:
  ```sh
  gcloud run services update empowered-mind-mailer \
    --region us-east1 --project periwink-prod \
    --set-env-vars TO_EMAIL=new@example.com
  ```

### Change the 12-session price

`csrt-package.html` (the `.pricing` block — `$5,000` and "(12 sessions)" appear together) and home/CSRT FAQs (search the repo for `5,000`).

### Change Midlife Shift dates / cohort details

`group-therapy.html`. Update:
- Hero subtitle (date range)
- "Format & schedule" `.schedule-list` items
- Final CTA section
- Copy in `index.html`, `about.html`, `csrt-package.html`, `blog.html`, and the blog post asides — all currently say "May 15" or "this spring." Search-and-replace `May 15` and `6-week` to update.

### Open / close a future group cohort

Easiest: temporarily change `apply.html?inquiry=group` links to `apply.html?inquiry=waitlist` in the group-page CTAs and add a small note. Update the `inquiry` select labels in `apply.html` if needed.

### Add a new top-level page

1. Create `<name>.html` using an existing page as template. Make sure to include:
   - The shared `<nav>` block (copy from any other page)
   - The shared `<footer>` block
   - Standard `<head>` with the same Google Fonts + favicon links + `styles.css`
   - `<script src="script.js"></script>` at the bottom
2. Add a nav link to **every other page's** `<ul class="nav-links">` (this site has no shared template, so nav is duplicated in each file). The same applies to the footer.

### Deploy a change

Just `git push`. GitHub Pages rebuilds in ~30–60 seconds. To verify it's done:

```sh
gh api repos/drtubero03/empowered-mind/pages/builds/latest --jq '{status,commit}'
```

---

## Things to know / gotchas

- **No build step.** Don't introduce one. Don't add npm/webpack/Vite. The simplicity is intentional.
- **No external JS libraries.** Don't add jQuery, GSAP, Alpine, etc.
- **No raster images for design texture** — only Adrian's portrait, the lotus brand mark, and Pexels blog photography. Decorative shapes are SVG or CSS gradients only.
- **Google Pages default branch is `main`.** Don't move files into `/docs` or change the source.
- **CORS on the mail relay must include any new origin** that hosts the apply form (e.g., when the custom domain goes live, `https://doctor.tubero.com` is already in the allowlist).
- **The Cloud Run service is in `periwink-prod`, not its own project.** This is intentional to share the Resend key with Periwink. If isolation is ever needed, a separate project + secret would be cleanest.
- **`hero-bg.mp4` is 3.5 MB.** Heavy on mobile — consider lazy-loading or a poster-only fallback if mobile performance becomes a concern. Currently only used on the group page hero.
- **Date format for blog posts:** the URL slug carries no date; only the visible meta (`<p class="article-meta">`) and the index card text show the date. So renaming a date doesn't break URLs.
- **Inquiry preselect** uses URL params, not localStorage. Refreshing apply.html with no param resets the select. Group-page CTAs are written as `apply.html?inquiry=group` — keep this pattern when adding new entry points.
- **The compare page (`compare.html`) was removed** when V2 was promoted. The earlier branches (`v1-periwink-botanical`, `v2-ocean`) are still on GitHub for archive but should not be deployed.

---

## Useful prompts for working on this site

When starting a session, try one of these to get oriented quickly:

> *"I want to add a new blog post titled X about Y. Use the same voice and structure as the existing posts. Source a Pexels image that fits."*

> *"Change the Spring 2026 group dates to <new dates>. Update everywhere they appear."*

> *"Adrian wants to add a testimonials section to the home page. Match the existing design system — sand/turquoise palette, no banners, italic serif aside style for any pull quotes."*

> *"Test that the apply form is still posting to the mail relay correctly."*

> *"Adrian acquired tubero.com — wire up doctor.tubero.com as the custom domain."*

> *"Add a new inquiry option to the apply form: '<x>'. Make sure the mail relay handles it too."*

---

## Contacts (for handoff)

- **Adrian (practitioner):** Drtubero03@gmail.com · 917-568-7909
- **Original developer (David):** zelidav@gmail.com (GCP project owner: david@canismajorpartners.com)
- **GCP project owner:** `periwink-prod`, billing account `01DE45-3C37E9-1C55D8`
- **Domain registrar:** GoDaddy (currently — `tubero.com` not yet acquired)

---

*Last updated: April 26, 2026.*
