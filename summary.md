# DPW Website — Session Summary
Last updated: 2026-06-19 (Session 6)

## Project Overview
Standalone HTML/CSS website for Digital Public Works (DPW), a 501(c)(3) nonprofit. No build step. Single shared stylesheet (`shared.css`) plus page-specific `<style>` blocks in each HTML file. Deploying on Vercel + Supabase.

## Files
* `/FINAL PAGES/home-FINAL.html`
* `/FINAL PAGES/about-FINAL.html`
* `/FINAL PAGES/careers-FINAL.html`
* `/FINAL PAGES/contact-FINAL.html`
* `/FINAL PAGES/impact-FINAL.html`
* `/FINAL PAGES/product-FINAL.html`
* `/FINAL PAGES/insights-FINAL.html` — **created Session 6**
* `/shared.css` — universal styles, design tokens, all reusable components

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

## Margin Patterns
Three named patterns. Use these shorthand names with Claude and they map directly to CSS.
Full documentation also lives as a comment at the top of the section infrastructure block in shared.css.

**"standard margin"**
Markup: `section-pad > section-inner`
Content max-width: 1200px, centered with gutter.
Left edge: `clamp(20px, 5vw, 64px)` at narrow viewports; `(100vw - 1200px) / 2` at wide.

**"wide margin"**
Markup: `section-pad > section-inner section-inner--wide`
Content max-width: 1400px, centered with gutter.
Left edge: `clamp(20px, 5vw, 64px)` at narrow viewports; `(100vw - 1400px) / 2` at wide.
`.section-inner--wide { max-width: 1400px; }` lives in shared.css.

**"full-bleed, wide margin"**
Markup: full-viewport CSS grid (no section-inner), one column is a photo bleeding to the viewport edge.
Text column left padding: `max(clamp(20px, 5vw, 64px), calc((100vw - 1400px) / 2))`
Text aligns with the wide margin pattern; photo goes edge-to-edge. Different from wide margin: no element is capped at 1400px.

## shared.css Component Inventory
All reusable components live in shared.css. When creating new components, always add them here — never in a page `<style>` block.

* Nav / mobile menu — `.nav`, `.nav-logo`, `.nav-cta`, `.mobile-menu`
* Buttons — `.btn`, `.btn-white`, `.btn-forge`, `.btn-copper`
* Section scaffolding — `.section-pad`, `.section-inner`, `.section-inner--wide`
* Step timeline — `.steps`, `.steps-line`, `.step`, `.step-badge`, `.step-n`, `.step-lbl`, `.step-content`
* Step scroll (photo-card variant) — `.how-steps-wrap`, `.how-steps-progress`, `.how-step-row`, `.how-step-card`, `.how-step-img`, `.how-step-body`
* Stat row — `.stat-row`, `.stat-cell`, `.stat-num`, `.stat-label` (copper bar animation on scroll via `.vis`)
* Voices carousel — `.voices`, `.voices-inner`, `.voices-carousel-outer`, `.voices-carousel-track`, `.voice-card`, `.voice-mark`, `.voice-text`, `.voice-attr`, `.carousel-footer`, `.carousel-dots`, `.c-dot`, `.c-dot--active`, `.carousel-arrows`, `.carousel-btn`
* Comparison card — `.comp-card`, `.comp-header`, `.comp-col-head`, `.comp-col-dot`, `.comp-row`, `.comp-cell`, `.comp-dot`
* Case study grid — `.field`, `.case-grid`, `.case-card`, `.case-text`, `.case-state`, `.case-photo`, `.case-detail`
* Content cards — `.content-card-grid`, `.content-card`, `.content-card-accent`, `.content-card-body`, `.content-card-icon`, `.content-card-label`
* Pullquote — `.pullquote`, `.pq-text`, `.pq-text em`
* Talk CTA banner — `.talk-cta`, `.talk-cta-lines`, `.talk-cta-inner`, `.talk-cta-heading`, `.talk-cta-sub`
* Funder grid — `.funders`, `.funders-header`, `.funders-h`, `.funders-rule`, `.funder-grid`, `.funder-card`, `.funder-logo-img`, `.funder-logo-area`, `.funder-name`, `.funder-role`, `.funder-pending`
* Footer — `.footer-inner`, `.footer-top`, `.cta-section-block`, `.footer-sub`, `.footer-demo`, `.footer-logo`, `.footer-bottom`, `.footer-tagline`, `.footer-contact`, `.footer-links`

## Image Convention (Session 6)
All Unsplash CDN URLs replaced with local files. Images live in `/public/images/{page}/` subfolders. Zero remote Unsplash URLs remain in any page.

