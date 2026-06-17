# DPW Website — Session Handoff

Use this file to initialize a new chat.

---

## Project Overview

**Client:** Digital Public Works (DPW) — 501(c)(3) nonprofit
**Product:** Verify My Income (VMI) — income verification service for state benefit agencies
**Work:** Standalone single-file HTML prototypes. NOT a Next.js app.
**Workspace:** `/Users/bellabesuud/Desktop/dpw-test/`

---

## Active Files

| File | Purpose |
|------|---------|
| `FINAL PAGES/home-FINAL.html` | Home page — all edits go here |
| `FINAL PAGES/product-FINAL.html` | Product/VMI page — all edits go here |
| `FINAL PAGES/impact-FINAL.html` | Impact page — all edits go here |
| `impact-standalone.html` | Self-contained impact page (shared.css inlined) — for client email only |
| `shared.css` | Shared stylesheet (656 lines) — linked from all FINAL pages as `../shared.css` |

Everything else (older versioned files) is reference only. Do not edit them.

---

## Standing Rules (never break these)

1. Copy from `DPW Website Copy.docx` must be used **verbatim** — no paraphrasing.
2. All pages are **standalone single-file HTML** — no external CSS/JS, no build step.
3. No raw hex values or `rgba()` in CSS — CSS variables only. `#000` is the sole exception.
4. Box-shadows and divider borders use `var(--light-al)` (solid color — never rgba).
5. Main HTML files use **relative image paths**. Never embed base64 images. Only generate `*-email.html` when explicitly asked.
6. Logos are **inline SVG** — not `<img>` tags.
7. Always `Read` a file before editing it.

---

## File Structure

```
dpw-test/
├── FINAL PAGES/
│   ├── home-FINAL.html          ← active home page
│   ├── product-FINAL.html       ← active product page
│   └── impact-FINAL.html        ← active impact page
├── impact-standalone.html       ← client email version (shared.css inlined)
├── shared.css                   ← shared stylesheet (linked as ../shared.css from FINAL PAGES/)
├── public/
│   └── images/
│       ├── Product hero image.png   ← product hero (right column)
│       ├── howVMI-home.png          ← How VMI Works diagram (home page)
│       └── product-verify.png
├── DPW Website Copy.docx        ← source of truth for ALL copy
├── Brand Guide/                 ← color palette, visual identity
└── summary.md                   ← this file
```

Image paths from `FINAL PAGES/` are `../public/images/filename.png`.
Unsplash images (impact page heroes, case study photos) are external CDN URLs — no local file needed.

To extract copy: `pandoc "DPW Website Copy.docx" -o /tmp/webcopy.md`

---

## Design System

### Color Tokens
```css
--forge:             #1E272E;   /* primary dark — nav/footer bg */
--copper:            #C77234;   /* brand copper — large text only on white (3.57:1, not AA for small text) */
--deep-copper:       #9F5528;   /* small text on white = 5.52:1 ✅ AA */
--steel:             #3A4E5C;   /* body text secondary — 8.66:1 on white ✅ */
--park-green:        #316844;   /* checkmarks/positive — 6.57:1 on white ✅ */
--verdigris:         #56A374;   /* accent green — decorative/large text only (3.05:1) */
--aluminum:          #A9B0B6;   /* muted grey — decorative only, fails AA on white */
--light-al:          #D0D5D8;   /* borders, dividers, box-shadows */
--white:             #FFFFFF;
--cool-white:        #F6F7F8;   /* alternating section bg */
--white-gold:        #D4CAA8;
--molten-gold:       #E9A030;
--rose-gold:         #DEB0A0;   /* nav current-page link, footer demo link */
--pale-verdigris:    #EBF5F0;
--pale-verdigris-rule: #CDDFD8;
```

### Type Scale (identical in both files)
```css
--t-display:         clamp(44px, 5.5vw, 68px);   /* Space Grotesk 700 — hero h1 ONLY */
--t-headline:        clamp(28px, 3.5vw, 44px);   /* Space Grotesk 700 — section h2s, stat numbers */
--t-subhead:         clamp(18px, 2.2vw, 24px);   /* Space Grotesk 700 — h3, h4, pull quotes */
--t-body:            17px;                        /* Atkinson 400 — all paragraphs */
--t-small:           15px;                        /* Atkinson 400 — secondary text, footer, card details */
--t-label:           14px;                        /* Space Grotesk 700 — nav, badges, table headers */
--t-button:          14px;                        /* Space Grotesk 700 — buttons */
--t-data:            14px;                        /* Atkinson 400 — table cells ONLY */
--t-decorative-mark: clamp(64px, 9vw, 120px);    /* ornamental quote mark — not a type tier */
```

