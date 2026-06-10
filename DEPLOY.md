# DPW Website — Deploy Guide

Follow these steps once to get the site live. After that, every time you save a file, Vercel auto-redeploys.

---

## Prerequisites (one-time installs)

1. Install **Node.js** from https://nodejs.org (click "LTS" version)
2. Install **Git** from https://git-scm.com
3. Create a free account at https://github.com
4. Create a free account at https://vercel.com (sign up with your GitHub account)

---

## Step 1 — Test the site locally

Open **Terminal** (Mac: press Cmd+Space, type "Terminal", press Enter).

```bash
# Navigate to the project folder
cd ~/Documents/DPW-Project

# Install dependencies (first time only)
npm install

# Start the local dev server
npm run dev
```

Then open your browser and go to **http://localhost:3000**

You should see:
- Homepage at http://localhost:3000
- Admin login at http://localhost:3000/admin/login
- Admin dashboard at http://localhost:3000/admin

Press Ctrl+C in Terminal to stop the server.

---

## Step 2 — Push to GitHub

In Terminal:

```bash
cd ~/Documents/DPW-Project

# Initialize git (first time only)
git init
git add .
git commit -m "Initial DPW website"

# Create a new repo on GitHub:
# 1. Go to https://github.com/new
# 2. Name it "dpw-website"
# 3. Leave it Private
# 4. Click "Create repository"
# 5. Copy the commands shown under "...or push an existing repository from the command line"
# They will look like:
git remote add origin https://github.com/YOUR-USERNAME/dpw-website.git
git branch -M main
git push -u origin main
```

---

## Step 3 — Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click **"Add New Project"**
3. Click **"Import"** next to your `dpw-website` GitHub repo
4. Leave all settings as default — Vercel auto-detects Next.js
5. Click **"Deploy"**

Your site will be live at a URL like `https://dpw-website.vercel.app` in about 2 minutes.

---

## Step 4 — Connect a custom domain (optional)

1. In Vercel, go to your project → **Settings → Domains**
2. Add `digitalpublicworks.org`
3. Vercel will show you DNS records to add — log in to your domain registrar and add them

---

## Day-to-day workflow

To make a change and redeploy:

```bash
cd ~/Documents/DPW-Project

# After making changes in Claude or a code editor:
git add .
git commit -m "Update homepage hero text"
git push
```

Vercel automatically detects the push and redeploys within ~1 minute.

---

## File structure

```
DPW-Project/
├── app/
│   ├── layout.jsx          ← Root layout (fonts, metadata)
│   ├── globals.css         ← All shared styles
│   ├── page.jsx            ← Homepage
│   └── admin/
│       ├── login/
│       │   └── page.jsx    ← Admin login
│       └── page.jsx        ← Admin dashboard (CMS)
├── public/
│   └── logo/               ← Logo SVG files
├── package.json
├── next.config.mjs
└── .gitignore
```

---

## Coming next: Supabase (for real auth + content storage)

Once the site is live on Vercel, we'll add Supabase to:
- Replace the demo login with real email/password authentication
- Save CMS block edits to a database so content persists
- Connect the blog (Insights page) to a content table

That setup guide will be provided when we reach the CMS integration phase.
