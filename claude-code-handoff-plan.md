# DPW Website — Handoff Plan for Claude Code

Prepared 2026-08-11. This is a plan for taking the `dpw-test` repo (static HTML design files + admin mockup) and having Claude Code build the real, live site on Vercel + Supabase.

## What you already have

- `FINAL PAGES/` — 7 finished public pages (home, about, product, impact, careers, contact, insights), static HTML/CSS, no build step, sharing `shared.css`.
- `ADMIN PAGES/` — a static HTML/CSS/vanilla-JS **mockup** of the admin panel (login, dashboard, page editor, blog editor, settings, deleted-pages view). No backend wired up. One page (`admin-page-editor.html`) already models real content as a `PAGES` object keyed by slug, so it maps cleanly to a database schema.
- `contact-form-handoff.md` — an already-written spec for the contact form backend (Supabase table + Vercel API route + Resend email).
- `summary.md` — detailed build notes: design tokens, CSS conventions, page-by-page notes, admin architecture, and a running list of known gaps.
- `CLAUDE.md` — currently just 4 lines pointing at the logo/copy/brand-guide files.
- A GitHub repo already connected (`origin` → `bunnydream/dpw-test`), with local uncommitted changes right now.

Because the admin panel needs to let someone log in and edit content that then shows up on the public pages, the public pages can't stay as hand-authored static HTML — the content has to come from a database at render time. That's the one architectural fork in the road, so it's step zero below.

---

## Step 0 — Decide the architecture (do this before writing any Claude Code prompt)

**Recommended: migrate to Next.js (App Router), deployed on Vercel, with Supabase for auth + Postgres + Storage.**

Why: Vercel is built around Next.js (first-class ISR/on-demand revalidation, API routes, edge middleware for protecting `/admin`), and it's the natural fit for "admin publishes → public page updates" without needing a separate rebuild pipeline. Your existing `shared.css` and page markup port over largely as-is — Next.js can render the same HTML structure, just with content pulled from Supabase instead of hardcoded.

How content editing reaches the public site: pages render from the `pages`/`sections` tables (see Step 2) using Next.js's data fetching with on-demand revalidation — when the admin hits "Publish," a Vercel API route calls `revalidatePath()` for that page, so visitors get fast static/cached pages that update within seconds of a publish, not a full redeploy.

Alternatives, if you'd rather not migrate frameworks:
- **Static HTML + client-side fetch**: keep the `.html` files, have JS fetch content from Supabase on page load. Simpler to bolt on, but worse for SEO/first-paint and awkward for the "block-based" editing model your admin mockup already assumes.
- **Static HTML regenerated on publish**: keep plain HTML, have the admin's "Publish" action trigger a script that rewrites the static files and pushes/redeploys. Avoids a framework migration but you're building your own mini static-site-generator from scratch — more work than adopting Next.js.

Tell Claude Code which direction you want up front; the rest of this plan assumes the Next.js path since it's the least amount of custom plumbing.

---

## Step 1 — Clean up the repo before handoff

