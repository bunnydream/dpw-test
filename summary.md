# DPW Website — Session Summary
Last updated: 2026-06-19 (Session 5)

## Project Overview
Standalone HTML/CSS website for Digital Public Works (DPW), a 501(c)(3) nonprofit. No build step. Single shared stylesheet (`shared.css`) plus page-specific `<style>` blocks in each HTML file.

## Files
* `/FINAL PAGES/home-FINAL.html` — canonical home page
* `/FINAL PAGES/about-FINAL.html`
* `/FINAL PAGES/careers-FINAL.html`
* `/FINAL PAGES/contact-FINAL.html`
* `/FINAL PAGES/impact-FINAL.html`
* `/FINAL PAGES/product-FINAL.html`
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
* Funder grid — `.funders`, `.funders-header`, `.funders-h`, `.funders-rule`, `.funder-grid`, `.funder-card`, `.funder-logo-img`, `.funder-logo-area`, `.funder-name`, `.funder-role`, `.funder-pending` (added Session 5)
* Footer — `.footer-inner`, `.footer-top`, `.cta-section-block`, `.footer-sub`, `.footer-demo`, `.footer-logo`, `.footer-bottom`, `.footer-tagline`, `.footer-contact`, `.footer-links`

## Page-Specific Notes

### home-FINAL.html
* How VMI Works section (`.how`): 5fr/4fr grid, sticky right image (`.how-right`), scroll progress bar JS (fills copper bar as user scrolls through steps), `min-height: 65vh` per step row for "one step at a time" feel
* Voices carousel: cool-white section bg, white cards, white arrow buttons (page-level overrides)
* **"Backed by" funder grid** placed after voices carousel (`.voices`), before pilot CTA. White section bg, cool-white cards (page-level overrides in `<style>` block: `.funders { background: var(--white); }` / `.funder-card { background: var(--cool-white); }`). 9 funder cards: 4 confirmed (Samvid, Vanguard Charitable, Next Ladder, Kellogg), 5 pending with `.funder-pending` class.
* DRK Foundation logo: `../public/partner-logos/drk-foundation.png`
* Hero image: `photo-1651790118309-5ecc129a562d` (person holding a baby)
* CTA section (`.cta-section`): full-bleed background image from Unsplash+ (two-women silhouette against orange sky — `plus.unsplash.com/premium_photo-1774243156987-92ea26745765`), 50% black overlay via `::before`, left-aligned content, `min-height: 75vh`
* Pullquote in `.model` section: "No vendor lock-in. No black boxes. No surprise overages."
* "At a glance" heading: `font-size: clamp(28px, 3vw, 36px)` inline override
* All instances of "Verify My Income" wrapped in `<i>` tags
* **"The pressure is real"** (`.pressure`): full-bleed, wide margin. Photo left col, text right col. Grid: `1fr 1fr`. `.pressure-right` right padding uses `max(clamp(20px, 5vw, 64px), calc((100vw - 1400px) / 2))`, left padding `clamp(48px, 6vw, 80px)` (internal gap from photo).
* **"A better model for income verification"** (`.model`): full-bleed, wide margin. Text left col, photo right col. Grid: `1fr 1fr`. `.model-content` left padding: `max(clamp(20px, 5vw, 64px), calc((100vw - 1400px) / 2))`.

### impact-FINAL.html
* Stat row: 4 stats (was 5 — "6 weeks to go-live" removed), homepage-sized numbers (`clamp(36px, 4.2vw, 56px)`), cool-white bg, aluminum bottom border
* Alternating section backgrounds (all page-level exceptions, shared.css untouched):
  * Hero: white → Stats: cool-white → Families: white → Voices: cool-white → Deployed: white → Annual: cool-white → Funding: white
  * Card components flip opposite to their section bg: voice-cards white, case-cards cool-white, content-cards cool-white, comp-card cool-white, report-book white
* **"From hours of paperwork"** (`.families`): full-bleed, wide margin 50/50 layout (Session 5). Left col = image bleeds to viewport edge (`position: absolute; inset: 0; object-fit: cover`). Right col (`.families-right`) text. Container is `display: grid; grid-template-columns: 1fr 1fr` directly on `.families` (no section-inner). Img container (`.families-img`) is `position: relative; min-height: 480px`.
* **Insights CTA**: final section before footer (Session 5). Background image: `images.unsplash.com/photo-1515378791036-0648a3ef77b2` (person using laptop). 50% black overlay `::before`. Heading: "Read our research on accessibility—and the results behind it." Button: "Read our insights" → `/insights`.

