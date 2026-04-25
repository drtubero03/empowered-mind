# Empowered Mind

Static marketing site for Dr. Adrian Tubero, Psy.D. — Core Self Reclamation Therapy (CSRT) practice.

**Live (GitHub Pages):** https://zelidav.github.io/empowered-mind/

> Custom domain `doctor.tubero.com` is planned but not yet wired — `tubero.com` is not currently on the user's registrar account. When it is, drop a `CNAME` file in repo root containing `doctor.tubero.com` and add a CNAME record `doctor → zelidav.github.io` in DNS.

## Stack

Vanilla HTML / CSS / JS. No build step. No external JS libraries. SVG + CSS for all visual texture (no raster images).

## Files

| File | Purpose |
|---|---|
| `index.html` | Home — hero, recognition, about preview, different way, what I do, 12-session teaser, FAQ, final CTA |
| `about.html` | About Dr. Tubero — bio, approach cards, credentials |
| `csrt-package.html` | The 12-Session Program — overview, focus areas, features, pricing, fit |
| `apply.html` | Application form (vanilla; opens mailto fallback on submit) |
| `styles.css` | Shared design system |
| `script.js` | Nav scroll, mobile menu, scroll fade-up, FAQ accordion, form submit |

## Local preview

Just open `index.html` in a browser, or:

```
python -m http.server 8000
```

Then visit http://localhost:8000.

## Editing copy

All copy lives directly in the HTML files — no CMS. Search-and-replace works for shared text (phone, email).

## Contact info (used in nav, apply form, footer)

- Phone: 917-568-7909
- Email: Drtubero03@gmail.com
