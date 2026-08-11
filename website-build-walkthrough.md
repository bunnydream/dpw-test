# DPW Website — Full Setup & Build Walkthrough

Updated 2026-08-11. This is the single, current step-by-step to follow — it supersedes the ordering in the earlier two files (`claude-code-handoff-plan.md`, `beginner-guide-eli5.md`), which still have good background detail but got ahead of where things actually stood. Statuses below reflect where you are right now.

## Where things stand today

- **GitHub** — ✅ Done. Repo transferred from your personal account to a new GitHub account you created for DPW. Your local project folder's `git remote` should already be pointed at the new URL (confirm with `git remote -v`).
- **Vercel** — Account created, nothing set up inside it yet.
- **Supabase** — Account created, nothing set up inside it yet.
- **Resend** (for contact-form emails) — Not created yet. Not urgent — only needed once you reach the contact-form phase.

---

## Part 1 — Set up the accounts

### 1. Create the Supabase project
Log into the DPW Supabase account → **New Project**. Give it a name (e.g. "dpw-website"), let Supabase generate a database password (save it somewhere safe — it's shown only once), pick a region close to your users. Nothing else to configure by hand yet; Claude Code will build the actual tables later.

### 2. Create the Vercel project
Log into the DPW Vercel account → **Add New → Project**. It'll ask to connect a GitHub account — make sure you authorize it against the **new DPW GitHub account** (not your personal one), and grant it access to the `dpw-test` repo. Select `dpw-test` and click **Import**. If it asks about framework/build settings and the repo is still plain HTML at this point, it's fine to accept defaults for now — that gets sorted out once the Next.js migration happens in Part 3.

### 3. Grab your Supabase keys
In the Supabase project: **Settings → API**. Note down (you'll paste these in two places later — your local machine and Vercel):
- **Project URL**
- **anon public key**
- **service_role key** — keep this one private, it's a master key, never expose it publicly

### 4. Create a Resend account (can wait, but good to knock out now)
Sign up at resend.com under DPW's ownership (same reasoning as Vercel/Supabase — a client asset, not yours). You'll eventually verify DPW's sending domain there and generate an API key — Claude Code will walk you through the exact fields when you reach the contact-form phase.

---

## Part 2 — Clean up the repo before building

Open the `dpw-test` folder in Claude Code and work through this before asking it to build anything new:

1. **Resolve uncommitted changes.** `git status` will likely still show modified/deleted images and an untracked `public/images/ORIGINALS/` folder from earlier work. Ask Claude Code to review and commit (or discard) these so you're starting from a clean state.
2. **Decide on pending content edits now.** `summary.md` has a running list of `⚠️ PENDING` items (Michael's feedback on copy/style, the "DRK Foundation" vs "Draper Richards Kaplan" naming question, image compression). Fixing these while pages are still plain HTML is easier than fixing them twice — once in HTML, again after the content moves into the database.
3. **Confirm the unused image.** `summary.md` flags `public/images/people-meeting-laptops.png` as an apparent unused duplicate — confirm and delete if so.

---

## Part 3 — Confirm the architecture with Claude Code

Tell Claude Code you want to migrate the static HTML site to **Next.js, deployed on Vercel, with Supabase for auth + database + file storage.** This is the recommended path because it's what lets an admin's content edit show up on the live public site without you manually rebuilding anything — Vercel and Next.js are built to work together this way. Your existing `shared.css` and page markup carry over largely as-is; only the "hardcoded content" part changes to "content pulled from the database."

---

## Part 4 — Build it with Claude Code, in phases

Work through these as separate Claude Code sessions/prompts, checking each one actually works before moving to the next:

1. **Scaffold** — set up the Next.js app, port `shared.css` and the 7 pages from `FINAL PAGES/` in as static routes first (no database yet), to confirm the visual migration works before adding data.
2. **Connect Supabase** — give Claude Code your Supabase URL/keys (see Part 5 below for where these live), have it build the database tables (`pages`, `sections`, `blog_posts`, `blog_blocks`, `media`, `settings`, `deleted_pages`, `contact_submissions`), and seed `pages`/`sections` from the real content in `FINAL PAGES/*.html`.
3. **Make the public site dynamic** — pages render from Supabase instead of hardcoded HTML. Also build the missing blog-post detail page (currently only the Insights index/card grid exists).
4. **Wire up admin login + editing** — connect Supabase Auth to the `admin-login.html` design, connect the page/blog editors to real create/update/publish actions, and set up "Publish" to instantly update the live page (no full redeploy needed).
5. **Media library** — connect image uploads to Supabase Storage; wire up the "replace photo" picker in the admin.
6. **Contact form** — build exactly to the spec already written in `contact-form-handoff.md`: form submits → Vercel function → saves to `contact_submissions` in Supabase → sends email via Resend.
7. **Deleted pages** — replace the mockup's browser-only "soft delete" with a real database table and a real scheduled job that permanently deletes after 30 days.
8. **Settings** — wire the admin email/password screen to Supabase Auth.

---

## Part 5 — Where your keys actually go

You'll paste the same Supabase (and later Resend) keys into two different places:

- **On your own computer**, Claude Code will create a file usually called `.env.local` — a private notes file that holds these keys for when you're testing the site locally. It's automatically excluded from GitHub, so it never gets uploaded publicly.
- **In Vercel**, under the project's **Settings → Environment Variables** — this is what the *live* website uses once deployed.

Claude Code will tell you exactly which variable names it needs (matching `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`) — you're just copy-pasting values from Supabase/Resend's dashboards into the right boxes.

---

## Part 6 — Before you consider it launched

- Test that someone who ISN'T logged in can't reach `/admin` pages.
- Test that the anon (public) Supabase key can't be used to write/edit data — only to read published content.
- Publish an edit in the admin and confirm it shows up on the live public page.
- Submit all three contact forms and confirm you get the email AND see the row appear in Supabase's Table Editor.
- Delete a test page and confirm it lands in "Deleted pages" instead of disappearing outright.
- Do one more pass through `summary.md`'s `⚠️ PENDING` list — easy to lose track of small copy/style fixes once backend work is underway.
- Decide on a production domain (custom domain vs. the default `*.vercel.app` address) and get it pointed at Vercel.