Example paths:
* `../public/images/home/oosman-exptal-2_lHgY_ZvQo-unsplash.jpg`
* `../public/images/product/product-hero.png`
* `../public/images/about/paulina-herpel-yxqVPJFAYHg-unsplash.jpg`

Renamed/special files:
* `../public/images/home/home-howVMIworks.png` — How Verify My Income Works diagram
* `../public/images/product/product-hero.png` — product hero screenshot
* `../public/images/product/product-verify.png` — verification problem section

## Hero Convention (Session 6)
All heroes use `min-height: calc(100vh - 74px)` (or `100dvh` for product/impact), **not** `height`. This fills the viewport while allowing content to grow on small screens.

**Product hero exception**: also has `max-height: calc(100dvh - 74px)` — required because CSS grid `1fr` rows need a definite container height; without `max-height`, the product screenshot (with `object-fit: contain`) expands to its natural dimensions.

**Mobile hero stacking**: hero images stack ABOVE text column via `order: -1` on `.hero-img`. Applied to: home, impact. (Product kept at `order: 2`.)

**Impact mobile**: `@media (max-width: 1024px)` block sets both `height: auto` AND `min-height: auto` on `.hero` — both are needed or the desktop `min-height` still applies and creates a large gap.

## Page-Specific Notes

### home-FINAL.html
* How VMI Works section (`.how`): 5fr/4fr grid, sticky right image (`.how-right`), scroll progress bar JS, `min-height: 65vh` per step row
* Voices carousel: cool-white section bg, white cards, white arrow buttons (page-level overrides)
* **"Backed by" funder grid**: after voices carousel, before pilot CTA. White bg, cool-white cards. 9 funder cards: 4 confirmed (Samvid, Vanguard Charitable, Next Ladder, Kellogg), 5 pending with `.funder-pending`.
  * ⚠️ PENDING: Remove Google, Vanguard, Next Ladder, Kellogg; keep only AARP Foundation, Pritzker Children's Initiative, Families and Workers Fund, DRK Foundation. Same change needed on about page.
* DRK Foundation logo: `../public/partner-logos/drk-foundation.png`
* Pullquote in `.model` section: "No vendor lock-in. No black boxes. No surprise overages."
* All instances of "Verify My Income" wrapped in `<i>` tags
* **"The pressure is real"** (`.pressure`): full-bleed wide margin, 1fr/1fr grid. Photo left, text right.
* **"A better model"** (`.model`): full-bleed wide margin, 1fr/1fr grid. Text left, photo right.
* CTA section bg: `../public/images/home/evelyn-verdin-bNLBhRzhvrc-unsplash.jpg`

