# DPW Website — Session Summary

## Project Overview
Standalone HTML pages for Digital Public Works (DPW), a nonprofit. No build step. One shared stylesheet. Pages link to `../shared.css`.

**Files:**
- `/Users/bellabesuud/Desktop/dpw-test/shared.css` — all shared/reusable CSS
- `/Users/bellabesuud/Desktop/dpw-test/FINAL PAGES/home-FINAL.html`
- `/Users/bellabesuud/Desktop/dpw-test/FINAL PAGES/product-FINAL.html`
- `/Users/bellabesuud/Desktop/dpw-test/FINAL PAGES/impact-FINAL.html`
- `/Users/bellabesuud/Desktop/dpw-test/FINAL PAGES/about-FINAL.html`
- `/Users/bellabesuud/Desktop/dpw-test/FINAL PAGES/contact-FINAL.html`
- `/Users/bellabesuud/Desktop/dpw-test/FINAL PAGES/careers-FINAL.html`
- `/Users/bellabesuud/Desktop/dpw-test/CLAUDE.md` — project notes (logo assets, brand guide, .docx copy)
- `/Users/bellabesuud/Desktop/dpw-test/DPW Website Copy.docx` — authoritative copy, use EXACTLY
- `/Users/bellabesuud/Desktop/dpw-test/DPW Brand Guide 2026.pdf` — brand guidelines

**Assets:**
- `public/images/` — `Product hero image.png`, `howVMI-home.png`, `meeting.jpg`, `people-meeting-laptops.png`, `product-verify.png`
- `public/headshots/` — `Michael.png`, `PatriciaHeadshot-BW.png`, `Kali.png`, `Cle.png`, `Jeff-BW.png`, `Tatiana.png`, `ErikaTom_BW.jpg`, `Anna Banchik.png` (space in filename → `Anna%20Banchik.png` in src), `Runako_bw.jpg`

**Image note:** Unsplash CDN URLs with alphanumeric short IDs (e.g. `photo-yxqVPJFAYHg`) do NOT work — use local images from `public/images/` instead.

---

## CSS Architecture
**Rule:** Shared/reusable styles live in `shared.css`. Page `<style>` blocks contain only page-specific overrides.

### Design Tokens (CSS variables in shared.css)
- Colors: `--forge` (dark navy), `--copper`, `--rose-gold`, `--steel` (body text grey), `--light-al` (light silver), `--white`, `--cool-white` (off-white)
- Type scale: `--t-display`, `--t-headline`, `--t-subhead`, `--t-body`, `--t-small`, `--t-label`, `--t-button`, `--t-data`
- `--t-display: clamp(44px, 5.5vw, 68px)` — Space Grotesk 700, hero h1 only

### Base Typography (shared.css)
```css
h1 { font: 700 var(--t-display) Space Grotesk; line-height: 1.04; letter-spacing: -0.022em; color: var(--forge); margin-bottom: 100px; max-width: 19ch; }
/* h2, h3: Space Grotesk 700, forge color */
.section-h { margin-bottom: 32px; } /* h2 in section headers */
```

---

## Shared Components (all in shared.css)

### Body Text
```css
.body-text p          /* wrapper for 2+ paragraphs; non-last: mb 24px, last-child: mb 40px; max-width: 68ch */
.body-p               /* standalone paragraph; mb 40px */
```
- `.section-intro` was deleted — replaced with `.body-p` in all pages
- Universal body text max-width: **68ch**

### Pullquote
```css
.pullquote            /* max-width: 68ch, border-top: 2px copper */
.pq-text              /* Space Grotesk 700, forge color */
.pq-text em           /* copper, non-italic */
```

### Inline Note
```css
.inline-note          /* border-left: 3px var(--light-al), padding: 16px 24px */
.inline-note--rose    /* modifier: border-color → var(--rose-gold) */
```

### Buttons
```css
.btn .btn-forge       /* primary CTA */
.btn .btn-cta         /* secondary */
```

### Hero (shared base)
```css
.hero-sub             /* body text below tagline; mb: 24px */
.hero-tagline         /* Space Grotesk 700, subhead size, steel color */
.hero-heading-stack   /* wraps h1 + hero-tagline */
```

### Section Layout
```css
.section-pad          /* vertical section padding */
.section-inner        /* centered content container, max-width: 1200px */
.section-h            /* h2 with mb: 32px */
.ct-header            /* flex row: heading + button, justify: space-between */
```

### Team Grid (shared.css — used on about page)
```css
.team-grid            /* grid, repeat(3, 1fr), gap: 2px base */
.team-card            /* individual person card */
.team-photo           /* headshot container */
.team-info            /* text block: padding clamp(16px, 2vw, 20px) 0 0 0; text-align: left */
.team-name            /* h3 */
.team-title-label     /* span, copper color */
.team-bio             /* body copy */
```
About page overrides `.team-grid` in its `<style>` block:
```css
.team-grid {
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(36px, 4vw, 56px) clamp(28px, 3vw, 40px);
}
.team-info { padding: clamp(16px, 2vw, 20px) 0 0 0; }
@media (max-width: 1024px) { .team-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px)  { .team-grid { grid-template-columns: 1fr; } }
```
Team reveal stagger (3-col layout, row by row):
- Row 1: Michael `reveal`, Patricia `reveal d1`, Kali `reveal d2`
- Row 2: Cle `reveal`, Jeff `reveal d1`, Tatiana `reveal d2`
- Row 3: Erika `reveal`, Anna `reveal d1`, Runako `reveal d2`

