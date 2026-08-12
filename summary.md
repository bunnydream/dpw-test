# DPW Website — Session Summary
Last updated: 2026-08-12 (designs finalized — all outstanding client-feedback/polish items reviewed and dropped, see note below)

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
* Funders section: logos only, no `.funder-role` orange text. Default cool-white bg.
* Organization Status section: white bg, below "Backed by"

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

### insights-FINAL.html *(new — Session 6)*
* Hero: white bg, `section-pad`, text-only. h1: "Insights". Subtitle from docx.
* Posts section: cool-white bg, category filter pills + 3 placeholder cards:
  1. Policy — "How H.R. 1 Changes the Stakes for Income Verification"
  2. Service Design — "The 40% Problem: When the Process Fails Before the Technology Does"
  3. Accessibility — "Accessible by Design: What Our Research on VMI Is Revealing"
* Filter JS: `data-cat` attributes + `display: none/''` toggle on pill click
* Subscribe section: white bg, "Stay in the loop" email form

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
* Logo files: navbar and footer logos are inline SVGs; footer logo height via `.footer-logo svg { height: 48px; }`
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
* Block types available in the "Add a block" modal: Hero, Heading, Text block, Photo + text, Step timeline, Stat row (always exactly 4 stats), Pullquote, Quote carousel, Comparison card, Case study grid, Content card grid, Partners, CTA banner.
* **Photo + text blocks**: pullquote is an optional sub-block, added via a "+ Add pullquote" button, always rendered directly below the body-paragraph field, removable. Implemented via `pullquoteSlot()` / `addPullquoteToBlock()` / `removePullquoteFromBlock()`.
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

## Known follow-ups / open items
* Wire real backend: Supabase Auth (single admin login), Postgres tables (`pages`, `sections`, `blog_posts`, `blog_blocks`, `media`, `settings`), Storage bucket for uploads — see build-order notes discussed in chat (not yet written to a file).
* Contact form → email: use a Vercel serverless API route + Resend (verify DPW's sending domain), targeting `info@digitalpublicworks.org`; log submissions to a Supabase table as backup. (Formspree is the faster/lower-effort alternative if launch speed matters more than owning the pipeline.)
* `public/images/people-meeting-laptops.png` was confirmed unused anywhere in the codebase (grep across HTML/CSS came up empty) and flagged as a likely-safe duplicate to delete — not yet deleted, pending user confirmation.
* Custom pages created in the admin have a disabled "View" link (`#`) since there's no real public page to link to yet — expected until Supabase-backed pages exist.
* "Button links to" label wording open question (see above) — never resolved, low priority.
