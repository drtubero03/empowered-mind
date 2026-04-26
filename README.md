# Empowered Mind

Static marketing site for Dr. Adrian Tubero, Psy.D. — Core Self Reclamation Therapy (CSRT) practice and *The Midlife Shift* group for women.

**Live:** https://zelidav.github.io/empowered-mind/

## Stack

Vanilla HTML / CSS / JS. No build step. No external JS libraries. SVG + CSS for visual texture; one MP4 for the looping wave hero on the group page; one portrait JPEG.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, recognition, about preview, different way, what I do, 12-session teaser, FAQ, final CTA |
| `about.html` | About Dr. Tubero — bio (with portrait), approach cards, contact |
| `csrt-package.html` | The 12-Session CSRT Program — overview, focus areas, features, $5,000 pricing, fit, FAQ |
| `group-therapy.html` | The Midlife Shift — Spring 2026 6-week experiential group for women (Thurs May 15 – Jun 19) |
| `blog.html` | Index of three writing posts on midlife / inner voice / shifting patterns |
| `blog-disorientation.html`, `blog-inner-voice.html`, `blog-shift.html` | Long-form articles |
| `apply.html` | Application form. Pre-selects inquiry type from URL: `?inquiry=group` / `?inquiry=waitlist` / etc. |
| `styles.css`, `script.js` | Shared design system + interactions (nav scroll, mobile menu, FAQ accordion, scroll fade-in, video fade-in, foam particles, mailto fallback) |

## Assets

| File | Use |
|---|---|
| `lotus.png` | Brand mark in nav + footer (transparent PNG) |
| `favicon.ico` / `favicon-32.png` / `apple-touch-icon.png` | Browser/device icons |
| `adrian.jpg`, `adrian-sq.jpg` | Dr. Tubero portrait (about preview + about page bio) |
| `hero-bg.mp4` | Looping ocean reference for group-therapy hero (~3.5MB) |

## Design system

Sand + turquoise palette in `styles.css :root`. Two-color discipline — pinks/coral/slate intentionally absent. Typography: Cormorant Garamond (headings) + DM Sans (body). Section variants (`.bg-foam`, `.bg-sand`, `.bg-tide`, `.bg-mist`, `.bg-teal`, `.bg-dark`) carry the ocean feel through every page.

## Group references across pages

The Spring 2026 group (*The Midlife Shift*) is mentioned subtly in context, not as a banner — italic serif asides woven into existing copy (`.group-aside` class). Found on:
- index.html — bottom of about preview
- about.html — bottom of bio
- csrt-package.html — under "Who it's for"
- blog.html — below the post list
- All three blog post pages — below the closing CTA
- apply.html — as a select option in "I'm reaching out about"

The nav-bar CTA ("See If We're a Fit" → `apply.html`) and the group-page CTAs (`apply.html?inquiry=group`) all route to the same form.

## Local preview

Just open `index.html`, or:

```
python -m http.server 8000
```

Then visit http://localhost:8000.

## Branches

- `main` — live site
- `v1-periwink-botanical`, `v2-ocean` — earlier design exploration branches kept as archive

## Custom domain (planned)

`doctor.tubero.com` — not yet wired (registrar account doesn't have `tubero.com` yet). When acquired:
1. Drop a `CNAME` file in repo root with `doctor.tubero.com`
2. Add a CNAME DNS record `doctor → zelidav.github.io`
3. Enable HTTPS in Pages settings after the cert provisions

## Contact

- Phone: 917-568-7909
- Email: Drtubero03@gmail.com