1. Resolve or commit the current uncommitted changes (`git status` shows modified images, a new `admin-deleted-pages.html`, an untracked `public/images/ORIGINALS/` folder, and some deleted image files). Claude Code will work faster and safer starting from a clean tree.
2. Decide now whether to fix the `⚠️ PENDING` content/copy items listed in `summary.md` (Michael's feedback items, the "DRK Foundation" vs "Draper Richards Kaplan" naming question, image compression, etc.) **before** or **after** the backend build. Easiest to fix them first, while pages are still static files — otherwise you're editing content twice (once in HTML, again in the CMS after migration).
3. Delete or confirm the unused `public/images/people-meeting-laptops.png` flagged in `summary.md` as a likely-safe duplicate.

## Step 2 — Stand up Supabase before writing code

Create the Supabase project and get the schema in place first, so Claude Code is wiring against real tables/credentials instead of guessing.

Tables to create (from `summary.md` + `contact-form-handoff.md`):
- `contact_submissions` — already fully speced in `contact-form-handoff.md`, ready to run as-is.
- `pages` — one row per site page (slug, title, meta, published/draft state).
- `sections` — ordered content blocks per page, matching the block types already designed in the admin mockup (Hero, Heading, Text, Photo+text, Step timeline, Stat row, Pullquote, Quote carousel, Comparison card, Case study grid, Content card grid, Partners, CTA banner). Store each block's fields as JSON so new block types don't need schema migrations.
- `blog_posts` + `blog_blocks` — same block-based pattern for Insights posts. Note: there's currently **no public blog-post detail page**, only the index/card grid — that page needs to be built as part of this phase, or posts have nowhere to render.
- `media` — tracks uploads to Supabase Storage (for the "choose from media library" picker in the admin).
- `settings` — admin email/password management screen.
- `deleted_pages` — replaces the mockup's `localStorage`-based soft delete, with a real 30-day countdown enforced by a scheduled job (Supabase `pg_cron` or a Vercel Cron Job hitting an API route), not just client-side recalculation.

Also set up:
- Supabase Auth, single admin user (or a small allowlist), used to gate `/admin/*`.
- Row-Level Security policies: public read on published `pages`/`sections`/`blog_posts`; writes restricted to authenticated admin only; `contact_submissions` insert-only from the server (service role), not exposed to the public.
- A Storage bucket for media uploads (images used in page/post content).

## Step 3 — Set up Vercel

1. Import the GitHub repo (`bunnydream/dpw-test`) into a new Vercel project.
2. Add environment variables (mirror `contact-form-handoff.md`'s list, plus Supabase):
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - Any Supabase Auth redirect/site URL config Next.js needs
3. Verify the sending domain (`digitalpublicworks.org`) in Resend before the contact form goes live.
4. Decide the production domain now (custom domain vs `*.vercel.app`) so Resend/Supabase Auth redirect URLs are configured correctly from the start.

## Step 4 — Give Claude Code the context it needs

Your documentation is already unusually thorough — the main gap is that `CLAUDE.md` (the file Claude Code reads automatically) doesn't point to any of it. Before starting:

1. Expand `CLAUDE.md` to explicitly reference `summary.md` (design tokens, CSS conventions, page-by-page notes, admin architecture) and `contact-form-handoff.md`, so Claude Code picks them up without being told each session.
2. Add the Step 0 architecture decision to `CLAUDE.md` once made, so it's not re-litigated every session.
3. Keep `summary.md`'s "Known follow-ups" section as your running punch list — it already tracks the real gaps (no blog detail page, localStorage soft-delete, unresolved DRK Foundation naming question, etc.).

## Step 5 — Build order to hand Claude Code

Rough phases, each a reasonable Claude Code session/prompt:

1. **Scaffold**: Next.js app, port `shared.css` and the 7 `FINAL PAGES` in as static components/routes first (no database yet) — confirms the visual migration works before adding data.
2. **Supabase wiring**: connect the Next.js app to Supabase (env vars, client setup), seed the `pages`/`sections` tables from the real content already in `FINAL PAGES/*.html` (the admin mockup's `PAGES` object is a ready-made source for this seed data).
3. **Public site goes dynamic**: pages render from Supabase instead of hardcoded HTML; add the missing blog-post detail page.
4. **Admin auth + CRUD**: wire Supabase Auth login to `admin-login.html`'s design, connect the page/blog editors to real create/update/publish against the tables, implement on-demand revalidation on publish.
5. **Media library**: wire uploads to Supabase Storage, connect the "replace photo" picker.
6. **Contact form**: implement exactly per `contact-form-handoff.md` (Vercel API route → Supabase insert → Resend email).
7. **Deleted pages**: move soft-delete off `localStorage` onto the `deleted_pages` table + scheduled purge job.
8. **Settings**: wire the email/password management screen to Supabase Auth.

## Step 6 — Pre-launch QA checklist

- RLS policies actually block unauthenticated writes (test with the anon key, not just in the UI).
- Contact form: verify the Resend domain, test all three forms end-to-end, confirm submissions land in `contact_submissions`.
- Admin routes are unreachable without login (test in an incognito window).
- Publish flow: confirm a published edit shows up on the live public page without a full redeploy.
- Deleted-pages purge job actually runs server-side (not just recalculated on page load).
- Resolve the outstanding "DRK Foundation" vs "Draper Richards Kaplan" naming question before it's baked into seeded content.
- Image compression pass (summary.md flags a 19MB meeting photo and multi-MB headshots).
- Run through the `⚠️ PENDING` items across `summary.md` one more time — some are copy/style fixes that are easy to lose track of once the backend work starts.