### product-FINAL.html
* **Talk CTA banner** (`.talk-cta`): placed after "The verification problem" section, before comparison table (moved from after "In the field" in Session 5). Deep-copper bg, diagonal SVG lines decoration. Heading: "Bring VMI to your state →". Sub: "Learn about piloting with Digital Public Works".
* **Accessibility section** (`#accessibility`): "Accessible by design, not as an afterthought" — full-bleed, wide margin. Grid: `1fr 1fr; overflow: hidden`. Text left col (`.access-left`), photo right col (`.access-photo`). `.access-left` left padding: `max(clamp(20px, 5vw, 64px), calc((100vw - 1400px) / 2))`. Contains a `.callout-stat` ("65%") inside `.access-left`.
* **Impact CTA**: final section before footer (Session 5). Background image: `images.unsplash.com/photo-1578053251472-e890ca7f2511` (shore). 50% black overlay `::before`. Heading: "See the difference *Verify My Income* makes for real families." Button: "See our impact" → `/impact`.

### about-FINAL.html
* Hero: `height: calc(100vh - 74px)` (fills viewport exactly, accounting for sticky nav — Session 5). Image `object-position: 70% center` (shows more right side of photo — Session 5).
* Funders section: All `<span class="funder-role">` orange text removed — logos only in funder cards. Default shared.css bg applies (cool-white).
* Funder cards CSS: `min-height: 120px`, flex-centered, `.funder-logo-img { max-height: 72px; max-width: 80%; object-fit: contain }`
* DRK Foundation: `../public/partner-logos/drk-foundation.png` (was `.jpg` — updated Session 5)
* All funder cards are `<a>` tags linking to partner sites (Samvid, Vanguard Charitable, Next Ladder, Kellogg, Google.org, DRK)
* Organization Status section: independent section, white bg, placed below "Backed by" and above footer
* Page `<style>` block contains only `.funders-org` (body text in org status section): `font-size: var(--t-body); line-height: 1.82; color: var(--steel); margin-bottom: 40px; max-width: 62ch`

### careers-FINAL.html
* Hero: `height: calc(100vh - 74px)` (fills viewport exactly — Session 5). Image `object-position: 85% 60%` (shifted right — Session 5).
* Fully remade as short, clean page
* Two-column hero grid (`9fr 7fr`); left = text, right = Unsplash+ image
  * Image: `https://plus.unsplash.com/premium_photo-1752242734548-5d397f72ae39?auto=format&fit=crop&w=1600&q=80`
* Hero left col (`.hero-left`): `padding-left: max(clamp(20px, 5vw, 64px), calc((100vw - 1200px) / 2))`
* h1: "Join Digital Public Works"
* Subtitle: "Join a team shipping products into government systems." — `.hero-tagline` class (Space Grotesk, `--t-subhead`, weight 700, `--steel`)
* Intro section (cool-white): team/mission paragraph
* Open Positions section (white): no current openings copy

### contact-FINAL.html
* Hero: no orange eyebrow (removed Session 5). h1: "Get in touch" (no period — Session 5).
* Funders contact form section: `background: var(--cool-white)` (Session 5).
* All form submit buttons: `btn-forge` class (Session 5) — applies to State Partners, Funders, and Community forms.
* Community form button text: "Get in touch" (was "Send message" — Session 5).

## Universal Footer (all 6 pages)
Same HTML across all pages. Content:
* "Ready to pilot?" (`footer-sub`, white via `.cta-section-block .footer-sub` rule in shared.css)
* "Request a demo today →" (`.footer-demo`, verdigris color, hover → white)
* DPW inline SVG logo (white text + copper mark, height 48px)
* Tagline, email, address, privacy/accessibility links

Footer CSS is universal in shared.css. `cta-section-block` gap is `0`.

## Key CSS Conventions
* Page-specific overrides go in the page's `<style>` block, never in shared.css
* New reusable components always go in shared.css with a `/* ─── COMPONENT NAME ───... */` header comment
* Full-bleed wide margin left edge: `max(clamp(20px, 5vw, 64px), calc((100vw - 1400px) / 2))`
* Full-bleed standard margin left edge: `max(clamp(20px, 5vw, 64px), calc((100vw - 1200px) / 2))`
* Fluid sizing: `clamp(min, vw, max)` throughout
* Scroll reveal: `.reveal` + IntersectionObserver → `.vis` class added on entry
* Delay utilities: `.d1`, `.d2`, `.d3`, `.d4`
* Unsplash images: must use numeric timestamp IDs from the page's `og:image` meta tag — short slug URLs do not work. Unsplash+ photos use `plus.unsplash.com`; free photos use `images.unsplash.com`
* Logo files: navbar and footer logos are inline SVGs (not `<img>` tags); footer logo height controlled via `.footer-logo svg { height: 48px; }`
* Hero viewport fill: nav is `position: sticky` at `height: 74px` (in flow), so `height: calc(100vh - 74px)` fills the remaining viewport exactly
* CTA section pattern: `position: relative`, `min-height: 80vh`, background-image, `::before` overlay `rgba(0,0,0,0.5)`, `.cta-inner` with `z-index: 1`
* Full-bleed image filling content height: use `position: relative` on container + `position: absolute; inset: 0` on img — image fills parent without driving layout height
