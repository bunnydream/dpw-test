# DPW Website — CMS Architecture Spec
### Handoff document for Claude Code

This document defines the full CMS architecture for the Digital Public Works website. The public site is built in Next.js (Vercel), content is stored in Supabase, and a separate admin interface lets non-technical users manage all content without touching code.

---

## How It Works

The public site fetches content from Supabase at request time (Next.js SSR or ISR). The admin site is a protected Next.js app (separate Vercel project, same Supabase instance) where editors log in and manage content through form-based UIs.

Pages are made of **sections** stacked in order. Each section has a `type` that determines its layout and a `data` JSON object containing its content fields. Editors can add, reorder, hide, or delete sections from any page.

---

## Supabase Schema

```sql
-- Global nav and footer (single-row config tables)
create table nav (
  id uuid primary key default gen_random_uuid(),
  links jsonb not null default '[]',  -- [{label, url, is_cta}]
  updated_at timestamptz default now()
);

create table footer (
  id uuid primary key default gen_random_uuid(),
  tagline text,
  cta_headline text,
  cta_body text,
  cta_label text,
  cta_url text,
  contact jsonb,  -- {email, phone, address}
  links jsonb,    -- [{label, url}]
  updated_at timestamptz default now()
);

-- Pages
create table pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,          -- e.g. 'home', 'product', 'about'
  title text not null,
  meta_description text,
  og_image text,                      -- Supabase Storage URL
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sections (the core of the CMS)
create table sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id) on delete cascade,
  type text not null,                 -- see Section Types below
  order_index integer not null,
  visible boolean default true,
  data jsonb not null default '{}',   -- fields vary by type (see below)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Blog posts
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,                       -- rich text (stored as HTML string)
  hero_image text,                    -- Supabase Storage URL
  author text,
  tags text[],
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Images are stored in **Supabase Storage** (public bucket named `dpw-media`). The admin UI handles upload; the stored URL goes into the relevant `data` field.

---

## Section Types

Each section has a `type` string and a `data` object. Below is every section type, its fields, and which pages it currently appears on.

---

### `hero`
Full-viewport hero with text left, image right (50/50 split). Used on: Product page.

```json
{
  "headline": "Verify My Income",
  "tagline": "The verification service layer between payroll data and state benefit systems",
  "body": "Supporting paragraph text...",
  "cta_primary_label": "Request a demo",
  "cta_primary_url": "/contact",
  "cta_secondary_label": "See how it works",
  "cta_secondary_url": "#how-it-works",
  "image": "https://...supabase.../hero-photo.jpg",
  "bg_color": "#FFFFFF",
  "text_color": "#1E272E"
}
```

---

### `hero_home`
Hero variant with narrower text column and tall image filling the right column. Used on: Home page.

```json
{
  "headline": "What if income verification worked for families...",
  "body": "Digital Public Works is the nonprofit alternative...",
  "cta_primary_label": "Request a demo",
  "cta_primary_url": "/contact",
  "cta_secondary_label": "See how it works",
  "cta_secondary_url": "#how-vmi-works",
  "note_text": "No procurement required to begin the conversation...",
  "image": "https://...supabase.../hero-home.jpg",
  "bg_color": "#FFFFFF"
}
```

---

### `stat_row`
Horizontal row of 2–4 statistics with a copper accent bar above each. Used on: Home page.

```json
{
  "bg_color": "#F6F7F8",
  "stats": [
    { "number": "Under 5 min", "label": "Median time to verify income" },
    { "number": "85%", "label": "Of applicants report no difficulty" },
    { "number": "93%", "label": "Of caseworkers prefer VMI reports" },
    { "number": "7.5×", "label": "Faster than manual verification" }
  ]
}
```

---

### `two_column`
Flexible two-column layout: text on one side, image on the other. Covers the Pressure section, Model section, and Accessibility section. Used on: Home, Product.

```json
{
  "layout": "image_left",
  "headline": "The pressure is real",
  "body": "<p>Paragraph one...</p><p>Paragraph two...</p>",
  "pull_quote": "Real families are waiting while the backlog grows.",
  "cta_label": "",
  "cta_url": "",
  "image": "https://...supabase.../pressure.jpg",
  "stat_number": "",
  "stat_label": "",
  "bg_color": "#F6F7F8",
  "text_color": "#1E272E"
}
```

`layout` options: `"image_left"` | `"image_right"` | `"text_only"`

`pull_quote`, `stat_number`, `stat_label`, `cta_label/url` are optional — leave empty to hide.

---

### `comparison_table`
Table comparing Traditional Approaches vs. VMI across multiple dimensions. Used on: Home (teaser version), Product (full version).

```json
{
  "headline": "At a glance: how VMI compares",
  "show_cta": true,
  "cta_label": "See the full comparison",
  "cta_url": "/compare",
  "col_a_label": "Traditional Approaches",
  "col_b_label": "VMI — Digital Public Works",
  "bg_color": "#FFFFFF",
  "rows": [
    {
      "dimension": "Pricing",
      "col_a": "Per-query, rising over time",
      "col_b": "Nonprofit, at-cost. Price falls as more states join.",
      "col_b_positive": true
    },
    {
      "dimension": "Data ownership",
      "col_a": "Vendor retains query history",
      "col_b": "State owns all data. No vendor retention.",
      "col_b_positive": true
    }
  ]
}
```

---

### `accordion`
Expandable FAQ or vendor question list. Used on: Product page (Vendor Questions section).

```json
{
  "headline": "Questions your procurement team will ask",
  "bg_color": "#FFFFFF",
  "items": [
    {
      "question": "How does VMI handle data residency requirements?",
      "answer": "All data remains within state-controlled infrastructure..."
    }
  ]
}
```

---

### `steps`
Numbered vertical timeline with a connecting line. Used on: Home (How It Works), Product (Pilot Process).

```json
{
  "headline": "How VMI works",
  "intro": "Three steps, no new infrastructure required.",
  "show_diagram": true,
  "diagram_image": "https://...supabase.../flow-diagram.png",
  "bg_color": "#FFFFFF",
  "steps": [
    {
      "number": "1",
      "title": "State agency initiates a verification request",
      "body": "A caseworker enters the applicant's consent token..."
    }
  ]
}
```

---

### `card_grid`
Grid of 2 or 3 content cards. Used on: Home (Research Findings / Stories section), Product (In The Field).

```json
{
  "headline": "What we found in the field",
  "intro": "Three pilots. Real families. Measurable outcomes.",
  "columns": 3,
  "bg_color": "#F6F7F8",
  "outro": "These findings informed the VMI design from day one.",
  "cards": [
    {
      "tag": "Finding 01",
      "headline": "Families abandon paper-based processes",
      "body": "In all three pilots, drop-off rates exceeded 60%...",
      "image": ""
    }
  ]
}
```

For cards with images (case study cards), add `"image": "https://..."` to each card object.

---

### `quotes`
One featured quote + up to 2 smaller quotes. Used on: Home page.

```json
{
  "bg_color": "#F6F7F8",
  "featured": {
    "text": "VMI cut our verification backlog in half within 90 days.",
    "attribution": "BENEFITS DIRECTOR, STATE AGENCY"
  },
  "secondary": [
    {
      "text": "Families told us it felt like the system finally worked for them.",
      "attribution": "PROGRAM ADMINISTRATOR"
    },
    {
      "text": "We went from weeks to minutes.",
      "attribution": "CASEWORKER, PILOT STATE"
    }
  ]
}
```

---

### `logo_row`
Two-row logos band: "Trusted by" (state agency partners) and "Backed by" (funders). Each logo can be an image (uploaded to Supabase Storage) or fall back to a styled text badge. Pending logos show as dashed placeholder boxes. Used on: Home page (hidden at launch).

```json
{
  "bg_color": "#FFFFFF",
  "partner_row": {
    "label": "Trusted by",
    "logos": [
      {
        "name": "PA DHS",
        "image": "",
        "url": "",
        "status": "pending"
      },
      {
        "name": "AZ DES",
        "image": "",
        "url": "",
        "status": "pending"
      }
    ]
  },
  "funder_row": {
    "label": "Backed by",
    "logos": [
      {
        "name": "DRK Foundation",
        "image": "",
        "url": "https://www.drkfoundation.org",
        "status": "confirmed"
      },
      {
        "name": "AARP Foundation",
        "image": "",
        "url": "https://www.aarp.org/aarp-foundation/",
        "status": "confirmed"
      },
      {
        "name": "Families and Workers Fund",
        "image": "",
        "url": "https://familiesandworkers.org",
        "status": "confirmed"
      },
      {
        "name": "Pritzker Children's Initiative",
        "image": "",
        "url": "https://www.pritzkerchildrensinitiative.org",
        "status": "confirmed"
      },
      {
        "name": "Samvid Ventures",
        "image": "",
        "url": "",
        "status": "pending"
      },
      {
        "name": "Vanguard Charitable",
        "image": "",
        "url": "",
        "status": "pending"
      },
      {
        "name": "Next Ladder Ventures",
        "image": "",
        "url": "",
        "status": "pending"
      },
      {
        "name": "Kellogg Foundation",
        "image": "",
        "url": "",
        "status": "pending"
      },
      {
        "name": "Google.org",
        "image": "",
        "url": "",
        "status": "pending"
      }
    ]
  }
}
```

**Admin UI behavior:** Logos with `status: "confirmed"` and an `image` URL render as grayscale images (full color on hover). Logos with an image URL but no status render the same way. Logos with `status: "pending"` or no image render as dashed placeholder boxes. In the admin, editors can upload a logo image and toggle status — no code change needed to activate a logo.

---

### `cta_banner`
Full-width call-to-action band. Used on: Home (copper CTA section), as footer CTA on Product.

```json
{
  "headline": "Ready to end the backlog?",
  "body": "Start with a free, philanthropically funded pilot. No procurement required.",
  "cta_label": "Request a demo",
  "cta_url": "/contact",
  "bg_color": "#C77234",
  "text_color": "#1E272E"
}
```

---

### `rich_text`
Simple full-width text section. For standalone copy blocks, policy text, etc.

```json
{
  "headline": "Our approach",
  "body": "<p>Paragraph...</p>",
  "bg_color": "#FFFFFF",
  "text_color": "#1E272E",
  "max_width": "narrow"
}
```

`max_width` options: `"narrow"` (68ch) | `"wide"` (full section-inner)

---

### `blog_grid`
Displays the most recent N blog posts as cards. Used on: Blog index, optionally on Home.

```json
{
  "headline": "From the field",
  "show_count": 3,
  "show_cta": true,
  "cta_label": "View all posts",
  "cta_url": "/blog",
  "bg_color": "#FFFFFF"
}
```

Content is pulled dynamically from the `blog_posts` table — no manual entry in this section's `data`.

---

### `io_grid`
Input/output grid showing data sources VMI connects to. Used on: Product page.

```json
{
  "headline": "What VMI connects",
  "bg_color": "#FFFFFF",
  "inputs": [
    { "label": "State payroll systems", "icon": "database" }
  ],
  "outputs": [
    { "label": "Caseworker dashboard", "icon": "monitor" }
  ]
}
```

---

## Admin UI — Page Structure

### Public pages the admin manages

| Page slug | Description |
|-----------|-------------|
| `home` | Main landing page |
| `product` | Verify My Income product page |
| `impact` | Impact / outcomes page |
| `insights` | Blog index |
| `about` | About DPW |
| `careers` | Careers |
| `contact` | Contact / demo request |

### Admin routes

```
/admin                          → dashboard (list of pages + recent posts)
/admin/login                    → email + password (Supabase Auth)
/admin/pages                    → list all pages
/admin/pages/[slug]             → section editor for that page
/admin/blog                     → list of blog posts
/admin/blog/new                 → new post editor
/admin/blog/[id]                → edit existing post
/admin/global                   → edit nav links and footer content
/admin/media                    → browse/upload images
```

### Section editor — what the client sees

On `/admin/pages/[slug]`, the editor shows a vertical list of sections in order. For each section:

- **Drag handle** to reorder
- **Eye icon** to toggle visibility (hide without deleting)
- **Edit button** opens a panel with fields specific to that section type
- **Delete button** (with confirmation)
- **+ Add section** button at the bottom opens a picker: client chooses a section type from a visual grid of named tiles (e.g. "Two columns with image", "Stats row", "Quote block")

Inside the edit panel, all fields are clearly labeled plain-English inputs:

- Text → `<input>` or `<textarea>`
- Long text / body copy → simple rich text editor (bold, italic, links, paragraph breaks only — no heading pickers, no font size, no color picker inside body text)
- Color fields (bg_color, text_color) → color picker constrained to **DPW brand palette** as swatches, with an optional "custom hex" escape hatch
- Images → upload button → goes to Supabase Storage → URL auto-fills the field
- Arrays (stats, steps, cards, rows) → add/remove/reorder items within the panel

### Color palette swatches available to admin

```
Forge       #1E272E   (primary dark)
Copper      #C77234   (brand accent)
Deep Copper #9F5528
Steel       #3A4E5C
Cool White  #F6F7F8   (light section bg)
White       #FFFFFF
Verdigris   #56A374   (green accent)
Rose Gold   #DEB0A0   (warm accent)
```

---

## File / Asset Conventions

- All images uploaded via admin go to Supabase Storage bucket: `dpw-media`
- Folder structure: `dpw-media/pages/[slug]/` for page images, `dpw-media/blog/[post-id]/` for blog images
- Image URLs stored as full public URLs in the `data` JSON field

---

## Shared CSS

The public site uses a shared stylesheet (`shared.css`) already built. It contains all design tokens (CSS custom properties), nav, footer, buttons, comparison table, steps component, and section infrastructure. Page-specific styles live in each page's own stylesheet. When converting to Next.js, `shared.css` becomes a global stylesheet imported in `_app.tsx` or `layout.tsx`.

Design token reference:
```css
--forge: #1E272E;
--copper: #C77234;
--deep-copper: #9F5528;
--steel: #3A4E5C;
--verdigris: #56A374;
--aluminum: #A9B0B6;
--light-al: #D0D5D8;
--white: #FFFFFF;
--cool-white: #F6F7F8;
--rose-gold: #DEB0A0;
--pale-verdigris: #EBF5F0;