⚠️ **PENDING (Michael's feedback)**:
* Remove "the conversation" from hero note → "No procurement required to begin. We start with a free, philanthropically funded pilot."
* "See the full comparison" link — needs destination or remove button
* Remove dead stat counter JS (lines ~1218–1240)
* Hero note inline `style="font-size: 15px;"` → `var(--t-small)`
* Pullquote — add bottom border (top + bottom ruled-block treatment)
* Backed by: remove non-approved logos (see above)

### impact-FINAL.html
* Stat row: 4 stats, homepage-sized numbers (`clamp(36px, 4.2vw, 56px)`), cool-white bg
* Alternating section backgrounds (all page-level):
  * Hero: white → Stats: cool-white → Families: white → Voices: cool-white → Deployed: white → Annual: cool-white → Funding: white
* **"From hours of paperwork"** (`.families`): full-bleed wide margin 50/50. Left col image bleeds to edge (`position: absolute; inset: 0`). Right col text.
* **Insights CTA**: final section before footer. Background image: `../public/images/impact/christin-hume-Hcfwew744z4-unsplash.jpg`.

⚠️ **PENDING (Michael's feedback)**:
* Remove line break after "earned" in hero
* Move "How philanthropic investment creates public value" section to immediately after the chart
* Comparison card `border-radius: 6px` → `2px`

### product-FINAL.html
* Hero: `min-height` + `max-height: calc(100dvh - 74px)` (grid constraint fix)
* **Talk CTA banner**: after "The verification problem" section, before comparison table
* **Accessibility section** (`#accessibility`): full-bleed wide margin, 1fr/1fr grid. Text left, photo right. Contains `.callout-stat` ("65%").
* **Impact CTA**: final section before footer. Background image: `../public/images/product/harald-wolff-msHKfPyFH7g-unsplash.jpg`.

⚠️ **PENDING (Michael's feedback)**:
* Talk CTA "Bring VMI to your state →" — needs a proper `<button>` element, not just arrow text

### about-FINAL.html
* Hero image: `../public/images/about/paulina-herpel-yxqVPJFAYHg-unsplash.jpg`, `object-position: 70% center`
* Founding story image: `../public/images/about/mapbox-ZT5v0puBjZI-unsplash.jpg`
* Funders section: logos only, no `.funder-role` orange text. Default cool-white bg.
* Organization Status section: white bg, below "Backed by"

⚠️ **PENDING (Michael's feedback)**:
* Section heading inline `margin-bottom` style → move to page CSS
* Backed by — remove non-approved logos (same list as home)

### careers-FINAL.html
* Hero image: `../public/images/careers/johannes-kopf-h0pHxbb6a78-unsplash.jpg`
* h1: "Join Digital Public Works"
* Subtitle: "Join a team shipping products into government systems."

⚠️ **PENDING (Michael's feedback)**:
* Subtitle → "Join us in making government digital services better for everyone (and doing it at cost)."
* Inline style in intro paragraph → use body-text class, only override max-width

### contact-FINAL.html
* Hero: h1 "Get in touch" (no period), no orange eyebrow
* Funders contact form: `background: var(--cool-white)`
* All form submit buttons: `btn-forge` class
* Community button text: "Get in touch"
* 3 separate forms: State Partners, Funders, Community — each targets `info@digitalpublicworks.org`

⚠️ **PENDING**:
* Wire up Formspree (recommended for launch). Integration: change `<form>` to `<form action="https://formspree.io/f/YOUR_ID" method="POST">`. Each form gets its own endpoint OR share one with a hidden `name="_form_source"` field. Add `<input type="hidden" name="_subject" value="New contact from DPW website">` for email subject.
* Remove `novalidate` attribute from all forms

### insights-FINAL.html *(new — Session 6)*
* Hero: white bg, `section-pad`, text-only. h1: "Insights". Subtitle from docx.
* Posts section: cool-white bg, category filter pills + 3 placeholder cards:
  1. Policy — "How H.R. 1 Changes the Stakes for Income Verification"
  2. Service Design — "The 40% Problem: When the Process Fails Before the Technology Does"
  3. Accessibility — "Accessible by Design: What Our Research on VMI Is Revealing"
* Filter JS: `data-cat` attributes + `display: none/''` toggle on pill click
* Subscribe section: white bg, "Stay in the loop" email form

⚠️ **PENDING (Michael's feedback)**:
* Hero needs a visual/image
* Font sizes use raw px values — `10px`, `11px`, `12px` should use type scale variables
* Post cards + subscribe input `border-radius: 3px` → `2px`

## Universal Changes (All Pages) — PENDING
* Stat labels: remove `text-transform: lowercase`, write labels in sentence case, reduce letter-spacing
* Image compression needed: 19MB meeting photo, 3MB+ headshots. Rename files with spaces (e.g., `Anna Banchik.png`).

## Contact Form — Formspree Integration
Formspree is the recommended approach for launch (vs. Vercel serverless + Resend, which is better long-term).

Steps:
1. Sign up at formspree.io, create a form → get endpoint `https://formspree.io/f/xyzabc`
2. `<form action="https://formspree.io/f/xyzabc" method="POST">`
3. Remove any `onsubmit="return false;"`
4. Formspree reads `name` attributes to label fields in the email
5. Use `name="email"` on email field so Formspree sets reply-to correctly
6. Optional: `<input type="hidden" name="_subject" value="New contact from DPW website">`
7. Optional: `<input type="hidden" name="_next" value="https://yourdomain.com/thanks">` for custom redirect

## Pending Flag for Client
* "Draper Richards Kaplan" mentioned in Michael's email but code has "DRK Foundation" — confirm they are the same org before any logo/copy changes.

## Key CSS Conventions
* Page-specific overrides go in the page's `<style>` block, never in shared.css
* New reusable components always go in shared.css with a `/* ─── COMPONENT NAME ───... */` header comment
* Full-bleed wide margin left edge: `max(clamp(20px, 5vw, 64px), calc((100vw - 1400px) / 2))`
* Full-bleed standard margin left edge: `max(clamp(20px, 5vw, 64px), calc((100vw - 1200px) / 2))`
* Fluid sizing: `clamp(min, vw, max)` throughout
* Scroll reveal: `.reveal` + IntersectionObserver → `.vis` class added on entry
* Delay utilities: `.d1`, `.d2`, `.d3`, `.d4`
* Logo files: navbar and footer logos are inline SVGs; footer logo height via `.footer-logo svg { height: 48px; }`
* Hero viewport fill: nav is `position: sticky` at `height: 74px` (in flow), so `min-height: calc(100vh - 74px)` fills the remaining viewport
* CTA section pattern: `position: relative`, `min-height: 80vh`, background-image, `::before` overlay `rgba(0,0,0,0.5)`, `.cta-inner` with `z-index: 1`
* Full-bleed image filling content height: `position: relative` on container + `position: absolute; inset: 0` on img