Every `font-size` in the file must use one of these variables — no hardcoded px values.

### Fonts
- **Space Grotesk** — headings, labels, nav, buttons
- **Atkinson Hyperlegible** — body copy, small text, data

### Button Variants
```css
.btn-forge:   background: var(--forge);   color: var(--white)
.btn-copper:  background: var(--copper);  color: #000
.btn-white:   background: var(--white);   color: var(--deep-copper)
.btn-outline: background: transparent;   color: var(--forge); border: 1.5px solid var(--light-al)
```

### Logos (inline SVG)
- Nav: stacked logo SVG → `.nav-logo svg { height: 40px; width: auto }`
- Footer: extended logo SVG → `.footer-logo svg { height: 32px; width: auto }`

### Scroll Reveal
- Classes `.reveal` + `.vis` via IntersectionObserver
- Delay variants: `.d1` `.d2` `.d3` `.d4`
- Stats section (home page) is **exempt** — static, no reveal classes, no `data-count` attributes

---

## home-FINAL.html — Current State

### Stats Section
Static (no count-up animation). Tall padding:
```css
.stat-cell {
  padding: clamp(72px, 9vw, 108px) clamp(16px, 2.5vw, 28px) clamp(60px, 8vw, 96px);
}
```
HTML: no `reveal` classes, no `data-count`/`data-prefix`/`data-suffix` attributes.

### How VMI Works — 2-column layout
Heading in `.how-header` sits **above** the grid (not inside it). Grid = steps (left) + image (right):
```css
.how-cols { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(48px, 6vw, 80px); align-items: flex-start; }
.how-right img { width: 75%; height: auto; display: block; }
```
Image: `../public/images/howVMI-home.png`
Mobile: `.how-cols { grid-template-columns: 1fr; }` / `.how-right { order: 2; }`

### CTA Section
Standalone section — **not part of the footer**. Named `.cta-section` throughout (never `footer-cta`).
```css
.cta-section { background: var(--copper); padding: clamp(72px, 10vw, 112px) clamp(20px, 5vw, 64px); text-align: center; }
.cta-inner   { max-width: 640px; margin: 0 auto; }
```
Classes: `.cta-section`, `.cta-inner`, `.cta-h`, `.cta-sub`

### Footer
Left column: logo + tagline + demo link. Right column: nav links + contact. (Column swap was attempted and reverted — current order is the original.)

---

## product-FINAL.html — Current State

### Hero
AidKit-style 50/50ish grid. Image always bottom-flush, full photo always visible, white space above image.

```css
.hero {
  background: var(--white);
  height: calc(100dvh - 74px);        /* exact viewport height — not min-height */
  display: grid;
  grid-template-columns: 1fr min(640px, 52vw);
  overflow: hidden;
}

.hero-left {
  padding: clamp(48px, 6vw, 80px) clamp(20px, 5vw, 64px) clamp(48px, 6vw, 80px)
           max(clamp(20px, 5vw, 64px), calc((100vw - 1200px) / 2));
  display: flex; flex-direction: column;
  justify-content: center; align-items: flex-start; align-self: center;
}

h1 {
  white-space: nowrap;   /* keeps "Verify My Income" on one line */
  margin-bottom: 16px;
}

/* Constrains tagline to h1 width */
.hero-heading-stack {
  display: table;        /* shrinks to h1's nowrap width */
  margin-bottom: 24px;
}

.hero-tagline { margin-bottom: 0; }

.hero-img {
  overflow: hidden;
  padding-right: clamp(56px, 7vw, 100px);   /* breathing room from right edge */
}

.hero-img img {
  width: 100%; height: 100%;
  object-fit: contain;
  object-position: bottom center;   /* bottom-flush, white space above, never cropped */
  display: block;
}
```

Mobile (`max-width: 1024px`):
```css
.hero          { grid-template-columns: 1fr; height: auto; }
.hero-left     { padding: clamp(40px, 5vw, 64px) clamp(20px, 5vw, 48px); }
h1             { white-space: normal; }
.hero-img      { aspect-ratio: 4/3; max-height: 420px; order: 2; overflow: hidden; padding-right: 0; }
```

