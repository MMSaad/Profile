# Mustafa Saad — Profile Site

A glass-morphism personal site rebuilt from the 2018 Bootstrap template, with content
updated to match the current LinkedIn profile (linkedin.com/in/geekinside).

```
mustafa-saad-profile/
├── index.html      all content lives here
├── css/style.css   design system: tokens → components → animation
├── js/app.js       theme, reveals, counters, tilt, typing, nav
├── img/profile.jpg the portrait  ← swap this one file
└── README.md
```

## Run it

Open `index.html` in any browser. There is no build step.
For a local server: `python3 -m http.server 8000` then visit `http://localhost:8000`.

---

## Swap the portrait ← do this first

The hero loads **`img/profile.jpg`** and nothing else references it.

1. Save your current LinkedIn photo (the studio shot with the server-room backdrop).
2. Rename it `profile.jpg` and drop it over `img/profile.jpg`.

That's the whole change — no code edits. The shipped file is your old 2018 photo as a
placeholder; it's a candid side profile and it's the weakest thing on the page.

**For best results:** portrait crop around 4:5 (e.g. 880 × 1100), face in the upper third,
under ~300 KB. If your photo is square, adjust `object-position` in `css/style.css`
(search `.portrait__frame img`) to move the crop.

---

## Publishing — this also fixes your dead link

Your LinkedIn contact info points at `mmsaad.github.io`, which currently returns **404**
because no repository is serving it. Publishing this site there fixes the link:

1. Create a repo named exactly **`MMSaad.github.io`** on your GitHub account.
2. Push the contents of this folder to the `main` branch (index.html at the repo root).
3. Settings → Pages → Source: `main` / root.

Within a minute `https://mmsaad.github.io` is live and the LinkedIn link resolves.

Any static host works equally well — Netlify, Vercel, Cloudflare Pages, Firebase Hosting,
or a Cloud Storage bucket behind Cloud CDN.

---

## What's in the design

**Glass system.** Every surface is one `.glass` primitive: translucent fill,
`backdrop-filter` blur + saturation, a hairline border and a top sheen gradient.
Light and dark are the same components with a different token set.

**Theme.** Follows the OS by default; the toggle overrides it and the choice persists in
`localStorage`. An inline script in `<head>` applies the stored theme before first paint,
so there's no flash. Every storage call is wrapped in `try/catch` for private-mode browsers.

**Animation.**

| Effect | Where |
|---|---|
| Drifting aurora field | four blurred blobs, 24–35s loops |
| Cursor spotlight | radial glow tracking the pointer (desktop only) |
| Scroll reveal | IntersectionObserver, auto-staggered by sibling index |
| Animated counters | metrics + newsletter stats, eased with `easeOutExpo` |
| 3D pointer tilt | cards rotate ±5° and pick up an edge glow under the cursor |
| Typing headline | cycles four role phrases |
| Conic halo | rotating gradient behind the portrait |
| Scroll progress | gradient bar at the top of the viewport |
| Tech marquee | infinite scroll, pauses on hover |

**`prefers-reduced-motion` is fully honoured** — all animation stops, reveals resolve to
visible, the spotlight is removed. Verified: 0 hidden elements under reduced motion.

---

## Content notes

Everything comes from the live LinkedIn profile, with the editorial decisions from the
cleanup review already applied:

- **27 LinkedIn projects → 9 entries.** The ten G.Y.H app listings are merged into one
  "Gaboul Ya Hajj — Umrah operations platform" card; the three Manasikana entries into one;
  the three 2017 ministry systems into one.
- **App Store / Play links preserved** from the original site — they're on the Gaboul card,
  and LinkedIn doesn't carry them. The five flagship platforms are private client systems,
  so they say so rather than linking nowhere.
- **22 certifications → 11.** MongoDB path sub-modules collapsed into the two real
  credentials; the KodeKloud duplicate of AWS AI Practitioner dropped.
- **No percentage skill bars.** The old site claimed "Frontend Development 100%". Skills are
  grouped tag sets now; the numbers that carry weight are the scale metrics instead.
- **KCNA is not claimed anywhere** — there's no credential to back it.
- **Contact:** Jeddah, `dev.m.saad@gmail.com`, LinkedIn and GitHub. The old Cairo address,
  Egyptian phone number, Skype handle, Facebook link and the stale
  `linkedin.com/in/engmustafamuhammad` URL are all gone.

### Still worth adding

The `Private client system — walkthrough available on request` lines are honest but thin.
If you can clear it with GAMA, the strongest additions would be **cost reduction from the
serverless migration, uptime during Hajj peak, p95 gate-validation latency, and team size**.
Those numbers would sit naturally in each project's `.proj__scale` chip row.

---

## Editing

- **Content:** `index.html` only. Sections are commented in banner blocks.
- **Colours:** the token blocks at the top of `css/style.css` — `:root` is light,
  the two dark blocks mirror it. Change `--brand-1..4` to reshape every gradient at once.
- **Add a metric:** copy a `.metric` block; `data-count`, `data-suffix` and `data-dec`
  drive the counter.
- **Add a project:** copy an `<article class="proj glass glass--hover tilt rv">` block.
  Add `proj--wide` to make it span the full row.

## Browser support

Chrome/Edge 105+, Safari 15.4+, Firefox 121+ (needs `backdrop-filter` and
`color-mix()`). Older browsers get a solid-surface fallback — readable, less glassy.

## Dependencies

None. The original shipped jQuery, Bootstrap 3, Waypoints, a validator and two icon fonts —
about 10 MB of the 12 MB zip. All of it is gone; icons are inline SVG and the only network
request is Google Fonts (remove the `<link>` in `<head>` to go fully offline).
