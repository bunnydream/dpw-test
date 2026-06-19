# DPW Website — Session Summary
*Last updated: 2026-06-19*

## Project Overview
Standalone HTML/CSS website for Digital Public Works (DPW), a 501(c)(3) nonprofit. No build step. Single shared stylesheet (`shared.css`) plus page-specific `<style>` blocks in each HTML file.

**Files:**
- `/FINAL PAGES/home-FINAL.html` — canonical home page
- `/FINAL PAGES/about-FINAL.html`
- `/FINAL PAGES/careers-FINAL.html`
- `/FINAL PAGES/contact-FINAL.html`
- `/FINAL PAGES/impact-FINAL.html`
- `/FINAL PAGES/product-FINAL.html`
- `/shared.css` — universal styles, design tokens, all reusable components

---

## Design Tokens (shared.css `:root`)
```
--forge: #1E272E        (near-black, primary text)
--copper: #C77234       (brand copper — large text only on white)
--deep-copper: #9F5528  (darker copper, CTA backgrounds)
--steel: #4A5568        (secondary text)
--aluminum: #8A9BB0     (muted/label text)
--light-al: #C8D4E0     (borders, dividers)
--cool-white: #F7F8FA   (off-white section backgrounds)
--white: #FFFFFF
--verdigris: #56A374    (green accent)
--pale-verdigris: #EBF5F0
```
Type scale: `--t-body`, `--t-small`, `--t-label`, `--t-button`, `--t-subhead`

---

## shared.css Component Inventory
All reusable components live in shared.css. When creating new components, always add them here — never in a page `<style>` block.

- **Nav / mobile menu** — `.nav`, `.nav-logo`, `.nav-cta`, `.mobile-menu`
- **Buttons** — `.btn`, `.btn-white`, `.btn-forge`, `.btn-copper`
- **Section scaffolding** — `.section-pad`, `.section-inner`
- **Step timeline** — `.steps`, `.steps-line`, `.step`, `.step-badge`, `.step-n`, `.step-lbl`, `.step-content`
- **Step scroll (photo-card variant)** — `.how-steps-wrap`, `.how-steps-progress`, `.how-step-row`, `.how-step-card`, `.how-step-img`, `.how-step-body`
- **Stat row** — `.stat-row`, `.stat-cell`, `.stat-num`, `.stat-label` (copper bar animation on scroll via `.vis`)
- **Voices carousel** — `.voices`, `.voices-inner`, `.voices-carousel-outer`, `.voices-carousel-track`, `.voice-card`, `.voice-mark`, `.voice-text`, `.voice-attr`, `.carousel-footer`, `.carousel-dots`, `.c-dot`, `.c-dot--active`, `.carousel-arrows`, `.carousel-btn`
- **Comparison card** — `.comp-card`, `.comp-header`, `.comp-col-head`, `.comp-col-dot`, `.comp-row`, `.comp-cell`, `.comp-dot`
- **Case study grid** — `.field`, `.case-grid`, `.case-card`, `.case-text`, `.case-state`, `.case-photo`, `.case-detail`
- **Content cards** — `.content-card-grid`, `.content-card`, `.content-card-accent`, `.content-card-body`, `.content-card-icon`, `.content-card-label`
- **Pullquote** — `.pullquote`, `.pq-text`, `.pq-text em`
- **Talk CTA banner** — `.talk-cta`, `.talk-cta-lines`, `.talk-cta-inner`, `.talk-cta-heading`, `.talk-cta-sub`
- **Footer** — `.footer-inner`, `.footer-top`, `.cta-section-block`, `.footer-sub`, `.footer-demo`, `.footer-logo`, `.footer-bottom`, `.footer-tagline`, `.footer-contact`, `.footer-links`

---

## Page-Specific Notes

### home-FINAL.html
- **How VMI Works section** (`.how`): 5fr/4fr grid, sticky right image (`.how-right`), scroll progress bar JS (fills copper bar as user scrolls through steps), `min-height: 65vh` per step row for "one step at a time" feel
- **Voices carousel**: cool-white section bg, white cards, white arrow buttons (page-level overrides)
- **CTA section** (`.cta-section`): full-bleed background image (`photo-1651790118309-5ecc129a562d`), 50% black overlay via `::before`, left-aligned content, `min-height: 75vh`
- **Pullquote** in `.model` section: "No vendor lock-in. No black boxes. No surprise overages."
- **"At a glance" heading**: `font-size: clamp(28px, 3vw, 36px)` inline override
- All instances of "Verify My Income" wrapped in `<i>` tags

### impact-FINAL.html
- **Stat row**: 4 stats (was 5 — "6 weeks to go-live" removed), homepage-sized numbers (`clamp(36px, 4.2vw, 56px)`), cool-white bg, aluminum bottom border
- **Alternating section backgrounds** (all page-level exceptions, shared.css untouched):
  - Hero: white → Stats: cool-white → Families: white → Voices: cool-white → Deployed: white → Annual: cool-white → Funding: white
  - Card components flip opposite to their section bg: voice-cards white, case-cards cool-white, content-cards cool-white, comp-card cool-white, report-book white

### product-FINAL.html
- **Talk CTA banner** after "The path to a pilot" section: uses `.talk-cta` component from shared.css, deep-copper bg, decorative diagonal SVG lines in upper-left and lower-right corners, heading "Bring *VMI* to your state →", subtext "Learn about piloting with Digital Public Works"

---

## Universal Footer (all 6 pages)
Same HTML across all pages. Content:
- "Ready to pilot?" (`footer-sub`, white via `.cta-section-block .footer-sub` rule in shared.css)
- "Request a demo today →" (`.footer-demo`, verdigris color, hover → white)
- DPW inline SVG logo (white text + copper mark, height 48px)
- Tagline, email, address, privacy/accessibility links

Footer CSS is universal in shared.css. `cta-section-block` gap is `0`.

---

## Key CSS Conventions
- **Page-specific overrides** go in the page's `<style>` block, never in shared.css
- **New reusable components** always go in shared.css with a `/* ─── COMPONENT NAME ───... */` header comment
- **Left-edge alignment** on wide screens: `padding-left: max(clamp(20px, 5vw, 64px), calc((100vw - 1200px) / 2))`
- **Fluid sizing**: `clamp(min, vw, max)` throughout
- **Scroll reveal**: `.reveal` + IntersectionObserver → `.vis` class added on entry
- **Delay utilities**: `.d1`, `.d2`, `.d3`, `.d4`
- **Unsplash images**: must use numeric timestamp IDs from the page's `og:image` meta tag — short slug URLs do not work
- **Logo files**: navbar and footer logos are inline SVGs (not `<img>` tags); footer logo height controlled via `.footer-logo svg { height: 48px; }`
