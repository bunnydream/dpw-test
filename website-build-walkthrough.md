# DPW Website — Full Build Walkthrough (Claude Code Edition)

Updated 2026-08-12. This is the one file to follow — it replaces the ordering/content from earlier drafts (now in `archive/`). Written for someone with zero coding background: every step spells out exactly what to click or type.

**Folder name:** everything below assumes the project folder is `dpw-website` (renamed from `dpw-test`). If you see `dpw-test` anywhere else (old messages, the GitHub repo name itself if you haven't renamed that too), just mentally swap in `dpw-website`.

## Where things stand today

- **Designs** — ✅ Done and approved by DPW. `FINAL PAGES/` (7 pages) and `ADMIN PAGES/` (admin mockup) are final. Nothing here should be redesigned — only migrated into a real, working app.
- **GitHub** — ✅ Done. Repo transferred to a GitHub account owned by DPW.
- **Vercel** — Account created, nothing set up inside it yet.
- **Supabase** — Account created, nothing set up inside it yet.
- **Formspree** — Not created yet, needed for the contact form (see Part 2).
- **Images** — ⚠️ Needs attention before launch — see Part 3. Good news: they are NOT embedded inside the HTML (I checked — zero base64/embedded images in any of the 7 pages, they're normal file references, which is correct). The real problem is file size: `public/images/` is currently **205MB total**, with individual photos as large as **16MB each**. That would make the live site painfully slow to load. Part 3 covers exactly how this gets fixed.

---

## Part 0 — What "Claude Code" actually is, and how you'll use it

Claude Code is a separate program from this chat — it runs in a Terminal window directly on your Mac, inside your actual project folder, and it can read/write files, run commands, and show you a live preview of the site as it's built. This is different from working with Claude here in the browser/desktop app; think of it as "Claude, but working directly on your hard drive with full building tools."

**Good news: it looks like it's already installed on your Mac.** There's a `.claude` settings file already inside your `dpw-website` folder, which only gets created after Claude Code has been run there before — likely from when the design pages were being built. So you probably don't need to install anything; just open it.

### Step-by-step, first time

1. **Open Terminal.** Press `Cmd + Space` (Spotlight), type `Terminal`, hit Enter. A plain black/white text window opens — this is completely normal, don't worry about anything in it looking "scary."

2. **Navigate to your project folder.** Type this and press Enter:
   ```
   cd ~/Desktop/dpw-website
   ```
   (If the folder isn't directly on your Desktop, adjust the path — or just type `cd ` with a trailing space, then drag the `dpw-website` folder from Finder directly into the Terminal window, which auto-fills the correct path, then press Enter.)

3. **Start Claude Code.** Type:
   ```
   claude
   ```
   and press Enter. If it's your first time ever using it, a browser window will pop open asking you to log into your Claude account — log in, and it'll return you to the Terminal automatically.

   If instead you get an error like `command not found`, it's not installed — run this first, then repeat step 3:
   ```
   curl -fsSL https://claude.ai/install.sh | bash
   ```
   (Prefer to avoid Terminal commands entirely? There's also a graphical Claude Code desktop app you can download instead — see [the official setup guide](https://code.claude.com/docs/en/setup) — but the terminal method above is what the rest of this walkthrough assumes.)

4. **You're in a session.** You'll see a prompt where you can type. This is where you'll paste the big kickoff prompt at the bottom of this document.

### What happens while it works

- Claude Code will periodically stop and ask permission before doing something — running a command, creating/editing a batch of files, installing a package. It'll show you what it wants to do and give you options like "Yes," "Yes, and don't ask again for actions like this," or "No." For this build, it's fine to approve almost everything — pause and ask it to explain if something looks unexpected (e.g., it wants to delete a folder you didn't expect).
- To **preview the site as it's being built**, Claude Code will usually run a command like `npm run dev` and tell you to open `http://localhost:3000` in your regular web browser (Chrome, Safari, whatever). That tab will show you the live site, and refreshes automatically as changes are made. Keep the Terminal window open in the background while you do this — closing it stops the preview.
- To **stop the preview server**, click into the Terminal window and press `Ctrl + C`.
- To **end a session**, just close the Terminal window, or type `exit`. To pick back up later, repeat steps 1–3 above (`cd` into the folder, run `claude`) — it automatically re-reads `CLAUDE.md` and remembers the project.
- Claude Code will periodically offer to **commit and push to GitHub** — approve these when they come up; that's what keeps your code backed up and (once Vercel is connected) triggers the live site to update.

---

## Part 1 — Set up the accounts

### 1. Create the Supabase project
Log into the DPW Supabase account → **New Project**. Name it (e.g. "dpw-website"), let it generate a database password (save it somewhere safe — shown only once), pick a nearby region. Nothing else to configure by hand; Claude Code builds the actual tables later.

### 2. Create the Vercel project
Log into the DPW Vercel account → **Add New → Project**. Connect it to GitHub, authorizing against the **DPW GitHub account**, granting access to the `dpw-website` repo. Select it and click **Import**. If it asks about framework/build settings while the repo is still plain HTML, accept the defaults for now — Claude Code sorts this out once the Next.js migration happens.

### 3. Grab your Supabase keys
In the Supabase project: **Settings → API**. Note down (you'll paste these into two places later):
- **Project URL**
- **anon public key**
- **service_role key** — private, never share or expose publicly

### 4. Create a Formspree account
Sign up at formspree.io under DPW's ownership. Create **three separate forms** (State Partner, Funder, General) so each gets its own free-tier 50-submissions/month allowance. For each, set the destination email to `info@digitalpublicworks.org` and copy its endpoint URL (`https://formspree.io/f/xxxxxxx`) — you'll hand these to Claude Code when you reach that phase.

---

## Part 2 — The contact form (already decided)

Using Formspree — see `summary.md`'s "Contact Form — Formspree Integration" section for the exact HTML changes. `contact-form-handoff.md` documents the more complex Vercel+Supabase+Resend alternative but is marked as not in use for launch.

---

## Part 3 — Fixing the images (the "handle this properly" part)

Two separate issues, both real, neither is "images embedded in the HTML" (confirmed that's not happening):

**Issue 1 — the source files are just too big.** `public/images/` is 205MB, with individual photos up to 16MB. A single 16MB photo can take visitors on a normal connection several seconds (or longer on mobile) to load — that's the actual site-speed killer. There's also a `public/images/ORIGINALS/` folder (48MB) that looks like a working folder of raw source photos that should never be served to the public at all.

**Issue 2 — plain `<img>` tags don't optimize themselves.** A normal HTML `<img src="...">` tag loads the full-size file exactly as-is, for every visitor, on every device, all at once (no lazy loading, no smaller versions for phones). Next.js has a built-in `<Image>` component that fixes all of this automatically once deployed on Vercel — it resizes images on the fly for each visitor's screen, only loads images as the visitor scrolls to them, and converts to modern efficient formats (WebP/AVIF) — at no extra cost or separate service.

**The fix (already written into the kickoff prompt below, so Claude Code handles it as part of the build):**
1. Compress and resize every image in `public/images/` — cap the longest side at a sensible web size (roughly 2000–2500px is plenty for a full-width hero photo, even on high-resolution screens) and re-compress JPEGs to a quality level that's visually lossless but a fraction of the file size. This alone should take most of these files from multi-MB down to well under 500KB each.
2. Exclude `public/images/ORIGINALS/` from anything public-facing — it shouldn't ship to the live site at all.
3. Once migrated to Next.js, replace every `<img>` tag with the `next/image` component.
4. For images uploaded later through the admin media library, store them in Supabase Storage and render them through `next/image` too (this needs a small config change — `remotePatterns` in `next.config.js` — so Next.js trusts Supabase's URLs).

You don't need to do any of this by hand — it's step 1 of the kickoff prompt at the bottom of this doc, so Claude Code does it as the very first thing, before building anything else on top of it.

---

## Part 4 — Clean up the repo before building

Once you're in a Claude Code session (Part 0), before pasting the kickoff prompt, it's worth asking it to review and commit (or discard) any leftover uncommitted changes (`git status` may still show some) so you're starting from a clean state.

(Note: `summary.md` used to track a running list of client-feedback/polish `⚠️ PENDING` items per page. As of 2026-08-12 those have all been reviewed and dropped — the designs in `FINAL PAGES/` and `ADMIN PAGES/` are final as-is, nothing further to reconcile there.)

---

## Part 5 — The kickoff prompt

Once you're in a Claude Code session inside `dpw-website`, paste this whole block in and press Enter:

```
I'm handing off a fully-designed, client-approved static website to migrate into a real production app. Before doing anything else, read CLAUDE.md, summary.md, and contact-form-handoff.md for full context. Note: contact-form-handoff.md is superseded — we're using Formspree instead of that Vercel+Supabase+Resend plan, per the note at the top of that file and the "Contact Form — Formspree Integration" section in summary.md.

Project: Digital Public Works (DPW), a 501(c)(3) nonprofit. This folder contains:
- FINAL PAGES/ — 7 finished, CLIENT-APPROVED public pages (home, about, product, impact, careers, contact, insights), plain HTML/CSS, no build step, sharing shared.css. This is the final design — do not redesign, restyle, or "improve" anything visually. Just faithfully migrate it.
- ADMIN PAGES/ — a static HTML/CSS/JS mockup of an admin CMS (login, dashboard, page editor, blog editor, settings, deleted-pages view), no real backend yet. Also final design, not to be restyled.
- public/images/ — currently unoptimized: ~205MB total, several individual files 8-16MB. Needs real compression before this ships.

Build goals, roughly in this order:

1. IMAGES FIRST: compress and resize every image in public/images/ (cap the longest edge at ~2000-2500px, re-compress JPEGs to a visually-lossless-but-much-smaller quality level). Exclude public/images/ORIGINALS/ from anything public-facing entirely. Confirm the total folder size drops dramatically before moving on.

2. Migrate to Next.js (App Router), deployed on Vercel, with Supabase for the database, authentication (admin login), and file storage. Port shared.css and the exact markup/structure from FINAL PAGES/ in as the initial routes — confirm the visual migration matches before adding any dynamic data.

3. Replace every <img> tag with the next/image component for automatic lazy-loading, responsive sizing, and modern-format conversion.

4. Public site: the 7 pages should render dynamically from a Supabase database (pages/sections tables, block-based, matching the block types already modeled in ADMIN PAGES/admin-page-editor.html and documented in summary.md's admin architecture notes) rather than staying hardcoded — this is what lets admin edits show up live. Build a blog-post detail page for Insights posts, which doesn't exist yet (currently only the index/card grid does).

5. Admin CMS: wire real Supabase Auth login, and connect the page/blog block editors in ADMIN PAGES/ to real create/update/publish actions against the database. "Publish" should update the live public page via on-demand revalidation, not a full redeploy. Media/photo uploads in the admin should go to Supabase Storage and render through next/image (configure remotePatterns for Supabase's storage domain).

6. Contact form: 3 separate forms (state-partner-contact, funder-contact, general-contact) — wire each to its own Formspree endpoint per summary.md's integration notes. I'll give you the 3 endpoint URLs — ask me for them if you need them before finishing this part.

7. Deleted pages: replace the mockup's localStorage-based soft delete with a real Supabase table and a real scheduled 30-day purge job (not just client-side recalculation).

8. Settings: wire the admin email/password screen to Supabase Auth.

Before writing any code, give me a short summary of your plan and build order, and ask me for anything you need (Supabase project URL/keys, Formspree endpoints, etc.).
```

---

## Part 6 — Where your keys actually go

Formspree needs no API key or environment variable — its endpoint URLs just get pasted directly into each form's `action` attribute in the HTML.

Supabase keys go in two places:
- **On your computer**, Claude Code creates a file called `.env.local` — a private notes file for testing locally. Automatically excluded from GitHub, never uploaded publicly.
- **In Vercel**, under the project's **Settings → Environment Variables** — what the live website actually uses.

Claude Code will tell you the exact variable names it needs (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) — you're just copy-pasting values from Supabase's dashboard into the right boxes.

---

## Part 7 — Before you consider it launched

- Open the live site on a slow/mobile connection (or Chrome DevTools' network throttling) and confirm pages actually feel fast — this is your real check that the image fixes worked.
- Test that someone who ISN'T logged in can't reach `/admin` pages.
- Test that the anon (public) Supabase key can't be used to write/edit data — only to read published content.
- Publish an edit in the admin and confirm it shows up on the live public page without a full redeploy.
- Submit all three contact forms and confirm you get the email at `info@digitalpublicworks.org`, and each shows up in Formspree's dashboard.
- Delete a test page and confirm it lands in "Deleted pages" instead of disappearing outright.
- Decide on a production domain (custom domain vs. the default `*.vercel.app` address) and point it at Vercel.
