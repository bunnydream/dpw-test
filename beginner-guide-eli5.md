# Building the DPW Site — Beginner Walkthrough (No Coding Required)

This is the "what do I actually click" companion to `claude-code-handoff-plan.md`. You already have Vercel and Supabase accounts — you do NOT need an account for Next.js; it's just code that Claude Code installs into your project, not a service you sign up for.

## The 4 pieces, in plain English

- **GitHub** — an online filing cabinet that stores your project's code. You already have this (`bunnydream/dpw-test`).
- **Next.js** — not a website or account, just a free toolkit/set of rules for how the code is organized. Claude Code installs and uses it for you. You'll never log into "Next.js" anywhere.
- **Supabase** — your database and your login-checker. It stores page content, blog posts, contact form messages, and decides who's allowed into the admin area.
- **Vercel** — the "stage" that shows your site to the public. It watches your GitHub filing cabinet, and whenever the code changes, it automatically updates the live website.

Claude Code is the one doing the actual coding. Your job is: create a couple of things through Supabase's and Vercel's websites (mostly clicking, not typing code), copy some keys/passwords into the right boxes, and describe what you want in plain sentences.

## Step-by-step

### 1. Open Claude Code in your project folder
This is the same `dpw-test` folder you've been using. Claude Code reads `CLAUDE.md`, `summary.md`, and `contact-form-handoff.md` automatically for context — you don't need to re-explain the project.

**What to say to it, roughly:** "I want to turn this static HTML site into a real Next.js site hosted on Vercel, with Supabase for the database and admin login. Here's my plan: [paste or attach claude-code-handoff-plan.md]. Let's start with Step 1 (repo cleanup) and Step 2 (scaffolding), and walk me through anything you need from me."

### 2. Create your Supabase project (if you haven't already for this site)
In supabase.com, click **New Project**, give it a name (e.g. "dpw-website"), pick a password for the database (Supabase generates one for you — just save it somewhere safe), and a region close to your users.

### 3. Grab your Supabase keys
Inside the Supabase project: **Settings → API**. You'll see three things you'll need later:
- **Project URL**
- **anon public key**
- **service_role key** (this one is secret — never share it publicly or paste it into a public webpage)

Think of these like a building address (URL) and two different keycards (anon = "public visitor" access, service_role = "master key," server-only).

### 4. Let Claude Code build the database tables
Rather than typing SQL yourself, ask Claude Code to write the table-creation scripts (it already has a head start — `contact-form-handoff.md` includes one). It will either run these for you if it has a Supabase connection set up, or hand you a block of SQL to paste into Supabase's **SQL Editor** and click **Run**. Either way, you're just clicking a button, not writing database code.

### 5. Store your keys safely
Claude Code will create a file (usually called `.env.local`) that holds your Supabase keys privately on your own machine — this file is never uploaded to GitHub (there's a `.gitignore` rule that excludes it). Think of it as a locked notes app just for passwords.

### 6. Connect GitHub to Vercel
In vercel.com: **Add New → Project**, then pick your `bunnydream/dpw-test` GitHub repo from the list and click **Import**. Vercel will ask a couple of setup questions (framework = Next.js, it usually detects this automatically) — accept the defaults unless Claude Code tells you otherwise.

### 7. Paste your keys into Vercel too
In the Vercel project: **Settings → Environment Variables**. Paste in the same Supabase URL/keys from Step 3, plus the Resend email key once you set that up for the contact form. This is Vercel's version of the same locked notes file, but for the live website instead of your own computer.

### 8. Let Claude Code build in phases
Work through the phases from the handoff plan one at a time (scaffold → connect Supabase → make pages dynamic → admin login/editing → contact form → etc.), checking that each piece works before moving to the next. You don't need to understand the code — just look at the actual pages in your browser and tell Claude Code "this looks right" or "this is broken, here's what I see."

### 9. Every save = automatic update
Once connected, any time Claude Code saves changes to GitHub, Vercel notices and automatically rebuilds the live site within a minute or two — no manual "publish" step on your end for code changes. (Separately, once the admin panel is wired up, *content* edits — like editing a page's text — publish instantly through Supabase, without needing a code change at all.)

### 10. Final testing checklist (things to click through yourself)
- Visit the live Vercel URL — do all 7 pages look right?
- Log into `/admin` — can you get in? Can someone who *isn't* logged in get in? (They shouldn't be able to.)
- Edit a block of text in the admin, hit Publish, then check the public page updates.
- Submit each of the 3 contact forms — do you receive the email, and does the row show up in Supabase's **Table Editor**?
- Try deleting a page in admin, confirm it goes to "Deleted pages" instead of vanishing.

If anything on this list doesn't work, that's exactly the kind of thing to hand back to Claude Code with a screenshot or description — you're the tester, it's the builder.