### Funder Strip (shared.css — used on about page)
```css
.funder-strip         /* flex row of badges */
.funder-badge         /* pill link */
```

### Form Elements (shared.css — used on contact page)
```css
.form-stack           /* flex column container */
.form-group           /* label + input pair */
.form-label           /* label */
.form-input           /* text/email/tel input */
.form-select          /* select */
.form-textarea        /* textarea */
```

### Contact Layout (shared.css — used on contact page)
```css
.contact-pair         /* two-col grid: sticky desc + form card */
.contact-desc         /* sticky left column */
.contact-label        /* section eyebrow */
.contact-form-card    /* white card wrapping form */
```

### Careers (shared.css)
```css
.openings-empty       /* empty state for no open positions */
```

### Steps (product page)
```css
.steps-line           /* left: 35px — vertical copper gradient line */
.step                 /* grid: 72px 1fr */
.step-badge           /* 72px circle */
.step-content         /* cool-white card */
```

### Stat Row
```css
.stat-row             /* grid; shared animation base */
.stat-cell::before    /* copper bar, scaleX 0→1 on .vis */
.stat-num             /* Space Grotesk 700, forge */
.stat-label           /* steel, lowercase */
```
Pages override: `grid-template-columns`, padding, background — home: 4 cols, impact: 5 cols.

### Quote Carousel (impact only)
```css
.voice-card, .voice-mark, .voice-text, .voice-attr
.carousel-btn         /* 44px circle, background: var(--cool-white) */
```

---

## Per-Page Notes

### home-FINAL.html
- Hero h1: uses shared (max-width: 19ch, mb: 100px)
- Stat row: 4 columns, cool-white background
- Inline note: `inline-note inline-note--rose`
- `.hero-sub { max-width: 54ch }`

### product-FINAL.html
- Hero h1 override: `white-space: nowrap` ("Verify My Income" stays 1 line)
- `.hero-tagline` trick: `max-width: 1px; min-width: 100%` constrains tagline to h1 width
- Pilot note left border aligns with steps-line: `margin-left: max(35px, calc(50% - 375px))`
- Access section: `grid-template-columns: 3fr 2fr`

### impact-FINAL.html
- Hero grid: `3fr 2fr`
- Stat row: 5 columns, white background

### about-FINAL.html
- Hero: `grid-template-columns: 9fr 7fr`, h1 "Our Mission", image `../public/images/people-meeting-laptops.png`
- Story section: h2 "How Digital Public Works started", image `../public/images/meeting.jpg`, two founding paragraphs, no pullquote
- Team: 9 people, 3-col grid, real headshots from `../public/headshots/`, text left-aligned flush with image

### contact-FINAL.html
- Three stacked contact sections (State Partners / cool-white, Funders / white, General + Address / cool-white)
- Each section: sticky description column + form card

### careers-FINAL.html
- Hero: `9fr 7fr` split
- "Who We Are" section: 6-card benefits grid
- Open Positions: empty state with `careers@digitalpublicworks.org`

---

## Scroll Reveal
```
.reveal + IntersectionObserver → .vis
Delay classes: .d1, .d2, .d3, .d4 (all confirmed in shared.css)
```
Each page has the IntersectionObserver in its `<script>` block.

---

## Max-Width Reference
| Value | Where |
|-------|-------|
| 68ch | `.body-text p`, `.pullquote` — universal body text |
| 56ch | `.access-left .body-text p` — product narrow column |
| 54ch | `.footer-sub`, `.hero-sub` on home |
| 52ch | `.ps-right-intro` — product right column |
| 50ch | `.q-text-sm` — testimonial quote (home) |
| 44ch | `.hero-note` — hero aside note (home) |
| 38ch | `.hero-tagline` — impact |
| 34ch | `.footer-tagline` |
| 80ch | `.vq-a` — vendor Q&A answer (intentionally wide) |

---

## Key Decisions / Things to Know
- `ch` unit = width of "0" in current font. 68ch ≈ 11 words/line (client target).
- `.section-intro` deleted everywhere — all uses replaced with `class="body-p reveal d1"`.
- `btn-cta-white` and `btn-annual` deleted.
- Carousel arrow buttons: `var(--cool-white)` background.
- Stat row copper bar animation in shared.css; pages override layout/sizing only.
- Product pilot note left border aligns with steps-line: `margin-left: max(35px, calc(50% - 375px))`.
- Unsplash CDN with alphanumeric short IDs doesn't work — use local images only.
- `Anna Banchik.png` has a space — use `Anna%20Banchik.png` in src attributes.
