# DPW Website — Project Summary

Use this file to initialize a new chat. Paste it at the start of a new conversation.

---

## Project Overview

**Client:** Digital Public Works (DPW) — a 501(c)(3) nonprofit
**Product:** Verify My Income (VMI) — income verification service for state benefit agencies
**Work:** Standalone single-file HTML prototypes. **NOT** the Next.js app.
**Workspace folder:** `/Users/bellabesuud/Desktop/dpw-test/`

---

## ⚠️ Most Recent Work — product-v5.html

The active product page is **`/Users/bellabesuud/Desktop/dpw-test/Product page/product-v5.html`**.
This file combines v2 (content/nav/table/footer) + v3 (integration cards) + v4 (accordion/pilot/field cards).

### Current state of every section

**Hero**
- `min-height: calc(100dvh - 74px)`, white bg
- Two-column grid; CTA = `.btn.btn-forge` ("Request a Demo")
- Hero image: `src="../public/images/Product hero image.png"` (local PNG)
- Image CSS: `.hero-img { overflow: visible; display: flex; align-items: flex-end; align-self: stretch; }` — bottom of image aligns with bottom of viewport
- `.hero-img img { width: 100%; height: auto; object-fit: contain; object-position: center bottom; }`

**Built to Fit Your Systems** (`#integration`)
- Section bg: `--cool-white`
- `.io-card`: `border: none`, no hover animation
- `.io-top` (photo area): `background: var(--light-al)`, `aspect-ratio: 4/3`, no `border-bottom`, white image-frame SVG at 55% opacity — acts as gray photo placeholder
- `.io-pill`: `color: var(--deep-copper)`, uppercase 14px bold — text reads "Option 1 / Option 2 / Option 3" (no leading zeros)
- No checkmark lists in cards

**The Verification Problem** (`#the-problem`)
- Sticky diagram left, accordion right
- Accordion hover: `.ps-acc-trigger:hover .ps-acc-title { color: var(--deep-copper) }`
- "How VMI solves it" label (`.ps-acc-sol-label`): `color: var(--park-green)` (WCAG AA safe — ~6.3:1)

**Accessible by Design** (`#accessible`)
- Stat box (`.access-stat`): no outer border; `border-left: 4px solid var(--copper)` only

**The Path to a Pilot** (`#pilot`)
- Vertical step design (v2 style), `max-width: 820px; margin: 0 auto` (centered)
- `.step-badge`: `background: #FBF0E8` (pale copper), `border: none`, `aria-hidden="true"`
- `.step-n` (numbers "01"–"04"): `color: var(--copper)` — borderline WCAG at 18px but large text at most viewports
- `.step-lbl` ("STEP"): `color: var(--steel)` ✅ WCAG AA
- `.step-content`: `background: var(--cool-white)`, `border: none`, no hover animation

**In the Field** (`#field`)
- `.case-card`: `border: none`
- Copper top-line animation: `::before` pseudo, `height: 5px`, `scaleX(0→1)` on hover
- Photos: `height: 260px; margin-top: auto` (flush bottom, equal height)

**Traditional Approaches vs. VMI** (`#compare`)
- `table.ct`: `border: none` (no outer border)
- Row dividers: `border-bottom: 1px solid var(--light-al)` — visible on both columns
- VMI column (`.ct-vmi`): `background: #EBF5F0` (pale verdigris)
- Header badges: filled circles — `.ct-x-badge { background: #e05252 }`, `.ct-check-badge { background: var(--verdigris) }` with inline SVG stroke="white"

**Questions to Ask Any Income Verification Vendor** (`#vendor-q`)
- Chevrons: `width="28" height="18" viewBox="0 0 14 9"`, `stroke-width="1.25"`
- Hover: `.vq-trigger:hover .vq-q { color: var(--deep-copper) }`

### WCAG AA status in product-v5.html
| Element | Color | Contrast | Status |
|---|---|---|---|
| `.io-pill` "OPTION 1" | deep-copper on white | ~5.4:1 | ✅ AA |
| `.ps-acc-sol-label` | park-green on white | ~6.3:1 | ✅ AA |
| `.ps-acc-title` hover | deep-copper on white | ~5.4:1 | ✅ AA |
| `.vq-q` hover | deep-copper on white | ~5.4:1 | ✅ AA |
| `.step-lbl` "STEP" | steel on #FBF0E8 | ~6.8:1 | ✅ AA |
| `.step-n` "01"–"04" | copper on #FBF0E8 | ~3.2:1 | ⚠️ borderline — large text only |
| `btn-copper` text | #000 on copper | ~5.9:1 | ✅ AA |
| `nav-cta` text | #000 on copper | ~5.9:1 | ✅ AA |

