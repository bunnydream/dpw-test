# DPW Website Project — Session Summary

Use this file to initialize a new Claude chat. Paste it at the start of a new conversation.

---

## Project Overview

**Client:** Digital Public Works (DPW) — a 501(c)(3) nonprofit
**Product:** Verify My Income (VMI) — a nonprofit alternative to commercial income verification for state benefit agencies
**Goal:** Design and build a homepage for DPW's website

All work is standalone HTML prototype files — NOT the Next.js app. Files are saved to `/Users/bellabesuud/Documents/DPW-Project/`.

---

## Standing Rules (apply to every session, always)

- **Always edit within the existing file** unless a new version is explicitly requested
- **New versions → new file** (e.g. `-v2.html`) unless told otherwise
- **Website copy:** use `DPW Website Copy.docx` EXACTLY — no invented text, no paraphrasing, no changes. Pay attention to tracked-change comments in the doc.
- **WCAG 2.1 AA compliance** — non-negotiable on every file. See color constraints below.
- **Logo:** always use the Stacked Logo SVG (not Extended Logo). See logo paths below.
- **Fonts:** Google Fonts — Space Grotesk (weights 300 + 700 ONLY) + Atkinson Hyperlegible (400 + 700)
- **Responsive:** mobile-first, hamburger nav at 768px breakpoint
- **Animations:** IntersectionObserver for scroll reveals, requestAnimationFrame for stat counters, row-by-row table reveals

---

## DPW Color Palette

| Variable | Hex | Notes |
|---|---|---|
| `--forge` | `#1E272E` | Primary dark — white on forge = ~18:1 ✅ |
| `--copper` | `#C77234` | Brand copper — **only safe for large text on white** (3.01:1 fails AA for small text) |
| `--deep-copper` | `#9F5528` | White on deep-copper = 4.8:1 ✅ passes AA all sizes |
| `--steel` | `#3A4E5C` | Mid-dark blue-grey |
| `--green` | `#316844` | White on green = ~12:1 ✅ |
| `--verdigris` | `#56A374` | **NEVER use as text color on copper background** — fails WCAG |
| `--white-gold` | `#D4CAA8` | Warm accent |
| `--molten` | `#E9A030` | Warm amber accent |
| `--rose-gold` | `#DEB0A0` | Soft accent |
| `--aluminum` | `#A9B0B6` | Muted grey |
| `--light-al` | `#D0D5D8` | Light grey |
| `--white` | `#FFFFFF` | |
| `--cool-white` | `#F6F7F8` | |

**Key WCAG rules:**
- Copper `#C77234` on white = 3.01:1 — large text only (≥24px regular or ≥18.67px bold)
- Verdigris `#56A374` on copper `#C77234` — FAILS. Do not use.
- For "Live — Statewide" pills on copper backgrounds: use `color: white` + `background: rgba(0,0,0,0.28)` → ~5.2:1 ✅
- Forge on verdigris = ~4.93:1 ✅
- White on forge `#1E272E` = ~18:1 ✅

---

## Logo Paths

Always use **Stacked Logo** SVG at height `36px` in nav.

```
Light version (for light/white nav backgrounds):
./Logo/Stacked Logo/SVG/Light/Duo-copper.svg

Dark version (for dark nav backgrounds):
./Logo/Stacked Logo/SVG/Dark/Duo-copper.svg
```

Extended Logo files exist but are NOT used in the nav (they were the broken logos that were fixed).

---

## File Map

### `Home page/` subfolder — Active prototypes (currently being designed)

| File | Style | Logo version | Status |
|---|---|---|---|
| `Home page/home-copper.html` | Copper — primary design direction | Light stacked | Active, recently edited |
| `Home page/home-dark-cinematic.html` | Dark/cinematic | Dark stacked | Active |
| `Home page/home-editorial.html` | Magazine/editorial | Light stacked | Active |
| `Home page/home-organic.html` | Organic/warm/rounded | Light stacked | Active, WCAG fix applied |

**Recent edits applied to all 4 "Home page/" files:**
- Fixed broken nav logo (was using Extended Logo path, now uses Stacked Logo at 36px)
- home-copper.html + home-organic.html: fixed WCAG fail — "Live — Statewide" verdigris text on copper bg → now white text on `rgba(0,0,0,0.28)` pill

### Root-level older iterations (for reference only, not actively being worked on)

- `home-style6-copper.html` — base copper design before "Home page" folder work began
- `home-style1-civic.html`, `home-style2-bold.html`, `home-style2-bold-v2.html`, `home-style4-opensource.html`, `home-style5-warmth.html`, `home-style5-warmth-v2.html`, `home-option1-brutalism.html` — earlier design explorations
- `home-v1.html` — original v1
- `about.html` — about page (separate)

### ⚠️ Files that need to be recreated

The following files were worked on in prior sessions but did not persist to the project folder. They need to be rebuilt:

| File | Description |
|---|---|
| `home-style6-copper-v2.html` | Edited version of home-style6-copper.html with: hero h1 font-size reduced to `clamp(36px,5vw,68px)`, hero overline span deleted, hero h1 made single weight/color (no alternating light/dark words), orange sidebar removed from stories-outro, compare table copy fixed ("benefits specific" not "benefits-specific", "applicants are redirected to existing options.") |
| `home-style-B-editorial.html` | Option B: Magazine/Editorial aesthetic homepage |
| `home-style-C-organic.html` | Option C: Organic/Human aesthetic homepage — warm cream bg `#FAF8F4`, rounded cards (20px radius), blob hero, timeline How It Works, speech-bubble quotes, green proven section, copper Trusted By section |

---

## Source Files

| File | Purpose |
|---|---|
| `DPW Website Copy.docx` | **THE source of truth for all copy.** Use pandoc to extract: `pandoc --track-changes=all "DPW Website Copy.docx" -o /tmp/webcopy.md` |
| `DPW Brand Guide 2026.pdf` | Brand guidelines, color palette, visual identity |
| `Logo/` | All logo assets (see logo paths above) |
| `Fonts/` | Local font files |
| `CLAUDE.md` | Short existing project note (does not supersede this file) |

---

## Key Copy / Text Notes

- Hero headline (exact): **"What if income verification worked for families and states instead of vendors?"**
- Hero sub (paraphrase check): mentions "Open source. At cost. No vendor lock-in." — this phrase does NOT appear as a standalone line/badge in the copy doc, do not include as a hero overline
- Compare table cell: "benefits specific" (no hyphen)
- Compare table cell: "applicants are redirected to existing options." (full sentence — do not truncate)
- Stat figures: Under 5 min / 85% / 93% / 7.5×
- Live states: Pennsylvania (PA DHS) + Arizona (AZ DES)
- Funders: DRK Foundation, AARP Foundation, Families and Workers Fund, Pritzker Children's Initiative

---

## Tech Stack Notes

- Standalone HTML files — single file, no external CSS/JS dependencies except Google Fonts
- Google Fonts import: `Space Grotesk:wght@300;700` + `Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400`
- No framework, no build step — open directly in browser
- Next.js app also exists in the repo (`app/`, `package.json`) but is separate from the prototype work
