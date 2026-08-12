-- DPW website schema: pages/sections (block-based CMS for the 6 static routes),
-- blog_posts/blog_blocks (Insights), media (Supabase Storage metadata),
-- and deleted_pages (soft-delete + 30-day purge, replacing the admin mockup's
-- localStorage-based version).
--
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query),
-- or via `supabase db push` if you have the CLI + DB password configured locally.

create extension if not exists pgcrypto;

-- ─── updated_at helper ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─── PAGES ──────────────────────────────────────────────────────────
create table pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger pages_set_updated_at
  before update on pages
  for each row execute function set_updated_at();

-- ─── SECTIONS (blocks within a page) ───────────────────────────────
-- content shape depends on type — mirrors the fields in
-- ADMIN PAGES/admin-page-editor.html's PAGES seed data exactly:
--   hero:           { headline, subtitle, text, footnote, photo_url, photo_alt,
--                      button_primary: {text, link} | null, button_secondary: {text, link} | null }
--   stats:          { heading?, stats: [{ number, label }] }              (always 4 entries)
--   photo-text:     { side: 'left' | 'right', heading, text, pullquote?, photo_url, photo_alt }
--   steps:          { steps: [{ heading, description, photo_url?, photo_alt? }] }
--   voices:         { heading, quotes: [{ quote, name, role }] }
--   partners:       { heading, partners: [{ name, logo_url, visible }] }
--   cta:            { heading, button_text, link, background_photo_url }
--   team-member:    { members: [{ name, title, text, photo_url }] }
--   text:           { heading?, text }
--   content-cards:  { cards: [{ heading, text, photo_url? }] }
--   comparison:     { heading, column_a_title, column_b_title, rows: [{ heading, text }] }
--   case-study:     { cards: [{ heading, text, photo_url, link }] }
create table sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages(id) on delete cascade,
  type text not null check (type in (
    'hero', 'stats', 'photo-text', 'steps', 'voices', 'partners',
    'cta', 'team-member', 'text', 'content-cards', 'comparison', 'case-study'
  )),
  position integer not null default 0,
  name text not null default '',
  background_color text,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sections_page_id_position_idx on sections (page_id, position);

create trigger sections_set_updated_at
  before update on sections
  for each row execute function set_updated_at();

-- ─── BLOG POSTS (Insights) ──────────────────────────────────────────
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  featured_image_url text,
  featured_image_alt text,
  featured_image_caption text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_status_published_at_idx on blog_posts (status, published_at desc);
create index blog_posts_category_idx on blog_posts (category);

create trigger blog_posts_set_updated_at
  before update on blog_posts
  for each row execute function set_updated_at();

-- ─── BLOG BLOCKS (body content of a post) ──────────────────────────
-- content shape depends on type — mirrors admin-blog-editor.html's block types:
--   heading:   { text }
--   paragraph: { text }
--   quote:     { text }
--   photo:     { url, alt, caption? }
create table blog_blocks (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references blog_posts(id) on delete cascade,
  type text not null check (type in ('heading', 'paragraph', 'quote', 'photo')),
  position integer not null default 0,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_blocks_post_id_position_idx on blog_blocks (post_id, position);

create trigger blog_blocks_set_updated_at
  before update on blog_blocks
  for each row execute function set_updated_at();

-- ─── MEDIA (Supabase Storage upload metadata, for the media library) ─
create table media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  url text not null,
  alt_text text,
  width integer,
  height integer,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

-- ─── DELETED PAGES (soft-delete + 30-day purge) ────────────────────
-- Replaces the admin mockup's localStorage-based dpwDeletedPages array.
-- A scheduled job (pg_cron or a Supabase Edge Function on a cron trigger)
-- should hard-delete rows where purge_at < now() and restored = false.
create table deleted_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  snapshot jsonb not null,
  deleted_at timestamptz not null default now(),
  purge_at timestamptz not null default (now() + interval '30 days'),
  restored boolean not null default false
);

create index deleted_pages_purge_at_idx on deleted_pages (purge_at) where not restored;

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────
alter table pages enable row level security;
alter table sections enable row level security;
alter table blog_posts enable row level security;
alter table blog_blocks enable row level security;
alter table media enable row level security;
alter table deleted_pages enable row level security;

-- Public (anon) read access: published pages/posts only.
create policy "public read published pages"
  on pages for select
  to anon
  using (status = 'published');

create policy "public read sections of published pages"
  on sections for select
  to anon
  using (exists (
    select 1 from pages where pages.id = sections.page_id and pages.status = 'published'
  ));

create policy "public read published blog posts"
  on blog_posts for select
  to anon
  using (status = 'published');

create policy "public read blocks of published blog posts"
  on blog_blocks for select
  to anon
  using (exists (
    select 1 from blog_posts where blog_posts.id = blog_blocks.post_id and blog_posts.status = 'published'
  ));

create policy "public read media"
  on media for select
  to anon
  using (true);

-- Authenticated (admin) full access to everything, including drafts.
create policy "admin full access pages"
  on pages for all
  to authenticated
  using (true) with check (true);

create policy "admin full access sections"
  on sections for all
  to authenticated
  using (true) with check (true);

create policy "admin full access blog_posts"
  on blog_posts for all
  to authenticated
  using (true) with check (true);

create policy "admin full access blog_blocks"
  on blog_blocks for all
  to authenticated
  using (true) with check (true);

create policy "admin full access media"
  on media for all
  to authenticated
  using (true) with check (true);

create policy "admin full access deleted_pages"
  on deleted_pages for all
  to authenticated
  using (true) with check (true);

-- ─── STORAGE (media bucket) ─────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media bucket"
  on storage.objects for select
  to anon
  using (bucket_id = 'media');

create policy "admin write media bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "admin update media bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

create policy "admin delete media bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');

-- ─── SEED: the 6 static routes as published pages ──────────────────
insert into pages (slug, title, status) values
  ('home', 'Home', 'published'),
  ('about', 'About', 'published'),
  ('product', 'Product', 'published'),
  ('impact', 'Impact', 'published'),
  ('careers', 'Careers', 'published'),
  ('contact', 'Contact', 'published')
on conflict (slug) do nothing;