---

## home-FINAL.html — recent changes

File: `/Users/bellabesuud/Desktop/dpw-test/FINAL PAGES/home-FINAL.html`

- `.ct-check` updated to filled circle: `background: var(--verdigris); width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;`
- All `<span class="ct-check">✓</span>` replaced with inline SVG checkmark (`stroke="white"`)

---

---

## File map

```
dpw-test/
├── CLAUDE.md                              ← project instructions
├── summary.md                             ← this file
├── DPW Website Copy.docx                  ← authoritative copy — use VERBATIM
├── Brand Guide/                           ← brand guidelines, color palette
├── public/
│   ├── images/
│   │   └── Product hero image.png         ← hero image for product page
│   └── logo/
│       ├── extended-light/Duo-copper.svg
│       ├── extended-dark/Duo-aluminum.svg
│       ├── extended-dark/Duo-copper.svg
│       └── stacked-dark/Duo-copper.svg
├── FINAL PAGES/
│   └── home-FINAL.html                    ← working file for home page — all edits here
├── Home page/
│   └── home-shareable.html                ← client-ready: logos embedded as inline SVG
└── Product page/
    ├── product-v5.html                    ← ✅ ACTIVE WORKING FILE
    ├── product-v4.html                    ← reference only
    ├── product-v3.html                    ← reference only
    └── product-v2.html                    ← reference only (v2 pilot/step design source)
```

**product-v5.html is the active product page.** All product edits go here.
**home-FINAL.html is the working file for the home page.** All edits go here.
**home-shareable.html** is generated from home-FINAL.html with logos embedded inline — recreate when sending to clients (relative paths break outside the folder).

---

## Design system

### Fonts
- **Space Grotesk 700** — headings, labels, nav, buttons
- **Atkinson Hyperlegible 400/700** — body text, table cells

Google Fonts import:
```
Space+Grotesk:wght@300;700&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400
```

### Color tokens
```css
--forge:       #1E272E;   /* primary dark — nav/footer bg */
--copper:      #C77234;   /* brand copper — large text only on white (3.57:1, not AA) */
--deep-copper: #9F5528;   /* small text on white = 5.52:1 ✅ AA */
--steel:       #3A4E5C;   /* body text secondary — 8.66:1 on white ✅ */
--park-green:  #316844;   /* checkmarks/positive — 6.57:1 on white ✅ */
--verdigris:   #56A374;   /* accent green — decorative/large text only (3.05:1) */
--aluminum:    #A9B0B6;   /* muted grey — decorative only, fails AA on white */
--light-al:    #D0D5D8;   /* borders, dividers, box-shadows */
--white:       #FFFFFF;
--cool-white:  #F6F7F8;   /* section alternating bg */
--white-gold:  #D4CAA8;
--molten-gold: #E9A030;
--rose-gold:   #DEB0A0;   /* nav current-page link, footer demo link */
```

**Color rules enforced:**
- Never use raw hex literals or `rgba()` in CSS — always use CSS variables
- `#000` (black) is the only allowed raw hex (not in token list but explicitly permitted)
- No alpha/rgba overlays on brand-colored backgrounds (causes color-picker to read off-palette)
- Box-shadows and divider borders use `var(--light-al)` (solid, no rgba)

### Type scale
```css
--t-display:  clamp(44px, 5.5vw, 68px);   /* hero h1 ONLY */
--t-headline: clamp(28px, 3.5vw, 44px);   /* section h2 */
--t-subhead:  clamp(18px, 2.2vw, 24px);   /* h3, h4, pull quotes */
--t-body:     17px;                        /* paragraphs, card text */
--t-label:    12px;                        /* nav, badges, captions, footer */
--t-data:     14px;                        /* table cells ONLY */
--t-button:   14px;
```

### Key patterns
- **Nav:** forge bg, 74px height, stacked logo (dark), current-page link in rose-gold, hover in verdigris
- **Footer:** forge bg, extended logo (dark), demo link in rose-gold
- **Scroll reveal:** `.reveal` / `.vis` via IntersectionObserver; `.d1`–`.d4` delay classes
- **Responsive:** hamburger nav at 768px, fluid via CSS Grid + `clamp()`
- **Images:** Unsplash CDN `https://images.unsplash.com/photo-[id]?auto=format&fit=crop&w=N&q=80`
  - Skip any URL containing `plus.unsplash.com` (paid, not freely embeddable)
