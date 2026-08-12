# DPW Website — Session Summary
Last updated: 2026-08-12 (designs finalized; mobile quote-carousel fix, full code cleanup pass, and Add-a-block modal overhaul (through round 4) all complete — see dated sections below)

## Project Overview
Standalone HTML/CSS website for Digital Public Works (DPW), a 501(c)(3) nonprofit. No build step. Single shared stylesheet (`shared.css`) plus page-specific `<style>` blocks in each HTML file. Deploying on Vercel + Supabase.

**2026-08-12: Designs are final and client-approved.** All `⚠️ PENDING` copy/style tweak notes that used to appear throughout this doc (Michael's feedback items per page, the universal stat-label/image-compression note, and the DRK Foundation vs. Draper Richards Kaplan naming question) have been removed — they're no longer being tracked or planned. Treat `FINAL PAGES/` and `ADMIN PAGES/` exactly as they are now as the source of truth; do not reintroduce those changes. (Image compression is still happening, but as a technical performance task in the build itself — see `website-build-walkthrough.md` — not as a content-review item.)

A parallel admin CMS mockup (`/ADMIN PAGES/`) was built in Session 7 — see the dedicated section near the bottom of this file. It's a static HTML/CSS/vanilla-JS prototype only; no backend is wired up yet. That's the next major phase of work (Claude Code + Supabase).

## Files
* `/FINAL PAGES/home-FINAL.html`
* `/FINAL PAGES/about-FINAL.html`
* `/FINAL PAGES/careers-FINAL.html`
* `/FINAL PAGES/contact-FINAL.html`
* `/FINAL PAGES/impact-FINAL.html`
* `/FINAL PAGES/product-FINAL.html`
* `/FINAL PAGES/insights-FINAL.html` — **created Session 6**
* `/shared.css` — universal styles, design tokens, all reusable components
* `/shared.js` — **new, 2026-08-12 code cleanup pass.** Universal site JS (mobile-nav hamburger toggle, scroll-reveal `IntersectionObserver`, and the voices-carousel init) included via `<script src="../shared.js"></script>` on every FINAL PAGES page — same pattern as `shared.css`. Each section guards on its target element existing (e.g. the carousel init no-ops unless `#carouselTrack` is on the page), so the one file is safe to include unconditionally everywhere rather than needing per-page wiring. This replaced ~12-15 lines of hamburger/scroll-reveal boilerplate that used to be copy-pasted into all 7 pages' inline `<script>` blocks, plus a ~55-line voices-carousel script duplicated verbatim between home-FINAL.html and impact-FINAL.html. Page-specific inline `<script>` blocks remain in home (stat counters, how-it-works progress bar), insights (category filter), and product (accordion triggers) — only the universal parts moved out.

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
* Voices carousel — `.voices`, `.voices-inner`, `.voices-carousel-outer`, `.voices-carousel-track`, `.voice-card`, `.voice-mark`, `.voice-text`, `.voice-attr`, `.carousel-footer`, `.carousel-dots`, `.c-dot`, `.c-dot--active`, `.carousel-arrows`, `.carousel-btn`. **Card width is NOT controlled by CSS `flex-basis` at runtime** — each page's carousel `<script>` (identical IIFE, duplicated in home-FINAL.html and impact-FINAL.html) calls `cardWidth()` on load/resize and sets `card.style.flexBasis` inline in px, which always wins over any CSS rule for the same property. (2026-08-12, 1st attempt: added `.voice-card { flex: 0 0 85vw; }` in shared.css's `@media (max-width: 768px)` block — this had no visible effect because the inline JS style overrode it immediately. 2026-08-12, real fix: added a `window.innerWidth <= 768` branch inside `cardWidth()` in both pages' scripts that returns `visW - pl` (exactly 1 card, right gutter matching left, no peek of the next quote) instead of the desktop `(visW - GAP) / 2.5` calc (2.5 cards, so the 3rd peeks). The `flex: 0 0 85vw` shared.css rule was updated to `flex: 0 0 calc(100% - 40px)` and is now just a no-JS fallback, not the active mechanism.)
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
* **"Backed by" funder grid**: after voices carousel, before pilot CTA. White bg, cool-white cards. 5 funder cards: 4 confirmed (DRK Foundation, AARP Foundation, Families and Workers Fund, Pritzker Children's Initiative) + 1 pending (Samvid Ventures) with `.funder-pending`. (2026-08-12: removed Google.org, Vanguard Charitable, Next Ladder Ventures, and W.K. Kellogg Foundation from this grid on both home and about pages — no longer approved partners.)
* DRK Foundation logo: `../public/partner-logos/drk-foundation.png`
* Pullquote in `.model` section: "No vendor lock-in. No black boxes. No surprise overages."
* All instances of "Verify My Income" wrapped in `<i>` tags
* **"The pressure is real"** (`.pressure`): full-bleed wide margin, 1fr/1fr grid. Photo left, text right.
* **"A better model"** (`.model`): full-bleed wide margin, 1fr/1fr grid. Text left, photo right.
* CTA section bg: `../public/images/home/evelyn-verdin-bNLBhRzhvrc-unsplash.jpg`

### impact-FINAL.html
* Stat row: 4 stats, homepage-sized numbers (`clamp(36px, 4.2vw, 56px)`), cool-white bg
* Alternating section backgrounds (all page-level):
  * Hero: white → Stats: cool-white → Families: white → Voices: cool-white → Deployed: white → Annual: cool-white → Funding: white
* **"From hours of paperwork"** (`.families`): full-bleed wide margin 50/50. Left col image bleeds to edge (`position: absolute; inset: 0`). Right col text.
* **Insights CTA**: final section before footer. Background image: `../public/images/impact/christin-hume-Hcfwew744z4-unsplash.jpg`.

### product-FINAL.html
* Hero: `min-height` + `max-height: calc(100dvh - 74px)` (grid constraint fix)
* **Talk CTA banner**: after "The verification problem" section, before comparison table
* **Accessibility section** (`#accessibility`): full-bleed wide margin, 1fr/1fr grid. Text left, photo right. Contains `.callout-stat` ("65%").
* **Impact CTA**: final section before footer. Background image: `../public/images/product/harald-wolff-msHKfPyFH7g-unsplash.jpg`.

### about-FINAL.html
* Hero image: `../public/images/about/paulina-herpel-yxqVPJFAYHg-unsplash.jpg`, `object-position: 70% center`
* Founding story image: `../public/images/about/mapbox-ZT5v0puBjZI-unsplash.jpg`
* Funders section: logos only, no `.funder-role` orange text. Default cool-white bg. Same 5-card funder grid as home (see home's note — Google/Vanguard/Next Ladder/Kellogg removed 2026-08-12).
* Organization Status section: white bg, below "Backed by"
* **Team grid mobile fix (2026-08-12)**: `.team-grid` collapsed to 1 column only below 480px, leaving the 481–1024px range (genuine phone/mobile widths) stuck at 2 columns. Moved the 1-column breakpoint to `max-width: 768px` (the site's standard mobile/hamburger-nav breakpoint) so real mobile widths always stack to 1 column, while the 769–1024px tablet range keeps 2 columns.

### careers-FINAL.html
* Hero image: `../public/images/careers/johannes-kopf-h0pHxbb6a78-unsplash.jpg`
* h1: "Join Digital Public Works"
* Subtitle: "Join a team shipping products into government systems."

### contact-FINAL.html
* Hero: h1 "Get in touch" (no period), no orange eyebrow
* Funders contact form: `background: var(--cool-white)`
* All form submit buttons: `btn-forge` class
* Community button text: "Get in touch"
* 3 separate forms: State Partners, Funders, Community — each targets `info@digitalpublicworks.org`

### insights-FINAL.html *(new — Session 6; hero + cards reworked 2026-08-12; cards restructured again 2026-08-12)*
* Hero: now structurally identical to about-FINAL.html's hero (`.hero`/`.hero-left`/`.hero-img` split grid, not the old text-only `.insights-hero`). Image: `../public/images/insights/writing.jpg`. h1: "Insights". Subtitle now renders via the shared `.hero-tagline` component instead of a page-specific `.insights-subtitle` class. No border/divider beneath the hero (matches about page — background-color contrast with the next section does the separating instead).
* Posts section: cool-white bg, category filter pills + 3 placeholder cards. **Cards now reuse the `.case-card`/`.case-text`/`.case-state`/`.case-detail`/`.case-photo` component — the same "Deployed and delivering results" card impact-FINAL.html uses — instead of the `.io-card` component (superseding the earlier 2026-08-12 rework noted above).** Container stays `.io-grid` (shared.css's responsive 3-col grid) rather than `.case-card`'s native `.case-grid` container, since `.case-grid` is hardcoded to 2 columns and would orphan the 3rd card. `.case-state` holds the category tag (previously held a state name on impact page; here it's things like "Policy"/"Service Design"/"Accessibility"). `.case-photo` has no image yet (none exist for articles) — filled with the flat `.post-photo-placeholder` gray box (`background: var(--light-al)`). Hover animation (copper top-bar reveal) comes for free from `.case-card::before`/`:hover`, already baked into the shared component. Cards:
  1. Policy — "How H.R. 1 Changes the Stakes for Income Verification"
  2. Service Design — "The 40% Problem: When the Process Fails Before the Technology Does"
  3. Accessibility — "Accessible by Design: What Our Research on VMI Is Revealing"
* Filter JS: `data-cat` attributes + `display: none/''` toggle on pill click (selector updated from `.post-card` → `.io-card` → now `.case-card`).
* Type scale: category buttons, category tags, and subscribe note now use `var(--t-label)` instead of raw `10px`/`11px`/`12px` values, matching the rest of the site's discipline about this.
* Border-radius: post cards and subscribe input now `2px` (was `3px`), matching the site-wide convention.
* Subscribe section: white bg, "Stay in the loop" email form. "No spam. Unsubscribe at any time." note removed.
* **Filter tags must be dynamic in the real build**: the category pills should be generated from whatever tags actually exist on published posts, not a hardcoded list — currently zero articles are published, so the real (Supabase-backed) filter should show no pills at all until an admin publishes a tagged post. This mockup's hardcoded pills (All/Product/Policy/Service Design/Accessibility/Field Notes) are just a design reference, not the real behavior — see the Claude Code kickoff prompt in `website-build-walkthrough.md`.

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

## Key CSS Conventions
* Page-specific overrides go in the page's `<style>` block, never in shared.css
* New reusable components always go in shared.css with a `/* ─── COMPONENT NAME ───... */` header comment
* Full-bleed wide margin left edge: `max(clamp(20px, 5vw, 64px), calc((100vw - 1400px) / 2))`
* Full-bleed standard margin left edge: `max(clamp(20px, 5vw, 64px), calc((100vw - 1200px) / 2))`
* Fluid sizing: `clamp(min, vw, max)` throughout
* Scroll reveal: `.reveal` + IntersectionObserver → `.vis` class added on entry
* Delay utilities: `.d1`, `.d2`, `.d3`, `.d4`
* Logo files: navbar and footer logos are inline SVGs. Footer wordmark SVG is very wide (viewBox ~500x43, ~11.6:1), so `.footer-logo svg` height is fluid — `clamp(22px, 7vw, 40px)` — rather than a fixed px value, otherwise it overflows/clips on narrow phones (fixed 2026-08-12).
* Hero viewport fill: nav is `position: sticky` at `height: 74px` (in flow), so `min-height: calc(100vh - 74px)` fills the remaining viewport
* CTA section pattern: `position: relative`, `min-height: 80vh`, background-image, `::before` overlay `rgba(0,0,0,0.5)`, `.cta-inner` with `z-index: 1`
* Full-bleed image filling content height: `position: relative` on container + `position: absolute; inset: 0` on img

---

# Admin CMS Mockup (Session 7)

## Purpose
Static prototype of the DPW site-manager admin panel — login, dashboard, page editor, blog editor, settings. Built as a mockup for stakeholder review; **no real backend**. Next step is handing this to Claude Code to wire up real persistence via Supabase (auth, Postgres tables for pages/sections/blog posts, Storage for media) and deploy on Vercel. Contact-form submissions should go to `info@digitalpublicworks.org` via a Vercel serverless function + Resend (or Formspree for a faster launch path, same tradeoff as the public site's contact form — see above).

## Files (`/ADMIN PAGES/`)
* `admin-login.html` — login screen, Stacked logo (Light/Mono.svg) on white card, no JS
* `admin-dashboard.html` — page grid + recent blog posts list
* `admin-page-editor.html` — the core editor: 50/50 live-preview/edit split, block-based section editing
* `admin-blog-list.html` — post table with working search + category filter pills
* `admin-blog-editor.html` — block-based post content editor
* `admin-settings.html` — email + password management
* `admin-deleted-pages.html` — soft-deleted pages list with 30-day countdown + restore
* `admin.css` — shared stylesheet for all admin pages (loaded after `../shared.css`)

## Brand color rule
`admin.css` uses **only** the hex-backed tokens already defined in `shared.css` `:root` — no invented color variants. One deliberate exception: `#B91C1C` for destructive actions (delete buttons, warning icons), since the DPW palette has no red. Documented inline in `admin.css` with the contrast math (~6.5:1, passes WCAG AA in both directions). Logo in the sidebar/login is the **Stacked** logo, not Extended (`Logo/Stacked Logo/SVG/{Dark,Light}/Mono.svg` — "Dark" folder = white fill for dark backgrounds, "Light" folder = forge-color fill for light backgrounds).

## Page editor architecture (`admin-page-editor.html`)
* Data-driven: a `PAGES` object keyed by slug (home/about/product/impact/careers/contact), each an array of `{type, label, name, inner}` block descriptors with **real content** pulled from the actual `/FINAL PAGES/*.html` files (not placeholder copy).
* `buildSectionLi()` generates each block's markup; `renderPage(key)` rebuilds `#section-list` from `PAGES[key]` — this runs on load and whenever the page picker changes, so switching pages correctly swaps block content (this was a bug fixed earlier in the session — the list used to stay stuck on Home's content).
* Language: blocks are called **"blocks"** in all UI copy (not "sections") — headers, modals, toasts, tooltips, footer counts. Internal CSS classes/JS identifiers still use `section` naming (e.g. `.a-section-item`, `renderPage`) — that's fine, it's not user-facing.
* Block types available in the "Add a block" modal (updated 2026-08-12, see "Add-a-block modal overhaul" below): Hero, Heading, Text block, Photo + text, Button, Step timeline, Stat row (always exactly 4 stats), Pullquote, Quote carousel, Linked card grid, Info card grid, Team member card, Accordion, Partners, CTA banner. **Comparison card was removed** from the modal (can no longer be added) — the one existing Comparison card block on the Product page ("Traditional Approaches vs. VMI") was left in place since it's real, still-needed content; only the ability to add new ones is gone.
* **Photo + text blocks**: pullquote is an optional sub-block, added via a "+ Add pullquote" button, always rendered directly below the body-paragraph field, removable. Implemented via `pullquoteSlot()` / `addPullquoteToBlock()` / `removePullquoteFromBlock()`. Now also includes an optional primary/secondary button pair (`buttonPairFields()`).
* Every block has: left/right photo-side toggle (photo+text only), a show/hide-on-published-page eye icon, move up/down, delete (WCAG red confirm modal), and accordion-exclusive open/close (only one block expanded at a time). Open block's panel has a subtle background fill (`--cool-white`) contained within its border.
* Topbar (left to right): page picker → **"+" add-block button** (inserts new block directly after whichever block is open, or at the bottom if none is open — via `pendingInsertMode`) → Undo/Redo (history stack of `#section-list` innerHTML snapshots, `Cmd/Ctrl+Z` and `Shift+Cmd/Ctrl+Z` also work) → save-status pill → View live site (ghost/text-only button) → delete-this-page icon → Save draft (secondary) → Publish changes (primary).
* **Icon-button sizing**: `.a-icon-btn` is 40×40px, matching `.a-btn`'s explicit 40px height exactly, so icon-only buttons always align with adjacent text buttons. `.a-btn-sm` (used on dashboard page cards) is 32px; its icon-button counterpart matches via `aspect-ratio: 1` + flex-stretch.
* Live preview: iframe loads the real `../FINAL PAGES/{page}-FINAL.html` file and is scaled via JS (`scalePreview()`) to exactly fill the pane's width — no fixed-size card, no gray backdrop.
* "Replace photo" always offers a dropdown: **Upload from computer** or **Choose from media library** (shared modal, real project images).
* "Button links to" field is a dropdown of real site pages (not a raw text input), with a "Custom link..." escape hatch. Label wording was never finalized beyond "Button links to" — revisit if it comes up again.

## Blog editor (`admin-blog-editor.html`)
* Featured photo and Title are separate, **always-visible, non-collapsible** cards above "Post content" (photo first, then title) — not part of the collapsible block list.
* Post content itself (paragraphs, headings, quotes, photos) uses the same block-list UI/interaction pattern as the page editor, including its own Undo/Redo history and back-of-list photo-upload modal.
* Category is a single-select dropdown (existing options or "+ Create new category...") — one category per post, one badge color style everywhere (`.a-badge-policy/service/access` all render the same neutral style).
* Clicking anywhere in a blog-list table row (not just the Edit button) navigates to the editor. Search box + category pills on `admin-blog-list.html` actually filter the list.
* Back button is a full outline button with arrow icon + "Back to all posts" text (not just a small icon).
* **Gap**: no individual blog-post detail page exists yet on the public site — only the Insights index/card grid. Posts written in the admin have nowhere to render live until that's built.

## Deleted pages / soft delete
* Deleting a page (from the dashboard's page-card trash icon, or from inside the page editor's topbar) doesn't remove it immediately — it moves to a **"Deleted pages"** view, reachable via its own sidebar nav item (added to every admin page), with a 30-day countdown and a Restore button.
* This is the one place in the mockup that uses **`localStorage`** (keys `dpwDeletedPages`, `dpwCustomPages`) rather than being purely self-contained per page — necessary because "deleted pages" only makes sense if the list survives navigating away and back. Built-in default pages (home/about/product/impact/careers/contact) are static HTML cards that just get hidden/shown based on whether their slug is in the deleted list; custom pages created via "Add a new page" are fully persisted through localStorage.
* **Caveat for the real build**: the 30-day auto-purge is UI-only — it recalculates on each page load but has no server-side cron. Supabase will need a scheduled job to actually enforce permanent deletion after 30 days.

## Verification approach used throughout
For every edit: (1) a Python regex tag-balance check across common tags (`div`, `ul`, `li`, `table`, `button`, `select`, etc.), and (2) a Node.js runtime check — extracting the `<script>` body and executing it against a stubbed `document`/`window`/`localStorage` to catch both syntax errors and **temporal-dead-zone / ordering bugs** (one such bug — `resetSectionHistory()` called before its `let` declarations — silently broke every button on the page editor for a few turns; now fixed and caught by this harness going forward).

## Code Cleanup Pass (2026-08-12, pre-handoff)
Requested by the user right before handing the codebase to Claude Code: remove duplicate/unused code. Scope was FINAL PAGES/*.html, ADMIN PAGES/*.html, shared.css, and admin.css (15 files). Every removal below was verified by grepping for the class/selector name across the *entire* codebase (not just its own file) before deleting, plus a post-edit re-scan to confirm nothing live was caught. Full HTML-tag-balance, CSS-brace-balance, and JS-syntax checks ran on every changed file before delivery.

**New `shared.js`** — see the `## Files` entry above. Consolidates the mobile-nav toggle + scroll-reveal `IntersectionObserver` (previously duplicated verbatim in all 7 FINAL PAGES files) and the voices-carousel init (previously duplicated verbatim between home-FINAL.html and impact-FINAL.html — including the mobile-peek fix from earlier this session). Page-specific JS (stat counters, how-it-works progress bar, insights category filter, product accordions) stayed inline on its page.

**Removed from `shared.css`** (all confirmed zero references anywhere in FINAL PAGES or ADMIN PAGES markup):
* `.footer-hero` — never used, no page has a `.footer-hero` element.
* Entire "FUNDER BADGE STRIP" component (`.funder-strip`, `.funder-badge`, `.funder-badge:hover`) — an alternate funders-as-text-badges design superseded by the FUNDER GRID (logo-card) layout that's actually live on home + about.
* `.funder-name`, `.funder-role`, `.funder-pending .funder-name` — leftover from when funder cards showed a name/role label; current cards are logo-only (confirmed in this doc's own about/home notes: "logos only, no `.funder-role` orange text").
* Entire "OPEN POSITIONS EMPTY STATE" component (`.openings-empty`, `.openings-empty p`) — careers-FINAL.html's actual empty-state text uses its own page-local `.openings-body` class instead; `.openings-empty` was never wired up.
* Kept `.section-inner--wide` even though no page currently uses it — it's documented, intentional design-system infrastructure (one of the "three margin patterns" explained in this doc), not dead code from an abandoned feature.

**Removed from `ADMIN PAGES/admin.css`** (all confirmed zero references anywhere in ADMIN PAGES markup):
* Entire "QUICK ACTIONS (dashboard)" component (`.a-quick-grid` + its mobile override, `.a-quick-card`, `.a-quick-icon` + `.copper`/`.steel` variants) — no admin page has a "quick actions" widget.
* `.a-hidden-tag`, `.a-help-icon`, `.a-upload-replace`, `.a-login-sub`, `.a-toggle-row` — one-off leftovers with no matching markup (note: `.a-toggle`/`.a-toggle-knob` themselves ARE still used and were kept — only the unused `.a-toggle-row` wrapper class was removed).
* Entire old rich-text-editor toolbar (`.a-title-input`, `.a-toolbar-rte` + children, `.a-rte-body` + children) and old tag-input UI (`.a-tag-input`, `.a-tag` + children) — superseded by the block-based editor (`.a-input`, `moveBlock()`) that admin-blog-editor.html and admin-page-editor.html actually use now.
* Duplicate rule: `.a-visibility-btn.is-hidden-state` was defined twice, verbatim, in two different places in the file — removed the stray copy, kept the one under its proper "SECTION VISIBILITY TOGGLE" header.

**Orphaned image files found (not deleted — flagged for the user to confirm)**: these funder-logo files are no longer referenced by any page, mostly left over from the Google/Vanguard/Next Ladder/Kellogg funder-grid trim done earlier this session: `public/images/funders/drk-logo.png`, `fwf-logo.svg`, `googleorg-logo.svg`, `nextladder-logo.png`, `pritzker-logo.png`, `pritzker-logo-dark.png`, `samvid-logo.png` (0 bytes), `vanguard-charitable-logo.svg`, `wkkf-logo.svg` (0 bytes); `public/partner-logos/drk-foundation.jpg` (a duplicate of the `.png` version, which IS used), `nextladder.svg`, `W.K._Kellogg_Foundation_logo.png`.

## Add-a-block modal overhaul (2026-08-12, pre-handoff)
User reviewed the "Add a block" modal in `admin-page-editor.html` and requested 14 changes, all implemented and verified (HTML tag-balance via `html.parser`, JS syntax via Node `new Function`, CSS brace-balance):

1. **Modal corner-radius bug fixed**: some corners of `.a-modal` weren't curved because the browser's native scrollbar track is a hard rectangle that ignores `border-radius`. Fixed with `scrollbar-width`/`scrollbar-color` (Firefox) and `::-webkit-scrollbar*` pseudo-elements (Chrome/Safari/Edge) in `admin.css` — CSS-only fix, no DOM changes, applies to all 4 modals sharing `.a-modal`.
2. **Text block**: now body text only, no heading field (both in the Add-a-block template and its modal description).
3. **Photo + text block**: added an optional primary/secondary button pair (text + link each) via the new `buttonPairFields()` helper.
4. **Hero block schema** standardized to: Headline, Subtitle, Body text, Hero photo, Primary button (text + link), Secondary button (text + link). Applied both to the Add-a-block template and to all 5 existing seeded Hero blocks (home, about, product, impact, careers) — each migrated to the new field set while preserving its real existing content (home's extra "Footnote text" field was kept since it's real page content with no home in the new schema).
5. **New Button block**: a single standalone button with text + link.
6. **Step timeline "Add a step" bug fixed** — the button previously just showed a toast and did nothing. Now backed by a real `addStepCard()` function that adds a step card (heading, description, optional photo) to a live list. Also retrofitted onto the 2 existing seeded step blocks that had the same broken button: home's "How Verify My Income works" (3 real steps, each with its real photo) and product's "The path to a pilot" (4 real steps: Discovery, Configuration and integration, Pilot launch, Expansion — no photos, matching the live page).
7. **Pullquote block**: removed the "This appears in large text with a rule above and below it." hint text entirely.
8. **Comparison card removed** from the Add-a-block modal (see note above — existing seeded block on Product page untouched).
9. **Case study grid → renamed "Linked card grid"**: heading field removed, photo field added, description now calls out that cards are clickable. Applied to the Add-a-block template and both existing seeded blocks (product's "In the field" — Pennsylvania DHS/Arizona DES cards, now with their real photos; impact's "Deployed and delivering results" — same two states, impact's own photo set).
10. **Content card grid → renamed "Info card grid"**: heading field removed, photo field added, description now calls out that cards are NOT clickable. Applied to the Add-a-block template and the 2 existing seeded blocks that used this type: product's "Built to fit your systems" (API integration / Standalone portal / Embedded widget — no real photos exist for these on the live page, so photo fields are empty/optional) and careers' "Open Positions" (same — empty/optional photo).
11. **CTA banner**: added a hint under the photo field — "This photo appears as the background of the banner, behind a dark overlay." (existing seeded CTA blocks already had equivalent wording; new blocks now get it too).
12. **New Team member card block**: name, title, body text, photo. About page's "Our team" section (previously a generic Content card grid) was fully migrated to this new type with the real 9-person roster (Michael Burstein, Patricia Perozo, Kali Lewis, Cle Diggins, Jeff Catania, Tatiana Smith, Erika Tom, Anna Banchik, Runako Godfrey) — real bios and real headshot photos pulled from `about-FINAL.html`.
13. **New Accordion block**: question + answer pairs, minimum of 2 enforced (the remove button on the last 2 cards is blocked with a toast: "An accordion needs at least 2 questions"). Modeled on product page's "Questions to Ask Any Income Verification Vendor" Q&A pattern. This is additive only — the existing Text block with that same heading on the Product page was left as-is (out of scope; the user can migrate it to an Accordion block manually later if desired).
14. **Also fixed as a side-effect**: `previewImage()` had a pre-existing bug where it assumed every photo field already had an `<img>` tag — true for fields using `uploadBlock()` (existing photo) but not for the empty "click to upload" CTA-style fields (used by Hero/CTA banner and now several of the above). Uploading a file into an empty photo field silently failed before this fix. `previewImage()` now detects the missing `<img>` and rebuilds the field into the working `uploadBlock()` layout on first upload, for both states.

New/changed helper functions in `admin-page-editor.html`: `emptyPhotoField(labelText)`, `buttonPairFields()`, `addStepCard(btn)`, `addPhotoMiniCard(btn, cardLabel)`, `addTeamCard(btn)`, `addAccordionTab(btn)` / `removeAccordionTab(btn)` — all follow the existing convention (`const list = btn.previousElementSibling`) already used by `addGenericMiniCard`/`addGenericPartner`.

## Add-a-block modal — round 2 (2026-08-12, same day, pre-handoff)
Second round of feedback on the same modal/editor, 9 more items, all implemented and verified the same way (HTML well-formedness via Python `html.parser`, JS syntax via Node, CSS brace-balance):

1. **Background color field added to every block**: new `backgroundColorField(selectedColor)` helper renders a "Background color" dropdown offering the full brand palette from `shared.css :root` (White, Cool white, Pale verdigris, Forge, Copper, Deep copper, Steel, Aluminum, Light aluminum, Verdigris) plus a "Default (page background)" option. Added to all 15 `panelBodyFor` block-type templates and all 34 existing seeded blocks across every page. All seeded blocks default to "Default" (no color history was invented — this is a purely additive admin field with no live-rendering effect yet).
2. **Primary/secondary hero & photo+text buttons are now optional**: previously always-visible, now start collapsed as a "+ Add primary button" / "+ Add secondary button" toggle (same add/remove pattern as the existing pullquote field) — clicking reveals "button text" + "button links to", with a remove icon to collapse it back. New helpers: `buttonSlot(kind, text, link)`, `addButtonToBlock(btn, kind)`, `removeButtonFromBlock(btn)`; `buttonPairFields()` now takes optional `(primaryText, primaryLink, secondaryText, secondaryLink)` args so seeded blocks with real buttons (home hero: "Request a demo"/"See how it works") render pre-added, while blocks with no real buttons render collapsed. Scoped to Hero and Photo+text only — the standalone Button block and the CTA banner's button are core to those blocks and stayed required.
3. **Step timeline**: removed the overall block's Heading field (each step's own "Step heading" field is unaffected and still required) — applied to the Add-a-block template and both existing seeded step blocks (home, product).
4. **Accordion language**: "Question 1"/"Question 2" card labels → "Item 1"/"Item 2"; "Question" field → "Heading"; "Answer" field → "Text"; minimum-of-2 toast now reads "An accordion needs at least 2 items."
5. **All "Body text" field labels → "Text"** (more concise) — 32 occurrences across every block template and seeded block.
6. **All "Title" field labels → "Heading"** — 12 occurrences (generic mini-cards: content cards, case-study cards, comparison rows, job postings). Deliberately excluded the Team member card's "Title" field (10 occurrences, including `addTeamCard()`) since that means a person's job title, not a card heading — renaming it to "Heading" would've been confusing ("Heading: Co-Founder, Executive Director" doesn't read right). Flagging this judgment call in case it's not what was intended.
7. **Dashboard "Recent blog posts" table**: outer card's corners squared off (`border-radius: 0` added alongside its existing `padding: 0` override) to match the already-square table inside it.
8. **Block renamed again**: "Linked card grid" → "Linked card grid (clickable)"; "Info card grid" → "Card grid (not clickable)" — updated in the modal buttons and both blocks' 4 seeded instances; trimmed the now-redundant "cards are clickable/not clickable" sentence from each description since the name says it now.
9. **Add-a-block modal (and the Media library modal, which shares the identical header+description+scrollable-grid structure) restructured** so the title/close button/description stay pinned at the top and only the block grid or media grid scrolls below them. This also fixes the corner-radius bug more robustly than the earlier scrollbar-styling-only fix: the outer modal now uses `overflow: hidden` with the scroll region as a separate inner element, so the rounded corners are guaranteed regardless of how the browser draws the scrollbar. New CSS: `.a-modal--scroll`, `.a-modal-sticky`, `.a-modal-scroll-body`.

## Add-a-block modal — round 3 (2026-08-12, same day, polish pass)
1. **Field spacing fixed across Hero and Photo + text**: the gap between the Hero photo field and the optional button toggles, and between the 3 stacked "+ Add..." buttons (pullquote / primary button / secondary button) in Photo + text, was inconsistent (as little as 4px in places) because the new optional-button CSS didn't match the site's existing top-margin-only field rhythm. `.a-add-pullquote-btn` and `.a-add-button-btn` are now both `margin-top: 16px` (matching `.a-field`'s own 16px rhythm), so every gap in that stack reads as equal. Also fixed the optional-button's trash/remove icon, which had an erroneous negative top margin (`margin: -4px 0 8px`) pulling it up against the link-picker dropdown above it — changed to `margin-top: 6px`, matching the pullquote's own remove-icon spacing exactly.
2. **"Team member card" → "Team member grid"** — renamed everywhere (modal button, About page's seeded "Our team" block) to match the "grid" naming convention already used by Linked card grid / Card grid (not clickable).
3. **Dashboard "Recent blog posts" table**: rows are now fully clickable (the whole row navigates to `admin-blog-editor.html`, not just the old "Edit" text link), and the text link was replaced with a pencil-icon button — both changes match the pattern already used on `admin-blog-list.html`'s post table (`.a-post-row` + `goToEditor()` + `.a-row-actions` with a pencil `<a class="a-icon-btn">` and `event.stopPropagation()` so the icon buttons don't also trigger the row click).

## Add-a-block modal — round 4 (2026-08-12, same day, polish pass)
1. **Hero block: photo-to-button spacing still cramped after round 3's fix** — round 3 fixed the *empty*/collapsed state's spacing (`.a-add-button-btn { margin-top: 16px; }`), but the *filled* state (a button already added, showing its text/link fields) was still cramped because that spacing comes from a completely different CSS rule: `.a-field-row`'s own `margin-top: 16px`. Root cause: once a button is added, its `.a-field-row.a-button-block` becomes the literal first child of the new `.a-button-slot` wrapper div, which unintentionally matches the pre-existing generic rule `.a-field-row:first-child { margin-top: 4px; }` (written for a different case — a field-row that opens an entire panel, e.g. the Photo position toggle) instead of the normal 16px rhythm. Same latent bug also affected the pullquote field's filled state (`.a-pullquote-slot .a-field:first-child` colliding with the general `.a-field:first-child { margin-top: 4px; }`), so both were fixed together with two new higher-specificity, scoped overrides in `admin.css`: `.a-button-slot .a-field-row:first-child { margin-top: 16px; }` and `.a-pullquote-slot .a-field:first-child { margin-top: 16px; }`. The general `:first-child` rules themselves were left untouched since they're correct in their original context.
2. **Linked card grid: new "Card links to" picker on every card** — each card in a Linked card grid (clickable) block now has a link-destination dropdown (site pages, or a "Custom link..." escape hatch), added right after the card's photo field. Implemented by extending `addPhotoMiniCard(btn, cardLabel, includeLink)` with a new `includeLink` boolean param that conditionally appends `linkPicker('', 'Card links to')`; the 3 "Add a linked card" buttons (Add-a-block template + product's and impact's seeded case-study blocks) now pass `true`. The 3 "Card grid (not clickable)" call sites (content cards, job postings) were left unchanged — no link picker, matching the block's name. All 4 existing seeded case-study cards (product's Pennsylvania DHS/Arizona DES, impact's same two states) got the new field too, seeded unselected/empty rather than with an invented URL — checked the real `product-FINAL.html` markup and confirmed both live case-study cards currently link to `#` (case studies are still pending draft/approval), so there's no real destination to pre-fill yet.

## Known follow-ups / open items
* Wire real backend: Supabase Auth (single admin login), Postgres tables (`pages`, `sections`, `blog_posts`, `blog_blocks`, `media`, `settings`), Storage bucket for uploads — see build-order notes discussed in chat (not yet written to a file).
* Contact form → email: use a Vercel serverless API route + Resend (verify DPW's sending domain), targeting `info@digitalpublicworks.org`; log submissions to a Supabase table as backup. (Formspree is the faster/lower-effort alternative if launch speed matters more than owning the pipeline.)
* `public/images/people-meeting-laptops.png` was confirmed unused anywhere in the codebase (grep across HTML/CSS came up empty) and flagged as a likely-safe duplicate to delete — not yet deleted, pending user confirmation.
* Orphaned funder-logo image files found during the 2026-08-12 code cleanup pass (see above) — also not yet deleted, pending user confirmation.
* Custom pages created in the admin have a disabled "View" link (`#`) since there's no real public page to link to yet — expected until Supabase-backed pages exist.
* "Button links to" label wording open question (see above) — never resolved, low priority.