--t-display: clamp(44px, 5.5vw, 68px);
--t-headline: clamp(28px, 3.5vw, 44px);
--t-subhead: clamp(18px, 2.2vw, 24px);
--t-body: 17px;
--t-small: 15px;
--t-label: 14px;
--t-button: 14px;
```

---

## Placeholder Sections (Not Live at Launch)

Some sections are planned but not ready at launch. Add them to the page's section list with `visible: false` so editors can activate them later without a developer.

| Page | Section type | Notes |
|------|-------------|-------|
| Home | `logo_row` | Partner + funder logos — pending logo permissions from PA DHS, AZ DES. Funder logos (DRK Foundation, AARP Foundation, Families and Workers Fund, Pritzker Children's Initiative) confirmed. Samvid Ventures, Vanguard Charitable, Next Ladder Ventures, Kellogg Foundation, Google.org pending contract/confirmation. |
| Product | `rich_text` | Accessibility research findings — Michael writing |
| Product | `two_column` or `rich_text` | Compliance & Security — Patricia to provide content (GovRamp status, data handling, consent framework, encryption standards) |

When the client is ready to activate, they flip the section to visible in the admin and fill in the content fields. No code change required.

---

## Notes for Claude Code

1. **Start with the Supabase schema** — run the SQL above, create the `dpw-media` storage bucket (public), enable Row Level Security with a policy that allows authenticated users (admins) to write and everyone to read.

2. **Seed the database** with the existing page content from the HTML files. Each HTML section maps to a row in the `sections` table with the appropriate `type` and `data`.

3. **Build the public site** as a Next.js app using `getServerSideProps` or `generateStaticParams` + `revalidate`. Each page fetches its sections in order, renders the matching React component per `type`, and passes `data` as props.

4. **Build the admin site** as a separate Next.js project on Vercel, protected by Supabase Auth. Use `@supabase/auth-helpers-nextjs` for session handling.

5. **The section editor** is the most important admin UI. Build it as a reusable pattern: a list of section rows, a slide-out panel with a form per section type, and a section-type picker modal. The form fields for each type are defined in this document.

6. **Fonts**: Space Grotesk (weights 300, 700) and Atkinson Hyperlegible (400 regular, 400 italic, 700 bold) — load from Google Fonts.

7. **The existing HTML files** (home-FINAL.html, product-FINAL.html, etc.) are the source of truth for visual design. Match them exactly. Do not redesign — convert.