- **WCAG 2.1 AA** required throughout

---

## Button & interaction system

### Button variants
```css
.btn-forge   { background: var(--forge);      color: var(--white) }
.btn-copper  { background: var(--copper);     color: #000 }
.btn-white   { background: var(--white);      color: var(--deep-copper) }
.btn-outline { background: transparent;       color: var(--forge); border: 1.5px solid var(--light-al) }
```

### Hover states
```css
.btn-forge:hover   { background: var(--steel) }
.btn-copper:hover  { background: var(--deep-copper) }   /* color stays #000 */
.btn-white:hover   { background: var(--cool-white) }
.btn-outline:hover { border-color: var(--forge) }
```

### Nav-specific CTA (.nav-cta)
```css
.nav-cta       { background: var(--copper); color: #000 !important; transition: background .15s !important }
.nav-cta:hover { background: var(--deep-copper) !important }
```

### Nav page links
- Default: `var(--light-al)`
- Current page: `var(--rose-gold)`
- Hover (all, including current): `var(--verdigris)`

### Mobile menu (.mobile-menu)
- All links: `color: var(--white)`, hover: `color: var(--verdigris)`
- `.btn-copper` inside mobile menu overrides: `color: #000; font-size: var(--t-button); transition: all .18s`
- `.btn-copper:hover` inside mobile menu: `background: var(--deep-copper); color: #000`

---

## WCAG 2.1 AA — fixes applied to home-FINAL.html

All failures resolved. Key changes made:

| Element | Problem | Fix |
|---|---|---|
| `.btn-copper` text | `#fff` on copper = 3.57:1 ❌ | `color: #000` → 5.88:1 ✅ |
| `.card-n` label (12px) | copper on cool-white = 3.33:1 ❌ | `color: var(--deep-copper)` → 5.15:1 ✅ |
| `.ct-check` ✓ symbol | verdigris on white = 3.05:1 ❌ | `color: var(--park-green)` → 6.57:1 ✅ |

---

## home-FINAL.html — section inventory

| Section | Notes |
|---|---|
| Nav | Forge bg, stacked logo, rose-gold current page, verdigris hover, copper CTA button |
| Hero | Display headline, sub-copy, btn-forge + btn-outline CTAs, Unsplash photo |
| Compare teaser | VMI vs. traditional table; ✓ marks in `var(--park-green)` |
| How VMI works | 3-step cards with hover (copper border + light-al shadow) |
| Stories / Findings | 3 cards with inline SVG icons (copper), `Finding 0X` label in deep-copper |
| Quotes | Featured quote + 2-up pair on cool-white bg |
| Footer CTA | Copper bg, `btn-white` (white bg / deep-copper text / cool-white hover) |
| Footer | Forge bg, extended logo, rose-gold demo link |

**Finding card icons (inline SVG, `fill="currentColor"`, color via `.card-icon { color: var(--copper) }`):**
- Finding 01 — document (file with lines)
- Finding 02 — eye-off (eye with diagonal strike)
- Finding 03 — refresh/loop (circular arrows)

---

## product-v2.html — reference only

Used as the source for the pilot/step vertical design. Do not edit. See product-v5.html for the active version.

---

## How to create a shareable (client-ready) file

When sending any HTML file to a client, logos must be embedded inline because relative paths (`../Logo/...`) break outside the folder. Process:

1. Read both SVG files from `Logo/Stacked Logo/SVG/Dark/Duo-copper.svg` and `Logo/Extended Logo/SVG/Dark/Duo-copper.svg`
2. In the working HTML, change `.nav-logo img` → `.nav-logo svg` and `.footer-logo img` → `.footer-logo svg` in CSS
3. Replace each `<img src="../Logo/...">` with the full inline `<svg aria-label="Digital Public Works" role="img" ...>` content
4. Save as a new file (e.g. `home-shareable.html`)

---

## Pages still to build

- Impact
- Insights
- About
- Careers
- Contact

---

## Standing rules

1. Copy from `DPW Website Copy.docx` must be used **verbatim** — no paraphrasing.
2. All pages are **standalone single-file HTML** — no external CSS/JS, no build step.
3. Tokens and patterns must match `home-v3b.html` exactly.
4. Always `Read` a file before `Edit` or `Write`.
5. Extract copy with: `pandoc "DPW Website Copy.docx" -o /tmp/webcopy.md`
6. No raw hex values or `rgba()` in CSS — use CSS variables only (`#000` is the sole exception).
7. The working file for the home page is `home-FINAL.html`. All edits go there. `home-shareable.html` is a derived output for client sharing only.