Hero HTML:
```html
<section class="hero">
  <div class="hero-left reveal">
    <div class="hero-heading-stack">
      <h1>Verify My Income</h1>
      <p class="hero-tagline">The verification service layer between payroll data and state benefit systems</p>
    </div>
    <p class="hero-sub">VMI is an end-to-end verification service...</p>
    <a href="/contact" class="btn btn-forge" style="margin-top:8px">Request a Demo</a>
  </div>
  <div class="hero-img reveal d2">
    <img src="../public/images/Product hero image.png" alt="VMI product interface showing income verification on mobile" loading="eager">
  </div>
</section>
```

### Other Product Page Details
- **Section separators:** all `border-top: 1px solid var(--light-al)` have been removed from every section
- **Comparison table:** has gray outline — `table.ct { border: 1px solid var(--light-al); border-collapse: collapse; }`
- **Path to a pilot heading:** left-aligned — `.pilot .section-h { text-align: left; }`
- **In the Field cards:** paragraph beginning "Structure: the problem, DPW's approach..." removed from both cards
- **Access section:** `display: grid; grid-template-columns: 3fr 2fr; overflow: hidden;`
- **CTA section:** removed from product page (exists on home page only)

---

## impact-FINAL.html — Current State

### Section backgrounds
| Section | Background |
|---------|-----------|
| Hero | `--white` |
| Stats row | `--white` |
| Families ("From hours of paperwork…") | `--cool-white` |
| Voices carousel ("Real people…") | `--white` |
| Voice cards | `--cool-white` |
| Deployed / Case studies | `--cool-white` |
| Year in Review | `--white` |
| Funding model | `--cool-white` |
| CTA | `--copper` |

### Stat bar animation
Same as home page — orange bar animates left-to-right on scroll via IntersectionObserver adding `.vis`. All `.stat-cell` elements have `.reveal` and delay classes (`.d1`–`.d4`).

### Voices carousel
- Peek-style: 2 full cards + half of 3rd visible
- Card width formula: `Math.floor((visW - GAP) / 2.5)` where `GAP = 20`
- Square dot indicators, back/forward arrow buttons
- Extra spacing between heading and carousel: `margin-bottom: 48px` on `.voices-inner`

### Case study cards
```html
<a href="#" class="case-card reveal d1">...</a>
```
```css
.case-card { text-decoration: none; color: inherit; }
.field .section-h { margin-bottom: 48px; }  /* extra padding before case grid */
```

### Footer
No `footer-sub` paragraph. Uses `footer-cta-block` class. Matches home page universal footer exactly.

---

## Pending / Not Yet Implemented

- Pages still to build: Insights, About, Careers, Contact
- Case study content: both PA and AZ cards say "forthcoming — pending approval"
- Annual report PDF: `href="#"` placeholder — replace with final PDF URL before launch

---

## Technical Notes

- `max(clamp(), calc((100vw - 1200px) / 2))` — left padding formula for full-bleed sections that replicates centered-layout auto-margin math
- `clamp()` used throughout for fluid spacing and typography
- `display: table` on `.hero-heading-stack` — shrinks to h1's intrinsic nowrap width, constraining tagline beneath it
- `object-fit: contain; object-position: bottom center` — shows full image, bottom-flush, white space above
- IntersectionObserver for `.reveal` / `.vis` scroll animations
- Unsplash CDN: `https://images.unsplash.com/photo-[id]?auto=format&fit=crop&w=N&q=80` — get the ID from the `og:image` meta tag, not the page URL slug. Skip any `plus.unsplash.com` URLs (paid).

---

## How to Create a Client-Ready Standalone Version

When sending a page to a client via email, inline `shared.css` into a single `<style>` block and remove the `<link rel="stylesheet" href="../shared.css">` tag. Save as `*-standalone.html` or `*-email.html` in the root `dpw-test/` folder (not inside `FINAL PAGES/`).

**Already done:** `impact-standalone.html` exists at the root level.

Google Fonts CDN and Unsplash image URLs remain as-is — they require internet but that's fine for an email preview.

Only create standalone versions when explicitly asked — main `FINAL PAGES/` files always link to `../shared.css`.
